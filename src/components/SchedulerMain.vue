<template>
  <div class="cd-schedule">
    <modalAddEvent></modalAddEvent>
    <modal v-if="showModal">
      <div slot="body">
        Вы хотите перенсти дату события?
      </div>
      <div slot="footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="confirmRequest()" >Отмена</button>
        <button type="button" class="btn btn-primary" @click="confirmRequest('confirm')">Изменить дату</button>
      </div>
    </modal>
    <div class="month">
      <itemWeek :events="events"
                :itemRender="itemRender"
                :dates="dates"></itemWeek>
    </div>
  </div>
</template>

<style lang="less" >

</style>

<script>
import moment from 'moment'
import itemWeek from './itemWeek'
import { EventBus, countDiffBetweenDates } from './eventbus'
import modal from './modalConfirm'
import modalAddEvent from './modalAddEvent'

export default {
  name: 'Schedule',
  components: { itemWeek, modal, modalAddEvent },
  props: {
    dates: null
  },
  data () {
    return {
      eventTempStorage: null,
      dateTempStorage: null,
      showModal: false,
      moment: moment,
      dragItem: null,
      events: {
        type: Array,
        // eslint-disable-next-line vue/require-valid-default-prop
        default: []
      },
      itemRender (item) {
        const h = this.$createElement
        return h('span', 'CustomRender：' + item.name)
      }
    }
  },
  methods: {
    openModal () {
      this.showModal = true
    },
    closeModal () {
      this.showModal = false
    },
    cellDragenter (e, date, type, index) {
      console.log('cellDragenter', this.dragItem)
      this.$emit('event-dragenter', e, this.dragItem, date)
    },
    itemDragstart (e, item, date, type) {
      console.log('scheduler main itemdragstart')
      this.dragItem = item
      console.log('itemdragstart Func', this.dragItem)
      this.$emit('event-dragstart', e, item, date)
    },
    confirmRequest (message) {
      this.closeModal()
      if (message) {
        this.itemDrop(this.eventTempStorage, this.dateTempStorage)
      } else {
        this.eventTempStorage = null
        this.dateTempStorage = null
      }
    },
    confirmDialog (e, date) {
      /**
       * Триггерим запуск формы и сохраняем данные из события.
       * */
      this.openModal()
      this.eventTempStorage = e
      this.dateTempStorage = date
    },
    itemDrop (e, date) {
      if (!this.dragItem) return
      console.log('[event-dragend]:', this.dragItem, date)
      // this.$emit('event-dragend', e, this.dragItem, date)
      this.changeDate(e, this.dragItem, date)
      console.log('item drop func')
    },
    itemClick (e, item) {
      console.log('[event-click]:', item)
      this.$emit('event-click', e, item)
    },
    dateClick (e, date) {
      console.log('[date-click]:', date)
      this.$emit('date-click', e, date)
    },
    getDates (items) {
      this.$emit('update:dates', items)
    },
    changeDate (e, item, date) {
      /**
       * Находим индекс элемента в текущем массиве событий
      * */
      const updateIndex = this.events.findIndex(ele => ele.id === item.id)
      /**
       * Считаем разницу
       * */
      const diff = countDiffBetweenDates(this.events[updateIndex].starts, this.events[updateIndex].ends)
      /**
       * Формируем json объект для отправки на сервер
       * */
      let body = {
        'id': item.id,
        'name': item.name,
        'created_at': item.created_at,
        'updated_at': moment().format('YYYY-MM-DD HH:mm Z'),
        'starts': moment(date.setMinutes(item.date.getMinutes())).format('YYYY-MM-DD HH:mm Z'),
        'ends': moment(date.setMinutes(item.date.getMinutes())).add(diff).format('YYYY-MM-DD HH:mm Z'),
        'type': item.type
      }
      console.log('date changed', body)
      return this.$http.patch(`http://localhost:3000/events/${item.id}`, body).then(response => {
        this.getEvents()
      }, error => {
        console.error(error)
      })
    },
    getEvents () {
      /**
       * Получаем события с сервера
       * */
      return this.$http.get('http://localhost:3000/events').then(response => {
        this.events = response.body
        /**
         * Создаем поле начала события в каждом объекте события и приводим к формату Date
         * */
        this.events = this.events.map(item => {
          item.date = new Date(item.starts)
          return item
        })
      }, error => {
        console.error(error)
      })
    }
  },
  created () {
    EventBus.$on('item-dragstart', this.itemDragstart)
    EventBus.$on('cell-dragenter', this.cellDragenter)
    EventBus.$on('item-drop', this.confirmDialog)
    EventBus.$on('item-click', this.itemClick)
    EventBus.$on('date-click', this.dateClick)
    // EventBus.$on('dates', this.getDates)
    EventBus.$on('event-dragend', this.changeDate)
    console.log('dates at scheduler main', this.dates)
  },
  mounted () {
    this.getEvents()
  },
  watch: {
    acceptedDates: function () {
      return this.dates
    }
  },
  destoryed () {
    EventBus.$off()
  }
}
</script>
