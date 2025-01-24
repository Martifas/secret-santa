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
        path: '/gift-exchanges',
        name: 'Exchange',
        component: ExchangeView,
        beforeEnter: authGuard,
      },
    ],
  },
  {
    path: '/wishlist',
    component: MainLayout,
    children: [
      {
        path: '/wishlist',
        name: 'Wishlist',
        component: WishlistView,
        beforeEnter: authGuard,
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

router.beforeEach(async (to, from) => {
  if (to.fullPath.includes('state=') && to.fullPath.includes('code=')) {
    const targetRoute = sessionStorage.getItem('targetRoute') || '/gift-exchanges'
    sessionStorage.removeItem('targetRoute')
    return targetRoute
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    sessionStorage.setItem('targetRoute', to.fullPath)
  }
})

export default router
