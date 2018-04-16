<template>
  <div class="cd-schedule">

  <div class="month">
    <itemWeek :events="events"
              :itemRender="itemRender"></itemWeek>
  </div>
    <!--<div class="timeline">-->
      <!--<ul>-->
        <!--<li> <span>{{ currentTime }}</span></li>-->
        <!--<li v-for="hour in hoursArray" :key="hour">-->
          <!--<span>{{ hour }}</span>-->
        <!--</li>-->
        <!--&lt;!&ndash; additional elements here &ndash;&gt;-->
      <!--</ul>-->
    <!--</div>-->

    <!--<div class="events">-->
      <!--<ul>-->
        <!--<li class="events-group" v-for="day in weekArray" :key="day" >-->
          <!--<div class="top-info"><span>{{ day }}</span></div>-->

          <!--<ul>-->
            <!--<li class="single-event" data-start="09:30" data-end="10:30" data-content="event-abs-circuit" data-event="event-1">-->
              <!--<a href="#0">-->
                <!--<em class="event-name">Abs Circuit</em>-->
              <!--</a>-->
            <!--</li>-->

            <!--&lt;!&ndash; other events here &ndash;&gt;-->
          <!--</ul>-->
        <!--</li>-->
        <!--&lt;!&ndash; additional li.events-group here &ndash;&gt;-->
      <!--</ul>-->
    <!--</div>-->

    <!--<div class="event-modal">-->
      <!--<header class="header">-->
        <!--<div class="content">-->
          <!--<span class="event-date"></span>-->
          <!--<h3 class="event-name"></h3>-->
        <!--</div>-->

        <!--<div class="header-bg"></div>-->
      <!--</header>-->

      <!--<div class="body">-->
        <!--<div class="event-info"></div>-->
        <!--<div class="body-bg"></div>-->
      <!--</div>-->

      <!--<a href="#0" class="close">Close</a>-->
    <!--</div>-->
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
        return h('span', 'CustomRender：' + item.text)
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
    getDates (item) {
      this.dates = item
      console.log('dates at schedulerMain', item)
    }
  },
  created () {
    EventBus.$on('cell-dragenter', this.cellDragenter)
    EventBus.$on('item-dragstart', this.itemDragstart)
    EventBus.$on('item-drop', this.itemDrop)
    EventBus.$on('item-click', this.itemClick)
    EventBus.$on('date-click', this.dateClick)
    EventBus.$on('dates', this.getDates)
  },
  mounted () {
    return this.$http.get('http://localhost:3000/events').then(response => {
      this.events = response.body
      this.events = this.events.map(item => {
        item.date = moment(item.ends).format('YYYY-MM-DD')
        return item
      })
    }, error => {
      console.error(error)
    })
  },
  destoryed () {
    EventBus.$off()
  }
}
</script>
