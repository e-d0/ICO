<template>
  <header class="header">
    <div class="container-fluid">
      <div class="row">
        <div class="col">
          <nav class="main-nav">
            <div class="logo">
              <img src="../assets/img/logo.svg" alt="ICOPAPA" />
            </div>
            <div class="main-nav_wrapper">
              <ul class="main-nav_menu">
                <li class="main-nav_item"><a href="#" v-html="$t('links.ICOs')"></a></li>
                <li class="main-nav_item"><a href="#"  v-html="$t('links.OurRatings')"></a></li>
                <li class="main-nav_item"><a href="#" v-html="$t('links.Exchanges')"></a></li>
                <li class="main-nav_item"><a href="#" v-html="$t('links.Forum')"></a></li>
                <li class="main-nav_item">
                  <ul class="main-nav_faq">
                    <li class="main-nav_faq-item"><a href="vk" v-html="$t('links.Team')"></a></li>
                    <li class="main-nav_faq-item"><a href="#" v-html="$t('links.FAQ')"></a></li>
                  </ul>
                </li>
              </ul>
              <ul class="main-nav_user-menu main-nav_user-menu--hidden">
                <li class="main-nav_user-search">
                  <form>
                    <input type="text" placeholder="" name="search">
                  </form>
                </li>
                <li class="main-nav_user-language">
                  <div class="language">
                    <div class="language-header_current">
                      <img src="../assets/img/rus-icon.svg" alt="" height="12" width="18">
                    </div>
                    <div class="language-header_list">
                      <ul>
                        <li class="language_list-item">
                          <a href="#">
                            <img src="../assets/img/rus-icon.svg" alt="" height="12" width="18">
                          </a>
                        </li>
                        <li class="language_list-item">
                          <a href="#">
                            <img src="../assets/img/rus-icon.svg" alt="" height="12" width="18">
                          </a>
                        </li>
                        <li class="language_list-item">
                          <a href="#">
                            <img src="../assets/img/rus-icon.svg" alt="" height="12" width="18">
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <!-- /.language -->
                </li>
                <li class="main-nav_user-login">
                  <!--<a href="#" class="btn btn&#45;&#45;login" >Войти</a>-->
                </li>
              </ul>
              <!-- /.main-nav_user-menu -->
              <div class="user user--hiddenn">
                <div class="main-nav_user-search">
                  <form>
                    <input type="text" placeholder="" name="search">
                  </form>
                </div>
                <ul>
                  <li class="user_name">achubais.1965</li>
                  <li class="user_notification">
                    <ul class="user_notification-wrapper">
                      <li class="user_notification-message"><a href="#"></a></li>
                      <li class="user_notification-bell"><a></a></li>
                      <li class="user_notification-num"><a href="#">2</a></li>
                    </ul>
                  </li>
                </ul>
                <div class="user_icon user_icon--ico">
                  <img src="../assets/img/user-icon.png" alt="" height="45" width="45">
                </div>
              </div>
              <!-- /.user -->
            </div>
            <!-- /.main-nav_wrapper -->
          </nav>
          <!-- /.main-nav -->
        </div>
        <!-- /.col -->
      </div>
      <!-- /.row -->
    </div>
    <!-- /.container-fluid -->
    <div class="cabinet-nav">
      <div class="container-fluid">
        <div class="row">
          <div class="col">
            <ul class="cabinet-nav_menu">
              <li class="cabinet-nav_item"><a href="#" v-html="$t('links.Dashboard')"></a></li>
              <li class="cabinet-nav_item cabinet-nav_item--cases"> <router-link to="/" v-html="$t('links.Today')"></router-link></li>
              <li class="cabinet-nav_item cabinet-nav_item--calendar cabinet-nav_item--active"><router-link to="/calendar" v-html="$t('links.Calendar')"></router-link></li>
              <li class="cabinet-nav_item cabinet-nav_item--investment"><router-link to="/portfolio" v-html="$t('links.Portfolio')"></router-link></li>
              <li class="cabinet-nav_item cabinet-nav_item--statistic"><a href="#" v-html="$t('links.Stats')"></a></li>
              <li class="cabinet-nav_item cabinet-nav_item--marked-ico"><a href="#" v-html="$t('links.Favourite')"></a></li>
            </ul>
          </div>
          <!-- /.col -->
        </div>
        <!-- /.row -->
      </div>
      <!-- /.container-fluid -->
    </div>
    <!-- /.header_cabinet-nav -->
  </header>
  <!-- /.header -->
</template>

<script>
export default {
  name: 'theHeader'
}
</script>

<style lang="less" scoped>
  @import "../assets/less/vars";

  .header {
    .router-link-exact-active.router-link-active {
      display: block;
      padding: 18px 20px 18px 52px;
      background-color: @body-bg;
      color: #525c6c;
      font-family: @main-font;
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      white-space: nowrap;
      text-decoration: none;
      position: relative;
      box-shadow: inset 0 5px 16px rgba(0, 0, 0, 0.1), 0 0 0 #e0e6ed;
    }
    background-color: #fff;
    .main-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;;
      .logo {
        margin-right: 64px;
      }
      &_wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-grow: 2;
      }
      &_menu {
        display: flex;
        justify-content: space-between;
        flex-grow: 2;
        margin-right: 30px;
      }
      &_item {
        a {
          display: block;
          padding: 20px 10px 20px;
          color: @accent-color;
          font-family: @main-font;
          font-size: 16px;
          font-weight: 500;
          line-height: 20px;
          white-space: nowrap;
        }
        &--active {
          position: relative;
          &::before {
            content: "";
            position: absolute;;
            width: 100%;
            height: 4px;
            background-color: @accent-color;
          }
        }
      }
      &_faq {
        display: block;
        padding: 20px 10px 20px;
        &-item {
          a {
            padding: 0 0 0 0;
            color: #525c6c;
            font-family: @main-font;
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
            letter-spacing: -0.1px;
          }
        }
      }
      &_user-menu {
        display: flex;
        justify-content: space-between;
        align-items: center;
        &--hidden {
          display: none;
        }
      }
      &_user-search {
        position: relative;
        form {
          &::before {
            content: "";
            position: absolute;
            width: 21px;
            height: 21px;
            right: 12px;
            top: 7px;
            background-image: @img-search-icon;
            background-position: center;
            background-repeat: no-repeat;
            z-index: 11;
          }
        }
        input {
          padding: 8px 40px 8px 15px;
          max-width: 180px;
          color: #333f52;
          font-family: @main-font;
          font-size: 14px;
          font-weight: 400;
          line-height: 18px;
          border-radius: 4px;
          border: 1px solid #c5d0de;
          background-color: #ffffff;
        }
      }
      &_user-language {
        margin-left: 28px;
        .language {
          position: absolute;
          top: 29px;
        }
      }
      &_user-login {
        margin-left: 64px;
      }
      .user {
        margin-bottom: 0;
        &_icon {
          margin-left: 10px;
          margin-right: 0;
        }
        &_name {
          margin-left: 60px;
          text-align: right;
          margin-bottom: 2px;
        }
        &_notification {
          &-wrapper {
            display: flex;
            justify-content: flex-end;
            align-items: center;
          }
          &-bell {
            margin-left: 20px;
            a {
              position: relative;
              display: inline-block;
              width: 16px;
              height: 16px;
              font-size: 0;
              &::before {
                content: "";
                position: absolute;
                width: 16px;
                height: 16px;
                right: 0px;
                top: 3px;
                background-image: @img-bell;
                background-position: center;
                background-repeat: no-repeat;
                z-index: 11;
              }
            }
          }
          &-message {
            a {
              position: relative;
              display: inline-block;
              width: 16px;
              height: 16px;
              font-size: 0;
              &::before {
                content: "";
                position: absolute;
                width: 16px;
                height: 16px;
                right: 0px;
                top: 3px;
                background-image: @img-message-icon;
                background-position: center;
                background-repeat: no-repeat;
                z-index: 11;
              }
            }
          }
          &-num {
            margin-left: 6px;
            a {
              display: inline-block;
              text-align: center;
              //vertical-align: middle;
              width: 16px;
              height: 16px;
              border-radius: 8px;
              background-color: #ff3657;
              font-size: 11px;
              font-weight: 500;
              line-height: 18px;
              color: #fff;
            }
          }
        }
      }
    }                //===========================FORUM-PAGES=================//
    &_bottom-line {
      background-color: #525c6c;
      padding: 20px 0;
      .searching-form {
        display: flex;
        position: relative;
        &::before {
          content: "";
          position: absolute;
          width: 8px;
          height: 4px;
          right: 16px;
          top: 19px;
          background-image: @img-select-arrow;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 11;
        }
        form {
          input {
            border-radius: 4px 0 0 4px;
            //border: 1px solid rgba(197, 208, 222, 0.5);
            background-color: #ffffff;
            padding: 11px 15px;
            min-width: 460px;
            color: #333f52;
            font-family: @main-font;
            font-size: 14px;
            font-weight: 400;
            line-height: 18px;
            box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.2);
            border: none;
          }
        }
        select {
          padding: 0 36px 0 12px;
          outline: none;
          color: #707986;
          font-family: @main-font;
          font-size: 14px;
          font-weight: 400;
          line-height: 16px;
          border: 1px solid rgba(197, 208, 222, 0.5);
          border-radius: 0 4px 4px 0;
          background-color: #ffffff;
        }
      }
    }           //----------MAIN-PAGE--------------//
    &_slider {
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
      background-image: linear-gradient(187deg, #64b61e 0%, #74bd49 30%, #0086ca 100%);
      &-item {
        height: 400px;
        background-image: @img-slider-image;
        //background-position: center;
        //background-position: right;
        background-position: 95% 50%;
        background-repeat: no-repeat;
      }
      &-title {
        width: 355px;
        padding-top: 68px;
        text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
        color: #fafbfc;
        font-family: @main-font;
        font-size: 32px;
        font-weight: 500;
        line-height: 36px;
      }
      &-intro {
        width: 355px;
        padding-top: 25px;
        padding-bottom: 48px;
        color: #fafbfc;
        font-family: @main-font;
        font-size: 16px;
        font-weight: 400;
        line-height: 22px;
      }
    }            //----------------CABINET---------------//
    .cabinet-nav {
      background-color: #525c6c;
      &_menu {
        display: flex;
      }
      &_item {
        a {
          position: relative;
          display: block;
          padding: 18px 20px 18px 52px;
          color: #fafbfc;
          font-family: @main-font;
          font-size: 14px;
          font-weight: 500;
          line-height: 20px;
          white-space: nowrap;
          text-decoration: none;
          transition: all 0.25s;
          &:hover {
            background-color: @body-bg;
            color: #525c6c;
            position: relative;
            box-shadow: inset 0 5px 16px rgba(0, 0, 0, 0.1), 0 0 0 #e0e6ed;
          }
          &::before {
            content: '';
            position: absolute;
            top: 16px;
            left: 16px;
            width: 25px;
            height: 25px;
            background-repeat: no-repeat;
            background-position: center;
          }
        }
        &--calendar {
          a {
            &::before {
              background-image: @img-calendar;
            }
          }
        }
        &--cases {
          a {
            &::before {
              background-image: @img-cases;
            }
          }
        }
        &--investment {
          a {
            &::before {
              background-image: @img-investment;
            }
          }
        }
        &--statistic {
          a {
            &::before {
              background-image: @img-statistic;
            }
          }
        }
        &--marked-ico {
          a {
            &::before {
              background-image: @img-marked-ico;
            }
          }
        }
        &:first-child {
          a {
            padding: 18px 20px 18px 0;
            color: #c5d0de;
            &:hover {
              background-color: #525c6c;
              color: #c5d0de;
            }
          }
        }
      }
    }
  }

</style>
