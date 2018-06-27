<template>
    <div class="chart_portfolio__wrapper">
        <h4>Portfolio Chart</h4>
        <chart-portfolio :operations.sync="operations"></chart-portfolio>
        <div class="row">
            <div class="col-md-6 chart_portfolio__labels">
                <span class="chart_label bought">{{ $t('portfolio.bought') }}</span>
                <span class="chart_label sold">{{ $t('portfolio.sold') }}</span>
                <span class="chart_label swapped">{{ $t('portfolio.swapped') }}</span>
            </div>
            <div class="col-md-6 chart_portfolio__filter">

            </div>
        </div>
    </div>
</template>
<script>
import ChartPortfolio from './chartPortfolio'
/**
 * Тестовый набор операций
 * */
let operations = [
  {
    date: '2018-06-17T02:36:04.632Z',
    portfolio_cost: '3213489',
    operations: [
      {
        type: 'sold',
        value: '2.36 BTC',
        swapped_in: ''
      },
      {
        type: 'bought',
        value: '1.76 ETH',
        swapped_in: ''
      },
      {
        type: 'swapped',
        value: '4.76 ETH',
        swapped_in: '3 BTC'
      }
    ]
  },
  {
    date: '2018-06-18T02:36:04.632Z',
    portfolio_cost: '689326',
    operations: [
      {
        type: 'bought',
        value: '0.76 ETH',
        swapped_in: ''
      },
      {
        type: 'swapped',
        value: '2.76 ETH',
        swapped_in: '3 BTC'
      },
      {
        type: 'sold',
        value: '0.36 BTC',
        swapped_in: ''
      }
    ]
  },
  {
    date: '2018-06-19T02:36:04.632Z',
    portfolio_cost: '938932',
    operations: [
      {
        type: 'bought',
        value: '0.76 ETH',
        swapped_in: ''
      },
      {
        type: 'sold',
        value: '0.36 BTC',
        swapped_in: ''
      },
      {
        type: 'swapped',
        value: '2.76 ETH',
        swapped_in: '3 BTC'
      }
    ]
  },
  {
    date: '2018-06-21T02:36:04.632Z',
    portfolio_cost: '4383332',
    operations: [
      {
        type: 'swapped',
        value: '2.76 ETH',
        swapped_in: '3 BTC'
      },
      {
        type: 'bought',
        value: '0.76 ETH',
        swapped_in: ''
      },
      {
        type: 'sold',
        value: '0.36 BTC',
        swapped_in: ''
      }
    ]
  },
  {
    date: '2018-07-19T02:36:04.632Z',
    portfolio_cost: '6938955',
    operations: [
      {
        type: 'sold',
        value: '0.36 BTC',
        swapped_in: ''
      },
      {
        type: 'bought',
        value: '0.76 ETH',
        swapped_in: ''
      },
      {
        type: 'swapped',
        value: '2.76 ETH',
        swapped_in: '3 BTC'
      }
    ]
  },
  {
    date: '2019-07-19T02:36:04.632Z',
    portfolio_cost: '268888',
    operations: [
      {
        type: 'swapped',
        value: '2.76 ETH',
        swapped_in: '3 BTC'
      },
      {
        type: 'bought',
        value: '0.76 ETH',
        swapped_in: ''
      },
      {
        type: 'sold',
        value: '0.36 BTC',
        swapped_in: ''
      }
    ]
  }
]
export default {
  name: 'PortfolioChartWrapper',
  data () {
    return {
      operations: operations
    }
  },
  components: {ChartPortfolio},
  props: {
    portfolio: {}
  }
}
</script>
<style lang="less" scoped>
    @import "../assets/less/vars";
    .chart_portfolio {
    &__wrapper{
        h4{
          height: 24px;
          color: #525c6c;
          font-size: 16px;
          font-weight: 700;
          line-height: 24px;
          padding-bottom: 27px;
        }
      }
      &__labels {
        text-align: left;
        display: flex;
        flex-direction: row;
        padding-top: 24px;
        padding-left: 13%;
        .chart_label {
          color: #525c6c;
          font-size: 11px;
          font-weight: 500;
          line-height: 12px;
          letter-spacing: -0.05px;
          margin-right: 28px;
          &::before {
            content: '';
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 4px;
            margin-right: 4px;
          }
          &.bought::before{
            background-color: #45af37;
          }
          &.sold::before{
            background-color: #ff3657;
          }
          &.swapped::before{
            background-color: #1991eb;
          }
        }

      }
    }
</style>
