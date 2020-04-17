<template>
  <!-- 未开发 -->
  <div class="sendMsg">
    <textarea placeholder="请输入消息内容(必填)" v-model="content" :show-confirm-bar='false'/>
    <m-select :type="radio" v-model='sendType' :options="options"/>
    <div class="btns">
      <button @click="submit" radius="radius" :disabled="disabled">发送</button>
    </div>
  </div>
</template>

<script>
import mSelect from '../../components/form/mSelect'
import {sendUserMsgApi, sendListMsgApi} from '../../api/welfareCenter/index'
import {sendEntryMsgApi, sendFansMsgApi} from '../../api/interest/index'
import { toast } from '../../constant/popup'
export default {
  data () {
    return {
      sendType: 1,
      options: [
        {name: '微信客服消息(每日限发一次)', value: 1},
        {name: '服务号系统消息', value: 11}
      ],
      content: '',
      userType: 1,
      serviceID: '',
      module: ''
    }
  },
  components: {
    mSelect
  },
  computed: {
    disabled () {
      return !(this.content !== '')
    }
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    this.userType = options.type
    this.serviceID = options.serviceID
    this.module = options.module
  },
  methods: {
    submit () {
      switch (this.module) {
        case '商家机构':
          this.welfareSendMsg()
          return
        case '婚恋机构':
          this.welfareSendMsg()
          return
        case '兴趣机构':
          this.interestSendMsg()
      }
    },
    // 商家机构群发消息
    welfareSendMsg () {
      let types = {
        'total': 1,
        'fans': 2,
        'saled': 3,
        'verified': 4,
        'notVerify': 5
      }
      // 群发福利名单消息
      if (this.serviceID !== 'undefined') {
        sendListMsgApi(types[this.userType], this.sendType, this.serviceID, {content: this.content}).then(data => {
          toast('none', '发送成功')
          this.content = ''
        })
      } else {
        sendUserMsgApi(types[this.userType], this.sendType, {content: this.content}).then(data => {
          toast('none', '发送成功')
          this.content = ''
        })
      }
    },
    // 兴趣联盟群发消息
    interestSendMsg () {
      // 群发活动名单消息
      if (this.serviceID !== 'undefined') {
        sendEntryMsgApi(this.sendType, this.serviceID, {content: this.content}).then(data => {
          toast('none', '发送成功')
          this.content = ''
        })
      } else { // 群发粉丝
        sendFansMsgApi(this.sendType, {content: this.content}).then(data => {
          toast('none', '发送成功')
          this.content = ''
        })
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import "../../assets/style/base.less";
.sendMsg{
  /deep/.checkBox-wrap{
    padding: 0 @28px;
    box-sizing: border-box;
  }
  /deep/ .check-group{
    display: block;
    .check{
      label{
        font-size: @30px!important;
      }
    }
  }
}
.btns{
  margin-top: @60px;
  padding:0 @28px;
  box-sizing: border-box;
  button[disabled] {
    background: #ff6633;
    opacity: .7;
    color: #fff;
  }
}
</style>
