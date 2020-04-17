<template>
  <div class="banner">
      <swiper :style="{height}" @change="swiperChange" :current='currentI' :interval="2000" :duration="500" :circular='true'>
        <swiper-item v-for="i in 5" :key="i">
          <img mode='aspectFill' src="../../../src/assets/images/mine.png" alt="">
        </swiper-item>
      </swiper>
      <ul class="points">
        <li v-for="i in 5" :key="i" :class="{selcted: i == currentI}"></li>
      </ul>
    </div>
</template>

<script>

export default {
  props: {
    height: {
      type: Number,
      default: '206rpx'
    }
  },
  data () {
    return {
      currentI: 1
    }
  },
  components: {
  },
  computed: {
  },
  onLoad () {
  },
  methods: {
    // 轮播图的切换事件
    swiperChange (e) {
      console.log(e)
      this.currentI = e.target.current
    }
  }
}
</script>

<style lang='less' scoped>
@import "../../assets/style/base.less";
  .banner{
    padding: @24px @26px 0 @26px;
    position: relative;
    background: #fff;
    swiper{
      width: 100%;
      image{
        border-radius: 40rpx;
        width: 100%;
        height: 100%;
      }
    }
    .points{
      display: flex;
      position: absolute;
      right: 78rpx;
      bottom: 10rpx;
      li{
        width: 14rpx;
        height: 14rpx;
        border-radius: 50%;
        margin-left: 8rpx;
        background: #c1c1c1;
        transition: all linear .2s;
        &.selcted{
          background: #fff;
        }
      }
    }
  }
</style>
