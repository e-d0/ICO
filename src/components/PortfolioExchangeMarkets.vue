<template>
  <div class="container exchange">
    <div class="exchange_wrapper row">
      <div class="col-md-5">
        <div class="exchange_graph">
          <chart-exchange v-if="exchangeDataset" :chart-id="chartId()" :items = "exchangeDataset"></chart-exchange>
        </div>
      </div>
      <div class="col-md-7">
        <div class="exchange_header row">
          <div class="col-md-4">{{ $t('portfolio.Exchange') }}</div>
          <div class="col-md-2">{{ $t('portfolio.Price') }}</div>
          <div class="col-md-6">{{ $t('portfolio.Volume') }}</div>
        </div>
        <template v-if="tradeMarkets">
          <div v-for="(market, index) in tradeMarkets" :key="index" class="exchange_body row">
            <div class="col-md-4"><img :src="market.icon" alt=""></div>
            <div class="col-md-2"><span><b>$</b> {{ market.price }}</span></div>
            <div class="col-md-6">
              <span><b>$</b> {{ prettifyNumber(market.volume) }}</span>
              <a :href="market.market_url" class="btn btn-trade">Trade</a>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { prettifyNumber, round } from './mathHelpers'
import chartExchange from './chartExchange'
import Vuex from 'vuex'
const storeEvent = Vuex.createNamespacedHelpers('portfolio')
export default {
  name: 'PortfolioExchangeMarkets',
  components: { chartExchange },
  props: {
    coin: Object
  },
  computed: {
    ...storeEvent.mapGetters({
      tradeMarkets: 'tradeMarkets'
    }),
    exchangeDataset: function () {
      if (this.coin !== undefined && this.tradeMarkets.length > 0) {
        let markets = this.tradeMarkets.slice()

        let allMarketsValueByCoin = []
        markets.find(market => {
          market['coins_month_changes'].find(coin => {
            if (coin.coin_id === this.coin.id) {
              /**
               * клонируем массив, чтобы избежать прямой мутации данных
               * из хранилища
               * */
              let changes = coin['month_price_change'].slice()
              /**
               * сортируем по дате и добавляем в массив
               * */
              allMarketsValueByCoin.push(this.sortedByDates(changes))
            } else {
              console.log('no coins at markets was found')
            }
          })
        }
        )
        /**
         * Считаем среднюю цену за день по всем рынкам.
         * Складываем значение цены монеты от каждого рынка за день
         * и делим на количество рынков.
         * */
        let objDataset = {}
        if (allMarketsValueByCoin.length) {
          objDataset['data'] = this.countAveragePriceDayPerMarket(allMarketsValueByCoin)
          objDataset['labels'] = this.getDatesFromArray(allMarketsValueByCoin)
        }
        console.log(objDataset)
        return objDataset
      }
    }
  },
  methods: {
    prettifyNumber (val) {
      return prettifyNumber(val)
    },
    chartId () {
      return `exchangeChart-${this.coin.id}`
    },
    /**
     * Сортировка массива дат. 1я ближайшая
     * */
    sortedByDates (arrEvents) {
      return arrEvents.sort((obj1, obj2) => {
        if (obj1.date > obj2.date) return 1
        if (obj1.date < obj2.date) return -1
        return 0
      })
    },
    /**
     * Считаем среднюю цену за день по всем рынкам.
     * Складываем значение цены монеты от каждого рынка за день
     * и делим на количество записей.
     * */
    countAveragePriceDayPerMarket (allMarketsValueByCoin) {
      let priceArr = []
      for (let i = 0; i < 1; i++) {
        for (let j = 0; j < allMarketsValueByCoin[i].length; j++) {
          let tempPriceStorage = 0
          for (let k = 0; k < allMarketsValueByCoin.length; k++) {
            tempPriceStorage = round(parseFloat(tempPriceStorage) + parseFloat(allMarketsValueByCoin[k][j]['price']), 2)
          }
          let averagePrice = round(tempPriceStorage / allMarketsValueByCoin[i].length, 2)
          priceArr.push(averagePrice)
        }
      }
      return priceArr
    },
    getDatesFromArray (allMarketsValueByCoin) {
      let datesArr = []
      for (let i = 0; i < allMarketsValueByCoin[0].length; i++) {
        datesArr.push(this.$moment(allMarketsValueByCoin[0][i]['date']).format('DD/MM'))
      }
      return datesArr
    },
    async getMarkets () {
      await this.$store.dispatch('portfolio/getTradeMarkets')
    }
  },
  created () {
    this.getMarkets()
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/less/vars";
  .exchange {
    &_wrapper {
      padding: 12px 12px 30px 0px;
    }
    .exchange_graph {
      text-align: left;
      position: relative;
      /*padding-right: 30px;*/
    }
    &_header{
      background-color: #fff;
      border-bottom: 1px solid #e9ecee;
      height: 36px;
      > div {
        color: #525c6c;
        font-family: 'Roboto', sans-serif;
        font-weight: 400;
        font-size: 13px;
        line-height: 36px;
      }
      > div:nth-child(1) {
        text-align: left;
      }
      > div:nth-child(2) {
        text-align: right;
        border-right: 1px solid #e9ecee;
      }
      > div:nth-child(3) {
        text-align: left;
      }
    }
    &_body {
      background-color: #fff;
      &:nth-child(2n-1) {
        background-color: rgba(232, 237, 242, 0.44)
      }
      line-height: 16px;
      > div {
        justify-content: center;
        padding: 12px;
        b {
          font-size: 12px;
          font-weight: normal;
        }
        span{
          color: #707986;
          font-family: 'Roboto', sans-serif;
          font-weight: bold;
          font-size: 16px;
        }
      }
      > div:nth-child(1) {
        text-align: left;
      }
      > div:nth-child(2) {
        text-align: right;
        border-right: 1px solid #e9ecee;
      }
      > div:nth-child(3) {
        span{
          float: left;
        }
      }
    }
    tr.t-foot {
      td {
        padding: 12px 12px 12px 12px;
        color: #707986;
        font-family: @main-font;
        font-weight: 500;
        font-size: 16px;
        line-height: 16px;
        b {
          font-size: 12px;
        }
        &:nth-child(2) {
          text-align: right;
          border-right: 1px solid #e9ecee;
        }
        &:last-child {
          text-align: right;
          padding: 12px 28px 12px 12px;
        }
      }
      &:nth-child(odd) {
        background-color: rgba(232, 237, 242, 0.44);
      }
      &:first-child {
        background-color: #fff;
        border-bottom: 1px solid #e9ecee;
        td {
          color: #525c6c;
          font-family: @main-font;
          font-weight: 400;
          font-size: 13px;
          line-height: 12px;
          &:nth-child(2) {
            text-align: left;
            border-right: none;
          }
          &:nth-child(3) {
            text-align: right;
            border-right: 1px solid #e9ecee;
          }
          &:last-child {
            text-align: left;
          }
        }
      }
      &:last-child {
        background-color: #fff;
        border-bottom: none;
      }
    }
    .btn-trade {
      position: relative;
      padding: 6px 8px 5px 22px;
      background-color: #1991eb;
      text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
      box-shadow: 0 1px 0 #1175c0;
      color: #fff;
      font-size: 11px;
      font-family: @main-font;
      font-weight: 500;
      line-height: 11px;
      &::before {
        content: "";
        position: absolute;
        width: 10px;
        height: 9px;
        left: 7px;
        top: 6px;
        background-image: @img-wallet;
        background-position: center;
        background-repeat: no-repeat;
        z-index: 11;
      }
    }
  }
</style>
