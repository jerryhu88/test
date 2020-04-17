<template>
  <web-view :src="Config.api + url"></web-view>
</template>

<script>
  import {mapGetters} from 'vuex'
  import Config from '../../config/index'
  export default {
    data () {
      return {
        Config,
        url: ''
      }
    },
    computed: {
      ...mapGetters(['userInfo'])
    },
    onLoad (options) {
      wx.setNavigationBarTitle({ title: options.title })
      this.url = `${options.url}?serviceCode=${this.userInfo.serviceCode}`
      if (Config.env === 'dev') {
        Config.api = 'http://192.168.1.224:8022'
      }
    },
    methods: {}
  }
</script>

<style lang='less' scoped>
</style>
