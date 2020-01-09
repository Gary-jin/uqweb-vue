<template>
  <div id="giftBag" class="giftBag" >
    <div class="headerConBox">
      <div class="header">
        <i class="iconfont icon-back" @click="goBack()"></i>
        <p class="title">礼包详情</p>
      </div>
    </div>
    <div class="contentBox">
      <div class="bannerBox" v-if="data">
        <!--<img :src="data.img[0]" alt="">-->
        <swiper class="swiper_box" v-if="data.img" :options="swiperOption" ref="mySwiper" style="height:100%;">
          <swiperSlide v-for="(item,index) in data.img" :key="index" style="width: 100%">
            <img v-lazy="item" alt="" style="width:100%;">
          </swiperSlide>
        </swiper>
        <div class="swiper-pagination" slot="pagination"></div>
      </div>
      
      <div class="titleBox" v-if="data">
        <div class="titleText">
          <span class="titleIcon" :style="{background: 'linear-gradient('+$store.state.global.theme.deg+'deg,' +$store.state.global.theme.mainColor+','+$store.state.global.theme.secondColor+')'}">优选</span>{{data.title}}
        </div>
      </div>
      <div class="piceBox" v-if="data">
        <span class="newPicIcon">￥</span>
        <span class="newPic">{{data.price}}</span>
        <!-- <span class="picTitle">原价：</span>
        <span class="picIcon">￥</span>
        <span class="pic">106.9</span> -->
      </div>
      <div class="giftBagBox">
        <img class="giftIcon" src="../../assets/img/giftBag/liwu.png" alt="">
        <p class="text" :style="{color:$store.state.global.theme.mainColor}">升级专享礼包</p>
      </div>
      <div class="serveBox">
        <div class="serve">
          <div class="title">服务</div>
          <div class="descBoxText">
            <div class="descitem" v-for="(item, index) in descBoxTextList" :key="'descBoxTextList'+index"><span class="itemText">{{item}}</span><i v-if="index !== descBoxTextList.length - 1" class="itemIcon"></i></div>
          </div>
        </div>
      </div>
      <div class="descBox" v-if="data">
        <div class="descTitle">图文详情</div>
        <div class="desc" v-html="data.describe"></div>
      </div>
    </div>
    <div class="buyBox">
      <div class="buyBtn" @click="jumpTo('/homeFirmOrder?id=' + id)" :style="{background: 'linear-gradient('+$store.state.global.theme.deg+'deg,' +$store.state.global.theme.mainColor+','+$store.state.global.theme.secondColor+')'}">立即购买</div>
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import MescrollVue from 'mescroll.js/mescroll.vue'
import * as utils from '../../utils'
export default {
  name: 'giftBag',
  components: {
    MescrollVue,
    swiper,
    swiperSlide
  },
  data () {
    return {
      swiperOption: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
        hideOnClick: false,
        disabledClass: 'my-button-disabled',
        hiddenClass: 'my-button-hidden',
        spaceBetween: 5,
        autoplay: false,
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction'
        },
        on: {
          transitionEnd: () => {
            if (this.$refs.mySwiper.swiper) {
              this.index = this.$refs.mySwiper.swiper.realIndex
            }
          },
          sliderMove: function (event) {
            window.canRightSlipBack = false
          },
          touchEnd: function (event) {
            setTimeout(() => {
              window.canRightSlipBack = true
            }, 600)
          }
        }
      },
      id: '',
      data: '',
      descBoxTextList: ['正品保证','限时包邮','售后无忧']
    }
  },
  methods: {
    getInfo() {
      var that = this
      this.$http.get('/amoy/user/upgrade-goods', {id: that.id}, true).then(res => {
        if(res.code == 0){
          that.data = res.data[0]
        }
      })
    }
  },
  beforeMount() {
    var that = this
    that.id = that.$route.query.id
    // that.analysisUrl = JSON.parse(localStorage.getItem("analysisUrl"))
  },
  mounted () {
    this.getInfo()
  }
}
</script>
<style scoped lang="less">
  .giftBag{
    font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Helvetica, Arial,
    "Hiragino Sans GB", "Source Han Sans", "Noto Sans CJK Sc", "Microsoft YaHei", "Microsoft Jhenghei", sans-serif;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background: #F7F7F7;
    .headerConBox{
      position: absolute;
      overflow: hidden;
      width: 100%;
      background: #fff;
      z-index: 3;
      .header{
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 0.83rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #191919;
        .icon-back{
          position: absolute;
          font-size: 0.4rem;
          font-weight: 500;
          color: #666;
          left: 0.31rem;
          z-index: 3;
        }
        .title{
          position: relative;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 3rem;
          height: 0.83rem;
          margin: auto;
          font-size: 0.34rem;
          font-weight: 500;
          line-height: 0.83rem;
          text-align: center;
          color: #333333;
        }
        .rightBut{
          position: absolute;
          right: 0.3rem;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 0.28rem;
          font-weight: 500;
          line-height: 0.83rem;
          color: #999999;
          i {

          }
        }
      }
    }
    .contentBox{
      position: absolute;
      overflow: auto;
      top: 0.88rem;
      bottom: 0;
      width: 100%;
      .bannerBox{
        position: relative;
        overflow: hidden;
        width: 7.5rem;
        /*height: 5.6rem;*/
        .swiper_box{
          width: 100%;
          img {
          width: 100%;
          height: 100%
        }
        }
        .swiper-pagination{
          position: absolute;
          bottom: 10px;
          left: 100%;
          margin-left: -1.3rem;
          width: 0.8rem;
          height: 0.8rem;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          color: #000;
          font-size: 0.28rem;
          text-align: center;
          line-height: 0.8rem;
        }
      }
      .titleBox{
        position: relative;
        width: 100%;
        background: #fff;
        box-sizing: border-box;
        padding: 0.3rem 0.58rem 0.1rem 0.2rem;
        .titleText{
          .titleIcon{
            height: 0.36rem;
            margin-right: 0.1rem;
            margin-top: -0.1rem;
            display: inline-block;
            padding: 0rem 0.15rem 0rem 0.15rem;
            font-size: 0.26rem;
            font-weight: 500;
            line-height: 0.36rem;
            border-radius: 0.18rem;
            color: #fff;
            background: #FF5847;
          }
          font-size: 0.32rem;
          font-weight: bold;
          line-height: 0.38rem;
          color: #333333;
        }
      }
      .piceBox{
        width: 100%;
        padding: 0.26rem 0 0.26rem 0.2rem;
        box-sizing: border-box;
        background: #fff;
        .newPicIcon{
          font-size: 0.3rem;
          font-weight: bold;
          line-height: 0.46rem;
          color: #FF5847;
        }
        .newPic{
          font-size: 0.46rem;
          font-weight: bold;
          line-height: 0.46rem;
          color: #FF5847;
        }
        .picTitle{
          font-size: 0.26rem;
          font-weight: 500;
          line-height: 0.46rem;
          color: #999999;
        }
        .picIcon{
          font-size: 0.26rem;
          font-weight: 500;
          line-height: 0.46rem;
          color: #999999;
        }
        .pic{
          font-size: 0.26rem;
          font-weight: 500;
          line-height: 0.46rem;
          text-decoration: line-through;
          color: #999999;
        }
      }
      .giftBagBox{
        position: relative;
        width: 100%;
        height: 0.8rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background: rgba(255,238,235,1);
        .giftIcon{
          width: 0.4rem;
          margin-left: 0.2rem;
          margin-right: 0.1rem;
        }
        .text{
          font-size: 0.3rem;
          font-weight: 500;
          line-height: 0.3rem;
          color: #FF5847;
        }
      }
      .serveBox{
        position: relative;
        width: 100%;
        background: #fff;
        margin-top: 0.2rem;
        .serve{
          width: 7.1rem;
          height: 0.9rem;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin: auto;
          .title{
            font-size: 0.28rem;
            font-weight: 500;
            line-height: 0.28rem;
            color: #999;
          }
          .descBoxText{
            flex: 1;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .descitem{
              display: flex;
              justify-content: flex-start;
              align-items: center;
              .itemText{
                padding-left: 0.25rem;
                padding-right: 0.25rem;
                font-size: 0.28rem;
                font-weight: 500;
                line-height: 0.28rem;
                color: #333333;
              }
              .itemIcon{
                display: inline-block;
                width: 0.04rem;
                height: 0.04rem;
                border-radius: 50%;
                background: #333333;
              }
            }
          }
        }
      }
      .descBox{
        position: relative;
        width: 100%;
        margin-top: 0.2rem;
        margin-bottom: 1rem;
        background: #fff;
        .descTitle{
          width: 100%;
          box-sizing: border-box;
          padding-left: 0.2rem;
          padding-top: 0.3rem;
          font-size: 0.28rem;
          font-weight: 500;
          line-height: 0.3rem;
          color: #999;
        }
        .desc{
          width: 7.5rem;
          box-sizing: border-box;
          padding: 0.2rem;
        }
      }
    }
    .buyBox{
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 1rem;
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      .buyBtn{
        width: 6.7rem;
        height: 0.8rem;
        background: linear-gradient(90deg,rgba(255,145,120,1),rgba(255,88,71,1));
        border-radius: 0.1rem;
        font-size: 0.32rem;
        font-weight: bold;
        line-height: 0.8rem;
        color: #fff;
        text-align: center;
      }
    }
  }
</style>
