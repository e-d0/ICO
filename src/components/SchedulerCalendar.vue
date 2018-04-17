<template>
  <!--<v-calendar :attributes='attrs'>-->
  <!--</v-calendar>-->
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
import { EventBus, createDays } from './eventbus'
/*
* Отключил предупреждение. Слишком уж консоль засоряет.
**/
moment.suppressDeprecationWarnings = true
export default {
  name: 'calendar',
  props: {
  },
  data () {
    return {
      selectedDate: {
        start: moment().startOf('week').toDate(), end: moment().endOf('week').toDate()
      }
    }
  },
  methods: {
    datesEmit (e) {
      let daysArr = createDays(e)
      EventBus.$emit('dates', daysArr)
      console.log(daysArr, 'schedular caletndar emitted dates array')
    }
  },
  created () {
    /**
     * Создаем массив дней в зависимости от принятых дат
     * и передаем в глобальное событие
     */
    console.log('el calendar is created')
    this.datesEmit(this.selectedDate)
  }
}
</script>
