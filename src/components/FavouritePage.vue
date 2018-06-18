<template>
  <div id="app">
    <tpl-header></tpl-header>
    <FavouriteBody></FavouriteBody>
    <tpl-footer></tpl-footer>
  </div>

  <!-- /.content -->
</template>

<script>
import tplHeader from './TheHeader'
import tplFooter from './TheFooter'
import FavouriteBody from './FavouriteBody'

export default {
  name: 'FavouritePage',
  components: { FavouriteBody, tplHeader, tplFooter },
  data () {
    return {
    }
  }
}

</script>

<style lang="less" scoped>

  @import "../assets/less/vars";

</style>
