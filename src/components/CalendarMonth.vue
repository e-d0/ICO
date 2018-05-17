<template>
  <div>

  <div class=" calendar--body">
    <div v-if="generateMonth()" class="events__month">
      <div  class="events__month--header-days" >
        <div v-for="(day, index) in generateMonth()[0].days" :key="index">{{ moment(day.date).format('ddd')}}</div>
      </div>

      <div class="calendar">
        <div v-for="(week, index) in generateMonth()" :key="index" class="calendar__week">

          <div v-for="(day, ind) in week.days" :key="ind" class="calendar__day ">
            <div :class="checkDate(moment(day.date))">{{ moment(day.date).format('D') }}</div>

            <template v-if="day.events.length">
              <calendar-month-event :events="day.events">
              </calendar-month-event>
            </template>

          </div>
        </div>
      </div>

    </div>
  </div>

  </div>
</template>

<script>
import CalendarMonthEvent from './CalendarMonthEvent'
import Vuex from 'vuex'
const storeEvent = Vuex.createNamespacedHelpers('event')
export default {
  name: 'CalendarMonth',
  components: { CalendarMonthEvent },
  data () {
    return {
      itemsPerGroup: 3
    }
  },
  computed: {
    ...storeEvent.mapGetters({
      events: 'events'
    })
  },
  methods: {
    /**
     * Проверям дату и добавляем ей соответствующий класс
     * */
    checkDate (date) {
      let classes = []
      if (this.moment(date).isSame(this.moment(), 'day')) {
        classes.push('today')
      }
      if (!this.moment(date).isSame(this.moment(), 'month')) {
        classes.push('not-current-month')
      }
      if (date.diff(this.moment(), 'days') < 0) {
        classes.push('past')
      }
      classes.push('day--label')

      return classes
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
     * Разбиваем события на группы
     * */
    splitByGroup (arr) {
      let group = []
      let n = this.itemsPerGroup

      for (let i = 0, j = 0; i < arr.length; i++) {
        if (i >= n && i % n === 0) { j++ }
        group[j] = group[j] || []
        group[j].push(arr[i])
      }
      return group
    },
    /**
     * Фильтрация события по дате
     * */
    filteredEventsByDay (date) {
      return this.sortedDates(
        this.events.filter(event => {
          if (this.moment(date).isSame(event.date, 'day')) {
            return event
          }
        })
      )
    },
    /**
     * creating a custom calendar with moment using days weeks
     * */
    generateMonth () {
      const startDay = this.moment().clone().startOf('month').startOf('week')
      const endDay = this.moment().clone().endOf('month').endOf('week')

      let calendar = []
      /**
       * end of year error fix https://stackoverflow.com/questions/25631682/moment-js-thinks-that-2013-12-31-is-week-1-not-week-53
       * */
      let date = startDay.clone().subtract(1, 'day')
      /**
       * заполняем массив понедельно объектами { дата, событие }
       * */
      while (date.isBefore(endDay, 'day')) {
        calendar.push({
          days: Array(7).fill(0).map(() => {
            let itemDate = date.add(1, 'day').clone()
            return {
              date: itemDate,
              events: this.splitByGroup(this.filteredEventsByDay(itemDate))
            }
          })
        })
      }
      return calendar
    }
  },
  created () {
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/less/vars";
  .events__month{
    width: 100%;
    flex-basis: 100%;
    box-shadow: 0 4px 4px rgba(51, 51, 51, 0.1);
    border-radius: 8px;
    background-color: #ffffff;
    overflow-x: auto;
    &--header-days{
      display: flex;
      justify-content: flex-start;
      width: 100%;
      flex-basis: 100%;
      z-index: 1;
      div{
        color: #9499a8;
        font-family: 'Roboto', sans-serif;
        font-size: 12px;
        font-weight: 400;
        line-height: 14px;
        text-transform: capitalize;
        width: 100%;
        padding: 16px;
        border-left: 1px solid #E0E6ED;
        box-sizing: border-box;
        background: #fafbfc;
        position: relative;
        min-width: 128px;
        /*border-top-left-radius: 8px;*/
        /*border-top-right-radius: 8px;*/
        &:after{
          content: '';
          position: absolute;
          bottom: 0px;
          left: 0;
          width: 100%;
          height: 5px;
          z-index: 1;
          -webkit-box-shadow: 0px 4px 5px rgb(236, 236, 236);
          box-shadow: 0px 4px 5px rgb(236, 236, 236);
        }
        :first-child{
          border-left: none;
        }
      }
    }
    .calendar{
      background-color: #fff;
      border-radius: 8px;
      &__week{
        display: flex;
        justify-content: flex-start;
        width: 100%;
      }
      &__week:last-child .calendar__day {
        border-bottom: 1px solid #ddd;
      }
      &__week:first-child .calendar__day {
        border-top: none;
      }
      &__day{
        overflow: hidden;
        font-weight: 700;
        width: 100%;
        height: 132px;
        min-width: 128px;
        padding: .5rem 0;
        user-select: none;
        cursor: default;
        border-left: 1px solid #E0E6ED;
        border-top: 1px solid #E0E6ED;
        text-align: right;

      }
      &__day:last-child{
        border-right: 1px solid #ddd;
      }
      &__day .day--label{
        font-size: 16px;
        width: 28px;
        height: 28px;
        padding: 3px;
        margin-right: 4px;
        display: inline-block;
        text-align: center;
        position: relative;
        left: 0;
        color: #9499a8;
      }
      &__day .past{
        opacity: .6;
      }
      &__day .not-current-month {
        color: #ddd;
      }
      &__day .today {
        color: #fff;
        border-radius: 14px;
        background-color: #7dc773;
      }
      &__day .active{
          background-color: rgba(255, 238, 173, .4);
      }

    }
  }

</style>
