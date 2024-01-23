<template>
  <div class="modal__sidebar" v-if="!props.simple" :class="{'sidebar-sections': props.sectionsMode}">
    <div class="modal__title" v-if="hasTitleSlot">
      <slot name="title"></slot>
    </div>
    <div class="modal__title" 
    :class="{
      'no-pan-mobile-45': !panMobile && (props.sectionsMode ? props.history.length : false),
      'no-pan-mobile-30': !panMobile && (props.sectionsMode ? false : props.history.length > 1)
      }" 
      v-else>{{ props.sectionsMode ? (windowWidth < 768 ?  props.currentTitle : props.title) : props.title }}</div>

    <div class="modal__sidebar-search" v-if="props.sidebarSearch && (windowWidth > 768 || (props.sectionsMode && !props.history.length))">
      <input type="search" v-model="searchValue" @keyup="search" name="sidebar_search" class="modal__sidebar-search-input" autocomplete="off" placeholder="Поиск...">
    </div>
    <SidebarContainer :sections-mode="props.sectionsMode" :history="props.history" :current="props.current" :tabs-header="props.tabsHeader" @goto="gotoTab">
      <template v-if="hasSidebarSlot" #sidebar>
        <slot name="sidebar"></slot>
      </template>
    </SidebarContainer>

  </div>
</template>

<script setup>
import SidebarContainer from './SidebarContainer.vue';
import { useWindowWidth } from '../../composables/useWindowWidth.js';
import { sharedProps } from '../../composables/sharedProps.js';
import { ref, useSlots, computed, inject } from 'vue'

const slots = useSlots()

const panMobile = inject('panMobile')

const searchValue = ref('')

const hasSidebarSlot = computed(() => !!slots.sidebar)
const hasTitleSlot = computed(() => !!slots.title)

const windowWidth = useWindowWidth()

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