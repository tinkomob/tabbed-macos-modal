
<template>
  <div class="modal">
    <div class="modal__tabs" v-if="hasSidebarSlot">
      <slot name="sidebar"></slot>
    </div>
    <div class="modal__tabs" v-else>
      <div class="modal__tab-head-item" v-for="(item, index) in tabsHeader" :key="index" @click="openTab(item)">
        {{ item }}
      </div>
    </div>
    <div class="modal__content">
      <render />
      <p>{{ hierarchy }}</p>
      <!-- <slot /> -->
    </div>
  </div>
</template>

<script setup>
import { ref, useSlots, computed, h, provide, onMounted } from 'vue'
import { useHierarchy, useCurrent, useAddItem, useClear } from '../composables/modal-store.js';

const makeid = (length) => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

useClear()
const hierarchy = useHierarchy()

const defaultSlots = useSlots().default()
const slots = useSlots()

const hasSidebarSlot = computed(() => !!slots.sidebar)

const selectedTab = ref('')

const getOnlyComponentsInSlot = (slotsArray) => {
  return slotsArray.filter(item => item.type.__name == 'TabbedModalItem') || []
}

selectedTab.value = getOnlyComponentsInSlot(defaultSlots)[0].props.name

useAddItem({
  current: getOnlyComponentsInSlot(defaultSlots)[0].props.name,
  parent: 'root'
})


const tabsHeader = computed(() => {
  return defaultSlots.map(item => item.props.name)
})

const render = () => {
  // key нужен чтоб контент таба переписывался корректно при переключении в навигации
  let comp = findComp(defaultSlots)
  return h('div', {key: comp.key}, comp)
};

const openTab = (tabName) => {
  useAddItem({
    current: tabName,
    parent: 'root',
    clearAll: true
  })
  selectedTab.value = tabName
}

const findComp = (slotsArray) => {
  slotsArray = getOnlyComponentsInSlot(slotsArray)
  for (let slot of slotsArray) {
    if (slot.props.name == hierarchy[0].current) {
      slot.key = makeid(10)
      return slot
    }
    
    if (slot.component?.exposed?.defaultSlots) {
      let slotSub = findComp(slot.component.exposed.defaultSlots)
      if (slotSub) return slotSub
    } 
  }
}

const goto = (tabName) => {
  useAddItem({
    current: tabName,
    parent: selectedTab.value
  })
  selectedTab.value = tabName
}

defineExpose({
  goto,
  openTab
})

</script>

<style lang="scss" scoped>

.modal {
  &__tabs {
    background: #fff;
    display: flex;
    gap: 15px;
  }
  &__tab-head-item {
    color: #000;
    padding: 15px;
  }

  &__tab-head-item:hover {
    background: rgb(56, 56, 56);
    color: #fff;
    cursor: pointer;
  }
}
</style>
