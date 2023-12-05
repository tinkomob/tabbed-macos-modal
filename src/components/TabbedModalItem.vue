<template>
  <div class="header">
    <div class="go-back" v-if="isChildItem" @click="goBack()">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="black"/>
      </svg>
    </div>
    <template v-if="hasHeaderSlot">
      <slot name="header"></slot>
    </template>
    <template v-else>
      <span class="header__title">{{ getHeadTitle }}</span>
    </template>
  </div>
  <div class="content" ref="contentItem">
    <render />
  </div>
  <div class="footer modal__footer" v-if="hasFooterSlot && needFooter">
    <slot name="footer"></slot>
  </div>
</template>

<script setup>
  import { onMounted, useSlots, h, getCurrentInstance, ref, inject, provide, computed } from 'vue'

  const emit = defineEmits(['goback'])

  import { useHierarchy, useShift, useSetHaveChildFooter } from '../composables/modal-store.js';

  const slots = useSlots()
  const needFooter = inject('needFooter')
  const hasHeaderSlot = computed(() => !!slots.header)
  const hasFooterSlot = computed(() => !!slots.footer)

  const modalId = inject('modalId')
  useSetHaveChildFooter(hasFooterSlot.value, modalId)

  const defaultSlots = useSlots().default()
  
  const props = defineProps({
    name: String,
    title: String,
    headTitle: String
  })

  const contentItem = ref(null)

  const isChildItem = computed(() => {
    const hItem = hierarchy.find(item => item.key == modalId)
    if (hItem.history.length) {
      if (hItem.history[0].parent != 'root') return hItem.history[0]
    }

    return false
  })

  const getHeadTitle = computed(() => {
    if (props.headTitle) return props.headTitle
    if (props.title) return props.title
    if (props.name) return props.name

    return 'Tab title'
  })

  const hierarchy = useHierarchy(modalId)
  
  const render = () => {
    let toRender = defaultSlots.filter(item => item.type.__name != 'TabbedModalItem')
    return h('div', {class: 'inner-content' }, toRender)
  }
  

  const goBack = (needEmit = true) => {
    useShift(modalId)
    if (needEmit) emit('goback')
  }

  onMounted(() => {
  })

  defineExpose({
    goBack,
    defaultSlots
  })
</script>

<style lang='scss' scoped src="../assets/tabbed-modal-item.scss"></style>