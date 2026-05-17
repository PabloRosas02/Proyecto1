// src/data/manuales.ts
export interface Subtema {
  id: number
  titulo: string
  contenido: string
}

export interface Tema {
  id: number
  titulo: string
  icono: string
  subtemas: Subtema[]
}

export const manualesData: Tema[] = [
  {
    id: 1,
    titulo: 'Introducción',
    icono: '📘',
    subtemas: [
      { id: 11, titulo: 'Bienvenida', contenido: 'Bienvenido a la documentación de maquinarias. Este manual te guiará en el uso correcto de todas las máquinas disponibles.' },
      { id: 12, titulo: 'Requisitos del sistema', contenido: '**Requisitos mínimos:**\n- Sistema operativo: Windows 10 o superior\n- RAM: 8GB mínimo\n- Espacio en disco: 500MB\n\n**Requisitos recomendados:**\n- RAM: 16GB\n- SSD: 1GB de espacio' }
    ]
  },
  {
    id: 2,
    titulo: 'Maquinaria Pesada',
    icono: '🏗️',
    subtemas: [
      { id: 21, titulo: 'Excavadoras', contenido: '# Manual de Excavadoras\n\n## Encendido\n1. Verificar niveles de aceite\n2. Revisar sistema hidráulico\n3. Encender motor\n\n## Operación básica\n- Usar los controles con suavidad\n- Mantener velocidad constante\n- Evitar movimientos bruscos' },
      { id: 22, titulo: 'Bulldozers', contenido: '# Manual de Bulldozers\n\n## Pre-operación\n- Inspección visual\n- Verificar orugas\n- Revisar sistema de enfriamiento\n\n## Durante la operación\n- Mantener distancia segura\n- Usar cinturón de seguridad\n- Atención a señalizaciones' },
      { id: 23, titulo: 'Grúas', contenido: '# Manual de Grúas\n\n## Capacidades máximas\n- Capacidad de carga: 50 toneladas\n- Altura máxima: 30 metros\n- Radio de acción: 25 metros\n\n## Procedimientos de seguridad\n1. Calcular peso de carga\n2. Verificar estabilidad\n3. Señalizar área de trabajo' }
    ]
  },
  {
    id: 3,
    titulo: 'Maquinaria Agrícola',
    icono: '🚜',
    subtemas: [
      { id: 31, titulo: 'Tractores', contenido: '# Manual de Tractores\n\n## Mantenimiento diario\n- Revisar niveles de combustible\n- Verificar presión de neumáticos\n- Limpiar radiador\n\n## Uso seguro\n- Usar ROPS (estructura antivuelco)\n- Mantener PTO protegido\n- No realizar giros bruscos' },
      { id: 32, titulo: 'Cosechadoras', contenido: '# Manual de Cosechadoras\n\n## Configuración inicial\n- Ajustar altura de corte\n- Calibrar sistema de limpieza\n- Configurar velocidad de avance\n\n## Optimización\n- Monitorear pérdidas\n- Ajustar según cultivo\n- Mantener cuchillas afiladas' }
    ]
  },
  {
    id: 4,
    titulo: 'Mantenimiento',
    icono: '🔧',
    subtemas: [
      { id: 41, titulo: 'Mantenimiento preventivo', contenido: '# Mantenimiento Preventivo\n\n## Programa semanal\n- **Lunes:** Lubricación general\n- **Miércoles:** Revisión de filtros\n- **Viernes:** Inspección de correas\n\n## Programa mensual\n- Cambio de aceite\n- Revisión de frenos\n- Calibración de instrumentos' },
      { id: 42, titulo: 'Solución de problemas', contenido: '# Solución de Problemas Comunes\n\n## El motor no arranca\n1. Verificar batería\n2. Revisar combustible\n3. Inspeccionar fusibles\n\n## Sobrecalentamiento\n- Revisar nivel de refrigerante\n- Limpiar radiador\n- Verificar ventilador\n\n## Vibraciones anormales\n- Balancear componentes\n- Revisar soportes\n- Alinear ejes' }
    ]
  },
  {
    id: 5,
    titulo: 'Seguridad',
    icono: '⚠️',
    subtemas: [
      { id: 51, titulo: 'Normas de seguridad', contenido: '# Normas Generales de Seguridad\n\n## Obligatorio\n- Usar EPP completo\n- Respetar señalización\n- Mantener áreas limpias\n\n## Prohibido\n- Operar bajo influencia de alcohol\n- Usar equipos sin entrenamiento\n- Bloquear dispositivos de seguridad' },
      { id: 52, titulo: 'Equipo de protección', contenido: '# Equipo de Protección Personal (EPP)\n\n## Elementos requeridos\n- **Casco** de seguridad\n- **Gafas** de protección\n- **Guantes** resistentes\n- **Botas** con punta de acero\n- **Chaleco** reflectante\n- **Protectores** auditivos\n\n## Mantenimiento del EPP\n- Inspeccionar antes de usar\n- Limpiar regularmente\n- Reemplazar cuando esté dañado' }
    ]
  }
]