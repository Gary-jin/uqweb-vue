<template>
  <div id="apply">
    <!--<x-header-->
      <!--slot="header"-->
      <!--:left-options="{showBack: false}">-->
      <!--<a @click="goBack()" slot="left" class="backBox"><i class="iconfont icon-back"></i></a>-->
      <!--填写信息-->
    <!--</x-header>-->

    <div class="apply-body">
      <div v-if="titlePage">
        <div v-if="!underwayShow && !succeedShow && !failedShow" style="background: #ffffff">
          <div class="item">
            <p>商家名称：</p>
            <input type="text" placeholder="请输入商家名称" v-model="applyInfo.shopName">
          </div>
          <div class="item">
            <p>商家模型：</p>
            <span @click="show1 = true">{{text1}}<img v-if="text1 == '请选择'" style="width: 10%;margin-left: .1rem;" src="../../../assets/mall/img/my/left.png" alt=""></span>
          </div>
          <div class="item">
            <p>商家分类：</p>
            <span @click="show = true">{{text}}<img v-if="text == '请选择'" style="width: 10%;margin-left: .1rem;" src="../../../assets/mall/img/my/left.png" alt=""></span>
          </div>
          <div class="item">
            <p>真实姓名：</p>
            <input type="text" placeholder="请输入姓名" v-model="applyInfo.userName">
          </div>
          <div class="item">
            <p>证件号码：</p>
            <input type="text" placeholder="请输入证件号码" v-model="applyInfo.userCid">
          </div>
          <div class="item">
            <p>电话：</p>
            <input type="text" placeholder="请输入电话" v-model="applyInfo.userPhone">
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
            <textarea name="site" v-model="address" id="" cols="38" rows="3" placeholder="街道、街牌号等"></textarea>
          </div>

          <div class="uploadingLogo">
            <p>请上传店铺logo：</p>
            <img src="../../../assets/mall/img/shop/1.png" alt="" @click="addPhoto('logo')" v-if="!phone">
            <div style="position: relative" v-if="phone">
              <img :src="phone" alt="" style="width:1.87rem;height: 1.87rem;" @click="preview('logo')">
              <img style="width: .3rem;height:.3rem;position: absolute;top: -.15rem;right: -.2rem;" src="../../../assets/mall/img/del0.png" alt="" @click="deleteImg('logo')">
            </div>
          </div>
          <div class="uploadingLogo">
            <p>手持证件：</p>
            <img src="../../../assets/mall/img/shop/1.png" alt="" @click="addPhoto('handCard')" v-if="!handCard">
            <div style="position: relative" v-if="handCard">
              <img :src="handCard" alt="" style="width:1.87rem;height: 1.87rem;" @click="preview('handCard')">
              <img style="width: .3rem;height:.3rem;position: absolute;top: -.15rem;right: -.2rem;" src="../../../assets/mall/img/del0.png" alt="" @click="deleteImg('handCard')">
            </div>
          </div>
          <div class="uploadingLogo">
            <p>证件正面：</p>
            <img src="../../../assets/mall/img/shop/1.png" alt="" @click="addPhoto('cardFront')" v-if="!cardFront">
            <div style="position: relative" v-if="cardFront">
              <img :src="cardFront" alt="" style="width:1.87rem;height: 1.87rem;" @click="preview('cardFront')">
              <img style="width: .3rem;height:.3rem;position: absolute;top: -.15rem;right: -.2rem;" src="../../../assets/mall/img/del0.png" alt="" @click="deleteImg('cardFront')">
            </div>
          </div>
          <div class="uploadingLogo">
            <p>证件背面：</p>
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
            <button :style="{background: 'linear-gradient('+$store.state.global.theme.deg+'deg,' +$store.state.global.theme.mainColor+','+$store.state.global.theme.secondColor+')'}">重新申请</button>
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
  name: 'mallApplyShopMan',
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
      applyInfo: {
        shopName: null,
        userName: null,
        userPhone: null,
        userCid: null
      },
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
      phone: '', // 店铺logo照
      applyInfo1: {},
      deleteImg1: false,
      showToast: false,
      succeedShow: false,
      failedShow: false,
      underwayShow: false,
      titlePage: false,
      modelInfo: {},
      model: null,
      photoType:'',
      handCard:'',
      cardFront:'',
      cardReverse:'',
      previewPhoto:''// 预览照片路径
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
      if(this.photoType === 'logo') {
        this.previewPhoto = this.phone
      }else if(this.photoType === 'handCard'){
        this.previewPhoto = this.handCard
      }else if(this.photoType === 'cardFront'){
        this.previewPhoto = this.cardFront
      }else if(this.photoType === 'cardReverse'){
        this.previewPhoto = this.cardReverse
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
        dsBridge.call('getPicture', (ret)=> {
          console.log(ret)
          if (this.photoType === 'logo') {
            this.phone = ret
          } else if (this.photoType === 'handCard') {
            this.handCard = ret
          } else if (this.photoType === 'cardFront') {
            this.cardFront = ret
          } else if (this.photoType === 'cardReverse') {
            this.cardReverse = ret
          }
        })
      } else {
        dsBridge.call('getCamera', (ret)=> {
          if (this.photoType === 'logo') {
            this.phone = ret
          } else if (this.photoType === 'handCard') {
            this.handCard = ret
          } else if (this.photoType === 'cardFront') {
            this.cardFront = ret
          } else if (this.photoType === 'cardReverse') {
            this.cardReverse = ret
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
          if(This.photoType === 'logo') {
            This.phone = ret.base64Data
          }else if(This.photoType === 'handCard'){
            This.handCard = ret.base64Data
          }else if(This.photoType === 'cardFront'){
            This.cardFront = ret.base64Data
          }else if(This.photoType === 'cardReverse'){
            This.cardReverse = ret.base64Data
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
      if(this.photoType === 'logo') {
        this.phone = ''
      }else if(this.photoType === 'handCard'){
        this.handCard = ''
      }else if(this.photoType === 'cardFront'){
        this.cardFront = ''
      }else if(this.photoType === 'cardReverse'){
        this.cardReverse = ''
      }
      this.deleteImg1 = false
    },
    applyConfirm () {
      if (!this.applyInfo.shopName) {
        this.$vux.toast.text('商家名称不能为空')
        return
      }
      if (!this.applyInfo.userName) {
        this.$vux.toast.text('用户名不能为空')
        return
      }
      if (!this.applyInfo.userPhone) {
        this.$vux.toast.text('手机号不能为空')
        return
      }
      if (!this.applyInfo.userCid) {
        this.$vux.toast.text('证件号不能为空')
        return
      }
      let reg = 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/
      if (!reg.test(this.applyInfo.userPhone)) {
        this.$vux.toast.text('手机号格式不对')
        return
      }
      let reg1 = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
      if (!reg1.test(this.applyInfo.userCid)) {
        this.$vux.toast.text('证件号格式不对')
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
      if (!this.phone) {
        this.$vux.toast.text('请上传店铺logo')
        return
      }
      if (!this.handCard) {
        this.$vux.toast.text('请上传手持证件照')
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
      apiHttp.applyConfirm('save', 1, this.applyInfo.shopName, this.cid, this.model, this.applyInfo.userName, this.applyInfo.userPhone, this.addressAll[0], this.addressAll[1], this.addressAll[2], this.address, this.phone, this.applyInfo.userCid, this.cardFront, this.cardReverse, this.handCard).then(res => {
        if (res.code === 0) {
          this.$vux.toast.text(res.msg)
          setTimeout(() => {
            this.$router.push({name: 'mallMy'})
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
</style>
