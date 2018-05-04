<template>
  <div class="events-filter">
    <form id="filter" autocomplete="off">
      <fieldset>
        <legend class="dropdown" v-b-toggle="'collapse1'">ФИЛЬТР СОБЫТИЙ</legend>
        <b-collapse id="collapse1">
          <multiselect class="" type="text"
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
                <span></span>
            </template>
          </multiselect>

          <div class="multiselect__tags-wrap">
            <template v-for="(item, index) in chosenNamesStorage" >
              <span class="badge badge-success _custom" :key="index">
                    <span class="custom__remove" v-on:click.prevent="removeEventName(item)">❌</span>
                    <span class="badge__name">{{ item.name}}</span>
                  </span>
            </template>
          </div>

          <ul class="choosing-form_list">
            <li v-for="(item,index) in types" :key="index">
              <label class="checkbox" :for="'name-'+index">
                <input type="checkbox"
                       :value="item.code"
                       :id="'name-'+index"
                       :checked="isChecked(item.name)"
                       v-model="checkedTypesStorage">
                <span :class=[item.code]>{{item.name}}</span>
              </label>
              <span>{{itemCount(item)}}</span>
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
  name: 'schedulerFilter',
  components: { multiselect },
  props: {
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
      filteredEvents: 'filteredEvents',
      /**
       * Получаем элементы фильтра по имени из vuex хранилища напрямую.
       * */
      chosenNamesStorage: 'getFiltersNames'
    }),
    ...storeEvent.mapState(['filters', 'events'])
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
            this.checkedTypesStorage.push(response.data[i].code)
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
      if (this.filteredEvents !== undefined) {
        let count = 0
        this.filteredEvents.filter((event) => {
          if (!event.type.match(type.code)) {
            return
          }
          count++
        })
        return count
      }
    }
  },
  created () {
  },
  mounted: function () {
    this.getTypes()
  },
  watch: {
    checkedTypesStorage: function (newVal, oldVal) {
      this.$store.dispatch({
        type: 'event/setFiltersTypes',
        val: newVal
      })
    },
    chosenNamesStorage: function (newVal, oldVal) {
      console.log('<><><><><><><><', newVal, oldVal)
    }
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
  span.multiselect__option.multiselect__option--highlight:after,
  span.multiselect__option.multiselect__option--highlight{
    background: @accent-color!important;
  }

  .multiselect{
    margin-bottom: 16px;
    &__tags-wrap,
    &__tags{
      -webkit-box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.15);
      box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.15);
      border-color: #c3c3c3;
    }
  }
  .badge._custom{
    padding: 5px;
    margin: 2px;
    font-size: 12px;
  }
  .custom__remove{
    cursor: pointer;
    font-size: 9px;
  }
  .filter {
    margin-top: 32px;
    .events-filter {
      padding: 20px 24px 0px;
      border-top: 4px solid #c5d0de;
      box-shadow: 0 2px 4px rgba(51, 51, 51, 0.1);
      border-radius: 4px;
      background-color: #ffffff;
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
            right: 5px;
            top: 7px;
          }
        }
        .choosing-form_list {
          margin-top: 12px;
          li {
            display: flex;
            margin-bottom: 5px;
            label {
              span {
                color: #333f52;
                z-index: 0;
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
    .current-events {
      margin-top: 28px;
      margin-bottom: 36px;
      padding: 20px 24px;
      border-top: 4px solid #5bb0d5;
      box-shadow: 0 2px 4px rgba(51, 51, 51, 0.1);
      border-radius: 4px;
      background-color: #fafbfc;
      h3 {
        margin-bottom: 18px;
        color: #525c6c;
        font-size: 14px;
        font-weight: 700;
        line-height: 18px;
        letter-spacing: 1.3px;
        text-transform: uppercase;
      }
      .radio-buttons {
        margin-bottom: 18px;
      }
      &_item {
        margin-top: 20px;
        &-data {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3px;
          border: 1px solid #e0e6ed;
          a {
            margin-top: 2px;
            color: #1991eb;
            font-family: @main-font;
            font-size: 12px;
            font-weight: 400;
            line-height: 12px;
            text-decoration: underline;
            &:hover {
              text-decoration: none;
            }
          }
        }
        &-name {
          color: #333f52;
          font-family: @main-font;
          font-size: 14px;
          font-weight: 500;
          line-height: 16px;
          white-space: nowrap;
        }
        &-event {
          padding: 3px 4px 2px;
          color: #ffffff;
          font-family: @main-font;
          font-size: 11px;
          font-weight: 700;
          line-height: 11px;
          text-transform: uppercase;
          letter-spacing: 0.28px;
          white-space: nowrap;
          &--pre-ico {
            background-color: @pre-ico;
          }
          &--KYC {
            background-color: @KYC;
          }
          &--ending-ico {
            background-color: @ending-ico;
          }
          &--white-list {
            background-color: @white-list;
          }
          &--start-ico {
            background-color: @start-ico;
          }
        }
        &-time {
          color: #525c6c;
          font-family: @main-font;
          font-size: 12px;
          font-weight: 400;
          line-height: 12px;
          white-space: nowrap;
        }
        &-time-remain {
          color: #707986;
          font-family: @main-font;
          font-size: 11px;
          font-weight: 400;
          line-height: 11px;
          white-space: nowrap;
        }
      }
    }
  }
</style>
