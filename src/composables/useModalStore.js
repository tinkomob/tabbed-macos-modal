import { ref } from 'vue'
import { useUtils } from './useUtils.js'

const history = ref([])
const utils = useUtils()

export function useHistory(modalId) {
  const modalExist = history.value.find(item => item.modalId == modalId)

  if (!modalExist) {
    history.value.push({
      modalId: modalId,
      history: [],
      hasChildFooter: false,
      hasCustomHeader: false,
      renderKey: utils.makeId(15)
    })
  }

  function findModal(key, needIdx = false) {
    const idx = history.value.findIndex(item => item.modalId == key)
    if (idx > -1) { 
      if (needIdx) return idx
      const historyValue = history.value[idx]
      return historyValue
    }
  }

  function generateRenderKey(oldKey) {
    let newKey = utils.makeId(15)
    if (oldKey != newKey) return newKey

    return generateRenderKey(oldKey)
  }

  function rerenderSlotContent (key) {
    const historyValue = findModal(key)
    historyValue.renderKey = generateRenderKey(historyValue.renderKey)
  }

  function addItem({ current = '', clearAll = false, key = '' }) {
    const historyValue = findModal(key)
    if (clearAll) {
      historyValue.history.splice(0)
    }

    const parent = historyValue.history.length ? historyValue.history[0].current : 'root' 

    if (current) historyValue.history.unshift({
      current: current,
      parent: parent
    })
  }

  function goBack(key) {
    const historyValue = findModal(key)
    return historyValue.history.shift()
  }

  function clear(key){
    const modalIdx = findModal(key, true)
    return history.value.splice(modalIdx, 1)
  }

  function setCurrentTitle(title, key) {
    const historyValue = findModal(key)
    return historyValue.history[0].title = title
  }

  function hasChildFooter(key) {
    const historyValue = findModal(key)
    return historyValue.hasChildFooter || false
  }

  function setChildFooter(value, key) {
    const historyValue = findModal(key)
    return historyValue.hasChildFooter = value
  }

  function hasCustomHeader(key) {
    const historyValue = findModal(key)
    return historyValue.hasCustomHeader || false
  }

  function setCustomHeader(value, key) {
    const historyValue = findModal(key)
    return historyValue.hasCustomHeader = value
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
    rerenderSlotContent   
  }
}