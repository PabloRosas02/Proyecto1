import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import ManualDetail from '../components/ManualContent.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes:[
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    // Redirigir cualquier ruta desconocida al dashboard
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router
