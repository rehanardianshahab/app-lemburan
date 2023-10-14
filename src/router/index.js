import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/DashboardView.vue'
import LemburView from '../views/LemburView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      name: 'home',
      component: HomeView
    },
    {
      path: '/lembur',
      name: 'lembur',
      component: LemburView
    },
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/login',
      name: 'logins',
      component: LoginView
    }
  ]
})

export default router
