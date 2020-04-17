<template>
  <div class="createTicket">
    <m-upload type='small' label='活动配图' v-model="mess.pictures" :max='3' tips='提示：请上传格式为JPG/PNG，≤3M的图片，最多3张' module='兴趣机构'/>
    <label class="label">活动标题</label>
    <textarea placeholder="活动标题，40字(必填)" v-model="mess.title" maxlength="40" style="height:56px" :show-confirm-bar='false'/>
    <label class="label">活动规则/流程</label>
    <textarea placeholder="活动规则/流程" v-model="mess.rule" maxlength="9999" :show-confirm-bar='false'/>
    <label class="label">报名时间</label>
    <m-picker mode='multiSelector' :range='range' v-model="mess.applyStartTime" placeholder="请选择开始时间(必填)"/>
    <m-picker mode='multiSelector' :range='range' v-model="mess.applyEndTime" tips='注：活动报名结束时间必须大于开始时间' placeholder="请选择结束时间(必填)"/>
    <label class="label">活动时间</label>
    <m-picker mode='multiSelector' :range='range' v-model="mess.activityStartTime" placeholder="请选择开始时间(必填)"/>
    <m-picker mode='multiSelector' :range='range' v-model="mess.activityEndTime" tips='注：活动活动结束时间必须大于开始时间' placeholder="请选择结束时间(必填)"/>
    <label class="label">兴趣活动标签</label>
    <input @click="show = true" v-model="labels" placeholder="点击选择兴趣活动标签" class="select" disabled>
    <div>
      <label class="label">活动人数</label>
      <m-input v-model="mess.applyTotal" placeholder="请输入活动人数(必填)" :max='6'/>
    </div>
    <label class="label">活动地址</label>
    <input @click="selectAddress" v-model="mess.fullAddress" placeholder="点击选择活动地址" class="select" disabled>
    <m-upload uploadType='attachment' border type='small' label='活动附件' v-model="mess.attachment" :max='3' module='兴趣机构' noMust/>
    <div class="btns">
      <button @click="submit">{{serviceID ? '提交' : '发布'}}活动</button>
    </div>
    <!-- 兴趣标签弹窗 -->
    <m-popup v-model="show" showNav title='兴趣标签(最多3个)' :radius='false'>
      <ul class="check-wrap">
        <li class="checkerBtn" @click="selectLabel(label, i)" v-for="(label, i) in defLabels" :key="i">
          <button
          class="select-item"
          :class="{selected:label.checked}"
          hover-class='hover'>{{label.name}}</button>
        </li>
      </ul>
    </m-popup>
  </div>
</template>

<script>
import mInput from '../../../components/form/mInput'
import mUpload from '../../../components/form/mUpload'
import mPicker from '../../../components/form/mPicker'
import mPopup from '../../../components/view/mPopup'
import {defData} from '../../../constant'
import {getActivityLabelApi, sbumitActivityApi, getActDetailApi} from '../../../api/interest/index'
import { toast } from '../../../constant/popup'
export default {
  data () {
    return {
      defLabels: [],
      labels: [],
      range: defData.dateTime,
      show: false,
      mess: {
        attachment: [],
        labels: [],
        pictures: [],
        title: '',
        rule: '',
        applyStartTime: '',
        applyEndTime: '',
        activityStartTime: '',
        activityEndTime: '',
        applyTotal: ''
      },
      serviceID: '',
      stores: [],
      copy: false,
      edit: false
    }
  },
  components: {
    mPopup, mInput, mUpload, mPicker
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    this.edit = options.edit === 'true'
    this.copy = options.copy === 'true'
    this.serviceID = options.serviceID
    if (this.edit || this.copy) {
      wx.setNavigationBarTitle({
        title: '编辑活动'
      })
    }
    // 获取标签
    this.getActivityLabel()
  },
  methods: {
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
    // 获取详情
    getActDetail () {
      getActDetailApi(this.serviceID).then(data => {
        this.mess = data
        this.mess.attachment = JSON.parse(data.attachment)
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
        // // 重发清除serviceID才是发新的一条
        // if (this.copy) {
        //   this.mess.serviceID = ''
        // }
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
        if (this.edit) {
          this.getActDetail()
        }
      })
    },
    selectLabel (label, labelI) {
      // 选中了3个再点击没被选中的，则不可选
      if (this.mess.labels.length === 3 && !label.checked) return
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
    submit () {
      if (!this.mess.pictures) {
        return toast('none', '请上传活动配图')
      }
      if (!this.mess.title) {
        return toast('none', '请输入活动标题')
      }
      if (!this.mess.rule) {
        return toast('none', '请输入活动规则/流程')
      }
      if (!this.mess.applyStartTime) {
        return toast('none', '请选择报名开始时间')
      }
      if (!this.mess.applyEndTime) {
        return toast('none', '请选择报名结束时间')
      }
      if (this.mess.applyEndTime < this.mess.applyStartTime) {
        return toast('none', '报名结束时间需＞报名开始时间')
      }
      if (!this.mess.activityStartTime) {
        return toast('none', '请选择活动开始时间')
      }
      if (this.mess.activityStartTime < this.mess.applyStartTime) {
        return toast('none', '活动开始时间需＞报名开始时间')
      }
      if (!this.mess.activityEndTime) {
        return toast('none', '请选择活动结束时间')
      }
      if (this.mess.activityEndTime < this.mess.activityStartTime) {
        return toast('none', '活动结束时间需＞活动开始时间')
      }
      if (!this.mess.labels.length) {
        return toast('none', '请选择兴趣活动标签')
      }
      if (!this.mess.applyTotal) {
        return toast('none', '请输入活动人数')
      }
      if (!this.mess.fullAddress) {
        return toast('none', '请选择活动地址')
      }
      sbumitActivityApi(this.mess).then(data => {
        let tips = '提交成功，等待审核'
        if (this.edit) {
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
  padding-top: @28px;
  .btns{
    display: flex;
    padding: @30px;
    padding-bottom: @40px;
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
</style>
