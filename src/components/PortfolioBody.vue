<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12 col-lg-3">
        <div class="portfolio-view">
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

          <donutPortfolioWrapper :dataObj="chartData(stringifiedPortfolio)"
                                 :portfolio="portfolio"
                                 :totalCost="totalCost()"></donutPortfolioWrapper>
            <!-- /.portfolio-view_filter -->
          <div class="portfolio-view_public">
            <a>{{ $t('portfolio.public_portfolio') }}<sup class="tooltip-mark"></sup></a>
            <div class="portfolio-view_toggle">
              <label class="toggle" v-if="portfolio">
                <input type="checkbox" :id="`links-checkbox-${portfolio.id}`" name="toggle" @click="switchPublicPortfolio()">
                <span></span>
              </label>
            </div>
          </div>
          <div v-if="portfolio" :id="`portfolio-links-${portfolio.id}`"
               :class="['portfolio-view_links', 'hidden']">
            <input type="text"
                   name=""
                   :id="`clipboard-${portfolio.id}`"
                   placeholder=""
                   :value="portfolioLink"
                   disabled>
            <div class="profile-social">
              <a href="#" class="profile-social_links-item profile-social_links-item--fb"></a>
              <a href="#" class="profile-social_links-item profile-social_links-item--tw"></a>
              <a href="#" class="profile-social_links-item profile-social_links-item--G"></a>
              <a href="#" class="profile-social_links-item profile-social_links-item--in"></a>
              <a href="#" class="profile-social_links-item profile-social_links-item--wk"></a>
              <a href="#" @click="clipboardPortfolioLink()" class="copy_link">{{ $t('portfolio.copy_link') }}</a>
            </div>
          </div>
        </div>
        <!-- /.portfolio-view -->
      </div>
      <!-- /.col-3 -->
      <div class="col-md-12 col-lg-9">
        <div class="portfolio">
          <div class="portfolio_bottom-line">
            <div class="portfolio_cost">
              <span class="portfolio_cost-price">{{ $t('portfolio.Acquisition_Cost') }}
                <sup class="tooltip-mark" v-b-tooltip.hover.html.right="tipData"></sup>
              </span>
              <span class="portfolio_cost-usd" v-if="totalCost()" v-html="currencyConverter(totalCost(), currentCurrency.ticker )"></span>
              <span class="portfolio_cost-btc" v-if="totalCost()" v-html="currencyConvertUSDToBTC(totalCost())"></span>
            </div>
            <div class="portfolio_profit" v-if="portfolio">
              <span class="portfolio_profit-price">{{ $t('portfolio.Profit') }}</span>
              <span :class="['portfolio_profit-usd', { positive: portfolio.profit >= 0 }, { negative: portfolio.profit < 0 }]"
                    v-html="currencyConverter(Math.abs(portfolio.profit), currentCurrency.ticker )">
              </span>
              <span class="portfolio_profit-btc" v-html="currencyConvertUSDToBTC(Math.abs(portfolio.profit))"></span>
            </div>
            <!-- /.portfolio_worth -->
            <div class="portfolio_deviation">
              <span class="portfolio_deviation-24hours">{{ $t('portfolio.24HCHANGE') }}</span>
              <span v-if="totalChange()"
                    :class="['portfolio_deviation-percent', { positive: totalChange() >= 0 }, { negative: totalChange() < 0 }]">
                {{ totalChange() }}<sup>%</sup>
              </span>
              <span class="portfolio_deviation-usd" v-html=" totalChangeCurrency() "></span>
            </div>
            <!-- /.portfolio_deviation -->
            <div v-if="portfolio" class="portfolio_changes">
              <a href="#"
                 @click.prevent="toggleCollapse(`chartPortfolio-${portfolio.id}`)"
                 v-html="$t('portfolio.changes_chart')"></a>
            </div>
          </div>
          <!-- /.portfolio_bottom-line -->

            <PortfolioChartWrapper :style="collapsable" v-if="portfolio" :ref="`chartPortfolio-${portfolio.id}`" :portfolio="portfolio"/>

            <b-collapse id="formAddDeleteCoin" class="">
              <form-add-delete-coin :portfolio.sync="portfolio" ></form-add-delete-coin>
            </b-collapse>

          <!-- /.portfolio_form -->
          <portfolio-list v-if="portfolio" :portfolio.sync="portfolio" ></portfolio-list>
          <div class="portfolio_button portfolio_button--bottom">
            <b-btn  class="btn" v-b-toggle.formAddDeleteCoin variant="primary">{{ $t('portfolio.Add_Delete_Coin') }}</b-btn>
          </div>
          <portfolio-history v-if="portfolio" :portfolio="portfolio"></portfolio-history>
        </div>
      </div>
      <!-- /.col-9 -->
    </div>
    <!-- /.row -->
  </div>
</template>

<script>
import formAddDeleteCoin from './formAddDeleteCoin'
import PortfolioHistory from './PortfolioHistory'
import PortfolioList from './PortfolioList'
import donutPortfolioWrapper from './donutPortfolioWrapper'
import Vuex from 'vuex'
import PortfolioChartWrapper from './PortfolioChartWrapper'

const storeEvent = Vuex.createNamespacedHelpers('portfolio')
export default {
  name: 'PortfolioBody',
  components: {PortfolioChartWrapper, formAddDeleteCoin, PortfolioHistory, PortfolioList, donutPortfolioWrapper},
  props: {
    portfolio: Object
  },
  data () {
    return {
      collapsable: [
        {maxHeight: '0px'},
        {overflow: 'hidden'},
        {transition: 'max-height 0.3s ease-out'}
      ],
      tipData: {
        title: `<div class="tooltip-inner-custom">${this.$t('portfolio.renew')}</div>`,
        template: `<div class="tooltip custom" role="tooltip"> <div class="arrow"></div> <div class="tooltip-inner"></div> </div>`,
        html: true
      },
      showPortfolioLinks: false,
      currencyStorage: null,
      showPortfolioChart: false
    }
  },
  computed: {
    ...storeEvent.mapGetters({
      getCoinByID: 'getCoinByID',
      portfolios: 'portfolios',
      currencyConverter: 'currencyConverter',
      currencyConvertUSDToBTC: 'currencyConvertUSDToBTC',
      currencies: 'currencies',
      getCurrencyByTicker: 'getCurrencyByTicker',
      currentCurrency: 'currentCurrency'
    }),
    portfolioLink: function () {
      if (this.portfolio) {
        // return portfolio.link
        /**
         * Заглушка. В дальнейшем заменится на данные с сервера
         * */
        return 'https://icopapa.com/shared/as3ld22'
      }
    },
    stringifiedPortfolio: function () {
      if (this.portfolio) {
        return JSON.parse(JSON.stringify(this.portfolio))
      }
    }
  },
  watch: {
    portfolio: function () {
      if (this.stringifiedPortfolio) {
        this.chartData(this.stringifiedPortfolio)
      }
    }
  },
  methods: {
    toggleCollapse (ref) {
      console.log(ref)
      if (this.$refs[ref].$el.style.maxHeight === '0px') {
        this.$refs[ref].$el.style.maxHeight = this.$refs[ref].$el.scrollHeight + 'px'
      } else {
        this.$refs[ref].$el.style.maxHeight = '0px'
      }
    },
    switchPublicPortfolio () {
      let el = document.getElementById(`portfolio-links-${this.portfolio.id}`)
      if (el.classList.contains('hidden')) {
        el.classList.remove('hidden')
      } else {
        el.classList.add('hidden')
      }
    },
    /**
     * Копируем содержимое элемента инпут в буфер
     * */
    clipboardPortfolioLink () {
      let testingCodeToCopy = document.querySelector(`input#clipboard-${this.portfolio.id}`)
      testingCodeToCopy.disabled = false
      testingCodeToCopy.select()
      document.execCommand('copy')
      testingCodeToCopy.disabled = true
    },
    chartData (portfolio) {
      if (portfolio !== undefined) {
        let colors = []
        let labels = []
        /**
         * Заполняем массив с данными для чарта бублика- цвет и названия монет
         * */
        portfolio.coin.forEach((element) => {
          if (this.getCoinObject(element.id) !== undefined) {
            colors.push(this.getCoinObject(element.id).color)
            labels.push(this.getCoinObject(element.id).ticker)
          }
        })
        /**
         * Заполняем массив с данными для чарта бублика: отношение в процентах к общему количеству
         * */
        let totalPortfolio = 0
        for (let index = 0; index < portfolio.coin.length; ++index) {
          let item = portfolio.coin[index]
          totalPortfolio += this.countValue(item)
        }
        let percentage = portfolio.coin.map((current) => {
          if (this.getCoinObject(current.id)) {
            // let coinPriceTotal = parseFloat(current.amount) * this.getCoinObject(current.id).market_price * current.amount
            // return (coinPriceTotal * 100 / parseFloat(sum)).toFixed(2)
            let coinPrice = this.countValue(current)
            let coinPercent = (coinPrice / totalPortfolio) * 100
            return coinPercent.toFixed(0)
          }
        })
        /**
         * Формируем в один объект
         * */
        let dataObj = {
          labels: labels,
          data: percentage,
          colors: colors
        }
        return dataObj
      }
    },
    getCoinObject (id) {
      return this.getCoinByID(id)
    },
    ...storeEvent.mapActions(['setCurrentCurrency']),
    totalChange () {
      let total = 0
      if (this.portfolio !== undefined) {
        for (let index = 0; index < this.portfolio.coin.length; ++index) {
          let item = this.portfolio.coin[index]
          total += this.countChange(item)
        }
      }
      return Number(Math.round(total + `e3`) + `e-3`)
    },
    totalChangeCurrency () {
      let total = this.totalCost() * (Math.abs(this.totalChange()) / 100)
      return this.currencyConverter(total, 'USD')
    },
    countChange (item) {
      if (this.getCoinByID(item.id)) {
        return (parseFloat(this.getCoinByID(item.id)['24_change']))
      }
    },
    /**
     * Считаем общую стоимость портфеля
     * */
    totalCost () {
      let total = 0
      if (this.portfolio !== undefined) {
        for (let index = 0; index < this.portfolio.coin.length; ++index) {
          let item = this.portfolio.coin[index]
          total += this.countValue(item)
        }
      }
      return total
    },
    /**
     * Считаем стоимость каждой монеты отдельно
     * */
    countValue (item) {
      if (this.getCoinByID(item.id)) {
        return (parseFloat(this.getCoinByID(item.id)['market_price']) * parseFloat(item.amount))
      }
    },
    /**
     * Загрузить все портфели в хранилище
     * */
    async getCoins () {
      await this.$store.dispatch('portfolio/getCoins')
    },
    getCurrencies () {
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
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/less/vars";
  label.toggle {
    margin-bottom: 0;
    input[type=checkbox] {
      display: none;
      position: relative;
      top: 2px;
    }
    span {
      position: relative;
      display: inline-block;
      cursor: pointer;
      width: 48px;
      height: 20px;
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 48px;
        height: 20px;
        background-image: @img-tumbler-inactive;
        background-repeat: no-repeat;
        background-position: center;
        z-index: 33;
        border: none;
        box-shadow: none;
        background-color: transparent;
      }
    }
  }
  label.toggle input[type=checkbox]:checked + span::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 48px;
    height: 20px;
    background-image: @img-tumbler-active;
    background-repeat: no-repeat;
    background-position: center;
    z-index: 33;
  }
  #chartPortfolio{
    width: 100%;
  }
  .prtfolio_chart-header{
    color: #525c6c;
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
  }
  .tooltip-mark {
    display: inline-block;
    margin-left: 4px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-image: url(../assets/img/tooltip.svg);
    background-position: center;
    background-repeat: no-repeat;
    z-index: 11;
  }
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
      /*margin-top: 30px;*/
      padding-left: 28px;
      a {
        position: relative;
        color: @dark;
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
    &_links {
      margin-top: 22px;
      input{
        color: #8f96a1;
        font-family: @medium;
        font-size: 14px;
        font-weight: 500;
        line-height: 14px;
        letter-spacing: -0.07px;
        width: 100%;
        padding: 8px 9px 10px 9px;
        border-radius: 4px;
        border: 1px solid #c5d0de;
        background-color: #e8edf2;
        margin-bottom: 12px;
        height: 32px;
      }
      .profile-social {
        margin-bottom: 34px;
        span {
          display: inline-block;
          margin-bottom: 10px;
          color: @dark;
          font-family: @main-font;
          font-size: 14px;
          font-weight: 400;
          line-height: 16px;
        }
        .copy_link{
          float: right;
          top: 4px;
          position: relative;
          text-transform: capitalize;
          color: #45af37;
          font-family: @main-font;
          font-weight: 400;
          font-size: 12px;
          line-height: 12px;
          display: inline-block;
          padding-bottom: 2px;
          border-bottom: 1px dashed;
          &:hover{
            border-bottom: 1px solid;
            text-decoration: none;
          }
        }
        &_links {
          display: flex;
          &-item {
            position: relative;
            margin-right: 4px;
            width: 24px;
            height: 24px;
            border-radius: 2px;
            background-position: center;
            background-repeat: no-repeat;
            display: inline-block;
            &--fb {
              background-color: #345c94;
              background-image: @img-fb-icon;
            }
            &--tw {
              background-color: #00b0e9;
              background-image: @img-tw-icon;
            }
            &--in {
              background-color: #0086ba;
              background-image: @img-in-icon;
            }
            &--wk {
              background-color: #4c75a3;
              background-image: @img-wk-icon;
            }
            &--G{
              background-color: #e34346;
              background-image: @img-G-icon;
            }
          }
        }
      }
    }
    &_toggle{
      margin-left: auto;
    }
  }
  .portfolio {
    margin-top: 32px;
    margin-bottom: 32px;
    &_bottom-line {
      display: flex;
      align-items: center;
      margin-bottom: 26px;
    }
    &_changes {
      margin-left: auto;
      a {
        position: relative;
        color: @main-color;
        font-family: @main-font;
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        text-decoration: underline;
        &:hover {
          text-decoration: none;
        }
        &::before {
          content: "";
          position: absolute;
          width: 18px;
          height: 12px;
          left: -30px;
          top: 4px;
          background-image: @img-graph;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 11;
        }
      }
    }

    .portfolio_cost {
      display: flex;
      flex-direction: column;
      span /deep/ b{
        line-height: 20px;
        font-size: 18px;
        font-weight: normal;
      }
      &-price {
        margin-bottom: 9px;
        color: #707986;
        font-family: @medium;
        font-weight: 500;
        font-size: 11px;
        line-height: 11px;
        letter-spacing: 0.3px;
        text-transform: uppercase;
      }
      &-usd {
        margin-bottom: 4px;
        color: #333f52;
        font-family: @main-font;
        font-weight: 700;
        font-size: 24px;
        line-height: 24px;
        letter-spacing: -0.5px;

      }
      &-btc {
        opacity: 0.6;
        color: #525c6c;
        font-family: @medium;
        font-weight: 500;
        font-size: 11px;
        line-height: 12px;
        text-transform: uppercase;
      }
    }
    .portfolio_profit {
      display: flex;
      flex-direction: column;
      margin-left: 74px;
      span /deep/ b{
        line-height: 20px;
        font-size: 18px;
        font-weight: normal;
      }
      &-price {
        margin-bottom: 9px;
        color: #707986;
        font-family: @medium;
        font-weight: 500;
        font-size: 11px;
        line-height: 11px;
        letter-spacing: 0.3px;
        text-transform: uppercase;
      }
      &-usd {
        margin-bottom: 4px;
        color: #333f52;
        font-family: @main-font;
        font-weight: 700;
        font-size: 24px;
        line-height: 24px;
        letter-spacing: -0.5px;
        position: relative;
        padding-left: 20px;
        &.positive::before {
          content: "";
          position: absolute;
          width: 20px;
          height: 16px;
          left: -5px;
          top: 6px;
          background-image: @img-triangle-green;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 11;
        }
        &.negative::before {
          content: "";
          position: absolute;
          width: 20px;
          height: 16px;
          left: -5px;
          top: 6px;
          transform: rotateX(180deg);
          background-image: @img-triengle-red;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 11;
        }

      }
      &-btc {
        opacity: 0.6;
        color: #525c6c;
        font-family: @medium;
        font-weight: 500;
        font-size: 11px;
        line-height: 12px;
        text-transform: uppercase;
      }
    }
    &_deviation {
      display: flex;
      flex-direction: column;
      margin-left: 78px;
      &-24hours {
        margin-bottom: 9px;
        color: #707986;
        font-family: @medium;
        font-weight: 500;
        font-size: 11px;
        line-height: 11px;
        letter-spacing: 0.3px;
        text-transform: uppercase;
      }
      &-percent {
        position: relative;
        padding-left: 19px;
        margin-bottom: 4px;
        color: @accent-color;
        font-family: @main-font;
        font-weight: 400;
        font-size: 24px;
        line-height: 24px;
        letter-spacing: -0.5px;
        &.positive{
          color: #45af37;
          &::before {
            content: "";
            position: absolute;
            width: 20px;
            height: 16px;
            left: -5px;
            top: 6px;
            background-image: @img-triangle-green;
            background-position: center;
            background-repeat: no-repeat;
            z-index: 11;
          }
        }
        &.negative{
          color: #ff3657;
          &::before {
            content: "";
            position: absolute;
            width: 20px;
            height: 16px;
            left: -5px;
            top: 6px;
            transform: rotateX(180deg);
            background-image: @img-triengle-red;
            background-position: center;
            background-repeat: no-repeat;
            z-index: 11;
          }
        }
        sup {
          font-size: 16px;
          letter-spacing: -0.5px;
          position: relative;
          top: -5px;
          left: 7px;
        }
      }
      &-usd {
        opacity: 0.6;
        color: #525c6c;
        font-family: @medium;
        font-weight: 500;
        font-size: 11px;
        line-height: 11px;
          .currency-icon {
          width: 12px;
          height: 12px;
        }
      }
    }
    &_button {
      margin-left: auto;
      &--bottom {
        margin-top: 30px;
        text-align: right;
      }
      .btn {
        position: relative;
        padding: 11px 11px 11px 32px;
        /*background-image: linear-gradient(180deg, #358c29 0%, #45af36 100%);*/
        text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
        box-shadow: 0 2px 0 #3b962f;
        color: #ffffff;
        font-family: @medium;
        font-weight: 500;
        font-size: 13px;
        line-height: 11px;
        letter-spacing: -0.22px;
        border-radius: 4px;
        background-color: #45af37;
        outline: none;
        &::before {
          content: "";
          position: absolute;
          width: 15px;
          height: 15px;
          left: 12px;
          top: 9px;
          background-image: @img-coin;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          z-index: 11;
        }
        &:hover,&:active{
          box-shadow: 0 2px 0 #3e9532, inset 0 2px 4px rgba(1, 1, 1, 0.3)!important;
          background-color: #45af37;
          text-shadow: none;
        }
        &:focus{
          outline: none;
        }
      }
    }
  }
</style>
