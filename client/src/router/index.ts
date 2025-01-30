import { createRouter, createWebHistory } from 'vue-router'
import HealthView from '@/views/HealthView.vue'
import HomeView from '@/views/HomeView.vue'
import MainLayout from '@/layout/MainLayout.vue'
import ExchangeView from '@/views/ExchangeView.vue'
import WishlistView from '@/views/WishlistView.vue'
import { authGuard } from '@auth0/auth0-vue'
import AboutView from '@/views/AboutView.vue'
import InvitationView from '@/views/InvitationView.vue'
import RsvpView from '@/views/RsvpView.vue'

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
    path: '/about',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'About',
        component: AboutView,
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
        beforeEnter: authGuard,
      },
    ],
  },
  {
    path: '/invite/:id',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Invitation',
        component: InvitationView,
        beforeEnter: authGuard,
        prop: true,
      },
    ],
  },
  {
    path: '/rsvp/:id',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'rsvp',
        component: RsvpView,
        prop: true,
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

export default router
