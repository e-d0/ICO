<script>
import theEvent from './TheEvent'
export default {
  name: 'event',
  components: { theEvent },
  props: {
    index: String,
    item: Object,
    date: Date,
    type: String,
    multi: Boolean
  },
  data () {
    return {
      text: 'no-event-name',
      itemRender (item, index, multi, target) {
        const h = this.$createElement
        return h(theEvent, { props: {
          item, index, multi, target
        } })
      }
    }
  },
  computed: {
    eventID () {
      return `event-${this.item.id}-${this.item.isStart ? 'starts' : 'ends'}`
    }
  },
  methods: {
    /**
     * Считаем отступ сверху в зависимости от
     * времени начала события в соответствии с заданным
     * интервалом
     * */
    timeOffset () {
      const intervals = [0, 15, 30, 45, 60]
      let dopOffset = 0
      if (this.multi) {
        dopOffset = this.$moment(this.item.date).hours() - this.$moment(this.date).hours()
      }

      const startsDate = this.$moment(this.item.date).format('m')
      const start = Number.parseInt(startsDate)

      let offsetTop = 0
      for (let i = intervals.length; i >= 0; --i) {
        if (intervals[i] <= start && intervals[i + 1] >= start) {
          offsetTop = intervals[i]
          break
        }
      }
      return ((100 / 60) * offsetTop) + (100 * dopOffset)
    },
    onDrag (e) {
      console.log('start item-dragstart', e.gesture)
      this.$emit('item-dragstart', e, this.item, this.date, this.type)
    },
    onClick (e) {
      e.stopPropagation()
      e.preventDefault()
      /**
       * При клике на event срабатыавет событие и отправляет id элемента
       * */
      // EventBus.$emit('item-click', e, this.item, {eventId: `event-${this.item.id}`})
    }
  },
  render (h) {
    return h('div', {
      class: ['event', 'timeline_event', 'timeline_event--item'],
      attrs: {
        draggable: true,
        id: this.item ? this.eventID : null
      },
      style: {
        top: `${this.timeOffset()}%`
      },
      on: {
        dragstart: this.onDrag,
        click: this.onClick
      }
    }, this.itemRender ? [this.itemRender(this.item, this.index, this.multi, this.item ? this.eventID : null)] : [h('span', this.text)])
  },
  created () {
    this.timeOffset()
  }
}
</script>

<style lang="less" scoped>
</style>
