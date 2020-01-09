<template>
  <div class="qidetail_wrap" :style="{'backgroundImage': 'url(' + bg + ')'}">
    <div class="qidetail_content">
      <div class="qidetail_top">
        <div class="qidetail_tit">
          <!-- <span v-if="logo">扫描二维码做任务</span> -->
          <img :src="logo" v-if="logo" />
        </div>
      </div>
      <div class="qidetail_mid">
        <div class="qidetail_code">
          <qrcode :value="val" v-if="val"></qrcode>
        </div>
        <div class="qidetail_btns">
          <span class="qidetail_btn" @click="goRemark(1)">拉新教程</span>
          <span class="qidetail_btn" @click="goRemark(2)">拉新规则</span>
        </div>
      </div>
      <div class="qidetail_bottom">
        <span class="qidetail_btn" @click="vueJumpTo('/qilist?id='+mock.id)">拉新数据</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Qrcode } from 'vux'
import { storage } from '@/utils'
export default {
  name: 'qidetail',
  data(){
    return {
      val:"",
      bg: '',
      logo: '',
      mock: '',
      phone: ''
    }
  },
  components:{
    Qrcode
  },
  mounted(){
    let query = this.$route.query;
    if(query.type == 2){
      this.initConfirm(query)
    }else{
      this.init(query.name, parseInt(query.type))
    }
  },
  methods:{
    initConfirm(query){
      let ths = this;
      this.$vux.confirm.show({
        title: '新用户的手机号码',
        showInput: true,
        placeholder: '请输入新用户的手机号码',
        confirmText:'提交',
        closeOnConfirm: false,
        showCancelButton: false,
        onConfirm: (v) => {
          if(v && v.length == 11){
            ths.init(query.name, parseInt(query.type), v)
            ths.$vux.confirm.hide()
          }else{
            ths.$vux.toast.text('请输入正确的手机号码');
          }
        }
      })
    },
    init(name, type, phone){
      this.$http.post('/amoy/third-new/index', {name: name, url_type: type, phone: phone || ''}, true, true).then(res => {
        console.log(res)
        if (res.code === 0) {
          let mock = res.data.new;
          this.val = mock.link_url
          this.bg = mock.backdrop.indexOf('http') == -1 ? (this.link + mock.backdrop) : mock.backdrop;
          this.logo = mock.logo.indexOf('http') == -1 ? (this.link + mock.logo) : mock.logo;
          this.mock = mock
        }else{
          this.$vux.toast.text(res.msg);
        }
      })
    },
    goRemark(t){
      let o = {title: '', html: ''}
      if(t == 1 && this.mock.course_url){//拉新教程
        dsBridge.call('open', {url: this.mock.course_url})
      }else if(t == 1 && this.mock.gift_content){//拉新教程自定义内链
        o.title = '拉新教程';
        o.html = this.mock.gift_content
        storage.set('qi_remark', o)
        this.$router.push('/qiremark')
      }

      if(t == 2 && this.mock.rule_url){//拉新规则
        dsBridge.call('open', {url: this.mock.rule_url})
      }else if(t == 2 && this.mock.gift_rule){//拉新规则自定义内链
        o.title = '拉新规则';
        o.html = this.mock.gift_rule
        storage.set('qi_remark', o)
        this.$router.push('/qiremark')
      }
    }
  }
}
</script>

<style lang="less">
.qidetail_wrap{
  width:100%;
  overflow: hidden;
  position:relative;
  height:100%;
  background-repeat: no-repeat;
  background-position: center top;
  background-size: 100% auto;
  display: flex;
  align-items: flex-end;
  .qidetail_content{
    width:6.5rem;
    padding:0 0.5rem;
    .qidetail_top{
      width:100%;
      overflow: hidden;
      .qidetail_tit{
        width:100%;
        span{
          display: inline-block;
          width:100%;
          height:1rem;
          line-height:1rem;
          border-top-left-radius: 0.2rem;
          border-top-right-radius: 0.2rem;
          background:linear-gradient(-90deg,rgba(243,191,68,1),rgba(255,223,146,1));
          color:#f1052f;
          font-size:0.3rem;
          font-weight:600;
          font-family: PingFang SC;
          text-align: center;
        }
        img{
          width:100%;
          height:1rem;
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
    .qidetail_mid{
      width:100%;
      background: url('../../assets/img/choniceness/bj_21.png') no-repeat left top;
      background-size:100% 100%;
      height:6rem;
      position:relative;
      .qidetail_code{
        width:100%;
        height:3.4rem;
        position: absolute;
        left:0;
        top:0;
        z-index:2;
        text-align: center;
        padding:0.35rem 0;
        div{
          /deep/ img{
            padding:0.2rem;
            border:1px solid #FFD6D1;
            border-radius:0.1rem;
            width:3rem!important;
            height:3rem!important;
            display: inline-block;
            vertical-align: top;
          }
        }
      }
      .qidetail_btns{
        width:100%;
        height:1.94rem;
        position: absolute;
        left:0;
        bottom: 0;
        display: flex;
        padding:0 0.5rem;
        box-sizing: border-box;
        justify-content: space-between;
        align-items: center;
        span{
          width:2.2rem;
          color:#fff;
          border-radius:0.6rem;
          &:first-child{
            background:linear-gradient(0deg,rgba(255,154,55,1) 0%,rgba(255,216,133,1) 100%);
          }
          &:last-child{
            background:linear-gradient(0deg,rgba(255,84,50,1) 0%,rgba(255,172,122,1) 100%);
          }
        }
      }
    }
    .qidetail_bottom{
      width:100%;
      margin:0.4rem 0 0.6rem;
      span{
        border-radius:0.6rem;
        height:0.8rem;
        line-height:0.8rem;
        font-size:0.34rem;
        background:linear-gradient(0deg,rgba(254,223,165,1),rgba(253,196,95,1));
        color:#fff;
      }
    }
  }
  .qidetail_btn{
    display: inline-block;
    width:100%;
    height:0.68rem;
    line-height:0.68rem;
    font-size:0.3rem;
    text-align: center;
    border-radius:0.1rem;
    font-family:PingFang SC;
  }
  
}
.vux-prompt{
  padding-top:0.1rem;
  .vux-prompt-msgbox{
    padding:0.16rem;
  }
}
</style>
