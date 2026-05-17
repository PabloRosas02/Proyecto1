import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminView from '@/views/AdminView.vue'
//import DashboardView from '..view/DashBoardView.vue' //Aqui es donde ira la parte principal


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {//Redireccionamiento a la pagina principal (Posibles cambios)
      path: '/',
      redirect: '/login'
    },
    {//Login
      path: '/login', 
      name: 'login',
      component: () => import('../views/HomeView.vue'), //Importacion directa
    },
    {//Registro
      path: '/register',
      name: 'register',
      component: () => import('../views/AboutView.vue'), //Importacion 
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      // Opcional: Podrías añadir meta: { requiresAdmin: true } después
    },
    
  ],
})

export default router
