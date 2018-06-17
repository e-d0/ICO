<!--<script>-->
<!--import { EventBus } from './eventbus'-->
<!--// 1. Import Chart.js so you can use the global Chart object-->
<!--import Chart from 'chart.js'-->
<!--// 2. Import the `generateChart()` method to create the vue component.-->
<!--import { generateChart } from 'vue-chartjs'-->

<!--let helpers = Chart.helpers-->

<!--// 3. Extend on of the default charts-->
<!--// http://www.chartjs.org/docs/latest/developers/charts.html-->
<!--Chart.defaults.CustomDoughnut = Chart.defaults.doughnut-->

<!--Chart.controllers.CustomDoughnut = Chart.controllers.doughnut.extend({-->
  <!--updateElement: function (arc, index, reset) {-->
    <!--let _this = this-->
    <!--let chart, chartArea, opts, animationOpts, arcOpts, centerX, centerY, startAngle, endAngle, dataset, circumference,-->
      <!--innerRadius, outerRadius, custom, valueAtIndexOrDefault-->
    <!--chart = _this.chart-->
    <!--chartArea = chart.chartArea-->
    <!--opts = chart.options-->
    <!--animationOpts = opts.animation-->
    <!--arcOpts = opts.elements.arc-->
    <!--centerX = (chartArea.left + chartArea.right) / 2-->
    <!--centerY = (chartArea.top + chartArea.bottom) / 2-->
    <!--startAngle = opts.rotation-->
    <!--endAngle = opts.rotation-->
    <!--dataset = _this.getDataset()-->
    <!--circumference = reset && animationOpts.animateRotate ? 0 : arc.hidden ? 0 : _this.calculateCircumference(dataset.data[index]) * (opts.circumference / (2.0 * Math.PI))-->
    <!--innerRadius = reset && animationOpts.animateScale ? 0 : _this.innerRadius-->
    <!--outerRadius = reset && animationOpts.animateScale ? 0 : _this.outerRadius-->
    <!--custom = arc.custom || {}-->
    <!--valueAtIndexOrDefault = helpers.getValueAtIndexOrDefault-->

    <!--// console.log('outerRadius',outerRadius);-->
    <!--outerRadius *= 0.9-->
    <!--helpers.extend(arc, {-->
      <!--// Utility-->
      <!--_datasetIndex: _this.index,-->
      <!--_index: index,-->

      <!--// Desired view properties-->
      <!--_model: {-->
        <!--x: centerX + chart.offsetX,-->
        <!--y: centerY + chart.offsetY,-->
        <!--startAngle: startAngle,-->
        <!--endAngle: endAngle,-->
        <!--circumference: circumference,-->
        <!--outerRadius: outerRadius,-->
        <!--innerRadius: innerRadius,-->
        <!--label: valueAtIndexOrDefault(dataset.label, index, chart.data.labels[index])-->
      <!--}-->
    <!--})-->

    <!--let model = arc._model-->
    <!--model.backgroundColor = custom.backgroundColor ? custom.backgroundColor : valueAtIndexOrDefault(dataset.backgroundColor, index, arcOpts.backgroundColor)-->
    <!--model.hoverBackgroundColor = custom.hoverBackgroundColor ? custom.hoverBackgroundColor : valueAtIndexOrDefault(dataset.hoverBackgroundColor, index, arcOpts.hoverBackgroundColor)-->
    <!--model.borderWidth = custom.borderWidth ? custom.borderWidth : valueAtIndexOrDefault(dataset.borderWidth, index, arcOpts.borderWidth)-->
    <!--model.borderColor = custom.borderColor ? custom.borderColor : valueAtIndexOrDefault(dataset.borderColor, index, arcOpts.borderColor)-->

    <!--// Set correct angles if not resetting-->
    <!--if (!reset || !animationOpts.animateRotate) {-->
      <!--if (index === 0) {-->
        <!--model.startAngle = opts.rotation-->
      <!--} else {-->
        <!--model.startAngle = _this.getMeta().data[index - 1]._model.endAngle-->
      <!--}-->

      <!--model.endAngle = model.startAngle + model.circumference-->
    <!--}-->

    <!--arc.pivot()-->
  <!--}-->
<!--})-->

<!--// Chart.defaults.CustomDoughnut.extend({-->
<!--//   showTooltip: function () {-->
<!--//     this.chart.ctx.save()-->
<!--//     Chart.defaults.CustomDoughnut.prototype.showTooltip.apply(this, arguments)-->
<!--//     this.chart.ctx.restore()-->
<!--//   },-->
<!--//   draw: function () {-->
<!--//     Chart.defaults.CustomDoughnut.prototype.draw.apply(this, arguments)-->
<!--//-->
<!--//     let width, height-->
<!--//     width = this.chart.width-->
<!--//     height = this.chart.height-->
<!--//-->
<!--//     let fontSize = (height / 114).toFixed(2)-->
<!--//     this.chart.ctx.font = fontSize + 'em Verdana'-->
<!--//     this.chart.ctx.textBaseline = 'middle'-->
<!--//-->
<!--//     let text, textX, textY-->
<!--//     text = '82%'-->
<!--//     textX = Math.round((width - this.chart.ctx.measureText(text).width) / 2)-->
<!--//     textY = height / 2-->
<!--//-->
<!--//     this.chart.ctx.fillText(text, textX, textY)-->
<!--//   }-->
<!--// })-->

<!--// 4. Generate the vue-chartjs component-->
<!--// First argument is the chart-id, second the chart type.-->
<!--const CustomDoughnut = generateChart('CustomDoughnut', 'CustomDoughnut')-->

<!--export default {-->
  <!--extends: CustomDoughnut,-->
  <!--name: 'chartDonutPortfolio',-->
  <!--props: {-->
    <!--dataObj: Object-->
  <!--},-->
  <!--data () {-->
    <!--return {-->
      <!--showInfo: false,-->
      <!--options: {-->
        <!--responsive: true,-->
        <!--maintainAspectRatio: false,-->
        <!--cutoutPercentage: 60,-->
        <!--id: 'doughnutChart',-->
        <!--outerRadius: 200,-->
        <!--innerRadius: 100,-->
        <!--// hover: {-->
        <!--//   onHover: function (data) {-->
        <!--//     console.log(data)-->
        <!--//   }-->
        <!--// },-->
        <!--onClick: function (e) {-->
          <!--console.log('click>>>>>>>>', e)-->
          <!--let item = this.getElementAtEvent(e)-->
          <!--console.log('2nd>>>>>>>>', this)-->
          <!--if (item.length > 0) {-->
            <!--if (!item['0'].isOpened) {-->
              <!--item['0']._model.outerRadius = (item['0']._model.outerRadius * 1.05).toFixed(4)-->
              <!--item['0']._model.innerRadius = (item['0']._model.innerRadius * 0.95).toFixed(4)-->
              <!--item['0'].isOpened = true-->
              <!--EventBus.$emit('chart:doughnut:grow', item['0']._model.label, true)-->
            <!--} else {-->
              <!--item['0']._model.outerRadius = (item['0']._model.outerRadius / 1.05).toFixed(4)-->
              <!--item['0']._model.innerRadius = (item['0']._model.innerRadius / 0.95).toFixed(4)-->
              <!--item['0'].isOpened = false-->
              <!--EventBus.$emit('chart:doughnut:grow', item['0']._model.label, false)-->
            <!--}-->
          <!--}-->
        <!--},-->
        <!--layout: {-->
          <!--border: 'none'-->
        <!--},-->
        <!--legend: {-->
          <!--display: false-->
        <!--}-->
      <!--},-->
      <!--datacollection: {-->
        <!--labels: this.dataObj !== undefined ? this.dataObj.labels : [],-->
        <!--percentageInnerCutout: 80,-->
        <!--datasets: [{-->
          <!--borderWidth: 0,-->
          <!--backgroundColor: this.dataObj !== undefined ? this.dataObj.colors : [],-->
          <!--data: this.dataObj !== undefined ? this.dataObj.data : []-->
        <!--}]-->
      <!--}-->
    <!--}-->
  <!--},-->
  <!--watch: {-->
    <!--dataObj: function (val) {-->
      <!--console.log('new dataObj at DOunugh graph', val)-->
      <!--this.datacollection.labels = val.labels-->
      <!--this.datacollection.datasets['0'].data = val.data-->
      <!--this.datacollection.datasets['0'].backgroundColor = val.colors-->
      <!--// this.$data._chart.destroy()-->
      <!--this.$data._chart.update()-->
    <!--}-->
  <!--},-->
  <!--methods: {-->
    <!--toggleChart: function (ticker) {-->
      <!--let doughnut = this.$data._chart-->
      <!--if (doughnut !== undefined && ticker) {-->
        <!--console.log('ACCEPTED >>>>>>>>>', this.$data)-->
      <!--}-->
      <!--// let item = this.getElementAtEvent(e)-->
      <!--// if (item.length > 0) {-->
      <!--//   if (!item['0'].isOpened) {-->
      <!--//     console.log('Clicked data', this)-->
      <!--//     item['0']._model.outerRadius = (item['0']._model.outerRadius * 1.05).toFixed(4)-->
      <!--//     item['0']._model.innerRadius = (item['0']._model.innerRadius * 0.95).toFixed(4)-->
      <!--//     item['0'].isOpened = true-->
      <!--//   } else {-->
      <!--//     item['0']._model.outerRadius = (item['0']._model.outerRadius / 1.05).toFixed(4)-->
      <!--//     item['0']._model.innerRadius = (item['0']._model.innerRadius / 0.95).toFixed(4)-->
      <!--//     item['0'].isOpened = false-->
      <!--//     console.log('Clicked data', this)-->
      <!--//   }-->
      <!--//   EventBus.$emit('chart:doughnut:grow', item['0']._model.label)-->
      <!--// }-->
    <!--}-->
  <!--},-->
  <!--created () {-->
    <!--EventBus.$on('chart:doughnut:check', this.toggleChart)-->
    <!--EventBus.$on('chart:doughnut:check', this.toggleChart)-->
  <!--},-->
  <!--mounted () {-->
    <!--this.renderChart(this.datacollection, this.options)-->
  <!--}-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->

<!--<template>-->
  <!--<div class="donut_wrapper">-->
    <!--<canvas ref="chartDonutPortfolio" height="400" width="290"></canvas>-->
  <!--</div>-->
<!--</template>-->

<!--<script>-->
<!--import Chart from 'chart.js'-->
<!--import { EventBus } from './eventbus'-->
<!--export default {-->
  <!--name: 'chartDonutPortfolio',-->
  <!--props: {-->
    <!--dataObj: Object-->
  <!--},-->
  <!--data () {-->
    <!--return {-->
      <!--type: 'doughnut',-->
      <!--data: {-->
        <!--labels: this.dataObj !== undefined ? this.dataObj.labels : [],-->
        <!--datasets: [{-->
          <!--borderWidth: 0,-->
          <!--backgroundColor: this.dataObj !== undefined ? this.dataObj.colors : [],-->
          <!--data: this.computedData-->
        <!--}]-->
      <!--},-->
      <!--options: {-->
        <!--onClick: function (e) {-->
          <!--console.log('click>>>>>>>>', e)-->
          <!--let item = this.getElementAtEvent(e)-->
          <!--console.log('2nd>>>>>>>>', this)-->
          <!--if (item.length > 0) {-->
            <!--if (!item['0'].isOpened) {-->
              <!--item['0']._model.outerRadius = (item['0']._model.outerRadius * 1.05).toFixed(4)-->
              <!--item['0']._model.innerRadius = (item['0']._model.innerRadius * 0.95).toFixed(4)-->
              <!--item['0'].isOpened = true-->
              <!--EventBus.$emit('chart:doughnut:grow', item['0']._model.label, true)-->
            <!--} else {-->
              <!--item['0']._model.outerRadius = (item['0']._model.outerRadius / 1.05).toFixed(4)-->
              <!--item['0']._model.innerRadius = (item['0']._model.innerRadius / 0.95).toFixed(4)-->
              <!--item['0'].isOpened = false-->
              <!--EventBus.$emit('chart:doughnut:grow', item['0']._model.label, false)-->
            <!--}-->
          <!--}-->
        <!--},-->
        <!--cutoutPercentage: 60,-->
        <!--responsive: true,-->
        <!--layout: {-->
          <!--border: 'none'-->
        <!--},-->
        <!--legend: {-->
          <!--display: false-->
        <!--}-->
      <!--}-->
    <!--}-->
  <!--},-->
  <!--watch: {-->
    <!--dataObj: function (val) {-->
      <!--console.log('new dataObj at DOunugh graph', val)-->
      <!--this.data.labels = val.labels-->
      <!--this.data.datasets['0'].data = val.data-->
      <!--this.data.datasets['0'].backgroundColor = val.colors-->
      <!--// this.$data._chart.destroy()-->
      <!--// this.$data._chart.update()-->
    <!--}-->
  <!--},-->
  <!--computed: {-->
    <!--computedData: function () {-->
      <!--return this.dataObj.data-->
    <!--}-->
  <!--},-->
  <!--methods: {-->
    <!--renderCanvas () {-->
      <!--let chart = this.$refs.chartDonutPortfolio-->
      <!--let ctx = chart.getContext('2d')-->
      <!--return new Chart(ctx, this.$data)-->
    <!--}-->
  <!--},-->
  <!--beforeDestroy () {-->
  <!--},-->
  <!--mounted () {-->
    <!--this.renderCanvas()-->
  <!--}-->
<!--}-->
<!--</script>-->
<!--<style lang="less" scoped>-->
  <!--@import "../assets/less/vars";-->
  <!--.donut_wrapper{-->
    <!--position: relative;-->
  <!--}-->
<!--</style>-->
