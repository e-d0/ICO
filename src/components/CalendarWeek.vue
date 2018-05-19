<template>
      <calendar-day></calendar-day>
</template>

<script>
import moment from 'moment'
import CalendarDay from './CalendarDay'
/**
 * Приводим дату в соотетствие с форматом в браузере пользователя
 * */
const locale = window.navigator.userLanguage || window.navigator.language
moment.locale(locale)

export default {
  name: 'Week',
  components: { CalendarDay },
  props: {
  },
  data () {
    return {
      moment: moment,
      weekArray: null,
      datesArray: []
    }
  },
  methods: {
  },
  created () {
  },
  mounted () {
  },
  computed: {
  }

}
</script>

<style lang="less">
</style>
