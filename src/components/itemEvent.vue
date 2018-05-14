<script>

export default {
  name: 'event',
  props: {
    index: String,
    item: Object,
    date: Date,
    type: String,
    itemRender: Function,
    multi: Boolean
  },
  data () {
    return {
      text: 'event'
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
      const startsDate = this.$moment(this.item.starts).format('m')
      const start = Number.parseInt(startsDate)

      let offsetTop = 0
      for (let i = intervals.length; i >= 0; --i) {
        if (intervals[i] <= start) {
          offsetTop = intervals[i]
          break
        }
      }
      return (100 / 60) * offsetTop
    },
    onDrag (e) {
      console.log('start item-dragstart')
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
        id: this.item ? `event-${this.item.id}` : null
      },
      style: {
        top: `${this.timeOffset()}%`
      },
      on: {
        dragstart: this.onDrag,
        click: this.onClick
      }
    }, this.itemRender ? [this.itemRender(this.item, this.index, this.multi)] : [h('span', this.text)])
  },
  created () {
    this.timeOffset()
  }
}
</script>

<style lang="less" scoped>
</style>
