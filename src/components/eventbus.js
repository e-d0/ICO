import Vue from 'vue'
import moment from 'moment'

/**
 * Основной объект для хранения событий
 */
export const EventBus = new Vue()

/**
 * Проверка на наличие строки в объекте
 * @param {object} obj
 */
const tryParse = obj => (typeof obj === 'string' ? new Date(obj) : obj)

/**
 * Проверка даты события и даты ячейки
 * @param {*} one
 * @param {*} two
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
      // console.log(oneDate, twoDate, 'true in isSameDay')
      return true
    } else {
      // console.log('false dates not the same')
      return false
    }
    /**
       * //TODO Вернуть краткое выражение перед сдачей
       * */
    // return (
    //   oneDate.getHours() === twoDate.getHours() &&
    //   oneDate.getDate() === twoDate.getDate() &&
    //   oneDate.getMonth() === twoDate.getMonth() &&
    //   oneDate.getFullYear() === twoDate.getFullYear()
    // )
  }
}

/**
 * Создаем массив дней в зависимости от принятых дат
 * @param {object} dates
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
 * @param{obj} day or null
 * @param startHour Number
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
 * @param {obj} one
 * @param {obj} two
 * return object Duration
 * */
export const countDiffBetweenDates = (start, end) => {
  let ms = moment(end, 'YYYY-MM-DD HH:mm:ss Z').diff(moment(start, 'YYYY-MM-DD HH:mm:ss Z'))
  return moment.duration(ms)
}

export const Store = {
  hasExpand: false
}
