
<template>
    <div class="events-group">

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
</template>
<script>
import CalendarHour from './CalendarHour'
import {generateHours, isSameOnlyDate} from './eventbus'
import Vuex from 'vuex'
import moment from 'moment'
const storeEvent = Vuex.createNamespacedHelpers('event')
export default {
  name: 'ClendarDayItem',
  components: {CalendarHour},
  props: {
    dayInd: {},
    dayItem: {}
  },
  data () {
    return {
      moment: this.$moment,
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
      filteredEvents: 'filteredEvents',
      dates: 'dates',
      groupedByHoursWithEvents: 'groupedByHoursWithEvents'
    })
  },
  watch: {
    filteredEvents: function (newVal, oldVal) {
      this.eventsStorage = newVal
    }
  },
  methods: {
    /**
     * Генерируем часы с датой для каждой ячейки
     * */
    generateHours (day) {
      return generateHours(day)
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
     * Фильтр по текущему дню
     * */
    filteredByDayEvents: function (date) {
      return this.eventsStorage.filter(item => isSameOnlyDate(item.date, date))
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
     * Сортировка массива дат
     * */
    sortedDates (arrEvents) {
      return arrEvents.sort((obj1, obj2) => {
        if (obj1.date > obj2.date) return -1
        if (obj1.date < obj2.date) return 1
        return 0
      })
    }
  }
}
</script>
<style lang="less" scoped>

</style>
