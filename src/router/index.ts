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
  ],
})

export default router
