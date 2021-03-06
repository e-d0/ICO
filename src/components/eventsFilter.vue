<template>
  <div class="events-filter">
    <form id="filter" autocomplete="off">
      <fieldset>
        <legend class="dropdown" v-b-toggle="'formEventsFilter'">{{ $t('form.eventFilterTitle') }}</legend>
        <b-collapse id="formEventsFilter" visible>
          <ul class="choosing-form_list">
            <li v-for="(item,index) in types" :key="index">
              <template v-if="item.code !== 'ico'">
              <label class="checkbox" :for="'name-'+index">
                <input type="checkbox"
                       :value="item.code"
                       :id="'name-'+index"
                       :checked="isChecked(item.name)"
                       v-model="checkedTypesStorage">
                <span :class=[item.code]>{{item.name}}</span>
              </label>
              <span>{{itemCount(item)}}</span>
              </template>
            </li>
          </ul>
        </b-collapse>
      </fieldset>
    </form>
  </div>
</template>

<script>
import multiselect from 'vue-multiselect'
import Vuex from 'vuex'
const storeEvent = Vuex.createNamespacedHelpers('event')

export default {
  name: 'eventsFilter',
  components: { multiselect },
  props: {
    actual: Boolean
  },
  data () {
    return {
      form: {
        names: null,
        type: null
      },
      checkedByDefault: true,
      checkedTypesStorage: [],
      filteredEventsStorage: []
    }
  },
  computed: {
    ...storeEvent.mapGetters({
      events: 'events',
      filteredEvents: 'filteredEvents',
      /**
       * Получаем элементы фильтра по имени из vuex хранилища напрямую.
       * */
      chosenNamesStorage: 'getFiltersNames',
      actualEvents: 'actualEvents',
      pastEvents: 'pastEvents'
    }),
    ...storeEvent.mapState(['events']),
    names: {
      get () {
        return this.$store.getters['event/filters'].names
      }
    },
    types: {
      get () {
        /**
         * Удаляем лишний тип события ICO из массива типов.
         * */
        let typesArr = this.$store.getters['event/types']
        return typesArr.filter(
          type => { if (type.code !== 'ICO') return type }
        )
      }
    }
  },
  watch: {
    checkedTypesStorage: function (newVal, oldVal) {
      this.$store.dispatch({
        type: 'event/setFiltersTypes',
        val: newVal
      })
    }
  },
  methods: {
    dropDown () {

    },
    /**
     * Удаляем элемент фильтра по имени из vuex хранилища.
     * */
    removeEventName (item) {
      this.$store.dispatch({
        type: 'event/removeFiltersNames',
        item
      })
    },
    /**
     * Привязываем значения input имени к хранилищу vuex.
     * */
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
            if (response.data[i].code !== 'ICO') this.checkedTypesStorage.push(response.data[i].code)
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
      let events = this.events
      if (events !== undefined) {
        let count = 0
        events.filter((event) => {
          if (event.category.match(type.code)) {
            count++
          } else if (event.category === 'ico' && event.type.match(type.code)) {
            count++
          } else {

          }
        })
        return count
      }
    }
  },
  created () {
  },
  mounted: function () {
    this.getTypes()
  }
}
</script>
<!-- New step!vue-multiselect
     Add Multiselect CSS. Can be added as a static asset or inside a component. -->
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="less">
  @import "../assets/less/vars";
  .dropdown {
    cursor: pointer;
    &::before {
      content: "";
      position: absolute;
      width: 8px;
      height: 4px;
      background-image: @img-arrow-top;
      background-position: center;
      background-repeat: no-repeat;
      z-index: 11;
    }
    &.collapsed{
      &::before {
        transform: rotate(180deg);
      }
    }
  }
  #formEventsFilter span.multiselect__option.multiselect__option--highlight:after,
  #formEventsFilter span.multiselect__option.multiselect__option--highlight{
    background: @accent-color!important;
  }

  .multiselect{
    margin-bottom: 16px;
    &__tags{
      -webkit-box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.15);
      box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.15);
      border-color: #c3c3c3;
    }
  }
  .badge._custom{
    padding: 5px;
    margin: 2px;
    border-radius: 2px;
    height: 20px;
    color: #ffffff;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.28px;
  }
  .custom__remove{
    cursor: pointer;
    font-size: 15px;
    width: 12px;
    height: 12px;
    display: inline-block;
    vertical-align: middle;
    position: relative;
    top: -2px;

  }
  .filter {
    margin-top: 32px;
    max-width: 284px;
    .events-filter {
      padding: 24px 24px 0px;
      border-top: 4px solid #c5d0de;
      box-shadow: 0 2px 4px rgba(51, 51, 51, 0.1);
      border-radius: 4px;
      background-color: #ffffff;
      font-family: @condenced;
      font-weight: bold;
      letter-spacing: 1.3px;
      form {
        legend {
          margin-bottom: 20px;
          color: #525c6c;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          line-height: 18px;
          letter-spacing: 1.3px;
        }
        .dropdown {
          &::before {
            right: 0px;
            top: 7px;
          }
        }
        .choosing-form_list {
          /*margin-top: 12px;*/
          margin-bottom: 9px;
          li {
            display: flex;
            margin-bottom: 5px;
            label {
              span {
                color: #333f52;
                z-index: 0;
                padding-left: 24px;
              }
            }
            span {
              margin-left: auto;
              color: #8f96a1;
              font-family: @main-font;
              font-size: 14px;
              font-weight: 400;
              line-height: 19px;
            }
          }
        }
      }
    }
  }
</style>
