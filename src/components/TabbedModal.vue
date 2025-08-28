<template>
  <div class="tabbed-modal modal-item" :class="{opened: modalOpened, closed: modalOpened === false, moving: moving}" @mousedown="clickOnBottomSheet" 
    @touchstart="clickOnBottomSheet">
    <div class="modal-item__backdrop" />
    <div class="modal" ref="modal" :style="modalStyles" :class="{moving: moving}">
      <div ref="pan" class="modal__pan" v-if="(props.panDesktop && windowWidth > 768) || (props.panMobile && windowWidth < 768)">
          <div class="modal__pan-bar"></div>
      </div>
      <div class="modal__container">
        <Sidebar 
          v-if="!props.simple" 
          :history="currentHistory" 
          :current="current" 
          :tabs-sidebar="tabsSidebar" 
          :sidebar-search="props.sidebarSearch"
          :sidebar-width="props.sidebarWidth"
          :dynamic-sidebar-width="props.dynamicSidebarWidth"
          :max-dynamic-sidebar-width="props.maxDynamicSidebarWidth"
          :search-placeholder="props.searchPlaceholder"
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
        <div class="modal__content" :class="{'modal__content-simple': props.simple}" :style="{width: modalStyles.contentWidth}">
          <div class="modal__title" v-if="props.simple" :class="{'modal__title-simple': props.simple}">
            <template v-if="!hasTitleSlot">
              {{ props.title }}
            </template>
            <template v-else>
              <slot name="title"></slot>
            </template>
          </div>
          <render :key="renderKey"/>
          <div class="modal__footer" v-if="hasFooterSlot && !hasChildFooter && props.needFooter">
            <slot name="mainFooter"></slot>
          </div>
        </div>
        <template v-if="props.needCloseIcon">
          <div class="modal__close" v-if="!hasCloseIconSlot" @click="close()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="none">
              <path d="M15.6821 2.104L14.3696 0.791504L8.18213 6.979L1.99463 0.791504L0.682129 2.104L6.86963 8.2915L0.682129 14.479L1.99463 15.7915L8.18213 9.604L14.3696 15.7915L15.6821 14.479L9.49463 8.2915L15.6821 2.104Z" fill="#0A281A" />
            </svg>
          </div>
          <div class="custom-close-icon" v-else @click="close()">
            <slot name="closeIcon"></slot>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, useSlots, computed, h, provide, nextTick, onBeforeUnmount, onUpdated, onMounted } from 'vue'
import { useUtils } from '../composables/useUtils.js';
import { useWindowWidth } from '../composables/useWindowWidth.js';
import { useHistory } from '../composables/useModalStore.js';
// import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock-upgrade';
import Hammer from "hammerjs";
import Sidebar from './Sidebar/Sidebar.vue';
import { sharedProps } from '../composables/sharedProps.js';

const props = defineProps({
  ...sharedProps,
  sidebarSearch: {
    type: Boolean,
    default: false
  },
  simple: {
    type: Boolean,
    default: true
  },
  openFirstSection: {
    type: Boolean,
    default: true
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
    default: false
  },
  panMobile: {
    type: Boolean,
    default: true
  },
  height: {
    type: [Number, String],
    default: 600
  },
  contentWidth: {
    type: [Number, String],
    default: 520
  },
  fixedHeight: {
    type: Boolean,
    default: false
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
const hasCloseIconSlot = computed(() => !!slots.closeIcon)

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

//renderKey is needed to trigger onUpdated hook, when content of slot is changed reactively
const renderKey = computed(() => {
  history.history.value.find(item => item.modalId == modalId)?.renderKey
})

const observeDOMChanges = () => {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // Игнорируем изменения от датапикеров и других UI элементов
        const isDatepickerChange = Array.from(mutation.addedNodes).concat(Array.from(mutation.removedNodes))
          .some(node => 
            node.nodeType === Node.ELEMENT_NODE && 
            (node.classList?.contains('datepicker') || 
             node.classList?.contains('date-picker') ||
             node.classList?.contains('picker') ||
             node.classList?.contains('dropdown') ||
             node.classList?.contains('popover') ||
             node.querySelector?.('.datepicker, .date-picker, .picker, .dropdown, .popover'))
          )
        
        if (!isDatepickerChange) {
          callAfterRender()
        }
      }
    }
  })

  observer.observe(modal.value, { childList: true, subtree: true })

  return observer
}

onMounted(() => {
  const observer = observeDOMChanges()

  onBeforeUnmount(() => {
    observer.disconnect()
  })
})

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
  
  // Проверяем, есть ли открытые датапикеры или другие UI элементы
  const hasOpenUIElements = modal.value?.querySelector(
    '.datepicker:not([style*="display: none"]), ' +
    '.date-picker:not([style*="display: none"]), ' +
    '.picker:not([style*="display: none"]), ' +
    '.dropdown:not([style*="display: none"]), ' +
    '.popover:not([style*="display: none"]), ' +
    '[class*="picker"]:not([style*="display: none"]), ' +
    '[class*="dropdown"]:not([style*="display: none"])'
  )
  
  // Не пересчитываем высоту если открыты UI элементы
  if (hasOpenUIElements) return
  
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
      bottomOffsetInit = (document.documentElement.clientHeight - utils.pxToNumber(modalHeight.value)) / 2
    }
    else {
      bottomOffsetInit = 0
    }

    result.height = utils.numberToPx(modalHeight.value)
    result.bottom = utils.numberToPx(bottomOffsetInit)
    result.contentWidth = utils.numberToPx(props.contentWidth)
  }
  else {
    result.bottom = '0px'
  }

  return result
})

const heightStaticElements = (desktop = false) => {
  const innerContent = modal.value.querySelector('.modal__inner-content')

  const modalParentDiv = innerContent?.closest('.modal__content')
  if (modalParentDiv) {
    const modalDiv = innerContent.closest('.modal')
    const footerHeight = modalParentDiv.querySelector('.modal__footer')?.getBoundingClientRect()?.height + (currentHistory.value.length ? 15 : 1) || (currentHistory.value.length ? 35 : 0)
    const sidebarHeight = modalDiv.querySelector('.modal__sidebar')?.getBoundingClientRect()?.height || 0
    const panHeight = modalDiv.querySelector('.modal__pan')?.getBoundingClientRect()?.height || 0
    const headerHeight = modalParentDiv.querySelector('.modal__child-item-header')?.getBoundingClientRect()?.height || 0

    let sumH = headerHeight + footerHeight + panHeight

    if (props.simple) {
      const headerTitleHeight = modalDiv.querySelector('.modal__title')?.getBoundingClientRect()?.height || 0
      sumH += headerTitleHeight
    }
    if (!desktop) sumH += sidebarHeight 
    if (desktop) {
      const marginTop = getComputedStyle(modalParentDiv.querySelector('.modal__child-item-content'))?.marginTop
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
  // Проверяем, есть ли открытые UI элементы перед пересчетом
  const hasOpenUIElements = modal.value?.querySelector(
    '.datepicker:not([style*="display: none"]), ' +
    '.date-picker:not([style*="display: none"]), ' +
    '.picker:not([style*="display: none"]), ' +
    '.dropdown:not([style*="display: none"]), ' +
    '.popover:not([style*="display: none"])'
  )
  
  if (hasOpenUIElements) return

  modalHeight.value = props.height
  const staticHeight = heightStaticElements(true)
  const innerContent = modal.value.querySelector('.modal__inner-content')
  const prevScroll = innerContent ? innerContent.scrollTop : 0
  if (innerContent) innerContent.style.height = utils.numberToPx(modalHeight.value - staticHeight)
  if (!props.simple) setTabsHeight()
  if (innerContent) {
    nextTick(() => {
      innerContent.scrollTop = Math.min(prevScroll, innerContent.scrollHeight - innerContent.clientHeight || 0)
    })
  }
}

const setModalHeight = async () => {
  const staticHeight = heightStaticElements()
  const innerContent = modal.value.querySelector('.modal__inner-content')
  const prevScroll = innerContent ? innerContent.scrollTop : 0
  
  // Проверяем, есть ли открытые UI элементы перед пересчетом
  const hasOpenUIElements = modal.value?.querySelector(
    '.datepicker:not([style*="display: none"]), ' +
    '.date-picker:not([style*="display: none"]), ' +
    '.picker:not([style*="display: none"]), ' +
    '.dropdown:not([style*="display: none"]), ' +
    '.popover:not([style*="display: none"])'
  )
  
  if (hasOpenUIElements) return

  await utils.imagesIsLoaded(innerContent)

  if (innerContent && innerContent.style.height && innerContent.getAttribute('style')) {
    innerContent.style.removeProperty('height')
  }
  const childContentHeight = innerContent?.scrollHeight
  let h = childContentHeight + staticHeight

  if (props.fixedHeight) h = utils.pxToNumber(props.height)

  if (h >= document.documentElement.clientHeight) h = document.documentElement.clientHeight - 60 - (utils.isIphone() ? 30 : 0)

  modalHeight.value = h

  if (innerContent) innerContent.style.height = utils.numberToPx(Math.abs(modalHeight.value - staticHeight))
  if (props.sectionsMode) {
    const heightStatic = heightStaticSectionsMode()
    const sectionTabs = modal.value.querySelector('.sections-mode')
    if (sectionTabs) {
      sectionTabs.style.height = utils.numberToPx(Math.abs(modalHeight.value - heightStatic))

      if (!currentHistory.value.length && windowWidth.value < 768) {
        if (!initTabsHeight.value) initTabsHeight.value = sectionTabs.style.height
        else sectionTabs.style.height = initTabsHeight.value
      }
    }
  }
  if (innerContent) {
    nextTick(() => {
      innerContent.scrollTop = Math.min(prevScroll, innerContent.scrollHeight - innerContent.clientHeight || 0)
    })
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
      modal.value.style.bottom = utils.numberToPx(bottomOffsetInit);
    }
  }
}

const enableOverflow = async () => {
  await nextTick()
  let openedModalsList = document.getElementsByClassName("modal-item opened");
  if (!openedModalsList.length) {
    // let body = document.querySelector('.app-body')
    // enableBodyScroll(body);
    document.documentElement.style.overflow = 'auto'
    document.documentElement.style.overflowY = 'auto'

    document.body.style.overflow = 'auto'
    document.body.style.overflowY = 'auto'
    document.body.style.removeProperty('overflow')
  }
}

const disableOverflow = () => {
  let openedModalsList = document.getElementsByClassName("modal-item opened");
  if (!openedModalsList.length) {
    // let body = document.querySelector('.app-body')
    // disableBodyScroll(body, { allowTouchMove: () => true });
    document.documentElement.style.overflow = 'hidden'
    document.documentElement.style.overflowY = 'hidden'
    document.body.style.overflow = 'hidden'
    document.body.style.overflowY = 'hidden'
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

  return 'Window'
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

const tabsSidebar = computed(() => {
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


const render = () => {
  
  if (!props.simple && props.sectionsMode && !currentHistory.value.length && windowWidth.value < 768) {
    return h('div', {class: 'modal__child-item-content' }, [h('div', {class: 'modal__inner-content' }, '' )])
  }

  if (props.simple) {
    return h('div', {class: 'modal__child-item-content' }, [h('div', {class: 'modal__inner-content' }, slots.default().filter(item => item.type.__name != 'TabbedModalItem'))])
  }

  if (!slots.default().filter(item => item.type.__name == 'TabbedModalItem').length) {
    return h('div', {}, [
      h('div', { class: 'modal__child-item-header' }, [h('span', { class: 'header__title' }, '')]),
      h('div', { class: 'modal__child-item-content' }, [h('div', { class: 'modal__inner-content' }, slots.default().filter(item => item.type.__name != 'TabbedModalItem'))])
    ])
  }
  let comp = findComp(slots.default())
  if (comp && comp.props) { 
    let title = null

    if (comp.props.title) title = comp.props.title
    if (comp.props.headTitle) title = comp.props.headTitle
    if (comp.props['head-title']) title = comp.props['head-title']

    if (title) history.setCurrentTitle(title, modalId)
  }

  // key is needed so that the tab content is rewritten correctly when switching in navigation
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