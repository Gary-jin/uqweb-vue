<template>
  <div class="tool" :style="{backgroundColor: data.bgColor}">
    <div class="headers" :style="{display: data.display}">{{data.title}}</div>
    <div class="option">
      <div v-for="(item, index) of data.items" :key="index" @click="toUrl(item.link)" v-show="item.text !== '代理中心' || ((isDisUser && isDisUser.status === '1') || disUserInfo.type == 0 || disUserInfo.type == 3)">
        <div class="imgBox"><img :src="item.img" alt=""></div>
        <div :style="{color: item.color}">{{item.text}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'EditNavGroup',
  props: ['data','isDisUser','disUserInfo', 'isShop'],
  components: {},
  data () {
    return {}
  },
  methods: {
    toUrl(item){
      console.log('item', item)
      if(item.url == '/mall/grade' && this.disUserInfo.type == 3 && ((this.isDisUser && this.isDisUser.status !== '1') || this.isDisUser == '')) {
        this.jumpTo('/mall/distributor')
      }else{
        if(this.isShop > 0 && item.url == '/mall/applyShop'){
            dsBridge.call("open", {url: window.location.origin +'/uqWeb/html/shopCenter/index.html',type: 'web'})
            // dsBridge.call("open", {url: '172.16.1.239:3000' +'/uqWeb/html/shopCenter/index.html',type: 'web'})

       }else{
            console.log('22',item)
            this.jumpLink(item)
        }
       
      }
    }
  },
  mounted() {
    console.log('data', this.data)
    console.log('isDisUser', this.isDisUser)
    console.log('disUserInfo', this.disUserInfo)
    console.log('isShop', typeof this.isShop)
  },
}
</script>

<style scoped lang="less">
  .tool{
    margin-top: -1px;
    border-radius: 10px;
    background: #fff;
    .option{
      width: 100%;
      padding: 0.26rem 0 0;
      box-sizing: border-box;
      /*border-radius: 10px;*/
      flex-wrap: wrap;
      overflow: hidden;
      >div{
        margin-bottom: .4rem;
        float: left;
        width: 25%;
        text-align: center;
        font-size: 0.24rem;
        color: #666;
        div:nth-child(1){
          width: 0.42rem;
          height: 0.42rem;
          margin: 0 auto;
          margin-bottom: 0.14rem;
          img{
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .headers{
      float: left;
      line-height: 1rem;
      font-size: 0.32rem;
      width: 100%;
      padding-left: 0.3rem;
      position: relative;
      box-sizing: border-box;
      text-align: left !important;
    }
    .headers:before{
      content: '';
      position: absolute;
      width: 100%;
      height: 1px;
      background-color: #eeeeee;
      bottom: 0;
      left: 0;
    }
  }
</style>
