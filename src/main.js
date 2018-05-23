// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './assets/less/app.less'
import VueResource from 'vue-resource'
import VCalendar from 'v-calendar'
import 'v-calendar/lib/v-calendar.min.css'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import moment from 'moment'
import VueTouch from 'vue-touch'
import i18n from './locales'

/**
 * Получаем язык из vuex storage
 * */
const lang = store.getters['locale/language']
/**
 * Подключаем Hummer.js для vue. https://github.com/vuejs/vue-touch/tree/next
 * **/
VueTouch.config.swipe = {
  direction: 'horizontal'
}
VueTouch.config.pan = {
  direction: 'horizontal'
}
Vue.use(VueTouch, {name: 'v-touch'})

/**
* //TODO Отключил предупреждение. Слишком уж консоль засоряет.
* календарь отсюда https://github.com/nathanreyes/v-calendar
**/
moment.suppressDeprecationWarnings = true
/**
 * Приводим дату в соотетствие с форматом в браузере пользователя
 * */
const locale = window.navigator.userLanguage || window.navigator.language
moment.locale(lang || locale)
/**
 * Импортируем глобально moment.js
 * теперь он доступен во всех компонентах через this.$moment && this.moment
 * */
Vue.prototype.$moment = moment
Vue.prototype.moment = moment

Vue.use(BootstrapVue)

Vue.use(VueResource)
Vue.config.productionTip = false

Vue.use(VCalendar, {
  firstDayOfWeek: 2 // Monday
})

if (lang) {
  i18n.locale = lang
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  store,
  i18n,
  template: '<App/>'
})
