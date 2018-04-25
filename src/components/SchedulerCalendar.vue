<template>
  <v-date-picker
    mode='range'
    v-model='selectedDate'
    show-caps
    @input="datesEmit"
    is-inline>
  </v-date-picker>
</template>

<script>
import moment from 'moment'
import { createDays } from './eventbus'

/**
 * Приводим дату в соотетствие с форматом в браузере пользователя
 * */
const locale = window.navigator.userLanguage || window.navigator.language
moment.locale(locale)
/*
* //TODO Отключил предупреждение. Слишком уж консоль засоряет.
**/
moment.suppressDeprecationWarnings = true
export default {
  name: 'calendar',
  props: {
  },
  data () {
    return {
      selectedDate: {
        start: moment().startOf('day').toDate(), end: moment().endOf('week').toDate()
      }
    }
  },
  methods: {
    datesEmit (e) {
      /**
       * Готовим и отправляем  событие массив выбранных дней
       * */
      const generatedDays = createDays(e.start, e.end)
      this.$store.dispatch({
        type: 'event/setDates',
        data: generatedDays
      })
      console.log(generatedDays, 'schedular caletndar emitted dates array')
    }
  },
  created () {
  },
  mounted () {
    /**
     * Создаем массив дней в зависимости от принятых дат
     * и передаем в глобальное событие
     */
    console.log('el calendar is created')
    this.datesEmit(this.selectedDate)
  },
  computed: {
  }
}
</script>
