<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import { FilterMatchMode } from '@primevue/core/api' // Para los filtros

interface Usuario {
  id: string
  fullname: string
  mail: string
  num_worker: number
  rol: 'admin' | 'editor' | 'trabajador'
  active: boolean
  password: string
}

const router = useRouter()
const toast = useToast()
const users = ref<Usuario[]>([])
const loading = ref(false)
const userDialog = ref(false)
const submitted = ref(false)
const user = ref<Partial<Usuario>>({})
const isEditing = ref(false)

const roles = ref([
  { label: 'Administrador', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Trabajador', value: 'trabajador' }
])

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

const fetchUsers = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('users_reg')
      .select('*')
      .order('fullname', { ascending: true })

    if (error) throw error
    users.value = data as Usuario[]
  } catch (error: any) {
    toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 })
  } finally {
    loading.value = false
  }
}

const openNew = () => {
  user.value = { rol: 'trabajador' } // Valores por defecto
  isEditing.value = false
  submitted.value = false
  userDialog.value = true
}

const editUser = (u: Usuario) => {
  user.value = { ...u }
  isEditing.value = true
  userDialog.value = true
}

const saveUser = async () => {
  submitted.value = true
  
  if (!user.value.fullname || !user.value.mail || !user.value.num_worker) return

  loading.value = true
  try {
    if (isEditing.value) {
      // Lógica de UPDATE (la que ya tenías)
      const { error } = await supabase
        .from('users_reg')
        .update({
          fullname: user.value.fullname,
          num_worker: user.value.num_worker,
          rol: user.value.rol
        })
        .eq('id', user.value.id)
      if (error) throw error
    } else {
      // Lógica de CREAR NUEVO
      // Nota: Usamos signUp pero sin loguear al nuevo usuario
      const { error } = await supabase.auth.signUp({
        email: user.value.mail,
        password: 'PasswordTempora123!', // Puedes pedir una o generar una genérica
        options: {
          data: {
            fullname: user.value.fullname,
            numworker: user.value.num_worker,
            role: user.value.rol
          }
        }
      })
      if (error) throw error
    }

    toast.add({ severity: 'success', summary: 'Éxito', detail: isEditing.value ? 'Usuario actualizado' : 'Usuario creado', life: 3000 })
    await fetchUsers()
    userDialog.value = false
  } catch (error: any) {
    toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 4000 })
  } finally {
    loading.value = false
  }
}

const deleteUser = async (id: string) => {
  if (!confirm('¿Estás seguro de eliminar este usuario permanentemente del sistema?')) return

  loading.value = true
  try {
    // Borrar de la tabla pública (users_reg)
    const { error: tableError } = await supabase
      .from('users_reg')
      .delete()
      .eq('id', id)

    if (tableError) throw tableError

    // Llamar a la función SQL que borra de Authentication
    const { error: authError } = await supabase.rpc('delete_user_completely', { 
      user_id: id 
    })

    if (authError) throw authError

    // Actualizar la interfaz
    users.value = users.value.filter((u) => u.id !== id)
    toast.add({ 
      severity: 'success', 
      summary: 'Eliminado', 
      detail: 'Usuario eliminado de la tabla y de Authentication', 
      life: 3000 
    })
  } catch (error: any) {
    toast.add({ 
      severity: 'error', 
      summary: 'Error al eliminar', 
      detail: error.message, 
      life: 4000 
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div class="admin-wrapper">
    <Card class="admin-card">
      <template #title>
        <div class="header-flex">
          <h2 class="title">Gestión de Empleados</h2>
          <Button label="Nuevo Registro" icon="pi pi-plus" class="p-button-vue" @click="openNew" />
        </div>
      </template>

      <template #content>
        <div class="toolbar">
          <IconField iconPosition="left">
            <InputIcon class="pi pi-search" />
            <InputText v-model="filters['global'].value" placeholder="Buscar empleado..." class="w-full" />
          </IconField>
          <Button icon="pi pi-refresh" outlined severity="secondary" @click="fetchUsers" :loading="loading" />
        </div>

        <DataTable :value="users" v-model:filters="filters" :loading="loading" 
                   paginator :rows="10" stripedRows class="custom-table">
          <Column field="num_worker" header="Número de Empleado" sortable style="width: 15%"></Column>
          <Column field="fullname" header="Nombre" sortable style="width: 30%"></Column>
          <Column field="mail" header="Email" style="width: 25%"></Column>
          <Column field="rol" header="Rol" sortable style="width: 15%">
            <template #body="slotProps">
              <Tag :value="slotProps.data.rol" :severity="slotProps.data.rol === 'admin' ? 'danger' : 'info'" />
            </template>
          </Column>
          <Column header="Acciones" style="width: 15%">
            <template #body="slotProps">
              <div class="flex gap-2">
                <Button icon="pi pi-pencil" text rounded severity="secondary" @click="editUser(slotProps.data)" />
                <Button icon="pi pi-trash" text rounded severity="danger" @click="deleteUser(slotProps.data.id)" />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <Dialog v-model:visible="userDialog" :header="isEditing ? 'Editar Usuario' : 'Nuevo Registro de Empleado'" :modal="true" class="p-fluid" style="width: 450px">
      
      <div class="field mb-4">
        <label for="name" class="block mb-2 font-bold">Nombre Completo</label>
        <InputText id="name" v-model.trim="user.fullname" :class="{'p-invalid': submitted && !user.fullname}" placeholder="Ej. Juan Pérez" fluid />
        <small class="validation-msg" v-if="submitted && !user.fullname">El nombre es obligatorio.</small>
      </div>

      <div v-if="!isEditing">
        <div class="field mb-4">
          <label for="email" class="block mb-2 font-bold">Correo Electrónico</label>
          <InputText id="email" v-model.trim="user.mail" :class="{'p-invalid': submitted && !user.mail}" placeholder="correo@ejemplo.com" fluid />
          <small class="validation-msg" v-if="submitted && !user.mail">El correo es obligatorio para nuevos registros.</small>
        </div>

        <div class="field mb-4">
          <label for="password" class="block mb-2 font-bold">Contraseña Temporal</label>
          <Password id="password" v-model="user.password" toggleMask :feedback="false" :class="{'p-invalid': submitted && !user.password}" placeholder="Min. 6 caracteres" fluid />
          <small class="validation-msg" v-if="submitted && !user.password">La contraseña temporal es obligatoria.</small>
        </div>
      </div>

      <div class="field mb-4">
        <label for="worker" class="block mb-2 font-bold">Número de Empleado</label>
        <InputNumber id="worker" v-model="user.num_worker" :useGrouping="false" :class="{'p-invalid': submitted && !user.num_worker}" placeholder="123456" fluid />
        <small class="validation-msg" v-if="submitted && !user.num_worker">El número de nómina es obligatorio.</small>
      </div>

      <div class="field mb-4">
        <label for="role" class="block mb-2 font-bold">Rol en el Sistema</label>
        <Dropdown 
          id="role" 
          v-model="user.rol" 
          :options="roles" 
          optionLabel="label" 
          optionValue="value" 
          placeholder="Selecciona un rol" 
          fluid
        />
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="userDialog = false" />
        <Button :label="isEditing ? 'Guardar Cambios' : 'Crear Usuario'" icon="pi pi-check" @click="saveUser" :loading="loading" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.admin-wrapper {
  padding: 2.5rem;
  background-color: var(--color-background-soft);
  min-height: 100vh;
}

.admin-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
}

.header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  color: var(--color-heading);
  margin: 0;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 1rem;
}

.p-button-vue {
  background-color: #42b883 !important; 
  border-color: #42b883 !important;
}

.field label {
  color: var(--color-text);
}

/* Sincronización de componentes globales con variables base.css */
:deep(.p-datatable-thead > tr > th) {
  background: var(--color-background);
  color: var(--color-heading);
  border-bottom: 1px solid var(--color-border);
}

:deep(.p-datatable-tbody > tr) {
  background: var(--color-background);
  color: var(--color-text);
}

:deep(.p-inputtext), :deep(.p-dropdown), :deep(.p-inputnumber-input), :deep(.p-password-input) {
  background: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

:deep(.p-dialog) {
  background: var(--color-background);
  border: 1px solid var(--color-border);
}

:deep(.p-dialog-header), :deep(.p-dialog-content), :deep(.p-dialog-footer) {
  background: var(--color-background);
  color: var(--color-text);
}

/* Reestructurar flexbox dentro del contenedor p-fluid */
:deep(.p-fluid .field) {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

/* Forzar la expansión horizontal total de todos los componentes de PrimeVue */
:deep(.p-fluid .field > .p-inputtext),
:deep(.p-fluid .field > .p-inputnumber),
:deep(.p-fluid .field > .p-password),
:deep(.p-fluid .field > .p-dropdown) {
  width: 100% !important;
}

/* Forzar el mensaje de error condicional debajo del input de manera limpia */
.validation-msg {
  color: #ff5252; 
  display: block;
  width: 100% !important;
  margin-top: 0.35rem;
  margin-left: 0 !important;
  font-size: 0.85rem;
  text-align: left;
  line-height: 1.3;
}
</style>