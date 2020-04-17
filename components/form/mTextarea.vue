<template>
  <textarea :placeholder="placeholder" :value='value' :maxlength="max" :style="{'height':rows +'rpx'}" @input="bindinput"/>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default () {
        return ''
      }
    },
    placeholder: {
      type: String,
      default () {
        return '请输入'
      }
    },
    max: {
      type: Number,
      default () {
        return 999
      }
    }
  },
  computed: {
    rows () {
      if (this.max === 999) {
        return 36 * 8
      } else {
        return 36 * Math.ceil(this.max / 25)
      }
    }
  },
  methods: {
    bindinput (e) {
      this.$emit('input', e.target.value)
    }
  }
}
</script>

<style lang='less' scoped>
@import '../../../src/assets/style/base.less';
textarea{
  margin:0 @28px @20px;
  font-size:@26px;
  color:#222222;
  border-radius:@6px;
  display: inline-block;
  box-sizing: border-box;
  padding: @6px @10px;
  background:#f8f8f8;
  width:calc(~'100% - '@56px);
}
</style>
