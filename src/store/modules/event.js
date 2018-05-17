import axios from 'axios'
import moment from 'moment'

const state = {
  events: [],
  types: [],
  filters: {
    'types': [],
    'names': []
  },
  dates: [],
  ICO: []
}

const getters = {
  ICO: state => state.ICO,
  events: state => state.events,
  /**
   * Актуальные события с заданного времени
   * */
  actualEvents: state => (time) => {
    let arr = [...state.events]
    let currTime = ''
    if (typeof time === 'string') {
      currTime = moment(time)
    } else {
      currTime = time
    }
    /**
     * Фильр по времени и по типу
     * */
    return arr.filter(event => {
      if (state.filters.types instanceof Array && state.filters.types.includes(event.type) && moment(event.ends) > currTime) {
        return event
      }
    }
    )
  },
  /**
   * Прошедие события с заданного времени
   * */
  pastEvents: state => (time) => {
    let arr = [...state.events]
    let currTime = ''
    if (typeof time === 'string') {
      currTime = moment(time)
    } else {
      currTime = time
    }

    /**
     * Фильр по времени и по типу
     * */
    return arr.filter(event => {
      if (state.filters.types instanceof Array && state.filters.types.includes(event.type) && moment(event.ends) < currTime) {
        return event
      }
    }
    )
  },
  types: state => state.types,
  filters: state => state.filters,
  getFiltersNames: state => state.filters.names,
  dates: state => {
    let arr = []
    state.dates.forEach(el => { arr.push(new Date(el)) })
    return arr
  },
  /**
   * Ищем имя типа события по кодовому идентификатору.
   * Используем геттер, так как результат кэшируется
   * и это дает самую быстрый результат.
   * */
  getTypeNameByCode: (state, getters) => (code) => {
    /**
     * find оказался самым быстрым, среди переборщиков(for, findIndex)
     * */
    if (code !== undefined && getters.types.length > 0) {
      let obj = getters.types.find(item => {
        if (item.code === code) return item
      })
      return obj.name
    }
  },
  /**
   * Фильтрация по собранным данным. Оптимизировал под минимум операций, как мог.
   * */
  filteredEvents: (state) => {
    if (state.filters.types !== undefined && state.filters.types.length !== 0) {
      return state.events.filter(event => {
        /**
         * фильтр по имени
         * */
        if (
          state.filters.names &&
          state.filters.names.length > 0 &&
          state.filters.types instanceof Array && state.filters.types.includes(event.type)
        ) {
          for (let item = 0; item < state.filters.names.length; item++) {
            if (state.filters.names[item].name === (event.name)) {
              return event
            }
          }
        } else {
          /**
           * фильтр по типу
           * */
          if (state.filters.types instanceof Array && state.filters.types.includes(event.type)) {
            return event
          }
        }
      })
    }
  }
}

const actions = {
  getICO (context) {
    return new Promise((resolve, reject) => {
      axios.get(context.rootGetters.api_url + '/ICO').then((response) => {
        console.log('promise at events action DONE')
        context.commit('getICO', response.data)
        resolve(response)
      }, error => {
        handleXHRerrors(error)
        reject(error)
      })
    })
  },
  setDates (context, payload) {
    console.log('set date to storage', payload)
    context.commit('setDates', payload.data)
  },
  setFiltersNames (context, payload) {
    context.commit('setFiltersNames', payload)
  },
  removeFiltersNames (context, payload) {
    console.log('removeFiltersNames', payload)
    context.commit('removeFiltersNames', payload.item)
  },
  setFiltersTypes (context, payload) {
    context.commit('setFiltersTypes', payload.val)
  },
  setFilters (context, payload) {
    console.log('setFilters value at storage ', payload)
    context.commit('setFilters', payload)
  },
  /**
   * Получаем типы событий , используя промис
   * */
  getTypes (context) {
    return new Promise((resolve, reject) => {
      axios.get(context.rootGetters.api_url + '/types').then((response) => {
        console.log('promise at events action DONE')
        context.commit('getTypes', response.data)
        resolve(response)
      }, error => {
        handleXHRerrors(error)
        reject(error)
      })
    })
  },
  addEvent (context, payload) {
    context.commit('addEvent', payload)
  },
  deleteEvent (context, payload) {
    axios.delete(context.rootGetters.api_url + '/events', {data: {id: payload.id}}).then((oResponse) => {
      context.commit('deleteEvent', payload)
    }).catch(handleXHRerrors)
  },
  changeEvent (context, payload) {
    console.log(payload)
    /**
     * удаляем временное поле даты
     * */
    delete payload.value.date
    axios.patch(context.rootGetters.api_url + `/events/${payload.value.id}`, payload.value).then((response) => {
      console.log(response)
      response['id'] = payload.id
      /**
       * Приводим к формату приложения дату, принятую с сервера
       * */
      response.data['date'] = new Date(response.data.starts)
      context.commit('createOrUpdateEvent', response.data)
    }).catch(handleXHRerrors)
  },
  createEvent (context, payload) {
    axios.post(context.rootGetters.api_url + '/events', payload.value).then((response) => {
      context.commit('createOrUpdateEvent', response.data)
    }).catch(handleXHRerrors)
  },
  getEvents (context, payload) {
    axios.get(context.rootGetters.api_url + '/events').then((oResponse) => {
      /**
       * Создаем поле начала события в каждом объекте события и приводим к объекту Date с форматом браузера
       * */
      let events = oResponse.data.map(item => {
        item.date = new Date(item.starts)
        return item
      })
      context.commit('getEvents', events)
      console.log('events get at action getEvents', events)
    }).catch(handleXHRerrors)
  },
  getEventById: (context, payload) => {
    console.log(payload.id)
    axios.get(context.rootGetters.api_url + '/events?id=' + payload.id).then((oResponse) => {
      return new Promise((resolve, reject) => {
        context.commit('setEditedEvent', oResponse.data)
        resolve()
      })
    }).catch(handleXHRerrors)
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
  getICO: (state, objEvent) => {
    state.ICO = objEvent
    console.log('write object ICOs to State', objEvent)
  },
  setDates: (state, objEvent) => {
    state.dates = objEvent
  },
  setFiltersTypes: (state, objEvent) => {
    state.filters.types = objEvent
  },
  setFiltersNames: (state, objEvent) => {
    state.filters.names = objEvent
  },
  removeFiltersNames: (state, objEvent) => {
    state.filters.names = state.filters.names.filter(event => event.id !== objEvent.id)
    console.log('filtered', state.events)
  },
  setFilters: (state, objEvent) => {
    state.filters = objEvent
  },
  getTypes: (state, objEvent) => {
    state.types = objEvent
    console.log('write object types to State', objEvent)
  },
  createOrUpdateEvent: (state, objEvent) => {
    console.log('createOrUpdateEvent objEvent', objEvent)
    if (state.events) {
      let foundEvent = state.events.filter(event => event.id === objEvent.id)
      if (foundEvent) {
        // Deduplicate
        for (let i in foundEvent) {
          mutations.deleteEvent(state, foundEvent[i])
        }
      }
      if (typeof objEvent.id !== 'undefined') {
        mutations.updateEvent(state, objEvent)
      } else {
        mutations.addEvent(state, objEvent)
      }
    }
  },
  addEvent: (state, objEvent) => {
    state.events = [...state.events, objEvent]
  },
  updateEvent: (state, objEvent) => {
    mutations.deleteEvent(state, objEvent.id)
    state.events = [...state.events, objEvent]
  },
  deleteEvent: (state, objEvent) => {
    state.events = state.events.filter(event => event.id !== objEvent.id)
    console.log('filtered', state.events)
  },
  getEvents: (state, objEvent) => {
    state.events = objEvent
    console.log('write object event to State', objEvent)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
