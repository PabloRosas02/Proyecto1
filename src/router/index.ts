import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'


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
      meta: {requiresGuest: true} //Evitar que una vez logueado vuelva a ver el Login
    },
    {//Registro
      path: '/register',
      name: 'register',
      component: () => import('../views/AboutView.vue'), //Importacion 
      meta: {requiresGuest: true} //Igual que el Login
    },
    {//Registro
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue'), //Importacion 
      meta: {requiresGuest: true} //Igual que el Login
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      meta: {requiresAdmin: true}
    },
    
  ],
})

router.beforeEach(async (to, from,) => {
  // Obtener la sesión activa de Supabase
  const { data: { session } } = await supabase.auth.getSession()
  const isAuthenticated = !!session

  // Proteger ruta de Administrador
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    if (!isAuthenticated) {
      return '/login'
    }

    try{
      const{data} = await supabase
      .from('users_reg')
      .select('rol')
      .eq('id',session.user.id)
      .single()

      if(data?.rol === 'admin'){
        return true //Permitir acceso
      }
      else{
        return '/login' //No permitir si no es admin -----------SUGETA A CAMBIOS DEPENDIENDO DEL ROL-----------------
      }
    }
    catch(err){
      return '/login'
    }
  }

  // Redirección inteligente si ya está logueado e intenta ir a Login/Register
  if (to.matched.some(record => record.meta.requiresGuest)) {
    if (isAuthenticated) {
      try{
        const {data} = await supabase
        .from('users_reg')
        .select('rol')
        .eq('id', session.user.id)
        .single()

        if(data?.rol === 'admin'){
          return '/admin'
        }
        else{
          return '/login' //ruta de para el rol de los trabajadores
        }
      }
      catch{
        return '/login'
      }
    }
  }

  //Permitir la navegacion libre en cuaquier otra ruta
  return true
})


export default router
