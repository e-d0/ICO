<script>
import { Line } from 'vue-chartjs'

import Chart from 'chart.js'

let originalLineDraw = Chart.controllers.line.prototype.draw

Chart.helpers.extend(Chart.controllers.line.prototype, {
  draw: function () {
    originalLineDraw.apply(this, arguments)

    let chart = this.chart
    let ctx = chart.chart.ctx

    let xaxis = chart.scales['x-axis-0']
    let yaxis = chart.scales['y-axis-0']

    let limits = []

    let max = []
    max['value'] = chart.config.data.max
    max['label'] = 'Max.'
    max['color'] = 'rgba(69, 175, 55, 0.7)'
    limits.push(max)

    let min = []
    min['value'] = chart.config.data.min
    min['label'] = 'Min.'
    min['color'] = 'rgba(255, 54, 87, 0.7)'
    limits.push(min)

    // var avg = []
    // avg['value'] = chart.config.data.avg
    // avg['label'] = 'Avg.'
    // avg['color'] = 'rgba(141, 195, 227, 0.68)'
    // limits.push(avg)

    for (let i = 0; i < limits.length; i++) {
      // Refactor the value
      limits[i].value = yaxis.getPixelForValue(limits[i].value, undefined)
      // ctx.fillStyle = 'black'
      // ctx.fillText(limits[i].label, 35, limits[i].value - 5)

      ctx.save()
      ctx.lineWidth = 0.7
      ctx.beginPath()
      ctx.moveTo(xaxis.left, limits[i].value)
      ctx.strokeStyle = limits[i].color
      ctx.lineTo(xaxis.right, limits[i].value)

      ctx.stroke()
      ctx.restore()
    }
  }
})
/**
 * Сохраняем ссылку на глобальный контекст
 * */
const vueInstance = this
export default {
  extends: Line,
  name: 'chartPortfolio',
  props: {
    operations: Array
  },
  data () {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 0,
            right: 40,
            top: 20,
            bottom: 0
          }
        },
        scales: {
          yAxes: [{
            type: 'linear',
            position: 'left',
            xAlign: 'left',
            ticks: {
              padding: 50,
              fontColor: 'rgba(112, 121, 134, 0.6)',
              maxTicksLimit: 5,
              xAlign: 'left',
              callback: function (label, index, labels) {
                return '$ ' + label
              }
            },
            gridLines: {
              drawTicks: false,
              drawOnChartArea: true,
              display: true,
              drawBorder: false
              // offsetGridLines: true,
              // zeroLineColor: 'rgb(255, 0, 0)'
            }
          }],
          xAxes: [{
            ticks: {
              fontColor: 'rgba(112, 121, 134, 0.6)',
              maxRotation: 0,
              borderColor: 'rgba(51, 63, 82, .3)',
              minRotation: 0,
              padding: 20
            },
            gridLines: {
              tickMarkLength: 10,
              drawTicks: false,
              display: false,
              drawBorder: true
            }
          }]
        },
        tooltips: {
          enabled: false,
          position: 'nearest',
          mode: 'index',
          displayColors: false,
          custom: function (tooltipModel) {
            // Tooltip Element
            let tooltipEl = document.getElementById('chartjs-tooltip')

            // Create element on first render
            if (!tooltipEl) {
              tooltipEl = document.createElement('div')
              tooltipEl.id = 'chartjs-tooltip'
              tooltipEl.innerHTML = '<table></table>'
              document.body.appendChild(tooltipEl)
            }

            // Hide if no tooltip
            if (tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = 0
              return
            }

            // Set caret Position
            tooltipEl.classList.remove('above', 'below', 'no-transform')
            if (tooltipModel.yAlign) {
              tooltipEl.classList.add(tooltipModel.yAlign)
            } else {
              tooltipEl.classList.add('no-transform')
            }

            if (tooltipModel.xAlign) {
              tooltipEl.classList.add(tooltipModel.xAlign)
            } else {
              tooltipEl.classList.add('no-transform')
            }

            // Set Text
            if (tooltipModel.body && tooltipModel.dataPoints.length > 0) {
              let pointItem = tooltipModel.dataPoints['0']
              let operations = vueInstance.a.methods.findOperationByIndex(pointItem.index)
              let titleLines = tooltipModel.title || []

              /**
               * Получаем данные из выбранной точки
               * */

              let innerHtml = '<thead>'

              titleLines.forEach(function (title) {
                innerHtml += '<tr><th colspan="2" class="tip-header">' + title + '</th></tr>'
              })
              innerHtml += '</thead><tbody>'

              operations.forEach(function (operation, i) {
                let color = vueInstance.a.methods.colorSwitcher(operation.type)
                let style = 'background:' + color
                style += '; border-width: 2px'
                style += '; display: inline-block;'
                style += '; width: 8px;'
                style += '; height: 8px;'
                style += '; border-radius: 4px;'
                let span = '<span style="' + style + '"></span>'
                // var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>'
                innerHtml += '<tr><td>' + span
                innerHtml += `<span>&nbsp;${operation.type}&nbsp;</span></td><td>`
                if (operation.type === 'swapped') {
                  innerHtml += `<span style="line-height: 10px;">  ${operation.value}<br> <small >IN ${operation.swapped_in} </small></span>`
                } else {
                  innerHtml += `<span>  ${operation.value}</span>`
                }
                innerHtml += '</td></tr>'
              })

              innerHtml += '</tbody>'
              innerHtml += '<span class="chart-custom-arrow"></span>'

              let tableRoot = tooltipEl.querySelector('table')
              tableRoot.innerHTML = innerHtml
            }

            // `this` will be the overall tooltip
            let position = this._chart.canvas.getBoundingClientRect()

            // Display, position, and set styles for font
            tooltipEl.style.opacity = 1
            tooltipEl.style.backgroundColor = '#fff'
            tooltipEl.style.left = position.left + tooltipModel.caretX + 'px'
            /**
             * Отступ с учетом стрелки под тултипом(каретки)
             * */
            tooltipEl.style.left = position.left + tooltipModel.caretX + 'px'
            tooltipEl.style.top = position.top + tooltipModel.caretY - tooltipEl.clientHeight - 10 + 'px'
            tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px'
            tooltipEl.style.color = '#525c6c'
            tooltipEl.style.boxShadow = '-8px 8px 24px rgba(0, 0, 0, 0.2)'
            tooltipEl.style.padding = '10px 12px 12px 12px'
          }
        },
        legend: {
          display: false
        }
      },
      datacollection: {
        labels: [],
        datasets: [
          {
            fill: true,
            lineTension: 0.07,
            backgroundColor: 'rgba(224, 230, 237, 0.6)',
            borderColor: '#45af37',
            borderCapStyle: 'butt',
            borderDash: [],
            borderWidth: 2,
            borderDashOffset: 10,
            borderJoinStyle: 'miter',
            pointBorderColor: '#fff',
            pointBackgroundColor: '#45af37',
            pointBorderWidth: 2,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#45af37',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2,
            pointRadius: 5,
            pointHitRadius: 5,
            pointHitDetectionRadius: 30,
            data: []
          }
        ],
        max: '',
        min: ''
        // avg: ''
      }
    }
  },
  computed: {
    // operations: function () {
    //   let arr = JSON.parse(JSON.stringify(this.portfolio.coin))
    //   let tempOperations = []
    //   for (let i = 0; i < arr.length; i++) {
    //     arr[i].operations.filter(item => {
    //       item.coin_id = arr[i].id
    //     })
    //     tempOperations = [...tempOperations, ...arr[i].operations]
    //   }
    //   return tempOperations
    // }
  },
  methods: {
    dates () {
      if (this.operations) {
        let dates = this.sortedDates(this.operations).map(item => {
          return this.$moment(item.date).format('DD/MM')
        }
        )
        return dates
      }
    },
    portfolioCost () {
      if (this.operations) {
        let values = this.sortedDates(this.operations).map(item => {
          return item.portfolio_cost
        }
        )
        return values
      }
    },
    /**
     * Сортировка массива дат. 1я ближайшая
     * */
    sortedDates (arrEvents) {
      return arrEvents.sort((obj1, obj2) => {
        if (obj1.date > obj2.date) return 1
        if (obj1.date < obj2.date) return -1
        return 0
      })
    },
    findOperationByIndex (index) {
      return this.operations[index].operations
    },
    colorSwitcher (type) {
      let color
      switch (type) {
        case 'sold':
          color = '#ff3657'
          break
        case 'bought':
          color = '#45af37'
          break
        case 'swapped':
          color = '#1991eb'
          break
        default:
          color = '#fff'
      }
      return color
    },
    findMaxValue (array) {
      return Math.max.apply(Math, array)
    },
    findMinValue (array) {
      return Math.min.apply(Math, array)
    }
  },
  created () {
    /**
       * Заполняем данными необходимые поля
       * */
    // if (this.items !== undefined) {
    //   this.datacollection.labels = ['23/05', '25/05', '25/05', '28/05', '05/06', '06/06', '07/06', '08/06', '10/06', '21/06']
    //   this.datacollection.datasets['0'].data = [2.17, 1.65, 1.74, 2.66, 3.08, 2.36, 1.96, 2.29, 1.47, 2.91]
    // }
    this.datacollection.labels = this.dates()
    this.datacollection.datasets['0'].data = this.portfolioCost()
    this.datacollection.min = this.findMinValue(this.datacollection.datasets['0'].data)
    this.datacollection.max = this.findMaxValue(this.datacollection.datasets['0'].data)
  },
  mounted () {
    /**
       * Плагин для чартов. Необходим для расширения функционала чарта.
       * */
    this.addPlugin({
      id: 'pointColorizer',
      beforeDraw: (chart) => {
        let datasets = chart.data.datasets
        let i, j
        for (i = 0; i < datasets.length; i++) {
          for (j = 0; j < datasets[i].data.length; j++) {
            let obj = chart.getDatasetMeta(i).data[j]._view
            let operations = this.findOperationByIndex(chart.getDatasetMeta(i).data[j]._index)
            obj.backgroundColor = this.colorSwitcher(operations['0'].type)
          }
        }
      }
    }
    )
    this.renderChart(this.datacollection, this.options)
  }
}
</script>
<style lang="less">
  #chartjs-tooltip {
    opacity: 1;
    position: fixed;
    background: rgba(0, 0, 0, .7);
    color: white;
    border-radius: 2px;
    -webkit-transition: all 0s ease;
    transition: all 0s ease;
    pointer-events: none;
    -webkit-transform: translate(-50%, 0);
    transform: translate(-50%, 0);
    width: 178px;
    padding: 10px 12px 12px 12px;
    .tip-header {
      text-align: center;
      height: 12px;
      color: #525c6c;
      font-size: 12px;
      font-weight: 400;
      line-height: 12px;
      padding-bottom: 8px;
    }
    table, tbody {
      width: 100%;
    }
    tr td {
      width: 50%;
    }
    span{
      display: inline-block;
      vertical-align: middle;
      small {
        height: 12px;
        opacity: 0.6;
        color: #8f96a1;
        font-size: 9px;
        font-weight: 500;
        line-height: 12px;
        letter-spacing: -0.03px;
      }
    }
    .chart-custom-arrow {
      width: 0;
      height: 0;
      position: absolute;
      display: block;
      top: 100%;
      left: 50%;
      margin-left: -6px;
      border-style: solid;
      border-width: 6px 6px 0 6px;
      border-color: #ffffff transparent transparent transparent;
    }
  }

  .chartjs-tooltip-key {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 10px;
  }
</style>
