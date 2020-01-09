<template>
  <div class="newFree">
    <div class="freeContent">
      <img src="../../assets/img/free/newFree.png" alt>
      <div class="cont">
        <div class="orderPath">
          <img src="../../assets/img/free/orderProcess.png" class="title" alt>
          <img src="../../assets/img/free/step.png" alt>
        </div>
        <div class="mustSeize">
          <div class="title">
            <img src="../../assets/img/free/newfight.png" alt>
          </div>
          <div class="mustBox">
            <div class="mustList" v-for="(item,index) in list" :key="index">
              <div class="good">
                <div class="goodPic">
                  <img v-lazy="item.img" alt class="pic">
                </div>
                <div class="goodMsg">
                  <p class="name">{{item.title}}</p>
                  <div class="money">
                    <p>¥<span class="m1">{{item.price}}</span></p>
                    <p>补贴 ¥ {{item.free_money}}</p>
                  </div>
                  <div class="progress">
                    <x-progress :percent="item.mark" :show-cancel="false"></x-progress>
                  </div>
                  <div class="num">
                    剩余<span>{{item.number}}</span>单
                  </div>
                </div>
              </div>
              <div class="power">
                <div class="powerMsg">{{item.rec}}{{item.allow}}可领取</div>
                <div class="payMoney" @click="handDetail(item.active_id)">
                  <span>{{(item.price - item.free_money).toFixed(2)}}</span>元立即抢
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rule" v-if="isRule">
          <div class="title">
            <img src="../../assets/img/free/freeRule.png" alt>
          </div>
          <div class="ruleBox" v-html="rule"></div>
        </div>
        <div :style="{height: bot+ 'px'}"></div>
      </div>
    </div>
    <div class="invite"  :style="{paddingBottom: bot + 'px'}">
      <div class="inviteBtn" @click="share">分享免单商品给好友</div>
    </div>
    <div class="v-transfer-dom">
      <x-dialog v-model="showPoster" class="poster">

        <img src="../../assets/img/free/close.png" class="closePoster" alt @click="close">
        <img :src="imgs" alt class="pic">
        <div class="posterFooter">
          <div class="share" @click="showShare">
            <img src alt>分享海报
          </div>
          <div class="downImg" @click="shareFri(4)">
            <img src alt>保存图片
          </div>
        </div>
      </x-dialog>
    </div>
    <div class="share_to" v-transfer-dom>
      <div class="weui-mask" @click="showToast = false" v-if="showToast"></div>
      <div class="classBox" v-if="showToast">
        <div>
          <img src="../../assets/img/home/goods/wechat.png" alt @click="shareFri(1)">
          <p>微信好友</p>
        </div>
        <div>
          <img src="../../assets/img/home/goods/friend_circle.png" alt @click="shareFri(2)">
          <p>朋友圈</p>
        </div>
        <div>
          <img src="../../assets/img/home/goods/qq.png" alt @click="shareFri(3)">
          <p>QQ</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { XProgress,TransferDom,XDialog } from 'vux'
export default {
  components: {
    XProgress,
    XDialog
  },
  directives: {
    TransferDom
  },
  data () {
    return {
      showPoster: false,
      list: [],
      imgs: '',
      // imgUrl: '',
      showToast: false,
      info: this.$store.state.user.userInfo,
      rule: '',
      isRule: true,
      uid: '',
      invite_code: '',
      bot: 0
    }
  },

  methods: {
    freeGood (){
      this.$http.post('/amoy/home/freeorder', {}, true, true).then(res => {
        if(res.code == 0){
          let arr = res.data.data
          if (res.info) {
            this.isRule = true
            this.rule = res.info.rule
          } else {
            this.isRule = false
          }
          for(let i = 0; i< arr.length; i++){
            let mark = ((Number(arr[i].num) - Number(arr[i].number)) / Number(arr[i].num))*100
            arr[i]['mark'] = mark;
          }
          this.list = res.data.data
        }
      })
    },
    handDetail (id) {
      let that = this;
      this.$http.post('/amoy/home/freeget', {active_id: id}, true, true).then(res => {
        if (res.code === 0) {
          let goodUrl = res.data.url
          if(res.data.type === 1){
            dsBridge.call("open", {url: res.data.url})
          }else if(res.data.type === 2){
            dsBridge.call("open", {url: res.data.url})
          }else if(res.data.type === 'undefined'){
            dsBridge.call('albcAuth', {url: res.data.url})
          }else{
            dsBridge.call("open", {url: res.data.url})
          }
        } else {
          that.$vux.toast.text(res.msg)
        }
      })
      // this.$router.push({
      //   name: 'freeGood',
      //   query: {
      //     id: id
      //   }
      // })
    },
    bill(){
      // this.$http.post('/amoy/user/invite', {}, true, true).then(res => {
      //   if (res.code === 0) {
      //     if (res.data.img) {
      //       let item = res.data.img[0]
      //       let timestamp = (new Date()).getHours()
      //       if (this.uid != '' && this.invite_code != '') {
      //         this.imgUrl = this.link + '/amoy/user/invite?tpl=' + item + '&uid=' + this.uid + '&invite_code=' + this.invite_code + '&timestamp=' + timestamp
      //       }
      //       this.imgs = item
      //     }
      //   }
      // })
      this.$http.post('/amoy/user/invite-poster', {}, true, true).then(res => {
        if (res.code === 0) {
          if (res.data.img) {
              this.imgs = res.data.img[0]
          }
        }
      })
    },
    close () {
      this.showPoster = false
    },
    shareFri (type) {
      let that = this
      if(type != 4) {
        dsBridge.call("inviteShare", {url: that.imgs, type: type})
      } else {
        dsBridge.call("saveMediaToAlbum", {url: that.imgs})
      }
    },
    share (){
      // if(dsBridge.call("receiveParams", 'mobile') === '' || dsBridge.call("receiveParams", 'mobile') === null){
      //     dsBridge.call("openWin", '/judgemobile')
      // } else {
      //   if (this.imgs === ''){
      //     this.$vux.toast.text('邀请海报图加载失败')
      //   } else {
      //     this.showPoster = true
      //   }
      // }
      let userPhone = dsBridge.call("getUserPhone","")
      if( userPhone === '' || userPhone === null && this.$codeVersion >= 300){
          this.$vux.toast.text('您还未绑定手机号，先去绑定吧！')
          setTimeout(function(){
              dsBridge.call("openWin", '/judgemobile')
          },2000)
      } else {
          if (this.imgs === ''){
              this.$vux.toast.text('邀请海报图加载失败')
          } else {
              this.showPoster = true
          }
      }
    },
    showShare (type) {
      this.showToast = true
    },
    keepImgs () {
      dsBridge.call("saveMediaToAlbum", {url: that.imgs})
    },
  },
  created () {
    this.uid = dsBridge.call('receiveParams', 'uid')
    this.invite_code = dsBridge.call('receiveParams', 'invite_code')
    //ios底部安全区域
    let saveBottom = (dsBridge.call("receiveParams", 'safeAreaBottom1'))
    if (saveBottom == '123'){
      this.bot = 0
    } else {
      this.bot = saveBottom
    }
  },
  mounted () {
    this.freeGood()
    this.bill()
  }
}
</script>

<style lang="less"  scoped>
.newFree {
  height: 100%;
  position: relative;
  .freeContent {
    height: calc(100% - 1.1rem);
    overflow: auto;
    display: flex;
    flex-direction: column;
    .cont {
      background: #db1316;
      .orderPath {
        text-align: center;
        .title {
          width: 5.8rem;
        }
      }
      .mustSeize {
        margin: 0.2rem 0.1rem;
        .title {
          text-align: center;
          img {
            width: 5.8rem;
          }
        }
        .mustList {
          margin: 0.2rem 0;
          height: 3.3rem;
          background: #fff;
          border-radius: 0.2rem;
          .good {
            padding: 0.25rem;
            box-sizing: border-box;
            overflow: hidden;
            .goodPic {
              width: 1.82rem;
              height: 1.82rem;
              border-radius: 0.1rem;
              float: left;
              margin-right: 0.2rem;
              .pic {
                width: 1.82rem;
                height: 1.82rem;
                border-radius: 5px;
              }
            }
            .goodMsg {
              float: left;
              height: 1.82rem;
              width: 4.3rem;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              .name {
                font-size: 0.26rem;
                line-height: 0.33rem;
                color: #333;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
              }
              .money {
                display: flex;
                justify-content: space-between;
                font-size: 0.28rem;
                color: #fe2514;
                p {
                  font-size: 0.26rem;
                  line-height: 0.4rem;
                  span {
                    font-size: 0.34rem;
                    line-height: 0.4rem;
                  }
                }
              }
              .num {
                font-size: 0.28rem;
                color: #747474;
                span {
                  color: #fe2514;
                }
              }
            }
          }
          .power {
            border-top: 1px solid #f4f4f4;
            height: 1rem;
            padding: 0 0.25rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.28rem;
            color: #747474;
            .powerMsg{
              width: 65%;
              line-height: 0.3rem;
            }
            .payMoney {
              height: 0.57rem;
              padding: 0 0.2rem;
              font-size: 0.26rem;
              background: linear-gradient(to right, #ff1919, #ff7500);
              border-radius: 0.28rem;
              line-height: 0.57rem;
              text-align: center;
              color: #fff;
            }
          }
        }
      }
      .rule {
        margin-top: 0.2rem;
        .title {
          text-align: center;
          img {
            width: 5.8rem;
          }
        }
        .ruleBox {
          margin: 0.2rem;
          padding: 0.2rem;
          border: 1px dashed #fff;
          border-radius: 0.2rem;
          font-size: 0.28rem;
          line-height: 0.45rem;
          color: #fff;
        }
      }
    }
  }
  .invite {
    position: fixed;
    bottom: 0;
    height: 1.1rem;
    width: 100%;
    padding: 0.125rem 0;
    // box-sizing: border-box;
    background: #f22b40;
    .inviteBtn {
      width: 90%;
      margin-left: 5%;
      height: 0.85rem;
      background: #fff584;
      color: #d00015;
      font-weight: bold;
      font-size: 0.32rem;
      line-height: 0.85rem;
      border-radius: 0.425rem;
      text-align: center;
    }
  }
}

</style>
<style lang ='less'>
.progress .weui-progress__inner-bar {
  background-color: #fe2514;
}
.poster {
  .weui-dialog {
    background: none;
  }
  .closePoster {
    width: 0.55rem;
    position: absolute;
    right: 0;
    top: 0;
  }
  .pic {
    margin-top: 0.5rem;
    width: 220px;
  }
  .posterFooter {
    margin-top: 1.1rem;
    /*display: flex;*/
    /*justify-content: space-around;*/
    /*align-items: center;*/
    .share, .downImg {
      display: inline-block;
      padding: 0 .6rem;
      /*width: 2.82rem;*/
      height: 0.8rem;
      border-radius: 0.4rem;
      background: #fedf2d;
      color: #9a0c0b;
      font-size: 0.3rem;
      line-height: 0.8rem;
      text-align: center;
    }
  }
}
.share_to {
  background: #fff;
  position: relative;
  width: 100%;
  .classBox {
    border-top: 1px solid #f9f6f6;
    z-index: 100000;
    position: fixed;
    bottom: 0;
    height: 2rem;
    width: 7.5rem;
    display: flex;
    background: #fff;
    border-radius: 0;
    div {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
        width: 0.9rem;
        height: 0.9rem;
      }
      p {
        margin-top: 0.2rem;
        color: #666;
        font-size: 0.26rem;
      }
    }
  }
}
</style>


