<template>
      <calendar-days></calendar-days>
</template>

<script>
import CalendarDays from './CalendarDays'

export default {
  name: 'Week',
  components: { CalendarDays },
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
