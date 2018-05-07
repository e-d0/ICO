<template>
  <div class="calendar--body">
  <!-- /.ico-list_item -->
    <div class="iso-all">

      <div v-if="events" v-for="(event,index) in events" :key="index" class="ico-list_item">
        <div class="ico-list_item-logo" style="background-image: linear-gradient(225deg, #a64fff 0%, #743dad 100%)">
          <img src="../assets/img/ins-logo.png" alt="">
        </div>
        <div class="ico-list_item-name">
          <h5>{{ event.name }}</h5>
          <span class="ico-list_item-time">{{ moment(event.starts).format('HH:mm') }}</span>
        </div>
        <div class="ico-list_item-reminder">
          <a href="#">Добавить напоминание</a>
          <a href="#">Добавить в календарь</a>
        </div>
        <div class="ico-list_item-data">
          <span :class="['ico-list_item-event',`ico-list_item-event--${event.type}`]">{{ getTypeNameByCode(event.type) }}</span>
          <span class="ico-list_item-time-remain">Завершится через {{ moment(event.starts).fromNow() }}</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import Vuex from 'vuex'
const storeEvent = Vuex.createNamespacedHelpers('event')
export default {
  name: 'itemIcoAll',
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
  //===================================================ICO-LIST=======================//
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
        font-weight: 500;
        line-height: 16px;
      }
      &-reminder {
        a {
          margin-right: 40px;
          color: @main-color;
          font-family: @main-font;
          font-size: 12px;
          font-weight: 400;
          line-height: 12px;
          text-decoration: underline;
          &:hover {
            text-decoration: none;
          }
        }
      }
      &-data {
        display: flex;
        flex-direction: column;
        margin-left: auto;
        margin-right: 16px;
        text-align: right;
      }
      &-time-remain {
        color: #707986;
        font-family: @main-font;
        font-size: 12px;
        font-weight: 400;
        line-height: 12px;
      }
      &-event {
        margin-left: auto;
        margin-bottom: 6px;
        padding: 3px 6px 2px;
        background-color: #fff;
        font-family: @main-font;
        font-size: 11px;
        font-weight: 700;
        line-height: 11px;
        text-transform: uppercase;
        letter-spacing: 0.28px;
        white-space: nowrap;
        &--pre_ico {
          border: 1px solid @pre-ico;
          color: @pre-ico;
        }
        &--KYC {
          border: 1px solid @KYC;
          color: @KYC;
        }
        &--ending_ico {
          border: 1px solid @ending-ico;
          color: @ending-ico;
        }
        &--white_list {
          border: 1px solid @white-list;
          color: @white-list;
        }
        &--start_ico {
          border: 1px solid @start-ico;
          color: @start-ico;
        }
      }
    }
  }
</style>
