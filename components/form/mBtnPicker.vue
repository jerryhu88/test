<template>
  <div class="btnPicker-wrap" :class="{noLabel:!label}">
    <label v-if="label" for="">{{label}}</label>
    <div class="input" v-for="(item, i) in data" :key="i">
      <input type="text" :placeholder="placeholder" :value="item.label" disabled>
      <span v-if="append" class="append">{{append}}</span>
      <i class="iconfont icon-delete" hover-class='hover' @click="del(item, i)"></i>
    </div>
    <m-button :addIcon='true' className='redBorder' @click="openPicker" v-if="pickerValueArray.length">添加</m-button>
    <!-- <mp-picker ref="mpPicker" mode="selector" :deepLength=deepLength :pickerValueDefault="pickerValueDefault" @onConfirm="onConfirm" :pickerValueArray='pickerValueArray'/> -->
  </div>
</template>

<script>
// import mpPicker from 'mpvue-weui/src/picker'
import mButton from '../../components/form/mButton'

export default {
  props: {
    pickerValueArray: {
      type: Array,
      default () {
        return []
      }
    },
    pickerValueDefault: {
      type: Array,
      default () {
        return [0]
      }
    },
    label: {
      type: String,
      default () {
        return ''
      }
    },
    value: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      data: []
    }
  },
  components: {
    // mpPicker, mButton
    mButton
  },
  methods: {
    openPicker () {
      this.$refs.mpPicker.show()
    },
    onConfirm ({label, value}) {
      this.data.push({
        label, // 文本框里的内容
        value: value[0] // 值
      })
      this.$emit('getSelect', this.data)
    },
    del (item, i) {
      this.data.splice(i, 1)
      this.$emit('getSelect', this.data)
    }
  }
}
</script>

<style lang='less' scoped>
@import '../../../src/assets/style/base.less';
.btnPicker-wrap{
  border-top:@1px solid #e1e1e1;
  box-sizing: border-box;
  padding: @28px;
  font-size:@30px;
  /deep/.mpvue-picker-view{
    max-height: 360rpx;
  }
  /deep/.mpvue-picker__hd {
    padding:@22px @30px;
    font-size:@26px;
    .mpvue-picker__action:last-child{
      color: @red;
    }
  }
  &.noLabel{
    border-top:0;
    padding-top: 0;
  }
  label{
    font-size:@28px;
    color:#222222;
    line-height:@28px;
    display: flex;
    align-items: center;
    margin-bottom: @28px;
    &::before{
      margin-right: @16px;
      display: inline-block;
      content: '';
      background:@red;
      border-radius:@2px;
      width:@8px;
      height:@26px;
    }
  }
  .input{
    font-size:@26px;
    line-height:@26px;
    color:#222222;
    display: flex;
    background:#f8f8f8;
    height: @72px;
    border-radius:@6px;
    margin-bottom: @26px;
    input{
      box-sizing: border-box;
      height: @72px;
      padding: 0 @20px;
      background:#f8f8f8;
      border-radius:@6px;
      width:100%;
    }
    .append, .icon-delete{
      background: #fff;
      border-top-right-radius: @6px;
      border-bottom-right-radius: @6px;
      border:1px solid #f8f8f8;
      border-left: 0;
      line-height: @72px;
      padding: 0 @20px;
    }
    .icon-guanbi{
      font-size: @22px;
      color: #929292;
      &.hover{
        opacity: 0.8;
      }
    }
  }
  /deep/button{
    height:@72px;
    line-height:@72px;
  }
}
</style>
