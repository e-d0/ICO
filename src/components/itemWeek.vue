<template>

  <div class="week">
    <h2>Week component</h2>

    <div class="events-group">
      <div class="day">
        <div class="top-info"><span></span></div>
        <div class="hours">
          <div v-for="hour in hoursArray" :key="hour" >
            <div class="hour">
              {{ hour }}
            </div>
          </div>
        </div>
      </div>
    </div>

      <itemDay :events="events"
               :itemRender="itemRender"
               v-for="(item, index) in dates"
               :day="item"
               :dayIndex="index"
               :key="index"
                 ></itemDay>

  </div>
</template>

<script>
import moment from 'moment'
import itemDay from './itemDay'
import { EventBus, generateHours } from './eventbus'

export default {
  name: 'itemWeek',
  components: { itemDay },
  props: {
    events: null,
    itemRender: Function,
    dates: null
  },
  data () {
    return {
      moment: moment,
      weekArray: null
    }
  },
  methods: {
    getDates (items) {
      this.$emit('update:dates', items)
      console.log('dates at schedulerMain', items)
    }
  },
  created () {
    this.hoursArray = generateHours()
    // var weeknumber = moment().week()\
    console.log('week dates here')
    console.log(this.dates)
    EventBus.$on('dates', this.getDates)
  }

}
</script>

<style scoped>

</style>
