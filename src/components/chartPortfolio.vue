<script>
import { Line, mixins } from 'vue-chartjs'
import Chart from 'chart.js'
const { reactiveProp } = mixins
// 1. Import Chart.js so you can use the global Chart object

// 2. Import the `generateChart()` method to create the vue component.

// 3. Extend on of the default charts
// http://www.chartjs.org/docs/latest/developers/charts.html
var originalLineDraw = Chart.controllers.line.prototype.draw

Chart.helpers.extend(Chart.controllers.line.prototype, {
  draw: function () {
    originalLineDraw.apply(this, arguments)

    var chart = this.chart
    var ctx = chart.chart.ctx

    var xaxis = chart.scales['x-axis-0']
    var yaxis = chart.scales['y-axis-0']

    var limits = []

    var max = []
    max['value'] = chart.config.data.max
    max['label'] = 'Max.'
    max['color'] = 'rgba(69, 175, 55, 0.7)'
    limits.push(max)

    var min = []
    min['value'] = chart.config.data.min
    min['label'] = 'Min.'
    min['color'] = 'rgba(255, 54, 87, 0.7)'
    limits.push(min)

    // var avg = []
    // avg['value'] = chart.config.data.avg
    // avg['label'] = 'Avg.'
    // avg['color'] = 'rgba(141, 195, 227, 0.68)'
    // limits.push(avg)

    for (var i = 0; i < limits.length; i++) {
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

export default {
  extends: Line,
  mixins: [reactiveProp],
  name: 'chartPortfolio',
  props: ['options'],
  methods: {
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
    }
  },
  mounted () {
    /**
     * Плагин для чартов для раскрашивания точек на графике
     * */
    this.addPlugin({
      id: 'pointColorizer',
      beforeDraw: (chart) => {
        let datasets = chart.data.datasets
        let i, j
        for (i = 0; i < datasets.length; i++) {
          for (j = 0; j < datasets[i].data.length; j++) {
            let obj = chart.getDatasetMeta(i).data[j]._view
            let indx = chart.getDatasetMeta(i).data[j]._index
            let passedItems = chart.config.data.operations[indx]
            obj.backgroundColor = this.colorSwitcher(passedItems.operations['0'].type)
          }
        }
      }
    }
    )
    this.renderChart(this.chartData, this.options)
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
