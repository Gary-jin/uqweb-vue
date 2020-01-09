<template>
    <div id="classifyVideo">
      <x-header
        slot="header"
        :left-options="{showBack: false}" style="position: absolute">
        <a @click="goBack()" slot="left" class="backBox"><i class="iconfont icon-back"></i></a>
        {{title}}
      </x-header>
      <video-player  class="video-player vjs-custom-skin"
                     ref="videoPlayer"
                     :playsinline="playsinline"
                     :options="playerOptions"
      ></video-player>
    </div>
</template>

<script>
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
export default {
  name: 'classifyVideo',
  components: { videoPlayer },
  data () {
    return {
      title: this.$route.query.title,
      playerOptions: {
        autoplay: true,
        // fluid: false,
        controls: true,
        sources: [{
          type: 'video/mp4',
          src: this.$route.query.url
        }],
        poster: '../../assets/auth/ref.png',
        width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: true,
          fullscreenToggle: false // 全屏按钮
        }
      }
    }
  },
  methods: {},
  computed: {
    player () {
      return this.$refs.videoPlayer.player
    }
  },
  mounted () {
    window.document.title = this.$route.query.title
  }
}
</script>

<style lang="less">
  .vjs-big-play-button{
    display: none !important;
  }
</style>
<style lang="less" scoped>
  #classifyVideo{
    height: 100%;
    display: flex;
    align-items: center;
    background: #000;
  }
</style>
