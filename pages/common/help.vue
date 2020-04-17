<template>
  <div>
    <ul class="help" v-if="lists.length">
      <li v-for="(item, index) in lists" :key="index" @click="open(index)">
        <div o-fb class="title vux-1px-b">
          <h1>{{item.labelName}}</h1>
          <i class="iconfont icon-you" :class="{open:item.display}"></i>
        </div>
        <ul class="children" v-show="item.display">
          <li o-fb v-for="(child, i) in item.sysHelpDoc" @click.stop="read(child)" :key="i" class="child vux-1px-b">
            <span>{{child.title}}</span>
            <i class="iconfont icon-you"></i>
          </li>
        </ul>
      </li>
    </ul>
    <m-noData v-else-if="showNoData" msg="暂无数据"/>
    <m-popup v-model='show' :radius='false' position='right'>
      <div class="popup-content">
        <h1>{{info.title}}</h1>
        <article v-html="info.content"></article>
      </div>
    </m-popup>
  </div>
</template>

<script>
import {getHelpListApi} from '../../api/common/index'
import mNoData from '../../components/prompt/mNoData'
import mPopup from '../../components/view/mPopup'

export default {
  data () {
    return {
      showNoData: false,
      show: false,
      lists: [],
      module: '',
      info: {}
    }
  },
  components: {
    mNoData, mPopup
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    this.module = options.module
    this.getHelpList()
  },
  methods: {
    open (index) {
      this.lists[index].display = !this.lists[index].display
    },
    read (item) {
      this.info = item
      this.show = true
    },
    getHelpList () {
      getHelpListApi().then(data => {
        this.lists = data.filter(item => item.childModule === this.module)[0].sysHelpLabel
        this.lists.map(item => {
          this.$set(item, 'display', false)
        })
        this.showNoData = !this.lists.length
      })
    }
  }
}
</script>

<style scoped lang='less'>
@import '../../../src/assets/style/base.less';
.help{
  >li{
    padding-left: @28px;
    .iconfont{
      font-size: @26px;
      color: #777;
      transition: all linear 0.18s;
      &.open{
        transform: rotate(90deg);
      }
    }
    .title{
      padding:@24px @28px @24px 0;
      border-bottom: @1px solid #e1e1e1;
      .center-between;
      h1{
        font-size: @28px;
        color: #2a2a2a;
        font-weight: 600;
      }
    }
    .children{
      padding-left: @28px;
      .child{
        padding:@24px @28px @24px 0;
        border-bottom: @1px solid #e1e1e1;
        .center-between;
        span{
          font-size: @26px;
          color: #2a2a2a;
        }
        .iconfont{
          color: #bbb;
        }
      }
    }
  }
  .hover{
    opacity: 0.8;
  }
}
.popup-content{
  width: 85%;
  height: 100vh;
  overflow: auto;
  background: #fff;
  padding: @28px @24px;
  box-sizing: border-box;
  h1{
    color: #000;
    font-size: @30px;
    margin-bottom: @24px;
    text-align: center;
  }
  article{
    font-size:@28px;
    color:#333;
    line-height:@44px;
  }
}
</style>
