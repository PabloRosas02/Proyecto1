//Register
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabaseClient' //Importar al cliente

const router = useRouter()

// Estados del formulario
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

const handleRegister = async () => {
  //Validacion de la contraseña
  if (password.value !== confirmPassword.value) {
    alert("Las contraseñas no coinciden")
    return
  }
  
  loading.value = true

  //Llamada a Supabase
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    //guardar por el momento el nombre en metadata
    options: {
      data: {
        fullname: name.value
      }
    }
  })

  if (error) {
    alert("Error al registrar: " + error.message)
  } else {
    alert("¡Registro exitoso! Por favor, revisa tu correo para confirmar la cuenta.")
    router.push('/login')
  }
  
  loading.value = false
}

</script>

<template>
  <div class="register-wrapper">
    <Card style="width: 30rem;">
      <template #title>Crear Cuenta</template>
      <template #subtitle>Completa los datos para empezar</template>
      
      <template #content>
        <div class="form-grid">
          <div class="field">
            <label for="name">Nombre Completo</label>
            <InputText id="name" v-model="name" placeholder="Ej. Juan Pérez" fluid />
          </div>

          <div class="field">
            <label for="email">Correo Electrónico</label>
            <InputText id="email" v-model="email" type="email" placeholder="correo@ejemplo.com" fluid />
          </div>

          <div class="field">
            <label for="password">Contraseña</label>
            <Password 
              id="password" 
              v-model="password" 
              toggleMask 
              fluid 
              promptLabel="Elige una clave"
              weakLabel="Débil" 
              mediumLabel="Media" 
              strongLabel="Fuerte"
            >
              <template #footer>
                <Divider />
                <p class="mt-2">Sugerencias:</p>
                <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                  <li>Al menos una minúscula</li>
                  <li>Al menos una mayúscula</li>
                  <li>Al menos un número</li>
                  <li>Mínimo 8 caracteres</li>
                </ul>
              </template>
            </Password>
          </div>

          <div class="field">
            <label for="confirm">Confirmar Contraseña</label>
            <Password id="confirm" v-model="confirmPassword" :feedback="false" toggleMask fluid />
          </div>
        </div>
      </template>

      <template #footer>
        <div class="actions">
          <Button 
            label="Registrarse" 
            icon="pi pi-user-plus" 
            :loading="loading" 
            @click="handleRegister" 
            fluid 
          />
          <p>¿Ya tienes cuenta? <RouterLink to="/login">Inicia sesión</RouterLink></p>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.register-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  padding: 1rem;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
}

/* Estilos extra para el panel de sugerencias del Password */
ul {
  list-style-type: disc;
}
</style>
