<template>
  <div class="body">
    <div class="events-group">
      <div class="day">
        <div class="top-info"><span></span></div>
        <div class="hours">
          <div v-for="hour in emptyHoursArray" :key="hour" >
            <div class="hour">
              {{ hour }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="events-group" v-if="dates"
                              v-for="(dayItem, dayInd) in dates"
                              :key="dayInd">
      <div class="day">
        <div class="top-info"><span v-if="dayItem">{{ dayItem | weekDayName }}</span></div>
        <div class="hours">
          <div v-if="dayItem"
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
