<template>
  <form id="filter" class="border m-2 p-2" autocomplete="off">

    <autocomplete :events="events" @input="setFilterValue"></autocomplete>

    <div class="form-check text-left" v-for="(item,index) in types" :key="index">
      <input class="form-check-input"
             type="checkbox"
             :value="item.name"
             :checked="isChecked(item.name)"
             :id="'name-'+index"
             v-model="checkedTypesStorage"
             @change="updateInput">
      <label class="form-check-label col-md-12" :for="'name-'+index">
        {{item.name}} <div class="float-right">{{itemCount(item)}}</div>
      </label>
    </div>
    <p>A list of names that check: {{checkedTypesStorage.join(', ')}}</p>
  </form>
</template>

<script>
import autocomplete from './autocomplete'

export default {
  name: 'schedulerFilter',
  components: { autocomplete },
  props: {
    events: null,
    value: {
      type: String
    }
  },
  data () {
    return {
      form: {
        name: '',
        type: null
      },
      types: null,
      // events: {
      //   type: Array,
      //   // eslint-disable-next-line vue/require-valid-default-prop
      //   default: []
      // },
      checkedTypesStorage: [],
      checkedByDefault: true,
      filterByNameStorage: []
    }
  },
  methods: {
    setFilterValue (val) {
      this.filterByNameStorage = val
      this.$emit('change', this.checkedTypesStorage, this.filterByNameStorage)
      console.log('autocomplete name filter', this.filterByNameStorage)
    },
    /**
     * Получаем типы событий с сервера
     * */
    getTypes () {
      return this.$http.get('http://localhost:3000/type').then(response => {
        this.types = response.body
        this.fillDefault()
      }, error => {
        console.error(error)
      })
    },
    onInput (e) {
      console.log(e)
      // this will be called on change of value
    },
    updateInput (item, event) {
      // console.log('prop item', item, event.target.checked)
      // let isChecked = event.target.checked
      // let acceptedItemObj = {}
      // acceptedItemObj[item.name] = event.target.checked
      // this.$emit('change', this.checkedTypesStorage)
      this.$emit('change', this.checkedTypesStorage, this.filterByNameStorage)
      console.log('checked type storage', this.checkedTypesStorage ,this.filterByNameStorage)
    },
    /**
     * Простая проверка: есть ли в массиве выбранных элементов
     * */
    isChecked (item) {
      return this.checkedTypesStorage.includes(item)
    },
    /**
     * Считаем количество событий по типу
     * */
    itemCount (type) {
      let count = 0
      this.events.filter((event) => {
        if (!event.type.match(type.name)) {
          return
        }
        count++
      })
      return count
    },
    /**
     * Заполняем массив по умолчанию, если проставлен флаг
     * */
    fillDefault () {
      if (this.checkedByDefault) {
        for (let i = 0; i < this.types.length; i++) {
          let name = this.types[i].name
          this.checkedTypesStorage.push(name)
        }
      }
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
    this.getTypes()
    this.$emit('change', this.checkedTypesStorage, this.filterByNameStorage)
  }
}
</script>

<style scoped>

</style>
