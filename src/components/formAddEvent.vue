<template>
  <form id="addEvent" @submit="submitForm()">
    <div class="form-group row">
      <label for="name" class="col-2 col-form-label">Название</label>
      <div class="col-10">
        <input class="form-control" type="text" v-model="form.name" id="name" required>
      </div>
    </div>

    <div class="form-group row">
      <label for="starts" class="col-2 col-form-label">Начало события</label>
      <div class="col-10">
        <input class="form-control" type="datetime-local"  id="starts" v-model="form.starts" required>
      </div>
    </div>

    <div class="form-group row">
      <label for="ends" class="col-2 col-form-label">Окончание события</label>
      <div class="col-10">
        <input class="form-control" type="datetime-local"  id="ends" v-model="form.ends" required>
      </div>
    </div>

    <div class="form-group">
      <label for="type">Тип События</label>
      <select class="form-control" id="type" v-model="form.type" required>
        <option v-for="(item,index) in types" :key="index">
          {{ item.name }}
        </option>
      </select>
    </div>

    <button type="submit" class="submit" data-dismiss="modal" aria-label="Submit">
      <span aria-hidden="true">Создать</span>
    </button>

  </form>
</template>

<script>
import moment from 'moment'
import { EventBus } from './eventbus'
/**
 * Приводим дату в соотетствие с форматом в браузере пользователя
 * */
const locale = window.navigator.userLanguage || window.navigator.language
moment.locale(locale)

export default {
  name: 'FormAddEvent',
  props: {
    acceptedDate: Date
  },
  data () {
    return {
      form: {
        name: null,
        starts: this.acceptedDate !== null ? moment(this.acceptedDate).format('YYYY-MM-DDThh:mm') : moment().format('YYYY-MM-DDThh:mm'),
        ends: this.acceptedDate !== null ? moment(this.acceptedDate).format('YYYY-MM-DDThh:mm') : moment().format('YYYY-MM-DDThh:mm'),
        type: null
      },
      types: null
    }
  },
  methods: {
    getTypes () {
      /**
       * Получаем типы событий с сервера
       * */
      return this.$http.get('http://localhost:3000/types').then(response => {
        this.types = response.body
      }, error => {
        console.error(error)
      })
    },
    submitForm () {
      this.$emit('close')
      /**
       * //TODO Add Validation process
       * */
      /**
       * Формируем json объект для отправки на сервер. Все даты в ISO 8601. (https://en.wikipedia.org/wiki/ISO_8601)
       * */
      let body = this.form
      body.created_at = moment().toISOString()
      body.updated_at = moment().toISOString()
      body.starts = moment(this.form.starts).toISOString()
      body.ends = moment(this.form.ends).toISOString()

      console.log('event created', body)
      return this.$http.post(`http://localhost:3000/events`, body).then(response => {
        console.log(response)
        EventBus.$emit('update-events')
      }, error => {
        console.error(error)
      })
    }
  },
  created () {
    this.getTypes()
    this.form.starts = moment(this.acceptedDate).format('YYYY-MM-DDThh:mm')
    this.form.ends = moment(this.acceptedDate).format('YYYY-MM-DDThh:mm')
  }
}
</script>

<style scoped>

</style>
