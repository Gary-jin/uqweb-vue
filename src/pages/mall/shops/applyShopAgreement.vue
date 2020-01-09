<template>
  <div id="apply">
    <!--<x-header-->
      <!--slot="header"-->
      <!--:left-options="{showBack: false}" >-->
      <!--<a @click="goBack()" slot="left" class="backBox"><i class="iconfont icon-back"></i></a>-->
      <!--入驻协议-->
    <!--</x-header>-->
    <div class="about" v-if="data">
      <div v-html="data" class="content">
      </div>
    </div>
  </div>
</template>

<script>
import './shops.less'
import { XHeader } from 'vux'
import * as apiHttp from '../../../api/index'

export default {
  name: 'mallApplyShopAgreement',
  data () {
    return {
      data: ''
    }
  },
  components: {
    XHeader
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    getInfo(){
      apiHttp.applyShopAgreement().then(res => {
        if(res.code == 0){
          this.data = res.data
        }
      })
    }

  }
}
</script>

<style scoped lang="less">
@import "../../../assets/mall/style/_Variables";
.vux-cell-box:not(:first-child):before{
  border:none;
}

.about{
  width: 100%;
  height: 100%;
  background: #fff;
  overflow-y: auto;
  //margin-top: 0.88rem;
  .content{
    padding: .2rem;
    font-size: .28rem;
    img{
      max-width: 100%;
    }
  }
}
</style>
