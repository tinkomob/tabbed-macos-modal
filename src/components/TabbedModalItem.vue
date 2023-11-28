<template>
  <div>
    <!-- <slot /> -->
    <render />
  </div>
</template>

<script setup>
  import { onMounted, useSlots, h} from 'vue'
  const slots = useSlots().default()
  const props = defineProps({
    name: String,
    openedChild: String,
  })
  
  const render = () => {
    let childTabs = slots.filter(item => item.type.__name == 'TabbedModalItem')
    let toRender = slots.filter(item => item.type.__name != 'TabbedModalItem')
    if (props.openedChild) toRender.push(childTabs.find(item => item.props.name == openedChild))
    return h('div', {}, toRender)
  };

  onMounted(() => {
    // console.log(props.name)
  })

  defineExpose({
    slots
  })
</script>

<style lang='scss' scoped>
</style>