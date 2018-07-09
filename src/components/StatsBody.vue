<template>
    <div class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col">
                    <div class="ico-stats">
                        <div class="ico-stats_header">
                            <div class="ico-stats_header-title">
                                <h1>ICO {{ $t('portfolio.Stats') }}</h1>
                                <span>{{ $t('portfolio.Based_on_added') }} ICO</span>
                            </div>
                            <!-- /.ico-stats_header-title -->
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
                        </div>
                        <!-- /.ico-stats_header -->
                    </div>
                    <!-- /.ico-stats -->
                    <table class="ico-stats_table">
                        <tr class="ico-stats_table-header">
                            <th class="ico-stats_table-header-cell ico-stats_table-header-cell--name"><span>{{ $t('portfolio.name') }}</span>
                            </th>
                            <th class="ico-stats_table-header-cell ico-stats_table-header-cell--24h">
                                <span>{{ $t('portfolio.24change') }}</span></th>
                            <th class="ico-stats_table-header-cell ico-stats_table-header-cell--roi"><span>ROI {{ $t('portfolio.since_last_week') }}</span>
                            </th>
                            <th class="ico-stats_table-header-cell ico-stats_table-header-cell--roi"><span>ROI {{ $t('portfolio.since_last_month') }}</span>
                            </th>
                            <th class="ico-stats_table-header-cell ico-stats_table-header-cell--date">
                                <span>ICO {{ $t('portfolio.date') }}</span></th>
                            <th class="ico-stats_table-header-cell ico-stats_table-header-cell--price">
                                <span>ICO {{ $t('portfolio.Price') }}</span></th>
                            <th class="ico-stats_table-header-cell ico-stats_table-header-cell--price"><span>{{ $t('portfolio.Current_price') }}</span>
                            </th>
                        </tr>
                      <template v-if="coins">
                        <tr v-for="(coin, index) in coins" :key="index" class="ico-stats_item">
                            <td class="ico-stats_item-cell ico-stats_item-name ico-stats_item-name--bts">
                                <div class="ico-stats_item-name-wrapper">
                                    <div class="ico-stats_item-logo">
                                      <img :src="coin.icon"
                                           :alt="coin.title">
                                    </div>
                                    <span>{{ coin.title }} · <b>{{ coin.ticker }}</b></span>
                                </div>
                                <small :class="[`tbody--pseudo`]" :style="{backgroundColor: coin.color}"></small>
                            </td>
                            <template v-if="coin.status !== 'ICO'">
                            <td :class="['ico-stats_item-cell','ico-stats_item-24h', `ico-stats_item-24h--${ isPositive (coin['24_change']) }`]">
                                <span v-html="coin['24_change']+'%'"></span>
                            </td>
                            <td :class="['ico-stats_item-cell','ico-stats_item-roi-week', `ico-stats_item-roi-week--${ isPositive (coin['roi_week'])}`]">
                              <span v-html="coin['roi_week']+'%'"></span></td>
                            <td :class="['ico-stats_item-cell','ico-stats_item-roi-week', `ico-stats_item-roi-week--${ isPositive (coin['roi_month'])}`]">
                              <span v-html="coin['roi_month']+'%'"></span></td>
                            </template>
                            <template v-else>
                              <td :class="['ico-stats_item-cell','ico-stats_item-24h']">
                                <span class="status-ico">ICO</span>
                              </td>
                              <td :class="['ico-stats_item-cell','ico-stats_item-roi-week']">
                                <span class="status-ico">ICO</span>
                              </td>
                              <td :class="['ico-stats_item-cell','ico-stats_item-roi-week']">
                                <span class="status-ico">ICO</span>
                              </td>
                            </template>
                            <td class="ico-stats_item-cell ico-stats_item-date"><span>{{ $moment(coin.date).format('d.MM.YY') }}</span></td>
                            <td class="ico-stats_item-cell ico-stats_item-price">
                                <span class="ico-stats_item-price-usd" v-html="currencyConverter( coin.ico_price, currentCurrency.ticker )"></span>
                                <span class="ico-stats_item-price-btc" v-html="currencyConvertUSDToBTC( coin.ico_price)">0.0013603 BTC</span>
                            </td>
                            <td class="ico-stats_item-cell ico-stats_item-current-price">
                                <span class="ico-stats_item-current-price-usd" v-html="currencyConverter( coin.market_price, currentCurrency.ticker )"></span>
                                <span class="ico-stats_item-current-price-btc" v-html="currencyConvertUSDToBTC( coin.market_price)"></span>
                            </td>
                        </tr>
                        <!-- /.ico-stats_item -->
                      </template>
                    </table>
                    <!-- /.ico-stats_table -->
                </div>
                <!-- /.col -->
            </div>
            <!-- /.row -->
        </div>
        <!-- /.container-fluid -->
    </div>
</template>
<script>
import Vuex from 'vuex'
const storeEvent = Vuex.createNamespacedHelpers('portfolio')
export default {
  name: 'StatsBody',
  data () {
    return {
      currencyStorage: null
    }
  },
  computed: {
    ...storeEvent.mapGetters({
      getCoinByID: 'getCoinByID',
      currencyConverter: 'currencyConverter',
      currencyConvertUSDToBTC: 'currencyConvertUSDToBTC',
      currencies: 'currencies',
      getCurrencyByTicker: 'getCurrencyByTicker',
      currentCurrency: 'currentCurrency',
      coins: 'coins'
    })
  },
  methods: {
    ...storeEvent.mapActions(['setCurrentCurrency']),
    isPositive (item) {
      return item > 0 ? 'positive' : 'negative'
    },
    getCoins () {
      this.$store.dispatch('portfolio/getCoins')
    },
    setInitCurrency () {
      this.getCoins()
      this.$store.dispatch('portfolio/getCurrencies').then((response) => {
        /**
         * Заполняем массив по умолчанию, если проставлен флаг
         * */
        let defaultCurrency = this.getCurrencyByTicker('USD')
        if (defaultCurrency) {
          this.currencyStorage = defaultCurrency
          this.setCurrentCurrency(defaultCurrency)
        }
      }, error => {
        console.log(error)
      })
    }
  },
  created () {
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
          input[type=checkbox] {
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
    .tbody--pseudo{
      position: absolute;
      width: 4px;
      height: 100%;
      left: 0px;
      top: 1px;
      //background-color: #bcbdbc;
      z-index: 11;
    }

    .ico-stats {
        &_header {
            padding: 32px 0 26px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            h1 {
                margin-bottom: 4px;
                color: #333f52;
                font-family: @medium;
                font-size: 20px;
                font-weight: 500;
                line-height: 18px;
            }
            span {
                color: #707986;
                font-family: @main-font;
                font-size: 12px;
                font-weight: 400;
                line-height: 20px;
            }
        }
        &_table {
            width: 100%;
            margin-bottom: 52px;
            box-shadow: 0 2px 4px rgba(51, 51, 51, 0.1);
            border-radius: 4px;
            background-color: #fafbfc;
            &-header {
                background-color: #e0e6ed;
                border-bottom: 2px solid #c5d0de;
                &-cell {
                    padding: 14px 12px 12px;
                    border-right: 1px solid #e9ecee;
                    &:last-child {
                        border-right: none;
                    }
                    &--name {
                        padding-left: 21px;
                        width: 22.5%;
                    }
                    &--24h {
                        width: 10.5%;
                        text-align: left;
                      b {
                        padding: 2px 8px 2px;
                        color: #8f96a1;
                        border-radius: 9px;
                        border: 1px solid #8f96a1;
                        font-family: @main-font;
                        font-weight: 700;
                        font-size: 11px;
                        line-height: 11px;
                        text-transform: uppercase;
                      }
                      span {
                        position: relative;
                        margin: auto;
                        color: #707986;
                        font-family: @main-font;
                        font-weight: 400;
                        font-size: 14px;
                        line-height: 16px;
                      }
                      &--negative {
                        span {
                          &::before {
                            left: -4px;
                            top: 0px;
                            transform: rotateX(180deg);
                            background-image: @img-triengle-red;
                          }
                        }
                      }
                    }
                    &--roi {
                        width: 13%;
                        text-align: left;
                    }
                    &--date {
                        width: 15%;
                        text-align: left;
                    }
                    &--price {
                        width: 13%;
                        text-align: left;
                    }
                    span {
                        color: #525c6c;
                        font-family: @main-font;
                        text-transform: capitalize;
                        font-size: 13px;
                        font-weight: 400;
                        line-height: 12px;
                    }
                }
            }
        }
        &_item {
            &:hover {
                background-color: #fff;
                box-shadow: 0 1px 0 #e0e6ed, 0 -1px 0 #e0e6ed;
            }
            &-cell {
                padding: 15px 12px 12px;
                border-right: 1px solid #e9ecee;
                &:last-child {
                    border-right: none;
                }
            }
            &-logo {
                display: inline-block;
                margin-right: 8px;
                width: 24px;
                height: 24px;
                img {
                    width: 100%;
                }
            }
            &-name-wrapper {
                display: flex;
                align-items: center;
            }
            &-name {
                position: relative;
                padding: 0px 10px 0 22px;
                height: 52px;
                span {
                    color: #333f52;
                    font-family: @medium;
                    font-weight: 500;
                    font-size: 14px;
                    line-height: 14px;
                    letter-spacing: -0.2px;
                }
                b {
                    font-family: @medium;
                    font-weight: 500;
                    color: #8f96a1;
                    letter-spacing: -0.2px;
                }
            }
            &-24h,
            &-roi-week,
            &-roi-month {
                b {
                    padding: 2px 8px 2px;
                    color: #8f96a1;
                    border-radius: 9px;
                    border: 1px solid #8f96a1;
                    font-family: @main-font;
                    font-weight: 700;
                    font-size: 11px;
                    line-height: 11px;
                    text-transform: uppercase;
                }
                span {
                    position: relative;
                    margin: auto;
                    padding-left: 18px;
                    color: #707986;
                    font-family: @main-font;
                    font-weight: 400;
                    font-size: 14px;
                    line-height: 16px;
                    &::before {
                        content: "";
                        position: absolute;
                        width: 20px;
                        height: 16px;
                        left: -4px;
                        top: 1px;
                        background-image: @img-triangle-green;
                        background-position: center;
                        background-repeat: no-repeat;
                        z-index: 11;
                    }
                }
                &--negative {
                    span {
                        &::before {
                            left: -4px;
                            top: 0px;
                            transform: rotateX(180deg);
                            background-image: @img-triengle-red;
                        }
                    }
                }
            }
            &-date {
                span {
                    color: #707986;
                    font-family: @medium;
                    font-size: 16px;
                    font-weight: 500;
                    line-height: 16px;
                    letter-spacing: -0.2px;
                }
            }
            &-price,
            &-current-price {
                padding: 12px 12px 0px 12px;
                &-usd {
                    display: block;
                    white-space: nowrap;
                    color: #333f52;
                    font-family: @medium;
                    font-weight: 500;
                    font-size: 16px;
                    line-height: 16px;
                  b, /deep/ b {
                    font-size: 12px;
                  }
                }
                &-btc {
                    opacity: 0.6;
                    color: #8f96a1;
                    font-family: @medium;
                    font-weight: 500;
                    font-size: 9px;
                    line-height: 12px;
                    text-transform: uppercase;
                    position: relative;
                    top: -3px;
                }
            }
        }
    }
    .status-ico{
      color: #8f96a1;
      font-size: 11px!important;
      font-weight: 700;
      line-height: 12px!important;
      text-transform: uppercase;
      letter-spacing: 0.28px;
      width: 32px;
      height: 18px;
      border-radius: 9px;
      border: 1px solid #8f96a1;
      padding: 3px 6px!important;
      &::before{
        content: none!important;
      }
    }

</style>
