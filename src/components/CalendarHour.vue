<template>
  <div    @dragover.prevent=""
          @dragenter.prevent="dragenter"
          @drop="onDrop"
          v-bind:class="['prevent-drag','timeline_event', {'multistack': isMulti }]"
          :draggable="false">
    <span v-if="!checkForDateObj(hour)">{{ hour }}</span>
    <!--<span v-else>{{ hour }}</span>-->

    <template v-if="checkCurrentEvent()">

      <event   :class="[{ 'last':isLastElem() }]"
               :style="{ zIndex: 1+currentEvent.toString() }"
               :item="allEvents[currentEvent.toString()]"
               :type="allEvents[currentEvent.toString()].type"
               :index="countEvents()"
               @item-dragstart="dragItem"
               v-on:update:current="nextEvent()"
               :date="date"
               :multi="isMulti"></event>
      </template>

  </div>

</template>

<script>
import event from './itemEvent'
import { EventBus, isSameDay } from './eventbus'
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
    index: Number
  },
  methods: {
    checkCurrentEvent () {
      if (this.allEvents[this.currentEvent.toString()] === undefined) {
        this.currentEvent = 0
        return this.allEvents[this.currentEvent.toString()]
      } else {
        return this.allEvents[this.currentEvent.toString()]
      }
    },
    countEvents () {
      let counter = parseInt(this.allEvents.length - (this.currentEvent + 1))
      return counter === 0 ? parseInt(this.allEvents.length - 1).toString() : counter.toString()
    },
    isLastElem () {
      return this.currentEvent + 1 === this.allEvents.length
    },
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
    },
    dragenter (e) {
      if (this.$el.contains(e.target)) {
        this.$emit('highlight', this.index)

        if (this.$el === e.target) {
          EventBus.$emit('cell-dragenter', e, this.date, this.type, this.index)
        }
      }
    },
    dragItem (e, item, date, type) {
      this.$emit('highlight', this.index)
      EventBus.$emit('item-dragstart', e, item, date, type)
    },
    onDrop (e) {
      this.$emit('highlight', -1)
      EventBus.$emit('item-drop', e, this.date, this.type, this.index)
      console.log('item dropped')
    }
  },
  computed: {
    ...storeEvent.mapGetters({
      filteredEvents: 'filteredEvents'
    }),
    isMulti: function () {
      if (this.allEvents !== undefined && this.allEvents.length) return this.allEvents.length > 1
    },
    allEvents () {
      /**
       * проверка, совпадает ли дата события и дата объекта ячейки
       * //TODO Раскоментировать краткое выражение перед сдачей
       * */
      if ((this.filteredEvents !== undefined && this.filteredEvents.length) && this.filteredEvents.length) {
        return this.sortedDates(this.filteredEvents.filter(item => isSameDay(item.date, this.date)))
      } else {
        return []
      }
    }
  },
  created () {}
}
</script>

<style lang="less" >
</style>
