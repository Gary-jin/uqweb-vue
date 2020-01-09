<template>
  <div class="team">
    <x-header
      slot="header"
      :left-options="{showBack: false}" v-if="agentInfo.size > 0"
    >
      <a @click="goBack()" slot="left" class="backBox"><i class="iconfont icon-back"></i></a>
      {{agentInfo.team || '我的团队'}}
    </x-header>
    <x-header
      slot="header"
      :left-options="{showBack: false}" v-if="agentInfo.size == 0"
    >
      <a @click="goBack()" slot="left" class="backBox"><i class="iconfont icon-back"></i></a>
      {{agentInfo.team || '我的团队'}}({{(info.count0)}})
    </x-header>
    <div class="team-body">
      <div class="team-head" v-if="agentInfo.size > 0">
        <span @click="changeType(1)" :class="type === 1 ? 'spActive' : ''" v-if="agentInfo.size >= 1">{{agentInfo.one || '一级'}}({{info.count1}}人)</span>
        <span @click="changeType(2)" :class="type === 2 ? 'spActive' : ''" v-if="agentInfo.size >= 2">{{agentInfo.two || '二级'}}({{info.count2}}人)</span>
        <span @click="changeType(3)" :class="type === 3 ? 'spActive' : ''" v-if="agentInfo.size >= 3">{{agentInfo.three || '三级'}}({{info.count3}}人)</span>
      </div>
      <div style="margin-top: 40%" v-show="(info.count0 == 0) || (type == 2 && info.count2 == 0) || (type == 3 && info.count3 == 0) || (type == 1 && info.count1 == 0)">
        <img src="../../../assets/mall/img/my/tuandui.png" alt="" style="width: 34%;margin-left: 33%;">
        <p style="width: 40%;margin-left: 30%;">亲，您的团队暂时没有人哦!</p>
      </div>
      <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
          <div class="team-list" v-for="(item,i) in list" :key="i" @click="checkTeam(item.uid)">
            <div class="user-info">
              <img :src="item.avatar || './static/libs/img/touxiang.png'" alt="">
              <p>{{item.nickname || '未设置'}}</p>
            </div>
            <div class="info-msg">
              <!-- 3.5版优化去掉 -->
              <!-- <p v-if="item.realname">名称：{{item.realname}}</p> -->
              <div class="info-msg-list">
                <img src="../../../assets/mall/img/my/bianhao.png">
                <p>会员编号：{{item.uid}}</p>
              </div>
              <div class="info-msg-list" v-if="item.mobile">
                <img src="../../../assets/mall/img/my/phone.png">
                <p>手机号码：{{item.mobile}}</p>
              </div>
              <div class="info-msg-list" v-if="item.isDis">
                <img src="../../../assets/mall/img/my/dengji.png">
                <p>等&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级：{{item.isDis}}</p>
              </div>
              <div class="info-msg-list" v-if="item.created_at">
                <img src="../../../assets/mall/img/my/time.png">
                <p>加入时间：{{formatDate(item.created_at)}}</p>
              </div>
            </div>
          </div>
      </mescroll-vue>
    </div>
  </div>
</template>

<script>
import * as apiHttp from '../../../api/index'
import MescrollVue from 'mescroll.js/mescroll.vue'
export default {
  components: {
    MescrollVue
  },
  data () {
    return {
      type: 0,
      info: {},
      list: {},
      agentInfo: {},
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
          warpId: 'd8',
          icon: this.$imgConfig.NODATA_IMG || './static/img/auth/kong.png',
          tip: this.$imgConfig.NODATA_TEXT || '暂无相关数据~'
        }
      }
    }
  },
  mounted () {
    // apiHttp.myTeam(this.type).then(res => {
    //   if (res.code === 0) {
    //     this.info = res.data
    //     this.list = res.data.list
    //     this.agentInfo = res.data.titleInfo.alias.agentInfo
    //   }
    // })
  },
  methods: {
    changeType (type) {
      this.type = type
    },
    checkTeam (uid) {
      apiHttp.myTeamLe(uid).then(res => {
        if (res.code === 0) {
          this.info = res.data
          this.list = res.data.list
          this.agentInfo = res.data.titleInfo.alias.agentInfo
        }
      })
    },
    mescrollInit (mescroll) {
      this.mescroll = mescroll
    },
    upCallback (page, mescroll) {
      apiHttp.myTeam(this.type, page.num).then(res => {
        if (res.code === 0) {
          this.info = res.data
          this.agentInfo = res.data.titleInfo.alias.agentInfo
          let arr = res.data.list === '' ? [] : res.data.list
          if (page.num === 1) this.list = []
          this.list = this.list.concat(arr)
          this.$nextTick(() => {
            mescroll.endSuccess(res.data.list.length, true)
          })
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
    }
  }
}
</script>

<style scoped lang="less">
  @import "../../../assets/mall/style/_Variables";
  .team{
    .team-body{
      margin-top: @margin-top;
      .team-head{
        height: 1rem;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        background: #ffffff;
        padding: 0 .3rem;
        margin-bottom: .2rem;
        .spActive{
          color: @main-red-color !important;
          border-bottom: 2px solid @main-red-color;
        }
        span{
          height: 1rem;
          line-height: 1rem;
          color: @font-main-color;
          font-size: @font-more-big;
          box-sizing: border-box;
        }
      }
      .team-list{
        width: 100%;
        // padding: 0 .3rem;
        background: #ffffff;
        height: 3.54rem;
        display: flex;
        flex-direction: column;
        // justify-content: flex-start;
        // align-items: center;
        margin: 0.2rem 0;
        .user-info{
          width: 6.9rem;
          height: 1.22rem;
          margin: 0 auto;
          border-bottom: 1px solid rgba(247,247,247,1);
          display: flex;
          align-items: center;
          img{
            height: 0.8rem;
            width: 0.8rem;
            border-radius: 50%;
          }
          p{
            font-size:.34rem;
            font-weight:500;
            color:rgba(51,51,51,1);
            margin-left: 0.34rem;
          }
        }
        
        .info-msg{
          width: 6.9rem;
          margin: 0 auto;
          .info-msg-list{
            display: flex;
            align-items: center;
            margin: 0.1rem 0;
            img{
              height: 0.28rem;
              width: 0.28rem;
              margin-right: 0.2rem;
            }
            p{
              font-size:.28rem;
              font-weight:500;
              color:rgba(51,51,51,1);
            }
          }
          
        }
      }
    }
  }
</style>
