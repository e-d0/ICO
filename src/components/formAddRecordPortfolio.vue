<template>
  <div :class="['portfolio_add_record_form', { 'toggled': toggled }]">
    <a href="#" @click.prevent="toggled = !toggled" class="btn btn-add-record">{{ $t('portfolio.Add_Record') }}</a>
    <b-collapse :id="`formEditRecord-${selectedCoin.id}`" v-model="toggled" >
      <form action="#" class="add-record-form ">

      <div class="add-record-form_wrapper">
        <div class="add-record-form_name">
          <label :for="[`nameRecord--${selectedCoin.id}`]">{{ $t('portfolio.Operation') }}</label>
          <select size="1" name="name[]" v-model="selectedOperation" :id="[`nameRecord--${selectedCoin.id}`]">
            <option v-for="( operation, index ) in operations"
                    :key="index"
                    :value="operation">
              {{ $t(`portfolio.${operation.name}`) }}
            </option>
          </select>
        </div>

        <div class="add-record-form_amount">
          <label :for="[`amountRecord--${selectedCoin.id}`]">{{ $t('portfolio.Quantity') }}</label>
          <input type="text" v-model="quantity" name="amount" :id="[`amountRecord--${selectedCoin.id}`]" placeholder="">
          <span class="count count--up" @click="++quantity"></span>
          <span class="count count--down count--active" @click="quantity > 0 ? --quantity : false"></span>
        </div>

        <template v-if="selectedOperation.name !== 'Change'">
          <div class="add-record-form_price">
          <label :for="[`priceRecord--${selectedCoin.id}`]"> {{ $t('portfolio.Price') }}</label>
          <div class="add-record-form_price-input-wrapper">
            <input type="text" name="price" v-model="price" :id="[`priceRecord--${selectedCoin.id}`]" placeholder="">
            <select v-if="currencies"
                    size="1"
                    name="name[]"
                    id="priceSelectRecord"
                    :required="true"
                    v-model="selectedCurrency">
              <option v-for="currency in currencies"
                      :key="currency.id"
                      :value="currency"
              >{{ currency.ticker }}</option>
            </select>
          </div>

          <div class="add-record-form_price-links">
            <a href="#" @click.prevent="marketPrice = false" :class="['add-record-form_price-ico',{'active': marketPrice === false }]">{{ $t('portfolio.ICO_PRICE') }} </a>
            <a href="#" @click.prevent="marketPrice = true" :class="['add-record-form_price-market',{'active': marketPrice === true }]">{{ $t('portfolio.MARKET_PRICE') }} </a>
          </div>
        </div>
        </template>

        <template v-else>
          <div class="add-record-form_name">
            <label :for="[`record-coin-name--${selectedCoin.id}`]">{{ $t('portfolio.coin') }}</label>
            <select  v-if="coins" v-model="coinToChange" size="1" name="name[]" :id="[`record-coin-name--${selectedCoin.id}`]">
              <option v-for="coin in filteredCoins()"
                      :key="coin.id"
                      :value="coin">{{ coin.ticker }}</option>
            </select>
          </div>
        </template>

        <div class="add-record-form_total">
          <label>{{ $t('portfolio.Total') }} </label>
          <span v-html="countTotal"></span>
        </div>
      </div>
      <!-- /.add-record-form_wrapper -->
      <div class="add-record-form_buttons">
        <button class="btn btn-add-record" @click.prevent="addOperation()" name="button">{{ $t('form.Save') }}</button>
      </div>
      <!-- /.add-record-form_buttons -->

    </form>
    </b-collapse>
    <!-- /.add-record-form -->
  </div>
</template>

<script>
import Vuex from 'vuex'
import { round } from './mathHelpers'
const storeEvent = Vuex.createNamespacedHelpers('portfolio')
export default {
  name: 'formAddRecordPortfolio',
  props: {
    /**
     * Глобальный объект портфолио
     * */
    portfolio: Object,
    /**
     * Текущая монета из списка
     * */
    selectedCoin: Object
  },
  data () {
    return {
      marketPrice: true,
      toggled: false,
      operations: [
        {name: 'Buy', done: 'bought'},
        {name: 'Sell', done: 'sold'},
        {name: 'Change', done: 'swapped'}
      ],
      /**
       *Операция по умолчанию
       * */
      selectedOperation: {name: 'Buy', done: 'bought'},
      selectedCurrency: null,
      coinToChange: null,
      priceStorage: 0,
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
      if (this.marketPrice) {
        return this.getCoinByID(this.selectedCoin.id)['market_price']
      } else {
        return this.getCoinByID(this.selectedCoin.id)['ico_price']
      }
    },
    /**
     * Цена монеты, в которой раскрыта форма
     * */
    coinToChangePrice: function () {
      if (this.marketPrice) {
        return this.getCoinByID(this.coinToChange.id)['market_price']
      } else {
        return this.getCoinByID(this.coinToChange.id)['ico_price']
      }
    },
    /**
     * Цена операции из поля ввод
     * */
    price: {
      get () {
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
          } else {
            operation = Number(newValue)
          }

          this.quantity = round(operation, 7)
          this.priceStorage = Number(newValue)
        }
      }
    },
    /**
     * Подсчет  итога операции в выбранной валюте
     * */
    countTotal: function () {
      if (this.selectedCurrency &&
        this.selectedCoin !== (null && 0)) {
        let operation
        if (this.selectedOperation.name === 'Change') {
          let equasion = ((this.selectedCoinPrice / this.coinToChangePrice) * this.quantity)
          operation = round(equasion, 7)
          return `${operation} ${this.coinToChange.ticker}`
        } else {
          operation = this.selectedCoinPrice * this.quantity
          return this.currencyConverter(operation, this.selectedCurrency.ticker)
        }
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
    /**
     * Показываем все монеты , кроме текущей
     * */
    filteredCoins () {
      if (this.portfolio) {
        let coins = JSON.parse(JSON.stringify(this.coins))
        coins = coins.filter(coin => {
          if (this.selectedCoin.id !== coin.id) {
            return coin
          }
        })
        return coins
      }
    },
    /**
     * Отправка операции на сервер
     * */
    addOperation () {
      if (this.quantity > 0) {
        let swapped = this.selectedOperation.name === 'Change'

        swapped ? this.exchangeOperation() : this.buySellOperation()

        this.priceStorage = 0
        this.quantity = 0
        this.total = 0
      }
    },
    /**
     * Операции покупки, продажи
     * param (operation) Object
     * */
    buySellOperation () {
      let portfolioChanged = JSON.parse(JSON.stringify(this.portfolio))

      let operation = {
        date: this.$moment().toISOString(),
        deal_currency: this.selectedCurrency.id,
        price: this.currencyConverter(this.price, 'USD', false),
        price_per_coin: this.selectedCoinPrice,
        quantity: this.quantity,
        type: this.selectedOperation.done
      }
      /**
       * Фильтруем объект портфолио на предмет текущей монеты
       * */
      portfolioChanged.coin.filter(coin => {
        if (coin.id === this.selectedCoin.id) {
          /**
           * Если операция продажи, то вычитаем необходимое количестов монет
           * */
          let operationAmount = this.selectedOperation.name === 'Sell' ? parseFloat(coin.amount) - parseFloat(this.quantity) : parseFloat(coin.amount) + parseFloat(this.quantity)
          coin.amount = round(operationAmount, 7)
          coin.operations.push(operation)
        }
        return coin
      })

      this.$store.dispatch('portfolio/changePortfolio', portfolioChanged)
    },
    /**
     * Операции обмена
     * param (operation) Object
     * */
    exchangeOperation () {
      let portfolioChanged = JSON.parse(JSON.stringify(this.portfolio))

      /**
       * Цена обмена, выраженная в долларах одинакова для обоих операций
       * */
      let priceOfTheDeal = this.currencyConverter((this.selectedCoinPrice * this.quantity), 'USD', false)
      /**
       * Формируем операцию для текущего коина
       * В поле deal_currency хранится идентификатор монеты на которую был совершен обмен
       * */
      let operationSelectedCoin = {
        date: this.$moment().toISOString(),
        deal_currency: this.coinToChange.id,
        price: priceOfTheDeal,
        price_per_coin: this.selectedCoinPrice,
        price_per_coin_swapped: this.coinToChangePrice,
        quantity: this.quantity,
        type: this.selectedOperation.done
      }

      portfolioChanged.coin.filter(coin => {
        if (coin.id === this.selectedCoin.id) {
          /**
           * Вычитаем необходимое количестов монет из исходных монет
           * */
          coin.amount = round(parseFloat(coin.amount) - parseFloat(this.quantity), 7)
          coin.operations.push(operationSelectedCoin)
        }
        return coin
      })

      /**
       * Количество добавляемых едениц к целевой монете равно : отношение цены исходной монеты к монете обмена, умноженное на количество монет на обмен
       * Округляем до 7 знаков в большую сторону
       * */
      let quantityToAdd = round(((this.selectedCoinPrice / this.coinToChangePrice) * this.quantity), 7)
      /**
       * Формируем операцию для монеты на которую хотим обменять
       * Вторая операция необходима, так как обмен совершен внутри портфолио.
       * Операция будет сохраняться с расчетом на текущую монету
       * В поле deal_currency хранится идентификатор монеты на которую был совершен обмен
       * Дата подставляется из операции выбранной монеты, чтобы время обмена было полностью идентичны.
       * */
      let operationCoinToChange = {
        date: operationSelectedCoin.date,
        deal_currency: this.selectedCoin.id,
        price: priceOfTheDeal,
        price_per_coin: this.coinToChangePrice,
        price_per_coin_swapped: this.selectedCoinPrice,
        quantity: quantityToAdd,
        type: this.selectedOperation.done
      }

      if (portfolioChanged.coin.some(coin => coin.id === this.coinToChange.id)) {
        portfolioChanged.coin.filter(coin => {
          if (coin.id === this.coinToChange.id) {
            /**
             * Добавляем необходимое количестов монет к монете обмена
             * */
            coin.amount = round((parseFloat(coin.amount) + quantityToAdd), 7)
            coin.operations.push(operationCoinToChange)
          }
          return coin
        })
      } else {
        let coin = {
          id: this.coinToChange.id,
          amount: this.quantity,
          operations: [operationCoinToChange]
        }
        portfolioChanged.coin.push(coin)
      }

      this.$store.dispatch('portfolio/changePortfolio', portfolioChanged)
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
        /**
         * Заполняем по умолчанию
         * */
        this.coinToChange = coinsTemp['0']
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
  .portfolio_add_record_form {
    position: relative;
    padding: 16px 16px 0px 28px;
    //border-radius: 4px;
    background-color: #ffffff;
    border-top: none;
    box-shadow: none;
    .add-record-form {
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
  }
  .portfolio_add_record_form.toggled {
    background-color: rgba(232, 237, 242, 0.3);

    & > .btn-add-record {

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
</style>
