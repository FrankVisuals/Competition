import { createApp } from "vue"
import { createPinia } from "pinia"

import App from "./App.vue"
import router from "./router"
import bus from "./util/bus"
import { auth } from "./util/firebase"
import { useAuthStore } from "./stores/auth"

import "./styles/main.less"

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.config.globalProperties.bus = bus
app.mount("#app")

const authStore = useAuthStore()

auth.onAuthStateChanged((user) => {
  authStore.initialize(user)
})
