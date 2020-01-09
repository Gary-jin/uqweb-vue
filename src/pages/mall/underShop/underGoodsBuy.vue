<template>
  <div class="under-buy" v-if="isShow">
    <x-header :left-options="{showBack: false}" class="collection-head" >
      <a @click="back()" slot="left" class="backBox"><i class="iconfont icon-back"></i></a>
      <a  class="head-right">确认订单</a>
    </x-header>
    <div class="sited_top_kong"></div>
    <div class="siteadd" v-if="waynow == 1" v-show="siteshow" @click="jumpTo('/mall/addAddress')">
      <div class="addressno">
        <div>
          <img class="pic_dizhi" src="../../../../static/libs/img/dizhi.png" alt="">
          <div>添加收货地址</div>
        </div>
        <img src="../../../../static/libs/img/siterig.png" alt="">
      </div>
    </div>
    <div class="siteadd" v-if="waynow == 1" v-show="!siteshow"  @click="jumpTo('/mall/address')">
      <div class="siteaddress_box" >
        <div class="site_top">
          <div class="site_top_l">
            <img class="pic_dizhi" src="../../../../static/libs/img/dizhi.png" alt="">
            <div>收货人：{{addsitelist.username}}</div>
          </div>
          <div class="site_top_r">
            <div>{{addsitelist.mobile}}</div>
            <img src="../../../../static/libs/img/siterig.png" alt="">
          </div>
        </div>
        <div class="site_bot">
          <div>{{addsitelist.province+addsitelist.city+addsitelist.district+addsitelist.address}}</div>
        </div>
      </div>
    </div>
    <div v-if="waynow == 1" class="site_xian">
      <img src="../../../../static/libs/img/bottom_xian.png" alt="">
    </div>
    <div class="under-body">
      <div class="under-title">
        <div class="title-one" @click="jumpTo('/mall/Underdetail?spid='+ shopInfo.id)">
          <div>
            <img v-lazy="shopInfo.logo" alt="">
            <p>{{shopInfo.title}}</p>
          </div>
        </div>
        <div class="title-two" @click="jumpTo('/mall/Underdetail?spid='+ shopInfo.id)">
          <div>
            <div class="two_pic" :style="{background: `url(${detail.thumb})50% 50% / cover no-repeat`}"></div>
            <div class="two_cen">
              <div>{{detail.goodsName}}</div>
              <div v-if="detail.field1">{{detail.fieldInfo}}</div>
              <div class="two_cen_three">
                <p><span>￥{{goodspricechuan}}</span><span>x{{goodsNum}}</span></p>
              </div>
            </div>
          </div>
        </div>
        <div class="title-one">
          <p>取货方式</p>
          <div class="myswitch " ref="myswitchway" @click="way()" >
            <div class="myswitchbg"></div>
            <div class="myswitchbtn"><span class="btncol">自提</span><span>配送</span></div>
          </div>
        </div>
        <div class="title-one">
          <p>快递费</p>
          <span v-if="waynow == 1">{{expressInfo.expressInfo.postagePrice}}</span>
          <span v-else>包邮</span>
        </div>
        <div class="title-one"  @click="jumpTo('/mall/messageBoard?goodsId='+ data.goodsId)">
          <p>买家留言</p>
          <span class="liuyan">{{liuyan}}</span>
        </div>
        <div class="title-one" @click='couponuse()'>
          <p>优惠</p>
          <span>{{data.couponInfo.couponPrice}}&nbsp;<img src="../../../../static/libs/img/siterig.png" alt=""></span>
        </div>
      </div>

      <div v-if="deduceInfo.length != '0'">
              <div class="inputJifen"  v-if="deduceInfo.type == 3">
                  <div class="point-dedu">
                      <span>积分抵扣(积分:{{availableJifen}})</span>
                      <input type="number" placeholder="请写抵扣积分数量" v-model="inputJifenNum"  @change="changeJifen(deduceInfo, inputJifenNum)">
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
       
      <div class="goPay1">
        <div>
          <p>实付款：<span>￥</span>
          <span v-if="waynow == 1">{{(sumPrice + Number(expressInfo.expressInfo.postagePrice)).toFixed(2)}}</span>
          <span v-else>{{sumPrice}}</span>
          </p>
        </div>
        <div @click="promptlyBuy()">
          <span>提交订单</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './underLess.less'
import { XSwitch ,Group} from 'vux'
import * as apiHttp from '../../../api/index'
import * as utils from '../../../utils'
export default {
  components: {
    XSwitch,
    Group 
  },
  data () {
    return {
      count: 1,
      data: {},
      detail: {},
      equityInfo: {},
      shopInfo: {},
      isShow: false,
      goodsInfo: null,
      notes: [],
      note: null,
      deduceInfo: null,
      useJifen: false,
      inputJifenNum: '',
      useJifenNum: 0,
      jifenRate: 0 ,// 每元有多少积分
      siteshow : false,
      addsitelist: [],
      liuyan : '选填，不超过200字',
      goodsNum : '',
      specification :'',
      goodspricechuan : '',
      value : false,
      isway  : false,
      jifen : true,
      waynow : 0,
      attrId: '',
      couponSelect : '',
      expressInfo : [],
      checked: false,
      tyda:''
    }
  },
  watch: {
     inputJifenNum (val) {
        if(+this.detail.credit1 > +this.deduceInfo.credit1){// 自有积分大于最多积分
          if(+this.deduceInfo.credit1  > this.detail.countPrice * this.jifenRate){//最多积分大于价格
            if(val / this.jifenRate > +this.detail.countPrice ){//输入的大于商品价格
                this.inputJifenNum = this.detail.countPrice * this.jifenRate
            }
          }else{//最多积分小于价格
            if(+val > +this.deduceInfo.price ){//输入的大于商品价格
                this.inputJifenNum = this.deduceInfo.price
            }
          }
        }else{// 自有积分小于最多积分
          if(+this.detail.credit1  > this.detail.countPrice * this.jifenRate){//自有积分大于价格
            if(val / this.jifenRate > +this.detail.countPrice ){//输入的大于商品价格
                this.inputJifenNum = this.detail.countPrice * this.jifenRate
            }
          }else{//自有积分小于商品价格
            if(val / this.jifenRate > +this.detail.credit1 ){//输入的大于自有积分
                this.inputJifenNum = +this.detail.credit1
            }
          }

        }
        
        
    } 
  },
  mounted () {
    this.getInfo()
    this.redraw()
    this.getSite();
  },
  computed: {
    availableJifen: {
      get () {
        // 计算可用积分
        let availabel = this.detail.credit1
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
    //防止计算出现无限位小数
    formatNum (f, digit){
      var m = Math.pow(10, digit);  // digit是参数的最大精度
      return parseInt(f * m, 10) / m; 
    },
    sumPrice () {
      // 计算合计
      let sumPrice = parseFloat(this.detail.totalPrice) || 0
      if(this.deduceInfo.type == '3'){
          sumPrice = (parseFloat(sumPrice) - parseFloat(this.inputJifenNum /this.jifenRate)).toFixed(2)
      }else{
        if (this.checked) {
          sumPrice =( parseFloat(sumPrice) - parseFloat(this.deduceInfo.price)).toFixed(2)
        }
      }
      return sumPrice
    }
  },
  methods: {
    back(){
        this.couponSelect = ''
        this.liuyan = ''
        this.notes = ''
        this.goodsNum = ''
        this.specification = ''
        this.goodspricechuan = ''
        this.attrId = ''
        dsBridge.call('closeWin')
    },
    redraw: function()  {
      document.addEventListener('visibilitychange', () => {
          if (document.hidden) {
          // "页面被挂起"
          } else {
            console.log("呼出")
            this.getSite();
            this.massagebor()
            this.couponSelect = utils.storage.get('couponSelect')
            this.getInfo()
          }
      })
    },
    couponuse(){
      // dsBridge.call("open", { url: 'http://172.16.1.239:3000/uqWeb/html/oto_details/userCoupon.html?goodsInfo='+this.data.goodsInfo, type: 'web' })
      dsBridge.call("open", {url: window.location.origin +'/uqWeb/html/oto_details/userCoupon.html?goodsInfo=' + this.data.goodsInfo, type: 'web'})
    },
    way(){
      if(this.isway  == false){
        this.$refs.myswitchway.className = 'myswitch myswitchshow'
        this.isway = true
        this.waynow = 1
        console.log("配送",this.waynow)
      }else{
        this.$refs.myswitchway.className = 'myswitch myswitchtrue'
        this.isway = false
        this.waynow = 0
        console.log("自提",this.waynow)
      }
    },
    massagebor(){
      this.notes = utils.storage.get('messagesed')
      if(this.notes){
        this.liuyan = utils.storage.get('messagesed')
      }
    },
    // 切换使用积分时调用1  2   抵扣开关 3 手动输入
    changeJifen (items,val) {
      console.log(this)
      items.useJifen = val
      if (items.type == 3) {
        if (!this.inputJifenNum) {
          // 刚开始此值为undefine
          this.inputJifenNum = 0
        }
      } else {
        // 当抵扣类型为固定积分抵扣时
        if (+this.detail.credit1 < +items.credit1) {
          // 当要开启此积分抵扣但是可用积分不足时
          this.$nextTick(()=>{
            this.checked = false
          })
          this.$vux.toast.text('可用积分不足')
        }
      }
    },
    getInfo () {
      // this.goodsNum = utils.storage.get('goodnum').key
      // this.specification = utils.storage.get('specification').key
      // this.goodspricechuan = utils.storage.get('goodspricechuan').key
      // this.attrId = utils.storage.get('attrId').key
      this.goodsNum = this.$route.query.buyNum
      this.specification = this.$route.query.selectTitle
      this.goodspricechuan = this.$route.query.price
      this.attrId = this.$route.query.attrId
      // console.log(this.goodsNum,this.specification,this.goodspricechuan,this.attrId)

       console.log(utils.storage.get('goodnum').key)
      console.log("***3224*****",utils.storage.get('goodspricechuan').key) 
      // console.log(utils.storage.get('specification').key)  couponId
      apiHttp.underShopGoodsDetails(this.$route.query.goodsId, this.goodsNum,'',this.attrId,this.couponSelect).then(res => {
        if (res.code === 0) {
          this.isShow = true
          this.data = res.data
          this.equityInfo = res.data.equityInfo
          this.detail = res.data.detail
          this.count = res.data.goodsNum
          this.shopInfo = res.data.shopInfo
          this.goodsInfo = res.data.goodsInfo
          this.deduceInfo = this.detail.deduceInfo
          console.log("*********",this.deduceInfo)
          this.jifenRate = this.deduceInfo.exchange / 100
          this.expressInfo = res.data.expressInfo
        }
      })
    },
    getSite(){
      apiHttp.addressList().then(res=>{
        if(res.data.list.length == 0){
          this.siteshow = true
        }else{
          this.siteshow = false
          this.addsitelist = res.data.list[0]
        }
      })
    },
    handleDesc () {
      if (this.count > 1) {
        this.count--
        this.getInfo()
      }
    },
    handleAdd () {
      this.count++
      this.getInfo()
    },
    promptlyBuy () {
      console.log(this.notes)
      console.log(this.waynow)
      if(this.checked){
        this.tyda = 1 
      }else{
        this.tyda = 0
      }
      this.$http.post('amoy/user/user-info',{},true).then(res=>{
        if(!res.data.mobile && this.$codeVersion>=300){
          this.$vux.confirm.show({
            content: '还未绑定手机号，快去绑定吧~',
            confirmText: '去绑定',
            showCancelButton: false,
            onConfirm : () => {
              this.jumpTo('/judgemobile')
            }
          })
        }else {
           console.log("立即购买")
           if (this.note) {
            this.notes[this.shopInfo.id] = this.note
          }
          let deduce = []
          if (this.useJifen) {
            if (this.deduceInfo.type == 3) {
              deduce[this.shopInfo.id] = this.useJifenNum
            } else {
              deduce[this.shopInfo.id] = 1
            }
          }
          console.log('this.useJifenNum: ', this.useJifenNum)
          if(this.deduceInfo.type !=3 ){
            apiHttp.underShopGoodBuy('oto', this.goodsInfo, this.notes, deduce, this.waynow,this.data.couponInfo.couponId,this.tyda).then(res => {
              if (res.code === 0) {
                this.couponSelect = ''
                this.liuyan = ''
                this.notes = ''
                this.goodsNum = ''
                this.specification = ''
                this.goodspricechuan = ''
                this.attrId = ''
                this.$router.push({name: 'mallUnderpayMent', query: {spidInfo: res.data, goodsId: this.data.goodsId}})
                console.log("支付成功1")
              }
            })
          }else{
            if(this.inputJifenNum >0){
            }else{
              this.inputJifenNum = 0
            }
            apiHttp.underShopGoodBuy('oto', this.goodsInfo, this.notes, deduce, this.waynow,this.data.couponInfo.couponId,this.inputJifenNum).then(res => {
              if (res.code === 0) {
                this.couponSelect = ''
                this.liuyan = ''
                this.notes = ''
                this.goodsNum = ''
                this.specification = ''
                this.goodspricechuan = ''
                this.attrId = ''
                this.$router.push({name: 'mallUnderpayMent', query: {spidInfo: res.data, goodsId: this.data.goodsId}})
                console.log("支付成功1")
              }else if(res.code === 0 && res.data === 2088){
                Vue.$vux.toast.text(res.msg)
              }
            })
          }
           
        }
      })

    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/mall/style/_Variables';
.under-buy{
  .head-right{
    font-size: .34rem;
    font-weight:bold;
    color:rgba(47,47,47,1);
  }
  .sited_top_kong{
    height: .88rem;
  }
  .siteadd{
    // margin-top:1.08rem;
    height: 1.58rem;
    background: #fff;
    .addressno{
      height: 1.58rem;
      padding:  0 .3rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      >div{
        display: flex;
        align-items: center;
        >img{
          width: .26rem;
          height: .28rem;
          margin-right:  .11rem;
        }
        >div{
          font-size: .3rem;
        }
      }
      >img{
        width: .12rem;
        height: .2rem;
      }
    }
    .siteaddress_box{
      padding: 0 .3rem;
      margin-top: .2rem;
      .site_top{
        display: flex;
        justify-content: space-between;
        .site_top_l{
          display: flex;
          img{
            width: .26rem;
            height: .28rem;
            margin-top: .3rem;
            margin-right:  .11rem;
          }
          >div{
            font-size: .3rem;
            font-weight:bold;
            font-size: .3rem;
            margin-top: .23rem;
          }
        }
        .site_top_r{
          display: flex;
          justify-content: flex-end;
          img{
            width: .12rem;
            height: .2rem;
            margin-top: .35rem;
          }
          >div{
            font-size: .3rem;
            font-weight:bold;
            color:rgba(47,47,47,1);
            margin-top: .23rem;
            margin-right:  .2rem;
          }
        }
      }
      .site_bot{
        height: .8rem;
        margin: .05rem .3rem 0 .3rem;
        font-size: .24rem;
        font-weight:500;
        color:rgba(102,102,102,1);
        
      }
    }
  }
  .site_xian{
    display: flex;
  }

  .under-body{
    margin-top: .2rem;
    .goPay1{
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 1rem;
      background-color: #fff;
      box-shadow: 0 2px 1px 1px #b6b6b6;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      div:first-child{
        width: 67%;
         display: flex;
         justify-content: flex-end;
         margin-right: .36rem;
        p{
          color:rgba(47,47,47,1);
          font-size: .28rem;
          span:first-child{
            font-size: .24rem;
            color:rgba(217,33,33,1);
          }
          span:nth-child(2){
            font-size: .28rem;
            font-weight:bold;
            color:rgba(217,33,33,1);
          }
        }
      }
      div:last-child{
        background:linear-gradient(270deg,rgba(217,33,33,1),rgba(255,101,73,1));
        text-align: center;
        color: #fff;
        height: 100%;
        width: 33%;
        span{
          display: inline-block;
          line-height: 1rem;
          margin-left: 0;
          font-size: @font-more-big;
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

.myswitch{
  width: 1.6rem;
  height: .5rem;
  border-radius: .25rem;
  border: .02rem #eeeeee solid;
  display: flex;
  align-items: center;  
  position: relative;
  .myswitchbg{
    width: .8rem;
    height: .48rem;
    border-radius: .24rem;
    background:linear-gradient(270deg,rgba(217,33,33,1),rgba(255,101,73,1));
  }  
  .myswitchbtn{
    position: absolute;
    top: 0;
    span:nth-child(1){
      height: .48rem;
      width: .8rem;
      line-height: .48rem;
      margin-left: .1rem;
    }
    span:nth-child(2){
      height: .48rem;
      width: .8rem;
      line-height: .48rem;
    }
   .btncol{
     color: #fff !important;
    }
  }
}  
  .myswitch.myswitchshow{
    .myswitchbg{
      animation:mymove .6s ease ;
      -webkit-animation:mymove .6s ease ;
       animation-fill-mode: forwards;
    }
    @keyframes mymove
    {
      from {
         transform:translateX(0);
      -ms-transform:translateX(0);
      -webkit-transform:translateX(0);
      }
      to {
         transform:translateX(100%);
      -ms-transform:translateX(100%);
      -webkit-transform:translateX(100%);
      }
    }

    @-webkit-keyframes mymove /* Safari and Chrome */
    {
      from {
         transform:translateX(0);
      -ms-transform:translateX(0);
      -webkit-transform:translateX(0);
      }
      to {
         transform:translateX(100%);
      -ms-transform:translateX(100%);
      -webkit-transform:translateX(100%);
      }
    }
    .myswitchbtn{
      span:nth-child(1){
        color: #000 !important;
      }
      span:nth-child(2){
        color: #fff !important;
      }
    }
  }
.myswitch.myswitchtrue{
    .myswitchbg{
      animation:mymoves .6s ease;
      -webkit-animation:mymoves .6s ease;
       animation-fill-mode: forwards;
    }
    @keyframes mymoves
    {
      from {
         transform:translateX(100%);
      -ms-transform:translateX(100%);
      -webkit-transform:translateX(100%);
      }
      to {
         transform:translateX(0);
      -ms-transform:translateX(0);
      -webkit-transform:translateX(0);
      }
    }

    @-webkit-keyframes mymoves /* Safari and Chrome */
    {
       from {
         transform:translateX(100%);
      -ms-transform:translateX(100%);
      -webkit-transform:translateX(100%);
      }
      to {
         transform:translateX(0);
      -ms-transform:translateX(0);
      -webkit-transform:translateX(0);
      }
    }
    .myswitchbtn{
      span:nth-child(1){
        color: #fff !important;
      }
      span:nth-child(2){
        color: #000 !important;
      }
    }
  }
// ******2222222****

.jifenswitch{
  width: 1rem;
  height: .5rem;
  border-radius: .25rem;
  display: flex;
  align-items: center;  
  position: relative;
  border: .02rem #eeeeee solid;
  background: #eeeeee;
  overflow: hidden;
  .jifenswitchbg{
    width: .46rem;
    height: .46rem;
    border-radius: .23rem;
    background: #ffffff;
    margin-left: .03rem;
  } 
}  
  .jifenswitch.jifenswitchshow{
    background: #76D672;
    .jifenswitchbg{
      animation:jifenmove .6s ease ;
      -webkit-animation:jifenmove .6s ease ;
       animation-fill-mode: forwards;
    }
    @keyframes jifenmove
    {
      from {
         transform:translateX(0);
      -ms-transform:translateX(0);
      -webkit-transform:translateX(0);
      }
      to {
         transform:translateX(100%);
      -ms-transform:translateX(100%);
      -webkit-transform:translateX(100%);
      }
    }

    @-webkit-keyframes jifenmove /* Safari and Chrome */
    {
      from {
         transform:translateX(0);
      -ms-transform:translateX(0);
      -webkit-transform:translateX(0);
      }
      to {
         transform:translateX(100%);
      -ms-transform:translateX(100%);
      -webkit-transform:translateX(100%);
      }
    }
  }
.jifenswitch.jifenswitchtrue{
    .jifenswitchbg{
      animation:jifenmoves .6s ease;
      -webkit-animation:jifenmoves .6s ease;
       animation-fill-mode: forwards;
    }
    @keyframes jifenmoves
    {
      from {
         transform:translateX(100%);
      -ms-transform:translateX(100%);
      -webkit-transform:translateX(100%);
      }
      to {
         transform:translateX(0);
      -ms-transform:translateX(0);
      -webkit-transform:translateX(0);
      }
    }

    @-webkit-keyframes jifenmoves /* Safari and Chrome */
    {
       from {
         transform:translateX(100%);
      -ms-transform:translateX(100%);
      -webkit-transform:translateX(100%);
      }
      to {
         transform:translateX(0);
      -ms-transform:translateX(0);
      -webkit-transform:translateX(0);
      }
    }
}  

// ****抵扣
.inputJifen{
    padding: .1rem .3rem;
    background: #fff;
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
.point-switch{
  background: #ffffff;
  padding: .1rem .3rem;
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
