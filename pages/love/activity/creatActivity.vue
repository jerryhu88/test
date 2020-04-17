<template>
  <div class="createTicket">
    <m-upload type='small' label='配图' v-model="mess.pictures" :max='5' tips='提示：请上传格式为JPG/PNG，≤3M的图片，最多5张' module='婚恋机构'/>
    <label class="label">活动名称</label>
    <textarea placeholder="活动名称，40字(必填)" v-model="mess.activityName" maxlength="40" style="height:56px" :show-confirm-bar='false'/>
    <label class="label">报名时间</label>
    <m-picker mode='multiSelector' :range='range' v-model="mess.entryStartTime" placeholder="请选择开始时间(必填)"/>
    <m-picker mode='multiSelector' :range='range' v-model="mess.entryEndTime" tips='注：报名结束时间必须大于开始时间' placeholder="请选择结束时间(必填)"/>
    <label class="label">活动时间</label>
    <m-picker mode='multiSelector' :range='range' v-model="mess.startTime" placeholder="请选择开始时间(必填)"/>
    <m-picker mode='multiSelector' :range='range' v-model="mess.endTime" tips='注：活动结束时间必须大于开始时间' placeholder="请选择结束时间(必填)"/>
    <label class="label">活动地点</label>
    <textarea placeholder="活动地点，60字(必填)" v-model="mess.address" maxlength="60" style="height:76px" :show-confirm-bar='false'/>
    <div class="switch vux-1px-t">
      <label class="label">活动人数限制</label>
      <span>限制男女报名人数</span>
      <switch :checked="mess.numLimitFlag" @click="numLimit" color='#ff6633'/>
    </div>
    <m-input v-if="!mess.numLimitFlag" type='number' v-model="mess.numCount" placeholder="请输入报名人数(必填)" append='人'/>
    <div v-if="mess.numLimitFlag">
      <m-input before='男性报名人数限制:' type='number' v-model="mess.manCount" placeholder="必填" append='人'/>
      <m-input before='女性报名人数限制:' type='number' v-model="mess.womanCount" placeholder="必填" append='人'/>
    </div>
    <label class="label">是否保持男女平衡</label>
    <m-input before='男女报名人数平衡差:' type='number' v-model="mess.balancedAmount" placeholder="请输入(选填)" append='人'/>
    <p class="tips">注：此设置为男女性报名人数相差数量设置，任意一种性别的报名人数不得多于另外一种性别的报名人数N人。</p>
    <label class="label">男性报名年龄段限制</label>
    <div class="input">
      <input v-model="mess.startManAge" class="to" type="number" placeholder='请输入(选填)' maxlength="2">
      <input v-model="mess.endManAge" class="age" type="number" placeholder='请输入(选填)' maxlength="2">
    </div> 
    <label class="label">女性报名年龄段限制</label>
    <div class="input">
      <input v-model="mess.startWomanAge" class="to" type="number" placeholder='请输入(选填)' maxlength="2">
      <input v-model="mess.endWomanAge" class="age" type="number" placeholder='请输入(选填)' maxlength="2">
    </div>
    <label class="label">活动规则/流程</label>
    <textarea placeholder="请输入使用规则(必填)" v-model="mess.rule" :show-confirm-bar='false'/>
    <label class="label">外链地址</label>
    <m-input v-model="mess.link" placeholder="请输入带http的链接(选填)"/>
    <label class="label">负责人信息</label>
    <m-input v-model="mess.applyName" placeholder="请输入姓名(必填)" :max='8'/>
    <m-input v-model="mess.applyPhone" placeholder="请输入电话(必填)" :max='11'/>
    <div class="btns">
      <m-button @click="submit" radius='radius'>提交</m-button>
    </div>
  </div>
</template>

<script>
import mInput from '../../../components/form/mInput'
import mSelect from '../../../components/form/mSelect'
import mButton from '../../../components/form/mButton'
import mUpload from '../../../components/form/mUpload'
import mPicker from '../../../components/form/mPicker'
import mPopup from '../../../components/view/mPopup'
import {defData} from '../../../constant'
import {submitActivityApi, getActivityDetailApi} from '../../../api/love/index'
import { toast } from '../../../constant/popup'
export default {
  data () {
    return {
      range: defData.dateTime,
      mess: {
        numLimitFlag: false,
        balancedFlag: false,
        limitManAgeFlag: false,
        limitWomanAgeFlag: false,
        pictures: [],
        activityName: '',
        limitNumber: '',
        manCount: '',
        womanCount: '',
        entryStartTime: '',
        entryEndTime: '',
        startTime: '',
        endTime: '',
        rule: ''
      },
      serviceID: '',
      edit: false
    }
  },
  components: {
    mPopup, mInput, mButton, mUpload, mPicker, mSelect
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    this.serviceID = options.serviceID
    if (this.serviceID) {
      this.edit = true
      wx.setNavigationBarTitle({
        title: '编辑活动'
      })
      this.getActDetail()
    }
  },
  methods: {
    numLimit () {
      this.mess.numLimitFlag = !this.mess.numLimitFlag
      this.mess.numCount = ''
      this.mess.manCount = ''
      this.mess.womanCount = ''
    },
    // 获取详情
    getActDetail () {
      getActivityDetailApi(this.serviceID).then(data => {
        this.mess = data
        this.mess.pictures = JSON.parse(data.pictures)
      })
    },
    submit () {
      if (!this.mess.pictures) {
        return toast('none', '请上传活动配图')
      }
      if (!this.mess.activityName) {
        return toast('none', '请输入活动名称')
      }
      if (!this.mess.entryStartTime) {
        return toast('none', '请选择报名开始时间')
      }
      if (!this.mess.entryEndTime) {
        return toast('none', '请选择报名结束时间')
      }
      if (this.mess.entryEndTime < this.mess.entryStartTime) {
        return toast('none', '报名结束时间需＞报名开始时间')
      }
      if (!this.mess.startTime) {
        return toast('none', '请选择活动开始时间')
      }
      if (!this.mess.endTime) {
        return toast('none', '请选择活动结束时间')
      }
      if (this.mess.endTime < this.mess.startTime) {
        return toast('none', '活动结束时间需＞活动开始时间')
      }
      if (!this.mess.address) {
        return toast('none', '请输入活动地址')
      }
      if (!this.mess.numLimitFlag && !this.mess.numCount) {
        return toast('none', '请输入报名人数')
      }
      if (this.mess.numLimitFlag) {
        if (!this.mess.manCount) {
          return toast('none', '请输入男性报名人数限制')
        }
        if (!this.mess.womanCount) {
          return toast('none', '请输入女性报名人数限制')
        }
      }
      if ((this.mess.startManAge && !this.mess.endManAge) || (!this.mess.startManAge && this.mess.endManAge)) {
        return toast('none', '请填写正确的男性报名年龄段限制')
      }
      if ((this.mess.startWomanAge && !this.mess.endWomanAge) || (!this.mess.startWomanAge && this.mess.endWomanAge)) {
        return toast('none', '请填写正确的女性报名年龄段限制')
      }
      if (!this.mess.rule) {
        return toast('none', '请输入活动规则/流程')
      }
      if (!this.mess.applyName) {
        return toast('none', '请输入申请人')
      }
      if (!this.mess.applyPhone) {
        return toast('none', '请输入申请人手机号')
      }
      let mess = {
        ...this.mess,
        numLimitFlag: this.mess.numLimitFlag ? 1 : 0,
        balancedFlag: this.mess.balancedAmount ? 1 : 0,
        limitManAgeFlag: this.mess.endManAge ? 1 : 0,
        limitWomanAgeFlag: this.mess.endWomanAge ? 1 : 0
      }
      submitActivityApi(this.edit, mess).then(data => {
        let tips = '提交成功，等待审核'
        if (this.serviceID) {
          tips += '审核前原数据不变…'
        }
        toast('none', tips, () => {
          wx.navigateBack({
            delta: 1
          })
        })
      })
    }
  }
}
</script>

<style scoped lang='less'>
@import '../../../../src/assets/style/base.less';
.createTicket{
  .tips{
    font-size:@24px;
    color:@red;
    line-height:@32px;
    padding: 0 @24px @24px @24px;
  }
  .input{
    display: flex;
    align-items: center;
    background:#f8f8f8;
    border-radius:@6px;
    margin: 0 @24px @20px;
    width: calc(~'100% - '@48px);
    font-size: @26px;
    input{
      box-sizing:border-box;
      height:@72px;
      position: relative;
      width: 50%;
      padding-left: @24px;
      &:last-child{
        padding-left: @12px;
      }
      &:before, &:after{
        position: absolute;
        display: inline-block;
        top: 50%;
        transform: translateY(-50%);
        right: @20px;
      }
      &.to:before{
        content: '岁';
        right: @64px;
      }
      &.to:after{
        content: '至';
        color: #999;
      }
      &.age:after{
        content: '岁';
      }
    }
  }
  .switch{
    display: flex;
    align-items: center;
    padding-right: @28px;
    position: relative;
    label{
      flex: 1;
      font-size:@28px;
      color:#222222;
      line-height:@28px;
    }
    span{
      font-size: @26px;
      color: #666;
    }
    /deep/switch{
      transform:scale(0.7);
      margin-right: -@24px;
    }
  }
  .btns{
    display: flex;
    padding: @30px;
    padding-bottom: @40px;
  }
  // 福利标签
  .picker-wrap{
    border-top:@1px solid #e1e1e1;
    box-sizing: border-box;
    padding: @28px;
    label{
      font-size:@28px;
      color:#222222;
      line-height:@28px;
      display: flex;
      align-items: center;
      margin-bottom: @28px;
      &::before{
        margin-right: @16px;
        display: inline-block;
        content: '';
        background:@red;
        border-radius:@2px;
        width:@8px;
        height:@26px;
      }
    }
    .picker{
      font-size:@26px;
      line-height:@26px;
      color:#222222;
      display: flex;
      background:#f8f8f8;
      height: @72px;
      border-radius:@6px;
      &.hover{
        background: #eee;
      }
      input{
        box-sizing: border-box;
        height: @72px;
        padding: 0 @20px;
        border-radius:@6px;
        width:100%;
      }
      .icon-you{
        font-size: @28px;
        color: #929292;
        margin-right: @22px;
        margin-top: @24px;
      }
    }
  }
  .check-wrap{
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    // margin-top: @90px;
    width: 100%;
    min-height: @300px;
    max-height: @500px;
    padding: @30px;
    checkbox{
      display: none;
    }
    .checkerBtn{
      padding:@28px @15px;
      background:#f8f8f8;
      border-radius:@10px;
      overflow-y: auto;
      &:not(:last-child){
        margin-bottom: @20px;
      }
      h1{
        font-size: @30px;
        color: #2a2a2a;
        padding: 0 @15px;
      }
      .boonLabels{
        display: flex;
        flex-wrap: wrap;
        align-content:flex-start;
        .select-item {
          width: 28.8%;
          margin: @28px @15px 0;
          height:@60px;
          line-height: @60px;
          text-align: center;
          border:@1px solid #989898;
          border-radius:@8px;
          background:#ffffff;
          font-size:@24px;
          color:#979797;
          &.hover{
            background: #eee;
          }
          &.selected {
            background:#ff6633;
            color:#ffffff;
            border-color: #ff6633;
          }
        }
      }
    }
  }
}
</style>
