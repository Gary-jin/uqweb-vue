<template>
<div id="location">
  <x-header
    slot="header"
    :left-options="{showBack: false}" class="site-head">
    <span @click="goBack()" slot="left" class="backBox"><i class="iconfont icon-back"></i></span>
    收货地址
    <!-- <img src="../../../assets/mall/img/my/tianjia.png" alt="" @click="jumpTo('/mall/addAddress')"> -->
    <span slot="right" @click="jumpTo('/mall/addAddress')">添加</span>
  </x-header>
  <div class="mescrollBox">
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
      <div class="site-body" id="d7">
        <div class="site-item" v-for="(item,index) in list" :key="index">
          <div class="site-info">
            <div>
              <p>收货人：{{item.username}}</p>
              <span>{{item.mobile}}</span>
            </div>
            <p class="address_site">{{item.province+item.city+item.district+item.address}}</p>
          </div>
          <div class="site-change">
            <p>
              <i class="iconfont icon-roundcheckfill" @click="checkdefault(index,item.id)" :style="{'color' : item.isdefault == '1' ? '#ff0036' : '#a1a1a1'}"></i>
              设为默认
            </p>
            <div class="right" style="display: flex">
                 <div class="item1"  @click="updateAddress(item)">
                  <img src="../../../assets/mall/img/my/bianji.png" alt="">
                  <span>编辑</span>
                </div>
                <div class="item1" @click="deleteAddress(item.id,index)">
                  <img src="../../../assets/mall/img/my/shanchu.png" alt="">
                  <span>删除</span>
                </div>
            </div>
           
          </div>
        </div>
      </div>
    </mescroll-vue>
  </div>
  <confirm
    v-model="show"
    :close-on-confirm="false"
    @on-confirm="confirm">
    <p style="text-align:center;">确定删除该地址</p>
  </confirm>
</div>
</template>

<script>
import './my.less'
import { XHeader, Confirm, TransferDomDirective as TransferDom } from 'vux'
import * as apiHttp from '../../../api/index'
import MescrollVue from 'mescroll.js/mescroll.vue'
export default {
  name: 'address1',
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    Confirm,
    MescrollVue
  },
  data () {
    return {
      finish: false,
      status: 1,
      list: [],
      id: null,
      index: null,
      show: false,
      mescroll: null,
      mescrollDown: {
        auto: false,
        callback: this.refresh
      },
      mescrollUp: {
        callback: this.upCallback,
        page: {
          num: 0
        },
        htmlNodata: '<p class="upwarp-nodata">—— 我也是有底线的 ——</p>',
        noMoreSize: 5,
        toTop: {
          src: './static/img/auth/back_top.png',
          offset: 1000
        },
        empty: {
          warpId: 'd7',
         icon: this.$imgConfig.NODATA_IMG || './static/img/auth/kong.png',
          tip: this.$imgConfig.NODATA_TEXT || '暂无相关数据~'
        }
      }
    }
  },
  mounted: function () {
    this.redraw()
  },
  methods: {
    redraw () {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          // 页面被挂起
        } else {
          // 页面呼出
          this.mescrollUp.page.num = 1
          this.upCallback(this.mescrollUp.page, this.mescroll)
        }
      })
    },
    mescrollInit (mescroll) {
      this.mescroll = mescroll
    },
    upCallback (page, mescroll) {
      apiHttp.addressList(page.num).then(res => {
        if (res.code === 0) {
          this.payTypeInfo = res.data.payTypeInfo
          let arr = res.data.list === '' ? [] : res.data.list
          if (page.num === 1) this.list = []
          this.list = this.list.concat(arr)
          this.$nextTick(() => {
            mescroll.endSuccess(res.data.list.length, true)
          })
          // 加上这一句会导致在添加页没有添加，直接返回，会再次自动进入添加页。
          // if (this.list.length === 0) {
          //   this.jumpTo('/mall/addAddress?list=' + this.list)
          //   // this.$router.push({name: 'mallAddAddress', query: {list: this.list}})
          // }
        }
      }).catch((e) => {
        mescroll.endErr()
      })
    },
    refresh: function () {
      this.finish = false
      let This = this
      this.mescrollUp.page.num = 1
      this.upCallback(this.mescrollUp.page, this.mescroll)
    },
    confirm () {
      apiHttp.addressDelete(this.id).then(response => {
        if (response.code === 0) {
          this.$vux.toast.text('删除成功')
          this.show = false
          this.list.splice(this.index, 1)
          setTimeout(() => {
            this.upCallback(this.mescrollUp.page, this.mescroll)
          },1000)
        } else {
          this.$vux.toast.text(response.msg)
        }
      })
    },
    deleteAddress (id, index) {
      this.show = true
      this.id = id
      this.index = index
    },
    updateAddress (item) {
      this.$router.push({
        name: 'mallUpdateAddress',
        query: item
      })
    },
    checkdefault (index, id) {
      apiHttp.addressDefault(id).then(response => {
        if (response.code === 0) {
          // this.goBack()
          this.$vux.toast.text('设置成功')
          for (let i = 0; i < this.list.length; i++) {
            this.list[i].isdefault = '0'
            if (i === index) {
              this.list[i].isdefault = '1'
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
  @import '../../../assets/mall/style/_Variables';
  #location{
    .mescrollBox{
      width: 100%;
      position: absolute;
      top: @margin-top;
      bottom: 0;
      height: auto !important;
    }
  }
  .site-body {
    .site-item{
      .site-info{
        .address_site{
          display: -webkit-box;
          -webkit-line-clamp:2;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
</style>
