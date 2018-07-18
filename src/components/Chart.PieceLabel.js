/**
 * [Chart.PieceLabel.js]{@link https://github.com/emn178/Chart.PieceLabel.js}
 *
 * @version 0.11.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2017-2018
 * @license MIT
 */
/**
 *  Во весь плагин добавил значение position === inside, дя того ,чтобы отображался лейбл снизу. Добавил новую позицию,
 *  по принципу уже готовой позиции outside. Просто скопировал outside и потом уже правил значения, чтобы полностью вписаться
 *  в код автора плагина и ничего не сломать.
 *  Так же сделал возможным добавление в position массива значений.
 *  Добавлены свойства secondFontSize и secondFontColor для добавления стиля внутренним лейблам.
 * */
import Chart from 'chart.js'
(function () {
  if (typeof Chart === 'undefined') {
    console.warn('Can not find Chart object.')
    return
  }

  function PieceLabel () {
    this.drawDataset = this.drawDataset.bind(this)
  }

  PieceLabel.prototype.beforeDatasetsUpdate = function (chartInstance) {
    let padding
    if (this.parseOptions(chartInstance) && this.position === 'outside') {
      padding = this.fontSize * 1.5 + this.outsidePadding
      chartInstance.chartArea.top += padding
      chartInstance.chartArea.bottom -= padding
    }
    if (this.parseOptions(chartInstance) && this.position === 'inside') {
      padding = this.fontSize * 1.5 + this.outsidePadding
      chartInstance.chartArea.top -= padding
      chartInstance.chartArea.bottom += padding
    }
  }

  PieceLabel.prototype.afterDatasetsDraw = function (chartInstance) {
    if (!this.parseOptions(chartInstance)) {
      return
    }
    this.labelBounds = []
    chartInstance.config.data.datasets.forEach(this.drawDataset)
  }
  /**
   * Функция ,где происходит перебор массива входящих данных и происходит отрисовка
   * */
  PieceLabel.prototype.drawDataset = function (dataset) {
    let ctx = this.ctx
    var chartInstance = this.chartInstance
    var meta = dataset._meta[Object.keys(dataset._meta)[0]]
    var totalPercentage = 0
    for (var i = 0; i < meta.data.length; i++) {
      let element, view, text
      element = meta.data[i]
      view = element._view

      // Skips label creation if value is zero and showZero is set
      if (view.circumference === 0 && !this.showZero) {
        continue
      }
      switch (this.render) {
        case 'value':
          var value = dataset.data[i]
          if (this.format) {
            value = this.format(value)
          }
          text = value.toString()
          break
        case 'label':
          text = chartInstance.config.data.labels[i]
          break
        case 'image':
          text = this.images[i] ? this.loadImage(this.images[i]) : ''
          break
        case 'percentage':
        default:
          var percentage = view.circumference / this.options.circumference * 100
          percentage = parseFloat(percentage.toFixed(this.precision))
          if (!this.showActualPercentages) {
            totalPercentage += percentage
            if (totalPercentage > 100) {
              percentage -= totalPercentage - 100
              // After adjusting the percentage, need to trim the numbers after decimal points again, otherwise it may not show
              // on chart due to very long number after decimal point.
              percentage = parseFloat(percentage.toFixed(this.precision))
            }
          }
          text = percentage + '%'
          break
      }
      if (typeof this.render === 'function') {
        text = this.render({
          label: chartInstance.config.data.labels[i],
          value: dataset.data[i],
          percentage: percentage,
          dataset: dataset,
          index: i
        })

        if (typeof text === 'object') {
          text = this.loadImage(text)
        }
      }
      if (!text) {
        continue
      }
      ctx.save()
      /**
       * Если передан массив в опциях доната в position
       * */
      if (this.position instanceof Array) {
        ctx.beginPath()
        this.position.forEach((posItem, index) => {
          ctx.font = Chart.helpers.fontString(index > 0 ? this.secondFontSize : this.fontSize, this.fontStyle, this.fontFamily)
          var position, innerRadius, arcOffset
          if (posItem === 'outside' || posItem === 'inside' || posItem === 'border') {
            innerRadius = view.outerRadius / 2
            let rangeFromCentre, offset, centreAngle
            /**
             * Отступ считается ,как размер шрифта и данные из отступа для текста
             * */
            offset = (index > 0 ? this.secondFontSize : this.fontSize) + this.textMargin
            /**
             * Угол, по которому проходит центральная линия отдельной доли бублика
             * */
            centreAngle = view.startAngle + ((view.endAngle - view.startAngle) / 2)
            if (posItem === 'border') {
              rangeFromCentre = (view.outerRadius - innerRadius) / 2 + innerRadius
            } else if (posItem === 'outside') {
              rangeFromCentre = (view.outerRadius - innerRadius) + innerRadius + offset
            } else if (posItem === 'inside') {
              /**
               * Отступ от центра
               * */
              rangeFromCentre = (view.innerRadius) - (offset * 2)
              // rangeFromCentre = (view.outerRadius - innerRadius) + innerRadius + offset
            }
            /**
             * Начальная позиция элемента на круге
             * */
            position = {
              x: view.x + (Math.cos(centreAngle) * rangeFromCentre),
              y: view.y + (Math.sin(centreAngle) * rangeFromCentre)
            }
            if (posItem === 'outside') {
              if (position.x < view.x) {
                position.x -= offset
              } else {
                position.x += offset
              }
              arcOffset = view.outerRadius + offset
            }
            if (posItem === 'inside') {
              /**
               * Пересчитываю позицию для внутренних лейблов
               * Подбивал значения на глаз.
               * */
              position = {
                x: view.x + ((Math.cos(centreAngle) * rangeFromCentre) * 1.1),
                y: view.y + ((Math.sin(centreAngle) * rangeFromCentre) * 1.1)
              }
            }
          } else {
            innerRadius = view.innerRadius
            position = element.tooltipPosition()
          }

          var fontColor = index > 0 ? this.secondFontColor : this.fontColor
          if (typeof fontColor === 'function') {
            fontColor = fontColor({
              label: chartInstance.config.data.labels[i],
              value: dataset.data[i],
              percentage: percentage,
              text: text,
              backgroundColor: dataset.backgroundColor[i],
              dataset: dataset,
              index: i
            })
          } else if (typeof fontColor !== 'string') {
            fontColor = fontColor[i] || this.options.defaultFontColor
          }
          if (this.arc) {
            if (!arcOffset) {
              arcOffset = (innerRadius + view.outerRadius) / 2
            }
            ctx.fillStyle = fontColor
            ctx.textBaseline = 'middle'
            this.drawArcText(text, arcOffset, view, this.overlap)
          } else {
            var drawable, mertrics, left, right, top, bottom
            mertrics = this.measureText(text)
            left = position.x - mertrics.width / 2
            right = position.x + mertrics.width / 2
            top = position.y - this.secondFontSize / 2
            bottom = position.y + this.secondFontSize / 2
            if (this.overlap) {
              drawable = true
            } else if (posItem === 'outside') {
              drawable = this.checkTextBound(left, right, top, bottom)
            } else if (posItem === 'inside') {
              drawable = this.checkTextBound(left, right, top, bottom)
            } else {
              drawable = element.inRange(left, top) && element.inRange(left, bottom) &&
                element.inRange(right, top) && element.inRange(right, bottom)
            }
            if (drawable) {
              this.fillText(
                index > 0 ? chartInstance.config.data.labels[i] : text,
                position,
                fontColor
              )
            }
          }
          ctx.restore()
        }
        )
      } else {
        ctx.beginPath()
        ctx.font = Chart.helpers.fontString(this.fontSize, this.fontStyle, this.fontFamily)
        var position, innerRadius, arcOffset
        if (this.position === 'outside' || this.position === 'inside' || this.position === 'border') {
          innerRadius = view.outerRadius / 2
          var rangeFromCentre, offset, centreAngle
          offset = this.fontSize + this.textMargin
          centreAngle = view.startAngle + ((view.endAngle - view.startAngle) / 2)
          if (this.position === 'border') {
            rangeFromCentre = (view.outerRadius - innerRadius) / 2 + innerRadius
          } else if (this.position === 'outside') {
            rangeFromCentre = (view.outerRadius - innerRadius) + innerRadius + offset
          } else if (this.position === 'inside') {
            rangeFromCentre = (view.innerRadius) - offset * 2
          }
          position = {
            x: view.x + (Math.cos(centreAngle) * rangeFromCentre),
            y: view.y + (Math.sin(centreAngle) * rangeFromCentre)
          }
          if (this.position === 'outside') {
            if (position.x < view.x) {
              position.x -= offset
            } else {
              position.x += offset
            }
            arcOffset = view.outerRadius + offset
          }
          if (this.position === 'inside') {
            if (position.x < view.x) {
              position.x -= offset
            } else {
              position.x += offset
            }
            arcOffset = view.innerRadius
          }
        } else {
          innerRadius = view.innerRadius
          position = element.tooltipPosition()
        }

        var fontColor = this.fontColor
        if (typeof fontColor === 'function') {
          fontColor = fontColor({
            label: chartInstance.config.data.labels[i],
            value: dataset.data[i],
            percentage: percentage,
            text: text,
            backgroundColor: dataset.backgroundColor[i],
            dataset: dataset,
            index: i
          })
        } else if (typeof fontColor !== 'string') {
          fontColor = fontColor[i] || this.options.defaultFontColor
        }
        if (this.arc) {
          if (!arcOffset) {
            arcOffset = (innerRadius + view.outerRadius) / 2
          }
          ctx.fillStyle = fontColor
          ctx.textBaseline = 'middle'
          this.drawArcText(text, arcOffset, view, this.overlap)
        } else {
          var drawable, mertrics, left, right, top, bottom
          mertrics = this.measureText(text)
          left = position.x - mertrics.width / 2
          right = position.x + mertrics.width / 2
          top = position.y - this.fontSize / 2
          bottom = position.y + this.fontSize / 2
          if (this.overlap) {
            drawable = true
          } else if (this.position === 'outside') {
            drawable = this.checkTextBound(left, right, top, bottom)
          } else if (this.position === 'inside') {
            drawable = this.checkTextBound(left, right, top, bottom)
          } else {
            drawable = element.inRange(left, top) && element.inRange(left, bottom) &&
              element.inRange(right, top) && element.inRange(right, bottom)
          }
          if (drawable) {
            this.fillText(text, position, fontColor)
          }
        }
        ctx.restore()
      }
    }
  }
  /**
   * Собираем все данные с опций доната
   * */
  PieceLabel.prototype.parseOptions = function (chartInstance) {
    var pieceLabel = chartInstance.options.pieceLabel
    if (pieceLabel) {
      this.chartInstance = chartInstance
      this.ctx = chartInstance.chart.ctx
      this.options = chartInstance.config.options
      this.render = pieceLabel.render || pieceLabel.mode
      this.position = pieceLabel.position || 'default'
      this.arc = pieceLabel.arc
      this.format = pieceLabel.format
      this.precision = pieceLabel.precision || 0
      this.fontSize = pieceLabel.fontSize || this.options.defaultFontSize
      this.secondFontSize = pieceLabel.secondFontSize || this.options.defaultFontSize
      this.fontColor = pieceLabel.fontColor || this.options.defaultFontColor
      this.secondFontColor = pieceLabel.secondFontColor || this.options.defaultFontColor
      this.fontStyle = pieceLabel.fontStyle || this.options.defaultFontStyle
      this.fontFamily = pieceLabel.fontFamily || this.options.defaultFontFamily
      this.shadowOffsetX = pieceLabel.shadowOffsetX || 3
      this.shadowOffsetY = pieceLabel.shadowOffsetY || 3
      this.shadowColor = pieceLabel.shadowColor || 'rgba(0,0,0,0.3)'
      this.shadowBlur = pieceLabel.shadowBlur || 6
      this.textShadow = pieceLabel.textShadow || false
      this.hasTooltip = chartInstance.tooltip._active && chartInstance.tooltip._active.length
      this.showZero = pieceLabel.showZero
      this.overlap = pieceLabel.overlap
      this.images = pieceLabel.images || []
      this.outsidePadding = pieceLabel.outsidePadding || 2
      this.textMargin = pieceLabel.textMargin || 2
      this.showActualPercentages = pieceLabel.showActualPercentages || false
      return true
    } else {
      return false
    }
  }
  /**
   * Насколько я понял, фунция служит для проверки , влезает ли текст в канвас. Ничего здесь не правил
   * @return boolean
   * */
  PieceLabel.prototype.checkTextBound = function (left, right, top, bottom) {
    let labelBounds = this.labelBounds
    for (let i = 0; i < labelBounds.length; ++i) {
      let bound = labelBounds[i]
      let potins = [
        [left, top],
        [left, bottom],
        [right, top],
        [right, bottom]
      ]
      for (let j = 0; j < potins.length; ++j) {
        let x = potins[j][0]
        let y = potins[j][1]
        if (x >= bound.left && x <= bound.right && y >= bound.top && y <= bound.bottom) {
          return false
        }
      }
      potins = [
        [bound.left, bound.top],
        [bound.left, bound.bottom],
        [bound.right, bound.top],
        [bound.right, bound.bottom]
      ]
      for (let j = 0; j < potins.length; ++j) {
        let x
        x = potins[j][0]
        let y = potins[j][1]
        if (x >= left && x <= right && y >= top && y <= bottom) {
          return false
        }
      }
    }
    labelBounds.push({
      left: left,
      right: right,
      top: top,
      bottom: bottom
    })
    return true
  }
  /**
   * Ничего не правил в этой функции
   * */
  PieceLabel.prototype.measureText = function (text) {
    if (typeof text === 'object') {
      return { width: text.width, height: text.height }
    } else {
      return this.ctx.measureText(text)
    }
  }

  /**
   * Ничего не правил в этой функции
   * */
  PieceLabel.prototype.fillText = function (text, position, fontColor) {
    var ctx = this.ctx
    if (typeof text === 'object') {
      ctx.drawImage(text, position.x - text.width / 2, position.y - text.height / 2, text.width, text.height)
    } else {
      ctx.fillStyle = fontColor
      ctx.textBaseline = 'top'
      ctx.textAlign = 'center'

      if (this.textShadow) {
        ctx.shadowOffsetX = this.shadowOffsetX
        ctx.shadowOffsetY = this.shadowOffsetY
        ctx.shadowColor = this.shadowColor
        ctx.shadowBlur = this.shadowBlur
      }

      ctx.fillText(text, position.x, position.y - this.fontSize / 2)

      ctx.shadowBlur = 0
      ctx.shadowColor = 'rgba(0,0,0,0)'
    }
  }

  /**
   * Ничего не правил в этой функции
   * */
  PieceLabel.prototype.loadImage = function (obj) {
    var image = new Image()
    image.src = obj.src
    image.width = obj.width
    image.height = obj.height
    return image
  }

  /**
   * Ничего не правил в этой функции
   * */
  PieceLabel.prototype.drawArcText = function (str, radius, view, overlap) {
    var ctx, centerX, centerY, startAngle, endAngle
    ctx = this.ctx
    centerX = view.x
    centerY = view.y
    startAngle = view.startAngle
    endAngle = view.endAngle

    ctx.save()
    ctx.translate(centerX, centerY)
    var angleSize = endAngle - startAngle
    startAngle += Math.PI / 2
    endAngle += Math.PI / 2
    var origStartAngle = startAngle
    var mertrics = this.measureText(str)
    startAngle += (endAngle - (mertrics.width / radius + startAngle)) / 2
    if (!overlap && endAngle - startAngle > angleSize) {
      ctx.restore()
      return
    }

    if (typeof str === 'string') {
      ctx.rotate(startAngle)
      for (var i = 0; i < str.length; i++) {
        var char = str.charAt(i)
        mertrics = ctx.measureText(char)
        ctx.save()
        ctx.translate(0, -1 * radius)
        ctx.fillText(char, 0, 0)
        ctx.restore()
        ctx.rotate(mertrics.width / (radius))
      }
    } else {
      ctx.rotate((origStartAngle + endAngle) / 2)
      ctx.translate(0, -1 * radius)
      this.fillText(str, { x: 0, y: 0 })
    }
    ctx.restore()
  }

  /**
   * Функция, регистрирующая плагин. Здесь же можно прописать хуки. Ничего не правил в этой функции
   * */
  Chart.pluginService.register({
    beforeInit: function (chartInstance) {
      chartInstance.pieceLabel = new PieceLabel()
    },
    beforeDatasetsUpdate: function (chartInstance) {
      chartInstance.pieceLabel.beforeDatasetsUpdate(chartInstance)
    },
    afterDatasetsDraw: function (chartInstance) {
      chartInstance.pieceLabel.afterDatasetsDraw(chartInstance)
    }
  })
})()
