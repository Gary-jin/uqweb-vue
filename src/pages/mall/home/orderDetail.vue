<template>
  <div class="firmOrder_main orderDetail_main" v-if="isShow">
    <div class="header">
      <div class="title">
            <div  class="top_back" @click="goBack()"><i class="iconfont icon-back"></i></div>
            <div class="title_text">订单详情</div>
        </div>
    </div>
    <div class="mescrollBox">
      <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
      <div class="content" style="margin-top: 0">
        <div class="content_status">
          <!-- <div class="left">{{status.title}}</div> -->
           <div class="left">{{site.statusInfo}}</div>
        </div>
        <div>
          <div class="content_main">
            <div class="list">
              <!-- <div class="header">
                <img :src="obj.shopInfo ? obj.shopInfo.logo : './static/img/under/111.png'" alt="">
                <span>{{obj.order ? obj.order.shopName : ''}}</span>
              </div> -->
              <div class="order_core_site">
                <div class="order_core_site_left">
                    <img :src="'./static/img/under/daifahuo.png'" alt="">
                    <div class="order_core_site_cen">
                        <div>{{status.title}}</div>
                        <div>{{obj.order ? parseInt(obj.order.created_at) : 0 | formatDate}}</div>
                    </div>
                </div>
                <img class="newimgadd" @click='logistics(obj.order.orderSn,obj.order.expressNo)' :src="'./static/img/under/new_address.png'" alt="">
            </div>
            <div class="order_core_site2">
                <div class="order_core_site_left">
                    <img :src="'./static/img/under/site_t.png'" alt="">
                    <div>
                        <div class="site_name">
                            <div>{{site.username}}</div>
                            <div>{{site.mobile}}</div>
                        </div>
                        <div class="site_name_site">{{site.province+site.city+site.district+site.address}}</div>
                    </div>
                </div>
            </div>
          </div>
        </div>  
        <div class="content_main">
          <div class="list">
            <div class="order_core_center">
                <div class="order_core_center_box"  v-for="(item,index) in obj.goodsList" :key="index" @click="jumpTo('/mall/homeDetail?title='+item.goodsId)">
                    <div class="order_center_pic" :style="{background: `url(${item.thumb})50% 50% / cover no-repeat`}"></div>
                    <div class="order_center_rig">
                        <div class="order_text_top">{{item.goodsName}}</div>
                        <div class="order_text_cen">{{item.goodsField}}</div>
                        <div class="order_text_bot"><span>￥{{item.goodsPrice}}</span><span>x{{item.goodsNum}}</span></div>
                    </div>
                </div>
                <div class="refund">
                  <div class="btns btn1s" v-if="payStatus === '1'  && obj.order.model != 'bargain' && (obj.order.orderStatus === '1' || obj.order.orderStatus === '0') " @click="jumpTo('/mall/exchange?orderSn='+obj.order.orderSn)">申请退货</div>
                  <div class="btns" v-if="payStatus === '1' && obj.order.orderStatus === '1'" @click="receipt(obj.order.orderSn)">确认收货</div>
                  <div class="btns btn1s" v-if="payStatus === '0' && obj.order.orderStatus === '0'" @click="handShow(obj.order.orderSn)">取消订单</div>
                  <div class="btns" v-if="payStatus === '0' && obj.order.orderStatus === '0'" @click="jumpTo('/mall/payMent?orderId='+obj.order.orderId)">去支付</div>
                  <div class="btns" v-if="payStatus === '1' && obj.order.orderStatus === '2' && obj.order.isDiscuss == 0" @click="jumpTo('/mall/appraise?orderSn='+obj.order.orderSn)">去评价</div>
                </div>
                <div class="order_core_sum">
                    <div class="order_core_sum_box">
                        <div class="order_sum">
                            <div>商品金额</div>
                            <div>￥{{obj.goodsList[0].goodsPrice*obj.goodsList[0].goodsNum}}</div>
                        </div>
                        <div class="order_sum">
                            <div>优惠</div>
                            <div class="order_discounts">-￥{{obj.order.payPrice - obj.goodsList[0].goodsPrice*obj.goodsList[0].goodsNum }}</div>
                        </div>
                    </div>
                </div>
                <div class="order_freight">
                    <div class="order_freight_box">
                        <div>运费</div>
                        <div>￥{{obj.order ? obj.order.postagePrice : ''}}</div>
                    </div>
                </div>
                <div class="order_freight2">
                    <div class="order_freight_box">
                        <div>实付金额</div>
                        <div>￥{{obj.order ? obj.order.payPrice : ''}}</div>
                    </div>
                </div>
            </div>
           </div>
        </div>  
        <div class="content_main">
          <div class="list">
            <div class="order_core_bottom">
                <div class="order_core_bottom_tit"><div>订单信息</div></div>
                <div class="order_details">
                    <div class="order_details_box">
                        <div class="order_details_box_row">
                            <div>订单编号</div>
                            <div class="order_box_row">
                                <div> {{obj.order ? obj.order.orderId: ''}}</div>&nbsp;
                                <img :src="'./static/img/under//copy_id.png'" @click="onCopy(obj.order.orderId)" alt="">
                            </div>
                        </div>
                        <div class="order_details_box_row">
                            <div>创建时间</div>
                            <div>{{obj.order ? parseInt(obj.order.created_at) : 0 | formatDate}}</div>
                        </div>
                        <div class="order_details_box_row">
                            <div>支付方式</div>
                            <div>{{obj.order ? obj.order.payTypeInfo : ''}}</div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
  </div>
  </mescroll-vue>
</div>
</div>
</template>

<script>
import { Confirm } from 'vux'
import list from '../../../components/list'
import * as apiHttp from '../../../api/index'
import {formatDate} from '../../../plugin/data'
import MescrollVue from 'mescroll.js/mescroll.vue'
import Clipboard from 'clipboard'
export default {
  name: 'orderDetail',
  components: {
    list,
    Confirm,
    MescrollVue
  },
  data () {
    return {
      shopList: [],
      obj: {},
      site:[],
      status: {},
      order: null,
      showquxiao: false,
      payStatus: '',
      page: 1,
      isShow: false,
      mescroll: null,
      mescrollDown: {
        auto: false,
        callback: this.refresh
      },
      mescrollUp: {
        callback: this.upCallback,
        page: {
          num: 0
        },
        htmlNodata: '<p class="upwarp-nodata">—— 我也是有底线的 ——</p>',
        noMoreSize: 5,
        toTop: {
          src: './static/img/auth/back_top.png',
          offset: 1000
        },
        empty: {
          warpId: '',
          icon: '',
          tip: '暂无相关订单~'
        }
      }
    }
  },
  filters: {
    formatDate (time) {
      time = time * 1000
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  mounted: function () {
    // 删除
    this.getDtails()
  },
  methods: {
    getDtails () {
      apiHttp.orderDetaiil(this.$route.query.order).then(response => {
        if (response.code === 0) {
          this.isShow = true
          this.obj = response.data
          this.site = response.data.order
          console.log(this.site.statusInfo)
          this.payStatus = response.data.order.payStatus
          if (response.data.order.payStatus === '1') {
            switch (response.data.order.orderStatus) {
              case '-3':
                this.status = {title: '申请退货', img: './static/libs/img/tuihuo.png'}
                break
              case '-4':
                this.status = {title: '已退货', img: './static/libs/img/tuihuo.png'}
                break
              case '0':
                this.status = {title: '待发货', img: './static/libs/img/daifahuo.png'}
                break
              case '1':
                this.status = {title: '待收货', img: './static/libs/img/yifukuan.png'}
                break
              case '2':
                this.status = {title: '已完成', img: './static/libs/img/order_status.png'}
                break
            }
          } else {
            this.status = {title: '待付款', img: './static/libs/img/yifukuan.png'}
          }
        }
      })
    },
    mescrollInit (mescroll) {
      this.mescroll = mescroll
    },
    upCallback (page, mescroll) {
      apiHttp.indexListSpid(this.obj.shopInfo.id, page.num).then(res => {
        if (res.code === 0) {
          let arr = res.data.list === '' ? [] : res.data.list
          if (page.num === 1) this.shopList = []
          this.shopList = this.shopList.concat(arr)
          console.log(this.shopList)
          this.$nextTick(() => {
            mescroll.endSuccess(res.data.list.length, true)
          })
        }
      }).catch((e) => {
        mescroll.endErr()
      })
    },
    refresh: function () {
      this.getDtails()
      this.mescrollUp.page.num = 1
      this.upCallback(this.mescrollUp.page, this.mescroll)
    },
    receipt (order) {
      this.order = order
      this.$http.post('/mall/order/confirm-order?i=1', {orderSn: this.order}).then(res => {
        this.$vux.toast.text(res.msg)
        this.getDtails()
      })
    },
    handShow (order) {
      this.order = order
      this.showquxiao = true
    },
    confirm1 () {
      apiHttp.orderRemove(this.order).then(response => {
        if (response.code === 0) {
          this.showquxiao = false
          this.$vux.toast.text('取消成功')
          this.jumpTo('/mall/fixing_order')
        }
      })
    },
    // 复制
    onCopy (orderSn) {
      dsBridge.call('clipBoard', {value: orderSn})
    },
    logistics(orderSn,ifno) {
      if(ifno){
        dsBridge.call("open",{url : window.location.origin+'/uqWeb/html/bargain/order_course.html?orderSn='+orderSn, type: 'web'})
        //  window.location.href = 'http://172.16.1.239:3000/uqWeb/html/bargain/order_course.html?orderSn='+orderSn
       }else{
         this.$vux.toast.text('此订单没有订单物流信息！')
       }
    }
  }
}

</script>

<style lang="less">
  .orderDetail_main{
    .mescrollBox {
      width: 100%;
      position: absolute;
      top: .9rem;
      bottom: 0;
      height: auto !important;
    }
  }
 .order_core_site{
    height: 1rem;
    margin-top: .2rem;
    background: #fff;
    display: flex;
    justify-content: space-between;
    // padding: 0 .31rem 0 .42rem;
    border-bottom: .01rem rgba(238,238,238,1) solid; 
    .newimgadd{
      width: .18rem;
      height: .32rem;
      margin-top: .42rem;
    }
    .order_core_site_left{
      display: flex;
      img{
        width: .28rem;
        height: .28rem;
        margin-top: .22rem;
      }
      .order_core_site_cen{
        margin-left: .12rem;
        div:nth-child(1){
          margin-top: .13rem;
            font-size: .3rem;
            font-weight:500;
            color:rgba(47,47,47,1);
        }
        div:nth-child(2){
            // margin-top: .05rem;
            font-size: .24rem;
            font-weight:500;
            color:rgba(153,153,153,1);
        }
      }
    }
  }
  .order_core_site2{
    height: 1.8rem;
    display: flex;
    justify-content: space-between;
    // padding: 0 .31rem 0 .42rem;
    .order_core_site_left{
      display: flex;
      img{
        width: .28rem;
        height: .28rem;
        margin-top: .36rem;
      }
      >div{
        .site_name{
          display: flex;
          margin-top: .28rem;
          margin-left:  .12rem;
          div:nth-child(1){
            max-width: 4.04rem;
            font-size: .3rem;
            font-weight: 500;
            color:rgba(47,47,47,1);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          div:nth-child(2){
            font-size: .3rem;
            font-weight:500;
            color:rgba(47,47,47,1);
            line-height: .5rem;
            margin-left: .16rem;
            // position: relative;
            // top: -.05rem;
          }
        }
        .site_name_site{
          width:6.07rem;
          height:.61rem;
          font-size:.26rem;
          margin-top: .1rem;
          font-weight:500;
          color:rgba(102,102,102,1);
        }
      }
    }
  }
  .order_core_center{
    .order_core_center_box{
        height: 2.34rem;
        display: flex;
        border-bottom: .01rem rgba(238,238,238,1) solid;
        box-sizing: border-box;
        .order_center_pic{
            width:1.74rem;
            height:1.74rem;
            border-radius: .05rem;
            margin-top: .3rem;
        }
        .order_center_rig{
          margin-left: .22rem;
          margin-top: .34rem;
          .order_text_top{
            width:4.79rem;
            height:.67rem;
            font-size:.28rem;
            font-weight:500;
            color:rgba(47,47,47,1);
            line-height:.36rem;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .order_text_cen{
            font-size: .24rem;
            font-weight:500;
            color:rgba(153,153,153,1);
            margin-top: .18rem;
          }
          .order_text_bot{
            display: flex;
            justify-content: space-between;
            margin-top: .15rem;
              span:nth-child(1){
                font-size: .32rem;
                font-weight:bold;
                color:rgba(217,43,36,1);
              }
              span:nth-child(2){
                font-size: .28rem;
                font-weight:500;
                color:rgba(153,153,153,1);
              }
        }
        }
    }
     .order_core_sum{
        width: 100%;
        height: 1.4rem;
        border-bottom: .01rem rgba(238,238,238,1) solid;
        box-sizing: border-box;
        .order_core_sum_box{
            height: 1.4rem;
            padding: 0 .3rem;
            /* display: flex;
            flex-direction: column;
            justify-content: space-evenly; */
            .order_sum{
            display: flex;
            justify-content: space-between;
            margin-top: .3rem;
            >div{
            font-size: .28rem;
            font-weight:500;
            color:rgba(47,47,47,1);
              .order_discounts{
                color:rgba(217,43,36,1);
              }
            }
          }
        }
      }
      .order_freight{
        width: 100%;
        height: .9rem;
        border-bottom: .01rem rgba(238,238,238,1) solid;
        box-sizing: border-box;
        .order_freight_box{
            height: .9rem;
            padding: 0 .3rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            div{
              font-size: .28rem;
              font-weight:500;
              color:rgba(47,47,47,1);
            }
        }
      }
      .order_freight2{
        width: 100%;
        height: .9rem;
        .order_freight_box{
            height: .9rem;
            padding: 0 .3rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            div{
            font-size: .28rem;
            font-weight:500;
            color:rgba(47,47,47,1);
          }
        }
      }
  }
  .order_core_bottom{
    margin-bottom: .35rem;
    .order_core_bottom_tit{
      width: 100%;
      height: .7rem;
      border-bottom: .01rem rgba(238,238,238,1) solid;
      box-sizing: border-box;
      background: #fff;
      display: flex;
      align-items: center;
       div{
            padding-left: .3rem;
        }
    }
    .order_details{
      widows: 100%;
      height: 1.9rem;
      background: #fff;
      .order_details_box{
          padding: 0 .3rem;
          // height: 1.9rem;
          /* display: flex;
          flex-direction: column;
          justify-content: space-evenly; */
          // overflow: hidden;
          .order_details_box_row{
            margin-top: .2rem;
            margin-bottom: .2rem;
            display: flex;
            justify-content: space-between;
              >div:nth-child(1){
                font-size: .28rem;
                font-weight:500;
                color:rgba(102,102,102,1);
              }
              >div:nth-child(2){
                font-size: .28rem;
                font-weight:500;
                color:rgba(47,47,47,1);
                height: .37rem;
                display: flex;
                align-items: center;
                img{
                  width: .66rem;
                  height: .3rem;
                  /* position: relative; */
                  /* bottom: -.02rem;  */
                }
              }
          }
        }
    }
  }
</style>
