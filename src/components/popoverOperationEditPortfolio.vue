<template>

  <b-popover :target="`editConfirmForm-${index}-${coinId}`"
             triggers="click"
             placement="left"
             container="app"
             :ref="`editConfirmForm-${index}-${coinId}`"
             :index="index">

        <div class="popover-edit" v-if="currentCoin">
          <div class="popover_close">
            <a href="#" @click.prevent="$emit('close')"></a>
          </div>
          <div  :class="['popover-edit_header', `popover-edit_header--${currentCoin.ticker}`]">
            <span>{{ $t('form.edit') }}</span>
            <span class="popover-edit_name">{{ currentCoin.title }} · <b>{{ currentCoin.ticker }}</b></span>
          </div>
          <div class="popover-edit_form">
            <form action="#" class="edit-form">
              <fieldset>
                <div class="edit-form_wrapper">
                   <div class="edit-form_type">
                    <label :for="[`type-edit-form--${coinId}`]">{{ $t('portfolio.Operation') }}</label>
                    <select size="1" v-model="selectedOperation" :id="[`type-edit-form--${coinId}`]">
                      <option v-for="( operation, index ) in operations"
                              :key="index"
                              :value="operation">
                        {{ $t(`portfolio.${operation}`) }}
                      </option>
                    </select>
                  </div>
                   <div class="edit-form_amount">
                    <label :for="[`amount-edit-form--${coinId}`]">{{ $t('portfolio.Quantity') }}</label>
                    <input type="text" v-model="quantity" name="amount" :id="[`amount-edit-form--${coinId}`]" placeholder="">
                    <span class="count count--up" @click="++quantity"></span>
                    <span class="count count--down count--active" @click="quantity > 0 ? --quantity : false"></span>
                  </div>
                  <template v-if="selectedOperation !== 'swapped'">
                    <div class="edit-form_currency">
                      <div class="edit-form_price">
                        <label :for="[`edit-form-price-coin-${coinId}`]"> {{ $t('portfolio.Price_per_coin') }}</label>
                        <div class="edit-form_price-input-wrapper">
                          <input type="text" name="price" v-model="pricePerCoin" :id="[`edit-form-price-coin-${coinId}`]" placeholder="">
                          <select v-if="currencies"
                                  size="1"
                                  id="priceSelectPricePerCoin"
                                  :required="true"
                                  v-model="selectedCurrency">
                            <option v-for="currency in currencies"
                                    :key="currency.id"
                                    :value="currency"
                            >{{ currency.ticker }}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div class="edit-form_currency second">
                      <div class="edit-form_price">
                        <label :for="[`edit-form-price-${coinId}`]"> {{ $t('portfolio.Price') }}</label>
                        <div class="edit-form_price-input-wrapper">
                          <input type="text" name="price" v-model="price" :id="[`edit-form-price-${coinId}`]" placeholder="">
                          <div class="current" v-if="selectedCurrency">{{ selectedCurrency.ticker }}</div>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="edit-form_type">
                      <label :for="[`type-edit-form--${coinId}`]">{{ $t('portfolio.coin') }}</label>
                      <select v-if="coins"
                              size="1"
                              id="priceSelectCoinToChange"
                              :required="true"
                              v-model="coinToChange">
                        <option v-for="coin in coins"
                                :key="coin.id"
                                :value="coin"
                        >{{ coin.ticker }}</option>
                      </select>
                    </div>
                    <div class="edit-form_amount">
                      <label :for="[`edit-form-price-${coinId}`]"> {{ $t('portfolio.Price_per_coin') }}</label>
                      <div class="edit-form_type-input-wrapper">
                        <input type="text" name="price" v-model="pricePerCoin" :id="[`edit-form-price-${coinId}`]" placeholder="">
                      </div>
                    </div>
                    <div class="edit-form_amount">
                      <label :for="[`edit-form-price-${coinId}`]"> {{ $t('portfolio.Price_per_coin') }} {{ $t('portfolio.swapped') }}</label>
                      <div class="edit-form_type-input-wrapper">
                        <input type="text" name="price" v-model="pricePerCoinSwapped" :id="[`edit-form-price-${coinId}`]" placeholder="">
                      </div>
                    </div>
                  </template>
                </div>
                <!-- /.edit-form_wrapper -->
              </fieldset>
              <!--<fieldset class="fieldset">-->
                <!--<div class="edit-form_textarea">-->
                  <!--<label for="textarea"><a href="#">Удалить комментарий</a></label>-->
                  <!--<textarea placeholder="комментарий" id="textarea"></textarea>-->
                <!--</div>-->
                <!--<div class="edit-form_buttons">-->
                  <!--<button class="btn btn-primary" type="submit" name="button">Сохранить</button>-->
                  <!--<a href="#">Удалить монету</a>-->
                <!--</div>-->
              <!--</fieldset>-->
              <div class="edit-form_buttons">

                   <button @click.prevent="save()" class="btn btn-primary" type="submit" name="button">{{ $t('form.Save')}}</button>
              </div>
            </form>
            <!-- /.add-coin-form -->
          </div>
          <!-- /.popover-edit_form -->
        </div>
  </b-popover>
</template>

<script>
import Vuex from 'vuex'
const storeEvent = Vuex.createNamespacedHelpers('portfolio')
export default {
  name: 'popoverOperationEdit',
  props: {
    index: Number,
    coinId: Number,
    operation: Object
  },
  data () {
    return {
      operations: [
        'bought',
        'sold',
        'swapped'
      ],
      selectedOperation: null,
      selectedCurrency: null,
      coinToChange: null,
      priceStorage: 0,
      pricePerCoinStorage: 0,
      pricePerCoinSwappedStorage: 0,
      quantity: 0
    }
  },
  computed: {
    ...storeEvent.mapGetters({
      getCoinByID: 'getCoinByID',
      currencyConverter: 'currencyConverter',
      currentCurrency: 'currentCurrency',
      currencies: 'currencies',
      coins: 'coins'
    }),
    currentCoin: function () {
      return this.getCoinByID(this.coinId)
    },
    price: {
      get () {
        if (this.selectedCurrency &&
          this.selectedCoin !== (null && 0)) {
          let operation = this.quantity / this.selectedCurrency.price * this.pricePerCoin
          let decimals = this.selectedCurrency.ticker !== 'USD' ? 7 : 2
          return Number(Math.round(operation + `e${decimals}`) + `e-${decimals}`)
        }
        return 0
      },
      set (newValue) {
        if (newValue) {
          this.quantity = newValue / (this.pricePerCoin * this.quantity)
          this.priceStorage = newValue
        }
      }
    },
    pricePerCoin: {
      get () {
        if (this.selectedCurrency &&
          this.selectedCoin !== (null && 0)) {
          let operation = this.currencyConverter(this.pricePerCoinStorage, this.selectedCurrency.ticker, false)
          let decimals = this.selectedCurrency.ticker !== 'USD' ? 7 : 2
          return Number(Math.round(operation + `e${decimals}`) + `e-${decimals}`)
        }
        return 0
      },
      set (newValue) {
        if (newValue) {
          this.pricePerCoinStorage = this.currencyConverter(newValue, this.currentCurrency.ticker, false)
        }
      }
    },
    pricePerCoinSwapped: {
      get () {
        if (this.selectedCurrency &&
          this.selectedCoin !== (null && 0)) {
          let operation = this.currencyConverter(this.pricePerCoinSwappedStorage, this.selectedCurrency.ticker, false)
          let decimals = this.selectedCurrency.ticker !== 'USD' ? 7 : 2
          return Number(Math.round(operation + `e${decimals}`) + `e-${decimals}`)
        }
        return 0
      },
      set (newValue) {
        if (newValue) {
          this.pricePerCoinSwappedStorage = this.currencyConverter(newValue, this.currentCurrency.ticker, false)
        }
      }
    }
  },
  watch: {
  },
  created () {
    this.selectedCurrency = this.currencies[0]
    this.coinToChange = this.coins[0]
    this.quantity = this.operation.quantity
    this.selectedOperation = this.operation.type
    this.pricePerCoinStorage = this.operation.price_per_coin
    if (this.operation.price_per_coin_swapped !== undefined) this.pricePerCoinSwappedStorage = this.operation.price_per_coin_swapped
    this.priceStorage = this.operation.price
  },
  mounted () {
  },
  methods: {
    save () {
      let tempOperation = JSON.parse(JSON.stringify(this.operation))
      if (tempOperation.type !== 'swapped') {
        tempOperation.quantity = this.quantity
        tempOperation.price_per_coin = this.pricePerCoinStorage
        tempOperation.price = this.price
        tempOperation.deal_currency = this.selectedCurrency
        tempOperation.type = this.selectedOperation
        tempOperation.date = this.$moment().toISOString()
        this.$emit('confirm', tempOperation)
      } else {
        tempOperation.deal_currency = this.coinToChange.id
        tempOperation.price = this.currencyConverter((this.pricePerCoinStorage * this.quantity), 'USD', false)
        tempOperation.price_per_coin = this.pricePerCoinStorage
        tempOperation.price_per_coin_swapped = this.pricePerCoinSwappedStorage
        tempOperation.quantity = this.quantity
        tempOperation.type = this.selectedOperation
        this.$emit('confirm', tempOperation)
      }
    },
    /**
       * Закрываем окно вызовом события и уникального Id. https://bootstrap-vue.js.org/docs/components/popover/
       * */
    closePopup () {
      this.$root.$emit('bv::hide::popover', `editConfirmForm-${this.index}-${this.coinId}`)
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/less/vars";

  .popover {
    margin: 0;
    padding: 0;
  }
  .popover-body {
    padding: 0!important;
    margin: 0;
    border: none;
  }
  .mypopover_header{
    background-image: linear-gradient(225deg, #8392d9 0%, #3841ba 100%)
  }

  .popover-edit {
    position: relative;
    width: 330px;
    box-shadow: 0 0 36px rgba(82, 92, 108, 0.5);
    background-color: #ffffff;
    border: none;
    &_header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 23px 20px 17px;
      &--bts {
        background-color: #8f5bc0;
      }
      &--MON {
        background-color: #c28f58;
      }
      &--OPA {
        background-color: #429db0;
      }
      &--EOS {
        background-color: #ffa635;
      }
      &--XMR {
        background-color: #6982fc;
      }
      &--DASH {
        background-color: #ff6d71;
      }
      &--NEO {
        background-color: #bcbdbc;
      }
      &--ETH {
        background-color: #85b222;
      }
      span {
        color: #ffffff;
        font-family: @main-font;
        font-size: 16px;
        font-weight: 700;
        line-height: 16px;
        letter-spacing: -0.2px;
        text-transform: capitalize;
      }
      b {
        font-size: 14px;
        font-weight: 500;
      }
    }
    &_form {
      .edit-form {
        padding: 20px;
        &_wrapper {
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          margin-bottom: 20px;
        }
        label {
          color: #333f52;
          font-family: @main-font;
          font-size: 14px;
          font-weight: 500;
          line-height: 16px;
          a {
            position: relative;
            padding-left: 15px;
            color: #8f96a1;
            font-family: @main-font;
            font-size: 12px;
            font-weight: 400;
            line-height: 12px;
            text-decoration: underline;
            &:hover {
              text-decoration: none;
            }
            &::before {
              content: "";
              position: absolute;
              width: 9px;
              height: 9px;
              left: 1px;
              top: 4px;
              background-image: @img-comments-dark;
              background-position: center;
              background-repeat: no-repeat;
              z-index: 11;
            }
          }
        }
        &_amount {
          position: relative;
          display: flex;
          flex-direction: column;
          margin-bottom: 20px;
          input {
            padding: 12px;
            width: 100%;
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
          display: flex;
          flex-direction: column;
          &-input-wrapper{
            display: flex;
            .current{
              width: 26%;
              padding: 10px 12px 8px;
              color: #525c6c;
              font-family: 'Roboto', sans-serif;
              font-size: 15px;
              font-weight: 400;
              line-height: 16px;
              background-color: #ffffff;
            }
          }
          input {
            padding: 10px 12px 8px;
            width: 74%;
            /*color: #525c6c;*/
            /*font-size: 15px;*/
            /*font-weight: 400;*/
            /*line-height: 16px;*/
            /*text-transform: uppercase;*/
            /*box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.25);*/
            /*border-radius: 4px;*/
            /*border: 1px solid #c5d0de;*/
            /*background-color: #ffffff;*/
            height: 36px;
            font-size: 15px;
            font-family: 'Roboto', sans-serif;
            font-weight: 400;
            line-height: 16px;
            text-transform: uppercase;
            border-radius: 4px 0 0 4px;
            border: 1px solid #c5d0de;
            background-color: #ffffff;
          }
        }
        &_type {
          display: flex;
          flex-direction: column;
          margin-bottom: 20px;
          &-input-wrapper{
            display: flex;
          }
          select {
            padding: 10px 12px 8px;
            width: 100%;
            /*color: #525c6c;*/
            /*font-size: 15px;*/
            /*font-weight: 400;*/
            /*line-height: 16px;*/
            /*text-transform: uppercase;*/
            /*box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.25);*/
            /*border-radius: 4px;*/
            /*border: 1px solid #c5d0de;*/
            /*background-color: #ffffff;*/
            height: 36px;
            font-size: 15px;
            font-family: 'Roboto', sans-serif;
            font-weight: 400;
            line-height: 16px;
            text-transform: uppercase;
            border-radius: 4px 0 0 4px;
            border: 1px solid #c5d0de;
            background-color: #ffffff;
          }
        }
        &_currency {
          display: flex;
          flex-direction: column;
          position: relative;
          margin-bottom: 20px;
          &::before {
            content: "";
            position: absolute;
            width: 8px;
            height: 4px;
            right: 14px;
            top: 40px;
            background-image: @img-select-arrow;
            background-position: center;
            background-repeat: no-repeat;
            z-index: 11;
          }
          select {
            width: 26%;
            padding: 10px 12px 8px;
            color: #525c6c;
            font-family: @main-font;
            font-size: 15px;
            font-weight: 400;
            line-height: 16px;
            box-shadow: 0 1px 0 #e2e7ee;
            border-radius: 4px;
            border: 1px solid rgba(197, 208, 222, 0.5);
            background-color: #ffffff;
          }
        }
        &_currency.second{
          &::before {
            display: none;
          }
          select {
            width: 26%;
            padding: 10px 12px 8px;
            color: #525c6c;
            font-family: @main-font;
            font-size: 15px;
            font-weight: 400;
            line-height: 16px;
            box-shadow: 0 1px 0 #e2e7ee;
            border-radius: 4px;
            border: 1px solid rgba(197, 208, 222, 0.5);
            background-color: #ffffff;
          }
        }
        &_textarea {
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
          textarea {
            padding: 10px 12px;
            width: 100%;
            height: 88px;
            font-size: 14px;
            font-weight: 400;
            line-height: 16px;
            box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.25);
            border-radius: 4px;
            border: 1px solid #c5d0de;
            background-color: #ffffff;
          }
        }
        &_buttons {
          display: flex;
          align-items: center;
          a {
            position: relative;
            margin-left: auto;
            color: #ff3657;
            font-family: @main-font;
            font-size: 10px;
            font-weight: 400;
            line-height: 14px;
            &::before {
              content: "";
              position: absolute;
              width: 9px;
              height: 9px;
              left: -15px;
              top: 2px;
              background-image: @img-delete-icon;
              background-position: center;
              background-repeat: no-repeat;
              z-index: 11;
            }
          }
          .btn {
            padding: 12px 16px 11px;
            box-shadow: 0 2px 0 #3b962f;
            border-radius: 4px;
            text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
            background-color: @accent-color;
            color: #ffffff;
            font-family: @main-font;
            font-size: 14px;
            font-weight: 500;
            line-height: 14px;
          }
        }
      }
    }
  }
  .popover_close {
    a {
      position: absolute;
      width: 22px;
      height: 22px;
      background-color: #fff;
      top: -11px;
      right: -11px;
      border-radius: 50%;
      &::before {
        content: "";
        position: absolute;
        width: 12px;
        height: 1px;
        top: 11px;
        right: 5px;
        background-color: #525c6c;
        transform: rotate(45deg);
      }
      &::after {
        content: "";
        position: absolute;
        width: 12px;
        height: 1px;
        top: 11px;
        right: 5px;
        background-color: #525c6c;
        transform: rotate(-45deg);
      }
    }
  }

</style>
