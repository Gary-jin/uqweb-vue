<template>
    <div class="category">
      <x-header :left-options="{showBack: false}" class="category-head" >
        <a @click="goBack()" slot="left" class="backBox"><i class="iconfont icon-back"></i></a>
        <a  class="head-right">{{title || '商家分类'}}</a>
      </x-header>
      <div class="category-nav">
        <p @click="getColor('all')" :class="{'select':showColor=='all'}">全部</p>
        <p @click="getColor('sales')" :class="{'select':showColor=='sales'}">销量优先</p>
        <p @click="getColor('praise')" :class="{'select':showColor=='praise'}">好评
          <span>
            <img src="../../../assets/mall/img/business/logo/jiantou.jpg" alt="" v-if="praise">
            <img src="../../../assets/mall/img/business/logo/jiantou1.jpg" alt="" v-if="!praise">
          </span>
        </p>
      </div>
      <div class="mescrollBox">
        <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
          <Business style="margin-top: 2rem" :list="suggest" :businessComponentType="businessComponentType" @jump="seller"></Business>
          <div id="d24"></div>
        </mescroll-vue>
      </div>
    </div>
</template>

<script>
import {XHeader} from 'vux'
import Business from '../business/business'
import MescrollVue from 'mescroll.js/mescroll.vue'
export default{
  name: 'category',
  components: {XHeader, Business, MescrollVue},
  data () {
    return {
      showColor: 'all',
      praise: true,
      suggest: [],
      businessComponentType: '', // business组件类型
      title: '',
      page: 1,
      finish: false,
      loading: false,
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
          warpId: 'd24',
          icon: this.$imgConfig.NODATA_IMG || './static/img/auth/kong.png',
          tip: this.$imgConfig.NODATA_TEXT || '暂无相关数据~'
        }
      }
    }
  },
  methods: {
    getColor (type) {
      this.showColor = type
      type === 'praise' ? this.praise = !this.praise : ''
      let obj = {}
      if (type === 'all') {
        obj = {disType: 1}
      } else if (type === 'sales') {
        obj = {disType: 2}
      } else if (type === 'praise') {
        if (this.praise === true) {
          obj.disType = 3
          obj.sort = 0
        } else if (this.praise === false) {
          obj = {disType: 3, sort: 1}
        }
      }
      this.$http.post('/mall/shops/shops-list?i=1', obj).then(res => {
        if (res.code === 0) {
          this.suggest = res.data
        } else {
          this.$vux.toast.text(res.msg)
        }
      })
    },
    seller (id) {
      // 跳转线上商城店铺详情
      // this.$router.push({
      //   name: 'mallSeller',
      //   query: {
      //     spid: id
      //   }
      // })
      // 跳转线下小店商品详情
      this.jumpTo('/mall/Underdetail?spid=' + id)
    },
    setTitle () {
      if (this.$route.query.keyword) {
        this.title = this.$route.query.keyword.substring(0, 4) + '...'
      } else {
        this.title = this.$route.query.title
      }
    },
    mescrollInit (mescroll) {
      this.mescroll = mescroll
    },
    upCallback (page, mescroll) {
      if (this.$route.query.type) {
        let id = this.$route.query.type
        this.$http.post('/mall/shops/shops-list', {shopsCid: id, page: page.num}).then(res => {
          if (res.code === 0) {
            let arr = res.data.shopList === '' ? [] : res.data.shopList
            if (page.num === 1) this.suggest = []
            this.suggest = this.suggest.concat(arr)
            this.$nextTick(() => {
              mescroll.endSuccess(res.data.shopList.length, true)
            })
          }
        }).catch((e) => {
          mescroll.endErr()
        })
      } else if (this.$route.query.keyword) {
        // 当在搜索商家时
        let id = this.$route.query.keyword
        this.$http.post('/mall/shops/shops-list', {keyword: id, page: page.num, model: 'oto'}).then(res => {
          if (res.code === 0) {
            let arr = res.data.shopList === '' ? [] : res.data.shopList
            if (page.num === 1) this.suggest = []
            this.suggest = this.suggest.concat(arr)
            this.$nextTick(() => {
              mescroll.endSuccess(res.data.shopList.length, true)
            })
          }
        }).catch((e) => {
          mescroll.endErr()
        })
      }
    },
    refresh: function () {
      this.finish = false
      this.mescrollUp.page.num = 1
      this.upCallback(this.mescrollUp.page, this.mescroll)
    }
  },
  created () {
    if (this.$route.query.keyword) {
      // 当在搜索商家时
      this.businessComponentType = 'underShop'
    }
  },
  mounted () {
    this.setTitle()
  }
}
</script>

<style lang="less">
.category{
  text-align: center;
  .mescrollBox{
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    height: auto !important;
  }
}
</style>
