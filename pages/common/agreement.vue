<template>
  <div class="article" :class="{showNoData}">
    <article v-if="article" v-html="article"></article>
    <m-noData v-if="showNoData" msg='暂无数据'/>
  </div>
</template>

<script>
import mNoData from '../../components/prompt/mNoData'
import {getAgreementApi} from '../../api/common/index'

export default {
  data () {
    return {
      showNoData: false,
      module: '',
      article: ''
    }
  },
  components: {
    mNoData
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    this.module = options.module
    wx.setNavigationBarTitle({ title: options.module })
    this.getAgreement()
  },
  methods: {
    getAgreement () {
      getAgreementApi(this.module).then(data => {
        this.article = data.protocolContent
        this.showNoData = !this.article
      })
    }
  }
}
</script>

<style scoped lang='less'>
@import '../../../src/assets/style/base.less';
.article{
  padding: @20px @28px;
  &.showNoData{
    background: #f8f8f8;
  }
  article{
    font-size:@28px;
    color:#333333;
    line-height:@44px;
  }
}
</style>
