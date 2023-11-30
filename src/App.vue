
<template>
  <TabbedModal ref="modal">
    <!-- <template #sidebar>
        <span style="background-color: red;" @click="modal.goto('test', true)">test</span> 
        <span style="background-color: red;" @click="modal.goto('gogi', true)">gogi</span> 
        <span style="background-color: red;" @click="modal.goto('task', true)">smogi</span> 
    </template> -->
    <TabbedModalItem name="test" title="Основное">
      test 123
      <template #footer>
       ITEMFOOTER
      </template>
    </TabbedModalItem>
    <TabbedModalItem name="gogi">
      gogi
      <a href="#" @click="modal.goto('childGogi')">-> childGogi</a>

      <TabbedModalItem name="childGogi" @goback="console.log('ugdags')">
        I'M CHILD GOGI
        <a href="#" @click="modal.goto('childBABYGogi')">-> childBABYGogi</a>
        <a href="#" @click="modal.goto('childBABYGogi2')">-> childBABYGogi2132121</a>

        <TabbedModalItem name="childBABYGogi" ref="childBABYGogi" @goback="console.log('ifsaf')">
          I'M childBABYGogi
          <button @click="childBABYGogi.goBack()">save</button>
        </TabbedModalItem>

        <TabbedModalItem name="childBABYGogi2">
          2222222222
          <template #footer>
            SDALDSALS LA SDDLSA
          </template>
        </TabbedModalItem>

      </TabbedModalItem>

    </TabbedModalItem>
    <TabbedModalItem name="task">
      TASK 123

      <template #footer>
       ITEMFOOTER
      </template>
    </TabbedModalItem>

    <template #mainFooter>
      MAIN FOOTER
    </template>
  </TabbedModal>
</template>

<script setup>
import TabbedModal from './components/TabbedModal.vue'
import TabbedModalItem from './components/TabbedModalItem.vue'

import { ref } from 'vue'

const modal = ref(null)
const childBABYGogi = ref(null)

</script>

<style scoped>
</style>
