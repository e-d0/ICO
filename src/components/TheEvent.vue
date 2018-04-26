<template>
  <div class="timeline_event timeline_event--KYC">

    <div class="timeline_event-data">
      <span class="timeline_event-time"> {{returnDate(item)}} <a class="timeline_event-notification-bell"></a><a href="#" class="timeline_event-notification-message"></a></span>
      <span class="timeline_event-name timeline_event-name--calendar">{{item.name}}</span>
    </div>

    <div class="timeline_event-type">
      <span></span>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'TheEvent',
  props: {
    item: Object
  },
  methods: {
    returnDate: function (el) {
      return moment(el.starts).format('HH:mm')
    }
  }
}
</script>

<style scoped>

</style>
