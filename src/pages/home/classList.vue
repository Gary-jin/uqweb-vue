<template>
  <div id="classify">
    <div class="header" :style="{color: '#333',background: '#fff'}">
      <img class="goBackIcon" src="../../assets/img/home/jd/goBackIcon.png" alt="" @click="goBack()">
      <span>{{this.$route.query.name}}</span>
    </div>
    <div ref="scrollList" class="recommend" @scroll="scroll">
      <div class="yujiazai" v-for="(i,ind) in 6" :key="ind" v-show="yujiazai">
        <div class="left"></div>
        <div class="right">
          <div class="rightle"></div>
          <div class="rightle"></div>
          <div class="rightle"></div>
          <div class="rightle"></div>
        </div>
      </div>
      <goods-item v-bind:list = list  @detail="detail" v-show="!yujiazai"></goods-item>
    </div>
  </div>
</template>

<script>
import * as utils from '../../utils'
import GoodsItem from '../../components/GoodsList'
export default {
  name: 'classList',
  components: {
    GoodsItem
  },
  data () {
    return {
      yujiazai:true,
      list: [],
      type: this.$route.query.type,
      // styles: false,
      pos:'',
      lastScrollTop:''
    }
  },
  watch: {
    $route(){
      this.type= this.$route.query.type
    },
  },
  beforeRouteEnter (to, from, next) {
    next (vm => {
            if (to.name === 'classList' && from.name === 'supergoods') {
              vm.$refs.scrollList.scrollTop = utils.storage.get('lastScrollTop')
            }
			    })
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'supergoods' && from.name === 'classList') {
      // this.$refs.scrollList.scrollTop = this.pos
      this.lastScrollTop = this.pos
      console.log(this.lastScrollTop)
      utils.storage.set('lastScrollTop', this.lastScrollTop)
      // from.meta.keepAlive = true
    }
    next()
  },
  methods: {
    // rank (type) {
    //   this.type = type
    //  this.getList()
    // },
    getyujiazai(){
      this.yujiazai=true
    },
    getList () {
      this.$http.post('/amoy/taobao/get-ranking-list',{
        type: this.type
      }, true, false).then(res => {
        if(res.code === 0){
          this.list = res.data
          this.yujiazai = false
        }
      })
    },
    detail (item) {
      utils.storage.set('supergoods', [item])
      dsBridge.call('openGood', item)
      // this.$router.push('/supergoods?type=' + item.type + '&id=' + item.origin_id + '&i=0')
    },
    scroll (e) {
      this.pos = e.target.scrollTop
    }
  },
  mounted () {
    this.getList();
  },
  activated () {
    this.getList()
  }
}
</script>
<style  lang="less">
  .swiperBox {
    position: relative;
    .vux-swiper-item{
      img{
        width: 100%;
        height: 100%;
      }
    }
    .vux-slider{
      .vux-indicator{
        .vux-icon-dot{
          width: 8px;
          height: 8px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.4);
        }
        .active{
          background: rgba(255, 255, 255, 1) !important;
        }
      }
    }
  }
</style>
<style scoped lang="less">
@import "../../assets/less/common";
// 预加载色块
  .yujiazai{
    padding: .15rem .15rem 0 .15rem;
    display: flex;
    justify-content: space-between;
    .left{
      width: 2.4rem;
      height: 2.4rem;
      background: #eee;
      border-radius: .1rem
    }
    .right{
      .rightle{
        width: 4.4rem;
        height: .4rem;
        background: #eee;
        margin-bottom: .24rem;
      }
    }
  }
  // 预加载色块end
/deep/.vux-tab .vux-tab-item{
  padding: 0 0.15rem;
  margin-left: 0.15rem;
  margin-right: 0.15rem;
  background: none;
  line-height: 0.9rem;
}
/deep/.vux-tab-container{
  box-sizing: border-box;
  padding-right: 0.2rem;
  border-bottom: 0.01rem solid rgba(173, 172, 171, 0.3);
}
#classify{
  /*position: relative;*/
  height: 100%;
  display: flex;
  flex-direction: column;
  .mescroll{
    // height: calc(100% - 44px);
  }
  .swiper-demo-img{
    img{
      width: 100%;
      height: 100%;
    }
  }
  .showlist-enter-active,
  .showlist-leave-active {
    transition: all .3s;
    transform: translateY(0);
  }
  .showlist-enter,
  .showlist-leave-active {
    opacity: 0;
    transform: translateY(-100%);
  }
  .header{
    position: relative;
    /*position: absolute;*/
    /*left: 0;*/
    /*top: 0;*/
    width: 100%;
    z-index: 999;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: .88rem;
    .searchIcon{
      position: relative;
      width: 0.34rem;
      height: 0.34rem;
      margin-right: 0.3rem;
    }
    .goBackIcon{
      position: relative;
      width: 0.15rem;
      height: 0.28rem;
      margin-left: 0.2rem;
      z-index: 1;
    }
    span{
      position: absolute;
      display: block;
      width: 100%;
      height: 0.88rem;
      font-size: .34rem;
      font-weight: 500;
      margin: 0.02rem .2rem 0 0;
      line-height: 0.88rem;
      text-align: center;
      z-index: 0;
    }
    .searchBox{
      width: 4.6rem;
      height: .6rem;
      border-radius: .3rem;
      display: flex;
      align-items: center;
      padding-left: .3rem;
      .icon-search{
        font-size: .27rem;
        margin-top: 0;
      }
      img{
        width: .3rem;
      }
      p{
        margin-top: 0.02rem;
        margin-left: .2rem;
        font-size: .26rem;
        line-height: .6rem;
      }
    }
    .iconfont{
      font-size: .4rem;
      margin-top: .02rem;
      color: #666666;
    }
  }
  .sortBox{
    position: relative;
    top: -1px;
    background: #fff;
    z-index: 1000;
    display: flex;
    height: .9rem;
    border-bottom: 0.01rem solid rgba(173, 172, 171, 0.3);
    .sort{
      flex: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      .active{
        color: #FF2556;
        border-bottom:0.01rem solid #FF2556;
      }
      span{
        font-size: .28rem;
        color: #333;
        margin-right: .1rem;
      }
      img{
        width: .18rem;
      }
    }
    .changeStyle{
      flex: 1;
      img{
        width: .36rem;
      }
    }
    .multiple{
      position: absolute;
      // bottom: -2.64rem;
      top: 0.9rem;
      left: 0;
      width: 100%;
      background: #fff;
      z-index: 1001;
      div{
        font-size: .28rem;
        height: .88rem;
        line-height: .88rem;
        padding-left: .3rem;
      }
      .select{
        color: #FF2556;
      }
    }
  }

  .list{
    /*padding-bottom: 44px;*/
    /*box-sizing: border-box;*/
    /*overflow-y: auto;*/
    position: absolute;
    left: 0;
    top: .88rem;
    bottom: 0;
    width: 100%;
    .dialog{
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      background: rgba(0,0,0,.2);
    }
    .tab_price{
      position: relative;
      font-size: var(--font-mid-size);
      color: #666666;
      p{
        font-size: .26rem;
      }
      span{
        font-size: 14px;
      }
      .sj{
        position: absolute;
        right: 15px;
        top: 14px;
        i{
          display: block;
        }
        i:nth-of-type(1){
          width: 0;
          height:0;
          border-left:3px solid transparent;
          border-right: 3px solid transparent;
          border-bottom: 5px solid #666666;
        }
        i:nth-of-type(2){
          width: 0;
          height:0;
          margin-top:5px;
          border-left:3px solid transparent;
          border-right: 3px solid transparent;
          border-top: 5px solid #666666;
        }
      }
      .shang i:nth-of-type(1){
        border-bottom: 5px solid !important;
      }
      .xia i:nth-of-type(2){
        border-top: 5px solid !important;
      }
    }
    .allBox{
      overflow: hidden;
      padding: .2rem 0;
      .allList{
        float: left;
        margin: 0 .25rem .2rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 1rem;
        img{
          width: 1rem;
          height: 1rem;
          border-radius: .5rem;
        }
        span{
          font-size: .26rem;
        }
      }
    }
    .high{
      background: @h-col;
      height: .1rem;
      width: 100%;
    }
    .sortBox{
      position: relative;
      top: -1px;
      background: #fff;
      z-index: 1000;
      display: flex;
      height: .9rem;
      .sort{
        flex: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        span{
          font-size: .28rem;
          color: #333;
          margin-right: .1rem;
        }
        img{
          width: .18rem;
        }
      }
      .changeStyle{
        flex: 1;
        img{
          width: .36rem;
        }
      }
      .multiple{
        position: absolute;
        // bottom: -2.64rem;
        top: 0.9rem;
        left: 0;
        width: 100%;
        background: #fff;
        z-index: 1001;
        div{
          font-size: .28rem;
          height: .88rem;
          line-height: .88rem;
          padding-left: .3rem;
        }
        .select{
          color: #FF2556;
        }
      }
    }
    ._v-container{
      top: 44px;
    }
  }
  .saleBox{
    .saleT{
      position: relative;
      width: 6.64rem;
      height: 1.32rem;
      margin: .2rem auto;
      img{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
      p{
        position: absolute;
        left: -0.2rem;
        top: .41rem;
        width: 100%;
        text-align: center;
        font-size: .32rem;
        line-height: .5rem;
        color: #fff;
      }
    }
    .sales{
      display: flex;
      img{
        width: 100%;
        height: 100%;
      }
      .sale{
        margin-left: .18666rem;
        width: 3.47rem;
        height: 4.3rem;
        .sale1{
          width: 100%;
          height: 2.11rem;
          margin-bottom: .08rem;
        }
        .sale2{
          width: 100%;
          height: 2.11rem;
        }
      }
      .sale3{
        margin-left: .18666rem;
        width: 3.47rem;
        height: 4.3rem;
      }
    }
  }
  .recommend{
    flex: 1;
    overflow-y: auto;
    background: #fff;
    /*height: calc(100% - 44px);*/
    .t{
      width: 100%;
      height: 1.2rem;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      img{
        width: 5.68rem;
      }
    }
    .goods_list_2, .goods_list_1{
      height: 100%;
      background: #f4f4f4;
      ul{
        height: 100%;
        overflow: auto;
      }
    }
  }
  .over{
    overflow-y: hidden;
  }
}
</style>
