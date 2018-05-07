<template>
  <div class="current-events">
    <h3>Текущие события</h3>
    <div class="radio-buttons">
      <label>
        <input name="event-radio-actual" value='true' type="radio" v-model="actual">
        <b>Актуальные</b>
      </label>
      <label>
        <input name="event-radio-past" value='false' type="radio" v-model="actual">
        <b>Прошедшие</b>
      </label>
    </div>
    <div v-if="filteredEvents" v-for="(event, index) in filteredEvents" :key="index" class="current-events_item">
      <div class="current-events_item-data">
        <span class="current-events_item-name" data-toggle="tooltip" data-placement="right" title="">{{event.name}}</span>
        <span :class="['current-events_item-event',`current-events_item-event--${event.type}`]">{{ getTypeNameByCode(event.type) }}</span>
      </div>
      <div class="current-events_item-data">
        <span class="current-events_item-time" data-toggle="tooltip" data-placement="top" title="">
          {{ moment(event.starts).format('HH:mm') }}
        </span>
        <span v-if="actual === 'true'" class="current-events_item-time-remain" data-toggle="tooltip" data-placement="right" title="">
          Начало {{ moment(event.starts).fromNow() }}
        </span>
        <span v-else class="current-events_item-time-remain" data-toggle="tooltip" data-placement="right" title="">
          Завершилось {{ moment(event.ends).fromNow() }}
        </span>
      </div>
    </div>
    <!-- /.current-events_item -->
  </div>
  <!-- /.events_current -->
</template>

<script>
import Vuex from 'vuex'
const storeEvent = Vuex.createNamespacedHelpers('event')
export default {
  name: 'CurrentEvents',
  data () {
    return {
      eventTempStorage: null,
      actual: 'true'
    }
  },
  computed: {
    ...storeEvent.mapGetters({
      events: 'events'
    }),
    filteredEvents: function () {
      let arr = [...this.events]
      let currTime = this.moment()

      return this.sortedDates(arr.filter(event => {
        if (this.actual === 'true') {
          console.log('actual')
          if (this.moment(event.ends) > currTime) return event
        } else {
          if (this.moment(event.ends) < currTime) return event
        }
      })
      )
    }
  },
  methods: {
    /**
     * Сортировка массива дат
     * */
    sortedDates (arrEvents) {
      return arrEvents.sort((obj1, obj2) => {
        if (obj1.date > obj2.date) return 1
        if (obj1.date < obj2.date) return -1
        return 0
      })
    },
    /**
     * Вызываем геттер модуля events хранилища с параметрами
     * и получаем имя типа события по коду
     * */
    getTypeNameByCode (code) {
      if (code !== undefined) return this.$store.getters['event/getTypeNameByCode'](code)
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/less/vars";
  .current-events {
    margin-top: 28px;
    margin-bottom: 36px;
    padding: 20px 24px;
    border-top: 4px solid #5bb0d5;
    box-shadow: 0 2px 4px rgba(51, 51, 51, 0.1);
    border-radius: 4px;
    background-color: #fafbfc;
    h3 {
      margin-bottom: 18px;
      color: #525c6c;
      font-size: 14px;
      font-weight: 700;
      line-height: 18px;
      letter-spacing: 1.3px;
      text-transform: uppercase;
    }
    .radio-buttons {
      margin-bottom: 18px;
    }
    &_item {
      margin-top: 20px;
      &-data {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 3px;
        a {
          margin-top: 2px;
          color: #1991eb;
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
      &-name {
        color: #333f52;
        font-family: @main-font;
        font-size: 14px;
        font-weight: 500;
        line-height: 16px;
        white-space: nowrap;
      }
      &-event {
        padding: 3px 4px 2px;
        color: #ffffff;
        font-family: @main-font;
        font-size: 11px;
        font-weight: 700;
        line-height: 11px;
        text-transform: uppercase;
        letter-spacing: 0.28px;
        white-space: nowrap;
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
      &-time {
        color: #525c6c;
        font-family: @main-font;
        font-size: 12px;
        font-weight: 400;
        line-height: 12px;
        white-space: nowrap;
      }
      &-time-remain {
        color: #707986;
        font-family: @main-font;
        font-size: 11px;
        font-weight: 400;
        line-height: 11px;
        white-space: nowrap;
      }
    }
  }
</style>
