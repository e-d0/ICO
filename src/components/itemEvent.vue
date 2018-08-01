<template>
  <div :class="['event', 'timeline_event', 'timeline_event--item']"
       :id="item ? eventID : null"
       :style="{top:`${timeOffset()}`}"
       :data-overlap-group="group"
       :data-group-index="groupIndex">

    <div :class="['timeline_event', `timeline_event--${item.category === 'ico' ? item.type : item.category}`]">

      <div class="timeline_event-data">
      <span class="timeline_event-time"> {{returnDate(item)}}
        <a v-if="showAlertsIcon()"
           class="timeline_event-notification-bell"></a>
        <a v-if="showCommentsIcon()" class="timeline_event-notification-message"></a>
      </span>
        <span class="timeline_event-name timeline_event-name--calendar">{{item.name}}</span>

      </div>
      <div :class="['timeline_event-type', {'starts': item.type === 'start' }, {'ends': item.type === 'end'}]">
          <span>{{ getTypeNameByCode() }}</span>
      </div>
      <div v-if="groupIndex"
           :class="['event_nav']"
           @click.stop.prevent="nextEvent" >
      </div>
      <popover :target="eventID" :popoverShow="popoverShow" :clickedEvent="item"></popover>

    </div>

  </div>
</template>
<script>
import popover from './popover'
export default {
  name: 'event',
  components: { popover },
  props: {
    group: String,
    groupIndex: String,
    item: Object,
    date: Date,
    type: String,
    multi: Boolean
  },
  data () {
    return {
      popoverShow: false,
      parentComponentHeight: null
    }
  },
  computed: {
    eventID () {
      return `event-${this.item.id}-${this.item.type}`
    }
  },
  watch: {
  },
  methods: {
    setupAttributes () {
      if (document.readyState) {
        let groupIndex = this.$el.dataset.groupIndex
        let group = this.$el.dataset.overlapGroup
        let elems = group !== undefined && (this.$el.parentElement !== undefined || this.$el.parentElement !== null) ? this.$el.parentElement.querySelectorAll(`[data-overlap-group="${group}"]`) : false
        if (elems.length > 1) {
          if (groupIndex === (1).toString()) {
            this.$el.classList.add('active')
            this.$el.querySelector('.event_nav').dataset.groupIndex = elems.length - 1
          }
          if (groupIndex === (elems.length).toString()) {
            this.$el.classList.add('last')
            this.$el.querySelector('.event_nav').dataset.groupIndex = elems.length - 1
          }
          if (groupIndex !== (elems.length).toString()) { this.$el.querySelector('.event_nav').dataset.groupIndex = elems.length - groupIndex }
        }
      }
    },
    /**
     * Считаем отступ сверху в зависимости от
     * времени начала события в соответствии с заданным
     * интервалом
     * */
    timeOffset () {
      let parentElementHeight = this.parentComponentHeight
      let onePercentOfParent = parentElementHeight / 100
      const intervals = [0, 15, 30, 45, 60]
      let dopOffset = 0
      dopOffset = (this.$moment(this.item.date).hours()) * (100 / 24)

      const startsDate = this.$moment(this.item.date).format('m')
      const start = Number.parseInt(startsDate)

      let offsetTop = 0
      for (let i = intervals.length; i >= 0; --i) {
        if (intervals[i] <= start && intervals[i + 1] >= start) {
          offsetTop = intervals[i]
          break
        }
      }
      return (dopOffset + ((100 / 24 / 60) * offsetTop)) * onePercentOfParent + 'px'
    },
    /**
     * Проверяем, отображаться ли иконке оповещения
     * */
    showAlertsIcon: function () {
      if (this.item.notifications !== undefined) {
        let alert = this.item.notifications
        return alert !== undefined &&
          alert.length > 0
      }
    },
    showCommentsIcon: function () {
      if (this.item.note.text !== undefined) {
        let comment = this.item.note.text
        return comment !== undefined &&
          comment != null
      }
    },
    getTypeNameByCode () {
      return this.$store.getters['event/getTypeNameByCode'](this.item.type)
    },
    /**
     * Событие для родителя. Переключить следующий event
     * */
    nextEvent (e) {
      this.$emit('show:next:event', e)
    },
    returnDate: function (el) {
      return this.$moment(el.date).format('HH:mm')
    },
    onClose () {
      this.popoverShow = false
    }
  },
  created () {
    this.timeOffset()
  },
  mounted () {
    /**
     * Получаем высоту родительского элемента
     * */
    this.setupAttributes()
    this.parentComponentHeight = this.$el.parentElement.clientHeight
    this.$store.watch((state) => state.event.dates, () => this.setupAttributes())
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/less/vars";
  .calendar__week .timeline_event-type span{
    display: none;
  }
  .event_nav{
    display: none;
  }
  .operlapped.active {
    &.event_nav{
      display: inline-block;
    }
  }
  .timeline_event {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: stretch;
    height: 48px;
    position: absolute;
    &:active,
    &:focus,
    &:hover {
      box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.15);
    }
    &--item{
      cursor: pointer;
    }
    &--kyc {
      position: relative;
      background-color: rgba(99, 203, 198, 0.75);
      border-top: 4px solid @KYC;
      &::before {
        content: '';
        position: absolute;
        bottom: -12px;
        left: 0;
        width: 100%;
        height: 12px;
        background-image: linear-gradient(180deg, rgba(89, 182, 178, 0.3) 0%, rgba(89, 182, 178, 0) 100%);
        z-index: 11;
      }
    }
    &--whitelist {
      position: relative;
      background-color: rgba(255, 129, 158, 0.75);
      border-top: 4px solid @white-list;
      &::before {
        content: '';
        position: absolute;
        bottom: -12px;
        left: 0;
        width: 100%;
        height: 12px;
        background-image: linear-gradient(180deg, rgba(255, 129, 158, 0.3) 0%, rgba(255, 129, 158, 0) 100%);
        z-index: 11;
      }
    }
    &--end {
      position: relative;
      background-color: rgba(143, 114, 199, 0.75);
      border-top: 4px solid @ending-ico;
      &::before {
        content: '';
        position: absolute;
        bottom: -12px;
        left: 0;
        width: 100%;
        height: 12px;
        background-image: linear-gradient(180deg, rgba(171, 149, 211, 0.3) 0%, rgba(171, 149, 212, 0) 100%);
        z-index: 11;
      }
    }
    &--pre {
      position: relative;
      background-color: rgba(247, 152, 27, 0.75);
      border-top: 4px solid @pre-ico ;
      &::before {
        content: '';
        position: absolute;
        bottom: -12px;
        left: 0;
        width: 100%;
        height: 12px;
        background-image: linear-gradient(180deg, rgba(247, 152, 27, 0.3) 0%, rgba(247, 152, 27, 0) 100%);
        z-index: 11;
      }
    }
    &--pre {
      position: relative;
      background-color: rgba(247, 152, 27, 0.75);
      border-top: 4px solid @pre-ico ;
      &::before {
        content: '';
        position: absolute;
        bottom: -12px;
        left: 0;
        width: 100%;
        height: 12px;
        background-image: linear-gradient(180deg, rgba(247, 152, 27, 0.3) 0%, rgba(247, 152, 27, 0) 100%);
        z-index: 11;
      }
    }
    &--start {
      position: relative;
      background-color: rgba(69, 175, 54, 0.75);
      border-top: 4px solid @start-ico ;
      &::before {
        content: '';
        position: absolute;
        bottom: -12px;
        left: 0;
        width: 100%;
        height: 12px;
        background-image: linear-gradient(180deg, rgba(69, 175, 54, 0.3) 0%, rgba(69, 175, 54, 0) 100%);
        z-index: 11;
      }
    }
    &--ico {
      position: relative;
      background-color: rgba(69, 175, 54, 0.75);
      border-top: 4px solid @start-ico ;
      &::before {
        content: '';
        position: absolute;
        bottom: -12px;
        left: 0;
        width: 100%;
        height: 12px;
        background-image: linear-gradient(180deg, rgba(69, 175, 54, 0.3) 0%, rgba(69, 175, 54, 0) 100%);
        z-index: 11;
      }
    }
    &-data {
      display: flex;
      flex-direction: column;
      margin-left: 12px;
    }
    &-time {
      margin-bottom: 2px;
      color: #ffffff;
      font-family: @main-font;
      font-size: 12px;
      font-weight: 500;
      line-height: 14px;
    }
    &-name {
      text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
      color: #ffffff;
      font-family: @main-font;
      font-size: 14px;
      font-weight: 700;
      line-height: 14px;
      &--calendar {
        font-size: 12px;
      }
    }
    &-type {
      margin-right: 12px;
      &.starts::before{
        content: "";
        position: relative;
        display: inline-block;
        vertical-align: middle;
        width: 16px;
        height: 16px;
        bottom: 1px;
        background-image: @img-clock-start;
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
      }
      &.ends::before{
        content: "";
        position: relative;
        display: inline-block;
        vertical-align: middle;
        width: 16px;
        height: 16px;
        bottom: 1px;
        background-image: @img-clock-end;
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
      }
      span {
        display: none;
        color: #ffffff;
        font-family: @main-font;
        font-size: 12px;
        font-weight: 700;
        line-height: 12px;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }
    }
    &-notification-bell {
      display: inline-block;
      position: relative;
      margin-left: 8px;
      width: 9px;
      height: 9px;
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 9px;
        height: 9px;
        background-image: @img-bell-small;
        background-repeat: no-repeat;
        background-position: center;
        z-index: 33;
      }
    }
    &-notification-message {
      display: inline-block;
      position: relative;
      margin-left: 8px;
      width: 9px;
      height: 9px;
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 9px;
        height: 9px;
        background-image: @img-message-small;
        background-repeat: no-repeat;
        background-position: center;
        z-index: 33;
      }
    }
  }
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
      border-top-color: transparent;
      border-right-color: transparent;
      border-left-color: rgba(63, 63, 63, 0.61);
      border-bottom-color: transparent;
      content: "";
    }
  }

  .last .event_nav{
    padding: 0px 6px 0px 10px;
  }
  .last .event_nav:after{
    right: 14px!important;
    border-width: 3px 4px 3px 0!important;
    border-color: transparent rgba(63, 63, 63, 0.61) transparent transparent!important;
  }
</style>
