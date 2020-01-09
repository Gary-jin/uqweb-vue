<template>
  <div class="payMent yuWithdraw">
    <div class="header">
      <x-header
        slot="header"
        :left-options="{showBack: false}"
      >
        <a @click="goBack()" slot="left" class="backBox"><i class="iconfont icon-back"></i></a>
        {{titleInfo.credit2}}充值
        <a slot="right" @click="jumpTo('/mall/Balancelist')">记录</a>
      </x-header>
    </div>
    <div class="content">
      <div class="payMent_yu">
        <table></table>
        <div class="title">
          充值金额
        </div>
        <div class="input_box">
          <span>¥</span>
          <input type="text" placeholder="请输入买入金额" v-model="price">
        </div>
      </div>
      <div class="payMent_list">
        <div class="list_title">
          选择支付方式
        </div>
        <div class="list" @click="handChange('alipay')">
          <div class="img_box">
            <img src="../../../../assets/mall/img/home/apliy.png" alt="">
            <span>支付宝</span>
          </div>
          <div class="checkbox">
            <img :src="active == 'alipay' ? './static/libs/img/active.png' : './static/libs/img/active_no.png'" alt="">
          </div>
        </div>
        <div class="list" @click="handChange('wechat')">
          <div class="img_box">
            <img src="../../../../assets/mall/img/home/wheat.png" alt="">
            <span>微信</span>
          </div>
          <div class="checkbox">
            <img :src="active == 'wechat' ? './static/libs/img/active.png' : './static/libs/img/active_no.png'" alt="">
          </div>
        </div>
      </div>
      <div class="btns">
        <div class="btn" @click="handSubmit">立即购买</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as apiHttp from '../../../../api/index'
import * as utils from '../../../../utils'
export default {
  data () {
    return {
      active: 'alipay',
      rcInfo: {},
      data: {},
      price: '',
      titleInfo: utils.storage.get('titleInfo')
    }
  },
  mounted () {
    // 删除
    apiHttp.rechargeInfo().then(res => {
      if (res.code === 0) {
        this.rcInfo = res.data
      }
    })
  },
  methods: {
    handChange (key) {
      this.active = key
    },
    getWay (type) {
      this.$http.post('/amoy/user/upgrade-agent', {
        id: this.index,
        upgrade_type: 1,
        type: type
      }, true).then(res => {
        this.dialog = false
        if (res.code === 0) {
          this.data = res.data.payOrder
          let info = {
            apiKey: this.data.appid,
            orderId: this.data.prepayid,
            mchId: this.data.partnerid,
            nonceStr: this.data.noncestr,
            timeStamp: this.data.timestamp,
            sign: this.data.sign
          }
          if (type === 'alipay') {
            dsBridge.call("alipayPay", {orderInfo: res.data.payOrder}, (ret) => {
              if (ret == 0) {
                    // 支付成功
                    this.$vux.toast.text('支付成功')
                    dsBridge.call('closeWin')
                } else if (ret == -1) {
                    //    支付失败
                }else{
                  alert(ret)
                }
            })
          } else {
            dsBridge.call("wxPay", info, (ret)=>{
                if (ret == 0) {
                    // 支付成功
                    this.$vux.toast.text('支付成功')
                    dsBridge.call('closeWin')
                } else if (ret == -1) {
                    //    支付失败
                }
            })
          }
        }
      })
    },
    handBuy (data) {
      if (this.active === 'alipay') {
        apiHttp.paymentPayType(data, this.active).then(response => {
          if (response.code === 0) {
            if(this.$codeVersion >= 300){
              dsBridge.call("alipayPay", {orderInfo: response.data.payOrder}, (ret) => {
                if (ret == 0) {
                      // 支付成功
                      this.$vux.toast.text('支付成功')
                      dsBridge.call('closeWin')
                  } else if (ret == -1) {
                      //    支付失败
                  }
              })
            }else{
              dsBridge.call("alipayPay", {orderInfo: response.data.payOrder})
            }
            
          }
        })
      } else {
        apiHttp.paymentPayType(data, this.active).then(response => {
          if (response.code === 0) {
            // this.$vux.toast.text('暂未开放该支付通道')
            this.data = response.data.payOrder
            let info = {
              apiKey: this.data.appid,
              orderId: this.data.prepayid,
              mchId: this.data.partnerid,
              nonceStr: this.data.noncestr,
              timeStamp: this.data.timestamp,
              sign: this.data.sign
            }
            if(this.$codeVersion >= 300){
              dsBridge.call("wxPay", info, (ret) => {
                if (ret == 0) {
                      // 支付成功
                      this.$vux.toast.text('支付成功')
                      dsBridge.call('closeWin')
                  } else if (ret == -1) {
                      //    支付失败
                  }
              })
            }else{
               dsBridge.call("wxPay", info)
            }
            
          } else {
            this.$vux.toast.text(response.msg)
          }
        })
      }
    },
    handSubmit () {
      apiHttp.rechargeSub('save', this.price).then(response => {
        if (response.code === 0) {
          this.handBuy(response.data)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
