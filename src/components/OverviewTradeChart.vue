<script>
import { Line, mixins } from 'vue-chartjs'
// import Chart from 'chart.js'

// var originalLineDraw = Chart.controllers.line.prototype.draw

// Chart.helpers.extend(Chart.controllers.line.prototype, {
//   draw: function () {
//     originalLineDraw.apply(this, arguments)
//
//     var chart = this.chart
//     var ctx = chart.chart.ctx
//
//     var xaxis = chart.scales['x-axis-0']
//     var yaxis = chart.scales['y-axis-0']
//
//     var limits = []
//
//     var max = []
//     max['value'] = chart.config.data.max
//     max['label'] = 'Max.'
//     max['color'] = 'rgba(151, 163, 175, 1)'
//     limits.push(max)
//
//     var min = []
//     min['value'] = chart.config.data.min
//     min['label'] = 'Min.'
//     min['color'] = 'rgba(151, 163, 175, 1)'
//     limits.push(min)
//
//     // var avg = []
//     // avg['value'] = chart.config.data.avg
//     // avg['label'] = 'Avg.'
//     // avg['color'] = 'rgba(141, 195, 227, 0.68)'
//     // limits.push(avg)
//
//     for (var i = 0; i < limits.length; i++) {
//       // Refactor the value
//       limits[i].value = yaxis.getPixelForValue(limits[i].value, undefined)
//       // ctx.fillStyle = 'black'
//       // ctx.fillText(limits[i].label, 35, limits[i].value - 5)
//
//       ctx.save()
//       ctx.lineWidth = 0.7
//       ctx.beginPath()
//       ctx.moveTo(xaxis.left, limits[i].value)
//       ctx.strokeStyle = limits[i].color
//       ctx.lineTo(xaxis.right, limits[i].value)
//
//       ctx.stroke()
//       ctx.restore()
//     }
//   }
// })

export default {
  extends: Line,
  name: 'OverviewTradeChart',
  mixins: [mixins.reactiveProp],
  props: {
    options: {
      type: Object,
      required: true
    }
  },
  watch: {
  },
  methods: {
  },
  created () {
  },
  mounted () {
    /**
           * Плагин для чартов. Необходим для расширения функционала чарта.
           * */
    // this.addPlugin({
    //   id: 'minMaxTolltip',
    //   beforeRender: function (chart) {
    //     let datasets = chart.data.datasets
    //     let i
    //     chart.pluginTooltips = []
    //     let tooltipOptions = {
    //       enabled: true,
    //       mode: 'single',
    //       backgroundColor: 'rgba(0, 0, 0, 0)',
    //       titleFontColor: '#8f96a1',
    //       bodyFontColor: '#8f96a1',
    //       footerFontColor: '#8f96a1',
    //       bodyFontSize: 12,
    //       bodyFontFamily: 'Roboto Medium',
    //       displayColors: false,
    //       yAlign: 'center',
    //       xAlign: 'left',
    //       xPadding: 0,
    //       callbacks: {
    //         label: function (tooltipItem, data) {
    //           let val = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
    //           tooltipItem.body = val
    //           return '$ ' + val
    //         },
    //         title: function (tooltipItem, data) {
    //
    //         }
    //       }
    //     }
    //
    //     let getMinY = () => {
    //       return Math.min(...datasets[0].data.map(d => parseFloat(d)))
    //     }
    //     let getMaxY = () => {
    //       return Math.max(...datasets[0].data.map(d => parseFloat(d)))
    //     }
    //     let minValIndex = datasets[0].data.indexOf(getMinY().toString())
    //     let maxValIndex = datasets[0].data.indexOf(getMaxY().toString())
    //     if (maxValIndex >= 0) {
    //       chart.options.scales.yAxes['0'].ticks.suggestedMax = getMaxY()
    //       console.log(chart.options.scales.yAxes['0'].ticks.suggestedMax = getMaxY())
    //     }
    //     if (maxValIndex >= 0) {
    //       chart.options.scales.yAxes['0'].ticks.suggestedMin = getMinY()
    //       console.log(chart.options.scales.yAxes['0'].ticks.suggestedMin = getMinY())
    //     }
    //     console.log(chart)
    //
    //     // chart.pluginTooltips.push(new Chart.Tooltip({
    //     //   _chart: chart.chart,
    //     //   _chartInstance: chart,
    //     //   _data: chart.data,
    //     //   _options: chart.options.tooltips,
    //     //   _active: [chart.getDatasetMeta(0).data[maxValIndex]]
    //     // }, chart))
    //   }, // end beforeRender
    //
    //   // afterDatasetsDraw: function (chart, easing) {
    //   //   // Draw tooltips
    //   //   Chart.helpers.each(chart.pluginTooltips, function (tooltip) {
    //   //     tooltip.initialize()
    //   //     tooltip.update()
    //   //     tooltip.pivot()
    //   //     tooltip.transition(easing).draw()
    //   //   })
    //   // } // end afterDatas
    // })
    this.renderChart(this.chartData, this.options)
  }
}
</script>
