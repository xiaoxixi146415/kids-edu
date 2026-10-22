import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  // hash 模式：静态托管（EdgeOne Pages）无需服务端 rewrite 配置
  history: createWebHashHistory(),
  // 新进入栏目时回到顶部；浏览器后退则恢复原位置。
  // 否则从首页下方点卡片，会把旧的滚动位置带到新页面（短页面直接落到底部）。
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 }
  },
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { title: '宝宝乐园' } },
    {
      path: '/encyclopedia',
      name: 'encyclopedia',
      component: () => import('../views/EncyclopediaView.vue'),
      meta: { title: '知识百科' },
    },
    {
      path: '/brainteasers',
      name: 'brainteasers',
      component: () => import('../views/BrainTeasersView.vue'),
      meta: { title: '脑筋急转弯' },
    },
    {
      path: '/tangshi',
      name: 'tangshi',
      component: () => import('../views/TangshiView.vue'),
      meta: { title: '唐诗' },
    },
    {
      path: '/hanzi',
      name: 'hanzi',
      component: () => import('../views/HanziView.vue'),
      meta: { title: '识字认字' },
    },
    {
      path: '/math',
      name: 'math',
      component: () => import('../views/MathView.vue'),
      meta: { title: '数学启蒙' },
    },
    {
      path: '/animals',
      name: 'animals',
      component: () => import('../views/AnimalsView.vue'),
      meta: { title: '动物乐园' },
    },
    {
      path: '/stories',
      name: 'stories',
      component: () => import('../views/StoriesView.vue'),
      meta: { title: '绘本故事' },
    },
    {
      path: '/quietbook',
      name: 'quietbook',
      component: () => import('../views/QuietBookView.vue'),
      meta: { title: '安静书' },
    },
    {
      path: '/pinyin',
      name: 'pinyin',
      component: () => import('../views/PinyinView.vue'),
      meta: { title: '拼音乐园' },
    },
    {
      path: '/nursery',
      name: 'nursery',
      component: () => import('../views/NurseryRhymesView.vue'),
      meta: { title: '儿童歌谣' },
    },
    {
      path: '/parent',
      name: 'parent',
      component: () => import('../views/ParentView.vue'),
      meta: { title: '家长报告' },
    },
    // 未知地址（旧书签/手误）回首页，避免渲染空白 main
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

/* —— 路由后的标题与焦点：读屏/键盘用户能知道「已经换页了」 —— */
router.afterEach((to, from) => {
  // 同路径只改 query（如续学后清掉 ?open=）不算换页：不重设标题、不抢详情弹层焦点
  if (from.name && to.path === from.path) return
  const title = (to.meta.title as string) ?? '宝宝乐园'
  document.title = title === '宝宝乐园' ? '宝宝乐园 - 幼儿教育有声乐园' : `${title} - 宝宝乐园`
  // 等新视图渲染完再聚焦主内容；preventScroll 避免和 scrollBehavior 抢滚动位置
  requestAnimationFrame(() => {
    document.getElementById('main')?.focus({ preventScroll: true })
  })
})

/**
 * 部署新版本后，旧页面可能还在引用已被清理的懒加载 chunk。
 * 首次遇到动态 import 失败时整页刷新一次即可拿到新资源；用时间戳防刷新循环。
 */
router.onError((error) => {
  if (!/Failed to fetch dynamically imported module|Importing a module script failed/i.test(error.message)) return
  const KEY = 'kids-edu-chunk-reload'
  let last = 0
  try {
    last = Number(sessionStorage.getItem(KEY) ?? 0)
  } catch {
    /* 存储不可用时无法防重复刷新，直接放弃自愈，交给用户手动刷新 */
    return
  }
  if (Date.now() - last < 10_000) return
  try {
    sessionStorage.setItem(KEY, String(Date.now()))
  } catch {
    return
  }
  window.location.reload()
})

export default router
