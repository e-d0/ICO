import Vue from 'vue'
import Router from 'vue-router'
import CalendarPage from '@/components/CalendarPage'
import TodayPage from '@/components/TodayPage'
import PortfolioPage from '@/components/PortfolioPage'

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
      component: CalendarPage
    },
    {
      path: '/',
      name: 'TodayPage',
      component: TodayPage
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      component: PortfolioPage
    }
  ]
})
