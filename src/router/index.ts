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
  ],
})

export default router
