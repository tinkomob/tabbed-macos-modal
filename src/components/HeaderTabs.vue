<template>
  <div class="modal__tabs" :class="{ 'sections-mode': props.sectionsMode, 'h-scrollable': !props.sectionsMode }">
    <template v-if="!hasDefaultSlot">
      <div class="modal__tab-head-item" v-for="(item, index) in tabsHeader" :key="index" @click="goto(item.name, true)"
        :class="{ 'modal__tab-head-item--active': windowWidth > 768 ? tabIsActive(item.name) : !props.sectionsMode ? tabIsActive(item.name) : false }">
        {{ getTabTitle(item) }}
        <svg xmlns="http://www.w3.org/2000/svg" class="sections-mode__section-arrow" fill="#000000" width="16px"
          height="16px" viewBox="0 0 24 24" v-if="props.sectionsMode && windowWidth < 768">
          <g data-name="Layer 2">
            <g data-name="arrow-ios-forward">
              <rect width="24" height="24" transform="rotate(-90 12 12)" opacity="0" />
              <path
                d="M10 19a1 1 0 0 1-.64-.23 1 1 0 0 1-.13-1.41L13.71 12 9.39 6.63a1 1 0 0 1 .15-1.41 1 1 0 0 1 1.46.15l4.83 6a1 1 0 0 1 0 1.27l-5 6A1 1 0 0 1 10 19z" />
            </g>
          </g>
        </svg>
      </div>
    </template>
    <template v-else>
      <slot />
    </template>
  </div>
</template>

<script setup>
import { ref, useSlots, computed, h, provide, nextTick, onBeforeUnmount, getCurrentInstance, onUpdated } from 'vue'
import { useHierarchy, useShift, useSetHaveChildFooter, useWindowWidth } from '../composables/modal-store.js';

const slots = useSlots()
const windowWidth = useWindowWidth()
const hasDefaultSlot = computed(() => slots.default && !!slots.default())

const props = defineProps({
  sectionsMode: {
    type: Boolean,
    default: true
  },
  history: {
    type: Array,
    default: []
  },
  tabsHeader: {
    type: Array,
    default: []
  },
  current: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['goto'])

const goto = (tabName, root = false) => {
  emit('goto', {
    tabName: tabName,
    root: root
  })
}

const tabIsActive = (tabName) => {
  let root = props.history[props.history.length - 1]
  if (root) return root.current == tabName
  return props.current.current == tabName 
}

const getTabTitle = (item) => {
  if (item.title) return item.title
  if (item.name) return item.name

  return 'tab name'
}

</script>

<style lang='scss' src="../assets/header-tabs.scss" scoped></style>