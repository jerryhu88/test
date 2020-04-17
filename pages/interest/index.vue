<template>
  <div class="home-page">
    <div v-if="audit === 2 || audit === 4" class="organIndex">
      <div class="banner" @click="openAlbum">
        <swiper v-if="pictures.length" indicator-color='#fff' indicator-active-color='#ff6633' :indicator-dots="true" :interval="2000" :duration="500" :circular='true'>
          <swiper-item v-for="(item, i) in pictures" :key="i">
            <img mode='aspectFill' :src="item.fileHostName + item.url" alt="">
          </swiper-item>
        </swiper>
        <mNoData v-else msg="上传小组配图"/>
      </div>
      <div class="info">
        <img mode="aspectFill" v-if="organInfo.logo" :src="organInfo.fileHostName + organInfo.logo" alt="">
        <div>
          <h1>{{organInfo.groupName}}</h1>
          <star :star='organInfo.staring'/>
        </div>
        <button v-if="audit === 2" @click="$router.push('./creatOrgan?edit=true')">编辑</button>
      </div>
      <div class="btns">
        <button @click="getActivityLabel">
          <div>
            <img src="../../assets/images/label.png" alt="">
            <h1>管理兴趣标签</h1>
          </div>
          <p>{{myLabel}}</p>
        </button>
        <button @click="$router.push('./activity/list')">
          <div>
            <img src="../../assets/images/activity.png" alt="">
            <h1>查看小组活动</h1>
          </div>
          <p>{{organInfo.activityNum}}发布</p>
        </button>
        <button @click="$router.push('./uploadAlbum')">
          <div>
            <img src="../../assets/images/album.png" alt="">
            <h1>查看小组相册</h1>
          </div>
          <p>{{organInfo.photoNum}}上传</p>
        </button>
        <button @click="$router.push('./nameList')">
          <div>
            <img src="../../assets/images/fans.png" alt="">
            <h1>查看小组粉丝</h1>
          </div>
          <p>{{organInfo.fansNum}}关注</p>
        </button>
      </div>
      <ul class="lists" :class="audit === 4 ? 'adminList' : 'createrList'" :key="index">
        <m-cell v-for="(item, i) in lists"
        :show='audit === 2 || item.admin === audit'
        :title='item.title'
        @click="toUrl(item.url)"
        :icon="item.icon"
        :color='item.color'
        :prompt='item.prompt'
        :key="i"/>
      </ul>
    </div>
    <!-- 审批中机构 -->
    <div v-if="audit === 1" class="audit">
      <img class="bg" src="../../assets/images/audit.png">
      <p>机构审批中，请您耐心等待…</p>
    </div>
    <!-- 没有机构 -->
    <mNoData v-if="audit === 0" msg="你还未创建兴趣小组" btnText='前往申请' @click="$router.replace(`./creatOrgan?groupType=${groupType}`)"></mNoData>
    <!-- 兴趣标签弹窗 -->
    <m-popup v-model="show" showNav title='兴趣标签(最多3个)' :radius='false' @onConfirm='updateLabel' :autoClose='false'>
      <ul class="check-wrap">
        <li class="checkerBtn" @click="selectLabel(label, i)" v-for="(label, i) in allLabels" :key="i">
          <button
          class="select-item"
          :class="{selected:label.checked}"
          hover-class='hover'>{{label.name}}</button>
        </li>
      </ul>
    </m-popup>
    <!-- 小组弹窗 -->
    <m-popup v-model="showPic" showClose title='兴趣小组配图'>
      <div class="uploadPic">
        <m-upload v-model="pics" :max='3' tips='提示：请上传JPG/PNG/JPEG格式的图片，最多上传3张，用于在兴趣部落列表中展示' module='兴趣机构'/>
        <button @click='uploadPic'>提交</button>
      </div>
    </m-popup>
  </div>
</template>

<script>
import star from '../../components/form/star'
import mNoData from '../../components/prompt/mNoData'
import mCell from '../../components/form/mCell'
import mBadge from '../../components/prompt/mBadge'
import { confirm, toast } from '../../constant/popup'
import mPopup from '../../components/view/mPopup'
import mUpload from '@/components/form/mUpload'
import {getGroupDetailApi, getActivityLabelApi, subGroupHeadApi, updateLabelApi, loginOutGroupApi} from '../../api/interest/index'

export default {
  data () {
    return {
      myLabel: '',
      groupLabels: [],
      selectedLabels: [],
      pictures: [],
      pics: [],
      showPic: false,
      show: false,
      groupType: 0,
      audit: 2,
      labels: [],
      organInfo: {},
      allLabels: [],
      lists: [
        {
          title: '小组管理员',
          icon: 'icon-guanliyuan',
          color: '#dcac6e',
          url: 'admin',
          admin: 2
        },
        // {
        //   title: '小组转让',
        //   icon: 'icon-zhuanrang',
        //   color: '#dcac6e',
        //   url: 'admin'
        // },
        // {
        //   title: '小组注销',
        //   icon: 'icon-zhuxiao',
        //   color: '#b08eee',
        //   url: 'writeOff',
        //   admin: 2
        // },
        {
          title: '使用手册',
          icon: 'icon-icon_manual',
          color: '#45cab6',
          url: '../common/help?module=兴趣机构-使用手册',
          admin: 4
        }
      ]
    }
  },
  components: {
    mNoData,
    mCell,
    mBadge,
    mPopup,
    star,
    mUpload
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    this.groupType = options.groupType
    this.audit = Number(options.audit)
    let title = `${Number(options.groupType) === 1 ? '个人' : '机构'}兴趣小组`
    if (this.audit === 4) {
      title += ' (管理员)'
    }
    wx.setNavigationBarTitle({ title })
  },
  onShow () {
    if ((this.audit === 2 || this.audit === 4) && !this.showPic) {
      this.getOrganInfo()
    }
  },
  methods: {
    // 上传配图
    uploadPic () {
      subGroupHeadApi(this.pics).then(data => {
        toast('success', '上传成功')
        this.getOrganInfo()
        this.showPic = false
      })
    },
    openAlbum () {
      this.pics = JSON.parse(JSON.stringify(this.pictures))
      this.showPic = true
    },
    updateLabel () {
      if (!this.groupLabels.length) {
        return toast('none', '请至少选择一个标签')
      }
      updateLabelApi(this.groupLabels).then(data => {
        toast('success', '修改成功')
        this.getOrganInfo()
        this.show = false
      })
    },
    // 获取标签
    getActivityLabel () {
      getActivityLabelApi().then(data => {
        this.allLabels = []
        data.map(item => {
          let checked = false
          this.organInfo.labels.map(label => {
            if (item.labelName === label.labelName) {
              checked = true
            }
          })
          this.allLabels.push({
            name: item.labelName,
            checked,
            interestLabelID: item.interestLabelID
          })
        })
        this.show = true
      })
    },
    selectLabel (label, labelI) {
      // 选中了3个再点击没被选中的，则不可选
      if (this.selectedLabels.length === 3 && !label.checked) return
      // 点击未选中的选中，未被选中的选中
      this.allLabels.map((tag, i) => {
        if (i === labelI) {
          tag.checked = !tag.checked
        }
      })
      this.groupLabels = []
      this.selectedLabels = [] // 清空
      // 把选中的放入labels
      this.allLabels.map(tag => {
        if (tag.checked) {
          this.groupLabels.push(tag)
          this.selectedLabels.push(tag.name)
        }
      })
    },
    getOrganInfo () {
      getGroupDetailApi().then(data => {
        this.organInfo = data
        this.pictures = JSON.parse(JSON.stringify(data.pictures))
        this.pics = JSON.parse(JSON.stringify(data.pictures))
        this.selectedLabels = []
        data.labels.map((item, i) => {
          this.selectedLabels.push(item.labelName)
        })
        this.myLabel = this.selectedLabels.join('、')
      })
    },
    toUrl (url) {
      switch (url) {
        case 'turn':
          wx.showShareMenu({
            withShareTicket: true
          })
          return
        case 'organGrade':
          wx.navigateTo({ url: `./organGrade?serviceID=${this.organInfo.serviceID}` })
          return
        case 'admin':
          wx.navigateTo({ url: `../common/admin?type=interest` })
          return
        case 'writeOff':
          confirm('提示', '注销机构后无法撤销，确认注销吗？', '确定', () => {
            loginOutGroupApi().then(data => {
              wx.reLaunch({ url: '../serviceIndex/index' })
            })
          })
          return
        default:
          wx.navigateTo({ url })
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import '../../../src/assets/style/base.less';
.home-page {
  min-height: 100vh;
  background: #f8f8f8;
  .banner{
    padding: @32px @32px 0 @32px;
    background: #fff;
    swiper{
      width: 100%;
      height: @390px;
      image{
        border-radius: @8px;
        width: 100%;
        height: 100%;
      }
    }
  }
  .info{
    display: flex;
    align-items: center;
    padding: @28px @32px;
    background: #fff;
    img{
      width: @80px;
      height: @80px;
      border-radius: 50%;
      margin-right: @18px;
    }
    div{
      flex: 1;
      h1{
        font-size: @32px;
        color: #000;
        font-weight: bold;
        margin-bottom: @6px;
      }
    }
    button{
      width: @100px;
      height: @50px;
      line-height: @50px;
      border-radius: @100px;
      border: 1px solid;
      background: #fff;
      color: #ff6633;
      font-size: @26px;
      padding: 0;
    }
    /deep/.icon-off{
      color: #ddd;
    }
  }
  .btns{
    background: #fff;
    padding: 0 @32px;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: @24px;
    padding-bottom: @28px;
    button{
      width: 48%;
      background: #f9f9f9;
      flex-direction: column;
      align-items: flex-start;
      height: @120px;
      line-height: @20px;
      // line-height: @28px;
      // align-items: flex-start;
      div{
        display: flex;
        align-items: center;
        margin-bottom: @10px;
        img{
          width: @34px;
          height: @34px;
          margin-right: @24px;
        }
        h1{
          font-size: @30px;
          font-weight: bold;
          color: #333;
        }
      }
      p{
        font-size: @24px;
        color: #999;
        padding-left: @56px;
        margin-top: @10px;
        width: @230px;
        .one-line;
        text-align: left;
        line-height: 1.2;
      }
      &:first-child{
        margin-bottom: @24px;
      }
      &:first-child,&:nth-child(3){
        margin-right: @24px;
      }
    }
  }
  .audit {
    background: #f8f8f8;
    box-sizing: border-box;
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    img {
      margin-top: -@200px;
      width: @272px;
      height: @272px;
    }
    p {
      margin-top: @52px;
      font-size: @30px;
      color: #666666;
      line-height: @30px;
    }
  }
  .organIndex {
    background: #f8f8f8;
    overflow: hidden;
    // 无配图
    /deep/.noData{
      width: 100%;
      height: @390px;
      min-height: auto;
      img{
        margin-top: 0;
        width: @250px;
        height: @250px;
      }
    }
    .lists {
      background: #f8f8f8;
      &.createrList{
        /deep/.cell {
          background: #fff;
          &:nth-child(1), &:last-child{
            margin-bottom: @20px;
            .text-wrap{
              border-bottom: 0;
            }
          }
        }
      }
      &.adminList{
        /deep/.cell {
          background: #fff;
          &:last-child{
            margin-bottom: @20px;
            .text-wrap{
              border-bottom: 0;
            }
          }
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
  .uploadPic{
    padding-top:@20px;
    height: 38vh;
    button{
      margin-top: @20px;
      width: 92%;
    }
  }
}
</style>
