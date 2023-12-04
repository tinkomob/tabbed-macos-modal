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

  const contentHeight = ref(0)
  const contentItem = ref(null)

  const contentStyles = computed(() => {
    return {
      height: contentHeight.value + 'px'
    }
  })

  const styleToString = (style) => {
      return Object.keys(style).reduce((acc, key) => (
          acc + key.split(/(?=[A-Z])/).join('-').toLowerCase() + ':' + style[key] + ';'
      ), '');
  };

  const innerContentStyles = computed(() => {
    let styles = {
      // height: contentHeight.value + 'px'
      height: 500 + 'px'
    }
    console.log(styleToString(styles))
    return styleToString(styles)
  })


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
    setTimeout(() => {
      setHeight()
      // contentHeight.value = innerContent
    }, 1);
    // console.log()
    return h('div', {class: 'inner-content' }, toRender)
  }
  
  const setHeight = () => {
    // console.log('e')
    let resultHeight = 0 // каждый раз обнуляетя, может как-то сохранять предыдущее значение
    const innerContent = contentItem.value.querySelector('.inner-content')
    const innerContentHeight = innerContent?.getBoundingClientRect().height
    const viewportHeight = window.innerHeight

    resultHeight = innerContentHeight
    const modalParentDiv = contentItem.value.closest('.modal__content')
    if (modalParentDiv) {
      const modalDiv = contentItem.value.closest('.modal')
      const footerHeight = modalParentDiv.querySelector('.modal__footer')?.getBoundingClientRect()?.height || 0
      const sidebarHeight = modalDiv.querySelector('.modal__sidebar')?.getBoundingClientRect()?.height || 0
      const panHeight = modalDiv.querySelector('.pan')?.getBoundingClientRect()?.height || 0
      const headerHeight = modalParentDiv.querySelector('.header')?.getBoundingClientRect()?.height || 0

      if ((document.documentElement.clientWidth < 768)) {
        if (resultHeight > 700) resultHeight = 700
      }
      else {
        if (resultHeight > 500) resultHeight = 500
      }

      resultHeight = resultHeight - footerHeight - headerHeight - sidebarHeight - panHeight
      resultHeight = Math.abs(resultHeight)
      contentHeight.value = resultHeight + footerHeight
    }
    console.log(resultHeight)
    innerContent.style.height = resultHeight + 'px'
    return 
  }

  const goBack = (needEmit = true) => {
    useShift(modalId)
    if (needEmit) emit('goback')
  }

  onMounted(() => {
    // const modalParentDiv = contentItem.value.closest('.modal__content')
    // const modalDiv = contentItem.value.closest('.modal')
    // const viewportHeight = window.innerHeight
    // if (modalParentDiv) {
    //   const modalContentHeight = modalParentDiv.getBoundingClientRect()?.height
    //   const footerHeight = modalParentDiv.querySelector('.modal__footer')?.getBoundingClientRect()?.height || 0
    //   const itemContentMarginTop = Number(getComputedStyle(modalParentDiv.querySelector('.content'))?.marginTop.replace('px', '')) || 0
    //   const headerHeight = modalParentDiv.querySelector('.header')?.getBoundingClientRect()?.height || 0
    //   const innerContentHeight = contentItem.value.querySelector('.inner-content')?.getBoundingClientRect().height
    //   contentHeight.value = innerContentHeight
    //   // contentHeight.value = modalContentHeight - footerHeight - headerHeight - itemContentMarginTop
    //   if ((document.documentElement.clientWidth < 768)) {
    //     const tabContainerHeight = modalDiv.querySelector('.modal__tabs')?.getBoundingClientRect()?.height || 0
    //     // contentHeight.value -= tabContainerHeight

    //     if (contentHeight.value > 700) contentHeight.value = 700
    //   }
    //   else {
    //     if (contentHeight.value > 500) contentHeight.value = 500
    //   }

    //   contentHeight.value = contentHeight.value - footerHeight - headerHeight - itemContentMarginTop
    //     // console.log(contentHeight.value)
    // }
  })

  defineExpose({
    goBack,
    defaultSlots
  })
</script>

<style lang='scss' scoped src="../assets/tabbed-modal-item.scss"></style>