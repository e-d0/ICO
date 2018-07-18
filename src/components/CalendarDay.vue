<template>
  <div class="calendar--body">

    <div class="time-group">
      <div class="empty-slot">
      </div>
      <div class="hours-array">
        <div class="online_time" v-bind:style="{ top: offset + 'px' }">
          <span class="dot"></span>
          <span class="line"></span>
        </div>
      <div class="timeline_item timeline_item-time" v-for="(hour, index) in emptyHoursArray" :key="index" >

        <span v-if=" moment.locale() === 'ru'">
          {{ hour.format('HH:mm') }}

        </span>
        <span v-else>{{ hour.format('hh a') }}</span>

      </div>
    </div>
    </div>
    <!--<v-touch :swipe-options="{ direction: 'horizontal', threshold: 100 }"-->
             <!--:pan-options = "{ direction: 'vertical'}"-->
             <!--v-on:pandown="onSwipeLeft"-->
             <!--v-on:panup="onSwipeRight"-->
             <!--v-on:swipeleft="onSwipeLeft"-->
             <!--v-on:swiperight="onSwipeRight"-->
             <!--v-on:swipeup="onSwipeLeft"-->
             <!--v-on:swipedown="onSwipeRight"-->
    <v-touch class="events"
             id="events"
             transition = "fade"
             ref="dragTarget"
             @mousewheel.native="onWheel"
    >
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
               :class="['timeline_item','timeline_item-scale' ,'timeline_item-scale--calendar']">
                <calendar-hour :hour="hour"
                          :index="updatedIndex(dayInd, ind)"
                          :events="allEventsByHours(dayItem)[ind]"
                          :date="updatedDayCell(hour)"></calendar-hour>
          </div>
        </div>

    </div>
    </v-touch>
  </div>

</template>

<script>
import CalendarHour from './CalendarHour'
import { generateHours, EventBus, isSameOnlyDate } from './eventbus'
import Vuex from 'vuex'
import TWEEN from '@tweenjs/tween.js'
import moment from 'moment'
import Vue from 'vue'
import scrollWheel from './scrollWheel'

const storeEvent = Vuex.createNamespacedHelpers('event')

Vue.use(scrollWheel)

export default {
  name: 'Day',
  props: {
    dayIndex: Number
  },
  components: { CalendarHour },
  data () {
    return {
      moment: this.$moment,
      emptyHoursArray: generateHours(),
      offset: 0,
      eventsStorage: []
    }
  },
  computed: {
    ...storeEvent.mapGetters({
      events: 'events',
      filteredEvents: 'filteredEvents',
      dates: 'dates',
      groupedByHoursWithEvents: 'groupedByHoursWithEvents'
    })
  },
  filters: {
    weekDayName: function (value) {
      if (!value) return ''
      return moment(value).format('dddd')
    }
  },
  watch: {
    filteredEvents: function (newVal, oldVal) {
      this.eventsStorage = newVal
    }
  },
  methods: {
    /**
     * Отслеживание скролла осуществляется за счет маленького миксина https://github.com/Tombarr/vue-wheel
     * */
    onWheel: function (e) {
      /**
       * Полная ширина элемента с учетом спрятанного
       * */
      let scrollWidth = this.$el.querySelector('#events').scrollWidth
      /**
       * Ндлина элемента в поле видимости
       * */
      let clientWidth = this.$el.querySelector('#events').clientWidth
      /**
       * На какую длину уже сделан скролл
       * */
      let scrollLeft = this.$el.querySelector('#events').scrollLeft
      let scrollUp = -100
      let scrollDown = 100
      if (e.deltaY === scrollDown && scrollWidth > clientWidth + scrollLeft) {
        e.preventDefault()
        this.onSwipeLeft()
        console.log(scrollWidth)
      } else if (e.deltaY === scrollUp && scrollLeft !== 0) {
        e.preventDefault()
        this.onSwipeRight()
        console.log(scrollWidth)
      }
    },
    /**
     * Фильтр по текущему дню
     * */
    filteredByDayEvents: function (date) {
      return this.eventsStorage.filter(item => isSameOnlyDate(item.date, date))
    },
    /**
     * Сортировка массива дат
     * */
    sortedDates (arrEvents) {
      return arrEvents.sort((obj1, obj2) => {
        if (obj1.date > obj2.date) return -1
        if (obj1.date < obj2.date) return 1
        return 0
      })
    },
    /**
     * Все события, сгруппированные по часам
     * */
    allEventsByHours (date) {
      /**
       * проверка, совпадает ли дата события и дата объекта ячейки
       * */
      if ((this.filteredEvents !== undefined && this.filteredEvents.length) && this.filteredEvents.length) {
        let events = this.groupedByHoursWithEvents(this.filteredByDayEvents(date))
        // if (events.length > 0) { console.log('EVENTS END', events) }
        return events
      } else {
        return []
      }
    },
    /**
     * Отступ линии времени
     * */
    timeOffset: function () {
      this.offset = this.calcTimeOffset()
    },
    /**
     * Считам отсутп в минутах
     * */
    calcTimeOffset () {
      if (this.$el.querySelector('.hours-array') !== undefined) {
        let elHeight = this.$el.querySelector('.hours-array').clientHeight
        let pixelPerMinute = (elHeight / this.emptyHoursArray.length) / 60
        let offsetHeight = ((this.moment().get('hour') * 60) + (this.moment().get('minute'))) * pixelPerMinute
        return Math.round(offsetHeight)
      }
    },
    /**
     * Двигает скролл влево
     * */
    onSwipeLeft () {
      // получаем элемент из DOM
      let elem = this.$el.querySelector('#events')
      /**
       * Величина, на которую сделать сдвиг скролла
       * */
      let width = this.$el.querySelector('#events').offsetWidth * 0.25
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
    /**
     * Двигает скролл вправо
     * */
    onSwipeRight () {
      // получаем элемент из DOM
      let elem = this.$el.querySelector('#events')
      /**
       * Величина, на которую сделать сдвиг скролла
       * */
      let width = this.$el.querySelector('#events').offsetWidth * 0.25
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
     * Генерируем часы с датой для каждой ячейки
     * */
    generateHours (day) {
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
    },
    /**
     * Останавливаем распознавание жестов pan, swipe
     * */
    stopSwipe () {
      if (this.$refs.dragTarget) this.$refs.dragTarget.disable('pan', 'swipe')
    },
    /**
     * Запускаем распознавание жестов pan, swipe
     * */
    startSwipe () {
      if (this.$refs.dragTarget) this.$refs.dragTarget.enable('pan', 'swipe')
    }
  },
  created () {
    /**
     * Запускаем сетчик времени. Раз в минуту обновляет отступ линии времени.
     * */
    setInterval(() => this.timeOffset(), 60000)
    EventBus.$on('item-dragstart', this.stopSwipe)
    EventBus.$on('event-dragend', this.startSwipe)
  },
  mounted () {
    this.timeOffset()
  },
  destroyed () {
    EventBus.$off()
  }
}
</script>

<style lang="less" scoped>
  .hours-array{
    position: relative;
  }
  .online_time{
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    position: absolute;
    z-index: 1;
    pointer-events: none;
    left: 68%;
    .dot{
      width: 9px;
      height: 9px;
      border-radius: 5px;
      background-image: linear-gradient(199deg, #b4ec51 0%, #429321 100%);
    }
    .line{
      width: 100vw;
      height: 1px;
      background-color: #7ed321;
      position: relative;
      top: 4px;
    }
  }

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
