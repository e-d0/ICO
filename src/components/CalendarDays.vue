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
    <div class="events"
             id="events"
             ref="dragTarget"
    >

    <template v-if="dates"
              v-for="(dayItem, dayInd) in dates">
      <ClendarDayItem :key="dayInd"
                      :day-ind="dayInd"
                      :day-item="dayItem"/>
    </template>
    </div>
  </div>

</template>

<script>
import { generateHours } from './eventbus'
import Vuex from 'vuex'
import moment from 'moment'
import ClendarDayItem from './ClendarDayItem'

const storeEvent = Vuex.createNamespacedHelpers('event')

export default {
  name: 'Days',
  props: {
    dayIndex: Number
  },
  components: { ClendarDayItem },
  data () {
    return {
      moment: this.$moment,
      emptyHoursArray: generateHours(),
      offset: 0
    }
  },
  computed: {
    ...storeEvent.mapGetters({
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
    }
  },
  created () {
    /**
     * Запускаем сетчик времени. Раз в минуту обновляет отступ линии времени.
     * */
    setInterval(() => this.timeOffset(), 60000)
  },
  mounted () {
    this.timeOffset()
    /**
     * весибработчик на скролл
     * */
    this.smoothScroll(this.$refs.dragTarget, 120, 12)
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
  .empty-slot{
    min-height: 63px;
    max-height: 63px;
    height: 63px;
    border-bottom: 1px solid #e0e6ed;
  }
</style>
