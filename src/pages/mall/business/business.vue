<template>
    <div class="business">
      <div v-for="(item,i) in list" :key="i">
        <!--店铺收藏页使用的样式 目前只有线上商城的商家可以被收藏-20191015-->
        <div class="lists" v-if="businessComponentType == 'collect'" :style="{height: item.goodsList.length > 0? '3.3rem': 'auto'}">
          <div class="list-head">
            <div class="list-logo" :style="logoBg(item.logo)" @click="jump(item.id)">
            </div>
            <div class="list-center" @click="jump(item.id)">
              <div>
                <span>{{item.title|str}}</span>
                <span><rater v-model="item.score" active-color="#fc3357" disabled></rater></span>
              </div>
              <div><span>销量 {{item.sales}}</span><span>收藏 {{item.care}}</span></div>
            </div>
            <!--在我收藏的店铺页面中才会有取消收藏-->
            <div class="list-right">
              <p @click="deleteItem(item.id,i)"><span>取消收藏</span></p>
            </div>
          </div>
          <div class="list-body">
            <div v-for="(val,i) in item.goodsList" :key="i" @click="clickGoods(val)">
              <img :src="val.thumb || './static/img/under/111.png'" alt="">
              <p><span>￥{{val.ex_price}}</span></p>
            </div>
          </div>
        </div>
        <!--普通店铺列表页使用的样式 -->
        <div class="lists" v-else :style="{height: item.goodsList.length > 0? '3.3rem': 'auto'}">
          <div class="list-head" @click="jump(item.id)">
            <div class="list-logo" :style="logoBg(item.logo)"></div>
            <div class="list-center">
              <div>
                <span>{{item.title|str}}</span>
                <span><rater v-model="item.score" active-color="#fc3357" disabled></rater></span>
              </div>
              <div><span>销量 {{item.sales}}</span><span>收藏 {{item.care}}</span></div>
            </div>
            <div class="list-right"><p style="margin-top: .1rem;border: none">了解更多 >></p></div>
          </div>
          <div class="list-body">
            <div v-for="(val,i) in item.goodsList" :key="i" v-if="i<4" @click="clickGoods(val)">
            <!--<div v-for="(val,i) in item.goodsList" :key="i" v-if="i<4" @click="jumpTo({name:'mallHomeDetail',query:{title:val.id}})">-->
              <img v-lazy="val.thumb" alt="">
              <p><span>￥{{val.ex_price}}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import './business.less'
import { Rater } from 'vux'
export default {
  name: 'business',
  components: {Rater},
  props: ['list', 'businessComponentType'],
  data () {
    return {
      txtStyle: ''
    }
  },
  mounted () {
  },
  methods: {
    // 跳转商品详情
    clickGoods (val) {
      if (this.businessComponentType == 'collect') {
        // 店铺收藏页中时
        // this.jumpTo('/mall/homeDetail?title=' + val.id)
        dsBridge.call("open", {url: window.location.origin +'/uqWeb/html/mall/mallDetails.html?id=' + val.id,type: 'web'})

      } else if (this.businessComponentType == 'underShop') {
        // 线下商家搜索列表结果页中
        // this.jumpTo('/mall/underGoodsDetails?goodsId=' + val.id)
      dsBridge.call("open", {url: window.location.origin +'/uqWeb/html/oto_details/otoDetails.html?id=' + val.id,type: 'web'})

      }
    },
    // 用背景图展示商店logo，居中，完全覆盖
    logoBg (imgPath) {
      if (!imgPath) {
        imgPath = './static/img/under/111.png'
      }
      return {backgroundImage: 'url(' + imgPath + ')'}
    },
    setTxt () {
      if (this.txtStyle === '') {
        this.txtStyle = 'transform:translateX(-2rem)'
      } else {
        this.txtStyle = ''
      }
    },
    // 删除
    deleteItem: function (index, i) {
      this.$http.post('/mall/users/shops-care-delete', {careId: index}).then(res => {
        this.$vux.toast.text('取消成功')
        this.$emit('f5')
        this.list.shopList.splice(i, 1)
      })
    },
    jump (id) {
      this.$emit('jump', id)
    }
  },
  filters: {
    str (val) {
      if (val.length <= 7) {
        return val
      } else if (val.length > 7) {
        return val.substring(0, 7) + '...'
      }
    }
  }
}
</script>

<style scoped>
.business{
  text-align: center;
}
</style>
