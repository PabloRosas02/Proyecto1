<template>
  <div class="manual-container">
    <!-- Con subtema seleccionado -->
    <div v-if="subtema" class="card">
      <!-- Header simplificado - sin duplicar el breadcrumb -->
      <div class="card-header">
        <h1 class="card-title">
          <span class="title-icon">📖</span>
          {{ subtema.titulo }}
        </h1>
        <div class="card-meta">
          <span class="meta-badge">{{ subtema.nombreTema }}</span>
          <span class="meta-date">{{ fechaActual }}</span>
        </div>
      </div>

      <div class="card-divider"></div>

      <div class="card-body markdown-body">
        <div v-html="contenidoFormateado"></div>
      </div>

      <div class="card-actions">
        <button @click="handleImprimir" class="action-btn">🖨️ Imprimir</button>
        <button @click="handleDescargar" class="action-btn">📥 Descargar</button>
      </div>
    </div>

    <!-- Sin subtema - Bienvenida -->
    <div v-else class="card welcome-card">
      <div class="welcome-icon">📚</div>
      <h2>Manuales de Maquinarias</h2>
      <p>Selecciona un manual del menú lateral para comenzar</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Subtema {
  id: number
  titulo: string
  contenido: string
  nombreTema?: string
}

const props = defineProps<{
  subtema?: Subtema | null
}>()

const fechaActual = ref(
  new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
)

const contenidoFormateado = computed(() => {
  if (!props.subtema?.contenido) return ''

  let contenido = props.subtema.contenido

  contenido = contenido.replace(/^# (.*)$/gm, '<h1>$1</h1>')
  contenido = contenido.replace(/^## (.*)$/gm, '<h2>$1</h2>')
  contenido = contenido.replace(/^### (.*)$/gm, '<h3>$1</h3>')
  contenido = contenido.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  contenido = contenido.replace(/^- (.*)$/gm, '<li>$1</li>')
  contenido = contenido.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
  contenido = contenido
    .split('\n\n')
    .map((para) => {
      if (para.trim() && !para.startsWith('<')) {
        return `<p>${para}</p>`
      }
      return para
    })
    .join('')

  return contenido
})

const handleImprimir = () => {
  window.print()
}

const handleDescargar = () => {
  const blob = new Blob([props.subtema?.contenido || ''], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${props.subtema?.titulo || 'manual'}.md`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.manual-container {
  width: 100%;
  min-height: 100%;
}

/* Asegurar que el header de la card esté alineado correctamente */
.card-header {
  margin-bottom: var(--spacing-xl);
}

.card-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--color-heading);
  margin: 0 0 var(--spacing-sm) 0;
}

.title-icon {
  font-size: calc(var(--font-size-2xl) + 4px);
}

.card-meta {
  display: flex;
  gap: var(--spacing-lg);
  align-items: center;
  flex-wrap: wrap;
}

/* Responsive */
@media (max-width: 768px) {
  .card-title {
    font-size: var(--font-size-xl);
  }

  .title-icon {
    font-size: calc(var(--font-size-xl) + 4px);
  }
}

@media (max-width: 480px) {
  .card-title {
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-xs);
  }

  .title-icon {
    font-size: calc(var(--font-size-lg) + 4px);
  }

  .card-meta {
    gap: var(--spacing-md);
  }
}
</style>
