import axios from 'axios'
import { prettifyNumber, round } from '../../components/mathHelpers'

const state = {
  currencies: [],
  currentCurrency: {},
  currentPortfolio: {},
  coins: [],
  portfolios: [],
  tradeMarkets: []
}

const getters = {
  tradeMarkets: state => state.tradeMarkets,
  currencies: state => state.currencies,
  currentCurrency: state => state.currentCurrency,
  currentPortfolio: state => state.currentPortfolio,
  /**
   * Получить монету по ticker
   * @param {array} state
   * @param {string} ticker
   * return object
   * */
  getCurrencyByTicker: state => (ticker) => {
    if (ticker !== undefined) {
      let isEqual = (element, index, array) => {
        if (element.ticker === ticker) return element
        return false
      }

      return state.currencies.find(isEqual)
    }
  },
  /**
   * Считает в выбранной валюте
   * @param {float, number} amount
   * @param {string} currencyTicker
   * return string converted value
   * */
  currencyConverter: (state, getters) => (amount, currencyTicker, icon = true) => {
    let currencyObj = getters.getCurrencyByTicker(currencyTicker)
    if (currencyObj) {
      let convertedValue = amount / currencyObj.price
      let signsAfterDigit = currencyTicker !== 'USD' ? 7 : 2
      let glifIcon = `<b>${currencyObj.icon}</b>`
      // return `<span class="currency-icon" style="background-image:url(${currencyObj.icon});"></span>${convertedValue.toFixed(signsAfterDigit)}`
      if (!icon) {
        return `${prettifyNumber(round(convertedValue, signsAfterDigit))}`
      } else {
        return glifIcon + ` ${prettifyNumber(round(convertedValue, signsAfterDigit))}`
      }
    }
  },
  currencyConvertUSDToBTC: (state, getters) => (amount) => {
    let currencyTicker = 'BTC'
    let currencyObj = getters.getCurrencyByTicker(currencyTicker)
    if (currencyObj) {
      let convertedValue = amount / currencyObj.price
      let signsAfterDigit = 7
      return `${prettifyNumber(round(convertedValue, signsAfterDigit))} BTC`
    }
  },
  coins: state => state.coins,
  portfolios: state => state.portfolios,
  /**
   * Получить монету по id
   * @param {array} state
   * @param {string} id
   * return object
   * */
  getCoinByID: state => (id) => {
    if (id !== undefined) {
      let isEqual = (element, index, array) => {
        if (element.id === id) return element
        return false
      }

      return state.coins.find(isEqual)
    }
  }
}

const actions = {
  /**
   * Получаем текущие операции дял чарта портфолоио с сервера
   * */
  getPortfolioOperationsPerDay (context, filterInfo) {
    console.log('getPortfolioOperationsPerDay', filterInfo)
    return new Promise((resolve, reject) => {
      axios.get(context.rootGetters.api_url + '/operations_by_day').then((oResponse) => {
        console.log('OperationsPerDay get at promise action getPortfolioOperationsPerDay', oResponse.data)
        resolve(oResponse.data)
      }, error => {
        handleXHRerrors(error)
        reject(error)
      })
    })
  },
  setCurrentCurrency (context, payload) {
    console.log('setCurrentCurrency', payload)
    context.commit('setCurrentCurrency', payload)
  },
  setCurrentPortfolio (context, payload) {
    console.log('setCurrentPortfolio', payload)
    context.commit('setCurrentPortfolio', payload)
  },
  getCurrencies (context) {
    return new Promise((resolve, reject) => {
      axios.get(context.rootGetters.api_url + '/currencies').then((oResponse) => {
        console.log('promise get at action getCurrencies', oResponse.data)
        context.commit('getCurrencies', oResponse.data)
        resolve(oResponse.data)
      }, error => {
        handleXHRerrors(error)
        reject(error)
      })
    })
  },
  getCoins (context) {
    return new Promise((resolve, reject) => {
      axios.get(context.rootGetters.api_url + '/coins').then((oResponse) => {
        console.log('coins get at promise action getCoins', oResponse.data)
        context.commit('getCoins', oResponse.data)
        resolve(oResponse.data)
      }, error => {
        handleXHRerrors(error)
        reject(error)
      })
    })
  },
  getTradeMarkets (context) {
    return new Promise((resolve, reject) => {
      axios.get(context.rootGetters.api_url + '/markets').then((oResponse) => {
        console.log('tradeMarkets get at promise action getTradeMarkets', oResponse.data)
        context.commit('getTradeMarkets', oResponse.data)
        resolve(oResponse.data)
      }, error => {
        handleXHRerrors(error)
        reject(error)
      })
    })
  },
  getPortfolios (context, payload) {
    axios.get(context.rootGetters.api_url + '/portfolios').then((oResponse) => {
      context.commit('getPortfolios', oResponse.data)
      console.log('events get at action getPortfolios', oResponse.data)
    }).catch(handleXHRerrors)
  },
  deletePortfolio (context, payload) {
    axios.delete(context.rootGetters.api_url + '/portfolios', {data: {id: payload.id}}).then((oResponse) => {
      context.commit('deletePortfolio', payload)
    }).catch(handleXHRerrors)
  },
  changePortfolio (context, payload) {
    console.log(payload)
    axios.patch(context.rootGetters.api_url + `/portfolios/${payload.id}`, payload).then((response) => {
      console.log(response)
      context.commit('createOrUpdatePortfolio', response.data)
    }).catch(handleXHRerrors)
  },
  createPortfolio (context, payload) {
    axios.post(context.rootGetters.api_url + '/portfolios', payload).then((response) => {
      context.commit('createOrUpdatePortfolio', response.data)
    }).catch(handleXHRerrors)
  },
  addPortfolio (context, payload) {
    context.commit('addPortfolio', payload)
  }
}

let handleXHRerrors = function (error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data)
    console.log(error.response.status)
    console.log(error.response.headers)
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request)
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message)
  }
  console.log(error.config)
}

const mutations = {
  setCurrentCurrency: (state, objCurrency) => {
    state.currentCurrency = objCurrency
    console.log('write object currentCurrency to State', objCurrency)
  },
  setCurrentPortfolio: (state, objPortfolio) => {
    state.currentPortfolio = objPortfolio
    console.log('write object currentPortfolio to State', objPortfolio)
  },
  getCoins: (state, objCoin) => {
    state.coins = objCoin
    console.log('write object coins to State', objCoin)
  },
  getTradeMarkets: (state, objMarkets) => {
    state.tradeMarkets = objMarkets
    console.log('write object tradeMarkets to State', objMarkets)
  },
  getCurrencies: (state, objCurrencies) => {
    state.currencies = objCurrencies
    console.log('write object Currencie to State', objCurrencies)
  },
  getPortfolios: (state, objPortfolio) => {
    state.portfolios = objPortfolio
    console.log('write object portfolio to State', objPortfolio)
  },
  createOrUpdatePortfolio: (state, objPortfolio) => {
    console.log('createOrUpdatePortfolio objPortfolio', objPortfolio)
    if (state.portfolios) {
      let foundPortfolio = state.portfolios.filter(portfolio => portfolio.id === objPortfolio.id)
      if (foundPortfolio && typeof objPortfolio.id !== 'undefined') {
        mutations.updatePortfolio(state, objPortfolio)
      } else {
        mutations.addPortfolio(state, objPortfolio)
      }
    }
  },
  addPortfolio: (state, objPortfolio) => {
    state.portfolios = [...state.portfolios, ...objPortfolio]
  },
  updatePortfolio: (state, objPortfolio) => {
    /**
     * https://github.com/vuejs/vuex/issues/416
     * Нужно заставить массив измениться ,иначе состояние не запустит триггер и не обновит данные в приложении
     * */
    state.portfolios = state.portfolios.map((portfolio, index) => { if (portfolio.id === objPortfolio.id) { portfolio = objPortfolio } return portfolio })
  },
  deletePortfolio: (state, objPortfolio) => {
    state.portfolios = state.portfolios.filter(portfolio => portfolio.id !== objPortfolio.id)
    console.log('filtered', state.portfolios)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
