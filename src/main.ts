//import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';

import ToastService  from 'primevue/toastservice' //Esto es provicional, espara ver que el loguin es exitoso

//Imports from PrimeVue
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import 'primeicons/primeicons.css' //Icons

const app = createApp(App)

app.use(router)
app.component('Dialog', Dialog);
app.component('Dropdown', Dropdown);

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
app.use(ToastService) //Usar ToastService provicional

app.mount('#app')
