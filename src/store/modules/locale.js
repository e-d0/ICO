import VueI18n from '../../locales/index.js'
import moment from 'moment-timezone'

export const state = () => ({
  locales: ['en', 'ru'],
  locale: window.localStorage.language || 'en',
  timezone: window.localStorage.timezone || moment.tz.guess(),
  timezones: ['America/New_York', 'Europe/London', 'Europe/Moscow']
})

const getters = {
  language: state => state.locale,
  getLanguages: state => state.locales,
  timezone: state => state.timezone,
  getTimezones: state => state.timezones
}

const actions = {
  setLanguage (context, payload) {
    console.log('>>>> set language to storage', payload)
    context.commit('SET_LANG', payload)
  },
  setTimezone (context, payload) {
    console.log('>>>> set timezone to storage', payload)
    context.commit('SET_TIMEZONE', payload)
  }
}

export const mutations = {
  SET_LANG (state, locale) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale
      VueI18n.locale = locale
      window.localStorage.language = locale
    }
  },
  SET_TIMEZONE (state, timezone) {
    if (state.timezones.indexOf(timezone) !== -1) {
      state.timezone = timezone
      window.localStorage.timezone = timezone
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
