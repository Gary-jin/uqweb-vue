<template>
  <div class="team">
    <div class="numBox">
      <div class="bot">
        <div class="nums"><p>{{order_num}}</p><span>做单数量</span></div>
        <div class="nums"><p>{{new_num}}</p><span>拉新数据</span></div>
      </div>
    </div>
    <div class="lists">
      <mescroll-vue ref="mescroll"  :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
        <tab :line-width="2" custom-bar-width="1rem" active-color="#f00" default-color="#333" v-model="type">
          <tab-item v-for="(item, index) of category" :key="index" @on-item-click="change(item.id)">{{item.name}}</tab-item>
        </tab>
        <div class="lists_wrap">
          <div class="list list-tit">
            <span class="list-td1">{{type == 0 ? '名称' : '手机号'}}</span>
            <span class="list-td2">{{type == 0 ? '手机号' : '核销时间'}}</span>
            <span class="list-td3">{{type == 0 ? '做单量' : '状态'}}</span>
          </div>
          <div v-show="type == 0">
            <div class="list" v-for="(v, i) in list0" :key="i">
              <span class="list-td1">{{v.nickname}}</span>
              <span class="list-td2">{{v.mobile}}</span>
              <span class="list-td3">{{v.order_num}}</span>
            </div>
          </div>
          <div v-show="type == 1">
            <div class="list" v-for="(m, n) in list1" :key="n">
              <span class="list-td1">{{m.mobile}}</span>
              <span class="list-td2">{{m.settlement_at | timeFilter}}</span>
              <span class="list-td3">{{m.status}}</span>
            </div>
          </div>
        </div>
        <div id="empty"></div>
      </mescroll-vue>
    </div>
  </div>
</template>

<script>
import {Tab, TabItem} from 'vux'
import MescrollVue from 'mescroll.js/mescroll.vue'
import { formatDate } from '@/plugin/data'
export default {
  name: 'qilist',
  components: {
    MescrollVue,
    Tab, 
    TabItem
  },
  data () {
    return {
      type: 0,
      category:[{id: 0, name: '团队'}, {id: 1, name: '明细'}],
      list0: [],
      list1: [],
      new_num: 0,
      order_num: 0,
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
      id: ''
    }
  },
  mounted(){
    this.id = this.$route.query.id;
    this.list = []
    this.mescroll.scrollTo(0)
    this.upCallback(this.mescrollUp.page, this.mescroll)
  },
  methods: {
    change(id){
      this.type = id;
      this.mescroll.endSuccess(1, true)
    },
    mescrollInit (mescroll) {
      this.mescroll = mescroll
    },
    upCallback (page, mescroll) {
      this.mescrollUp.htmlLoading = '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">加载中..</p>'
      this.$http.post('/amoy/third-new/new-data', { gift_id: this.id, page: page.num }, true, true).then((res) => {
        if (res.code === 0) {
          this.new_num = res.data.new_num;
          this.order_num = res.data.order_num;
          let arr = (this.type == 0 ? res.data.team_list : res.data.mx_list)
          if (page.num === 1){ this.list0 = []; this.list1 = [] }
          res.data.team_list && res.data.team_list.length && (this.list0 = this.list0.concat(res.data.team_list))
          res.data.mx_list && res.data.mx_list.length && (this.list1 = this.list1.concat(res.data.mx_list))
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
      this.list0 = [];
      this.list1 = [];
      this.mescroll.resetUpScroll()
    }
  },
  filters:{
    timeFilter(v){
      let date = new Date(v*1000)
      return formatDate(date, 'yyyy.MM.dd hh:mm')
    }
  }
}
</script>

<style scoped lang="less">
.team{
  height: 100%;
  background: #f7f7f7;
  position: relative;
  overflow: hidden;
  .numBox{
    margin: .2rem auto;
    background: #fff;
    width: 6.9rem;
    border-radius: 0.2rem;
    .bot{
      height: 1.7rem;
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
  }
  .lists{
    width: 100%;
    background-color:#fff;
    position:absolute;
    left:0;
    top:2.1rem;
    bottom: 0;
    .lists_wrap{
      width:6.9rem;
      padding: 0 0.3rem;
    }
    .list{
      width:100%;
      display: flex;
      flex-wrap: nowrap;
      border-bottom:1px solid #eee;
      span{
        display: inline-block;
        width:33%;
        padding:0.2rem 0.08rem;
        font-size:0.26rem;
        line-height:0.4rem;
        min-height:0.4rem;
        word-break: break-all;
        word-wrap: break-word;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
      }
      span.list-td1{
        width:2.5rem;
      }
      span.list-td2{
        width:3rem;
      }
      span.list-td3{
        width:1.4rem;
      }
      &:last-child{
        border:none;
      }
    }
    .list-tit{
      border:none;
      color:#999;
      margin-top:0.12rem;
    }
  }
}
</style>
