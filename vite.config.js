import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { format, resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  publicDir: command === "serve" ? "public" : false,
  plugins: [vue()],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'lib/index.js'),
      name: 'tabbed-macos-modal',
      // the proper extensions will be added
      fileName: 'tabbed-macos-modal'
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
}))
