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
            <!--@mousewheel.native="onWheel"-->
    <div class="events"
             id="events"
             ref="dragTarget"
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
    </div>
  </div>

</template>

<script>
import CalendarHour from './CalendarHour'
import { generateHours, EventBus, isSameOnlyDate } from './eventbus'
import Vuex from 'vuex'
import TWEEN from '@tweenjs/tween.js'
import moment from 'moment'

const storeEvent = Vuex.createNamespacedHelpers('event')

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
     * свайп пока отключен
     * */
    onWheel: function (e) {
      console.log(e)
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
      // let scrollUp = -100
      // let scrollDown = 100
      if (e.deltaY >= 0 && scrollWidth > clientWidth + scrollLeft) {
        e.preventDefault()
        this.onSwipeLeft()
        console.log(scrollWidth)
      } else if (e.deltaY <= 0 && scrollLeft !== 0) {
        e.preventDefault()
        this.onSwipeRight()
        console.log(scrollWidth)
      }
    },

    smoothScroll: function (target, speed, smooth) {
      /**
       * Кросс браузерный суппор для скрола
       * */
      if (target === document) { target = (document.documentElement || document.body.parentNode || document.body) }
      let moving = false
      let pos = target.scrollLeft
      target.addEventListener('mousewheel', scrolled, false)
      target.addEventListener('DOMMouseScroll', scrolled, false)

      function scrolled (e) {
        let delta = e.delta || e.wheelDelta || e.deltaY
        if (delta === undefined) {
          /**
           * Исключение для firefox
           * */
          delta = -e.detail
        }
        /**
         * Одинаковое ограничение для delta [-1,1] для корректной работы во всех браузерах
         * */
        delta = Math.max(-1, Math.min(1, delta))
        if (delta < 0 && target.scrollWidth > (target.clientWidth + target.scrollLeft + 16)) {
          e.preventDefault()
          pos += -delta * speed
          /**
           * Ограничение для скрола
           * */
          pos = Math.max(0, Math.min(pos, target.scrollWidth - target.clientWidth)) // limit scrolling
        }
        if (delta > 0 && target.scrollLeft !== 0) {
          e.preventDefault()
          pos += -delta * speed
          /**
           * Ограничение для скрола
           * */
          pos = Math.max(0, Math.min(pos, target.scrollWidth - target.clientWidth)) // limit scrolling
        }

        if (!moving) update()
      }

      function update () {
        moving = true
        let delta = (pos - target.scrollLeft) / smooth
        target.scrollLeft += delta
        /**
         * Если скролл, запускаем requestAnimationFrame
         * */
        if (Math.abs(delta) > 0.5) { requestFrame(update) } else { moving = false }
      }
      /**
       * Кроссбраузерный requestAnimationFrame
       * */
      let requestFrame = (function () {
        return (
          window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function (func) {
            window.setTimeout(func, 1000 / 50)
          }
        )
      }())
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
    /**
     * весибработчик на скролл
     * */
    this.smoothScroll(this.$refs.dragTarget, 120, 12)
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
    min-height: 63px;
    max-height: 63px;
    height: 63px;
    border-bottom: 1px solid #e0e6ed;
  }
</style>
