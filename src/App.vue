<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {supabase} from './lib/supabaseClient'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast';

const router = useRouter()
const toast = useToast()

const isLoggedIn = ref(false)
const logoutLoading = ref(false)

//Verificar sesion inicial 
const checkSession = async () => {
  const {data: {session}} = await supabase.auth.getSession()
  isLoggedIn.value = !!session
}

//Escuchar cambios de autenticacion globalmente
supabase.auth.onAuthStateChange((event, session) => {
  isLoggedIn.value = !!session
})

onMounted(() => {
  checkSession()
})

const handleLogout = async () => {
  logoutLoading.value = true
  try{
   const {error} = await supabase.auth.signOut()
   if(error) throw error
   
   toast.add({
    severity: 'info',
    summary: 'Sesión cerrada',
    detail: 'Has salido del sistema de forma segura',
    life: 2000
   })
   router.push('/login')
  }
  catch(error:any){
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 3000
    })
  }
  finally{
    logoutLoading.value = false
  }
}

</script>

<template>
  <Toast />

  <header v-if="isLoggedIn" class="main-navbar">
    <div class="nav-brand">
      <span>Sistema de Control</span>
    </div>
    <div class="nav-actions">
      <Button 
        label="Cerrar Sesión" 
        icon="pi pi-sign-out" 
        severity="danger" 
        text
        :loading="logoutLoading" 
        @click="handleLogout" 
      />
    </div>
  </header>

  <main class="app-content">
    <RouterView />
  </main>
</template>

<style scoped>
.main-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2.5rem;
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
}

.nav-brand span {
  font-weight: bold;
  color: var(--color-heading);
  font-size: 1.2rem;
}

.app-content {
  width: 100%;
}
</style>
