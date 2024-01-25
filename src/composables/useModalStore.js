import { ref } from 'vue'

const history = ref([])

export function useHistory(modalId) {
  const modalExist = history.value.find(item => item.modalId == modalId)

  if (!modalExist) {
    history.value.push({
      modalId: modalId,
      history: [],
      hasChildFooter: false,
      hasCustomHeader: false,
    })
  }

  function addItem({ current = '', clearAll = false, key = '' }) {
    const idx = history.value.findIndex(item => item.modalId == key)
    if (idx > -1) { 
      if (clearAll) {
        history.value[idx].history.splice(0)
      }

      const parent = history.value[idx].history.length ? history.value[idx].history[0].current : 'root' 

      if (current) history.value[idx].history.unshift({
        current: current,
        parent: parent
      })
    }
  }

  function goBack(key) {
    const idx = history.value.findIndex(item => item.modalId == key)
    if (idx > -1) history.value[idx].history.shift()
  }

  function clear(key){
    const idx = history.value.findIndex(item => item.modalId == key)
    if (idx > -1) history.value[idx].history.splice(idx, 1)
  }

  function setCurrentTitle(title, key) {
    const idx = history.value.findIndex(item => item.modalId == key)
    if (idx > -1) {
      return history.value[idx].history[0].title = title
    }
  }

  function hasChildFooter(key) {
    const idx = history.value.findIndex(item => item.modalId == key)
    if (idx > -1) {
      return history.value[idx].hasChildFooter || false
    }

  }

  function setChildFooter(value, key) {
    const idx = history.value.findIndex(item => item.modalId == key)
    if (idx > -1) {
      history.value[idx].hasChildFooter = value
    }
  }

  function hasCustomHeader(key) {
    const idx = history.value.findIndex(item => item.modalId == key)
    if (idx > -1) {
      return history.value[idx].hasCustomHeader || false
    }

  }

  function setCustomHeader(value, key) {
    const idx = history.value.findIndex(item => item.modalId == key)
    if (idx > -1) {
      history.value[idx].hasCustomHeader = value
    }
  }

  return {
    addItem,
    clear,
    history,
    goBack,
    setCurrentTitle,
    hasChildFooter,
    setChildFooter,
    setCustomHeader,
    hasCustomHeader,
  }
}