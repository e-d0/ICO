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

export default {
  name: 'modalAddEvent',
  data () {
    return {
      form: {
        name: null,
        starts: moment().format('YYYY-MM-DDTkk:mm'),
        ends: moment().format('YYYY-MM-DDTkk:mm'),
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
      return this.$http.get('http://localhost:3000/type').then(response => {
        this.types = response.body
      }, error => {
        console.error(error)
      })
    },
    submitForm () {
      /**
       * //TODO Add Validation process
       * */

      let body = this.form
      body.created_at = moment().format('YYYY-MM-DD HH:mm Z')
      body.updated_at = moment().format('YYYY-MM-DD HH:mm Z')
      body.starts = moment(this.form.starts).format('YYYY-MM-DD HH:mm Z')
      body.ends = moment(this.form.ends).format('YYYY-MM-DD HH:mm Z')

      console.log('event created', body)
      return this.$http.post(`http://localhost:3000/events`, body).then(response => {
        console.log(response)
      }, error => {
        console.error(error)
      })
    }
  },
  created () {
    this.getTypes()
  }
}
</script>

<style scoped>

</style>
