<template>
<div id="app">
  <tplHeader></tplHeader>
  <div class="container-fluid">
    <div class="row">

      <div class="col-md-12 col-lg-3">
        <div class="filter">
          <events-filter :actual.sync="actual"></events-filter>
          <events-filter-actual></events-filter-actual>
        </div>
      </div>
      <div class="col-md-12 col-lg-9">
        <div :class="['timeline', 'timeline--calendar', 'calendar__today', `${currentTabComponent}`]">

          <div class="timeline_top-line">
            <div class="timeline_date">
              <span class="timeline_date-month">{{ $t('calendar.Today') }}, <b>{{ moment().format('D MMMM')}}</b></span>
              <span class="timeline_date-day">{{ moment().format('dddd')}} , {{ moment().format('hh:mm A')}}
              (<form-time-zone></form-time-zone>)
              </span>
            </div>

            <div class="view-buttons">

              <a :class="['view-1',{ active: currentTabComponent === 'TodayDay' }]" @click="currentTabComponent = 'TodayDay'"></a>

              <a :class="['view-2',{ active: currentTabComponent === 'TodayDayView2' }]" @click="currentTabComponent = 'TodayDayView2'"></a>

            </div>

            <div class="radio-buttons">

              <a href="#" @click.prevent="showOnlyMyICO(true)" :class="['switch_btn','btn_left', {active: onlyUserICO === true}]">{{ $t('calendar.myICO') }}</a>

              <a href="#" @click.prevent="showOnlyMyICO(false)" :class="['switch_btn','switch','btn_right', {active: onlyUserICO === false }]" >{{ $t('calendar.allICO') }}</a>

            </div>
          </div>

          <keep-alive v-if="currentTabComponent === 'TodayDay'"
                      v-for="(item, index) in localDatesStorage"
                      :key="index">
                    <component  :class="[{'first': index === 0}]"
                                :date="moment(item).toDate()"
                                :startHour="isFirstDay(index)"
                                :is="'TodayDay'"
                                :index="index"
                                ></component>
          </keep-alive >
          <keep-alive v-if="currentTabComponent === 'TodayDayView2'"
                      v-for="(item, index) in localDatesStorage"
                      :key="index">
            <component  :class="[{'first': index === 0}]"
                        :date="moment(item).toDate()"
                        :startHour="isFirstDay(index)"
                        :is="'TodayDayView2'"
                        :index="index"
            ></component>
          </keep-alive>

          <a href="#"
              class="show-more"
              @click.prevent="showMore()">
            {{ $t('calendar.ShowMore24') }}</a>
          <a  v-if="localDatesStorage.length > 1"
              href="#"
              style="float: right;"
              class="show-more"
              @click.prevent="hideLast()">
            {{ $t('calendar.ShowLess24') }}</a>

        </div>
      </div>

    </div>
  </div>
  <tplFooter></tplFooter>
</div>
</template>

<script>
import tplHeader from './TheHeader'
import tplFooter from './TheFooter'
import TodayDayView2 from './TodayDayView2'
import eventsFilter from './eventsFilter'
import TodayDay from './TodayDay'
import eventsFilterActual from './eventsFilterActual'
import { EventBus } from './eventbus'
import formTimeZone from './formTimeZone'
import Vuex from 'vuex'
const storeEvent = Vuex.createNamespacedHelpers('event')
export default {
  name: 'TodayPage',
  components: { tplHeader, tplFooter, eventsFilter, eventsFilterActual, TodayDayView2, TodayDay, formTimeZone },
  data () {
    return {
      localDatesStorage: [this.moment().toISOString()],
      currentTabComponent: 'TodayDay',
      actual: true
    }
  },
  computed: {
    ...storeEvent.mapGetters({
      filters: 'filters'
    }),
    ...storeEvent.mapState({
      onlyUserICO: 'onlyUserICO'
    })
  },
  methods: {
    showOnlyMyICO (val) {
      this.$store.dispatch('event/setOnlyMyICO', val)
    },
    /**
     * Если первый день, возвращаем стартовый час
     * */
    isFirstDay (index) {
      if (index === 0) return parseInt(this.moment().format('H'))
    },
    switchEvents (val) {
      this.actual = (val === 'true')
    },
    /**
     * Добавляем в массив дату для нового компонента
     * */
    showMore () {
      const date = this.localDatesStorage[this.localDatesStorage.length - 1]
      let newDate = this.moment(date).add(1, 'days').toISOString()
      this.localDatesStorage.push(newDate)
    },
    /**
     * Удаляем последнюю дату из массива ,а заодно и компонент
     * */
    hideLast () {
      this.localDatesStorage.pop()
    },
    /**
     * Получаем события с сервера через хранилище store
     * */
    getEvents () {
      this.$store.dispatch('event/getEvents')
    },
    getDates () {
      return this.$store.getters['event/dates']
    },
    headerDates () {
      return `${this.$moment(this.dates[0]).format('D')} - ${this.$moment(this.dates[this.dates.length - 1]).format('D MMMM')}`
    }
  },
  mounted () {
    console.log('mounted')
  },
  beforeCreate () {
    /**
     * Устанавливаем текущую дату в storage
     * */
  },
  created () {
    this.getEvents()
    EventBus.$on('filter:event', this.switchEvents)
  },
  destroyed () {
    EventBus.$off('filter:event', this.switchEvents)
  }
}
</script>

<style lang="less">
  @import "../assets/less/vars";
  .view-buttons{
    margin-left: auto;
    margin-right: 32px;
    margin-bottom: 12px;
    .view-1{
      display: inline-block;
      width: 24px;
      height: 15px;
      background-image: @img-view_1;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      cursor: pointer;
      &.active,
      &:hover,
      &:focus{
        background-image: @img-view_1-active;
      }
    }
    .view-2{
      margin-left: 20px;
      display: inline-block;
      width: 24px;
      height: 15px;
      background-image: @img-view_2;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      cursor: pointer;
      &.active,
      &:hover,
      &:focus{
        background-image: @img-view_2-active;
      }
    }
  }
  .calendar__today_item.first .timeline_item-head{
    display: none;
  }

  .show-more {
    display: inline-block;
    height: 14px;
    color: #1991eb;
    font-size: 14px;
    font-weight: 400;
    line-height: 14px;
    letter-spacing: -0.07px;
    text-decoration: underline dotted;
    margin-top: 20px;
    margin-left: 48px;
    &:focus,
    &:hover,
    &:active{
      text-decoration: none;
    }
  }
  .TodayDayView2 .show-more {
    margin-left: 0;
  }
  .calendar--body{
    display: flex;
    flex-direction: row;
  }
  .events {
    width: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    -webkit-box-shadow: 0 4px 8px rgba(184, 194, 201, 0.69);
    box-shadow: 0 4px 8px rgba(184, 194, 201, 0.69);
    border-radius: 4px;
    overflow: hidden;
  }
  /*.events::-webkit-scrollbar {*/
  /*}*/
  .calendar__today{
    .switch{
      margin-right: 40px;
      &_btn{
        padding: 10px 17px 9px;
        -webkit-box-shadow: 0 2px 0 #8f96a1;
        box-shadow: 0 2px 0 #8f96a1;
        border-radius: 2px;
        /*background-color: #44af36;*/
        background-color: #fff;
        /*color: #fff;*/
        color: #8f96a1;
        position: relative;
        right: 0;
        margin-bottom: 20px;
        font-size: 14px;
        font-weight: 500;
        line-height: 14px;
        cursor: pointer;
      }
      &_btn.btn_left{
        border-radius: 2px 0 0 2px;
      }
      &_btn.btn_right{
        border-radius: 0 2px 2px 0;
      }
      &_btn.active,
      &_btn:focus,
      &_btn:hover{
        position: relative;
        text-decoration: none;
        background-color: #45af37;
        color: #fff!important;
        box-shadow: 0 2px 0 #3e9532, inset 0 2px 4px rgba(1, 1, 1, 0.3);
      }
      /*&_btn:hover{*/
      /*position: relative;*/
      /*top: 0px;*/
      /*text-decoration: none;*/
      /*background-color: #44af36;*/
      /*color: #fff;*/
      /*-webkit-box-shadow: 0 2px 0 #35882a;*/
      /*box-shadow: 0 2px 0 #35882a;*/
      /*}*/
    }
  }
  .radio-buttons {
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
    .btn {
      margin-bottom: 20px;
      padding: 10px 17px 9px;
      box-shadow: 0 2px 0 darken(@accent-color, 10%);
      border-radius: 4px;
      background-color: @accent-color;
      color: #fff;
    }
  }

  .events-group{
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .time-group{
    display: flex;
    flex-direction: column;
  }

  .hours {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .calendar__today{
    margin-top: 32px;
    margin-bottom: 32px;
   .timeline {
    margin-top: 32px;
    margin-bottom: 32px;
    padding-bottom: 12px;
    overflow: hidden;
    position: relative;
    &--calendar {
      &::before {
        content: "";
        position: absolute;
        width: 30px;
        height: 100%;
        top: 60px;
        right: 0;
        background-image: linear-gradient(to right, rgba(250, 251, 252, 0) 0%, #eff3f6 100%);
        z-index: 44;
      }
    }
    &_top-line {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
    &_today {
      display: flex;
      flex-direction: column;
      margin-right: 40px;
      &-date {
        margin-bottom: 7px;
        color: #333f52;
        font-family: @main-font;
        font-size: 20px;
        font-weight: 500;
        line-height: 20px;
      }
      &-time {
        color: #707986;
        font-family: @main-font;
        font-size: 12px;
        font-weight: 400;
        line-height: 14px;
        &-UTC {
          margin-left: 3px;
          color: @main-color;
          font-size: 10px;
          letter-spacing: -0.08px;
        }
      }
    }
    &_date {
      display: flex;
      flex-direction: column;
      &--next-day {
        margin-left: 50px;
      }
      &-month {
        margin-bottom: 7px;
        color: #333f52;
        font-family: @medium;
        font-size: 20px;
        font-weight: 500;
        line-height: 20px;
        letter-spacing: -0.07px;
        b{
          font-weight: 500;
        }
      }
      &-day {
        color: #707986;
        font-family: @main-font;
        font-size: 12px;
        font-weight: 400;
        line-height: 14px;
        text-transform: capitalize;
      }
    }
    &_item {
      &-head{
        z-index: 1;
        margin-bottom: 8px;
        margin-top: 26px;
        box-shadow: none;
        border: none;
      }
      position: relative;
      /*display: flex;*/
      height: 48px;
      border-bottom: 1px solid #e0e6ed;
      //overflow: hidden;
      &:last-child {
        border-bottom: none;
      }
      &--calendar {
        height: auto;
      }
      &-data {
        display: flex;
        flex-direction: column;
        padding: 14px 10px 16px 12px;
      }
      &-time {
        min-width: 48px;
        span {
          color: #707986;
          font-family: @main-font;
          font-size: 11px;
          font-weight: 400;
          line-height: 36px;
        }
      }
      &-date {
        color: #333f52;
        font-family: @medium;
        line-height: 18px;
        font-size: 16px;
        font-weight: 500;
        letter-spacing: -0.06px;
      }
      &-day {
        color: #8f96a1;
        font-family: @main-font;
        font-size: 12px;
        font-weight: 400;
        line-height: 12px;
      }
      &-scale {
        //box-shadow: 0 2px 4px rgba(51, 51, 51, 0.1);
        background-color: #ffffff;
        border-bottom: 1px solid #e0e6ed;
        flex-grow: 1;
        flex-shrink: 1;
        flex-basis: 0;
        text-align: center;
        &--calendar {
          background-color: #fafbfc;
          min-width: 168px;
          border-right: 1px solid #e0e6ed;
        }
        &--calendar-today {
          background-color: #fff;
        }
      }
    }
    &_event {
      display: flex;
      justify-content: space-between;
      align-items: center;
      align-content: stretch;
      height: 100%;
      width: 100%;
      position: relative;
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
      &--white-list {
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
      &--ending-ico {
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
      &--pre-ico {
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
      &--start-ico {
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
        text-align: left;
      }
      &-time {
        margin-bottom: 2px;
        color: #ffffff;
        font-family: @medium;
        font-size: 12px;
        line-height: 14px;
        letter-spacing: -0.05px;
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
        span {
          color: #ffffff;
          font-family: @main-font;
          font-size: 12px;
          font-weight: 700;
          line-height: 12px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin-left: 12px;
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
    &_event.multistack {
      .timeline_event--item {
        position: relative;
      }
    }
    &_next24 {
      margin-top: 20px;
      margin-left: 50px;
      a {
        color: @main-color;
        font-family: @main-font;
        font-size: 14px;
        font-weight: 400;
        line-height: 14px;
        text-decoration: underline;
        &:hover {
          text-decoration: none;
        }
      }
    }
  }
  }
</style>
