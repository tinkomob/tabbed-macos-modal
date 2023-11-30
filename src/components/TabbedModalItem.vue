<template>
  <div>
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
    <div class="content">
      <render />
    </div>
    <div class="footer modal__footer" v-if="hasFooterSlot">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, useSlots, h, getCurrentInstance, ref, inject, provide, computed, defineEmits } from 'vue'

  const emit = defineEmits(['goback'])

  import { useHierarchy, useShift, useHaveChildFooter, useSetHaveChildFooter } from '../composables/modal-store.js';

  const slots = useSlots()
  const hasMainFooter = inject('hasMainFooter')
  const hasHeaderSlot = computed(() => !!slots.header)
  const hasFooterSlot = computed(() => !!slots.footer)

  useSetHaveChildFooter(hasFooterSlot.value)

  const defaultSlots = useSlots().default()
  
  const props = defineProps({
    name: String,
    title: String,
    headTitle: String
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
  };


  const goBack = (needEmit = true) => {
    useShift()
    if (needEmit) emit('goback')
  }

  defineExpose({
    goBack,
    defaultSlots
  })
</script>

<style lang='scss' scoped>
.header {
  display: flex;
  align-items: center;
  gap: 10px;

  &__title {
    display: flex;
    align-items: center;
    // font-family: "Roboto Bold", sans-serif;
    font-size: 16px;
    font-weight: 400;
    color: #474747;
  }
}

.go-back {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color .2s ease;

  &:hover {
    background-color: #dee2e6;
  }
}

.content {
  margin-top: 25px;
}

</style>