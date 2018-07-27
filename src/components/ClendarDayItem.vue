
<template>
    <div class="events-group">

        <div class="timeline_item-data timeline_item-scale--calendar timeline_item-head">
            <span class="timeline_item-date">{{ moment(dayItem).format('D') }}</span>
            <span class="timeline_item-day">{{ dayItem | weekDayName }}</span>
        </div>
        <div class="events-group__body">
          <div class="events-group__hours" v-if="dayItem">
              <div v-for="(hour, ind) in generateHours(dayItem)"
                   :key="ind"
                   :class="['timeline_item','timeline_item-scale' ,'timeline_item-scale--calendar']">
                    <!--<calendar-hour :hour="hour"-->
                                   <!--:index="updatedIndex(dayInd, ind)"-->
                                   <!--:events="allEventsByHours(dayItem)[ind]"-->
                                   <!--:date="updatedDayCell(hour)"></calendar-hour>-->
                    <calendar-hour  ></calendar-hour>
              </div>
          </div>
          <div class="events-group__events">
            <event v-for="(event, index) in groupedEvents"
                   :key="index"
                   :index="index.toString()"
                   :class="[{ 'last':index === groupedEvents.length }]"
                   :style="{ zIndex: 1+index }"
                   :item="event"
                   :type="event.type"
                   :date="(new Date(event.date))"
            ></event>
          </div>
        </div>
    </div>
</template>
<script>
import CalendarHour from './CalendarHour'
import event from './itemEvent'
import {generateHours} from './eventbus'
import Vuex from 'vuex'
import moment from 'moment'
const storeEvent = Vuex.createNamespacedHelpers('event')
export default {
  name: 'ClendarDayItem',
  components: {CalendarHour, event},
  props: {
    dayInd: {},
    dayItem: {}
  },
  data () {
    return {
      eventsStorage: []
    }
  },
  filters: {
    weekDayName: function (value) {
      if (!value) return ''
      return moment(value).format('dddd')
    }
  },
  computed: {
    ...storeEvent.mapGetters({
      events: 'events',
      dates: 'dates',
      groupedByDayEvents: 'groupedByDayEvents',
      groupedByHoursWithEvents: 'groupedByHoursWithEvents'
    }),
    groupedEvents () {
      if (this.dayItem && this.events) {
        return this.sortedDates(this.groupedByDayEvents(this.dayItem))
      }
    }
  },
  watch: {
    filteredEvents: function (newVal, oldVal) {
      this.eventsStorage = newVal
    }
  },
  mounted () {
    this.setupGroupingOverlapped()
  },
  methods: {
    /**
     * Подключаем группировку дом нод событий при пересечении.
     * */
    setupGroupingOverlapped () {
      let elems = document.querySelectorAll('.events-group__events')

      for (let i = 0; i < elems.length; i++) {
        if (elems[i].children.length) {
          for (let j = 0; j < elems[i].children.length; j++) {
            if (elems[i].children[j + 1] !== undefined &&
              this.isOverlapping(elems[i].children[j], elems[i].children[j + 1])) {
              elems[i].childNodes[j].classList.add('overlapped')
              elems[i].childNodes[j + 1].classList.add('overlapped')
            } else if (elems[i].children[j + 1] === undefined) {
              /**
               * Показываем последний перекрытый
               * */
              if (elems[i].children[j - 1] !== undefined) {
                elems[i].children[j - 1].classList.add('last')
                elems[i].children[j - 1].classList.toggle('active')
              }
            }
          }
        }
      }

      // let activeSel = document.querySelector('.active .event_nav')
      // console.log('>>>>',activeSel)
      // if (activeSel !== null && activeSel.length) {
      //   activeSel.forEach(div => div.addEventListener('click', function () {
      //     console.log('WORKKKK')
      //   }))
      // }
    },
    /**
     * Функция проверяет, пересекаются ли дом элементы визуальными границами
     * */
    isOverlapping (e1, e2) {
      if (e1.length && e1.length > 1) {
        e1 = e1[0]
      }
      if (e2.length && e2.length > 1) {
        e2 = e2[0]
      }
      var rect1 = e1 instanceof Element ? e1.getBoundingClientRect() : false
      var rect2 = e2 instanceof Element ? e2.getBoundingClientRect() : false

      // window.console ? console.log(rect1, rect2) : null
      var overlap = null
      if (rect1 && rect2) {
        overlap = !(
          rect1.right < rect2.left ||
          rect1.left > rect2.right ||
          rect1.bottom < rect2.top ||
          rect1.top > rect2.bottom
        )
        return overlap
      } else {
        // window.console ? console.warn('Please pass native Element object') : null
        return overlap
      }
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
     * Генерируем часы с датой для каждой ячейки
     * */
    generateHours (day) {
      return generateHours(day)
    },
    /**
     * Создаем уникальный индекс для ячейки часа
     * */
    updatedIndex: function (dayIndex, index) {
      return Number(dayIndex.toString() + index.toString())
    }
  }
}
</script>
<style lang="less" scoped>
  .hours{
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .events-group{
    &__body{
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    &__hours{
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    &__events{
      position: absolute;
      height: 100%;
      width: 100%;
    }
    .overlapped{
      display: none;
      &.active{
        display: inline-block;
      }
      &.active /deep/ .event_nav{
        display: inline-block;
      }
    }
  }
</style>
