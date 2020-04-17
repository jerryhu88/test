<template>
  <div>
    <div class="turnOrgan" v-if="mess.createByPhone">
      <div class="form">
        <label class="label noMust">发起者信息</label>  
        <p>姓名：{{mess.createByName}}</p>
        <p>电话：{{mess.createByPhone}}</p>
        <p>机构名称：{{mess.fullName}}</p>
        <p>发起时间：{{mess.createTime}}</p>
        <label class="label noMust vux-1px-t">接受者信息</label>
        <p>姓名：{{mess.uname}}</p>
        <p>电话：{{mess.phone}}</p>
        <p class="store">所属门店：{{mess.storeName}}</p>
        <span class="tips">提示：接受后才能管理该机构！</span>
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
import {dateFilter} from '../../../constant/filters'
import {adminConfirmApi, adminRejectApi, senderInfoApi} from '../../../api/welfareCenter/admin'
import { toast, confirm } from '../../../constant/popup'
import mNoData from '../../../components/prompt/mNoData'
import {delToDoListApi} from '../../../api/serviceIndex/index'
import bus from '../../../constant/bus'

export default {
  data () {
    return {
      showNoData: false,
      mess: {}
    }
  },
  components: {
    mNoData
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    this.senderInfo()
  },
  methods: {
    senderInfo () {
      senderInfoApi().then(data => {
        this.mess = {...data, storeName: `${data.fullName} (${data.simpleName})`}
        this.mess.createTime = dateFilter(data.createTime, 'dateTime')
        this.showNoData = !data.createByPhone
      })
    },
    accept () {
      adminConfirmApi().then(data => {
        // 删除待办事项消息
        this.delToDoList()
        toast('success', '接受成功！', () => {
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
          adminRejectApi().then(data => {
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
      delToDoListApi('普惠机构', this.mess.serviceID)
    }
  }
}
</script>

<style lang='less' scoped>
@import "../../../assets/style/base.less";
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
