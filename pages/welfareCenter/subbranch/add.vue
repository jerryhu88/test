<template>
  <div class="addBranch">
    <label class="label">门店简称</label>
    <m-input @click='clickName' :disabled="mess.storeType === 1" v-model="mess.simpleName" :before='orgSimpleName' placeholder="如“南门店”，10字以内(必填)" :max='10'/>    
    <label class="label">业务/客服联系人</label>
    <div class="person">
      <m-input v-model="mess.agentOne" placeholder="联系人1姓名(必填)" :max='8'/>    
      <m-input type='number' v-model="mess.agentOnePhone" placeholder="联系人1电话(必填)" :max='11'/>
    </div>
    <div class="person">
      <m-input v-model="mess.agentTwo" placeholder="联系人2姓名(选填)" :max='8'/>
      <m-input type='number' v-model="mess.agentTwoPhone" placeholder="联系人2电话(选填)" :max='11'/>
    </div>
    <label class="label">门店地址</label>
    <input @click="selectAddress" v-model="mess.fullAddress" placeholder="点击选择门店地址" class="select" disabled>
    <label class="label">营业时间</label>
    <div class="selectTime">
      <m-picker mode='selector' v-model='mess.openStartWeek' :range='weeks' placeholder="每周开始时间"/>
      <span>至</span>
      <m-picker mode='selector' v-model='mess.openEndWeek' :range='weeks' placeholder="每周开始时间"/>
    </div>
    <div class="selectTime">
      <m-picker mode='time' v-model="mess.openStartTime" placeholder="每日开始时间"/>
      <span>至</span>
      <m-picker mode='time' v-model="mess.openEndTime" placeholder="每日结束时间"/>
    </div>
    <!-- <label class="label">验证码</label>
    <m-input v-model="mess.verifycode" placeholder="请输入(必填)" :max='6' append='code'/> -->
    <button @click="submit" class='addBtn'>{{serviceID ? '提交' : '添加门店'}}</button>
  </div>
</template>

<script>
import bus from '../../../constant/bus'
import mInput from '@/components/form/mInput'
import mPicker from '@/components/form/mPicker'
import {getSubbranchInfoApi, addSubbranchApi} from '../../../api/welfareCenter/subbranch'
import {toast} from '../../../constant/popup'

export default {
  data () {
    return {
      serviceID: '',
      orgSimpleName: '',
      mess: {
        fullAddress: '',
        agentOne: '',
        agentOnePhone: '',
        agentTwo: '',
        agentTwoPhone: '',
        openEndWeek: '',
        openStartWeek: '',
        openStartTime: '',
        openEndTime: '',
        region: '',
        simpleName: ''
      },
      weeks: [
        { label: '周一', value: 1 },
        { label: '周二', value: 2 },
        { label: '周三', value: 3 },
        { label: '周四', value: 4 },
        { label: '周五', value: 5 },
        { label: '周六', value: 6 },
        { label: '周日', value: 7 }
      ]
    }
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    this.serviceID = options.serviceID
    this.orgSimpleName = options.orgSimpleName
    if (this.serviceID) {
      wx.setNavigationBarTitle({ title: '编辑门店' })
      this.getSubbranchInfo()
    }
  },
  components: {
    mInput, mPicker
  },
  methods: {
    clickName () {
      if (this.mess.storeType === 1) {
        return toast('none', '总店无法修改简称')
      }
    },
    // 选择地址
    selectAddress () {
      let that = this
      wx.chooseLocation({
        success: function (res) {
          let address = res.address
          that.mess.latitude = res.latitude
          that.mess.longitude = res.longitude
          that.mess.fullAddress = address
          let quIndex = address.indexOf('区')
          let xianIndex = address.indexOf('县')
          if (quIndex > 0) {
            that.mess.region = address.substring(0, quIndex + 1)
          } else {
            that.mess.region = address.substring(0, xianIndex + 1)
          }
        }
      })
    },
    submit () {
      if (!this.mess.simpleName) {
        return toast('none', '请填写门店名称')
      }
      if (!this.mess.agentOne) {
        return toast('none', '请填写业务/客服联系人姓名')
      }
      if (!this.mess.agentOnePhone) {
        return toast('none', '请填写业务/客服联系人手机号')
      }
      if (!this.mess.fullAddress) {
        return toast('none', '请选择门店地址')
      }
      if (!this.mess.openStartWeek) {
        return toast('none', '请选择每周开始营业时间')
      }
      if (!this.mess.openEndWeek) {
        return toast('none', '请选择每周结束营业时间')
      }
      if (!this.mess.openStartTime) {
        return toast('none', '请选择每天开始营业时间')
      }
      if (!this.mess.openEndTime) {
        return toast('none', '请选择每天结束营业时间')
      }
      // if (!this.mess.verifycode) {
      //   return toast('none', '请输入验证码')
      // }
      addSubbranchApi(this.mess).then(data => {
        toast('success', `${this.serviceID ? '修改' : '门店添加'}成功`, () => {
          bus.$emit('firstPage')
          this.$router.back()
        })
      })
    },
    getSubbranchInfo () {
      getSubbranchInfoApi(this.serviceID).then(data => {
        this.mess = data
      })
    }
  }
}
</script>

<style scoped lang='less'>
@import '../../../assets/style/base.less';
.addBranch{
  .addBtn{
    margin: @50px @28px;
    width: calc(~'100% - '@56px);
  }
  .person{
    display: flex;
    /deep/.input-wrap{
      &:first-child{
        margin-right: @14px;
      }
      &:last-child{
        margin-left: @14px;
      }
    }
  }
  // 带右箭头选择框
  input.select{
    padding-right: @64px;
    &:after{
      content: "\e603";
      color: @red;
      font-size: @38px;
    }
  }
  .selectTime{
    display: flex;
    align-items: center;
    span{
      font-size:@28px;
      color:#2a2a2a;
      padding-bottom: @28px;
    }
  }
}
</style>
