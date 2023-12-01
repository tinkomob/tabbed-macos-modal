
<template>
  <div class="modal-item" :class="{opened: modalOpened, closed: modalOpened === false, moving: moving}" @mousedown="clickOnBottomSheet" 
    @touchstart="clickOnBottomSheet">
    <div class="modal-item__backdrop" />
    <div class="modal" ref="modal" :style="modalStyles">
      <div ref="pan" class="pan" v-if="props.pan">
          <div class="pan__bar"></div>
      </div>
      <div class="modal__container">
        <div class="modal__sidebar" v-if="props.mode == 'tabbed'">
          <div class="modal__title" v-if="!hasTitleSlot">{{ props.title }}</div>
          <div class="modal__title" v-else>
            <slot name="title"></slot>
          </div>
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
          <div class="modal__title" v-if="props.mode == 'simple'">
            <template v-if="!hasTitleSlot">
              {{ props.title }}
            </template>
            <template v-else>
              <slot name="title"></slot>
            </template>
          </div>
          <render />
          <div class="modal__footer" v-if="hasFooterSlot && !hasChildFooter && props.needFooter">
            <slot name="mainFooter"></slot>
          </div>
        </div>
        <div class="modal__close" @click="close()">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="none">
              <path
                  d="M15.6821 2.104L14.3696 0.791504L8.18213 6.979L1.99463 0.791504L0.682129 2.104L6.86963 8.2915L0.682129 14.479L1.99463 15.7915L8.18213 9.604L14.3696 15.7915L15.6821 14.479L9.49463 8.2915L15.6821 2.104Z"
                  fill="#0A281A" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, useSlots, computed, h, provide, onMounted, nextTick, onBeforeUnmount } from 'vue'
import { useHierarchy, useCurrent, useAddItem, useClear, useHaveChildFooter } from '../composables/modal-store.js';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock-upgrade';
import Hammer from "hammerjs";

const makeid = (length) => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const emit = defineEmits(['close', 'opened'])

// -------------------------------------

const modal = ref(null)
const modalOpened = ref(false)
const moving = ref(false)
const topOffset = ref(300)
let topOffsetInit = 0
const bottomOffset = ref('unset')

const modalStyles = computed(() => {
  return {
    bottom: bottomOffset.value == 'unset' ? bottomOffset.value : bottomOffset.value + 'px',
    top: topOffset.value == 'unset' ? topOffset.value : topOffset.value + 'px'
  }
})

const hammer = {
    pan: null,
    content: null,
}

onBeforeUnmount(() => {
    hammer.pan?.destroy();
    hammer.content?.destroy();
    enableOverflow()
});

const init = async () => {
  await nextTick()

  initHammer()

  open()

}

const initHammer = () => {
  const panOptions = {
    recognizers: [
      [Hammer.Pan, { direction: Hammer.DIRECTION_VERTICAL }],
    ],
  }
  hammer.pan = new Hammer(pan.value, panOptions)
  if (hammer.pan) {
    hammer.pan.on("panstart panup pandown panend", (e) => {
      move(e, "pan");
    })
  }
}

let contentScroll = 0;

const move = (event, type) => {
  const delta = -event.deltaY;
  if (
    (type === "content" && event.type === "panup") ||
    (type === "content" && event.type === "pandown" && contentScroll > 0)
  ) {
    modal.value.scrollTop = contentScroll + delta;
  } else if (event.type === "panup" || event.type === "pandown") {
    moving.value = true;
    if (event.deltaY > 0) {
      topOffset.value = 'unset'
      bottomOffset.value = topOffsetInit + delta;
    }
  }
  if (event.isFinal) {
    contentScroll = modal.value.scrollTop;
    moving.value = false;
    if (bottomOffset.value < 30) {
      bottomOffset.value = 0;
      close()
    } else {
      bottomOffset.value = 'unset';
      topOffset.value = topOffsetInit
    }
  }
}

const enableOverflow = () => {
    setTimeout(() => {
        let openedModalsList = document.getElementsByClassName("modal-item opened");
        if (!openedModalsList.length) {
            let body = document.querySelector('.app-body')
            enableBodyScroll(body);
            document.documentElement.style.overflow = 'auto'
            document.documentElement.style.overflowY = 'auto'
            
            body.style.overflow = 'auto'
            body.style.overflowY = 'auto'
            document.body.style.removeProperty('overflow')
        }
    }, 60);
}

const disableOverflow = () => {
  let openedModalsList = document.getElementsByClassName("modal-item opened");
  if (!openedModalsList.length) {
    let body = document.querySelector('.app-body')
    disableBodyScroll(body, { allowTouchMove: () => true });
    document.documentElement.style.overflow = 'hidden'
    document.documentElement.style.overflowY = 'hidden'
    body.style.overflow = 'hidden'
    body.style.overflowY = 'hidden'
  }

}

const open = () => {
  disableOverflow()
  modalOpened.value = true;

  setTimeout(() => {
    topOffset.value = (window.innerHeight - modal.value.clientHeight) / 2
    topOffsetInit = topOffset.value
  }, 15);

  emit("opened");
};

const close = () => {
  enableOverflow()
  emit('close')
}

const clickOnBottomSheet = (event) => {
  const target = event.target
  if (target.classList.contains('modal-item__backdrop')) {
    close()
  }
}

init()

// -------------------------------------

useClear()

const props = defineProps({
  mode: {
    type: String,
    default: 'tabbed'
  },
  needFooter: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: 'Default Title'
  },
  pan: {
    type: Boolean,
    default: true
  }
})

const hasChildFooter = ref(false)
const hierarchy = useHierarchy()
const slots = useSlots()
const defaultSlots = slots.default()

const hasSidebarSlot = computed(() => !!slots.sidebar)
const hasTitleSlot = computed(() => !!slots.title)
const hasFooterSlot = computed(() => !!slots.mainFooter)

provide('needFooter', props.needFooter)

const selectedTab = ref('')
const pan = ref(null)

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
  if (props.mode == 'simple') {
    return h('div', defaultSlots.filter(item => item.type.__name != 'TabbedModalItem'))
  }

  let comp = findComp(defaultSlots)
  hasChildFooter.value = useHaveChildFooter(props.needFooter)
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

<style lang="scss" scoped src="../assets/tabbed-modal.scss"></style>