<template>
  <div class="UnderIndexNew">
    <!-- <div class="mescrollBox" :style="{'bottom': $isMallShop ? '43px' : '0',}"> -->
    <div class="mescrollBox">
      <!--<mescroll-vue ref="mescroll"  :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">-->
      <div class="under-header flex" ref="header" :style="{paddingTop: statusH + 'rem'}">
        <img class="back" src="../../../assets/img/mall/back.png" alt="" @click="goNativeHome()">
        <div class="middle flex_1">
          <div class="left" @click="selectCity()">
            <img src="../../../assets/img/mall/location.png" alt="">
            <p class="address">{{city || '定位'}}</p>
          </div>
          <div class="right">
            <img src="../../../assets/img/mall/search.png" class="search" alt="" @click="jumpTo('/mall/search?type=shop')">
            <img src="../../../assets/img/mall/scan.png"  class="scan" alt="" @click.stop="handleQrcode()">
          </div>
        </div>
      </div>
      <mescroll-vue ref="mescroll"  :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
        <div ref="mate" v-if="list1">
          <div class="n_home_main" ref="nBanner">
            <div class="banner" style="position:relative" >
              <swiper :options="swiperOption" ref="mySwiper" v-if="list1.slide">
                <swiperSlide  v-for="(item,i) in list1.slide" :key="i" @click="jumpTos(item)">
                  <img :src="item.thumb" alt="" :key="item.thumb" style="width:100%;">
                </swiperSlide>
                <div class="swiper-pagination" slot="pagination"></div>
              </swiper>
            </div>
          </div>
          <div class="nav-banner">
            <swiper class="banner_list" :options="swiperOption1" ref="navButton" v-if="list1.navInfo">
              <swiper-slide class="allBox" v-for="(items, i) in list1.navInfo" :key="i" :index="i">
                <div class="allList" v-for="(item,index) in items" :key="index">
                  <img v-lazy="item.thumb" alt="" :key="item.thumb" @click="jumpTos(item)">
                  <p>{{item.title}}</p>
                </div>
              </swiper-slide>
              <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
            <!-- <div class="redImg" @click="jumpTo('/invite')"><img src="../../../assets/img/mall/redImg.png" alt="" style="width: 100%"></div> -->
          </div>
          <!--<div class="nearImg"><img src="../../../assets/img/mall/nearshop.png" alt=""></div>-->
          <div class="nearImg"><img :src="nearShopImg ? nearShopImg: nearShopImg1" alt=""></div>
        </div>
        <div  ref="tabBox" class="tabBox" :class="{sticky: device === 'iOS'}">
           <div class="tab">
              <div :class="active === 0 ? 'active' : ''" @click="handChange(0)">
              推荐
              <span></span>
            </div>
            <div :class="active === 1 ? 'active' : ''" @click="handChange(1)">
            距离
            <span></span>
            </div>
            <div :class="active === 2 ? 'active' : ''" @click="handChange(2)">
            人气
            <span></span>
            </div>
            <div :class="active === 3 ? 'active' : ''" @click="handChange(3)">
            好评
            <span></span>
            </div>
           </div>
        </div>
        <UnderNew :list="suggest" :showNoData="showNo" :style="{'minHeight': shopListH + 'px'}"></UnderNew>
    </mescroll-vue>
    </div>
  </div>
</template>

<script>
import {Tab, TabItem} from 'vux'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import UnderNew from '../../../components/underListNew'
import * as apiHttp from '../../../api/index'
import MescrollVue from 'mescroll.js/mescroll.vue'
import nearShopImg1 from '../../../assets/img/mall/nearshop.png'
import * as utils from '../../../utils'
export default {
  name: 'index',
  components: {
    Tab,
    TabItem,
    swiper,
    swiperSlide,
    UnderNew,
    MescrollVue
  },
  data () {
    return {
      nearShopImg1,
      nearShopImg: '',
      active: 0,
      swiperOption: {
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination'
        }
      },
      finish: false,
      swiperOption1: {
        loop: false,
        pagination: {
          el: '.swiper-pagination'
        }
      },
      suggest: [],
      list1: [],
      loading: false,
      isCityShow: false,
      city: this.$store.state.global.userLocation.name,
      lon: this.$store.state.global.userLocation.lon,
      lat: this.$store.state.global.userLocation.lat,
      isDingwei: true,
      currentCity: null,
      mescroll: null,
      mescrollDown: {
        auto: false,
        isLock: true,
        callback: this.refresh,
        offset: 40,
        textInOffset: '下拉刷新', // 下拉的距离在offset范围内的提示文本
        textOutOffset: '松开刷新', // 下拉的距离大于offset范围的提示文本
        textLoading: '正在刷新',
        htmlContent: '<p class="downwarp-progress downwarp-loading"></p><p class="downwarp-tip"></p>'
      },
      mescrollUp: {
        onScroll: this.handleScroll,
        callback: this.upCallback,
        use: true,
        page: {
          num: 0,
          size: 5
        },
        htmlNodata: '<p class="upwarp-nodata">—— 我也是有底线的 ——</p>',
        htmlLoading: '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">加载中..</p>',
        noMoreSize: 5,
        empty: {
          warpId: '',
          icon: '',
          tip: '暂无相关数据~'
        }
      },
      lastScrollTop: 0, // 路由切换时滚动条的位置
      lastBounce: null, // 路由切换时是否禁止ios回弹
      device: this.$store.state.global.deviceType,
      statusBar: false,
      showHead: false,
      shopListH: '',
      showNo: false
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.mescroll) {
        // 滚动到之前列表的位置
        if (vm.lastScrollTop) {
          vm.mescroll.setScrollTop(vm.lastScrollTop)
          setTimeout(() => { // 需延时,因为setScrollTop内部会触发onScroll,可能会渐显回到顶部按钮
            vm.mescroll.setTopBtnFadeDuration(0) // 设置回到顶部按钮显示时无渐显动画
          }, 16)
        }
        // 恢复到之前设置的isBounce状态
        if (vm.lastBounce != null) vm.mescroll.setBounce(vm.lastBounce)
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    if (this.mescroll) {
      this.lastScrollTop = this.mescroll.getScrollTop() // 记录当前滚动条的位置
      this.mescroll.hideTopBtn(0) // 隐藏回到顶部按钮,无渐隐动画
      this.lastBounce = this.mescroll.optUp.isBounce // 记录当前是否禁止ios回弹
      this.mescroll.setBounce(true) // 允许bounce
    }
    if (this.isCityShow) {
      this.showHead = false
    }
    next()
  },
  computed: {
    cityS () {
      return this.city
    }
  },
  created () {
    utils.storage.set('location')
    let bodyHeight = document.body.clientHeight
    let safeArea = dsBridge.call('receiveParams', 'safeAreaTop1')
    let size = (document.documentElement.clientWidth / 7.5)
    if (safeArea == '123'){
      this.statusH = 0
    } else {
      this.statusH = (safeArea / size)
    }
    this.shopListH = bodyHeight - 110
    if (!utils.storage.get('mallFooter')) {
    //  如果没有获取过商城首页装修模板信息，就获取一下（主要为了底部菜单栏）
      this.getDesign()
    }
  },
  methods: {

    // 获取商城首页装修模板
    getDesign () {
      this.$http.post('/amoy/app/design', {
        type: 1,
        site_type: 1,
        version: this.version,
        device: (this.device === 'android') ? 1 : 2
      }, true, true).then(res => {
        if (res.code === 0) {
          if (res.data.footer) {
            this.$store.commit('setMallFooter', JSON.parse(res.data.footer))
          }
          if (res.data.content) {
            this.$store.commit('setMallContent', JSON.parse(res.data.content))
          }
          let content = JSON.parse(res.data.content)
          if (res.data.content) {
            for (let i = 0; i < content.length; i++) {
              if (content[i].name === 'edit-mall-header') {
                this.$store.commit('setMallSearch', content[i].params)
              }
              if (content[i].name === 'edit-mall-hot-search') {
                this.$store.commit('setMallHot', content[i].params)
              }
            }
          }
        }
      })
    },
    selectCity () {
      // this.vueJumpTo('/mall/city?city=' + this.city)
      dsBridge.call("open", { url: window.location.origin+'/uqWeb/html/city/index.html?city='+ this.city, type: 'web' })
      // dsBridge.call("open", { url: 'http://unative.bangyaosoft.cn'+'/uqWeb/html/city/index.html?city='+ this.city, type: 'web' })
      
    },
    handChange (key) {
      this.active = key
      this.suggest = []
      this.mescrollUp.page.num = 1
      this.upCallback(this.mescrollUp.page, this.mescroll)
    },
    getInfo () {
      apiHttp.underIndex().then(res => {
        if (res.code === 0) {
          this.list1 = res.data
          this.nearShopImg = res.data.fuShopsSlide[0].thumb
        }
        this.$nextTick(() => {
          this.mescroll.endSuccess(this.list1, false)
        })
      })
    },
    mescrollInit (mescroll) {
      this.mescroll = mescroll
    },
    upCallback (page, mescroll) {
      this.$http.post('/mall/oto/new-shops-list', {lng: this.lon, lat: this.lat, disType: this.active, page: page.num}).then(res => {
        if (res.code === 0) {
          if (res.data.shopList === '') {
            this.showNo = true
          }
          let arr = res.data.shopList === '' ? [] : res.data.shopList
          if (page.num === 1) this.suggest = []
          this.suggest = this.suggest.concat(arr)
          this.$nextTick(() => {
            mescroll.endSuccess(res.data.shopList.length, true)
          })
        }
      }).catch((e) => {
        mescroll.endErr()
      })
    },
    handleScroll (mescroll, y, isUp) {
      let that = this
      if (that.isIos) {
        return
      }
      that.opacity = Math.abs(Math.round(y)) / that.$refs.nBanner.offsetHeight
      if (y < that.$refs.nBanner.offsetHeight) {
        that.$refs.header.style.backgroundColor = `rgba(217, 33, 33, ${that.opacity})`
      } else {
        that.$refs.header.style.backgroundColor = `rgba(217, 33, 33, 1)`
      }
      if ((y + 20) >= that.$refs.mate.offsetHeight) {
        that.$refs.tabBox.className = 'tabBox fixedTop'
        if (that.statusH > 0) {
          that.$refs.tabBox.style.top = (that.statusH + 0.8) + 'rem'
        } else {
          that.$refs.tabBox.style.top = 0.8 + 'rem'
        }
      } else {
        that.$refs.tabBox.className = 'tabBox'
      }
    },
    // 扫码
    handleQrcode () {
      dsBridge.call('FNScanner', (ret) => {
        apiHttp.underQrcodeSecc(ret).then(res => {
          if (res.code === 0) {
            if (res.data.type === 'sadmin') {
              this.jumpTo('/mall/payUnder?spid=' + res.data.spid + '&price=' + res.data.price)
            } else if (res.data.type === 'coupon') {
              this.jumpTo('/mall/underCancel?spid=' + res.data.spid + '&id=' + res.data.id)
            } else if (res.data.type === 'goods') {
              dsBridge.call("open", {url: window.location.origin +'/uqWeb/html/mall/mallDetails.html?id=' + res.data.goodsId,type: 'web'})

            } else if (res.data.type === 'shops' && res.data.model === 'bbc') {
                dsBridge.call("open", {url: window.location.origin +'/uqWeb/html/mall/mallShop.html?spid=' + res.data.spid,type: 'web'})

            } else if (res.data.type === 'shops' && res.data.model === 'oto') {
              this.jumpTo('/mall/Underdetail?spid=' + res.data.spid)
            } else if (res.data.type === 'order') {
              this.jumpTo('/mall/off_order_detail?orderId=' + res.data.orderId + '&bdelete=' + res.data.bdelete)
            }
          }
        })
      })
    },
  },
  mounted () {
    // document.removeEventListener("visibilitychange")
    document.addEventListener("visibilitychange", () => { 
        if(document.hidden) {
            // 页面被挂起
        }
        else {
            // 页面呼出
          if (utils.storage.get('userLocation')) {
            this.city = utils.storage.get('userLocation').name
            this.lat = utils.storage.get('userLocation').lat
            this.lon = utils.storage.get('userLocation').lon
            this.$store.commit('setUserLocation', {
              name: utils.storage.get('userLocation').name,
              lat: utils.storage.get('userLocation').lat,
              lon: utils.storage.get('userLocation').lon
            })
              utils.storage.remove('userLocation')
              this.mescrollUp.page.num = 0
              this.upCallback(this.mescrollUp.page, this.mescroll)
          }
        }
    })
    this.getInfo()
    if (this.city) {
      this.mescrollUp.page.num = 0
      this.upCallback(this.mescrollUp.page, this.mescroll)
    } else {
      // 代码版本大于343时使用新本定位方法。
      if (this.$codeVersion >= 343) {
        dsBridge.call('common', {code:6,data:{}},(res)=>{
          if (res) {
            let location = JSON.parse(res)
            if (location.code == 0) {
              this.city = location.street
              this.lon = location.lon
              this.lat = location.lat
              this.$store.commit('setUserLocation', {
                name: location.street, 
                lat: location.lat,
                lon: location.lon
              })
              this.mescrollUp.page.num = 0
              this.upCallback(this.mescrollUp.page, this.mescroll)
            } else {
              this.mescrollUp.page.num = 0
              this.upCallback(this.mescrollUp.page, this.mescroll)
            }
          } else {
            this.mescrollUp.page.num = 0
            this.upCallback(this.mescrollUp.page, this.mescroll)
          }
        })
      } else {
        dsBridge.register('getNameFromCoords', (lon, lat, streetName, ret) => {
          if (ret === 'success') {
            this.isDingwei = true
            this.city = streetName
            this.lon = lon
            this.lat = lat
            this.$store.commit('setUserLocation', {
              name: streetName, 
              lat: lat,
              lon: lon
            })
            this.$nextTick(function () {
              this.mescrollUp.page.num = 0
              this.upCallback(this.mescrollUp.page, this.mescroll)
            })
          } else if (ret === 'fail') {
            // TODO 原生暂无法返回定位失败
            this.isDingwei = false
            this.mescrollUp.page.num = 0
            this.upCallback(this.mescrollUp.page, this.mescroll)
          }
        })
      }
      
    }
  }

  

}
</script>
<style lang="less" scoped>
  .n_home_main{
    .banner {
      position: relative;
      .swiper-pagination{
        bottom: 0.1rem;
        width: 100%;
        .swiper-pagination-bullet{
          width: 0.08rem;
          height: 0.08rem;
          border-radius: 0.04rem;
          margin: 0 .1rem;
          background:rgba(255,255,255,1);
          opacity: 0.6;
          border: none;
        }
        .swiper-pagination-bullet-active{
          background: rgba(255,255,255,1);
          opacity: 1;
          width: 0.26rem;
          height: 0.08rem;
          border-radius: 0.04rem;
        }
      }
    }
  }
  .nav-banner{
    position: relative;
    .swiper-pagination{
      bottom: 0.1rem;
      width: 100%;
      .swiper-pagination-bullet{
        width: 0.3rem;
        height: 0.03rem;
        border-radius: 0.02rem;
        margin: 0 .01rem;
        background:#E4E4E4;
        border: none;
      }
      .swiper-pagination-bullet-active{
        background: #999999;
        width: 0.3rem;
        height: 0.03rem;
        border-radius: 0.02rem;
      }
    }
  }
</style>
<style lang="less" scoped>

  .under-header{
    position: fixed;
    top: 0;
    z-index: 9999;
    right: 0;
    left: 0;
    padding: 0 .3rem;
    height: 44px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    align-items: center;
    .back{
      height: .32rem;
      margin-right: .42rem;
    }
    .middle{
      width: 100%;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left{
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        align-items: center;
        justify-content: normal;
        img{
          width: .26rem;
          margin-right: .1rem;
        }
        .address{
          width: 2.5rem;
          font-size: .28rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color:#fff;
        }
      }
      .right{
        .search{
          width: .35rem;
          margin-right: 0.16rem;
        }
        .scan{
          width: .34rem;
        }
      }
    }
  }
  .mescrollBox {
    width: 100%;
    position: absolute;
    top: 0rem;
    bottom: 0;
    height: auto !important;
    .tabBox{
      width: 100%;
      z-index: 1000;
      background: #fff;
    }
    .fixedTop{
      position: fixed;
      top: .8rem;
      width: 100%;
      height: 1rem;
      line-height: 1rem;
      z-index: 999;
       .vux-tab{
         line-height: .45rem;
       }
    }
    .sticky{
      position: -webkit-sticky;
      position: sticky;
      top: 0;
    }
    .headerBg{
      background: #D92121;
    }
  }
  .flex {
    display: -webkit-box;
    display: box;
    display: flex;
  }
  .flex_1 {
    -webkit-box-flex: 1.0;
    box-flex: 1.0;
    flex: 1;
  }
  .n_home_main{
    .banner{
      background: #fff;
      font-size: 0;
    }
  }
  .nav-banner{
    background: linear-gradient(#FFFFFF, #F7F7F7);
    .banner_list{
      box-sizing: border-box;
      padding: .5rem 0 .2rem;
      .allBox{
        width: 100% !important;
        .allList{
          float: left;
          width: 20%;
          margin-bottom: .3rem;
          text-align: center;
          img{
            width:.82rem;
            height:.82rem;
            p{
              color: #2F2F2F;
              font-size: .24rem;
            }
          }
        }
      }
    }
  }
  .nearImg{
    text-align: center;
    margin: .45rem 0 .3rem 0;
    img{
      height: .37rem;
    }
  }
  .itemBox{
    line-height: 1rem;
    /*padding: .45rem 0 .74rem;*/
  }
  .UnderIndexNew .tab {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    height: 1rem;
    -ms-flex-pack: distribute;
    justify-content: space-around;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    font-size: 0.28rem;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    background: #f7f7f7;
    position: relative;
    font-weight: bold;
    color: #333;
    /*margin: .2rem 0 .1rem;*/
  }
  .UnderIndexNew .tab div.active {
    font-size: 0.3rem; 
    color: #D92121;
    border-bottom: 2px solid #D92121;
  }
</style>
