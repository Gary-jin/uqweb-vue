<template>
    <div class="videoPay">
      <div class="list" @click="way = 1">
        <div class="select">
          <i class="iconfont icon-duihao2 selected" v-if="way === 1" :style="{color: $store.state.global.theme.mainColor}" ></i>
          <i class="iconfont icon-circle2yuanquan" v-else></i>
        </div>
        <img src="../../assets/img/home/videoAli.png" alt="">
      </div>
      <div class="list" @click="way = 2">
        <div class="select">
          <i class="iconfont icon-duihao2 selected" v-if="way === 2" :style="{color: $store.state.global.theme.mainColor}" ></i>
          <i class="iconfont icon-circle2yuanquan" v-else></i>
        </div>
        <img src="../../assets/img/home/videoWx.png" alt="">
      </div>
      <p class="info">本次购买需支付<span :style="{color: $store.state.global.theme.mainColor}" >{{$route.query.price}}</span>元</p>
      <div class="btn" @click="pay" :style="{background: $store.state.global.theme.mainColor}">去支付</div>
    </div>
</template>

<script>
export default {
  name: 'videoPay',
  components: {},
  data () {
    return {
      way: 1,
      data: ''
    }
  },
  methods: {
    pay () {
      this.$http.post('/amoy/movie/movie-agent-pay', {
        type: this.way === 1 ? 'alipay' : 'wxpay'
      }, true).then(res => {
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
          if (this.way === 1) {
            dsBridge.call('alipayPay', {orderInfo: this.data})
          } else {
            dsBridge.call('wxPay', info)
          }
        }
      })
    },
  }
}
</script>

<style scoped lang="less">
@import "../../assets/less/common";
.videoPay{
  height: 100%;
  .list{
    height: 1.2rem;
    display: flex;
    align-items: center;
    padding: 0 .3rem;
    background: #fff;
    .select{
      margin-right: .3rem;
    }
    img{
      height: .4rem;
    }
  }
  .info{
    padding: .3rem;
    span{
      font-size: .3rem;
    }
  }
  .btn{
    position: absolute;
    bottom: 1rem;
    left: .5rem;
    width: 6.5rem;
    height: .9rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: .34rem;
    border-radius: .2rem;
  }
}
</style>
