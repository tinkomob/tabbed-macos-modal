<template>
  <div class="modal__sidebar" ref="sidebar" v-if="!props.simple" :class="{'sidebar-sections': props.sectionsMode, 'no-wrap': props.dynamicSidebarWidth}" :style="{width: calculatedSidebarWidth}">
    <div class="modal__title" v-if="hasTitleSlot">
      <slot name="title"></slot>
    </div>
    <div class="modal__title" 
    :class="{
      'no-pan-mobile-45': !panMobile && (props.sectionsMode ? props.history.length : false),
      'no-pan-mobile-30': !panMobile && (props.sectionsMode ? false : props.history.length > 1)
      }" 
      v-else>

      <div :id="'modal__custom-header-' + modalId"></div>
      <template v-if="!hasCustomHeader">
          {{ props.sectionsMode ? (windowWidth < 768 ?  props.currentTitle : props.title) : props.title }}
      </template>
    </div>

    <div class="modal__sidebar-search" v-if="props.sidebarSearch && (windowWidth > 768 || (props.sectionsMode && !props.history.length))">
      <input type="search" v-model="searchValue" @keyup="search" name="sidebar_search" class="modal__sidebar-search-input" autocomplete="off" :placeholder="props.searchPlaceholder">
    </div>
    <SidebarTabs  v-if="props.sectionsMode ? (!props.history.length || windowWidth > 768) : true" :sections-mode="props.sectionsMode"
      :history="props.history" :current="props.current" :tabs-sidebar="props.tabsSidebar" @goto="gotoTab">
      <template v-if="hasSidebarSlot" #sidebar>
        <slot name="sidebar"></slot>
      </template>
    </SidebarTabs>

  </div>
</template>

<script setup>
import SidebarTabs from './SidebarTabs.vue';
import { useWindowWidth } from '../../composables/useWindowWidth.js';
import { sharedProps } from '../../composables/sharedProps.js';
import { useUtils } from '../../composables/useUtils.js';
import { ref, useSlots, computed, inject } from 'vue'
import { useHistory } from '../../composables/useModalStore.js';

const modalId = inject('modalId')

const history = useHistory(modalId)

const slots = useSlots()
const utils = useUtils()

const windowWidth = useWindowWidth()

const panMobile = inject('panMobile')

const hasCustomHeader = computed(() => history.hasCustomHeader(modalId))

const searchValue = ref('')
const sidebar = ref(null)

const calculatedSidebarWidth = computed(() => {
  if (windowWidth.value > 768) {
    let width = 180
    if (!props.dynamicSidebarWidth) {
      width = utils.pxToNumber(props.sidebarWidth)
    }
    else {
      width = calculateSidebarWidth()
      const maxDynamicSidebarWidth = utils.pxToNumber(props.maxDynamicSidebarWidth)
      if (width > maxDynamicSidebarWidth) width = maxDynamicSidebarWidth
    }
    return utils.numberToPx(width)
  }

  return '100%'
})

function getTextWidth(text, font) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  context.font = font || getComputedStyle(document.body).font;

  return context.measureText(text).width;
}

const calculateSidebarWidth = () => {
  if (sidebar.value) {
    const tabs = sidebar.value.querySelectorAll('.modal__tab-content')

    if (tabs.length) {
      let arrayWidth = []
      for (const tab of Array.from(tabs)) {
        const { font } = getComputedStyle(tab);
        const width = getTextWidth(tab.innerText, font)
        arrayWidth.push(width)
      }
      const longestValue = Math.max(...arrayWidth)
      return longestValue + 50
    }
  }
  return 180
}

const hasSidebarSlot = computed(() => !!slots.sidebar)
const hasTitleSlot = computed(() => !!slots.title)


const search = () => {
  emit('search', searchValue.value)
}

const emit = defineEmits(['goto', 'search'])

const props = defineProps({
  ...sharedProps,
  sidebarSearch: {
    type: Boolean,
    default: true
  },
  currentTitle: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: 'Settings'
  }
})

const gotoTab = ({tabName, root = false}) => {
  emit('goto', {
    tabName: tabName, 
    root: root
  })
}

</script>

<style lang='scss' src="../../assets/sidebar.scss" scoped>
</style>