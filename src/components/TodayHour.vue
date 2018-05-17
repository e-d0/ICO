<template>
  <div    @dragover.prevent=""
          @dragenter.prevent="dragenter"
          @drop="onDrop"
          v-bind:class="['prevent-drag','timeline_event']"
          :draggable="false">
    <span v-if="!checkForDateObj(hour)">{{ hour }}</span>
    <!--<span v-else>{{ hour }}</span>-->

      <template v-if="details.length">
        <event v-for="(item) in details"
               :style="{ zIndex: 1 }"
               :key="item.id"
               :item="item"
               :type="item.type"
               :itemRender="itemRender"
               @item-dragstart="dragItem"
               :date="date"></event>
      </template>

  </div>

</template>

<script>
import event from './itemEvent'
import moment from 'moment'
import { EventBus, isSameDay } from './eventbus'
import Vuex from 'vuex'
import FormAddEvent from './formAddEvent'
import modal from './modalBody'

const storeEvent = Vuex.createNamespacedHelpers('event')

/**
   * Приводим дату в соотетствие с форматом в браузере пользователя
   * */
const locale = window.navigator.userLanguage || window.navigator.language
moment.locale(locale)

export default {
  name: 'TodayHour',
  data () {
    return {
      volume: 0,
      expanded: false,
      showModalForm: false,
      actual: true
    }
  },
  components: { event, formAdd: FormAddEvent, modalForm: modal },
  props: {
    date: Date,
    hour: Date,
    index: Number,
    itemRender: Function
  },
  computed: {
    ...storeEvent.mapGetters({
      actualEvents: 'actualEvents',
      pastEvents: 'pastEvents'
    }),
    details () {
      /**
       * проверка, совпадает ли дата события и дата объекта ячейки
       * //TODO Раскоментировать краткое выражение перед сдачей
       * */
      if ((this.filteredEvents() !== undefined && this.filteredEvents().length) && this.filteredEvents().length) {
        return this.sortedDates(this.filteredEvents().filter(item => isSameDay(item.date, this.date)))
      } else {
        return []
      }
    }
  },
  watch: {
    actual: function () {
      this.filteredEvents()
    }
  },
  methods: {
    /**
     * Возвращает события из хранилища в зависимости от запроса
     * */
    filteredEvents () {
      return this.actual ? this.actualEvents(this.moment()) : this.pastEvents(this.moment())
    },
    switchEvents (val) {
      this.actual = (val === 'true')
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
  created () {
    /**
     * На событии из фильтра вызываем функцию
     * */
    EventBus.$on('filter:event', this.switchEvents)
  }
}
</script>

<style lang="less" >
</style>
