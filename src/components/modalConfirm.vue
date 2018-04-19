<template>
  <transition name="modal">
    <div class="modal" tabindex="-1" role="dialog" style="display: block">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <slot name="header"></slot>
          <div class="modal-body">
            <slot name="body"></slot>
          </div>
          <div class="modal-footer">
            <slot name="footer"></slot>

          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'modalConfirm'
}
</script>

<style lang="less" scoped>
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }
</style>
