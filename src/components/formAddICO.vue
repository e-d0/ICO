<template>
  <div class="add_ico_form">
    <div v-b-toggle="'formICO'" class="add_ico_form-close">
    </div>
    <h3>Добавить ICO в Календарь</h3>
    <form class="add-coin-form">
      <h4>Название</h4>
      <fieldset class="fieldset-left">
        <multiselect class="" id="formAddIco"
                       v-model="value"
                       placeholder=""
                       label="title" track-by="title"
                       :options="ICO"
                       :option-height="104"
                       :multiple="false"
                       :show-labels="false"
                       :preselect-first="false"
                       @input="setICO">
        <template slot="singleLabel" slot-scope="props">
          <img class="option__image" :src="props.option.icon" :alt="props.option.title">
          <span class="option__title">{{ props.option.title }}</span>
          <span class="option__bullet">&#8226;</span>
          <span class="option__ticker">{{ props.option.ticker }}</span>
        </template>
        <template slot="option" slot-scope="props">
          <img class="option__image" :src="props.option.icon" :alt="props.option.title">
          <span class="option__title">{{ props.option.title }}</span>
          <span class="option__bullet">&#8226;</span>
          <span class="option__ticker">{{ props.option.ticker }}</span>
        </template>
        <template slot="tag" slot-scope="props">
        <span></span>
        </template>
        </multiselect>
        <button @click.prevent = "" class="add-coin-form_buttons btn btn-primary" type="submit" name="button">Добавить</button>
      </fieldset>
    </form>
  </div>
    <!-- /.add-coin-form -->
</template>

<script>
import multiselect from 'vue-multiselect'
import Vuex from 'vuex'
const storeEvent = Vuex.createNamespacedHelpers('event')
export default {
  name: 'formAddICO',
  data () {
    return {
      value: null
    }
  },
  components: { multiselect },
  computed: {
    ...storeEvent.mapState(['ICO'])
  },
  methods: {
    setICO (val) {
      console.log(val)
    },
    /**
     * Получаем список ICO
     * */
    getICO () {
      return this.$store.dispatch('event/getICO').then((response) => {
        return response
      }, error => {
        console.log(error)
      })
    }
  },
  mounted: function () {
    /**
     * Запускаем метод при создании компонента в dom
     * */
    this.getICO()
  }
}
</script>

<!-- New step!vue-multiselect
     Add Multiselect CSS. Can be added as a static asset or inside a component. -->
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="less">
@import "../assets/less/vars";
.add_ico_form {
  margin-bottom: 40px;
  position: relative;
  padding: 20px;
  border-top: 4px solid @accent-color;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 10px 30px rgba(82, 92, 108, 0.15);
  z-index: 2;
  .fieldset-left {
    width: 100%;
    .multiselect{
      display: inline-block;
      width: 85%;
      margin-right: 15px;
      margin-bottom: 0;
      vertical-align: middle;
      .multiselect__element span.multiselect__option.multiselect__option--highlight:after,
      .multiselect__element span.multiselect__option.multiselect__option--highlight{
        background: #c5d0de!important;
      }
      .option{
        &__image{
          width: 24px;
          height: 24px;
          margin-right: 8px;
        }
        &__title{
          color: #333f52;
          font-size: 14px;
          font-weight: 500;
          line-height: 16px;
          letter-spacing: -0.2px;
        }
        &__bullet{
          color: #333f52;
        }
        &__ticker{
          color: #8f96a1;
          letter-spacing: -0.2px;
        }

      }
    }
  }
  &-close {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 13px;
    height: 13px;
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
  h3 {
    margin-bottom: 16px;
    color: #525c6c;
    font-family: @main-font;
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    display: block;
  }
  .add-coin-form {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    fieldset{
    }
    h4 {
      margin-bottom: 16px;
      color: #525c6c;
      font-family: @main-font;
      font-size: 16px;
      font-weight: 700;
      line-height: 24px;
      display: block;
    }
    &_wrapper {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
    &_buttons {
      &.btn {
        text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
        font-family: @main-font;
        font-size: 14px;
        font-weight: 500;
        line-height: 14px;
        padding: 10px 17px 9px;
        box-shadow: 0 2px 0 darken(@accent-color, 10%);
        border-radius: 4px;
        background-color: @accent-color;
        color: #fff;
        height: 100%;
        vertical-align: middle;
        display: inline-block;
        bottom: 2px;
        float: right;
        &:active,
        &:focus,
        &:hover{
          text-decoration: none;
          background-color: #45af37;
          color: #fff;
          box-shadow: 0 2px 0 #3e9532, inset 0 2px 4px rgba(1, 1, 1, 0.3);
        }
      }
    }
  }
}
</style>
