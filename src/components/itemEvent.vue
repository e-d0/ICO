<script>
export default {
  name: 'event',
  data () {
    return {
      text: 'event'
    }
  },
  methods: {
    onDrag (e) {
      this.$emit('item-dragstart', e, this.item, this.date, this.type)
    },
    onClick (e) {
      e.stopPropagation()
      e.preventDefault()
      // EventBus.$emit('item-click', e, this.item)
    }
  },
  render (h) {
    return h('div', {
      class: ['schedule-calendar-detail-item', `schedule-calendar-status`],
      attrs: {
        draggable: true
      },
      on: {
        dragstart: this.onDrag,
        click: this.onClick
      }
    }, this.itemRender ? [this.itemRender(this.item)] : [h('span', this.text)])
  },
  created () {
    console.log('event created', this.item)
  }
}
</script>

<style scoped>

</style>
