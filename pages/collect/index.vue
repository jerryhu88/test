<template>
  <div class="myCollect">
    <banner/>
    <menu-panel/>
    <right-btns showTicketBtn/>
  </div>
</template>

<script>
import tab from '../../components/view/tab'
import rightBtns from '../../components/view/rightBtns'
import banner from '../../components/view/banner'
import mSearch from '../../components/form/mSearch'
import menuPanel from '../../components/panel/menuPanel'
import {wxMpLogin} from '../../api/index'
import {mapGetters} from 'vuex'

export default {
  data () {
    return {
      currentI: 1,
      showDept: false,
      depts: [],
      tabs: [
        {text: '所有', type: '1'},
        {text: '餐厅', type: '2'},
        {text: '生鲜', type: '3'},
        {text: '所有', type: '4'}
      ],
      status: '1'
    }
  },
  components: {
    mSearch, menuPanel, tab, banner, rightBtns
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  onLoad () {
    Object.assign(this.$data, this.$options.data())
  },
  methods: {
    // 轮播图的切换事件
    swiperChange (e) {
      console.log(e)
      this.currentI = e.target.current
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
.myCollect{
  /deep/.banner{
    margin-bottom: 40rpx;
  }
}
</style>
