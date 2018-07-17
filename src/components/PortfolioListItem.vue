<template>
  <div class="portfolio_item" v-if="item">
      <div class="portfolio_item__head" v-if="coin">
        <div :class="['portfolio_item-cell', 'portfolio_item-name', `portfolio_item-name--${coin.ticker}`]">
            <small :class="[`portfolio_item-name--pseudo`]" :style="{backgroundColor: coin.color}"></small>
            <div class="portfolio_item-logo">
              <img :src="coin.icon"
                   :alt="coin.title">
            </div>
            <span>{{ coin.title }} · <b>{{ coin.ticker }}</b></span></div>

          <div class="portfolio_item-cell portfolio_item-amount">
            <div class="portfolio_item-amount-wrapper">
              <span>{{ item.amount }} <b>{{ coin.ticker }}</b></span>
              <a href="#"
                 @click.prevent="localCollapse()"
                 :class="['portfolio_item-edit',{'portfolio_item-edit-open': collapseOpen === true }]"
                 ></a>
            </div>
          </div>

          <div class="portfolio_item-cell portfolio_item-percent">
            <span v-if="totalPercent"> {{ totalPercent }}%</span>
          </div>

          <div class="portfolio_item-cell portfolio_item-price">
            <span class="portfolio_item-price-usd" v-html="currencyConverter(countValue(item.amount , item.id), currentCurrency.ticker )"></span>
            <span class="portfolio_item-price-btc" v-html="currencyConvertUSDToBTC(countValue(item.amount , item.id))"></span>
          </div>

          <div :class="['portfolio_item-cell', 'portfolio_item-24hour', `portfolio_item-24hour--${ isPositive (coin) }`]">
            <span v-html=" coin['24_change']+'%'"></span>
          </div>

          <div class="portfolio_item-cell portfolio_item-capitalizations">
            <span v-html=" currencyConverter(coin.market_cap, currentCurrency.ticker ) "></span>
          </div>

          <div class="portfolio_item-cell portfolio_item-volume" v-if="coin">
            <div class="portfolio_item-volume-wrapper">
              <span v-html=" currencyConverter(coin['24H_volume'], currentCurrency.ticker ) "></span>
              <a href="#"
                 @click.prevent="localCollapse()"
                 :class="['portfolio_item-dropdown', {'portfolio_item-dropdown-open': collapseOpen === true }]">
              </a>
            </div>
          </div>
      </div>
      <div :id="`coin-toggle--${coin.ticker}`"
           v-if="coin" :class="['portfolio_item__body', `tbody--${coin.ticker}`, {collapsed: !collapseOpen}]">
        <small :class="[`portfolio_item__body--pseudo`]" :style="{backgroundColor: coin.color}"></small>
        <div class="item__head">
            <div class="item__head__cell operation">
              <span>{{ $t('portfolio.Operation') }}</span>
            </div>
            <div class="item__head__cell quantity">
              <span>{{ $t('portfolio.Quantity') }}</span>
            </div>
            <div class="item__head__cell price">
              <span>{{ $t('portfolio.Price') }}</span>
            </div>
            <div class="item__head__cell price-per-coin">
              <span>{{ $t('portfolio.Price_per_coin') }}</span>
              <a href="#" :id="`removeCoinForm-${coin.id}`" @click.prevent="onEnable(`removeCoinForm-${coin.id}`)" class="removeCoin"></a>

              <b-popover :target="`removeCoinForm-${coin.id}`"
                         :placement="'top'"
                         triggers="hover"
              >
                    <span v-bind:style="[
                                 {padding: '8px'},
                                 {fontSize: '12px'},
                                 {textAlign: 'center'},
                                 {backgroundColor: '#ffffff'},
                                 {boxShadow: '-8px 8px 24px rgba(0, 0, 0, 0.2)'}
                                  ]">{{ $t('portfolio.remove_coin_short') }}</span>
              </b-popover>

              <popover-coin-delete :id="coin.id"
                                   :coin="coin"
                                   v-on:confirm="removeCoin()"
                                   v-on:close="onDisable(`removeCoinForm-${coin.id}`)"></popover-coin-delete>
            </div>
        </div>
    <template v-if="item" v-for="(operation, index) in item.operations">
      <div class="item__body" :key="index">

        <template v-if="operation.type === 'swapped'">
          <div class="item__body__cell operation">
            <span :class="[ 'type', operationType(operation) ]">{{ $t(`portfolio.${operationType(operation) }`) }}</span>
          </div>
          <div class="item__body__cell quantity">
            <span>{{ operation.quantity }} <b>{{ coin.ticker }}</b></span>
            <span class="swapped_coin"><small>{{ $t(`portfolio.IN`)}}</small> {{ countSwappedCoinQuantity(operation) }} <b>{{ swappedCoinTicker(operation) }}</b></span>
          </div>
          <div class="item__body__cell price">
            <span v-html="currencyConverter(operation.price, currentCurrency.ticker )"></span>
          </div>
          <div class="item__body__cell price-per-coin">
            <span v-html="currencyConverter( operation.price_per_coin, currentCurrency.ticker )"></span>
            <span class="swapped_coin" v-html="pricePerCoinSwapped(operation)"></span>
            <button @click="toggleEditOperation(`formEditRecord--${index}${item.id}`)" class="edit">{{ $t(`form.edit`) }}</button>
            <button :id="`deleteConfirmForm-${index}-${item.id}`" @click="onEnable(`deleteConfirmForm-${index}-${item.id}`)" class="delete">
              {{ $t(`form.delete`) }}
            </button>
          </div>
        </template>

        <template v-else>
          <div class="item__body__cell operation">
            <span :class="[ 'type', operationType(operation) ]">{{ $t(`portfolio.${operationType(operation) }`) }}</span>
          </div>
          <div class="item__body__cell quantity">
            <span>{{ operation.quantity }} <b>{{ coin.ticker }}</b></span>
          </div>
          <div class="item__body__cell price">
            <span v-html="currencyConverter(countOperationValue(operation), currentCurrency.ticker )"></span>
          </div>
          <div class="item__body__cell price-per-coin">
            <span v-html="currencyConverter( operation.price_per_coin, currentCurrency.ticker )"></span>
            <button @click="toggleEditOperation(`formEditRecord--${index}${item.id}`)" class="edit">{{ $t(`form.edit`) }}</button>
            <button :id="`deleteConfirmForm-${index}-${item.id}`" @click="onEnable(`deleteConfirmForm-${index}-${item.id}`)" class="delete">
              {{ $t(`form.delete`) }}
            </button>
          </div>
        </template>
        <popover-operation-delete :index="index"
                                          :id="item.id"
                                          v-on:confirm="deleteOperation(operation, index)"
                                          v-on:close="onDisable(`deleteConfirmForm-${index}-${item.id}`)"></popover-operation-delete>
        </div>
        <div :key="index+item.operations.length"
             class="form_td">
          <b-collapse :id="`formEditRecord--${index}${item.id}`">
            <form-edit-operation-portfolio :index="index"
                                           :selectedCoin="item"
                                           :portfolio="portfolio"
                                           :operation="operation"></form-edit-operation-portfolio>
          </b-collapse>
        </div>
      </template>
      <div class="form_add_record">
          <form-add-record-portfolio :selectedCoin="item" :portfolio="portfolio"></form-add-record-portfolio>
          <!-- /.portfolio_form -->
      </div>
      <div class="exchange">
        <PortfolioExchangeMarkets :coin="item" ></PortfolioExchangeMarkets>
      </div>
    </div>
  </div>
    <!--/.portfolio_item -->
</template>

<script>
import Vuex from 'vuex'
import { EventBus } from './eventbus'
import formAddRecordPortfolio from './formAddRecordPortfolio'
import formEditOperationPortfolio from './formEditOperationPortfolio'
import popoverOperationDelete from './popoverOperationDelete'
import popoverOperationEdit from './popoverOperationEditPortfolio'
import popoverCoinDelete from './popoverCoinDelete'
import PortfolioExchangeMarkets from './PortfolioExchangeMarkets'
const storeEvent = Vuex.createNamespacedHelpers('portfolio')
export default {
  name: 'PortfolioListItem',
  components: { formAddRecordPortfolio, popoverOperationDelete, popoverOperationEdit, popoverCoinDelete, PortfolioExchangeMarkets, formEditOperationPortfolio },
  props: {
    portfolio: Object,
    item: Object,
    totalPercent: String
  },
  data () {
    return {
      collapseOpen: false
    }
  },
  computed: {
    ...storeEvent.mapGetters({
      getCoinByID: 'getCoinByID',
      currencyConverter: 'currencyConverter',
      currencyConvertUSDToBTC: 'currencyConvertUSDToBTC',
      currentCurrency: 'currentCurrency'
    }),
    coin: function () {
      if (this.getCoinByID(this.item.id)) { return this.getCoinByID(this.item.id) }
    }
  },
  watch: {
    /**
     * Смотрим за объектом portfolio и если он изменился,
     * то закрываем все раскрытые меню и обнуляем донут чарт
     * */
    portfolio (newVal, oldVal) {
      if (newVal.id !== oldVal.id) {
        this.collapseOpen = false
        EventBus.$emit('chart:doughnut:check', 'All', false)
      }
    }
  },
  methods: {
    /**
     * Открыть форму изменения операции
     * */
    toggleEditOperation (id) {
      this.$root.$emit('bv::toggle::collapse', id)
    },
    /**
     * Удалить монету
     * */
    removeCoin () {
      let portfolioChanged = JSON.parse(JSON.stringify(this.portfolio))

      portfolioChanged.coin = portfolioChanged.coin.filter(coin => {
        if (coin.id !== this.item.id) {
          return coin
        }
      })
      this.onDisable(`removeCoinForm-${this.coin.id}`)
      this.collapseOpen = !this.collapseOpen
      this.$store.dispatch('portfolio/changePortfolio', portfolioChanged)
    },
    /**
     * Показать поповер
     * */
    onEnable (index) {
      this.$root.$emit('bv::show::popover', index)
    },
    /**
     * Скрыть поповер
     * */
    onDisable (index) {
      this.$root.$emit('bv::hide::popover', index)
    },
    /**
     * Удалить операцию
     * */
    deleteOperation (operation, index) {
      let portfolioChanged = JSON.parse(JSON.stringify(this.portfolio))

      /**
       * Фильтруем объект портфолио на предмет текущей монеты
       * */
      portfolioChanged.coin.filter(coin => {
        if (coin.id === this.item.id) {
          /**
           * //TODO нужно ли высчитывать количество монет при удалении операции.
           * */
          // coin.amount = parseFloat(coin.amount) - parseFloat(coin.operations[index].quantity)
          coin.operations.splice(index, 1)
        }
        return coin
      })
      this.$store.dispatch('portfolio/changePortfolio', portfolioChanged)
      this.onDisable(`deleteConfirmForm-${index}-${this.item.id}`)
    },
    /**
     * Цена за монету, на которую меняем
     * */
    pricePerCoinSwapped (operation) {
      return `<small>${this.$t('portfolio.IN')} </small>${this.currencyConverter(operation.price_per_coin_swapped, this.currentCurrency.ticker)}`
    },
    /**
     * Тикер обменной монеты
     * */
    swappedCoinTicker (operation) {
      let coin = this.getCoinByID(operation.deal_currency)
      return coin.ticker
    },
    /**
     * Считает количество монет, полученных при обмене
     * */
    countSwappedCoinQuantity (operation) {
      let count = operation.price / operation.price_per_coin_swapped
      let decimals = 4
      return Number(Math.round(count + `e${decimals}`) + `e-${decimals}`)
    },
    operationType (operation) {
      return operation.type
    },
    isPositive (coin) {
      return coin['24_change'] > 0 ? 'positive' : 'negative'
    },
    /**
     * Посчитать стоимость. Количество на цену за еденицу
     * */
    countValue (amount, coinID) {
      if (this.getCoinByID(coinID)) {
        return (parseFloat(this.getCoinByID(coinID)['market_price']) * parseFloat(amount))
      }
    },
    /**
     * Посчитать цену операции.
     * */
    countOperationValue (operation) {
      return (parseFloat(operation.price_per_coin) * parseFloat(operation.quantity))
    },
    /**
     * Скрыть\Показать информацию о монете. Локальный триггер
     * */
    localCollapse () {
      this.collapseOpen = !this.collapseOpen
      if (this.getCoinByID(this.item.id)) {
        EventBus.$emit('chart:doughnut:check', this.getCoinByID(this.item.id)['ticker'], this.collapseOpen)
      }
    },
    /**
     * Скрыть\Показать информацию о монете. Глобальный триггер с события
     * */
    toggleCollapseCoin (e, value) {
      if (e === this.coin.ticker) {
        this.collapseOpen = value
        /**
         * Шлем в чарт сообщение о закрытии\открытии
         * */
        this.$root.$emit('bv::toggle::collapse', `coin-toggle--${e}`, value)
      }
    }
  },
  created () {
    /**
     * Весим событие, при котором срабатывает функция открывающая\закрывающая инфу о коине
     * */
    EventBus.$on('chart:doughnut:grow', this.toggleCollapseCoin)
  },
  destroyed () {
    EventBus.$off('chart:doughnut:grow', this.toggleCollapseCoin)
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/less/vars";
  body /deep/ .popover-remove-coin{
    padding: 8px;
    font-size: 12px;
    text-align: center;
    color: #525c6c;
  }
  .portfolio{
    .removeCoin{
      cursor: pointer;
      position: absolute;
      width: 11px;
      height: 13px;
      right: 17px;
      bottom: 10px;
      background-image: @img-trash;
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      z-index: 11;
    }
    &_item {
      display: flex;
      flex-direction: column;
      width: 100%;
      position: relative;
      background-color: #fafbfc;
      &__head{
        display: flex;
        width: 100%;
      }
      &__body{
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 20px 12px 35px 28px;
        background-color: #fff;
        position: relative;
        &.collapsed{
          display: none;
        }
        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 10px;
          background-image: linear-gradient(180deg, #e0e6ed 0%, rgba(224, 230, 237, 0) 100%);
        }
        &--pseudo{
          position: absolute;
          width: 4px;
          height: 100%;
          left: 0;
          top: 1px;
          z-index: 11;
        }
      }
      &-cell {
        box-sizing: border-box;
        padding: 20px 12px 14px 12px;
        border-right: 1px solid #e9ecee;
        &:last-child {
          border-right: none;
        }
      }
      &:hover {
        background-color: #fff;
        box-shadow: 0 1px 0 #e0e6ed, 0 -1px 0 #e0e6ed;
      }
      &--active {
        box-shadow: 0 1px 0 #e0e6ed, 0 -1px 0 #e0e6ed;
        background-color: #fff;
      }
      &-logo {
        display: inline-block;
        margin-right: 8px;
      }
      &-name {
        width: 20%;
        position: relative;
        padding: 16px 0 12px 20px;
        span {
          color: #333f52;
          font-family: @medium;
          font-weight: 500;
          font-size: 14px;
          line-height: 14px;
          letter-spacing: -0.2px;
          position: relative;
          top: 2px;
        }
        b {
          font-family: @medium;
          font-weight: 500;
          color: #8f96a1;
          letter-spacing: -0.2px;
        }
        &--pseudo{
          position: absolute;
          width: 4px;
          height: 100%;
          left: 0px;
          top: 0px;
          z-index: 11;
        }
      }
      &-amount {
        width: 20%;
        &-wrapper {
          display: flex;
          justify-content: space-between;
        }
        span {
          color: #333f52;
          font-family: @medium;
          font-weight: 500;
          font-size: 16px;
          line-height: 16px;
          text-transform: uppercase;
        }
        b {
          font-family: @medium;
          font-weight: 500;
          font-size: 12px;
        }
      }
      &-edit {
        width: 12px;
        height: 12px;
        background-image: @img-edit;
        &-open{
          background-image: @img-edit-green;
        }
      }
      &-percent {
        width: 6%;
        text-align: center;
        span {
          //margin: auto;
          color: #333f52;
          font-family: @medium;
          font-weight: 500;
          font-size: 16px;
          line-height: 16px;
        }
      }
      &-price {
        width: 12%;
        padding: 14px 12px 0px 12px;
        span /deep/ b {
          font-size: 12px;
        }
        &-usd {
          display: block;
          white-space: nowrap;
          color: #333f52;
          font-family: @medium;
          font-weight: 500;
          font-size: 16px;
          line-height: 16px;
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
      &-24hour {
        width: 10%;
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
            top: 0px;
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
      &-capitalizations {
        width: 13%;
        span {
          color: #707986;
          font-family: @medium;
          font-weight: 500;
          font-size: 16px;
          line-height: 16px;
          text-transform: uppercase;
        }
        b, /deep/ b {
          font-size: 12px;
          font-family: @medium;
        }
      }
      &-volume {
        width: 19%;
        padding: 20px 22px 14px 12px;
        &-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        span {
          color: #707986;
          font-family: @medium;
          font-weight: 500;
          font-size: 16px;
          line-height: 16px;
          text-transform: uppercase;
        }
        b, /deep/ b {
          font-size: 12px;
        }
        .portfolio_item-dropdown {
          width: 12px;
          height: 10px;
          background-image: @img-dropdown-portfolio;
          &-open{
            background-image: @img-dropdown-portfolio-opened;
          }
        }
      }
    }
  }
  .item{
    &__head{
      display: flex;
      width: 100%;
      &__cell {
        height: 100%;
        border-bottom: 1px solid #e9ecee;
        border-left: 1px solid #e9ecee;
        display: inline-flex;
        text-align: center;
        span{
          padding-top: 10px;
          padding-left: 12px;
          padding-bottom: 9px;
          color: #525c6c;
          font-size: 13px;
          font-weight: 400;
          line-height: 12px;
          letter-spacing: -0.09px;
        }
        &:first-child{
          border-left: none;
          span{
            padding-left: 24px;
          }
        }
        &.operation{
          width: 17.6%;
        }
        &.quantity{
          width: 21%;
        }
        &.price{
          width: 18.8%;
        }
        &.price-per-coin{
          width: 42.45%;
          position: relative;
        }
      }
    }
    &__body{
      display: flex;
      width: 100%;
      &__cell {
        border-left: 1px solid #e9ecee;
        display: inline-flex;
        text-align: center;
        height: 100%;
        span{
          padding-top: 14px;
          padding-left: 12px;
          padding-bottom: 15px;
          color: #525c6c;
          font-size: 13px;
          font-weight: 400;
          line-height: 12px;
          letter-spacing: -0.09px;
          font-family: @medium;
          white-space: nowrap;
          b, /deep/ b {
            font-weight: 500;
            font-size: 12px;
          }
        }
        &:first-child{
          border-left: none;
        }
        &.operation{
          width: 17.6%;
          position: relative;
          padding-left: 26px;
          .type{
            position: relative;
            padding-left: 22px;
            &::before {
              content: "";
              position: absolute;
              width: 17px;
              height: 17px;
              left: -1px;
              top: 12px;
              background-position: center;
              background-repeat: no-repeat;
              z-index: 11;
            }
            &.bought {
              color: #45af37;
              &::before {
                background-image: @img-bought;
              }
            }
            &.sold {
              color: #ff3657;
              &::before {
                background-image: @img-sold;
              }
            }
            &.swapped {
              color: #1991eb;
              &::before {
                background-image: @img-swapped;
              }
            }
          }
        }
        &.quantity{
          width: 21%;
          flex-wrap: wrap;
          position: relative;
          span {
            padding-top: 12px;
            color: #333f52;
            font-family: @medium;
            font-weight: 500;
            font-size: 16px;
            line-height: 16px;
            text-align: left;
            width: 100%;
          }
          .swapped_coin{
            position: absolute;
            bottom: 0px;
            height: 12px;
            color: #707986;
            font-size: 11px;
            font-weight: 500;
            line-height: 11px;
            text-transform: uppercase;
            letter-spacing: -0.04px;
            /deep/ small{
            }
            /deep/ b{
            }
          }
        }
        &.price{
          width: 18.8%;
          span {
            padding-top: 12px;
            color: #333f52;
            font-family: @medium;
            font-weight: 500;;
            font-size: 16px;
            line-height: 16px;
            b, /deep/ b {
              font-size: 12px;
            }
          }
        }
        &.price-per-coin{
          width: 42.45%;
          position: relative;
          align-items: center;
          span {
            padding-top: 12px;
            color: #333f52;
            font-family: @medium;
            font-weight: 500;
            font-size: 16px;
            line-height: 16px;
            text-align: left;
            width: 100%;
          }
          .swapped_coin{
            position: absolute;
            bottom: 0px;
            height: 12px;
            color: #707986;
            font-size: 11px;
            font-weight: 500;
            line-height: 11px;
            text-transform: uppercase;
            letter-spacing: -0.04px;
            /deep/ small{
            }
            /deep/ b{
            }
          }
          .edit {
            position: relative;
            display: inline-block;
            margin-right: 28px;
            padding: 0 0 1px 0;
            color: #45af37;
            font-family: @main-font;
            font-weight: 400;
            font-size: 12px;
            line-height: 12px;
            border: none;
            background: none;
            outline: none;
            border-bottom: 1px dashed #45af37;
            cursor: pointer;
            white-space: nowrap;
            text-transform: capitalize;
            &::before {
              content: "";
              position: absolute;
              width: 12px;
              height: 12px;
              left: -17px;
              top: 0;
              background-image: @img-edit-green;
              background-position: center;
              background-repeat: no-repeat;
              z-index: 11;
            }
          }
          .delete {
            position: relative;
            padding: 0 0 3px 0;
            margin-right: 16px;
            color: #8f96a1;
            font-family: @main-font;
            font-weight: 400;
            font-size: 10px;
            line-height: 14px;
            border: none;
            background: none;
            outline: none;
            cursor: pointer;
            white-space: nowrap;
            text-transform: capitalize;
            &::before {
              content: "";
              position: absolute;
              width: 7px;
              height: 8px;
              left: -13px;
              top: 2px;
              background-image: @img-delete-grey;
              background-position: center;
              background-repeat: no-repeat;
              z-index: 11;
            }
          }
        }
      }
      .form_td{
        padding: 0px 12px 0px 58px;
      }
      .form_add_record{
        display: inline-block;
        margin-top: 12px;
      }
      .exchange{

      }
    }
  }
</style>
