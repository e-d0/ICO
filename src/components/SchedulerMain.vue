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
      console.log('cellDragenter', this.dragItem)
      this.$emit('event-dragenter', e, this.dragItem, date)
    },
    itemDragstart (e, item, date, type) {
      console.log('scheduler main itemdragstart')
      this.dragItem = item
      console.log('itemdragstart Func', this.dragItem)
      this.$emit('event-dragstart', e, item, date)
    },
    itemDrop (e, date, type, index) {
      console.log(this.dragItem)
      if (!this.dragItem) return
      console.log('[event-dragend]:', this.dragItem, date)
      // this.$emit('event-dragend', e, this.dragItem, date)
      this.changeDate(e, this.dragItem, date)
      console.log('item drop func')
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
    },
    changeDate (e, item, date) {
      // const updateIndex = this.events.findIndex(ele => ele.id === item.id)
      // const range = moment().range(item.starts, item.ends)
      let body = {
        'id': item.id,
        'name': item.name,
        'created_at': item.created_at,
        'updated_at': moment().format('YYYY-MM-DD HH:mm Z'),
        'starts': moment(date.setMinutes(item.date.getMinutes())).format('YYYY-MM-DD HH:mm Z'),
        'ends': '2018-04-17 12:53:17.892 +00:00',
        'type': item.type
      }
      console.log('date changed', body)
      return this.$http.patch(`http://localhost:3000/events/${item.id}`, body).then(response => {
        this.getEvents()
      }, error => {
        console.error(error)
      })
      // const updateIndex = this.events.findIndex(ele => ele.id === item.id)
      // this.$set(this.events, updateIndex, {
      //   ...this.events[updateIndex],
      //   date
      // })
    },
    getEvents () {
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
    }
  },
  created () {
    EventBus.$on('item-dragstart', this.itemDragstart)
    EventBus.$on('cell-dragenter', this.cellDragenter)
    EventBus.$on('item-drop', this.itemDrop)
    EventBus.$on('item-click', this.itemClick)
    EventBus.$on('date-click', this.dateClick)
    // EventBus.$on('dates', this.getDates)
    EventBus.$on('event-dragend', this.changeDate)
    console.log('dates at scheduler main', this.dates)
  },
  mounted () {
    this.getEvents()
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
