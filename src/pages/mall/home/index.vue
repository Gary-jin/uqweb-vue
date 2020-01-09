<template>
  <div id="home" class="homeMall">
    <div class="swiperBg" :style="{paddingTop: statusH + 'rem',background: swiperBg}">
      <img src="../../../assets/img/home/mallHomeBjxia.png" alt="">
      <div class=""></div>
    </div>
    <div ref="seach_main" class="seach_main" v-if="$store.state.global.mallSearch" :style="{paddingTop: (statusH + 0.2) + 'rem',background: 'linear-gradient('+$store.state.global.mallSearch.bgDeg+'deg,' +$store.state.global.mallSearch.bgColor+','+$store.state.global.mallSearch.bgSecondColor+')'}">

      <template v-for="item of $store.state.global.mallContent">
        <div class="home_seach" :key="item.id" v-if="item.name === 'edit-mall-header'">
          <div class="home_seach_left backBox">
            <!--<img src="../../../assets/mall/img/home/person.png" alt="">-->
            <div style="width: 100%; height: 100%;display: flex;align-items: center;justify-content: center"  @click="jumpLink($store.state.global.mallSearch.leftLink)" v-if="$store.state.global.mallSearch.backIcon">
              <img :src="$store.state.global.mallSearch.backIcon" alt="">
            </div>
          </div>
          <div class="home_seach_input" @click="jumpTo('/mall/searchStore')">
            <div class="input_box" :style="{background:$store.state.global.mallSearch.searchBgColor}">
              <img :src="$store.state.global.mallSearch.searchIcon" alt="">
              <p>{{$store.state.global.mallSearch.searchPlaceholder}}</p>
              <img style="position: absolute;right: 1.2rem;color: #b6b6b6;" :src="$store.state.global.mallSearch.leftIcon" alt=""  @click.stop="handleQrcode()">
              <!--<i style="position: absolute;right: 1.2rem;color: #b6b6b6;" class="iconfont icon-saoyisao" @click.stop="handleQrcode()"></i>-->
            </div>
          </div>
          <!-- 去原生消息页面 -->
          <!-- <div class="home_seach_right" @click="jumpLink($store.state.global.mallSearch.rightLink)"> -->
          <div class="home_seach_right" @click="toNew">          
            <img :src="$store.state.global.mallSearch.rightIcon" alt="">
          </div>
        </div>
        <div class="linchpin" :key="item.id" v-if="item.name === 'edit-mall-hot-search'" :style="{background: linchpinBgColor}">
          <div class="linchpin_main">
            <div class="linchpin_left">
              热搜：
            </div>
            <div class="linchpin_list">
              <div v-for="(item,index) in search" :key="index" v-if= "index < 5" @click="handSearch(item.keyword)" :style="{background: $store.state.global.mallHot && $store.state.global.mallHot.kwColor,color: $store.state.global.mallHot && $store.state.global.mallHot.color}">{{item.keyword}}</div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="mall-home-scroll">
      <div class="mescrollBox"  :style="{top: $store.state.global.mallHot ? (statusH + 1.8) + 'rem' : (statusH + 1) + 'rem', marginBottom: bot +'px'}">
        <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
          <div class="home_main">
            <template v-for="item of $store.state.global.mallContent">
              <edit-mall-notice v-if="item.name === 'edit-mall-notice' && newList"  :data="item.params" :newList="newList" ref="editSlide" :key="item.id"></edit-mall-notice>
              <edit-slide v-else-if="item.name === 'edit-slide'"  :data="item.params" ref="editSlide" @swiperChange="swiperChange" :key="item.id" ></edit-slide>
              <edit-hot-sale v-else-if="item.name === 'edit-hot-sale'"  :obj="obj" :key="item.id" ></edit-hot-sale>
              <edit-cate-goods v-else-if="item.name === 'edit-cate-goods'" :scTop="scTop" :list="shopList" :flag="flag" :fiexdTop="fiexdTop" @handleId="getCid" :key="item.id"></edit-cate-goods>
              <component v-else-if="item.name !== 'edit-mall-header' && item.name !== 'edit-mall-hot-search' && item.name !== 'edit-goods-list'" v-bind:is="item.name" :data="item.params" :key="item.id"></component>
            </template>
          </div>
        </mescroll-vue>
      </div>
    </div>
    <div class="tab_main">
    </div>
    <!-- <img src="../../../assets/mall/shouye.png" alt="" v-show="$store.state.global.firstNav === '/home'" class="homeBack" @click="goNativeHome()"> -->
    <img src="../../../assets/mall/shouye.png" alt="" class="homeBack" id="dragDiv" @click="goNativeHome()">    
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
      version: this.$store.state.global.appVersion,
      statusH: 0,
      swiperBg: '',
      load: false,
      scrollTopH: 0,
      swiperOption3: {
        slidesPerView: 3.5,
        spaceBetween: 30,
        freeMode: true
      },
      page: 1,
      loading: false,
      finish: false,
      search: [],
      shopList: [],
      bannerImg: [],
      newList: [],
      diySlide: [],
      navInfo: [],
      obj: {},
      logo: null,
      bot: '',
      mescroll: null,
      mescrollDown: {
        auto: false,
        callback: this.refresh,
        textInOffset: '下拉刷新', // 下拉的距离在offset范围内的提示文本
        textOutOffset: '松开刷新', // 下拉的距离大于offset范围的提示文本
        textLoading: '正在刷新',
        // htmlContent: '<p class="downwarp-progress downwarp-loading"></p><p class="downwarp-tip"></p>'
      },
      mescrollUp: {
        callback: this.upCallback,
        page: {
          num: 0
        },
        htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
        noMoreSize: 3,
        toTop: {
          src: require('../../../assets/mall/top.png'),
          offset: 1000
        },
        empty: {
          warpId: '',
          icon: '',
          tip: '暂无相关数据~'
        },
        
        lazyLoad: {
            use: true, // 是否开启懒加载,默认false
            attr: 'imgurl', // 网络地址的属性名 (图片加载成功会移除该属性): <img imgurl='网络图  src='占位图''/>
            showClass: 'mescroll-lazy-in', // 图片加载成功的显示动画: 渐变显示,参见mescroll.css
            //delay: 500, // 列表滚动的过程中每500ms检查一次图片是否在可视区域,如果在可视区域则加载图片
            //offset: 200 // 超出可视区域200px的图片仍可触发懒加载,目的是提前加载部分图片
        }
      },
      dataList: [],
      lastScrollTop: 0, // 路由切换时滚动条的位置
      lastBounce: null // 路由切换时是否禁止ios回弹
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
    EditCateGoods
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
  mounted () {
    this.getIndex()
    if (projectConfig.pcWebDebug) {
      // 开启pc调试时
      this.device = 'android'
      this.version = '1.0.0'
    }
    this.getDesign()

    window.addEventListener('scroll', this.handleScroll, true)

    // home小房子拖拽
    // var div1 = document.getElementsByClassName("homeBack")[0]; //获取元素
    var div1 = document.getElementById('dragDiv')
    utils.drag(div1)
  },
  computed: {
    indexHome: function () {
      return this.$store.state.user.indexHome
    },
    headBoxH () {
      let h
      if (dsBridge) {
        h = this.statusH
        if (this.$store.state.global.mallContent) {
          for (let i = 0; i < this.$store.state.global.mallContent.length; i++) {
            if (this.$store.state.global.mallContent[i].name === 'edit-mall-header') {
              h += 1
            } else if (this.$store.state.global.mallContent[i].name === 'edit-mall-hot-search') {
              h += 0.8
            }
          }
        } else {
          h = this.statusH + 0.88 + 0.78
        }
      } else {
        h = 2
      }
      return h
    },
    /*
    * seach_main类的背景色
    * */
    seachMainBgColor () {
      if (this.headBoxH > this.statusH && this.$store.state.global.mallSearch) {
        return 'linear-gradient(' + this.$store.state.global.mallSearch.bgDeg + 'deg,' + this.$store.state.global.mallSearch.bgColor + ',' + this.$store.state.global.mallSearch.bgSecondColor + ')'
      } else {
        return '#fff'
      }
    },
    /*
    * linchpin类的背景色
    * */
    linchpinBgColor () {
      if (this.$store.state.global.mallHot) {
        return 'linear-gradient(' + this.$store.state.global.mallHot.bgDeg + 'deg,' + this.$store.state.global.mallHot.bgColor + ',' + this.$store.state.global.mallHot.bgSecondColor + ')'
      } else {
        return 'none'
      }
    }
  },
  // 获取设备头部高度
  created () {
    let size = (document.documentElement.clientWidth / 7.5)
    let safeArea = dsBridge.call('receiveParams', 'safeAreaTop1')
    if (safeArea == '123') {
      this.statusH = 0
    } else {
      this.statusH = (safeArea / size)
    }
    //ios底部安全区域
    let saveBottom = (dsBridge.call("receiveParams", 'safeAreaBottom1'))
    if (saveBottom == '123'){
      this.bot = 0
    } else {
      this.bot = saveBottom
    }
  },
  methods: {
    toNew(){
      if (this.$codeVersion >= 350) {
        dsBridge.call("openWin",'/news')
      } else {
        // console.log(this.$store.state.global.mallSearch.rightLink)
        this.jumpLink(this.$store.state.global.mallSearch.rightLink)
      }
    },
    // 获取分类参数cid
    getCid (data) {
      this.cid = data
      this.reset()
      // this.mescroll.setScrollTop(top)
    },
    reset () {
      this.mescrollUp.htmlLoading = ''
      this.flag = false
      this.shopList = []
      this.mescrollUp.page.num = 1
      this.mescroll.resetUpScroll()
    },
    // 监听滚动条高度，tab栏固定
    handleScroll () {
      let mescrollBox = document.getElementsByClassName('mescrollBox')[0]
      if (mescrollBox) {
        let top = this.mescroll.getScrollTop()
        this.scTop = top
        let mescrollBoxTop = mescrollBox.style.top
        this.fiexdTop = mescrollBoxTop
      }
    },
    swiperChange (color) {
      this.swiperBg = color
    },
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
          // if (res.data.theme) {
          //   store.commit('setTheme', JSON.parse(res.data.theme))
          // }
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
    getIndex () {
      this.load = true
      apiHttp.indexHome().then(response => {
        if (response.code === 0) {
          this.load = false
          this.obj = response.msg
          this.search = response.msg.search
          // this.bannerImg = response.msg.slide
          this.newList = response.msg.article
          // this.diySlide = response.msg.diySlideInfo
          // this.navInfo = response.msg.navInfo
          this.logo = response.msg.article[0].logo
        } else {
          this.load = false
        }
        this.$nextTick(() => {
          this.mescroll.endSuccess(this.obj, false)
        })
      }).catch((e) => {
        this.load = false
      })
    },
    handSearch (item) {
      this.jumpTo('/mall/productList?keyword=' + item)
      // this.$router.push({
      //   name: 'mallProductList',
      //   query: {keyword: item}
      // })
    },
    handDetailNew (item) {
      this.jumpTo('/mall/articleInfo?query=' + item)
      // this.$router.push({
      //   name: 'mallArticleInfo',
      //   query: item
      // })
    },
    mescrollInit (mescroll) {
      this.mescroll = mescroll
    },
    upCallback (page, mescroll) {
      apiHttp.indexList(this.cid, page.num).then(res => {
        if (res.code === 0) {
          let arr = res.data.list === '' ? [] : res.data.list
          if (page.num === 1) this.shopList = []
          this.shopList = this.shopList.concat(arr)
          if (this.shopList.length === 0){
            this.flag = true
          }
          this.$nextTick(() => {
            mescroll.endSuccess(res.data.list.length, true)
          })
        }
      }).catch((e) => {
        mescroll.endErr()
      })
    },

    // 测试EditCateGoods组件
    // upCallback (page, mescroll) {

    //   this.page = page.num
    // },
    refresh: function () {
      this.finish = false
      this.mescrollUp.page.num = 1
      this.upCallback(this.mescrollUp.page, this.mescroll)
    },
    // 扫码
    handleQrcode () {
      dsBridge.call("FNScanner", (ret) => {
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
        //dsBridge.call("toast",{msg: ret})
      })
    }
  }
}
</script>

<style lang="less" scoped>
  #home{
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
  #home{
    height: 100%;
    text-align: center;
  }
  .my-bullet{
    border-radius: .1rem;
    width: .1rem;
    height: .1rem;
    margin: .05rem;
    display:inline-block;
    background:rgba(0,0,0,0.20);
    display: inline-block;
  }
  .my-bullet-active{
    display: inline-block;
    background:#fc3357;
    width: .2rem
  }
  .homeMall ._v-container{
    margin-top: 1.7rem;
    height: calc(100% - 1.7rem) !important;
  }
  .quick-menu{
    bottom: 1.8rem !important;
    right: .3rem !important;
    transform: rotate(150deg) !important;
  }
  .quick-menu>.menu{
    background: rgba(252,51,87,.8) !important;
    height: .8rem !important;
    width: .8rem !important;
    box-shadow: none !important;
  }
  .quick-menu .sub-menu:first-child{
    left: -128px !important;
  }
  .quick-menu .sub-menu:nth-child(2){
    top: -55px !important;
    left: -100px !important;
  }
  .quick-menu .sub-menu:nth-child(3){
    top: -95px !important;
    left: -60px !important;
  }
  .quick-menu .sub-menu:nth-child(4){
    top: -120px !important;
    left: -6px !important;
  }
  .quick-menu>.menu .core-menu{
    height: .8rem !important;
    width: .8rem !important;
    transform: rotate(30deg) !important;
  }
  .quick-menu>.menu .core-menu .bar, .quick-menu>.menu .core-menu .bar:after, .quick-menu>.menu .core-menu .bar:before{
    width: .38rem !important;
    height: 2px !important;
  }
  .quick-menu>.menu .core-menu .bar{
    left: 11px !important;
    top: 36% !important;
  }
  .quick-menu.active .menu .bar{
    margin-left: 1px !important;
    top:50% !important;
    transform: rotate(106deg) !important;
  }
  .quick-menu>.sub-menu>a{
    background: rgba(252,51,87,.8) !important;
    display: flex !important;
    align-items: center;
    justify-content: center;
  }
  .quick-menu .sub-menu{
    height: .8rem !important;
    width: .8rem !important;
  }
  .quick-menu .sub-menu a i{
    font-size: 20px !important;
    margin-top: 0 !important;
  }
  .menu-animate{
    animation:none !important;
  }

</style>
