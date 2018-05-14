<template>
  <div id="app">
    <tplHeader></tplHeader>
      <div class="container-fluid">
        <div class="wrapper__clendar">

                <div class="left-col">
                    <div class="filter">
                      <scheduler-calendar></scheduler-calendar>
                      <schedulerFilter></schedulerFilter>
                      <button class="sync_btn">Sync ICO Calendar</button>
                    </div>
                </div>
                <div class="right-col">
                    <scheduler-main v-if="filteredEvents"
                                    :itemRender.sync="itemRender"
                                    :dates="dates"
                                    :events="filteredEvents"></scheduler-main>
                </div>

        </div>
    </div>
    <tplFooter></tplFooter>
  </div>
</template>

<script>
import tplHeader from './TheHeader'
import tplFooter from './TheFooter'
import theEvent from './TheEvent'
import { EventBus, countDiffBetweenDates } from './eventbus'
import schedulerFilter from './schedulerFilter'
import SchedulerMain from './SchedulerMain'
import SchedulerCalendar from './SchedulerCalendar'
import Vuex from 'vuex'
const storeEvent = Vuex.createNamespacedHelpers('event')

export default {
  name: 'FrontPage',
  components: { schedulerFilter, SchedulerMain, SchedulerCalendar, tplHeader, tplFooter, theEvent },
  data () {
    return {
      itemRender (item, index, multi) {
        const h = this.$createElement
        return h(theEvent, { props: {
          item, index, multi
        } })
      }
    }
  },
  computed: {
    ...storeEvent.mapGetters({
      events: 'events',
      filteredEvents: 'filteredEvents',
      dates: 'dates'
    })
  },
  methods: {
    /**
     * Получаем события с сервера через хранилище store
     * */
    getEvents () {
      this.$store.dispatch('event/getEvents')
    },
    changeDate (e, item, date) {
      console.log('item to cHANGE <<<<<<', item)
      /**
       * Находим индекс элемента в текущем массиве событий
       * */
      const updateIndex = this.events.findIndex(ele => ele.id === item.id)
      /**
       * Считаем разницу
       * */
      const diff = countDiffBetweenDates(this.events[updateIndex].starts, this.events[updateIndex].ends)
      /**
       * Формируем json объект для отправки на сервер. Все даты в ISO 8601. (https://en.wikipedia.org/wiki/ISO_8601)
       * */
      let body = {
        'id': item.id,
        'name': item.name,
        'created_at': this.$moment(item.created_at).toISOString(),
        'updated_at': this.$moment().toISOString(),
        'starts': this.$moment(date.setMinutes(item.date.getMinutes())).toISOString(),
        'ends': this.$moment(date.setMinutes(item.date.getMinutes())).add(diff).toISOString(),
        'type': item.type
      }
      console.log('date changed', body)

      return this.$store.dispatch({
        type: 'event/changeEvent',
        value: body
      })
    }
  },
  created () {
    /**
     * Обработчик глобального события
     */
    EventBus.$on('update-events', this.getEvents)
    // EventBus.$on('filter:change', this.filterEvents)
    EventBus.$on('event-dragend', this.changeDate)
    this.getEvents()
  },
  mounted () {
  },
  destoryed () {
    EventBus.$off()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import "../assets/less/vars";
  #app{
    overflow: hidden;
  }
  .wrapper__clendar{
    display: flex;
    flex-direction: row;
    .left-col{
      position: relative;
      max-width: 25%;
      width: 100%;
      min-height: 1px;
      padding-right: 15px;
      padding-left: 15px;
    }
    .right-col{
      position: relative;
      max-width: 98%;
      width: 98%;
      min-height: 1px;
      padding-right: 15px;
      padding-left: 15px;
    }
  }
  .sync_btn{
    margin-top: 24px;
    width: 159px;
    height: 40px;
    border-radius: 4px;
    border: 1px solid #c5d0de;
    background-color: #ffffff;
    position: relative;
    color: #45af37;
    font-size: 14px;
    font-weight: 500;
    line-height: 14px;
    letter-spacing: -0.07px;
    padding-bottom: 4px;
    &::before{
      content: "";
      position: relative;
      display: inline-block;
      margin-right: 8px;
      top: 2px;
      width: 12px;
      height: 16px;
      background-image: @img-sync;
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
    }
  }
</style>
