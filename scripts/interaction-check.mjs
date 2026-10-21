// scripts/interaction-check.mjs
//
// 真实浏览器交互验证（headless Chrome + CDP）：在构建产物上真点、真判，而不是只看页面渲染。
//
// 覆盖：
//   1. 安静书：多选收集 / 点错摇一摇 / 整页完成 + 得星 / 「谁不见了」记忆阶段
//   2. 今日小挑战：答题 → 纠正 → 结算 → 再玩一次全对 → 闯关成功 + 得星
//   3. 数学练习：数一数/加减法 → 答对反馈 → 换一题 → 答错反馈
//   4. 儿童歌谣：连唱逐句推进 / 下一句 / 想一想展开收起 / 关闭弹层
//   5. 语音接力 / 故事配图与学情条 / 数学 10-20 与筛选 / 路由回顶部 / 弹层焦点循环
//   6. PWA：离线冷启动 + 离线懒加载栏目
//
// 用法（先 npm run build）：
//   npm run check:interactions
import { spawn, spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PREVIEW_PORT = 4600 + Math.floor(Math.random() * 400)
const CDP_PORT = 9100 + Math.floor(Math.random() * 300)
const HOST = '127.0.0.1'
const BASE = `http://${HOST}:${PREVIEW_PORT}/`

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function findChrome() {
  return [
    process.env.CHROME,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  ]
    .filter(Boolean)
    .find((p) => existsSync(p))
}

function killTree(child) {
  if (!child?.pid) return
  if (process.platform === 'win32') {
    try {
      spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' })
    } catch {}
  } else {
    child.kill()
  }
}

async function main() {
  if (!existsSync(path.join(ROOT, 'dist', 'index.html'))) {
    throw new Error('dist/index.html 不存在,请先 npm run build')
  }
  const chromePath = findChrome()
  if (!chromePath) throw new Error('找不到 Chrome/Edge')

  const viteBin = path.join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js')
  const preview = spawn(
    process.execPath,
    [viteBin, 'preview', '--port', String(PREVIEW_PORT), '--host', HOST, '--strictPort'],
    { stdio: 'ignore' }
  )

  let previewOk = false
  for (let i = 0; i < 40; i++) {
    await sleep(250)
    try {
      if ((await fetch(BASE)).ok) {
        previewOk = true
        break
      }
    } catch {}
  }
  if (!previewOk) {
    killTree(preview)
    throw new Error('vite preview 未就绪')
  }

  const profile = mkdtempSync(path.join(tmpdir(), 'kids-edu-check-'))
  const chrome = spawn(
    chromePath,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--mute-audio',
      '--autoplay-policy=no-user-gesture-required',
      `--remote-debugging-port=${CDP_PORT}`,
      `--user-data-dir=${profile}`,
      BASE,
    ],
    { stdio: 'ignore' }
  )

  try {
    let page = null
    for (let i = 0; i < 40; i++) {
      await sleep(250)
      try {
        const targets = await (await fetch(`http://${HOST}:${CDP_PORT}/json`)).json()
        page = targets.find((t) => t.type === 'page')
        if (page) break
      } catch {}
    }
    if (!page) throw new Error('无法连接 CDP')

    const ws = new WebSocket(page.webSocketDebuggerUrl)
    let msgId = 0
    const pending = new Map()
    const consoleErrors = []

    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data)
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id)
        pending.delete(msg.id)
        msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result)
      } else if (msg.method === 'Runtime.exceptionThrown') {
        consoleErrors.push(msg.params.exceptionDetails?.text || 'exception')
      } else if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
        consoleErrors.push(msg.params.args.map((a) => a.value ?? a.description ?? '').join(' '))
      } else if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
        consoleErrors.push(msg.params.entry.text)
      }
    }
    await new Promise((res, rej) => {
      ws.onopen = res
      ws.onerror = rej
    })

    const send = (method, params = {}) =>
      new Promise((resolve, reject) => {
        const id = ++msgId
        pending.set(id, { resolve, reject })
        ws.send(JSON.stringify({ id, method, params }))
      })

    const evaluate = async (expression) => {
      const r = await send('Runtime.evaluate', {
        expression,
        awaitPromise: true,
        returnByValue: true,
      })
      if (r?.exceptionDetails) throw new Error(r.exceptionDetails.text || '页面脚本异常')
      return r?.result?.value
    }

    const waitFor = async (expression, timeout = 8000, label = expression) => {
      const deadline = Date.now() + timeout
      while (Date.now() < deadline) {
        if (await evaluate(`!!(${expression})`)) return
        await sleep(150)
      }
      throw new Error(`等待超时: ${label}`)
    }

    const go = async (route) => {
      await send('Page.navigate', { url: `${BASE}#/${route}` })
      await sleep(500)
    }

    const clickAt = async (selector, index = 0) => {
      const ok = await evaluate(`(() => {
        const el = document.querySelectorAll(${JSON.stringify(selector)})[${index}]
        if (!el) return false
        el.click()
        return true
      })()`)
      if (!ok) throw new Error(`找不到可点击元素 ${selector}[${index}]`)
    }

    const clickText = async (selector, text) => {
      const ok = await evaluate(`(() => {
        const el = [...document.querySelectorAll(${JSON.stringify(selector)})]
          .find((e) => e.textContent.includes(${JSON.stringify(text)}))
        if (!el) return false
        el.click()
        return true
      })()`)
      if (!ok) throw new Error(`找不到文案为「${text}」的 ${selector}`)
    }

    const textOf = (selector) =>
      evaluate(`document.querySelector(${JSON.stringify(selector)})?.textContent?.trim() ?? ''`)
    const countOf = (selector) =>
      evaluate(`document.querySelectorAll(${JSON.stringify(selector)}).length`)
    const waitAskChange = async (oldAsk, timeout = 6000) => {
      await waitFor(
        `(() => {
          const el = document.querySelector('.qb-ask')
          return el && el.textContent.trim() !== ${JSON.stringify(oldAsk)}
        })()`,
        timeout,
        '进入下一回合'
      )
    }

    const results = []
    const step = async (name, fn) => {
      try {
        await fn()
        console.log(`✓ ${name}`)
        results.push({ name, ok: true })
      } catch (e) {
        console.error(`✗ ${name}: ${e.message}`)
        results.push({ name, ok: false, reason: e.message })
      }
    }

    await send('Runtime.enable')
    await send('Log.enable')
    await send('Page.enable')

    /* ================= 1. 安静书 ================= */
    await step('安静书：打开即玩 + 多选收集', async () => {
      await go('quietbook')
      await waitFor(`document.querySelector('.qb-opt')`, 8000, '安静书选项')
      const title = await textOf('.qb-pagetitle')
      if (!title.includes('穿衣小帮手')) throw new Error(`当前页不是第 1 页: ${title}`)
    })

    await step('安静书：点错摇一摇（不扣进度）', async () => {
      // 第 1 轮答案 [0,1,2]；先点第 4 个（短袖，错的）
      await clickAt('.qb-opt', 3)
      await waitFor(`document.querySelector('.qb-opt.qb-wrong')`, 2000, '点错样式')
      await sleep(700)
      if (await evaluate(`!!document.querySelector('.qb-opt.qb-wrong')`)) {
        throw new Error('点错样式 520ms 后仍未复位')
      }
      if ((await countOf('.qb-tray-item')) !== 0) throw new Error('点错却进了小篮子')
    })

    await step('安静书：第 1 页三回合 → 完成庆祝 + 得星', async () => {
      const answer = [0, 1, 2]
      // 第 1 回合
      for (const i of answer) {
        await clickAt('.qb-opt', i)
        await sleep(160)
      }
      await waitFor(`document.querySelector('.qb-ask')?.textContent.includes('太阳大大的')`, 5000, '进入第 2 回合')
      // 第 2 回合（此时错误样式已复位）
      for (const i of answer) {
        await clickAt('.qb-opt', i)
        await sleep(160)
      }
      await waitFor(`document.querySelector('.qb-ask')?.textContent.includes('下雨啦')`, 5000, '进入第 3 回合')
      // 第 3 回合
      for (const i of answer) {
        await clickAt('.qb-opt', i)
        await sleep(160)
      }
      await waitFor(`document.querySelector('.qb-done')`, 6000, '完成庆祝屏')
      const doneText = await textOf('.qb-done-title')
      if (!doneText.includes('第 一 页完成啦')) throw new Error(`完成文案异常: ${doneText}`)
      const progressText = await textOf('.qb-progress-num')
      if (!progressText.includes('完成 1/9 页')) throw new Error(`进度未更新: ${progressText}`)
      const prog = await evaluate(`JSON.parse(localStorage.getItem('kids-edu-progress') || '{}')`)
      if (!(prog.learned ?? []).includes('quietbook:dress')) throw new Error('未写入 quietbook:dress')
      if (!(prog.stars >= 1)) throw new Error('未获得星星')
    })

    await step('安静书：谁不见了 → 记忆阶段 3 秒后才出选项', async () => {
      await clickText('.qb-chip', '谁不见了')
      await waitFor(`document.querySelector('.qb-memory')`, 5000, '记忆阶段提示')
      if ((await countOf('.qb-opt')) !== 0) throw new Error('记忆阶段不应显示选项')
      await waitFor(`document.querySelectorAll('.qb-opt').length > 0`, 6000, '记忆阶段结束')
      let found = false
      const optionCount = await countOf('.qb-opt')
      for (let i = 0; i < optionCount; i++) {
        await clickAt('.qb-opt', i)
        await sleep(650)
        if (await evaluate(`!!document.querySelector('.qb-opt.qb-correct')`)) {
          found = true
          break
        }
      }
      if (!found) throw new Error('逐个尝试后仍未点中躲起来的小伙伴')
    })

    await step('安静书：影子配对 → 答对高亮', async () => {
      await clickText('.qb-chip', '影子找朋友')
      await waitFor(
        `document.querySelector('.qb-pagetitle')?.textContent.includes('影子找朋友')`,
        5000,
        '切换到影子页'
      )
      await waitFor(`document.querySelector('.qb-opt')`, 5000, '影子页选项')
      const optionCount = await countOf('.qb-opt')
      let found = false
      for (let i = 0; i < optionCount; i++) {
        await clickAt('.qb-opt', i)
        await sleep(650)
        if (await evaluate(`!!document.querySelector('.qb-opt.qb-correct')`)) {
          found = true
          break
        }
      }
      if (!found) throw new Error('影子配对答对后没有绿色高亮')
    })

    await step('安静书：颜色点点 → 点错复位 → 5 回合完成', async () => {
      await clickText('.qb-chip', '颜色点点')
      await waitFor(
        `document.querySelector('.qb-pagetitle')?.textContent.includes('颜色点点')`,
        5000,
        '切换到颜色页'
      )
      await waitFor(`document.querySelector('.qb-opt')`, 5000, '颜色页选项')
      if ((await countOf('.qb-opt .qb-dot')) !== 5) throw new Error('颜色小球没有渲染成色块')

      // 先点错：第 2 个是黄色，题目问红色
      await clickAt('.qb-opt', 1)
      await waitFor(`document.querySelector('.qb-opt.qb-wrong')`, 2000, '点错样式')
      await sleep(700)
      if (await evaluate(`!!document.querySelector('.qb-opt.qb-wrong')`)) {
        throw new Error('点错样式未复位')
      }

      let ask = await textOf('.qb-ask')
      await clickAt('.qb-opt', 0) // 每回合正确答案都在 0
      for (let r = 1; r < 5; r++) {
        await waitAskChange(ask)
        if (await evaluate(`!!document.querySelector('.qb-done')`)) {
          throw new Error(`第 ${r} 回合就提前完成了`)
        }
        ask = await textOf('.qb-ask')
        await waitFor(
          `[...document.querySelectorAll('.qb-opt')].every((el) => !el.disabled)`,
          5000,
          `第 ${r + 1} 回合可作答`
        )
        await clickAt('.qb-opt', 0)
      }
      await waitFor(`document.querySelector('.qb-done')`, 6000, '颜色页完成屏')
      const doneText = await textOf('.qb-done-title')
      if (!doneText.includes('第 二 页完成啦')) throw new Error(`完成文案异常: ${doneText}`)
      const prog = await evaluate(`JSON.parse(localStorage.getItem('kids-edu-progress') || '{}')`)
      if (!(prog.learned ?? []).includes('quietbook:colors')) throw new Error('未写入 quietbook:colors')
    })

    await step('安静书：找不同 → 对照上排找出全部差异 → 3 回合完成', async () => {
      await clickText('.qb-chip', '找不同')
      await waitFor(
        `document.querySelector('.qb-pagetitle')?.textContent.includes('找不同')`,
        5000,
        '切换到找不同页'
      )
      for (let round = 0; round < 3; round++) {
        await waitFor(`document.querySelector('.qb-ref')`, 5000, '对照栏')
        await waitFor(`document.querySelector('.qb-opt')`, 5000, '找不同选项')
        const diffs = await evaluate(`(() => {
          const refs = [...document.querySelectorAll('.qb-ref .qb-ref-cell')].map((e) => e.textContent.trim())
          const opts = [...document.querySelectorAll('.qb-opt')].map((e) => e.textContent.trim())
          return opts.map((t, i) => (t !== refs[i] ? i : -1)).filter((i) => i >= 0)
        })()`)
        if (diffs.length !== 2) throw new Error(`第 ${round + 1} 回合差异数异常: ${diffs.length}`)
        for (const i of diffs) {
          await clickAt('.qb-opt', i)
          await sleep(220)
        }
        if ((await countOf('.qb-opt.qb-picked')) !== 2) throw new Error('差异项没有全部收下')
        if (round < 2) {
          const ask = await textOf('.qb-ask')
          await waitAskChange(ask)
        }
      }
      await waitFor(`document.querySelector('.qb-done')`, 6000, '找不同完成屏')
      const doneText = await textOf('.qb-done-title')
      if (!doneText.includes('第 七 页完成啦')) throw new Error(`完成文案异常: ${doneText}`)
      const prog = await evaluate(`JSON.parse(localStorage.getItem('kids-edu-progress') || '{}')`)
      if (!(prog.learned ?? []).includes('quietbook:spot')) throw new Error('未写入 quietbook:spot')
    })

    /* ================= 2. 今日小挑战 ================= */
    await step('今日小挑战：5 题作答 → 纠正 → 结算', async () => {
      await go('encyclopedia')
      await waitFor(`document.querySelector('.challenge-banner')`, 8000, '挑战入口')
      await clickAt('.challenge-banner', 0)
      await waitFor(`document.querySelector('.cq-opt')`, 5000, '闯关弹层')

      const correctIdx = []
      for (let q = 0; q < 5; q++) {
        await waitFor(
          `[...document.querySelectorAll('.cq-opt')].some((el) => !el.disabled)`,
          5000,
          `第 ${q + 1} 题可作答`
        )
        // 先点第 1 项；错了会在 900ms 后揭示正确项
        await clickAt('.cq-opt', 0)
        await sleep(1100)
        const idx = await evaluate(
          `[...document.querySelectorAll('.cq-opt')].findIndex((el) => el.classList.contains('cq-opt-correct'))`
        )
        if (idx < 0) throw new Error(`第 ${q + 1} 题未能识别正确项`)
        correctIdx.push(idx)
        if (q < 4) {
          await clickText('.cq-actions .btn', '下一题')
          await sleep(350)
        } else {
          await clickText('.cq-actions .btn', '看结果')
        }
      }
      await waitFor(`document.querySelector('.cq-result')`, 5000, '结算屏')
      const score = await textOf('.cq-result-msg')
      if (!/答对了 \d \/ 5 题/.test(score)) throw new Error(`结算文案异常: ${score}`)

      // 再玩一次：题目顺序不变，按记录的正确项答完
      await clickText('.cq-result-actions .btn', '再玩一次')
      await waitFor(`document.querySelector('.cq-opt')`, 5000, '重开后第一题')
      for (let q = 0; q < 5; q++) {
        await waitFor(
          `[...document.querySelectorAll('.cq-opt')].some((el) => !el.disabled)`,
          5000,
          `重开第 ${q + 1} 题可作答`
        )
        await clickAt('.cq-opt', correctIdx[q])
        await sleep(300)
        if (q < 4) {
          await clickText('.cq-actions .btn', '下一题')
          await sleep(300)
        } else {
          await clickText('.cq-actions .btn', '看结果')
        }
      }
      await waitFor(`document.querySelector('.cq-result-title')`, 5000, '重开结算屏')
      const title = await textOf('.cq-result-title')
      if (!title.includes('闯关成功')) throw new Error(`全对仍未通关: ${title}`)
      const prog = await evaluate(`JSON.parse(localStorage.getItem('kids-edu-progress') || '{}')`)
      const awarded = prog.quizAwarded ?? []
      if (!awarded.some((k) => k.startsWith('encyclopedia:'))) {
        throw new Error('未写入 encyclopedia 当日闯关记录')
      }
      await clickText('.cq-result-actions .btn', '完成')
      await waitFor(`!document.querySelector('.cq-result')`, 3000, '关闭闯关弹层')
    })

    /* ================= 3. 数学练习 ================= */
    await step('数学练习：答对 → 反馈 → 换一题', async () => {
      await go('math')
      await waitFor(`document.querySelector('.quiz-opt')`, 8000, '数学练习面板')

      const readAnswer = async () => {
        const math = await textOf('.quiz-math')
        if (math) {
          const m = math.match(/(\d+)\s*([+-])\s*(\d+)/)
          if (!m) throw new Error(`无法解析题目: ${math}`)
          return m[2] === '+' ? Number(m[1]) + Number(m[3]) : Number(m[1]) - Number(m[3])
        }
        return countOf('.quiz-dots span')
      }
      const answer = await readAnswer()
      const labels = await evaluate(
        `[...document.querySelectorAll('.quiz-opt')].map((e) => e.textContent.trim())`
      )
      const idx = labels.findIndex((l) => Number(l) === answer)
      if (idx < 0) throw new Error(`选项里找不到正确答案 ${answer}: ${labels.join(',')}`)
      await clickAt('.quiz-opt', idx)
      await waitFor(`document.querySelector('.quiz-opt.correct')`, 3000, '答对样式')
      const fb = await textOf('.quiz-feedback')
      if (!fb) throw new Error('答对后没有反馈文案')
      if (await evaluate(`[...document.querySelectorAll('.quiz-opt')].some((el) => !el.disabled)`)) {
        throw new Error('作答后选项仍可点击')
      }

      await clickText('.quiz-actions .btn', '换一题')
      await sleep(300)
      await waitFor(
        `[...document.querySelectorAll('.quiz-opt')].every((el) => !el.disabled)`,
        3000,
        '换题后选项复位'
      )
      if (await evaluate(`!!document.querySelector('.quiz-opt.correct, .quiz-opt.wrong')`)) {
        throw new Error('换题后仍残留上一题的对错样式')
      }
    })

    await step('数学练习：答错 → 错误反馈', async () => {
      const math = await textOf('.quiz-math')
      let answer
      if (math) {
        const m = math.match(/(\d+)\s*([+-])\s*(\d+)/)
        answer = m[2] === '+' ? Number(m[1]) + Number(m[3]) : Number(m[1]) - Number(m[3])
      } else {
        answer = await countOf('.quiz-dots span')
      }
      const labels = await evaluate(
        `[...document.querySelectorAll('.quiz-opt')].map((e) => e.textContent.trim())`
      )
      const wrongIdx = labels.findIndex((l) => Number(l) !== answer)
      if (wrongIdx < 0) throw new Error('找不到错误选项')
      await clickAt('.quiz-opt', wrongIdx)
      await waitFor(`document.querySelector('.quiz-opt.wrong')`, 3000, '答错样式')
      const fb = await textOf('.quiz-feedback')
      if (!fb) throw new Error('答错后没有反馈文案')
    })

    /* ================= 4. 儿童歌谣 ================= */
    await step('儿童歌谣：连唱一遍逐句推进', async () => {
      await go('nursery')
      await waitFor(`document.querySelector('.big-card')`, 8000, '歌谣卡片')
      await clickAt('.big-card', 0)
      await waitFor(`document.querySelector('.rhyme-view')`, 5000, '歌谣弹层')
      const before = await textOf('.rhyme-line-num')
      await clickText('.rhyme-nav .btn', '连唱一遍')
      let advanced = false
      for (let i = 0; i < 40; i++) {
        await sleep(300)
        if ((await textOf('.rhyme-line-num')) !== before) {
          advanced = true
          break
        }
      }
      if (!advanced) throw new Error('连唱 12 秒仍未推进到下一句')
      const hasStop = await evaluate(
        `[...document.querySelectorAll('.rhyme-nav .btn')].some((b) => b.textContent.includes('停'))`
      )
      if (hasStop) await clickText('.rhyme-nav .btn', '停')
    })

    await step('儿童歌谣：下一句 / 想一想 / 关闭', async () => {
      // 连唱可能已经停在最后一句，先把「下一句」变成可点状态
      const nextDisabled = await evaluate(`(() => {
        const b = [...document.querySelectorAll('.rhyme-nav .btn')].find((e) => e.textContent.includes('下一句'))
        return !b || b.disabled
      })()`)
      if (nextDisabled) {
        await clickText('.rhyme-nav .btn', '上一句')
        await sleep(500)
      }
      const before = await textOf('.rhyme-line-num')
      await clickText('.rhyme-nav .btn', '下一句')
      await sleep(500)
      if ((await textOf('.rhyme-line-num')) === before) throw new Error('下一句没有推进')

      await clickText('.tip-toggle', '想一想')
      await waitFor(`document.querySelector('.rhyme-tip')`, 3000, '想一想内容')
      const tip = await textOf('.rhyme-tip')
      if (!tip) throw new Error('想一想内容为空')
      await clickText('.tip-toggle', '收起想一想')
      await sleep(400)
      if (await evaluate(`!!document.querySelector('.rhyme-tip')`)) {
        throw new Error('收起后想一想仍显示')
      }

      await clickAt('.detail-card .close-btn', 0)
      await waitFor(`!document.querySelector('.rhyme-view')`, 3000, '关闭歌谣弹层')
    })

    /* ================= 5. 长文本语音接力 ================= */
    await step('语音：长文本按句拆成多个 utterance 接力', async () => {
      await go('encyclopedia')
      await waitFor(`document.querySelector('.big-card')`, 8000, '百科卡片')
      await evaluate(`(() => {
        window.__speakCalls = 0
        const synth = window.speechSynthesis
        if (!synth.__patched) {
          const orig = synth.speak.bind(synth)
          synth.speak = (u) => { window.__speakCalls++; return orig(u) }
          synth.__patched = true
        }
        return true
      })()`)
      await clickText('.big-card', '太阳')
      await waitFor(`document.querySelector('.detail-text')`, 5000, '百科详情')
      await waitFor(`window.__speakCalls >= 2`, 10000, '第二个 utterance')
      const calls = await evaluate('window.__speakCalls')
      if (calls < 2) throw new Error(`只触发了 ${calls} 个 utterance`)
      await clickAt('.detail-card .close-btn', 0)
      await waitFor(`!document.querySelector('.detail-text')`, 3000, '关闭详情')
    })

    /* ================= 5.5 本轮优化回归 ================= */
    await step('故事：学情条 + 老牛配图', async () => {
      await go('stories')
      await waitFor(`document.querySelector('.big-card')`, 8000, '绘本卡片')
      if (!(await evaluate(`!!document.querySelector('.module-bar')`))) {
        throw new Error('绘本页缺少学情条')
      }
      await clickText('.big-card', '小马过河')
      await waitFor(`document.querySelector('.story-view')`, 5000, '绘本弹层')
      await clickText('.story-nav .btn', '下一页')
      await sleep(300)
      await clickText('.story-nav .btn', '下一页')
      await sleep(300)
      const emoji = await textOf('.story-emoji')
      if (!emoji.includes('🐮')) throw new Error(`第 3 页老牛配图异常: ${emoji}`)
      await clickAt('.detail-card .close-btn', 0)
      await waitFor(`!document.querySelector('.story-view')`, 3000, '关闭绘本')
    })

    await step('数学：10-20 内容 + 学情筛选', async () => {
      await go('math')
      await waitFor(`document.querySelector('.big-card')`, 8000, '数字卡片')
      if (!(await evaluate(`!!document.querySelector('.module-bar')`))) {
        throw new Error('数学页缺少学情条')
      }
      if (!(await evaluate(`document.body.innerText.includes('二十')`))) {
        throw new Error('页面没有「二十」')
      }
      const total = await countOf('.big-card')
      if (total !== 21) throw new Error(`数字卡片应为 21 张，实际 ${total}`)

      await clickText('.big-card', '二十')
      await waitFor(`document.querySelector('.num-big')`, 5000, '数字详情')
      if ((await textOf('.num-big')) !== '20') throw new Error('20 的详情数字不对')
      const dots = await countOf('.num-dots span')
      if (dots !== 20) throw new Error(`20 的圆点应为 20 个，实际 ${dots}`)
      await clickAt('.detail-card .close-btn', 0)
      await waitFor(`!document.querySelector('.num-big')`, 3000, '关闭数字详情')

      await clickAt('.chip-btn', 2) // 学过（注意不能用 clickText：会先命中「没学过」）
      await sleep(300)
      if ((await countOf('.big-card')) !== 1) throw new Error('「学过」筛选应只剩 1 张')
      await clickAt('.chip-btn', 1) // 没学过
      await sleep(300)
      if ((await countOf('.big-card')) !== 20) throw new Error('「没学过」筛选应为 20 张')
      await clickAt('.chip-btn', 0) // 全部
      await sleep(300)
      if ((await countOf('.big-card')) !== 21) throw new Error('「全部」筛选应恢复 21 张')
    })

    await step('路由：进入栏目回到顶部', async () => {
      await go('')
      await waitFor(`document.querySelector('.big-card')`, 8000, '首页')
      await evaluate(`window.scrollTo(0, document.body.scrollHeight)`)
      await sleep(300)
      if ((await evaluate('window.scrollY')) < 100) throw new Error('首页未成功滚动')
      await clickText('.big-card', '儿童歌谣')
      await waitFor(`location.hash.includes('/nursery')`, 5000, '进入歌谣栏目')
      await sleep(700)
      const y = await evaluate('window.scrollY')
      if (y > 50) throw new Error(`进入栏目后仍在滚动位置 ${y}`)
    })

    await step('弹层：Tab 焦点循环 + 背景 inert', async () => {
      await go('encyclopedia')
      await waitFor(`document.querySelector('.big-card')`, 8000, '百科卡片')
      await clickText('.big-card', '太阳')
      await waitFor(`document.querySelector('.detail-overlay')`, 5000, '详情弹层')
      if (!(await evaluate(`document.querySelector('.app-shell')?.hasAttribute('inert')`))) {
        throw new Error('弹层打开时背景未 inert')
      }
      const tabOk = await evaluate(`(() => {
        const overlay = document.querySelector('.detail-overlay')
        const items = [...overlay.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
        if (items.length < 2) return 'too-few'
        items[items.length - 1].focus()
        overlay.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }))
        const forward = document.activeElement === items[0]
        items[0].focus()
        overlay.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }))
        const backward = document.activeElement === items[items.length - 1]
        return forward && backward
      })()`)
      if (tabOk !== true) throw new Error(`焦点循环异常: ${tabOk}`)

      await clickAt('.detail-card .close-btn', 0)
      await waitFor(`!document.querySelector('.detail-overlay')`, 3000, '关闭详情')
      if (await evaluate(`document.querySelector('.app-shell')?.hasAttribute('inert')`)) {
        throw new Error('弹层关闭后背景仍 inert')
      }
    })

    /* ================= 6. PWA 离线 ================= */
    let offlineErrorCount = 0
    await step('PWA：离线冷启动 + 离线懒加载栏目', async () => {
      await go('')
      await waitFor(`document.querySelector('.big-card')`, 8000, '首页')
      if (!(await evaluate('!!navigator.serviceWorker.controller'))) {
        await send('Page.reload')
        await waitFor(`document.querySelector('.big-card')`, 12000, '刷新后首页')
        await sleep(1000)
      }
      if (!(await evaluate('!!navigator.serviceWorker.controller'))) {
        throw new Error('Service Worker 未接管页面')
      }

      await send('Network.enable')
      await send('Network.emulateNetworkConditions', {
        offline: true,
        latency: 0,
        downloadThroughput: 0,
        uploadThroughput: 0,
      })
      const errStart = consoleErrors.length
      try {
        await send('Page.reload', { ignoreCache: true })
        await waitFor(
          `document.querySelectorAll('.big-card').length >= 10`,
          15000,
          '离线首页渲染'
        )
        // 点进拼音：验证懒加载 chunk 也从 SW 预缓存取到
        await clickText('.big-card', '拼音乐园')
        await waitFor(`document.body.innerText.includes('声母')`, 12000, '离线拼音栏目')
      } finally {
        offlineErrorCount = consoleErrors.length - errStart
        await send('Network.emulateNetworkConditions', {
          offline: false,
          latency: 0,
          downloadThroughput: -1,
          uploadThroughput: -1,
        })
        await sleep(500)
      }
    })

    /* ================= 汇总 ================= */
    ws.close()
    console.log('\n--- 汇总 ---')
    const failed = results.filter((r) => !r.ok)
    const onlineErrors = consoleErrors.slice(0, consoleErrors.length - offlineErrorCount)
    console.log(`通过 ${results.length - failed.length}/${results.length} 项`)
    console.log(
      `控制台错误: ${onlineErrors.length === 0 ? '无' : onlineErrors.join(' | ')}${
        offlineErrorCount > 0 ? `（离线窗口另有 ${offlineErrorCount} 条网络错误，已忽略）` : ''
      }`
    )
    const ok = failed.length === 0 && onlineErrors.length === 0
    process.exitCode = ok ? 0 : 1
  } finally {
    killTree(chrome)
    killTree(preview)
    try {
      rmSync(profile, { recursive: true, force: true })
    } catch {}
  }
}

main().catch((e) => {
  console.error(`✗ ${e.message}`)
  process.exit(1)
})
