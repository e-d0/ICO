// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/less/app.less'
import VueResource from 'vue-resource'
import VCalendar from 'v-calendar'
import 'v-calendar/lib/v-calendar.min.css'

import store from './store'

Vue.use(VueResource)
Vue.config.productionTip = false

Vue.use(VCalendar, {
  firstDayOfWeek: 2 // Monday
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  store,
  template: '<App/>'
})
