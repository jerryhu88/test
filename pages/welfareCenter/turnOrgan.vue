<template>
  <div class="turnOrgan">
    <div class="form">
      <label class="label">转让者信息</label>
      <m-input v-model="mess.name" placeholder="请输入姓名(必填)"/>
      <m-input v-model="mess.phone" placeholder="请输入电话(必填)"/>
      <label class="label">被转让者信息</label>
      <m-input v-model="mess.turnName" placeholder="请输入姓名(必填)"/>
      <m-input v-model="mess.turnPhone" placeholder="请输入电话(必填)"/>
    </div>
    <div class="btns" :class="{accept}">
      <m-button @click="toUrl('../creatOrgan')">查看机构信息</m-button>
      <m-button @click="toUrl('../list')">{{accept ? '接受' : '发起'}}转让</m-button>
    </div>
  </div>
</template>

<script>
import mInput from '@/components/form/mInput'
import mButton from '../../components/form/mButton'
export default {
  data () {
    return {
      accept: true,
      mess: {
        name: '',
        phone: '',
        turnName: '',
        turnPhone: ''
      },
      titles: {
        admin: '管理员',
        role: '权限角色'
      },
      type: 'role',
      currTitle: ''
    }
  },
  computed: {
  },
  components: {
    mInput, mButton
  },
  onLoad (options) {
    // this.type = options.type || 'role'
    // let title = '添加' + this.titles[this.type]
    // this.roleEdit = options.roleEdit
    // if (this.roleEdit) {
    //   title = '权限角色详情'
    // }
    // wx.setNavigationBarTitle({ title })
  },
  methods: {
    toUrl (url) {
      wx.navigateTo({url})
    }
  }
}
</script>

<style lang='less' scoped>
@import "../../assets/style/base.less";
  .turnOrgan{
    background: #f8f8f8;
    box-sizing: border-box;
    height: 100vh;
    .form{
      background: #fff;
      overflow: hidden;
    }
    .btns{
      position: fixed;
      bottom:0;
      left:0;
      width:100%;
      background-color: #fff;
      text-align: center;
      padding: @20px @30px;
      box-sizing: border-box;
      &.accept{
        display: flex;
        padding: @30px;
        /deep/button{
          width: 50%;
          padding: @20px 0;
          &:first-child{
            background: #fff;
            border: @1px solid @red;
            color: @red;
            margin-right: @24px;
            margin-right: @24px;
          }
        }
      }
      p{
        color: #929292;
        font-size: @26px;
        margin-bottom: @18px;
      }
    }
  }
</style>
