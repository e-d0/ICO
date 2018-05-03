<template>
      <itemDay  :itemRender.sync="itemRender"
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
    itemRender: Function
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
