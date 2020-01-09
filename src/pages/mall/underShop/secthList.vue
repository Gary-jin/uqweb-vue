<template>
  <div class="secthList_main">
    <x-header
      slot="header"
      :left-options="{showBack: false}"
    >
      <a @click="goBack()" slot="left" class="backBox"><i class="iconfont icon-back"></i></a>
      {{title}}
    </x-header>
    <div class="secthList">
      <!--<div class="tab">-->
        <!--<div :class="active == 1 ? 'active' : ''" @click="handChange(1)">-->
          <!--综合-->
          <!--<span></span>-->
        <!--</div>-->
        <!--<div :class="active == 2 ? 'active' : ''" @click="handChange(2)">-->
          <!--优惠-->
          <!--<span></span>-->
        <!--</div>-->
        <!--<div :class="active == 3 ? 'active' : ''" @click="handChange(3)">-->
          <!--好评-->
          <!--<span></span>-->
        <!--</div>-->
      <!--</div>-->
      <div class="mescrollBox">
        <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
          <Under :list="suggest"></Under>
          <div id="d15"></div>
        </mescroll-vue>
      </div>
    </div>
  </div>
</template>

<script>
import Under from '../../../components/underList'
import MescrollVue from 'mescroll.js/mescroll.vue'
import {XHeader} from 'vux'
import './underLess.less'
export default {
  name: "secthList",
  components:{
    Under,
    XHeader,
    MescrollVue
  },
  data(){
    return{
      data: '',
      active: 1,
      suggest: [],
      title: this.$route.query.title || this.$route.query.shopCid,
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
          warpId: 'd15',
          icon: this.$imgConfig.NODATA_IMG || './static/img/auth/kong.png',
          tip: this.$imgConfig.NODATA_TEXT || '暂无相关数据~'
        }
      }
    }
  },
  methods:{
    handChange (key){
      this.active = key
      this.suggest = []
      this.mescrollUp.page.num = 1
      this.upCallback(this.mescrollUp.page, this.mescroll)
    },
    mescrollInit (mescroll) {
      this.mescroll = mescroll
    },
    upCallback (page, mescroll) {
      this.$http.post('/mall/oto/shops-list',{disType: this.active,cid: this.$route.query.shopCid, page: page.num}).then(res => {
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
    },
    refresh: function () {
      this.mescrollUp.page.num = 1
      this.upCallback(this.mescrollUp.page, this.mescroll)
    },
    codetostring(cod){//编码转换成字符，编码之间用,分开
      var result=String(),a=new Array();
      a=cod.split(",");
      for(var i=0;i<a.length;i++)
        result+=String.fromCharCode(parseInt(a[i]));
      return result;
    }
  },
  mounted () {
    // alert(this.$route.query.title)
    // this.title = this.codetostring(this.$route.query.title)
    // alert(this.title)
  }
}
</script>

<style scoped>

</style>
