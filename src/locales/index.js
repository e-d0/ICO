import Vue from 'vue'
import VueI18n from 'vue-i18n'

/**
 * Импортируем переводы
 */
import en from './i18n/en_US'
import ru from './i18n/ru_RU'

/**
 * Конфигурируем объект с переводами
 */
Vue.use(VueI18n)
/**
 * locale: язык по умолчанию. Меняется через storage в main.js
 * */
export default new VueI18n({
  locale: 'en',
  messages: {
    en: en,
    ru: ru
  }
})
