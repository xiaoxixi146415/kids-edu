/**
 * 弹层页面锁：打开弹层时锁住 body 滚动并给 .app-shell 加 inert（读屏/键盘不跑去背景）。
 *
 * 用模块级计数支持重叠弹层：一个弹层关闭时不能把另一个弹层的锁一起解掉。
 * 之前每个 DetailDialog 各自 removeAttribute('inert')，后挂载的关闭态弹层会误解除别人的锁。
 */
let depth = 0
let prevOverflow = ''

function apply() {
  prevOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  document.querySelector<HTMLElement>('.app-shell')?.setAttribute('inert', '')
}

function clear() {
  document.body.style.overflow = prevOverflow
  document.querySelector<HTMLElement>('.app-shell')?.removeAttribute('inert')
}

export function lockModal() {
  depth += 1
  if (depth === 1) apply()
}

export function unlockModal() {
  if (depth === 0) return
  depth -= 1
  if (depth === 0) clear()
}
