<template>
  <div class="row scheduler">
    <div class="col-md-12 scheduler__controller">
      <button type="button" class="btn btn-primary" @click="showModalAddForm = true">Создать ICO</button>
    </div>
    <div class="col-md-12 scheduler__main">
      <div class="cd-schedule">
        <modal v-if="showModalConfirm">
          <div slot="body">
            Вы хотите перенсти дату события?
          </div>
          <div slot="footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="confirmRequest()" >Отмена</button>
            <button type="button" class="btn btn-primary" @click="confirmRequest('confirm')">Изменить дату</button>
          </div>
        </modal>
        <modal v-if="showModalAddForm">
          <div slot="body">
            <div class="modal-header">
              <h5 class="modal-title"></h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="showModalAddForm = false">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </div>
          <div slot="body">
            <modalAddEvent></modalAddEvent>
            <div ></div>
          </div>
        </modal>
        <div class="month">
          <itemWeek :events.sync="events"
                    :itemRender.sync="itemRender"
                    :dates.sync="dates"></itemWeek>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" >

</style>

<script>
import moment from 'moment'
import itemWeek from './itemWeek'
import { EventBus } from './eventbus'
import modal from './modalConfirm'
import modalAddEvent from './modalAddEvent'
/**
 * Приводим дату в соотетствие с форматом в браузере пользователя
 * */
const locale = window.navigator.userLanguage || window.navigator.language
moment.locale(locale)

export default {
  name: 'Schedule',
  components: { itemWeek, modal, modalAddEvent },
  props: {
    itemRender: Function,
    dates: Array,
    events: Array
  },
  data () {
    return {
      eventTempStorage: null,
      dateTempStorage: null,
      showModalConfirm: false,
      showModalAddForm: false, /** //TODO Закрывать форму на сабмите */
      moment: moment,
      dragItem: null
    }
  },
  methods: {
    openModal () {
      this.showModalConfirm = true
    },
    closeModal () {
      this.showModalConfirm = false
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
      EventBus.$emit('event-dragend', e, this.dragItem, date)
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
    }
  },
  created () {
    EventBus.$on('item-dragstart', this.itemDragstart)
    EventBus.$on('cell-dragenter', this.cellDragenter)
    EventBus.$on('item-drop', this.confirmDialog)
    EventBus.$on('item-click', this.itemClick)
    EventBus.$on('date-click', this.dateClick)
    console.log('dates at scheduler main', this.dates)
  },
  destoryed () {
    EventBus.$off()
  }
}
</script>
