<template>
    <div id="cateGoods">
        <div class="tabBox" v-if="category" :class="scrollTop == 1 ? 'tabListTop' : ''" :style="scrollTop == 1 ? {top:fiexdTop} : ''">
            <tab :line-width="0"  default-color="#333" v-model="categoryIndex" @touchstart.native='forbidRightSlip' @touchend.native='allowRightSlip'>
                <tab-item v-for="(item, index) of category" :key="item.id" @on-item-click="change(item.id)" :selected="index===categoryIndex">
                    <div class="tab-title">{{item.title}}</div>
                    <div v-if="item.desc" class="tab-desc" :style="scrollTop == 1 ? {display:'none'} : ''">{{item.desc}}</div>
                    <span class="xiegang">/</span>
                </tab-item>
            </tab>
        </div>
        <div class="listWrap" :style="{minHeight:clientH}">
          <div class="home_list" v-if="list && list.length > 0" :style="scrollTop == 1 ? {paddingTop:'1.2rem',minHeight:clientH} : {minHeight:clientH}">
              <div class="header_count">
                  <ul>
                      <li v-for="(item,index) in list"  @click="handDetail(item.model, item.id)" :key="index">
                      <img :imgurl="item.thumb" alt="">
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
          </div>
          <div class="kongImg" v-if="flag" :style="scrollTop == 1 ? {paddingTop:'1.2rem',minHeight:clientH} : {minHeight:clientH}">
            <img :src="$imgConfig.NODATA_IMG || noDataImg" alt="">
            <p>{{$imgConfig.NODATA_TEXT || '暂无相关数据~'}}</p>
          </div>
        </div>
    </div>
</template>
<script>
import {Tab, TabItem} from 'vux'
import * as utils from '../utils'
import * as apiHttp from '../api/index'
import noDataImg from '../../static/img/auth/kong.png'
export default {
  name: 'EditGoodsSift',
  components: {
    Tab,
    TabItem
  },
  props: ['list', 'scTop', 'fiexdTop', 'flag'],
  data () {
    return {
      noDataImg,
      top: '',
      categoryIndex: 0,
      // list:[],
      shopList: [],
      scrollTop: '',
      clientH: '',
      // // id:'',
      // category:[
      //     {
      //       'title':'美妆',
      //       'desc':'完美美妆'
      //     },
      //     {
      //       'title':'男装',
      //       'desc':'装扮男人'
      //     },
      //     {
      //       'title':'女装',
      //       'desc':'扮靓女神'
      //     },
      //     {
      //       'title':'美妆',
      //       'desc':'完美美妆'
      //     },
      //     {
      //       'title':'男装',
      //       'desc':'装扮男人'
      //     },
      //     {
      //       'title':'女装',
      //       'desc':'扮靓女神'
      //     },
      //     {
      //       'title':'美妆',
      //       'desc':'完美美妆'
      //     },
      //     {
      //       'title':'男装',
      //       'desc':'装扮男人'
      //     },
      //     {
      //       'title':'女装',
      //       'desc':'扮靓女神'
      //     },
      // ],
      category: ''
    }
  },
  methods: {
    // 获取商品分类
    getCate () {
      apiHttp.goodsCate().then(res => {
        if (res.code === 0) {
          this.category = res.data.list
        }
      })
    },
    // tab栏切换
    change (id) {
      console.log(id)
      this.$emit('handleId',id)
    },
    // 跳转详情
    handDetail (model, id) {
      if(model == 'collage'){
        dsBridge.call("open", {url: window.location.origin +'/uqWeb/html/group_booking/goodsDetails.html?id=' + id,type: 'web'})        
        // dsBridge.call("open", {url: 'http://unative.bangyaosoft.cn' +'/uqWeb/html/group_booking/goodsDetails.html?id=' + id,type: 'web'})
      }else if(model == 'bbc'){
        dsBridge.call("open", {url: window.location.origin +'/uqWeb/html/mall/mallDetails.html?id=' + id,type: 'web'})
        // dsBridge.call("open", {url: 'http://unative.bangyaosoft.cn' +'/uqWeb/html/mall/mallDetails.html?id=' + id,type: 'web'})

      }
      // this.jumpTo('/mall/homeDetail?title=' + id)
    },
    // 获取数据
    // getList (page) {
    //     apiHttp.indexList(page).then(res => {
    //       if (res.code === 0) {
    //       let arr = res.data.list === '' ? [] : res.data.list
    //       if (page === 1) this.shopList = []
    //       this.shopList = this.shopList.concat(arr)
    //       this.list = this.shopList
    //       }
    //   })
    // },
    // 监听滚动条高度，tab栏固定
    handleScroll () {
      let cateGoods = document.getElementById('cateGoods')
      if (cateGoods) {
        let cateGoodsTop = cateGoods.offsetTop
        this.top = cateGoodsTop
        // console.log('cateGoodsTop',cateGoodsTop)
        if (cateGoodsTop <= this.scTop) {
          this.scrollTop = 1
        } else {
          this.scrollTop = ''
        }
      }
    }
  },

  mounted () {
    window.addEventListener('scroll', this.handleScroll, true)
    this.getCate()
    // 列表最小高度
    let clientH = document.documentElement.clientHeight
    this.clientH = (clientH - 144) + 'px'
  }
}
</script>

<style scoped lang="less">
  @import "../assets/less/common";
    .tabBox{
        align-items: center;
        height: 1.2rem;
        z-index: 100;
        background: #fff;
        /deep/.vux-tab{
        height: 1.2rem;
            padding: 0;
        }
        /deep/.vux-tab-container{
            height: 1.2rem;
        }
       /deep/.vux-tab .vux-tab-item{
           line-height: 0.38rem;
           display: flex;
           flex-direction: column;
           align-items: center;
           justify-content: center;
           width: 1rem;
          //  margin: 0 0.3rem;
          position: relative;
       }
       .xiegang{
         position: absolute;
         right: 0;
         height: 0.2rem;
         line-height: 0.2rem;
         top: 40%;
         color: rgba(238,238,238,1);
       }
        /deep/.vux-tab .vux-tab-item.vux-tab-selected .tab-title{
            color: #fff;
            background:linear-gradient(-90deg,rgba(255,108,3,1) 0%,rgba(255,6,51,1) 100%);
        }
        /deep/.vux-tab .vux-tab-item.vux-tab-selected .tab-desc{
            background:linear-gradient(0deg,rgba(255,1,54,1) 0%, rgba(255,96,0,1) 98.2177734375%);
            -webkit-background-clip:text;
            -webkit-text-fill-color:transparent;
        }
        /deep/.vux-tab .vux-tab-item.vux-tab-selected .xiegang{
          color: rgba(238,238,238,1);
        }
        /deep/.vux-tab-wrap{
            // flex: 1;
            // height: 100%;
            z-index: 100;
            padding: 0;
            height: 100%;
        }
        .tab-title{
            font-size:0.28rem;
            font-family:PingFang SC;
            font-weight:bold;
            color:rgba(51,51,51,1);
            min-width: 0.8rem;
            height: 0.38rem;
            line-height: 0.42rem;
            border-radius: 0.19rem;
            // display: flex;
            // align-items: center;
            // justify-content: center;
        }
        .tab-desc{
            font-size:.22rem;
            font-family:PingFang SC;
            font-weight:500;
            color:rgba(51,51,51,1);
            margin-top: 0.05rem;

        }

    }
    .tabListTop{
          position: fixed;
          display: block;
          width: 100%;
          // top: 2rem;
          left: 0;
          z-index: 999;
        }
    .kongImg{
      z-index: 9999;
      background: #fff;
      text-align: center;
      width: 100%;
          img{
            width: 40%;
            margin-top: 1.5rem;
          }
          p{
            font-size: .28rem;
            padding-top: .2rem;
            color: #999;
          }
    }
    .listWrap{
      z-index: 999;
      background: #fff;
    }
</style>
