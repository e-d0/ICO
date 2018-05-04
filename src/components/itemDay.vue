<template>
  <div class="calendar--body">

    <div class="time-group">
      <div class="empty-slot">
      </div>
      <div class="timeline_item timeline_item-time" v-for="hour in emptyHoursArray" :key="hour" >

        <span>{{ hour }}</span>

      </div>
    </div>
    <div class="events">
    <div class="events-group" v-if="dates"
                              v-for="(dayItem, dayInd) in dates"
                              :key="dayInd">

        <div class="timeline_item-data timeline_item-scale--calendar timeline_item-head">
          <span class="timeline_item-date">{{ moment(dayItem).format('D') }}</span>
          <span class="timeline_item-day">{{ dayItem | weekDayName }}</span>
        </div>

        <div class="hours">
          <div :class="['timeline_item','timeline_item-scale' ,'timeline_item-scale--calendar']"
               v-if="dayItem"
               v-for="(hour,ind) in generateHours(dayItem)"
               :key="ind" >
                <itemHour :hour="hour"
                          :index="updatedIndex(dayInd, ind)"
                          :itemRender.sync="itemRender"
                          :date="updatedDayCell(hour)"></itemHour>
          </div>
        </div>

    </div>
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
  name: 'Day',
  props: {
    itemRender: Function,
    dayIndex: Number
  },
  components: { itemHour },
  data () {
    return {
      moment: moment,
      currentTime: null,
      emptyHoursArray: generateHours()
    }
  },
  computed: {
    ...storeEvent.mapGetters({
      events: 'events',
      filteredEvents: 'filteredEvents',
      dates: 'dates'
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
     * Обновляем текущее время
     * */
    updateCurrentTime () {
      this.currentTime = moment().format('LTS')
    },
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
    },
    /**
     * Создаем уникальный индекс для ячейки часа
     * */
    updatedIndex: function (dayIndex, index) {
      return Number(dayIndex.toString() + index.toString())
    }
  },
  created () {
    this.currentTime = moment().format('LTS')
    setInterval(() => this.updateCurrentTime(), 1 * 1000)
  }
}
</script>

<style scoped>
.empty-slot{
    height: 62px;
    border-bottom: 1px solid #e0e6ed;
  }
</style>
