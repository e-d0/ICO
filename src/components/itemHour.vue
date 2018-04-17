<template>
  <div class="hour">
    <span v-if="checkForDateObj(hour)">{{ dateFormat(hour) }}</span>
    <span v-else>{{ hour }}</span>

    <event v-if="details.length"
           v-for="(item) in details"
           :key="item.id"
           :item="item"
           :itemRender="itemRender"
           :date="date"></event>
  </div>

</template>

<script>
import event from './itemEvent'
import moment from 'moment'
import { isSameDay } from './eventbus'

export default {
  name: 'Hour',
  data () {
    return {
      volume: 0,
      expanded: false
    }
  },
  components: { event },
  props: {
    date: Date,
    hour: Date,
    events: null,
    itemRender: Function
  },
  methods: {
    checkForDateObj (hour) {
      /**
       * Проверяем входящий формат времени: объект или строка.
       */
      return typeof hour !== 'string'
    },
    dateFormat (date) {
      return moment(date).format('H:mm')
    }
  },
  computed: {
    details () {
      /**
       * проверка, совпадает ли дата события и дата объекта ячейки */
      // return this.events.length ? this.events.filter(item => isSameDay(item.date, this.date)) : []
      if (this.events.length) {
        // console.log('dateail length true', this.events.filter(item => isSameDay(item.date, this.date)))
        // console.log('dateal length true')
        return this.events.filter(item => isSameDay(item.date, this.date))
      } else {
        return []
      }
    },
    displayDetails () {
      // return this.expanded ? this.details : this.details.slice(0, this.volume)
      if (this.expanded) {
        console.log('disDetails TRUE', this.details())
        return this.details()
      } else {
        console.log('disDetails FALSE', this.details.slice(0, this.volume))
        return this.details.slice(0, this.volume)
      }
    }

  }
}
</script>

<style lang="less" >

</style>
