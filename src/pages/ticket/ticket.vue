<template>
  <div class="ticket">
    <x-header :left-options="{showBack: false}"><a slot="left"  class="backBox">
      <i class="iconfont icon-back" @click="goBack()"></i><span class="closeWeb" @click="closeWeb">关闭</span></a>
      {{title}}
    </x-header>
  </div>
</template>

<script>
export default {
  name: 'ticket',
  components: {
  },
  data () {
    return {
      url: this.$route.query.url,
      title: this.$route.query.title
    }
  },
  methods: {
    closeWeb () {
      dsBridge.call('closeFrame')
    },
    goBack () {
      // 需要跟原生对接webview的历史回退方法
      // let that = this
      // let browser = api.require('webBrowser')
      // browser.historyBack(
      //   function (ret, err) {
      //     if (!ret.status) {
      //       browser.closeView()
      //       that.$router.go(-1)
      //     }
      //   }
      // )
    }
  },
  mounted () {
    dsBridge.call('open', {url: this.$route.query.url})
  }
}
</script>
<style lang="less">
  .ticket{
    .weui-cells{
      margin-top: 0;
      font-size: 12px;
      .weui-cell{
        padding: 10px 15px !important;
      }
      .weui-cell:before{
        right: 15px;
      }
      .weui-input{
        font-size: 14px;
        color: #999;
      }
      .weui-label{
        font-size: 14px;
      }
      /*.weui-cell__bd{*/
      /*display: flex;*/
      /*}*/
    }
    .weui-cells:after,.weui-cells:before{
      left: 15px;
      right: 15px;
    }
    .weui-mask{
      background: rgba(0, 0, 0, 0.4);
    }
    .weui-actionsheet_toggle{
      bottom: 30px;
      width: 90%;
      left: 5%;
      background: none;
      .weui-actionsheet__menu{
        border-radius: 5px;
      }
      .weui-actionsheet__action{
        border-radius: 5px;
      }
      .vux-actionsheet-menu-default{
        color: #666;
        font-size: .28rem;
      }
      .weui-actionsheet__cell{
        font-size: .3rem;
      }
    }
    .vux-header{
      .backBox{
        display: flex !important;
        align-items: center;
        .closeWeb{
          font-size: 14px;
          margin-left: 10px;
        }
      }
      .vux-header-right{
        color: #666;
      }
    }
  }
</style>
