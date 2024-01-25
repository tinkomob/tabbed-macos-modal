import TabbedModal from '../src/components/TabbedModal.vue'
import TabbedModalItem from '../src/components/TabbedModalItem.vue'

export default {
  install: (app, options) => {
    app.component('TabbedModal', TabbedModal)
    app.component('TabbedModalItem', TabbedModalItem)
  }
}