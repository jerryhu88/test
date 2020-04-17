<template>
  <div>
    <ul class="check-group">
      <li class="check" v-for="(item, i) in options" :key="i" @click="change(item, i)">
        <div v-if="type === 'radio'">
          <i class="iconfont" :class="item.value === value ? 'icon-31xuanzhong' : 'icon-weixuanzhongyuanquan'"></i>
          <label class="item" for="">{{item.name}}</label>
        </div>
        <div v-if="type === 'checkbox'">
          <i class="iconfont" :class="item.checked ? 'icon-squarecheckfill' : 'icon-square'"></i>
          <label class="item" for="">{{item.name}}</label>
        </div>
      </li>
    </ul>
    <button v-if="showSlectAll" @click="selectAll" class="selectAll">全选</button>
  </div>
</template>

<script>
export default {
  props: {
    showSlectAll: Boolean,
    type: {
      type: String,
      default () {
        return 'radio'
      }
    },
    label: String,
    options: Array,
    value: String
  },
  data () {
    return {
      // options: [
      //   {name: 'USA', value: '美国', checked: false},
      //   {name: 'CHN', value: '中国', checked: true}
      // ],
      checkDatas: []
    }
  },
  methods: {
    change (item, i) {
      if (this.type === 'radio') {
        this.$emit('input', item.value)
      } else if (this.type === 'checkbox') {
        this.checkDatas = []
        this.options[i].checked = !this.options[i].checked
        this.options.map(item => {
          if (item.checked) {
            this.checkDatas.push(item.value)
          }
        })
        this.$emit('input', this.checkDatas)
      }
      this.$emit('select')
    },
    selectAll () {
      this.checkDatas = []
      this.options.forEach(item => {
        item.checked = true
        this.checkDatas.push(item.value)
      })
      this.$emit('input', this.checkDatas)
    }
  }
}
</script>

<style lang='less' scoped>
@import '../../../src/assets/style/base.less';
  .selectAll{
    width: @82px;
    height: @48px;
    background: #fff;
    border: 1px solid;
    color: #ff6633;
    font-size: @24px;
    padding: 0;
    margin: -@6px 0 @28px @32px;
  }
  .check-group{
    display: flex;
    align-items: center;
    flex-wrap:wrap;
    padding: 0 @28px @14px;
    .check{
      margin-bottom: @14px;
      &:not(:last-child){
        margin-right: @42px;
      }
      >div{
        display: flex;
        align-items: center;
        radio{
          display: none;
        }
        i{
          height:@38px;
          width:@38px;
          line-height:@38px;
          font-size: @38px;
          color: @red;
          margin-right: @8px;
          &.icon-weixuanzhongyuanquan, &.icon-square{
            color: #ff6633;
          }
        }
        label{
          position: relative;
          top: -@1px;
          font-size:@30px;
          color:#666;
        }
      }
    }
  }
</style>
