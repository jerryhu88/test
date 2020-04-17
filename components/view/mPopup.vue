<template>
  <div class="mPopup" :class="position">
    <div @touchmove.stop="stop" class="mask" :class="{'popupMask':value}" @click="maskClose"></div>
    <div class="popup-wrap" :class="{'showContent':value}">
      <div v-if="showClose" @click="pickerCancel" class="closeNav">
        <h1>{{title}}</h1>
        <i class="iconfont icon-guanbi"></i>
      </div>
      <div class="nav" v-if="showNav">
        <div class="cancel" @click="pickerCancel">取消</div>
        <h1>{{title}}</h1>
        <div class="confirm" @click="pickerConfirm">{{confirmText}}</div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    autoClose: {
      type: Boolean,
      default () {
        return true
      }
    },
    value: Boolean,
    // 点击遮罩关闭popup
    maskBlur: {
      type: Boolean,
      default () {
        return true
      }
    },
    // 右上角按钮文字
    confirmText: {
      type: String,
      default () {
        return '确定'
      }
    },
    title: String,
    showNav: Boolean,
    showClose: Boolean,
    position: String
  },
  methods: {
    stop () {
      return false
    },
    maskClose () {
      if (this.maskBlur) {
        this.pickerCancel()
      }
    },
    pickerCancel () {
      this.$emit('input', false)
      this.$emit('onCancel')
    },
    pickerConfirm () {
      if (this.autoClose) {
        this.$emit('input', false)
      }
      this.$emit('onConfirm')
    }
  }
}
</script>

<style lang='less' scoped>
@keyframes fade {
  0%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
}
.mPopup{
  .popupMask {
    position: fixed;
    z-index: 1;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    animation: fade 0.3s;
    transition: all 0.3s linear;
  }
  .popup-wrap {
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateY(100%);
    z-index: 20;
    background: #fff;
    overflow: hidden;
    &.showContent {
      opacity: 1;
      transform: translateY(0);
    }
    .closeNav{
      box-sizing: border-box;
      padding: 30rpx;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-size: 30rpx;
      position: relative;
      h1{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
      i{
        color: #bbb;
        font-size: 26rpx;
      }
    }
    .nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding:20rpx 30rpx;
      background-color: #fff;
      font-size: 30rpx;
      color: #2a2a2a;
      // border-bottom: 1rpx solid #e1e1e1;
      position: relative;
      .cancel {
        color: #888;
      }
      h1{
        font-size: 32rpx;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
      .confirm {
        color: #ff6633;
      }
    }
  }
  &.right{
    .popup-wrap{
      border-radius: 0;
      transform: translateX(100%);
      &.showContent {
        transform: translateX(15%);
      }
    }
  }
  &.center{
    .popup-wrap{
      display: none;
      right: 14%;
      left: 14%;
      top: 50%;
      bottom: auto;
      opacity: 0;
      transform: translateY(-50%);
      &.showContent {
        display: inline-block;
        opacity: 1;
        transform: translateY(-50%);
        border-radius: 20rpx;
      }
    }
  }
}
</style>
