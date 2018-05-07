import Vue from 'vue'
import Router from 'vue-router'
import FrontPage from '@/components/FrontPage'
import BusinessForToday from '@/components/PageBusinessForToday'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'FrontPage',
      component: FrontPage
    },
    {
      path: '/today',
      name: 'businessForToday',
      component: BusinessForToday
    }
  ]
})
