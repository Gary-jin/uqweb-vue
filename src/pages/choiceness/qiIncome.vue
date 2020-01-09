<template>
  <div class="income_wrap">
    <div class="income_top">
      <div class="income_top_bg">
        <img src="../../assets/img/my/mybg.png" />
      </div>
      <div class="income_top_total">
        <span>累计收益</span>
        <span v-show="totalIncome">￥<em>{{totalIncome}}</em></span>
      </div>
      <div class="numBox">
        <div class="bot bot1">
          <div class="nums"><p>余额</p><span v-show='income'>￥{{income}}</span></div>
        </div>
        <div class="bot">
          <div class="nums"><p>{{newIncome}}</p><span>预估拉新收益</span></div>
          <div class="nums"><p>{{cardIncome}}</p><span>预估绑卡收益</span></div>
        </div>
      </div>
      <div class="incomeBtn" @click="handIncome">申请提现</div>
    </div>
    <div class="income_list">
      <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
        <div class="recordList" v-for="(v, i) in list" :key="i">
          <div class="recordLeft">
            <p class="name">{{v.title}}</p>
            <p class="time">{{v.updated_at | timeFilter}}</p>
          </div>
          <div class="recordRight">￥{{v.credit2}}</div>
        </div>
        <div id="empty"></div>
      </mescroll-vue>
    </div>
  </div>
</template>


<script>
import MescrollVue from 'mescroll.js/mescroll.vue'
import { formatDate } from '@/plugin/data'
export default {
  name: "qiincome",
  components: {
    MescrollVue
  },
  data() {
    return {
      list: [],
      mescroll: null,
      mescrollDown: {
        auto: false,
        callback: this.reset
      },
      mescrollUp: {
        auto: false,
        callback: this.upCallback,
        page: {
          num: 1,
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
      cardIncome: '',
      income: '',
      newIncome: '',
      totalIncome: ''
    };
  },
  mounted(){
    this.upCallback(this.mescrollUp.page, this.mescroll)
  },
  methods:{
    mescrollInit (mescroll) {
      this.mescroll = mescroll
    },
    upCallback (page, mescroll) {
      this.mescrollUp.htmlLoading = '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">加载中..</p>'
      this.$http.post('/amoy/third-new/wallet', { page: page.num }, true, true).then((res) => {
        if (res.code === 0) {
          this.cardIncome = res.data.cardIncome
          this.newIncome = res.data.newIncome
          this.income = res.data.income
          this.totalIncome = res.data.totalIncome
          let arr = res.data.list
          if (page.num === 1){ this.list = [] }
          this.list = this.list.concat(arr)
          this.$nextTick(() => {
            mescroll.endSuccess(arr.length)
          })
        } else {
          mescroll.endErr()
        }
      }).catch((e) => { mescroll.endErr() })
    },
    reset () {
      this.mescrollUp.page.num = 1
      this.mescroll.scrollTo(0)
      this.list = [];
      this.mescroll.resetUpScroll()
    },
    handIncome(){//提现
      dsBridge.call('toExtractCash')
    }
  },
  filters:{
    timeFilter(v){
      let date = new Date(v*1000)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  }
};
</script>
<style lang="less" scoped>
  .income_wrap{
    height:100%;
    overflow: hidden;
    position:relative;
    background: #f7f7f7;
    .income_top{
      position:relative;
      height:5.2rem;
      z-index:9;
      background-color:#f7f7f7;
      .income_top_bg{
        img{
          display: inline-block;
          width:100%;
          vertical-align: top;
        }
      }
      .income_top_total{
        position:absolute;
        width:6.9rem;
        height:0.8rem;
        padding:0.1rem 0.3rem;
        left:0;
        top:0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span{
          font-size:0.3rem;
          color:#fff;
        }
        em{
          font-style: normal;
          font-size:0.36rem;
        }
      }
      .numBox{
        background: #fff;
        width: 6.9rem;
        margin:0 0.3rem;
        padding:0.3rem 0 0.5rem;
        border-radius: 0.2rem;
        position: absolute;
        top:1rem;
        .bot{
          height: 1.4rem;
          display: flex;
          .nums{
            position: relative;
            flex: 1;
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            p{
              margin-top: 0.2rem;
              font-size: .36rem;
              color: #000;
              font-weight:500;
            }
            span{
              font-size: .24rem;
              color: #666;
            }
          }
          .nums:after{
            content: '';
            height: 50%;
            position: absolute;
            bottom: 25%;
            top: 25%;
            right: 0;
            border-right: 1px solid #dadada;
            transform-origin: 0 0;
            transform: scaleX(.5);
          }
          .nums:last-of-type:after{
            display: none;
          }
        }
        .bot1{
          .nums p{
            font-size:0.3rem;
            color:#999;
          }
          .nums span{
            font-size:0.4rem;
            font-weight: 600;
            color:#FF4D3A;
          }
        }
      }
      .incomeBtn{
        position: absolute;
        top: 4.2rem;
        width: 3.3rem;
        left: 2.1rem;
        height: 0.8rem;
        background: #FF4D3A;
        font-size: 0.3rem;
        color: #fff;
        text-align: center;
        line-height: 0.8rem;
        border-radius: 0.4rem
      }
    }
    .income_list{
      position:absolute;
      top:5.2rem;
      bottom:0;
      width:100%;
      left:0;
      overflow: hidden;
      background-color:#fff;
    }
    .recordList{
      height: 1.2rem;
      padding: 0 0.3rem;
      border-bottom: 1px solid #EEEEEE;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .recordLeft{
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .name{
          font-size: 0.28rem;
          color: #333333;
        }
        .time{
          padding-top:0.1rem;
          font-size: 0.26rem;
          color: #999999;
        }
      }
      .recordRight{
        font-size: 0.32rem;
        color: #333333;
      }
    }
  }
</style>