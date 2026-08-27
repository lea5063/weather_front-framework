import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { ElButton, ElCard } from 'element-plus'
import 'element-plus/es/components/base/style/css'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/card/style/css'
import 'element-plus/es/components/message/style/css'

import App from './App.vue'
import router from './router/index.js'

const pinia = createPinia()

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(ElButton)
app.use(ElCard)
app.mount('#app')
