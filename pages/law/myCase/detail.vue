<template>
  <div class="caseDetail" :class="{noButton: all || detail.caseAssign.status == 3}">
    <div class="info">
      <h1>{{detail.overview}}</h1>
      <div class="time">
        <i class="iconfont icon-label"></i>
        <label>{{detail.labelName}}</label>
        <span>{{detail.createTime}}</span>
      </div>
      <pre class="desc">{{detail.description}}</pre>
      <h2 class="vux-1px-t" v-if="detail.attachment">证明材料</h2>
      <ul v-if="detail.attachment">
        <li @click="download(item)" v-for="(item, i) in detail.attachment" :key="i" class="vux-1px-b">
          <span>{{item.name}}</span>
          <span>查看</span>
        </li>
      </ul>
      <div class="user vux-1px-t">
        <p>
          <label>申请人</label>
          <span>{{detail.nickname}}</span>
          <i>({{detail.deptName}})</i>
        </p>
        <p @click="phone(detail.phone)">
          <label>联系电话</label>
          <span class="phone">{{detail.phone}}</span>
          <i class="iconfont icon-boda"></i>
        </p>
      </div>
    </div>
    <div class="end" v-if="detail.caseAssign.status == 3">
      <h2>案件结论</h2>
      <div class="endInfo">
        <p>{{endInfo.description}}</p>
        <span>{{endInfo.createTime}}</span>
      </div>
    </div>
    <div class="process">
      <h2>受理进展</h2>
      <!-- 律师信息 -->
      <div v-if="all && detail.status > 1 && detail.caseAssign" class="lawer vux-1px-b" @click="$router.push(`../lawer/detail?serviceID=${detail.caseAssign.lawerServiceID}`)">
        <div>
          <img :src="detail.caseAssign.avatar" alt="">
        </div>
        <div class="lawer-info">
          <h3>{{detail.caseAssign.uname}}</h3>
          <p>
            <span>{{detail.caseAssign.sex === 1 ? '男' : '女'}}</span>
            <i>{{detail.caseAssign.simpleName}}</i>
          </p>
          <p>擅长：{{detail.caseAssign.labels}}</p>
        </div>
        <i class="iconfont icon-you"></i>
      </div>
      <ul>
        <li v-for="(item, i) in caseProcess" :key="i">
          <i class="point"></i>
          <i class="line"></i>
          <p v-html="item.description"></p>
          <span>{{item.createTime}}</span>
        </li>
      </ul>
    </div>
    <!-- 从全部案件进来不能编辑，只读 -->
    <div v-if="!all">
      <div v-if="status == 4" class="btns vux-1px-t">
        <button disabled>案件转交中…</button>
      </div>
      <div v-else-if="detail.caseAssign.status == 1" class="btns vux-1px-t">
        <button v-if="!detail.caseAssign.caseAssignID" class="reject" @click="open('reject')">拒绝</button>
        <button class="accept" @click="disposeCase(2)">受理</button>
      </div>
      <div v-if="detail.caseAssign.status == 2" class="btns vux-1px-t">
        <button class="turn" @click="showLawer = true">转交案件</button>
        <button class="end" @click="open('end')">结案</button>
        <button class="accept" @click="open('update')">更新进展</button>
      </div>
    </div>
    <m-popup v-model="show" showNav :title='title' :radius='false' @onConfirm='confirm' :autoClose='false' confirmText='提交'>
      <textarea v-if='show' @confirm='confirm' placeholder="请输入(必填)" v-model="content" maxlength="999" :show-confirm-bar='false'/>
    </m-popup>
    <m-popup v-model="showLawer" showNav title='点击选择转交对象' :radius='false'>
      <ul v-if="lawerList.length" class="lists">
        <li @click="selectLawer(item)" class="list vux-1px-b" v-for="(item, index) in lawerList" :key='index'>
          <div class="head">
            <img mode="aspectFill" :src="item.avatar" alt="">
          </div>
          <div class="lawerInfo">
            <div class="name">
              <h1>{{item.uname}}</h1>
              <span class="sex">({{item.sex === 1 ? '男' : '女'}})</span>
            </div>
            <div>
              <p v-if="item.labels.length">擅长：<span v-for="(label, i) in item.labels" :key="i">{{label.labelName}}<i>、</i></span></p>
              <p v-else>擅长：暂未完善，请提醒对方完善个人简介…</p>
            </div>
          </div>
          <i class="iconfont icon-you"></i>
        </li>
      </ul>
      <m-noData v-else-if="showNoData" msg='暂无律师'/>
    </m-popup>
  </div>
</template>

<script>
  // import {confirm, toast} from '../../../constant/popup'
  import {turnCaseApi, getCaseDetailApi, disposeCaseApi, updateCaseApi, getLawerListApi} from '../../../api/law/index'
  import {dateFilter} from '../../../constant/filters'
  import mPopup from '../../../components/view/mPopup'
  import mNoData from '../../../components/prompt/mNoData'
  import { toast, confirm } from '../../../constant/popup'
  import {mapGetters} from 'vuex'
  
  // 受理中：2， 已结案： 3，已取消/已拒绝： 5
  export default {
    data () {
      return {
        status: '',
        showLawer: false,
        lawerList: [],
        show: false,
        content: '',
        detail: {
          caseAssign: {}
        },
        serviceID: '',
        statusArr: {
          1: '待受理',
          2: '受理中',
          4: '转交中',
          3: '已结案',
          5: '已拒绝'
        },
        titles: {
          reject: '请输入拒绝原因',
          update: '请输入进展描述',
          end: '请输入结案说明'
        },
        title: '',
        type: '',
        caseProcess: [],
        all: false,
        endInfo: {}
      }
    },
    components: {
      mPopup, mNoData
    },
    onLoad (options) {
      Object.assign(this.$data, this.$options.data())
      if (options.all === 'true') {
        this.all = true
      }
      this.status = options.status
      this.serviceID = options.serviceID
      this.getCaseDetail()
    },
    computed: {
      ...mapGetters(['userInfo'])
    },
    methods: {
      open (type) {
        this.title = this.titles[type]
        this.show = true
        this.type = type
      },
      selectLawer (item) {
        if (!item.labels.length) {
          return toast('none', '对方暂未完善个人信息，无法转交…')
        }
        confirm(
          '提示',
          `确认将本案件转交给${item.uname}吗？`,
          '确定',
          () => {
            turnCaseApi(this.serviceID, {serviceID: item.serviceID}).then(data => {
              toast('success', '转交案件成功')
              this.showLawer = false
              this.getCaseDetail()
              this.status = 4
            })
          }
        )
      },
      confirm () {
        if (!this.content) {
          return toast('none', this.title)
        }
        switch (this.type) {
          case 'reject':
            this.disposeCase(5)
            return
          case 'update':
            this.updateCase()
            return
          case 'end':
            this.disposeCase(3)
        }
      },
      phone (phoneNumber) {
        wx.makePhoneCall({
          phoneNumber
        })
      },
      // 受理、拒绝、结案
      disposeCase (status) {
        let kv = {
          disposeExplain: this.content,
          status,
          caseAssignID: this.detail.caseAssign.caseAssignID,
          serviceID: this.detail.caseAssign.serviceID
        }
        let dispose = {
          2: '受理',
          3: '结案',
          5: '拒绝'
        }
        confirm(
          '提示',
          `确认${dispose[status]}本案件吗？`,
          '确定',
          () => {
            disposeCaseApi(kv).then(data => {
              toast('none', `已${dispose[status]}`)
              this.getCaseDetail()
              this.show = false
              this.content = ''
            })
          }
        )
      },
      // 更新进展
      updateCase () {
        let kv = {
          description: this.content
        }
        updateCaseApi(this.detail.caseAssign.serviceID, kv).then(data => {
          toast('none', '已更新')
          this.getCaseDetail()
          this.show = false
          this.content = ''
        })
      },
      download (item) {
        if (['doc', 'docx', 'pdf'].includes(item.fileType)) {
          wx.downloadFile({
            url: this.detail.fileHostName + item.url,
            success: function (res) {
              if (res.statusCode === 200) {
                const filePath = res.tempFilePath
                wx.openDocument({
                  fileType: 'doc',
                  filePath: filePath,
                  success: function (res) {
                  }
                })
              }
            }
          })
        } else {
          wx.previewImage({
            current: this.detail.fileHostName + item.url,
            urls: [
              this.detail.fileHostName + item.url
            ]
          })
        }
      },
      getCaseDetail () {
        getCaseDetailApi(this.serviceID).then(data => {
          wx.setNavigationBarTitle({ title: `案件详情 (${this.statusArr[data.caseAssign.status]})` })
          this.detail = data
          this.detail.createTime = dateFilter(data.createTime, 'dateTime')
          if (data.attachment) {
            this.detail.attachment = JSON.parse(data.attachment).map((item, i) => {
              let fileType = item.url.split('.')[1]
              return {
                fileType,
                name: `证明材料${i + 1}.${fileType}`,
                url: item.url
              }
            })
          }
          let caseProcess = []
          if (data.status === 5 && data.resultsExplain) {
            caseProcess.push({
              description: `案件已拒绝，原因：<br/>${data.resultsExplain}`,
              createTime: dateFilter(data.operTime, 'dateTime')
            })
          }
          if (data.caseTempos) {
            caseProcess.push(...data.caseTempos)
          }
          if (data.caseAssign && data.status > 1 && data.status < 4) {
            caseProcess.push({
              description: `${data.caseAssign.uname}律师已受理本案件`,
              createTime: data.caseAssign.createTime
            })
          }
          caseProcess.push({
            description: `本案件由${data.caseAssign.createByDeptName}指派`,
            createTime: data.caseAssign.createTime
          })
          caseProcess.map(item => {
            item.createTime = dateFilter(item.createTime, 'dateTime')
          })
          // 已结案
          if (data.caseAssign.status === 3) {
            this.endInfo = {
              description: data.caseAssign.disposeExplain,
              createTime: dateFilter(data.caseAssign.disposeTime, 'dateTime')
            }
            caseProcess[0].description = '已结案'
          }
          this.caseProcess = caseProcess
          // 如果案件受理中，则加载律师列表
          if (data.caseAssign.status === 2) {
            this.getLawerList()
          }
        })
      },
      getLawerList () {
        getLawerListApi({page: 0, pageSize: 0}).then(data => {
          let myPhone = this.userInfo.phone
          this.lawerList = data.list.filter(item => item.phone !== myPhone)
          this.showNoData = !this.lawerList.length
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../../../assets/style/base.less';
  .caseDetail{
    background: #f8f8f8;
    min-height: calc(~'100vh - '@80px);
    padding-bottom: @80px;
    overflow: hidden;
    &.noButton{
      min-height: 100vh;
      padding-bottom: 0;
    }
    textarea{
      margin-top: @28px;
    }
    .lists{
      width: 100%;
      background: #f8f8f8;
      min-height: 35vh;
      .list{
        background: #fff;
        padding: @20px @28px;
        font-size:@26px;
        color:#929292;
        &:active{
          background: #f8f8f8;
        }
        display: flex;
        .head{
          .flex-center;
          height: @80px;
          img{
            width: @80px;
            height: @80px;
            border-radius: @6px;
            margin-right: @20px;
          }
        }
        .lawerInfo{
          flex: 1;
          .name{
            display: flex;
            align-items: center;
            margin-bottom: @12px;
            .sex{
              flex: 1;
            }
            h1{
              color: #000;
              font-size: @28px;
              margin-right: @10px;
            }
          }
          p{
            margin-top: @10px;
            display: flex;
            span{
              display: flex;
              &:last-child>i{
                display: none;
              }
            }
          }
        }
        .iconfont{
          font-size: @26px;
          color: #999;
          margin-left: @6px;
          align-self: center;
        }
      }
    }
    /deep/.noData{
      min-height: 35vh;
      img{
        width: @280px;
        height: @280px;
        margin-top: -@36px;
      }
    }
    h2{
      font-size: @30px;
      color: #333;
      font-weight: bold;
    }
    .info{
      padding: @30px;
      background: #fff;
      margin-bottom: @20px;
      h1{
        font-size:@32px;
        color:#000;
        line-height:1.3;
        width: 100%;
        margin-bottom: @20px;
        font-weight: bold;
      }
      .time{
        margin-bottom: @16px;
        display: flex;
        align-items: center;
        color: #999;
        font-size: @24px;
        .iconfont{
          font-size: @26px;
          margin-right: @6px;
        }
        label{
          margin-right: @60px;
        }
      }
      .desc{
        font-size: @26px;
        color: #999;
        line-height: 1.5;
        margin-bottom: @18px;
      }
      .desc+h2{
        padding-top: @22px;
      }
      ul>li{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: @24px 0;
        &:last-child{
          padding-bottom: 0;
          border-bottom: 0;
        }
        span:first-child{
          font-size: @26px;
          color: #019cd2;
        }
        span:last-child{
          font-size: @24px;
          color: #bbb;
        }
      }
      .user{
        margin-top: @20px;
        p{
          display: flex;
          align-items: center;
          margin-top: @20px;
          label{
            width: @160px;
          }
          label, span{
            font-size: @28px;
            color: #333;
          }
          i{
            color: #999;
            margin-left: @6px;
            font-size: @26px;
          }
          .phone,.iconfont{
            color: #ff6633;
          }
          .iconfont{
            font-size: @28px;
          }
        }
      }
    }
    .process, .end{
      background: #fff;
      padding: @30px;
      margin-bottom: @20px;
      h2{
        margin-bottom: @30px;
      }
      .lawer{
        display: flex;
        padding-bottom: @30px;
        margin-bottom: @30px;
        img{
          width: @60px;
          height: @60px;
          border-radius: 50%;
          margin-right: @24px;
        }
        h3{
          font-size: @30px;
          color: #333;
        }
        .lawer-info{
          flex: 1;
          p{
            display: flex;
            align-items: center;
            margin-top: @10px;
            color: #666;
            font-size: @24px;
            span{
              font-size: @26px;
              color: #999;
            }
            i{
              margin-left: @8px;
              color: #999;
            }
          }
        }
        .iconfont{
          color: #999;
          font-size: @26px;
          align-self: center;
        }
      }
      li{
        position: relative;
        margin: 0 @24px;
        padding: 0 0 @30px @38px;
        font-size: 0;
        i.point{
          background: #ccc;
          width: @12px;
          height: @12px;
          border-radius: 50%;
          position: absolute;
          left: 0;
          z-index: 1;
          top: @10px;
        }
        i.line{
          width: @2px;
          background: #e5e5e5;
          position: absolute;
          left: @4px;
          bottom: 0;
          top: @10px;
          bottom: -@10px;
        }
        p{
          font-size: @24px;
          color: #999;
          margin-bottom: @10px;
        }
        span{
          font-size: @22px;
          color: #bbb;
        }
        &:first-child{
          p{
            font-size: @28px;
            color: #333;
          }
          i.point{
            width: @16px;
            height: @16px;
            background: #ff6633;
            left: -@2px;
          }
        }
        &:last-child{
          padding-bottom: 0;
          i.line{
            display: none;
          }
        }
      }
    }
    .end{
      .endInfo{
        p{
          font-size: @28px;
          margin-bottom: @10px;
          color: #333;
        }
        span{
          font-size: @22px;
          color: #bbb;
        }
      }
    }
    .btns{
      position: fixed;
      bottom: 0;
      width: 100%;
      display: flex;
      height: @80px;
      z-index: 5;
      button{
        font-size: @32px;
        border-radius: 0;
        &[disabled]{
          background: #fff;
          opacity: 1;
        }
        &.reject, &.end{
          background: #fff;
          width: 70%;
          color: #ff6633;
          border-left: 1px solid @border;
        }
        &.turn{
          color: #666;
          background: #fff;
          width: 70%;
        }
        &.accept{
          color: #fff;
          font-weight: bold;
          width: 100%;
        }
      }
    }
  }
</style>
