<template>
  <div class="modal__child-item-header">
    <div class="modal__go-back" :class="{'modal__go-back--no-mobile-pan': !panMobile}" v-if="isChildItem" @click="goBack()">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="black"/>
      </svg>
    </div>
    <template v-if="hasHeaderSlot">
      <teleport :to="'#modal__custom-header-' + modalId" :disabled="windowWidth > 768" v-if="isMounted">
        <slot name="header"></slot>
      </teleport>
    </template>
    <template v-else>
      <span class="modal__child-item-header-title">{{ getHeadTitle }}</span>
    </template>
  </div>
  <div class="modal__child-item-content" ref="contentItem">
    <render />
  </div>
  <div class="footer modal__footer" v-if="hasFooterSlot && needFooter">
    <slot name="footer"></slot>
  </div>
</template>

<script setup>
  import { onMounted, useSlots, h, ref, inject, computed, onBeforeUnmount } from 'vue'

  const emit = defineEmits(['goback'])

  import { useWindowWidth } from '../composables/useWindowWidth.js';
  import { useHistory } from '../composables/useModalStore.js';

  const windowWidth = useWindowWidth()

  const slots = useSlots()
  const needFooter = inject('needFooter')
  const hasHeaderSlot = computed(() => !!slots.header)
  const hasFooterSlot = computed(() => !!slots.footer)
  const panMobile = inject('panMobile')
  const modalId = inject('modalId')
  const isSectionsMode = inject('isSectionsMode')

  const isMounted = ref(false)

  const history = useHistory(modalId)

  history.setChildFooter(hasFooterSlot.value, modalId)
  history.setCustomHeader(hasHeaderSlot.value && windowWidth.value < 768, modalId)
  
  const props = defineProps({
    name: String,
    title: String,
    headTitle: String
  })

  const contentItem = ref(null)
  const isChildItem = computed(() => {
    const localHistory = history.history.value.find(item => item.modalId == modalId)

    if (localHistory.history.length) {
      if (isSectionsMode && windowWidth.value < 768) return true
      if (localHistory.history[0].parent != 'root') return true
    }
    return false
  })

  const getHeadTitle = computed(() => {
    if (props.headTitle) return props.headTitle
    if (props.title) return props.title
    if (props.name) return props.name

    return 'Tab title'
  })

  
  const render = () => {
    let toRender = slots.default().filter(item => item.type.__name != 'TabbedModalItem')
    return h('div', {class: 'modal__inner-content' }, toRender)
  }
  

  const goBack = (needEmit = true) => {
    history.goBack(modalId) 
    history.setChildFooter(false, modalId)
    if (needEmit) emit('goback')
  }

  let touchstartX = 0
  let touchendX = 0
      
  const checkDirection = () => {
    if (touchendX < touchstartX && ((Math.abs(touchstartX - touchendX)) > 80)){
      const localHistory = history.history.value.find(item => item.modalId == modalId)
      if (isSectionsMode) goBack()
      if (localHistory.history.length > 1) goBack()
    } 
  }

  const touchstart = (e) => {
    touchstartX = e.changedTouches[0].screenX
  }

  const touchend = (e) => {
    touchendX = e.changedTouches[0].screenX
    checkDirection()
  }

  onMounted(() => {
    isMounted.value = true
    if (windowWidth.value < 768) {
      document.addEventListener('touchstart', touchstart)
      document.addEventListener('touchend', touchend)
    }
  })

  onBeforeUnmount(() => {
    if (windowWidth.value < 768) {
      document.removeEventListener('touchstart', touchstart)
      document.removeEventListener('touchend', touchend)
    }
  })
  defineExpose({
    goBack,
    defaultSlots: slots.default(),
    slotHeader: slots.header && typeof slots.header == 'function' ? slots.header() : []
  })
</script>

<style lang='scss' scoped src="../assets/tabbed-modal-item.scss"></style>