<template>
  <aside
    class="sidebar"
    :class="{ 'sidebar-collapsed': isCollapsed, 'sidebar-mobile-open': isMobileOpen }"
  >
    <div class="sidebar-header">
      <button
        @click="toggleSidebar"
        class="toggle-btn"
        :title="isCollapsed ? 'Expandir' : 'Colapsar'"
      >
        {{ isCollapsed ? '☰' : '◀' }}
      </button>
      <h2 v-if="!isCollapsed" class="sidebar-title">Manuales</h2>
      <button v-if="isMobile && isMobileOpen" @click="closeMobileSidebar" class="close-mobile-btn">
        ✕
      </button>
    </div>

    <nav class="sidebar-nav">
      <div
        v-for="tema in manuales"
        :key="tema.id"
        class="sidebar-section"
        :class="{ 'has-subtemas': tema.subtemas.length > 0 }"
      >
        <div
          class="sidebar-tema"
          @click="toggleTema(tema.id)"
          :class="{ active: isTemaExpanded(tema.id) }"
        >
          <span class="tema-icon">{{ tema.icono }}</span>
          <span v-if="!isCollapsed" class="tema-titulo">{{ tema.titulo }}</span>
          <span v-if="!isCollapsed && tema.subtemas.length > 0" class="tema-arrow">
            {{ isTemaExpanded(tema.id) ? '▼' : '▶' }}
          </span>
        </div>

        <transition name="slide">
          <div v-if="isTemaExpanded(tema.id) && !isCollapsed" class="subtemas">
            <div
              v-for="subtema in tema.subtemas"
              :key="subtema.id"
              class="subtema"
              :class="{ selected: selectedSubtema?.id === subtema.id }"
              @click="selectSubtema(subtema, tema)"
            >
              <span class="subtema-titulo">{{ subtema.titulo }}</span>
            </div>
          </div>
        </transition>
      </div>
    </nav>

    <div v-if="isMobile && isMobileOpen" class="sidebar-overlay" @click="closeMobileSidebar"></div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { manualesData, type Tema, type Subtema } from '../data/manuales'

const props = defineProps<{
  selectedSubtema?: Subtema | null
}>()

const emit = defineEmits<{
  (e: 'subtema-seleccionado', subtema: Subtema & { nombreTema: string }): void
}>()

const isCollapsed = ref(false)
const isMobileOpen = ref(false)
const isMobile = ref(false)
const expandedTemas = ref(new Set<number>([1, 2, 3, 4, 5]))

const manuales = computed(() => manualesData)

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
  if (!isMobile.value) {
    isMobileOpen.value = false
  }
}

const toggleSidebar = () => {
  if (isMobile.value) {
    isMobileOpen.value = !isMobileOpen.value
  } else {
    isCollapsed.value = !isCollapsed.value
  }
}

const closeMobileSidebar = () => {
  isMobileOpen.value = false
}

const toggleTema = (temaId: number) => {
  if (expandedTemas.value.has(temaId)) {
    expandedTemas.value.delete(temaId)
  } else {
    expandedTemas.value.add(temaId)
  }
}

const isTemaExpanded = (temaId: number) => {
  return expandedTemas.value.has(temaId)
}

const selectSubtema = (subtema: Subtema, tema: Tema) => {
  const subtemaConTema = { ...subtema, nombreTema: tema.titulo }
  emit('subtema-seleccionado', subtemaConTema)
  if (isMobile.value) {
    closeMobileSidebar()
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
/* ============================================
   SIDEBAR PRINCIPAL
   ============================================ */

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--color-background-mute);
  border-right: 1px solid var(--color-border);
  overflow-y: auto;
  z-index: 1000;
  transition: width 0.2s ease;
}

.sidebar-collapsed {
  width: var(--sidebar-collapsed-width);
}

/* ============================================
   HEADER DEL SIDEBAR
   ============================================ */

.sidebar-header {
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  background: var(--color-background-mute);
  z-index: 10;
}

.sidebar-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  margin: 0;
  color: var(--color-heading);
}

/* ============================================
   BOTONES
   ============================================ */

.toggle-btn,
.close-mobile-btn {
  background: none;
  border: none;
  font-size: var(--font-size-base);
  cursor: pointer;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 6px;
  color: var(--color-text);
  transition: 0.15s ease;
}

.toggle-btn:hover,
.close-mobile-btn:hover {
  background: var(--color-border);
}

/* ============================================
   NAVEGACIÓN
   ============================================ */

.sidebar-nav {
  padding: var(--spacing-sm) 0;
}

.sidebar-section {
  position: relative;
  margin-bottom: var(--spacing-xs);
}

/* ============================================
   TEMA PRINCIPAL
   ============================================ */

.sidebar-tema {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text);
  transition: 0.15s ease;
  position: relative;
  z-index: 1;
}

.sidebar-tema:hover,
.sidebar-tema.active {
  background: var(--color-border);
  color: var(--color-heading);
}

.tema-icon {
  font-size: var(--font-size-base);
  min-width: 20px;
}

.tema-titulo {
  flex: 1;
}

.tema-arrow {
  font-size: var(--font-size-xs);
  transition: transform 0.15s;
}

.sidebar-tema.active .tema-arrow {
  transform: rotate(90deg);
}

/* ============================================
   SUBTEMAS
   ============================================ */

.subtemas {
  padding-left: calc(var(--spacing-2xl) + var(--spacing-xs));
}

.subtema {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-lg);
  cursor: pointer;
  font-size: var(--font-size-xs);
  color: var(--color-text);
  transition: 0.15s ease;
  border-radius: 4px;
  position: relative;
  z-index: 1;
}

.subtema:hover,
.subtema.selected {
  background: var(--color-border);
  color: var(--color-heading);
}

.subtema-titulo {
  flex: 1;
}

/* ============================================
   ANIMACIONES
   ============================================ */

.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* ============================================
   SCROLLBAR
   ============================================ */

.sidebar::-webkit-scrollbar {
  width: 4px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 4px;
}

/* ============================================
   ESTADO COLAPSADO
   ============================================ */

.sidebar-collapsed .sidebar-tema {
  justify-content: center;
  padding: var(--spacing-sm);
}

.sidebar-collapsed .tema-icon {
  font-size: var(--font-size-lg);
}

.sidebar-collapsed .sidebar-header {
  justify-content: center;
  padding: var(--spacing-md);
}

.sidebar-collapsed .toggle-btn {
  transform: rotate(180deg);
}

/* ============================================
   MÓVIL
   ============================================ */

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    width: var(--sidebar-width);
    transition: transform 0.2s ease;
  }

  .sidebar-mobile-open {
    transform: translateX(0);
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.15);
  }

  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
}

/* ============================================
   PREVENIR SELECCIÓN
   ============================================ */

.sidebar-tema,
.subtema,
.toggle-btn {
  user-select: none;
}
</style>
