<template>

  <event v-if="formattedEvents[1]"
         :style="{ zIndex: 5 }"
         :key="formattedEvents[0].id"
         :item="formattedEvents[0]"
         :type="formattedEvents[0].type"
         :itemRender="itemRender"
         :index="1"
         @item-dragstart="dragItem"
         :date="date"></event>

</template>

<script>
import event from './itemEvent'
export default {
  name: 'itemMultiEvent',
  components: { event },
  data () {
    return {
    }
  },
  props: {
    formattedEvents: Array,
    itemRender: Function
  }
}
</script>

<style scoped>

</style>
