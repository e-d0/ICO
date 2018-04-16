<template>

  <div class="week">
    <h2>Week component</h2>

    <itemDay :day="''"></itemDay>

      <itemDay :events="events"
               :itemRender="itemRender"
               v-for="item in weekArray"
               :day="item"
               :key="item"
                 ></itemDay>

  </div>
</template>

<script>
import moment from 'moment'
import itemDay from './itemDay'

export default {
  name: 'itemWeek',
  components: { itemDay },
  props: {
    events: null,
    itemRender: Function
  },
  data () {
    return {
      moment: moment,
      weekArray: null
    }
  },
  methods: {
    generateWeekDays () {
      this.weekArray = moment.weekdays()
    }
  },
  created () {
    this.generateWeekDays()
    var weeknumber = moment().week()
    console.log(weeknumber)
  }

}
</script>

<style scoped>

</style>
