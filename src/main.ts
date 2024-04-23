import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import event from './event'

const app = createApp(App)

app.config.globalProperties.$event = event

app.use(router)

app.mount('#app')
