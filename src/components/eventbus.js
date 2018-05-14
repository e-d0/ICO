import Vue from 'vue'
import moment from 'moment'

/**
 * Основной объект для хранения событий
 */
export const EventBus = new Vue()

/**
 * Проверка на "Високосный ли год"
 * @param {*} year
 */
const isLeap = year => (year % 100 !== 0 && year % 4 === 0) || year % 400 === 0

/**
 * Считаем количесчтво дней в месяце
 * @param {*} param0 { year, month }
 */
export const calcDays = ({ year, month }) => {
  let num = 31

  switch (month + 1) {
    case 2:
      num = isLeap(year) ? 29 : 28
      break
    case 4:
    case 6:
    case 9:
    case 11:
      num = 30
      break
  }
  return num
}

const siblingsMonth = (y, m, n) => {
  const date = new Date(y, m, 1)
  date.setMonth(m + n)
  return {
    year: date.getFullYear(),
    month: date.getMonth()
  }
}

/**
 * Вычисляем предыдущий месяц
 * @param {*} year
 * @param {*} month
 */
export const calcPrevMonth = (year, month) => siblingsMonth(year, month, -1)

/**
 * Вычисляем следующий месяц
 * @param {*} year
 * @param {*} month
 */
export const calcNextMonth = (year, month) => siblingsMonth(year, month, 1)

/**
 * Первая неделя
 * @param {*} year
 * @param {*} month
 */
const firstWeek = (year, month) => new Date(year, month, 1).getDay()

export const PREV_DATE_TYPE = 'prev'
export const CURRENT_DATE_TYPE = 'current'
export const NEXT_DATE_TYPE = 'next'

/**
 * Собираем массив дней календаря
 * @param {*} year
 * @param {*} month
 * @param {*} startWeek
 */
export const monthlyCalendar = (year, month, startWeek) => {
  const result = []
  const curMonth = {
    year,
    month
  }
  const days = calcDays(curMonth)
  const prevMonth = calcPrevMonth(year, month)
  const prevDays = calcDays(prevMonth)
  const prevOver = (firstWeek(year, month) || 7) - startWeek
  const nextMonth = calcNextMonth(year, month)

  for (let p = prevDays - prevOver + 1; p <= prevDays; p++) {
    result.push({
      date: new Date(prevMonth.year, prevMonth.month, p),
      type: PREV_DATE_TYPE
    })
  }

  for (let c = 1; c <= days; c++) {
    result.push({
      date: new Date(curMonth.year, curMonth.month, c),
      type: CURRENT_DATE_TYPE
    })
  }

  for (let n = 1, nl = 42 - result.length; n <= nl; n++) {
    result.push({
      date: new Date(nextMonth.year, nextMonth.month, n),
      type: NEXT_DATE_TYPE
    })
  }

  return result
}

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
 */
export const generateHours = (day) => {
  const timePeriod = { start: 0, end: 24 }
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
      // m.toISOString()
      // if (i === 24) hours.push('0:00')
      // else hours.push(i + ':00')
    }
  }
  return hours
}

const fillZero = value => (value < 10 ? `0${value}` : value)
export const format = (date, exp = 'yyyy-MM-dd') => {
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()

  return exp
    .replace('yyyy', y)
    .replace('MM', fillZero(m))
    .replace('dd', fillZero(d))
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
