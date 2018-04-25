<template>
  <form id="filter" class="border m-2 p-2" autocomplete="off">
    <div class="form-group">
      <label class="typo__label">Simple select / dropdown</label>
        <multiselect class="form-control" type="text"
                     :value="filters.names"
                     :options="events"
                     :multiple="true"
                     :close-on-select="false"
                     :clear-on-select="true"
                     :hide-selected="true"
                     :preserve-search="true"
                     placeholder=""
                     label="name"
                     track-by="name"
                     :preselect-first="true"
                     @input="setFiltersNames">
          <template slot="tag" slot-scope="props">
              <span class="custom__tag">
                <span>{{ props.option.name }}</span>
                <span class="custom__remove" @click="props.remove(props.option)">❌</span>
              </span>
          </template>
        </multiselect>
    </div>
    <div class="form-check text-left" v-for="(item,index) in types" :key="index">
      <input class="form-check-input"
             type="checkbox"
             :value="item.name"
             :id="'name-'+index"
             :checked="isChecked(item.name)"
             v-model="checkedTypesStorage">
      <label class="form-check-label col-md-12" :for="'name-'+index">
        {{item.name}} <div class="float-right">{{itemCount(item)}} </div>
      </label>
    </div>
  </form>
</template>

<script>
import multiselect from 'vue-multiselect'
import Vuex from 'vuex'
const storeEvent = Vuex.createNamespacedHelpers('event')

export default {
  name: 'schedulerFilter',
  components: { multiselect },
  props: {
    // value: {
    //   type: String
    // }
  },
  data () {
    return {
      form: {
        name: '',
        type: null
      },
      checkedByDefault: true,
      checkedTypesStorage: []
    }
  },
  computed: {
    ...storeEvent.mapGetters({
      types: 'types',
      filteredEvents: 'filteredEvents'
    }),
    ...storeEvent.mapState(['filters', 'events'])
  },
  methods: {
    ...storeEvent.mapActions(['setFiltersNames']),
    /**
     * Получаем типы событий с сервера через store, используя промис.
     * Заполняем значения чекбоксов по умолчанию
     * */
    getTypes () {
      return this.$store.dispatch('event/getTypes').then((response) => {
        /**
         * Заполняем массив по умолчанию, если проставлен флаг
         * */
        if (this.checkedByDefault) {
          for (let i = 0; i < response.data.length; i++) {
            this.checkedTypesStorage.push(response.data[i].name)
          }
        }
        return response
      }, error => {
        console.log(error)
      })
    },
    /**
     * Простая проверка: есть ли в массиве выбранных элементов
     * */
    isChecked (item) {
      if (this.checkedByDefault) {}
    },
    /**
     * Считаем количество событий по типу
     * */
    itemCount (type) {
      let count = 0
      this.filteredEvents.filter((event) => {
        if (!event.type.match(type.name)) {
          return
        }
        count++
      })
      return count
    }
  },
  created () {
  },
  mounted: function () {
    this.getTypes()
    console.log('mounted')
  },
  watch: {
    checkedTypesStorage: function (newVal, oldVal) {
      this.$store.dispatch({
        type: 'event/setFiltersTypes',
        val: newVal
      })
    }
  }
}
</script>

<style scoped>

</style>
