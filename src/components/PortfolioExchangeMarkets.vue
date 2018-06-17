<template>
  <div class="container exchange">
    <div class="exchange_wrapper row">
      <div class="col-md-5">
        <div class="exchange_graph">
          <img src="../assets/img/graph.png" alt="">
        </div>
      </div>
      <div class="col-md-7">
        <div class="exchange_header row">
          <div class="col-md-4">Exchange</div>
          <div class="col-md-2">Price</div>
          <div class="col-md-6">Volume</div>
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
import { prettifyNumber } from './mathHelpers'
import Vuex from 'vuex'
const storeEvent = Vuex.createNamespacedHelpers('portfolio')
export default {
  name: 'PortfolioExchangeMarkets',
  computed: {
    ...storeEvent.mapGetters({
      tradeMarkets: 'tradeMarkets'
    })
  },
  methods: {
    prettifyNumber (val) {
      return prettifyNumber(val)
    }
  },
  created () {
    this.$store.dispatch('portfolio/getTradeMarkets')
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
