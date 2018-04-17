<template>
  <div class="cd-schedule">

  <div class="month">
    <itemWeek :events="events"
              :itemRender="itemRender"
              :dates="dates"></itemWeek>
  </div>

  </div>
</template>

<style lang="less" >

</style>

<script>
import moment from 'moment'
import itemWeek from './itemWeek'
import { EventBus } from './eventbus'

export default {
  name: 'Schedule',
  components: { itemWeek },
  props: {
    dates: null
  },
  data () {
    return {
      moment: moment,
      dragItem: null,
      events: {
        type: Array,
        // eslint-disable-next-line vue/require-valid-default-prop
        default: []
      },
      itemRender (item) {
        const h = this.$createElement
        return h('span', 'CustomRender：' + item.name)
      }
    }
  },
  methods: {
    cellDragenter (e, date, type, index) {
      this.$emit('event-dragenter', e, this.dragItem, date)
    },
    itemDragstart (e, item, date, type) {
      this.dragItem = item
      this.$emit('event-dragstart', e, item, date)
    },
    itemDrop (e, date, type, index) {
      if (!this.dragItem) return
      console.log('[event-dragend]:', this.dragItem, date)
      this.$emit('event-dragend', e, this.dragItem, date)
    },
    itemClick (e, item) {
      console.log('[event-click]:', item)
      this.$emit('event-click', e, item)
    },
    dateClick (e, date) {
      console.log('[date-click]:', date)
      this.$emit('date-click', e, date)
    },
    getDates (items) {
      this.$emit('update:dates', items)
      console.log('dates at schedulerMain', items)
    }
  },
  created () {
    EventBus.$on('cell-dragenter', this.cellDragenter)
    EventBus.$on('item-dragstart', this.itemDragstart)
    EventBus.$on('item-drop', this.itemDrop)
    EventBus.$on('item-click', this.itemClick)
    EventBus.$on('date-click', this.dateClick)
    // EventBus.$on('dates', this.getDates)
    console.log('dates at scheduler main', this.dates)
  },
  mounted () {
    /**
     * Получаем события с сервера
     * */
    return this.$http.get('http://localhost:3000/events').then(response => {
      this.events = response.body
      /**
       * Создаем поле начала события в каждом объекте события и приводим к формату Date
       * */
      this.events = this.events.map(item => {
        item.date = new Date(item.starts)
        return item
      })
    }, error => {
      console.error(error)
    })
  },
  watch: {
    acceptedDates: function () {
      return this.dates
    }
  },
  destoryed () {
    EventBus.$off()
  }
}
</script>
