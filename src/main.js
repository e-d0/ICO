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
import moment from 'moment-timezone'
import VueTouch from 'vue-touch'
import i18n from './locales'

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
 * Получаем язык из vuex storage
 * */
const lang = store.getters['locale/language']

/**
 * Приводим дату в соотетствие с форматом в браузере пользователя
 * */
const locale = window.navigator.userLanguage || window.navigator.language
/**
 * Устанавливаем по язык для формата дат. Сначала проверяем localStorage браузера
 * */
moment.locale(window.localStorage.language || lang || locale)

/**
 * Получаем язык из vuex storage
 * */
const timezone = store.getters['locale/timezone']
/**
 * Устанавливаем таймзону по умолчанию http://momentjs.com/timezone/
 * */
moment.tz.setDefault(window.localStorage.timezone || timezone || moment.tz.guess())
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
  firstDayOfWeek: 2, // Monday
  locale: window.localStorage.language || lang || locale
})

/**
 * Устанавливаем яык приложения для перевода
 * */
if (lang) {
  i18n.locale = window.localStorage.language || lang || locale
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
