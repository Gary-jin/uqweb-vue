<template>
  <div class="under-header EditOtoHeader flex" ref="header" :style="{paddingTop: statusH + 'px',background: 'linear-gradient('+styleData.bgDeg+'deg,' +styleData.bgColor+','+styleData.bgSecondColor+')'}">
    <!-- <img class="back" src="../assets/img/mall/back.png" alt="" @click="goNativeHome()"> -->
    <img class="back" :src="styleData.backIcon || '../assets/img/mall/back.png'" @click="goNativeHome()">
    <div class="middle flex_1">
      <div class="left" @click="selectCity()" :style="{color: styleData.color}">
        <img :src=" styleData.searchIcon || '../assets/img/mall/location.png'" alt="">
        <p class="address">{{city || '定位'}}</p>
      </div>
      <div class="right">
        <img :src=" styleData.leftIcon || '../assets/img/mall/search.png'" class="search" @click="jumpTo('/mall/search?type=shop')">
        <img :src=" styleData.rightIcon || '../assets/img/mall/scan.png'"  class="scan" @click.stop="handleQrcode()">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditOtoHeader',
  components: {},
  props: ['statusH', 'city', 'styleData'],
  data () {
    return {}
  },
  methods: {
    // 选择城市
    selectCity () {
      // this.vueJumpTo('/mall/city?city=' + this.city)
      dsBridge.call("open", { url: window.location.origin+'/uqWeb/html/city/index.html?city='+ this.city, type: 'web' })
    },
    // 扫码
    handleQrcode () {
      dsBridge.call("FNScanner", (ret) => {
        apiHttp.underQrcodeSecc(ret).then(res => {
          if (res.code === 0) {
            if (res.data.type === 'sadmin') {
              this.jumpTo('/mall/payUnder?spid=' + res.data.spid + '&price=' + res.data.price)
            } else if (res.data.type === 'coupon') {
              this.jumpTo('/mall/underCancel?spid=' + res.data.spid + '&id=' + res.data.id)
            } else if (res.data.type === 'goods') {
              dsBridge.call("open", {url: window.location.origin +'/uqWeb/html/mall/mallDetails.html?id=' + res.data.goodsId,type: 'web'})
            } else if (res.data.type === 'shops' && res.data.model === 'bbc') {
            dsBridge.call("open", {url: window.location.origin +'/uqWeb/html/mall/mallShop.html?spid=' + res.data.spid,type: 'web'})
            } else if (res.data.type === 'shops' && res.data.model === 'oto') {
              this.jumpTo('/mall/Underdetail?spid=' + res.data.spid)
            } else if (res.data.type === 'order') {
              this.jumpTo('/mall/off_order_detail?orderId=' + res.data.orderId + '&bdelete=' + res.data.bdelete)
            }
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="less">

  
  .under-header{
    position: fixed;
    top: 0;
    z-index: 9999;
    right: 0;
    left: 0;
    padding: 0 .3rem;
    height: 44px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    align-items: center;
    .back{
      height: .32rem;
      margin-right: .42rem;
    }
    .middle{
      width: 100%;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left{
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        align-items: center;
        justify-content: normal;
        img{
          width: .26rem;
          margin-right: .1rem;
        }
        .address{
          width: 2.5rem;
          font-size: .28rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .right{
        .search{
          width: .35rem;
          margin-right: 0.16rem;
        }
        .scan{
          width: .34rem;
        }
      }
    }
  }
</style>
