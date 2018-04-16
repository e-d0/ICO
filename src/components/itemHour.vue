<template>
  <div class="hour">
    {{ hour }}
    <event ></event>
  </div>

</template>

<script>
import event from './itemEvent'
import { isSameDay } from './eventbus'

export default {
  name: 'Hour',
  components: { event },
  props: {
    date: Date,
    hour: String,
    events: null,
    itemRender: Function
  },
  computed: {

    details () {
      return this.data.length ? this.data.filter(item => isSameDay(item.date, this.date)) : []
    },
    displayDetails () {
      return this.expanded ? this.details : this.details.slice(0, this.volume)
    }

  }
}
</script>

<style lang="less" >

</style>
