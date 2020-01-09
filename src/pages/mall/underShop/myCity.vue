<template>
  <div class="my-city">
    <x-header
      slot="header"
      :left-options="{showBack: false}">
      <a @click="goBack()" slot="left" class="backBox"><i class="iconfont icon-back"></i></a>
      我的区域
    </x-header>
    <div class="mescrollBox">
      <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
        <div class="city-body">
          <div class="city-info">
            <div class="info-one">
              <div>
                <img v-if="info.birthLevel == 1" src="../../../assets/mall/img/under/u4.png" alt="">
                <img v-if="info.birthLevel == 2" src="../../../assets/mall/img/under/u5.png" alt="">
                <img v-if="info.birthLevel == 3" src="../../../assets/mall/img/under/u9.png" alt="">
                <p>{{levelInfo[info.birthLevel]}}</p>
                <span>({{info.province}}{{info.city}}{{info.district}})</span>
              </div>
              <div class="two">
                <p>￥<span>{{data.price}}</span></p>
              </div>
            </div>
          </div>
          <div>
            <div class="city-list" v-for="(item,i) in list" :key="i">
              <div class="list-one">
                <img v-lazy="item.logo" alt="">
                <p>{{item.title}}</p>
              </div>
              <div class="list-center">
                <div class="list-two">
                  <span>{{item.trade1}}</span>
                  <p>日销售额</p>
                </div>
                <div class="list-two">
                  <span>{{item.trade2}}</span>
                  <p>周销售额</p>
                </div>
                <div class="list-two">
                  <span>{{item.trade3}}</span>
                  <p>月销售额</p>
                </div>
                <div class="list-two">
                  <span>{{item.profit1}}</span>
                  <p>日收益</p>
                </div>
                <div class="list-two">
                  <span>{{item.profit2}}</span>
                  <p>周收益</p>
                </div>
                <div class="list-two">
                  <span>{{item.profit3}}</span>
                  <p>月收益</p>
                </div>
              </div>
            </div>
          </div>
          <div id="19"></div>
        </div>
      </mescroll-vue>
    </div>
  </div>
</template>

<script>
  import MescrollVue from 'mescroll.js/mescroll.vue'
  import * as apiHttp from '../../../api/index'
  export default {
    name: 'myCity.vue',
    components: {
      MescrollVue
    },
    data () {
      return {
        page: 1,
        data: {},
        info: {},
        list: [],
        levelInfo: {},
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
            warpId: 'd19',
            icon: this.$imgConfig.NODATA_IMG || './static/img/auth/kong.png',
          tip: this.$imgConfig.NODATA_TEXT || '暂无相关数据~'
          }
        }
      }
    },
    methods: {
      mescrollInit (mescroll) {
        this.mescroll = mescroll
      },
      upCallback (page, mescroll) {
        apiHttp.underMyCity(page.num).then(res => {
          if (res.code === 0) {
            this.data = res.data
            this.info = res.data.info
            this.levelInfo = res.data.info.levelInfo
            let arr = res.data.list === '' ? [] : res.data.list
            if (page.num === 1) this.list = []
            this.list = this.list.concat(arr)
            this.$nextTick(() => {
              mescroll.endSuccess(res.data.list.length, true)
            })
          }
        }).catch((e) => {
          mescroll.endErr()
        })
      },
      refresh: function () {
        this.finish = false
        this.mescrollUp.page.num = 1
        this.upCallback(this.mescrollUp.page, this.mescroll)
      }
    }
  }
</script>

<style lang="less">
@import '../../../assets/mall/style/_Variables';
.my-city{
  .mescrollBox{
    width: 100%;
    position: absolute;
    top: @margin-top;
    bottom: 0;
    height: auto !important;
  }
  .city-body{
    .city-info{
      .info-one{
        margin-bottom: .2rem;
        // background: #ffffff;
        // height: 1.2rem;
        height: 2rem;
        // padding: 0 .3rem;
        display: flex;
        // justify-content: space-between;
        align-items: center;
        flex-direction: column;
        background: url(../../../assets/mall/img/my/beijing1.png) no-repeat;
        background-size: 100% 100%;
        div{
          display: flex;
          align-items: center;
          margin-top: 0.58rem;
          img{
            width: 0.5rem;
            height: .5rem;
          }
          p{
            color: #fff;
            font-size: 0.28rem;
            margin-left: .2rem;
            margin-right: .2rem;
          }
          span{
            font-size:.24rem;
            font-weight:400;
            color:rgba(255,255,255,1);
          }
        }
        .two{
          display: flex;
          justify-content: center;
          margin-top: 0.1rem;
          p{
            font-size:.22rem;
            font-weight:500;
            color:rgba(255,255,255,1);
          }
          span{
            font-size:.34rem;
            font-weight: bold;
          }
        }
      }

    }
    .city-list{
      background: #ffffff;
      height: 3.88rem;
      width: 6.9rem;
      margin: 0.2rem auto;
      border-radius: 0.1rem;
      display: flex;
      flex-direction: column;
      .list-one{
        width: 6.3rem;
        height: 1.39rem;
        display: flex;
        justify-content: flex-start;
        flex-direction: row;
        align-items: center;
        border-bottom: 1px solid @border-color;
        margin-left: 0.3rem;
        img{
          width: 0.88rem;
          height: 0.88rem;
          border-radius: 50%;
        }
        p{
          margin-left: .34rem;
          font-size:.28rem;
          font-weight:400;
          color:rgba(102,102,102,1);
        }
      }
      .list-center{
        display: flex;
        flex-wrap: wrap;
      }
      .list-two{
        width: 2.3rem;
        height: 1.24rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        p{
          font-size:.24rem;
          font-weight:400;
          color:rgba(102,102,102,1);
        }
        span{
          font-size:.34rem;
          font-weight:bold;
          color:rgba(47,47,47,1);
        }
      }
    }
  }
}
</style>
