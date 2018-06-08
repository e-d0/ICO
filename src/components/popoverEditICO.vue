<template>
  <div class="popover-edit" id="popover">
    <div class="popover_close">
      <a href="#"></a>
    </div>
    <div class="popover-edit_header popover-edit_header--XMR">
      <span>Редактировать</span>
      <span class="popover-edit_name">Monero · <b>XMR</b></span>
    </div>
    <div class="popover-edit_form">
      <form action="#" class="edit-form">
        <fieldset>
          <div class="edit-form_wrapper">
            <div class="edit-form_amount">
              <label for="amount">Количество</label>
              <input type="number" name="amount" id="amount" placeholder="">
            </div>
            <div class="edit-form_price">
              <label for="price">Цена</label>
              <input type="text" name="price" id="price" placeholder="3 430">
            </div>
            <div class="edit-form_currency">
              <label for="currency">Валюта</label>
              <select size="1" name="" id="currency">
                <option value=""><a href="#">USD</a></option>
                <option value=""><a href="#">EUR</a></option>
                <option value=""><a href="#">RUR</a></option>
              </select>
            </div>
          </div>
          <!-- /.edit-form_wrapper -->
        </fieldset>
        <fieldset class="fieldset">
          <div class="edit-form_textarea">
            <label for="textarea"><a href="#">Удалить комментарий</a></label>
            <textarea placeholder="комментарий" id="textarea"></textarea>
          </div>
          <div class="edit-form_buttons">
            <button class="btn btn-primary" type="submit" name="button">Сохранить</button>
            <a href="#">Удалить монету</a>
          </div>
        </fieldset>
      </form>
      <!-- /.add-coin-form -->
    </div>
    <!-- /.popover-edit_form -->
  </div>
</template>

<script>
export default {
  name: 'popoverEditICO'
}
</script>

<style lang="less" scoped>
  @import "../assets/less/vars";
  .add-coin-form {
    &--hidden {
      display: none;
    }
    display: flex;
    justify-content: space-between;
    text-align: left;
    label {
      color: #333f52;
      font-family: @main-font;
      font-weight: 400;
      font-size: 14px;
      line-height: 16px;
    }
    &_wrapper {
      display: flex;
      //flex-grow: 2;
      //align-items: center;
      margin-bottom: 20px;
      width: 76%;
    }
    &_buttons {
      display: flex;
      align-items: center;
      margin-top: -15px;
      margin-left: 30px;
      button {
        padding: 12px 16px 10px;
        text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
        background-color: @accent-color;
        color: #ffffff;
        font-family: @main-font;
        font-weight: 500;
        font-size: 14px;
        line-height: 14px;
      }
    }
    &_name {
      position: relative;
      display: flex;
      flex-direction: column;
      margin-right: 30px;
      flex-grow: 1;
      &::before {
        content: "";
        position: absolute;
        width: 8px;
        height: 4px;
        right: 18px;
        top: 41px;
        background-image: @img-select-arrow;
        background-position: center;
        background-repeat: no-repeat;
        z-index: 11;
      }
      select {
        max-width: 264px;
        padding: 10px 32px 8px 12px;
        color: #525c6c;
        font-family: @main-font;
        font-weight: 400;
        font-size: 15px;
        line-height: 16px;
        text-transform: uppercase;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.09);
        border-radius: 4px;
        border: 1px solid #44af36;
        background-color: #ffffff;
      }
    }
    &_amount {
      position: relative;
      margin-right: 30px;
      display: flex;
      flex-direction: column;
      input {
        padding: 12px;
        width: 104px;
        height: 36px;
        font-size: 15px;
        font-family: @main-font;
        font-weight: 400;
        line-height: 16px;
        text-transform: uppercase;
        border-radius: 4px;
        border: 1px solid #c5d0de;
        background-color: #ffffff;
      }
      .count {
        position: absolute;
        display: block;
        width: 9px;
        height: 9px;
        background-color: #c5d0de;
        cursor: pointer;
        &--down {
          top:44px;
          right: 9px;
          &::before {
            content: "";
            position: absolute;
            width: 5px;
            height: 1px;
            background-color: #fff;
            top: 4px;
            left: 2px;
          }
        }
        &:hover {
          background-color: #8f96a1;
        }
        &--up {
          top:32px;
          right: 9px;
          &::before {
            content: "";
            position: absolute;
            width: 5px;
            height: 1px;
            background-color: #fff;
            top: 4px;
            left: 2px;
          }
          &::after {
            content: "";
            position: absolute;
            width: 5px;
            height: 1px;
            background-color: #fff;
            top: 4px;
            left: 2px;
            transform: rotate(90deg);
          }
        }
      }
    }
    &_price {
      position: relative;
      display: flex;
      flex-direction: column;
      margin-right: 32px;
      &::before {
        content: "";
        position: absolute;
        width: 8px;
        height: 4px;
        right: 18px;
        top: 41px;
        background-image: @img-select-arrow;
        background-position: center;
        background-repeat: no-repeat;
        z-index: 11;
      }
      &-input-wrapper {
        display: flex;
      }
      &-ico {
        margin-right: 16px;
        color: @main-color;
        font-family: @main-font;
        font-weight: 700;
        font-size: 10px;
        line-height: 16px;
        text-transform: uppercase;
        text-decoration: underline;
        text-decoration-style: dashed;
      }
      &-market {
        color: #8f96a1;
        font-family: @main-font;
        font-weight: 700;
        font-size: 10px;
        line-height: 16px;
        text-transform: uppercase
      }
      input {
        padding: 12px;
        width: 154px;
        height: 36px;
        font-size: 15px;
        font-family: @main-font;
        font-weight: 400;
        line-height: 16px;
        text-transform: uppercase;
        border-radius: 4px 0 0 4px;
        border: 1px solid #c5d0de;
        background-color: #ffffff;
      }
      select {
        margin-left: -1px;
        padding: 0px 32px 0px 12px;
        color: #525c6c;
        font-family: @main-font;
        font-weight: 400;
        font-size: 15px;
        line-height: 15px;
        text-transform: uppercase;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.09);
        border-radius: 0 4px 4px 0;
        border: 1px solid #c5d0de;
        background-color: #ffffff;
      }
    }
    &_total {
      display: flex;
      flex-direction: column;
      margin-right: auto;;
      span {
        color: #333f52;
        font-family: @main-font;
        font-weight: 500;
        font-size: 16px;
        line-height: 37px;
        white-space: nowrap;
        b {
          font-size: 12px;
        }
      }
    }
  }
</style>
