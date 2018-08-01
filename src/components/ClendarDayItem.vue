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
                <div :class="['timeline_event']">
                  <span v-if="!checkForDateObj(hour)">{{ hour }}</span>
                </div>
              </div>
          </div>
          <div class="events-group__events">
            <event v-for="(event, index) in groupedEvents"
                   :key="index"
                   :ref="`event-${event.id}-${event.type}`"
                   :item="event"
                   :type="event.type"
                   :date="(new Date(event.date))"
                   :group="event.group ? (event.group).toString() : null"
                   :groupIndex="event.groupIndex ? (event.groupIndex).toString() : null"
                   v-on:show:next:event="nextEvent"
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
      groupedByDayEvents: 'groupedByDayEvents'
    }),
    groupedEvents () {
      if (this.dayItem && this.events) {
        let event = JSON.parse(JSON.stringify(this.sortedDates(this.groupedByDayEvents(this.dayItem))))
        return this.groupedByHoursWithEvents(event)
      }
    }
  },
  watch: {
    // filteredEvents: function (newVal, oldVal) {
    //   this.eventsStorage = newVal
    // }
  },
  mounted () {
    /**
     * Группировка при создании компонента
     * */
    // this.setupGroupingOverlapped()
    /**
     * При изменении дат из фильтра, запускаем группировку событий
     * */
    // this.$store.watch((state) => state.event.events, () => this.groupedEvents)
  },
  methods: {
    groupedByHoursWithEvents (events) {
      let group = 1
      let groupIndex = 1
      for (let i = 0; i < events.length; i++) {
        let event = events[i]
        let nextEvent = events[i + 1]
        /**
         * Разгица в минутах, при которой группируются события
         * */
        let diff = 45
        /**
         * Если разница между текущим и следующим меньше diff минут,то сгруппируй
         * */
        /**
         * Проверка на разницу в час элемент следующей группы и текущий проверяемый час
        */

        // var duration = moment.duration(event.date.diff(nextEvent.date)).asMinutes()

        // duration = duration.asMinutes()
        let check = nextEvent !== undefined &&
                    moment.duration(moment(nextEvent.date).diff(moment(event.date))).asMinutes() <= diff
        if (check) {
          console.log('START 2',
            event.date,
            nextEvent.date,
            check,
            moment.duration(moment(nextEvent.date).diff(moment(event.date))).asMinutes(),
            diff)
          event['group'] = group
          event['groupIndex'] = groupIndex
          nextEvent['group'] = group
          groupIndex++
          nextEvent['groupIndex'] = groupIndex
          // console.log('CHECK YES', groupIndex)
        } else {
          // console.log('CHECK FALSE')
          groupIndex = 1
          group++
        }
      }
      return events
    },
    onLoadEvent (e) {
      if (e.previousSibling !== undefined && this.isOverlapping(e, e.previousSibling)) console.log('YES')
    },
    /**
     * Проверяем входящий формат времени: объект или строка.
     */
    checkForDateObj (hour) {
      return typeof hour !== 'string'
    },
    /**
     * Подключаем группировку по дата атрибуту DOM нод событий при пересечении элементов в верстке.
     * */
    async setupGroupingOverlapped () {
      let elems = document.readyState ? document.querySelectorAll('.events-group__events') : false
      /**
       * Получаем все группы событий( в нашем случае 1 группа = 1 день)
       * */
      for (const item of elems) {
        await this.grouperFunc(item)
      }
    },
    // grouperFunc (item) {
    //   console.log('start')
    //   let count = item.children.length
    //   let j = 0
    //   while (j < count) {
    //     let el = item.children[j]
    //     let nextEl = item.children[j + 1]
    //     if (nextEl !== undefined && this.isOverlapping(el, nextEl)) {
    //       if (el.dataset.overlapGroup === undefined) {
    //         /**
    //            * Присваимваем группу и активный класс
    //            * */
    //         console.log()
    //         el.classList.toggle('active')
    //         el.dataset.overlapGroup = j
    //         el.querySelector('.event_nav').dataset.overlapGroupIndex = 0
    //         // nextEl.dataset.overlapGroup = j
    //         // nextEl.querySelector('.event_nav').dataset.overlapGroupIndex = 1
    //       } else {
    //         // nextEl.dataset.overlapGroup = el.dataset.overlapGroup
    //         // nextEl.querySelector('.event_nav').dataset.overlapGroupIndex = parseInt(el.querySelector('.event_nav').dataset.overlapGroupIndex) + 1
    //         nextEl.classList.toggle('last')
    //       }
    //     }
    //     j++
    //   }
    // },
    nextEvent (e) {
      let elem = e.target.closest('.event')
      if (
        elem.nextSibling.dataset.overlapGroup !== undefined &&
        elem.nextSibling !== undefined
      ) {
        elem.classList.toggle('active')
        elem.nextSibling.classList.toggle('active')
      } else {
        for (let i = 0; i < elem.parentElement.childNodes.length; i++) {
          if (elem.parentElement.childNodes[i].dataset.overlapGroup === elem.dataset.overlapGroup) {
            elem.classList.toggle('active')
            elem.parentElement.childNodes[i].classList.toggle('active')
            break
          }
        }
      }
    },
    /**
     * Функция проверяет, пересекаются ли дом элементы в верстке
     * */
    isOverlapping (e1, e2) {
      if (e1.length && e1.length > 1) {
        e1 = e1[0]
      }
      if (e2.length && e2.length > 1) {
        e2 = e2[0]
      }
      let rect1 = e1 instanceof Element ? e1.getBoundingClientRect() : false
      let rect2 = e2 instanceof Element ? e2.getBoundingClientRect() : false

      let overlap = null
      if (rect1 && rect2) {
        overlap = !(
          rect1.right < rect2.left ||
          rect1.left > rect2.right ||
          rect1.bottom < rect2.top ||
          rect1.top > rect2.bottom
        )
        return overlap
      } else {
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
  /deep/ .event[data-overlap-group]{
    visibility: hidden;
    opacity: 0;
    transform: scaleY(0);
    transition: scaleY 0.25s ease-in-out, opacity 0.25s ease-in-out;
    &.active{
      visibility: visible;
      transform: scaleY(1);
      opacity: 1;
      .event_nav{
        display: inline-block;
        &::before{content: attr(data-group-index);}
      }
    }
  }
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
    /*.overlapped{*/
      /*display: none;*/
      /*&.active{*/
        /*display: inline-block;*/
      /*}*/
    /*}*/
  }
</style>
