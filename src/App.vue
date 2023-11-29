
<template>
  <TabbedModal ref="modal">
    <template #sidebar>
        <span style="background-color: red;" @click="modal.openTab('test')">test</span> 
        <span style="background-color: red;" @click="modal.openTab('gogi')">gogi</span> 
        <span style="background-color: red;" @click="modal.openTab('task')">smogi</span> 
    </template>
    <TabbedModalItem name="test">
      test 123
    </TabbedModalItem>
    <TabbedModalItem name="gogi">
      gogi
      <a href="#" @click="modal.goto('childGogi')">-> childGogi</a>

      <TabbedModalItem name="childGogi" @goback="console.log('ugdags')">
        <template #header>
          HEADER CHILD GOGI
        </template>
        I'M CHILD GOGI
        <a href="#" @click="modal.goto('childBABYGogi')">-> childBABYGogi</a>
        <a href="#" @click="modal.goto('childBABYGogi2')">-> childBABYGogi2132121</a>

        <TabbedModalItem name="childBABYGogi" ref="childBABYGogi" @goback="console.log('ifsaf')">
          I'M childBABYGogi
          <button @click="childBABYGogi.goBack()">save</button>
        </TabbedModalItem>
        <TabbedModalItem name="childBABYGogi2">
          <template #header>
            HEADER 22222
          </template>
          2222222222
        </TabbedModalItem>
      </TabbedModalItem>

    </TabbedModalItem>
    <TabbedModalItem name="task">
      <template #header>
        HEADER
      </template>
      TASK 123
    </TabbedModalItem>

  </TabbedModal>
</template>

<script setup>
import TabbedModal from './components/TabbedModal.vue'
import TabbedModalItem from './components/TabbedModalItem.vue'

import { ref } from 'vue'

const modal = ref(null)
const childBABYGogi = ref(null)

// const closechildBABYGogi = () => {
//   test.value.goBack()
//   return 
// }

</script>

<style scoped>
</style>
