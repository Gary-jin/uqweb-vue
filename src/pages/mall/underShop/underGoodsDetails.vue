<template>
  <div class="under-details" >
    <div class="mescrollBox">
      <div class="under_body">
        <div class="swiper">
          <swiper auto v-model="index" @on-index-change="onIndexChange" :show-dots='false' height="5.4rem">
            <swiper-item v-for="(item,i) in detail.thumbs" :key="i"><img v-lazy="item" alt=""  style="height: 100%;width: 100%"></swiper-item>
          </swiper>
          <p class="number">
            <span>{{index+1}}</span>
            <span> /{{detail.thumbs && detail.thumbs.length}}</span>
          </p>
          <div class="goods-details" :style="{'top': top}">
            <!--<p @click="jumpTo('/mall/Underdetail?spid='+ detail.spid)"><i class="iconfont icon-back"></i></p>-->
            <p @click="goBack()"><i class="iconfont icon-back"></i></p>
            <p @click="showToast = true"><i class="iconfont icon-share1"></i></p>
          </div>
        </div>
        <div class="goods-info" style="height: 2.5rem">
          <p class="info-title">{{detail.goodsName}}</p>
          <div class="content">
            <p>
              <span style="color: #fc3357;font-size: .26rem">￥</span>
              <span style="color: #fc3357;font-size: .35rem;margin-right: .3rem;font-weight: 600">{{detail.spe_price}}</span>
              <span><s>￥{{detail.marketprice}}</s></span>
            </p>
            <span>库存 {{detail.total}}</span>
          </div>
          <div class="content" @click="handleShow = true">
            <p>
          <span style="color: #3ECAA6;margin-right: .2rem;" v-for="(item,i) in equityInfo" :key="i" v-if="item.status == 1">
            <i class="iconfont icon-duihao" style="font-size: 12px"></i>&nbsp;&nbsp;{{item.title}}
          </span>
            </p>
            <img src="../../../assets/mall/img/my/left.png" alt="">
          </div>
        </div>
        <div class="goods-info" v-if="detail.goodsDesc">
          <p class="info-title" style="font-weight: 500">详细内容</p>
          <div v-html="detail.goodsDesc">
          </div>
          <span class="check-more" @click="jumpTo('/mall/imageText?goodsId=' + data.goodsId)">查看图文详情</span>
        </div>
        <div class="buy-notices" v-if="detail.noticeInfo" v-html="detail.noticeInfo"></div>
      </div>
    </div>
    <div class="goPay" :style="{paddingBottom: bot + 'px'}" @click="toBug()" >
      <div>
        <span>立即购买</span>
      </div>
    </div>
    <div class="under-layer" v-if="handleShow">
      <div class="layer-one">
        <div>
          <p>权益保障</p>
          <i @click="handleShow = false" class="iconfont icon-close"></i>
        </div>
        <div v-for="(item,i) in equityInfo" :key="i" class="layer-son" v-if="item.status == 1">
          <p><i class="iconfont icon-duihao"></i>&nbsp;&nbsp;{{item.title}}</p>
          <span>{{item.descs}}</span>
        </div>
        <div style="height: .5rem"></div>
      </div>
    </div>

    <div class="share_to" v-if="showToast">
      <div class="weui-mask" @click="showToast = false"></div>
      <div class="classBox">
        <div><img src="../../../assets/img/home/goods/wechat.png" alt="" @click="shareFri(1)"><p>微信好友</p></div>
        <div><img src="../../../assets/img/home/goods/friend_circle.png" alt="" @click="shareFri(2)"><p>朋友圈</p></div>
      </div>
    </div>

  <!-- 分享 -->
    <!-- <div class="share_platform" v-show="showToast">
        <div class="fenxiang_win_bg" @click="fx_win_del()"></div>
        <div class="shareType">
          <p>分享到</p>
            <div><img src="../../../assets/img/home/goods/wechat.png" alt="" @click="shareFri(1)"><p>微信</p></div>
            <div><img src="../../../assets/img/home/goods/friend_circle.png" alt="" @click="shareFri(2)"><p>朋友圈</p></div>
            <ul>
                <li @click="shareBar(1)">
                    <img src="../../../assets/img/home/goods/wechat2.png" alt="">
                    <p>微信</p>
                </li>
                <li @click="shareBar(2)">
                    <img src="../../../assets/img/home/goods/wcircle.png" alt="">
                    <p>朋友圈</p>
                </li>
                <li @click="shareBar(3)">
                    <img src="../../../assets/img/home/goods/qq2.png" alt="">
                    <p>QQ</p>
                </li>
                <li @click="shareBar(5)">
                    <img src="../../../assets/img/home/goods/qzone.png" alt="">
                    <p>QQ空间</p>
                </li>
            </ul>
        </div>
      </div> -->
     <!-- 选规格 -->
      <!-- <popup
        v-model="popupVisible"
        position="bottom">
        <div class="pop-warp">
            <div class="header">
                <div class="goodsImg">
                    <div class="img" :style="{background: `url(${detail.thumbs})50% 50% / cover no-repeat`}"></div>
                </div>
                <div class="select">
                    <span v-if="active1 != 0 || active2 != 0"><i>¥</i>{{price}}</span>
                    <span v-if="active1 == 0 && active2 == 0 "><i>¥</i>{{detail.spe_price}}</span>
                    <p v-if="selectTitle">已选：{{selectTitle}}</p>
                    <p v-else>请选择</p>
                </div>
            </div>
            <div class="info">
                <div class="color common" v-if="groupInfo.attrList" v-show="groupInfo.field1">
                    <h3>{{groupInfo.field1}}</h3>
                    <ul class="clr">
                        <li v-for="(item,index) in groupInfo.attrList.color" :key="index" :class="active1 === item ? 'active' : ''" @click="handClick(index,item)">{{item}}</li>
                    </ul>
                </div>
                <div class="size common" v-if="groupInfo.attrList" v-show="groupInfo.field2">
                    <h3>{{groupInfo.field2}}</h3>
                    <ul class="clr">
                        <li v-for="(item,index) in groupInfo.attrList.size" :key="index" @click="selecteds(index,item.price,item.total,item.id,item.field_2)" :class="{'active':index===iid}">{{item.field_2}}</li>
                    </ul>
                </div>
                <div class="number">
                    <span class="left">数量</span>
                    <div class="select-num">
                        <i class="minus" @click="reduce()">－</i>
                        <input v-model="buyNum" type="number" min="1" onkeyup="this.value=this.value.replace(/\D|^0/g,'')" 
                        onafterpaste="this.value=this.value.replace(/\D|^0/g,'')">
                        <i class="add" @click="add()">＋</i>
                    </div>
                </div>
            </div>
            <div class="buyBtn" @click="nowBuy()" >
                <button>立即购买</button>
            </div>
            <div class="closeBtn" @click="popupVisible = !popupVisible">
                <img src="../../../assets/img/home/goods/close.png" alt="">
            </div>
        </div>
    </popup> -->

    <div class="pop-warp" v-show="popupVisible">
        <div class="pop-warp_bgclo" @click="warpbgclo()"></div>
        <div class="pop-warp_box">
            <div class="header">
                <div class="goodsImg">
                    <div class="img" :style="{background: `url(${detail.thumbs})50% 50% / cover no-repeat`}"></div>
                </div>
                <div class="select">
                    <span v-if="active1 != 0 || active2 != 0"><i>¥</i>{{price}}</span>
                    <span v-if="active1 == 0 && active2 == 0 "><i>¥</i>{{detail.spe_price}}</span>
                    <p v-if="selectTitle">已选：{{selectTitle}}</p>
                    <p v-else>请选择</p>
                </div>
            </div>
            <div class="info">
                <div class="color common" v-if="groupInfo.attrList" v-show="groupInfo.field1">
                    <h3>{{groupInfo.field1}}</h3>
                    <ul class="clr">
                        <li v-for="(item,index) in groupInfo.attrList.color" :key="index" :class="active1 === item ? 'active' : ''" @click="handClick(index,item)">{{item}}</li>
                    </ul>
                </div>
                <div class="size common" v-if="groupInfo.attrList" v-show="groupInfo.field2">
                    <h3>{{groupInfo.field2}}</h3>
                    <ul class="clr">
                        <li v-for="(item,index) in groupInfo.attrList.size" :key="index" @click="selecteds(index,item.price,item.total,item.id,item.field_2)" :class="{'active':index===iid}">{{item.field_2}}</li>
                    </ul>
                </div>
                <div class="number">
                    <span class="left">数量</span>
                    <div class="select-num">
                        <i class="minus" @click="reduce()">－</i>
                        <input v-model="buyNum" type="number" min="1" onkeyup="this.value=this.value.replace(/\D|^0/g,'')" 
                        onafterpaste="this.value=this.value.replace(/\D|^0/g,'')">
                        <i class="add" @click="add()">＋</i>
                    </div>
                </div>
            </div>
            <div class="buyBtn" @click="nowBuy()" >
                <button>立即购买</button>
            </div>
            <div class="closeBtn" @click="popupVisible = !popupVisible">
                <img src="../../../assets/img/home/goods/close.png" alt="">
            </div>
          </div>
        </div>





      <!-- 评论图片弹窗 -->
      <!-- <div class="commentBigPop">
        <popup
          v-model="bigImgShow"
          position="center">
            <div class="commentBigImg">
                <img :src="bigImgPop" alt="">
            </div>
        </popup>  
      </div> -->
      
  </div>
</template>

<script>
import './underLess.less'
import './detail.less'
import * as apiHttp from '../../../api/index'
import * as utils from '../../../utils'
import { Popup,Swiper, SwiperItem } from 'vux'
export default {
  components: {
    Popup,
    Swiper,
    SwiperItem
  },
  data () {
    return {
      index: 0,
      handleShow: false,
      data: {},
      detail: {},
      equityInfo: {},
      isShow: false,
      showToast: false,
      top: '',
      device: this.$store.state.global.deviceType,
      bot: '',
      popupVisible: false,
      active1: 0,
      active2: 0,
      iid: '',
      selectTitle: '',
      groupInfo: '',
      buyNum: 1,
      price: '',
      attrId : '',
      selected : '',
      col : '',
      sizenum:'',
      selectSize: '',
      geigepiice : '',
      bigImgShow : false,
      bigImgPop : '',
      // discussList : ''
    }
  },
  created () {
    // ios底部安全区域
    let saveBottom = (dsBridge.call("receiveParams", 'safeAreaBottom1'))
    if (saveBottom == '123'){
      this.bot = 0
    } else {
      this.bot = saveBottom
    }
  },
  mounted () {
    apiHttp.underShopGoodsDetails(this.$route.query.goodsId).then(res => {
      if (res.code === 0) {
        // this.isShow = true
        this.data = res.data
        this.equityInfo = res.data.equityInfo
        this.detail = res.data.detail
        this.groupInfo = this.detail
        this.buyNum = this.groupInfo.goodsNum
      }
    })
    this.getimg()
  },
  methods: {
    warpbgclo(){
      console.log("s")
      this.popupVisible = false
    },
    fx_win_del(){
      this.showToast = false
    },
    onIndexChange (index) {
      this.index = index
    },
    shareFri (type) {
      let codeVersion = dsBridge.call('receiveParams', 'codeVersion')
      let userPhone = dsBridge.call("getUserPhone","")
      if( userPhone === '' || userPhone === null && codeVersion >= 300){
          dsBridge.call("toast", {msg: '您还未绑定手机号，请先去绑定！'})
          setTimeout(function(){
              dsBridge.call("openWin", '/judgemobile')
          },1000)
          return
      }else{
      this.showToast = false
      let that = this
      let link = ''
      if (this.device === 'iOS') {
        link = that.detail.shareInfo.link.ios
      } else {
        link = that.detail.shareInfo.link.android
      }
      let info = {
        title: that.detail.shareInfo.title,
        description: that.detail.shareInfo.desc,
        url: that.detail.shareInfo.thumb,
        contentUrl: that.detail.shareInfo.url || link || that.detail.shareInfo.link.merge,
        type: type
      }
        dsBridge.call("inviteShare", info, function(ret){
          if (ret === 'success') {
            that.$http.post('/mall/users/share', {goodsId: this.$route.query.goodsId}).then()
          }
        })
      }
    },
    toBug (){
      this.popupVisible =true
      this.buyNum = 1
    },
    formatNum (f, digit){
      var m = Math.pow(10, digit);  // digit是参数的最大精度
      return parseInt(f * m, 10) / m; 
    },
    selectIn (key) {
       this.$http.post('/mall/index/attr-list', {attrId: key}).then(res => {
          this.groupInfo.attrList.size = res.data.list
          // let price = parseFloat(res.data.list[0].price) + parseFloat(this.groupInfo.addPrice)
          this.price = this.formatNum(parseFloat(res.data.list[0].price) + parseFloat(this.groupInfo.addPrice),12)
          this.attrId = res.data.list[0].id
          this.selectTitle = this.col + '；' + this.groupInfo.attrList.size[0].field_2;
          this.geigepiice = res.data.list[0].price
      })
    },
    // 选择颜色
    handClick (index, item) {
        this.iid = 0
        this.active1 = item
        let id = this.groupInfo.attrList.field[index].id
        this.selectIn(id)
        this.col = item
    },
    // 选择尺寸
    selecteds (i, price, total, itemId, size) {
      this.iid = i
      // this.price = this.formatNum(parseFloat(this.groupInfo.addPrice) + parseFloat(price))
      this.price = parseFloat(this.groupInfo.addPrice) + parseFloat(price)
      this.total = total
      this.attrId = itemId
      this.selectSize = size
      this.selectTitle = this.active1 + '；' + this.selectSize;
      // this.sizenum = this.selectSize
    },
    // 减少
    reduce(){
        if(this.buyNum <= this.groupInfo.goodsNum){
            this.$vux.toast.text("不能再少了哦~","bottom")
            return
        }else{
            this.buyNum --
        }
    },
    // 增加
    add(){
        this.buyNum ++
    },
    nowBuy (){
      // console.log(this.buyNum == '')
      // if ( this.col == '' || this.buyNum =='') {
      //     this.$vux.toast.text("请选择规格和数量","bottom");
      //     return
      // } else{
      //   utils.storage.set('goodnum',{key : this.buyNum})
      //   utils.storage.set('goodspricechuan',{key : this.price})
      //   utils.storage.set('specification',{key : this.selectTitle})
      //   utils.storage.set('attrId',{key : this.attrId})
      //   console.log(utils.storage.get('goodnum').key)
      //   console.log(utils.storage.get('specification').key)
      //   dsBridge.call("openWin", '/mall/underGoodsBuy?goodsId='+this.data.goodsId)
      // }  

      if (this.groupInfo.field1) {
        if (this.attrId === '') {
            this.$vux.toast.text("请选择规格和数量","bottom");
            return
        }
        utils.storage.set('goodnum',{key : this.buyNum})
        utils.storage.set('goodspricechuan',{key : this.price})
        utils.storage.set('specification',{key : this.selectTitle})
        utils.storage.set('attrId',{key : this.attrId})
        console.log(utils.storage.get('goodnum').key)
        console.log(utils.storage.get('goodspricechuan').key)
        dsBridge.call("openWin", '/mall/underGoodsBuy?goodsId='+this.data.goodsId)
      }else{
        utils.storage.set('goodnum',{key : this.buyNum})
        utils.storage.set('goodspricechuan',{key : this.detail.spe_price})
        utils.storage.set('specification',{key : this.selectTitle})
        utils.storage.set('attrId',{key : this.attrId})
        console.log(utils.storage.get('goodnum').key)
        console.log(utils.storage.get('goodspricechuan').key)
        dsBridge.call("openWin", '/mall/underGoodsBuy?goodsId='+this.data.goodsId)
      }
      

    },
    // 获取分享图片
    // getimg () {
    //    this.$http.post('/mall/index/goods-detail', {goodsId: this.data.goodsId}).then(res => {
    //       this.bigImgPop = res.data.detail.discussList[0].thumbs
    //   })
    // },
  }
}

</script>

<style lang="less">
@import '../../../assets/mall/style/_Variables';
.under-details{
  ul{
    padding-left: .3rem;
  }
  li{
    list-style-type: disc;
  }
  .mescrollBox{
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 1.2rem;
    height: auto !important;
    .under_body{
      width: 100%;
      height: 100%;
      overflow: auto;
    }
  }
  .swiper{
    position: relative;
    .number{
      width: .88rem;
      height: .88rem;
      border-radius: 50%;
      border: 1px solid #fff;
      text-align: center;
      line-height: .88rem;
      position: absolute;
      right: 0.2rem;
      bottom: 0.3rem;
      background-color:rgba(255,255,255,.4);
      span{
        font-size: 0.36rem;
        font-family: "PingFang";
        color: rgb( 51, 51, 51 );
      }
    }
    .goods-details{
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 0 .3rem;
      align-items: center;
      box-sizing: border-box;
      position: absolute;
      top: .2rem;
      p{
        display: inline-block;
        i{
          font-size: .4rem;
        }
      }
    }
  }
  .goods-info{
    background: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 0 .3rem;
    margin-bottom: .2rem;
    .info-title{
      color: @font-main-color;
      font-size: @font-more-big;
      font-weight: 600;
    }
    div.content{
      display: flex;
      justify-content: space-between;
      align-items: center;
      img{
        width: .15rem;
        height: .25rem;
      }
      span{
        color: @font-light-color;
        font-size: @font-nomal;
      }
    }
    .check-more{
      width: 2.12rem;
      height: 0.57rem;
      margin: 0 auto .1rem;
      border: 1px solid @border-color;
      border-radius: .3rem;
      text-align: center;
      line-height: .57rem;
      color: @font-light-color;
    }
  }
  .under-layer{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background:rgba(0,0,0,0.7);
    .layer-one{
      background: #ffffff;
      bottom: 0;
      position: absolute;
      width: 100%;
      div:first-child{
        height: 1.1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid @border-color;
        p{
          color: @font-main-color;
          font-size: @font-more-big;
        }
        i{
          position: absolute;
          right: .3rem;
        }
      }
      .layer-son{
        height: 1.2rem;
        padding: 0 0.3rem;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        p{
          color: #3ECAA6;
          font-size: @font-nomal;
          i{
            font-size: 12px;
          }
        }
        span{
          font-size: @font-small;
          color: @font-main-color;
          margin: -0.3rem 0 0 0.4rem;
        }
      }
    }
  }
  .share_to{
    background: #fff;
    position: relative;
    width: 100%;
    .classBox{
      border-top: 1px solid #f9f6f6;
      z-index: 100000;
      position: fixed;
      bottom: 0;
      right: 0;
      left: 0;
      height: 2rem;
      width: 7.5rem;
      display: flex;
      background: #fff;
      border-radius: 0;
      div{
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img{
          width: .9rem;
          height: .9rem;
        }
        p{
          margin-top: .2rem;
          color: #666;
          font-size: .26rem;
        }
      }
    }
  }
}
.pop-warp{
    width: 100%;
    height: 100%;
    background:rgba(24,20,20,.5);
    z-index: 551;
    position: absolute;
    
}
.pop-warp .pop-warp_bgclo{
  position: relative;
  width: 100%;
  height: 100%;
  top: 0;
}
.pop-warp .pop-warp_box{
  width: 100%;
  background: #fff;
  // background: red;
  position: fixed;
  bottom: 0; 
  border-radius: .2rem  .2rem  ;
}
.pop-warp .header .goodsImg .img{
    width:2.1rem;
    height:2.1rem;
    margin-right: .22rem;
    border-radius: .05rem;
}

.pop-warp .header{
    padding: .3rem;
    display:flex;
    -webkit-box-align: end;
    -ms-flex-align: end;
    align-items: flex-end;
}

.pop-warp .header .select span{
    color:#D92B24;
    font-size:.4rem
}
.pop-warp .header .select span i{
    font-size:.28rem;
    font-style:normal
}
.pop-warp .header .select p{
  font-size:.28rem;
  color:#2f2f2f;
  margin: .2rem 0 .18rem;
  }
.pop-warp .info {
    padding: 0 .3rem;
    max-height: 5rem;
    overflow-y: scroll;
}
.pop-warp .info .common h3{
    font-size:.28rem;
    color:#2F2F2F;
    font-weight:normal
}
.pop-warp .info .common{
    padding:.1rem 0 .28rem;
    border-bottom: .01rem #eeeeee solid;
    overflow: hidden;
}
.pop-warp .info .common ul{
  padding-left: 0;
}
.pop-warp .info .common ul li{
    list-style:none;
    float:left;
    height:.54rem;
    line-height:.54rem;
    padding:0 .15rem;
    background-color:#F7F7F7;
    font-size:.26rem;
    color:#666;
    margin-right:.22rem;
    border-radius:.05rem;
    margin: .28rem .22rem 0 0;
    box-sizing: border-box;
    min-width: 1.2rem;
    text-align: center;
}
.pop-warp .info .common ul li.active{
    background: #FFF3F3;
    border: 1px solid #D92B24;
    color: #D92B24;
}
.pop-warp .number{
    display:flex;
    align-items: center;
    justify-content: space-between;
    padding: .3rem 0
}
.pop-warp .number .left{
    font-size:.28rem;
    color:#2F2F2F
}
.pop-warp .number .select-num{
    /* background-color:#F7F7F7 */
    display: flex;
    align-items: center;
}
.pop-warp .number .select-num i{
    display:inline-block;
    font-style:normal;
    font-size:.48rem;
    width:.54rem;
    color:#999999;
    background: #f7f7f7;
    border: 1px solid #D6D6D6;
    height: .54rem;
    line-height: .54rem;
    text-align: center;
}
.pop-warp .number .select-num i.minus{
    border-right: 0;
}
.pop-warp .number .select-num i.add{
    border-left: 0;
}
.pop-warp .number .select-num input{
    background-color:#fff;
    display: inline-block;
    width: .86rem;
    text-align: center;
    border: 1px solid #D6D6D6;
    height: .54rem;
    line-height: .54rem;
    font-size: .3rem;
    color: #2f2f2f;
}
.pop-warp .buyBtn button{
    width: 100%;
    height:.98rem;
    line-height: .98rem;
    text-align: center;
    font-size: .34rem;
    color: #fff;
    border-radius: 0;
    background:linear-gradient(270deg,rgba(217,33,33,1),rgba(248,123,100,1));
}
.pop-warp .closeBtn{
    position: absolute;
    top: .32rem;
    right: .3rem;
}
.pop-warp .closeBtn img{
    width: .34rem;
}
.mint-toast{
    // z-index: 99999;
}
.vux-popup-dialog.vux-popup-bottom.vux-popup-show{
  border-radius: .2rem .2rem 0 0;
  height: auto !important;
  z-index: 9999999 !important;
}

.share_platform{
width: 100%;
height: 100%;
background:rgba(24,20,20,.5);
z-index: 550;
position: absolute;
.fenxiang_win_bg{
  width: 100%;
  height: 80%;
}
.shareType{
  width: 100%;
  height: 20%;
  background: #fff;
  overflow: hidden;
  border-radius: .2rem .2rem 0 0;
  >p{
    text-align: center;
    font-size: .3rem;
    font-weight:500;
    color:rgba(47,47,47,1);
    height: .9rem;
    line-height: .9rem;
    border-bottom: .01rem rgba(238,238,238,1) solid;
  }
  ul{
    padding: 0 .5rem;
    display: flex;
    justify-content: space-between;
    margin-top: .32rem;
    list-style: none;
    li{
      list-style: none;
      img{
        width: .98rem;
        height: .98rem;
      }
      p{
        text-align: center;
        margin-top: .1rem;
      }
    }
  }
}
}
.commentBigPop .mint-popup{
    background: transparent;
}
.commentBigImg{
    padding: 0 .3rem;
}
.commentBigImg img{
    width: 100%;
}
.commentBigPop .mint-popup{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    //  z-index: 999999;
}
</style>
