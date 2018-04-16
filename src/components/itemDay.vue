<template>
  <div class="events-group">
    <div class="day">
      <div class="top-info"><span>{{ day }}</span></div>
      <div class="hours">
        <div v-for="hour in hoursArray" :key="hour" >
          <itemHour :hour="hour" :events="events" :itemRender="itemRender" ></itemHour>
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
    day: String
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
    updateCurrentTime () {
      this.currentTime = moment().format('LTS')
    }
  },
  created () {
    this.currentTime = moment().format('LTS')
    setInterval(() => this.updateCurrentTime(), 1 * 1000)
    this.hoursArray = generateHours()
  }
}
</script>

<style scoped>

</style>
