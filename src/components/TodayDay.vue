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
            <div v-for="(hour,ind) in generateHours(date, startHour)"
                 :key="ind"
                 v-bind:class="['timeline_item','timeline_item-scale' ,'timeline_item-scale--calendar']">
              <TodayHour :hour="hour"
                         :index="updatedIndex(index, ind)"
                         :date="updatedDayCell(hour)"></TodayHour>
            </div>
          </div>

        </div>
      </v-touch >
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import TodayHour from './TodayHour'
import { generateHours } from './eventbus'

export default {
  name: 'TodayDay',
  props: {
    index: null,
    date: null,
    startHour: Number
  },
  components: { TodayHour },
  data () {
    return {
      moment: this.$moment,
      emptyHoursArray: generateHours(null, this.startHour)
    }
  },
  computed: {
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
    generateHours (day, startHour) {
      // this.hoursArray = generateHours(this.day)
      return generateHours(day, startHour)
    },
    /**
       * Обновляем часы в текущей дате ячейки
       * */
    updatedDayCell (hour) {
      const h = new Date(hour)
      return h
    },
    /**
     * Создаем уникальный индекс для ячейки часа
     * */
    updatedIndex: function (dayIndex, index) {
      return Number(dayIndex.toString() + index.toString())
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
