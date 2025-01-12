import { createRouter, createWebHistory } from 'vue-router'
import HealthView from '@/views/HealthView.vue'
import HomeView from '@/views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/api/health',
    name: 'health-check',
    component: HealthView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router