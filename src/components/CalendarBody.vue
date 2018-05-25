<template>
  <div :class="['timeline timeline--calendar', 'calendar', {'calendar__week': showWeek === true }, {'calendar__month': showWeek === false }, {'sideGradient': showWeek === true && sideGradient === true }]">

    <div class="timeline_top-line">
      <div class="timeline_date">
        <span class="timeline_date-month">{{headerDates}}</span>
        <span class="timeline_date-day">{{ $t('calendar.Today') }} <b>{{ moment().format('D MMMM')}}</b>, {{ moment().format('dddd')}}</span>
      </div>

      <div class="radio-buttons">

          <a href="#" :class="['switch_btn','btn_left',{ active: showWeek === true }]" @click="showWeek = true">{{ $t('calendar.Week') }}</a>

          <a href="#" :class="['switch_btn','switch','btn_right',{ active: showWeek === false }]" @click="showWeek = false">{{ $t('calendar.Month') }}</a>

        <!--<a href="#" class="btn" @click="openAddFormModal()">+ Добавить ico</a>-->
          <b-btn v-b-toggle.formICO variant="primary">+ {{ $t('calendar.AddICO') }}</b-btn>

      </div>

    </div>
    <b-collapse id="formICO" class="">
      <formAddICO></formAddICO>
    </b-collapse>

    <keep-alive>
      <component ref="event-body" :dates.sync="dates" v-bind:is="currentTabComponent()"></component>
    </keep-alive>

    <div class="col-md-12 scheduler__main">

      <modal v-if="showModalAddForm" >
      <div slot="header">
        <div class="modal-header">
          <h5 class="modal-title"></h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="showModalAddForm = false">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
      <div slot="body">
        <FormAddEvent :acceptedDate="acceptedDate" @close="closeAddFormModal()"></FormAddEvent>
      </div>
    </modal>
      <modal v-if="showModalConfirm">
        <div slot="body">
          <formConfirm @onConfirm="confirmRequest('confirm')"
                       @onCancel="confirmRequest()"></formConfirm>
        </div>
      </modal>

    </div>
  </div>
</template>

<script>
import CalendarWeek from './CalendarWeek'
import CalendarMonth from './CalendarMonth'
import formAddICO from './formAddICO'
import { EventBus } from './eventbus'
import modal from './modalBody'
import formConfirm from './formConfirm'
import FormAddEvent from './formAddEvent'
import popover from './popover'
import Vuex from 'vuex'
const storeEvent = Vuex.createNamespacedHelpers('event')

export default {
  name: 'CalendarBody',
  components: { CalendarWeek, CalendarMonth, popover, FormAddEvent, modal, formConfirm, formAddICO },
  props: {
  },
  data () {
    return {
      eventTempStorage: null,
      dateTempStorage: null,
      showModalConfirm: false,
      showModalAddForm: false, /** //TODO Закрывать форму на сабмите */
      moment: this.$moment,
      dragItem: null,
      acceptedDate: null,
      clickedEvent: null,
      showWeek: true,
      sideGradient: true
    }
  },
  computed: {
    ...storeEvent.mapGetters({
      events: 'events',
      filteredEvents: 'filteredEvents',
      dates: 'dates'
    }),
    headerDates () {
      const dates = this.dates
      let start = this.$moment(dates[0])
      let end = this.$moment(dates[dates.length - 1])
      return start.isSame(end) ? `${start.format('D MMMM')}` : `${start.format('D')} - ${end.format('D MMMM')}`
    }
  },
  watch: {
    dates: function () {
      this.dates.length > 6 ? this.sideGradient = true : this.sideGradient = false
    }
  },
  methods: {
    currentTabComponent: function () {
      if (this.showWeek === true) {
        return 'CalendarWeek'
      } else {
        this.sideGradient = false
        return 'CalendarMonth'
      }
    },
    openAddFormModal (date) {
      this.acceptedDate = date || new Date()
      this.showModalAddForm = true
    },
    closeAddFormModal () {
      this.showModalAddForm = false
    },
    openModal () {
      this.showModalConfirm = true
    },
    closeModal () {
      this.showModalConfirm = false
    },
    cellDragenter (e, date, type, index) {
      console.log('cellDragenter', this.dragItem)
      this.$emit('event-dragenter', e, this.dragItem, date)
    },
    itemDragstart (e, item, date, type) {
      console.log('scheduler main itemdragstart', item)
      this.dragItem = item
      console.log('itemdragstart Func', this.dragItem)
      this.$emit('event-dragstart', e, item, date)
    },
    confirmRequest (message) {
      this.closeModal()
      if (message) {
        this.itemDrop(this.eventTempStorage, this.dateTempStorage)
      } else {
        this.eventTempStorage = null
        this.dateTempStorage = null
      }
    },
    confirmDialog (e, date) {
      /**
       * Триггерим запуск формы и сохраняем данные из события.
       * */
      this.openModal()
      this.eventTempStorage = e
      this.dateTempStorage = date
    },
    itemDrop (e, date) {
      if (!this.dragItem) return
      console.log('[event-dragend]:', this.dragItem, date)
      EventBus.$emit('event-dragend', e, this.dragItem, date)
      console.log('item drop func')
    },
    itemClick (e, item, eventId) {
      console.log('[event-click]:', item, eventId)
      this.$emit('event-click', e, item)
    },
    dateClick (e, date) {
      console.log('[date-click]:', date)
      this.$emit('date-click', e, date)
    },
    getDates (items) {
      this.$emit('update:dates', items)
    }
  },
  created () {
    EventBus.$on('item-dragstart', this.itemDragstart)
    EventBus.$on('cell-dragenter', this.cellDragenter)
    EventBus.$on('item-drop', this.confirmDialog)
    EventBus.$on('item-click', this.itemClick)
    EventBus.$on('date-click', this.dateClick)
    EventBus.$on('call:addEventForm', this.openAddFormModal)
  },
  mounted () {
  },
  destoryed () {
    EventBus.$off()
  }
}
</script>

<style lang="less" >
  @import "../assets/less/vars";
  #formICO{
    width: 100%;
    margin-top: 32px;
  }

  .timeline_top-line{
    /*width: 75%;*/
    width: 100%;
    min-width: 900px;
  }
  .calendar .calendar--body{
    display: flex;
    flex-direction: row;
    overflow: hidden;
    &:after{
      content: '';
      position: absolute;
      bottom: 13px;
      left: 47px;
      display: inline-block;
      width: calc(100% - 53px);
      height: 1px;
      padding-bottom: 4px;
      box-shadow: 0 2px 4px rgba(51, 51, 51, 0.1);
    }
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
    overflow-x: hidden;
  }
  /*.events::-webkit-scrollbar {*/
  /*}*/
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

  .timeline {
    margin-top: 32px;
    margin-bottom: 32px;
    padding-bottom: 12px;
    position: relative;
    &--calendar.sideGradient {
      &::before {
        content: "";
        position: absolute;
        width: 30px;
        height: 100%;
        top: 60px;
        right: 0;
        background-image: linear-gradient(to right, rgba(250, 251, 252, 0) 0%, #eff3f6 100%);
        z-index: 44;
        pointer-events: none;
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
      margin-right: auto;
      &--next-day {
        margin-left: 50px;
      }
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
        color: #fff;
        box-shadow: 0 2px 0 #3e9532, inset 0 2px 4px rgba(1, 1, 1, 0.3);
        /* Style for "Input Copy" */
        /*width: 56px;*/
        /*height: 32px;*/
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
        &:active,
        &:focus,
        &:hover{
          text-decoration: none;
          background-color: #45af37;
          color: #fff;
          box-shadow: 0 2px 0 #3e9532, inset 0 2px 4px rgba(1, 1, 1, 0.3);
        }
      }
    }
    &_item {
      &-head{
        border-bottom: 1px solid #e0e6ed;
        -webkit-box-shadow: 0 2px 4px rgba(51, 51, 51, 0.1);
        box-shadow: 0 2px 4px rgba(51, 51, 51, 0.1);
        z-index: 1;
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
        margin-bottom: 4px;
        color: #333f52;
        font-family: @main-font;
        font-size: 18px;
        font-weight: 700;
        line-height: 18px;
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
          /*min-width: 125px;*/
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
      &--KYC {
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
        span {
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
    &_event.multistack {
      .timeline_event--item {
        position: absolute;
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
</style>
