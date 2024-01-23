
<template>
  <div class="modal-item" :class="{opened: modalOpened, closed: modalOpened === false, moving: moving}" @mousedown="clickOnBottomSheet" 
    @touchstart="clickOnBottomSheet">
    <div class="modal-item__backdrop" />
    <div class="modal" ref="modal" :style="modalStyles" :class="{moving: moving}">
      <div ref="pan" class="pan" v-if="(props.panDesktop && windowWidth > 768) || (props.panMobile && windowWidth < 768)">
          <div class="pan__bar"></div>
      </div>
      <div class="modal__container">
        <Sidebar 
          v-if="!props.simple" 
          :history="currentHistory" 
          :current="current" 
          :tabs-header="tabsHeader" 
          :sidebar-search="props.sidebarSearch"
          @goto="gotoTab" 
          @search="search"
          :sections-mode="props.sectionsMode" 
          :current-title="currentTitle" 
          :title="props.title"
        >
          <template v-if="hasTitleSlot" #title>
            <slot name="title"></slot>
          </template>

          <template v-if="hasSidebarSlot" #sidebar>
            <slot name="sidebar"></slot>
          </template>

        </Sidebar>
        <div class="modal__content" :class="{'modal__content-simple': props.simple}">
          <div class="modal__title" v-if="props.simple" :class="{'modal__title-simple': props.simple}">
            <template v-if="!hasTitleSlot">
              {{ props.title }}
            </template>
            <template v-else>
              <slot name="title"></slot>
            </template>
          </div>
          <render/>
          <div class="modal__footer" v-if="hasFooterSlot && !hasChildFooter && props.needFooter">
            <slot name="mainFooter"></slot>
          </div>
        </div>
        <div class="modal__close" @click="close()" v-if="props.needCloseIcon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="none">
            <path d="M15.6821 2.104L14.3696 0.791504L8.18213 6.979L1.99463 0.791504L0.682129 2.104L6.86963 8.2915L0.682129 14.479L1.99463 15.7915L8.18213 9.604L14.3696 15.7915L15.6821 14.479L9.49463 8.2915L15.6821 2.104Z" fill="#0A281A" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, useSlots, computed, h, provide, nextTick, onBeforeUnmount, onUpdated } from 'vue'
import { useUtils } from '../composables/useUtils.js';
import { useWindowWidth } from '../composables/useWindowWidth.js';
import { useHistory } from '../composables/useModalStore.js';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock-upgrade';
import Hammer from "hammerjs";
import Sidebar from './Sidebar/Sidebar.vue';

const props = defineProps({
  sidebarSearch: {
    type: Boolean,
    default: false
  },
  simple: {
    type: Boolean,
    default: false
  },
  sectionsMode: {
    type: Boolean,
    default: true
  },
  openFirstSection: {
    type: Boolean,
    default: false
  },
  needFooter: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: 'Default Title'
  },
  panDesktop: {
    type: Boolean,
    default: true
  },
  panMobile: {
    type: Boolean,
    default: true
  },
  height: {
    type: Number,
    default: 500
  },
  needCloseIcon: {
    type: Boolean,
    default: true
  }
})

const utils = useUtils()

const modalId = utils.makeId(15)

const slots = useSlots()

const hasSidebarSlot = computed(() => !!slots.sidebar)
const hasTitleSlot = computed(() => !!slots.title)
const hasFooterSlot = computed(() => !!slots.mainFooter)

const hammer = {
    pan: null,
    content: null,
}

provide('needFooter', props.needFooter)
provide('panMobile', props.panMobile)
provide('modalId', modalId)
provide('isSectionsMode', props.sectionsMode)

const history = useHistory(modalId)

const emit = defineEmits(['close', 'opened'])

const pan = ref(null)
const searchValue = ref('')

const modal = ref(null)
const modalOpened = ref(false)
const moving = ref(false)
const modalHeight = ref(props.height)
const windowWidth = useWindowWidth(true)
const initTabsHeight = ref('')

const bottomOffset = ref('unset')
let bottomOffsetInit = 0

const init = async () => {
  await nextTick()
  initHammer()
  open()
}

onUpdated(() => {
  callAfterRender()
})

onBeforeUnmount(() => {
    hammer.pan?.destroy();
    hammer.content?.destroy();
    enableOverflow()
    history.clear(modalId)
});

const callAfterRender = async () => {
  await nextTick()
  if (windowWidth.value < 768) {
    setModalHeight()
  }
  else {
    setContentHeightDesktop()
  }
}

// -------------- MODAL CONTAINER STYLES AND CALCULATIONS -----------------------
const modalStyles = computed(() => {
  const result = {}
  if (modal.value) {
    if (windowWidth.value > 768) {
      bottomOffsetInit = (document.documentElement.clientHeight - modalHeight.value) / 2
    }
    else {
      bottomOffsetInit = 0
    }

    result.height = modalHeight.value + 'px'
    result.bottom = bottomOffsetInit + 'px'
  }
  else {
    result.bottom = '0px'
  }

  return result
})

const heightStaticElements = (desktop = false) => {
  const innerContent = modal.value.querySelector('.inner-content')

  const modalParentDiv = innerContent?.closest('.modal__content')
  if (modalParentDiv) {
    const modalDiv = innerContent.closest('.modal')
    const footerHeight = modalParentDiv.querySelector('.modal__footer')?.getBoundingClientRect()?.height || 0
    const sidebarHeight = modalDiv.querySelector('.modal__sidebar')?.getBoundingClientRect()?.height || 0
    const panHeight = modalDiv.querySelector('.pan')?.getBoundingClientRect()?.height || 0
    const headerHeight = modalParentDiv.querySelector('.header')?.getBoundingClientRect()?.height || 0

    let sumH = headerHeight + footerHeight + panHeight

    if (props.simple) {
      const headerTitleHeight = modalDiv.querySelector('.modal__title')?.getBoundingClientRect()?.height || 0
      sumH += headerTitleHeight
    }
    if (!desktop) sumH += sidebarHeight 
    if (desktop) {
      const marginTop = getComputedStyle(modalParentDiv.querySelector('.content'))?.marginTop
      sumH += utils.pxToNumber(marginTop)
    }


    return sumH
  }

  return 0
}

const setTabsHeight = () => {
  if (modal.value) {
    const tabsDiv = modal.value.querySelector('.modal__tabs')
    const modalHeight = utils.pxToNumber(modal.value.style.height)

    const modalTitle = modal.value.querySelector('.modal__title')
    const modalTitleHeight = modalTitle.getBoundingClientRect()?.height
    const modalTitleMarginBottom = utils.pxToNumber(getComputedStyle(modalTitle).marginBottom)

    const sidebarStyles = getComputedStyle(modal.value.querySelector('.modal__sidebar'))
    const sidebarPaddingTop = utils.pxToNumber(sidebarStyles.paddingTop)
    const sidebarPaddingBottom = utils.pxToNumber(sidebarStyles.paddingBottom)

    tabsDiv.style.height = utils.numberToPx(modalHeight - modalTitleHeight - modalTitleMarginBottom - sidebarPaddingTop - sidebarPaddingBottom)
  }

}

const setContentHeightDesktop = () => {
  const staticHeight = heightStaticElements(true)
  const innerContent = modal.value.querySelector('.inner-content')
  if (innerContent) innerContent.style.height = modalHeight.value - staticHeight + 'px'

  if (!props.simple) setTabsHeight()
}

const setModalHeight = async () => {
  const staticHeight = heightStaticElements()
  const innerContent = modal.value.querySelector('.inner-content')

  // imagesLoaded решает проблему с динамическим расчётом высоты модалки если есть фотки, т.к. фотки не сразу грузятся, а до того момента высота не определена (как я понял) 
  await utils.imagesIsLoaded(innerContent)

  if (innerContent && innerContent.style.height && innerContent.getAttribute('style')) {
    innerContent.style.removeProperty('height')
  }
  const childContentHeight = innerContent?.scrollHeight
  let h = childContentHeight + staticHeight

  if (h >= document.documentElement.clientHeight) h = document.documentElement.clientHeight - 60 - (utils.isIphone() ? 30 : 0)
  modalHeight.value = h
  if (innerContent) innerContent.style.height = Math.abs(modalHeight.value - staticHeight) + 'px'
  if (props.sectionsMode) {
    const heightStatic = heightStaticSectionsMode()
    const sectionTabs = modal.value.querySelector('.sections-mode')
    if (sectionTabs) {
      sectionTabs.style.height = Math.abs(modalHeight.value - heightStatic) + 'px'

      if (!currentHistory.length && windowWidth.value < 768) {
        if (!initTabsHeight.value) initTabsHeight.value = sectionTabs.style.height
        else sectionTabs.style.height = initTabsHeight.value
      }
    }
  }
  return
}

const heightStaticSectionsMode = () => {
  if (modal.value){
    const footerHeight = modal.value.querySelector('.modal__footer')?.getBoundingClientRect()?.height || 0
    const panHeight = modal.value.querySelector('.pan')?.getBoundingClientRect()?.height || 0
    const sidebar = modal.value.querySelector('.modal__sidebar')

    const modalTitle = modal.value.querySelector('.modal__title')
    const modalTitleHeight = modalTitle.getBoundingClientRect()?.height
    const modalTitleMarginBottom = utils.pxToNumber(getComputedStyle(modalTitle).marginBottom)
    let h = footerHeight + panHeight + modalTitleHeight + modalTitleMarginBottom

    if (sidebar) {
      let {paddingTop, paddingBottom} = getComputedStyle(sidebar)
      h += utils.pxToNumber(paddingTop) + utils.pxToNumber(paddingBottom)
    }

    if (props.sidebarSearch) {
      const sidebarSearchHeight = modal.value.querySelector('.modal__sidebar-search')?.getBoundingClientRect()?.height || 0
      h += sidebarSearchHeight 
    }

    return h
  }

  return 0
}

const initHammer = () => {
  const panOptions = {
    recognizers: [
      [Hammer.Pan, { direction: Hammer.DIRECTION_VERTICAL }],
    ]
  }
  if (pan.value) {
    hammer.pan = new Hammer(pan.value, panOptions)
    if (hammer.pan) {
      hammer.pan.on("panstart panup pandown panend", (e) => {
        move(e, "pan");
      })
    }
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
      modal.value.style.bottom = utils.numberToPx(bottomOffsetInit + delta)
    }
  }
  if (event.isFinal) {
    contentScroll = modal.value.scrollTop;
    moving.value = false;
    
    if (utils.pxToNumber(modal.value.style.bottom) < bottomOffsetInit - 60) {
      bottomOffset.value = 0;
      close()
    } else {
      modal.value.style.bottom = bottomOffsetInit + 'px';
    }
  }
}

const enableOverflow = async () => {
  await nextTick()
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

  if (windowWidth.value > 768) {
    nextTick(() => {
      setContentHeightDesktop()
    })
  }

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

// -------------------------------------

const getOnlyComponentsInSlot = (slotsArray) => {
  return slotsArray.filter(item => item.type.__name == 'TabbedModalItem') || []
}

const getFirstComponentName = (slotsArray) => {
  return getOnlyComponentsInSlot(slotsArray)[0]?.props?.name || null
}

const currentHistory = computed(() => {
  return history.history.value.find(item => item.modalId == modalId)?.history || []
})

const current = computed(() => {
  return currentHistory.value[0]
})

const currentTitle = computed(() => {
  if (current.value) {
    if (current.value.title) return current.value.title
    if (current.value.current) return current.value.current
  }
  
  if (props.title) return props.title

  return 'Окно'
})

const hasChildFooter = computed(() => {
  return history.hasChildFooter(modalId)
})

if (!props.simple && (props.openFirstSection || windowWidth.value > 768)) {
  history.addItem({
    current: getFirstComponentName(slots.default()),
    key: modalId
  })
}

const handleSearchText = (value) => {
  return value
    .toLocaleLowerCase()
    .replace(/[^A-Za-zА-Яа-яёЁ0-9@]/g, "")
    .replace("ё", "е");
}

const search = (value) => {
  searchValue.value = value
}

const tabsHeader = computed(() => {
  let tabs = getOnlyComponentsInSlot(slots.default()).map(item => {
    return {
      name: item.props.name,
      title: item.props.title
    }
  })

  if (props.sidebarSearch && searchValue.value) {
    let searchText = handleSearchText(searchValue.value)

    tabs = tabs.filter(item => {
      let name = handleSearchText(item.title ?? item.name)
      if (name.indexOf(searchText) !== -1) return name.indexOf(searchText) !== -1;
    })
  }
  
  nextTick(() => {
    if (!searchValue.value && windowWidth.value < 768) {
      setModalHeight()    
    }
  })

  return tabs
})


const defaultSlots = slots.default()
const render = () => {
  
  if (!props.simple && props.sectionsMode && !currentHistory.value.length && windowWidth.value < 768) {
    return h('div', {class: 'content' }, [h('div', {class: 'inner-content' }, '' )])
  }

  if (props.simple) {
    return h('div', {class: 'content' }, [h('div', {class: 'inner-content' }, slots.default().filter(item => item.type.__name != 'TabbedModalItem'))])
  }

  if (!slots.default().filter(item => item.type.__name == 'TabbedModalItem').length) {
    return h('div', {}, [
      h('div', { class: 'header' }, [h('span', { class: 'header__title' }, '')]),
      h('div', { class: 'content' }, [h('div', { class: 'inner-content' }, slots.default().filter(item => item.type.__name != 'TabbedModalItem'))])
    ])
  }
  let comp = findComp(defaultSlots)
  if (comp && comp.props.title) { 
    history.setCurrentTitle(comp.props.title, modalId)
  }

  // key нужен чтобы контент таба переписывался корректно при переключении в навигации
  return h('div', {key: comp.key}, comp)
};

const findComp = (slotsArray) => {
  slotsArray = getOnlyComponentsInSlot(slotsArray)
  for (let slot of slotsArray) {
    if (slot.props.name == current.value.current) {
      slot.key = utils.makeId(10)
      return slot
    }
    if (slot.component?.exposed?.defaultSlots) {
      
      let slotSub = findComp(slot.component.exposed.defaultSlots)
      if (slotSub) { 
        return slotSub
      }
    } 
    
    if (typeof slot?.children == 'object') {
      let slotSub = findComp(slot.children.default())
      if (slotSub) { 
        return slotSub
      }
    }
  }
}

const gotoTab = ({tabName, root = false}) => {
  goto(tabName, root)
}

const goto = (tabName, root = false) => {
  history.addItem({
    current: tabName,
    title: '',
    clearAll: root,
    key: modalId 
  })
}

defineExpose({
  goto
})

init()

</script>

<style lang="scss" scoped src="../assets/tabbed-modal.scss"></style>