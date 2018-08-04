<template>
  <span>
      <a href="#"
         @click.prevent=""
         id="timezoneForm"
         :disabled="popoverShow"
         variant="primary">
        {{ currentZoneOffset }}
      </a>

      <b-popover target="timezoneForm"
                 triggers="click"
                 :show.sync="popoverShow"
                 placement="right"
                 container="app"
                 ref="timezoneForm">
      <div class="timezoneForm">

        <div @click="popoverShow = false" class="btn close">
        </div>
            <TheCustomSelectSmall :selected="selectedTimezone" :options="timezones" @updateOption="selectedTimezone = $event"/>
          <div>
            <a href="#" @click.prevent="submit" size="sm" class="btn submit" variant="primary">{{ $t('form.Save')}}</a>
          </div>
        </div>
      </b-popover>
    </span>
</template>

<script>
import Vuex from 'vuex'
import TheCustomSelectSmall from './TheCustomSelectSmall'

const storeLocale = Vuex.createNamespacedHelpers('locale')
export default {
  name: 'formTimeZone',
  components: {TheCustomSelectSmall},
  data () {
    return {
      popoverShow: false,
      selectedTimezone: null
    }
  },
  methods: {
    сlose () {
      this.popoverShow = false
    },
    submit () {
      if (this.selectedTimezone !== 'Default') {
        this.$store.dispatch('locale/setTimezone', this.selectedTimezone)
        this.popoverShow = false
      } else {
        /**
         * Если выбран пункт default, то сбрасываем на значение браузера по умолчанию и пишем в хранилища
         * */
        this.moment.tz.setDefault()
        let defaultZone = this.moment.tz.guess()
        this.$store.dispatch('locale/setTimezone', defaultZone)
      }
      location.reload()
    }
  },
  computed: {
    /**
     * Считаем отступ текущей таймзоны в часах
     * */
    currentZoneOffset () {
      return `UTC +${Math.abs(this.$moment().utcOffset() / 60)}:00`
    },
    ...storeLocale.mapGetters({
      timezones: 'getTimezones',
      timezone: 'timezone'
    })
  },
  created () {
    this.selectedTimezone = this.timezone
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/less/vars";
  a#timezoneForm {
    height: 14px;
    color: #1991eb;
    font-size: 14px;
    font-weight: 400;
    line-height: 14px;
    letter-spacing: -0.07px;
  }
  .timezoneForm{
    padding: 28px 12px 12px 12px;
    box-shadow: 0 4px 8px rgba(184, 194, 201, 0.69);
    .select{
      position: relative;
      &::before {
        content: "";
        position: absolute;
        width: 8px;
        height: 4px;
        right: 6px;
        top: 10px;
        background-image: @img-select-arrow;
        background-position: center;
        background-repeat: no-repeat;
        z-index: 11;
      }
    }
    select{
      padding: 0px 24px 0px 9px;
      height: 24px;
      color: #707986;
      font-family: 'Roboto', sans-serif;
      font-size: 12px;
      font-weight: 400;
      line-height: 24px;
      border: 1px solid rgba(197, 208, 222, 0.5);
      box-shadow: 0 1px 0 #e2e7ee;
      background-color: #ffffff;
      cursor: pointer;
    }
      .btn.submit{
        font-family: 'Roboto', sans-serif;
        padding: 7px 12px 7px 12px;
        -webkit-box-shadow: 0 2px 0 #3b962f;
        box-shadow: 0 2px 0 #3b962f;
        color: #fff;
        position: relative;
        cursor: pointer;
        text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
        font-size: 12px;
        font-weight: 500;
        line-height: 12px;
        letter-spacing: -0.06px;
        margin-top: 10px;
        /* Style for "Rectangle" */
        height: 26px;
        border-radius: 4px;
        background-color: #45af37;
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
      top: 10px;
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
