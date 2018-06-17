<template>
  <div id="app">
    <tpl-header></tpl-header>
    <div class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col">
            <div class="ico-stats">
              <div class="ico-stats_header">
                <div class="ico-stats_header-title">
                  <h1>ICO Stats</h1>
                  <span>Based on added ICO</span>
                </div>
                <!-- /.ico-stats_header-title -->
                <div class="portfolio-view_filter">
                  <label>
                    <input name="portfolio-filter-usd" type="checkbox" value="usd" checked>
                    <b>USD</b>
                  </label>
                  <label>
                    <input name="portfolio-filter-btc" type="checkbox" value="bts">
                    <b>BTC</b>
                  </label>
                  <label>
                    <input name="portfolio-filter-ETH" type="checkbox" value="ETH">
                    <b>ETH</b>
                  </label>
                  <label>
                    <input name="portfolio-filter-WAVES" type="checkbox" value="WAVES">
                    <b>WAVES</b>
                  </label>
                </div>
                <!-- /.portfolio-view_filter -->
              </div>
              <!-- /.ico-stats_header -->
            </div>
            <!-- /.ico-stats -->
            <table class="ico-stats_table">
              <tr class="ico-stats_table-header">
                <th class="ico-stats_table-header-cell ico-stats_table-header-cell--name"><span>Name</span></th>
                <th class="ico-stats_table-header-cell ico-stats_table-header-cell--24h"><span>24 H Change</span></th>
                <th class="ico-stats_table-header-cell ico-stats_table-header-cell--roi"><span>ROI Since Last week</span></th>
                <th class="ico-stats_table-header-cell ico-stats_table-header-cell--roi"><span>ROI Since Last month</span></th>
                <th class="ico-stats_table-header-cell ico-stats_table-header-cell--date"><span>ICO Date</span></th>
                <th class="ico-stats_table-header-cell ico-stats_table-header-cell--price"><span>ICO Price</span></th>
                <th class="ico-stats_table-header-cell ico-stats_table-header-cell--price"><span>Current price</span></th>
              </tr>
              <tr class="ico-stats_item">
                <td class="ico-stats_item-cell ico-stats_item-name ico-stats_item-name--bts">
                  <div class="ico-stats_item-name-wrapper">
                    <div class="ico-stats_item-logo">
                      <img src="img/btc-logo.png" alt="btc">
                    </div>
                    <span>Bitcoin · <b>BTC</b></span>
                  </div>
                </td>
                <td class="ico-stats_item-cell ico-stats_item-24h">
                  <span>+5.44%</span>
                </td>
                <td class="ico-stats_item-cell ico-stats_item-roi-week ico-stats_item-roi-week--negative"><span>+5.44%</span></td>
                <td class="ico-stats_item-cell ico-stats_item-roi-month"><span>+5.44%</span></td>
                <td class="ico-stats_item-cell ico-stats_item-date"><span>12.05.18</span></td>
                <td class="ico-stats_item-cell ico-stats_item-price">
                  <span class="ico-stats_item-price-usd">$ 7 619.89</span>
                  <span class="ico-stats_item-price-btc">0.0013603 BTC</span>
                </td>
                <td class="ico-stats_item-cell ico-stats_item-current-price">
                  <span class="ico-stats_item-current-price-usd">$ 7 619.89</span>
                  <span class="ico-stats_item-current-price-btc">0.0013603 BTC</span>
                </td>
              </tr>
              <!-- /.ico-stats_item -->
              <tr class="ico-stats_item">
                <td class="ico-stats_item-cell ico-stats_item-name ico-stats_item-name--bts">
                  <div class="ico-stats_item-logo">
                    <img src="img/btc-logo.png" alt="btc">
                  </div>
                  <span>Bitcoin · <b>BTC</b></span></td>
                <td class="ico-stats_item-cell ico-stats_item-24h">
                  <span>+5.44%</span>
                </td>
                <td class="ico-stats_item-cell ico-stats_item-roi-week ico-stats_item-roi-week--negative"><span>+5.44%</span></td>
                <td class="ico-stats_item-cell ico-stats_item-roi-month"><span>+5.44%</span></td>
                <td class="ico-stats_item-cell ico-stats_item-date"><span>12.05.18</span></td>
                <td class="ico-stats_item-cell ico-stats_item-price">
                  <span class="ico-stats_item-price-usd">$ 7 619.89</span>
                  <span class="ico-stats_item-price-btc">0.0013603 BTC</span>
                </td>
                <td class="ico-stats_item-cell ico-stats_item-current-price">
                  <span class="ico-stats_item-current-price-usd">$ 7 619.89</span>
                  <span class="ico-stats_item-current-price-btc">0.0013603 BTC</span>
                </td>
              </tr>
              <!-- /.ico-stats_item -->
              <tr class="ico-stats_item">
                <td class="ico-stats_item-cell ico-stats_item-name ico-stats_item-name--bts">
                  <div class="ico-stats_item-logo">
                    <img src="img/btc-logo.png" alt="btc">
                  </div>
                  <span>Bitcoin · <b>BTC</b></span></td>
                <td class="ico-stats_item-cell ico-stats_item-24h">
                  <b>ICO</b>
                </td>
                <td class="ico-stats_item-cell ico-stats_item-roi-week ico-stats_item-roi-week--negative"><b>ICO</b></td>
                <td class="ico-stats_item-cell ico-stats_item-roi-month"><b>ICO</b></td>
                <td class="ico-stats_item-cell ico-stats_item-date"><span>12.05.18</span></td>
                <td class="ico-stats_item-cell ico-stats_item-price">
                  <span class="ico-stats_item-price-usd">$ 7 619.89</span>
                  <span class="ico-stats_item-price-btc">0.0013603 BTC</span>
                </td>
                <td class="ico-stats_item-cell ico-stats_item-current-price">
                  <span class="ico-stats_item-current-price-usd">$ 7 619.89</span>
                  <span class="ico-stats_item-current-price-btc">0.0013603 BTC</span>
                </td>
              </tr>
              <!-- /.ico-stats_item -->
            </table>
            <!-- /.ico-stats_table -->
          </div>
          <!-- /.col -->
        </div>
        <!-- /.row -->
      </div>
      <!-- /.container-fluid -->
    </div>
    <tpl-footer></tpl-footer>
  </div>

  <!-- /.content -->
</template>

<script>
import tplHeader from './TheHeader'
import tplFooter from './TheFooter'
import Vuex from 'vuex'
const storeEvent = Vuex.createNamespacedHelpers('portfolio')
export default {
  name: 'StatsICOPage',
  components: { tplHeader, tplFooter },
  data () {
    return {
    }
  }
}

</script>

<style lang="less" scoped>

  @import "../assets/less/vars";

  .ico-stats {
    &_header {
      padding: 32px 0 26px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      h1 {
        margin-bottom: 4px;
        color: #333f52;
        font-family: @main-font;
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
          padding: 18px 12px 14px;
          border-right: 1px solid #e9ecee;
          &:last-child {
            border-right: none;
          }
          &--name {
            padding-left: 22px;
            width: 23%;
          }
          &--24h {
            width: 11%;
          }
          &--roi {
            width: 12%;
          }
          &--date {
            width: 15%;
          }
          &--price {
            width: 13%;
          }
          span {
            color: #525c6c;
            font-family: @main-font;
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
        span {
          color: #333f52;
          font-family: @main-font;
          font-weight: 500;
          font-size: 14px;
          line-height: 14px;
          letter-spacing: -0.2px;
        }
        b {
          font-family: @main-font;
          font-weight: 500;
          color: #8f96a1;
          letter-spacing: -0.2px;
        }
        &::before {
          content: "";
          position: absolute;
          width: 4px;
          height: 98%;
          left: 0px;
          top: 0px;
          z-index: 11;
        }
        &--bts {
          &::before {
            background-color: #8f5bc0;
          }
        }
        &--MON {
          &::before {
            background-color: #c28f58;
          }
        }
        &--OPA {
          &::before {
            background-color: #429db0;
          }
        }
        &--EOS {
          &::before {
            background-color: #ffa635;
          }
        }
        &--XMR {
          &::before {
            background-color: #6982fc;
          }
        }
        &--DASH {
          &::before {
            background-color: #ff6d71;
          }
        }
        &--NEO {
          &::before {
            background-color: #bcbdbc;
          }
        }
        &--ETH {
          &::before {
            background-color: #85b222;
          }
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
              top: 3px;
              background-image: @img-triengle-red;
            }
          }
        }
      }
      &-date {
        span {
          color: #707986;
          font-family: @main-font;
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
          font-family: @main-font;
          font-weight: 500;
          font-size: 16px;
          line-height: 16px;
        }
        &-btc {
          opacity: 0.6;
          color: #8f96a1;
          font-family: @main-font;
          font-weight: 500;
          font-size: 9px;
          line-height: 12px;
          text-transform: uppercase;
        }
      }
    }
  }

</style>
