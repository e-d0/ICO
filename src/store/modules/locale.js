import VueI18n from '../../locales/index.js'

export const state = () => ({
  locales: ['en', 'ru'],
  locale: window.localStorage.language || 'en'
})

const getters = {
  language: state => state.locale,
  getLanguages: state => state.locales
}

const actions = {
  setLanguage (context, payload) {
    console.log('>>>> set language to storage', payload)
    context.commit('SET_LANG', payload)
  }
}

export const mutations = {
  SET_LANG (state, locale) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale
      VueI18n.locale = locale
      window.localStorage.language = locale
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
