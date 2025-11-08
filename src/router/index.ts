import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/theory',
      name: 'theory',
      component: () => import('../views/TheoryView.vue')
    },
    {
      path: '/calculator',
      name: 'calculator',
      component: () => import('../views/CalculatorView.vue')
    },
    {
      path: '/simulator',
      name: 'simulator',
      component: () => import('../views/SimulatorView.vue')
    },
    {
      path: '/cases',
      name: 'cases',
      component: () => import('../views/CasesView.vue')
    }
  ]
})

export default router
