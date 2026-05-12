import { createRouter, createWebHistory } from 'vue-router'
import Odamlar from '@/pages/Odamlar.vue'
import ShaxsPage from '@/pages/ShaxsPage.vue'
import Dashboard from '@/pages/Dashboard.vue'
import Debts from '@/pages/Debts.vue'
import Timeline from '@/pages/Timeline.vue'
import Analytics from '@/pages/Analytics.vue'

const routes = [
  {
    path: '/',
    name: 'Odamlar',
    component: Odamlar,
    meta: { title: 'Odamlar' }
  },
  {
    path: '/shaxs/:ism',
    name: 'ShaxsPage',
    component: ShaxsPage,
    meta: { title: 'Shaxs' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { title: 'Dashboard' }
  },
  {
    path: '/qarzlar',
    name: 'Qarzlar',
    component: Debts,
    meta: { title: 'Qarzlar' }
  },
  {
    path: '/tarix',
    name: 'Tarix',
    component: Timeline,
    meta: { title: 'Tarix' }
  },
  {
    path: '/tahlil',
    name: 'Tahlil',
    component: Analytics,
    meta: { title: 'Tahlil' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.afterEach((to) => {
  document.title = `${to.meta.title || 'Sahifa'} — Toyana`
})

export default router
