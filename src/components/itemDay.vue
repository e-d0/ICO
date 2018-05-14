<template>
  <div class="calendar--body">

    <div class="time-group">
      <div class="empty-slot">
      </div>
      <div class="timeline_item timeline_item-time" v-for="(hour, index) in emptyHoursArray" :key="index" >

        <span v-if=" moment.locale() === 'ru'">{{ hour.format('HH:mm') }}</span>
        <span v-else>{{ hour.format('hh a') }}</span>

      </div>
    </div>
    <v-touch :swipe-options="{ direction: 'horizontal', threshold: 70 }"
             :pan-options = "{ direction: 'vertical'}"
             v-on:pandown="onSwipeLeft"
             v-on:panup="onSwipeRight"
             v-on:swipeleft="onSwipeLeft"
             v-on:swiperight="onSwipeRight"
             v-on:swipeup="onSwipeLeft"
             v-on:swipedown="onSwipeRight"
             class="events"
             id="events"
             transition = "fade" >
    <div class="events-group" v-if="dates"
                              v-for="(dayItem, dayInd) in dates"
                              :key="dayInd">

        <div class="timeline_item-data timeline_item-scale--calendar timeline_item-head">
          <span class="timeline_item-date">{{ moment(dayItem).format('D') }}</span>
          <span class="timeline_item-day">{{ dayItem | weekDayName }}</span>
        </div>

        <div class="hours">
          <div v-if="dayItem"
               v-for="(hour,ind) in generateHours(dayItem)"
               :key="ind"
               v-bind:class="['timeline_item','timeline_item-scale' ,'timeline_item-scale--calendar']">
                <itemHour :hour="hour"
                          :index="updatedIndex(dayInd, ind)"
                          :itemRender.sync="itemRender"
                          :preventMultiStack="preventMultiStack"
                          :date="updatedDayCell(hour)"></itemHour>
          </div>
        </div>

    </div>
    </v-touch>
  </div>

</template>

<script>
import moment from 'moment'
import itemHour from './itemHour'
import { generateHours } from './eventbus'
import Vuex from 'vuex'
import TWEEN from '@tweenjs/tween.js'
const storeEvent = Vuex.createNamespacedHelpers('event')
/**
 * Приводим дату в соотетствие с форматом в браузере пользователя
 * */
const locale = window.navigator.userLanguage || window.navigator.language
moment.locale(locale)
console.log('<><><><><><><><><', moment.locale())
export default {
  name: 'Day',
  props: {
    itemRender: Function,
    preventMultiStack: Boolean,
    dayIndex: Number
  },
  components: { itemHour },
  data () {
    return {
      moment: moment,
      currentTime: null,
      emptyHoursArray: generateHours()
    }
  },
  computed: {
    ...storeEvent.mapGetters({
      events: 'events',
      filteredEvents: 'filteredEvents',
      dates: 'dates'
    })
  },
  filters: {
    weekDayName: function (value) {
      if (!value) return ''
      return moment(value).format('dddd')
    }
  },
  methods: {
    onSwipeLeft (el) {
      // получаем элемент из DOM
      let elem = this.$el.querySelector('#events')
      let width = this.$el.querySelector('#events').offsetWidth * 0.75
      let newVal = elem.scrollLeft + width
      // анимируем с tween.js
      function animate () {
        if (TWEEN.update()) {
          requestAnimationFrame(animate)
        }
      }

      new TWEEN.Tween(elem)
        .to({scrollLeft: newVal}, 110)
        .start()

      animate()
    },
    onSwipeRight (el) {
      // получаем элемент из DOM
      let elem = this.$el.querySelector('#events')
      let width = this.$el.querySelector('#events').offsetWidth * 0.75
      let newVal = elem.scrollLeft - width
      // анимируем с tween.js
      function animate () {
        if (TWEEN.update()) {
          requestAnimationFrame(animate)
        }
      }

      new TWEEN.Tween(elem)
        .to({scrollLeft: newVal}, 110)
        .start()

      animate()
    },
    /**
     * Обновляем текущее время
     * */
    updateCurrentTime () {
      this.currentTime = moment().format('LTS')
    },
    /**
     * Генерируем часы с датой для каждой ячейки
     * */
    generateHours (day) {
      // this.hoursArray = generateHours(this.day)
      return generateHours(day)
    },
    /**
     * Обновляем часы в текущей дате ячейки
     * */
    updatedDayCell (hour) {
      const h = new Date(hour)
      return h
    },
    /**
     * Создаем уникальный индекс для ячейки часа
     * */
    updatedIndex: function (dayIndex, index) {
      return Number(dayIndex.toString() + index.toString())
    }
  },
  created () {
    this.currentTime = moment().format('LTS')
    setInterval(() => this.updateCurrentTime(), 1 * 1000)
  }
}
</script>

<style scoped>
  .timeline_item {
    cursor: -webkit-grab;
  }

  .grabbing.timeline_item{
    cursor: grabbing;
  }
  #events{}
.empty-slot{
    height: 62px;
    border-bottom: 1px solid #e0e6ed;
  }
</style>
