import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import event from './event'
import Notifications from '@kyvg/vue3-notification'

const app = createApp(App)

app.config.globalProperties.$event = event

app.use(router)
app.use(Notifications)

app.mount('#app')
