<template>

  <b-popover :target="target"
             triggers="click"
             :show="popoverShow"
             placement="right"
             container="app">

    <div class="mypopover" >

      <div class="mypopover_close">
        <span @click="closePopup()" class="close" aria-label="Close" ></span>
      </div>
      <div class="mypopover_header" >
        <h5>{{ clickedEvent.name }}</h5>
        <div class="mypopover_header-logo">
          <img src="../assets/img/aurora-logo.png" alt="">
        </div>
      </div>

        <div :class="['mypopover_event',`mypopover_event--${clickedEvent.tempType}`]">
          <span :class="['mypopover_event-type', {'starts': clickedEvent.isStart === true }, {'ends': clickedEvent.isStart === false}]">{{ getTypeNameByCode() }}</span>
        </div>
        <div class="mypopover_info">
          <div class="mypopover_info-time">
            <span class="mypopover_info-time-start">{{ dateStart().format('H:mm') }}</span>
            <span class="mypopover_info-time-remain">{{ $t('form.Starts') }} {{ timeToStart() }}</span>
          </div>
          <div class="mypopover_info-date">
            <span class="mypopover_info-date-month">{{ dateStart().format('D MMMM') }}</span>
            <span class="mypopover_info-date-day"> {{ dateStart().format('dddd') }}</span>
          </div>
        </div>

      <template v-if="alerts.length > 0">
        <div class="mypopover_remainder"  v-for="(item, index) in alerts" :key="index">
            <span >
               {{ $t('form.RemindTime', { time: convertToDiff(item) }  ) }}
            </span>
            <a @click="removeAlert(index)">{{ $t('form.Remove') }}</a>
        </div>
      </template>

      <!--Селект с возможностью добавлять время алерта. Пока отключен за ненадобностью-->

      <!--<div v-if="(notificForm || this.clickedItemAlerts() === undefined ) &&-->
                  <!--(filteredTimeOptions.length > 0)"-->
                  <!--class="mypopover_remainder">-->
        <!--<span>{{ $t('form.Remind') }} </span>-->
        <!--<div class="mypopover_remainder-select">-->
          <!--<select v-model="timeValue">-->
            <!--<template v-for="( val, index ) in filteredTimeOptions">-->

                <!--<option :key="index" name="name[]" :value="val" >-->
                  <!--<a>{{ val }} {{ $t('form.min') }}</a>-->
                <!--</option>-->

            <!--</template>-->
          <!--</select>-->
        <!--</div>-->
        <!--<a :class="['add']" @click="addAlert(timeValue)" >{{ $t('form.Add') }}</a>-->
      <!--</div>-->

      <div class="mypopover_add">
        <div class="col-sm-6 mypopover_add-remind" >
          <a :class="[{'disabled': filteredTimeOptions.length === 0 }]" @click="addAlertToTempStorage()">{{ $t('form.AddReminder') }}</a>
        </div>
        <div class="col-sm-6 mypopover_add-comment">
          <a v-if="!commentForm && comment !== null" @click="removeComment()">{{ $t('form.RemoveComment') }}</a>
          <a :class="[{'active': commentForm }]" v-else @click="openAddComment()">{{ $t('form.AddComment') }}</a>
        </div>
      </div>

      <div class="mypopover_comment" v-if="!commentForm
                                                && comment !== null
                                                && comment !==  '' ">
        <span>{{comment}}</span>
      </div>

      <div v-if="commentForm" class="form-group border-exp">
          <textarea class="form-control mt-2"
                    cols="30"
                    :value="comment"
                    @change="updateComment($event.target.value)"
                    placeholder="Введите комментарий..."
                    rows="5"></textarea>
      </div>

      <div class="mypopover_button">
        <span class="btn" @click="updateEvent()" >{{ $t('form.Save') }}</span>
      </div>
    </div>

  </b-popover>

</template>

<script>
import { countDiffBetweenDates } from './eventbus'

export default {
  name: 'popover',
  props: {
    /**
     * Event ,переданный при создании формы из родителя
     * */
    clickedEvent: Object,
    popoverShow: Boolean,
    target: String,
    /**
     * Начало или окончание event
     * */
    isStart: Boolean
  },
  data () {
    return {
      moment: this.$moment,
      commentForm: false,
      notificForm: false,
      timeOptions: [15, 30, 45],
      comment: null,
      timeValue: '15',
      alerts: []
    }
  },
  computed: {
    /**
     * Отфильтрованные значения времени алерта для выпадающего селекта
     * */
    filteredTimeOptions: {
      cache: false,
      get: function () {
        let arr = [...this.timeOptions]
        if (this.alerts !== undefined && this.alerts.length) {
          let alerts = this.alerts
          /**
         * Сверяем оповещения события с массивом опромежутков.
         * Если есть совпадения, то удаляем промежуток.
         * Таким образом в выборе появляются только уникальные значения.
         * */
          for (let i = 0; i < alerts.length; i++) {
            if (arr.includes(this.countDiffTime(i))) {
              let index = arr.indexOf(this.countDiffTime(i))
              if (index !== -1) arr.splice(index, 1)
            }
          }
        }
        return arr.sort((a, b) => a - b)
      }
    }
  },
  watch: {
  },
  created () {
    /**
     * При создании этого компонента заполняем переменную алертами из текущего event
     * */
    if (this.clickedItemAlerts() !== undefined) {
      this.alerts = this.sortDates([...this.clickedItemAlerts()])
    }
    /**
     * При создании этого компонента заполняем переменную комментариями из текущего event
     * */
    if (this.clickedItemComments() !== undefined) this.comment = this.clickedItemComments()
  },
  methods: {
    /**
     * Проверка, откуда брать alert: из начала события или окончания
     * */
    clickedItemAlerts () {
      if (this.clickedEvent.alerts !== undefined) {
        return this.clickedEvent.isStart ? this.clickedEvent.alerts.starts : this.clickedEvent.alerts.ends
      }
    },
    /**
     * Проверка, откуда брать comment: из начала события или окончания
     * */
    clickedItemComments () {
      if (this.clickedEvent.comment !== undefined) {
        return this.clickedEvent.isStart ? this.clickedEvent.comment.starts : this.clickedEvent.comment.ends
      }
    },
    /**
     * Сортируем массив ISO дат. Можно сравнивать, не преобразоывавая
     * */
    sortDates (item) {
      let arr = [...item]
      arr.sort((a, b) => {
        if (a > b) {
          return -1
        }
        if (a < b) {
          return 1
        }
        return 0
      })
      return arr
    },
    updateComment (value) {
      this.comment = value
    },
    /**
     * Вызываем геттер модуля events хранилища с параметрами
     * и получаем имя типа события по коду
     * */
    getTypeNameByCode () {
      return this.$store.getters['event/getTypeNameByCode'](this.clickedEvent.tempType)
    },
    /**
     * Добавить оповещение
     * */
    addAlert (val) {
      let eventStarts = this.clickedEvent.isStart ? this.clickedEvent.starts : this.clickedEvent.ends
      let startTime = this.$moment(eventStarts).subtract(val, 'minutes')
      this.alerts.push(startTime.toISOString())
      this.alerts = this.sortDates(this.alerts)
    },
    /**
     * Удалить оповещение
     * */
    removeAlert (index) {
      this.alerts.splice(index, 1)
    },
    /**
     * Посчитать разницу во времени между переданным объектом даты и началом\окончанием event в минутах
     * */
    convertToDiff (item) {
      let alert = this.$moment(item)
      let start = this.clickedEvent.isStart ? this.clickedEvent.starts : this.clickedEvent.ends
      let diff = countDiffBetweenDates(alert, start)
      /**
       * преобразуем разницу в минуты
       * */
      return ((diff / 1000) / 60)
    },
    /**
     * Посчитать разницу во времени между алертом из массива alerts и началом\окончанием event в минутах
     * */
    countDiffTime (index) {
      let alert = this.$moment(this.alerts[index])
      let start = this.clickedEvent.isStart ? this.clickedEvent.starts : this.clickedEvent.ends
      let diff = countDiffBetweenDates(alert, start)
      /**
       * преобразуем разницу в минуты
       * */
      return ((diff / 1000) / 60)
    },
    /**
     * Обновляем event
     * */
    updateEvent () {
      this.commentForm = false
      this.notificForm = false
      /**
       * Напрямую с prop clickedEvent работать без предупреждений от системы не получится,тк он реактивен.
       * Поэтому клонируем этот объект .
       * */
      let item = JSON.parse(JSON.stringify(this.clickedEvent))
      if (this.clickedEvent.isStart === true) {
        item.comment.starts = this.comment
        item.alerts.starts = this.alerts
      } else {
        item.comment.ends = this.comment
        item.alerts.ends = this.alerts
      }

      console.log('comments or alerts changed', item)

      this.$store.dispatch({
        type: 'event/changeEvent',
        value: item
      })
      return this.closePopup()
    },
    removeComment () {
      this.comment = null
    },
    /**
     * Показать форму добавления комментариев
     * */
    openAddComment () {
      let val = this.commentForm
      this.commentForm = !val
    },
    /**
     * По нажатию на кнопку сразу добавить оповещение
     * */
    addAlertToTempStorage () {
      if (this.filteredTimeOptions.length > 0) {
        this.notificForm = true
        this.timeValue = this.filteredTimeOptions[0]
        this.addAlert(this.timeValue)
      } else {
        this.notificForm = false
      }
    },
    /**
     * Показать форму добавления алерта
     * */
    openAddAlert () {
      this.notificForm = !this.notificForm
    },
    /**
     * Возвращает дату начала текущего event
     * */
    dateStart () {
      return this.clickedEvent.isStart ? this.$moment(this.clickedEvent.starts) : this.$moment(this.clickedEvent.ends)
    },
    /**
     * Показать времея до начала события от текущего момента
     * */
    timeToStart () {
      return this.clickedEvent.isStart ? this.$moment(this.clickedEvent.starts).fromNow() : this.$moment(this.clickedEvent.ends).fromNow()
    },
    /**
     * Закрываем окно вызовом события и уникального Id. https://bootstrap-vue.js.org/docs/components/popover/
     * */
    closePopup () {
      this.$root.$emit('bv::hide::popover', this.target)
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/less/vars";

  .popover {
    margin: 0;
    padding: 0;
  }
  .popover-body {
    padding: 0!important;
    margin: 0;
    border: none;
  }
  .mypopover_header{
    background-image: linear-gradient(225deg, #8392d9 0%, #3841ba 100%)
  }
  .mypopover {
    position: relative;
    width: 330px;
    box-shadow: 8px 8px 32px rgba(0,0,0,0.35);
    background-color: #ffffff;
    border: none;
    &_add{
      display: -ms-flexbox;
      display: -webkit-box;
      display: flex;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
      padding: 0 20px;
    }
    &_header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 30px 20px 26px 20px;
      h5 {
        color: #ffffff;
        font-family: @main-font;
        font-size: 20px;
        font-weight: 700;
        line-height: 24px;
      }
      &-logo {
        display: flex;
        img {
          margin: auto;
        }
      }
    }
    &_event {
      padding: 10px 20px 10px 40px;
      &--pre_ico {
        background-color: @pre-ico;
        span::before {
          content: "";
          position: absolute;
          width: 12px;
          height: 12px;
          left: -20px;
          top: 2px;
          background-image: @img-clock-pre-iso;
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
        }
      }
      &--start_ico {
        background-color: @start-ico;
        span::before {
          content: "";
          position: absolute;
          width: 12px;
          height: 12px;
          left: -20px;
          top: 2px;
          background-image: @img-clock-iso-start;
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
        }
      }
      &--ending_ico {
        background-color: @ending-ico;
        span::before {
          content: "";
          position: absolute;
          width: 12px;
          height: 12px;
          left: -20px;
          top: 2px;
          background-image: @img-clock-iso-end;
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
        }
      }
      &--white_list {
        background-color: @white-list;
        span::before {
          content: "";
          position: absolute;
          width: 12px;
          height: 12px;
          left: -20px;
          top: 2px;
          background-image: @img-clock-white-list;
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
        }
      }
      &--KYC {
        background-color: @KYC;
        span::before {
          content: "";
          position: absolute;
          width: 12px;
          height: 12px;
          left: -20px;
          top: 2px;
          background-image: @img-clock-KYC;
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
        }
      }
      span {
        color: #ffffff;
        font-family: @main-font;
        font-size: 14px;
        font-weight: 700;
        line-height: 14px;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        position: relative;
        &.starts::before{
          content: "";
          position: relative;
          display: inline-block;
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
          width: 16px;
          height: 16px;
          bottom: 1px;
          background-image: @img-clock-end;
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
        }
      }
    }
    &_info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px 14px 20px;
      margin-bottom: 14px;
      background-color: #fff;
      border-bottom: 1px solid #e8edf2;
      &-time {
        display: flex;
        flex-direction: column;
        &-start {
          margin-bottom: 5px;
          color: #333f52;
          font-family: @main-font;
          font-size: 18px;
          font-weight: 700;
          line-height: 18px;
        }
        &-remain {
          color: #8f96a1;
          font-family: @main-font;
          font-size: 12px;
          font-weight: 400;
          line-height: 12px;
        }
      }
      &-date {
        display: flex;
        flex-direction: column;
        text-align: right;
        &-month {
          margin-bottom: 5px;
          color: #333f52;
          font-family: @medium;
          font-size: 16px;
          font-weight: 400;
          line-height: 16px;
        }
        &-day {
          color: #8f96a1;
          font-family: @main-font;
          font-size: 12px;
          font-weight: 400;
          line-height: 12px;
        }
      }
    }
    &_remainder {
      display: flex;
      align-items: center;
      padding: 0 20px;
      margin-bottom: 4px;
      span {
        margin-right: 5px;
        color: #525c6c;
        font-family: @main-font;
        font-size: 13px;
        font-weight: 400;
        line-height: 13px;
      }
      &-select {
        position: relative;
        select {
          padding: 4px 24px 3px 9px;
          height: 24px;
          //outline: none;
          color: #707986;
          font-family: @main-font;
          font-size: 12px;
          font-weight: 400;
          line-height: 12px;
          border: 1px solid rgba(197,208,222,0.5);
          box-shadow: 0 1px 0 #e2e7ee;
          background-color: #ffffff;
        }
        &::before {
          content: "";
          position: absolute;
          width: 8px;
          height: 4px;
          right: 6px;
          top: 10px;
          background-image: @img-select-arrow;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 11;
        }
      }
      a {
        margin-left: auto;
        position: relative;
        color: #ff3657;
        font-family: @main-font;
        font-size: 10px;
        font-weight: 400;
        line-height: 14px;
        cursor: pointer;
        &::before {
          content: "";
          position: absolute;
          width: 7px;
          height: 8px;
          left: -12px;
          top: 3px;
          background-image: @img-delete-icon;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 11;
        }
      }
      a.add {
        color: @accent-color;
        &:focus,
        &.active,
        &:hover{
          color: inherit;
          text-decoration: none;
        }
        &::before {
          content: none;
        }
      }
    }
    &_add-remind {
      margin-top: 15px;
      margin-bottom: 5px;
      padding: 0 0 0 18px;
      a {
        position: relative;
        color: @accent-color;
        font-family: @main-font;
        font-size: 12px;
        font-weight: 400;
        text-decoration: underline dotted;
        word-break: keep-all;
        cursor: pointer;
        line-height: 16px;
        display: inline-block;
        &:focus,
        &.active,
        &.disabled,
        &:hover {
          text-decoration: none;
          color: #8f96a1;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: -0.06px;
        }
        &::before {
          content: "";
          position: absolute;
          width: 9px;
          height: 9px;
          left: -17px;
          top: 3px;
          background-image: @img-green-bell;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 11;
        }
        &:hover::before,
        &.active::before,
        &.disabled::before{
          color: #8f96a1;
          background-image: @img-grey-bell;
          background-position: center;
          background-repeat: no-repeat;
        }
      }
    }
    &_comment{
      padding: 0 20px;
    }
    &_add-comment {
      padding: 0 0 0 55px;
      margin-top: 15px;
      margin-bottom: 5px;
      text-align: right;
      a {
        position: relative;
        color: @accent-color;
        font-family: @main-font;
        font-size: 12px;
        font-weight: 400;
        text-decoration: underline dotted;
        word-break: keep-all;
        cursor: pointer;
        line-height: 16px;
        display: inline-block;
        text-align: left;
        &:focus,
        &.active,
        &:hover {
          text-decoration: none;
          color: #8f96a1;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: -0.06px;
        }
        &::before {
          content: "";
          position: absolute;
          width: 9px;
          height: 9px;
          left: -17px;
          top: 3px;
          background-image: @img-green-comment;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 11;
        }
        &:hover::before,
        &.active::before{
          color: #8f96a1;
          background-image: @img-grey-comment;
          background-position: center;
          background-repeat: no-repeat;
        }
      }
    }
    &_button {
      margin-top: 25px;
      padding: 0 20px;
      .btn {
        margin-bottom: 20px;
        padding: 13px 16px 11px;
        box-shadow: 0 2px 0 darken(@accent-color,10%);
        border-radius: 4px;
        background-color: @accent-color;
        font-family: @medium;
        color: #fff;
      }
    }
    .border-exp{
      margin: 0 20px;
    }
    textarea{
      font-size: 12px;
      &.form-control:focus {
        border-color: @accent-color;
        box-shadow: none;
      }
    }
    .mypopover_close {
      span {
        position: absolute;
        width: 22px;
        height: 22px;
        background-color: #fff;
        top: -11px;
        right: -11px;
        border-radius: 50%;
        opacity: 1;
        cursor: pointer;
        &::before {
          content: "";
          position: absolute;
          width: 12px;
          height: 1px;
          top: 11px;
          right: 5px;
          background-color: #525c6c;
          transform: rotate(45deg);
        }
        &::after {
          content: "";
          position: absolute;
          width: 12px;
          height: 1px;
          top: 11px;
          right: 5px;
          background-color: #525c6c;
          transform: rotate(-45deg);
        }
      }
    }
  }

</style>
