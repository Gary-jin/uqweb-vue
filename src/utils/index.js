export const storage = {
  set: function (key, data) {
    if (dsBridge.hasNativeMethod('setPrefs')) {
      // 当在app中时
      try {
        dsBridge.call('setPrefs', {key: key, value: JSON.stringify(data)})
      } catch (err) {
        dsBridge.call('setPrefs', {key: key, value: data})
      }
    } else {
      // 当不在app中时
      try {
        window.localStorage.setItem(key, window.JSON.stringify(data))
      } catch (err) {
        window.localStorage.setItem(key, data)
      }
    }
  },
  get: function (key) {
    if (dsBridge.hasNativeMethod('setPrefs')) {
      // 当在app中时
      if (key == 'token') { // 原生中获取token是用receiveParams接口
        return dsBridge.call('receiveParams', 'token')
      }
      try {
        // alert(dsBridge.call('getPrefs', {sync: true, key: key}))
        return JSON.parse(dsBridge.call('getPrefs', {sync: true, key: key}))
      } catch (err) {
        return dsBridge.call('getPrefs', {sync: true, key: key})
      }
    } else {
      // 当不在app中时
      try {
        return window.JSON.parse(window.localStorage.getItem(key))
      } catch (err) {
        return window.localStorage.getItem(key)
      }
    }
  },
  remove: function (key) {
    if (dsBridge.hasNativeMethod('setPrefs')) {
      dsBridge.call('removePrefs', {key: key})
    } else {
      window.localStorage.removeItem(key)
    }
  }
}
export function copyText (text) {
  return new Promise(function (resolve, reject) {
    // 复制链接
    var input = document.createElement('input')
    input.value = text
    document.body.appendChild(input)
    input.select()
    input.setSelectionRange(0, input.value.length)
    document.execCommand('Copy')
    document.body.removeChild(input)
    resolve()
  })
}
// 拖拽移动 传参接收一个dom对象。
export function drag (div1) {
  var maxW = document.body.clientWidth - div1.offsetWidth
  var maxH = document.body.clientHeight - div1.offsetHeight
  var isDrop = false
  var oL, oT, oLeft, oTop
  // 手指触摸开始，记录div的初始位置
  div1.addEventListener('touchstart', function (e) {
    var ev = e || window.event
    var touch = ev.targetTouches[0]
    oL = touch.clientX - div1.offsetLeft
    oT = touch.clientY - div1.offsetTop
    document.addEventListener('touchmove', defaultEvent, false)
  })
  // 触摸中的，位置记录
  div1.addEventListener('touchmove', function (e) {
    isDrop = true
    var ev = e || window.event
    var touch = ev.targetTouches[0]
    oLeft = touch.clientX - oL
    oTop = touch.clientY - oT
    if (oLeft < 0) {
      oLeft = 0
    } else if (oLeft >= maxW) {
      oLeft = maxW
    }
    if (oTop < 0) {
      oTop = 0
    } else if (oTop >= maxH) {
      oTop = maxH
    }
    div1.style.left = oLeft + 'px'
    div1.style.top = oTop + 'px'
  })
  // 触摸结束时的处理
  div1.addEventListener('touchend', function () {
    if (isDrop) {
      if (oLeft - (maxW / 2) > 0) {
        div1.style.left = maxW - 5 + 'px'
      } else {
        div1.style.left = '5px'
      }
      document.removeEventListener('touchmove', defaultEvent)
      isDrop = false
    }
  })
  // 阻止默认事件
  function defaultEvent (e) {
    e.preventDefault()
  }
}
