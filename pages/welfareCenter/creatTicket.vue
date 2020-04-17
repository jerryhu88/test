<template>
  <div class="createTicket">
    <m-upload type='small' label='配图' v-model="mess.boonPictures" :max='20' tips='提示：请上传格式为JPG/PNG，≤3M的图片，最多20张' module='普惠机构'/>
    <label class="label">福利券名称</label>
    <textarea placeholder="福利券名称，40字(必填)" v-model="mess.boonName" maxlength="40" style="height:56px" :show-confirm-bar='false'/>
    <label class="label">福利券描述</label>
    <textarea placeholder="福利券描述，100字(必填)" v-model="mess.description" maxlength="100" style="height:96px" :show-confirm-bar='false'/>
    <label class="label">福利券原价</label>
    <m-input type='digit' v-model="mess.oldPrice" placeholder="请输入(必填)" append='元'/>
    <label class="label">福利券类型</label>
    <m-select :type="radio" :options="tickets" @select="selectRadio" v-model="mess.type"/>
    <!-- 折扣券 -->
    <div class="ticketType" v-if="mess.type === 2">
      <label for="">折扣券设置</label>
      <div class="input" :key="i">
        <input v-model.number="boonUseDetails[0].rebate" class="sale" type="number" placeholder='请输入折扣数(如：8.8)' maxlength="3">
      </div>
      <div class="switch ticktSwitch">
        <label for="">是否设置使用条件</label>
        <switch :checked="boonUseDetails[0].useLimit" @change="setOption" color='#ff6633'/>
      </div>
      <input v-if="boonUseDetails[0].useLimit" v-model.number="boonUseDetails[0].reachSum" class="full" type="digit" placeholder='请输入'>
    </div>
    <!-- 代金券 -->
    <div class="ticketType cash" v-if="mess.type === 3">
      <label for="">抵扣金额设置</label>
      <input v-model.number="boonUseDetails[0].reachSum" class="replace" type="number" placeholder='请输入'>
    </div>
    <!-- 满减券 -->
    <div class="ticketType" v-if="mess.type === 4">
      <label for="">满减金额设置</label>
      <div class="input" v-for="(item, i) in boonUseDetails" :key="i">
        <input v-model.number="item.reachSum" class="full" type="number" placeholder='请输入'>
        <input v-model.number="item.reduceNum" class="reduce" type="number" placeholder='请输入'>
        <i @click="delFullReduce(i)" class="iconfont icon-delete"></i>
      </div>
      <button hover-class="button-hover" @click="addFullReduce" v-if="boonUseDetails.length < 5">
        <i class="iconfont icon-jia"></i>
        <span>添加</span>
      </button>
    </div>
    <label class="label">福利券数量</label>
    <m-input type='number' v-model.number="mess.total" placeholder="请输入(必填)" append='张'/>
    <!-- 福利标签 -->
    <label class="label">福利标签</label>
    <input @click="show = true" v-model="boonLabels" placeholder="点击选择福利标签" class="select" disabled>
    <label class="label">人均限购</label>
    <m-input type='number' v-model.number="mess.limitNumber" placeholder="请输入(必填)" append='张'/>
    <div class="switch reUse" v-if="mess.limitNumber >= 2">
      <label>是否可以叠加使用</label>
      <switch :checked="overlap" @click="switchOverlap" color='#ff6633'/>
    </div>
    <m-input @input='inputOverlap' v-if="mess.limitNumber >= 2 && overlap" type='number' v-model="mess.overlapNum" placeholder="最多可叠加张数，需≤人均限购数" append='张'/>
    <label class="label">售出期限</label>
    <m-picker mode='multiSelector' :range='range' v-model="mess.sellStartTime" placeholder="请选择开始时间(必填)"/>
    <m-picker mode='multiSelector' :range='range' v-model="mess.sellEndTime" tips='注：福利券兑换结束时间必须大于开始时间' placeholder="请选择结束时间(必填)"/>
    <label class="label">使用期限</label>
    <m-picker mode='multiSelector' :range='range' v-model="mess.indateStartTime" placeholder="请选择开始时间(必填)"/>
    <m-picker mode='multiSelector' :range='range' v-model="mess.indateEndTime" tips='注：福利券使用期限结束时间必须大于开始时间' placeholder="请选择结束时间(必填)"/>
    <label class="label">可使用门店</label>
    <m-select type="checkbox" :options="stores" v-model="branchStores" showSlectAll/>
    <label class="label noMust">使用规则</label>
    <textarea placeholder="请输入使用规则(必填)" v-model="mess.rule" :show-confirm-bar='false'/>
    <div class="btns">
      <button @click="submit">提交</button>
    </div>
    <!-- 福利标签弹窗 -->
    <m-popup v-model="show" showClose title='福利标签(最多3个)'>
      <ul class="check-wrap">
        <li class="checkerBtn" v-for="(item, index) in ticketKind" :key="index">
          <h1>{{item.labelName}}</h1>
          <div class="boonLabels">
            <button
            @click="selectLabel(tag, index, i)"
            v-for="(tag, i) in item.children"
            :key="i"
            class="select-item"
            :class="{selected:tag.checked}"
            hover-class='hover'>{{tag.labelName}}</button>
          </div>
        </li>
      </ul>
    </m-popup>
  </div>
</template>

<script>
import bus from '../../constant/bus'
import mInput from '../../components/form/mInput'
import mSelect from '../../components/form/mSelect'
import mButton from '../../components/form/mButton'
import mUpload from '../../components/form/mUpload'
import mPicker from '../../components/form/mPicker'
import mPopup from '../../components/view/mPopup'
import {defData} from '../../constant'
import {getWelfareTabsApi, creatTicketApi, getTicketDetailApi} from '../../api/welfareCenter/index'
import { toast, alert } from '../../constant/popup'
// import {getWelfareTabsApi, getTicketDetailApi} from '../../api/welfareCenter/index'
// import { toast } from '../../constant/popup'
const reduceTypes = {
  reachSum: '', // 满减数
  reduceNum: '', // 满减金额
  useLimit: '', // 使用条件0无1有
  rebate: '' // 折扣
}
export default {
  data () {
    return {
      branchStores: [],
      range: defData.dateTime,
      show: false,
      boonLabels: [],
      ticketKind: [],
      overlap: false,
      boonUseDetails: [reduceTypes],
      mess: {
        boonPictures: [],
        boonName: '',
        description: '',
        oldPrice: '',
        type: 1,
        total: '',
        boonLabels: [],
        limitNumber: '',
        overlapNum: '',
        sellStartTime: '',
        sellEndTime: '',
        indateStartTime: '',
        indateEndTime: '',
        branchStores: [],
        rule: ''
      },
      tickets: [
        {name: '兑换券', value: 1, checked: true},
        {name: '折扣券', value: 2},
        {name: '代金券', value: 3},
        {name: '满减券', value: 4}
      ],
      serviceID: '',
      stores: []
    }
  },
  components: {
    mPopup, mInput, mButton, mUpload, mPicker, mSelect
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    this.handelType = options.handelType
    this.serviceID = options.serviceID
    this.putaway = options.putaway
    if (this.handelType === 'edit') {
      wx.setNavigationBarTitle({
        title: '编辑福利券'
      })
    }
    // 获取福利标签
    this.getWelfareTabs()
    // 获取已有门店
    this.getSubbranch()
  },
  methods: {
    // 获取门店
    getSubbranch () {
      this.$store.dispatch('getSubbranch').then(data => {
        data.map(item => {
          this.stores.push({
            name: item.simpleName,
            value: item.serviceID,
            checked: false
          })
        })
      })
    },
    // 获取详情
    getTicketDetail () {
      getTicketDetailApi(this.serviceID, this.putaway).then(data => {
        // 图片
        this.mess = data
        this.overlap = Boolean(data.overlapUse)
        // 复制并发布需要删除原来福利券id
        if (this.handelType === 'copy') {
          this.mess.serviceID = ''
        }
        // 门店
        this.stores.map(item => {
          data.branchStores.map(branch => {
            if (item.value === branch.serviceID) {
              item.checked = true
            }
          })
        })
        this.branchStores = data.branchStores.map(item => {
          return {serviceID: item.serviceID}
        })
        // 使用详情
        this.boonUseDetails = JSON.parse(this.mess.boonUseDetails)
        // 标签
        this.ticketKind.map(parent => {
          parent.children.map(kind => {
            data.boonLabels.map(label => {
              if (kind.serviceID === label.serviceID) {
                kind.checked = true
                this.boonLabels.push(kind.labelName)
              }
            })
          })
        })
        this.boonLabels = this.boonLabels.join('、')
      })
    },
    // 是否叠加使用
    switchOverlap () {
      this.overlap = !this.overlap
      this.mess.overlapNum = ''
    },
    setOption () {
      this.boonUseDetails[0].useLimit = !this.boonUseDetails[0].useLimit
      this.boonUseDetails[0].reachSum = ''
    },
    // 切换福利券类型
    selectRadio () {
      this.boonUseDetails = [JSON.parse(JSON.stringify(reduceTypes))]
    },
    // 获取福利标签
    getWelfareTabs () {
      getWelfareTabsApi().then(data => {
        this.ticketKind = data
        // 获取详情
        if (['edit', 'copy'].includes(this.handelType)) {
          this.getTicketDetail()
        }
      })
    },
    selectLabel (selectTag, parentI, kindI) {
      // 选中了3个再点击没被选中的，则不可选
      if (this.mess.boonLabels.length === 3 && !selectTag.checked) return
      // 点击未选中的选中，未被选中的选中
      this.ticketKind.map((kind, index) => {
        if (index === parentI) {
          kind.children.map((tag, i) => {
            if (i === kindI) {
              tag.checked = !tag.checked
            }
          })
        }
      })
      this.boonLabels = [] // 清空
      this.mess.boonLabels = []
      // 把选中的放入boonLabels
      this.ticketKind.map(kind => {
        kind.children.map(tag => {
          if (tag.checked) {
            this.boonLabels.push(tag.labelName)
            let id = tag.serviceID
            this.mess.boonLabels.push({...tag, labelServicecID: id})
          }
        })
      })
      this.boonLabels = this.boonLabels.join('、')
    },
    addFullReduce () {
      this.boonUseDetails.push(JSON.parse(JSON.stringify(reduceTypes)))
    },
    delFullReduce (i) {
      if (this.boonUseDetails.length === 1) {
        return toast('none', '至少保留一个哦')
      }
      this.boonUseDetails.splice(i, 1)
    },
    // 限制叠加数小于等于人均限购数
    inputOverlap () {
      if (Number(this.mess.overlapNum) > Number(this.mess.limitNumber)) {
        this.mess.overlapNum = this.mess.limitNumber
      }
    },
    submit () {
      let type = Number(this.mess.type)
      if (!this.mess.boonPictures) {
        return toast('none', '请上传福利券配图')
      }
      if (!this.mess.boonName) {
        return toast('none', '请输入福利券名称')
      }
      if (!this.mess.description) {
        return toast('none', '请输入福利券描述')
      }
      if (!this.mess.oldPrice) {
        return toast('none', '请输入福利券原价')
      }
      let rebate = this.boonUseDetails[0].rebate
      let reachSum = this.boonUseDetails[0].reachSum
      // 折扣券
      if (type === 2) {
        if (!rebate) {
          return toast('none', '请填写折扣数')
        } else if ((rebate.includes('.') && rebate.length === 2) || (!rebate.includes('.') && rebate.length === 3)) {
          return toast('none', '请按要求填写折扣数')
        }
        if (this.boonUseDetails[0].useLimit && !this.boonUseDetails[0].reachSum) {
          return toast('none', '请填写折扣券使用条件')
        }
      }
      // 代金券
      if (type === 3 && !reachSum) {
        return toast('none', '请填写代金券抵扣金额')
      }
      // 满减券
      if (type === 4) {
        let flag = true
        this.boonUseDetails.map(item => {
          if (!(item.reachSum && item.reduceNum)) {
            flag = false
          }
        })
        if (!flag) {
          return toast('none', '请将满减金额填写完整')
        } else {
          this.mess.boonUseDetails = JSON.stringify(this.boonUseDetails)
        }
      } else {
        this.mess.boonUseDetails = JSON.stringify([{...this.boonUseDetails[0], useLimit: this.boonUseDetails[0].useLimit ? 1 : 0}])
      }
      if (!this.mess.total) {
        return toast('none', '请填写福利券数量')
      }
      if (!this.boonLabels.length) {
        return toast('none', '请选择福利标签')
      }
      if (!this.mess.limitNumber) {
        return toast('none', '请填写人均限购数量')
      } else if (this.overlap && !this.mess.overlapNum) {
        return toast('none', '请填写可叠加数量')
      }
      if (!this.mess.sellStartTime) {
        return toast('none', '请选择售出开始时间')
      }
      if (!this.mess.sellEndTime) {
        return toast('none', '请选择售出结束时间')
      }
      if (this.mess.sellEndTime < this.mess.sellStartTime) {
        return toast('none', '售出结束时间需大于售出开始时间')
      }
      if (!this.mess.indateStartTime) {
        return toast('none', '请选择开始使用期限')
      }
      if (this.mess.indateStartTime < this.mess.sellStartTime) {
        return toast('none', '开始使用期限需大于售出开始时间')
      }
      if (!this.mess.indateEndTime) {
        return toast('none', '请选择结束使用期限')
      }
      if (this.mess.indateEndTime < this.mess.indateStartTime) {
        return toast('none', '结束使用期限需大于开始使用期限需 ')
      }
      if (!this.branchStores.length) {
        return toast('none', '请选择可使用门店')
      }
      if (!this.mess.rule) {
        return toast('none', '请填写使用规则')
      }
      this.mess.overlapUse = this.overlap ? 1 : 0
      this.mess.branchStores = []
      this.branchStores.map(item => {
        if (item.serviceID) {
          this.mess.branchStores.push(item)
        } else {
          this.mess.branchStores.push({serviceID: item})
        }
      })
      console.log(this.mess)
      creatTicketApi(this.mess).then(data => {
        if (this.handelType === 'edit') {
          alert(
            '提交成功！',
            '审批通过前，原数据不变',
            '我知道了',
            () => {
              bus.$emit('firstPage')
              wx.navigateBack({
                delta: 1
              })
            }
          )
        } else {
          toast('none', '提交成功，等待审核', () => {
            bus.$emit('firstPage')
            wx.navigateBack({
              delta: 1
            })
          })
        }
      })
    }
  }
}
</script>

<style scoped lang='less'>
@import '../../../src/assets/style/base.less';
.createTicket{
  padding-top: @28px;
  .ticketType{
    margin: @28px;
    margin-top: 0;
    padding: @24px;
    font-family:PingFangSC-Regular;
    font-size:@28px;
    color:#222222;
    line-height:@28px;
    border:1px solid @border;
    border-radius:@6px;
    &.cash{
      padding-bottom: 0;
    }
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
      }
    }
    .input>input, .full, .replace{
      box-sizing:border-box;
      height:@72px;
      padding:0 @64px;
      position: relative;
      &:before, &:after{
        position: absolute;
        display: inline-block;
        top: @22px;
      }
      &.full:before{
        content: '满';
        left: @20px;
      }
      &.reduce:before{
        content: '减';
        left: @20px;
      }
      &.full:after, &.reduce:after{
        content: '元';
        right: @20px;
      }
      &.sale{
        border-top-right-radius: @6px;
        border-bottom-right-radius: @6px;
        width: 100%;
        padding-left: @20px;
      }
      &.sale:after{
        content: '折';
        right: 0;
        top: 0;
        padding: @20px;
      }
    }
    .ticktSwitch{
      padding: 0;
      label{
        margin-bottom: 0;
      }
    }
    .ticktSwitch+.full{
      margin-top: @28px;
      background: #f8f8f8;
      padding-right: @140px;
      border-radius: @6px;
      &.full:after{
        content: '元可使用';
      }
    }
    .replace{
      padding-left: @20px;
      background: #f8f8f8;
      border-radius: @6px;
      margin-bottom: @28px;
      &:after{
        content: '元';
        right: @20px;
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
  .switch{
    display: flex;
    align-items: center;
    padding: 0 @28px;
    padding-bottom: @28px;
    position: relative;
    label{
      flex: 1;
      font-size:@28px;
      color:#222222;
      line-height:@28px;
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
    min-height: @300px;
    max-height: 50vh;
    padding: @30px;
    padding-top: 0;
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
