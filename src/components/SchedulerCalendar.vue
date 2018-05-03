<template>
  <v-date-picker
    mode='range'
    v-model='selectedDate'
    show-caps
    @input="datesEmit"
    :select-attribute='attrs'
    :formats='formats'
    is-inline>
  </v-date-picker>
</template>

<script>
import { createDays } from './eventbus'

export default {
  name: 'calendar',
  props: {
  },
  data () {
    return {
      attrs:
        {
          highlight: {
            backgroundColor: '#e8edf1'
          },
          contentStyle: {
            color: '#393d46'
          }
        },
      formats: {
        title: 'MMMM YYYY'
      },
      selectedDate: {
        start: this.$moment().startOf('day').toDate(),
        end: this.$moment().endOf('week').toDate()
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
<style lang="less">
  .c-title{
    text-transform: capitalize;
  }
  .c-day{

  }
</style>
