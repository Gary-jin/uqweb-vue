<template>
  <div class="home_list" >
    <div class="header_count" v-if="list.length != 0">
      <ul>
        <li v-for="(item,index) in list"  @click="handDetail(item.id, item.model)" :key="index">
          <img v-lazy="item.thumb" alt="">
          <div class="shop_name">
            <table></table>
            <p>{{item.goodsName}}</p>
            <div class="market-price">
              <del>¥ <span>{{item.marketprice}}</span></del>
            </div>
            <div class="price">
              <div class="price_main">¥ <span>{{item.spe_price}}</span></div>
              <span>已售：{{item.sales}}</span>
            </div>
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
  name: 'list',
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
      // this.$router.push({
      //   name: 'mallHomeDetail',
      //   query: {
      //     title: id
      //   }
      // })
    }
  }
}
</script>

<style scoped>

</style>
