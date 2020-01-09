<template>
  <div class="donation payMent">
    <x-header
      slot="header"
      :left-options="{showBack: false}"
    >
      <a @click="goBack()" slot="left" class="backBox"><i class="iconfont icon-back"></i></a>
      积分转赠
      <a slot="right" @click="jumpTo('/mall/donationList?credittype=' + credittype)"><i class="iconfont icon-iconfont02"></i></a>
    </x-header>
    <div class="donation-body content" v-if="isShow">
      <div class="body-one">
        <p>转赠到</p>
        <input type="text" placeholder="请输入手机号" v-model="uid">
        <span @click="searchUid()">搜索</span>
      </div>
      <div class="body-two">
        <div v-if="show">
          <!-- 新版样式 -->
          <div class="object-info">
            <img :src="userInfo.avatar">
            <!-- 显示用户名逻辑：先显示用户昵称，如果没有则显示用户真实姓名，其次是显示手机号 -->
            <p>{{userInfo.nickname || userInfo.realname || "("+userInfo.mobile+")"}}</p>
          </div>
          <!-- 老版样式 -->
          <!-- <div class="two-item">
            <p>UID：</p>
            <span>{{userInfo.uid}}</span>
          </div>
          <div class="two-item">
            <p>昵称：</p>
            <span>{{userInfo.nickname || '未设置'}}</span>
          </div>
          <div class="two-item" v-if="userInfo.realname">
            <p>姓名：</p>
            <span>{{userInfo.realname}}</span> 
          </div>-->
        </div>
        <div class="two-price">
          <div class="two-item">
            <p>转赠金额（元）</p>
            <p @click="toAll">转赠全部</p>
          </div>
          <div class="two-price-input">
            ￥<input type="text" v-model="dtPrice">
          </div>
          <div class="keyong">
            <span v-if="credittype === 'credit2'">当前可用余额：</span>
            <span v-if="credittype === 'credit1'">当前可用积分：</span>
            <span style="color: #fc3357" v-if="credittype === 'credit2'">￥{{dtInfo.credit2}}</span>
            <span style="color: #fc3357" v-if="credittype === 'credit1'">￥{{dtInfo.credit1}}</span>
          </div>
        </div>
      </div>
      <div class="btns" @click="confirmDt()">
        <div class="btn">确定转赠</div>
      </div>
    </div>
  </div>
</template>

<script>
import { XHeader } from 'vux'
import * as apiHttp from '../../../../api/index'
export default {
  components: {
    XHeader
  },
  data () {
    return {
      dtInfo: {},
      uid: null,
      userInfo: {},
      dtPrice: null,
      credittype: this.$route.query.credittype,
      show: false,
      isShow: false,
      isCount: 1
    }
  },
  mounted () {
    // 删除
    apiHttp.donationInfo(this.credittype).then(res => {
      if (res.code === 0) {
        this.isShow = true
        this.dtInfo = res.data.userInfo
      }
    })
     document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          // "页面被挂起"
        } else {
          this.getNew()
           this.isCount = 1
        }
      })
  },
  methods: {
    // 全部转赠
    toAll(){
      this.dtPrice = this.dtInfo.credit1
    },
    searchUid () {
      apiHttp.donationSearch(this.credittype, 'select', this.uid).then(res => {
        if (res.code === 0) {
          this.userInfo = res.data.user
          this.show = true
        } else {
          this.show = false
        }
      })
    },
    confirmDt () {
      if(this.isCount == 1){ 
        this.isCount = 0
        apiHttp.donationSub(this.credittype, 'save', this.uid, this.dtPrice).then(res => {
          if (res.code === 0) {
            this.$vux.toast.text(res.msg)
            setTimeout(() => {
              this.$router.push({name: 'mallDonationList', query: {credittype: this.credittype}})
            }, 1000)
          }else{
              this.$vux.toast.text(res.msg)
                this.isCount = 1
            }
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
@import "../../../../assets/mall/style/_Variables";
.donation{
  .donation-body{
    margin-top: @margin-top;
    .body-one{
      height: 0.8rem;
      background: #ffffff;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 0 .3rem;
      margin: 0.2rem 0;
      p{
        color: @font-main-color;
        font-size: @font-more-big;
      }
      input{
        outline: none;
        border: 0;
        width: 4.2rem;
        height: 0.6rem;
        // background: #EEEEEE;
        // border-radius: 5px;
        text-align: left;
        
      }
      span{
        width: 1.2rem;
        height: .6rem;
        // border: 1px solid @main-red-color;
        // border-radius: 17px;
        line-height: .6rem;
        text-align: center;
        font-size:.28rem;
        // font-family:PingFang SC;
        font-weight:bold;
        color:rgba(51,51,51,1);
      }
    }
    .body-two{
      padding: 0 .3rem;
      margin-top: .2rem;
      background: #ffffff;
      
      .two-item{
        display: flex;
        justify-content: flex-start;
        flex-direction: row;
        align-items: center;
        height: 1rem;
        border-bottom: 1px solid @border-color;
        p{
          color: @font-light-color;
          font-size: @font-big;
        }
        span{
          color: @font-main-color;
          font-size: @font-big;
          margin-left: .3rem;
        }
        input{
          outline: none;
          border: 0;
          width: 5rem;
          height: 0.7rem;
          background: #EEEEEE;
          border-radius: 5px;
          text-align: left;
          padding-left: .3rem;
        }
      }
      .two-price{
        height: 2.5rem;
        display: flex;
        flex-direction: column;
        // justify-content: center;
        .two-item{
          border-bottom: 0;
          display: flex;
          justify-content: space-between;
          p{
            font-size:.3rem;
            font-weight:500;
            color:rgba(47,47,47,1);
          }
          P:last-child{
              color:rgba(217,33,33,1);
            }
          
        }
        .two-price-input{
          height: 0.8rem;
          border-bottom: 1px solid rgba(238,238,238,1);
          font-size:.42rem;
          font-weight:500;
          color:rgba(47,47,47,1);
          display: flex;
          align-items: center;
          input{
            height: 0.7rem;
            border: none;
            outline: none;
            font-size: 0.3rem;
          }
        }
        .keyong{
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          span{
            float: right;
            color: @font-light-color;
            font-size: @font-nomal;
          }
        }
      }
    }
  }
}
.object-info{
  height: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  img{
    height: 1rem;
    width: 1rem;
    border-radius: 50%;
  }
  p{
    font-size:.3rem;
    font-weight:500;
    color:rgba(47,47,47,1);
    margin-top: 0.2rem;
  }
}
</style>
