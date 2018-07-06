import Vue from 'vue'
import moment from 'moment'

/**
 * Основной объект для хранения событий
 */
export const EventBus = new Vue()

/**
 * Проверка на наличие строки в объекте
 * @param {object} obj
 * @return {object}
 */
const tryParse = obj => (typeof obj === 'string' ? new Date(obj) : obj)

/**
 * Проверка даты события и даты ячейки
 * @param {*} one
 * @param {*} two
 * @return {boolean}
 */
export const isSameDay = (one, two) => {
  const oneDate = tryParse(one)
  const twoDate = tryParse(two)
  if ((oneDate || twoDate) !== undefined) {
    if (
      oneDate.getHours() === twoDate.getHours() &&
        oneDate.getDate() === twoDate.getDate() &&
        oneDate.getMonth() === twoDate.getMonth() &&
        oneDate.getFullYear() === twoDate.getFullYear()
    ) {
      return true
    } else {
      return false
    }
  }
}

/**
 * Проверка даты события и даты ячейки
 * на совпадение года ,месяца,дня
 * @param {*} one
 * @param {*} two
 * @return {boolean}
 */
export const isSameOnlyDate = (one, two) => {
  const oneDate = tryParse(one)
  const twoDate = tryParse(two)
  if ((oneDate || twoDate) !== undefined) {
    if (
      oneDate.getDate() === twoDate.getDate() &&
      oneDate.getMonth() === twoDate.getMonth() &&
      oneDate.getFullYear() === twoDate.getFullYear()
    ) {
      return true
    } else {
      return false
    }
  }
}

// /**
//  * Проверка даты события и даты ячейки, а так же добавление
//  * событий пределах часа
//  * @param {*} filteredEvents
//  * @param {*} currentEl
//  * @return {array}
//  */
// export const groupedByHoursWithEvents = (filteredEvents) => {
//   let events = filteredEvents
//   let groupedEvents = []
//   /**
//    * Для каждого часа в массиве часов
//    * */
//   for (let i = 0; i < 24; i++) {
//     let group = []
//     for (let e = events.length - 1; e >= 0; e--) {
//       /**
//        * получаем час обрабатываемого события
//        * */
//       let hour = moment(events[e].date).hours()
//       /**
//        * Если час события в заданном промежутке, то добавь в группу
//        * */
//       if (i === hour) {
//         group.push(events[e])
//         // console.log('added', events[e])
//         events.splice(e, 1)
//       }
//     }
//     groupedEvents[i] = group
//   }
//   for (let i = 0; i < 24; i++) {
//     /**
//      * индекс предыдущего часа в массиве часов
//      * */
//     let prevHour = i === 0 ? 0 : i - 1
//     /**
//      * индекс следующего события
//      * */
//     let nextHour = i === 23 ? 23 : i + 1
//     /**
//      * Разгица в минутах, при которой группируются события
//      * */
//     let diff = 45
//     /**
//      * Если разница между текущим и следующим меньше diff минут,то сгруппируй
//      * */
//     if (groupedEvents[i].length && groupedEvents[nextHour] !== undefined && groupedEvents[nextHour].length) {
//       let k
//       for (k = 0; k < groupedEvents[nextHour].length; k++) {
//         /**
//          * Проверка на разницу в час элемент предыдущей группы и текущий проверяемый час
//          */
//           // let checksDiff = groupedEvents[nextHour][k] !== undefined ? moment(groupedEvents[nextHour][k].date).diff(moment(hourEl.date), 'minutes') < diff : false
//         let check1 = groupedEvents[i].length && moment(groupedEvents[i][groupedEvents[i].length - 1].date).minutes() >= 60 - diff
//         let check2 = groupedEvents[nextHour][k] !== undefined && moment(groupedEvents[nextHour][k].date).minutes() <= diff
//         if (check1 && check2) {
//           /**
//            * Добавить элемент из следующей в текущею группы
//            * */
//           // if (groupedEvents[i].length > 1) {
//           groupedEvents[nextHour].unshift(groupedEvents[i][groupedEvents[i].length - 1])
//           groupedEvents[i].splice(groupedEvents[i].length - 1, 1)
//           k = 0
//           // }
//         }
//       }
//     }
//     // if (groupedEvents[i].length && groupedEvents[nextHour] !== undefined && groupedEvents[nextHour].length) {
//     //   if (groupedEvents[i].length > 0 && groupedEvents[nextHour] !== undefined && groupedEvents[nextHour].length) {
//     //     let hourEl = groupedEvents[i][groupedEvents[i].length - 1]
//     //     let k
//     //     for (k = 0; k < groupedEvents[nextHour].length; k++) {
//     //       /**
//     //        * Проверка на разницу в час элемент предыдущей группы и текущий проверяемый час
//     //        */
//     //         // let checksDiff = groupedEvents[nextHour][k] !== undefined ? moment(groupedEvents[nextHour][k].date).diff(moment(hourEl.date), 'minutes') < diff : false
//     //       let checksDiff = groupedEvents[nextHour][k] !== undefined ? moment(groupedEvents[nextHour][k].date).getMinutes() < diff : false
//     //       if (checksDiff) {
//     //         /**
//     //          * Добавить элемент из следующей в текущею группы
//     //          * */
//     //         // if (groupedEvents[i].length > 1) {
//     //         groupedEvents[i].push(groupedEvents[nextHour][k])
//     //         groupedEvents[nextHour].splice(k, 1)
//     //         // }
//     //       }
//     //     }
//     //   }
//     // }
//     // if (groupedEvents[i].length && groupedEvents[prevHour] !== undefined && groupedEvents[prevHour].length) {
//     //   if (groupedEvents[i].length > 0 && groupedEvents[prevHour] !== undefined && groupedEvents[prevHour].length) {
//     //     let hourEl = groupedEvents[i][0]
//     //     let k
//     //     for (k = groupedEvents[prevHour].length - 1; k >= 0; k--) {
//     //       /**
//     //        * Проверка на разницу в час элемент предыдущей группы и текущий проверяемый час
//     //        */
//     //       let checksDiff = groupedEvents[prevHour][k] !== undefined ? moment(hourEl.date).diff(moment(groupedEvents[prevHour][k].date), 'minutes') < diff : false
//     //       if (checksDiff) {
//     //         /**
//     //          * Добавить элемент из следующей в текущею группы
//     //          * */
//     //         // if (groupedEvents[i].length > 0) {
//     //           groupedEvents[i].push(groupedEvents[prevHour][k])
//     //           groupedEvents[prevHour].splice(k, 1)
//     //         // }
//     //       }
//     //     }
//     //   }
//     // }
//   }
//   // console.log('GROUUUUUPPPP', groupedEvents)
//   // let dates = groupedEvents.map(item => {
//   //   let arr = []
//   //   for (let i = 0; i < item.length; i++) {
//   //     arr.push(moment(item[i].starts).format('DD HH mm'))
//   //   }
//   //   return arr
//   // })
//   // console.log('GROUUUUUPPPP', dates)
//   return groupedEvents
// }

/**
 * Создаем массив дней в зависимости от принятых дат
 * @param {object} start
 * @param {object} end
 * @return {array}
 */
export const createDays = (start, end) => {
  let currentDate = start
  let datesArray = []
  while (currentDate <= end) {
    const currentISO = currentDate.toISOString()
    datesArray.push(currentISO)
    let nextDay = moment(currentDate).add(1, 'days').toDate()
    currentDate = nextDay
  }
  return datesArray
}

/**
 * Генерируем часы
 * @param {object} day or null
 * @param {number} startHour
 * @return {array}
 */
export const generateHours = (day, startHour) => {
  const timePeriod = { start: 0, end: 23 }
  if (startHour) {
    timePeriod.start = startHour
  }
  let hours = []

  if (day) {
    for (let i = timePeriod.start; i <= timePeriod.end; i++) {
      hours.push(new Date(day.setHours(i)))
    }
  } else {
    for (let i = timePeriod.start; i <= timePeriod.end; i++) {
      let m = moment().utcOffset(0)
      m.set({hour: i, minute: 0, second: 0, millisecond: 0})
      hours.push(m)
    }
  }
  return hours
}

/**
 * Считает разницу между датами
 * @param {date,string} start
 * @param {date,string} end
 * return object Duration
 * */
export const countDiffBetweenDates = (start, end) => {
  let ms = moment(end, 'YYYY-MM-DD HH:mm:ss Z').diff(moment(start, 'YYYY-MM-DD HH:mm:ss Z'))
  return moment.duration(ms)
}

export const Store = {
  hasExpand: false
}
