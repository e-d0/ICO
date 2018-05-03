<template>
  <div :class="['timeline_event', `timeline_event--${item.type}`]">

    <div class="timeline_event-data">
      <span class="timeline_event-time"> {{returnDate(item)}}
        <a v-if="item.alerts !== undefined
              && item.alerts.length
              && item.alerts != null
          " class="timeline_event-notification-bell"></a>
        <a v-if="(item.comment != null) && (item.comment !== '')" href="#" class="timeline_event-notification-message"></a>
      </span>
      <span class="timeline_event-name timeline_event-name--calendar">{{item.name}}</span>
    </div>
    <div class="timeline_event-type">
      <span></span>
    </div>
    <popover  :popoverShow="popoverShow" :clickedEvent="item" ></popover>

  </div>
</template>

<script>
import popover from './popover'

export default {
  name: 'TheEvent',
  components: { popover },
  props: {
    item: Object
  },
  data () {
    return {
      popoverShow: false
    }
  },
  computed: {
  },
  methods: {
    returnDate: function (el) {
      return this.$moment(el.starts).format('HH:mm')
    },
    onClose () {
      this.popoverShow = false
    },
    onShow () {
      /* This is called just before the popover is shown */
      /* Reset our popover "form" variables */
    },
    onShown () {
      /* Called just after the popover has been shown */
      /* Transfer focus to the first input */
    },
    onHidden () {
      /* Called just after the popover has finished hiding */
      /* Bring focus back to the button */
    }
  },
  created () {
  }
}
</script>

<style scoped>

</style>
