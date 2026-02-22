import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/de-ce-elbit',
    name: 'de-ce-elbit',
    component: () => import('../views/DeCeElbitView.vue')
  },
  {
    path: '/stiri',
    name: 'stiri',
    component: () => import('../views/StiriView.vue')
  },
  {
    path: '/ce-vrem',
    name: 'ce-vrem',
    component: () => import('../views/CeVremView.vue')
  },
  {
    path: '/sustine-campania',
    name: 'sustine-campania',
    component: () => import('../views/SustineCampaniaView.vue')
  },
  {
    path: '/cine-suntem',
    name: 'cine-suntem',
    component: () => import('../views/CineSuntemView.vue')
  },
  {
    // Catch-all — unknown routes get redirected home, not left to rot on a blank page
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
  // Kill scroll memory — every route transition starts at the top, no exceptions
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, behavior: 'smooth' }
  }
})

export default router
