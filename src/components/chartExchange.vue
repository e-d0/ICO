<script>
import { Line } from 'vue-chartjs'
import Chart from 'chart.js'

export default {
  extends: Line,
  name: 'chartExchange',
  props: {
    items: Object
  },
  data () {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: true,
        // onHover: function (e) {
        //   let item = this.getElementsAtEvent(e)
        //   console.log(item)
        // },
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
            position: 'right',
            ticks: {
              fontColor: 'rgba(112, 121, 134, 0.6)',
              maxTicksLimit: 3,
              display: false,
              color: 'rgb(255, 0, 0)'
            },
            gridLines: {
              drawTicks: false,
              display: true,
              drawBorder: true,
              offsetGridLines: true,
              borderColor: 'rgb(255, 0, 0)',
              zeroLineColor: 'rgb(255, 0, 0)'
            }
          }],
          xAxes: [{
            ticks: {
              fontColor: 'rgba(112, 121, 134, 0.6)',
              maxTicksLimit: 2.5,
              maxRotation: 0,
              minRotation: 0
            },
            gridLines: {
              drawTicks: true,
              display: false,
              drawBorder: true
            }
          }]
        },
        tooltips: {
          enabled: true,
          mode: 'single',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          titleFontColor: '#8f96a1',
          bodyFontColor: '#8f96a1',
          footerFontColor: '#8f96a1',
          bodyFontSize: 12,
          displayColors: false,
          yAlign: 'center',
          xAlign: 'left',
          xPadding: 0,
          callbacks: {
            label: function (tooltipItem, data) {
              let val = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
              tooltipItem.body = val
              return '$ ' + val
            },
            title: function (tooltipItem, data) {

            }
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
            lineTension: 0.1,
            backgroundColor: 'rgba(248, 252, 245, 0.6)',
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
        ]
      }
    }
  },
  created () {
    /**
     * Заполняем данными необходимые поля
     * */
    if (this.items !== undefined) {
      this.datacollection.labels = this.items.labels
      this.datacollection.datasets['0'].data = this.items.data
    }
  },
  mounted () {
    /**
     * Плагин для чартов. Необходим для расширения функционала чарта.
     * */
    this.addPlugin({
      id: 'pointOnStart',
      beforeRender: function (chart) {
        let datasets = chart.data.datasets
        let i, j
        chart.pluginTooltips = []
        for (i = 0; i < datasets.length; i++) {
          for (j = 0; j < datasets[i].data.length; j++) {
            if (j === datasets[i].data.length - 1) {
            // When we find one, we are pushing all informations to create the tooltip.
              chart.options.tooltips.bodyFontSize = 12
              chart.pluginTooltips.push(new Chart.Tooltip({
                _chart: chart.chart,
                _chartInstance: chart,
                _data: chart.data,
                _options: chart.options.tooltips,
                _active: [chart.getDatasetMeta(i).data[j]]
              }, chart))
            }
          }
        }
      }, // end beforeRender

      afterDatasetsDraw: function (chart, easing) {
        // Draw tooltips
        Chart.helpers.each(chart.pluginTooltips, function (tooltip) {
          tooltip.initialize()
          tooltip.update()
          tooltip.pivot()
          tooltip.transition(easing).draw()
        })
      }, // end afterDatas
      beforeDraw: function (chart) {
        let datasets = chart.data.datasets
        let i, j
        for (i = 0; i < datasets.length; i++) {
          for (j = 0; j < datasets[i].data.length; j++) {
            if (j === datasets[i].data.length - 1) {
              let obj = chart.getDatasetMeta(i).data[j]._view
              obj.radius = 6
              obj.backgroundColor = '#45af37'
              obj.borderColor = '#fff'
              obj.borderWidth = 3
            }
          }
        }
      }
    })
    this.renderChart(this.datacollection, this.options)
  }
}
</script>
