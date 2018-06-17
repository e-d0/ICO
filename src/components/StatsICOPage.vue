<template>
  <div id="app">
    <tpl-header></tpl-header>
    <StatsBody></StatsBody>
    <tpl-footer></tpl-footer>
  </div>

  <!-- /.content -->
</template>

<script>
import tplHeader from './TheHeader'
import tplFooter from './TheFooter'
import StatsBody from './StatsBody'

export default {
  name: 'StatsICOPage',
  components: { StatsBody, tplHeader, tplFooter },
  data () {
    return {
    }
  }
}

</script>

<style lang="less" scoped>

  @import "../assets/less/vars";

</style>
