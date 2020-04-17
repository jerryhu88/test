<template>
  <div class="adminDetail">
    <img class="bg" src="../../../assets/images/mine.png" alt="">
    <div class="top">
      <img class="head" mode="aspectFill" :src='info.avatar' alt="">
      <p class="name">{{info.matchmakerName}}</p>
    </div>
    <tab v-if="!audit" :tabs='tabs' v-model='queryType'/>
    <ul class="info" v-if="queryType == 1">
      <li>
        <span>性别</span>
        <span>{{info.sex === 1 ? '男' : '女'}}</span>
      </li>
      <li @click="phone(info.phone)">
        <span>手机号码</span>
        <span>{{info.phone}}</span>
        <i class="iconfont icon-you"></i>
      </li>
      <li>
        <span>身份证号</span>
        <span>{{info.idCard}}</span>
      </li>
      <li>
        <span>身份证照片</span>
        <img @click="preview(info.idCard1Picture)" :src="info.fileHostName + info.idCard1Picture" alt="">
        <img @click="preview(info.idCard2Picture)" :src="info.fileHostName + info.idCard2Picture" alt="">
        <i class="iconfont icon-you"></i>
      </li>
      <li v-if="!audit && !info.deleted" class="del" @click='loginout'>
        <span>注销红娘</span>
        <i class="iconfont icon-you"></i>
      </li>
      <li v-if="!audit && info.deleted" class="del" @click='unLoginout'>
        <span>恢复注销</span>
        <i class="iconfont icon-you"></i>
      </li>
    </ul>
    <div v-if="queryType == 2 && !audit" class="stat">
      <div class="picker vux-1px-b">
        <picker mode='date' @change="selectStart" :value="startTime" :end='endTime'>
          <span class="selectTime">{{start}}</span>
        </picker>
        <i class="to">至</i>
        <picker mode='date' @change="selectEnd" :value="endTime">
          <span class="selectTime">{{end}}</span>
        </picker>
      </div>
      <ul>
        <li class="vux-1px-b">
          <span>任务状态</span>
          <span>数量</span>
          <span>占比</span>
        </li>
        <li class="vux-1px-b" v-for="(item, i) in stat" :key="i">
          <span><i :class="'color' + i"></i>{{item.text}}</span>
          <span>{{item.num}}</span>
          <span>{{item.percent}}</span>
        </li>
      </ul>
    </div>
    <div v-if="audit" class="audit">
      <p>审批意见</p>
      <textarea placeholder="请输入审批意见" v-model="info.auditReason" :show-confirm-bar='false' maxlength="100" style="height:96px"/>
      <div class="btns">
        <m-button @click="submit(5)">拒绝</m-button>
        <m-button @click="submit(2)">同意</m-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {confirm, toast} from '../../../constant/popup'
  import {delAdminInfoApi} from '../../../api/welfareCenter/admin'
  import {getOneMatcherStatApi, getAuditMatcherInfoApi, auditMatcherApi, getMatcherInfoApi, loginoutMatcherApi, unLoginoutMatcherApi} from '../../../api/love/matcher'
  import Tab from '../../../components/view/tab'
  import mButton from '../../../components/form/mButton'

  export default {
    data () {
      return {
        start: '开始时间',
        end: '结束时间',
        startTime: '',
        endTime: '',
        stat: [
          {
            text: '进行中',
            num: 0,
            percent: '0%'
          },
          {
            text: '牵手成功',
            num: 0,
            percent: '0%'
          },
          {
            text: '牵手失败',
            num: 0,
            percent: '0%'
          }
        ],
        queryType: 1,
        tabs: [
          {text: '基础信息', type: 1},
          {text: '红娘业绩', type: 2}
        ],
        info: {
        },
        simpleName: '',
        audit: false
      }
    },
    components: {
      Tab, mButton
    },
    onLoad (options) {
      this.audit = options.audit === 'true'
      this.serviceID = options.serviceID
      if (this.audit) {
        this.getAuditMatcherInfo()
      } else {
        this.getMatcherInfo()
        this.getMatcherStat()
      }
    },
    methods: {
      getMatcherStat () {
        let kv = {
          serviceID: this.serviceID,
          startTime: this.startTime,
          endTime: this.endTime
        }
        getOneMatcherStatApi({kv}).then(data => {
          let total = (data.doing + data.success + data.fail) || 1
          this.stat[0].num = data.doing
          this.stat[0].percent = ((data.doing / total) * 100).toFixed(1) + '%'
          this.stat[1].num = data.success
          this.stat[1].percent = ((data.success / total) * 100).toFixed(1) + '%'
          this.stat[2].num = data.fail
          this.stat[2].percent = ((data.fail / total) * 100).toFixed(1) + '%'
        })
      },
      selectStart (event) {
        let time = event.target.value.split('-')
        this.start = `${time[0]}年${time[1]}月${time[2]}日`
        this.startTime = event.target.value
        this.getMatcherStat()
      },
      selectEnd (event) {
        let time = event.target.value.split('-')
        this.end = `${time[0]}年${time[1]}月${time[2]}日`
        this.endTime = event.target.value
        this.getMatcherStat()
      },
      preview (url) {
        wx.previewImage({
          current: this.info.fileHostName + url,
          urls: [
            this.info.fileHostName + this.info.idCard1Picture,
            this.info.fileHostName + this.info.idCard2Picture
          ]
        })
      },
      getAuditMatcherInfo () {
        getAuditMatcherInfoApi(this.serviceID).then(data => {
          this.info = data
          // wx.setNavigationBarTitle({ title: `管理员${!data.audit ? ' (确认中)' : ''}` })
        })
      },
      getMatcherInfo () {
        getMatcherInfoApi(this.serviceID).then(data => {
          this.info = data
          // wx.setNavigationBarTitle({ title: `管理员${!data.audit ? ' (确认中)' : ''}` })
        })
      },
      phone (phoneNumber) {
        wx.makePhoneCall({
          phoneNumber
        })
      },
      loginout () {
        confirm(
          '提示',
          '确认注销该红娘吗？',
          '确定',
          () => {
            loginoutMatcherApi(this.info.serviceID).then(data => {
              toast('success', '注销成功')
              this.info.deleted = 1
            })
          }
        )
      },
      unLoginout () {
        unLoginoutMatcherApi(this.info.serviceID).then(data => {
          toast('success', '已恢复')
          this.info.deleted = 0
        })
      },
      submit (audit) {
        this.info.audit = audit
        auditMatcherApi(this.info).then(data => {
          toast('none', `${audit === 2 ? '已同意' : '已拒绝'}`)
          this.$router.back()
        })
      },
      del () {
        confirm(
          '提示',
          `确认${this.btnText}该管理员吗？`,
          '确定',
          () => {
            delAdminInfoApi(this.serviceID).then(data => {
              // 删除
              toast('none', `${this.btnText}成功`, () => {
                wx.navigateBack({
                  delta: 1
                })
              })
            })
          }
        )
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../../../assets/style/base.less';
  .adminDetail {
    background-color: #f8f8f8;
    min-height: 100vh;
    .bg{
      width: 100%;
      height: @300px;
      position: absolute;
      left: 0;
      top: 0;
    }
    .top{
      position: relative;
      .xy-center;
      height: @300px;
      color: #fff;
      font-size: @30px;
      .head{
        width: @100px;
        height: @100px;
        border-radius: 50%;
        border: 2px solid #fff;
      }
      .name{
        margin: @14px 0 @10px;
      }
      .from{
        opacity: 0.6;
        font-size: @26px;
      }
    }
    .info{
      margin-top: @20px;
      li,picker{
        position: relative;
        background: #fff;
        .flex-center;
        padding: @20px @28px;
        border-bottom: 0.5px solid #e1e1e1;
        &:active{
          background: #f8f8f8;
        }
        span{
          font-size:@28px;
          color:#222;
          &:first-child{
            flex: 1;
            color: #aaa;
          }
        }
        &.del{
          span{
            color: @red;
          }
          margin-top: @20px;
        }
        img{
          width: @120px;
          height: @80px;
          margin-left: @20px;
          border-radius:@6px;
        }
        .iconfont{
          color: #aaa;
          font-size: @24px;
          margin-left: @12px;
          position:relative;
          top:@5px;
          display: inline;
        }
      }
      .subbranch{
        width: 100%;
        box-sizing: border-box;
        picker{
          position: relative;
          width: 100%;
          border: 0;
          div{
            position: absolute;
            right: 0;
            left: 0;
            top: 0;
            bottom: 0;
            display: flex;
          }
        }
      }
    }
    .stat{
      .picker{  
        width: 100%;
        padding: @24px @28px;
        .x-center;
        .to{
          font-size: @26px;
          color: #666;
          margin-right: @18px;
        }
        .selectTime{
          font-size:@26px;
          color:#929292;
          position: relative;
          margin-right: @48px;
          &::after{
            position: absolute;
            display: inline-block;
            content: '';
            border: @8px solid transparent;
            border-top-color: #929292;
            top: @16px;
            right: -@24px;
          }
        }
      }
      ul{
        background: #fff;
        li{
          padding: @24px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          &:last-child{
            border: 0;
          }
          font-size:@26px;
          color:#666666;
          &:first-child{
            font-size: @28px;
            color: #000;
            font-weight: bold;
          }
          span{
            width: calc(100% / 3);
            display: flex;
            align-items: center;
            justify-content: center;
            i{
              width: @10px;
              height: @10px;
              border-radius: 50%;
              display: inline-block;
              margin-right: @8px;
              &.color0{
                background:#f9698e;
              }
              &.color1{
                background:#968bff;
              }
              &.color2{
                background:#fcd100;
              }
              &.color3{
                background:#95d601;
              }
              &.color4{
                background:#3adbcf;
              }
            }
          }
        }
      }
    }
    .audit{
      background: #fff;
      margin-top: @20px;
      p{
        padding: @20px @24px;
        font-size: @26px;
        color: #000;
      }
      .btns{
        padding: 0 @24px @24px @24px;
        display: flex;
        justify-content: space-between;
        /deep/button{
          &:first-child{
            margin-right: @24px;
            background: #fff;
            color: #ff6633;
            border: 1px solid #ff6633;
          }
        }
      }
    }
  }
</style>
