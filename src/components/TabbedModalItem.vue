<template>
  <div>
    <h3 v-if="hasHeaderSlot">
      <slot name="header"></slot>
    </h3>
    <render />
    <p class="go-back" style="background: red; color: #fff; padding: 5px 15px;" v-if="isChildItem" @click="goBack()">Назад к  {{ isChildItem.parent }}</p>
  </div>
</template>

<script setup>
  import { onMounted, useSlots, h, getCurrentInstance, ref, inject, provide, computed, defineEmits } from 'vue'

  const emit = defineEmits(['goback'])

  import { useHierarchy, useShift } from '../composables/modal-store.js';

  const slots = useSlots()

  const hasHeaderSlot = computed(() => !!slots.header)

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

  const hierarchy = useHierarchy()
  
  const render = () => {
    let childTabs = defaultSlots.filter(item => item.type.__name == 'TabbedModalItem')
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
</style>