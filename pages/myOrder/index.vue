<template>
  <div class="myOrder">
    <m-search/>
    <menu-panel/>
  </div>
</template>

<script>
import mSearch from '../../components/form/mSearch'
import menuPanel from '../../components/panel/menuPanel'
import {wxMpLogin} from '../../api/index'
import {mapGetters} from 'vuex'

export default {
  data () {
    return {
      showDept: false,
      depts: []
    }
  },
  components: {
    mSearch, menuPanel
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  onLoad () {
    Object.assign(this.$data, this.$options.data())
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
.myOrder{
  padding-top: 140rpx;
}
</style>
