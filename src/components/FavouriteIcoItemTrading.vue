<template>
  <div class="ico-item" v-if="ico">
    <div class="row">
      <div class="col-3 d-flex">
        <div class="ico-item_logo ico-item_gradient" :style="{'backgroundImage': ico.gradient}">
          <div class="ico-item_logo_image" :style="{'background': `url(${ico.logo}) no-repeat  center, ${ico.bg}`,
                                                    'backgroundSize': 'auto'}">
          </div>
        </div>
      </div>
      <!-- /.col-3 -->
      <div class="col-4 d-flex">
        <div class="ico-item_discription">
          <div class="ico-item_title">
            <h2>{{ ico.title }}</h2>
            <div class="rating-wrapper">
              <div class="rating">
                <span>{{ ico.rating }} <sup>/10</sup></span>
              </div>
            </div>
            <!-- /.rating-wrapper -->
          </div>
          <!-- /.ico-item_title -->
          <div class="ico-item_category" >
            <span v-for="(item, index) in ico.category" :key="index">{{ item }}</span>
          </div>
          <!-- /.ico-item_category -->
          <div class="ico-item_time-wrapper">
            <table class="ico-item_time">
              <tbody>
              <tr>
                <th>{{ $t('favourite.started') }}</th>
                <th>{{ $t('favourite.ended') }}</th>
              </tr>
              <tr>
                <td>{{ $moment(ico.starts).format('DD.MM.YY') }}</td>
                <td>{{ $moment(ico.ends).format('DD.MM.YY') }}</td>
              </tr>
              </tbody>
            </table>
          </div>
          <!-- /.ico-item_features -->
        </div>
        <!-- /.ico-item_discription -->
      </div>
      <!-- /.col-4 -->
      <div class="col-5">
        <div class="ico-item_trading">
          <div class="ico-item_roi-wrapper">
            <table class="ico-item_roi">
              <tbody>
              <tr>
                <th>USD ROI</th>
                <th>BTC ROI</th>
                <th>ETH ROI</th>
                <th>24H ROI</th>
              </tr>
              <tr>
                <td><span>x</span> {{ico.usd_roi}}</td>
                <td><span>x</span> {{ico.btc_roi}}</td>
                <td><span>x</span> {{ico.eth_roi}}</td>
                <td><span></span>{{ico['24h_roi']}}</td>
              </tr>
              </tbody>
            </table>
          </div>
          <!-- /.ico-item_return-investments -->
          <div class="ico-item_totall-price-wrapper">
            <table class="ico-item_totall-price">
              <tbody>
                <tr>
                  <th>MARKET CAP</th>
                  <th>{{ $t('portfolio.ICO_PRICE') }}</th>
                  <th>{{ $t('portfolio.MARKET_PRICE') }}</th>
                </tr>
                <tr>
                  <td>{{currencyConverter( ico.market_cap, currentCurrency.ticker, false )}} <b>{{ currentCurrency.ticker }}</b></td>
                  <td>{{currencyConverter( ico.ico_price, currentCurrency.ticker, false )}} <b>{{ currentCurrency.ticker }}</b></td>
                  <td>{{currencyConverter( ico.market_price, currentCurrency.ticker, false )}} <b>{{ currentCurrency.ticker }}</b></td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- /.ico-item_status-wrapper -->
        </div>
        <!-- /.ico-item_trading -->
      </div>
    </div>
    <!-- /.row -->
    <div class="ico-item_bottom-line">
      <div class="row">
        <div class="col-10">
          <div class="ico-item_links-wrapper">
            <a class="to-discuss" :href="ico.forum_link">{{ $t('favourite.discuss') }}<sup>{{ico.forum_posts_count}}</sup></a>
            <a :class="['to-rate', {'to-rate--active': ico.user_review}]" :href="ico.review_link">{{ $t('favourite.reviews') }}<sup>{{ico.reviews_count}}</sup></a>
            <a v-if="ico.user_review === true"
               :class="['your-review']"
               :href="ico.user_review_link">{{ $t('favourite.your_review') }}</a>
            <a v-if="ico.at_calendar === true"
               :class="['add-calendar', {'add-calendar--active': ico.at_calendar === true }]"
               href="#"
               @click.prevent="">{{ $t('favourite.add_to_cal_already') }}</a>
            <a v-if="ico.at_calendar === false"
               :class="['add-calendar']"
               href="/add_to_call"
               @click.prevent="">{{ $t('favourite.add_to_cal') }}</a>
          </div>
          <!-- /.ico-item-bottom-line -->
        </div>
        <!-- /.col-10 -->
        <div class="col-2">
          <div class="ico-item_button">
            <a :href="ico.ico_details_link" class="btn ico-item_button-details">{{ $t('favourite.ico_details') }}</a>
          </div>
          <!-- /.ico-item_button -->
        </div>
        <!-- /.col-2 -->
      </div>
      <!-- /.row -->
    </div>
    <!-- /.ico-item_bottom-line -->
  </div>
</template>
<script>
import Vuex from 'vuex'
const storePortfolio = Vuex.createNamespacedHelpers('portfolio')
export default {
  name: 'FavouriteIcoItemTrading',
  props: {
    ico: Object
  },
  computed: {
    ...storePortfolio.mapGetters({
      currencyConverter: 'currencyConverter',
      getCurrencyByTicker: 'getCurrencyByTicker',
      currentCurrency: 'currentCurrency'
    })
  },
  methods: {
    isSoon (date) {
      return this.$moment(date) > this.$moment()
    },
    countPercent (ico) {
      return ((ico.current_cap / ico.hard_cap) * 100).toFixed(2)
    },
    countStylePercent (ico) {
      let percent = ((ico.current_cap / ico.hard_cap) * 100).toFixed(2)
      if (percent <= 100 && percent >= 0) return percent
      if (percent < 0) return 0
      if (percent > 100) return 100
    }
  }
}
</script>
<style lang="less" scoped>

  @import "../assets/less/vars";
  .ico-favourite {
    .rating {
      position: relative;
      display: flex;
      &-wrapper {
        display: flex;
        margin-left: auto;
      }
      &::before {
        content: "";
        position: absolute;
        left: -10px;
        border: 10px solid transparent;
        border-top-width: 13.5px;
        border-bottom-width: 13.5px;
        border-top-color: #f7981b;
        border-bottom-color: #f7981b;
        border-left-width: 0;
        transform: rotate(180deg);
      }
      span {
        margin: auto;
        padding: 6px 6px 4px 5px;
        background-color: #f7981b;
        text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
        color: #ffffff;
        font-family: 'Roboto', sans-serif;
        font-size: 18px;
        font-weight: 700;
        line-height: 15px;
        white-space: nowrap;
      }
      span sup {
        padding: 0;
        opacity: 0.8;
        text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
        color: #ffffff;
        font-family: 'Roboto', sans-serif;
        font-size: 12px;
        font-weight: 500;
        line-height: 16px;
      }
    }
    &_title {
      padding: 32px 0;
      h1 {
        color: #333f52;
        font-family: @main-font;
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
    &_list {
      margin-bottom: 52px;
      .ico-item {
        margin-bottom: 20px;
        background-color: #fafbfc;
        box-shadow: 0 2px 4px rgba(51, 51, 51, 0.1);
        &--sponsored {
          background-color: #e0e6ed;
        }
        &_content-wrapper {
          display: flex;
          background-color: #fafbfc;
          box-shadow: 0 2px 4px rgba(51, 51, 51, 0.1);
          &--sponsored {
            background-color: #e0e6ed;
          }
        }
        &_logo {
          position: relative;
          display: flex;
          width: 100%;
          min-height: 173px;
          border-radius: 4px 0 0 0;
          &::before {
            content: "";
            position: absolute;
            width: 11px;
            height: 10px;
            left: 20px;
            top: 23px;
            background-image: @img-heart-white;
            background-position: center;
            background-repeat: no-repeat;
            z-index: 11;
          }
          &_image{
            width: 100%;
            height: 100%;
          }
          img {
          }
        }
        &_discription {
          display: flex;
          flex-direction: column;
          //width: 37%;
          padding: 12px 0px 18px 0px;
          flex-grow: 1;
        }
        &_title {
          margin-bottom: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          h2 {
            color: #333f52;
            font-size: 24px;
            font-weight: 700;
            line-height: 24px;
          }
        }
        &_category {
          display: flex;
          margin-bottom: 5px;
          span {
            margin-right: 3px;
            padding: 3px 5px;
            border-radius: 4px;
            border: 1px solid #cbd5e2;
            background-color: #ffffff;
            color: #525c6c;
            font-family: @main-font;
            font-size: 10px;
            font-weight: 400;
            line-height: 10px;
          }
        }
        &_discribe {
          margin-bottom: 8px;
          p {
            max-width: 100%;
            color: #525c6c;
            font-family: @main-font;
            font-size: 12px;
            font-weight: 400;
            line-height: 16px;
          }
        }
        &_platforms {
          margin-top: auto;
          &-pl {
            margin-right: 16px;
            color: #8f96a1;
            font-family: @medium;
            font-size: 11px;
            font-weight: 500;
            line-height: 11px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          &-name {
            margin-right: 12px;
            color: #333f52;
            font-size: 14px;
            line-height: 16px;
            text-transform: uppercase;
            font-family: @main-font;
            font-weight: 700;
          }
        }
        &_time-wrapper {
          margin-top: 30px;
        }
        &_totall-price-wrapper {
          margin-top: 25px;
          padding-left: 14px;
        }
        &_time,
        &_totall-price {
          width: 100%;
          th {
            color: #8f96a1;
            font-family: @medium;
            font-size: 11px;
            font-weight: 500;
            line-height: 11px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          td {
            color: #707986;
            font-family: @medium;
            font-size: 16px;
            font-weight: 500;
            line-height: 20px;
            letter-spacing: -0.4px;
            b {
              font-size: 14px;
            }
          }
        }
        &_roi-wrapper {
          padding: 20px 0 15px 14px;
          box-shadow: 8px 8px 8px rgba(0, 0, 0, 0.05);
          background-color: #ffffff;
          border-bottom: 2px solid #ced8e3;
        }
        &_roi {
          width: 100%;
          th {
            color: #525c6c;
            font-family: @main-font;
            font-size: 11px;
            font-weight: 700;
            line-height: 11px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            &:last-child {
              text-align: center;
            }
          }
          td {
            color: #333f52;
            font-family: @main-font;
            font-size: 16px;
            font-weight: 700;
            line-height: 20px;
            span {
              font-size: 12px;
            }
            &:last-child {
              text-align: center;
              color: #45af37;
              font-family: @main-font;
              font-size: 22px;
              font-weight: 700;
              line-height: 20px;
              letter-spacing: -0.4px;
              span {
                position: relative;
                &::before {
                  content: "";
                  position: absolute;
                  width: 11px;
                  height: 8px;
                  left: -22px;
                  top: 1px;
                  background-image: @img-triangle-green;
                  background-position: center;
                  background-repeat: no-repeat;
                  z-index: 11;
                }
              }
            }
          }
          &--negative {
            td {
              &:last-child {
                color: #ff3657;
                span {
                  position: relative;
                  &::before {
                    content: "";
                    position: absolute;
                    width: 11px;
                    height: 8px;
                    left: -22px;
                    top: 1px;
                    background-image: @img-triengle-red;
                    background-position: center;
                    background-repeat: no-repeat;
                    z-index: 11;
                  }
                }
              }
            }
          }
        }
        &_fundraising {
          padding: 20px 0px 0px 28px;
          display: flex;
          flex-direction: column;
          //width: 23%;
        }
        &_cap {
          display: flex;
          flex-direction: column;
          flex-grow: 2;
          margin-bottom: 13px;
          width: 75%;
          &-type {
            margin-bottom: 5px;
            color: #8f96a1;
            font-family: @medium;
            font-size: 11px;
            font-weight: 500;
            line-height: 11px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          &-goal {
            margin-bottom: 10px;
            color: #333f52;
            font-family: @main-font;
            font-size: 22px;
            font-weight: 700;
            line-height: 22px;
            text-transform: uppercase;
            letter-spacing: -0.4px;
            sup {
              font-size: 14px;
              letter-spacing: -0.4px;
            }
          }
          &-current {
            display: flex;
            justify-content: space-between;
            &-usd {
              &--canceled {
                color: #ff3657;
              }
              &--reached {
                color: @accent-color;
              }
              color: #707986;
              font-family: @medium;
              font-size: 12px;
              font-weight: 400;
              line-height: 12px;
              text-transform: uppercase;
              sup {
                font-size: 10px;
              }
            }
            &-percent {
              color: #8f96a1;
              font-family: @medium;
              font-size: 12px;
              font-weight: 400;
              line-height: 12px;
            }
          }
        }
        &_scale {
          position: relative;
          margin-bottom: 10px;
          height: 6px;
          border-radius: 4px;
          border: 1px solid #ced8e3;
          background-color: #ffffff;
          small {
            content: "";
            position: absolute;
            width: 12px;
            height: 22px;
            left: 50px;
            top: -10px;
            background-image: @img-scale-drop;
            background-position: center;
            background-repeat: no-repeat;
            z-index: 11;
          }
          &-inner {
            /*width: 21%;*/
            height: 4px;
            border-radius: 4px 0 0 4px;
            max-width: 100%!important;
            &--grey {
              background-color: #c5d0de;
              max-width: 100%!important;
            }
            &--green {
              background-color: @accent-color;
              max-width: 100%!important;
            }
            &--red {
              background-color: #ff3657;
              max-width: 100%!important;
            }
          }
        }
        &_status-wrapper {
          margin-top: auto;
          padding-left: 24px;
          max-width: 140px;
        }
        &_status {
          position: relative;
          color: #707986;
          font-family: @main-font;
          font-size: 11px;
          font-weight: 500;
          line-height: 11px;
          text-transform: uppercase;
          &::before {
            content: "";
            position: absolute;
            width: 16px;
            height: 14px;
            left: -22px;
            top: 2px;
            background-position: center;
            background-repeat: no-repeat;
            z-index: 11;
          }
          &--canceled {
            color: #ff3657;
            &::before {
              background-image: @img-thumbs-down-red;
            }
          }
          &--reached {
            color: @accent-color;
            &::before {
              height: 24px;
              background-image: @img-watch;
            }
          }
        }
        &_price {
          display: flex;
          flex-direction: column;
          margin-top: auto;
          &-token {
            margin-bottom: 6px;
            color: #8f96a1;
            font-family: @medium;
            font-size: 11px;
            font-weight: 500;
            line-height: 11px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          &-token-usd {
            color: #707986;
            font-family: @main-font;
            font-size: 14px;
            font-weight: 700;
            line-height: 14px;
            text-transform: uppercase;
          }
        }
        &_trading {
          display: flex;
          flex-direction: column;
          flex-grow: 2;
          padding: 0 0 0px 14px;
        }
        &_timeframe {
          display: flex;
          flex-direction: column;
          //flex-grow: 2;
          padding: 20px 0 0px 0px;
        }
        &_start,
        &_end {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin-bottom: 9px;
          &-st,
          &-en {
            margin-bottom: 7px;
            color: #8f96a1;
            font-family: @medium;
            font-size: 11px;
            font-weight: 500;
            line-height: 11px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          &-date {
            margin-bottom: 6px;
            color: #333f52;
            font-family: @main-font;
            font-size: 16px;
            font-weight: 700;
            line-height: 16px;
            letter-spacing: -0.4px;
          }
          &-time-remain,
          &-time-left {
            padding: 3px 4px;
            border-radius: 2px;
            background-color: #c5d0de;
            color: #ffffff;
            font-family: @medium;
            font-size: 11px;
            font-weight: 500;
            line-height: 11px;
          }
          &-time-remain {
            &--soon {
              background-color: #ff3657;
            }
          }
          &-time-left {
            &--soon {
              background-color: #ff3657;
            }
          }
        }
        &_end {
          margin-bottom: 0;
          margin-top: auto;
        }
        &_bottom-line {
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.05);
          border-radius: 0 0 4px 4px;
          background-color: #ffffff;
        }
        &_links-wrapper {
          align-items: center;
          display: flex;
          padding: 16px 0;
          a {
            margin-right: 30px;
            position: relative;
            font-family: @medium;
            font-size: 12px;
            font-weight: 500;
            line-height: 14px;
            letter-spacing: -0.13px;
            white-space: nowrap;
            &:first-child {
              margin-left: 20px;
            }
            sup {
              top: -7px;
              margin-left: 4px;
              margin-top: -22px;
              padding: 1px 5px 1px 4px;
              border-radius: 8px;
              background-color: #5bb0d5;
              color: #ffffff;
              font-family: @medium;
              font-size: 9px;
              font-weight: 500;
              line-height: 9px;
            }
          }
          .to-discuss {
            padding-left: 21px;
            color: #525c6c;
            font-size: 12px;
            font-weight: 500;
            line-height: 14px;
            &::before {
              content: "";
              position: absolute;
              width: 16px;
              height: 14px;
              left: 0px;
              top: -1px;
              background-image: @img-discuss-icon;
              background-position: center;
              background-repeat: no-repeat;
              z-index: 11;
            }
          }
          .your-review {
            padding-left: 20px;
            color: #45af37;
            font-family: @main-font;
            font-size: 10px;
            font-weight: 500;
            line-height: 14px;
            &::before {
              content: "";
              position: absolute;
              width: 14px;
              height: 14px;
              left: 0px;
              top: -2px;
              background-image: @img-your-review;
              background-position: center;
              background-repeat: no-repeat;
              z-index: 11;
            }
          }
          .to-rate {
            padding-left: 21px;
            color: #525c6c;
            font-size: 12px;
            font-weight: 500;
            line-height: 14px;
            &::before {
              content: "";
              position: absolute;
              width: 16px;
              height: 14px;
              left: 0px;
              top: -2px;
              background-image: @img-to-rate-icon;
              background-position: center;
              background-repeat: no-repeat;
              z-index: 11;
            }
            &--active {
              color: #45af37;
              &::before {
                content: "";
                position: absolute;
                width: 14px;
                height: 14px;
                left: 0px;
                top: -1px;
                background-image: @img-green-check;
                background-position: center;
                background-repeat: no-repeat;
                z-index: 11;
              }
            }
          }
          .add-calendar {
            padding-left: 21px;
            color: #525c6c;
            font-size: 12px;
            font-weight: 500;
            line-height: 14px;
            &::before {
              content: "";
              position: absolute;
              width: 16px;
              height: 14px;
              left: 0px;
              top: -2px;
              background-image: @img-calendar-small;
              background-position: center;
              background-repeat: no-repeat;
              z-index: 11;
            }
            &--active {
              color: @accent-color;
              &::before {
                content: "";
                position: absolute;
                width: 14px;
                height: 14px;
                left: 0px;
                top: -2px;
                background-image: @img-green-check;
                background-position: center;
                background-repeat: no-repeat;
                z-index: 11;
              }
            }
          }
          .buy-sell {
            padding-left: 24px;
            margin-right: 15px;
            color: #525c6c;
            font-size: 12px;
            font-weight: 500;
            line-height: 14px;
            &::before {
              content: "";
              position: absolute;
              width: 16px;
              height: 14px;
              left: 0px;
              top: -2px;
              background-image: @img-wallet-blue;
              background-position: center;
              background-repeat: no-repeat;
              z-index: 11;
            }
          }
        }
        &_button {
          display: flex;
          justify-content: center;
          //padding: 18px 0px 13px 16px;
          box-shadow: 0 2px 0 #3b962f;
          border-radius: 0 0 4px;
          background-color: #45af37;
          &-details {
            position: relative;
            padding: 18px 0px 13px 16px;
            color: #ffffff;
            font-family: @medium;
            font-size: 14px;
            font-weight: 500;
            line-height: 14px;
            &::before {
              content: "";
              position: absolute;
              width: 15px;
              height: 15px;
              left: -6px;
              top: 16px;
              background-image: @img-white-check-big;
              background-position: center;
              background-repeat: no-repeat;
              z-index: 11;
            }
          }
        }
      }

    }
  }
</style>
