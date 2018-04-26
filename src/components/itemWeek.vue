<template>
      <itemDay :events="events"
               :itemRender.sync="itemRender"
               :dates="dates"
                 ></itemDay>
</template>

<script>
import moment from 'moment'
import itemDay from './itemDay'
/**
 * Приводим дату в соотетствие с форматом в браузере пользователя
 * */
const locale = window.navigator.userLanguage || window.navigator.language
moment.locale(locale)

export default {
  name: 'itemWeek',
  components: { itemDay },
  props: {
    events: Array,
    itemRender: Function,
    dates: Array
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

<style scoped>

</style>
