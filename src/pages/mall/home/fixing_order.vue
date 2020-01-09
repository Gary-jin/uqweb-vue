<template>
  <div class="fixing_order">
    <div class="header">
      <x-header
        slot="header"
        :left-options="{showBack: false}"
      >
        <a @click="goBack()" slot="left" class="backBox"><i class="iconfont icon-back"></i></a>
        订单
      </x-header>
      <div class="tab">
        <tab :line-width=2 active-color='#fc3357' height="700px" custom-bar-width=".8rem"  v-model="index">
          <tab-item class="vux-center"   :selected="selectIndex == ind" v-for="(item, ind) in tab"
                    @on-item-click="getListIn(item.sort)" :key="ind">{{item.title}}
          </tab-item>
        </tab>
      </div>
    </div>
    <confirm
      v-model="show"
      :close-on-confirm="false"
      @on-confirm="confirm">
      <p style="text-align:center;">您确定要删除？</p>
    </confirm>
    <confirm
      v-model="showquxiao"
      :close-on-confirm="false"
      @on-confirm="confirm1">
      <p style="text-align:center;">您确定要取消该订单？</p>
    </confirm>
    <div class="mescrollBox">
      <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
        <div class="content">
          <div id="d9">
            <div class="content_main" v-for="(items,index) in shopList" :key="index">
              <div class="list">
                <div class="header_main">
                  <div class="left" @click="toMallShop(items.spid)">
                    <img :src="items.logo || './static/img/under/111.png'" alt="">
                    <span>{{items.shopName}}</span>
                  </div>
                  <div class="right">
                    <span>{{items.statusInfo}}</span>
                    <i v-show="items.statusInfo == '已取消' ? true : false" class="iconfont icon-shanchu" style="font-size: 0.5rem;vertical-align: middle;" @click="handDelete(index,items.orderSn)"></i>
                  </div>
                </div>
                <div class="mail"  @click="handDetail(items.orderSn,items.orderStatus)" v-for="(item, index) in items.goodsList" :key="index">
                  <div class="left">
                    <img :src="item.thumb || './static/img/under/111.png'" alt="">
                  </div>
                  <div class="right">
                    <div class="div1">
                      {{item.goodsName}}
                    </div>
                    <div class="div2">
                      <div>
                        {{item.goodsField}}
                      </div>
                      <div>
                        ×{{item.goodsNum}}
                      </div>
                    </div>
                    <div class="div3">
                      <div class="price_main"><span>¥</span>{{item.goodsPrice}}</div>
                    </div>
                  </div>
                </div>
                <div class="price">
                  <label>共{{items.goodsNum}}件商品，合计: </label><span>¥</span>{{items.payPrice}}
                </div>
                <div class="status" v-if="items.payStatus == 0">
                  <div v-if="items.orderStatus == 0" class="btn1" @click="handShow(index,items.orderSn)">取消订单</div>
                  <div v-if="items.orderStatus == -1" class="btn" @click="handDelete(index,items.orderSn)">删除订单</div>
                  <div class="btn" v-if="items.orderStatus == 0" @click="jumpTo('/mall/payMent?orderId='+items.orderId)">去支付</div>
                </div>
                <div class="status" v-if="items.shopOrderStatus == 1 && items.orderStatus == -3">
                  <div class="btn" @click="jumpTo('/mall/exchange?orderSn='+items.orderSn+'status='+'-4')">补交资料</div>
                </div>
                <div class="status" v-if="items.orderStatus == -3 && items.shopOrderStatus == 0">
                  <div>等待商家审核</div>
                </div>
                <div class="status" v-if="items.payStatus == 1&&items.orderStatus == 0 && ( items.collageStatus == 2 || items.model != 'collage')">
                  <!-- 去退换货页面使用vue方法跳转，不需要重新打开一个新的webview，方便退款成功返回刷新数据 -->
                  <div class="btn" @click="vueJumpTo('/mall/exchange?orderSn='+items.orderSn)">申请退货</div>
                </div>
                <div class="status" v-if="items.payStatus == 1&&items.orderStatus == 1">
                  <div class="btn1" @click="vueJumpTo('/mall/exchange?orderSn='+items.orderSn)">申请退货</div>
                  <div class="btn" @click="receipt(index,items.orderSn)">确认收货</div>
                </div>
                <div class="status" v-if="items.payStatus == 1 && items.orderStatus == 2 && items.isDiscuss == 0">
                  <div class="btn" @click="jumpTo('/mall/appraise?orderSn='+items.orderSn)">去评价</div>
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
import {
  Tab,
  TabItem,
  Confirm
} from 'vux'
import Vue from 'vue'
import * as utils from '../../../utils'
import * as apiHttp from '../../../api/index'
import '../../../assets/mall/style/mixin.less'
import MescrollVue from 'mescroll.js/mescroll.vue'
export default {
  name: 'fixing_order',
  data () {
    return {
      tab: [{sort: 0, title: '全部'}, {sort: 1, title: '待付款'}, {sort: 2, title: '待发货'}, {sort: 3, title: '待收货'}, {sort: 4, title: '待评价'}, {sort: 5, title: '退换货'}],
      sort: utils.storage.get('orderId') ? utils.storage.get('orderId') : 0,
      index: utils.storage.get('orderId') ? utils.storage.get('orderId') : 0,
      shopList: [],
      loading: false,
      finish: false,
      show: false,
      indexNum: null,
      disabled: false, //判断确认收货按钮请求
      order: null,
      showquxiao: false,
      mescroll: null,
      selectIndex: '',
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
          warpId: 'd9',
          icon: this.$imgConfig.NODATA_IMG || './static/img/auth/kong.png',
          tip: this.$imgConfig.NODATA_TEXT || '暂无相关数据~'
        }
      }
    }
  },
  components: {
    Tab,
    TabItem,
    Confirm,
    MescrollVue
  },
  mounted: function () {
    // 删除
    this.sort = utils.storage.get('orderId')
    this.selectIndex = this.$route.query.id
  },
  methods: {
    mescrollInit (mescroll) {
      this.mescroll = mescroll
    },
    upCallback (page, mescroll) {
      apiHttp.orderList(page.num, this.sort).then(res => {
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
    toMallShop(spid){
      dsBridge.call("open", {url: window.location.origin +'/uqWeb/html/mall/mallShop.html?spid=' + spid,type: 'web'})
    },
    refresh: function () {
      this.finish = false
      let This = this
      this.mescrollUp.page.num = 1
      this.upCallback(this.mescrollUp.page, this.mescroll)
    },
    getListIn (type) {
      utils.storage.set('orderId', type)
      this.shopList = []
      this.page = 1
      this.sort = type
      this.upCallback(this.mescrollUp.page, this.mescroll)
    },
    handDelete (index, order) {
      console.log(index)
      this.show = true
      this.index = index
      this.order = order
    },
    receipt (index, order) {
      let _this = this
      this.indexNum = index
      this.order = order
      if (this.disabled) {//disabled默认false,判断确认收货按钮，如后台数据还未返回，阻止重复请求。
        this.$vux.toast.text('确认收货中，请勿频繁操作!')
        return 
      }
      this.disabled = true //发起请求前改变状态，为true时点击不再次发起请求
      this.$http.post('/mall/order/confirm-order?i=1', {orderSn: this.order}).then(res => {
        _this.disabled = false //请求成功改变状态
        if (res.code === 0) {
          this.$vux.toast.text(res.msg)
          // 当在全部列表中确认收货成功时重新请求一下全部接口，当在待收货列表确认收货时，收货成功后切换到待评价，并重新渲染待评价的数据
          if (this.sort == 0) {
            this.getListIn(0)
          } else if (this.sort == 3) {
            this.index = 4
            this.getListIn(4)
          }
          // setTimeout(()=>{
          //   this.shopList.splice(this.indexNum, 1)
          // },500)
        } else {
          this.$vux.toast.text(res.msg)
        }
      }).catch(err => {
        _this.disabled = false
      })
    },
    handShow (index, order) {
      console.log(index)
      this.indexNum = index
      this.order = order
      this.showquxiao = true
    },
    confirm () {
      apiHttp.orderDelete(this.order).then(response => {
        if (response.code === 0) {
          console.log(this.index)
          this.shopList.splice(this.index, 1)
          this.$vux.toast.text('删除成功')
          this.show = false
        }
      })
    },
    confirm1 () {
      apiHttp.orderRemove(this.order).then(response => {
        if (response.code === 0) {
          let orderId = utils.storage.get('orderId')
          if (orderId === 0) {
            this.shopList[this.indexNum].statusInfo = '已取消'
            this.shopList[this.indexNum].orderStatus = -1
            this.showquxiao = false
            Vue.set(this.shopList, this.indexNum, this.shopList[this.indexNum])
          } else {
            this.showquxiao = false
            this.$vux.toast.text('取消成功')
            this.shopList.splice(this.indexNum, 1)
          }
        }
      })
    },
    handDetail (order, orderStatus) {
      if (orderStatus !== '-1') {
        this.jumpTo('/mall/orderDetail?order=' + order)
        // this.$router.push({
        //   name: 'mallOrderDetail',
        //   query: {
        //     order: order
        //   }
        // })
      }
    }
  }
}
</script>

<style lang="less">
  .fixing_order{
    .vux-header{
      position: absolute !important;
    }
    .mescrollBox{
      width: 100%;
      position: absolute;
      top: 1.9rem;
      bottom: 0;
      height: auto !important;
    }
  }
</style>
