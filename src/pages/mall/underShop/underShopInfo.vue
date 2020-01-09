<template>
  <div class="image-text" v-if="isShow">
    <x-header :left-options="{showBack: false}" class="collection-head" >
      <a @click="goBack()" slot="left" class="backBox"><i class="iconfont icon-back"></i></a>
      <a  class="head-right">店铺资质</a>
    </x-header>
      <div class="quali_core">
            <div class="quali_pic" :style="{background: `url(${data.logo})50% 50% / cover no-repeat`}"></div>
            <div class="quali_top_tit">{{data.title}}</div>
            <div class="quali_top_core"  v-html="data.info"></div>
            <div v-if="data.licence != ''">
              <div class="quali_id_tit">{{data.title}}经营者营业执照信息</div>
              <div class="quali_id_core">根据国家工商总局《网络交易管理办法》要求对网店 营业执照信息公示如下：</div> 
              <div class="quali_id_pic" :style="{background: `url(${data.licence})50% 50% / cover no-repeat`}"></div>
            </div>
        </div>
    
  </div>
</template>

<script>
  import * as apiHttp from '../../../api/index'
  import './underLess.less'
  export default {
    data () {
      return {
        data: {},
        isShow: false
      }
    },
    mounted () {
      apiHttp.underShopsDetails(this.$route.query.spid).then(res => {
        if (res.code === 0) {
          this.isShow = true
          this.data = res.data.info
        }
      })
    }
  }
</script>

<style lang="less"  scoped>
  @import '../../../assets/mall/style/_Variables';
  body {
      background: #fff;
  }
  .image-text{
    .head-right{
      font-size: .34rem;
      font-weight: bold;
      color: rgba(47, 47, 47, 1);
      line-height: .36rem;
      white-space: nowrap;
    }
    .mescrollBox{
      width: 100%;
      position: absolute;
      top: @margin-top;
      bottom: 0;
      height: auto !important;
    }
    .quali_core{
        padding: 0 .6rem;
        margin-top: .88rem;
        overflow: hidden;
    }
    .quali_pic{
        width: 1.1rem;
        height: 1.1rem;
        border-radius: 50%;
        margin: .3rem auto 0;
    }
    .quali_top_tit{
        margin-top: .2rem;
        font-size: .3rem;
        font-weight:500;
        color:rgba(47,47,47,1);
        text-align: center;
    }
    .quali_top_core{
        margin-top: .32rem;
        text-indent: 2em;
        font-size: .26rem;
        font-weight:500;
        color:rgba(47,47,47,1);
    }
    .quali_id_tit{
        margin-top: .5rem;
        margin-bottom: .3rem;
        text-align: center;
        font-size: .32rem;
        font-weight:bold;
        color:rgba(47,47,47,1);
    }
    .quali_id_core{
        font-size: .26rem;
        font-weight:500;
        color:rgba(47,47,47,1);
    }
    .quali_id_pic{
        width: 100%;
        height: 8.75rem;
        margin-top: .32rem;
        margin-bottom: .5rem;
    }
  }
</style>
