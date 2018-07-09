<template>

  <ul class="event-list" >

    <div  v-if="events.length > 1"
         :class="['event_nav', {'last': isLastElem() }]"
         @click="nextSlide()" >
          {{ countGroups() }}
    </div>

    <li v-for="(event,count) in events[index]"
        :key="count"
        :class="`calendar__day__event--${[event.tempType]}`"
        :id="generateId(event)">
      {{event.name}}
      <popover :target="generateId(event)" :popoverShow="popoverShow" :clickedEvent="event" :isStart="event.isStart" ></popover>
    </li>

  </ul>

</template>s

<script>
import popover from './popover'
export default {
  name: 'CalendarMonthEvent',
  components: { popover },
  data () {
    return {
      index: 0,
      popoverShow: false
    }
  },
  props: {
    events: Array
  },
  methods: {
    generateId (event) {
      return `event-month-${event.id}-${event.isStart ? 'starts' : 'ends'}`
    },
    isLastElem () {
      return this.events.length === this.index + 1
    },
    nextSlide () {
      if (this.index < this.events.length - 1) {
        this.index++
      } else {
        this.index = 0
      }
    },
    countGroups () {
      let counter = parseInt(this.events.length - (this.index + 1))
      return counter === 0 ? parseInt(this.events.length - 1) : counter
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/less/vars";
  .event-list {
    font-size: .8rem;
    color: #42b983;
    font-weight: 700;
    list-style: none;
    padding: 0;
    margin: .5rem 0;
    position: relative;
    li{
      padding: 5px 12px;
      text-align: left;
      height: 24px;
      text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
      color: #ffffff;
      font-size: 12px;
      font-weight: bold;
      line-height: 14px;
      letter-spacing: -0.05px;
      cursor: pointer;
      &:active,
      &:focus,
      &:hover {
        box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.2);
      }
      &.calendar__day__event {
        white-space: nowrap;
        width: 100%;
        &--pre_ico {
          background-color: @pre-ico;
        }
        &--start_ico {
          background-color: @start-ico;
        }
        &--ending_ico {
          background-color: @ending-ico;
        }
        &--white_list {
          background-color: @white-list;
        }
        &--KYC {
          background-color: @KYC;
        }
      }
    }
  }

  .event_nav {
    padding: 0px 10px 0px 6px;
    border-radius: 10px;
    position: absolute;
    background: #fff;
    right: 10px;
    bottom: -7px;
    color: #8f96a1;
    cursor: pointer;
    z-index: 20;
    font-size: 10px;
    -webkit-box-shadow: 0 5px 5px rgba(51, 51, 51, 0.09);
    box-shadow: 0 5px 5px rgba(51, 51, 51, 0.09);
    &:after{
      position: absolute;
      right: 4px;
      top: 28%;
      color: #999;
      border-style: solid;
      border-width: 3px 0 3px 4px;
      border-color: transparent transparent transparent #3f3f3f9c;
      content: "";
    }
    &.last{
      padding: 0px 6px 0px 10px;
    }
    &.last:after{
      position: absolute;
      right: 14px;
      top: 28%;
      color: #999;
      border-style: solid;
      border-width: 3px 4px 3px 0;
      border-color: transparent #3f3f3f9c transparent transparent;
      content: "";
    }
  }
</style>
