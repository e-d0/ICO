<template>
  <div class="events-filter">
    <form id="filter" autocomplete="off">
      <fieldset>
        <div class="form-group">
        <legend class="dropdown">ФИЛЬТР СОБЫТИЙ</legend>
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
                  <span class="badge badge-pill badge-success">
                    <span>{{ props.option.name }}</span>
                    <span class="custom__remove" @click="props.remove(props.option)">❌</span>
                  </span>
          </template>
        </multiselect>

        <ul class="choosing-form_list">
          <li v-for="(item,index) in types" :key="index">
            <label class="checkbox" :for="'name-'+index">
              <input type="checkbox"
                     :value="item.name"
                     :id="'name-'+index"
                     :checked="isChecked(item.name)"
                     v-model="checkedTypesStorage">
              <span class="white-list">{{item.name}}</span>
            </label>
            <span>{{itemCount(item)}}</span>
          </li>
        </ul>
      </div>
      </fieldset>
      <!-- /.fieldset -->
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
      if (this.filteredEvents !== undefined) {
        let count = 0
        this.filteredEvents.filter((event) => {
          if (!event.type.match(type.name)) {
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

<style lang="less" >
  @import "../assets/less/vars";

  .events {
    margin-top: 32px;
    .events-filter {
      padding: 20px 24px 8px;
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
          li {
            display: flex;
            margin-bottom: 5px;
            label {
              span {
                color: #333f52;
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
