<template>
  <div class="modal-content p-3 text-center">
    <h5 class="m-4">Вы хотите перенсти дату события?</h5>
    <div class="modal-footer text-center">
      <button type="button" class="btn btn-secondary " data-dismiss="modal" @click="$emit('onCancel')" >Отмена</button>
      <button type="button" class="btn btn-primary " @click="$emit('onConfirm')">Изменить дату</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'formConfirm'
}
</script>

<style scoped>

</style>
