//Login
<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'vue-router';

import { useToast } from 'primevue/usetoast' //Importar hook


const router = useRouter()

const toast = useToast() //inicializar toast

const email = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async() => {
  if (!email.value || !password.value) {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Campos vacíos', life: 3000 })
    return
  }
  loading.value = true
  try {
    // 1. Autenticar al usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (authError) throw authError

    if (authData?.user) {
      //Consultar el rol del usuario en tu tabla pública 'users_reg'
      const { data: userData, error: userError } = await supabase
        .from('users_reg')
        .select('rol')
        .eq('id', authData.user.id)
        .single() // Trae un solo objeto en lugar de un array

      if (userError) throw userError

      // 3. Evaluar el rol y redirigir
      if (userData?.rol === 'admin') {
        toast.add({ severity: 'success', summary: 'Bienvenido', detail: 'Sesión de Administrador iniciada', life: 2000 })
        router.push('/admin') //Tu ruta hacia AdminView
      } else {
        toast.add({ severity: 'success', summary: 'Bienvenido', detail: 'Sesión iniciada', life: 2000 })
        router.push('/register') // o la página principal para trabajadores/editores
      }
    }
  } catch (error: any) {
    toast.add({ severity: 'error', summary: 'Error de acceso', detail: error.message, life: 4000 })
  } finally {
    loading.value = false
  }
  
}
</script>

<template>
  <div class="login-page">
    <Card style="width: 25rem; padding: 1.5rem;">
      <template #title> 
        <span class="title">Iniciar Sesión</span> 
      </template>
      <template #content>
        <form @submit.prevent="handleLogin" class="form-container">
          
          <div class="field">
            <label for="email">Email</label>
            <InputText id="email" v-model="email" type="email" placeholder="correo@ejemplo.com" fluid />
          </div>
          
          <div class="field">
            <label for="password">Password</label>
            <Password id="password" v-model="password" :feedback="false" toggleMask placeholder="••••••••" fluid />
          </div>
          <div class = "actions">
          <Button 
              type="submit"
              label="Entrar" 
              icon="pi pi-sign-in" 
              :loading="loading"
              @click="handleLogin" 
              fluid 
              class="mt-4" 
            />
            <p>¿No tienes cuenta? <RouterLink to="/register">Registrate aquí</RouterLink></p>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh; /* Centra verticalmente */
}
.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* Espacio entre campos */
  margin-top: 1rem;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.title {
  display: block;
  text-align: center;
  width: 100%;
}
</style>