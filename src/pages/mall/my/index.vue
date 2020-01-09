<template>
    <div id="my">
    <!-- <div id="my" v-show="showInfo"> -->
      <div class="mescrollBox">
        <mescroll-vue ref="mescroll" :down="mescrollDown" @init="mescrollInit">
          <div class="my-head" :style="{paddingTop:statusH + 'rem'}">
            <!-- <div class="box" :style="{background: 'linear-gradient('+$store.state.global.theme.deg+'deg,' +$store.state.global.theme.mainColor+','+$store.state.global.theme.secondColor+')'}"> -->
            <div class="box">
              <div class="box-two">
                <img :src="avatar || userInfo.avatar || '../../static/libs/img/touxiang.png'" alt="">
                <div>
                  <p v-if="mobile">{{mobile}}</p>
                  <p v-else-if="userInfo">{{userInfo.nickname}}</p>
                </div>
              </div>
            </div>
            
            <div class="content">
              <div class="content-item" @click="jumpTo('/mall/shops')">
                <p>{{info.shopsNum ? info.shopsNum : 0}}</p>
                <span>店铺收藏</span>
              </div>
              <div class="content-item" @click="jumpTo('/mall/collection')">
                <p>{{info.goodsNum ? info.goodsNum : 0}}</p>
                <span>商品收藏</span>
              </div>
              <div class="content-item" @click="jumpTo('/mall/footprint')">
                <p>{{info.goodsClick ? info.goodsClick : 0}}</p>
                <span>我的足迹</span>
              </div>
            </div>

            <div class="my-jilu">
              <div class="jilu-item" @click="jumpTo('/mall/balance')" >
                <img src="../../../assets/mall/img/my/yue.png" alt="">
                <p>{{titleInfo.credit2 || '我的余额'}}</p>
              </div>
              <div class="jilu-item"  @click="jumpTo('/mall/myPoints')">
                <img src="../../../assets/mall/img/my/jifen.png" alt="">
                <p>{{titleInfo.credit1 || '我的积分'}}</p>
              </div>
              <div class="jilu-item" @click="jumpTo('/mall/commission')">
                <img src="../../../assets/mall/img/my/yongjin.png" alt="">
                <p>{{titleInfo.credit3 || '我的佣金'}}</p>
              </div>
            </div>
          </div>
          
          
          <template v-for="item of $store.state.global.mallMy">
            <edit-order v-if="item.name === 'edit-order' && orderNum"  :data="item.params" :orderNum="orderNum" :expressList="expressList" ref="editSlide" :key="item.id"></edit-order>
            <component v-else v-bind:is="item.name" :data="item.params" :isDisUser="isDisUser" :disUserInfo="disUserInfo" :isShop="info.isShop" :key="item.id"></component>
          </template>
          
        </mescroll-vue>
      </div>
      <!-- <img src="../../../assets/mall/shouye.png" v-show="$store.state.global.firstNav === '/home'" alt="" id="dragDiv2" ref="dragDiv2" class="homeBack" @click="goNativeHome()"> -->
      
      <img src="../../../assets/mall/shouye.png" id="dragDiv2" class="homeBack" @click="goNativeHome()">
    </div>
</template>

<script>
import './my.less'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { Marquee, MarqueeItem } from 'vux'
import * as apiHttp from '../../../api/index'
import * as utils from '../../../utils'
import MescrollVue from 'mescroll.js/mescroll.vue'

import EditSlide from '../../../components/EditSlide'
import EditNav from '../../../components/EditNav'
import EditNavSlide from '../../../components/EditNavSlide'
import EditHeader from '../../../components/EditHeader'
import EditBlank from '../../../components/EditBlank'
import EditRichText from '../../../components/EditRichText'
import EditText from '../../../components/EditText'
import EditImg from '../../../components/EditImg'
import EditCube from '../../../components/EditCube'
import EditGoodsSlide from '../../../components/EditGoodsSlide'
import EditMallNotice from '../../../components/EditMallNotice'
import EditNavGroup from '../../../components/EditNavGroup'
import EditOrder from '../../../components/EditOrder'
export default {
  name: 'index',
  components: {
    Marquee,
    MarqueeItem,
    swiper,
    swiperSlide,
    MescrollVue,
    EditSlide,
    EditNav,
    EditNavSlide,
    EditHeader,
    EditBlank,
    EditRichText,
    EditImg,
    EditCube,
    EditText,
    EditGoodsSlide,
    EditMallNotice,
    EditNavGroup,
    EditOrder
  },
  data () {
    return {
      swiperOption4: {
        direction: 'vertical',
        autoplay: {
          delay: 3000,
          waitForTransition: true
        }
      },
      data: this.$store.state.user.userInfo,
      info: {},
      userInfo: {},
      shopInfo: {},
      expressList: {},
      finish: false,
      orderNum: '',
      titleInfo: {},
      isDisUser: {},
      disUserInfo: {},
      // showInfo: false,
      mescroll: null,
      mescrollDown: {
        auto: false,
        callback: this.refresh
      },
      device: this.$store.state.global.deviceType,
      version: this.$store.state.global.appVersion,
      avatar: '',
      mobile: '',
      bot: '',
      statusH:''
    }
  },
  created () {
    let size = (document.documentElement.clientWidth / 7.5)
    let saveBottom = (dsBridge.call("receiveParams", 'safeAreaBottom1'))
    if (saveBottom == '123'){
      this.bot = 0
    } else {
      this.bot = saveBottom
    }
    let safeArea = dsBridge.call('receiveParams', 'safeAreaTop1')
    if (safeArea == '123') {
      this.statusH = 0
    } else {
      this.statusH = (safeArea / size)
    }
  },
  mounted () {
    this.redraw()
    this.getMyInfo()
    this.getDesign()
    this.avatar = dsBridge.call("receiveParams", 'avatar')
    this.mobile = dsBridge.call("receiveParams", 'mobile')
  },
  methods: {
    redraw () {
      document.addEventListener("visibilitychange", () => { 
        if(document.hidden) {
          // console.log("页面被挂起")
        }
        else {
          // console.log('页面呼出')
            // 页面呼出
            this.getMyInfo()
        }
      });
    },
    getDesign () {
      this.$http.post('/amoy/app/design', {
        type: 2,
        site_type: 1,
        version: this.version,
        device: (this.device === 'android') ? 1 : 2
      }, true, true).then(res => {
        if (res.code === 0) {
          if (res.data.content) {
            this.$store.commit('setMallMy', JSON.parse(res.data.content))
          }
        }
      })
    },
    eventFun () {
      // alert(123)
      this.$router.go(-1)
    },
    getMyInfo () {
      apiHttp.personInfo().then(res => {
        if (res.code === 0) {
          // this.showInfo = true
          this.info = res.data
          this.userInfo = res.data.userInfo
          this.shopInfo = res.data.shopInfo
          this.expressList = res.data.expressList
          this.orderNum = res.data.orderNum
          if(res.data.titleInfo) {
            this.titleInfo = res.data.titleInfo.alias
          }
          utils.storage.set('titleInfo', this.titleInfo)
          utils.storage.set('userInfo', this.userInfo)
          this.isDisUser = res.data.isDisUser
          this.disUserInfo = res.data.disUserInfo
        }
        // this.$nextTick(() => {
        //   this.mescroll.endSuccess(this.info, false)
        // })
        this.$nextTick(function () {
          // 小房子拖拽
          var div1 = document.getElementById('dragDiv2')
          utils.drag(div1)
        })
      })
    },
    mescrollInit (mescroll) {
      this.mescroll = mescroll
    },
    refresh (done) {
      this.getDesign()
      this.getMyInfo()
      this.$nextTick(() => {
        this.mescroll.endSuccess()// 结束下拉刷新,无参
      })
    },
    handDetail (key) {
      utils.storage.set('orderId', key)
      this.jumpTo('/mall/fixing_order?id=' + key)
    }
  }
}
</script>

<style lang="less">
  @import '../../../assets/mall/style/_Variables';
  #my{
    text-align: center;
    .homeBack{
      position: fixed;
      right: 0.34rem;
      // bottom: 146px;
      bottom: 178px;
      width: 36px;
      height: 36px;
      z-index: 9990;
    }
    .mescrollBox {
      width: 100%;
      position: absolute;
      top: 0;
      bottom: 43px;
      height: auto !important;
      .my-foot{
        margin-top: .2rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: .2rem .3rem;
        background: #ffffff;
        flex-direction: row;
        flex-wrap: wrap;
        div{
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 1.5rem;
          align-items: center;
          width: 25%;
          img{
            height: 0.45rem;
            width: 0.45rem;
          }
          p{
            margin-top: .15rem;
            font-size: @font-nomal;
            color: @font-main-color;
          }
        }
      }
    }
  }

</style>
