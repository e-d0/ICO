<template>
  <div class="portfolio_form">
    <div v-b-toggle="'formAddDeleteCoin'" class="portfolio_form-close">
    </div>
    <h3>{{ $t('form.add_coin') }}</h3>
    <form class="add-coin-form">

      <div class="add-coin-form_wrapper">
        <div class="add-coin-form_name">
          <label for="coin-name">{{ $t('portfolio.coin') }}</label>
          <select  v-if="filteredCoins()" v-model="selectedCoin" size="1" name="name[]" id="coin-name">
            <option v-for="coin in filteredCoins()"
                    :key="coin.id"
                    :value="coin">{{ coin.ticker }}</option>
          </select>
        </div>
        <div class="add-coin-form_amount">
          <label for="amount">{{ $t('portfolio.Quantity') }}</label>
          <input type="text" v-model="quantity" name="amount" id="amount" placeholder="">
          <span class="count count--up" @click="++quantity"></span>
          <span class="count count--down count--active" @click="quantity > 0 ? --quantity : false"></span>
        </div>
        <div class="add-coin-form_price">
          <label for="price"> {{ $t('portfolio.Price') }}</label>
          <div class="add-coin-form_price-input-wrapper">
            <input type="text" name="price" v-model="price" id="price" placeholder="">
            <select v-if="currencies"
                    size="1"
                    name="name[]"
                    id="priceselect"
                    :required="true"
                    v-model="selectedCurrency">
              <option v-for="currency in currencies"
                      :key="currency.id"
                      :value="currency"
              >{{ currency.ticker }}</option>
            </select>
          </div>
          <div class="add-coin-form_price-links">
            <a href="#" @click.prevent="marketPrice = false" :class="['add-coin-form_price-ico',{'active': marketPrice === false }]">{{ $t('portfolio.ICO_PRICE') }} </a>
            <a href="#" @click.prevent="marketPrice = true" :class="['add-coin-form_price-market',{'active': marketPrice === true }]">{{ $t('portfolio.MARKET_PRICE') }} </a>
          </div>
        </div>
        <div class="add-coin-form_total">
          <label>{{ $t('portfolio.Total') }} </label>
          <span v-html="countTotal"></span>
        </div>
      </div>
      <!-- /.add-coin-form_wrapper -->
      <div class="add-coin-form_buttons">
        <button class="btn" @click.prevent="addCoin()" name="button">Save</button>
      </div>
      <!-- /.add-coin-form_buttons -->

    </form>
    <!-- /.add-coin-form -->
  </div>
</template>

<script>
import { round } from './mathHelpers'
import Vuex from 'vuex'
const storeEvent = Vuex.createNamespacedHelpers('portfolio')
export default {
  name: 'formAddDeleteCoin',
  props: {
    /**
       * Глобальный объект портфолио
       * */
    portfolio: Object
  },
  data () {
    return {
      selectedCoin: null,
      marketPrice: true,
      toggled: false,
      selectedCurrency: null,
      coinToChange: null,
      priceStorage: Number(0),
      quantity: 0,
      total: 0
    }
  },
  computed: {
    ...storeEvent.mapGetters({
      getCoinByID: 'getCoinByID',
      currencyConverter: 'currencyConverter',
      coins: 'coins',
      getCurrencyByTicker: 'getCurrencyByTicker',
      currentCurrency: 'currentCurrency',
      currencies: 'currencies'
    }),
    /**
       * Цена монеты, в которой раскрыта форма
       * */
    selectedCoinPrice: function () {
      if (this.selectedCoin) {
        if (this.marketPrice) {
          return this.getCoinByID(this.selectedCoin.id)['market_price']
        } else {
          return this.getCoinByID(this.selectedCoin.id)['ico_price']
        }
      }
    },
    /**
       * Цена операции из поля ввод
       * */
    price: {
      get () {
        if (isNaN(this.priceStorage)) return 0
        return this.priceStorage
      },
      /**
         * Пересчитываем количество при вводе нового значения цены
         * */
      set (newValue) {
        if (newValue) {
          let operation
          if (newValue !== 0) {
            /**
               * Умножаем введенное значение цены на цену за покупаемую монету
               * и делим результат на цену текущей монеты
               * */
            let multipl = (parseFloat(newValue) * parseFloat(this.selectedCurrency.price))
            operation = (multipl / parseFloat(this.selectedCoinPrice))
            this.quantity = round(operation, 7)
            this.priceStorage = Number(newValue)
          } else {
            this.quantity = 0
            this.priceStorage = 0
          }
        }
      }
    },
    countTotal: function () {
      if (this.selectedCurrency &&
        this.selectedCoin !== (null && 0)) {
        let operation = this.selectedCoinPrice * this.quantity
        return this.currencyConverter(operation, this.selectedCurrency.ticker)
      }
      return 0
    }
  },
  watch: {
    /**
       * На лету подставляем глобальное значение валюты из фильтра валют,
       * и пересчитываем все значения
       * */
    currentCurrency: function (newValue) {
      this.selectedCurrency = newValue
      let operation = this.quantity * parseFloat(this.currencyConverter(this.selectedCoinPrice, newValue.ticker, false))
      let decimals = newValue.ticker !== 'USD' ? 7 : 2
      this.priceStorage = round(operation, decimals)
    },
    /**
       * На лету подставляем значение количества,
       * и пересчитываем все значения
       * */
    quantity: function (val) {
      if (this.selectedCurrency &&
          this.selectedCoin !== null) {
        let operation = val / this.selectedCurrency.price * this.selectedCoinPrice
        let decimals = this.selectedCurrency.ticker !== 'USD' ? 7 : 2
        this.priceStorage = round(operation, decimals)
      }
    },
    /**
       * На лету подставляем значение текущей цены,
       * и пересчитываем все значения
       * */
    marketPrice: function () {
      if (this.selectedCurrency &&
          this.selectedCoin !== null) {
        let operation = this.quantity / this.selectedCurrency.price * this.selectedCoinPrice
        let decimals = this.selectedCurrency.ticker !== 'USD' ? 7 : 2
        this.priceStorage = round(operation, decimals)
      }
    }
  },
  methods: {
    addCoin () {
      if (this.quantity > 0) {
        let portfolioChanged = JSON.parse(JSON.stringify(this.portfolio))
        let operation = {
          date: this.$moment().toISOString(),
          deal_currency: this.selectedCurrency.id,
          price: this.currencyConverter(this.price, 'USD', false),
          price_per_coin: this.selectedCoinPrice,
          quantity: this.quantity,
          type: 'bought'
        }

        if (portfolioChanged.coin.some(coin => coin.id === this.selectedCoin.id)) {
          portfolioChanged.coin.filter(coin => {
            if (coin.id === this.selectedCoin.id) {
              coin.amount = round(parseFloat(coin.amount) + parseFloat(this.quantity), 7)
              coin.operations.push(operation)
            }
            return coin
          })
        } else {
          let coin = {
            id: this.selectedCoin.id,
            amount: this.quantity,
            operations: [operation]
          }
          portfolioChanged.coin.push(coin)
        }

        this.$store.dispatch('portfolio/changePortfolio', portfolioChanged)
        this.priceStorage = 0
        this.quantity = 0
        this.total = 0
        this.selectedCoin = this.filteredCoins()['1'] ? this.filteredCoins()['1'] : this.filteredCoins()['0']
      }
    },
    /**
     * Фильтруем монеты ,которые уже есть в портфолио
     * */
    filteredCoins () {
      if (this.portfolio) {
        let portfolio = this.portfolio
        let coins = JSON.parse(JSON.stringify(this.coins))
        coins = coins.filter(coin => {
          if (!portfolio.coin.some(item => item.id === coin.id)) {
            return coin
          }
        })
        return coins
      }
    },
    /**
       * Получаем список валют через хранилище
       * */
    setDefaultCurrency () {
      this.$store.dispatch('portfolio/getCurrencies').then((response) => {
        /**
           * Заполняем по умолчанию
           * */
        this.selectedCurrency = response['0']
      }, error => {
        console.log(error)
      })
    },
    /**
       * Получаем список монет через хранилище
       * */
    async setDefaultCoin () {
      let coinsTemp = await this.$store.dispatch('portfolio/getCoins')
      if (coinsTemp) {
        this.selectedCoin = this.filteredCoins()['0'] ? this.filteredCoins()['0'] : null
      }
    }
  },
  created () {
    this.setDefaultCoin()
  },
  mounted () {
    /**
       * Страховка на случай, если не получено значение валюты из глобального фильтра
       * */
    this.selectedCurrency = this.currentCurrency ? this.currentCurrency : this.setDefaultCurrency()
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/less/vars";
  .portfolio_form {
    position: relative;
    padding: 20px 20px 5px;
    border-top: 4px solid @accent-color;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 10px 30px rgba(82, 92, 108, 0.15);
    h3{
      margin-bottom: 16px;
      color: #525c6c;
      font-family: @main-font;
      font-weight: 700;
      font-size: 16px;
      line-height: 24px;
    }
    &-close {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 13px;
      height: 13px;
      background-color: transparent;
      border: 0;
      outline: 0;
      cursor: pointer;
      z-index: 30000;
      &::before {
        content: "";
        position: absolute;
        width: 12px;
        height: 1px;
        top: 6px;
        left: 1px;
        background-color: #707986;;
        transform: rotate(45deg);
      }
      &::after {
        content: "";
        position: absolute;
        width: 12px;
        height: 1px;
        top: 6px;
        left: 1px;
        background-color: #707986;;
        transform: rotate(-45deg);
      }
    }
    .btn-add-record {
      padding: 13px 16px 10px;
      box-shadow: 0 2px 0 #3b962f;
      border-radius: 4px;
      background-color: #45af37;
      text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
      color: #ffffff;
      font-family: @main-font;
      font-weight: 500;
      font-size: 14px;
      line-height: 11px;
      letter-spacing: -0.23px;
      &--active {
        padding: 13px 16px 10px;
        box-shadow: 0 2px 0 #707986, inset 0 2px 4px rgba(1, 1, 1, 0.3);
        border-radius: 4px;
        background-color: #8f96a1;
        text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
        color: #ffffff;
        font-family: @main-font;
        font-weight: 500;
        font-size: 14px;
        line-height: 11px;
        letter-spacing: -0.23px;
      }
    }
    .add-coin-form {
      &--hidden {
        display: none;
      }
      display: flex;
      justify-content: space-between;
      text-align: left;
      label {
        color: #333f52;
        font-family: @main-font;
        font-weight: 400;
        font-size: 14px;
        line-height: 16px;
      }
      &_wrapper {
        display: flex;
        //flex-grow: 2;
        //align-items: center;
        margin-bottom: 20px;
        width: 76%;
      }
      &_buttons {
        display: flex;
        align-items: center;
        margin-top: -15px;
        margin-left: 30px;
        button {
          padding: 12px 16px 10px;
          text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
          background-color: @accent-color;
          color: #ffffff;
          font-family: @main-font;
          font-weight: 500;
          font-size: 14px;
          line-height: 14px;
        }
      }
      &_name {
        position: relative;
        display: flex;
        flex-direction: column;
        margin-right: 30px;
        flex-grow: 1;
        &::before {
          content: "";
          position: absolute;
          width: 8px;
          height: 4px;
          right: 18px;
          top: 41px;
          background-image: @img-select-arrow;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 11;
        }
        select {
          max-width: 264px;
          padding: 10px 32px 8px 12px;
          color: #525c6c;
          font-family: @main-font;
          font-weight: 400;
          font-size: 15px;
          line-height: 16px;
          text-transform: uppercase;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.09);
          border-radius: 4px;
          border: 1px solid #44af36;
          background-color: #ffffff;
        }
      }
      &_amount {
        position: relative;
        margin-right: 30px;
        display: flex;
        flex-direction: column;
        input {
          padding: 12px;
          width: 104px;
          height: 36px;
          font-size: 15px;
          font-family: @main-font;
          font-weight: 400;
          line-height: 16px;
          text-transform: uppercase;
          border-radius: 4px;
          border: 1px solid #c5d0de;
          background-color: #ffffff;
        }
        .count {
          position: absolute;
          display: block;
          width: 9px;
          height: 9px;
          background-color: #c5d0de;
          cursor: pointer;
          &--down {
            top:44px;
            right: 9px;
            &::before {
              content: "";
              position: absolute;
              width: 5px;
              height: 1px;
              background-color: #fff;
              top: 4px;
              left: 2px;
            }
          }
          &:hover {
            background-color: #8f96a1;
          }
          &--up {
            top:32px;
            right: 9px;
            &::before {
              content: "";
              position: absolute;
              width: 5px;
              height: 1px;
              background-color: #fff;
              top: 4px;
              left: 2px;
            }
            &::after {
              content: "";
              position: absolute;
              width: 5px;
              height: 1px;
              background-color: #fff;
              top: 4px;
              left: 2px;
              transform: rotate(90deg);
            }
          }
        }
      }
      &_price {
        position: relative;
        display: flex;
        flex-direction: column;
        margin-right: 32px;
        &::before {
          content: "";
          position: absolute;
          width: 8px;
          height: 4px;
          right: 18px;
          top: 41px;
          background-image: @img-select-arrow;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 11;
        }
        &-input-wrapper {
          display: flex;
        }
        &-ico, &-market {
          margin-right: 16px;
          color: @main-color;
          font-family: @main-font;
          font-weight: 700;
          font-size: 10px;
          line-height: 16px;
          text-transform: uppercase;
          text-decoration: underline;
          text-decoration-style: dashed;
          &.active,&:hover{
            color: #8f96a1;
            font-family: @main-font;
            font-weight: 700;
            font-size: 10px;
            line-height: 16px;
            text-transform: uppercase;
            text-decoration: underline;
          }
        }
        input {
          padding: 12px;
          width: 154px;
          height: 36px;
          font-size: 15px;
          font-family: @main-font;
          font-weight: 400;
          line-height: 16px;
          text-transform: uppercase;
          border-radius: 4px 0 0 4px;
          border: 1px solid #c5d0de;
          background-color: #ffffff;
        }
        select {
          margin-left: -1px;
          padding: 0px 32px 0px 12px;
          color: #525c6c;
          font-family: @main-font;
          font-weight: 400;
          font-size: 15px;
          line-height: 15px;
          text-transform: uppercase;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.09);
          border-radius: 0 4px 4px 0;
          border: 1px solid #c5d0de;
          background-color: #ffffff;
        }
      }
      &_total {
        display: flex;
        flex-direction: column;
        margin-right: auto;;
        span {
          color: #333f52;
          font-family: @main-font;
          font-weight: 500;
          font-size: 16px;
          line-height: 37px;
          white-space: nowrap;
          b {
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
