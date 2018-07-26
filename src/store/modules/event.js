import axios from 'axios'
import moment from 'moment'

const state = {
  events: [],
  types: [],
  filters: {
    'types': [],
    'names': [],
    'my_ico': false
  },
  dates: [],
  /**
   * Вынести в отдельное хранилище
   * */
  ICO: []
}

/**
 * Главная функция ,создающая события с служебными полями
 * @param {array} events
 * @return {array}
 * */
let generatedEvents = (events) => {
  let arr = []
  let eventsArr = [...events]
  /**
   * фильтруем события и добавляем служебные поля.
   * При отправке на сервер, служебыне поля будут удалены.
   * */
  for (let i = 0; i < eventsArr.length; i++) {
    if (eventsArr[i].starts !== undefined) {
      let elem = Object.assign({}, eventsArr[i])
      elem.date = new Date(eventsArr[i].starts)
      elem.isStart = true
      elem.tempType = elem.type === 'ico' ? 'start' : elem.type
      arr.push(elem)
    }
    if (eventsArr[i].ends !== undefined) {
      let elem = Object.assign({}, eventsArr[i])
      elem.date = new Date(eventsArr[i].ends)
      elem.isStart = false
      elem.tempType = elem.type === 'ico' ? 'end' : elem.type
      arr.push(elem)
    }
  }
  return arr
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
      if (state.filters.types instanceof Array && state.filters.types.includes(event.tempType) && moment(event.ends) > currTime) {
        return state.filters['my_ico'] === false ? event : (event['user_ico'] === true ? event : false)
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
      if (state.filters.types instanceof Array && state.filters.types.includes(event.tempType) && moment(event.ends) < currTime) {
        /**
         * Проверка фильтра my_ico
         * */
        return state.filters['my_ico'] === false ? event : (event['user_ico'] === true ? event : false)
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
          state.filters.types instanceof Array && state.filters.types.includes(event.tempType)
        ) {
          for (let item = 0; item < state.filters.names.length; item++) {
            if (state.filters.names[item].name === (event.name)) {
              /**
               * Проверка на фильтр my_ico
               * */
              return state.filters['my_ico'] === false ? event : (event['user_ico'] === true ? event : false)
            }
          }
        } else {
          /**
           * фильтр по типу
           * */
          if (state.filters.types instanceof Array && state.filters.types.includes(event.tempType)) {
            /**
             * Проверка на фильтр my_ico
             * */
            return state.filters['my_ico'] === false ? event : (event['user_ico'] === true ? event : false)
          }
        }
      })
    }
  },
  groupedByHoursWithEvents: (getters) => (eventsArr) => {
    let events = eventsArr !== undefined ? eventsArr : [...getters.filteredEvents]
    let groupedEvents = []
    /**
     * Для каждого часа в массиве часов
     * */
    for (let i = 0; i < 24; i++) {
      let group = []
      for (let e = events.length - 1; e >= 0; e--) {
        /**
         * получаем час обрабатываемого события
         * */
        let hour = moment(events[e].date).hours()
        /**
         * Если час события в заданном промежутке, то добавь в группу
         * */
        if (i === hour) {
          group.push(events[e])
          // console.log('added', events[e])
          events.splice(e, 1)
        }
      }
      groupedEvents[i] = group
    }
    for (let i = 0; i < 24; i++) {
      /**
       * индекс предыдущего часа в массиве часов
       * */
      // let prevHour = i === 0 ? 0 : i - 1
      /**
       * индекс следующего события
       * */
      let nextHour = i === 23 ? 23 : i + 1
      /**
       * Разгица в минутах, при которой группируются события
       * */
      let diff = 45
      /**
       * Если разница между текущим и следующим меньше diff минут,то сгруппируй
       * */
      if (groupedEvents[i].length && groupedEvents[nextHour] !== undefined && groupedEvents[nextHour].length) {
        let k
        for (k = 0; k < groupedEvents[nextHour].length; k++) {
          /**
           * Проверка на разницу в час элемент предыдущей группы и текущий проверяемый час
           */
          let check1 = groupedEvents[i].length && moment(groupedEvents[i][groupedEvents[i].length - 1].date).minutes() >= 60 - diff
          let check2 = groupedEvents[nextHour][k] !== undefined && moment(groupedEvents[nextHour][k].date).minutes() <= diff
          if (check1 && check2) {
            /**
             * Добавить элемент из следующей в текущею группы
             * */
            // if (groupedEvents[i].length > 1) {
            groupedEvents[nextHour].unshift(groupedEvents[i][groupedEvents[i].length - 1])
            groupedEvents[i].splice(groupedEvents[i].length - 1, 1)
            k = 0
            // }
          }
        }
      }
      // if (groupedEvents[i].length && groupedEvents[nextHour] !== undefined && groupedEvents[nextHour].length) {
      //   if (groupedEvents[i].length > 0 && groupedEvents[nextHour] !== undefined && groupedEvents[nextHour].length) {
      //     let hourEl = groupedEvents[i][groupedEvents[i].length - 1]
      //     let k
      //     for (k = 0; k < groupedEvents[nextHour].length; k++) {
      //       /**
      //        * Проверка на разницу в час элемент предыдущей группы и текущий проверяемый час
      //        */
      //         // let checksDiff = groupedEvents[nextHour][k] !== undefined ? moment(groupedEvents[nextHour][k].date).diff(moment(hourEl.date), 'minutes') < diff : false
      //       let checksDiff = groupedEvents[nextHour][k] !== undefined ? moment(groupedEvents[nextHour][k].date).getMinutes() < diff : false
      //       if (checksDiff) {
      //         /**
      //          * Добавить элемент из следующей в текущею группы
      //          * */
      //         // if (groupedEvents[i].length > 1) {
      //         groupedEvents[i].push(groupedEvents[nextHour][k])
      //         groupedEvents[nextHour].splice(k, 1)
      //         // }
      //       }
      //     }
      //   }
      // }
      // if (groupedEvents[i].length && groupedEvents[prevHour] !== undefined && groupedEvents[prevHour].length) {
      //   if (groupedEvents[i].length > 0 && groupedEvents[prevHour] !== undefined && groupedEvents[prevHour].length) {
      //     let hourEl = groupedEvents[i][0]
      //     let k
      //     for (k = groupedEvents[prevHour].length - 1; k >= 0; k--) {
      //       /**
      //        * Проверка на разницу в час элемент предыдущей группы и текущий проверяемый час
      //        */
      //       let checksDiff = groupedEvents[prevHour][k] !== undefined ? moment(hourEl.date).diff(moment(groupedEvents[prevHour][k].date), 'minutes') < diff : false
      //       if (checksDiff) {
      //         /**
      //          * Добавить элемент из следующей в текущею группы
      //          * */
      //         // if (groupedEvents[i].length > 0) {
      //           groupedEvents[i].push(groupedEvents[prevHour][k])
      //           groupedEvents[prevHour].splice(k, 1)
      //         // }
      //       }
      //     }
      //   }
      // }
    }
    // console.log('GROUUUUUPPPP', groupedEvents)
    // let dates = groupedEvents.map(item => {
    //   let arr = []
    //   for (let i = 0; i < item.length; i++) {
    //     arr.push(moment(item[i].starts).format('DD HH mm'))
    //   }
    //   return arr
    // })
    // console.log('GROUUUUUPPPP', dates)
    return groupedEvents
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
  setFilterMyICO (context, payload) {
    console.log('setFilterMyICO value at storage ', payload)
    context.commit('setFilterMyICO', payload)
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
     * приводим event в соответствие с сервером
     * */
    delete payload.value.date
    delete payload.value.isStart
    delete payload.value.tempType
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
      context.commit('getEvents', oResponse.data)
      console.log('events get at action getEvents', oResponse.data)
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
  setFilterMyICO (state, objValue) {
    state.filters.my_ico = objValue
  },
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
    /**
     * Создаем служебные поля для обновленных событий
     * */
    let serviceEvents = generatedEvents([objEvent])
    state.events = [...state.events, ...serviceEvents]
  },
  updateEvent: (state, objEvent) => {
    mutations.deleteEvent(state, objEvent.id)
    /**
     * Создаем служебные поля для обновленных событий
     * */
    let serviceEvents = generatedEvents([objEvent])
    state.events = [...state.events, ...serviceEvents]
  },
  deleteEvent: (state, objEvent) => {
    state.events = state.events.filter(event => event.id !== objEvent.id)
    console.log('filtered', state.events)
  },
  getEvents: (state, objEvents) => {
    state.events = generatedEvents(objEvents)
    console.log('write object event to State', objEvents)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
