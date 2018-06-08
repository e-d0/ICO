// Modules
import Vue from 'vue'
import Vuex from 'vuex'

import Event from './modules/event'
import Locale from './modules/locale'
import Portfolio from './modules/Portfolio'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state: {
    api: {
      scheme: 'http',
      host: 'localhost:3000',
      path: ''
      // endpoints: {
      //   '/auth/token': {
      //     required_parameters: ['login', 'password']
      //   }
      // }
    }
  },
  getters: {
    api_url: state => state.api.scheme + '://' + state.api.host + state.api.path
  },
  actions: {},
  mutations: {},
  modules: {
    event: Event,
    locale: Locale,
    portfolio: Portfolio
  },
  strict: debug
})
