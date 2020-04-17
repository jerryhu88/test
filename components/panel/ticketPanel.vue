<template>
  <ul class="ticketPanel">
    <li v-for="i in 10" :key="i">
        <div class="tic">
          <div>
            <p>使用条件: 单笔消费满40€</p>
            <p>有效期: 2019.11.12 - 2019.12.14</p>
          </div>
          <span :class="{disabled}">5 €</span>
        </div>
        <button v-show="getBtn">领取</button>
    </li>
  </ul>
</template>

<script>
  export default{
    props: {
      getBtn: Boolean,
      disabled: Boolean
    },
    data () {
      return {
      }
    },
    components: {
    },
    created () {
    },
    methods: {
    }
  }
</script>
<style lang="less" scoped>
  @import '../../../src/assets/style/base.less';
  .ticketPanel{
    padding: 30rpx;
    li{
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 52rpx;
      &:last-child{
        margin-bottom: 0;
      }
      .tic{
        width: 520rpx;
        overflow: hidden;
        box-shadow:0px 4rpx 8rpx 0px rgba(225,225,225,1);
        border-radius:10rpx;
        border:1rpx solid rgba(219,218,218,1);
        height: 112rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        >div{
          padding-left: 32rpx;
          p{
            color: #000;
            font-size: 18rpx;
            line-height: 26rpx;
          }
        }
        span{
          height: 100%;
          line-height: 112rpx;
          display: inline-block;
          background: #00859F;
          color: #fff;
          font-size: 60rpx;
          font-weight: bold;
          padding: 0 18rpx 0 60rpx;
          &.disabled{
            background: #B0B0B0;
          }
        }
      }
      button{
        font-weight: bold;
        width:166rpx;
        height:70rpx;
        background:rgba(251,175,2,1);
        border-radius:35rpx;
        background: #FBAF02;
        color: #080040;
        font-size: 26rpx;
        margin-left: 18rpx;
      }
    }
  }
</style>
