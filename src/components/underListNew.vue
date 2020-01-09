<template>
  <div class="underListNew">
    <ul>
      <li v-for="(item,i) in list" :key="i">
        <div class="noGoods" v-if="item.goods.length === 0" @click="handleDetail(item.id)">
          <div class="shopLogo" style="width: 1.7rem;height: 1.7rem;">
            <img v-lazy="item.logo" alt="" style="max-height:1.7rem;max-width:1.7rem">
          </div>
          <div class="info" style="width: 70%;">
            <h3 class="shopName">{{item.title}}</h3>
            <div class="desc">
              <div class="score">
                <img v-for="(i, index) in 5" v-bind:key="index" :src=" i<=parseInt(item.score) ? './static/libs/img/xingxing.png' : './static/libs/img/xx.png'" alt="">
                <span>{{item.score}}</span>
              </div>
              <span class="disc">{{item.distance}}</span>
            </div>
            <p class="address">{{item.district}}</p>
            <div class="counp noGoodsCounp">
              <p class="money">{{item.coupon}}元券</p>
              <span>人气:<i>{{item.look}}</i></span>
            </div>
          </div>
        </div>
        <div class="hasGoodsWarp" v-else>
          <div class="hasGoods" @click="handleDetail(item.id)">
            <div class="shopLogo" style="height: .78rem;width: .78rem;">
              <img v-lazy="item.logo" alt="" style="max-height:.78rem;max-width:.78rem">
            </div>
            <div class="info" style="width: 85%;">
              <h3 class="shopName">{{item.title}}</h3>
              <div class="desc">
                <div class="score">
                  <img v-for="i in 5" :src=" i<=parseInt(item.score) ? './static/libs/img/xingxing.png' : './static/libs/img/xx.png'" alt="">
                  <span>{{item.score}}</span>
                </div>
                <span class="disc">{{item.distance}}</span>
              </div>
            </div>
          </div>
          <div class="info hasGoodsInfo">
            <div class="counp hasGoodsCounp">
              <p class="money">{{item.coupon}}元券</p>
              <p class="address">{{item.district}}</p>
            </div>
            <span class="people">人气:<i>{{item.look}}</i></span>
          </div>
          <div class="goodsList">
            <!-- <div class="itemList"  v-for="goods in item.goods" @click="jumpTo('/mall/underGoodsDetails?goodsId='+goods.id)"> -->
            <div class="itemList"  v-for="goods in item.goods" @click="toGoodsDetail(goods.id)">
              <img v-lazy="goods.thumb" alt="">
              <span  class="money"><i>¥</i>{{goods.spe_price}}</span>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div v-if="showNoData && list.length == 0" class="haveNoData">
      <img :src="$imgConfig.NODATA_IMG || '../../static/img/auth/kong.png'" alt="">
      <p>{{$imgConfig.NODATA_TEXT || '暂无相关数据~'}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'underListNew',
  props: ['list', 'showNoData'],
  methods: {
    handleDetail (spid) {
      this.jumpTo('/mall/Underdetail?spid=' + spid)
      //this.$router.push({name: 'mallUnderdetail', query: {spid: spid}})
    },
    // 去商品详情
    toGoodsDetail(id){
      dsBridge.call("open", {url: window.location.origin +'/uqWeb/html/oto_details/otoDetails.html?id=' + id,type: 'web'})
    },

  }
}
</script>

<style scoped lang="less">
  @import '../assets/mall/style/_Variables';
  .haveNoData{
    text-align: center;
    width: 100%;
    padding-top: 1.5rem;
    img{
      width: 40%;
    }
    p{
      font-size: .28rem;
      padding-top: .2rem;
      color: #999;
    }
  }
  .underListNew{
    margin-top: .1rem;
    ul{
      padding: 0 .3rem;
      .noGoods, .hasGoods{
        display: flex;
        align-items: center;
      }
      li{
        padding:0.3rem .2rem;
        width:100%;
        box-sizing: border-box;
        margin-bottom:0.2rem;
        background:#fff;
        border-radius: .05rem;
        .shopLogo{
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: .2rem;
          img{
            border-radius:.1rem;
          }
        }
        .goodsList{
          display: flex;
          margin-top: .22rem;
          .itemList{
            position: relative;
            img{
              width: 2.1rem;
              height: 2.1rem;
              border-radius: .1rem;
            }
            .money{
              position: absolute;
              bottom: .1rem;
              padding: 0 .2rem 0 .09rem;
              background:rgba(255,255,255,1);
              opacity:0.7;
              font-size: .3rem;
              color: #D92121;
              border-top-right-radius: .1rem;
              height: .4rem;
              line-height: .4rem;
              i{
                font-style: normal;
                font-size: .2rem;
              }
            }
          }
          .itemList:nth-child(2){
            margin: 0 .2rem;
          }
        }
        .hasGoodsInfo{
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: .1rem;
          .people{
            font-size: .24rem;
            color: #2f2f2f;
            font-family: "PingFang SC", "Helvetica Neue", "Hiragino Sans GB", "Segoe UI", "Microsoft YaHei", "微软雅黑", sans-serif;
            i{
              font-size: .26rem;
              color: #D92121;
              font-style: normal;
            }
          }
        }
        .info{
          .shopName{
            font-size: .32rem;
            color: #333333;
          }
          .desc{
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .score{
              img{
                width: 0.18rem;
                height: 0.18rem;
                margin-right: 0.02rem;
              }
              span{
                font-size: .24rem;
                color: #D92121;
                margin-left: .05rem;
              }
            }
            .disc{
              font-size: .24rem;
              color: #2F2F2F;
            }
          }
          .address{
            font-size: .26rem;
            color: #2F2F2F;
          }
          .noGoodsCounp{
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: .1rem;
          }
          .hasGoodsCounp{
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: .1rem;
            .money{
              margin-right: .2rem;
            }
          }
          .counp{
            p.money{
              padding: 0.1rem .2rem;
              font-size: 0.22rem;
              line-height: 0.22rem;
              color: #D92121;
              position: relative;
              border-radius: 0.03rem;
              background: #FFE9EE;
            }
            p.money:before{
              content: '';
              position: absolute;
              left: -0.05rem;
              top: 0.14rem;
              height: 0.12rem;
              width: 0.12rem;
              border-radius: 100%;
              background: #fff;
            }
            p.money:after{
              content: '';
              position: absolute;
              right: -0.05rem;
              top: 0.14rem;
              height: 0.12rem;
              width: 0.12rem;
              border-radius: 100%;
              background: #fff;
            }
            span{
              font-size: .24rem;
              color: #2f2f2f;
              i{
                font-size: .26rem;
                color: #D92121;
                font-style: normal;
              }
            }
          }
        }
      }
    }
  }
</style>
