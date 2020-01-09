<template>
  <div class="rightsRecord">
    <tab :line-width="2" custom-bar-width=".4rem" :active-color="$store.state.global.theme.mainColor" default-color="#333" v-model="type">
      <tab-item @on-item-click="reset(0)">我的订单</tab-item>
      <tab-item @on-item-click="reset(1)">收益记录</tab-item>
    </tab>
    <div class="listBox">
      <mescroll-vue ref="mescroll"  :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
        <div class="high"></div>
        <div class="list" v-if="sort==0" v-for="(item, index) of list" :key="index">
          <div class="top">
            <p>订单：{{item.trade_no}}</p>
            <span v-if="item.status == 0">待支付</span>
            <span class="active" :style="{color: 'green'}"  v-else-if="item.status == 1">支付成功</span>
            <span class="active" :style="{color: 'red'}"  v-else-if="item.status == -1">支付失败</span>
          </div>
          <div class="centerBox">
            <img v-lazy="item.img" alt="" :key="item.img">
            <div class="info">
              <p class="t">{{item.title}}</p>
              <div class="money">
                <p class="price" :style="{color: $store.state.global.theme.mainColor}" >¥<span>{{item.amount}}</span></p>
              </div>
            </div>
          </div>
          <div class="bot">
            <div class="time">
              <span>创建时间：{{item.created_at*1000 | dateFormat}}</span>
            </div>
          </div>
        </div>
        <div class="list" v-if="sort==1">
          <div class="list-box">
            <div class="list-profit-item" v-for="(item, index) of list" :key="index">
              <div class="line-1">
                <div class="title text-overflow_1-xzh">{{item.remark}}</div>
                <!--<div class="price">+{{item.price}}</div>-->
              </div>
              <div class="line-2">
                <span>创建时间:{{item.created_at*1000 | dateFormat}}</span>
                <!--<span>订单金额￥{{item.price}}</span>-->
              </div>
            </div>
          </div>
        </div>
        <div id="empty"></div>
      </mescroll-vue>
    </div>
  </div>
</template>

<script>
import {Tab, TabItem, dateFormat} from 'vux'
import Clipboard from 'clipboard'
import MescrollVue from 'mescroll.js/mescroll.vue'
export default {
  name: 'rightsRecord',
  components: {
    Tab, TabItem, MescrollVue
  },
  data () {
    return {
      type: 0,
      list: [],
      page: 1,
      finish: false,
      sort: 0,
      loading: false,
      mescroll: null,
      mescrollDown: {
        auto: false,
        use: false
      },
      mescrollUp: {
        callback: this.upCallback,
        page: {
          num: 0,
          size: 5
        },
        htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
        htmlLoading: '',
        noMoreSize: 5,
        toTop: {
          src: './static/img/auth/back_top.png',
          offset: 1000
        },
        empty: {
          warpId: 'empty',
          icon: this.$imgConfig.NODATA_IMG || './static/img/auth/kong.png',
          tip: this.$imgConfig.NODATA_TEXT || '暂无相关数据~'
        }
      },
      dataList: [],
      lastScrollTop: 0, // 路由切换时滚动条的位置
      lastBounce: null // 路由切换时是否禁止ios回弹
    }
  },
  filters: {
    dateFormat
  },
  mounted: function () {
    // 删除
  },
  beforeRouteLeave (to, from, next) {
    if (this.mescroll) {
      this.mescroll.hideTopBtn(0) // 隐藏回到顶部按钮,无渐隐动画
    }
    next()
  },
  methods: {
    mescrollInit (mescroll) {
      this.mescroll = mescroll
    },
    upCallback (page, mescroll) {
      this.mescrollUp.htmlLoading = '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">加载中..</p>'
      if (this.sort == 0) {
        this.$http.post('/amoy/user/gift-order-list', {
          page: page.num
        }, true, true).then((res) => {
          if (res.code === 0) {
            let arr = res.data
            if (page.num === 1) this.list = []
            this.list = this.list.concat(arr)
            this.$nextTick(() => {
              mescroll.endSuccess(arr.length)
            })
          } else {
            mescroll.endErr()
          }
        }).catch((e) => {
          mescroll.endErr()
        })
      } else {
        this.getIncomeRecord(page, mescroll)
      }
    },
    /*
    * 获取收益记录
    * */
    getIncomeRecord (page, mescroll) {
      this.$http.post('/amoy/user/get-up-info', {
        page: page.num
      }, true, true).then((res) => {
        if (res.code === 0) {
          let arr = res.data
          if (page.num === 1) this.list = []
          this.list = this.list.concat(arr)
          this.$nextTick(() => {
            mescroll.endSuccess(arr.length)
          })
        } else {
          mescroll.endErr()
        }
      }).catch((e) => {
        mescroll.endErr()
      })
    },
    onCopy () {
      var clipboard = new Clipboard('.copyObj')
      clipboard.on('success', e => {
        this.$vux.toast.text('复制成功')
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        this.$vux.toast.text('不支持自动复制')
        // 释放内存
        clipboard.destroy()
      })
    },
    reset (status) {
      this.list = []
      this.mescrollUp.htmlLoading = ''
      this.sort = status
      this.mescrollUp.page.num = 1
      this.finish = false
      this.upCallback(this.mescrollUp.page, this.mescroll)
    }
  }
}
</script>

<style scoped lang="less">
  @import "../../assets/less/common";
  .rightsRecord{
    height: 100%;
    .high{
      overflow: hidden;
      height: .1rem;
      width: 100%;
      background: @h-col;
    }
    .listBox{
      position: relative;
      background: #f7f7f7;
      height: calc(100% - 44px);
    }
    .list{
      overflow: hidden;
      background: #fff;
      margin: .1rem 0;
      .top{
        background: #fff;
        display: flex;
        align-items: center;
        height: 1rem;
        padding: 0 .3rem;
        img{
          width: .34rem;
          margin-right: .2rem;
        }
        p{
          color: #666;
          font-size: .28rem;
          flex: 1;
        }
        span{
          font-size: .3rem;
        }
      }
      .centerBox{
        background: #fff;
        display: flex;
        /*height: 1.6rem;*/
        padding: .25rem .3rem;
        position: relative;
        img{
          width: 1.6rem;
          height: 1.6rem;
          margin-right: .3rem;
        }
        .info{
          /*height: 1.6rem;*/
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .t{
            font-size: .26rem;
          }
          .money{
            display: flex;
            justify-content: space-between;
            .price{
              font-size: .26rem;
              span{
                font-size: .38rem;
              }
            }
            .profit{
              font-size: .26rem;
              color: #fff;
              padding: 0 .2rem;
              height: .56rem;
              line-height: .56rem;
              border-radius: .28rem;
            }
          }
        }
      }
      .centerBox:before{
        content: '';
        position: absolute;
        left: .2rem;
        right: .2rem;
        top: 0;
        height: 1px;
        border-top: 1px solid #e0e0e0;
        transform-origin: 0 0;
        transform: scaleY(.5);
      }
      .centerBox:after{
        content: '';
        position: absolute;
        left: .2rem;
        right: .2rem;
        bottom: 0;
        height: 1px;
        border-bottom: 1px solid #e0e0e0;
        transform-origin: 0 0;
        transform: scaleY(.5);
      }
      .bot{
        background: #fff;
        display: flex;
        height: 0.8rem;
        flex-direction: column;
        justify-content: space-around;
        padding: 0 .3rem;
        .time{
          text-align: right;
          font-size: .24rem;
          color: #999;
          span{
            margin-left: .4rem;
          }
        }
      }
    }
    .list-box{
      background: white;
      padding: 0 .23rem;
      .list-profit-item{
        padding: .35rem 0;
        >div{
          display: flex;
          justify-content: space-between;
          .title{
            font-size: .28rem;
            width: 100%;
            margin-bottom: .35rem;
          }
          .price{
            font-size: .32rem;
            color: @theme-col;
          }
        }
        .line-2{
          color: #999;
          font-size: .24rem;
        }
      }
      .list-profit-item:not(:last-child){
        border-bottom: 1px solid #eee;
      }
    }
  }
</style>
