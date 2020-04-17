<template>
  <button :open-type='openType' :formType="formType" :class="className" :id='radius' @click="$emit('click')" :disabled='disabled'>
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    formType: String,
    openType: String,
    className: {
      type: String,
      default () {
        return ''
      }
    },
    disabled: {
      type: Boolean,
      default () {
        return false
      }
    },
    radius: {
      type: String,
      default () {
        return ''
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import '../../../src/assets/style/base.less';
  button{
    position: relative;
    border: 0;
    background:#ff6633;
    border-radius:@6px;
    width:100%;
    height:@80px;
    font-size:@30px;
    color:#ffffff;
    line-height:@80px;
    outline: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    &#radius{
      border-radius: @100px;
    }
    &:active{
      &::after{
        display: inline-block;
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        border-radius:@6px;
        background: rgba(0, 0, 0, 0.15);
      }
    }
  }
  button[disabled]{
    opacity: 0.7;
    background:#ff6633;
    color:#ffffff;
  }
</style>
