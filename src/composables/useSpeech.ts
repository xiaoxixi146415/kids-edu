/**
 * 语音系统：基于浏览器内置 Web Speech API（speechSynthesis）。
 *
 * 核心设计：
 * - 自动挑选中文音色（优先 zh-CN，其次 zh 前缀）
 * - 可配置语速（settings.rate，默认 0.85 慢速，适合幼儿跟读）
 * - 可手动选择音色（settings.voiceURI，未选则自动挑选）
 * - 长文本按句子切分、逐句 onend 接力朗读，兼容 iOS 连续多句丢帧的问题
 * - 浏览器要求「用户手势」后才能发声：首页放一个「点我开始」按钮解锁
 * - 移动端音色列表常需用户手势后才就绪：首次手势、轮询、visibilitychange 三重兜底
 * - 全局静音开关 + 音色/语速设置，均写入 localStorage 持久化
 */
import { ref, readonly } from 'vue'

const supported =
  typeof window !== 'undefined' &&
  typeof window.speechSynthesis !== 'undefined' &&
  'SpeechSynthesisUtterance' in window

/** 全局静音状态 */
const muted = ref(false)

/** 音色/语速设置（持久化） */
interface SpeechSettings {
  /** 选中的音色 URI；null = 自动挑选中文音色 */
  voiceURI: string | null
  /** 朗读语速 */
  rate: number
}

const STORAGE_KEY = 'kids-edu-speech'
const DEFAULT_SETTINGS: SpeechSettings = { voiceURI: null, rate: 0.85 }

const settings = ref<SpeechSettings>({ ...DEFAULT_SETTINGS })

/** 可用中文音色列表（随 voiceschanged 刷新） */
const zhVoices = ref<SpeechSynthesisVoice[]>([])

/** 音色列表是否已有结论（有返回值或已超时）：用于 UI 区分「加载中」与「设备无音色」 */
const voicesChecked = ref(false)

/** 语音是否已解锁：浏览器要求用户手势后才能发声 */
const unlocked = ref(false)

/** 当前自动挑选的中文音色（voiceURI 未手动指定时的兜底） */
let autoZhVoice: SpeechSynthesisVoice | null = null

/** 朗读接力用的序号：每次 speak/stop 自增，用于打断旧链（避免 cancel 触发 onend 又续读） */
let speakSeq = 0

function loadSettings() {
  if (typeof localStorage === 'undefined') return
  muted.value = localStorage.getItem('kids-edu-muted') === '1'
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const saved = JSON.parse(raw) as Partial<SpeechSettings>
      settings.value = {
        voiceURI: typeof saved.voiceURI === 'string' ? saved.voiceURI : null,
        rate: typeof saved.rate === 'number' && saved.rate > 0 ? saved.rate : DEFAULT_SETTINGS.rate,
      }
    }
  } catch {
    // 存储损坏时回退默认
    settings.value = { ...DEFAULT_SETTINGS }
  }
}

function persistSettings() {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value))
}

/**
 * 判断是否中文音色。
 * 除了 zh-* 之外还要兼容 cmn-*(部分安卓) 与名字里带 Chinese/中文 的音色，
 * 否则挑不到中文音色时浏览器会用默认英文音色，把内容全念成英文。
 */
function isZhVoice(v: SpeechSynthesisVoice): boolean {
  const lang = v.lang.toLowerCase()
  return lang.startsWith('zh') || lang.startsWith('cmn') || /chinese|中文|普通话/i.test(v.name)
}

function refreshVoices() {
  if (!supported) return
  const voices = window.speechSynthesis.getVoices()
  zhVoices.value = voices.filter(isZhVoice)
  autoZhVoice =
    voices.find((v) => v.lang.toLowerCase().replace('_', '-') === 'zh-cn') ??
    voices.find(isZhVoice) ??
    null
  // 只要 getVoices 返回了任何音色，就说明列表已就绪（可能设备上根本没有中文音色）
  if (voices.length > 0) voicesChecked.value = true
}

function init() {
  if (!supported) return
  loadSettings()
  refreshVoices()
  const synth = window.speechSynthesis
  // 部分旧浏览器只支持 onvoiceschanged 属性，两者都挂上
  synth.addEventListener('voiceschanged', refreshVoices)
  synth.onvoiceschanged = refreshVoices
  // 兜底轮询：个别移动端 WebView 不触发 voiceschanged，列表延迟就绪；超时后标记为「已检查」
  const startAt = Date.now()
  const poll = window.setInterval(() => {
    refreshVoices()
    if (voicesChecked.value || Date.now() - startAt > 5000) {
      window.clearInterval(poll)
      if (!voicesChecked.value) voicesChecked.value = true // 5s 仍空 → 设备无可用音色
    }
  }, 250)
  // 首次用户手势后音色才就绪（iOS/部分 Android）：手势时再刷一次
  const prime = () => {
    refreshVoices()
    window.removeEventListener('pointerdown', prime)
    window.removeEventListener('touchstart', prime)
    window.removeEventListener('keydown', prime)
  }
  window.addEventListener('pointerdown', prime)
  window.addEventListener('touchstart', prime)
  window.addEventListener('keydown', prime)
  // 从后台切回时 WebView 可能丢失音色列表，重新拉取
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') refreshVoices()
  })
}

/** 按中英文句号等切分成短句，保留标点 */
function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[。！？!?；;，,])/)
    .map((s) => s.trim())
    .filter(Boolean)
}

/** 解析当前要用的音色：手动选中优先，否则自动挑选 */
function resolveVoice(): SpeechSynthesisVoice | null {
  if (!supported) return null
  if (settings.value.voiceURI) {
    const found = window.speechSynthesis.getVoices().find((v) => v.voiceURI === settings.value.voiceURI)
    if (found) return found
  }
  return autoZhVoice
}

/**
 * 朗读一段文本：先取消上一段，再逐句 onend 接力。
 * 不用一次性 queue 多句：iOS 常见「只播第一句就哑火」的 bug，
 * 逐句等 onend 再播下一句最稳。
 */
function speak(text: string) {
  if (!supported || muted.value) return
  const chunks = splitSentences(text)
  if (chunks.length === 0) return
  const synth = window.speechSynthesis
  // 手势后音色可能刚就绪，先刷新再取
  refreshVoices()
  const voice = resolveVoice()
  const seq = ++speakSeq
  synth.cancel()
  let i = 0
  const play = () => {
    if (seq !== speakSeq) return // 已被 stop/新一轮打断
    const chunk = chunks[i]
    if (chunk == null) return
    i++
    const u = new SpeechSynthesisUtterance(chunk)
    u.lang = 'zh-CN'
    u.rate = settings.value.rate
    u.pitch = 1.05
    if (voice) u.voice = voice
    u.onend = play
    u.onerror = play // 出错也尝试播下一句，避免整段静默
    synth.speak(u)
    // 老版 iOS 需要 resume() 才能开声，现代浏览器是空操作
    synth.resume()
  }
  play()
}

/**
 * 按「句」顺序朗读，每句开始前回调 onTick(句下标)，全部读完回调 onDone。
 * 用于儿歌等需要「逐句朗读、逐句同步画面」的场景；
 * 不拆句，保证 1 句 ↔ 1 次回调一一对应。被打断（stop/新一轮 speak）后不再回调。
 */
function speakLines(lines: string[], onTick?: (i: number) => void, onDone?: () => void) {
  if (!supported || muted.value || lines.length === 0) return
  const synth = window.speechSynthesis
  refreshVoices()
  const voice = resolveVoice()
  const seq = ++speakSeq
  synth.cancel()
  let i = 0
  const play = () => {
    if (seq !== speakSeq) return // 已被 stop/新一轮打断
    if (i >= lines.length) {
      onDone?.()
      return
    }
    onTick?.(i)
    const line = lines[i]
    i++
    if (!line.trim()) {
      play()
      return
    }
    const u = new SpeechSynthesisUtterance(line)
    u.lang = 'zh-CN'
    u.rate = settings.value.rate
    u.pitch = 1.05
    if (voice) u.voice = voice
    u.onend = play
    u.onerror = play // 单句出错也继续下一句，避免中断
    synth.speak(u)
    synth.resume()
  }
  play()
}

/** 停止当前朗读 */
function stop() {
  if (!supported) return
  speakSeq++ // 打断未播完的 onend 链
  window.speechSynthesis.cancel()
}

/** 切换静音，返回切换后的状态 */
function toggleMute(): boolean {
  muted.value = !muted.value
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('kids-edu-muted', muted.value ? '1' : '0')
  }
  if (muted.value) stop()
  return muted.value
}

/** 解锁语音（须由用户手势触发） */
function unlock() {
  unlocked.value = true
  refreshVoices()
}

/** 选择音色（传 voiceURI，null = 自动） */
function setVoice(voiceURI: string | null) {
  settings.value.voiceURI = voiceURI
  persistSettings()
}

/** 设置语速 */
function setRate(rate: number) {
  settings.value.rate = rate
  persistSettings()
}

init()

export function useSpeech() {
  return {
    speak,
    speakLines,
    stop,
    toggleMute,
    unlock,
    setVoice,
    setRate,
    muted,
    unlocked,
    supported,
    voicesChecked,
    settings: readonly(settings),
    zhVoices: readonly(zhVoices),
  }
}
