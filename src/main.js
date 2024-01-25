import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import TabbedModal from 'tabbed-macos-modal'
import 'tabbed-macos-modal/dist/style.css'

const app = createApp(App)

app.use(TabbedModal)

app.mount('#app')
