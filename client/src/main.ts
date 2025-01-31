import { createAuth0 } from '@auth0/auth0-vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { auth0Config } from './config'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const app = createApp(App)

app.use(
  createAuth0({
    domain: auth0Config.domain,
    clientId: auth0Config.clientId,
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: auth0Config.audience,
    },
  })
)

app.component('VueDatePicker', VueDatePicker)

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.mount('#app')
