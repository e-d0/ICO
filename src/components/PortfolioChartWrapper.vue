<template>
    <div class="chart_portfolio__wrapper">
        <h4>Portfolio Chart</h4>
        <chart-portfolio ref="chartsPortfolio"
                         :options="options"
                         :chart-id="options.chartId"
                         :chart-data="datacollection"
                         :width ="930"
                         :height="241"></chart-portfolio>
        <div class="row">
            <div class="col-md-6 chart_portfolio__labels">
                <span class="chart_label bought">{{ $t('portfolio.bought') }}</span>
                <span class="chart_label sold">{{ $t('portfolio.sold') }}</span>
                <span class="chart_label swapped">{{ $t('portfolio.swapped') }}</span>
            </div>
            <div class="col-md-6 chart_portfolio__filter">
                <label v-for="(item, index) in chartFilter" :key="index">
                  <input name="chart_portfolio__filter"
                         :class="[ {'selected' : item.value === chartFilterValue.value } ]"
                         :value="item"
                         type="radio"
                         v-model="chartFilterValue"
                         >
                  <b>{{ item.title }}</b>
                </label>
              <!-- /.portfolio-view -->
            </div>
        </div>
    </div>
</template>
<script>
import ChartPortfolio from './chartPortfolio'
const vueInstance = this
/**
 * Тестовый набор операций
 * */
const operations = [
  {
    date: '2018-06-17T02:36:04.632Z',
    portfolio_cost: '3213489',
    operations: [
      {
        type: 'sold',
        value: '2.36',
        ticker: 'BTC',
        swapped_in: ''
      },
      {
        type: 'bought',
        value: '1.76',
        ticker: 'ETH',
        swapped_in: ''
      },
      {
        type: 'swapped',
        value: '4.76',
        ticker: 'ETH',
        swapped_in: '3',
        swapped_in_ticker: 'BTC'
      }
    ]
  },
  {
    date: '2018-06-18T02:36:04.632Z',
    portfolio_cost: '689326',
    operations: [
      {
        type: 'bought',
        value: '0.76',
        ticker: 'ETH',
        swapped_in: ''
      },
      {
        type: 'swapped',
        value: '2.76',
        ticker: 'ETH',
        swapped_in_ticker: 'BTC',
        swapped_in: '3'
      },
      {
        type: 'sold',
        value: '0.36',
        ticker: 'BTC',
        swapped_in: ''
      }
    ]
  },
  {
    date: '2018-06-19T02:36:04.632Z',
    portfolio_cost: '938932',
    operations: [
      {
        type: 'bought',
        value: '0.76',
        ticker: 'ETH',
        swapped_in: ''
      },
      {
        type: 'sold',
        value: '0.36',
        ticker: 'BTC',
        swapped_in: ''
      },
      {
        type: 'swapped',
        value: '2.76',
        ticker: 'ETH',
        swapped_in: '3',
        swapped_in_ticker: 'BTC'
      }
    ]
  },
  {
    date: '2018-06-21T02:36:04.632Z',
    portfolio_cost: '4383332',
    operations: [
      {
        type: 'swapped',
        value: '2.76',
        ticker: 'ETH',
        swapped_in_ticker: 'BTC',
        swapped_in: '3'
      },
      {
        type: 'bought',
        value: '0.76',
        ticker: 'ETH',
        swapped_in: ''
      },
      {
        type: 'sold',
        value: '0.36',
        ticker: 'BTC',
        swapped_in: ''
      }
    ]
  },
  {
    date: '2018-07-19T02:36:04.632Z',
    portfolio_cost: '6938955',
    operations: [
      {
        type: 'sold',
        value: '0.36',
        ticker: 'BTC',
        swapped_in: ''
      },
      {
        type: 'bought',
        value: '0.76',
        ticker: 'ETH',
        swapped_in: ''
      },
      {
        type: 'swapped',
        value: '2.76',
        ticker: 'ETH',
        swapped_in_ticker: 'BTC',
        swapped_in: '3'
      }
    ]
  },
  {
    date: '2019-07-19T02:36:04.632Z',
    portfolio_cost: '268888',
    operations: [
      {
        type: 'swapped',
        value: '2.76',
        ticker: 'ETH',
        swapped_in_ticker: 'BTC',
        swapped_in: '3'
      },
      {
        type: 'bought',
        value: '0.76',
        ticker: 'ETH',
        swapped_in: ''
      },
      {
        type: 'sold',
        value: '0.36',
        ticker: 'BTC',
        swapped_in: ''
      }
    ]
  }
]
export default {
  name: 'PortfolioChartWrapper',
  data () {
    return {
      items: operations,
      chartFilter: [
        {
          title: '24H',
          value: '24H'
        },
        {
          title: '1 WEEK',
          value: '1 WEEK'
        },
        {
          title: '30 DAYS',
          value: '30 DAYS'
        },
        {
          title: '1 YEAR',
          value: '1 YEAR'
        },
        {
          title: '1 YEAR TO DATE',
          value: '1 YEAR TO DATE'
        },
        {
          title: 'ALL TIME',
          value: 'ALL TIME'
        }
      ],
      chartFilterValue: {
        title: '24H',
        value: '24H'
      },
      options: {
        chartId: 'chartPortfolio',
        responsive: false,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 0,
            right: 0,
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
              fontSize: 12,
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
              fontSize: 10,
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
          custom: (tooltipModel) => {
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
              let operations = this.findOperationByIndex(pointItem.index)
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
                  innerHtml += `<span style="line-height: 10px;">  ${operation.value} ${operation.ticker}<br> <small >IN ${operation.swapped_in} ${operation.swapped_in_ticker}</small></span>`
                } else {
                  innerHtml += `<span>  ${operation.value} ${operation.ticker}</span>`
                }
                innerHtml += '</td></tr>'
              })

              innerHtml += '</tbody>'
              innerHtml += '<span class="chart-custom-arrow"></span>'

              let tableRoot = tooltipEl.querySelector('table')
              tableRoot.innerHTML = innerHtml
            }

            // `this` will be the overall tooltip
            let position = this.$refs.chartsPortfolio.$refs.canvas.getBoundingClientRect()

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
        /**
         * Передаем операции для обработки плагином чарта
         * для раскрашивания точек на графике
         * */
        operations: operations,
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
  components: {ChartPortfolio},
  props: {
    portfolio: {}
  },
  watch: {
    chartFilterValue (val) {
      console.log('SEND REQUEST TO SERVER', val.value)
    }
  },
  methods: {
    findOperationByIndex (index) {
      if (this.items !== undefined) return this.sortOperations(this.items[index].operations)
    },
    /**
     * Сортировка операций по наибольшему значению в операции.
     * */
    sortOperations (arr) {
      return arr.sort((obj1, obj2) => {
        if (obj1.value > obj2.value) return -1
        if (obj1.value < obj2.value) return 1
        return 0
      })
    },
    dates () {
      if (this.items) {
        let dates = this.sortedDates(this.items).map(item => {
          return this.$moment(item.date).format('DD/MM')
        }
        )
        return dates
      }
    },
    portfolioCost () {
      if (this.items) {
        let values = this.sortedDates(this.items).map(item => {
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
    this.datacollection.labels = this.dates()
    this.datacollection.datasets['0'].data = this.portfolioCost()
    this.datacollection.min = this.findMinValue(this.datacollection.datasets['0'].data)
    this.datacollection.max = this.findMaxValue(this.datacollection.datasets['0'].data)
  }
}
</script>
<style lang="less" scoped>
    @import "../assets/less/vars";
    .chart_portfolio {
    &__wrapper{
      margin-bottom: 40px;
        h4{
          height: 24px;
          color: #525c6c;
          font-size: 16px;
          font-weight: 700;
          line-height: 24px;
          padding-bottom: 27px;
        }
      }
      &__labels {
        text-align: left;
        display: flex;
        flex-direction: row;
        padding-top: 24px;
        padding-left: 13%;
        .chart_label {
          color: #525c6c;
          font-size: 11px;
          font-weight: 500;
          font-family: @medium;
          line-height: 12px;
          letter-spacing: -0.05px;
          margin-right: 28px;
          &::before {
            content: '';
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 4px;
            margin-right: 4px;
          }
          &.bought::before{
            background-color: #45af37;
          }
          &.sold::before{
            background-color: #ff3657;
          }
          &.swapped::before{
            background-color: #1991eb;
          }
        }

      }
      &__filter {
        display: flex;
        justify-content: flex-end;
        label {
          text-align: center;
          margin-bottom: 0;
          .selected + b{
            background: #707986;
            color: #ffffff;
            opacity: 0.9;
          }
          &:first-child {
            b {
              border-radius: 2px 0 0 2px;
            }
          }
          &:last-child {
            b {
              border-radius: 0 2px 2px 0;
            }
          }
          input[type=checkbox] {
            display: none;
            position: relative;
            top: 2px;
          }
          b {
            cursor: pointer;
            display: block;
            padding: 6px 9px;
            margin-left: -1px;
            color: #525c6c;
            background-color: #fff;
            border: 1px solid #c5d0de;
            font-family: @medium;
            font-weight: 500;
            font-size: 11px;
            line-height: 12px;
            height: 24px;
            text-transform: uppercase;
            letter-spacing: -0.05px;
          }
        }
      }
    }
</style>
