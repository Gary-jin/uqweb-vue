// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import plugin from './plugin'
import http from './api/http'
import * as apiHttp from './api/index'
import Vuex from 'vuex'
import Clipboard from 'v-clipboard'
import VueLazyload from 'vue-lazyload'
import {XHeader, ToastPlugin, ConfirmPlugin, LoadingPlugin, DatetimePlugin} from 'vux'
import '../static/libs/iconfont/iconfont.css'
import VueScroller from 'vue-scroller'
import './pages/mall/home/home.less'
import './pages/mall/my/my.less'
import 'swiper/dist/css/swiper.css'
import * as utils from './utils'

Vue.use(Clipboard).use(Vuex).use(ToastPlugin, {position: 'bottom'}).use(ConfirmPlugin).use(DatetimePlugin).use(LoadingPlugin).use(VueScroller)
Vue.prototype.$http = http
Vue.prototype.$apiHttp = apiHttp
Vue.prototype.$utils = utils
Vue.prototype.$img = utils.storage.get('defaultImg') ? utils.storage.get('defaultImg') : require('@/assets/img/bg.png')
Vue.use(VueLazyload, {
  loading: utils.storage.get('defaultImg') ? utils.storage.get('defaultImg') : require('@/assets/img/bg.png'),
  preLoad: 2,
  error: utils.storage.get('errorImg') ? utils.storage.get('errorImg') : require('@/assets/img/error.png'),
  adapter: 1
})
Vue.prototype.$logo = utils.storage.get('appLoginLogo') ? utils.storage.get('appLoginLogo') : ''
http.post('/amoy/app/info', {}, false).then(res => {
  if (res.code === 0) {
    if (res.data.defaultImg.DEFAULT_IMG) {
      utils.storage.set('defaultImg', res.data.defaultImg.DEFAULT_IMG)
    }
    if (res.data.defaultImg.FAILURE_IMG) {
      utils.storage.set('errorImg', res.data.defaultImg.FAILURE_IMG)
    }
    utils.storage.set('appLoginLogo', res.data.appLoginLogo)
    Vue.prototype.$logo = res.data.appLoginLogo
    Vue.prototype.$isCouponPass = res.data.isCouponPass
    Vue.prototype.$isInviteOpen = res.data.isInviteOpen
    Vue.prototype.$up_operator = res.data.up_operator
    Vue.prototype.$img = res.data.defaultImg.DEFAULT_IMG ? res.data.defaultImg.DEFAULT_IMG : require('@/assets/img/bg.png')
    Vue.use(VueLazyload, {
      loading: res.data.defaultImg.DEFAULT_IMG ? res.data.defaultImg.DEFAULT_IMG : require('@/assets/img/bg.png'),
      preLoad: 2,
      error: res.data.defaultImg.FAILURE_IMG ? res.data.defaultImg.FAILURE_IMG : require('@/assets/img/error.png'),
      adapter: 1
    })
  } else {
    Vue.prototype.$img = require('@/assets/img/bg.png')
    Vue.use(VueLazyload, {
      loading: require('@/assets/img/bg.png'),
      preLoad: 2,
      error: require('@/assets/img/error.png'),
      adapter: 1
    })
  }
})

// 右滑相关代码 —————————————start—————————————————
window.canRightSlipBack = true
Vue.prototype.rightSlip = function () {
  if (window.canRightSlipBack) {
  //  TODO 右滑事件
  }
}
Vue.prototype.forbidRightSlip = function () {
  window.canRightSlipBack = false
}
Vue.prototype.allowRightSlip = function () {
  console.log(1)
  setTimeout(() => {
    window.canRightSlipBack = true
  }, 3000)
}
function vueTouch (el, binding, type) {
  var _this = this
  this.obj = el
  this.binding = binding
  this.touchType = type
  this.vueTouches = {
    x: 0,
    y: 0
  }
  this.vueMoves = true
  this.vueLeave = true
  this.vueCallBack = typeof (binding.value) === 'object' ? binding.value.fn : binding.value
  this.obj.addEventListener('touchstart', function (e) {
    _this.start(e)
  }, false)
  this.obj.addEventListener('touchend', function (e) {
    _this.end(e)
  }, false)
  this.obj.addEventListener('touchmove', function (e) {
    _this.move(e)
  }, false)
  this.start = function (e) {
    this.vueMoves = true
    this.vueLeave = true
    this.longTouch = true
    this.vueTouches = {
      x: e.changedTouches[0].pageX,
      y: e.changedTouches[0].pageY
    }
    this.time = setTimeout(function () {
      if (this.vueLeave && this.vueMoves) {
        this.touchType === 'longtap' && this.vueCallBack(this.binding.value, e);
        this.longTouch = false
      };
    }.bind(this), 1000)
  }
  this.end = function (e) {
    var disX = e.changedTouches[0].pageX - this.vueTouches.x
    var disY = e.changedTouches[0].pageY - this.vueTouches.y
    clearTimeout(this.time)
    if (Math.abs(disX) > 30 || Math.abs(disY) > 100) {
      this.touchType === 'swipe' && this.vueCallBack(this.binding.value, e)
      if (Math.abs(disX) > (Math.abs(disY)) * 2) {
        if (disX > 30) {
          this.touchType === 'swiperight' && this.vueCallBack(this.binding.value, e)
        };
        if (disX < -30) {
          this.touchType === 'swipeleft' && this.vueCallBack(this.binding.value, e)
        };
      } else {
        if (disY > 10) {
          this.touchType === 'swipedown' && this.vueCallBack(this.binding.value, e)
        };
        if (disY < -10) {
          this.touchType === 'swipeup' && this.vueCallBack(this.binding.value, e)
        };
      };
    } else {
      if (this.longTouch && this.vueMoves) {
        this.touchType === 'tap' && this.vueCallBack(this.binding.value, e);
        this.vueLeave = false
      };
    };
  }
  this.move = function (e) {
    this.vueMoves = false
  }
};

Vue.directive('swiperight', {
  bind: function (el, binding) {
    new vueTouch(el, binding, 'swiperight')
  }
})
// 右滑相关代码 —————————————end—————————————————

Vue.component('x-header', XHeader)

Vue.use(plugin, {router: router})

/* 商户号 */
let bizId = projectConfig.bizId
/* 代码版本号 */
let codeVersion = projectConfig.codeVersion

Vue.prototype.$codeVersion = codeVersion
// 0隐藏返回按钮 1显示返回按钮
let isShowBackBtn = dsBridge.call('receiveParams', 'isShowBack')
if (isShowBackBtn === '0') {
  Vue.prototype.$isShowBackBtn = false
} else {
  Vue.prototype.$isShowBackBtn = true
}
Vue.prototype.$imgConfig = {}
if (codeVersion >= 340) {
  var commonImgConfig = dsBridge.call('receiveParams', 'imgConfig')
  Vue.prototype.$imgConfig = commonImgConfig
  // 获取主题色
  dsBridge.call('common', {code: 3, data: {}}, (res) => {
    store.commit('setTheme', JSON.parse(res))
  })
}

// 设置基础链接
let baseApiUrl = window.location.href
if (baseApiUrl.indexOf('file://') !== -1) {
  // 当加载的是app本地页面
  Vue.prototype.link = 'http://native.youquanyun.com/api/' + bizId
  // 测试服务
  // Vue.prototype.link = 'http://unative.bangyaosoft.cn/api/' + bizId
} else {
  // 当加载的是服务器页面(因为webview加载本地的html，链接协议是file://，“//d.youqunayun”这种写法会导致接口请求协议也为file://)
  Vue.prototype.link = '//' + window.location.host + '/api/' + bizId
}
Vue.prototype.$color = '#fc3357'
// 控制线下的内容是否开启
let isMallUnderShop = dsBridge.call('receiveParams', 'isMallUnderShop')
Vue.prototype.$isMallUnderShop = isMallUnderShop
if (isMallUnderShop === '1') {
  Vue.prototype.$isMallUnderShop = true
} else if (isMallUnderShop === '0') {
  Vue.prototype.$isMallUnderShop = false
}
// 支付宝支付模块
let aliPay = dsBridge.call('receiveParams', 'aliPay')
Vue.prototype.$aliPay = aliPay
if (aliPay === '1') {
  Vue.prototype.$aliPay = 1
} else if (aliPay === '0') {
  Vue.prototype.$aliPay = 0
}
Vue.prototype.$bizId = bizId
// 控制线上的内容是否开启
let isMallShop = projectConfig.isMallShop
if (isMallShop === '1') {
  Vue.prototype.$isMallShop = true
} else if (isMallShop === '0') {
  Vue.prototype.$isMallShop = false
}

if (projectConfig.pcWebDebug) {
  // 当在pc浏览器调试时
  store.commit('setDeviceType', 'android')
  store.commit('setAppVersion', '1.0.0')
  newVue()
} else {
  // 代码版本>=343时使用新方法获取设备类型和app版本
  if (codeVersion >= 343) {
    // 获取设备类型
    let deviceType = dsBridge.call('receiveParams', 'deviceType')
    store.commit('setDeviceType', deviceType)
    // 获取版本号
    let appVersion = dsBridge.call('receiveParams', 'appVersion')
    store.commit('setAppVersion', appVersion)
    newVue()
  } else {
    // 获取设备类型
    dsBridge.register('deviceType', (type) => {
      store.commit('setDeviceType', type)
      if (store.state.global.deviceType) {
        newVue()
      } else {
        setTimeout(function () {
          newVue()
        }, 500)
      }
    })
    // 获取版本号
    dsBridge.register('getVersion', (num) => {
      store.commit('setAppVersion', num)
    })
  }
}

function newVue(){
  // vueObj 为了方便别的webview调用此vue对象
  if (!window.vueObj) {
    window.vueObj = new Vue({
      el: '#app',
      router,
      store,
      components: { App },
      template: '<App/>'
    })
  }
}