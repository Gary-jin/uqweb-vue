<template>

  <div id="app"  style="font-size: 14px;color: #292929;font-family: '微软雅黑'">
     <div class="detail_top" :style="{paddingTop: statusH + 'rem'}">
        <div>
          <a @click="goBack()" slot="left" class="detail_top_left"><i class="iconfont icon-back"></i></a>
          <a  class="detail_top_cen">城市列表</a>
        </div>
        <div class="search"  >
          <input type="text" placeholder="请输入城市" v-model="keyword">
        </div>
      </div>
    <div v-show="isShowCitys" class="city">
      <!-- <div class="search"  >
        <input type="text" placeholder="请输入城市" v-model="keyword">
      </div> -->
      <div :style="{top: 1.7+statusH + 'rem'}" class="city-wrapper city-wrapper-hook"  ref='wrapper'>
        <div class="scroller-hook">
          <div class="curentCity">当前定位：{{this.location || '定位中'}}</div>
          <div class="cities cities-hook">
            <div v-for="i in cityData.slice(0,1)" :key="i.name">
              <div class="title" :id="i.name">{{i.name}}</div>
              <ul class="hotulbox">
                <li v-for="(item, index) in i.cities" :key="index" class="hotcity" :data-name="item.name" :data-id="item.code">
                  <!--<span class="border-1px name" @touchend="touchUp(item)"  @touchstart="chooseCity()">{{item.name}}</span>-->
                  <span class="border-1px name" @click="selectCity(item)">{{item.name}}</span>
                </li>
              </ul>
            </div>
            <div v-for="i in cityData.slice(1)" :key="i.name">
              <div class="title" :id="i.name">{{i.name}}</div>
              <ul>
                <li v-for="(item, index) in i.cities" :key="index" class="line city-click" :data-name="item.name" :data-id="item.code">
                  <!--<span class="border-1px name" @touchend="touchUp(item)"  @touchstart="chooseCity()">{{item.name}}</span>-->
                  <span class="border-1px name" @click="selectCity(item)">{{item.name}}</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
        <div class="shortcut shortcut-hook" style="right: 50px;top:60px !important;"  @touchstart="touchIndex1" >
          <ul style="width: 100px;text-align: left;padding: 20px 0">
            <li v-for="(i,index) in cityData" :class="{ color:index == current}" :data-anchor="i.name" class="letter" :key="index">{{i.name.substr(0, 1)}}</li>
          </ul>
        </div>
        <div class="search-content" ref="search" v-show="keyword">
          <ul>
            <li class="serach-item border-bottom" v-for="item in listItem" :key="item.id" @click="selectCity(item)">{{item.name}}</li>
            <li v-show="hasNoData" class="serach-item border-bottom">没有搜索到匹配的数据</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {cityData} from './city'
import BScroll from 'better-scroll'
export default {
  name: 'city',
  components: {},
  props: {
    list: Object
  },
  data () {
    return {
      current: 0,
      captchaBoxShow: false,
      letter: '',
      countTime: 0,
      countTimer: null,
      time: 60,
      location: '',
      submit: {
        sms_captcha: '',
        captcha: '',
        area_code: '',
        _token: ''
      },
      cityWrapper: document.querySelector('.city-wrapper-hook'),
      cityScroller: document.querySelector('.scroller-hook'),
      cities: document.querySelector('.cities-hook'),
      shortcut: document.querySelector('.shortcut-hook'),
      shortcutList: [],
      cityData: cityData, // 数据源
      scroll: null,
      anchorMap: {},
      touch: {},
      toastShow: false,
      isShowCitys: true,
      toastText: '',
      tipString: '',
      keyword: '',
      listItem: [],
      statusH: '',

    }
  },
  created () {
    let safeArea = dsBridge.call('receiveParams', 'safeAreaTop1')
    let size = (document.documentElement.clientWidth / 7.5)
    if (safeArea == '123'){
      this.statusH = 0
    } else {
      this.statusH = (safeArea / size)
    }
  },
  methods: {
    goBack() {
      dsBridge.call('closeWin')
    },
    touchIndex1 (e) {
      // console.log(e.path['0'].dataset.anchor)
      let citylist = this.cityData
      for(let i=0;i<citylist.length;i++){
        if(citylist[i].name == e.path['0'].dataset.anchor ){
          this.current = i
        }
      }
      let anchor = e.target.getAttribute('data-anchor')
      let obj = document.getElementById(anchor)
      let oPos = obj.offsetTop - 44 
      this.scroll.scrollToElement(obj, 1500, oPos)
    },
    toast (str) {
      let v = this
      v.toastText = str
      v.toastShow = true
      setTimeout(function(){
        v.toastShow = false
      }, 1500)
    },
    selectCity (item) {
      this.location = item.name
      this.$http.post('/mall/oto/latlng', {keyword: item.name}).then(res => {
        if (res.code === 0) {
          this.$store.commit('setUserLocation', {
            name:item.name, 
            lat: res.data.latlng.lat,
            lon: res.data.latlng.lng
          })
          this.$router.go(-1)
        }
      })
    }
  },
  computed: {
    hasNoData() {
      return !this.listItem.length  //没有搜索的条件是否显示
    }
  },
  watch: {
    keyword () {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      if (!this.keyword) {  //清空
        this.listItem = ""
        return
      }
      this.timer = setTimeout(() => {
        const result = []
        for (let i in this.cityData) {
          this.cityData[i].cities.forEach((value) => {   //匹配搜索的条件
            if (value.name.indexOf(this.keyword) > -1) {
              result.push(value)
            }
          })
        }
        this.listItem = result
        console.log(result)
      }, 100)
    }
  },
  mounted () {
    // const options = {
    //   scrollY: true,
    //   scrollX: false,
    //   mouseWheel: true,
    //   click: true,
    //   taps: true
    // }
    console.log(this.$route.query.city)
    this.scroll = new BScroll(this.$refs.wrapper, {click: true})
    // this.scroll = new BScroll(this.$refs.wrapper)
    if (this.$route.query.city === 'undefined' || !this.$route.query.city) {
      this.location = '定位失败'
    } else {
      this.location = this.$route.query.city
    }
  }
}
</script>

<style scoped lang="less">
@import './reset.css';
@import './city.css';
* {
  margin: 0;
  padding: 0;
}
.curentCity{
  padding: .1rem 16px;
}
.detail_top{
    width: 100%;
    height: .88rem;
    background: #fff;
    position: absolute;
    top: 0;
    z-index: 6666;
    >div:nth-child(1){
      height: .88rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fff;
      z-index: 498;
      .detail_top_left{
        margin-left: .3rem ;
        z-index: 501;
      }
      .detail_top_cen{
        font-size: .34rem;
        font-weight:bold;
        color:rgba(47,47,47,1);
        position: absolute; 
        width: 100%;
        text-align: center;
        z-index: 499;
      }
      .detail_top_rig{
        width: 1rem;
        height: .88rem;
        z-index: 500;
        img{
          width: .11rem;
          height: .44rem;
          margin: .22rem .45rem;
        }
      }
    }
  }
.search{
  width: 100%;
  background: #fff;
  // position: absolute;
  // z-index: 999;
  input{
    margin: 5px 5%;
    // padding: -1px 16px;
    line-height: 30px;
    border-radius: 17px;
    width: 80%;
    padding-left: 20px;
    background: #e0e0e0;
  }
}
.search-content {
  z-index: 1;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #eee;
    .serach-item {
      line-height: .72rem;
      padding-left: .2rem;
      color: #666;
      background: #fff;
      border-bottom: 1px solid #f1f0f0;
    }
}
.mycity {
  text-align: center;
  font-size: 12px;
  margin: 20px 0;
}
.list-box {
  padding: 0 43px;
}
.list-item {
  height: 43px;
  line-height: 42px;
  border-bottom: 1px solid #ECECEC;
  text-align: center;
}
.list-item input {
  border:none;
  text-align: center;
  outline: none;
}
.small-icon {
  display: inline-block;
  width: 100%;
  height: 100%;
  vertical-align: top;
}
.toast {
  position: fixed;
  z-index: 2000;
  left: 50%;
  top:45%;
  transition:all .5s;
  -webkit-transform: translateX(-50%) translateY(-50%);
  -moz-transform: translateX(-50%) translateY(-50%);
  -ms-transform: translateX(-50%) translateY(-50%);
  -o-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
  text-align: center;
  border-radius: 5px;
  color:#FFF;
  background: rgba(17, 17, 17, 0.7);
  height: 45px;
  line-height: 45px;
  padding: 0 15px;
  max-width: 150px;
}
.cities{
  div:first-of-type{
    ul{
      display: flex;
      flex-wrap: wrap;
      li{
        width: 2rem;
        height: 0.80rem;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 !important;
        span:after{
          display: none;
        }
      }
    }
  }
}

</style>
