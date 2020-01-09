<template>
  <div class="payMent">
    <div class="header">
      <x-header
        slot="header"
        :left-options="{showBack: false}"
      >
        <a @click="goBack()" slot="left" class="backBox"><i class="iconfont icon-back"></i></a>
        支付
      </x-header>
    </div>
    <div class="content">
      <div class="payMent_parse">
        <div class="left">
          订单金额
        </div>
        <div class="right">
          <span>¥</span>{{data.order ? data.order.payPrice : 0}}
        </div>
      </div>
      <div class="payMent_list">
        <div class="list_title">
          <span class="line"></span>
          选择支付方式
        </div>
        <div class="list" v-for="(item,index) in payType" v-bind:key="index" @click="handChange(index)" v-if="item.status">
          <div class="img_box">
            <img v-if="index == 'credit'" src="../../../assets/mall/img/home/yue.png" alt="">
            <img v-if="index == 'alipay'" src="../../../assets/mall/img/home/apliy.png" alt="">
            <img v-if="index == 'wechat'" src="../../../assets/mall/img/home/wheat.png" alt="">
            <span>{{item.title}}<i class="yue" v-if="index == 'credit'">(余额¥{{data.userInfo.credit2}})</i></span>
          </div>
          <div class="checkbox">
            <img :src="active == index ? './static/libs/img/active.png' : './static/libs/img/active_no.png'" alt="">
          </div>
        </div>
      </div>
      <div class="btns">
        <div class="btn" @click="handBuy">支付¥{{data.order ? data.order.payPrice : 0}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as apiHttp from '../../../api/index'
import axios from 'axios'
export default {
  name: 'payMent',
  data () {
    return {
      pay_password: '1',
      active: 'credit', // 'alipay':支付宝, 'credit': 余额支付, 'wechat': 微信支付
      data: {},
      payType: {},
      receivpassword: '', // 交易密码
      price: ''
    }
  },
  mounted: function () {
    // 删除
    apiHttp.paymentDisplay(this.$route.query.orderId).then(response => {
      if (response.code === 0) {
        this.data = response.data
        this.price = response.data.order.payPrice
        this.payType = response.data.payType
      }
    })
  },
  methods: {
    // 判断是否设置交易密码
    judgeDealisno (params) {
      this.$http.post('amoy/user/user-info', {}, true).then(res => {
        // 代码版本300以上开始做交易密码限制
        if (res.data.pay_password == '0') { // 未设置过密码
          this.showSetPasswordConfirm()
        } else { // 已设置过密码
          if (params && params.callback) params.callback()
        }
      })
    },
    // 弹出设置交易密码弹窗
    showSetPasswordConfirm () {
      this.$vux.confirm.show({
        content: '还未设置交易密码，快去设置吧~',
        confirmText: '去设置',
        showCancelButton: false,
        onConfirm: () => {
          // 跳转到原生页面
          this.jumpTo('/judgeDealisno')
        }
      })
    },
    handChange (key) {
      this.active = key
    },
    // 点击支付
    getWay (type) {
      this.$http.post('/amoy/user/upgrade-agent', {
        id: this.index,
        upgrade_type: 1,
        type: type
      }, true).then(res => {
        this.dialog = false
        if (res.code === 0) {
          this.data = res.data.payOrder;
          let info = {
            apiKey: this.data.appid,
            orderId: this.data.prepayid,
            mchId: this.data.partnerid,
            nonceStr: this.data.noncestr,
            timeStamp: this.data.timestamp,
            sign: this.data.sign
          }
          if (type === 'alipay') {
            dsBridge.call("alipayPay", {orderInfo: res.data.payOrder})
          } else {
            dsBridge.call("wxPay", info)
          }
        }
      })
    },
    // 立即购买
    handBuy () {
      if (this.active === 'credit') {
        // 余额支付
        // 代码版本300以上开始做交易密码限制
        if (this.$codeVersion >= 300) {
          this.judgeDealisno({callback: this.doCreditPay})
        } else {
          this.doCreditPay()
        }
      } else if (this.active === 'alipay') {
        // 支付宝支付
        apiHttp.paymentPayType(this.$route.query.orderId, this.active).then(response => {
          if (response.code === 0) {
            dsBridge.call('alipayPay', {orderInfo: response.data.payOrder}, (ret) => {
              if (ret == 0) {
                //    支付成功
                dsBridge.call('toast', {msg: '支付成功'})
                this.jumpTo('/mall/paySuccess')
              } else if (ret == -1) {
                //    支付失败
              }
            })
          }
        })
      } else if (this.active === 'wechat') {
        // 微信支付
        apiHttp.paymentPayType(this.$route.query.orderId, this.active).then(response => {
          if (response.code === 0) {
            let info = {
              apiKey: response.data.payOrder.appid,
              orderId: response.data.payOrder.prepayid,
              mchId: response.data.payOrder.partnerid,
              nonceStr: response.data.payOrder.noncestr,
              timeStamp: response.data.payOrder.timestamp,
              sign: response.data.payOrder.sign
            }
            dsBridge.call('wxPay', info, (ret) =>{
              if (ret == 0) {
                //    支付成功
                dsBridge.call('toast', {msg: '支付成功'})
                this.jumpTo('/mall/paySuccess')
              } else if (ret == -1) {
                //    支付失败
              }
            })
          }
        })
      }
    },
    // 余额支付操作
    doCreditPay () {
      if (this.$codeVersion >= 300) { // 代码版本300以上需要验证交易密码
        dsBridge.call('openEntryPasssord', { name: '支付', price: this.price }, (passwoed) => {
          this.receivpassword = passwoed
          apiHttp.paymentPayType(this.$route.query.orderId, this.active, this.receivpassword, this.$codeVersion).then(response => {
            if (response.code === 0) {
              // axios.post(response.data.notify)
              this.jumpTo('/mall/paySuccess')
            }
          })
        })
      } else {
        apiHttp.paymentPayType(this.$route.query.orderId, this.active, '', this.$codeVersion).then(response => {
          if (response.code === 0) {
            // axios.post(response.data.notify)
            this.jumpTo('/mall/paySuccess')
          }
        })
      }
    }
  }
}
</script>

<style>
.weui-dialog{
  width:5.9rem;
  height:2.3rem;
  background:rgba(255,255,255,1);
  border-radius: .2rem ! important;
}
.weui-dialog__bd:first-child{
  height: .3rem ! important;
  padding: .54rem .78rem .18rem .78rem;
}
.weui-dialog__bd div{
  font-size: .3rem;
  color: #2F2F2F;
  white-space:nowrap;
}
.weui-dialog__btn.weui-dialog__btn_primary{
  color: #1675E1 ! important;
}
</style>
