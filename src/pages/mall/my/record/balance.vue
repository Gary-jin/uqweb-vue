<template>
  <div class="balance_box">
    <x-header
      slot="header"
      :left-options="{showBack: false}"
    >
      <a @click="goBack()" slot="left" class="backBox"><i class="iconfont icon-back"></i></a>
      我的{{titleInfo.credit2}}
      <a @click="jumpTo('/mall/yueList')" slot="right"><i class="iconfont icon-iconfont02"></i></a>
    </x-header>
    <div class="content" v-if="isShow">
        <div class="header">
          <table></table>
            <p>账户{{titleInfo.credit2}}（元）</p>
            <h4>
              <!-- <span>￥</span>{{yueInfo.price}} -->
              {{yueInfo.price}}
            </h4>
        </div>
        <div class="count">
          <div class="box"  @click="jumpTo('/mall/yuePayment')">
            <div class="div1">
              <img src="../../../../assets/img/balance/chongzhi1.png" alt="">
              <span>充值</span>
            </div>
            <div class="div2">
              <i class="iconfont icon-right"></i>
            </div>
          </div>
          <div class="box"  @click="jumpTo('/mall/yuWithdraw')" v-if="yueInfo.withdraw === 1">
            <div class="div1">
              <img src="../../../../assets/img/balance/tixian1.png" alt="">
              <span>提现</span>
            </div>
            <div class="div2">
              <i class="iconfont icon-right"></i>
            </div>
          </div>
          <div class="box" v-if="yueInfo.attorn === 1" @click="jumpTo('/mall/donation?credittype='+ 'credit2')">
            <div class="div1">
              <img src="../../../../assets/img/balance/zhuanzeng1.png" alt="">
              <span>转赠</span>
            </div>
            <div class="div2">
              <i class="iconfont icon-right"></i>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import {XHeader} from 'vux'
import * as apiHttp from '../../../../api/index'
import * as utils from '../../../../utils'
export default {
  name: 'balance',
  components: {
    XHeader
  },
  data () {
    return {
      yueInfo: {},
      titleInfo: utils.storage.get('titleInfo'),
      isShow: false
    }
  },
  methods: {
    getInfo(){
      apiHttp.yueInfo().then(res => {
          if (res.code === 0) {
            this.isShow = true
            this.yueInfo = res.data
          }
      })
    }
     
  },
  mounted () {
    this.getInfo()
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          // "页面被挂起"
        } else {
          this.getInfo()
        }
    })
  }
}
</script>

<style scoped>

</style>
