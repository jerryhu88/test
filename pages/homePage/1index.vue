<template>
  <div class="login">
    <div class="bg"></div>
    <p class="welcome">Welcome</p>
    <p>to</p>
    <p>Hall<span>o</span>n<span>o</span>mi</p>
    <button open-type='getUserInfo' @getuserinfo='getuserinfo' class="order">外卖订单<span>→</span></button>
    <button open-type='getUserInfo' @getuserinfo='getuserinfo' class="myOrder">我的订单<span>→</span></button>
    <!-- <button open-type="getPhoneNumber" @getphonenumber="wxLogin">微信登录</button> -->
  </div>
</template>

<script>
import {wxMpLogin} from '../../api/index'
import deptPopup from './components/deptPopup'
import {mapGetters} from 'vuex'

export default {
  data () {
    return {
      showDept: false,
      depts: []
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  onLoad () {
    Object.assign(this.$data, this.$options.data())
  },
  components: {
    deptPopup
  },
  methods: {
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
        this.$router.push('../mine/myOrder')
        console.log(mess)
        // updateInfoApi(mess).then(data => {
        //   this.userInfo.nickname = userInfo.nickName
        //   this.userInfo.sex = userInfo.gender
        //   this.userInfo.avatar = userInfo.avatarUrl
        //   toast('success', '同步成功')
        // })
      }
    },
    wxLogin (e) {
      let {encryptedData, iv, errMsg} = e.target
      if (errMsg === 'getPhoneNumber:ok') {
        let mess = {
          encryptedData,
          iv,
          sessionKey: this.userInfo.sessionKey,
          openID: this.userInfo.openID
        }
        wxMpLogin(mess).then(data => {
          if (data instanceof Array) {
            this.showDept = true
            this.depts = data
            return
          }
          this.$router.back()
        })
      }
    }
    // copy (name) {
    //   wx.setClipboardData({
    //     data: name,
    //     success: function (res) {
    //       wx.getClipboardData({
    //         success: function (res) {
    //           wx.showToast({
    //             title: '复制成功'
    //           })
    //         }
    //       })
    //     }
    //   })
    // }
  }
}
</script>

<style lang='less' scoped>
@import "../../assets/style/base.less";
.login{
  background: #FBAF02;
  overflow: hidden;
  min-height: 100vh;
  .bg{
    position: absolute;
    width:750rpx;
    height:750rpx;
    border-radius: 50%;
    background: #D8D8D8;
    top: -200rpx;
    left: -200rpx;
    box-shadow: 0 13rpx 20rpx 0 rgba(0, 0, 0, 0.12);
  }
  >p{
    &.welcome{
      margin-top: 620rpx;
    }
    margin-left: 56rpx;
    font-size:100rpx;
    font-weight: bold;
    line-height:1.2;
    color: #080040;
    span{
      color: #fff;
    }
  }
  button{
    width:394rpx;
    height:90rpx;
    background:rgba(255,255,255,0.92);
    border-radius:44rpx 0px 0px 44rpx;
    position: absolute;
    right: 0;
    font-size: 30rpx;
    color: #080040;
    font-weight: bold;
    padding: 0 56rpx 0 102rpx;
    span{
      margin-left: 82rpx;
      font-weight: 800;
    }
    &.order{
      bottom: 280rpx;
    }
    &.myOrder{
      bottom: 142rpx;
    }
  }
}
</style>
