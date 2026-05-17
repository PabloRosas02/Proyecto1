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
  loading.value = true
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  loading.value = false

  if (error) {
    toast.add({ 
      severity: 'error', 
      summary: 'Error de acceso', 
      detail: error.message, 
      life: 3000 
    })
  } else {
    // Mostrar mensaje de éxito
    toast.add({ 
      severity: 'success', 
      summary: '¡Bienvenido!', 
      detail: 'Login exitoso', 
      life: 2000 
    })

    // Esperar un poco antes de redirigir para que el usuario vea el mensaje
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  }
  
}
</script>

<template>
  <div class="login-page">
    <Card style="width: 25rem; padding: 1.5rem;">
      <template #title> <span class="title">Iniciar Sesión</span> </template>
      <template #content>
        <div class="form-container">
          <div class="field">
            <label for="email">Email</label>
            <InputText id="email" v-model="email" fluid />
          </div>
          <div class="field">
            <label for="password">Password</label>
            <Password v-model="password" :feedback="false" toggleMask fluid />
          </div>
          <Button label="Entrar" icon="pi pi-sign-in" fluid class="mt-4" />
        </div>
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