<template>
  <div class="form-group">

      <input class="form-control" type="text" v-model="selection.name"
             @keydown.enter = 'enter'
             @keydown.down = 'down'
             @keydown.up = 'up'
             @input = 'change'
      />

    <div>
      <span v-for="( tag,index ) in tagsArray" :key="index" class="badge badge-primary" style="margin-right: 2px">
        {{ tag }}
        <button class="close tag-close" @click="remove(index)">x</button>
      </span>
    </div>

      <div class="dropdown">
        <div :class="['dropdown-menu' , {'show':openSuggestion}]" aria-labelledby="dropdownMenuButton" style="width:100%">
            <a class="dropdown-item" href="#" v-for="(suggestion, index) in matches" :key="index"
               :class="{'active': isActive(index)}"
               @click="suggestionClick(index)">{{ suggestion.name }}</a>
        </div>
      </div>

  </div>
</template>

<script>

export default {
  name: 'autocomplete',
  components: { },
  data () {
    return {
      show: false,
      current: 0,
      selection: {
        type: String
      },
      tagsArray: []
    }
  },
  props: {
    events: {
      type: Array
    }
  },
  computed: {
    matches: function () {
      console.log('filter input ', this.events)
      return this.events.filter((event) => {
        return event.name.match(this.selection.name)
      })
    },
    openSuggestion () {
      return this.selection !== '' &&
          this.matches.length !== 0 &&
          this.show === true
    }
  },
  methods: {
    handleClickOutside (event) {
      if (!this.$el.contains(event.target)) {
        this.show = false
        this.current = 0
      }
    },
    enter () {
      console.log('match', this.matches[this.current])
      this.selection = this.matches[this.current]
      if (!this.tagsArray.includes(this.selection.name) && this.events.includes(this.selection)) {
        this.tagsArray.push(this.selection.name)
        this.$emit('input', this.tagsArray)
      }
      this.show = false
    },
    up () {
      if (this.current > 0) { this.current-- }
    },
    down () {
      if (this.current < this.matches.length - 1) { this.current++ }
    },
    isActive (index) {
      return index === this.current
    },
    change () {
      if (this.show === false) {
        this.show = true
        this.current = 0
      }
    },
    remove (index) {
      this.tagsArray.splice(index, 1)
      /**
       * событие убрать
       * */
      this.$emit('input', this.tagsArray)
    },
    suggestionClick (index) {
      this.selection = this.matches[index]
      if (!this.tagsArray.includes(this.selection.name) && this.events.includes(this.selection)) {
        this.tagsArray.push(this.selection.name)
        this.$emit('input', this.tagsArray)
        console.log('push click', this.tagsArray)
      }
      this.show = false
    }
  },
  mounted () {
    /**
     * При клике вне элемента сворачивать список
     * */
    document.addEventListener('click', this.handleClickOutside)
  },
  destroyed () {
    /**
     * При клике вне элемента сворачивать список
     * */
    document.removeEventListener('click', this.handleClickOutside)
  }
}
</script>
<style  >
  .close.tag-close{
    background: white!important;
    height: 14px;
    width: 14px;
    border-radius: 7px;
  }

</style>
