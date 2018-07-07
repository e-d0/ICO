<template>
  <footer class="footer mt-5">
    <div class="container-fluid">
      <div class="row">
        <div class="col">
          <div class="footer-wrapper">
            <div class="footer-content">
              <div class="footer_about-us">
                <div class="footer_logo">
                  <img src="../assets/img/logo.svg" alt="ICOPAPA" />
                </div>
                <div class="footer_intro">
                  <p>Ликазам этаммые прачнос тураментный колько стравле метель обеспечать с всех этабли в друменицы. </p>
                </div>
                <div class="footer_social">
                  <a href="#" class="footer_social-item footer_social-item--fb">fb</a>
                  <a href="#" class="footer_social-item footer_social-item--tw">tw</a>
                  <a href="#" class="footer_social-item footer_social-item--vk">vk</a>
                </div>
              </div>
              <!-- /.footer_about-us -->
              <div class="footer_nav">
                <ul class="footer_nav-menu">
                  <li class="footer_nav-menu-item footer_nav-menu-item--bold"><a href="#" v-html="$t('links.ICOs')"></a></li>
                  <li class="footer_nav-menu-item"><a href="#"  v-html="$t('links.OurRatings')"></a></li>
                  <li class="footer_nav-menu-item"><a href="#" v-html="$t('links.Exchanges')"></a></li>
                  <li class="footer_nav-menu-item"><a href="#" v-html="$t('links.Forum')"></a></li>
                  <li class="footer_nav-menu-item"><a href="#">Trading</a></li>
                </ul>
                <ul class="footer_nav-menu">
                  <li class="footer_nav-menu-item footer_nav-menu-item--bold"><a href="#">Exchanges</a></li>
                  <li class="footer_nav-menu-item"><a href="#">Second level</a></li>
                  <li class="footer_nav-menu-item"><a href="#">Third level</a></li>
                </ul>
                <ul class="footer_nav-menu">
                  <li class="footer_nav-menu-item footer_nav-menu-item--bold"><a href="#">Our ratings</a></li>
                </ul>
                <ul class="footer_nav-menu">
                  <li class="footer_nav-menu-item footer_nav-menu-item--bold"><a href="#">Forum</a></li>
                </ul>
                <ul class="footer_nav-menu">
                  <li class="footer_nav-menu-item footer_nav-menu-item--grey"><a href="vk" v-html="$t('links.Team')"></a></li>
                  <li class="footer_nav-menu-item footer_nav-menu-item--grey"><a href="#" v-html="$t('links.FAQ')"></a></li>
                </ul>
              </div>
              <!-- /.footer_main-nav -->
            </div>
            <!-- /.footer_content -->
            <div class="footer_search">
              <form>
                <input type="text" placeholder="" name="search">
              </form>
              <div class="language">
                <div class="language_current">
                  <img src="../assets/img/rus-icon.svg" alt="" height="12" width="18">
                </div>
                <div class="language_list">
                  <select v-model="selectedLanguage">
                    <option class="language_list-item" disabled value="">Выберите один из вариантов</option>
                    <option class="language_list-item"
                            v-for="(item, index) in langs"
                            :key="index"
                            :value="item">
                      {{ item }}
                    </option>
                  </select>
                  <!--<ul>-->
                    <!--<li class="language_list-item">-->
                      <!--<a href="#">-->
                        <!--<img src="../assets/img/rus-icon.svg" alt="" height="12" width="18">-->
                      <!--</a>-->
                    <!--</li>-->
                    <!--<li class="language_list-item">-->
                      <!--<a href="#">-->
                        <!--<img src="../assets/img/rus-icon.svg" alt="" height="12" width="18">-->
                      <!--</a>-->
                    <!--</li>-->
                    <!--<li class="language_list-item">-->
                      <!--<a href="#">-->
                        <!--<img src="../assets/img/rus-icon.svg" alt="" height="12" width="18">-->
                      <!--</a>-->
                    <!--</li>-->
                  <!--</ul>-->
                </div>
              </div>
              <!-- /.language -->
            </div>
            <!-- /.footer_search -->
          </div>
          <!-- /.footer-wrapper -->
        </div>
        <!-- /.col -->
      </div>
      <!-- /.row -->
    </div>
    <!-- /.container-fluid -->
    <div class="footer-terms">
      <div class="container-fluid">
        <div class="row">
          <div class="col">
            <div class="footer-terms_wrapper">
              <a href="#">{{ $t('links.userPolicy') }}</a>
              <a href="#" >{{ $t('links.confident') }}</a>
              <a href="#" >{{ $t('links.advert') }}</a>
              <div class="worldpokerdeals">
                <a href="#">Created by  <img src="../assets/img/wpd.svg" alt=""></a>
              </div>
            </div>
            <!-- /.terms_wrapper -->
          </div>
          <!-- /.col -->
        </div>
        <!-- /.row -->
      </div>
      <!-- /.container-fluid -->
    </div>
    <!-- /.terms -->
  </footer>
  <!-- /.footer -->
</template>

<script>
import Vuex from 'vuex'
const storeLocale = Vuex.createNamespacedHelpers('locale')
export default {
  name: 'TheFooter',
  data () {
    return {
      moment: this.$moment,
      selectedLanguage: this.$i18n.locale
    }
  },
  computed: {
    ...storeLocale.mapGetters({
      langs: 'getLanguages',
      language: 'language'
    })
  },
  watch: {
    /**
     * При изменении языка, значение идет в хранилище и страница перезагружается
     * */
    selectedLanguage: function (context) {
      this.$store.dispatch('locale/setLanguage', context)
      location.reload()
    }
  },
  created () {
  }
}
</script>

<style lang="less" scoped>
  @import "../assets/less/vars";
  //============================Language ===========================//
  .language {
    z-index: 22;
    &_current,
    &-header_current {
      position: relative;
      display: inline-block;
      margin-bottom: 5px;
      &::before {
        content: "";
        position: absolute;
        width: 8px;
        height: 4px;
        left: 23px;
        top: 9px;
        background-image: @img-select-arrow;
        background-position: center;
        background-repeat: no-repeat;
        z-index: 11;
      }
    }
    &_list,
    &-header_list {
      /*display: none;*/
      &-item {
        margin-bottom: 5px;
      }
    }
  }
  .footer {
    background-color: #ffffff;
    &-wrapper {
      display: flex;
      justify-content: space-between;
      padding: 35px 0 25px;
      box-shadow: 0 -1px 0 #e0e6ed;
    }
    &-content {
        display: flex;
      }
    &_about-us {
    }
    &_logo {
      margin-bottom: 20px;
    }
    &_intro {
      margin-bottom: 20px;
      margin-right: 60px;
      p {
        max-width: 260px;
        color: @light-grey;
        font-family: @main-font;
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
      }
    }
    &_social {
      display: flex;
      a{
        margin-right: 5px;
        position: relative;
        font-size: 0;
        display: inline-block;
        width: 24px;
        height: 24px;
        border-radius: 2px ;
        &::before {
          content: "";
          position: absolute;
          width: 21px;
          height: 21px;
          left: 1px;
          top: 2px;
          background-position: center;
          background-repeat: no-repeat;
         }
      }
      &-item {
        margin-right: 5px;
        position: relative;
        font-size: 0;
        //display: inline-block;
        width: 24px;
        height: 24px;
        border-radius: 2px;
        background-position: center;
        background-repeat: no-repeat;
        &--fb {
          background-color: #345c94;
          background-image: @img-fb-icon;
        }
        &--tw {
          background-color: #00b0e9;
          background-image: @img-twitter-icon;
        }
        &--vk {
          background-color: #00ac68;
          background-image: @img-mmm-icon;
        }
      }
    }
    &_nav {
      display: flex;
      margin-left: 60px;
      &-menu {
        margin-right: 50px;
        &-item {
          margin-bottom: 15px;
          a {
            color: @accent-color;
            font-family: @main-font;
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
            letter-spacing: -0.1px;
            white-space: nowrap;
            text-decoration: underline;
            text-decoration-color: rgba(68, 175, 54, 0.25);
            &:hover {
              color: @accent-hover-color;
              text-decoration-color: rgba(68, 175, 54, 0.85);
            }
          }
          &--bold {
            a {
              font-family: @medium;
              font-size: 16px;
              font-weight: 500;
            }
          }
          &--grey {
            a {
              font-size: 16px;
              color: @light-grey;
              text-decoration-color: rgba(143, 150, 161, 0.25);
              &:hover {
                color: rgba(143, 150, 161, 0.85);
                text-decoration-color: rgba(143, 150, 161, 0.85);
              }
            }
          }
        }
      }
    }
    &_search {
      position: relative;
      display: flex;
      flex-direction: column;
      margin-left: auto;
      width: 20%;
      form {
        margin-bottom: 32px;
        &::before {
          content: "";
          position: absolute;
          width: 21px;
          height: 21px;
          right: 12px;
          top: 8px;
          background-image: @img-search-icon;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 11;
        }
      }
      input {
        padding: 8px 40px 8px 15px;
        width: 100%;
        color: @dark;
        font-family: @main-font;
        font-size: 14px;
        font-weight: 400;
        line-height: 18px;
        border-radius: 4px;
        border: 1px solid @light-light-grey;
        background-color: #ffffff;
      }
    }
    .footer-terms {
      background-color: #fafbfc;
      &_wrapper {
        display: flex;
        align-items: center;
        margin: 0;
        padding: 16px 0;
      }
      a {
        margin-right: 32px;
        color: @light-grey;
        font-family: @main-font;
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        text-decoration: underline;
        white-space: nowrap;
        &:hover {
          text-decoration: none;
        }
      }
      .worldpokerdeals {
        margin-left: auto;
        justify-content: flex-end;
        a {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          position: relative;
          margin-right: 0;
          color: @light-grey;
          font-size: 12px;
          font-weight: 400;
          line-height: 12px;
        }
        img {
          margin: auto;
          margin-left: 10px;
        }
      }
    }
  }
</style>
