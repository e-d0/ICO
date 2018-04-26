<template>
  <div    @dragover.prevent=""
          @dragenter.prevent="dragenter"
          @drop="onDrop">
    <span v-if="checkForDateObj(hour)">{{ dateFormat(hour) }}</span>
    <span v-else>{{ hour }}</span>

    <event v-if="details.length"
           v-for="(item) in details"
           :key="item.id"
           :item="item"
           :type="item.type"
           :itemRender="itemRender"
           @item-dragstart="dragItem"
           :date="date"></event>
  </div>

</template>

<script>
import event from './itemEvent'
import moment from 'moment'
import { EventBus, isSameDay } from './eventbus'
import Vuex from 'vuex'
const storeEvent = Vuex.createNamespacedHelpers('event')

/**
 * Приводим дату в соотетствие с форматом в браузере пользователя
 * */
const locale = window.navigator.userLanguage || window.navigator.language
moment.locale(locale)

export default {
  name: 'Hour',
  data () {
    return {
      volume: 0,
      expanded: false
    }
  },
  components: { event },
  props: {
    date: Date,
    hour: Date,
    index: Number,
    itemRender: Function
  },
  methods: {
    checkForDateObj (hour) {
      /**
       * Проверяем входящий формат времени: объект или строка.
       */
      return typeof hour !== 'string'
    },
    dateFormat (date) {
      return moment(date).format('H:mm')
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
    details () {
      /**
       * проверка, совпадает ли дата события и дата объекта ячейки
       * //TODO Раскоментировать краткое выражение перед сдачей
       * */
      // return this.events.length ? this.events.filter(item => isSameDay(item.date, this.date)) : []
      if (this.filteredEvents.length) {
        // console.log('dateail length true', this.events.filter(item => isSameDay(item.date, this.date)))
        // console.log('dateal length true')
        return this.filteredEvents.filter(item => isSameDay(item.date, this.date))
      } else {
        return []
      }
    }
  }
}
</script>

<style lang="less" >
</style>
