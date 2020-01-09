<template>
  <div class="payMent UnderpayMent_main">
    <x-header :left-options="{showBack: false}" class="collection-head" >
      <a @click="goBack()" slot="left" class="backBox"><i class="iconfont icon-back"></i></a>
      <a  class="head-right">确认支付</a>
    </x-header>
    <div class="content" v-if="isShow">
      <div class="UnderpayMent">
        <table></table>
        <div class="UnderpayMent_box" style="text-align: center;">
          <div>需支付</div>
          <div class="price">
            <span>¥</span>
            {{order.payPrice}}
          </div>
        </div>
      </div>
      <div class="payMent_list">
        <div class="list_title">
          选择支付方式
        </div>
        <div class="list" v-for="(item,index) in payType" @click="handChange(index)" v-if="item.status == 1">
          <div class="img_box">
            <img v-if="index == 'credit'" src="../../../assets/mall/img/home/yue.png" alt="">
            <img v-if="index == 'alipay'" src="../../../assets/mall/img/home/apliy.png" alt="">
            <img v-if="index == 'wechat'" src="../../../assets/mall/img/home/wheat.png" alt="">
            <span>{{item.title}}</span>
          </div>
          <div class="checkbox">
            <img :src="active == index ? './static/libs/img/active.png' : './static/libs/img/active_no.png'" alt="">
          </div>
        </div>
      </div>
      <div class="btns" @click="handBuy">
        <div class="btn">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
  import './underLess.less'
  import * as apiHttp from '../../../api/index'
  export default {
    data(){
      return {
        active: 'credit',
        order: {},
        payType: {},
        userInfo: {},
        selectDis: 1,
        count: 1,
        isShow: false,
        payInfo: ''
      }
    },
    mounted: function () {
      // 删除
      apiHttp.paymentDisplay(this.$route.query.spidOrder).then(response => {
        if (response.code === 0) {
          this.isShow = true
          this.order = response.data.order
          this.payType = response.data.payType
          this.userInfo = response.data.userInfo
          console.log(response)
        }
      })
    },
    methods :{
      // 支付方式的选择
      handChange (key) {
        this.active = key
        console.log(key)
      },
      // 优惠券的选择
      handleSelect (val) {
        this.selectDis = val
      },
      // 优惠券 --减
      handleDesc () {
        if (this.count > 0) {
          this.count--
        }
      },
      // 优惠券 --加
      handleAdd () {
        this.count++
      },
      handBuy () {
        let spid = this.$route.query.spid
        if (this.active === 'credit') {
          apiHttp.paymentPayType(this.$route.query.spidOrder, this.active).then(response => {
            if (response.code === 0) {
              // axios.post(response.data.notify)
              this.$vux.toast.text(response.msg)
              setTimeout(() => {
                // this.$router.push({
                //   name: 'mallHykCenter',
                //   query: {
                //     spid: this.$route.query.spid
                //   }
                // })
                this.jumpTo('/mall/hykCenter?spid=' + spid)
              }, 1000)
            }
          })
        } else if (this.active === 'alipay') {
          apiHttp.paymentPayType(this.$route.query.spidOrder, this.active).then(response => {
            if (response.code === 0) {
              dsBridge.call('alipayPay', {orderInfo: response.data.payOrder})
            }
          })
        } else {
          apiHttp.paymentPayType(this.$route.query.spidOrder, this.active).then(response => {
            if (response.code === 0) {
              this.payInfo = response.data.payOrder
              let info = {
                apiKey: this.payInfo.appid,
                orderId: this.payInfo.prepayid,
                mchId: this.payInfo.partnerid,
                nonceStr: this.payInfo.noncestr,
                timeStamp: this.payInfo.timestamp,
                sign: this.payInfo.sign
              }
              dsBridge.call('wxPay', info)
            }
          })
        }
      }
    }
  }
</script>

<style lang="less">
  @import '../../../assets/mall/style/_Variables';
  .discount-list{
    padding: 0 .3rem;
    background: #ffffff;
    margin: .1rem 0;
    .discount-item{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      height: 1rem;
      div{
        display: flex;
        justify-content: flex-start;
        flex-direction: row;
        img{
          width: .4rem;
          height: .4rem;
        }
        p{
          color: @main-red-color;
          font-size: @font-nomal;
          margin-left: .3rem;
        }
        input{
          outline: none;
          border: none;
          width: .5rem;
          text-align: center;
        }
      }
    }
  }
</style>
