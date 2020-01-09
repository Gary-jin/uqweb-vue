import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'
import * as utils from '../utils'
Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'layout',
      component: resolve => require(['@/pages/layout/'], resolve),
      redirect: '/mall/home',
      children: [
        {
          path: '/diy',
          name: 'diy',
          component: resolve => require(['@/pages/diy/'], resolve),
          meta: {title: '自定义', keepAlive: false, isShowSearch: false, isShowTab: false, routerZindex: 3}
        },
        {
          path: '/clockIn',
          name: 'clockIn',
          component: resolve => require(['@/pages/clockIn/index'], resolve),
          meta: {title: '早起打卡1', keepAlive: false, isShowHead: false, isShowTab: false, routerZindex: 2}
        },
        {
          path: '/paySuccess',
          name: 'paySuccess',
          component: resolve => require(['@/pages/clockIn/paySuccess'], resolve),
          meta: {title: '支付结果', keepAlive: false, isShowHead: false, isShowTab: false, routerZindex: 2}
        },
        {
          path: '/regulation',
          name: 'regulation',
          component: resolve => require(['@/pages/clockIn/regulation'], resolve),
          meta: {title: '规则说明', keepAlive: false, isShowHead: false, isShowTab: false, routerZindex: 2}
        },
        {
          path: '/clockInDetail',
          name: 'clockInDetail',
          component: resolve => require(['@/pages/clockIn/detail'], resolve),
          meta: {title: '挑战明细', keepAlive: false, isShowHead: false, isShowTab: false, routerZindex: 2}
        },
        // 老的共享影视，不能删除，目前bizId=4的用户在使用。
        {
          path: '/videoList',
          name: 'videoList',
          component: resolve => require(['@/pages/home/videoList'], resolve),
          meta: {title: '共享影视', keepAlive: false, isShowHead: true, isShowTab: false, routerZindex: 2}
        },
        // 新的共享影视，没有包含专属定制功能
        {
          path: '/videoHome',
          name: 'videoHome',
          component: resolve => require(['@/pages/video/index'], resolve),
          meta: {title: '共享影视', keepAlive: false, isShowHead: false, isShowTab: false, routerZindex: 2}
        },
        {
          path: '/videoSearch',
          name: 'videoSearch',
          component: resolve => require(['@/pages/video/videoSearch'], resolve),
          meta: {title: '新影视搜索', keepAlive: false, isShowHead: false, isShowTab: false, routerZindex: 2}
        },
        {
          path: '/videoRecommend',
          name: 'videoRecommend',
          component: resolve => require(['@/pages/video/videoRecommend'], resolve),
          meta: {title: '新影视推荐', keepAlive: false, isShowHead: false, isShowTab: false, routerZindex: 2}
        },
        {
          path: '/videoPlay',
          name: 'videoPlay',
          component: resolve => require(['@/pages/video/videoPlay'], resolve),
          meta: {title: '新影视播放', keepAlive: false, isShowHead: false, isShowTab: false, routerZindex: 2}
        },
        {
          path: '/videoPay',
          name: 'videoPay',
          component: resolve => require(['@/pages/home/videoPay'], resolve),
          meta: {title: '支付中心', keepAlive: false, isShowHead: true, isShowTab: false, routerZindex: 3}
        },
        {
          path: '/videoCard',
          name: 'videoCard',
          component: resolve => require(['@/pages/home/videoCard'], resolve),
          meta: {title: '卡密列表', keepAlive: false, isShowSearch: true, isShowTab: false, routerZindex: 3}
        },
        {
          path: '/videoDetail',
          name: 'videoDetail',
          component: resolve => require(['@/pages/home/videoDetail'], resolve),
          meta: {title: '共享影视', keepAlive: false, isShowHead: false, isShowTab: false, routerZindex: 3}
        },
        {
          path: '/dayingList',
          name: 'dayingList',
          component: resolve => require(['@/pages/home/dayingList'], resolve),
          meta: {title: '晒单', keepAlive: true, isShowSearch: true, isShowTab: false, routerZindex: 2}
        },
        {
          path: '/dayingDetail',
          name: 'dayingDetail',
          component: resolve => require(['@/pages/home/dayingDetail'], resolve),
          meta: {title: '详情', keepAlive: false, isShowHead: true, isShowTab: false, routerZindex: 3}
        },
        {
          path: '/daying',
          name: 'daying',
          component: resolve => require(['@/pages/home/daying'], resolve),
          meta: {title: '晒单', keepAlive: false, isShowHead: true, isShowTab: false, routerZindex: 3}
        },
        {
          path: '/comment',
          name: 'comment',
          component: resolve => require(['@/pages/home/comment'], resolve),
          meta: {title: '发表评论', keepAlive: false, isShowHead: false, isShowTab: false, routerZindex: 4}
        },
        {
          path: '/dayingShop',
          name: 'dayingShop',
          component: resolve => require(['@/pages/home/dayingShop'], resolve),
          meta: {title: '选择晒单商品', keepAlive: true, isShowHead: false, isShowTab: false, routerZindex: 4}
        },
        {
          path: '/classify',
          name: 'classify',
          component: resolve => require(['@/pages/home/classify'], resolve),
          meta: {title: '分类', keepAlive: true, isShowSearch: false, isShowTab: false, routerZindex: 2}
        },
        {
          path: '/classifyVideo',
          name: 'classifyVideo',
          component: resolve => require(['@/pages/home/classifyVideo'], resolve),
          meta: {title: '分类', keepAlive: true, isShowSearch: false, isShowTab: false, routerZindex: 3}
        },
        {
          path: '/classList',
          name: 'classList',
          component: resolve => require(['@/pages/home/classList'], resolve),
          meta: {title: '各类榜单', keepAlive: true, isShowSearch: false, isShowTab: false, routerZindex: 2}
        },
        {
          path: '/block',
          name: 'block',
          component: resolve => require(['@/pages/block'], resolve),
          meta: {title: '交易大厅', keepAlive: true, isShowHead: false, isShowTab: false, routerZindex: 2}
        },
        {
          path: '/turnOut',
          name: 'turnOut',
          component: resolve => require(['@/pages/block/turnOut'], resolve),
          meta: {title: '转出', keepAlive: false, isShowHead: true, isShowTab: false, routerZindex: 3}
        },
        {
          path: '/exchange',
          name: 'exchange',
          component: resolve => require(['@/pages/block/exchange'], resolve),
          meta: {title: '兑换区块币', keepAlive: false, isShowHead: true, isShowTab: false, routerZindex: 3}
        },
        {
          path: '/blockList',
          name: 'blockList',
          component: resolve => require(['@/pages/block/list'], resolve),
          meta: {title: '交易记录', keepAlive: false, isShowHead: true, isShowTab: false, routerZindex: 3}
        },
        {
          path: '/help',
          name: 'help',
          component: resolve => require(['@/pages/my/help'], resolve),
          meta: {title: '帮助中心', keepAlive: false, isShowHead: true, isShowTab: false, routerZindex: 2}
        },
        {
          path: '/helpCenter',
          name: 'helpCenter',
          component: resolve => require(['@/pages/my/helpCenter'], resolve),
          meta: {title: '帮助中心', keepAlive: false, isShowHead: true, isShowTab: false, routerZindex: 3}
        },
        {
          path: '/richText',
          name: 'richText',
          component: resolve => require(['@/pages/my/richText'], resolve),
          meta: {title: '富文本', keepAlive: false, isShowHead: true, isShowTab: false, routerZindex: 4}
        },
        {
          path: '/beginnerGuider',
          name: 'beginnerGuider',
          component: resolve => require(['@/pages/my/beginnerGuider'], resolve),
          meta: {title: '新手指南', keepAlive: false, isShowHead: true, isShowTab: false, routerZindex: 3}
        },
        {
          path: '/weighting',
          name: 'weighting',
          component: resolve => require(['@/pages/my/weighting'], resolve),
          meta: {title: '加权分红', keepAlive: false, isShowHead: false, isShowTab: false}
        },
        {
          path: '/weightingHelp',
          name: 'weightingHelp',
          component: resolve => require(['@/pages/my/weightingHelp'], resolve),
          meta: {title: '活动规则', keepAlive: false, isShowHead: true, isShowTab: false, routerZindex: 3}
        },
        {
          path: '/about',
          name: 'about',
          component: resolve => require(['@/pages/my/about'], resolve),
          meta: {title: '文章', keepAlive: false, isShowHead: true, isShowTab: false, routerZindex: 2}
        },
        {
          path: '/ticketexist',
          name: 'ticketexist',
          component: resolve => require(['@/pages/ticket/exist'], resolve),
          meta: {title: '生活好券', keepAlive: true, isShowHead: false, isShowTab: false, routerZindex: 2}
        },
        {
          path: '/ticket',
          name: 'ticket',
          component: resolve => require(['@/pages/ticket/ticket'], resolve),
          meta: {title: '领券', keepAlive: false, isShowHead: true, isShowTab: false, routerZindex: 2}
        },
        {
          path: '/coupon',
          name: 'coupon',
          component: resolve => require(['@/pages/coupon'], resolve),
          meta: {title: '兑换千元券', keepAlive: false, isShowHead: false, isShowTab: false, routerZindex: 8}
        },
        {
          path: '/couponList',
          name: 'couponList',
          component: resolve => require(['@/pages/coupon/list'], resolve),
          meta: {title: '兑换记录', keepAlive: false, isShowHead: true, isShowTab: false, routerZindex: 9}
        },
        {
          path: '/couponDraw',
          name: 'couponDraw',
          component: resolve => require(['@/pages/coupon/draw'], resolve),
          meta: {title: '领券记录', keepAlive: false, isShowHead: true, isShowTab: false, routerZindex: 9}
        },
        {
          path: '/operator',
          name: 'operator',
          component: resolve => require(['@/pages/my/operator'], resolve),
          meta: {title: '运营商返佣', keepAlive: false, isShowHead: true, isShowTab: false, routerZindex: 5}
        },
        {
          path: '/join',
          name: 'join',
          component: resolve => require(['@/pages/my/join'], resolve),
          meta: {title: '加入运营商', isShowHead: true}
        },
        {
          path: '/upgradeAgency',
          name: 'upgradeAgency',
          component: resolve => require(['@/pages/my/upgradeAgency'], resolve),
          meta: {title: '申请运营商', isShowHead: true, routerZindex: 9}
        },
        {
          path: '/freeUpgrade',
          name: 'freeUpgrade',
          component: resolve => require(['@/pages/my/freeUpgrade'], resolve),
          meta: {title: '升级运营商', isShowHead: false, routerZindex: 9}
        },
        {
          path: '/upgradeOperator',
          name: 'upgradeOperator',
          component: resolve => require(['@/pages/my/upgradeOperator'], resolve),
          meta: {title: '多级运营商', isShowHead: true, routerZindex: 9}
        },
        {
          path: '/partnership',
          name: 'partnership',
          component: resolve => require(['@/pages/my/partnership'], resolve),
          meta: {title: '申请代理', isShowHead: true, routerZindex: 2}
        },
        {
          path: '/rightsConter',
          name: 'rightsConter',
          component: resolve => require(['@/pages/giftBag/rightsConter'], resolve),
          meta: {title: '权益中心', isShowHead: false, routerZindex: 9}
        },
        {
          path: '/rightsRecord',
          name: 'rightsRecord',
          component: resolve => require(['@/pages/giftBag/rightsRecord'], resolve),
          meta: {title: '我的记录', isShowHead: true, routerZindex: 9}
        },
        {
          path: '/orderQuery',
          name: 'orderQuery',
          component: resolve => require(['@/pages/my/orderQuery'], resolve),
          meta: {title: '订单找回', keepAlive: false, isShowHead: true, isShowTab: false, routerZindex: 3}
        },
        {
          path: '/orderQueryList',
          name: 'orderQueryList',
          component: resolve => require(['@/pages/my/orderQueryList'], resolve),
          meta: {title: '订单找回', keepAlive: false, isShowHead: true, isShowTab: false, routerZindex: 3}
        },
        {
          path: '/giftBag',
          name: 'giftBag',
          component: resolve => require(['@/pages/giftBag/index'], resolve),
          meta: {title: '礼包详情', isShowHead: false, routerZindex: 10}
        },
        {
          path: '/homeFirmOrder',
          name: 'firmOrder',
          component: resolve => require(['@/pages/firmOrder/index'], resolve),
          meta: {title: '确认订单', isShowHead: false, routerZindex: 11}
        },
        {
          path: '/addOrder',
          name: 'addOrder',
          component: resolve => require(['@/pages/firmOrder/addOrder'], resolve),
          meta: {title: '添加地址', isShowHead: false, routerZindex: 12}
        },
        {
          path: '/add',
          name: 'add',
          component: resolve => require(['@/pages/my/add'], resolve),
          meta: {title: '添加账户', keepAlive: false, isShowHead: true, isShowTab: false}
        },
        {
          path: '/updateOrder',
          name: 'updateOrder',
          component: resolve => require(['@/pages/firmOrder/updateOrder'], resolve),
          meta: {title: '修改地址', isShowHead: false, routerZindex: 13}
        },
        {
          path: '/payGiftBag',
          name: 'payGiftBag',
          component: resolve => require(['@/pages/firmOrder/payGiftBag'], resolve),
          meta: {title: '支付方式', isShowHead: false, routerZindex: 12}
        },
        {
          path: '/payGiftBagSuccess',
          name: 'payGiftBagSuccess',
          component: resolve => require(['@/pages/firmOrder/paySuccess'], resolve),
          meta: {title: '支付成功', isShowHead: false, routerZindex: 13}
        },
        {
          path: '/profit',
          name: 'profit',
          component: resolve => require(['@/pages/my/profit'], resolve),
          meta: {title: '收益', keepAlive: false, isShowHead: false, isShowTab: false, routerZindex: 2}
        },
        {
          path: '/profitDetail',
          name: 'profitDetail',
          component: resolve => require(['@/pages/my/profitDetail'], resolve),
          meta: {title: '收益明细', keepAlive: false, isShowHead: false, isShowTab: false, routerZindex: 3}
        },
        {
          path: '/pullNew',
          name: 'pullNew',
          component: resolve => require(['@/pages/choiceness/index'], resolve),
          meta: {title: '拉新', keepAlive: true, isShowHead: true, isShowTab: false, routerZindex: 2}
        },
        /* 我的团队页面 */
        {
          path: '/myteam',
          name: 'myteam',
          component: resolve => require(['@/pages/choiceness/myteam.vue'], resolve),
          meta: {title: '我的团队', keepAlive: true, isShowHead: true, isShowTab: false, routerZindex: 2},
        },
        /* 邀请明细-月份 */
        {
          path: '/informationDetailed',
          name: 'informationDetailed',
          component: resolve => require(['@/pages/choiceness/informationDetailed.vue'], resolve),
          meta: {title: '邀请明细', keepAlive: true, isShowHead: true, isShowTab: false, routerZindex: 2},
        },
        /* 邀请明细-每日 */
        {
          path: '/invitationMssage',
          name: 'invitationMssage',
          component: resolve => require(['@/pages/choiceness/invitationMssage.vue'], resolve),
          meta: {title: '邀请明细', keepAlive: true, isShowHead: true, isShowTab: false, routerZindex: 2},
        },
        {
          path: '/pullNewRule',
          name: 'pullNewRule',
          component: resolve => require(['@/pages/my/pullNewRule'], resolve),
          meta: {title: '拉新规则详解', keepAlive: true, isShowHead: true, isShowTab: false, routerZindex: 3}
        },
        {
          path: '/personSpeak',
          name: 'personSpeak',
          component: resolve => require(['@/pages/home/personSpeak'], resolve),
          meta: {title: '达人说', isShowHead: true, keepAlive: true, routerZindex: 2}
        },
        {
          path: '/personArticle',
          name: 'personArticle',
          component: resolve => require(['@/pages/home/personArticle'], resolve),
          meta: {title: '达人文章', isShowHead: true, keepAlive: true, routerZindex: 3}
        },
        {
          path: '/discounts',
          name: 'discounts',
          component: resolve => require(['@/pages/home/discounts'], resolve),
          meta: {title: '优惠专场', isShowHead: true, routerZindex: 2}
        },
        {
          path: '/mall/home',
          name: 'mallHome',
          component: resolve => require(['../pages/mall/home/index.vue'], resolve),
          meta: {title: '商城首页', keepAlive: false, isShowSearch: false, isShowTab: false, isShopShowTab: true}
        },
        {
          path: '/mall/news',
          name: 'mallNews',
          component: resolve => require(['../pages/mall/home/news.vue'], resolve),
          meta: {title: '消息', keepAlive: true, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/newDetail',
          name: 'mallNewDetail',
          component: resolve => require(['../pages/mall/home/newDetail.vue'], resolve),
          meta: {title: '消息详情', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/search',
          name: 'mallSearch',
          component: resolve => require(['../pages/mall/home/search.vue'], resolve),
          meta: {title: '搜索', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/searchStore',
          name: 'mallSearchStore',
          component: resolve => require(['../pages/mall/home/searchStore.vue'], resolve),
          meta: {title: '商城搜索', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/fixing_order',
          name: 'mallFixing_order',
          component: resolve => require(['../pages/mall/home/fixing_order.vue'], resolve),
          meta: {title: '订单', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/payMent',
          name: 'mallPayMent',
          component: resolve => require(['../pages/mall/home/payMent.vue'], resolve),
          meta: {title: '支付', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/homeDetail',
          name: 'mallHomeDetail',
          component: resolve => require(['../pages/mall/home/homeDetail.vue'], resolve),
          meta: {title: '线上商城的商品详情', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/CSD',
          name: 'mallCSD',
          component: resolve => require(['../pages/mall/home/CSD.vue'], resolve),
          meta: {title: '客服', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/firmOrder',
          name: 'mallFirmOrder',
          component: resolve => require(['../pages/mall/home/firmOrder.vue'], resolve),
          meta: {title: '确认订单', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/paySuccess',
          name: 'mallPaySuccess',
          component: resolve => require(['../pages/mall/home/paySuccess.vue'], resolve),
          meta: {title: '支付成功', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/shopProductList',
          name: 'mallShopProductList',
          component: resolve => require(['../pages/mall/home/shopProductList.vue'], resolve),
          meta: {title: '商品分类', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/orderDetail',
          name: 'mallOrderDetail',
          component: resolve => require(['../pages/mall/home/orderDetail.vue'], resolve),
          meta: {title: '订单详情', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/Refund_detail',
          name: 'mallRefund_detail',
          component: resolve => require(['../pages/mall/home/Refund_detail.vue'], resolve),
          meta: {title: '退款详情', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/comment',
          name: 'mallComment',
          component: resolve => require(['../pages/mall/home/comment.vue'], resolve),
          meta: {title: '评论', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/my',
          name: 'mallMy',
          component: resolve => require(['../pages/mall/my/index.vue'], resolve),
          meta: {title: '个人中心', keepAlive: false, isShowSearch: false, isShowTab: false, isShopShowTab: true}
        },
        {
          path: '/mall/footprint',
          name: 'mallFootprit',
          component: resolve => require(['../pages/mall/my/footprint.vue'], resolve),
          meta: {title: '我的足迹', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/address',
          name: 'mallAddress',
          component: resolve => require(['../pages/mall/my/address.vue'], resolve),
          meta: {title: '地址列表', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/addAddress',
          name: 'mallAddAddress',
          component: resolve => require(['../pages/mall/my/addAddress.vue'], resolve),
          meta: {title: '添加地址', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/updateAddress',
          name: 'mallUpdateAddress',
          component: resolve => require(['../pages/mall/my/updateAddress.vue'], resolve),
          meta: {title: '修改地址', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/exchange',
          name: 'mallExchange',
          component: resolve => require(['../pages/mall/my/exchange.vue'], resolve),
          meta: {title: '退款信息', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/logistics',
          name: 'mallLogistics',
          component: resolve => require(['../pages/mall/my/logistics.vue'], resolve),
          meta: {title: '查看物流', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/appraise',
          name: 'mallAppraise',
          component: resolve => require(['../pages/mall/my/appraise.vue'], resolve),
          meta: {title: '评价', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/cart',
          name: 'mallCart',
          component: resolve => require(['../pages/mall/cart/index.vue'], resolve),
          meta: {title: '购物车', keepAlive: false, isShowSearch: false, isShowTab: false, isShopShowTab: true}
        },
        {
          path: '/mall/shopCenter',
          name: 'mallShopCenter',
          component: resolve => require(['../pages/mall/shops/index.vue'], resolve),
          meta: {title: '商家中心', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/applyShop',
          name: 'mallApplyShop',
          component: resolve => require(['../pages/mall/shops/applyShop.vue'], resolve),
          meta: {title: '申请商家', keepAlive: false, isShowSearch: false, isShowTab: false, isShowHead: true}
        },
        {
          path: '/mall/applyShopAgreement',
          name: 'mallApplyShopAgreement',
          component: resolve => require(['../pages/mall/shops/applyShopAgreement.vue'], resolve),
          meta: {title: '入驻协议', keepAlive: false, isShowSearch: false, isShowTab: false, isShowHead: true}
        },
        {
          path: '/mall/applyShopMan', // 个人商家填写申请信息
          name: 'mallApplyShopMan',
          component: resolve => require(['../pages/mall/shops/applyShopMan.vue'], resolve),
          meta: {title: '个人商家信息', keepAlive: false, isShowSearch: false, isShowTab: false, isShowHead: true}
        },
        {
          path: '/mall/applyShopFirm', // 企业商家填写申请信息
          name: 'mallApplyShopFirm',
          component: resolve => require(['../pages/mall/shops/applyShopFirm.vue'], resolve),
          meta: {title: '企业商家信息', keepAlive: false, isShowSearch: false, isShowTab: false, isShowHead: true}
        },
        {
          path: '/mall/business',
          name: 'mallBusiness',
          component: resolve => require(['../pages/mall/business/index.vue'], resolve),
          meta: {title: '商家首页', keepAlive: true, isShowSearch: false, isShowTab: false, isShopShowTab: true}
        },
        {
          path: '/mall/category',
          name: 'mallCategory',
          component: resolve => require(['../pages/mall/business/category.vue'], resolve),
          meta: {title: '商家分类', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/collection',
          name: 'mallCollection',
          component: resolve => require(['../pages/mall/collection/index.vue'], resolve),
          meta: {title: '商品收藏', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/shops',
          name: 'mallShops',
          component: resolve => require(['../pages/mall/collection/shop.vue'], resolve),
          meta: {title: '店铺收藏', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/seller',
          name: 'mallSeller',
          component: resolve => require(['../pages/mall/business/seller.vue'], resolve),
          meta: {title: '商家详情', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/productList',
          name: 'mallProductList',
          component: resolve => require(['../pages/mall/home/productList.vue'], resolve),
          meta: {title: '商品列表', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/articleInfo',
          name: 'mallArticleInfo',
          component: resolve => require(['../pages/mall/home/articleInfo.vue'], resolve),
          meta: {title: '文章详情', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/articleList',
          name: 'mallArticleList',
          component: resolve => require(['../pages/mall/home/articleList.vue'], resolve),
          meta: {title: '文章列表', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/offOrders',
          name: 'mallOffOrders',
          component: resolve => require(['../pages/mall/shops/offOrders.vue'], resolve),
          meta: {title: '线下订单', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/onOrders',
          name: 'mallOnOrders',
          component: resolve => require(['../pages/mall/shops/onOrders.vue'], resolve),
          meta: {title: '线上订单', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/onOrderDetails',
          name: 'mallOnOrderDetails',
          component: resolve => require(['../pages/mall/shops/onOrderDetails.vue'], resolve),
          meta: {title: '订单详情', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/withdrawList',
          name: 'mallWithdrawList',
          component: resolve => require(['../pages/mall/shops/withdrawList.vue'], resolve),
          meta: {title: '提现记录', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/withdraw',
          name: 'mallWithdraw',
          component: resolve => require(['../pages/mall/shops/withdraw.vue'], resolve),
          meta: {title: '提现中心', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/fundInfo',
          name: 'mallFundInfo',
          component: resolve => require(['../pages/mall/shops/fundInfo.vue'], resolve),
          meta: {title: '资金信息', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/balance',
          name: 'mallBalance',
          component: resolve => require(['../pages/mall/my/record/balance.vue'], resolve),
          meta: {title: '余额信息', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/yueList',
          name: 'mallYueList',
          component: resolve => require(['../pages/mall/my/record/yueList.vue'], resolve),
          meta: {title: '余额明细', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/yuePayment',
          name: 'mallYuePayment',
          component: resolve => require(['../pages/mall/my/record/yuePayment.vue'], resolve),
          meta: {title: '余额充值', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/Balancelist',
          name: 'mallBalancelist',
          component: resolve => require(['../pages/mall/my/record/mallBalancelist.vue'], resolve),
          meta: {title: '余额充值', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/yuWithdraw',
          name: 'mallYuWithdraw',
          component: resolve => require(['../pages/mall/my/record/yuWithdraw.vue'], resolve),
          meta: {title: '余额充值', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/withDrawList',
          name: 'mallWithDrawList',
          component: resolve => require(['../pages/mall/my/record/withDrawList.vue'], resolve),
          meta: {title: '余额充值记录', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/myPoints',
          name: 'mallMyPoints',
          component: resolve => require(['../pages/mall/my/record/myPoints.vue'], resolve),
          meta: {title: '积分', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/myPointsList',
          name: 'mallMyPointsList',
          component: resolve => require(['../pages/mall/my/record/myPointsList.vue'], resolve),
          meta: {title: '积分', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/commission',
          name: 'mallCommission',
          component: resolve => require(['../pages/mall/my/record/commission.vue'], resolve),
          meta: {title: '我的佣金', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/commissionList',
          name: 'mallCommissionList',
          component: resolve => require(['../pages/mall/my/record/commissionList.vue'], resolve),
          meta: {title: '佣金明细', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/donation',
          name: 'mallDonation',
          component: resolve => require(['../pages/mall/my/record/donation.vue'], resolve),
          meta: {title: '转赠', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/donationList',
          name: 'mallDonationList',
          component: resolve => require(['../pages/mall/my/record/donationList.vue'], resolve),
          meta: {title: '转赠记录', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/distributor',
          name: 'mallDistributor',
          component: resolve => require(['../pages/mall/my/distributor.vue'], resolve),
          meta: {title: '申请分销商', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/grade',
          name: 'mallGrade',
          component: resolve => require(['../pages/mall/my/grade.vue'], resolve),
          meta: {title: '我的等级', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/myTeam',
          name: 'mallMyTeam',
          component: resolve => require(['../pages/mall/my/myTeam.vue'], resolve),
          meta: {title: '我的团队', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/buNew',
          name: 'mallBuyNew',
          component: resolve => require(['../pages/mall/my/buNew.vue'], resolve),
          meta: {title: '转赠记录', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/checkLogis',
          name: 'mallCheckLogis',
          component: resolve => require(['../pages/mall/my/checkLogis.vue'], resolve),
          meta: {title: '查看物流', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/underShop',
          name: 'mallUnderShop',
          component: resolve => require(['../pages/mall/underShop/index'], resolve),
          meta: {title: '线下商家', keepAlive: false, isShowSearch: false, isShowTab: false, isShopShowTab: true}
        },
        {
          path: '/mall/underShop2_0',
          name: 'mallUnderShop2_0',
          component: resolve => require(['../pages/mall/underShop/index2_0'], resolve),
          meta: {title: '线下商家2.0', keepAlive: false, isShowSearch: false, isShowTab: false, isShopShowTab: true}
        },
        {
          path: '/mall/city',
          name: 'mallCity',
          component: resolve => require(['../pages/mall/city'], resolve),
          meta: {title: '城市列表', keepAlive: false, isShowTab: false, isShopShowTab: false}
        },
        {
          path: '/mall/underMy',
          name: 'mallUnderMy',
          component: resolve => require(['../pages/mall/underShop/underMy'], resolve),
          meta: {title: '个人中心', keepAlive: false, isShowSearch: false, isShowHead: true, isShopShowTab: false}
        },
        {
          path: '/mall/secthList',
          name: 'mallSecthList',
          component: resolve => require(['../pages/mall/underShop/secthList'], resolve),
          meta: {title: '搜索列表', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/UnderpayMent',
          name: 'mallUnderpayMent',
          component: resolve => require(['../pages/mall/underShop/UnderpayMent'], resolve),
          meta: {title: '线下支付', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/payUnder',
          name: 'mallPayUnder',
          component: resolve => require(['../pages/mall/underShop/payUnder'], resolve),
          meta: {title: '线下支付', keepAlive: false, isShowSearch: false, isShowTab: false}
        }, {
          path: '/mall/Underdetail',
          name: 'mallUnderdetail',
          component: resolve => require(['../pages/mall/underShop/detail'], resolve),
          meta: {title: '线下详情', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/rechargeCard',
          name: 'mallRechargeCard',
          component: resolve => require(['../pages/mall/underShop/rechargeCard'], resolve),
          meta: {title: '会员卡充值', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/myCoupon',
          name: 'mallMyCoupon',
          component: resolve => require(['../pages/mall/underShop/myCoupon'], resolve),
          meta: {title: '我的优惠券', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/myClub',
          name: 'mallMyClub',
          component: resolve => require(['../pages/mall/underShop/myClub'], resolve),
          meta: {title: '我的会员卡', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/hykCenter',
          name: 'mallHykCenter',
          component: resolve => require(['../pages/mall/underShop/hykCenter'], resolve),
          meta: {title: '会员卡中心', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/expenseList',
          name: 'mallExpenseList',
          component: resolve => require(['../pages/mall/underShop/expenseList'], resolve),
          meta: {title: '我的消费记录', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/cardPayment',
          name: 'mallCardPayment',
          component: resolve => require(['../pages/mall/underShop/cardPayment'], resolve),
          meta: {title: '会员卡充值', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/rechargeList',
          name: 'mallRechargeList',
          component: resolve => require(['../pages/mall/underShop/rechargeList'], resolve),
          meta: {title: '会员卡充值记录', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/drawYhj',
          name: 'mallDrawYhj',
          component: resolve => require(['../pages/mall/underShop/drawYhj'], resolve),
          meta: {title: '会员卡充值记录', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/exploitShop',
          name: 'mallExploitShop',
          component: resolve => require(['../pages/mall/underShop/exploitShop'], resolve),
          meta: {title: '拓店者', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/myCity',
          name: 'mallMyCity',
          component: resolve => require(['../pages/mall/underShop/myCity'], resolve),
          meta: {title: '我的区域', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/transactions',
          name: 'mallTransactions',
          component: resolve => require(['../pages/mall/underShop/transactions'], resolve),
          meta: {title: '店面交易额', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/vipOrderList',
          name: 'mallVipOrderList',
          component: resolve => require(['../pages/mall/underShop/vipOrderList'], resolve),
          meta: {title: '直属会员订单', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/offOrderDetails',
          name: 'mallOffOrderDetails',
          component: resolve => require(['../pages/mall/shops/offOrderDetails'], resolve),
          meta: {title: '线下订单详情', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/vipRechargeList',
          name: 'mallVipRechargeList',
          component: resolve => require(['../pages/mall/shops/vipRechargeList'], resolve),
          meta: {title: '会员卡充值记录', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/underOrderList',
          name: 'mallUnderOrderList',
          component: resolve => require(['../pages/mall/underShop/underOrderList'], resolve),
          meta: {title: '我的线下订单', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/underOrderDetails',
          name: 'mallUnderOrderDetails',
          component: resolve => require(['../pages/mall/underShop/underOrderDetails'], resolve),
          meta: {title: '我的线下订单详情', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/shopQrcode',
          name: 'mallShopQrcode',
          component: resolve => require(['../pages/mall/shops/shopQrcode'], resolve),
          meta: {title: '商家二维码', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/underCancel',
          name: 'mallUnderCancel',
          component: resolve => require(['../pages/mall/underShop/underCancel'], resolve),
          meta: {title: '商家核销', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/underGoodsDetails',
          name: 'mallUnderGoodsDetails',
          component: resolve => require(['../pages/mall/underShop/underGoodsDetails'], resolve),
          meta: {title: '线下商家商品详情', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/underGoodsBuy',
          name: 'mallUnderGoodsBuy',
          component: resolve => require(['../pages/mall/underShop/underGoodsBuy'], resolve),
          meta: {title: '线下商家商品下单', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/messageBoard',
          name: 'mallMessageBoard',
          component: resolve => require(['../pages/mall/underShop/messageBoard'], resolve),
          meta: {title: '买家留言', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/imageText',
          name: 'mallImageText',
          component: resolve => require(['../pages/mall/underShop/imageText'], resolve),
          meta: {title: '线下商家商品图文详情', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/underGoodsList',
          name: 'mallUnderGoodsList',
          component: resolve => require(['../pages/mall/underShop/underGoodsList'], resolve),
          meta: {title: '线下商品订单', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/underShopInfo',
          name: 'mallUnderShopInfo',
          component: resolve => require(['../pages/mall/underShop/underShopInfo'], resolve),
          meta: {title: '线下商家详情', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/under_order',
          name: 'mallUnder_order',
          component: resolve => require(['../pages/mall/underShop/under_order'], resolve),
          meta: {title: '线下商品订单', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/under_exchange',
          name: 'mallUnder_exchange',
          component: resolve => require(['../pages/mall/underShop/under_exchange'], resolve),
          meta: {title: '线下商品退款', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/off_order',
          name: 'mallOffGoodsOrders',
          component: resolve => require(['../pages/mall/shops/off_order'], resolve),
          meta: {title: '线下商品订单', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/off_order_detail',
          name: 'mallOff_order_detail',
          component: resolve => require(['../pages/mall/shops/off_order_detail'], resolve),
          meta: {title: '线下商品订单详情', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/pointsYue',
          name: 'mallPointsYue',
          component: resolve => require(['../pages/mall/my/record/pointsYue'], resolve),
          meta: {title: '积分转余额', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/pointsYongjin',
          name: 'mallPointsYue',
          component: resolve => require(['../pages/mall/my/record/pointsYongjin'], resolve),
          meta: {title: '积分转佣金', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/pointsYueList',
          name: 'mallPointsYueList',
          component: resolve => require(['../pages/mall/my/record/pointsYueList'], resolve),
          meta: {title: '积分转余额', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/pointsYongjinList',
          name: 'mallPointsYueList',
          component: resolve => require(['../pages/mall/my/record/pointsYongjinList'], resolve),
          meta: {title: '积分转佣金', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/underAddress',
          name: 'mallUnderAddress',
          component: resolve => require(['../pages/mall/underShop/underAddress.vue'], resolve),
          meta: {title: '商家地址', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/mall/underAppraise',
          name: 'mallUnderAppraise',
          component: resolve => require(['../pages/mall/underShop/underAppraise.vue'], resolve),
          meta: {title: '线下商品评价', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/single',
          name: 'single',
          component: resolve => require(['../pages/single/index.vue'], resolve),
          meta: {title: '免单福利', keepAlive: false, isShowSearch: false, isShowTab: false}
        },
        {
          path: '/welfare',
          name: 'welfare',
          component: resolve => require(['../pages/single/welfare.vue'], resolve),
          meta: {title: '我的福利', keepAlive: false, isShowSearch: false, isShowTab: false,isShowHead: true}
        },
        {
          path: '/singleWeal',
          name: 'singleWeal',
          component: resolve => require(['../pages/single/singleWeal.vue'], resolve),
          meta: {title: '免单福利', keepAlive: false, isShowSearch: false, isShowTab: false,isShowHead: true}
        },
        {
          path: '/newFree',
          name: 'newFree',
          component: resolve => require(['../pages/home/newFree.vue'], resolve),
          meta: {title: '新人免单', keepAlive: false, isShowSearch: false, isShowTab: false,isShowHead: true}
        },
        {
          path: '/newactivities',
          name: 'newactivities',
          component: resolve => require(['../pages/my/newactivities.vue'], resolve),
          meta: {title: '拉新活动', keepAlive: false, isShowSearch: false, isShowTab: false,isShowHead: true}
        },
        {
          path: '/setuserinfo',
          name: 'setuserinfo',
          component: resolve => require(['../pages/my/setuserinfo.vue'], resolve),
          meta: {title: '填写联系信息', keepAlive: false, isShowSearch: false, isShowTab: false,isShowHead: true}
        },
        /* 从起航联盟合并过来 开始 */
        {
          path: '/qidetail',
          name: 'qidetail',
          component: resolve => require(['@/pages/choiceness/qiDetail.vue'], resolve),
          meta: { title: '拉新', keepAlive: false, isShowHead: true, isShowTab: false, routerZindex: 3 }
        },
        {
          path: '/qilist',
          name: 'qilist',
          component: resolve => require(['@/pages/choiceness/qiList.vue'], resolve),
          meta: { title: '拉新数据', keepAlive: false, isShowHead: true, isShowTab: false, routerZindex: 3 }
        },
        {
          path: '/qiincome',
          name: 'qiincome',
          component: resolve => require(['@/pages/choiceness/qiIncome.vue'], resolve),
          meta: { title: '我的钱包', keepAlive: false, isShowHead: true, isShowTab: false, routerZindex: 3 }
        },
        {
          path: '/qiremark',
          name: 'qiremark',
          component: resolve => require(['@/pages/choiceness/qiRemark.vue'], resolve),
          meta: { title: '拉新规则', keepAlive: false, isShowHead: false, isShowTab: false, routerZindex: 4 }
        },
        /* 从起航合并过来 结束 */
        {
          path: '/loginForDev',
          name: 'loginForDev',
          component: resolve => require(['@/pages/auth/loginForDev.vue'], resolve),
          meta: { title: '开发用登录', keepAlive: false, isShowHead: false, isShowTab: false, routerZindex: 1 }
        }
      ]
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return {x: 0, y: 0}
  }
})

const whiteList = ['mallApplyShopFirm', 'mallApplyShop', 'mallCity', 'about', 'newIndex', 'wxbind', 'home', 'search', 'results', 'list', 'fastrob', 'personSpeak', 'personArticle', 'discounts', 'otherclassify', 'classify', 'liveBroadcast', 'dayingList', 'daying', 'comment', 'mallHome', 'mallHomeDetail', 'mallBusiness', 'mallSeller', 'mallUnderShop', 'mallUnderShop2_0', 'mallUnderdetail', 'mallProductList', 'mallShopProductList', 'mallCategory', 'mallSecthList', 'mallNews', 'mallSearch', 'mallArticleList', 'mallArticleInfo', 'select', 'qidetail', 'qilist', 'qiincome', 'qiremark']
router.beforeEach(function (to, from, next) {
  var firstPage = ['/mall/applyShopFirm', '/mall/applyShop', '/pullNew', '/mall/city', '/newIndex', '/my', '/newIndex', '/mall/home', '/mall/business', '/mall/underShop', '/mall/underShop2_0', '/mall/my', '/mall/cart', '/upgradeOperator']
  var currentRoute = to.path
  if (firstPage.indexOf(currentRoute) > -1) {
    window.canRightSlipBack = false
  } else {
    window.canRightSlipBack = true
  }
  // 登录拦截
  store.commit('hide')
  const token = utils.storage.get('token')
  if (whiteList.indexOf(to.name) < 0 && !token) {
    dsBridge.call('toLogin')
  } else {
    next()
  }
})

export default router
