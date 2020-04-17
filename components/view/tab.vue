<template>
  <ul class="tabs" :class="{spaceBetween}">
    <li @click="turnTab(item.type)" v-for="(item, index) in tabs" :key="index"
      :class="{on: item.type === value}">
      {{item.text}}
    </li>
    <li></li>
  </ul>
</template>

<script>
  export default{
    props: {
      spaceBetween: Boolean,
      tabs: Array,
      value: Number
    },
    methods: {
      turnTab (type) {
        if (this.value === type) return
        this.$emit('input', type)
        this.$emit('select', type)
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../../../src/assets/style/base.less';
  .tabs {
    white-space:nowrap;
    top: 0;
    position:sticky;
    z-index: 1;
    background: #fff;
    display: flex;
    padding: 0 48rpx;
    width: calc(~'100% - '96rpx);
    overflow-x: auto;
    &.border{
      border-bottom: 1rpx solid @border;
    }
    li {
      transition: all ease .2s;
      color: #B8BBC6;
      border-radius: 100rpx;
      margin: 30rpx 24rpx 30rpx 0;
      padding: 0 52rpx;
      line-height: 60rpx;
      font-size: 30rpx;
      width: 100%;
      border: 1rpx solid #eaecef;
      &:last-child{
        padding: 0;
        opacity: 0;
        margin-right: 0;
        padding-right: 24rpx;
      }
      &.on {
        background: #080040;
        color: #fff;
        border: 1px solid #080040;
      }
    }
    &.spaceBetween{
      justify-content: space-between;
      width: calc(~'100% - '52rpx);
      padding: 0 26rpx;
      li{
        flex: 1;
        text-align: center;
        padding: 0;
        &:last-child{
          display: none;
        }
        &:nth-last-child(2){
          margin-right: 0;
        }
      }
    }
  }
</style>
