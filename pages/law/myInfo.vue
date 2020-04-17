<template>
  <div class="myInfo">
    <label class="label">本人是否是工会签约律师</label>
    <m-select type="radio" v-model='mess.isLawer' :options="options"/>
    <label class="label">手机号码</label>
    <m-input disabled v-model="mess.phone" placeholder="请输入11字以内(必填)" :max='11'/>    
    <label class="label">姓名</label>
    <m-input disabled v-model="mess.uname" placeholder="请输入10字以内(必填)" :max='10'/>    
    <div v-if="mess.isLawer === 1">
      <label class="label">擅长</label>
      <m-select type="checkbox" v-model='mess.labels' :options="defLabels"/>
      <label class="label">律师简介</label>
      <textarea placeholder="请输入(必填)" v-model="mess.intro" maxlength="999" style="height:76px" :show-confirm-bar='false'/>
      <label class="label">服务范围</label>
      <textarea placeholder="请输入(必填)" v-model="mess.disposeScope" maxlength="999" style="height:76px" :show-confirm-bar='false'/>
    </div>
    <button @click="submit" radius='radius'>提交</button>
  </div>
</template>

<script>
import mInput from '@/components/form/mInput'
import mSelect from '@/components/form/mSelect'
import {getLawLabelApi, subMyInfoApi, getMyInfoApi} from '../../api/law/index'
import {toast} from '../../constant/popup'
export default {
  data () {
    return {
      options: [
        {name: '是', value: 1},
        {name: '否', value: 2}
      ],
      defLabels: [
        {name: '', value: ''}
      ],
      mess: {
        isLawer: 2,
        phone: '',
        uname: '',
        labels: [],
        intro: '',
        disposeScope: ''
      }
    }
  },
  components: {
    mInput, mSelect
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    this.getLawLabel()
  },
  methods: {
    getLawLabel () {
      getLawLabelApi().then(data => {
        this.defLabels = data.map(item => {
          return {
            name: item.labelName,
            value: item.lawLabelID,
            checked: false
          }
        })
        this.getMyInfo()
      })
    },
    getMyInfo () {
      getMyInfoApi().then(data => {
        this.mess = data
        this.defLabels.map(item => {
          data.labels.map(label => {
            if (label.lawLabelID === item.value) {
              item.checked = true
            }
          })
        })
      })
    },
    submit () {
      let labels = []
      if (this.mess.isLawer === 1) {
        if (!this.mess.labels.length) {
          return toast('none', '请选择擅长标签')
        }
        if (!this.mess.intro) {
          return toast('none', '请输入律师简介')
        }
        if (!this.mess.disposeScope) {
          return toast('none', '请输入服务范围')
        }
        labels = this.mess.labels.map((item) => {
          if (item.serviceID) {
            return item
          } else {
            return {lawLabelID: item}
          }
        })
      }
      subMyInfoApi({...this.mess, labels}).then(data => {
        toast('none', '修改成功')
      })
    }
  }
}
</script>

<style scoped lang='less'>
@import '../../../src/assets/style/base.less';
.myInfo{
  overflow: hidden;
  button{
    margin: @28px;
    margin-bottom: @50px;
    width: calc(~'100% - '@56px);
  }
}
</style>
