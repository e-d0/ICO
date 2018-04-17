<template>
  <div class="events-group">
    <div class="day">
      <div class="top-info"><span>{{ convertedDay }}</span></div>
      <div class="hours">
        <div v-for="(hour,index) in hoursArray" :key="index" >
          <itemHour :hour="hour" :events="events" :itemRender="itemRender" :date="updatedDayCell(hour)"></itemHour>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import moment from 'moment'
import itemHour from './itemHour'
import { generateHours } from './eventbus'

export default {
  name: 'Day',
  props: {
    events: null,
    itemRender: Function,
    day: Date,
    dayIndex: Number
  },
  components: { itemHour },
  data () {
    return {
      moment: moment,
      currentTime: null,
      hoursArray: []
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
     * Обновляем часы в текущей дате ячейки
     * */
    updatedDayCell (hour) {
      // console.log('setHourForCurrentDayCel', this.day.setHours(hour))
      return new Date(hour)
    }
  },
  created () {
    this.currentTime = moment().format('LTS')
    setInterval(() => this.updateCurrentTime(), 1 * 1000)
    this.hoursArray = generateHours(this.day)
    console.log(this.hoursArray)
  },
  computed: {
    convertedDay: function () {
      return moment(this.day).format('dddd')
    }
  }
}
</script>

<style scoped>

</style>
