<template>
  <div class="donought_wrapper">
    <div class="coin" v-if="coinStorage !== null">
      <span class="coin__percent">{{ totalPercent(coinStorage) }}<b>%</b></span><br>
      <span class="coin__title"><b>{{ coinStorage['title'] }}</b> · {{ coinStorage['ticker'] }}</span><br>
      <span class="coin__totalPrice"><small>$ </small>{{ totalCoinPrice(coinStorage.id) }}</span><br>
      <span :class="['coin__change',`coin__change--${ isPositive (coinStorage['24_change']) }` ]">{{ coinStorage['24_change'] }}%</span>
    </div>
    <chart-donut-portfolio :dataObj="dataObj" :height="300" :width="290"></chart-donut-portfolio>
  </div>
</template>

<script>
import { EventBus } from './eventbus'
import { round } from './mathHelpers'
import chartDonutPortfolio from './chartDonutPortfolio'
import Vuex from 'vuex'
const storeEvent = Vuex.createNamespacedHelpers('portfolio')
export default {
  name: 'donutPortfolioWrapper',
  components: { chartDonutPortfolio },
  data () {
    return {
      coinStorage: null
    }
  },
  props: {
    dataObj: Object,
    portfolio: Object,
    totalCost: null
  },
  methods: {
    isPositive (value) {
      return value > 0 ? 'positive' : 'negative'
    },
    totalPercent (coin) {
      if (this.portfolio.coin && coin !== undefined) {
        let total = 0
        let coinPrice = 0
        for (let index = 0; index < this.portfolio.coin.length; ++index) {
          let item = this.portfolio.coin[index]
          total += this.countValue(item)
          if (this.portfolio.coin[index].id === coin.id) {
            coinPrice = this.countValue(this.portfolio.coin[index])
          }
        }
        let coinPercent = (parseFloat(coinPrice) / parseFloat(total)) * 100
        return coinPercent.toFixed(0)
      }
    },
    /**
     * Считаем стоимость каждой монеты отдельно
     * */
    countValue (item) {
      if (this.getCoinByID(item.id) && item.amount !== undefined) {
        let price = this.getCoinByID(item.id)['market_price']
        if (price) {
          return parseFloat(price) * parseFloat(item.amount)
        }
      }
    },
    /**
     * Общая стоимость монеты в портфолио
     * */
    totalCoinPrice (id) {
      let coinPrice = 0
      for (let index = 0; index < this.portfolio.coin.length; ++index) {
        if (this.portfolio.coin[index].id === id) {
          coinPrice = this.countValue(this.portfolio.coin[index])
        }
      }
      return round(coinPrice, 2)
    },
    donutLabel (coinStorage) {
      return coinStorage
    },
    showCoin (event, val) {
      if (this.coins !== undefined) {
        let coin = JSON.parse(JSON.stringify(this.coins))
        coin = coin.find(item => event === item.ticker)
        if (val) {
          this.coinStorage = coin
        } else {
          if ((this.coinStorage !== null && coin.id === this.coinStorage.id) || event === 'all') {
            this.coinStorage = null
          }
        }
      }
    }
  },
  computed: {
    ...storeEvent.mapGetters({
      coins: 'coins',
      getCoinByID: 'getCoinByID',
      currencyConverter: 'currencyConverter'
    })
  },
  created () {
    EventBus.$on('chart:doughnut:grow', this.showCoin)
  },
  destroyed () {
    EventBus.$off('chart:doughnut:grow', this.showCoin)
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/less/vars";
.donought_wrapper{
  position: relative;
   .coin{
     margin: 0;
     position: absolute;
     top: 50%;
     left: 50%;
     transform: translate(-50%, -50%);
     text-align: center;
       &__percent{
         height: 35px;
         color: #333f52;
         font-size: 30px;
         font-weight: 400;
         letter-spacing: -1px;
         padding-bottom: 10px;
         b{
           font-size: 24px;
           letter-spacing: -1px;
         }
       }
       &__title{
         height: 19px;
         color: #707986;
         font-size: 14px;
         font-weight: 500;
         text-transform: uppercase;
         margin-bottom: 13px;
         display: inline-block;
         b{
           color: #333f52;
           font-size: 16px;
         }
       }
       &__totalPrice{
         height: 24px;
         opacity: 0.75;
         color: #525c6c;
         font-size: 16px;
         font-weight: 500;
         line-height: 12px;
         padding-bottom: 4px;
         small{
           font-size: 12px;
           letter-spacing: -0.05px;
         }
         letter-spacing: -0.05px;

       }
       &__change{
         height: 16px;
         color: rgba(82, 92, 108, 0.6);
         font-size: 10px;
         font-weight: 400;
         line-height: 16px;
         letter-spacing: -0.05px;
         position: relative;
         margin-left: 11px;
         &::before {
           content: "";
           position: absolute;
           width: 8px;
           height: 6px;
           left: -12px;
           top: 3px;
           background-size: cover;
           background-image: @img-triangle-green;
           background-position: center;
           background-repeat: no-repeat;
           z-index: 11;
         }
         &--negative {
             &::before {
               left: -12px;
               top: 3px;
               transform: rotateX(180deg);
               background-image: @img-triengle-red;
             }
         }
       }
   }
}
</style>
