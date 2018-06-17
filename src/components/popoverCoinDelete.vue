<template>
  <b-popover :target="`removeCoinForm-${coin.id}`"
             triggers="click"
             placement="left"
             container="app"
             :ref="`removeCoinForm-${coin.id}`">
    <div class="deleteConfirmForm">
      <!--<div @click="$emit('close')" class="btn close"></div>-->
      <div>
        <div>{{ $t('portfolio.remove_coin', { ticker: coin.ticker }  ) }}</div>
        <a href="#" @click.prevent="$emit('confirm')" size="sm" class="btn submit" variant="primary">{{ $t('form.Remove')}}</a>
        <a href="#" @click.prevent="$emit('close')" size="sm" class="btn submit cancel" variant="primary">{{ $t('form.Cancel')}}</a>
      </div>
    </div>
  </b-popover>
</template>

<script>
export default {
  name: 'popoverCoinDelete',
  props: {
    id: Number,
    coin: Object
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
  .deleteConfirmForm{
    padding: 12px 16px 17px 16px;
    box-shadow: 8px 8px 32px rgba(0, 0, 0, 0.35);
    text-align: center;
    .btn.submit{
      margin-top: 12px;
      font-family: 'Roboto', sans-serif;
      padding: 6px 8px 4px 6px;
      -webkit-box-shadow: 0 2px 0 #3b962f;
      box-shadow: 0 2px 0 #3b962f;
      border-radius: 4px;
      background-color: #44af36;
      color: #fff;
      position: relative;
      cursor: pointer;
      height: 26px;
      text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
      font-size: 14px;
      font-weight: 500;
      line-height: 14px;
      letter-spacing: -0.23px;
      &.cancel{
        box-shadow: 0 2px 0 #4d515c;
        background-color: #8f96a1;
        &:hover,
        &:focus,
        &:active{
          position: relative;
          text-decoration: none;
          background-color: #8f96a1;
          color: #fff!important;
          box-shadow: 0 2px 0 #4d515c, inset 0 2px 4px rgba(1, 1, 1, 0.3);
        }
      }
      &:hover,
      &:focus,
      &:active{
        position: relative;
        text-decoration: none;
        background-color: #45af37;
        color: #fff!important;
        box-shadow: 0 2px 0 #3e9532, inset 0 2px 4px rgba(1, 1, 1, 0.3);
      }
    }
    .btn.close{
      position: absolute;
      right: 0px;
      top: 6px;
      width: 8px;
      height: 8px;
      background-color: transparent;
      border: 0;
      outline: 0;
      cursor: pointer;
      z-index: 30000;
      &::before {
        content: "";
        position: absolute;
        width: 12px;
        height: 1px;
        top: 6px;
        left: 1px;
        background-color: #707986;;
        transform: rotate(45deg);
      }
      &::after {
        content: "";
        position: absolute;
        width: 12px;
        height: 1px;
        top: 6px;
        left: 1px;
        background-color: #707986;;
        transform: rotate(-45deg);
      }
    }
  }
</style>
