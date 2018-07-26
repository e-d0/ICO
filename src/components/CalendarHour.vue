<template>
  <div   v-bind:class="['prevent-drag','timeline_event', {'multistack': isMulti }]">
    <span v-if="!checkForDateObj(hour)">{{ hour }}</span>
    <!--<span v-else>{{ hour }}</span>-->

    <template v-if="checkCurrentEvent()">

      <event   :class="[{ 'last':isLastElem() }]"
               :style="{ zIndex: 1+currentEvent.toString() }"
               :item="allEvents[currentEvent.toString()]"
               :type="allEvents[currentEvent.toString()].type"
               :index="countEvents()"
               v-on:update:current="nextEvent()"
               :date="date"
               :multi="isMulti"></event>
      </template>

  </div>

</template>

<script>
import event from './itemEvent'
import { EventBus } from './eventbus'
import Vuex from 'vuex'
import FormAddEvent from './formAddEvent'
import modal from './modalBody'

const storeEvent = Vuex.createNamespacedHelpers('event')

export default {
  name: 'Hour',
  data () {
    return {
      volume: 0,
      expanded: false,
      showModalForm: false,
      currentEvent: 0
    }
  },
  components: { event, formAdd: FormAddEvent, modalForm: modal },
  props: {
    date: Date,
    hour: Date,
    index: Number,
    events: Array
  },
  methods: {
    /**
     * Проверка, есть ли выбранный элемент в массиве событий
     * */
    checkCurrentEvent () {
      if (this.allEvents[this.currentEvent.toString()] === undefined) {
        this.currentEvent = 0
        return this.allEvents[this.currentEvent.toString()]
      } else {
        return this.allEvents[this.currentEvent.toString()]
      }
    },
    /**
     * Проверка текущего индекса событий
     * */
    countEvents () {
      let counter = parseInt(this.allEvents.length - (this.currentEvent + 1))
      return counter === 0 ? parseInt(this.allEvents.length - 1).toString() : counter.toString()
    },
    /**
     * Проверка на последний элемент
     * */
    isLastElem () {
      return this.currentEvent + 1 === this.allEvents.length
    },
    /**
     * Переключатель счетчика
     * */
    nextEvent () {
      if (this.currentEvent < this.allEvents.length - 1) {
        this.currentEvent++
      } else {
        this.currentEvent = 0
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
     * @click="showAddForm()" Вызываем форму "добавить событие" кликом.Пока отключено за ненадобностью.
     */
    showAddForm (e) {
      EventBus.$emit('call:addEventForm', this.date)
    },
    closeForm (e) {
      console.log(e)
      console.log('click HOUR')
    },
    /**
     * Проверяем входящий формат времени: объект или строка.
     */
    checkForDateObj (hour) {
      return typeof hour !== 'string'
    },
    dateFormat (date) {
      return this.$moment(date).format('H:mm')
    }
  },
  computed: {
    ...storeEvent.mapGetters({
      filteredEvents: 'filteredEvents'
    }),
    /**
     * Проверка - событий в клете часа не одно
     * */
    isMulti: function () {
      if (this.allEvents !== undefined && this.allEvents.length) return this.allEvents.length > 1
    },
    /**
     * Массив событий для отрисовки
     * */
    allEvents () {
      return this.events !== undefined ? this.sortedDates(this.events) : []
    }
  },
  created () {}
}
</script>

<style lang="less" >
</style>
