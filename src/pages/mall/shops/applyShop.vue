<template>
  <div id="apply">
    <x-header
      slot="header"
      :left-options="{showBack: false}" style="position: absolute">
      <a @click="goBack()" slot="left" class="backBox"><i class="iconfont icon-back"></i></a>
      商家入驻
    </x-header>

    <div class="apply-body" v-if="!succeedShow">
      <img class="apply-body-bj" src="../../../assets/mall/img/shop/shangjiaruzhu.png">
      <div class="agreement">
        <div class="agreement-left"  @click="agreed">
          <img v-if="!checked" :src="imgSrc">
          <img v-if="checked" :src="imgSrc1">
        </div>
        <span class="content" @click="toAgreement">同意入驻协议</span>
      </div>
      <div class="enter" @click="toEnter">立即入驻</div>
    </div>
    <!-- 选择商家弹窗 -->
    <div v-transfer-dom>
      <x-dialog v-model="showTost" class="tostBox" :dialog-style="{'width':'5.7rem','height':'2.6rem','display': 'flex',
  'justify-content': 'space-around','align-items' : 'center' }">
        <div @click="toMessage(1)">
          <img src="../../../assets/mall/img/shop/geren@2x.png">
          <p>个人店铺</p>
        </div>
        <div @click="toMessage(2)">
          <img src="../../../assets/mall/img/shop/qiye@2x.png">
          <p>企业店铺</p>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import './shops.less'
import { XHeader,XDialog,TransferDomDirective as TransferDom } from 'vux'
import * as apiHttp from '../../../api/index'
import imgUrl from "../../../assets/mall/img/shop/moren.png"
import imgUrl1 from "../../../assets/mall/img/shop/xuanzhong@2x.png"
export default {
  name: 'applyShop',
  data () {
    return {
      imgSrc:imgUrl,
      imgSrc1:imgUrl1,
      checked:false,
      showTost:false,
      applyInfo1: '',
      succeedShow: true
    }
  },
  components: {
    XHeader,
    XDialog
  },
  directives: {
    TransferDom
  },
  mounted () {
    apiHttp.applyShop().then(res => {
      if (res.code === 0) {
        this.applyInfo1 = res.data
        if (this.applyInfo1.applyfor) {
          if (this.applyInfo1.applyfor.status === '2') {
            this.succeedShow = true
            // this.$router.replace('/mall/shopCenter')
                dsBridge.call("open", {url: window.location.origin +'/uqWeb/html/shopCenter/index.html',type: 'web'})
          } else {
            this.succeedShow = false
          }
        } else {
          this.succeedShow = false
        }
      }
    })
  },
  methods: {
    // 同意协议
    agreed(){
      this.checked = !this.checked
    },
    // 选择商家类型
    toEnter(){
      if(this.checked){
        this.showTost = true
      }else{
        this.$vux.toast.text('请先同意协议！')
      }
    },
    // 跳转填写入驻信息页面
    toMessage(type){
      if(type === 1){
        this.showTost = false
        this.jumpTo('/mall/applyShopMan')
      }else if(type ===2 ){
        this.showTost = false
        this.jumpTo('/mall/applyShopFirm')
      }

    },
    toAgreement () {
      this.jumpTo('/mall/applyShopAgreement')
    }
  }
}
</script>

<style scoped lang="less">
@import "../../../assets/mall/style/_Variables";
.vux-cell-box:not(:first-child):before{
  border:none;
}
#apply{
  width: 100%;
  height: 100%;
  display: flex;
}
.apply-body{
  flex: 1;
  position: relative;
  .apply-body-bj{
    height: 100%;
    width: 100%;
    display: block;
  }
  .agreement{
    position: absolute;
    left: 0.4rem;
    bottom: 1.72rem;
    text-align: center;
    display: flex;
    .agreement-left{
      /*display: inline-block;*/
      margin-right: .1rem;
      img{
        width: 0.3rem;
        height: 0.3rem;
      }
    }

    .content{
      font-family: 'PingFang-SC-Medium';
      font-size: 0.26rem;
      color: #FFFAF7;

    }
  }
  .enter{
    position: absolute;
    left: 0.8rem;
    bottom: 0.48rem;
    width:5.9rem;
    height:0.88rem;
    background:linear-gradient(180deg,rgba(255,134,117,1) 0%,rgba(250,92,93,1) 100%);
    border-radius:0.44rem;
    color: #FFFAF7;
    font-size: 0.38rem;
    text-align: center;
    line-height: 0.88rem;
    font-family: 'PingFang-SC-Bold';
  }
}
.tostBox{
  img{
    height: 0.8rem;
    width: 0.8rem;
  }
  p{
    font-size:0.34rem;
    font-family:PingFang-SC-Medium;
    font-weight:500;
    color:rgba(51,51,51,1);
    line-height:0.36rem;
    margin-top: 0.3rem;
  }
}
.apply-failed{
  margin-top: .1rem;
  div:first-child{
    background: #ffffff;
    height: 3.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-bottom: 1px solid @border-color;
    img{
      width: 30%;
      margin-bottom: .1rem;
    }
    p{
      color: @font-main-color;
      font-size: @font-big;
    }
  }
  div:nth-child(2){
    background: #ffffff;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0.2rem 0.3rem;
    span{
      color: @font-main-color;
      font-size: @font-big;
    }
    p{
      width: 75%;
      color: @font-light-color;
      font-size: @font-nomal;
    }
  }
  .confirm1{
    background: none;
  }
}
</style>
