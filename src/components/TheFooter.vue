<template>
  <footer class="footer">
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
                  <a href="#" class="footer_social-fb">fb</a>
                  <a href="#" class="footer_social-tw">tw</a>
                  <a href="#" class="footer_social-vk">vk</a>
                </div>
              </div>
              <!-- /.footer_about-us -->
              <div class="footer_nav">
                <ul class="footer_nav-menu">
                  <li class="footer_nav-menu-item"><a href="#">Каталог ICO</a></li>
                  <li class="footer_nav-menu-item"><a href="#">Наши рейтинги</a></li>
                  <li class="footer_nav-menu-item"><a href="#">Биржи и обменники</a></li>
                  <li class="footer_nav-menu-item"><a href="#">Форум</a></li>
                </ul>
                <ul class="footer_nav-menu">
                  <li class="footer_nav-menu-item"><a href="#">Наша команда</a></li>
                  <li class="footer_nav-menu-item"><a href="#">FAQ</a></li>
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
    <div class="terms">
      <div class="container-fluid">
        <a href="#">Условия использования</a>
        <a href="#">Политика конфиденциальности </a>
        <a href="#">Предложения о сотрудничестве, реклама</a>
      </div>
    </div>
    <!-- /.terms -->
  </footer>
  <!-- /.footer -->
</template>

<script>
export default {
  name: 'TheFooter'
}
</script>

<style lang="less" scoped>
  @import "../assets/less/vars";
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
        color: #8f96a1;
        font-family: @main-font;
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
      }
    }
    &_social {
      a {
        margin-right: 5px;
        position: relative;
        font-size: 0;
        display: inline-block;
        width: 24px;
        height: 24px;
        border-radius: 2px;
        &::before {
          content: "";
          position: absolute;
          width: 21px;
          height: 21px;
          left: 1px;
          top: 2px;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 11;
        }
      }
      &-fb {
        background-color: #345c94;
        &::before {
          background-image: @img-fb-icon;
        }
      }
      &-tw {
        background-color: #00b0e9;
        &::before {
          background-image: @img-twitter-icon;
        }
      }
      &-vk {
        background-color: #00ac68;
        &::before {
          background-image: @img-mmm-icon;
        }
      }
    }
    &_nav {
      display: flex;
      &-menu {
        margin-right: 44px;
        &-item {
          margin-bottom: 15px;
          a {
            color: @accent-color;
            font-family: @main-font;
            font-size: 16px;
            font-weight: 500;
            line-height: 20px;
            letter-spacing: -0.1px;
          }
        }
      }
    }
    &_search {
      position: relative;
      form {
        margin-bottom: 32px;
        &::before {
          content: "";
          position: absolute;
          width: 21px;
          height: 21px;
          right: 12px;
          top: 4px;
          background-image: @img-search-icon;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 11;
        }
      }
      input {
        padding: 5px 40px 5px 15px;
        width: 284px;
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
    .terms {
      margin: 0;
      padding: 16px 0;
      background-color: #fafbfc;
      a {
        margin-right: 32px;
        color: #8f96a1;
        font-family: @main-font;
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        text-decoration: underline;
        white-space: nowrap;
        &:hover {
          text-decoration: none;
          color: darken(#8f96a1, 10%);
        }
      }
    }
  }
</style>
