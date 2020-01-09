import Vue from 'vue'
import axios from 'axios'
import store from '../store'
import qs from 'qs'
import * as utils from '../utils'

axios.defaults.timeout = 10000
let baseApiUrl = window.location.href
let bizId = projectConfig.bizId
var codeVersion = projectConfig.codeVersion
if (baseApiUrl.indexOf('192.168') !== -1 || baseApiUrl.indexOf('172.16') !== -1 || baseApiUrl.indexOf('localhost') !== -1) {
  // 如果是测试环境时
  baseApiUrl = '/api/' + bizId
} else {
  // 如果是非测试环境
  if (baseApiUrl.indexOf('file://') >= 0) {
    // 当加载的是app本地页面
    baseApiUrl = 'http://native.youquanyun.com/api/' + bizId
    // 测试服务
    // baseApiUrl = 'http://unative.bangyaosoft.cn/api/' + bizId
  } else {
    // 当加载的是服务器页面(因为webview加载本地的html，链接协议是file://，“//d.youqunayun”这种写法会导致接口请求协议也为file://)
    baseApiUrl = '//' + window.location.host + '/api/' + bizId
  }
}
axios.defaults.baseURL = baseApiUrl

// 设置默认请求头
axios.defaults.headers = {
  'X-Requested-With': 'XMLHttpRequest',
  'Content-type': 'application/x-www-form-urlencoded'
}
// 序列化参数
axios.defaults.transformRequest = (data) => {
  data = qs.stringify(data)
  return data
}
let cancel = {}
let promiseArr = {}
const CancelToken = axios.CancelToken

// http request 拦截器1
axios.interceptors.request.use(
  config => {
    // 发起请求时，取消掉当前正在进行的相同请求（包括接口地址，post使用的data传参，get使用的params传参）
    let key = config.baseURL+config.url+'&'+JSON.stringify(config.data)+'&'+JSON.stringify(config.params);
    if (promiseArr[key]) {
      promiseArr[key]({errorType:'cancel',msg:'操作取消'+config.baseURL+config.url})
      delete promiseArr[key]
    }
    // 数组中保存本次请求的CancelToken
    promiseArr[key] = cancel
    // 在config中保存存到数组中的key，供接口响应处理时使用
    config.cancelTokenKey = key;
    const token = utils.storage.get('token')
    const codeVersion = projectConfig.codeVersion
    if (token) {
      config.headers.token = token
    }
    if (codeVersion) {
      config.headers.codeVersion = codeVersion
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    let key = response.config.cancelTokenKey
    promiseArr[key] && delete promiseArr[key]
    response = response.data
    if (response.code === 403) {
      dsBridge.call('toLogin')
    } else if (response.code === 412){

      Vue.$vux.toast.text('您还未绑定手机号，先去绑定吧！')
      setTimeout(function () {
        dsBridge.call("openWin", '/judgemobile')
      }, 2000)
    } else {
      return response
    }
  },
  error => {
    if (error.response) {
      console.log(error)
      switch (error.response.status) {
        case 403:
          // // 403 清除token信息并跳转到登录页面
          // store.commit('logout')
          // // 只有在当前路由不是登录页面才跳转
          // router.currentRoute.name !== 'wechatLogin' && router.replace({
          //   path: 'wechatLogin'
          // })
          dsBridge.call("toLogin")
          break
        default:
          error.message = `连接错误：${error.response.status}`
      }
    }
    return Promise.reject(error)
  }
)

export default {
  // get请求
  get (url, param, loading) {
    return new Promise((resolve, reject) => {
      if (loading) {
        store.commit('show')
      }
      if (!param) {
        param = {}
      }
      axios({
        method: 'get',
        url,
        data:'',
        params: param,
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        if (loading) {
          store.commit('hide')
        }
        if (res.code === 0) {
          resolve(res)
        } else {
          Vue.$vux.toast.text(res.msg)
        }
      }).catch(error => {
        if (Vue.$vux.loading) {
          Vue.$vux.loading.hide()
        }
        console.log(error)
        if(error.message.errorType!='cancel'){
          Vue.$vux.toast.text(error.message, 'top')
        }
      })
    })
  },
  // post请求
  post (url, param, loading, show) {
    return new Promise((resolve, reject) => {
      if (!param || JSON.stringify(param) == "{}") {  
        // 当传参为空或者为空对象时，都处理为空字符串，为了方便CancelToken接口取消功能。
        param = ''
      }
      // 显示loading
      if (loading && codeVersion >= 310) {
        dsBridge.call('common',{code:2,data:{type:1}},(ret) => {})
      }
      axios({
        method: 'post',
        url,
        data: param,
        params:'',
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        if (loading && codeVersion >= 310) {
          dsBridge.call('common',{code:2,data:{type:0}},(ret) => {})
          // store.commit('hide')
          // dsBridge.call('isShowLoading', {type: '0'})
          // activity.closeKeyFrame()
          // store.commit('hide')
        }
        if (!res) {
          return
        }
        if (res.code === 0) {
          resolve(res)
        } else {
          if (show) {
            resolve(res)
          } else {
            Vue.$vux.toast.text(res.msg)
          }
        }
      }).catch(error => {
        if (loading) {
          store.commit('hide')
        }
        if (Vue.$vux.loading) {
          Vue.$vux.loading.hide()
        }
        console.log(error)
        if(error.message.errorType!='cancel'){
          Vue.$vux.toast.text(error.message, 'top')
          resolve(error)
        }
      })
    })
  }
}
