# Tabbed MacOS-Like Modal

Tabbed MacOS-Like Modal is a Vue 3 plugin for creating modals like MacOS Settings App

![tabbed macos-like modal](https://i.ibb.co/h8Vzr7f/tabbed-macos-modal.png)

<details>
  <summary>Mobile version</summary>

  <img alt="tabbed macos-like modal mobile item opened" src="https://i.ibb.co/YXCT19H/mobile-screenshow-item-opened.png" width="200">
  <img alt="tabbed macos-like modal menu" src="https://i.ibb.co/nPrSfbY/mobile-screenshot-menu.png" width="200">
</details>

## Installation

Use the npm to install

```bash
npm i tabbed-macos-modal
```

Register globally

```javascript

import TabbedModal from 'tabbed-macos-modal'
import 'tabbed-macos-modal/dist/style.css'

const app = createApp(...)

app.use(TabbedModal)


```

Or register locally 

```javascript

import { TabbedModal, TabbedModalItem } from 'tabbed-macos-modal'
import 'tabbed-macos-modal/dist/style.css'

```

## Usage

```html

<TabbedModal 
  ref="modal" 
  title="Settings" 
  sidebar-search
  v-if="showModal" 
  @close="showModal = false"
>
  <!-- <template #title>
    custom title 🌍
  </template> -->
  <!-- <template #sidebar>
    <span class="my-custom-tab" @click="modal.goto('main', true)">To Main tab 😱</span>
    <span class="my-custom-tab" @click="modal.goto('modifications', true)">To Modifications</span>
    <span class="my-custom-tab" @click="modal.goto('childModificationsDeep2')">To childModificationsDeep1 👽</span>
  </template> -->
  <!-- <template #closeIcon>
      close button here 👀
  </template> -->

  content here...
  
  <TabbedModalItem name="main" title="Main tab">
    <a href="#" @click="modal.goto('childModificationsDeep2')">-> childModificationsDeep2 tab</a>
    content here...
    <template #footer>
      ITEMFOOTER
    </template>
  </TabbedModalItem> 

  <TabbedModalItem name="products" title="Products">
    <template #header>
      <span class="custom-header">
        my custom header 👽👽👽
      </span>
    </template>

    content here...

    <template #footer>
      ITEMFOOTER
    </template>
  </TabbedModalItem>

  <TabbedModalItem name="modifications" head-title="modifications head title 👋">
    gogi
    <a href="#" @click="modal.goto('childModifications')">-> childModifications</a>

    <TabbedModalItem name="childModifications" title="Modification Items" @goback="console.log('go back!')">
      I'M childModifications

      <!-- example of dynamic height calculation feature, check in mobile mode! -->
      <button class="button" @click="displayImage = !displayImage">click me</button>

      <img src="/defend.jpg">

      <a href="#" @click="modal.goto('childModificationsDeep1')">-> childModificationsDeep1</a>
      <a href="#" @click="modal.goto('childModificationsDeep2')">-> childModificationsDeep2</a>

      <div class="test" v-if="displayImage">
        dynamic content...
      </div>

      <div class="beautiful-block" v-if="!displayImage" style="width: 50px; height: 50px; background-color: red;"></div>

      <TabbedModalItem name="childModificationsDeep1" ref="childModificationsDeep1Ref" @goback="console.log('childModificationsDeep1')">
        I'M childModificationsDeep1
        <template #footer>
          <button @click="childModificationsDeep1Ref.goBack()">save and go back</button>
          <button @click="modal.goto('products', true)">go to products</button>
        </template>
      </TabbedModalItem>

      <TabbedModalItem name="childModificationsDeep2">
        I'M childModificationsDeep1
      </TabbedModalItem>
    </TabbedModalItem>

  </TabbedModalItem>
  <TabbedModalItem name="composition" title="Composition" head-title="test head title">
    content here
    <template #footer>
      composition footer
    </template>
  </TabbedModalItem>

  <template #mainFooter>
    MAIN FOOTER
  </template>
</TabbedModal>

```

## TabbedModal Props (See example in src/App.vue)
| Prop                   | Type           | Description                                                                                                                        | Default       |
| ---------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `title`                  | `string`         | title for modal (top left corner)                                                                                                  | `Default Title` |
| `sectionsMode`           | `boolean`        | if `true`, then on mobile looks like iOS settings app, otherwise sidebar tabs will be horizontally scrollable                        | `true`          |
| `openFirstSection`       | `boolean`        | If `true` and `sectionsMode` is also set to `true`, then on mobile, when modal is open, content of the first modalItem will be displayed | `true`         |
| `sidebarSearch`          | `boolean`        | enables search in sidebar for tabs                                                                                                 | `true`          |
| `searchPlaceholder`      | `string`         | Placeholder for sidebar search input                                                                                               | `Search…`       |
| `needCloseIcon`          | `boolean`        | enables close icon (top right corner)                                                                                              | `true`          |
| `sidebarWidth`           | `Number, String` | Sets sidebar width (will not work if dynamic sidebar width is enabled)                                                             | `180`           |
| `dynamicSidebarWidth`    | `boolean`        | If enabled, sidebar width will be based on length of longest item in sidebar                                                       | `false`         |
| `maxDynamicSidebarWidth` | `Number, String` | Sets max width for tabs in sidebar if `dynamicSidebarWidth` is enabled. If width of tabs is greater, then text will be wrapped       | `320`           |
| `needFooter`             | `boolean`        | Enables or disables footer                                                                                                         | `true`          |
| `simple`                 | `boolean`        | if true, then sidebar is disabled and content inside modal parent component will be displayed                                      | `false`         |
| `panDesktop`             | `boolean`        | Enables or disables pan on desktop                                                                                                 | `false`         |
| `panMobile`              | `boolean`       | Enables or disables pan on mobile                                                                                                  | `true`          |
| `height`                 | `Number, String` | Sets height for modal                                                                                                              | `600`           |
| `fixedHeight`            | `boolean`        | If true, then `height` prop will be set as max height for modal and on mobile dynamic height calculation will be disabled          | `false`         |
| `contentWidth`           | `Number, String` | Sets content for `modalItem` content. On mobile content width is set to `100%`                                                         | `520`           |

## TabbedModalItem Props (See example in src/App.vue)

| Prop      | Type   | Description                                                                                                                         | Default     |
| --------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `name` \*   | `string` | Name for component. This prop is used for navigation between props (see example).                                                   | \* `required` |
| `title`     | `string` | Will be displayed in header content                                                                                                 | `null`        |
| `headTitle` | `string` | title for content head. If set together with `title`, then `title` will be displayed in sidebar and `headTitle` will be in header content | `null`        |

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.