<template>
  <div>
    <div class="turnOrgan" v-if="mess.phone">
      <div class="form">
        <label class="label noMust">发起者信息</label>
        <p>姓名：{{mess.createByName}}</p>
        <p>机构名称：{{mess.orgName}}</p>
        <p>发起时间：{{mess.createTime}}</p>
        <label class="label noMust vux-1px-t">接受者信息</label>
        <p>姓名：{{mess.uname}}</p>
        <p>职位：{{personName}}</p>
        <span class="tips">提示：接受后才能成为该机构{{personName}}！</span>
      </div>
      <div class="btns">
        <button @click="reject">拒绝</button>
        <button @click="accept">接受</button>
      </div>
    </div>
    <m-noData v-else-if="showNoData" msg='你暂未接收到他人邀请~'/>
  </div>
</template>

<script>
import {dateFilter} from '../../constant/filters'
import {adminConfirmApi, senderInfoApi} from '../../api/common'
import { toast, confirm } from '../../constant/popup'
import mNoData from '../../components/prompt/mNoData'
import bus from '../../constant/bus'
import {delToDoListApi} from '../../api/serviceIndex/index'

export default {
  data () {
    return {
      showNoData: false,
      mess: {},
      type: '',
      groupType: '',
      types: {},
      personName: '管理员' // 婚恋机构、兴趣联盟：管理员，法律机构：律师
    }
  },
  components: {
    mNoData
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    this.type = options.type // 模块类型
    this.groupType = options.groupType // 兴趣机构要传小组类型
    if (this.type === 'law') {
      this.personName = '签约律师'
      wx.setNavigationBarTitle({ title: '签约律师接受确认' })
    }
    this.types = {
      interest: {
        getInfo: `/interest/group/managerConfirmInfo/${this.groupType}`,
        accept: `/interest/group/managerAudit/${this.groupType}/2`,
        reject: `/interest/group/managerAudit/${this.groupType}/5`,
        name: '兴趣机构'
      },
      love: {
        getInfo: '/love/org/managerConfirmInfo',
        accept: `/love/org/managerAudit/2`,
        reject: `/love/org/managerAudit/5`,
        name: '婚恋机构'
      },
      law: {
        getInfo: '/law/lawer/confirmInfo',
        accept: `/law/lawer/audit/2`,
        reject: `/law/lawer/audit/5`,
        name: '法律机构'
      }
    }
    this.senderInfo()
  },
  methods: {
    senderInfo () {
      senderInfoApi(this.types[this.type].getInfo).then(data => {
        this.mess = {...data, orgName: data.groupName || data.nameSimple || data.orgName || data.simpleName}
        this.mess.createTime = dateFilter(data.createTime, 'dateTime')
        this.showNoData = !data.phone
      })
    },
    accept () {
      adminConfirmApi(this.types[this.type].accept).then(data => {
        // 删除待办事项消息
        this.delToDoList()
        toast('success', '接受成功', () => {
          bus.$emit('firstPage')
          wx.navigateBack({
            delta: 1
          })
        })
      })
    },
    reject () {
      confirm(
        '提示',
        `确认拒绝该邀请吗？`,
        '确定',
        () => {
          adminConfirmApi(this.types[this.type].reject).then(data => {
            // 删除待办事项消息
            this.delToDoList()
            toast('none', '已拒绝', () => {
              bus.$emit('firstPage')
              wx.navigateBack({
                delta: 1
              })
            })
          })
        }
      )
    },
    delToDoList () {
      delToDoListApi(this.types[this.type].name, this.mess.serviceID)
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
      padding: 0 @28px;
      .label{
        padding: @22px 0;
        font-weight: bold;
        font-size: @30px;
        &.vux-1px-t{
          margin-top: @24px;
          padding-top:@24px;
        }
      }
      p{
        font-size: @28px;
        color: 333;
        margin-bottom: @14px;
        &.store{
          margin-bottom: 0;
        }
      }
      .tips{
        font-size:@24px;
        color:@red;
        line-height:@34px;
        margin: @16px 0;
        display: inline-block;
      }
    }
    .btns{
      width:100%;
      background-color: #fff;
      text-align: center;
      padding: @30px @30px @30px;
      box-sizing: border-box;
      display: flex;
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
  }
</style>
