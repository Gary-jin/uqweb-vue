<template>
  <div class="g-remark">
    <x-header  :left-options="{showBack: false}"><a slot="left" v-if="$isShowBackBtn" @click="vueGoBack()"   class="backBox">
      <i class="iconfont icon-back"></i></a>{{title}}
    </x-header>
    <div class="g-content" v-html="html"></div>
  </div>
</template>

<script>
import { storage } from '@/utils'
export default{
  name: 'g-remark',
  data () {
    return {
      html: '',
      title: ''
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      let qi_remark = sessionStorage.getItem("qi_remark");
      if(qi_remark){
        this.title = qi_remark.title
        this.html = qi_remark.html
      }
    }
  }
}
</script>

<style lang="less">
  .g-remark{
    min-height:100%;
    width:6.9rem;
    padding:0 0.3rem;
    background: #f2f2f2;
    overflow-x:hidden;
    overflow-y:auto;

    .g-content{
      width:100%;
      padding: 0.2rem 0
    }
  }
</style>
