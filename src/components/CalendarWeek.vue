<template>
      <calendar-day></calendar-day>
</template>

<script>
import CalendarDay from './CalendarDay'

export default {
  name: 'Week',
  components: { CalendarDay },
  props: {
  },
  data () {
    return {
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
