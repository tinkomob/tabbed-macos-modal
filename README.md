# Tabbed MacOS-Like Modal

Tabbed MacOS-Like Modal is a Vue 3 plugin for creating modals like MacOS Settings App

## Installation

Use the npm to install

```bash
npm i @tabbed-macos-modal
```

## Usage

```javascript
import foobar

# returns 'words'
foobar.pluralize('word')

# returns 'geese'
foobar.pluralize('goose')

# returns 'phenomenon'
foobar.singularize('phenomena')
```

## TabbedModal Props
| Prop                   | Type           | Description                                                                                                                        | Default       |
| ---------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| title                  | string         | title for modal (top left corner)                                                                                                  | Default Title |
| sectionsMode           | boolean        | if true, then on mobile looks like iOS settings app, otherwise sidebar tabs will be horizontally scrollable                        | true          |
| openFirstSection       | boolean        | If true and sectionsMode is also set to true, then on mobile, when modal is open, content of the first modalItem will be displayed | false         |
| sidebarSearch          | boolean        | enables search in sidebar for tabs                                                                                                 | true          |
| searchPlaceholder      | string         | Placeholder for sidebar search input                                                                                               | Search…       |
| needCloseIcon          | boolean        | enables close icon (top right corner)                                                                                              | true          |
| sidebarWidth           | Number, String | Sets sidebar width (will not work if dynamic sidebar width is enabled)                                                             | 180           |
| dynamicSidebarWidth    | boolean        | If enabled, sidebar width will be based on length of longest item in sidebar                                                       | false         |
| maxDynamicSidebarWidth | Number, String | Sets max width for tabs in sidebar if dynamicSidebarWidth is enabled. If width of tabs is greater, then text will be wrapped       | 320           |
| needFooter             | boolean        | Enables or disables footer                                                                                                         | true          |
| simple                 | boolean        | if true, then sidebar is disabled and content inside modal parent component will be displayed                                      | false         |
| panDesktop             | boolean        | Enables or disables pan on desktop                                                                                                 | false         |
| panMobile              | boolean        | Enables or disables pan on mobile                                                                                                  | true          |
| height                 | Number, String | Sets height for modal                                                                                                              | 600           |
| fixedHeight            | boolean        | If true, then "height" prop will be set as max height for modal and on mobile dynamic height calculation will be disabled          | false         |
| contentWidth           | Number, String | Sets content for modalItem content. On mobile content width is set to 100%                                                         | 520           |


## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.