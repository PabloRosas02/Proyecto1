//import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

//Imports from PrimeVue
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import 'primeicons/primeicons.css' //Icons

const app = createApp(App)

app.use(router)

app.use(PrimeVue, {
    theme :{
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: 'system',
            cssLayer: false // Intenta cambiar esto a false si los estilos no cargan
        }
    }
})

app.mount('#app')
