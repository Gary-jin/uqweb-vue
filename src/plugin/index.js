import {formatDate} from './data'
import * as utils from '../utils'

export default {
  install (Vue, options) {
    Vue.prototype.jumpLink = function (link) {
      if (typeof link === 'string') {
        link = JSON.parse(link)
      }
      if (link) {
        if (link.type === 0 || link.type === '0') {
          // type:0 vue内打开指定路由
          if (link.url == '/videoHome' || link.url == '/videoList') {
            if (this.$bizId == 4) {
              // 这个商户进老的共享影视,因为他有专属定制开发
              link.url = '/videoList'
            } else {
              // 其余商户进新的共享影视
              link.url = '/videoHome'
            }
          }

          if(link.url == '/home') {
            // 当配置的是淘客首页，就返回淘客首页
            dsBridge.call('goHome')
            return;
          }

          // 判断要跳转的页面是否包含在底部菜单内。如果是，就是用vue路由打开，如果不是，就是用原生打开新页面方法
          let mallFooterData = utils.storage.get('mallFooter')
          let mallFooterUrls = []
          for (let i in mallFooterData.items) {
            mallFooterUrls.push(mallFooterData.items[i].link.url)
          }
          if (mallFooterUrls.indexOf(link.url) != -1) {
            options.router.push(link.url)
          } else {
            Vue.prototype.jumpTo(link.url)
          }
        } else if (link.type === 1 || link.type === '1') {
          dsBridge.call('open', {url: link.url})
        } else if (link.type === 2 || link.type === '2') {
          // 通过阿里百川打开一个链接
          dsBridge.call('openNative', {type: 2, url: link.url})
        } else if (link.type === 3 || link.type === '3') {
          // 打开购物车
          dsBridge.call('openNative', {type: 3})
        } else if (link.type === 4 || link.type === '4') {
          // 当要进入抖券时
          dsBridge.call('openNative', {type: 4})
        } else if (link.type == 5) {
          // 当要进入订单红包时
          dsBridge.call('openNative', {type: 5})
        } else if (link.type == 6) {
          // 当要进入信用卡时
          dsBridge.call('openNative', {type: 6})
        } else if (link.type == 12) {
          // type=12,传过来的是一个内部H5的绝对地址
          dsBridge.call('open', {url: link.url, type: 'web'})
        } else if (link.type == 100) {
          // 当要拼团砍价
          dsBridge.call('open', {url: window.location.origin + link.url, type: 'web'})
          // dsBridge.call('open', {url: 'http://activity.bangyaosoft.cn' + link.url, type: 'web'})         
        }
      }
    }
    /*
    * 当跳转时调用此方法直接传路径
    * */
    Vue.prototype.jumpTo = function (path) {
      if (projectConfig.pcWebDebug) { // 当开启了pc调试
        options.router.push(path)
      } else { // 当未开启pc调试
        dsBridge.call('openWin', path)
      }
    }
    // vue中的跳转方法
    Vue.prototype.vueJumpTo = function (path) {
      options.router.push(path)
    }
    /*
    * 当跳转时要传参数时调用此方法
    * */
    Vue.prototype.jumpWithQuery = function (target) {
      if (target.path) {
        var query = target.query
        target = target.path + '?'
        for (let i in query) {
          target += (i + '=' + query[i] + '&')
        }
        target.substring(0, target.length - 1)
        dsBridge.call('openWin', target)
      }
    }
    /*
    *  关闭当前页，打开别的页面
    * */
    Vue.prototype.replaceToNative = function (path) {
      dsBridge.call('closeWin')
      dsBridge.call('openWin', path)
    }
    /*
    * 返回原生首页
    * */
    Vue.prototype.goNativeHome = function (path) {
      dsBridge.call('goHome')
    }
    Vue.prototype.noPastTo = function (path) {
      options.router.replace(path)
    }
    // 原生方法
    Vue.prototype.goBack = function (path) {
      // window.history.length > 1 ? options.router.go(-1) : options.router.push('/')
      dsBridge.call('closeWin')
    }
    // vue方法
    Vue.prototype.vueGoBack = function (path) {
      window.history.length > 1 ? options.router.go(-1) : options.router.push('/')
    }
    Vue.prototype.hide = function () {
      this.$vux.toast.show({type: 'cancel', text: '功能即将开放，敬请期待'})
    }
    Vue.prototype.formatDate = function (time) {
      time = time * 1000
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
    Vue.prototype.jumpTos = function (item) {
      switch (item.types) {
        case 'mallHomeDetail':
          if (item.goodsId !== '0' && item.goodsId) {
            // Vue.prototype.jumpTo('/mall/homeDetail?title=' + item.goodsId)
            dsBridge.call("open", {url: window.location.origin + '/uqWeb/html/mall/mallDetails.html?id=' + item.goodsId, type: 'web'})
          }
          break
        case 'mallSeller':
          if (item.shopsId !== '0' && item.shopsId) {
            // Vue.prototype.jumpTo('/mall/seller?spid=' + item.shopsId)
            dsBridge.call("open", {url: window.location.origin + '/uqWeb/html/mall/mallShop.html?spid=' + item.shopsId, type: 'web'})
          }
          break
        case 'mallProductList':
          if (item.goodsCid !== '0' && item.goodsCid) {
            Vue.prototype.jumpTo('/mall/productList?id=' + item.goodsCid)
          }
          break
        case 'mallCategory':
          if (item.shopsCid !== '0' && item.shopsCid) {
            Vue.prototype.jumpTo('/mall/category?type=' + item.shopsCid + '&title=' + item.title)
          }
          break
        case 'mallSecthList':
          if (item.shopsCid !== '0' && item.shopsCid) {
            Vue.prototype.jumpTo('/mall/secthList?shopCid=' + item.shopsCid + '&title=' + item.title)
          }
          break
        case 'mallUnderdetail':
          if (item.shopsId !== '0' && item.shopsId) {
            Vue.prototype.jumpTo('/mall/Underdetail?spid=' + item.shopsId)
          }
          break
        case 'mallCart':
          Vue.prototype.jumpTo('/mall/cart')
          break
        case 'mallShopProductList':
          Vue.prototype.jumpTo('/mall/shopProductList')
          break
        case 'httpUrl':
          dsBridge.call("open", {url: item.link})
          break
        case 'noTitleHttpUrl':
          dsBridge.call("open", {url: item.link, type: 'web'})
          break
        default:
          Vue.prototype.jumpTo(item.types)
      }
    }
  }
}
