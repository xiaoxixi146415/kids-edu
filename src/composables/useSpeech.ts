/**
 * 语音系统：基于浏览器内置 Web Speech API（speechSynthesis）。
 *
 * 核心设计：
 * - 自动挑选中文音色（优先 zh-CN，其次 zh 前缀）
 * - 慢速朗读（rate 0.85），适合幼儿跟读
 * - 长文本按句子切分排队，避免单次 utterance 过长导致的静默/截断
 * - 浏览器要求「用户手势」后才能发声：首页放一个「点我开始」按钮解锁
 * - 全局静音开关，状态写入 localStorage 持久化
 */
import { ref } from 'vue'

const supported =
  typeof window !== 'undefined' &&
  typeof window.speechSynthesis !== 'undefined' &&
  'SpeechSynthesisUtterance' in window

/** 全局静音状态 */
const muted = ref(false)

if (typeof localStorage !== 'undefined') {
  muted.value = localStorage.getItem('kids-edu-muted') === '1'
}

/**
 * 语音是否已解锁：浏览器要求用户手势后才能发声，
 * 首页的「点我开始」按钮触发一次后，本会话内持续有效。
 */
const unlocked = ref(false)

/** 当前选中的中文音色 */
let zhVoice: SpeechSynthesisVoice | null = null

function pickZhVoice(): SpeechSynthesisVoice | null {
  if (!supported) return null
  const voices = window.speechSynthesis.getVoices()
  zhVoice =
    voices.find((v) => v.lang.toLowerCase() === 'zh-cn') ??
    voices.find((v) => v.lang.toLowerCase().startsWith('zh')) ??
    null
  return zhVoice
}

function init() {
  if (!supported) return
  // Chrome 首次调用 getVoices() 可能为空，需等 voiceschanged 事件
  pickZhVoice()
  window.speechSynthesis.addEventListener('voiceschanged', pickZhVoice)
}

/** 按中英文句号等切分成短句，保留标点 */
function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[。！？!?；;，,])/)
    .map((s) => s.trim())
    .filter(Boolean)
}

/** 朗读一段文本：先取消上一段，再把句子依次入队 */
function speak(text: string) {
  if (!supported || muted.value) return
  const synth = window.speechSynthesis
  const chunks = splitSentences(text)
  if (chunks.length === 0) return

  synth.cancel()
  for (const chunk of chunks) {
    const u = new SpeechSynthesisUtterance(chunk)
    u.lang = 'zh-CN'
    u.rate = 0.85
    u.pitch = 1.05
    if (zhVoice) u.voice = zhVoice
    synth.speak(u)
  }
}

/** 停止当前朗读 */
function stop() {
  if (!supported) return
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
}

init()

export function useSpeech() {
  return { speak, stop, toggleMute, unlock, muted, unlocked, supported }
}
