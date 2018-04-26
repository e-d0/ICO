<template>
  <div class="calendar--body">

    <div class="events-group">
      <div class="timeline_item-data">
        <span class="timeline_item-date" style="color: transparent;">empty</span>
        <span class="timeline_item-day" style="color: transparent;">text</span>
      </div>
      <div class="hours">
          <div class="timeline_item-scale timeline_item-scale--calendar timeline_item-scale--calendar-today">
            <div class="timeline_item-time" v-for="hour in emptyHoursArray" :key="hour" >

            <span>{{ hour }}</span>

            </div>
          </div>
      </div>
    </div>

    <div class="events-group" v-if="dates"
                              v-for="(dayItem, dayInd) in dates"
                              :key="dayInd">

        <div class="timeline_item-data">
          <span class="timeline_item-date">{{ moment(dayItem).format('dd') }}</span>
          <span class="timeline_item-day">{{ dayItem | weekDayName }}</span>
        </div>

        <div class="hours">
          <div :class="['timeline_item-scale' ,'timeline_item-scale--calendar']"
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

</template>

<script>
import moment from 'moment'
import itemHour from './itemHour'
import { generateHours } from './eventbus'
/**
 * Приводим дату в соотетствие с форматом в браузере пользователя
 * */
const locale = window.navigator.userLanguage || window.navigator.language
moment.locale(locale)

export default {
  name: 'Day',
  props: {
    itemRender: Function,
    dates: Array,
    dayIndex: Number
  },
  components: { itemHour },
  data () {
    return {
      moment: moment,
      currentTime: null,
      emptyHoursArray: generateHours(),
      newDates: []
    }
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

</style>
