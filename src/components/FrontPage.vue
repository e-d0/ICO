<template>
  <div class="container">
    <div class="header">
      <span>header</span>
    </div>
    <div class="row">
        <div class="col-md-4">
            <div class="row">
              <div class="col-md-12">
                calendar
                <scheduler-calendar :dates="dates"></scheduler-calendar>
              </div>
            </div>
            <div class="col-md-12">
              filter
            </div>

        </div>
        <div class="col-md-12">
        <div class="row scheduler">
          <div class="col-md-12 scheduler__controller">
            control btns
          </div>
          <div class="col-md-12 scheduler__main">

            <scheduler-main :dates="dates"></scheduler-main>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EventBus } from './eventbus'

export default {

  name: 'FrontPage',

  data () {
    return {
      dates: null
    }
  },
  methods: {
    addEvent () {
      // this.$http.post('http://localhost:3000/events',
      //   { 'id': 5,
      //     'name': 'event-5',
      //     'date-start': '2018-04-16 21:53:17.892 +00:00',
      //     'date-end': '2018-04-16 22:53:17.892 +00:00',
      //     'type': 'ICO' }
      // ).then(alert(1))
    },
    sendDates (item) {
      this.dates = item['0'].dates
      console.log(item)
    }
  },
  created () {
    EventBus.$on('dates', this.sendDates)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
