<template>
  <div id="swiper">
    <div class="swiperBox" v-if="!data.style || data.style === '0'" :style="{backgroundColor: data.bgColor}">
      <swiper :options="swiperOption" class="swiper" ref="swiperBox" >
        <swiper-slide v-for="(item, index) in data.items" :key="index">
          <img :src="item.img" alt="" @click="jumpLink(item.link)">
        </swiper-slide>
      </swiper>
    </div>
    <div class="swiperBox1" v-else-if="data.style === '1'" :style="{backgroundColor: data.bgColor}">
      <swiper :options="swiperOption1" class="swiper" ref="swiperBox1" >
        <swiper-slide v-for="(item, index) in data.items"  :key="index">
          <img :src="item.img" alt=""  @click="jumpLink(item.link)">
        </swiper-slide>
      </swiper>
    </div>
    <div class="swiperBox2"  v-else-if="data.style === '2'" :style="{backgroundColor: data.bgColor}">
      <swiper :options="swiperOption2" class="swiper2" ref="swiperBox2" >
        <swiper-slide v-for="(item, index) in data.items"  :key="index">
          <img :src="item.img"   @click="jumpLink(item.link)">
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
  </div>
</template>

<script>
import {swiper, swiperSlide} from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
export default {
  name: 'IndexSwiper',
  components: {
    swiper, swiperSlide
  },
  props: ['data'],
  data () {
    return {
      swiper: '',
      swiperOption: {
        grabCursor: true,
        loop: false,
        slidesPerView: 1,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        }
      },
      swiperOption1: {
        effect: 'coverflow',
        loop: true,
        slidesPerView: 3,
        centeredSlides: true,
        initialSlide: 1,
        coverflowEffect: {
          rotate: 25,
          stretch: 20,
          depth: 0,
          modifier: 2,
          slideShadows: false
        },
        on: {
          transitionEnd: () => {
          }
        }
      },
      swiperOption2: {
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination'
        },
        on: {
          slideChange: (progress) => {
            if (this.$refs.swiperBox2.swiper) {
              // this.income = this.data ? this.data.managerList[this.$refs.mySwiper.swiper.activeIndex] : ''
              let k = 0
              let color = ''
              for (let i in this.data.items) {
                if (k === this.$refs.swiperBox2.swiper.realIndex) {
                  color = this.data.items[i].bgColor
                }
                k++
              }
              this.$emit('swiperChange', color)
              if (this.$refs.swiperBox2.swiper) {
                // console.log(this.$refs.swiperBox2.swiper.progress)
              }
            } else {
              let k = 0
              let color = ''
              for (let i in this.data.items) {
                if (k === 0) {
                  color = this.data.items[i].bgColor
                }
                k++
              }
              this.$emit('swiperChange', color)
              if (this.$refs.swiperBox2.swiper) {
                // console.log(this.$refs.swiperBox2.swiper.progress)
              }
            }
          }
        }
      }
    }
  },
  methods: {
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style lang="less">
  #swiper{
    .swiperBox2 {
      position: relative;
      .swiper2{
        img {
          min-height: 150px;
          background: rgba(240,240,240, 0.8);
        }
      }
      .swiper-container{
        .swiper-pagination{
          bottom: 0.1rem;
          width: 100%;
          .swiper-pagination-bullet{
            width: 0.08rem;
            height: 0.08rem;
            border-radius: 0.04rem;
            opacity: 1;
            margin: 0 .1rem;
            background: #fff;
            border: none;
          }
          .swiper-pagination-bullet-active{
            background: #fff;
            width: 0.26rem;
            height: 0.08rem;
            border-radius: 0.04rem;
          }
        }
      }
    }
  }
</style>
<style  lang="less" scoped>
  #swiper{
    overflow-x: hidden;
    .swiperBox {
      position: relative;
      .swiper-slide{
        img{
          width: 100%;
          float: left;
        }
      }
      .vux-slider{
        .vux-indicator{
          .vux-icon-dot{
            width: 8px;
            height: 8px;
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.4);
          }
          .active{
            background: rgba(255, 255, 255, 1) !important;
          }
        }
      }
    }
    .swiperBox2 {
      position: relative;
      .swiper-slide{
        img{
          width: 7.1rem;
          margin: 0 0.2rem;
          border-radius: .1rem;
          height: 2.9rem;
        }
      }
    }
    .swiperBox1{
      position: relative;
      width: 9.5rem;
      transform: translateX(-1rem);
    }
  }
</style>
