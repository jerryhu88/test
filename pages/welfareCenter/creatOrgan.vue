<template>
  <div class="createOrgan">
    <h1 class="title">入驻平台</h1>
    <!-- <label class="label">入驻平台</label> -->
    <m-picker v-model="mess.deptID" :range='depts' placeholder="请选择入驻平台(必选)" tips='提示：申请成功后入驻平台不可修改！' :disabled='editFlag'/>
    <h1 class="title">机构信息</h1>
    <m-upload label='机构LOGO' v-model="mess.logo" :max='1' tips='提示：请上传格式为JPG/PNG，≤3M的图片（必传）' module='普惠机构'/>
    <label class="label">机构/品牌名称简称</label>
    <m-input v-model="mess.simpleName" placeholder="请输入10字以内(必填)" :max='10'/>    
    <label class="label">机构/品牌名称全称</label>
    <textarea placeholder="请输入40字以内(必填)" v-model="mess.fullName" maxlength="40" style="height:56px" :show-confirm-bar='false'/>
    <label class="label">三证合一代码/组织机构代码</label>
    <m-input v-model="mess.orgCode" placeholder="请输入(必填)" :max='18'/>
    <m-upload type='big' label='营业执照上传' v-model="mess.licensePicture" :defaultImg="require('../../assets/images/营业执照.png')" border module='普惠机构'/>
    <label class="label">经营范围</label>
    <textarea placeholder="请输入60字以内(必填)" v-model="mess.businessScope" maxlength="60" style="height:76px" :show-confirm-bar='false'/>
    <h1 class="title">负责人信息</h1>
    <label class="label">姓名</label>
    <m-input v-model="mess.chargeName" placeholder="请输入姓名(必填)" :max='8'/>
    <label class="label">手机号</label>
    <m-input v-model="mess.chargePhone" placeholder="请输入电话(必填)" :max='11'/>
    <label class="label">身份证照片</label>
    <div class="idCardUpload">
      <m-upload flex type='big' v-model="mess.idCard1Picture" :defaultImg="require('../../assets/images/身份证正面.png')" border module='普惠机构'/>
      <m-upload flex type='big' v-model="mess.idCard2Picture" :defaultImg="require('../../assets/images/身份证反面.png')" module='普惠机构'/>
    </div>
    <!-- <label class="label">验证码</label>
    <m-input v-model="mess.verifycode" placeholder="请输入(必填)" append='code' :max='6'/> -->
    <div class="select">
      <p @click="agreeFlag = !agreeFlag">
        <i class="iconfont icon-31xuanzhong" :class="{agreeFlag}"></i>
        <span>已阅读并同意</span>
      </p>
      <navigator url="../common/agreement?module=商家机构-入驻协议">《机构入驻协议》</navigator>
    </div>
    <div class="btns">
      <button v-if="editFlag" @click="logOut" class="logOut">注销机构</button>
      <button @click="submit" class="submit">提交</button>
    </div>
  </div>
</template>

<script>
import mInput from '@/components/form/mInput'
import mUpload from '@/components/form/mUpload'
import mPicker from '@/components/form/mPicker'
import {createOrganApi, getOrganDetailApi, logOutOrganApi} from '../../api/welfareCenter/index'
import {toast, confirm} from '../../constant/popup'
export default {
  data () {
    return {
      editFlag: false,
      agreeFlag: false,
      depts: [],
      deptName: '',
      showUnion: false,
      audit: false,
      mess: {
        deptID: '',
        logo: '',
        fullName: '',
        idCard1Picture: '',
        idCard2Picture: '',
        licensePicture: '',
        deptServiceID: ''
      }
    }
  },
  components: {
    mInput, mUpload, mPicker
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    if (options.edit === 'true') {
      this.editFlag = true
      // 编辑机构信息
      wx.setNavigationBarTitle({ title: '编辑机构信息' })
      this.getOrganInfo()
    }
    this.$store.dispatch('getAllDepts').then(data => {
      this.depts = data
    })
  },
  methods: {
    getOrganInfo () {
      getOrganDetailApi().then(data => {
        this.agreeFlag = true
        this.mess = data
      })
    },
    submit () {
      if (!this.mess.logo) {
        return toast('none', '请上传机构LOGO')
      }
      if (!this.mess.simpleName) {
        return toast('none', '请输入机构/品牌名称简称')
      }
      if (!this.mess.fullName) {
        return toast('none', '请输入机构/品牌名称全称')
      }
      if (!this.mess.orgCode) {
        return toast('none', '请输入三证合一代码/组织机构代码')
      }
      if (!this.mess.licensePicture) {
        return toast('none', '请上传营业执照')
      }
      if (!this.mess.businessScope) {
        return toast('none', '请输入经营范围')
      }
      if (!this.mess.chargeName) {
        return toast('none', '请输入负责人姓名')
      }
      if (!this.mess.chargePhone) {
        return toast('none', '请输入负责人手机号')
      }
      if (!this.mess.idCard1Picture) {
        return toast('none', '请上传身份证正面')
      }
      if (!this.mess.idCard2Picture) {
        return toast('none', '请上传身份证背面')
      }
      if (!this.agreeFlag) {
        return toast('none', '请先阅读并同意机构入驻协议')
      }
      // if (!this.mess.verifycode) {
      //   return toast('none', '请输入验证码')
      // }
      createOrganApi(this.mess).then(data => {
        confirm(
          '提示',
          '提交成功，等待管理员审核',
          '我知道了',
          () => {
            this.$router.back()
          }
        )
      })
    },
    logOut () {
      confirm('提示', '注销机构将清除所有机构信息且不可恢复，确认注销吗？', '确定', () => {
        logOutOrganApi().then(data => {
          toast('none', '机构已注销', () => {
            wx.reLaunch({ url: '../serviceIndex/index' })
          })
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
  padding-bottom: @40px;
  overflow: hidden;
  .title {
    font-weight: bold;
    color: #ff6633;
    padding: 0 @28px @28px;
    font-size: @32px;
  }
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
  .select{
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
}
</style>
