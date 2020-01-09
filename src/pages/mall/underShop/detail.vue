<template>
    <div class="under_detail" v-if="isShow">
      <!-- <x-header :left-options="{showBack: false}" class="collection-head" :style="{paddingTop: statusH + 'rem'}">
        <a @click="goBack()" slot="left" class="backBox"><i class="iconfont icon-back"></i></a>
        <a  class="head-right">店铺详情</a>
          <div class="mall-saoma" ><img @click="morefun(1)" :src=" './static/libs/img/detail_more.png' " tyle="top: 0;right: .4rem;"></div>
      </x-header> -->
      <div class="detail_top" :style="{paddingTop: statusH + 'rem'}">
        <div>
          <a @click="goBack()" slot="left" class="detail_top_left"><i class="iconfont icon-back"></i></a>
          <a  class="detail_top_cen">店铺详情</a>
          <div class="detail_top_rig" @click="moreshow()" ><img src="../../../../static/libs/img/detail_more.png" ></div>
        </div>
      </div>

      <div class="mescrollBox" :style="{paddingTop: statusH + 'rem'}">
        <div class="under-body">
          <div class="swiper" >
            <swiper auto v-model="index" @on-index-change="onIndexChange" :show-dots='false' height="5.5rem">
              <swiper-item v-for="(item,i) in slides" :key="i"><img v-lazy="item.thumb" alt="" style="height: 100%;width: 100%"></swiper-item>
            </swiper>
            <p class="number">
              <span>{{index+1}}</span>
              <span> /{{slides.length}}</span>
            </p>
          </div>

          <div class="detail_header">
            <div class="detail_header_core">
                <div class="core_a">
                  <p>{{shopInfo.title}}</p>
                  <p>
                    <img v-for="i in 5" :key="i" :src=" i<=parseInt(shopInfo.score) ? './static/libs/img/xingxing.png' : './static/libs/img/xx.png'" alt="">
                  </p>
                  <div>
                    <div v-if="shopInfo.category">{{shopInfo.category}}</div>
                    <div>人气{{shopInfo.look}}</div>
                  </div>
                </div>
                <div class="core_b">
                  <div class="core_b_top">
                    <div class="core_b_site">{{shopInfo.birth || shopInfo.address}}</div>
                    <div class="core_b_sit_rig">
                      <img v-if="data.addressUrl" @click="handleGo(data.addressUrl)" :src="'./static/libs/img/ding_wei.png'" alt="">
                      <div></div>
                      <img @click="handleCall(shopInfo.mobile)" :src="'./static/libs/img/detail_phone.png'" alt="">
                    </div>
                  </div>
                  <div class="core_b_bot">
                    <span v-if="shopInfo.isHoursStop == 0">营业中 {{shopInfo.hoursInfo ? shopInfo.hoursInfo.starttime : ''}}-{{shopInfo.hoursInfo ? shopInfo.hoursInfo.endtime : ''}}</span>
                    <span v-if="shopInfo.isHoursStop == 1">{{shopInfo.hoursInfo ? shopInfo.hoursInfo.status : ''}}<span style="margin-left: 0" v-if="shopInfo.hoursInfo.starttime && shopInfo.hoursInfo.endtime">(营业时间:{{shopInfo.hoursInfo ? shopInfo.hoursInfo.starttime : ''}}-{{shopInfo.hoursInfo ? shopInfo.hoursInfo.endtime : ''}})</span></span>
                  </div>
                </div>
            </div>
          </div>
          <div class="merchandiseNews">
              <div class="merchandiseNews_core" @click="jumpTo('/mall/underShopInfo?spid='+ shopInfo.id)">
                  <div class="merchandiseNews_l">
                    <img :src="'./static/libs/img/merchandiseNews.png'" alt="">
                    <div>商家信息</div>
                  </div>
                <div class="merchandiseNews_r">
                  <img :src="'./static/libs/img/rigrig.png'" alt="">
                </div>
              </div>
              <!-- <div class="merchandiseNews_core" @click="handlehuk(shopInfo.id)" v-if="!userCard && (shopInfo.cardInfo && shopInfo.cardInfo.status == 1)"> -->
                <div class="merchandiseNews_core" @click="handlehuk(shopInfo.id)" >  
                  <div class="merchandiseNews_l">
                    <img :src="'./static/libs/img/huiyuan.png'" alt="">
                    <div>会员卡领取</div>
                  </div>
                <div class="merchandiseNews_r">
                  <img :src="'./static/libs/img/rigrig.png'" alt="">
                </div>
              </div>
              <!-- <div class="merchandiseNews_core" @click="jumpTo('/mall/drawYhj?spid='+ shopInfo.id)" > -->
              <div class="merchandiseNews_core" @click="yhqlq()" >
                  <div class="merchandiseNews_l">
                    <img :src="'./static/libs/img/youhuijuan.png'" alt="">
                    <div>优惠券领取</div>
                  </div>
                <div class="merchandiseNews_r">
                  <img :src="'./static/libs/img/rigrig.png'" alt="">
                </div>
              </div>
          </div>
          <div class="detail-goods" v-if="goodsList">
            <div class="goods-header">
              <div></div>
              <div>在售商品</div>
            </div>
            <!-- <div class="goods-item" v-for="(item,i) in goodsList" :key="i" @click="jumpTo('/mall/underGoodsDetails?goodsId='+item.id)"> -->
            <div class="goods-item" v-for="(item,i) in goodsList" :key="i" @click="toGoodsDetail(item.id)">
              <div class="goods_item_pic" :style="{background: `url(${item.thumb})50% 50% / cover no-repeat`}"></div>
              <div>
                <p>{{item.goodsName}}</p>
                <p v-if="item.sales > 0">已售 {{item.sales}} {{item.unit}}</p>
                <p><span>￥{{item.spe_price}}</span><span><s>￥{{item.marketprice}}</s></span></p>
              </div>
              <span class="goods-buy">抢购</span>
            </div>
          </div>
        </div>
      </div>
      <div class="goPay"  v-if="shopInfo.isHoursStop != 1">
        <div @click="payBill()" v-if="shopInfo.isHoursStop == 0">
          <span>我要买单</span>
        </div>
        <!-- <div v-if="shopInfo.isHoursStop == 1" style="background: #a1a1a1" >
          <span>我要买单</span>
        </div> -->
      </div>
      <div class="goPay" style="background: #a1a1a1"  v-if="shopInfo.isHoursStop == 1">
        <!-- <div @click="payBill()" v-if="shopInfo.isHoursStop == 0">
          <span>我要买单</span>
        </div> -->
        <div>
          <span>我要买单</span>
        </div>
      </div>
      <!--显示二维码-->
      <div v-if="isShowQrcode">
        <div class="mall-sq-body">
          <div class="sq-content">
            <div class="sq-one">
              <img src="../../../assets/mall/img/under/erweima.png" alt="">
            </div>
            <div class="sq-two">
              <img :src="qrcodeInfo.qrcode" alt="">
            </div>
            <img class="closeImg" src="../../../assets/img/sign/close.png" alt="" @click="handleClose()">
          </div>
        </div>
      </div>
      <!-- 更多功能弹窗 -->
      <div class="moregongneng" v-show="gongnengsshow">
        <div class="morebox_top">
          <div>功能直达</div>
          <img @click="morefunst()" :src=" './static/libs/img/zhidadel.png' " alt="">
        </div>
        <div class="morebox_core">
          <div @click="jumpTo('mall/underShop')">
            <img :src=" './static/libs/img/home.png' " alt="">
            <div>首页</div>
          </div>
          <!-- <div @click=-->
        <!-- 我的订单"jumpTo('/mall/underOrderList?spid='+shopInfo.id)"> --> 
          <div @click="goorder()">
            <img :src=" './static/libs/img/my.png' " alt="">
            <div>我的订单</div>
          </div>
          <div @click="fenxiang_win()">
            <img :src=" './static/libs/img/share.png' " alt="">
            <div>分享店铺</div>
          </div>
          <div @click="kefu(shopInfo.bdsqUrl)">
            <img :src=" './static/libs/img/service.png' " alt="">
            <div>在线客服</div>
          </div>
        </div>
        <div class="morebox_core">
          <div @click="mycoupon()" >
            <img :src=" './static/libs/img/coupon.png' "  alt="">
            <div>我的优惠券</div>
          </div>
        </div>
      </div>
      <!-- 分享弹窗 -->
      <div class="share_platform" v-show="fx_win">
        <div class="fenxiang_win_bg" @click="fx_win_del()"></div>
        <div class="shareType">
          <p>分享到</p>
            <!-- <div><img src="../../../assets/img/home/goods/wechat.png" alt="" @click="shareFri(1)"><p>微信</p></div>
            <div><img src="../../../assets/img/home/goods/friend_circle.png" alt="" @click="shareFri(2)"><p>朋友圈</p></div> -->
            <ul>
                <li @click="shareBar(1)">
                    <img src="../../../assets/img/home/goods/wechat2.png" alt="">
                    <p>微信</p>
                </li>
                <li @click="shareBar(2)">
                    <img src="../../../assets/img/home/goods/wcircle.png" alt="">
                    <p>朋友圈</p>
                </li>
                <li @click="shareBar(3)">
                    <img src="../../../assets/img/home/goods/qq2.png" alt="">
                    <p>QQ</p>
                </li>
                <li @click="shareBar(5)">
                    <img src="../../../assets/img/home/goods/qzone.png" alt="">
                    <p>QQ空间</p>
                </li>
            </ul>
          
        </div>
      </div>
      <!-- 领取优惠券 -->
      <div v-transfer-dom>
        <popup v-model="popupDrawyhj" position="bottom" show-mask="false">
          <div class="pppup_tit">领取优惠券</div>
          <div class="pppup_yhq_box">
            <div class="pppup_yhq" v-for="(item,index) in couponListyhq" :key="index">
              <div class="coupon-item">
                  <div class="left">
                      <p class="price" v-if="item.types != 2"><span>¥</span>{{item.price}}<span>{{item.typesInfo}}</span></p>
                      <p class="price" v-else ><span></span>{{item.price}}%<span>{{item.typesInfo}}</span></p>
                      <p class="goodsName">{{item.title}}</p>
                      <p class="time" v-if="parseInt(item.starttime) > 0 && parseInt(item.endtime) > 0">使用期限：{{parseInt(item.starttime) | formatDate}}至{{parseInt(item.endtime) | formatDate}}</p>
                  </div>
                  <div class="right" @click="getDrowList(item.id)">
                      <p v-if="item.userReceive == 0">立即领取</p>
                      <p v-if="item.userReceive == 1">已领取</p>
                      <img v-if="item.userReceive == 1" src="../../../assets/img/home/goods/yhjlq.png" alt="">
                  </div>
              </div>
            </div>
          </div>
        </popup>
      </div>
    </div>
</template>

<script>
import './detail.less'
import { TransferDom,Popup,Swiper,SwiperItem } from 'vux'
import * as apiHttp from '../../../api/index'
import {formatDate} from '../../../plugin/data'
export default {
  name: "detail",
  components: {
    Popup,
    Swiper,
    SwiperItem,
    TransferDom
  },
  filters: {
      formatDate (time) {
        time = time * 1000
        var date = new Date(time)
        return formatDate(date, 'yyyy.MM.dd')
      }
    },
  data(){
    return{
      index:0,
      shopInfo: {},
      addressUrl: {},
      slides: [],
      userCard: {},
      isShow: false,
      couponList: {},
      data: {},
      isShowQrcode: false,
      qrcodeInfo: {},
      goodsList: [],
      shareInfo: [],
      bot: '',
      gongnengsshow : false,
      fx_win : false,
      statusH : 0,
      popupDrawyhj : false, //优惠券弹窗
      couponListyhq: {}
    }
  },
  created () {
    // 去掉沉浸式
    // let safeArea = dsBridge.call('receiveParams', 'safeAreaTop1')
    let size = (document.documentElement.clientWidth / 7.5)
    // if (safeArea == '123'){
    //   this.statusH = 0
    // } else {
    //   this.statusH = (safeArea / size)
    // }
    //ios底部安全区域
    let saveBottom = (dsBridge.call("receiveParams", 'safeAreaBottom1'))
    if (saveBottom == '123'){
      this.bot = 0
    } else {
      this.bot = (saveBottom / size)
    }
  },
  mounted () {
    apiHttp.underShopGoodsList(this.$route.query.spid).then(res => {
      if (res.code === 0) {
        this.goodsList = res.data.list
      }
    })
    this.getInfo()
  },
  methods: {
    // 去商品详情
    toGoodsDetail(id){
      dsBridge.call("open", {url: window.location.origin +'/uqWeb/html/oto_details/otoDetails.html?id=' + id,type: 'web'})
    },
    // 我要买单
    payBill () {
      this.$http.post('amoy/user/user-info',{},true).then(res=>{
        // console.log("绑定手机号：",res)
        if(!res.data.mobile && this.$codeVersion>=300){
          this.$vux.confirm.show({
            content: '还未绑定手机号，快去绑定吧~',
            confirmText: '去绑定',
            showCancelButton: false,
            onConfirm : () => {
              //跳转到原生页面 
              this.jumpTo('/judgemobile')
            }
          })
        }else {
          // console.log(this.shopInfo.id)
          this.jumpTo('/mall/payUnder?spid='+this.shopInfo.id)
        }
      })
    },
    // 我的优惠券
    mycoupon(){
      // dsBridge.call("open", { url: Http.HOST+'/uqWeb/html/order_form_all/order_small_store.html', type: 'web' })
      dsBridge.call("open",{url :window.location.origin + '/uqWeb/html/oto_details/myCoupon.html', type: 'web'})
    },
    getInfo () {
      apiHttp.underShopInfo(this.$route.query.spid).then(res => {
        if (res.code === 0) {
          this.isShow = true
          this.data = res.data
          this.shopInfo = res.data.shopInfo
          this.addressUrl = res.data.addressUrl
          this.slides = res.data.slides
          this.userCard = res.data.userCard
          this.couponList = res.data.couponList
          this.shareInfo = res.data.shareInfo
          this.couponListyhq = res.data.couponList
          console.log("****",res.data)
        }
      })
    },
    getDrowList (id) {
        apiHttp.underDrawYhj(this.$route.query.spid, id).then(res => {
          if (res.code === 0){
            this.$vux.toast.text(res.msg )
            this.getInfo()
          }
        })
      },
    // 我的订单
    goorder(){
      // console.log(Http)
      dsBridge.call("open", { url: window.location.origin+'/uqWeb/html/order_form_all/order_small_store.html', type: 'web' })
      // dsBridge.call("open",{url :'http://'+ window.location.host+'/uqWeb/html/order_form_all/order_small_store.html', type: 'web'})
    },
    onIndexChange (index) {
      this.index = index
    },
    handlehuk (spid) {
      apiHttp.underHyCard(spid).then(res => {
        if (res.code === 0) {
          this.$vux.toast.text(res.msg)
          setTimeout(() => {
            this.jumpTo('/mall/hykCenter?spid=' + spid)
            //this.$router.push({name: 'mallHykCenter', query: {spid: spid}})
          }, 1500)
        }
      })
    },
    // 打电话
    handleCall (mobile) {
      dsBridge.call("contactService", {number: mobile})
    },
    // 去那里
    handleGo (addressUrl) {
      dsBridge.call("open", {url: addressUrl})
    },
    // 二维码
    handleQrcode (id) {
      apiHttp.underShopQrcodeCon(id).then(res => {
        if (res.code === 0) {
          this.isShowQrcode = true
          this.qrcodeInfo = res.data
        }
      })
    },
    handleClose () {
      this.isShowQrcode = false
    },
    moreshow () {
        this.gongnengsshow = true ;
        console.log(1)
    },
    morefunst () {
        this.gongnengsshow = false ;
    },
    kefu (bdsqurl){
      if(!bdsqurl){
        this.$vux.toast.text("暂无相关配置，请联系官方客服！")
      }else{
         dsBridge.call("open", { url: bdsqurl, type: 'web' })
      }
    },
    fenxiang_win (){
      let codeVersion = dsBridge.call('receiveParams', 'codeVersion')
      let userPhone = dsBridge.call("getUserPhone","")
      if( userPhone === '' || userPhone === null && codeVersion >= 300){
          dsBridge.call("toast", {msg: '您还未绑定手机号，请先去绑定！'})
          setTimeout(function(){
              dsBridge.call("openWin", '/judgemobile')
          },1000)
          return
      }else{
        this.fx_win = true;
      }
    },
    fx_win_del () {
      this.fx_win = false;
    },
    shareBar (type){
      let that = this
      let info = {
        title: that.shareInfo.title,
        description: that.shareInfo.desc,
        url: that.shareInfo.thumb,
        contentUrl: that.shareInfo.url,
        type: type
      }
      console.log(info)
      dsBridge.call("inviteShare", info, function(ret){})
    },
    yhqlq(){
      if(this.couponListyhq){
        this.popupDrawyhj = true
      }else{
          this.$vux.toast.text("暂无可领取优惠券！")
      }
    }
  }
}
</script>

<style lang="less" scoped>
.under_detail{
  height: 100%;
  display: flex;
  align-items: center;
  .detail_top{
    width: 100%;
    height: .88rem;
    background: #fff;
    position: absolute;
    top: 0;
    >div{
      height: .88rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fff;
      z-index: 498;
      .detail_top_left{
        margin-left: .3rem ;
        z-index: 501;
      }
      .detail_top_cen{
        font-size: .34rem;
        font-weight:bold;
        color:rgba(47,47,47,1);
        position: absolute; 
        width: 100%;
        text-align: center;
        z-index: 499;
      }
      .detail_top_rig{
        width: 1rem;
        height: .88rem;
        z-index: 500;
        img{
          width: .11rem;
          height: .44rem;
          margin: .22rem .45rem;
        }
      }
    }
  }
  .mescrollBox{
    width: 100%;
    position: absolute;
    top: 0.88rem;
    bottom: 1.2rem;
    height: auto !important;
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
.moregongneng{
  position: fixed;
  top: 0;
  width: 100%;
  height: 5.6rem;
  z-index: 999;
  // background:rgba(89,86,86,1);
  background: url(../../../assets/img/home/goods/bgbgmore.png) 0 0 no-repeat;
  background-size: 100% 5.6rem;
  .morebox_top{
    padding: 0 .3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: .9rem;
    div {
      font-size: .3rem;
      font-weight:500;
      color:rgba(255,255,255,1);
    }
    img{
      width: .3rem;
      height: .3rem;
    }
  }
  .morebox_core{
    display: flex;
    justify-content: space-between;
    padding: 0 .3rem;
    margin-top: .35rem;
    >div{
      width:1.5rem;
      height:1.68rem;
      background:rgba(26,27,32,1);
      border-radius:.2rem;
      img{
        width: .5rem;
        height: .5rem;
        margin:  .35rem .5rem .2rem .5rem;
      }
      div{
        text-align: center;
        font-size: .24rem;
        font-weight:500;
        color:rgba(255,255,255,1);
      }
    }
  }
}
 /* 分享弹框 */
        .share_platform{
          width: 100%;
          height: 100%;
          background:rgba(24,20,20,.5);
          z-index: 550;
          position: absolute;
          .fenxiang_win_bg{
            width: 100%;
            height: calc(100% - 3.8rem);
          }
          .shareType{
            width: 100%;
            height: 3.8rem;
            background: #fff;
            overflow: hidden;
            border-radius: .2rem .2rem 0 0;
            >p{
              text-align: center;
              font-size: .3rem;
              font-weight:500;
              color:rgba(47,47,47,1);
              height: .9rem;
              line-height: .9rem;
              border-bottom: .01rem rgba(238,238,238,1) solid;
            }
            ul{
              padding: 0 .5rem;
              display: flex;
              justify-content: space-between;
              margin-top: .32rem;
              li{
                img{
                  width: .98rem;
                  height: .98rem;
                }
                p{
                  text-align: center;
                  margin-top: .1rem;
                }
              }
            }
          }
        }
  .vux-popup-dialog.vux-popup-bottom.vux-popup-show{
    border-radius: .2rem .2rem 0 0;
    background: #fff;
    height: 7.2rem !important;
  }      
 .pppup_tit{
    width: 100%;
    height: 1.1rem;
    line-height: 1.1rem;
    text-align: center;
    font-size: .32rem;
    font-weight:500;
    color:rgba(47,47,47,1);
    z-index: 999999;
 }
 .pppup_yhq_box{
   padding: 0 .3rem ;
   max-height: 6.1rem;
   overflow-y: scroll; 
  //  overflow: hidden;
    z-index: 999999;
 }
 .pppup_yhq{
   width: 100%;
   height: 1.66rem;
   background: url(../../../assets/img/home/goods/yhqbg.png) 0 0 no-repeat;
   background-size: 6.9rem 1.66rem;
   margin-bottom: .3rem;
   overflow: hidden;
    .coupon-item{
      display: flex; 
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      -webkit-justify-content: space-between;
      justify-content: space-between;
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      align-items: center;
      .left{
            width:70%;
            display:flex;
            padding-left:.3rem;
            -ms-flex-direction: column;
            -webkit-flex-direction: column;
            flex-direction: column;
            -webkit-justify-content: center;
            justify-content: center;
            overflow: hidden;
            .price{
            font-size:.5rem;
            font-weight:bold;
            color:#D92124;
            height: 0.5rem;
            margin-top: .1rem ;
            span:nth-child(1){
              font-size:.34rem
            }
            span:nth-child(2){
              font-size: .22rem;
              font-weight:500;
              color:rgba(217,33,36,1);
              padding: .02rem .08rem;
              border: .01rem solid rgba(218,35,34,1);
              border-radius: .05rem;
              margin-left: .15rem;
              margin-bottom: .05rem;
              position: relative;
              top: -.08rem;
            }
          }
          .goodsName{
            font-size:.26rem;
            color:#2f2f2f;
            margin-top: .1rem ;
          }
          .time{
            // height: .23rem;
            font-size:.22rem;
            color:#999
          }
        }
        .right{
            width:30%;
            height: 1.66rem;
            position: relative;
            p{
            width:100%;
            height: 1.66rem;
            line-height: 1.66rem;
            text-align:center;
            font-size:.3rem;
            color:#D92124;
            font-weight:bold;
            margin-bottom: -.15rem;
          }
          img{
            width: .88rem;
            height: .77rem;
            position: absolute;
            bottom: 0;
            right: 0;
          }
        }
    }
 }       
</style>
