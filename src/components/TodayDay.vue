<template>
  <div class="calendar__today_item">

    <div class=" timeline_item-head">
      <span class="timeline_item-date">{{ moment(date).format('DD MMMM') }}</span>
    </div>
    <div class="calendar--body">

      <div class="time-group">

        <div class="timeline_item timeline_item-time" v-for="(hour, index) in emptyHoursArray" :key="index" >

          <span v-if=" moment.locale() === 'ru'">{{ hour.format('HH:mm') }}</span>
          <span v-else>{{ hour.format('hh a') }}</span>

        </div>
      </div>
      <v-touch class="events"
               id="events">
        <div class="events-group" v-if="date">

          <div class="hours">
            <div v-for="(hour,ind) in generateHours(date)"
                 :key="ind"
                 v-bind:class="['timeline_item','timeline_item-scale' ,'timeline_item-scale--calendar']">
              <itemHour :hour="hour"
                        :itemRender.sync="itemRender"
                        :preventMultiStack="preventMultiStack"
                        :date="updatedDayCell(hour)"></itemHour>
            </div>
          </div>

        </div>
      </v-touch >
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import itemHour from './itemHour'
import { generateHours } from './eventbus'
import Vuex from 'vuex'
const storeEvent = Vuex.createNamespacedHelpers('event')
/**
   * Приводим дату в соотетствие с форматом в браузере пользователя
   * */
const locale = window.navigator.userLanguage || window.navigator.language
moment.locale(locale)

export default {
  name: 'TodayDay',
  props: {
    date: null,
    itemRender: Function,
    preventMultiStack: Boolean
  },
  components: { itemHour },
  data () {
    return {
      moment: this.moment,
      emptyHoursArray: generateHours()
    }
  },
  computed: {
    ...storeEvent.mapGetters({
      events: 'events',
      filteredEvents: 'filteredEvents'
    })
  },
  filters: {
    weekDayName: function (value) {
      if (!value) return ''
      return moment(value).format('dddd')
    }
  },
  methods: {
    /**
       * Генерируем часы с датой для каждой ячейки
       * */
    generateHours (day) {
      // this.hoursArray = generateHours(this.day)
      return generateHours(day)
    },
    /**
       * Обновляем часы в текущей дате ячейки
       * */
    updatedDayCell (hour) {
      const h = new Date(hour)
      return h
    }
  },
  created () {
  }
}
</script>

<style scoped>
  .timeline_item {
    cursor: -webkit-grab;
  }

  .grabbing.timeline_item{
    cursor: grabbing;
  }
  #events{}
  .empty-slot{
    height: 62px;
    border-bottom: 1px solid #e0e6ed;
  }
</style>
