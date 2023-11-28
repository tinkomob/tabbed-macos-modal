
<template>
  <div class="modal">
    <div class="modal__tabs">
      <div class="modal__tab-head-item" v-for="(item, index) in tabsHeader" :key="index" @click="openTab(item)">
        {{ item }}
      </div>
    </div>
    <div class="modal__content">
      <render />
      <!-- <slot /> -->
    </div>
  </div>
</template>

<script setup>
import { ref, useSlots, computed, h } from 'vue'
import TabbedModalItem from './TabbedModalItem.vue';


const slots = useSlots().default().map((item, idx) => { 
  item.key = `${idx + 1}`
  return item
})

const selectedTab = ref(0)

const tabsHeader = computed(() => {
  return slots.map(item => item.props.name)
})

const render = () => {
  // key нужен чтоб контент таба переписывался корректно при переключении в навигации
  let comp = slots[selectedTab.value]
  // console.log(comp.component)
  // console.log(comp)
  // comp.component.exposed.slots = comp.component.exposed.slots.filter(item => item.type.__name != "TabbedModalItem")
  // console.log(comp)
  return h('div', {key: comp.key}, comp)
};

const openTab = (tabName) => {
  let idx = slots.findIndex(item => item.props.name == tabName)
  selectedTab.value = idx
}

const goto = (tabName) => {
  slots[selectedTab.value].props.openedChild = tabName
  console.log(slots[selectedTab.value])
  // console.log()
  // console.log(tabName)
}

const name = () => {
  return 
}

defineExpose({
  goto
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
