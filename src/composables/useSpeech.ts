/**
 * 语音系统：基于浏览器内置 Web Speech API（speechSynthesis）。
 *
 * 核心设计：
 * - 自动挑选中文音色（优先 zh-CN，其次 zh 前缀）
 * - 可配置语速（settings.rate，默认 0.85 慢速，适合幼儿跟读）
 * - 可手动选择音色（settings.voiceURI，未选则自动挑选）
 * - 长文本按句子切分排队，避免单次 utterance 过长导致的静默/截断
 * - 浏览器要求「用户手势」后才能发声：首页放一个「点我开始」按钮解锁
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

/** 语音是否已解锁：浏览器要求用户手势后才能发声 */
const unlocked = ref(false)

/** 当前自动挑选的中文音色（voiceURI 未手动指定时的兜底） */
let autoZhVoice: SpeechSynthesisVoice | null = null

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

function refreshVoices() {
  if (!supported) return
  const voices = window.speechSynthesis.getVoices()
  zhVoices.value = voices.filter((v) => v.lang.toLowerCase().startsWith('zh'))
  autoZhVoice =
    voices.find((v) => v.lang.toLowerCase() === 'zh-cn') ??
    voices.find((v) => v.lang.toLowerCase().startsWith('zh')) ??
    null
}

function init() {
  if (!supported) return
  loadSettings()
  // Chrome 首次调用 getVoices() 可能为空，需等 voiceschanged 事件
  refreshVoices()
  window.speechSynthesis.addEventListener('voiceschanged', refreshVoices)
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

/** 朗读一段文本：先取消上一段，再把句子依次入队 */
function speak(text: string) {
  if (!supported || muted.value) return
  const synth = window.speechSynthesis
  const chunks = splitSentences(text)
  if (chunks.length === 0) return

  synth.cancel()
  const voice = resolveVoice()
  for (const chunk of chunks) {
    const u = new SpeechSynthesisUtterance(chunk)
    u.lang = 'zh-CN'
    u.rate = settings.value.rate
    u.pitch = 1.05
    if (voice) u.voice = voice
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
    stop,
    toggleMute,
    unlock,
    setVoice,
    setRate,
    muted,
    unlocked,
    supported,
    settings: readonly(settings),
    zhVoices: readonly(zhVoices),
  }
}
