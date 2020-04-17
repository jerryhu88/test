<template>
  <div class="input-wrap" :class="{codeInput:append === 'code', disabled}" @click="$emit('click')">
    <!-- 输入框前的文字 -->
    <span v-if="before" class="before">{{before}}</span>
    <input :type="type" :placeholder="placeholder" @input="$emit('input', $event.target.value)" :value="value" :maxlength="max" :disabled='disabled' @blur='blur'>
    <img class="code" v-if="append === 'code'" :src="url + time + '&serviceID=' + serviceID" @click="changeUrl">
    <span v-else-if="append" class="append" v-html='append'></span>
  </div>
</template>

<script>
import Config from '../../config/index'
export default {
  data () {
    return {
      url: Config.api + Config.codeUrl,
      time: Math.random(),
      serviceID: wx.getStorageSync('JSESSIONID')
    }
  },
  props: {
    blur: Function,
    disabled: Boolean,
    idName: 'String',
    before: String,
    type: {
      type: String,
      default () {
        return 'text'
      }
    },
    max: {
      type: Number,
      default () {
        return 100
      }
    },
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
    // 输入框后置内容
    append: {
      type: String,
      default () {
        return ''
      }
    }
  },
  created () {
    if (this.append === 'code') {
      this.changeUrl()
    }
  },
  methods: {
    changeUrl () {
      this.time = Math.random()
    }
  }
}
</script>

<style lang='less' scoped>
@import '../../../src/assets/style/base.less';
.input-wrap{
  margin: @28px;
  margin-top: 0;
  font-size:@26px;
  line-height:@26px;
  color:#222222;
  display: flex;
  align-items: center;
  height: @72px;
  border-radius:@6px;
  background:#f8f8f8;
  &.disabled{
    background: #dedede;
  }
  &.codeInput{
    background: #fff;
  }
  flex: 1;
  .before{
    padding-left: @20px;
  }
  input{
    box-sizing: border-box;
    height: @72px;
    padding: 0 @20px;
    background:#f8f8f8;
    border-radius:@6px;
    flex: 1;
    &[disabled] {
      background: #dfdfdf;
    }
  }
  .code{
    background:#f8f8f8;
    border-radius:@6px;
    width:@228px;
    height:@72px;
    margin-left: @22px;
  }
  .append, .icon-guanbi{
    margin-right: @22px;
    line-height: @72px;
  }
  .icon-guanbi{
    font-size: @22px;
    color: #929292;
  }
}
</style>
