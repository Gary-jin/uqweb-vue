<template>
  <div class="common-title mall-guess-like" v-if="list.length > 0">
               
        <div class="list">
            <ul>
                <li v-for="(item, index) in list" :key="index" @click="handDetail(item.id, item.model)">
                    <div class="goodsImg">
                        <img :src="item.thumb" alt="">
                    </div>
                    <div class="info">
                        <h3 class="title text-overflow_2-xzh">{{item.goodsName}}</h3>
                        <div class="num">
                            <span><i>¥</i>{{item.spe_price}}</span><del>¥{{item.marketprice}}</del>
                        </div>
                        <div class="btm">{{item.sales}}人付款</div>
                    </div>
                </li>
            </ul>
        </div>
    <!-- <div  v-if="list.length == 0" class="haveNoData">
      <img src="../../static/img/auth/kong.png" alt="">
      <p>暂无相关宝贝...</p>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'likeList',
  props: ['list'],
  data (){
     return {
       show:true
     }
  },
  methods: {
    handDetail (id, model) {
        if(model == 'collage'){
            dsBridge.call("open", {url: window.location.origin +'/uqWeb/html/group_booking/goodsDetails.html?id=' + id,type: 'web'})
        }else if(model == 'bbc'){
            dsBridge.call("open", {url: window.location.origin +'/uqWeb/html/mall/mallDetails.html?id=' + id,type: 'web'})
        }
    }
  }
}
</script>

<style scoped>
 .mall-guess-like {
            margin-top: .2rem;
        }
        .mall-guess-like ul{
            display:flex;
            -ms-flex-wrap: wrap;
            flex-wrap: wrap;
            -webkit-box-pack: justify;
            -ms-flex-pack: justify;
            padding: 0 0.1rem 0.1rem 0.1rem;
        }
        .mall-guess-like ul li{
            width:3.45rem;
            margin:.05rem .1rem .1rem .1rem;
            background-color:#fff;
            border-radius:.1rem
        }
        .mall-guess-like ul li .goodsImg img{
            width:3.45rem;
            height: 3.45rem;
            border-radius: .1rem .1rem 0 0;
        }
        .mall-guess-like ul li .info{
            padding: .18rem .18rem .2rem
        }
        .mall-guess-like ul li .info .title{
            font-size:0.26rem;
            font-weight:normal;
            color:#2f2f2f;
            height: .64rem;
            line-height: .34rem;
        }
        .mall-guess-like ul li .info .num{
            margin: .12rem 0 .1rem
        }
        .mall-guess-like ul li .info .num span{
            font-size:0.32rem;
            color:#D92121;
            font-weight:bold
        }
        .mall-guess-like ul li .info .num span i{
            font-style:normal;
            font-size:0.24rem;
            margin-right:.02rem
        }
        .mall-guess-like ul li .info .num del{
            font-size:.24rem;
            color:#999;
            margin-left:.12rem
        }
        .mall-guess-like ul li .info .btm{
            font-size:.22rem;
            color:#999;
        }
</style>
