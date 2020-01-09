<template>
     <div class="firmOrder_main">
    <x-header
      slot="header"
      :left-options="{showBack: false}"
    >
      <a @click="goBack()" slot="left" class="backBox"><i class="iconfont icon-back"></i></a>
      确认订单
    </x-header>
    <div class="content">
      <div class="content_top" @click="handAddress()" v-show="obj.address == ''">
        点击添加默认地址
      </div>
      <div class="content_top" @click="jumpTo('/mall/address')" v-show="obj.address">
        <div class="div1">
          <div class="left_name">
            <!-- <i class="iconfont icon-location"></i> -->
            <img src="../../../assets/mall/img/home/dizhi.png" alt="" style="width:0.26rem;height:0.28rem">
            <span>收货人：{{obj.address ? obj.address.username : ''}}</span>
          </div>
          <div class="right_phone">
            {{obj.address ? obj.address.mobile : ''}}
            <i class="iconfont icon-right left"></i>
          </div>
          
        </div>
        <div class="div2">
          <!-- <i class="iconfont icon-locationfill"></i> -->
          <span>{{obj.address ? obj.address.province + obj.address.city + obj.address.district + obj.address.address: ''}}</span>
          <!-- <i class="iconfont icon-right1 left"></i> -->
        </div>
      </div>
      <div class="border">
        <img src="../../../assets/mall/img/home/border.png" alt="">
      </div>
      <div v-for="(items,index) in obj.cartList" :key="index" class="one-shop-order">
        <div class="content_main">
          <div class="list">
            <div class="header" @click="toShop(items.shopInfo.id)">
              <div class="left">
                <img v-lazy="items.shopInfo.logo" alt="">
                <span>{{items.shopInfo.title}}</span>
              </div>
              <i class="iconfont icon-right right"></i>
            </div>
            <div class="mail" v-for="(item,index) in items.goods" :key="index">
              <div class="left">
                <img v-lazy="item.thumb" alt="">
              </div>
              <div class="right">
                <div class="div1">
                  {{item.goodsName}}
                </div>
                <div class="div2">
                  <div>
                    {{item.fieldInfo}}
                  </div>
                 
                </div>
                <div class="div3">
                  <div class="price_main"><span>¥</span>{{item.goodsPrice}}</div>
                   <div class="num">
                    ×{{item.goodsNum}}
                  </div>
                </div>
              </div>
            </div>
            <div class="li_main">
              <div class="title_left">快递费</div>
              <div class="title_right" v-if="items.express.postagePrice > 0">{{items.express.postagePrice}}</div>
              <div class="title_right" v-else>{{items.express.expressName}}</div>
            </div>
            <div class="li_main">
              <div class="title_left">买家留言</div>
              <!-- <div class="title_right"><span class="optional text-overflow_1-xzh">选填,不超过50字</span><i class="iconfont icon-right"></i></div> -->
              <div class="title_right">
                <input type="text" placeholder="选填，请先和商家协商一致" v-model="items.models">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="firmOrderCoupon">
            <div class="isHaveCoupon" v-if="obj.activityId == 0">
              <span>优惠券</span>
              <p @click="toUserCoupon(couponInfo.couponId)">{{couponInfo.couponPrice}}<i class="iconfont icon-right"></i></p>
            </div>
            <div v-if="deduceInfo">
              <div class="inputJifen"  v-if="deduceInfo.type == 3">
                  <div class="point-dedu">
                      <span>积分抵扣(积分:{{availableJifen}})</span>
                      <input type="number" placeholder="请写抵扣积分数量" v-model="inputJifenNum" @change="changeJifen(deduceInfo, inputJifenNum)">
                  </div>
                  <p class="max">{{deduceInfo.info}}</p>
              </div>
                
                <div class="point-switch"  v-else>
                  <div class="switch-box">
                      <span class="jifen">积分抵扣(积分:{{availableJifen}})</span>
                      <div class="bg_con">
                          <input id="checked_1" type="checkbox" class="switch"  @change="changeJifen(deduceInfo, checked)" v-model="checked" />
                          <label for="checked_1" ></label>
                      </div>
                  </div>
                  <p class="max">{{deduceInfo.info}}</p>
                </div>
            </div>
            
            
        </div>
    </div>
    <div style="height:1.2rem"></div>
    <div class="footer" v-if="obj">
      <div class="footer_main">
        <div class="div1">
          <label>实付款：</label><i>¥</i><span id="orderSumPrice">{{sumPrice}}</span>

        </div>
          <div class="div_btn" @click="immediatelyBuy()">提交订单</div>
      </div>
    </div>
  </div>
</template>

<script>
import {XSwitch, Group, XInput} from 'vux'
import * as apiHttp from '../../../api/index'
import * as utils from '../../../utils'
export default {
  name: 'firmOrder',
  components: { XSwitch, Group, XInput },
  data () {
    return {
      obj: {},
      aJifen: 0,
      totalPrice: 0, // 本次订单总价
      jifenRate: 0, // 每元有多少积分
      title: '',
      checked: false,
      couponInfo: '',
      deduceInfo: '',
      isDisabled: false,
      inputJifenNum: '',
      inputSmall: '',
      leaveMessage: ''
    }
  },
  watch: {
    inputJifenNum (val) {
        // 监听该值的变化
        // if(this.obj.countPrice * this.jifenRate > Number(this.obj.credit1)){
        //     // 价格大于有的积分时
        //     if(Number(val) > Number(this.obj.credit1)){
        //       this.inputJifenNum = this.obj.credit1
        //     }
        // }else{
        //     if( Number(val) / this.jifenRate >  Number(this.obj.countPrice)){
        //         this.inputJifenNum = this.obj.countPrice * this.jifenRate
        //       }
        // }

        if(+this.obj.credit1 > +this.deduceInfo.credit1){// 自有积分大于最多积分
          if(+this.deduceInfo.credit1  > this.obj.countPrice * this.jifenRate){//最多积分大于价格
            if(val / this.jifenRate > +this.obj.countPrice ){//输入的大于商品价格
                this.inputJifenNum = this.obj.countPrice * this.jifenRate
            }
          }else{//最多积分小于价格
            if(+val > +this.deduceInfo.credit1 ){//输入的大于商品价格
                this.inputJifenNum = this.deduceInfo.credit1
            }
          }
        }else{// 自有积分小于最多积分
          if(+this.obj.credit1  > this.obj.countPrice * this.jifenRate){//自有积分大于价格
            if(val / this.jifenRate > +this.obj.countPrice ){//输入的大于商品价格
                this.inputJifenNum = this.obj.countPrice * this.jifenRate
            }
          }else{//自有积分小于商品价格
            if(val / this.jifenRate > +this.obj.credit1 ){//输入的大于自有积分
                this.inputJifenNum = +this.obj.credit1
            }
          }

        }
        
        
    },
    sumPrice(val){
      var tags = document.getElementById('orderSumPrice');
      var num = val.toFixed(2);
      var integral = num.substring(0, num.indexOf('.'));
      var decimal = num.substring(num.indexOf('.'));
      if(num.indexOf('.') == -1) {
          tags.innerHTML = '<span class="integral">' + num + '<\/span>';
      } else {
          var integral = num.substring(0, num.indexOf('.'));
          var decimal = num.substring(num.indexOf('.'));
          tags.innerHTML = '<span class="integral">' + integral + '<\/span><span class="decimal">' + decimal + '<\/span>';
      }
    }
  },
  mounted: function () {
    this.redraw()
    // 删除
    if (this.$route.query.type) {
      this.getDetail()
    } else {
      this.getDetail('interim', this.$route.query.data)
    }
     
  },
  computed: {
    availableJifen: {
      get () {
        // 计算可用积分
        let availabel = this.obj.credit1
        if(this.deduceInfo.type == '3'){
          availabel = availabel - this.inputJifenNum
        }else{
            if (this.checked) {
              availabel = availabel - this.deduceInfo.credit1
            }
        }
        return availabel
      },
      set (val) {
      }
    },
    sumPrice () {
      // 计算合计
      let sumPrice = +this.obj.countPrice || '0'
      if(this.deduceInfo.type == '3'){
          sumPrice = sumPrice - this.inputJifenNum /this.jifenRate
      }else{
        if (this.checked) {
          sumPrice = sumPrice - this.deduceInfo.price
        }
      }
      return sumPrice
    }
  },
  
  methods: {
    // ios 输入框弹起页面上移，收起来页面不下滑。
    onBlur () {
      window.scrollTo(0, 0)
    },
    redraw () {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          // "页面被挂起"
        } else {
          this.getDetail('interim', this.$route.query.data, utils.storage.get('couponSelect'))
        }
      })
    },
    // 去使用优惠券页面
    toUserCoupon(couponId){
      if (this.$route.query.type) {
        dsBridge.call("open", {url: window.location.origin +'/uqWeb/html/mall/userCoupon.html?couponId=' + couponId,type: 'web'})
      } else {
        // this.getDetail('interim', this.$route.query.data)
        dsBridge.call("open", {url: window.location.origin +'/uqWeb/html/mall/userCoupon.html?type='+ 'interim' +'&goodsInfo=' + this.$route.query.data + '&couponId=' + couponId, type: 'web'})

        //  alert('000')
      }
    },
   
    // 切换使用积分时调用1  2   抵扣开关 3 手动输入
    changeJifen (items, val) {
      console.log(this)
      items.useJifen = val
      if (items.type == 3) {
        if (!this.inputJifenNum) {
          // 刚开始此值为undefine
          this.inputJifenNum = 0
        }
      } else {
        
        // 当抵扣类型为固定积分抵扣时
        if (+this.obj.credit1 < +items.credit1 || +this.obj.credit1 == 0) {
          // 当要开启此积分抵扣但是可用积分不足时
          this.$nextTick(()=>{
            this.checked = false
          })
          this.$vux.toast.text('可用积分不足')
        }
      }
    },
    getDetail (type, data, couponSelect) {
      apiHttp.cardCheckout(type, data, couponSelect).then(response => {
        if (response.code === 0) {
          this.obj = response.data
          this.couponInfo = response.data.couponInfo
          this.deduceInfo = response.data.deduceInfo
          this.jifenRate = this.obj.deduceInfo.exchange*0.01
          // ios 未实现该方法，紧急解决bug先注释。
          // utils.storage.remove('couponSelect')
          let list = this.obj.cartList
          for (let i = 0; i < list.length; i++) {
            list[i].models = ''
          }
        }
      })
    },
    toShop(spid){
        dsBridge.call("open", {url: window.location.origin +'/uqWeb/html/mall/mallShop.html?spid=' + spid,type: 'web'})
    },
    handAddress () {
      this.jumpTo('/mall/address')
    },
    queryOrder (data) {
      let noteList = []
      let list = this.obj.cartList
      for (let i = 0; i < list.length; i++) {
        noteList[list[i].shopInfo.id] = list[i].models
      }

      var deduceType;
      // if (this.sumPrice == 0) {
      //   this.$vux.toast.text('不能0元支付')
      //   return
      // }
      if(this.deduceInfo.type == '3'){
          deduceType = this.inputJifenNum
      }else{
        if(this.checked){
            deduceType = 1
          }else{
            deduceType = 0
          }
      }
      
      apiHttp.orderCreate(data, noteList, deduceType, this.couponInfo.couponId).then(response => {
        console.log('code',response.code)
        if (response.code == 0) {
            if(response.data == 2088){
                this.jumpTo('/mall/paySuccess')
            }else{
              this.jumpTo('/mall/payMent?orderId=' + response.data)
            }
        }else{
           this.$vux.toast.text(response.msg)
        }
      })
    },
    handDetail () {
      if (this.$route.query.type) {
        this.queryOrder()
      } else {
        this.queryOrder(this.$route.query.data)
      }
    },
    immediatelyBuy () {
      this.$http.post('amoy/user/user-info', {}, true).then(res => {
        if (!res.data.mobile && this.$codeVersion >= 300) {
          this.$vux.confirm.show({
            content: '还未绑定手机号，快去绑定吧~',
            confirmText: '去绑定',
            showCancelButton: false,
            onConfirm: () => {
              // 跳转到原生页面
              this.jumpTo('/judgemobile')
            }
          })
        } else {
          this.handDetail()
        }
      })
    }

  }
}
</script>
<style >
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
.point-switch{
  background: #ffffff;
  padding: .1rem .3rem;
  border-top: 1px solid #f2f2f2; 
}
.point-switch .max{
  font-size: .24rem;
  color: #999
}
.switch-box{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.switch-box .jifen{
  font-size: .3rem;
  color: #2f2f2f
}
.switch-box .bg_con{
    width:42px;
    zoom: 1.3
}
 .switch-box .switch{
    display:none;
}
 .switch-box label{
    position:relative;
    display: block;
    padding: 1px;
    border-radius: 24px;
    height: 22px;
    background-color: #eee;
    cursor: pointer;
    vertical-align: top;
    -webkit-user-select: none;
}
 .switch-box label:before{
    content: '';
    display: block;
    border-radius: 24px;
    height: 22px;
    background-color: white;
    -webkit-transform: scale(1, 1);
    -webkit-transition: all 0.3s ease;
}
 .switch-box label:after{
    content: '';
    position: absolute;
    top: 50%;  
    left: 50%;  
    margin-top: -11px;  
    margin-left: -11px;
    width: 22px;
    height: 22px;
    border-radius: 22px;
    background-color: white;
    box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.08);
    -webkit-transform: translateX(-9px);
    -webkit-transition: all 0.3s ease;
}
 .switch-box .switch:checked~label:after{
    -webkit-transform: translateX(9px);
}
 .switch-box .switch:checked~label:before{
    background-color:#76D672;
}
</style>
<style scoped lang="less">
.firmOrderCoupon{
  margin-top: .2rem
}
.isHaveCoupon{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 .3rem;
    height: .9rem;
    background: #fff;
    span{
      font-size: .3rem;
      color: #2f2f2f
    }
    p{
      font-size: 0.28rem;
      color: #999;
      display: inline-flex;
      align-items: center;
    }
}
.inputJifen{
    padding: .1rem .3rem;
    background: #fff;
    border-top: 1px solid #f2f2f2; 
    .max{
      font-size: .24rem;
      color: #999
    }
}
.point-dedu{
    font-size: .3rem;
    color: #2f2f2f;
    display: flex;
    align-items: center;
    justify-content: space-between;
    input{
      height: .45rem;
      line-height: .45rem;
      border: none;
      width: 3rem;
      text-align: right;
      font-size: .28rem;
      color: #999;
    }
}
/deep/.weui-cells:before{
    border-top: none !important
  }
  /deep/.weui-cells:after{
    border-bottom: none
  }
  /deep/.vux-no-group-title{
      margin-top: .2rem;
      /deep/.weui-cell{
        padding: .15rem .3rem;
        /deep/.weui-label{
          width: 100%;
          font-size: .3rem;
          color: #2f2f2f;
        }
      }
      /deep/.weui-cell__ft{
        .weui-switch{
          // width: 1.20rem;
          // height: .5rem
        }
      }

      
  }

</style>
