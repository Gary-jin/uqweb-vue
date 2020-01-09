<template>
  <div id="add-site">
    <x-header
      slot="header"
      :left-options="{showBack: false}"
    >
      <span @click="handleBack()" slot="left" class="backBox"><i class="iconfont icon-back"></i></span>
      添加地址
    </x-header>
    <div class="site-body">
    <div class="site_bor_top"></div>
      <div class="details">
        <div class="one">
          <span>收&nbsp;&nbsp;货&nbsp;&nbsp;人：</span>
          <input type="text"  @blur="onBlur" v-model="userName">
        </div>
        <div class="one">
          <span>手机号码：</span>
          <input type="text"  @blur="onBlur" v-model="mobile">
        </div>
        <div class="three" >
          <span>所在地区：</span>
          <div class="x_right_pic">
          <x-address @on-hide="logHide" @on-show="logShow" title="" v-model="value" :list="addressData"
                     @on-shadow-change="onShadowChange"    :show.sync="showAddress"></x-address>
          <!-- <img src="../../../assets/mall/img/my/left.png" alt=""> -->
          </div>
        </div>
        <div class="two" style="border:none">
          <div><span>详细地址：</span></div>
          <textarea name="site" v-model="address" @blur="onBlur" id="" cols="42" rows="3" placeholder="如道路、门牌号、小区、楼栋号、单元室等"></textarea>
        </div>
      </div>
      <!-- <div class="change">
        <i class="iconfont icon-roundcheckfill" @click="checkdefault" :style="{'color' : status === '1' ? '#fc3357' : '#a1a1a1'}"></i>
        <span>设为默认地址</span>
      </div> -->
      <div class="confirm" @click="submit">
        <button>确定</button>
      </div>
    </div>
  </div>
</template>

<script>
import './my.less'
import { XHeader, XAddress, ChinaAddressV4Data } from 'vux'
import address from '../../../plugin/address'
import * as apiHttp from '../../../api/index'
export default {
  name: 'address1',
  components: {
    XHeader,
    XAddress,
    ChinaAddressV4Data
  },
  data () {
    return {
      status: '1',
      value: [],
      addressAll: [],
      address: '',
      addressData: address,
      showAddress: false,
      userName: '',
      mobile: ''
    }
  },
  mounted: function () {
    // 删除
  },
  methods: {
    handleBack () {
      // console.log(this.$route.query.list)
      // if (this.$route.query.list == '') {
      //   this.$router.go(-2)
      // } else {
      //   this.$router.go(-1)
      // }
      this.goBack()
    },
    // ios 输入框弹起页面上移，收起来页面不下滑。
    onBlur () {
      window.scrollTo(0, 0)
    },
    doShowAddress () {
      this.showAddress = true
      setTimeout(() => {
        this.showAddress = false
      }, 2000)
    },
    onShadowChange (ids, names) {
      console.log(names)
      this.addressAll = names
    },
    checkdefault () {
      if (this.status === '1') {
        this.status = '0'
      } else {
        this.status = '1'
      }
    },
    submit () {
      let reg = 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/;
      if (!this.mobile) {
        this.$vux.toast.text('手机号不能为空')
        return
      }
      if (!reg.test(this.mobile)) {
        this.$vux.toast.text('手机号格式不对')
        return
      }
      if (this.value.length === 0) {
        this.$vux.toast.text('请选择地址')
        return
      }
      if (this.address.length === 0) {
        this.$vux.toast.text('请输入详细地址')
        return
      }
      console.log(this.value)
      apiHttp.addAdress(this.userName, this.mobile, this.addressAll[0], this.addressAll[1], this.addressAll[2], this.address, this.status, 'save').then(response => {
        if (response.code === 0) {
          this.$vux.toast.text(response.msg)
          this.goBack()
        } else {
          this.$vux.toast.text(response.msg)
        }
      })
    },
    logHide (str) {
      console.log('on-hide', str)
    },
    logShow (str) {
      console.log('on-show')
    }
  }
}
</script>
<style>
  .vux-popup-picker-select{
    min-width: 1.5rem;
    height: .4rem;
    -webkit-tap-highlight-color: transparent !important;
    -webkit-user-select: none !important;
    -moz-user-focus: none !important;
    -moz-user-select: none !important;
    /* background: rebeccapurple; */
    text-align: left !important;
  }
</style>
<style lang="less" scoped>
.weui-cell_access .weui-cell__ft::after{
  border-color: #fff !important;
  border-style: none !important;
  text-decoration: none !important;
  color: #fff !important;
}
.three {
  display: flex;
  align-items: center;
  height: 1rem;
  border-bottom: 1px #f2f2f2 solid;
  font-size: .28rem;
  color: #555555;
  .x_right_pic{
    border: none !important;
    // height: 90% !important;
    text-align: left !important;
    margin-left: 0.3rem !important;
    outline: none !important;
    color: #555555 !important;
    font-size: 0.28rem !important;
    width: 74% !important;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // img{
    //   width: .17rem;
    //   height: .28rem;
    // }
    .vux-cell-box{
      width: 100% !important;
      // height: 100% !important;
      // display: flex;
      // align-items: center;
      padding: auto  0;
      .weui-cell.vux-tap-active.weui-cell_access{
        background: red;
        width: 100% !important;
        height: 1rem !important;
      }
      .weui-cell{
        background: red;
        width: 100% !important;
        height: 1rem !important;
      }
        
        .weui-cell__ft:after{
          // margin-top: 4px !important;
          // right: -10px !important;
          // color: #999999;
        }
    }
  }
}

</style>
