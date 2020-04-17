<template>
  <div class="createOrgan">
    <m-upload label='机构LOGO' v-model="mess.logo" :max='1' tips='提示：请上传格式为JPG/PNG，≤3M的图片（必传）' module='婚恋机构'/>
    <label class="label">机构/品牌名称简称</label>
    <m-input v-model="mess.nameSimple" placeholder="请输入10字以内(必填)" :max='10'/>    
    <label class="label">机构/品牌名称全称</label>
    <textarea placeholder="请输入40字以内(必填)" v-model="mess.nameFull" maxlength="40" style="height:56px" :show-confirm-bar='false'/>
    <!-- <label class="label">所属公众号</label>
    <m-picker v-model="mess.rootID" :range='depts' placeholder="请选择注册到哪个平台(必选)"/> -->
    <label class="label">负责人信息</label>
    <m-input v-model="mess.chargePerson" placeholder="请输入姓名(必填)" :max='8'/>
    <m-input v-model="mess.phone" placeholder="请输入电话(必填)" :max='11'/>
    <m-upload type='big' label='身份证上传' v-model="mess.idCard1Picture" :defaultImg="require('../../assets/images/身份证正面.png')" border module='婚恋机构'/>
    <m-upload type='big' v-model="mess.idCard2Picture" :defaultImg="require('../../assets/images/身份证反面.png')" module='婚恋机构'/>
    <label class="label">三证合一代码/组织机构代码</label>
    <m-input v-model="mess.orgCode" placeholder="请输入(必填)" :max='18'/>
    <m-upload type='big' label='营业执照上传' v-model="mess.licensePicture" :defaultImg="require('../../assets/images/营业执照.png')" border module='婚恋机构'/>
    <label class="label">经营范围</label>
    <textarea placeholder="请输入60字以内(必填)" v-model="mess.businessScope" maxlength="60" style="height:76px" :show-confirm-bar='false'/>
    <!-- <label class="label">验证码</label>
    <m-input v-model="mess.verifycode" placeholder="请输入(必填)" append='code' :max='6'/> -->
    <div class="select">
      <i class="iconfont icon-31xuanzhong"></i>
      <span>提交即代表已阅读并同意</span>
      <navigator url="../common/agreement?module=婚恋机构-入驻协议">《机构入驻协议》</navigator>
    </div>
    <m-button @click="submit" radius='radius'>提交</m-button>
  </div>
</template>

<script>
import mInput from '@/components/form/mInput'
import mButton from '@/components/form/mButton'
import mUpload from '@/components/form/mUpload'
import mPicker from '@/components/form/mPicker'
import {createOrganApi, getOrganIndexInfoApi} from '../../api/love/index'
import {toast} from '../../constant/popup'
export default {
  data () {
    return {
      deptName: '',
      showUnion: false,
      audit: false,
      mess: {
        logo: '',
        nameFull: '',
        idCard1Picture: '',
        idCard2Picture: '',
        licensePicture: ''
      },
      depts: []
    }
  },
  components: {
    mInput, mButton, mUpload, mPicker
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    if (options.edit === 'true') {
      // 编辑机构信息
      wx.setNavigationBarTitle({ title: '编辑机构信息' })
      this.getOrganInfo()
    }
  },
  methods: {
    getOrganInfo () {
      getOrganIndexInfoApi().then(data => {
        this.mess = data
      })
    },
    submit () {
      if (!this.mess.logo) {
        return toast('none', '请上传机构LOGO')
      }
      if (!this.mess.nameSimple) {
        return toast('none', '请输入机构/品牌名称简称')
      }
      if (!this.mess.nameFull) {
        return toast('none', '请输入机构/品牌名称全称')
      }
      if (!this.mess.chargePerson) {
        return toast('none', '请输入负责人姓名')
      }
      if (!this.mess.phone) {
        return toast('none', '请输入负责人手机号')
      }
      if (!this.mess.idCard1Picture) {
        return toast('none', '请上传身份证正面')
      }
      if (!this.mess.idCard2Picture) {
        return toast('none', '请上传身份证背面')
      }
      if (!this.mess.orgCode) {
        return toast('none', '请输入三证合一代码/组织机构代码')
      }
      if (!this.mess.businessScope) {
        return toast('none', '请输入经营范围')
      }
      // if (!this.mess.verifycode) {
      //   return toast('none', '请输入验证码')
      // }
      createOrganApi(this.mess).then(data => {
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
  overflow: hidden;
  /deep/button{
    margin: @28px;
    margin-bottom: @50px;
    width: calc(~'100% - '@56px);
  }
  .select{
    padding: @28px;
    padding-top: 0;
    display: flex;
    align-items: center;
    font-size:@24px;
    line-height:@24px;
    color:#ff6633;
    span{
      color: #aaa;
    }
    i{
      position: relative;
      top: @1px;
      font-size:@34px;
      margin-right: @8px;
    }
  }
  .btns{
    display: flex;
    padding: @30px;
    /deep/.redBorder{
      margin-right: @24px;
      width: 70%;
    }
  }
}
</style>
