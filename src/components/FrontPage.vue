<template>
  <div class="container">
    <div class="header">
      <span>header</span>
    </div>
    <div class="row">
        <div class="col-md-4">
            <div class="row">
              <div class="col-md-12">
                <scheduler-calendar @dates="sendDates"></scheduler-calendar>
              </div>
              <div class="col-md-12 mt-4">
                <schedulerFilter></schedulerFilter>
              </div>
            </div>
        </div>
        <div class="col-md-12">
            <scheduler-main v-if="filteredEvents"
                            :itemRender.sync="itemRender"
                            :dates="dates"
                            :events="filteredEvents"></scheduler-main>
        </div>
    </div>
  </div>
</template>

<script>
import { EventBus, countDiffBetweenDates } from './eventbus'
import moment from 'moment'
import schedulerFilter from './schedulerFilter'
import SchedulerMain from './SchedulerMain'
import SchedulerCalendar from './SchedulerCalendar'
import Vuex from 'vuex'
const storeEvent = Vuex.createNamespacedHelpers('event')

/**
 * Приводим дату в соотетствие с форматом в браузере пользователя
 * */
const locale = window.navigator.userLanguage || window.navigator.language
moment.locale(locale)

export default {
  name: 'FrontPage',
  components: { schedulerFilter, SchedulerMain, SchedulerCalendar },
  data () {
    return {
      itemRender (item) {
        const h = this.$createElement
        return h('span', 'CustomRender：' + item.name)
      }
      // dates: []
    }
  },
  computed: {
    ...storeEvent.mapGetters({
      events: 'events',
      filteredEvents: 'filteredEvents',
      dates: 'dates'
    })
  },
  methods: {
    sendDates (item) {
      console.log('emitted item', item)
      // this.dates = item
    },
    /**
     * Получаем события с сервера через хранилище store
     * */
    getEvents () {
      this.$store.dispatch('event/getEvents')
    },
    changeDate (e, item, date) {
      /**
       * Находим индекс элемента в текущем массиве событий
       * */
      const updateIndex = this.events.findIndex(ele => ele.id === item.id)
      /**
       * Считаем разницу
       * */
      const diff = countDiffBetweenDates(this.events[updateIndex].starts, this.events[updateIndex].ends)
      /**
       * Формируем json объект для отправки на сервер. Все даты в ISO 8601. (https://en.wikipedia.org/wiki/ISO_8601)
       * */
      let body = {
        'id': item.id,
        'name': item.name,
        'created_at': moment(item.created_at).toISOString(),
        'updated_at': moment().toISOString(),
        'starts': moment(date.setMinutes(item.date.getMinutes())).toISOString(),
        'ends': moment(date.setMinutes(item.date.getMinutes())).add(diff).toISOString(),
        'type': item.type
      }
      console.log('date changed', body)

      return this.$store.dispatch({
        type: 'event/changeEvent',
        value: body
      })
      // return this.$http.patch(`http://localhost:3000/events/${item.id}`, body).then(response => {
      //   this.getEvents()
      // }, error => {
      //   console.error(error)
      // })
    }
  },
  created () {
    /**
     * Обработчик глобального события
     */
    EventBus.$on('update-events', this.getEvents)
    // EventBus.$on('filter:change', this.filterEvents)
    EventBus.$on('event-dragend', this.changeDate)
    this.getEvents()
  },
  mounted () {
  },
  destoryed () {
    EventBus.$off()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
