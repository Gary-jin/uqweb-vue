<template>
  <div id="apply">
    <!--<x-header-->
      <!--slot="header"-->
      <!--:left-options="{showBack: false}">-->
      <!--<a @click="goBack()" slot="left" class="backBox"><i class="iconfont icon-back"></i></a>-->
      <!--申请商家-->
    <!--</x-header>-->

    <div class="apply-body">
      <div v-if="titlePage">
        <div v-if="!underwayShow && !succeedShow && !failedShow" style="background: #ffffff">
          <div class="item-title">
            <span class="span1">|</span><span class="span2">企业信息</span><span class="span3">（按照证书上的内容逐渐填写）</span>
          </div>
          <div class="item">
            <p>公司名称：</p>
            <input type="text" v-model="corporateName">
          </div>
          <div class="item">
            <p>统一社会信用代码：</p>
            <input type="text" v-model="firmCode">
          </div>
          <div class="item">
            <p>店铺名称：</p>
            <input type="text" v-model="shopName">
          </div>
          <div class="item">
            <p>商家模型：</p>
            <span @click="show1 = true">{{text1}}<img v-if="text1 == '请选择'" style="width: 10%;margin-left: .1rem;" src="../../../assets/mall/img/my/left.png" alt=""></span>
          </div>
          <div class="item">
            <p>商家分类：</p>
            <span @click="show = true">{{text}}<img v-if="text == '请选择'" style="width: 10%;margin-left: .1rem;" src="../../../assets/mall/img/my/left.png" alt=""></span>
          </div>
          <div class="item-title">
            <span class="span1">|</span><span class="span2">法人代表信息</span>
          </div>
          <div class="item">
            <p>法人代表姓名：</p>
            <input type="text" v-model="userName">
          </div>
          <div class="item">
            <p>身份证号码：</p>
            <input type="text" v-model="userCard">
          </div>
          <div class="item">
            <p>联系电话：</p>
            <input type="text" v-model="userPhone">
          </div>
          <div class="item">
            <p>发货地址：</p>
            <x-address @on-hide="logHide" @on-show="logShow" title="" v-model="value" :list="addressData"
                       @on-shadow-change="onShadowChange" placeholder="点击选择" :show.sync="showAddress">
            </x-address>
          </div>
          <div class="one" style="border:none">
            <span>详细地址：</span>
          </div>
          <div class="two">
            <textarea name="site" v-model="address" id="" cols="38" rows="3" placeholder="输入详细商家地址"></textarea>
          </div>
          <div class="item-title" style="margin-top:0.1rem">
            <span class="span1">|</span><span class="span2">企业营业执照</span>
          </div>
          <div class="uploadingLogo" style="margin-top:0">
            <p>企业营业执照：</p>
            <img src="../../../assets/mall/img/shop/1.png" alt="" @click="addPhoto('business')" v-if="!business">
            <div style="position: relative" v-if="business">
              <img :src="business" alt="" style="width:1.87rem;height: 1.87rem;" @click="preview('business')">
              <img style="width: .3rem;height:.3rem;position: absolute;top: -.15rem;right: -.2rem;" src="../../../assets/mall/img/del0.png" alt="" @click="deleteImg('business')">
            </div>
          </div>
          <div class="uploadingLogo" style="margin-top:0">
            <p>请上传店铺logo：</p>
            <img src="../../../assets/mall/img/shop/1.png" alt="" @click="addPhoto('logo')" v-if="!logo">
            <div style="position: relative" v-if="logo">
              <img :src="logo" alt="" style="width:1.87rem;height: 1.87rem;" @click="preview('logo')">
              <img style="width: .3rem;height:.3rem;position: absolute;top: -.15rem;right: -.2rem;" src="../../../assets/mall/img/del0.png" alt="" @click="deleteImg('logo')">
            </div>
          </div>
          <div class="item-title">
            <span class="span1">|</span><span class="span2">法人代表证件照片</span>
          </div>
          <div class="item">
            <p style="width:4rem">身份证类型：二代身份证</p>
          </div>
          <div class="uploadingLogo"  style="margin-top:0">
            <p>身份证正面：</p>
            <img src="../../../assets/mall/img/shop/1.png" alt="" @click="addPhoto('cardFront')" v-if="!cardFront">
            <div style="position: relative" v-if="cardFront">
              <img :src="cardFront" alt="" style="width:1.87rem;height: 1.87rem;" @click="preview('cardFront')">
              <img style="width: .3rem;height:.3rem;position: absolute;top: -.15rem;right: -.2rem;" src="../../../assets/mall/img/del0.png" alt="" @click="deleteImg('cardFront')">
            </div>
          </div>
          <div class="uploadingLogo">
            <p>身份证背面：</p>
            <img src="../../../assets/mall/img/shop/1.png" alt="" @click="addPhoto('cardReverse')" v-if="!cardReverse">
            <div style="position: relative" v-if="cardReverse">
              <img :src="cardReverse" alt="" style="width:1.87rem;height: 1.87rem;" @click="preview('cardReverse')">
              <img style="width: .3rem;height:.3rem;position: absolute;top: -.15rem;right: -.2rem;" src="../../../assets/mall/img/del0.png" alt="" @click="deleteImg('cardReverse')">
            </div>
          </div>
          <div class="confirm1" @click="applyConfirm">
            <button :style="{background: 'linear-gradient('+$store.state.global.theme.deg+'deg,' +$store.state.global.theme.mainColor+','+$store.state.global.theme.secondColor+')'}">确认申请</button>           
          </div>
        </div>
        <div v-if="underwayShow" style="margin-top: 40%">
          <img src="../../../assets/mall/img/my/jinxing.png" alt="" style="width: 30%;margin-left: 35%;">
          <p style="text-align: center">您的申请已提交，请耐心等待！</p>
        </div>
        <div v-if="succeedShow" style="margin-top: 40%">
          <img src="../../../assets/mall/img/my/cheng.png" alt="" style="width: 30%;margin-left: 35%;">
          <p style="text-align: center">您的申请已通过，请重新登录！</p>
        </div>
        <div v-if="failedShow" class="apply-failed">
          <div>
            <img src="../../../assets/mall/img/my/failed.png" alt="">
            <p>对不起！您的申请没有通过</p>
          </div>
          <div>
            <span>失败原因：</span>
            <p>{{applyInfo1.applyfor.info}}</p>
          </div>
          <div class="confirm1" @click="failedShow = false">
            <button :style="{background: 'linear-gradient('+$store.state.global.theme.deg+'deg,' +$store.state.global.theme.mainColor+','+$store.state.global.theme.secondColor+')'}">确认申请</button>                       
          </div>
          <div class="confirm1" @click="goBack()">
            <button style="margin-top: -14px;background: #a1a1a1;">取消</button>
          </div>
        </div>
      </div>
    </div>

    <confirm
      v-model="deleteImg1"
      :close-on-confirm="false"
      @on-confirm="delConfirm">
      <p style="text-align:center;">您确定要删除该图片吗？</p>
    </confirm>
    <div v-transfer-dom>
      <x-dialog v-model = "showToast">
        <div>
          <img :src="previewPhoto" style="max-width:100%;width: 5rem;height: 5rem;margin: .5rem 0">
        </div>
        <div @click="showToast = false">
          <img src="../../../assets/mall/img/del0.png" alt="">
        </div>
      </x-dialog>
    </div>
    <div v-transfer-dom>
      <popup v-model="show">
        <div class="refund-foot">
          <div class="title">
            <span>选择商品分类</span>
          </div>
          <div class="list" v-for="(item,index) in category" :key="index" @click="handChange(index,item)">
            <p>{{item.title}}</p>
            <div class="checkbox">
              <img :src="active == index ? './static/libs/img/active.png' : './static/libs/img/active_no.png'" alt="">
            </div>
          </div>
          <div class="confirm1" @click="confirm">
            <!-- <button style="background: -webkit-linear-gradient(left, #fb2f74, #ff7e7e);border-radius: .8rem;margin-top: .5rem;">确定</button> -->
            <button :style="{background: 'linear-gradient('+$store.state.global.theme.deg+'deg,' +$store.state.global.theme.mainColor+','+$store.state.global.theme.secondColor+')'}" style="border-radius: .1rem;margin-top: .5rem;">确定</button>
          </div>
        </div>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup v-model="show1">
        <div class="refund-foot">
          <div class="title">
            <span>选择商家模型</span>
          </div>
          <div class="list" v-for="(item,i) in modelInfo" v-bind:key="i" @click="handChange1(i,item)">
            <p>{{item.title}}</p>
            <div class="checkbox">
              <img :src="active1 == i ? './static/libs/img/active.png' : './static/libs/img/active_no.png'" alt="">
            </div>
          </div>
          <div class="confirm1" @click="confirm1">
            <!-- <button style="background: -webkit-linear-gradient(left, #fb2f74, #ff7e7e);border-radius: .8rem;margin-top: .5rem;">确定</button> -->
            <button :style="{background: 'linear-gradient('+$store.state.global.theme.deg+'deg,' +$store.state.global.theme.mainColor+','+$store.state.global.theme.secondColor+')'}" style="border-radius: .1rem;margin-top: .5rem;">确定</button>
          </div>
        </div>
      </popup>
    </div>
    <actionsheet v-model="showPhoto" :menus="menus"  show-cancel @on-click-menu="click"></actionsheet>
  </div>
</template>

<script>
import './shops.less'
import { XHeader, XAddress, ChinaAddressV4Data, Popup, Previewer, Actionsheet, TransferDomDirective as TransferDom, Confirm, XDialog } from 'vux'
import * as apiHttp from '../../../api/index'
import address from '../../../plugin/address'
export default {
  name: 'mallApplyShopFirm',
  directives: {
    TransferDom
  },
  data () {
    return {
      menus: {
        menu1: '从相册选择一张',
        menu2: '拍照'
      },
      showPhoto: false,
      corporateName:null,// 公司名称
      firmCode:null,// 信用代码
      shopName:null,// 店铺名称
      userName:null,
      userCard:null,
      userPhone:null,
      value: [],
      address: '',
      addressAll: [],
      addressData: address,
      showAddress: false,
      text: '请选择',
      text1: '请选择',
      cid: null,
      show: false,
      show1: false,
      active: null,
      active1: null,
      category: {},
      business: '', // 营业执照照片
      applyInfo1: {},
      deleteImg1: false,
      showToast: false,
      succeedShow: false,
      failedShow: false,
      underwayShow: false,
      titlePage: false,
      modelInfo: {},
      model: null,
      cardFront:'', // 身份证正面照片
      cardReverse:'', // 身份证背面照片
      photoType:'', // 判断点击哪个照片
      logo:'',// 店铺logo
      previewPhoto:'' // 预览照片路径
    }
  },
  components: {
    XHeader,
    XAddress,
    ChinaAddressV4Data,
    Popup,
    Previewer,
    Actionsheet,
    Confirm,
    XDialog
  },
  mounted () {
    // 删除
    apiHttp.applyShop().then(res => {
      if (res.code === 0) {
        this.applyInfo1 = res.data
        this.titlePage = true
        this.category = res.data.category
        this.modelInfo = res.data.modelInfo
        if (this.applyInfo1.applyfor) {
          if (this.applyInfo1.applyfor.status === '1') {
            this.underwayShow = true
          } else if (this.applyInfo1.applyfor.status === '2') {
            this.succeedShow = true
            this.$router.replace('/mall/shopCenter')
          } else if (this.applyInfo1.applyfor.status === '9') {
            this.failedShow = true
          }
        }
      }
    })
  },
  methods: {
    // 添加照片
    addPhoto(type){
      this.showPhoto = true
      this.photoType = type
      console.log(this.photoType)
    },
    // 预览照片
    preview(type){
      this.photoType = type
      if(this.photoType === 'business') {
        this.previewPhoto = this.business
      }else if(this.photoType === 'cardFront'){
        this.previewPhoto = this.cardFront
      }else if(this.photoType === 'cardReverse'){
        this.previewPhoto = this.cardReverse
      }else if(this.photoType === 'logo'){
        this.previewPhoto = this.logo
      }
      this.showToast = true
    },
    doShowAddress () {
      this.showAddress = true
      setTimeout(() => {
        this.showAddress = false
      }, 2000)
    },
    onShadowChange (ids, names) {
      this.addressAll = names
    },
    logHide (str) {
      console.log('on-hide', str)
    },
    logShow (str) {
      console.log('on-show')
    },
    handChange (index, val) {
      this.active = index
      this.text = val.title
      this.cid = val.id
    },
    handChange1 (index, item) {
      this.active1 = index
      this.model = item.model
      this.text1 = item.title
      apiHttp.applyShopFei(this.model).then(res => {
        this.category = res.data.category
      })

    },
    confirm () {
      this.show = false
    },
    confirm1 () {
      this.show1 = false
    },
    // 拍照 上传照片
    click (key) {
      console.log(key)
      if (key === 'menu1') {
        //this.galleryImg()
        dsBridge.call('getPicture', (ret)=>{
          if(this.photoType === 'business') {
            this.business = ret
          }else if(this.photoType === 'cardFront'){
            this.cardFront = ret
          }else if(this.photoType === 'cardReverse'){
            this.cardReverse = ret
          }else if(this.photoType === 'logo'){
            this.logo = ret
          }
        })
      } else {
        dsBridge.call('getCamera', (ret)=>{
          if(this.photoType === 'business') {
            this.business = ret
          }else if(this.photoType === 'cardFront'){
            this.cardFront = ret
          }else if(this.photoType === 'cardReverse'){
            this.cardReverse = ret
          }else if(this.photoType === 'logo'){
            this.logo = ret
          }
        })
      }
    },
    // 从相册中选取图片
    galleryImg () {
      let This = this
      let apiIn = window.api
      apiIn.getPicture({
        sourceType: 'album',
        mediaValue: 'pic',
        destinationType: 'base64',
        allowEdit: true,
        preview: true,
        targetWidth: 100,
        targetHeight: 100
      }, function (ret, err) {
        if (ret) {
          if(This.photoType === 'business') {
            This.business = ret.base64Data
          }else if(This.photoType === 'cardFront'){
            This.cardFront = ret.base64Data
          }else if(This.photoType === 'cardReverse'){
            This.cardReverse = ret.base64Data
          }else if(This.photoType === 'logo'){
            This.logo = ret.base64Data
          }
        } else {
          console.log(JSON.stringify(err))
        }
      })
    },
    // 拍照
    captureImage () {
      let This = this
      api.getPicture({
        sourceType: 'camera',
        mediaValue: 'pic',
        destinationType: 'base64',
        allowEdit: true,
        preview: true,
        targetWidth: 100,
        targetHeight: 100
      }, function (ret, err) {
        if (ret) {
          if(This.photoType === 'business') {
            This.business = ret.base64Data
          }else if(This.photoType === 'cardFront'){
            This.cardFront = ret.base64Data
          }else if(This.photoType === 'cardReverse'){
            This.cardReverse = ret.base64Data
          }else if(This.photoType === 'logo'){
            This.logo = ret.base64Data
          }
        } else {
          console.log(JSON.stringify(err))
        }
      })
    },
    // 点击显示模态框图片
    look (item, index) {
      this.imgs = []
      for (let i = 0; i < item.length; i++) {
        let obj = {
          src: item[i]
        }
        this.imgs.push(obj)
      }
      this.$nextTick(() => {
        this.$refs.previewer.show(index)
      })
    },
    //删除上传的图片
    deleteImg (type) {
      this.photoType = type
      this.deleteImg1 = true
    },
    //确认删除图片
    delConfirm () {
      if(this.photoType === 'business') {
        this.business = ''
      }else if(this.photoType === 'cardFront'){
        this.cardFront = ''
      }else if(this.photoType === 'cardReverse'){
        this.cardReverse = ''
      }else if(this.photoType === 'logo'){
        this.logo = ''
      }
      this.deleteImg1 = false
    },
    applyConfirm () {
      if (!this.corporateName) {
        this.$vux.toast.text('公司名称不能为空')
        return
      }
      if (!this.firmCode) {
        this.$vux.toast.text('公司社会信用代码不能为空')
        return
      }
      if (!this.shopName) {
        this.$vux.toast.text('店铺名称不能为空')
        return
      }
      if (!this.userName) {
        this.$vux.toast.text('姓名不能为空')
        return
      }
      if (!this.userPhone) {
        this.$vux.toast.text('手机号不能为空')
        return
      }
      let reg = 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/
      if (!reg.test(this.userPhone)) {
        this.$vux.toast.text('手机号格式不对')
        return
      }
      if (!this.cid) {
        this.$vux.toast.text('商家分类不能为空')
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
      if (!this.model) {
        this.$vux.toast.text('请输入商家模型')
        return
      }
      if (!this.business) {
        this.$vux.toast.text('请上传营业执照')
        return
      }
      if (!this.logo) {
        this.$vux.toast.text('请上传店铺logo')
        return
      }
      if (!this.cardFront) {
        this.$vux.toast.text('请上传身份证正面照片')
        return
      }
      if (!this.cardReverse) {
        this.$vux.toast.text('请上传身份证背面照片')
        return
      }
      apiHttp.applyConfirmQiye('save', 2, this.shopName, this.cid, this.model, this.userName, this.userPhone, this.addressAll[0], this.addressAll[1], this.addressAll[2], this.address, this.logo, this.userCard, this.cardFront, this.cardReverse, this.corporateName, this.firmCode, this.business).then(res => {
        if (res.code === 0) {
          this.$vux.toast.text(res.msg)
          setTimeout(() => {
            this.jumpTo('/mall/my')
          }, 1000)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import "../../../assets/mall/style/_Variables";
.vux-cell-box:not(:first-child):before{
  border:none;
}
.apply-failed{
  margin-top: .1rem;
  div:first-child{
    background: #ffffff;
    height: 3.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-bottom: 1px solid @border-color;
    img{
      width: 30%;
      margin-bottom: .1rem;
    }
    p{
      color: @font-main-color;
      font-size: @font-big;
    }
  }
  div:nth-child(2){
    background: #ffffff;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0.2rem 0.3rem;
    span{
      color: @font-main-color;
      font-size: @font-big;
    }
    p{
      width: 75%;
      color: @font-light-color;
      font-size: @font-nomal;
    }
  }
  .confirm1{
    background: none;
  }
}
.item-title{
  height: 0.8rem;
  line-height: 0.8rem;
  padding-left: 0.3rem;
  background: #F7F7F7;
  .span1{
    font-weight: 900;
    color: #FF0036;
  }
  .span2{
    font-size: 0.3rem;
    color: #333333;
    font-weight:bold;
    padding: 0 0.2rem 0 0.1rem;
  }
  .span3{
    font-size:0.26rem;
    font-family:'PingFang-SC-Medium';
    font-weight:500;
    color:rgba(153,153,153,1);
  }
}
</style>
