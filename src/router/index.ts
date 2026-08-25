import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  // hash 模式：静态托管（EdgeOne Pages）无需服务端 rewrite 配置
  history: createWebHashHistory(),
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
      path: '/pinyin',
      name: 'pinyin',
      component: () => import('../views/PinyinView.vue'),
      meta: { title: '拼音乐园' },
    },
  ],
})

export default router
