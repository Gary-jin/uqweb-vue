<template>
  <div class="payMent yuWithdraw">
    <div class="header">
      <x-header
        slot="header"
        :left-options="{showBack: false}"
      >
        <a @click="goBack()" slot="left" class="backBox"><i class="iconfont icon-back"></i></a>
        {{titleInfo.credit1}}转{{titleInfo.credit2}}
        <a slot="right" @click="jumpTo('/mall/pointsYueList')">记录</a>
      </x-header>
    </div>
    <div class="content" v-if="isShow">
      <!-- 新版样式 -->
      <div class="content-info">
        <div class="content-info-top">
          <p>兑换到余额</p>
          <p @click="toAll">全部兑换</p>
        </div>
        <div class="content-info-center">
          ￥<input type="text" v-model="price">
        </div>
        <div class="content-info-bottom">
          <p class="p1">当前可用积分<span>{{userInfo.credit1}}</span></p>
          <div>
            <p class="p2"><img src="../../../../assets/mall/img/my/jingshi.png">兑换手续费{{config.poundage + '%'}}</p>
            <p class="p3">兑换比率{{config.scaling + '%'}}</p>
          </div>
        </div>
      </div>



      <!-- 老版样式 -->
      <!-- <div class="headerList">
        <div class="list">
          <div>总{{titleInfo.credit1}}</div>
          <div class="red">{{userInfo.credit1}}</div>
        </div>
        <div class="list">
          <div>手续费</div>
          <div>{{config.poundage + '%'}}</div>
        </div>
        <div class="list">
          <div>兑换比率</div>
          <div>{{config.scaling + '%'}}</div>
        </div>
      </div>
      <div class="payMent_yu">
        <table></table>
        <div class="title">
          兑换额度
        </div>
        <div class="input_box">
          <input type="text" placeholder="请输入兑换额度" v-model="price">
        </div>
      </div> -->
      <div class="btns">
        <div class="btn" @click="handShow">确定兑换</div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as apiHttp from '../../../../api/index'
  import * as utils from '../../../../utils'
  export default {
    data () {
      return {
        data: {},
        price: '',
        isShow: false,
        titleInfo: utils.storage.get('titleInfo'),
        config: {},
        userInfo: {},
        isCount: 1
      }
    },
    mounted () {
      this.getNew()
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
      //全部兑换
      toAll(){
        this.price = this.userInfo.credit1
      },
      getNew () {
        apiHttp.jifenYue().then(response => {
          if (response.code === 0) {
            this.isShow = true
            this.data = response.data
            this.config = response.data.config
            this.userInfo = response.data.userInfo
          }
        })
      },
      handShow () {
        if (!this.price) {
          this.$vux.toast.text('兑换额度不能为空')
          return
        }
         if(this.isCount == 1){ 
          this.isCount = 0
          apiHttp.jifenYueSub('save', this.price).then(res => {
            if (res.code === 0) {
              this.$vux.toast.text(res.msg)
              setTimeout(()=>{
                this.vueJumpTo('/mall/pointsYueList')
                // this.$router.push({name: 'mallPointsYueList'})
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

<style lang="less" scoped>
.content-info{
  /* width: 100%; */
  height: 2.52rem;
  margin-top: 0.2rem;
  background: #fff;
  display: flex;
  flex-direction: column;
  padding: 0 0.3rem;
  margin-bottom: 0.1rem;
  .content-info-top{
    display: flex;
    justify-content: space-between;
    font-size:.3rem;
    font-weight:500;
    color:rgba(47,47,47,1);
    margin-top: 0.35rem;
    P:last-child{
      color:rgba(217,33,33,1);
    }
  }
  .content-info-center{
    margin-top: 0.1rem;
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
  .content-info-bottom{
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size:.28rem;
    font-weight:400;
    color:rgba(102,102,102,1);
    .p1 span{
      margin-left: 0.1rem;
      color:red;
    }
    div{
      display: flex;
      align-items: center;
      .p2{
        margin-right: 0.1rem;
        img{
          height: 0.24rem;
          width: 0.24rem;
          margin-right: 0.1rem;
        }
      }
    }
  }
}

</style>
