import { createRouter, createWebHistory } from 'vue-router'
import HealthView from '@/views/HealthView.vue'
import HomeView from '@/views/HomeView.vue'
import MainLayout from '@/layout/MainLayout.vue'
import ExchangeView from '@/views/ExchangeView.vue'
import { authGuard } from '@auth0/auth0-vue'
import AboutView from '@/views/AboutView.vue'
import InvitationView from '@/views/InvitationView.vue'
import RsvpView from '@/views/RsvpView.vue'
import DashboardView from '@/views/DashboardView.vue'
import WishlistItemView from '@/views/wishlist/WishlistItemView.vue'
import WishlistView from '@/views/wishlist/WishlistView.vue'
import ExchangeDetailsView from '@/views/ExchangeDetailsView.vue'

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
    path: '/dashboard',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: DashboardView,
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
    path: '/event/:id',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'ExchangeDetails',
        component: ExchangeDetailsView,
        beforeEnter: authGuard,
        prop: true,
      },
    ],
  },
  {
    path: '/rsvp/:eventId/:id/:response',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'rsvp',
        component: RsvpView,
        props: true,
      },
    ],
  },
  {
    path: '/wishlist/:id/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'WishlistItems',
        component: WishlistItemView,
        props: true,
        beforeEnter: authGuard,
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
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
