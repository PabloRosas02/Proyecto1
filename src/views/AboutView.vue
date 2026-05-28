//Register
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabaseClient' //Importar al cliente
import { useToast } from 'primevue/usetoast' //Importar hook

const router = useRouter()
const toast = useToast() //inicializar toast

// Estados del formulario
const fullname = ref('')
const numWorker = ref<number | null> (null)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const DEFAULT_ROLE = 'trabajador'


const handleRegister = async () => {
  //Validacion de la contraseña
  if(!fullname.value || !email.value || !password.value){
    toast.add({
      severity: 'warn', 
      summary: 'Atención', 
      detail: 'Todos los campos son obligatorios', 
      life: 3000 
    })
    return
  }

  if (password.value !== confirmPassword.value) {
    toast.add({ 
      severity: 'warn', 
      summary: 'Atención', 
      detail: 'Las contraseñas no coinciden', 
      life: 3000 
    })
    return
  }

  if(!numWorker.value){
    toast.add({
      severity: 'warn', 
      summary: 'Atención', 
      detail: 'El número de trabajador es obligatorio', 
      life: 3000 
    })
    return
  }
  
  loading.value = true

  try{
    //Llamada a Supabase
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      //guardar por el momento el nombre en metadata
      options: {
        data: {
          fullname: fullname.value, //Se envia al metadata para el trigger
          numworker: numWorker.value,
          role: DEFAULT_ROLE //Se envia siempre como el rol de 'trabajador'
        }
      }
    })
    if (error) throw error
    //Supabase loguea automaticamente tras el singUp. Lo cual se debe cerrar para que no se altere el estado global
    //y tampoco aparezca el boton de cerrado sesion
    await supabase.auth.signOut()

    toast.add({
      severity:'success',
      summary: 'Registro exitoso.',
      detail: 'Usuario creado exitosamente. Ahora puedes iniciar sesión.',
      life: 4000
    })

    //Redirigir al Login
    router.push('/login')
  }
  catch(error: any){
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 4000
    })
  }
  finally{
    loading.value = false
  }

}

</script>

<template>
  <div class="register-wrapper">
    <Card style="width: 32rem;">
      <template #title>Crear Cuenta</template>
      <template #subtitle>Ingresa tus datos de empleado para registrarte</template>
      
      <template #content>
        <form @submit.prevent="handleRegister" class="form-container">
          <div class="form-grid">
            <!-- Nombre Completo -->
            <div class="field">
              <label for="name">Nombre Completo</label>
              <InputText id="name" v-model="fullname" placeholder="Ej. Juan Pérez" fluid />
            </div>

            <!-- Numero de Trabajador -->
            <div class="field">
              <label for="numWorker">Número de Trabajador</label>
              <InputNumber id="numWorker" v-model="numWorker" :useGrouping="false" placeholder="123456" fluid />
            </div>

            <!-- Correo -->
            <div class="field">
              <label for="email">Correo Electrónico</label>
              <InputText id="email" v-model="email" type="email" placeholder="correo@ejemplo.com" fluid />
            </div>

            <!-- Contraseña -->
            <div class="field">
              <label for="password">Contraseña</label>
              <Password id="password" v-model="password" toggleMask fluid promptLabel="Elige una clave">
                <template #footer>
                  <Divider />
                  <p class="mt-2">Sugerencias:</p>
                  <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                    <li>Mínimo 8 caracteres</li>
                    <li>Al menos una mayúscula y un número</li>
                  </ul>
                </template>
              </Password>
            </div>

            <div class="field">
              <label for="confirm">Confirmar Contraseña</label>
              <Password id="confirm" v-model="confirmPassword" :feedback="false" toggleMask placeholder="Repite tu contraseña" fluid/>
            </div>
          </div>

          <div class="actions">
            <Button 
              type="submit"
              label="Registrarse" 
              icon="pi pi-user-plus" 
              :loading="loading" 
              @click="handleRegister" 
              fluid 
              class="mt-4"
            />
            <p class="login-redirect">¿Ya tienes cuenta? <RouterLink to="/login">Inicia sesión</RouterLink></p>
          </div>
        </form>
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

.form-container {
  display: flex;
  flex-direction: column;
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
  margin-top: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
}

.login-redirect {
  text-align: center;
  margin: 0;
  font-size: 0.95rem;
}

:deep(.p-password) {
  width:100%
}

/* Estilos extra para el panel de sugerencias del Password */
ul {
  list-style-type: disc;
}
</style>
