
<template>
  <div class="modal">
    <div class="modal__sidebar">
      <div class="modal__title">Настройки</div>
      <template v-if="hasSidebarSlot">
        <slot name="sidebar"></slot>
      </template>
      <template v-else>
        <div class="modal__tabs">
          <div class="modal__tab-head-item" v-for="(item, index) in tabsHeader" :key="index" @click="goto(item.name, true)" :class="{'modal__tab-head-item--active': hierarchy[0].current == item.name}">
            {{ getTabTitle(item) }}
          </div>
        </div>
      </template>
    </div>
    <div class="modal__content">
      <render />
      <div class="modal__footer" v-if="hasFooterSlot && !hasChildFooter">
        <slot name="mainFooter"></slot>
      </div>
    </div>
    <div class="modal__close">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="none">
          <path
              d="M15.6821 2.104L14.3696 0.791504L8.18213 6.979L1.99463 0.791504L0.682129 2.104L6.86963 8.2915L0.682129 14.479L1.99463 15.7915L8.18213 9.604L14.3696 15.7915L15.6821 14.479L9.49463 8.2915L15.6821 2.104Z"
              fill="#0A281A" />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, useSlots, computed, h, provide, onMounted } from 'vue'
import { useHierarchy, useCurrent, useAddItem, useClear, useHaveChildFooter } from '../composables/modal-store.js';

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
const hasChildFooter = ref(false)
const hierarchy = useHierarchy()
const defaultSlots = useSlots().default()
const slots = useSlots()

const hasSidebarSlot = computed(() => !!slots.sidebar)
const hasFooterSlot = computed(() => !!slots.mainFooter)

provide('hasMainFooter', hasFooterSlot)

const selectedTab = ref('')

const getOnlyComponentsInSlot = (slotsArray) => {
  return slotsArray.filter(item => item.type.__name == 'TabbedModalItem') || []
}

const getTabTitle = (item) => {
  if (item.title) return item.title
  if (item.name) return item.name

  return 'tab name'
}

selectedTab.value = getOnlyComponentsInSlot(defaultSlots)[0].props.name

useAddItem({
  current: getOnlyComponentsInSlot(defaultSlots)[0].props.name,
  parent: 'root'
})

const tabsHeader = computed(() => {
  return getOnlyComponentsInSlot(defaultSlots).map(item => {
    return {
      name: item.props.name,
      title: item.props.title
    }
  })
})

const render = () => {
  // key нужен чтоб контент таба переписывался корректно при переключении в навигации
  let comp = findComp(defaultSlots)
  hasChildFooter.value = useHaveChildFooter()
  return h('div', {key: comp.key}, comp)
};

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

const goto = (tabName, root = false) => {

  useAddItem({
    current: tabName,
    parent:  root ? 'root' : selectedTab.value,
    clearAll: root ? true : false
  })

  selectedTab.value = tabName
}

defineExpose({
  goto
})

</script>

<style lang="scss" scoped>

.modal {
  display: flex;
  // width: 800px;
  height: 520px;
  border-radius: 14px;
  overflow: hidden;
  color: #474747;
  position: relative;
  transform: translate(0);

  &__title {
    font-size: 16px;
    margin-bottom: 16px;
  }

  &__tab-head-item {
    font-size: 14px;
    transition-duration: 200ms;
    transition-delay: 20ms;
    transition-property: background-color;
    cursor: pointer;
    color: #5c5c5c;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 32px;
    border-radius: 7px;
    padding-left: 7px;
  }

  &__tab-head-item--active {
    cursor: default;
    background-color: #dce0e4;
    color: #333333;
  }  

  &__sidebar {
    min-width: 180px;
    width: 180px;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 14px;
    border-right: 1px solid rgb(219, 219, 219);
    background: #E9ECEF;
  }

  &__content {
    background-color: #f8f9fa;
    max-width: 100%;
    width: 520px;
    height: 100%;
    padding: 14px 16px;
    padding-bottom: 0;
  }

  &__close {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 24px;
    min-width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    height: 24px;
    transition: background-color 300ms ease;
    min-height: 24px;
    cursor: pointer;
  }

  &__close svg{
    width: 14px;
    height: 14px;
  }

  &__close:hover {
    background-color: #e63946;

    svg path {
      fill: #fff;
    }
  }
}

:deep(.modal__footer) {
  position: fixed;
  width: 100%;
  height: 66px;
  bottom: 0;
  display: flex;
  left: 0;
  padding-right: 21px;
  align-items: center;
  justify-content: flex-end;
  gap: 9px;
  z-index: 10;
}
</style>
