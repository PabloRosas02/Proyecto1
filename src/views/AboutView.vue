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
  if (password.value !== confirmPassword.value) {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Las contraseñas no coinciden', life: 3000 })
    return
  }

  if(!numWorker.value){
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'El número de trabajador es obligatorio', life: 3000 })
    return
  }
  
  loading.value = true

  console.log(fullname.value, numWorker.value);

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

  if (error) {
    toast.add({severity: 'error', summary: 'Error', detail: error.message, life: 3000})
  } else {
    toast.add({severity: 'success', summary: 'Registro exitoso', detail: 'Usuario Creado exitosamente', life: 3000})
    router.push('/login')
  }
  
  loading.value = false
}

</script>

<template>
  <div class="register-wrapper">
    <Card style="width: 32rem;">
      <template #title>Crear Cuenta</template>
      <template #subtitle>Ingresa tus datos de empleado para registrarte</template>
      
      <template #content>
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
            <Password id="confirm" v-model="confirmPassword" :feedback="false" toggleMask fluid />
          </div>
        </div>
      </template>

      <template #footer>
        <div class="actions">
          <Button label="Registrarse" icon="pi pi-user-plus" :loading="loading" @click="handleRegister" fluid />
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
