<template>
  <div class="chart_price__wrapper">
    <div class="chart_price__filter">
      <label v-for="(item, index) in chartFilter" :key="index">
        <input name="chart_price__filter"
               :class="[ {'selected' : item.value === chartFilterValue.value } ]"
               :value="item"
               type="radio"
               v-model="chartFilterValue"
        >
        <b>{{ item.title }}</b>
      </label>
    </div>
    <overview-trade-chart v-if="datacollection"
                          :chart-id="chartId()"
                          :ref="chartId()"
                          :chart-data="datacollection"
                          :options="options"
                          :height = "193"
                          :width = "492"
    ></overview-trade-chart>
  </div>
</template>

<script>
import OverviewTradeChart from './OverviewTradeChart'
import axios from 'axios'
import moment from 'moment'

export default {
  name: 'OverviewTradeChartWrapper',
  components: { OverviewTradeChart },
  data () {
    return {
      /**
       * Значения фильтра для селекта
       * */
      chartFilter: [
        {
          title: 'ALL TIME',
          value: 'ALL TIME'
        },
        {
          title: '1M',
          value: '1M'
        },
        {
          title: '7D',
          value: '7D'
        },
        {
          title: '24H',
          value: '24H'
        },
        {
          title: '1H',
          value: '1H'
        }
      ],
      /**
       * Хранилище значения фильтра, задано по дефолту
       * */
      chartFilterValue: {
        title: '24H',
        value: '24H'
      },
      datacollection: {},
      options: {
        responsive: false,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 28,
            right: 28,
            top: 28,
            bottom: 18
          }
        },
        scales: {
          yAxes: [{
            type: 'linear',
            position: 'right',
            ticks: {
              fontColor: 'rgba(112, 121, 134, 0.6)',
              maxTicksLimit: 2,
              display: false,
              beginAtZero: false
            },
            gridLines: {
              color: '#5d6877',
              drawTicks: false,
              display: true,
              lineWidth: 1,
              drawBorder: true,
              offsetGridLines: false,
              zeroLineColor: '#97a3af'
            }
          }],
          xAxes: [{
            ticks: {
              fontColor: 'rgb(143, 150, 161)',
              fontFamily: 'Roboto Medium',
              fontSize: 9,
              maxTicksLimit: 3.5,
              maxRotation: 0,
              minRotation: 0
            },
            gridLines: {
              drawTicks: true,
              display: false,
              color: '#97a3af',
              borderColor: '#97a3af',
              drawBorder: true,
              drawOnChartArea: false,
              zeroLineColor: '#97a3af'
            }
          }]
        },
        tooltips: {
          enabled: false,
          mode: 'index',
          bodyFontFamily: 'Roboto Medium',
          custom: (tooltipModel) => {
            // Tooltip Element
            let tooltipEl = document.getElementById('chartjs-tooltip')
            // sign before body
            let sign = '$'

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

            /**
             * Положение стрелки(каретки)
             * */
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
              let titleLines = tooltipModel.body || []

              /**
               * Отрисовываем тело тултипа
               * */

              let innerHtml = '<thead>'

              titleLines.forEach(function (line) {
                line.lines.forEach((title) => {
                  innerHtml += '<tr><th colspan="2" class="tip-header">' + sign + title + '</th></tr>'
                })
              })
              innerHtml += '</thead><tbody>'

              innerHtml += '</tbody>'
              innerHtml += '<span class="chart-custom-arrow"></span>'

              let tableRoot = tooltipEl.querySelector('table')
              tableRoot.innerHTML = innerHtml
            }

            /**
             * Получаем объект чарта из ДОМ
             * */
            let position = this.$refs[this.chartId()].$refs.canvas.getBoundingClientRect()

            /**
             * Отображение, позиция и стили для шрифта
             * */
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
          }
        },
        legend: {
          display: false
        }
      }
    }
  },
  watch: {
    /**
     * При изменении фильтра , запускается функциядля отрисовки чарта
     * */
    chartFilterValue: function (val) {
      this.renderChart()
    }
  },
  methods: {
    /**
     * Отправляем запрос на сервер, формируем реактивные данные для чарта.
     * //TODO править формат даты при отправке на сервер.
     * */
    renderChart: async function (format) {
      let formatDate = format || 'H a'
      /**
       * Отправляем запрос на сервер, передавая значение фильтра
       * */
      let data = await this.getTradeOverviewPerDate(this.chartFilterValue)
      /**
       * Для корректной работы реактивности Chart.js необходимо заменять весь объект!
       * */
      this.datacollection = {
        labels: [],
        datasets: [
          {
            fill: true,
            lineTension: 0.1,
            backgroundColor: 'rgba(66, 147, 33, 0.1)',
            borderColor: '#45af37',
            borderWidth: 2,
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 10,
            borderJoinStyle: 'miter',
            pointBorderColor: '#fff',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#45af37',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2,
            pointRadius: 0,
            pointHitRadius: 5,
            data: []
          }
        ],
        max: '',
        min: ''
      }
      /**
       * Раскидываем данные с респонса с сервера
       * */
      data.map(item => {
        this.datacollection.labels.push(moment(item.date).format(formatDate))
        this.datacollection.datasets['0'].data.push(item.price)
      })
    },
    /**
     * Генерируем Chart ID.
     * */
    chartId () {
      return `tradeOverviewChart`
    },
    /**
     * Функция отправки на сервер. API роут забит руками, значение фильтра
     * пока что не учитывается.
     * //TODO поправить API и запрос под нужды сервера
     * */
    getTradeOverviewPerDate (filterInfo) {
      console.log('getPortfolioOperationsPerDay', filterInfo)
      return new Promise((resolve, reject) => {
        axios.get('http://localhost:3000/trade_overview').then((oResponse) => {
          console.log('GOT RESPONSE', oResponse.data)
          resolve(oResponse.data)
        }, error => {
          this.handleXHRerrors(error)
          reject(error)
        })
      })
    },
    handleXHRerrors (error) {
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
  },
  mounted () {
    this.renderChart()
  }
}
</script>

<style lang="less">
  .chart_price__wrapper{
    background-color: #525c6c;
  }
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
    min-width: 51px;
    padding: 8px 6px 0px 6px;
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

  .chart_price__filter {
    display: flex;
    justify-content: flex-start;
    padding-left: 28px;
    label {
      text-align: center;
      margin-bottom: 0;
      margin-right: 2px;
      .selected + b{
        background: #dbdde1;
        color: #525c6c;
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
        padding: 2px 5px;
        margin-left: -1px;
        /*color: #525c6c;*/
        color: #ffffff;
        background-color: #6f7988;
        /*border: 1px solid #c5d0de;*/
        font-family: 'Roboto Medium';
        font-weight: 500;
        font-size: 11px;
        line-height: 12px;
        height: 16px;
        text-transform: uppercase;
        letter-spacing: -0.05px;
      }
    }
  }
</style>
