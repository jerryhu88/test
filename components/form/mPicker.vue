<template>
  <div>
    <picker :mode='mode' range-key='label' @change="onConfirm" :value="picker.index" :range="range" :disabled='disabled'>
      <input :value="picker.label" :placeholder="placeholder" class="select" :class="{disabled}" disabled>
    </picker>
    <p v-if="tips" class="tips">{{tips}}</p>
  </div>
</template>

<script>
import {timeFilter, dateFilter} from '../../constant/filters'
export default {
  data () {
    return {}
  },
  props: {
    disabled: Boolean,
    mode: { // picker类型
      type: String,
      default () {
        return 'selector'
      }
    },
    range: Array,
    tips: String,
    placeholder: String, // 提示
    value: String // v-model绑定的值
  },
  computed: {
    picker () {
      return this.initData()
    }
  },
  onLoad () {
    Object.assign(this.$data, this.$options.data())
  },
  methods: {
    timeFilter,
    dateFilter,
    initData () {
      // 回显
      let index = [] // 输入框的文字
      let label = '' // picker选中项的下标
      if (this.mode === 'time') {
        // time选择器
        index = this.value
        label = this.value
      } else if (this.mode === 'multiSelector') {
        // 多列选择器
        let arr = this.dateFilter(this.value, 'Array')
        arr.map((item, index1) => {
          this.range[index1].map((ran, i) => {
            if (Number(ran.name) === Number(item)) {
              if (this.value) {
                label += ran.value
              }
              index.push(i)
            }
          })
        })
      } else {
        // 单列
        this.range.map((item, i) => {
          console.log(item)
          if (item.value === this.value) {
            index = i
            label = item.label
          }
        })
      }
      return {index, label}
    },
    onConfirm (event) {
      this.index = event.target.value
      // time选择器
      if (this.mode === 'time') {
        this.$emit('input', this.index)
      } else if (this.mode === 'multiSelector') {
        // 多列选择器
        let value = ''
        this.index.map((item, i) => {
          value += this.range[i][item].value
        })
        this.$emit('input', this.timeFilter(value))
      } else {
        // 单列
        this.$emit('input', this.range[this.index].value)
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import '../../../src/assets/style/base.less';
  .tips{
    font-size:@24px;
    color:@red;
    line-height:@32px;
    margin: -@12px @28px @24px @28px;
  }
</style>
