
<template>
  <TabbedModal ref="modal">
    <TabbedModalItem name="test">
      test 123
    </TabbedModalItem>
    <TabbedModalItem name="gogi">
      gogi
      <a href="#" @click="modal.goto('childGogi')">-> childGogi</a>

      <TabbedModalItem name="childGogi">
        I'M CHILD GOGI
      </TabbedModalItem>

    </TabbedModalItem>
    <TabbedModalItem name="task">
      TASK 123
    </TabbedModalItem>

  </TabbedModal>
</template>

<script setup>
import TabbedModal from './components/TabbedModal.vue'
import TabbedModalItem from './components/TabbedModalItem.vue'

import { ref } from 'vue'

const modal = ref(null)

</script>

<style scoped>
</style>
