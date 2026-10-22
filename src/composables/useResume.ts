/**
 * 首页「继续学习」→ 栏目内详情 的深链续学。
 *
 * 首页会带 `?open=<条目id>` 跳到栏目；栏目挂载后按 id 找到条目并打开详情，
 * 然后清掉 query，避免关掉详情后刷新又自动弹开。
 *
 * 清 query 用 router.replace 而不是改 location：保留 vue-router 的状态；
 * 路由层对「同路径只改 query」的导航不再抢焦点（见 router.afterEach）。
 */
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/** 读取当前地址里的 ?open=，并提供清除方法（适合安静书这类不走 open() 的视图） */
export function useOpenParam() {
  const route = useRoute()
  const router = useRouter()
  const raw = route.query.open
  const openId = typeof raw === 'string' ? raw : ''

  function clear() {
    if (!openId) return
    const query: Record<string, string | string[]> = {}
    for (const [key, value] of Object.entries(route.query)) {
      if (key === 'open' || value == null) continue
      query[key] = Array.isArray(value)
        ? value.filter((v): v is string => v != null)
        : String(value)
    }
    router.replace({ path: route.path, query })
  }

  return { openId, clear }
}

/**
 * 通用续学：挂载后若 ?open= 命中某条目，就调用视图自己的 open() 打开它。
 * 返回 resumed，供同时有「默认打开内容」的视图（如数学练习）跳过默认行为。
 */
export function useResume<T>(
  items: readonly T[],
  idOf: (item: T) => string,
  open: (item: T) => void
) {
  const { openId, clear } = useOpenParam()
  const resumed = openId !== ''

  onMounted(() => {
    if (!openId) return
    const item = items.find((it) => idOf(it) === openId)
    if (item) open(item)
    clear()
  })

  return { resumed }
}
