<template>

  <b-popover :target="`event-${clickedEvent.id}`"
             triggers="click"
             :show="popoverShow"
             placement="auto"
             container="myContainer"
             ref="popover">

    <div class="mypopover" id="popover">

      <div class="mypopover_close">
        <a @click="closePopup()" class="close" aria-label="Close" href="#"></a>
      </div>
      <div class="mypopover_header" >
        <h5>Aurora</h5>
        <div class="mypopover_header-logo">
          <img src="../assets/img/aurora-logo.png" alt="">
        </div>
      </div>

        <div :class="['mypopover_event',`mypopover_event--${clickedEvent.type}`]">
          <span class="mypopover_event-type">{{ getTypeNameByCode() }}</span>
        </div>
        <div class="mypopover_info">
          <div class="mypopover_info-time">
            <span class="mypopover_info-time-start">{{ moment(this.clickedEvent.starts).format('H:mm') }}</span>
            <span class="mypopover_info-time-remain">Начало {{ timeToStart() }}</span>
          </div>
          <div class="mypopover_info-date">
            <span class="mypopover_info-date-month">{{ dateStart() }}</span>
            <span class="mypopover_info-date-day"> {{ moment(this.clickedEvent.starts).format('dddd') }}</span>
          </div>
        </div>

      <div class="mypopover_remainder" v-if="alerts.length > 0" v-for="(item, index) in alerts" :key="index">
          <span >
            Напомнить за {{ countDiffTime(index) }} минут
          </span>
          <a href="#" @click="removeAlert(index)">Удалить</a>
      </div>

      <div class="mypopover_comment" v-if="!commentForm
                                                && comment != null
                                                && comment !==  '' ">
        <span>{{comment}}</span>
      </div>

      <div class="mypopover_add">
        <div class="col-sm-6 mypopover_add-remind" >
          <a href="#" @click="openAddAlert()">Добавить напоминание</a>
        </div>
        <div class="col-sm-6 mypopover_add-comment">
          <a v-if="!commentForm && comment != null" href="#" @click="removeComment()">Удалить комментарий</a>
          <a v-else href="#" @click="openAddComment()">Добавить комментарий</a>
        </div>
      </div>

      <div v-if="notificForm" class="mypopover_remainder">
        <span>Напомнить за </span>
        <div class="mypopover_remainder-select">
          <select v-model="timeValue">
            <option v-for="( val, index ) in timeOptions" :key="index" name="name[]" :value="val">
              <a href="#">{{ val }} минут</a>
            </option>
          </select>
        </div>
        <a @click="addAlert(timeValue)" href="#">Добавить</a>
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
        <a href="#" class="btn" @click="updateEvent()" >Сохранить</a>
      </div>
    </div>

  </b-popover>

</template>

<script>
import { countDiffBetweenDates } from './eventbus'

export default {
  name: 'popover',
  props: {
    clickedEvent: Object,
    popoverShow: Boolean
  },
  data () {
    return {
      moment: this.$moment,
      commentForm: false,
      notificForm: false,
      timeOptions: [15, 30, 45],
      comment: null,
      timeValue: '',
      alerts: []
    }
  },
  computed: {
  },
  created () {
    if (this.clickedEvent.alerts !== undefined) this.alerts = [...this.clickedEvent.alerts]
    if (this.clickedEvent.comment !== undefined) this.comment = this.clickedEvent.comment
  },
  methods: {
    updateComment (value) {
      this.comment = value
    },
    /**
     * Вызываем геттер модуля events хранилища с параметрами
     * и получаем имя типа события по коду
     * */
    getTypeNameByCode () {
      return this.$store.getters['event/getTypeNameByCode'](this.clickedEvent.type)
    },
    addAlert (val) {
      let itemStarts = this.clickedEvent.starts
      let startTime = this.$moment(itemStarts).subtract(val, 'minutes')
      this.alerts.push(startTime.toISOString())
    },
    removeAlert (index) {
      this.alerts.splice(index, 1)
    },
    countDiffTime (index) {
      let alert = this.$moment(this.alerts[index])
      let start = this.clickedEvent.starts
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
       * Напрямую с prop clickedEvent работать bad practice,тк он реактивен.
       * Поэтому клонируем его.
       * */
      let item = Object.assign({}, this.clickedEvent)
      item.comment = this.comment
      item.alerts = this.alerts

      console.log('comments or alerts changed', item)

      return this.$store.dispatch({
        type: 'event/changeEvent',
        value: item
      })
    },
    removeComment () {
      this.comment = null
    },
    openAddComment () {
      let val = this.commentForm
      this.commentForm = !val
    },
    openAddAlert () {
      let val = this.notificForm
      this.notificForm = !val
    },
    dateStart () {
      return this.$moment(this.clickedEvent.starts).format('D MMMM')
    },
    timeToStart () {
      return this.$moment(this.clickedEvent.starts).fromNow()
    },
    /**
     * Закрываем окно вызовом события и уникального Id. https://bootstrap-vue.js.org/docs/components/popover/
     * */
    closePopup () {
      this.$root.$emit('bv::hide::popover', `event-${this.clickedEvent.id}`)
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
      }
      &--start_ico {
        background-color: @start-ico;
      }
      &--ending_ico {
        background-color: @ending-ico;
      }
      &--white_list {
        background-color: @white-list;
      }
      &--KYC {
        background-color: @KYC;
      }
      span {
        color: #ffffff;
        font-family: @main-font;
        font-size: 14px;
        font-weight: 700;
        line-height: 14px;
        text-transform: uppercase;
        letter-spacing: 0.3px;
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
          font-family: @main-font;
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
          left: 69px;
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
        line-height: 12px;
        text-decoration: underline dotted;
        word-break: keep-all;
        &:hover {
          text-decoration: none;
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
      }
    }
    &_comment{
      padding: 0 20px;
    }
    &_add-comment {
      padding: 0 0 0 39px;
      margin-top: 15px;
      margin-bottom: 5px;
      text-align: right;
      a {
        position: relative;
        color: @accent-color;
        font-family: @main-font;
        font-size: 12px;
        font-weight: 400;
        line-height: 12px;
        text-decoration: underline dotted;
        word-break: keep-all;
        &:hover {
          text-decoration: none;
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
      a {
        position: absolute;
        width: 22px;
        height: 22px;
        background-color: #fff;
        top: -11px;
        right: -11px;
        border-radius: 50%;
        opacity: 1;
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
