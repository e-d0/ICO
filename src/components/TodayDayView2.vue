<template>
  <div class="calendar__today_item">

    <div class=" timeline_item-head">
      <span class="timeline_item-date">{{ moment(date).format('DD MMMM') }}</span>
    </div>

    <div class="calendar--body">

      <div v-if="filteredByDate().length > 0" class="iso-all">

        <div v-for="(event,index) in filteredByDate()" :key="index" class="ico-list_item">
          <div class="ico-list_item-logo" style="background-image: linear-gradient(225deg, #a64fff 0%, #743dad 100%)">
            <img src="../assets/img/ins-logo.png" alt="">
          </div>
          <div class="ico-list_item-name">
            <h5>{{ event.name }}</h5>
            <span class="ico-list_item-time">{{ moment(event.starts).format('HH:mm') }}</span>
          </div>
          <div class="ico-list_item-reminder">
            <a :id="eventID(event)"
               @click.prevent=""
               :class="['item-reminder_btn','reminder', { 'notifications': event.notifications !== undefined && event.notifications.length}]"
               href="#">
              <template v-if="event.notifications !== undefined && event.notifications.length">
                {{ $t('calendar.ReminderAdded') }}
              </template>
              <template v-else>
                {{ $t('calendar.AddReminder') }}
              </template>

            </a>
            <a @click.prevent="" class="item-reminder_btn calendar" href="#">{{ $t('calendar.AddToCalendar') }}</a>
          </div>
          <div class="ico-list_item-data">
            <span :class="['ico-list_item-event',`ico-list_item-event--${event.category === 'ico' ? event.type : event.category}`]">{{ getTypeNameByCode(event.category === 'ico' ? event.type : event.category) }}</span>
            <span class="ico-list_item-time-remain"
                  v-html="event.type === 'start' ?
                $t('calendar.StartsIn', { time: moment(event.date).fromNow() }  ) :
                $t('calendar.EndsIn', { time: moment(event.date).fromNow() }  )">
          </span>
          </div>
          <popover :target="eventID(event)" :popoverShow="popoverShow" :clickedEvent="event" ></popover>
        </div>

      </div>
      <div v-else>
        <h6 class="sub_header">{{ $t('calendar.no_events') }}.</h6>
      </div>

    </div>
  <!-- /.ico-list_item -->
  </div>
</template>

<script>
import popover from './popover'
import { EventBus } from './eventbus'
import Vuex from 'vuex'
const storeEvent = Vuex.createNamespacedHelpers('event')
export default {
  name: 'TodayDayView2',
  components: { popover },
  props: {
    index: null,
    date: null,
    startHour: Number
  },
  data () {
    return {
      popoverShow: false,
      actual: true
    }
  },
  computed: {
    ...storeEvent.mapGetters({
      events: 'events',
      actualEvents: 'actualEvents',
      pastEvents: 'pastEvents'
    })
  },
  watch: {
    actual: function () {
      this.filteredEvents()
    }
  },
  methods: {
    /**
     * Удаляем дублированные события, и выводи только события - начала или конца,
     * в зависимости от фильтра
     * */
    eventUniqueFilter (events) {
      let arr = []

      for (let i = 0; i < events.length; i++) {
        let filter = this.actual ? events[i].type === 'start' : events[i].type === 'end'
        if (filter) {
          arr.push(events[i])
        }
      }
      return arr
    },
    /**
     * Фильтрация по дате с props
     * */
    filteredByDate () {
      let events = this.actual ? this.actualEvents(this.$moment()) : this.pastEvents(this.$moment())
      return events.filter(item => {
        if (this.$moment(item.date).isSame(this.$moment(this.date), 'day')) return item
      })
    },
    /**
     * Возвращает события из хранилища в зависимости от запроса
     * */
    filteredEvents () {
      return this.actual ? this.eventUniqueFilter(this.actualEvents(this.$moment())) : this.eventUniqueFilter(this.pastEvents(this.$moment()))
    },
    switchEvents (val) {
      this.actual = (val === 'true')
    },
    eventID (event) {
      return `event-${event.id}-${event.type === 'start'}`
    },
    /**
     * Вызываем геттер модуля events хранилища с параметрами
     * и получаем имя типа события по коду
     * */
    getTypeNameByCode (code) {
      return this.$store.getters['event/getTypeNameByCode'](code)
    }
  },
  created () {
    /**
     * На событии из фильтра вызываем функцию
     * */
    EventBus.$on('filter:event', this.switchEvents)
  },
  destoryed () {
    EventBus.$off()
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/less/vars";
  .sub_header{
    font-family: @medium;
    font-size: 14px;
    font-weight: 500;
  }
  //===================================================ico-LIST=======================//
  .iso-all{
    width: 100%;
  }
  .ico-list {
    margin-top: 32px;
    margin-right: 32px;
    &_top-line {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
    &_date {
      display: flex;
      flex-direction: column;
      &-month {
        margin-bottom: 7px;
        color: #333f52;
        font-family: @main-font;
        font-size: 20px;
        font-weight: 500;
        line-height: 20px;
      }
      &-day {
        color: #707986;
        font-family: @main-font;
        font-size: 12px;
        font-weight: 400;
        line-height: 14px;
      }
    }
    .radio-buttons {
      margin-left: auto;
      label {
        b {
          display: block;
          padding: 10px 12px;
          color: #525c6c;
          font-family: @main-font;
          font-size: 13px;
          font-weight: 500;
          line-height: 13px;
        }
      }
    }
    &_item {
      display: flex;
      margin-bottom: 10px;
      align-items: center;
      box-shadow: 0 2px 4px rgba(51, 51, 51, 0.1);
      border-radius: 4px;
      background-color: #fafbfc;
      overflow: hidden;
      &-logo {
        display: flex;
        position: relative;
        min-width: 120px;
        height: 68px;
        img {
          margin: auto;
          //padding: 10px;
        }
      }
      &-name {
        display: flex;
        flex-direction: column;
        width: 180px;
        padding-left: 16px;
        h5 {
          color: #525c6c;
          font-family: @main-font;
          font-size: 18px;
          font-weight: 700;
          line-height: 24px;
        }
      }
      &-time {
        color: #8f96a1;
        font-family: @main-font;
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        text-transform: uppercase;
      }
      &-reminder {
        .item-reminder_btn{
          /*margin-right: 40px;*/
          font-family: @main-font;
          padding: 6px 8px 4px 23px;
          box-shadow: 0 2px 0 #3b962f;
          border-radius: 2px;
          background-color: #44af36;
          color: #fff;
          position: relative;
          cursor: pointer;
          height: 22px;
          text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
          font-size: 12px;
          font-weight: 500;
          line-height: 12px;
          /* Text style for "Add remind" */
          letter-spacing: -0.06px;
          margin-left: 10px;
          &:hover,
          &:focus,
          &:active{
            position: relative;
            text-decoration: none;
            background-color: #45af37;
            color: #fff!important;
            box-shadow: 0 2px 0 #3e9532, inset 0 2px 4px rgba(1, 1, 1, 0.3);
          }
          &.reminder::before{
            content: "";
            position: absolute;
            width: 9px;
            height: 9px;
            left: 7px;
            top: 8px;
            background-image: @img-bell-white;
            background-position: center;
            background-repeat: no-repeat;
            z-index: 11;
          }
          &.calendar::before{
            content: "";
            position: absolute;
            width: 9px;
            height: 9px;
            left: 7px;
            top: 8px;
            background-image: @img-calendar-white;
            background-position: center;
            background-repeat: no-repeat;
            z-index: 11;
          }
          &.reminder.alerts{
            background: white;
            border: 1px solid #45af37;
            color: #45af37;
            box-shadow: none;
            position: relative;
            top: 1px;
            &:hover,
            &:focus,
            &:active{
              color: #45af37!important;
            }
          }
          &.reminder.notifications::before{
            background-image: @img-calendar-approved;
          }
        }
      }
      &-data {
        display: flex;
        flex-direction: column;
        margin-left: auto;
        margin-right: 16px;
        text-align: right;
        align-items: flex-end;
      }
      &-time-remain {
        font-family: @main-font;
        color: #707986;
        font-size: 11px;
        font-weight: 400;
        line-height: 12px;
        letter-spacing: -0.05px;
      }
      &-event {
        padding: 3px 4px;
        color: #ffffff;
        font-family: 'Roboto', sans-serif;
        font-size: 11px;
        font-weight: 700;
        line-height: 11px;
        text-transform: uppercase;
        letter-spacing: 0.28px;
        white-space: nowrap;
        border-radius: 2px;
        margin-bottom: 2px;
        &--pre {
          background-color: @pre-ico;
        }
        &--kyc {
          background-color: @KYC;
        }
        &--end {
          background-color: @ending-ico;
        }
        &--whitelist {
          background-color: @white-list;
        }
        &--start {
          background-color: @start-ico;
        }
      }
    }
  }
</style>
