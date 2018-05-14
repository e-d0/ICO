import Vue from 'vue'
import Router from 'vue-router'
import FrontPage from '@/components/FrontPage'
import BusinessForToday from '@/components/TodayPage'

Vue.use(Router)
/**
 * Есть требования для сервера в режиме history https://router.vuejs.org/ru/essentials/history-mode.html
 * */
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/calendar',
      name: 'FrontPage',
      component: FrontPage
    },
    {
      path: '/',
      name: 'businessForToday',
      component: BusinessForToday
    }
  ]
})
