<script>

export default {
  name: 'event',
  props: {
    item: Object,
    date: Date,
    type: String,
    itemRender: Function
  },
  data () {
    return {
      text: 'event'
    }
  },
  methods: {
    onDrag (e) {
      console.log('start item-dragstart')
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
      class: ['timeline_event', `timeline_event--KYC`],
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
  }
}
</script>

<style scoped>

</style>
