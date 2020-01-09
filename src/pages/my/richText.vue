<template>
  <div class="rich-text">
    <div v-html="content" style="padding: .31rem .27rem;"></div>
  </div>
</template>

<script>
export default {
  name: 'rich-text',
  data () {
    return {
      richCon: '',
      content: '',
      title: '',
      kidIndex: this.$route.query.kidIndex,
      index: this.$route.query.index
    }
  },
  methods: {
    getInfo () {
      this.$http.post('/amoy/user/help-center', {}, true).then(res => {
        this.richCon = res.data
        this.title = this.richCon[this.kidIndex].info[this.index].title
        this.content = this.richCon[this.kidIndex].info[this.index].content
      })
    }
  },
  mounted () {
    this.getInfo()
  }
}
</script>
<style scoped lang="less">
.rich-text{
  background-color: #f7f7f7;
  height: 100%;
}
</style>
