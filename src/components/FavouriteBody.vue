<template>
    <div class="content">
        <div class="ico-favourite">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-3">
                        <div class="ico-favourite_title">
                            <h1>{{ $t('favourite.favorite_ico') }}</h1>
                        </div>
                    </div>
                    <!-- /.col-3 -->
                    <div class="col-9">
                        <div class="ico-catalogue_nav">
                            <ul class="ico-catalogue_nav-wrapper">
                                <li v-for="(status,index) in statusArray" :key="index" :class="['ico-catalogue_nav-item', { 'ico-catalogue_nav-item--active': selectedStatus === status }]">
                                  <button @click.prevent="selectedStatus = status">{{ $t(`favourite.${status.name}`) }}</button>
                                </li>
                            </ul>
                           <div class="portfolio-view_filter">
                            <template v-if="currencies" >
                              <label v-for="item in currencies" :key="item.id">
                                <input name="portfolio-filter-usd"
                                       :class="[ {'selected' : item === currencyStorage } ]"
                                       :value="item"
                                       type="radio"
                                       v-model="currencyStorage"
                                       @change="setCurrentCurrency(currencyStorage)">
                                <b>{{ item.ticker }}</b>
                              </label>
                            </template>
                          </div>
                            <!-- /.portfolio-view_filter -->

                            <div class="ico-catalogue_select">
                                <select size="1" name="name[]" v-model="selectedSort">
                                    <option  v-for="(item, index) in sortArray" :key="index" :value="item.value"><span>{{ item.name }}</span></option>
                                </select>
                            </div>
                        </div>
                        <!-- /.ico-catalogue_nav -->
                    </div>
                    <!-- /.col-9 -->
                </div>
                <!-- /.row -->
                <div class="row">
                    <div class="col">
                        <div class="ico-favourite_list" v-if="icoSort(filteredICO())">
                          <template v-for="(ico, index) in icoSort(filteredICO())">
                            <component :key="index" :ico="ico" v-bind:is="selectedStatus.component"></component>
                          </template>
                            <!-- /.ico_item -->
                        </div>
                        <!-- /.ico-catalogue_list -->
                    </div>
                    <!-- /.col -->
                </div>
                <!-- /.row -->
            </div>
            <!-- /.container-fluid -->
        </div>
        <!-- /.ico-favourite -->
    </div>
</template>
<script>
import Vuex from 'vuex'
import FavouriteIcoItemActive from './FavouriteIcoItemActive'
import FavouriteIcoItemEnded from './FavouriteIcoItemEnded'
import FavouriteIcoItemTrading from './FavouriteIcoItemTrading'
import FavouriteIcoItemUpcoming from './FavouriteIcoItemUpcoming'
const storePortfolio = Vuex.createNamespacedHelpers('portfolio')
const storeEvent = Vuex.createNamespacedHelpers('event')
export default {
  name: 'FavouriteBody',
  components: {FavouriteIcoItemActive, FavouriteIcoItemUpcoming, FavouriteIcoItemEnded, FavouriteIcoItemTrading},
  data () {
    return {
      currencyStorage: null,
      statusArray: [
        {
          name: 'active',
          value: ['active'],
          component: 'FavouriteIcoItemActive'
        },
        {
          name: 'upcoming',
          value: ['upcoming'],
          component: 'FavouriteIcoItemUpcoming'
        },
        {
          name: 'ended',
          value: ['canceled', 'completed'],
          component: 'FavouriteIcoItemEnded'
        },
        {
          name: 'trading',
          value: ['trading'],
          component: 'FavouriteIcoItemTrading'
        }
      ],
      selectedStatus: null,
      sortArray: [
        {
          name: 'Hard CAP',
          value: 'hard_cap'
        },
        {
          name: 'Token Price',
          value: 'ico_price'
        },
        {
          name: 'Market Price',
          value: 'market_price'
        },
        {
          name: 'Rating',
          value: 'rating'
        }
      ],
      selectedSort: null
    }
  },
  computed: {
    ...storePortfolio.mapGetters({
      getCurrencyByTicker: 'getCurrencyByTicker',
      currencies: 'currencies',
      currentCurrency: 'currentCurrency'
    }),
    ...storeEvent.mapGetters({
      ICO: 'ICO'
    })
  },
  methods: {
    icoSort (items) {
      let arr = items.slice()
      let sortValue = this.selectedSort
      arr.sort((a, b) => {
        if (a[sortValue] < b[sortValue]) {
          return 1
        }
        if (a[sortValue] > b[sortValue]) {
          return -1
        }
        return 0
      })
      return arr
    },
    filteredICO () {
      return this.ICO.filter(ico => this.selectedStatus.value.includes(ico.status))
    },
    ...storePortfolio.mapActions(['setCurrentCurrency']),
    setInitCurrency () {
      this.$store.dispatch('portfolio/getCurrencies').then((response) => {
        /**
         * Заполняем массив по умолчанию
         * */
        let defaultCurrency = this.getCurrencyByTicker('USD')
        if (defaultCurrency) {
          this.currencyStorage = defaultCurrency
          this.setCurrentCurrency(defaultCurrency)
        }
      }, error => {
        console.log(error)
      })
    },
    /**
     * Получаем ICO
     * */
    async getICO () {
      await this.$store.dispatch('event/getICO')
    }
  },
  created () {
    this.selectedStatus = this.statusArray['0']
    this.selectedSort = this.sortArray['0'].value
    this.getICO()
    this.setInitCurrency()
  }
}
</script>
<style lang="less" scoped>

    @import "../assets/less/vars";
    .portfolio-view {
      margin-top: 32px;
      &_filter {
        display: flex;
        label {
          text-align: center;
          margin-bottom: 0;
          .selected + b{
            background: #44af36;
            color: #fff;
            text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
          }
          &:first-child {
            b {
              border-radius: 2px 0 0 2px;
            }
          }
          &:last-child {
            b {
              border-radius: 0 2px 2px 0;
            }
          }
          input[type=radio] {
            display: none;
            position: relative;
            top: 2px;
          }
          b {
            cursor: pointer;
            display: block;
            padding: 12px 12px 11px;
            margin-left: -1px;
            color: #525c6c;
            background-color: #fff;
            border: 1px solid #c5d0de;
            font-family: @medium;
            font-weight: 500;
            font-size: 11px;
            line-height: 12px;
          }
        }
      }
      &_public {
        display: flex;
        align-items: center;
        margin-top: 30px;
        padding-left: 28px;
        a {
          position: relative;
          color: #333f52;
          font-family: @main-font;
          font-weight: 400;
          font-size: 14px;
          line-height: 18px;
          &::before {
            content: "";
            position: absolute;
            width: 20px;
            height: 16px;
            left: -30px;
            top: -1px;
            background-image: @img-www;
            background-position: center;
            background-repeat: no-repeat;
            z-index: 11;
          }
        }
      }
      &_toggle{
        margin-left: auto;
      }
    }

    .ico-favourite {
      &_title {
        padding: 32px 0;
        h1 {
          color: #333f52;
          font-family: @medium;
          font-size: 20px;
          font-weight: 500;
          line-height: 18px;
          /* Text style for "Favourite" */
          letter-spacing: -0.07px;
        }
      }
      .ico-catalogue_nav {
        margin-bottom: 0;
        padding: 32px 0;
        &-wrapper {
          margin-right: 20px;
        }
        .portfolio-view_filter {
          margin-left: auto;
          margin-right: 64px;
        }
      }
    }
    .ico-catalogue {
      margin-top: 39px;
      &_nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        &-wrapper {
          display: flex;
        }
        &-item {
          button {
            display: inline-block;
            padding: 10px 27px 8px 27px;
            box-shadow: 0 2px 0 #c5d0de;
            background-color: #ffffff;
            border: none;
            border-right: 1px solid #c5d0de;
            color: #525c6c;
            font-family: @main-font;
            font-size: 14px;
            font-weight: 400;
            line-height: 18px;
            text-transform: capitalize;
            cursor: pointer;
            outline: none;
          }
          &:first-child {
            button {
              border-radius: 4px 0 0 4px;
            }
          }
          &:last-child {
            button {
              border-radius: 0 4px 4px 0;
              border-right: none;
            }
          }
          &--active {
            button {
              box-shadow: 0 2px 0 #3e9532, inset 0 2px 4px rgba(1, 1, 1, 0.3);
              text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.2);
              color: #fff;
              font-weight: 700;
              background-color: @accent-color;
            }
          }
        }
      }
      &_select {
        position: relative;
        select {
          padding: 10px 32px 8px 12px;
          color: #707986;
          font-family: @main-font;
          font-size: 14px;
          font-weight: 400;
          line-height: 16px;
          box-shadow: 0 1px 0 #c5d0de;
          border-radius: 0 4px 4px 0;
          border: 1px solid #c5d0de;
          background-color: #ffffff;
          cursor: pointer;
          outline: none;
        }
        &::before {
          content: "";
          position: absolute;
          width: 40px;
          height: 36px;
          box-shadow: 0 1px 0 #c5d0de;
          border-radius: 4px 0 0 4px;
          border: 1px solid #c5d0de;
          background-color: #ffffff;
          left: -39px;
          top: 0px;
          background-image: @img-topic-select-icon;
          background-position: 50% 50%;
          background-repeat: no-repeat;
        }
        &::after {
          content: "";
          position: absolute;
          width: 8px;
          height: 4px;
          right: 16px;
          top: 17px;
          background-image: @img-select-arrow;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 11;
        }
      }
      &_ico-amount {
        margin-bottom: 7px;
        span {
          margin-bottom: 7px;
          color: #333f52;
          font-family: @main-font;
          font-size: 14px;
          font-weight: 400;
          line-height: 18px;
        }
      }
      &_tags-wrapper {
        margin-bottom: 24px;
      }
      &_tag {
        display: inline-block;
        padding: 1px 9px 1px 6px;
        border-radius: 2px;
        border: 1px solid @accent-color;
        background-color: #7cc772;
        a {
          display: inline-block;
          text-indent: -9999px;
          font-size: 11px;
          font-weight: 500;
          line-height: 14px;
          width: 12px;
          height: 12px;
          background-image: @img-cross;
          background-position: 50% 50%;
          background-repeat: no-repeat;
        }
        span {
          color: #ffffff;
          font-family: @main-font;
          font-size: 11px;
          font-weight: 500;
          line-height: 12px;
          font-weight: 500;
        }
      }
    }

</style>
