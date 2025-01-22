import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from '@auth0/auth0-vue'
import HealthView from '@/views/HealthView.vue'
import HomeView from '@/views/HomeView.vue'
import MainLayout from '@/layout/MainLayout.vue'

const routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: HomeView,
      },
      {
        path: 'write',
        name: 'WriteArticle',
        component: () => import('@/views/WriteArticle.vue'),
        beforeEnter: authGuard
      }
    ],
  },
  {
    path: '/api/health',
    name: 'health-check',
    component: HealthView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router