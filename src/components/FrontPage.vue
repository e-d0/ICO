<template>
  <div id="app">
    <tplHeader></tplHeader>
      <div class="container-fluid">
        <div class="row">

                <div class="col-md-12 col-lg-3">
                    <div class="filter">
                      <scheduler-calendar></scheduler-calendar>
                      <schedulerFilter></schedulerFilter>
                    </div>
                </div>
                <div class="col-md-12 col-lg-9">
                    <scheduler-main v-if="filteredEvents"
                                    :itemRender.sync="itemRender"
                                    :dates="dates"
                                    :events="filteredEvents"></scheduler-main>
                </div>

        </div>
    </div>
    <tplFooter></tplFooter>
  </div>
</template>

<script>
import tplHeader from './TheHeader'
import tplFooter from './TheFooter'
import theEvent from './TheEvent'
import { EventBus, countDiffBetweenDates } from './eventbus'
import schedulerFilter from './schedulerFilter'
import SchedulerMain from './SchedulerMain'
import SchedulerCalendar from './SchedulerCalendar'
import Vuex from 'vuex'
const storeEvent = Vuex.createNamespacedHelpers('event')

export default {
  name: 'FrontPage',
  components: { schedulerFilter, SchedulerMain, SchedulerCalendar, tplHeader, tplFooter, theEvent },
  data () {
    return {
      itemRender (item, index) {
        const h = this.$createElement
        return h(theEvent, { props: {
          item, index
        } })
      }
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
    /**
     * Получаем события с сервера через хранилище store
     * */
    getEvents () {
      this.$store.dispatch('event/getEvents')
    },
    changeDate (e, item, date) {
      console.log('item to cHANGE <<<<<<', item)
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
        'created_at': this.$moment(item.created_at).toISOString(),
        'updated_at': this.$moment().toISOString(),
        'starts': this.$moment(date.setMinutes(item.date.getMinutes())).toISOString(),
        'ends': this.$moment(date.setMinutes(item.date.getMinutes())).add(diff).toISOString(),
        'type': item.type
      }
      console.log('date changed', body)

      return this.$store.dispatch({
        type: 'event/changeEvent',
        value: body
      })
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
  beforeCreate () {
    /**
     * На всякий случай ,очищаем фильтр по именам
     * */
    // this.$store.dispatch('event/setFiltersNames', Array(0))
  },
  destoryed () {
    EventBus.$off()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
