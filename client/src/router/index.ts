import { createRouter, createWebHistory } from 'vue-router'
import HealthView from '@/views/HealthView.vue'
import HomeView from '@/views/HomeView.vue'
import MainLayout from '@/layout/MainLayout.vue'
import ExchangeView from '@/views/ExchangeView.vue'
import WishlistView from '@/views/WishlistView.vue'
import { authGuard } from '@auth0/auth0-vue'

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
    ],
  },
  {
    path: '/gift-exchanges',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Exchange',
        component: ExchangeView,
        beforeEnter: authGuard
      },
    ],
  },
  {
    path: '/wishlist',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Wishlist',
        component: WishlistView,
        beforeEnter: authGuard
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
