import { createRouter, createWebHistory } from 'vue-router'
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
        path: '/login',
        name: 'Login',
        component: () => import('../views/LoginView.vue'),
      },
      {
        path: '/signup',
        name: 'Signup',
        component: () => import('../views/SignupView.vue'),
      },
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
