<template>
    <div class="videoCard">
      <x-header :left-options="{showBack: false}"><a slot="left" @click="goBack()"  class="backBox">
        <i class="iconfont icon-back"></i></a>
        管理卡密<span class="save" slot="right" @click="produce">生产卡密</span>
      </x-header>
      <!--<tab :line-width="2" custom-bar-width=".4rem" :active-color="$store.state.global.theme.mainColor" default-color="#333" v-model="index">
        <tab-item @on-item-click="reset(0)" >未启用</tab-item>
        <tab-item @on-item-click="reset(1)">已启用</tab-item>
      </tab>-->
      <div class="tab-type">
         <div class="tab">
           <div @click="reset(0)" :class="{active:type==0}">未激活</div>
           <div @click="reset(1)" :class="{active:type==1}">已激活</div>
         </div>
      </div>
      <div class="tab-handle">
         <div>卡号</div>
         <div>操作</div>
      </div>
      <div class="lists">
        <mescroll-vue ref="mescroll"  :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
          <div class="list" v-for="(item, index) of list" :key="index" @touchstart="start(item.cdkey)" @touchmove="move" @touchend="end">
            <div>{{item.cdkey}}</div>
            <div class="copy-code" @click="utils.copyText(item.cdkey).then(()=>{$vux.toast.show({text:'复制成功',position: 'top'})})">复制</div>
          </div>

          <div id="empty"></div>
        </mescroll-vue>
      </div>
    </div>
</template>

<script>
import {Tab, TabItem} from 'vux'
import MescrollVue from 'mescroll.js/mescroll.vue'
import * as utils from '../../utils'
export default {
  name: 'videoCard',
  components: {
    Tab, TabItem, MescrollVue
  },
  data () {
    return {
      type: 0,
      index: 0,
      utils, utils,
      mescroll: null,
      mescrollDown: {
        auto: false,
        use: false
      },
      mescrollUp: {
        callback: this.upCallback,
        page: {
          num: 0,
          size: 20
        },
        htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
        htmlLoading: '<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">加载中..</p>',
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
      list: [],
      lastScrollTop: 0, // 路由切换时滚动条的位置
      lastBounce: null ,// 路由切换时是否禁止ios回弹,
      tab:0,

    }
  },
  methods: {
    produce () {
      this.$http.post('/amoy/movie/add-card', {
        number: 20
      }, true).then(res => {
        if (res.code === 0) {
          this.$vux.toast.text(res.msg)
          this.reset(this.index)
        }
      })
    },
    upCallback (page, mescroll) {
      this.$http.post('/amoy/movie/card-list', {
        page: page.num,
        status: this.type
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
    start (cdkey) {
      dsBridge.call('clipBoard', {value: cdkey})
    },
    move () {
      clearTimeout(this.timeOutEvent)
    },
    end () {
      clearTimeout(this.timeOutEvent)
    },
    mescrollInit (mescroll) {
      this.mescroll = mescroll
    },
    selectTab (type) {
      this.tab = type
    },
    reset (type) {
      this.type = type

      this.list = []
      this.mescrollUp.page.num = 1
      this.mescroll.resetUpScroll()
    }
  }
}
</script>

<style scoped lang="less">
.videoCard{
  height: 100%;
  .save{
    color: #666;
  }
  .vux-tab-wrap{
    margin: 0 0 5px;
    .vux-tab-item{
      background: none;
    }
  }
  .lists{
    height: calc(100% - 49px);
    position: relative;
  }
  .list{
    height: 1rem;
    display: flex;
    justify-content: space-between;
    padding-left:14vw;
    padding-right:18vw;
    align-items: center;
    padding-left: .6rem;
    background: #fff;
    color: #333;
    position: relative;
  }
  .tab-type{
    width:100vw;
    height:36px;
    line-height:36px;
    padding-top:4px;
    border-top:1px solid lightgray;
    border-bottom:1px solid lightgray;
  }
  .tab-type>.tab{
    width:40vw;
    margin:0 auto;
    display:flex;

  }
  .tab-type>.tab>div{
    width:20vw;
    text-align:center;
    height:30px;
    line-height:30px;
    color:white;
    background:rgb(220,220,220)
  }
  .tab-type>.tab>div:first-child{
    border-bottom-left-radius: 3px;
    border-top-left-radius: 3px;
  }
  .tab-type>.tab>div:last-child{
    border-bottom-right-radius: 3px;
    border-top-right-radius: 3px;
  }
  .active{
    background:rgb(229,28,35) !important;
  }
  .tab-handle{
    width:100vw;
    height:35px;
    display:flex;
    justify-content: space-around;
    align-items: center;
  }
  .copy-code{
    width:15vw;
    height:7vw;
    line-height:7vw;
    background:rgb(63,81,181);
    color:white;
    border-radius:3px;
    text-align:center;
  }

  .list:after{
    content: '';
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0;
    border-bottom: 1px solid #ededed;
    transform: scale(0 0.5);
  }
}
</style>
