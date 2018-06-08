<template>
  <div class="portfolio_list">
    <div class="portfolio_list-head">
      <div class="portfolio_list-head-cell portfolio_list-head-name">
        <span>{{ $t('portfolio.name') }}</span>
      </div>
      <div class="portfolio_list-head-cell portfolio_list-head-amount">
        <span>{{ $t('portfolio.Amount') }}</span>
      </div>
      <div class="portfolio_list-head-cell portfolio_list-head-percent">
        <span>%</span>
        <span class="arrow arrow-up"></span>
        <span class="arrow arrow-down arrow--active"></span>
      </div>
      <div class="portfolio_list-head-cell portfolio_list-head-price">
        <span>{{ $t('portfolio.Total_Value') }}</span>
      </div>
      <div class="portfolio_list-head-cell portfolio_list-head-24hour">
        <span>{{ $t('portfolio.24change') }}</span>
      </div>
      <div class="portfolio_list-head-cell portfolio_list-head-capitalizations">
        <span>{{ $t('portfolio.Capitalization') }}</span>
      </div>
      <div class="portfolio_list-head-cell portfolio_list-head-volume">
        <span>{{ $t('portfolio.24H_Volume') }}</span>
      </div>
    </div>
    <!-- /.portfolio_list-head -->
    <template v-if="portfolio.coin"
              v-for="(item, index) in portfolio.coin"
              >
      <portfolio-list-item :key="index"
                           :item="item"
                           :portfolio="portfolio"
                           :totalPercent="totalPercent(item)" >
      </portfolio-list-item>
    </template>
  </div>
  <!-- /.portfolio_list -->
</template>

<script>
import PortfolioListItem from './PortfolioListItem'
import Vuex from 'vuex'
const storeEvent = Vuex.createNamespacedHelpers('portfolio')
export default {
  name: 'PortfolioList',
  components: { PortfolioListItem },
  props: {
    portfolio: Object
  },
  computed: {
    ...storeEvent.mapGetters({
      getCoinByID: 'getCoinByID'
    })
  },
  methods: {
    /**
     * Считаем стоимость каждой монеты отдельно
     * */
    countValue (item) {
      if (this.getCoinByID(item.id)) {
        return (parseFloat(this.getCoinByID(item.id)['price']) * parseFloat(item.amount))
      }
    },
    totalPercent (coin) {
      if (this.portfolio.coin) {
        let total = 0
        for (let index = 0; index < this.portfolio.coin.length; ++index) {
          let item = this.portfolio.coin[index]
          total += this.countValue(item)
        }
        let coinPrice = this.countValue(coin)
        let coinPercent = (coinPrice / total) * 100
        return coinPercent.toFixed(0)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/less/vars";
.portfolio{
  &_list {
    margin-top: 26px;
    box-shadow: 0 2px 4px rgba(51, 51, 51, 0.1);
    border-radius: 4px;
  }
  &_list-head {
    display: table;
    table-layout: fixed;
    width: 100%;
    background-color: #e0e6ed;
    border-bottom: 2px solid #c5d0de;
    &-cell {
      display: table-cell;
      padding: 18px 12px 14px 12px;
      border-right: 1px solid #e9ecee;
      &:last-child {
        border-right: none;
      }
      span {
        color: #525c6c;
        font-family: @main-font;
        font-weight: 400;
        font-size: 13px;
        line-height: 13px;
      }
    }
    &-name {
      padding: 18px 12px 14px 22px;
      width: 20%;
    }
    &-amount {
      width: 20%;
    }
    &-percent {
      position: relative;
      width: 6%;
      .arrow {
        display: block;
        position: absolute;
        cursor: pointer;
        &::before {
          content: "";
          display: inline-block;
          border: 5px solid #c5d0de;
          border-right-width: 4px;
          border-left-width: 4px;
          border-right-color: transparent;
          border-left-color: transparent;
        }
        &--active {
          &::before {
            content: "";
            display: inline-block;
            border: 5px solid #8f96a1;
            border-right-width: 4px;
            border-left-width: 4px;
            border-right-color: transparent;
            border-left-color: transparent;
          }
        }
      }
      .arrow-up {
        top:21px;
        right: 25px;
        &::before {
          border-bottom-width: 0;
        }
      }
      .arrow-down {
        top: 14px;
        right: 25px;
        &::before {
          border-top-width: 0;
        }
      }
    }
    &-price {
      width: 12%;
    }
    &-24hour {
      width: 10%;
    }
    &-capitalizations {
      width: 13%;
    }
    &-volume {
      width: 19%;
    }
  }
}

</style>
