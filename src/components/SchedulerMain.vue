<template>
  <div class="timeline timeline--calendar">

    <div class="timeline_top-line">
      <div class="timeline_date">
        <span class="timeline_date-month">10—16 февраля</span>
        <span class="timeline_date-day">Сегодня <b>10 февраля</b>, воскресенье</span>
      </div>
      <div class="radio-buttons">
        <a href="#" class="btn" @click="showModalAddForm = true">Добавить ICOO</a>
      </div>
    </div>

          <itemWeek :events.sync="events"
                    :itemRender.sync="itemRender"
                    :dates.sync="dates"></itemWeek>

    <div class="col-md-12 scheduler__main">
      <modal v-if="showModalConfirm">
        <div slot="body">
          Вы хотите перенсти дату события?
        </div>
        <div slot="footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="confirmRequest()" >Отмена</button>
          <button type="button" class="btn btn-primary" @click="confirmRequest('confirm')">Изменить дату</button>
        </div>
      </modal>
      <modal v-if="showModalAddForm">
        <div slot="body">
          <div class="modal-header">
            <h5 class="modal-title"></h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="showModalAddForm = false">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>
        <div slot="body">
          <modalAddEvent></modalAddEvent>
          <div ></div>
        </div>
      </modal>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import itemWeek from './itemWeek'
import { EventBus } from './eventbus'
import modal from './modalConfirm'
import modalAddEvent from './modalAddEvent'
/**
 * Приводим дату в соотетствие с форматом в браузере пользователя
 * */
const locale = window.navigator.userLanguage || window.navigator.language
moment.locale(locale)

export default {
  name: 'Schedule',
  components: { itemWeek, modal, modalAddEvent },
  props: {
    itemRender: Function,
    dates: Array,
    events: Array
  },
  data () {
    return {
      eventTempStorage: null,
      dateTempStorage: null,
      showModalConfirm: false,
      showModalAddForm: false, /** //TODO Закрывать форму на сабмите */
      moment: moment,
      dragItem: null
    }
  },
  methods: {
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
      console.log('scheduler main itemdragstart')
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
    itemClick (e, item) {
      console.log('[event-click]:', item)
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
    console.log('dates at scheduler main', this.dates)
  },
  destoryed () {
    EventBus.$off()
  }
}
</script>

<style lang="less" >
  @import "../assets/less/vars";

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
      .btn {
        margin-bottom: 20px;
        padding: 10px 17px 9px;
        box-shadow: 0 2px 0 darken(@accent-color, 10%);
        border-radius: 4px;
        background-color: @accent-color;
        color: #fff;
      }
    }
    &_item {
      position: relative;
      display: flex;
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
        flex-grow: 2;
        //box-shadow: 0 2px 4px rgba(51, 51, 51, 0.1);
        background-color: #ffffff;
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
