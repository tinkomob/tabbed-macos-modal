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
  <div class="content" ref="contentItem" :style="contentStyles">
    <render />
  </div>
  <div class="footer modal__footer" v-if="hasFooterSlot && needFooter">
    <slot name="footer"></slot>
  </div>
</template>

<script setup>
  import { onMounted, useSlots, h, getCurrentInstance, ref, inject, provide, computed } from 'vue'

  const emit = defineEmits(['goback'])

  import { useHierarchy, useShift, useHaveChildFooter, useSetHaveChildFooter } from '../composables/modal-store.js';

  const slots = useSlots()
  const needFooter = inject('needFooter')
  const hasHeaderSlot = computed(() => !!slots.header)
  const hasFooterSlot = computed(() => !!slots.footer)

  useSetHaveChildFooter(hasFooterSlot.value)

  const defaultSlots = useSlots().default()
  
  const props = defineProps({
    name: String,
    title: String,
    headTitle: String
  })

  const contentHeight = ref(0)
  const contentItem = ref(null)

  const contentStyles = computed(() => {
    return {
      height: contentHeight.value + 'px'
    }
  })


  const isChildItem = computed(() => {
    if (hierarchy.length) {
      if (hierarchy[0].parent != 'root') return hierarchy[0]
    }

    return false
  })

  const getHeadTitle = computed(() => {
    if (props.headTitle) return props.headTitle
    if (props.title) return props.title
    if (props.name) return props.name

    return 'Tab title'
  })

  const hierarchy = useHierarchy()
  
  const render = () => {
    let toRender = defaultSlots.filter(item => item.type.__name != 'TabbedModalItem')
    return h('div', {}, toRender)
  }

  const goBack = (needEmit = true) => {
    useShift()
    if (needEmit) emit('goback')
  }

  onMounted(() => {
    const modalParentDiv = contentItem.value.closest('.modal__content')
    if (modalParentDiv) {
      const modalContentHeight = modalParentDiv.getBoundingClientRect()?.height
      const footerHeight = modalParentDiv.querySelector('.modal__footer')?.getBoundingClientRect()?.height || 0
      const itemContentMarginTop = Number(getComputedStyle(modalParentDiv.querySelector('.content'))?.marginTop.replace('px', '')) || 0
      const headerHeight = modalParentDiv.querySelector('.header')?.getBoundingClientRect()?.height || 0

      contentHeight.value = modalContentHeight - footerHeight - headerHeight - itemContentMarginTop
    }
  })

  defineExpose({
    goBack,
    defaultSlots
  })
</script>

<style lang='scss' scoped src="../assets/tabbed-modal-item.scss"></style>