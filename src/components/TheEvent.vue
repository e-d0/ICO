<template>
  <div :class="['timeline_event', `timeline_event--${item.tempType}`]">

    <div class="timeline_event-data">
      <span class="timeline_event-time"> {{returnDate(item)}}
        <a v-if="showAlertsIcon()"
              class="timeline_event-notification-bell"></a>
        <a v-if="showCommentsIcon()" class="timeline_event-notification-message"></a>
      </span>
      <span class="timeline_event-name timeline_event-name--calendar">{{item.name}}</span>

    </div>
    <div :class="['timeline_event-type', {'starts': item.isStart === true }, {'ends': item.isStart === false}]">
      <template  v-if="index === null || index === undefined ">
        <span>{{ getTypeNameByCode() }}</span>
      </template>
    </div>
    <div v-if="index && multi === true"
         :class="['event_nav']"
         @click.stop.prevent="nextEvent()" >{{ index }}
    </div>
    <popover :target="target" :popoverShow="popoverShow" :clickedEvent="item"></popover>

  </div>
</template>

<script>
import popover from './popover'

export default {
  name: 'TheEvent',
  components: { popover },
  props: {
    item: Object,
    index: String,
    multi: Boolean,
    target: String
  },
  data () {
    return {
      popoverShow: false
    }
  },
  computed: {
  },
  methods: {
    /**
     * Проверяем, отображаться ли иконке оповещения
     * */
    showAlertsIcon: function () {
      if (this.item.alerts !== undefined) {
        let alert = this.isStart ? this.item.alerts.starts : this.item.alerts.ends
        return alert !== undefined &&
          alert != null &&
          alert.length
      }
    },
    showCommentsIcon: function () {
      if (this.item.comment !== undefined) {
        let comment = this.isStart ? this.item.comment.starts : this.item.comment.ends
        return comment !== undefined &&
               comment != null
      }
    },
    getTypeNameByCode () {
      return this.$store.getters['event/getTypeNameByCode'](this.item.tempType)
    },
    nextEvent () {
      this.$parent.$emit('update:current')
    },
    returnDate: function (el) {
      return this.isStart ? this.$moment(el.starts).format('HH:mm') : this.$moment(el.ends).format('HH:mm')
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

<style lang="less" scoped>
  .calendar__today .timeline_event-type{
    height: 12px;
    color: #ffffff;
    font-size: 12px;
    font-weight: 700;
    line-height: 12px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
  .event_nav {
    padding: 0px 10px 0px 6px;
    border-radius: 10px;
    position: absolute;
    background: #fff;
    right: 10px;
    bottom: -7px;
    color: #8f96a1;
    z-index: 20;
    font-size: 10px;
    -webkit-box-shadow: 0 5px 5px rgba(51, 51, 51, 0.09);
    box-shadow: 0 5px 5px rgba(51, 51, 51, 0.09);
     &:after{
       position: absolute;
       right: 4px;
       top: 28%;
       color: #999;
       border-style: solid;
       border-width: 3px 0 3px 4px;
       border-color: transparent transparent transparent #3f3f3f9c;
       content: "";
     }
  }

  .last .event_nav{
    padding: 0px 6px 0px 10px;
  }
  .last .event_nav:after{
    right: 14px!important;
    border-width: 3px 4px 3px 0!important;
    border-color: transparent #3f3f3f9c transparent transparent!important;
  }

</style>
