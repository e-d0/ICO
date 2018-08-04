<template>
    <div class="btn-group">
        <li @click="toggleMenu()" class="dropdown-toggle" v-if="selectedOption !== undefined">
            {{ selectedOption }}
          <span :class="['caret', {'opened': showMenu }]"></span>
        </li>

        <li @click="toggleMenu()" class="dropdown-toggle" v-if="selectedOption === undefined">
            {{placeholderText}}
            <span :class="['caret', {'opened': showMenu }]"></span>
        </li>

        <ul class="dropdown-menu" v-if="showMenu" >
            <li class="language_list-item"
                    value="default"
            ><a href="javascript:void(0)" @click="updateOption('Default')">
              {{ $t('form.default') }}
            </a></li>
            <li v-for="(option, index) in options" :key="index">
                <a href="javascript:void(0)" @click="updateOption(option)">
                    {{ option }}
                </a>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
  name: 'TheCustomSelectSmall',
  data () {
    return {
      selectedOption: {},
      showMenu: false,
      placeholderText: 'Select an item'
    }
  },
  props: {
    options: {
      type: [Array, Object]
    },
    selected: {},
    placeholder: [String]
  },
  mounted () {
    this.selectedOption = this.selected
    if (this.placeholder) {
      this.placeholderText = this.placeholder
    }
  },
  methods: {
    updateOption (option) {
      this.selectedOption = option
      this.showMenu = false
      this.$emit('updateOption', this.selectedOption)
    },
    toggleMenu () {
      this.showMenu = !this.showMenu
    }
  }
}
</script>
<style lang="less" scoped>
    @import "../assets/less/vars";
    .btn-group {
      min-width: 160px;
      position: relative;
      margin: 10px 1px;
      display: inline-block;
      vertical-align: middle;
    }
    .btn-group a:hover {
      text-decoration: none;
    }
    .dropdown-toggle {
      padding: 0px 10px 0px 9px;
      height: 24px;
      color: #707986;
      font-family: 'Roboto', sans-serif;
      font-size: 12px;
      font-weight: 400;
      line-height: 24px;
      border: 1px solid rgba(197, 208, 222, 0.5);
      border-radius: 2px;
      box-shadow: 0 1px 0 #e2e7ee;
      background-color: #ffffff;
      cursor: pointer;
      transition: background 0s ease-out;
      float: none;
      &:after{
        content: none;
      }
    }
    .dropdown-toggle:hover {
      background: #e1e1e1;
      cursor: pointer;
    }
    .dropdown-menu {
      border: 1px solid rgba(197, 208, 222, 0.5);
      border-radius: 2px;
      display: block;
      position: absolute;
      top: 100%;
      left: 0;
      z-index: 1000;
      float: left;
      max-width: 160px;
      padding: 0;
      margin: 0px;
      list-style: none;
      font-size: 12px;
      text-align: left;
      background-color: #fff;
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
      background-clip: padding-box;
    }
    .dropdown-menu > li > a {
      padding: 1px 10px;
      height: 22px;
      display: block;
      clear: both;
      font-weight: normal;
      line-height: 1.6;
      color: #707986;
      white-space: nowrap;
      text-decoration: none;
    }
    .dropdown-menu > li > a:hover {
      background: #707986;
      color: #ffffff;
    }
    .dropdown-menu > li {
      overflow: hidden;
      width: 100%;
      position: relative;
      margin: 0;
    }
    .caret {
      /*display: relative;*/
      position: relative;
      top: 10px;
      margin-left: 2px;
      width: 8px;
      height: 4px;
      background-image: @img-select-arrow;
      background-position: center;
      background-repeat: no-repeat;
      float: right;
      transform: rotateX(0deg);
      &.opened{
        transform: rotateX(180deg);
        /*display: relative;*/
        position: relative;
        top: 10px;
        margin-left: 2px;
        width: 8px;
        height: 4px;
        background-image: @img-select-arrow;
        background-position: center;
        background-repeat: no-repeat;
        float: right;
      }
    }
    li {
      list-style: none;
    }
</style>
