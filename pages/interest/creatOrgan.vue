<template>
  <div class="createOrgan">
    <!-- <label v-if="!editFlag" class="label">入驻平台</label>
    <m-picker v-if="!edit" v-model="mess.rootID" :range='depts' placeholder="请选择入驻平台(必选)" tips='提示：申请成功后入驻平台不可修改！' :disabled='editFlag'/> -->
    <m-upload label='兴趣小组LOGO' v-model="mess.logo" :max='1' tips='提示：请上传格式为JPG/PNG，≤3M的图片（必传）' module='兴趣机构'/>
    <label class="label">兴趣小组名称</label>
    <m-input v-model="mess.groupName" placeholder="请输入10字以内(必填)" :max='10'/>
    <label class="label">兴趣小组简介</label>
    <textarea placeholder="请输入60字以内(必填)" v-model="mess.description" maxlength="60" style="height:76px" :show-confirm-bar='false'/>
    <label class="label">兴趣小组标签 (最多3个)</label>
    <input @click="show = true" v-model="labels" placeholder="点击选择小组标签" class="select" disabled>
    <!-- 自己添加标签 -->
    <div class="addLabel" v-show="mess.labels.length < 3">
      <label for="">自定义小组标签</label>
      <div class="input" v-for="(item, i) in selfLabels" :key="i">
        <input @blur='blurAddLabel(item.labelName, i)' v-model="item.labelName" placeholder='请输入4字以内的标签名' maxlength="4">
        <i @click="delLabel(i)" class="iconfont icon-delete"></i>
      </div>
      <button hover-class="button-hover" @click="addLabel" v-if="labelNum < 3">
        <i class="iconfont icon-jia"></i>
        <span>添加</span>
      </button>
    </div>
    <label v-if="organType" class="label">申请机构名称</label>
    <m-input v-if="organType" v-model="mess.orgName" placeholder="请输入(必填)"/>    
    <label class="label">申请人身份证</label>
    <div class="idCardUpload">
      <m-upload flex type='big' v-model="mess.idCard1Picture" :defaultImg="require('../../assets/images/身份证正面.png')" border module='兴趣机构'/>
      <m-upload flex type='big' v-model="mess.idCard2Picture" :defaultImg="require('../../assets/images/身份证反面.png')" module='兴趣机构'/>
    </div>
    <label v-if="organType" class="label">三证合一代码/组织机构代码</label>
    <m-input v-if="organType" v-model="mess.orgCode" placeholder="请输入(必填)" :max='18'/>
    <m-upload v-if="organType" type='big' label='营业执照上传' v-model="mess.licensePicture" :defaultImg="require('../../assets/images/营业执照.png')" border module='兴趣机构'/>
    <label class="label noMust">申请备注</label>
    <textarea placeholder="请输入60字以内" v-model="mess.remark" maxlength="60" style="height:76px" :show-confirm-bar='false'/>
    <div class="agreement">
      <p @click="agreeFlag = !agreeFlag">
        <i class="iconfont icon-31xuanzhong" :class="{agreeFlag}"></i>
        <span>已阅读并同意</span>
      </p>
      <navigator url="../common/agreement?module=兴趣机构-入驻协议">《兴趣小组注册协议》</navigator>
    </div>
    <div class="btns">
      <button v-if="editFlag" @click="logOut" class="logOut">注销机构</button>
      <button @click="submit" class="submit">提交</button>
    </div>
    <!-- 兴趣标签弹窗 -->
    <m-popup v-model="show" showNav title='选择兴趣标签' :radius='false'>
      <ul class="check-wrap">
        <li class="checkerBtn" @click="selectLabel(label, i)" v-for="(label, i) in defLabels" :key="i">
          <div class="select-item" :class="{selected:label.checked}">{{label.name}}</div>
        </li>
      </ul>
    </m-popup>
  </div>
</template>

<script>
import mPicker from '@/components/form/mPicker'
import mInput from '@/components/form/mInput'
import mPopup from '@/components/view/mPopup'
import mButton from '@/components/form/mButton'
import mUpload from '@/components/form/mUpload'
import {loginOutGroupApi, subGroupApi, getGroupDetailApi, getActivityLabelApi} from '../../api/interest/index'
import {toast, confirm} from '../../constant/popup'
import {mapGetters} from 'vuex'
const selfLabel = {
  labelName: '' // 标签名
}
export default {
  data () {
    return {
      selfLabels: [],
      agreeFlag: false,
      // depts: [{label: '南充职工', value: 1}, {label: '仪陇工会', value: 2}],
      defLabels: [],
      show: false,
      labels: [],
      deptName: '',
      audit: false,
      mess: {
        // rootID: '',
        labels: [],
        logo: '',
        idCard1Picture: '',
        idCard2Picture: '',
        licensePicture: ''
      },
      organType: false,
      editFlag: false
    }
  },
  components: {
    mInput, mButton, mUpload, mPopup, mPicker
  },
  computed: {
    ...mapGetters(['userInfo']),
    labelNum () {
      return this.mess.labels.length + this.selfLabels.length
    }
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    console.log(this.userInfo)
    // 机构兴趣小组
    if (this.userInfo.groupType === 2 || Number(options.groupType) === 2) {
      this.organType = true
      wx.setNavigationBarTitle({ title: '创建机构兴趣小组' })
    }
    if (options.edit === 'true') {
      this.editFlag = true
      // 编辑机构信息
      wx.setNavigationBarTitle({ title: '编辑机构信息' })
    }
    this.getActivityLabel()
  },
  methods: {
    getOrganInfo () {
      getGroupDetailApi().then(data => {
        this.agreeFlag = true
        this.mess = data
        // 标签
        this.defLabels.map(defLabel => {
          data.labels.map(label => {
            if (defLabel.name === label.labelName) {
              defLabel.checked = true
              this.labels.push(defLabel.name)
            }
          })
        })
        this.labels = this.labels.join('、')
      })
    },
    getActivityLabel () {
      getActivityLabelApi().then(data => {
        this.defLabels = data.map(item => {
          return {
            name: item.labelName,
            checked: false,
            interestLabelID: item.interestLabelID
          }
        })
        if (this.editFlag) {
          this.getOrganInfo()
        }
      })
    },
    selectLabel (label, labelI) {
      // 选中了3个再点击没被选中的，则不可选
      if (this.labelNum === 3 && !label.checked) {
        return toast('none', '已有三个标签')
      }
      // 点击未选中的选中，未被选中的选中
      this.defLabels.map((tag, i) => {
        if (i === labelI) {
          tag.checked = !tag.checked
        }
      })
      this.labels = [] // 清空
      this.mess.labels = []
      // 把选中的放入labels
      this.defLabels.map(tag => {
        if (tag.checked) {
          this.labels.push(tag.name)
          this.mess.labels.push(tag)
        }
      })
      this.labels = this.labels.join('、')
    },
    addLabel () {
      if (this.labelNum === 3) {
        return toast('none', '已选择三个标签，不可再自定义')
      }
      this.selfLabels.push(JSON.parse(JSON.stringify(selfLabel)))
    },
    delLabel (i) {
      this.selfLabels.splice(i, 1)
    },
    blurAddLabel (label, i) {
      this.defLabels.forEach(item => {
        if (item.name === label) {
          this.selfLabels[i].labelName = ''
          return toast('none', '该标签已存在')
        }
      })
    },
    logOut () {
      confirm('提示', '注销机构将清除所有机构信息且不可恢复，确认注销吗？', '确定', () => {
        loginOutGroupApi().then(data => {
          toast('none', '机构已注销', () => {
            wx.reLaunch({ url: '../serviceIndex/index' })
          })
        })
      })
    },
    submit () {
      console.log({...this.mess, labels: [...this.mess.labels, ...this.selfLabels]})
      // if (!this.mess.rootID) {
      //   return toast('none', '请选择入驻平台')
      // }
      if (!this.mess.logo) {
        return toast('none', '请上传机构LOGO')
      }
      if (!this.mess.groupName) {
        return toast('none', '请输入兴趣小组名称')
      }
      if (!this.mess.description) {
        return toast('none', '请输入兴趣小组简介')
      }
      if (!this.mess.labels.length && !this.selfLabels.length) {
        return toast('none', '请选择兴趣小组标签')
      }
      let isLabelInput = this.selfLabels.length === 0
      this.selfLabels.forEach(item => {
        isLabelInput = Boolean(item.labelName)
      })
      if (!isLabelInput) {
        return toast('none', '请输入自定义标签')
      }
      if (this.organType && !this.mess.orgName) {
        return toast('none', '请输入申请机构名称')
      }
      if (!this.mess.idCard1Picture) {
        return toast('none', '请上传身份证正面')
      }
      if (!this.mess.idCard2Picture) {
        return toast('none', '请上传身份证背面')
      }
      if (this.organType && !this.mess.orgCode) {
        return toast('none', '请输入三证合一代码/组织机构代码')
      }
      if (this.organType && !this.mess.licensePicture) {
        return toast('none', '请上传营业执照')
      }
      if (!this.agreeFlag) {
        return toast('none', '请先阅读并同意机构入驻协议')
      }
      subGroupApi({...this.mess, labels: [...this.mess.labels, ...this.selfLabels]}).then(data => {
        toast('none', '提交成功，等待管理员审核', () => {
          this.$router.back()
        })
      })
    }
  }
}
</script>

<style scoped lang='less'>
@import '../../../src/assets/style/base.less';
.createOrgan{
  padding-top: @28px;
  overflow: hidden;
  padding-bottom: @40px;
  .btns{
    margin: @28px;
    margin-bottom: @50px;
    display: flex;
    button{
      flex: 1;
      &.logOut{
        margin-right: @24px;
        background: #fff;
        color: #ff6633;
        border: 1px solid;
      }
      &.submit{
        flex: 1.8;
      }
    }
  }
  .idCardUpload{
    display: flex;
    align-items: center;
  }
  .addLabel{
    margin: @28px;
    margin-top: -@10px;
    padding: @24px;
    font-family:PingFangSC-Regular;
    font-size:@28px;
    color:#222222;
    line-height:@28px;
    border:1px solid @border;
    border-radius:@6px;
    label{
      margin-bottom: @28px;
      display: inline-block;
    }
    .input{
      display: flex;
      align-items: center;
      background:#f8f8f8;
      border-radius:@6px;
      margin-bottom: @20px;
      &:nth-child(6){
        margin-bottom: 0;
      }
      .iconfont{
        padding: @20px;
        background:#fff;
        border-top-right-radius: @6px;
        border-bottom-right-radius: @6px;
        border:1px solid #f8f8f8;
        border-left: 0;
        &:active{
          background: #f8f8f8;
        }
      }
      input{
        flex: 1;
        box-sizing:border-box;
        height:@72px;
        padding:0 @24px;
        position: relative;
        &:before, &:after{
          position: absolute;
          display: inline-block;
          top: @22px;
        }
      }
    }
    button{
      position: relative;
      border: 0;
      border-radius:@6px;
      width:100%;
      height:@72px;
      font-size:@30px;
      background: #fff;
      border: @1px solid;
      color: @red;
      line-height:@72px;
      outline: 0;
      display: flex;
      justify-content: center;
      .icon-jia{
        font-size: @36px;
        margin-right: @6px;
        position: relative;
        top: @2px;
      }
    }
    .button-hover{
      &::after{
        display: inline-block;
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        border-radius:@6px;
        background: rgba(0, 0, 0, 0.15);
      }
    }
  }
  .agreement{
    padding: @28px;
    padding-top: 0;
    display: flex;
    align-items: center;
    font-size:@24px;
    line-height:@24px;
    color:#ff6633;
    p{
      display: flex;
      span{
        color: #aaa;
      }
      i{
        position: relative;
        top: @1px;
        font-size:@34px;
        margin-right: @8px;
        color: #dedede;
        &.agreeFlag{
          color:#ff6633;
        }
      }
    }
  }
  .check-wrap{
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    // margin-top: @90px;
    width: 100%;
    min-height: @320px;
    max-height: @500px;
    padding: @30px 0 0 @30px;
    background: #f8f8f8;
    checkbox{
      display: none;
    }
    .checkerBtn{
      border-radius:@10px;
      width: 20.8%;
      height:@60px;
      line-height: @60px;
      margin: 0 @30px @30px 0;
      display: inline-block;
      .select-item {
        padding: 0;
        width: 100%;
        height:@60px;
        line-height: @60px;
        text-align: center;
        border:@1px solid #989898;
        border-radius:@8px;
        background:#ffffff;
        font-size:@24px;
        color:#979797;
        margin: 0;
        &.selected {
          background:#ff6633;
          color:#ffffff;
          border-color: #ff6633;
        }
      }
    }
  }
}
</style>
