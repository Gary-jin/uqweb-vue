<template>
  <div class="search_main">
      <div class="header">
        <div class="home_seach_left" @click="goBack()">
          <a  slot="left" class="backBox"><i class="iconfont icon-back"></i></a>
        </div>
        <div class="home_seach_input">
          <div class="input_box">
            <img src="../../../assets/mall/img/home/seach.png" alt="">
            <input type="text" placeholder="请输入关键字" v-model="text">
          </div>
        </div>
        <div class="home_seach_right" v-if="!$route.query.type" @click="jumpTo('/mall/productList?keyword='+ text)">
          搜索
        </div>
        <div class="home_seach_right" v-if="$route.query.type" @click="jumpTo('/mall/category?keyword=' + text)">
          搜索
        </div>
      </div>
      
      <div class="search_Record">
        <div class="header_Record">
        <span>热门搜索</span>
      </div>
        <div class="search_content">
          <div class="search_list" v-for="(item,index) in listAll" :key="index" @click="handSearch(item.keyword)">{{item.keyword}}</div>
        </div>
      </div>
      <div class="search_Record">
        <div class="header_Record">
          <span>历史搜索</span>
          <img src="../../../assets/mall/img/home/delete.png" alt="" @click="handOpen">
        </div>
        <div class="search_content">
          <div class="search_list" v-for="(item,index) in listNew" :key="index" @click="handSearch(item.keyword)">{{item.keyword}}</div>
        </div>
      </div>
      <confirm
        v-model="show"
        :close-on-confirm="false"
        @on-confirm="confirm">
        <p style="text-align:center;">确定删除所有历史记录</p>
      </confirm>
  </div>
</template>

<script>
import { Confirm, TransferDomDirective as TransferDom } from 'vux'
import * as apiHttp from '../../../api/index'
export default {
  name: 'mallSearchStore',
  directives: {
    TransferDom
  },
  data () {
    return {
      show: false,
      listAll: [],
      listNew: [],
      text: ''
    }
  },
  components: {
    Confirm
  },
  mounted: function () {
    // 删除
    // console.log(this.$route.query)
    apiHttp.search(this.$route.query.type).then(response => {
      if (response.code === 0) {
        this.listNew = response.data.userSearchList
        this.listAll = response.data.searchList
      }
    })
    this.redraw()
  },
  methods: {
    redraw () {
      document.addEventListener("visibilitychange", () => {
        if(document.hidden) {
          // console.log("页面被挂起")
        }
        else {
          //   console.log('页面呼出')
          apiHttp.search(this.$route.query.type).then(response => {
            if (response.code === 0) {
                this.listNew = response.data.userSearchList
                this.listAll = response.data.searchList
                this.text = ''
            }
          })
        }
      })
    },
    confirm () {
      apiHttp.searchDelete().then(response => {
        if (response.code === 0) {
          this.$vux.toast.text('删除成功')
          this.listNew = []
          this.show = false
        } else {
          this.$vux.toast.text('删除失败')
        }
      })
    },
    handSearch (item) {
      if (!this.$route.query.type) {
        this.jumpTo('/mall/productList??keyword=' + item)
      } else {
        this.jumpTo('/mall/category?keyword=' + item)
      }
    },
    handOpen () {
      this.show = true
    }
  }
}
</script>

<style scoped>

</style>
