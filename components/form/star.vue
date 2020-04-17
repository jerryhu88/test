<template>
  <div class="star">
    <li v-for="item in starArr" :key="item">
      <i v-if="imgs[item] !== 'icon-half'" class="iconfont" :class="imgs[item]"></i>
      <!-- 半星 -->
      <div v-else class="half">
        <i class="iconfont icon-off"></i>
        <i class="iconfont icon-half"></i>
      </div>
    </li>
  </div>
</template>

<script>
export default {
  props: {
    // 分值
    star: {
      type: String,
      default: 0
    }
  },
  computed: {
    starArr () {
      let starArr = []
      for (let i = 0; i < parseInt(this.star); i++) {
        starArr.push('full')
      }
      if (this.star.toString().indexOf('.') > 0) {
        starArr.push('half')
      }
      let len = 5 - starArr.length
      for (let i = 0; i < len; i++) {
        starArr.push('off')
      }
      return starArr
    }
  },
  data () {
    return {
      imgs: {
        full: 'icon-full',
        off: 'icon-off',
        half: 'icon-half'
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import '../../../src/assets/style/base.less';
  .star {
    font-size: 0;
    .flex-center;
    .icon-full,.icon-half{
      color: @red;
    }
    .icon-off{
      color: #dbdbdb;
    }
    .half{
      .flex-center;
      position: relative;
      .icon-half{
        position: absolute;
        right: 0;
        top: 0;
      }
    }
  }
</style>
