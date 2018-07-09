<template>
  <div class="current-events">
    <legend class="dropdown" v-b-toggle="'formActualFilter'">{{ $t('form.eventFilterActualTitle') }}</legend>
    <b-collapse id="formActualFilter" visible>
    <div class="radio-buttons">
      <label>
        <input name="event-radio-actual" value='true' type="radio" v-model="actual" @change="changeEvent">
        <b>{{ $t('form.Actual') }}</b>
      </label>
      <label>
        <input name="event-radio-past" value='false' type="radio" v-model="actual" @change="changeEvent">
        <b>{{ $t('form.Past') }}</b>
      </label>
    </div>
    <div v-if="filteredEvents" v-for="(event, index) in filteredEvents" :key="index" class="current-events_item">
      <div class="current-events_item-data">
        <span class="current-events_item-name" data-toggle="tooltip" data-placement="right" title="">{{event.name}}</span>
        <span :class="['current-events_item-event',`current-events_item-event--${event.tempType}`]">{{ getTypeNameByCode(event.tempType) }}</span>
      </div>
      <div class="current-events_item-data">
        <span class="current-events_item-time" data-toggle="tooltip" data-placement="top" title="">
          {{ moment(event.starts).format('HH:mm') }}
        </span>
        <span v-if="actual === 'true'" class="current-events_item-time-remain" data-toggle="tooltip" data-placement="right" title="">
          {{ $t('form.eventFilterActualStart', { time: moment(event.starts).fromNow() }  ) }}
        </span>
        <span v-else class="current-events_item-time-remain" data-toggle="tooltip" data-placement="right" title="">
          {{ $t('form.eventFilterActualEnd', { time: moment(event.ends).fromNow() }  ) }}
        </span>
      </div>
    </div>
    </b-collapse>
    <!-- /.current-events_item -->
  </div>
  <!-- /.events_current -->
</template>

<script>
import { EventBus } from './eventbus'
import Vuex from 'vuex'
const storeEvent = Vuex.createNamespacedHelpers('event')
export default {
  name: 'eventsFilterActual',
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
     * Отправляем тип события в компонент
     * */
    changeEvent () {
      EventBus.$emit('filter:event', this.actual)
    },
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
  .current-events .dropdown {
    cursor: pointer;
    &.collapsed{}
    &::before {
      content: "";
      position: absolute;
      width: 8px;
      height: 4px;
      background-image: @img-arrow-top;
      background-position: center;
      background-repeat: no-repeat;
      z-index: 11;
      right: 0;
      top: 8px;
    }
    &.collapsed{
      &::before {
        transform: rotate(180deg);
      }
    }
  }
  .current-events {
    margin-top: 28px;
    margin-bottom: 36px;
    padding: 16px 24px 30px 24px;
    border-top: 4px solid #5bb0d5;
    box-shadow: 0 2px 4px rgba(51, 51, 51, 0.1);
    border-radius: 4px;
    background-color: #fafbfc;
    font-family: @condenced;
    font-weight: bold;
    legend {
      margin-bottom: 0;
      color: #525c6c;
      font-size: 14px;
      font-weight: 700;
      line-height: 18px;
      letter-spacing: 1.3px;
      text-transform: uppercase;
    }
    .radio-buttons {
      margin-top: 16px;
      margin-bottom: 19px;
      label {
        margin-bottom: 0;
      }
    }
    &_item {
      margin-top: 18px;
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
        font-family: @medium;
        font-size: 14px;
        line-height: 16px;
        white-space: nowrap;
      }
      &-event {
        padding: 3px 4px;
        color: #ffffff;
        font-family: @main-font;
        font-size: 11px;
        font-weight: 700;
        line-height: 11px;
        text-transform: uppercase;
        letter-spacing: 0.28px;
        white-space: nowrap;
        border-radius: 2px;
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
