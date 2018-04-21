<template>
  <div>
    <span v-for="(tag, index) in value" :key="index" class="badge badge-primary" style="margin-right: 2px">
      {{tag}}
      <button class="close tag-close" aria-label="Close" @click="remove(index)"></button>
    </span>
  </div>
</template>

<script>
export default {
  name: 'tagList',
  props: ['value'],
  methods: {
    remove (index) {
      let clonedValue = this.value.slice()
      clonedValue.splice(index, 1)
      this.$emit('input', clonedValue)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
