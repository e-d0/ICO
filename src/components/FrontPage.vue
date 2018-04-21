<template>
  <div class="container">
    <div class="header">
      <span>header</span>
    </div>
    <div class="row">
        <div class="col-md-4">
            <div class="row">
              <div class="col-md-12">
                <scheduler-calendar></scheduler-calendar>
              </div>
              <div class="col-md-12 mt-4">
                <schedulerFilter :events="events" @change="filterEvents"></schedulerFilter>
              </div>
            </div>
        </div>
        <div class="col-md-12">
            <scheduler-main :dates.sync="dates"
                            :events="filteredEventsStorage"></scheduler-main>
        </div>
    </div>
  </div>
</template>

<script>
import { EventBus, countDiffBetweenDates } from './eventbus'
import moment from 'moment'
import schedulerFilter from './schedulerFilter'

export default {
  name: 'FrontPage',
  components: { schedulerFilter },
  data () {
    return {
      dates: null,
      events: [],
      filteredEventsStorage: []
    }
  },
  methods: {
    /**
     * //TODO Корректный алгоритм Фильтрации событий по данным из schedulerFilter
     * */
    filterEvents (types, name) {
      let arr = this.events.filter((event) => {
        if ((name !== ('' || null)) === event.name) {
          return true
        }

        if (types.includes(event.type)) {
          return true
        }
      })
      this.filteredEventsStorage = arr
    },
    sendDates (item) {
      // this.$emit('update:dates', item)
      this.dates = item
      console.log('front page dates', item)
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
    }
  },
  created () {
    /**
     * Обработчик глобального события
     */
    EventBus.$on('dates', this.sendDates)
    EventBus.$on('update-events', this.getEvents)
    EventBus.$on('event-dragend', this.changeDate)
  },
  mounted () {
    this.getEvents()
  },
  destoryed () {
    EventBus.$off()
  },
  computed: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
