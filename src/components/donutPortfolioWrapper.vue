<template>
  <div class="donought_wrapper">
    <div class="coin" v-if="coinStorage !== null">
      {{ coinStorage['24_change'] }}%
      {{ coinStorage['title'] }} {{ coinStorage['ticker'] }}
      {{ countValuePrice(coinStorage) }}
    </div>
    <chart-donut-portfolio :dataObj="dataObj" ></chart-donut-portfolio>
  </div>
</template>

<script>
import { EventBus } from './eventbus'
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
    countValuePrice (coinStorage) {
      return coinStorage
    },
    showCoin (event) {
      if (this.coins !== undefined) {
        let coins = JSON.parse(JSON.stringify(this.coins))
        coins = coins.find(item => event === item.ticker)
        console.log('WRAPPPPER', coins)
        this.coinStorage = coins
      }
    }
  },
  computed: {
    ...storeEvent.mapGetters({
      coins: 'coins'
    })
  },
  created () {
    EventBus.$on('chart:doughnut:grow', this.showCoin)
  }
}
</script>

<style lang="less" scoped>
.donought_wrapper{
  pos
   .coin{

   }
}
</style>
