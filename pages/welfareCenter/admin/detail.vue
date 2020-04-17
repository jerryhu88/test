<template>
  <div class="adminDetail">
    <img class="bg" src="../../../assets/images/mine.png" alt="">
    <div class="top">
      <img mode="aspectFill" class="head" :src="info.avatar" alt="">
      <p class="name">{{info.uname || info.nickname}}</p>
      <p class="from">{{info.simpleName}}</p>
    </div>
    <ul class="info">
      <li>
        <span>性别</span>
        <span>{{info.sex ? '男' : '女'}}</span>
      </li>
      <!-- <li>
        <span>年龄</span>
        <span>{{info.age ? (info.age + '岁') : '未知'}}</span>
      </li> -->
      <li @click="phone(info.phone)">
        <span>联系电话</span>
        <span>{{info.phone}}</span>
        <i class="iconfont icon-you"></i>
      </li>
      <li class="subbranch" @click="clickSub">
        <picker range-key='label' @change="turnAdminStore" :value="index" :range="subbranchLists" :disabled="!info.audit">
          <div>
            <span>所属门店</span>
            <span>{{simpleName}}</span>
            <i class="iconfont icon-you"></i>
          </div>
        </picker>
      </li>
      <li @click="changeAdmin" :disabled="!info.audit">
        <span>机构转让</span>
        <i class="iconfont icon-you"></i>
      </li>
      <li class="del" @click='del'>
        <span>{{btnText}}</span>
        <i class="iconfont icon-you"></i>
      </li>
    </ul>
  </div>
</template>

<script>
  import bus from '../../../constant/bus'
  import {confirm, toast, alert} from '../../../constant/popup'
  import {turnAdminStoreApi, getAdminInfoApi, delAdminInfoApi, turnAdminApi} from '../../../api/welfareCenter/admin'
  import {delToDoListApi} from '../../../api/serviceIndex/index'
  import {mapGetters} from 'vuex'

export default {
    data () {
      return {
        info: {
          storeServiceID: ''
        },
        simpleName: '',
        subbranchI: 0,
        subbranchLists: [],
        btnText: '删除'
      }
    },
    onLoad (options) {
      this.serviceID = options.serviceID
      this.getAdminInfo()
      // 门店
      this.$store.dispatch('getSubbranch').then(data => {
        this.subbranchLists = data.map(item => {
          return {label: item.simpleName, value: item.serviceID}
        })
      })
    },
    computed: {
      ...mapGetters(['userInfo'])
    },
    methods: {
      clickSub () {
        if (!this.info.audit) {
          return toast('none', '管理员确认中…')
        }
      },
      turnAdminStore (event) {
        turnAdminStoreApi({...this.info, newStoreServiceID: this.subbranchLists[event.target.value].value}).then(data => {
          this.simpleName = this.subbranchLists[event.target.value].label
          bus.$emit('firstPage')
          toast('success', '门店更换成功')
        })
      },
      getAdminInfo () {
        getAdminInfoApi(this.serviceID).then(data => {
          wx.setNavigationBarTitle({ title: `管理员${!data.audit ? ' (确认中)' : ''}` })
          this.info = data
          this.simpleName = data.simpleName
          this.btnText = data.audit ? '删除' : '撤销'
        })
      },
      changeAdmin () {
        if (!this.info.audit) {
          return toast('none', '管理员确认中，暂无法转让')
        }
        confirm(
          '转让提示',
          `转让本机构，对方将拥有本机构最高管理权限，你的身份将更改为管理员，确认将机构转让给该管理员吗？`,
          '确认转让',
          () => {
            turnAdminApi(this.serviceID).then(data => {
              alert(
                '提示',
                '机构转让成功，你已成为本机构管理员',
                '我知道了',
                () => {
                  wx.reLaunch({ url: '../../serviceIndex/index' })
                }
              )
            })
          }
        )
      },
      phone (phoneNumber) {
        wx.makePhoneCall({
          phoneNumber
        })
      },
      del () {
        confirm(
          '提示',
          `确认${this.btnText}该管理员吗？`,
          '确定',
          () => {
            delAdminInfoApi(this.serviceID).then(data => {
              if (this.btnText === '撤销') {
                delToDoListApi('普惠机构', this.info.serviceID)
              }
              // 删除
              toast('none', `${this.btnText}成功`, () => {
                bus.$emit('firstPage')
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
      position: fixed;
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
        background: #fff;
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
      li,picker{
        position: relative;
        background: #fff;
        .flex-center;
        padding: @24px @28px;
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
          &.turnStatus{
            color: #ff6633;
          }
        }
        &.del{
          span{
            color: @red;
          }
          margin-top: @20px;
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
    /deep/.mpvue-picker{
      font-size:@30px;
      .mpvue-picker-view{
        max-height: 360rpx;
      }
      .mpvue-picker__hd {
        padding:@22px @30px;
        font-size:@26px;
        .mpvue-picker__action:last-child{
          color: @red;
        }
      }
    }
  }
</style>
