<template>
  <v-calendar :attributes='attrs'>
  </v-calendar>
</template>

<script>
import moment from 'moment'
import { EventBus } from './eventbus'

export default {
  name: 'calendar',
  props: {
    dates: null
  },
  data () {
    return {
      selectedDates: null,
      attrs: [
        {
          key: 'today',
          dates: { start: moment().startOf('week').toDate(), end: moment().endOf('week').toDate() },
          highlight: {
            backgroundColor: '#ff8080'
          },
          // Just use a normal style
          contentStyle: {
            color: '#fafafa'
          }
        }
      ]
    }
  },
  methods: {},
  created () {
    // var weeknumber = moment().week()
    EventBus.$emit('dates', this.attrs)
  }
}
</script>
