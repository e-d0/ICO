// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/less/app.less'
import VueResource from 'vue-resource'
import VCalendar from 'v-calendar'
import 'v-calendar/lib/v-calendar.min.css'
import SchedulerCalendar from './components/SchedulerCalendar'
import SchedulerMain from './components/SchedulerMain'

Vue.use(VueResource)
Vue.http.options.root = 'http://localhost:3000'
Vue.config.productionTip = false

Vue.use(VCalendar, {
  firstDayOfWeek: 2 // Monday
})

Vue.component('scheduler-calendar', SchedulerCalendar)
Vue.component('scheduler-main', SchedulerMain)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
