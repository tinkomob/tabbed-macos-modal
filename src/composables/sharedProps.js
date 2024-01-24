export const sharedProps = {
  sectionsMode: {
    type: Boolean,
    default: true
  },
  history: {
    type: Object,
    default: {}
  },
  tabsSidebar: {
    type: Array,
    default: []
  },
  current: {
    type: Object,
    default: null
  },
  sidebarWidth: {
    type: [Number, String],
    default: 180
  },
  dynamicSidebarWidth: {
    type: Boolean,
    default: false
  },
  maxDynamicSidebarWidth: {
    type: [Number, String],
    default: 320
  },
  searchPlaceholder: {
    type: String,
    default: 'Search...'
  }
}