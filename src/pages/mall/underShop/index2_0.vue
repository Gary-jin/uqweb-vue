<template>
  <div id="underShop" class="underShopHome">
    <div class="swiperBg" :style="{paddingTop: statusH + 'px',background: swiperBg}">
      <img src="../../../assets/img/home/mallHomeBjxia.png" alt="">
      <div class=""></div>
    </div>
    <div class="mall-home-scroll">
      <div class="mescrollBox"  :style="{top: statusH + 44 + 'px'}">
        <!-- 自定义头部组件position=fixed,不能放在mescroll中，因为mescroll的overflow-y=auto,自定义头部组件在苹果设备上会超出隐藏，所以要放在外面 -->
        <edit-oto-header v-if="$store.state.global.underHeader" :styleData="$store.state.global.underHeader.params" :statusH="statusH" :city="city" ></edit-oto-header>
        <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
          <div class="home_main" id="home_main" v-if="mescroll">
            <template v-for="item of $store.state.global.underContent">
              <edit-mall-notice v-if="item.name === 'edit-mall-notice' && newList"  :data="item.params" :newList="newList" ref="editSlide" :key="item.id"></edit-mall-notice>
              <edit-slide v-else-if="item.name === 'edit-slide'"  :data="item.params" ref="editSlide" @swiperChange="swiperChange" :key="item.id" ></edit-slide>
              <edit-hot-sale v-else-if="item.name === 'edit-hot-sale'"  :obj="obj" :key="item.id" ></edit-hot-sale>
              <edit-oto-shop-list v-else-if="item.name === 'edit-oto-shop-list'" :key="item.id" ref="editOtoShopList" :mescroll="mescroll" :lon="lon" :lat="lat" :device="device"></edit-oto-shop-list>
              <edit-cate-goods v-else-if="item.name === 'edit-cate-goods'" :scTop="scTop" :list="shopList" :flag="flag" :fiexdTop="fiexdTop" @handleId="getCid" :key="item.id"></edit-cate-goods>
              <component v-else-if="['edit-mall-header','edit-mall-hot-search','edit-goods-list','edit-oto-header'].indexOf(item.name) == -1" v-bind:is="item.name" :data="item.params" :key="item.id"></component>
            </template>
          </div>
        </mescroll-vue>
      </div>
    </div>
    <div class="tab_main">
    </div>
    <loading v-show="load"></loading>
  </div>
</template>

<script>
import 'font-awesome/css/font-awesome.min.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import {Marquee, MarqueeItem} from 'vux'
import list from '../../../components/list'
import * as apiHttp from '../../../api/index'
import loading from '../../../components/loadingLoad'
import MescrollVue from 'mescroll.js/mescroll.vue'
import * as utils from '../../../utils'

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
import EditHotSale from '../../../components/EditHotSale'
import EditCateGoods from '../../../components/EditCateGoods' // 商城新分类列表组件
import EditOtoShopList from '../../../components/EditOtoShopList' // 小店附近商家列表组件
import EditOtoHeader from '../../../components/EditOtoHeader' // 小店头部组件
export default {
  name: 'index',
  data () {
    return {
      flag: false,
      fiexdTop: '', // 分类组件定位高度
      num: '', // 分类组件的页数
      scTop: '', // 滚动条高度
      cid: '', // 商品分类ID
      device: this.$store.state.global.deviceType,
      statusH: 0,
      swiperBg: '',
      load: false,
      scrollTopH: 0,
      swiperOption3: {
        slidesPerView: 3.5,
        spaceBetween: 30,
        freeMode: true
      },
      loading: false,
      finish: false,
      search: [],
      shopList: [],
      shopListH: '',
      bannerImg: [],
      newList: [],
      diySlide: [],
      navInfo: [],
      obj: {},
      logo: null,
      mescroll: null,
      mescrollDown: {
        use:false
      },
      mescrollUp: {
        onScroll: this.handleScroll,
        callback: this.upCallback,
        auto: false,
        page: {
          num: 1,
          size:5
        },
        htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
        noMoreSize: 1,
        toTop: {
          src: require('@/assets/mall/top.png'),
          offset: 1000
        },
        empty: {
          warpId: 'oto-shop-list',
          icon: '../../../../static/img/auth/kong.png',
          tip: '暂无相关数据~'
        },
        lazyLoad: {
          use: true
        }
      },
      dataList: [],
      lastScrollTop: 0, // 路由切换时滚动条的位置
      lastBounce: null, // 路由切换时是否禁止ios回弹
      isCityShow: false,
      city: this.$store.state.global.userLocation.name,
      lon: this.$store.state.global.userLocation.lon,
      lat: this.$store.state.global.userLocation.lat,
      currentCity: null
    }
  },
  components: {
    swiper,
    swiperSlide,
    list,
    Marquee,
    MarqueeItem,
    loading,
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
    EditHotSale,
    EditCateGoods,
    EditOtoShopList,
    EditOtoHeader
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
    next()
  },
  // 获取设备头部高度
  created () {
    let size = (document.documentElement.clientWidth / 7.5)
    let safeArea = dsBridge.call('receiveParams', 'safeAreaTop1')
    if (safeArea == '123') {
      this.statusH = 0
    } else {
      this.statusH = +safeArea
    }
    this.shopListH = document.body.clientHeight - 110
  },
  mounted () {
    this.doNativeRegister()
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
                utils.storage.set('userLocation', {})
                this.getUnderMallDesign()
            }
        }
    })
  },
  methods: {
    // 初始化调用原生接口
    doNativeRegister(){
      /**表示是否已有定位回调 */
      if (!this.city) {
        // 刷新页面不会触发注册的getNameFromCoords,创建新的webview的时候才会触发
        // 代码版本>=343使用新的获取定位的方法

        if (this.$codeVersion >= 343) {
          try {
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
                  // 当获取到定位信息时立刻获取下商家列表数据，解决因自定义装修的本地存储逻辑导致刚进小店页面获取列表时没有定位信息的问题。
                  this.$nextTick(()=>{
                    if(document.getElementsByClassName('EditOtoShopList')[0]) {
                      this.$refs.editOtoShopList[0].getList(this.mescroll.optUp.page, this.mescroll);
                    }
                  })
                  this.getUnderMallDesign()
                } else {
                  this.getUnderMallDesign()
                }
              } else {
                this.getUnderMallDesign()
              }
            })
          } catch (error) {
            this.getUnderMallDesign()
          }
        } else {
          dsBridge.register('getNameFromCoords', (lon, lat, streetName, ret) => {
            if (ret === 'success') { // 定位成功
              this.city = streetName
              this.lon = lon
              this.lat = lat
              this.$store.commit('setUserLocation', {
                name: streetName, 
                lat: lat,
                lon: lon
              })
            } else if (ret == 'fail') { // 定位失败

            }
          })
           setTimeout(() => {
            this.getUnderMallDesign()
          }, 100);
        }
      } else {
        this.getUnderMallDesign()
      }
    },
    // 获取分类参数cid
    getCid (data) {
      this.cid = data
      this.reset()
    },
    // mescroll的滚动事件回调
    handleScroll (mescroll, y, isUp) {
      let EditOtoShopListDom = document.getElementsByClassName('EditOtoShopList')[0];
      if (EditOtoShopListDom) {  // 当存在小店商家列表组件时
        let tabBoxDom = document.getElementsByClassName('tabBox')[0];
        if (y >= EditOtoShopListDom.offsetTop && !tabBoxDom.classList.contains('fixedTop')) {
          tabBoxDom.className = 'tabBox fixedTop'
          tabBoxDom.style.top = window.getComputedStyle(document.getElementsByClassName('mescrollBox')[0]).top;
          EditOtoShopListDom.style.paddingTop = tabBoxDom.offsetHeight+'px';
        } else if (y < EditOtoShopListDom.offsetTop) {
          tabBoxDom.className = 'tabBox'
          EditOtoShopListDom.style.paddingTop = 0;
        }
      }
    },
    reset () {
      this.mescrollUp.htmlLoading = ''
      this.flag = false
      this.shopList = []
      this.mescrollUp.page.num = 1
      this.mescroll.resetUpScroll()
    },
    swiperChange (color) {
      this.swiperBg = color
    },
    getDesign () {
      // 需要先获取商城首页装修模板，保存底部菜单
      this.$http.post('/amoy/app/design', {
        type: 1,
        site_type: 1,
        version: this.$store.state.global.appVersion,
        device: (this.device === 'android') ? 1 : 2
      }, true, false).then(res => {
        if (res.code === 0) {
          // 保存底部菜单
          if (res.data.footer) {
            this.$store.commit('setMallFooter', JSON.parse(res.data.footer))
          }
          // this.upCallback(this.mescrollUp.page, this.mescroll)
        }
      })
    },
    /**获取小店自定义装修数据 */
    getUnderMallDesign(){
      this.$http.post('/amoy/app/design', {
        type: 1,
        site_type: 2,
        version: this.$store.state.global.appVersion,
        device: (this.device === 'android') ? 1 : 2
      }, true, false).then(res => {
        if (res.code === 0) {
          if (res.data.content) {
            this.$store.commit('setUnderContent', JSON.parse(res.data.content))
          }
          for(let i = 0, len = this.$store.state.global.underContent.length;i<len;i++) {
            if (this.$store.state.global.underContent[i].name == "edit-oto-header") {
              this.$store.commit('setUnderHeader', this.$store.state.global.underContent[i])
            }
          }
          this.getDesign()
        }
      })
    },
    mescrollInit (mescroll) {
      this.mescroll = mescroll
    },
    // 上拉加载回调函数
    upCallback (page, mescroll) {
      if (this.$refs.editOtoShopList[0]) {
        this.$refs.editOtoShopList[0].getList(page, mescroll);
      } else {
        setTimeout(() => {
          this.upCallback(page, mescroll)
        }, 300);
      }
    }
  }
}
</script>

<style lang="less" scoped>
  #underShop{
    height: 100%;
    .homeBack{
      position: fixed;
      right: 0.34rem;
      bottom: 146px;
      width: 36px;
      height: 36px;
      z-index: 9990;
    }
  }
  .mall-home-scroll{
    .mescrollBox{
      z-index: 800;
      width: 100%;
      position: absolute;
      top: 1.8rem;
      bottom: 54px;
      height: auto !important;
      background: rgba(255,255,255,0);
      .swiper-pagination{
        bottom: 10px;
        width: 100%;
        margin:0 auto;
        left: 0;
      }
    }
  }
</style>
