<template>
  <div class="message" >
    <!-- <x-header :left-options="{showBack: false}" class="collection-head" >
      <a @click="goBack()" slot="left" class="backBox"><i class="iconfont icon-back"></i></a>
      <a  class="head-right">买家留言</a>
      <a  class="message_top_ok" @click="messokr()" slot="right" > 确认</a>
    </x-header> -->
    <div class="title_box">
        <div class="title">
            <!-- <img :src="'./assets/img/home/goods/goback.png'" alt="" @click='onBack'> -->
            <div  class="top_back" @click="onBack()"><i class="iconfont icon-back"></i></div>
            <div class="title_text">商家中心</div>
            <div class="title_text2" @click="messokr()">确定</div>
        </div>
    </div>
    <div class="message_core_box">
        <div class="message_core">
            <textarea maxlength="200" name="site" v-model="note" id="" cols="42" rows="3" placeholder="请输入您的要求"></textarea>
            <div>{{note.length}}/200个字</div>
        </div>
        <div class="message_label">
            <div class="label">快捷标签</div>
            <div class="label_core">
                <div @click="labelvalue" v-for="(item ,index) in list" :key= 'index'>{{item}}</div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import * as apiHttp from '../../../api/index'
import * as utils from '../../../utils'
export default {
  data () {
    return {
        note: '',
        goods: '',
        list : []
    }
  },
  mounted () {
      this.getstyle()
  },
  computed: {
    
  },
  methods: {
      onBack(){
          dsBridge.call('closeWin')
      },
      getstyle(){
          if(utils.storage.get('messagesed')){
             this.note =  utils.storage.get('messagesed')
          }
          this.goods = this.$route.query.goodsId
           apiHttp.underShopGoodsDetails(this.$route.query.goodsId).then(res => {
            if (res.code === 0) {
                this.list = res.data.shopInfo.otherInfo.message
                console.log(this.list)
            }
        })
      },
      labelvalue(e){
          if(this.note.length + e.target.innerText.length +1 >200){
              this.$vux.toast.text('不能超出200个字')
              return
          }else{
              this.note +=e.target.innerText+'，'
          }
      },
      messokr(){
            utils.storage.set('messagesed', this.note)
            console.log(utils.storage.get('messagesed').key)
            dsBridge.call('closeWin')
      }
  }
}
</script>

<style lang="less" scoped>
    .message{
        width: 100%;
        height: 100%;
        background: #fff;
        .title_box{
            width: 100%;
            position: fixed;
            top: 0;
            z-index: 9;
            border-bottom: .01rem rgba(238,238,238,1) solid;
        }
        .title {
            padding: 0 .3rem;
            height: .88rem;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .title_text {
            //  width: 1.68rem; 
            height: .33rem;
            font-size: .34rem;
            font-weight: bold;
            color: rgba(47, 47, 47, 1);
            line-height: .36rem;
            white-space: nowrap;
            text-align: center;
        }
        .title_text2 {
            /* width: 1.68rem; */
            height: .33rem;
            font-size: .32rem;
            font-weight: bold;
            color: #D92121;
            line-height: .36rem;
            white-space: nowrap;
        }
        .head-right{
            font-size: .34rem;
            font-weight:bold;
            color:rgba(47,47,47,1);
        }
        .vux-header {
            .vux-header-righ{
                .message_top_ok{
                    font-size: .3rem;
                    font-weight:500;
                    color:rgba(217,33,33,1) !important;
                }
            }
        }
        .message_core_box{
            padding: 1.18rem .3rem 0;
            .message_core{
                height: 2.4rem;
                border: .01rem solid rgba(243,243,243,1);
                background:rgba(249,249,249,1);
                border-radius: .1rem;
                textarea{
                    width: 90%;
                    height: 70%;
                    margin: .24rem 0 0 .35rem;
                    background:rgba(249,249,249,1);
                    border: none;
                }
                >div{
                    width: 90%;
                    margin-left: .35rem;
                    display: flex;
                    justify-content: flex-end;
                    font-size: .24rem;
                    font-weight:500;
                    color:rgba(153,153,153,1);
                }
            }
            .message_label{
                .label{
                    margin: .5rem 0 .36rem;
                    font-size: .28rem;
                    font-weight:500;
                    color:rgba(153,153,153,1);
                }
                .label_core{
                    display: flex;
                    flex-wrap: wrap;
                    >div{
                        margin-right: .2rem;
                        margin-bottom:  .2rem;
                        padding: .12rem;
                        border:1px solid rgba(239,239,239,1);
                        border-radius: .1rem;
                    }
                }
            }
        }
    }
</style>
