<template>
  <div class="under_order">
   <div id="vue-app" >
        <div class="title">
            <img src="../../../assets/img/sign/back.png" alt="" @click='onBack'>
            <div class="title_text">订单详情</div>
            <img @click="handbdsq(shopInfo.bdsqUrl)" src="../../../assets/img/sign/nouncc.png" alt="">
        </div>
        <div v-if="order.orderStatus == '2'" class="oto_details_core">
            <div class="oto_top">订单已完成</div>
            <div class="oto_top_t">感谢您的光临！欢迎下次购买</div>
        </div>
        <!-- 配送中 -->
        <div v-else class="oto_datails">
            <div class="datails_code_tit">{{ordernow}}</div>
            <div class="datails_code_core">
                <img src="../../../assets/img/sign/code.png" alt="">
                <div>
                    <div class="datails_code_qu">取货码</div>
                    <div class="datails_code_num">{{bdelete}}</div>
                    <div class="datails_code_pic" :style="{background: `url(${qrcodeInfo.qrcode})50% 50% / cover no-repeat`}"></div>
                </div>
            </div>
        </div>
        <div class="oto_details_coreed">
            <div class="oto_details_core_box">
                <div class="oto_details_core_box_top"  @click="jumpTo('/mall/Underdetail?spid='+ shopInfo.id)">
                    <div class="core_top_l">
                        <div class="oto_details_top_pic" :style="{background: `url(${shopInfo.logo})50% 50% / cover no-repeat`}"></div>
                        <div class="oto_details_top_name">{{shopInfo.title}}</div>
                    </div>
                    <img src="../../../assets/img/sign/new_address.png" alt="">
                </div>
                <!-- <div class="order_core_center_box" @click="jumpTo('/mall/underGoodsDetails?goodsId='+ goodsList.goodsId)"> -->
                <div class="order_core_center_box" @click="toGoodsDetail(goods.id)">
                    <div class="order_center_pic" :style="{background: `url(${goodsList.thumb})50% 50% / cover no-repeat`}"></div>
                    <div class="order_center_rig">
                        <div class="order_text_top">
                            <div>{{goodsList.goodsName}}</div>
                            <div>￥{{goodsList.goodsPrice}}</div>
                        </div>
                        <div class="order_text_cen">{{goodsList.goodsField}}</div>
                        <div class="order_text_bot">x{{goodsList.goodsNum}}</div>
                    </div>
                </div>
                <div v-show="false" class="order_core_center_button">
                    <div class="pingjia">去评价</div>
                </div>
                <div class="order_core_center_button" @click="jumpTo('/mall/under_exchange?orderSn=' + order.orderSn)" v-if="order.orderStatus == 1 || order.orderStatus == 0">
                    <div class="tuikuan">申请退款</div>
                </div>
                <div v-if="order.model == 'oto' && order.couponPrice > 0" class="discount_coupon">
                    <div>商家代金券优惠</div>
                    <div>-￥{{order.couponPrice}}</div>
                </div>
                <div class="summation">
                    <div></div>
                    <div></div>
                    <div>合计:￥</div>
                    <div>{{order.payPrice}}</div>
                </div>
            </div>
        </div>
        <div class="call_hotel" @click="handleCall(shopInfo.mobile)">
            <img src="../../../assets/img/sign/call.png" alt="">
            <div>致电商家</div>
        </div>
        <div class="order_core_bottom">
                <div class="order_core_bottom_tit"><div>订单信息</div></div>
                <div class="order_details">
                    <div class="order_details_box">
                        <div class="order_details_box_row">
                            <div v-if="order.wayType == 1">配送订单</div>
                            <div v-else>自提订单</div>
                            <div class="order_box_row">
                                <div>{{order.orderId}}</div>&nbsp;
                                <img @click="onCopy(order.orderId)" src="../../../assets/img/sign/copy_id.png" alt="">
                            </div>
                        </div>
                        <div class="order_details_box_row">
                            <div>创建时间</div>
                            <div>{{order.paytime | formatDate}}</div>
                        </div>
                        <div class="order_details_box_row">
                            <div>支付方式</div>
                            <div>{{order.payTypeInfo}}</div>
                        </div>
                        <div class="order_details_box_site" v-if="order.wayType == 1">
                            <div>配送地址</div>
                            <div>{{order.province+order.city+order.district+order.address+" "+order.username+order.mobile}}</div>
                        </div>
                    </div>
                </div>
            </div>
    </div>
    
  </div>
</template>

<script>
  import * as apiHttp from '../../../api/index'
  import {formatDate} from '../../../plugin/data'
  import Clipboard from 'clipboard'
  import { Toast } from 'vux'
  import './underLess1.less'
  export default {
    components: {
      Toast
    },
    data () {
      return {
        data: {},
        goodsList: {},
        order: {},
        shopInfo: {},
        isShow: false,
        isShowQrcode: false,
        qrcodeInfo: {},
        orderStatusInfo: [],
        orderStatusInfos: [],
        ordernow: '',
        bdelete: ''
      }
    },
    filters: {
      formatDate (time) {
        time = time * 1000
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    created (){
        apiHttp.orderDetaiil(this.$route.query.orderSn).then(res => {
        if (res.code === 0) {
          this.isShow = true
          this.data = res.data
          this.goodsList = res.data.goodsList[0]
          this.order = res.data.order
          this.shopInfo = res.data.shopInfo
          this.orderStatusInfo = res.data.orderStatusInfo
          this.orderStatusInfos = res.data.orderStatusInfos
          this.ordernow = this.orderStatusInfos[this.order.wayType][this.order.orderStatus]
          this.bdelete = this.order.bdelete.replace(/\s/g,'').replace(/(.{4})/g,"$1 ")
          if(this.order.orderStatus == "0"||this.order.orderStatus == "1"){
            this.handleQrcode(this.order.orderSn)
          }
        }
      })
    },
    mounted () {
    //   apiHttp.orderDetaiil(this.$route.query.orderSn).then(res => {
    //     if (res.code === 0) {
    //       this.isShow = true
    //       this.data = res.data
    //       this.goodsList = res.data.goodsList[0]
    //       this.order = res.data.order
    //       this.shopInfo = res.data.shopInfo
    //       this.orderStatusInfo = res.data.orderStatusInfo
    //       this.orderStatusInfos = res.data.orderStatusInfos
    //       this.ordernow = this.orderStatusInfos[this.order.wayType][this.order.orderStatus]
    //       this.bdelete = this.order.bdelete.replace(/\s/g,'').replace(/(.{4})/g,"$1 ")
    //       if(this.order.orderStatus == "0"||this.order.orderStatus == "1"){
    //         this.handleQrcode(this.order.orderSn)
    //       }
    //     }
    //   })
    },
    methods: {
        // 去商品详情
        toGoodsDetail(id){
        dsBridge.call("open", {url: window.location.origin +'/uqWeb/html/oto_details/otoDetails.html?id=' + id,type: 'web'})
        },
      onBack: function (ret, err) {
        dsBridge.call('closeWin')
      },
      // 二维码
      handleQrcode (orderSn) {
        apiHttp.underOrderQrcodeCon(orderSn).then(res => {
          if (res.code === 0) {
            this.isShowQrcode = true
            this.qrcodeInfo = res.data
          }
        })
      },
      // 百度商桥
      handbdsq(url){
        if(!url){
            this.$vux.toast.text("暂无相关配置，请联系官方客服！")
        }else{
            dsBridge.call("open", { url: url, type: 'web' })
        }
      },
        //   打电话
      handleCall (mobile) {
        if(!mobile){
           this.$vux.toast.text('暂无相关配置，请联系官方客服！')
        }else{
          dsBridge.call("contactService", {number: mobile})
        }
      },
      // // 复制
      onCopy (val) {
        dsBridge.call('clipBoard', {value: val})
      },
      // handleClose () {
      //   this.isShowQrcode = false
      // }
    }
  }
</script>

<style lang="less" scoped>
        body {
            background: #f7f7f7;
        }

        .title {
            position: fixed;
            top: 0;
            width: 100%;
            height: .88rem;
            background: #fff;
            display: flex;
            align-items: center;
            z-index: 9;
        }

        .title>img:nth-child(1) {
            height: .32rem;
            width: auto;
            margin-left: .3rem;
            margin-right: 2.43rem;
        }

        .title_text {
            width: 1.68rem;
            height: .33rem;
            font-size: .34rem;
            font-weight: bold;
            color: rgba(47, 47, 47, 1);
            line-height: .36rem;
            white-space: nowrap;
        }
        .title>img:nth-child(3){
            width: .44rem;
            height: .4rem;
            margin-left: 1.95rem;
        }

        .oto_details_core{
            padding: 0 .3rem;
            margin-top: .88rem;
            height: 1.7rem;
            overflow: hidden;
        }
        .oto_details_core .oto_top{
            margin-top: .35rem;
            font-size: .44rem;
            font-weight:500;
            color:rgba(47,47,47,1);
        }
        .oto_details_core .oto_top_t{
            margin-top: .13rem;
            font-size: .32rem;
            font-weight:500;
            color:rgba(153,153,153,1);
        }
        /* 配送中 */
        .oto_datails{
            height: 5.25rem;
            margin-top: .88rem;
            overflow: hidden;
        }
        .oto_datails .datails_code_tit{
            font-size: .44rem;
            font-weight:500;
            color:rgba(47,47,47,1);
            margin-left: .3rem;
            height: 1rem;
            line-height: 1rem;
        }
        .oto_datails .datails_code_core{
            width: 100%;
            height: 4rem;
            position: relative;
        }
        .oto_datails .datails_code_core>img{
            width: 3.8rem;
            height: 4rem;
            margin-left: 1.84rem;
        }
        .oto_datails .datails_code_core>div{
            width: 3.8rem;
            height: 4rem;
            position: absolute;
            top: 0;
            left: 1.84rem;
        }
        .oto_datails .datails_code_core>div .datails_code_qu{
            font-size: .24rem;
            font-weight:500;
            color:rgba(153,153,153,1);
            margin-top: .18rem ;
            text-align:center ;
        }
        .oto_datails .datails_code_core>div .datails_code_num{
            font-size: .48rem;
            font-weight:bold;
            color:rgba(217,33,33,1);
            text-align:center ;
            /* margin-top: .07rem; */
        }
        .oto_datails .datails_code_core>div .datails_code_pic{
            width: 2.08rem;
            height: 2.08rem;
            /* background: #000; */
            margin: .35rem auto 0;
        }
        /* 配送中end */
        .oto_details_coreed{
            background: #fff;
            padding: 0 .3rem;
        }
        .oto_details_core_box{

        }
        .oto_details_core_box_top{
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: .88rem;
            border-bottom:  .01rem rgba(238,238,238,1) solid;
        }
        .oto_details_core_box_top .core_top_l{
            display: flex;
            align-items: center;
        }
        .oto_details_core_box_top .core_top_l .oto_details_top_pic{
            width: .42rem;
            height: .42rem;
            background: rebeccapurple;
            margin-right: .1rem;
        }
        .oto_details_core_box_top .core_top_l .oto_details_top_name{
            font-size: .32rem;
            font-weight:bold;
            color:rgba(47,47,47,1);
            width: 5.88rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .oto_details_core_box_top >img{
            width: .18rem;
            height:  .32rem;
        }

        .order_core_center_box{
            padding-top: .25rem;
            display: flex;
            box-sizing: border-box;
            margin-bottom: .25rem;
        }
        .order_core_center_box .order_center_pic{
            width:1.74rem;
            height:1.74rem;
            border-radius: .05rem;
        }
        .order_core_center_box .order_center_rig{
            margin-left: .22rem;
        }
        .order_center_rig .order_text_top{
            width:4.79rem;
            font-size:.28rem;
            font-weight:500;
            color:rgba(47,47,47,1);
            display: flex;
            justify-content: space-between;
        }
        .order_center_rig .order_text_top >div:nth-child(1){
            width: 3.1rem;
            font-size: .28rem;
            font-weight:500;
            color:rgba(47,47,47,1);
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }
        .order_center_rig .order_text_top >div:nth-child(2){
            font-size: .32rem;
            font-weight:bold;
            color:rgba(47,47,47,1);
        }
        .order_center_rig .order_text_cen{
            font-size: .24rem;
            font-weight:500;
            color:rgba(153,153,153,1);
            margin-top: .12rem;
        }
        .order_center_rig .order_text_bot{
            margin-top: .1rem;
            font-size: .28rem;
            font-weight:500;
            color:rgba(153,153,153,1);
        }
        .order_core_center_button{
            display: flex;
            justify-content: flex-end;
            margin-top: .02rem ;
            border-bottom:  .01rem rgba(255,255,255,1) solid;
        }
        .order_core_center_button .pingjia {
            height: .52rem;
            padding: 0 .23rem;
            border-radius: .26rem;
            border:  .01rem solid rgba(217,33,33,1);
            color: rgba(217,33,33,1) ;
            line-height: .52rem;
            margin-bottom: .2rem;
        }
        .order_core_center_button .tuikuan {
            height: .52rem;
            padding: 0 .23rem;
            border-radius: .26rem;
            border:  .01rem solid rgba(153,153,153,1);
            color: rgba(153,153,153,1) ;
            line-height: .52rem;
            margin-bottom: .2rem;
        }
        .discount_coupon{
            height: .88rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: .01rem rgba(238,238,238,1) solid;
            border-bottom: .01rem rgba(238,238,238,1) solid;
        }
        .discount_coupon div:nth-child(1){
            font-size: .28rem;
            font-weight:500;
            color:rgba(102,102,102,1);
        }
        .discount_coupon div:nth-child(2){
            font-size: .3rem;
            font-weight:bold;
            color:rgba(47,47,47,1);
            border-bottom:  .01rem rgba(255,255,255,1) solid;
        }
        .summation{
            height: 1.08rem;
            display: flex;
            justify-content: flex-end;
            align-items: center;
        }
        .summation div:nth-child(1),div:nth-child(3){
            font-size: .28rem;
            font-weight:500;
            color:rgba(47,47,47,1);
        }
        .summation div:nth-child(2){
            font-size: .3rem;
            font-weight:500;
            color:rgba(217,33,33,1);
            margin-right: .2rem;
        }
        .summation div:nth-child(4){
            font-size: .44rem;
            font-weight: bold;
            color:rgba(47,47,47,1);
        }
        .call_hotel{
            height: .75rem;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .call_hotel >img{
            width: .28rem;
            height:  .28rem;
            margin-right: .1rem;
        }
        .call_hotel >div{
            font-size: .28rem;
            font-weight:500;
            color:rgba(47,47,47,1);
        }
        /* order_core_bottom */
        .order_core_bottom{
            margin-bottom: .35rem;
        }
        .order_core_bottom .order_core_bottom_tit{
            width: 100%;
            height: .7rem;
            border-bottom: .01rem rgba(238,238,238,1) solid;
            box-sizing: border-box;
            background: #fff;
            display: flex;
            align-items: center;
        }
        .order_core_bottom .order_core_bottom_tit div{
            padding-left: .3rem;
        }
        .order_core_bottom .order_details{
            width: 100%;
            height: auto;
            background: #fff;
        }
        .order_details .order_details_box{
            padding: 0 .3rem;
            overflow: hidden;
        }
        .order_details_box .order_details_box_row{
            margin-top: .2rem;
            display: flex;
            justify-content: space-between;
        }
        .order_details_box .order_details_box_row>div:nth-child(1){
            font-size: .28rem;
            font-weight:500;
            color:rgba(102,102,102,1);
        }
        .order_details_box .order_details_box_row>div:nth-child(2){
            font-size: .28rem;
            font-weight:500;
            color:rgba(47,47,47,1);
        }
        .order_details_box .order_details_box_row .order_box_row{
            height: .37rem;
            display: flex;
            align-items: center;
        }
        .order_details_box .order_details_box_row .order_box_row img{
            width: .66rem;
            height: .3rem;
        }
        .order_details_box .order_details_box_site{
            margin-top: .2rem;
            display: flex;
            justify-content: space-between;
            background: #fff !important;
        }
        .order_details_box .order_details_box_site>div:nth-child(1){
            font-size: .28rem;
            font-weight:500;
            color:rgba(102,102,102,1);
        }
        .order_details_box .order_details_box_site>div:nth-child(2){
            width: 5rem;
            font-size: .28rem;
            font-weight:500;
            text-align: right;
            color:rgba(102,102,102,1);
        }
</style>
