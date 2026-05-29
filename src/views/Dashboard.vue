<template>
  <div class="dashboard">
    <Sidebar
      :selected-subtema="selectedSubtema"
      @subtema-seleccionado="handleSubtemaSeleccionado"
    />

    <main class="dashboard-main">
      <div class="dashboard-header">
        <div class="breadcrumb">
          <template v-if="selectedSubtema">
            <span class="breadcrumb-item">{{ selectedSubtema.nombreTema }}</span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-item active">{{ selectedSubtema.titulo }}</span>
          </template>
          <template v-else>
            <span class="breadcrumb-item active">Manuales de Maquinarias</span>
          </template>
        </div>
      </div>

      <div class="dashboard-content-wrapper">
        <ManualContent
          :subtema="selectedSubtema"
          @actualizar-contenido="updateContent"
          @open-mobile-sidebar="openMobileSidebar"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import ManualContent from '../components/ManualContent.vue'

interface Subtema {
  id: number
  titulo: string
  contenido: string
  nombreTema?: string
}

const selectedSubtema = ref<Subtema | null>(null)

const handleSubtemaSeleccionado = (subtema: Subtema) => {
  selectedSubtema.value = subtema
}

const updateContent = (nuevoContenido: string) => {
  if (selectedSubtema.value) {
    selectedSubtema.value.contenido = nuevoContenido
  }
}

const openMobileSidebar = () => {
  const sidebar = document.querySelector('.sidebar')
  if (sidebar) {
    sidebar.classList.add('sidebar-mobile-open')
  }
}
</script>

<style scoped>
.dashboard {
  display: flex;
  width: 100%;
  min-height: 100vh;
  background: var(--color-background);
}

.dashboard-main {
  flex: 1;
  margin-left: var(--sidebar-width);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-background);
}

/* Header del dashboard - breadcrumb */
.dashboard-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-background-soft);
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-md) var(--spacing-xl);
}

/* Breadcrumb estilos */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.breadcrumb-item {
  font-size: var(--font-size-sm);
  color: var(--color-text);
}

.breadcrumb-item.active {
  color: var(--color-heading);
  font-weight: 500;
}

.breadcrumb-separator {
  font-size: var(--font-size-sm);
  color: var(--color-border);
}

/* Contenedor del contenido */
.dashboard-content-wrapper {
  flex: 1;
  padding: var(--spacing-xl);
  width: 100%;
}

/* Sidebar colapsado */
.sidebar-collapsed ~ .dashboard-main {
  margin-left: var(--sidebar-collapsed-width);
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-main {
    margin-left: 0;
  }

  .dashboard-header {
    padding: var(--spacing-sm) var(--spacing-lg);
  }

  .dashboard-content-wrapper {
    padding: var(--spacing-lg);
  }

  .breadcrumb-item,
  .breadcrumb-separator {
    font-size: var(--font-size-xs);
  }
}

@media (max-width: 480px) {
  .dashboard-header {
    padding: var(--spacing-xs) var(--spacing-md);
  }

  .dashboard-content-wrapper {
    padding: var(--spacing-md);
  }
}
</style>
