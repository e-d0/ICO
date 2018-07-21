<script>
/**
 * https://github.com/emn178/Chart.PieceLabel.js
 * Плагин для отображения процентов на долях и внутренних лейблов. Модифицирован.
 * */
import './Chart.PieceLabel'
import { EventBus } from './eventbus'
// 1. Import Chart.js so you can use the global Chart object
import Chart from 'chart.js'
// 2. Import the `generateChart()` method to create the vue component.
import { generateChart } from 'vue-chartjs'

let helpers = Chart.helpers

// 3. Extend on of the default charts
// http://www.chartjs.org/docs/latest/developers/charts.html
Chart.defaults.CustomDoughnut = Chart.defaults.doughnut

Chart.controllers.CustomDoughnut = Chart.controllers.doughnut.extend({
  updateElement: function (arc, index, reset) {
    let _this = this
    let chart, chartArea, opts, animationOpts, arcOpts, centerX, centerY, startAngle, endAngle, dataset, circumference,
      innerRadius, outerRadius, custom, valueAtIndexOrDefault, isOpened
    chart = _this.chart
    chartArea = chart.chartArea
    opts = chart.options
    animationOpts = opts.animation
    arcOpts = opts.elements.arc
    centerX = (chartArea.left + chartArea.right) / 2
    centerY = (chartArea.top + chartArea.bottom) / 2
    startAngle = opts.rotation
    endAngle = opts.rotation
    dataset = _this.getDataset()
    circumference = reset && animationOpts.animateRotate ? 0 : arc.hidden ? 0 : _this.calculateCircumference(dataset.data[index]) * (opts.circumference / (2.0 * Math.PI))
    innerRadius = reset && animationOpts.animateScale ? 0 : _this.innerRadius
    outerRadius = reset && animationOpts.animateScale ? 0 : _this.outerRadius
    custom = arc.custom || {}
    valueAtIndexOrDefault = helpers.getValueAtIndexOrDefault
    isOpened = _this.isOpened ? !_this.isOpened : false

    // console.log('outerRadius',outerRadius);
    outerRadius *= 0.9
    innerRadius *= 1
    helpers.extend(arc, {
      // Utility
      _datasetIndex: _this.index,
      _index: index,

      // Desired view properties
      _model: {
        x: centerX + chart.offsetX,
        y: centerY + chart.offsetY,
        startAngle: startAngle,
        endAngle: endAngle,
        circumference: circumference,
        outerRadius: outerRadius,
        innerRadius: innerRadius,
        isOpened: isOpened,
        label: valueAtIndexOrDefault(dataset.label, index, chart.data.labels[index])
      }
    })

    let model = arc._model
    model.backgroundColor = custom.backgroundColor ? custom.backgroundColor : valueAtIndexOrDefault(dataset.backgroundColor, index, arcOpts.backgroundColor)
    model.hoverBackgroundColor = custom.hoverBackgroundColor ? custom.hoverBackgroundColor : valueAtIndexOrDefault(dataset.hoverBackgroundColor, index, arcOpts.hoverBackgroundColor)
    model.borderWidth = custom.borderWidth ? custom.borderWidth : valueAtIndexOrDefault(dataset.borderWidth, index, arcOpts.borderWidth)
    model.borderColor = custom.borderColor ? custom.borderColor : valueAtIndexOrDefault(dataset.borderColor, index, arcOpts.borderColor)

    // Set correct angles if not resetting
    if (!reset || !animationOpts.animateRotate) {
      if (index === 0) {
        model.startAngle = opts.rotation
      } else {
        model.startAngle = _this.getMeta().data[index - 1]._model.endAngle
      }

      model.endAngle = model.startAngle + model.circumference
    }

    arc.pivot()
  }
})

// 4. Generate the vue-chartjs component
// First argument is the chart-id, second the chart type.
const CustomDoughnutPortfolio = generateChart('CustomDoughnutPortfolio', 'CustomDoughnut')
/**
 * Отправные точки в размерах доната
 * */
const outerRadius = 124
const innerRadius = 74.4
/**
 * Цвет шрифта и цвет лейбла доната
 *  */
const clrFont = '#ffffff'
const clrSecondFont = '#707986'
export default {
  extends: CustomDoughnutPortfolio,
  name: 'chartDonutPortfolio',
  props: {
    dataObj: Object
  },
  data () {
    return {
      showInfo: false,
      options: {
        /**
         * Опции плагина
         * */
        pieceLabel: {
          showActualPercentages: true,
          fontFamily: 'Roboto',
          fontSize: 12,
          fontColor: clrFont,
          secondFontColor: clrSecondFont,
          secondFontSize: 12,
          position: ['default', 'inside']
        },
        responsive: false,
        maintainAspectRatio: false,
        cutoutPercentage: 60,
        id: 'doughnutChart',
        outerRadius: outerRadius,
        innerRadius: innerRadius,
        /**
         * Обработчик клика, который висит на бублике непосредственно.
         * */
        onClick: function (e, item) {
          /**
         * Общая информация о канвасе. Функции с api charts.js
         * */
          let activePoints = this.getElementAtEvent(e)
          let meta1 = this.getDatasetMeta(0)
          if (activePoints.length > 0) {
            // increase radius
            console.log('ACTIVE', activePoints)
            /**
             * Получаем текущую выбранную долю с клика
             * */
            let index = activePoints[0]._index
            /**
             * Делаем подписи видимыми/невидимыми
             * */
            activePoints['0']._chart.options.pieceLabel.fontColor = 'rgb(0,0,0,0)'
            activePoints['0']._chart.options.pieceLabel.secondFontColor = 'rgb(0,0,0,0)'
            /**
             * Изменяем размер долей при клике. При клике в пустое место бублика, все сбрасываем в начальное положение
             * */
            meta1.data.forEach(function (item) {
              if (item === meta1.data[index] && !item._model.isOpened) {
                item._model.outerRadius = outerRadius
                item._model.innerRadius = innerRadius * 0.9
                item._model.isOpened = true
                EventBus.$emit('chart:doughnut:grow', item._model.label, true)
                // console.log('Opened')
              } else if (item === meta1.data[index] && item._model.isOpened) {
                item._model.outerRadius = outerRadius * 0.9
                item._model.innerRadius = innerRadius
                item._model.isOpened = false
                EventBus.$emit('chart:doughnut:grow', item._model.label, false)
                // console.log('Closed')
              }
            })
            let chkArr = meta1.data.filter(item => {
              if (item._model.isOpened) { return item }
            })
            if (chkArr.length <= 0) {
              activePoints['0']._chart.options.pieceLabel.fontColor = clrFont
              activePoints['0']._chart.options.pieceLabel.secondFontColor = clrSecondFont
            }
          } else {
            meta1.data.forEach(function (item) {
              item._model.outerRadius = outerRadius * 0.9
              item._model.innerRadius = innerRadius
              item._model.isOpened = false
              EventBus.$emit('chart:doughnut:grow', item._model.label, false)
              // console.log('Closed')
            })
            meta1.data['0']._chart.options.pieceLabel.fontColor = clrFont
            meta1.data['0']._chart.options.pieceLabel.secondFontColor = clrSecondFont
          }
          /**
           * Обновляем виджет с текущим набором данных
           * */
          this.render(0)
        },
        layout: {
          border: 'none',
          padding: {
            left: 20,
            right: 20,
            top: 20,
            bottom: 20
          }
        },
        tooltips: {
          enabled: false
        },
        legend: {
          display: false
        }
      },
      datacollection: {
        labels: this.dataObj !== undefined ? this.dataObj.labels : [],
        percentageInnerCutout: 75,
        datasets: [{
          borderWidth: 0,
          backgroundColor: this.dataObj !== undefined ? this.dataObj.colors : [],
          data: this.dataObj !== undefined ? this.dataObj.data : []
        }]
      }
    }
  },
  watch: {
    dataObj: function (val) {
      this.datacollection.labels = val.labels
      this.datacollection.datasets['0'].data = val.data
      this.datacollection.datasets['0'].backgroundColor = val.colors
      this.$data._chart.update()
    }
  },
  methods: {
    /**
     * Функция отвечает за изменения цвета подписей и размера долей.
     * Однако срабатывает от внешнего события 'chart:doughnut:check', а не от клика.
     * */
    toggleChart (ticker, value) {
      let doughnutObj = this.$data._chart
      /**
       * Получаем данные из нулевого набора (dataset)
       * */
      let chartElements = doughnutObj.getDatasetMeta(0)
      /**
       * Меняем цвет подписей
       * */
      chartElements.data['0']._chart.options.pieceLabel.fontColor = value ? 'rgb(0,0,0,0)' : clrFont
      chartElements.data['0']._chart.options.pieceLabel.secondFontColor = value ? 'rgb(0,0,0,0)' : clrSecondFont
      /**
       * Изменяем размер долей
       * */
      chartElements.data.forEach(item => {
        if (item._model.label === ticker) {
          item._model.outerRadius = value ? outerRadius : (outerRadius * 0.9)
          item._model.innerRadius = value ? (innerRadius * 0.9) : innerRadius
          item._model.isOpened = value
          /**
           * Пробрасываем события в глобальную шину, для отображения лейбла в чарте
           * */
          EventBus.$emit('chart:doughnut:grow', item._model.label, value)
        }
      })
      doughnutObj.render(0)
    }
  },
  created () {
  },
  mounted () {
    this.renderChart(this.datacollection, this.options)
    EventBus.$on('chart:doughnut:check', this.toggleChart)
  },
  destroyed () {
    EventBus.$off('chart:doughnut:check', this.toggleChart)
  }
}
</script>

<style scoped>

</style>
