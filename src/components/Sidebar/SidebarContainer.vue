<template>
  <SidebarTabs v-if="props.sectionsMode ? (!props.history.length || windowWidth > 768) : true" :sections-mode="props.sectionsMode"
    :history="props.history" :current="props.current" :tabs-header="props.tabsHeader" @goto="gotoTab">
    <template v-if="hasSidebarSlot" #sidebar>
      <slot name="sidebar"></slot>
    </template>
  </SidebarTabs>
</template>

<script setup>
import SidebarTabs from './SidebarTabs.vue';
import { useWindowWidth } from '../../composables/useWindowWidth.js';
import { ref, useSlots, computed } from 'vue'
import { sharedProps } from '../../composables/sharedProps.js';

const slots = useSlots()

const windowWidth = useWindowWidth()
const emit = defineEmits(['goto'])

const hasSidebarSlot = computed(() => !!slots.sidebar)

const gotoTab = ({tabName, root = false}) => {
  emit('goto', {
    tabName: tabName, 
    root: root
  })
}

const props = defineProps({  
  ...sharedProps,
})
</script>

<style lang='scss' scoped></style>