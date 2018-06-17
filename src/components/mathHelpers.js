/**
 * Функция преобразует числа от миллиона в буквенный читаемый формат
 * param (value) Number/string
 * return String
 * */
export const prettifyNumber = (value) => {
  let million = 1000000
  let billion = 1000000000
  let trillion = 1000000000000

  let digitsAfterSign = 2
  let letter
  if (value < million) {
    return String(value)
  }

  if (value >= million && value <= billion) {
    letter = ' M'
  }

  if (value >= billion && value <= trillion) {
    letter = ' B'
  } else {
    letter = ' T'
  }

  return round((value / million), digitsAfterSign) + letter
}

/**
 * Функция округляет до необходимого количества знаков
 * с помощью math.round. Используется экспонента для округления
 * param (value) Number/string
 * param (decimals) Number
 * return Number
 * */
export const round = (value, decimals) => {
  return Number(Math.round(value + `e${decimals}`) + `e-${decimals}`)
}

/**
 * //TODO Внести в этот файл функцию конвертации валюты
 * */
