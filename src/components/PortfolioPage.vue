<template>
  <div id="app">
    <tpl-header></tpl-header>
    <div class="container-fluid">
      <div class="row">
        <div class="col">
          <div class="portfolio-nav">
            <ul v-if="portfolios" class="portfolio-nav_menu">
              <li v-for="(item, index) in portfolios"
                  :key="index"
                  :class="[
                    'portfolio-nav_menu-item',
                    { 'portfolio-nav_menu-item--active': isActive === index },
                    { 'portfolio-nav_menu-item--private': item.is_private === true }
                  ]">
                <a @click.prevent="changePortfolio(index)" href="#">{{ item.title }}</a>
              </li>
            </ul>
            <div class="portfolio-nav_add-portfolio">
              <a href="#">{{ $t('portfolio.Add_portfolio') }}</a>
            </div>
            <div class="portfolio-nav_button">
              <b-btn  class="btn" v-b-toggle.formAddDeleteCoin variant="primary">{{ $t('portfolio.Add_Delete_Coin') }}</b-btn>
              <!--<a href="#" class="btn">{{ $t('portfolio.Add_Delete_Coin') }}</a>-->
            </div>
          </div>
          <!-- /.portfolio-nav -->
        </div>
        <!-- /.col -->
      </div>
      <!-- /.row -->
    </div>
    <portfolio-body :portfolio.sync="activePortfolio"></portfolio-body>
    <tpl-footer></tpl-footer>
  </div>
</template>

<script>
import tplHeader from './TheHeader'
import tplFooter from './TheFooter'
import PortfolioBody from './PortfolioBody'
import Vuex from 'vuex'
const storeEvent = Vuex.createNamespacedHelpers('portfolio')
export default {
  name: 'PortfolioPage',
  components: { tplHeader, tplFooter, PortfolioBody },
  data () {
    return {
      isActive: 0
    }
  },
  computed: {
    ...storeEvent.mapState({
      portfolios: 'portfolios'
    }),
    activePortfolio () {
      return this.portfolios[this.isActive]
    }
  },
  methods: {
    ...storeEvent.mapActions(['setCurrentPortfolio']),
    changePortfolio (index) {
      this.isActive = index
    },
    /**
     * Загрузить все портфели в хранилище
     * */
    getPortfolios () {
      this.$store.dispatch('portfolio/getPortfolios')
    },
    getCurrencies () {
      this.$store.dispatch('portfolio/getCurrencies')
    }
  },
  created () {
    this.getPortfolios()
    this.getCurrencies()
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/less/vars";
  .portfolio-nav {
    display: flex;
    align-items: center;
    padding: 18px 0 6px;
    &_menu {
      display: flex;
      border-bottom: 1px solid #c5d0de;
      &-item {
        margin-right: 48px;
        &:last-child {
          margin-right: 22px;
        }
        a {
          display: inline-block;
          padding: 14px 0;
          color: #707986;
          font-family: @main-font;
          font-weight: 400;;
          font-size: 20px;
          line-height: 18px;
        }
        &--active {
          position: relative;
          &::before {
            content: "";
            position: absolute;
            width: 100%;
            height: 4px;
            background-color: @accent-color;
            top: 46px;
            left: 0;
          }
          a {
            color: #333f52;
            font-family: @main-font;
            font-weight: 500;
          }
        }
        &--private {
          a {
            position: relative;
            &::before {
              content: '';
              position: absolute;
              top: 18px;
              left: -14px;
              width: 7px;
              height: 10px;
              background-image: @img-lock-small;
              background-repeat: no-repeat;
              background-position: center;
              z-index: 11;
            }
          }
        }
      }
    }
    &_add-portfolio {
      a {
        padding-left: 26px;
        position: relative;
        color: #45af37;
        font-family: @main-font;
        font-weight: 400;
        font-size: 14px;
        line-height: 12px;
        text-decoration: underline;
        text-decoration-style: dashed;
        &::before {
          content: '';
          position: absolute;
          top: 2px;
          left: 6px;
          width: 14px;
          height: 14px;
          background-image: @img-plus;
          background-repeat: no-repeat;
          background-position: center;
          z-index: 11;
        }
      }
    }
    &_button {
      margin-left: auto;
      .btn {
        position: relative;
        padding: 11px 11px 11px 32px;
        /*background-image: linear-gradient(180deg, #358c29 0%, #45af36 100%);*/
        color: #ffffff;
        font-family: @main-font;
        font-weight: 500;
        font-size: 13px;
        line-height: 11px;
        letter-spacing: -0.22px;
        box-shadow: 0 2px 0 #3b962f;
        border-radius: 4px;
        background-color: #45af37;
        text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
        &::before {
          content: "";
          position: absolute;
          width: 15px;
          height: 15px;
          left: 10px;
          top: 9px;
          background-image: @img-coin;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 11;
        }
      }
    }
  }
</style>
