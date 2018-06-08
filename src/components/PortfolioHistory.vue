<template>
  <div class="portfolio_history">
    <h3>{{ $t('portfolio.change_history') }}</h3>
    <ul v-if="operations" class="history_items">
      <li v-for="(operation, index) in operations" :key="index" :class="[`history_item history_item--${operation.type}`]">
        <div class="history_item-data">
          <span class="history_item-name" v-if="operation.coin_id">{{ getCoinByID(operation.coin_id).title }}</span>
          <span class="history_item-amount">
            <template v-if="operation.type !== 'swapped'">
              {{operation.type === 'sold' ? '-' : '+' }}{{ operation.quantity }} <small> {{ getCoinByID(operation.coin_id).ticker }}</small>
              (<span class="history_item-amount-usd" v-html="currencyConverter(operation.price_per_coin , currentCurrency.ticker)"></span>)
            </template>
            <template v-else>
              {{ operation.quantity }} <small>{{ getCoinByID(operation.coin_id).ticker }}</small>(<span class="history_item-amount-usd" v-html="( currencyConverter(operation.price_per_coin , currentCurrency.ticker) )"> </span>) - {{countSwapped(operation)}} <small> {{ getCoinByID(operation.deal_currency).ticker }}</small>
            </template>

            </span>
          <span class="history_item-time"> {{ $t(`portfolio.${operation.type}`) }} {{ moment(operation.date).fromNow() }}</span>
        </div>
      </li>
      <!-- /.history-item -->
    </ul>
    <!-- /.history-items -->
  </div>
  <!-- /.portfilio_history -->
</template>

<script>
import Vuex from 'vuex'
const storeEvent = Vuex.createNamespacedHelpers('portfolio')
export default {
  name: 'PortfolioHistory',
  props: {
    portfolio: Object
  },
  computed: {
    operations: function () {
      let arr = JSON.parse(JSON.stringify(this.portfolio.coin))
      let tempOperations = []
      for (let i = 0; i < arr.length; i++) {
        arr[i].operations.filter(item => {
          item.coin_id = arr[i].id
        })
        tempOperations = [...tempOperations, ...arr[i].operations]
      }
      return tempOperations
    },
    ...storeEvent.mapGetters({
      getCoinByID: 'getCoinByID',
      currencyConverter: 'currencyConverter',
      getCurrencyByTicker: 'getCurrencyByTicker',
      currentCurrency: 'currentCurrency'
    })
  },
  methods: {
    /**
     * Сортировка массива дат. 1я ближайшая
     * */
    sortedDates (arrEvents) {
      return arrEvents.sort((obj1, obj2) => {
        if (obj1.date > obj2.date) return -1
        if (obj1.date < obj2.date) return 1
        return 0
      })
    },
    countSwapped (operation) {
      let count = (operation.price_per_coin * operation.quantity) / operation.price_per_coin_swapped
      let decimals = 4
      return Number(Math.round(count + `e${decimals}`) + `e-${decimals}`)
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/less/vars";
  .portfolio_history {
    padding: 20px 24px;
    margin-top: 40px;
    box-shadow: 0 2px 4px rgba(51, 51, 51, 0.1);
    border-radius: 4px;
    background-color: #fafbfc;
    border-top: 4px solid #c5d0de;
    h3 {
      margin-bottom: 20px;
      color: #707986;
      font-size: 14px;
      font-family: @main-font;
      font-weight: 700;
      line-height: 18px;
      text-transform: uppercase;
      letter-spacing: 1.3px;
    }
    .history_items {
    }
    .history_item {
      position: relative;
      padding-left: 25px;
      margin-bottom: 12px;
      margin-right: 15px;
      &::before {
        content: "";
        position: absolute;
        width: 17px;
        height: 17px;
        left: 0px;
        top: -1px;
        background-position: center;
        background-repeat: no-repeat;
        z-index: 11;
      }
      &--sold {
        .history_item-amount {
          color: #ff3657;
        }
        &::before {
          background-image: @img-sold;
        }
      }
      &--bought {
        .history_item-amount {
          color: @accent-color;
        }
        &::before {
          background-image: @img-bought;
        }
      }
      &--swapped {
        .history_item-amount {
          color: #1991eb;
        }
        &::before {
          background-image: @img-swapped;
        }
      }
      &-data {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 60%;
      }
      &-name {
        color: #525c6c;
        font-family: @main-font;
        font-weight: 500;
        font-size: 14px;
        line-height: 16px;
      }
      &-amount {
        display: flex;
        align-items: center;
        color: #333f52;
        font-family: @main-font;
        font-weight: 500;
        font-size: 16px;
        line-height: 16px;
        text-transform: uppercase;
        small {
          padding:0 4px;
          font-size: 12px;
          letter-spacing: -0.2px;
        }
        &-usd {
          margin-left: 6px;
          color: #8f96a1;
          font-family: @main-font;
          font-weight: 500;
          font-size: 12px;
          line-height: 12px;
          letter-spacing: -0.15px;
        }
      }
      &-time {
        color: #707986;
        font-family: @main-font;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
      }
      &-restore {
        color: @main-color;
        font-family: @main-font;
        font-weight: 400;
        font-size: 12px;
        line-height: 12px;
        text-decoration: underline;
      }
    }
  }
</style>
