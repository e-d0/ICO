<template>
  <div class="calendar--body">
  <!-- /.ico-list_item -->
    <div v-if="events" class="iso-all">

      <div v-for="(event,index) in events" :key="index" class="ico-list_item">
        <div class="ico-list_item-logo" style="background-image: linear-gradient(225deg, #a64fff 0%, #743dad 100%)">
          <img src="../assets/img/ins-logo.png" alt="">
        </div>
        <div class="ico-list_item-name">
          <h5>{{ event.name }}</h5>
          <span class="ico-list_item-time">{{ moment(event.starts).format('HH:mm') }}</span>
        </div>
        <div class="ico-list_item-reminder">
          <a :id="`event-${event.id}`" @click.prevent="" :class="['item-reminder_btn','reminder', { 'alerts': event.alerts !== undefined && event.alerts.length}]" href="#">Добавить напоминание</a>
          <a @click.prevent="" class="item-reminder_btn calendar" href="#">Добавить в календарь</a>
        </div>
        <div class="ico-list_item-data">
          <span :class="['ico-list_item-event',`ico-list_item-event--${event.type}`]">{{ getTypeNameByCode(event.type) }}</span>
          <span class="ico-list_item-time-remain">Завершится через {{ moment(event.starts).fromNow() }}</span>
        </div>
        <popover :popoverShow="popoverShow" :clickedEvent="event" ></popover>
      </div>

    </div>
  </div>
</template>

<script>
import popover from './popover'
import Vuex from 'vuex'
const storeEvent = Vuex.createNamespacedHelpers('event')
export default {
  name: 'TodayEventsAll',
  components: { popover },
  data () {
    return {
      popoverShow: false
    }
  },
  computed: {
    ...storeEvent.mapGetters({
      events: 'events'
    })
  },
  methods: {
    /**
     * Вызываем геттер модуля events хранилища с параметрами
     * и получаем имя типа события по коду
     * */
    getTypeNameByCode (code) {
      return this.$store.getters['event/getTypeNameByCode'](code)
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/less/vars";
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
        font-size: 14px;
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
          &.reminder.alerts::before{
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
        padding: 3px 4px 2px;
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
        &--pre_ico {
          background-color: @pre-ico;
        }
        &--KYC {
          background-color: @KYC;
        }
        &--ending_ico {
          background-color: @ending-ico;
        }
        &--white_list {
          background-color: @white-list;
        }
        &--start_ico {
          background-color: @start-ico;
        }
      }
    }
  }
</style>
