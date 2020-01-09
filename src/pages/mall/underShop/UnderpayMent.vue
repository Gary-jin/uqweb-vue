<template>
  <div class="payMent UnderpayMent_main" v-if="isShow">
    <div class="header">
      <x-header
        slot="header"
        :left-options="{showBack: false}"
      >
        <span @click="goBack()" slot="left" class="backBox"><i class="iconfont icon-back"></i></span>
       确认支付
      </x-header>
    </div>
    <div class="content">
      <div class="UnderpayMent">
        <table></table>
        <div class="UnderpayMent_box" style="text-align: center;">
          <div>需支付</div>
          <div class="price" v-if="couponTypes != 1 && couponTypes != 2">
            <span>¥</span>
            {{order.payPrice}}
          </div>
          <div class="price" v-if="couponTypes == 1">
            <span>¥</span>
            {{parseFloat(order.payPrice-parseFloat(this.price).toFixed(2)*parseInt(this.count1)).toFixed(2)}}
          </div>
          <div class="price" v-if="couponTypes == 2">
            <span>¥</span>
            {{parseFloat(order.payPrice*(this.price/100)).toFixed(2)}}
          </div>
        </div>
      </div>
      <div class="discount-list" v-if="showYouhui">
        <div class="list-yhj" v-for="(items,i) in arr" :key="i" v-if="items.list">
          <div class="discount-item" @click="handleSelect(i,items.title)">
            <div>
              <img :src="selectDis == i && items.check ? './static/libs/img/active.png' : './static/libs/img/active_no.png'" alt="">
              <p>{{items.title}}</p>
            </div>
            <div>
              <img src="../../../assets/mall/img/under/desc.png" alt="" @click.stop="handleDesc(i)">
              <input type="text" v-model="count[i]">
              <img src="../../../assets/mall/img/under/add.png" alt="" @click.stop="handleAdd(i)">
              <i class="iconfont icon-unfold" style="margin-left: .2rem;"></i>
            </div>
          </div>
          <div class="hy-note" v-show="items.check">
            <div v-for="(item,j) in items.list" :key="j" @click="checkYhj(i, item.couponId, item.nums, item.price, items.title)">
              <div class="note-itm" v-if="item.status=='1'" :style="{'background': selectId == item.couponId && showToast ? '#FAD1D6' : '#ffedf0'}">
                <div>
                  <p>{{item.title}}</p>
                  <span>{{items.title}}</span>
                </div>
                <div>
                  <p>{{item.descs}}</p>
                  <span>x{{item.nums}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="payMent_list">
        <div class="list_title">
          选择支付方式
        </div>
        <div class="list" v-for="(item,index) in payType" @click="handChange(index)" v-if="item.status">
          <div class="img_box">
            <img v-if="index == 'alipay'" src="../../../assets/mall/img/home/apliy.png" alt="">
            <img v-if="index == 'wechat'" src="../../../assets/mall/img/home/wheat.png" alt="">
            <img v-if="index == 'card'" src="../../../assets/mall/img/home/card.png" alt="">
            <img v-if="index == 'credit'" src="../../../assets/mall/img/home/yue.png" alt="">
            <span>{{item.title}}</span>
          </div>
          <div class="checkbox">
            <img :src="active == index ? './static/libs/img/active.png' : './static/libs/img/active_no.png'" alt="">
          </div>
        </div>
      </div>
      <div class="btns" @click="j">
        <div class="btn">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import './underLess.less'
import * as apiHttp from '../../../api/index'
import Vue from 'vue'
export default {
  name: "payMent",
  data(){
    return {
      active: '',
      order: {},
      payType: {},
      otoInfo: {},
      selectDis: null,
      count: [1, 1],
      count1: 1,
      nums: null,
      selectId: null,
      couponTypes: null,
      couponId: null,
      price: 0,
      arr: [],
      isShow: false,
      showToast: false,
      showYouhui: true,
      receivpassword:'',
      price:''
    }
  },
  mounted () {
    this.judgeDealisno()
    apiHttp.paymentDisplay(this.$route.query.spidInfo).then(response => {
      if (response.code === 0) {
        this.isShow = true
        this.order = response.data.order
        this.price = response.data.order.payPrice
        this.payType = response.data.payType
        this.otoInfo = response.data.userInfo.otoInfo
        let list = response.data.userInfo.otoInfo.coupon
        let arr = []
        for (let i in list){
          arr.push(list[i])
        }
        for (let i = 0; i < arr.length; i++) {
          arr[i].check = false
        }
        this.arr = arr
      }
    })
  },
  methods :{
     // 判断是否设置交易密码
    judgeDealisno(){
      this.$http.post('amoy/user/user-info',{},true).then(res=>{
        // console.log("交易密码",res.data.pay_password)
        if(res.data.pay_password == "0" &&this.$codeVersion>=300){
          this.$vux.confirm.show({
            content: '还未设置交易密码，快去设置吧~',
            confirmText: '去设置',
            showCancelButton: false,
            onConfirm : () => {
              //跳转到原生页面
              this.jumpTo('/judgeDealisno')
            }
          })
        }
      })
    },
    // 支付方式的选择
    handChange (key) {
      this.active = key
      if (this.otoInfo.cardInfo.isMerge == 0) {
        if (key == 'card') {
          for (let i = 0; i < this.arr.length; i++) {
            this.arr[i].check = false
          }
          this.couponTypes = 3
          this.showYouhui = false
        } else {
          this.showYouhui = true
        }
      } else {
        this.showYouhui = true
      }
    },
    // 优惠券的选择
    handleSelect (i,val) {
      this.showToast = false
      this.count = [1, 1]
      this.selectDis = i
      this.price = 0
      // this.arr[i].check = !this.arr[i].check
      Vue.set(this.arr, i, this.arr[i])
      if (val == '满减券') {
        this.couponTypes = 1
        this.count1 = this.count[0]
      } else if (val == '折扣券') {
        this.couponTypes = 2
        this.count1 = this.count[1]
      }
      for (let j = 0; j < this.arr.length; j++){
        if(j == i){
          this.arr[i].check = !this.arr[i].check
        } else {
          this.arr[j].check = false
          this.couponTypes = null
        }
      }
    },
    // 优惠券的选择--下级
    checkYhj (i, id, nums, price, title) {
      if (this.selectDis === i) {
        this.count = [1, 1]
        this.selectId = id
        this.couponId = id
        this.nums = nums
        this.price = price
        if (parseInt(this.price) <= parseInt(this.order.payPrice)) {
          this.showToast = true
          if (title == '满减券') {
            this.couponTypes = 1
            this.count1 = this.count[0]
          } else if (title == '折扣券') {
            this.couponTypes = 2
            this.count1 = this.count[1]
          }
        } else {
          this.showToast = false
        }
      }
    },
    // 优惠券 --减
    handleDesc (i) {
      if (this.count[i] > 0) {
        this.count[i]--
        this.count1 = this.count[i]
      }
    },
    // 优惠券 --加
    handleAdd (i) {
      if(i == 0){
        if (this.count[0] < this.nums) {
          this.count[0]++
          console.log(this.count[0])
          this.count1 = this.count[0]
        }
      }
    },
    j () {
      if (!this.active) {
        this.$vux.toast.text('请选择支付方式')
      }
      if(this.couponTypes == 1){
        this.count1 = this.count[0]
      } else if (this.couponTypes == 2){
        this.count1 = 1
      }
      if (this.active === 'card') {
        apiHttp.underPaymentPayType(this.$route.query.spidInfo, this.couponTypes, this.couponId, this.count1, this.active).then(response => {
          if (response.code === 0) {
            this.$vux.toast.text(response.msg)
            setTimeout(() => {
              if (this.$route.query.spid) {
                this.jumpTo('/mall/Underdetail?spid=' + this.$route.query.spid)
              } else if (this.$route.query.goodsId) {
                // this.jumpTo('/mall/underGoodsDetails?goodsId=' + this.$route.query.goodsId)
                dsBridge.call("open", {url: window.location.origin +'/uqWeb/html/oto_details/otoDetails.html?id=' + this.$route.query.goodsId,type: 'web'})
              }
            }, 1000)
          }
        })        
      } else if (this.active === 'credit') {
        console.log("余额支付")
        dsBridge.call("openEntryPasssord", {name: '支付',price: this.price },(passwoed)=>{
          console.log(passwoed)
          this.receivpassword=passwoed
          apiHttp.underPaymentPayType(this.$route.query.spidInfo, this.couponTypes, this.couponId, this.count1, this.active,this.receivpassword,this.$codeVersion).then(response => {
            console.log(response)
            if (response.code === 0) {
              this.$vux.toast.text(response.msg)
              setTimeout(() => {
                if (this.$route.query.spid) {
                  this.jumpTo('/mall/Underdetail?spid=' + this.$route.query.spid)
                } else if (this.$route.query.goodsId) {
                  // this.jumpTo('/mall/underGoodsDetails?goodsId=' + this.$route.query.goodsId)
                  dsBridge.call("open", {url: window.location.origin +'/uqWeb/html/oto_details/otoDetails.html?id=' + this.$route.query.goodsId,type: 'web'})

                }
              }, 1000)
            }
          })
        })

        // apiHttp.underPaymentPayType(this.$route.query.spidInfo, this.couponTypes, this.couponId, this.count1, this.active).then(response => {
        //   if (response.code === 0) {
        //     this.$vux.toast.text(response.msg)
        //     setTimeout(() => {
        //       if (this.$route.query.spid) {
        //         this.jumpTo('/mall/Underdetail?spid=' + this.$route.query.spid)
        //       } else if (this.$route.query.goodsId) {
        //         this.jumpTo('/mall/underGoodsDetails?goodsId=' + this.$route.query.goodsId)
        //       }
        //     }, 1000)
        //   }
        // })
      } else if (this.active === 'alipay') {
        apiHttp.underPaymentPayType(this.$route.query.spidInfo, this.couponTypes, this.couponId, this.count1, this.active).then(response => {
          if (response.code === 0) {
            dsBridge.call('alipayPay', {orderInfo: response.data.payOrder}, (ret) => {
              if (ret == 0) {
                //    支付成功
                dsBridge.call('toast', {msg: '支付成功'})
                setTimeout(() => {
                  if (this.$route.query.spid) {
                    this.jumpTo('/mall/Underdetail?spid=' + this.$route.query.spid)
                  } else if (this.$route.query.goodsId) {
                    // this.jumpTo('/mall/underGoodsDetails?goodsId=' + this.$route.query.goodsId)
                    dsBridge.call("open", {url: window.location.origin +'/uqWeb/html/oto_details/otoDetails.html?id=' + this.$route.query.goodsId,type: 'web'})
                  }
                }, 1000)
              } else if (ret == -1) {
                //    支付失败
              }
            })
          }
        })
      } else if (this.active === 'wechat'){
        apiHttp.underPaymentPayType(this.$route.query.spidInfo, this.couponTypes, this.couponId, this.count1, this.active).then(response => {
          if (response.code === 0) {
            this.data = response.data.payOrder
            let info = {
              apiKey: this.data.appid,
              orderId: this.data.prepayid,
              mchId: this.data.partnerid,
              nonceStr: this.data.noncestr,
              timeStamp: this.data.timestamp,
              sign: this.data.sign
            }
            dsBridge.call('wxPay', info, (ret) => {
              if (ret == 0) {
                //    支付成功
                dsBridge.call('toast', {msg: '支付成功'})
                setTimeout(() => {
                  if (this.$route.query.spid) {
                    this.jumpTo('/mall/Underdetail?spid=' + this.$route.query.spid)
                  } else if (this.$route.query.goodsId) {
                    // this.jumpTo('/mall/underGoodsDetails?goodsId=' + this.$route.query.goodsId)
                    dsBridge.call("open", {url: window.location.origin +'/uqWeb/html/oto_details/otoDetails.html?id=' + this.$route.query.goodsId,type: 'web'})
                  }
                }, 1000)
              } else if (ret == -1) {
                //    支付失败
              }
            })
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
  .list-yhj{
    border-bottom: 1px solid @border-color;
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
    .hy-note{
      background: #ffedf0;
      border-radius: .1rem;
      margin-bottom: .1rem;
      .note-itm{
        padding: 0 .3rem;
        border-bottom: 1px solid #ffffff;
        display: flex;
        justify-content: center;
        flex-direction: column;
        height: 1.2rem;
        div{
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        div:first-child{
          p{
            color: #ff8226;
            font-size: @font-big;
          }
          span{
            color: @font-main-color;
          }
        }
        div:last-child{
          p{
            color: #666666;
            font-size: @font-small;
          }
          span{
            color: @font-main-color;
          }
        }
      }
    }
  }
}
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
