<template>
  <div class="home-page">
    <ul class="lists" v-if="type === 'baseinfo'">
      <m-cell title='头像' readonly :avatar="userInfo.avatar || '.././../assets/images/default.png'"/>
      <m-cell title='姓名' :prompt="userInfo.uname || '填写姓名'" @click="openPopup(userInfo.uname)"/>
      <m-cell title='昵称' readonly :prompt="userInfo.nickname || '暂无'"/>
      <m-cell title='性别' readonly :prompt="sexs[userInfo.sex] || '暂无'"/>
    </ul>
    <ul class="lists" v-if="type === 'safety'">
      <m-cell title='绑定手机' icon='icon-shouji' :prompt="phone" readonly/>
      <m-cell title='绑定邮箱' @click="openPopup(userInfo.email)" icon='icon-youxiang' :prompt="userInfo.email"/>
      <!-- step: 0 修改密码  1 第一次输入密码  2 第二次输入密码 -->
      <!-- 未开发 -->
      <!-- <m-cell title='支付密码' @click="toUrl(`../../account/setPayPwd?step=0&&phone=${userInfo.phone}`)" icon='icon-zhifumima'/> -->
    </ul>
    <button v-if="type === 'baseinfo' && !userInfo.uname" class="update" @click="toastNoName">同步资料</button>
    <button v-else-if="type === 'baseinfo'" class="update" open-type='getUserInfo' @getuserinfo='getuserinfo'>同步资料</button>
    <m-popup ref='popup' position='center' v-model="show">
      <div class="popup-content">
        <h1>{{editName}}</h1>
        <input v-model="editValue" :placeholder="'请输入' + editName" type="text" :max="20">
        <div class="btns">
          <button hover-class='hover' @click="show = false">取消</button>
          <button hover-class='hover' @click="submitName">确认</button>
        </div>
      </div>
    </m-popup>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import mCell from '../../components/form/mCell'
import mPopup from '../../components/view/mPopup'
import {toast, confirm} from '../../constant/popup'
import {updateNameApi, updateEmailApi, updateInfoApi} from '../../api/serviceIndex/index'

export default {
  data () {
    return {
      sexs: ['暂无', '男', '女'],
      show: false,
      type: '',
      titles: {
        baseinfo: '个人信息',
        safety: '安全中心'
      },
      editName: '',
      editValue: '',
      editNames: {
        baseinfo: '姓名',
        safety: '邮箱'
      }
    }
  },
  components: {
    mCell, mPopup
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    if (this.type === 'baseinfo') {
      this.editValue = this.userInfo.uname
    } else {
      this.editValue = this.userInfo.email
    }
    this.type = options.type
    this.editName = this.editNames[this.type]
    wx.setNavigationBarTitle({ title: this.titles[this.type] })
  },
  computed: {
    ...mapGetters(['userInfo']),
    phone () {
      let phone = this.userInfo.phone
      if (phone) {
        return phone.slice(0, 3) + '******' + phone.slice(9, 11)
      }
    }
  },
  methods: {
    toastNoName () {
      confirm(
        '提示',
        `请先填写姓名再同步资料哦…`,
        '确定',
        () => {}
      )
    },
    getuserinfo (e) {
      let {errMsg, userInfo} = e.target
      if (errMsg === 'getUserInfo:ok') {
        let mess = {
          ...userInfo,
          avatar: userInfo.avatarUrl,
          nickname: userInfo.nickName,
          sex: userInfo.gender,
          openID: this.userInfo.openID
        }
        console.log(mess)
        updateInfoApi(mess).then(data => {
          this.userInfo.nickname = userInfo.nickName
          this.userInfo.sex = userInfo.gender
          this.userInfo.avatar = userInfo.avatarUrl
          toast('success', '同步成功')
        })
      }
    },
    openPopup (value) {
      console.log(value)
      this.editValue = value || ''
      this.show = true
    },
    submitName () {
      if (!this.editValue) {
        toast('none', `${this.editName}不能为空`)
      } else {
        if (this.editName === '姓名') {
          updateNameApi({uname: this.editValue, openID: this.userInfo.openID}).then(data => {
            this.userInfo.uname = this.editValue
            toast('success', '修改成功')
            this.show = false
          })
        } else {
          updateEmailApi({email: this.editValue, openID: this.userInfo.openID}).then(data => {
            this.userInfo.email = this.editValue
            toast('success', '修改成功')
            this.show = false
          })
        }
      }
    },
    toUrl (url) {
      wx.navigateTo({ url })
    }
  }
}
</script>

<style lang='less' scoped>
@import "../../assets/style/base.less";
.home-page{
  background: #f8f8f8;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  .bg{
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    height: @425px;
    background: linear-gradient(246deg, #fe8441 0%, #fd5058 98%);
  }
  .lists{
    background: #f8f8f8;
    margin-top: @20px;
    /deep/li{
      background: #fff;
      &:last-child .text-wrap{
        border-bottom: 0;
      }
      >.iconfont{
        color: #5cb0ff;
      }
    }
  }
  .update{
    width: 80%;
    margin-top: @84px;
  }
  /deep/.popup {
    right:15%!important;
    left:15%!important;
    border-radius: @24px!important;
    margin-top: -@120px;
  }
  font-size:@30px;
  .popup-content{
    width: 100%;
    h1{
      text-align: center;
      font-size: @32px;
      color: #000;
      margin: @30px 0;
      font-weight: bold;
    }
    input{
      background: #f8f8f8;
      border-radius: @8px;
      margin: 0 @32px;
      padding: @14px @24px;
      font-size: @30px;
    }
    .btns{
      .flex-center;
      margin-top: @32px;
      border-top: @1px solid #e1e1e1;
      button{
        width: 50%;
        border-radius: 0;
        background: #fff;
        font-size: @30px;
        height: @86px;
        line-height: @86px;
        font-weight: bold;
        &:first-child{
          border-right: @1px solid #e1e1e1;
          color: #666;
        }
        &:last-child{
          color: @red;
        }
        &.hover{
          background: #f8f8f8;
        }
      }
    }
  }
}
</style>
