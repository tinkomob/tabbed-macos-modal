
<template>
  <div class="modal-item" :class="{opened: modalOpened, closed: modalOpened === false, moving: moving}" @mousedown="clickOnBottomSheet" 
    @touchstart="clickOnBottomSheet">
    <div class="modal-item__backdrop" />
    <div class="modal" ref="modal" :style="modalStyles" :class="{moving: moving}">
      <div ref="pan" class="pan" v-if="props.pan || windowWidth < 768">
          <div class="pan__bar"></div>
      </div>
      <div class="modal__container">
        <div class="modal__sidebar" v-if="!props.simple" :class="{'sidebar-sections': props.sectionsMode}">
          <template v-if="props.sectionsMode">
            <template v-if="windowWidth < 768">
              <div class="modal__title">{{ history[0]?.title ? history[0].title : history[0]?.current ? history[0]?.current : props.title ? props.title : 'Окно' }}</div>
            </template>
            <template v-else>
              <div class="modal__title" v-if="!hasTitleSlot">{{ props.title }}</div>
              <div class="modal__title" v-else>
                <slot name="title"></slot>
              </div>
            </template>
          </template>

          <template v-else>
            <div class="modal__title" v-if="!hasTitleSlot">{{ props.title }}</div>
            <div class="modal__title" v-else>
              <slot name="title"></slot>
            </div>
          </template>
          <div class="modal__sidebar-search" v-if="props.sidebarSearch && (windowWidth > 768 || (props.sectionsMode && !history.length))">
            <input type="search" v-model="searchValue" name="sidebar_search" class="modal__sidebar-search-input" placeholder="Поиск...">
          </div>
          <template v-if="props.sectionsMode">
            <template v-if="hasSidebarSlot">
              <div class="modal__tabs" v-if="!history.length || windowWidth > 768" :class="{'sections-mode': props.sectionsMode, 'h-scrollable': !props.sectionsMode}">
                <slot name="sidebar"></slot>
              </div>
            </template>
            <template v-else>
              <div class="modal__tabs" v-if="!history.length || windowWidth > 768" :class="{'sections-mode': props.sectionsMode, 'h-scrollable': !props.sectionsMode}">
                <div class="modal__tab-head-item" v-for="(item, index) in tabsHeader" :key="index" @click="goto(item.name, true)" :class="{'modal__tab-head-item--active': !props.sectionsMode ? tabIsActive(item.name) : false}">
                    {{ getTabTitle(item) }}
                    <svg xmlns="http://www.w3.org/2000/svg" class="sections-mode__section-arrow" fill="#000000" width="16px" height="16px" viewBox="0 0 24 24" v-if="props.sectionsMode && windowWidth < 768">
                      <g data-name="Layer 2">
                        <g data-name="arrow-ios-forward">
                          <rect width="24" height="24" transform="rotate(-90 12 12)" opacity="0"/>
                          <path d="M10 19a1 1 0 0 1-.64-.23 1 1 0 0 1-.13-1.41L13.71 12 9.39 6.63a1 1 0 0 1 .15-1.41 1 1 0 0 1 1.46.15l4.83 6a1 1 0 0 1 0 1.27l-5 6A1 1 0 0 1 10 19z"/>
                        </g>
                      </g>
                    </svg>
                </div>
              </div>
            </template>
          </template>
          <template v-else>
            <template v-if="hasSidebarSlot">
              <div class="modal__tabs" :class="{'sections-mode': props.sectionsMode, 'h-scrollable': !props.sectionsMode}">
                <slot name="sidebar"></slot>
              </div>
            </template>
            <template v-else>
              <div class="modal__tabs" :class="{'sections-mode': props.sectionsMode, 'h-scrollable': !props.sectionsMode}">
                <div class="modal__tab-head-item" v-for="(item, index) in tabsHeader" :key="index" @click="goto(item.name, true)" :class="{'modal__tab-head-item--active': !props.sectionsMode ? tabIsActive(item.name) : false}">
                    {{ getTabTitle(item) }}
                    <svg xmlns="http://www.w3.org/2000/svg" class="sections-mode__section-arrow" fill="#000000" width="16px" height="16px" viewBox="0 0 24 24" v-if="props.sectionsMode && windowWidth < 768">
                      <g data-name="Layer 2">
                        <g data-name="arrow-ios-forward">
                          <rect width="24" height="24" transform="rotate(-90 12 12)" opacity="0"/>
                          <path d="M10 19a1 1 0 0 1-.64-.23 1 1 0 0 1-.13-1.41L13.71 12 9.39 6.63a1 1 0 0 1 .15-1.41 1 1 0 0 1 1.46.15l4.83 6a1 1 0 0 1 0 1.27l-5 6A1 1 0 0 1 10 19z"/>
                        </g>
                      </g>
                    </svg>
                </div>
              </div>
            </template>
          </template>

        </div>
        <div class="modal__content">
          <div class="modal__title" v-if="props.simple" :class="{'modal__content-simple': props.simple}">
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
import { ref, useSlots, computed, h, provide, nextTick, onBeforeUnmount, getCurrentInstance } from 'vue'
import { useHierarchy, useAddItem, useClear, useHaveChildFooter, useSetModalItem, useSetCurrentTitle } from '../composables/modal-store.js';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock-upgrade';
import Hammer from "hammerjs";

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
  pan: {
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

const makeid = (length) => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const modalId = makeid(15)

const emit = defineEmits(['close', 'opened'])

// -------------------------------------

const modal = ref(null)
const modalOpened = ref(false)
const moving = ref(false)
const modalHeight = ref(props.height)
const windowWidth = ref(document.documentElement.clientWidth)

const bottomOffset = ref('unset')
let bottomOffsetInit = 0

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

const hammer = {
    pan: null,
    content: null,
}

onBeforeUnmount(() => {
    hammer.pan?.destroy();
    hammer.content?.destroy();
    enableOverflow()
    useClear(modalId)
});

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
      sumH += Number(marginTop.replace('px', ''))
    }


    return sumH
  }

  return 0
}

const pxToNumber = (value) => {
  if (value) {
    value = Number(value.replace('px', ''))

    return value
  }
  return 0
}

const numberToPx = (value) => {
  if (value) {
    value = value + 'px'

    return value
  }
  return '0px'
}

const setTabsHeight = () => {
  if (modal.value) {
    const tabsDiv = modal.value.querySelector('.modal__tabs')
    const modalHeight = pxToNumber(modal.value.style.height)

    const modalTitle = modal.value.querySelector('.modal__title')
    const modalTitleHeight = modalTitle.getBoundingClientRect()?.height
    const modalTitleMarginBottom = pxToNumber(getComputedStyle(modalTitle).marginBottom)

    const sidebarStyles = getComputedStyle(modal.value.querySelector('.modal__sidebar'))
    const sidebarPaddingTop = pxToNumber(sidebarStyles.paddingTop)
    const sidebarPaddingBottom = pxToNumber(sidebarStyles.paddingBottom)

    tabsDiv.style.height = numberToPx(modalHeight - modalTitleHeight - modalTitleMarginBottom - sidebarPaddingTop - sidebarPaddingBottom)
  }

}

const setContentHeightDesktop = () => {
  const staticHeight = heightStaticElements(true)
  const innerContent = modal.value.querySelector('.inner-content')
  if (innerContent) innerContent.style.height = modalHeight.value - staticHeight + 'px'

  setTabsHeight()
}

const isIphone = () => {
    const iPhone =
        /iPhone/.test(navigator.userAgent) && !window.MSStream;
    const aspect = window.screen.width / window.screen.height;
    return iPhone && aspect.toFixed(3) === "0.462";
};

const setModalHeight = () => {
  const staticHeight = heightStaticElements()
  const innerContent = modal.value.querySelector('.inner-content')
  const childContentHeight = innerContent?.getBoundingClientRect()?.height
  
  modalHeight.value = childContentHeight + staticHeight
  if (modalHeight.value >= document.documentElement.clientHeight) modalHeight.value = document.documentElement.clientHeight - 60 - (isIphone() ? 30 : 0)
  if (innerContent) innerContent.style.height = Math.abs(modalHeight.value - staticHeight) + 'px'
  if (props.sectionsMode) {
    const heightStatic = heightStaticSectionsMode()
    const sectionTabs = modal.value.querySelector('.sections-mode')
    if (sectionTabs) sectionTabs.style.height = Math.abs(modalHeight.value - heightStatic) + 'px'
  }
  return 
}

const heightStaticSectionsMode = () => {
  if (modal.value){
    const footerHeight = modal.value.querySelector('.modal__footer')?.getBoundingClientRect()?.height || 0
    const panHeight = modal.value.querySelector('.pan')?.getBoundingClientRect()?.height || 0
    const sidebar = modal.value.querySelector('.modal__sidebar')
    let {paddingTop, paddingBottom} = getComputedStyle(sidebar)
    const modalTitle = modal.value.querySelector('.modal__title')
    const modalTitleHeight = modalTitle.getBoundingClientRect()?.height
    const modalTitleMarginBottom = pxToNumber(getComputedStyle(modalTitle).marginBottom)
    let h = footerHeight + panHeight + pxToNumber(paddingTop) + pxToNumber(paddingBottom) + modalTitleHeight + modalTitleMarginBottom
    if (props.sidebarSearch) {
      const sidebarSearchHeight = modal.value.querySelector('.modal__sidebar-search')?.getBoundingClientRect()?.height || 0
      h += sidebarSearchHeight 
    }
    return h
  }

  return 0
}

const init = async () => {
  await nextTick()

  initHammer()

  open()

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
      modal.value.style.bottom = bottomOffsetInit + delta + 'px';
    }
  }
  if (event.isFinal) {
    contentScroll = modal.value.scrollTop;
    moving.value = false;
    
    if (Number(modal.value.style.bottom.replace('px', '')) < bottomOffsetInit - 60) {
      bottomOffset.value = 0;
      close()
    } else {
      modal.value.style.bottom = bottomOffsetInit + 'px';
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

  if (windowWidth.value > 768) {
    setTimeout(() => {
      setContentHeightDesktop()
    }, 15);
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

init()
// -------------------------------------

// useClear()

const hasChildFooter = computed(() => {
  return useHaveChildFooter(modalId)
})
const hierarchy = useHierarchy(modalId)
const slots = useSlots()
const defaultSlots = slots.default()
const searchValue = ref('')


const hasSidebarSlot = computed(() => !!slots.sidebar)
const hasTitleSlot = computed(() => !!slots.title)
const hasFooterSlot = computed(() => !!slots.mainFooter)

provide('needFooter', props.needFooter)
provide('modalId', modalId)
provide('isSectionsMode', props.sectionsMode)

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

const history = computed(() => {
  return hierarchy.find(item => item.key == modalId)?.history || []
})

const current = computed(() => {
  return history[0]
})

const tabIsActive = (tabName) => {
  let root = history.value[history.value.length - 1]
  if (root) return root.current == tabName
  return current.value.current == tabName 
}

selectedTab.value = getOnlyComponentsInSlot(defaultSlots)[0].props?.name

useSetModalItem(modalId)

const addHierarchyItem = (item) => {
  useAddItem({
    current: item.current,
    parent: item.parent,
    clearAll: item.clearAll || false,
    key: modalId
  })
  return 
}

if (props.sectionsMode) {
  if (windowWidth.value > 768 || props.openFirstSection) addHierarchyItem({
    current: getOnlyComponentsInSlot(defaultSlots)[0].props.name,
    parent: 'root'
  })
} 
else {
  addHierarchyItem({
    current: getOnlyComponentsInSlot(defaultSlots)[0].props.name,
    parent: 'root'
  })
}

const tabsHeader = computed(() => {
  let tabs = getOnlyComponentsInSlot(defaultSlots).map(item => {
    return {
      name: item.props.name,
      title: item.props.title
    }
  })

  if (props.sidebarSearch && searchValue.value) {
    let searchText = searchValue.value.toLocaleLowerCase().replace(/[^A-Za-zА-Яа-яёЁ0-9@]/g, "")
        .replace("ё", "е");
    tabs = tabs.filter(item => {
      let name = item.title ?? item.name
      name = name.toLocaleLowerCase()
        .replace(/[^A-Za-zА-Яа-яёЁ0-9@]/g, "")
        .replace("ё", "е");
      if (name.indexOf(searchText) !== -1) return name.indexOf(searchText) !== -1;
    })
  }
  
  setTimeout(() => {
    if (!searchValue.value && windowWidth.value < 768) setModalHeight()    
  }, 30);

  return tabs
})

const render = () => {
  if (windowWidth.value < 768) {
    setTimeout(() => {
      if (!searchValue.value) {
        setModalHeight()
      } else {
        if (history.value.length) setModalHeight()
      }
    }, 30);
  }
  else {
    setTimeout(() => {
      setContentHeightDesktop()
    }, 15);
  }

  if (props.sectionsMode && !history.value.length && windowWidth.value < 768) {
    return h('div', {class: 'content' }, [h('div', {class: 'inner-content' }, '' )])
  }

  if (props.simple) {
    return h('div', {class: 'content' }, [h('div', {class: 'inner-content' }, defaultSlots.filter(item => item.type.__name != 'TabbedModalItem'))])
  }

  let comp = findComp(defaultSlots)
  if (comp.props.title) { 
    useSetCurrentTitle(comp.props.title, modalId)
  }
  
  // key нужен чтоб контент таба переписывался корректно при переключении в навигации
  return h('div', {key: comp.key}, comp)
};

const findComp = (slotsArray) => {
  slotsArray = getOnlyComponentsInSlot(slotsArray)
  for (let slot of slotsArray) {
    if (slot.props.name == hierarchy.find(item => item.key == modalId).history[0].current) {
      slot.key = makeid(10)
      return slot
    }
    
    if (slot.component?.exposed?.defaultSlots) {
      let slotSub = findComp(slot.component.exposed.defaultSlots)
      if (slotSub) { 
        return slotSub
      }
    } 
  }
}

const goto = (tabName, root = false) => {
  addHierarchyItem({
    current: tabName,
    title: '',
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