<template>
  <div id="app">
    <tpl-header></tpl-header>
    <div class="content">
      <div class="ico-favourite">
        <div class="container-fluid">
          <div class="row">
            <div class="col-3">
              <div class="ico-favourite_title">
                <h1>Favourite ICO</h1>
              </div>
            </div>
            <!-- /.col-3 -->
            <div class="col-9">
              <div class="ico-catalogue_nav">
                <ul class="ico-catalogue_nav-wrapper">
                  <li class="ico-catalogue_nav-item ico-catalogue_nav-item--active"><a href="#">Active</a></li>
                  <li class="ico-catalogue_nav-item"><a href="#">Upcoming</a></li>
                  <li class="ico-catalogue_nav-item"><a href="#">Ended</a></li>
                  <li class="ico-catalogue_nav-item"><a href="#">Trading</a></li>
                </ul>
                <div class="portfolio-view_filter">
                  <label>
                    <input name="portfolio-filter-usd" type="checkbox" value="usd" checked>
                    <b>USD</b>
                  </label>
                  <label>
                    <input name="portfolio-filter-btc" type="checkbox" value="bts">
                    <b>BTC</b>
                  </label>
                  <label>
                    <input name="portfolio-filter-ETH" type="checkbox" value="ETH">
                    <b>ETH</b>
                  </label>
                  <label>
                    <input name="portfolio-filter-WAVES" type="checkbox" value="WAVES">
                    <b>WAVES</b>
                  </label>
                </div>
                <!-- /.portfolio-view_filter -->
                <div class="ico-catalogue_select">
                  <select size="1" name="name[]">
                    <option value=""><a href="#">Hard CAP</a></option>
                    <option value=""><a href="#">Something</a></option>
                    <option value=""><a href="#">В гугле</a></option>
                  </select>
                </div>
              </div>
              <!-- /.ico-catalogue_nav -->
            </div>
            <!-- /.col-9 -->
          </div>
          <!-- /.row -->
          <div class="row">
            <div class="col">
              <div class="ico-favourite_list">
                <div class="ico-item">
                  <div class="row">
                    <div class="col-3 d-flex">
                      <div class="ico-item_logo" style="background-image: linear-gradient(225deg, #e55f6e 0%, #b12a39 100%)">
                        <img src="img/miniApps-logo.png" alt="">
                      </div>
                    </div>
                    <!-- /.col-3 -->
                    <div class="col-4 d-flex">
                      <div class="ico-item_discription">
                        <div class="ico-item_title">
                          <h2>MiniApps</h2>
                          <div class="rating-wrapper">
                            <div class="rating">
                              <span>9.2 <sup>/10</sup></span>
                            </div>
                          </div>
                          <!-- /.rating-wrapper -->
                        </div>
                        <!-- /.ico-item_title -->
                        <div class="ico-item_category">
                          <span>Blockchain</span>
                        </div>
                        <!-- /.ico-item_category -->
                        <div class="ico-item_discribe">
                          <p>
                            MiniApps.pro is a chatbot platform and blockchain-based marketplace for chatbot developers, their clients and partners.
                          </p>
                        </div>
                        <!-- /.ico-item_features -->
                        <div class="ico-item_platforms">
                          <span class="ico-item_platforms-pl">PLATFORM</span>
                          <span class="ico-item_platforms-name">ETH</span>
                          <span class="ico-item_platforms-name">WAVES</span>
                        </div>
                        <!-- /.ico-item_features -->
                      </div>
                      <!-- /.ico-item_discription -->
                    </div>
                    <!-- /.col-4 -->
                    <div class="col-3">
                      <div class="ico-item_fundraising">
                        <div class="ico-item_cap">
                          <span class="ico-item_cap-type">HARD CAP</span>
                          <span class="ico-item_cap-goal">700 000 <sup>USD</sup></span>
                          <div class="ico-item_scale">
                            <div class="ico-item_scale-inner ico-item_scale-inner--grey"></div>
                          </div>
                          <div class="ico-item_cap-current">
                            <span class="ico-item_cap-current-usd">560 012 <sup>USD</sup></span>
                            <span class="ico-item_cap-current-percent">25.2%</span>
                          </div>
                        </div>
                        <!-- /.ico-item_cap -->
                        <div class="ico-item_price">
                          <span class="ico-item_price-token">ICO TOKEN PRICE</span>
                          <span class="ico-item_price-token-usd">0.25 USD</span>
                        </div>
                        <!-- /.ico-item_price -->
                      </div>
                      <!-- /.ico-item_fundraising -->
                    </div>
                    <!-- /.col-3 -->
                    <div class="col-2">
                      <div class="ico-item_timeframe">
                        <div class="ico-item_start">
                          <span class="ico-item_start-st">STARTED</span>
                          <span class="ico-item_start-date">17.10.2017</span>
                          <span class="ico-item_start-time-left">2M 5D <b>ago</b></span>
                        </div>
                        <!-- /.ico-item_start -->
                        <div class="ico-item_end">
                          <span class="ico-item_end-en">ENDS</span>
                          <span class="ico-item_end-date">17.12.2017</span>
                          <span class="ico-item_end-time-remain"><b>in</b> 5D 11H</span>
                        </div>
                        <!-- /.ico-item_start -->
                      </div>
                      <!-- /.ico-item_timeframe -->
                    </div>
                    <!-- /.col-2 -->
                  </div>
                  <!-- /.row -->
                  <div class="ico-item_bottom-line">
                    <div class="row">
                      <div class="col-10">
                        <div class="ico-item_links-wrapper">
                          <a class="to-discuss" href="#">Discuss on forum<sup>2</sup></a>
                          <a class="to-rate to-rate--active" href="#">Reviews<sup>4</sup></a>
                          <a class="add-calendar" href="#">Add to ICO calendar</a>
                        </div>
                        <!-- /.ico-item-bottom-line -->
                      </div>
                      <!-- /.col-10 -->
                      <div class="col-2">
                        <div class="ico-item_button">
                          <a href="#" class="btn ico-item_button-details">ICO Details</a>
                        </div>
                        <!-- /.ico-item_button -->
                      </div>
                      <!-- /.col-2 -->
                    </div>
                    <!-- /.row -->
                  </div>
                  <!-- /.ico-item_bottom-line -->
                </div>
                <!-- /.ico_item -->
                <div class="ico-item">
                  <div class="row">
                    <div class="col-3">
                      <div class="ico-item_logo" style="background-image: linear-gradient(225deg, #e55f6e 0%, #b12a39 100%)">
                        <img src="img/miniApps-logo.png" alt="">
                      </div>
                    </div>
                    <!-- /.col-3 -->
                    <div class="col-4">
                      <div class="ico-item_discription">
                        <div class="ico-item_title">
                          <h2>MiniApps</h2>
                          <div class="rating-wrapper">
                            <div class="rating">
                              <span>9.2 <sup>/10</sup></span>
                            </div>
                          </div>
                          <!-- /.rating-wrapper -->
                        </div>
                        <!-- /.ico-item_title -->
                        <div class="ico-item_category">
                          <span>Blockchain</span>
                        </div>
                        <!-- /.ico-item_category -->
                        <div class="ico-item_discribe">
                          <p>
                            MiniApps.pro is a chatbot platform and blockchain-based marketplace for chatbot developers, their clients and partners.
                          </p>
                        </div>
                        <!-- /.ico-item_features -->
                        <div class="ico-item_platforms">
                          <span class="ico-item_platforms-pl">PLATFORM</span>
                          <span class="ico-item_platforms-name">ETH</span>
                          <span class="ico-item_platforms-name">WAVES</span>
                        </div>
                        <!-- /.ico-item_features -->
                      </div>
                      <!-- /.ico-item_discription -->
                    </div>
                    <!-- /.col-4 -->
                    <div class="col-3">
                      <div class="ico-item_fundraising">
                        <div class="ico-item_cap">
                          <span class="ico-item_cap-type">HARD CAP</span>
                          <span class="ico-item_cap-goal">700 000 <sup>USD</sup></span>
                          <div class="ico-item_scale">
                            <div class="ico-item_scale-inner ico-item_scale-inner--green"></div>
                          </div>
                          <div class="ico-item_cap-current">
                            <span class="ico-item_cap-current-usd">560 012 <sup>USD</sup></span>
                            <span class="ico-item_cap-current-percent">25.2%</span>
                          </div>
                        </div>
                        <!-- /.ico-item_cap -->
                        <div class="ico-item_price">
                          <span class="ico-item_price-token">ICO TOKEN PRICE</span>
                          <span class="ico-item_price-token-usd">0.25 USD</span>
                        </div>
                        <!-- /.ico-item_price -->
                      </div>
                      <!-- /.ico-item_fundraising -->
                    </div>
                    <!-- /.col-3 -->
                    <div class="col-2">
                      <div class="ico-item_timeframe">
                        <div class="ico-item_start">
                          <span class="ico-item_start-st">STARTED</span>
                          <span class="ico-item_start-date">17.10.2017</span>
                          <span class="ico-item_start-time-left">2M 5D <b>ago</b></span>
                        </div>
                        <!-- /.ico-item_start -->
                        <div class="ico-item_end">
                          <span class="ico-item_end-en">ENDS</span>
                          <span class="ico-item_end-date">17.12.2017</span>
                          <span class="ico-item_end-time-remain ico-item_end-time-remain--soon"><b>in</b> 5D 11H</span>
                        </div>
                        <!-- /.ico-item_start -->
                      </div>
                      <!-- /.ico-item_timeframe -->
                    </div>
                    <!-- /.col-2 -->
                  </div>
                  <!-- /.row -->
                  <div class="ico-item_bottom-line">
                    <div class="row">
                      <div class="col-10">
                        <div class="ico-item_links-wrapper">
                          <a class="to-discuss" href="#">Discuss on forum<sup>2</sup></a>
                          <a class="to-rate to-rate--active" href="#">Reviews<sup>4</sup></a>
                          <a class="add-calendar" href="#">Add to ICO calendar</a>
                        </div>
                        <!-- /.ico-item-bottom-line -->
                      </div>
                      <!-- /.col-10 -->
                      <div class="col-2">
                        <div class="ico-item_button">
                          <a href="#" class="btn ico-item_button-details">ICO Details</a>
                        </div>
                        <!-- /.ico-item_button -->
                      </div>
                      <!-- /.col-2 -->
                    </div>
                    <!-- /.row -->
                  </div>
                  <!-- /.ico-item_bottom-line -->
                </div>
                <!-- /.ico_item -->
              </div>
              <!-- /.ico-catalogue_list -->
            </div>
            <!-- /.col -->
          </div>
          <!-- /.row -->
        </div>
        <!-- /.container-fluid -->
      </div>
      <!-- /.ico-favourite -->
    </div>
    <tpl-footer></tpl-footer>
  </div>

  <!-- /.content -->
</template>

<script>
import tplHeader from './TheHeader'
import tplFooter from './TheFooter'
import Vuex from 'vuex'
const storeEvent = Vuex.createNamespacedHelpers('portfolio')
export default {
  name: 'FavouritePage',
  components: { tplHeader, tplFooter },
  data () {
    return {
    }
  }
}

</script>

<style lang="less" scoped>

  @import "../assets/less/vars";
  .ico-favourite {
    &_title {
      padding: 32px 0;
      h1 {
        color: #333f52;
        font-family: @main-font;
        font-size: 20px;
        font-weight: 500;
        line-height: 18px;
        /* Text style for "Favourite" */
        letter-spacing: -0.07px;
      }
    }
    .ico-catalogue_nav {
      margin-bottom: 0;
      padding: 32px 0;
      &-wrapper {
        margin-right: 20px;
      }
      .portfolio-view_filter {
        margin-left: auto;
        margin-right: 64px;
      }
    }
    &_list {
      margin-bottom: 52px;
      .ico-item {
        margin-bottom: 20px;
        background-color: #fafbfc;
        box-shadow: 0 2px 4px rgba(51, 51, 51, 0.1);
        &--sponsored {
          background-color: #e0e6ed;
        }
        &_content-wrapper {
          display: flex;
          background-color: #fafbfc;
          box-shadow: 0 2px 4px rgba(51, 51, 51, 0.1);
          &--sponsored {
            background-color: #e0e6ed;
          }
        }
        &_logo {
          position: relative;
          display: flex;
          width: 100%;
          min-height: 152px;
          border-radius: 4px 0 0 0;
          &::before {
            content: "";
            position: absolute;
            width: 11px;
            height: 10px;
            left: 20px;
            top: 23px;
            background-image: @img-heart-white;
            background-position: center;
            background-repeat: no-repeat;
            z-index: 11;
          }
          img {
            margin: auto;
            padding: 10px;
          }
        }
        &_discription {
          display: flex;
          flex-direction: column;
          //width: 37%;
          padding: 12px 0px 18px 0px;
          flex-grow: 1;
        }
        &_title {
          margin-bottom: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          h2 {
            color: #333f52;
            font-size: 24px;
            font-weight: 700;
            line-height: 24px;
          }
        }
        &_category {
          display: flex;
          margin-bottom: 5px;
          span {
            margin-right: 3px;
            padding: 3px 5px 1px;
            border-radius: 4px;
            border: 1px solid #cbd5e2;
            background-color: #ffffff;
            color: #525c6c;
            font-family: @main-font;
            font-size: 10px;
            font-weight: 400;
            line-height: 10px;
          }
        }
        &_discribe {
          margin-bottom: 8px;
          p {
            max-width: 100%;
            color: #525c6c;
            font-family: @main-font;
            font-size: 12px;
            font-weight: 400;
            line-height: 16px;
          }
        }
        &_platforms {
          margin-top: auto;
          &-pl {
            margin-right: 16px;
            color: #8f96a1;
            font-family: @main-font;
            font-size: 11px;
            font-weight: 500;
            line-height: 11px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          &-name {
            margin-right: 12px;
            color: #333f52;
            font-size: 14px;
            line-height: 16px;
            text-transform: uppercase;
            font-family: @main-font;
            font-weight: 500;
          }
        }
        &_time-wrapper {
          margin-top: 30px;
        }
        &_totall-price-wrapper {
          margin-top: 25px;
          padding-left: 14px;
        }
        &_time,
        &_totall-price {
          width: 100%;
          th {
            color: #8f96a1;
            font-family: @main-font;
            font-size: 11px;
            font-weight: 500;
            line-height: 11px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          td {
            color: #707986;
            font-family: @main-font;
            font-size: 16px;
            font-weight: 500;
            line-height: 20px;
            letter-spacing: -0.4px;
            b {
              font-size: 14px;
            }
          }
        }
        &_roi-wrapper {
          padding: 20px 0 15px 14px;
          box-shadow: 8px 8px 8px rgba(0, 0, 0, 0.05);
          background-color: #ffffff;
          border-bottom: 2px solid #ced8e3;
        }
        &_roi {
          width: 100%;
          th {
            color: #525c6c;
            font-family: @main-font;
            font-size: 11px;
            font-weight: 700;
            line-height: 11px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            &:last-child {
              text-align: center;
            }
          }
          td {
            color: #333f52;
            font-family: @main-font;
            font-size: 16px;
            font-weight: 700;
            line-height: 20px;
            span {
              font-size: 12px;
            }
            &:last-child {
              text-align: center;
              color: #45af37;
              font-family: @main-font;
              font-size: 22px;
              font-weight: 700;
              line-height: 20px;
              letter-spacing: -0.4px;
              span {
                position: relative;
                &::before {
                  content: "";
                  position: absolute;
                  width: 11px;
                  height: 8px;
                  left: -22px;
                  top: 1px;
                  background-image: @img-triangle-green;
                  background-position: center;
                  background-repeat: no-repeat;
                  z-index: 11;
                }
              }
            }
          }
          &--negative {
            td {
              &:last-child {
                color: #ff3657;
                span {
                  position: relative;
                  &::before {
                    content: "";
                    position: absolute;
                    width: 11px;
                    height: 8px;
                    left: -22px;
                    top: 1px;
                    background-image: @img-triengle-red;
                    background-position: center;
                    background-repeat: no-repeat;
                    z-index: 11;
                  }
                }
              }
            }
          }
        }
        &_fundraising {
          padding: 20px 0px 0px 28px;
          display: flex;
          flex-direction: column;
          //width: 23%;
        }
        &_cap {
          display: flex;
          flex-direction: column;
          flex-grow: 2;
          margin-bottom: 10px;
          width: 75%;
          &-type {
            margin-bottom: 5px;
            color: #8f96a1;
            font-family: @main-font;
            font-size: 11px;
            font-weight: 500;
            line-height: 11px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          &-goal {
            margin-bottom: 10px;
            color: #333f52;
            font-family: @main-font;
            font-size: 22px;
            font-weight: 700;
            line-height: 22px;
            text-transform: uppercase;
            letter-spacing: -0.4px;
            sup {
              font-size: 14px;
              letter-spacing: -0.4px;
            }
          }
          &-current {
            display: flex;
            justify-content: space-between;
            &-usd {
              &--canceled {
                color: #ff3657;
              }
              &--reached {
                color: @accent-color;
              }
              color: #707986;
              font-family: @main-font;
              font-size: 12px;
              font-weight: 400;
              line-height: 12px;
              text-transform: uppercase;
              sup {
                font-size: 10px;
              }
            }
            &-percent {
              color: #8f96a1;
              font-family: @main-font;
              font-size: 12px;
              font-weight: 400;
              line-height: 12px;
            }
          }
        }
        &_scale {
          position: relative;
          margin-bottom: 10px;
          height: 6px;
          border-radius: 4px;
          border: 1px solid #ced8e3;
          background-color: #ffffff;
          &::before {
            content: "";
            position: absolute;
            width: 24px;
            height: 22px;
            left: 50px;
            top: -10px;
            background-image: @img-scale-drop;
            background-position: center;
            background-repeat: no-repeat;
            z-index: 11;
          }
          &-inner {
            width: 21%;
            height: 4px;
            border-radius: 4px 0 0 4px;
            &--grey {
              background-color: #c5d0de;
            }
            &--green {
              background-color: @accent-color;
            }
            &--red {
              background-color: #ff3657;
            }
          }
        }
        &_status-wrapper {
          margin-top: auto;
          padding-left: 24px;
          max-width: 140px;
        }
        &_status {
          position: relative;
          color: #707986;
          font-family: @main-font;
          font-size: 11px;
          font-weight: 500;
          line-height: 11px;
          text-transform: uppercase;
          &::before {
            content: "";
            position: absolute;
            width: 16px;
            height: 14px;
            left: -22px;
            top: 2px;
            background-position: center;
            background-repeat: no-repeat;
            z-index: 11;
          }
          &--canceled {
            color: #ff3657;
            &::before {
              background-image: @img-thumbs-down-red;
            }
          }
          &--reached {
            color: @accent-color;
            &::before {
              height: 24px;
              background-image: @img-watch;
            }
          }
        }
        &_price {
          display: flex;
          flex-direction: column;
          margin-top: auto;
          &-token {
            margin-bottom: 6px;
            color: #8f96a1;
            font-family: @main-font;
            font-size: 11px;
            font-weight: 500;
            line-height: 11px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          &-token-usd {
            color: #707986;
            font-family: @main-font;
            font-size: 14px;
            font-weight: 700;
            line-height: 14px;
            text-transform: uppercase;
          }
        }
        &_trading {
          display: flex;
          flex-direction: column;
          flex-grow: 2;
          padding: 0 0 0px 14px;
        }
        &_timeframe {
          display: flex;
          flex-direction: column;
          //flex-grow: 2;
          padding: 20px 0 0px 0px;
        }
        &_start,
        &_end {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin-bottom: 9px;
          &-st,
          &-en {
            margin-bottom: 7px;
            color: #8f96a1;
            font-family: @main-font;
            font-size: 11px;
            font-weight: 500;
            line-height: 11px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          &-date {
            margin-bottom: 6px;
            color: #333f52;
            font-family: @main-font;
            font-size: 16px;
            font-weight: 700;
            line-height: 16px;
            letter-spacing: -0.4px;
          }
          &-time-remain,
          &-time-left {
            padding: 2px 4px 2px;
            border-radius: 2px;
            background-color: #c5d0de;
            color: #ffffff;
            font-family: @main-font;
            font-size: 11px;
            font-weight: 500;
            line-height: 11px;
          }
          &-time-remain {
            &--soon {
              background-color: #ff3657;
            }
          }
          &-time-left {
            &--soon {
              background-color: #ff3657;
            }
          }
        }
        &_end {
          margin-bottom: 0;
          margin-top: auto;
        }
        &_bottom-line {
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.05);
          border-radius: 0 0 4px 4px;
          background-color: #ffffff;
        }
        &_links-wrapper {
          align-items: center;
          display: flex;
          padding: 16px 0;
          a {
            margin-right: 30px;
            position: relative;
            font-family: @main-font;
            font-size: 12px;
            font-weight: 500;
            line-height: 14px;
            letter-spacing: -0.13px;
            white-space: nowrap;
            &:first-child {
              margin-left: 20px;
            }
            sup {
              top: -7px;
              margin-left: 4px;
              margin-top: -22px;
              padding: 1px 5px 1px 4px;
              border-radius: 8px;
              background-color: #5bb0d5;
              color: #ffffff;
              font-family: @main-font;
              font-size: 9px;
              font-weight: 500;
              line-height: 9px;
            }
          }
          .to-discuss {
            padding-left: 24px;
            color: #525c6c;
            font-size: 12px;
            font-weight: 500;
            line-height: 14px;
            &::before {
              content: "";
              position: absolute;
              width: 16px;
              height: 14px;
              left: 0px;
              top: -1px;
              background-image: @img-discuss-icon;
              background-position: center;
              background-repeat: no-repeat;
              z-index: 11;
            }
          }
          .your-review {
            padding-left: 20px;
            color: #45af37;
            font-family: @main-font;
            font-size: 10px;
            font-weight: 500;
            line-height: 14px;
            &::before {
              content: "";
              position: absolute;
              width: 14px;
              height: 14px;
              left: 0px;
              top: -2px;
              //background-image: @img-your-review;
              background-position: center;
              background-repeat: no-repeat;
              z-index: 11;
            }
          }
          .to-rate {
            padding-left: 24px;
            color: #525c6c;
            font-size: 12px;
            font-weight: 500;
            line-height: 14px;
            &::before {
              content: "";
              position: absolute;
              width: 16px;
              height: 14px;
              left: 0px;
              top: -2px;
              background-image: @img-to-rate-icon;
              background-position: center;
              background-repeat: no-repeat;
              z-index: 11;
            }
            &--active {
              color: #45af37;
              &::before {
                content: "";
                position: absolute;
                width: 14px;
                height: 14px;
                left: 0px;
                top: -1px;
                background-image: @img-green-check;
                background-position: center;
                background-repeat: no-repeat;
                z-index: 11;
              }
            }
          }
          .add-calendar {
            padding-left: 24px;
            color: #525c6c;
            font-size: 12px;
            font-weight: 500;
            line-height: 14px;
            &::before {
              content: "";
              position: absolute;
              width: 16px;
              height: 14px;
              left: 0px;
              top: -2px;
              background-image: @img-calendar-small;
              background-position: center;
              background-repeat: no-repeat;
              z-index: 11;
            }
            &--active {
              color: @accent-color;
              &::before {
                content: "";
                position: absolute;
                width: 14px;
                height: 14px;
                left: 0px;
                top: -2px;
                background-image: @img-green-check;
                background-position: center;
                background-repeat: no-repeat;
                z-index: 11;
              }
            }
          }
          .buy-sell {
            padding-left: 24px;
            margin-right: 15px;
            color: #525c6c;
            font-size: 12px;
            font-weight: 500;
            line-height: 14px;
            &::before {
              content: "";
              position: absolute;
              width: 16px;
              height: 14px;
              left: 0px;
              top: -2px;
              background-image: @img-wallet-blue;
              background-position: center;
              background-repeat: no-repeat;
              z-index: 11;
            }
          }
        }
        &_button {
          display: flex;
          justify-content: center;
          //padding: 18px 0px 13px 16px;
          box-shadow: 0 2px 0 #3b962f;
          border-radius: 0 0 4px;
          background-color: #45af37;
          &-details {
            position: relative;
            padding: 18px 0px 13px 16px;
            color: #ffffff;
            font-family: @main-font;
            font-size: 14px;
            font-weight: 500;
            line-height: 14px;
            &::before {
              content: "";
              position: absolute;
              width: 15px;
              height: 15px;
              left: -6px;
              top: 16px;
              background-image: @img-white-check-big;
              background-position: center;
              background-repeat: no-repeat;
              z-index: 11;
            }
          }
        }
      }

    }
  }

</style>
