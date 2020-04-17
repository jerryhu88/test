<template>
  <div>
    <!-- 一个字 -->
    <i class="redNumber point" v-if="text.length === 1">{{text}}</i>
    <!-- 多个字 -->
    <i class="redNumbers point" v-else-if="text.length > 1">{{text}}</i>
    <!-- 无字 -->
    <i class="redPoint point" v-else-if="point"></i>
  </div>
</template>

<script>
export default {
  props: {
    number: String,
    point: Boolean
  },
  computed: {
    text () {
      if (this.number) {
        return this.number + ''
      } else {
        return ''
      }
    }
  },
  methods: {
  }
}
</script>

<style lang='less' scoped>
@import '../../../src/assets/style/base.less';
  .point{
    background: @red;
    color: #fff;
    text-align: center;
    font-size: @20px;
    line-height: @20px;
    border: @3px solid #fff;
  }
  .redPoint{
    width:@12px;
    height:@12px;
    border-radius:100%;
  }
  .redNumber{
    border-radius:100%;
    width: @28px;
    height: @28px;
    line-height: @29px;
  }
  .redNumbers{
    border-radius:@20px;
    min-width: @30px;
    padding: @4px @5px @3px;
  }
</style>
