export const state = () => ({
  locales: ['en', 'ru'],
  locale: 'ru'
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
