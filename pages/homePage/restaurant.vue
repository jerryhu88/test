<template>
  <div class="restaurant">
    <banner/>
    <div class="content">
      <nav>推荐</nav>
      <ul class="recommend">
        <li v-for="i in 3" :key="i">
          <img src="../../assets/images/mine.png" alt="">
          <p>酸菜炖粉条</p>
          <p>€ 20.00</p>
        </li>
      </ul>
      <nav>菜单</nav>
      <ul class="menuLists">
        <li>
          <div class="kind">
            <h1>凉菜</h1>
            <span>2</span>
            <i>></i>
          </div>
          <ul class="items">
            <li v-for="i in 5" :key="i">
              <h2>凉拌黄瓜</h2>
              <label>推荐</label>
              <span>€ 7.20</span>
            </li>
          </ul>
        </li>
        <li>
          <div class="kind">
            <h1>凉菜</h1>
            <span>2</span>
            <i>></i>
          </div>
          <ul class="items">
            <li v-for="i in 2" :key="i">
              <h2>凉拌黄瓜</h2>
              <label>推荐</label>
              <span>€ 7.20</span>
            </li>
          </ul>
        </li>
        <li>
          <div class="kind">
            <h1>凉菜</h1>
            <span>2</span>
            <i>></i>
          </div>
        </li>
      </ul>
    </div>
    <right-btns showTicketBtn showCollectBtn showMenuBtn/>
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
.restaurant{
  background: #FBAF02;
  padding-top: 120rpx;
  /deep/.banner{
    background: transparent;
    margin-top: -120rpx;
    margin-bottom: 26rpx;
  }
  .content{
    margin-top: -120rpx;
    padding-top: 120rpx;
    background: #fff;
    border-radius:60rpx 60rpx 0px 0px;
    nav{
      text-align: center;
      height:80rpx;
      line-height: 80rpx;
      background:rgba(8,0,64,0.04);
      color: #080040;
      font-size: 26rpx;
    }
    .recommend{
      padding: 50rpx 40rpx;
      display: flex;
      justify-content: space-between;
      li{
        width: 202rpx;
        border-radius: 16rpx;
        overflow: hidden;
        box-shadow:0px 10rpx 40rpx 0px rgba(0,0,0,0.14);
        img{
          width: 202rpx;
          height: 128rpx;
        }
        p{
          text-align: center;
          font-size: 24rpx;
          color: #080040;
          line-height: 44rpx;
        }
      }
    }
    .menuLists{
      padding: 20rpx 56rpx 46rpx;
      .kind{
        padding: 24rpx 0;
        border-bottom: 1rpx solid #EFEFF4;
        display: flex;
        align-items: center;
        padding-bottom: 26rpx;
        h1{
          font-weight: bold;
          color: #080040;
          font-size: 30rpx;
          flex: 1;
        }
        span{
          font-size: 30rpx;
          color: #6A6A6A;
          margin-right: 26rpx;
        }
        i{
          font-size: 28rpx;
          color: #6a6a6a;
        }
      }
      .items{
        background:rgba(8,0,64,0.04);
        padding: 0 32rpx;
        li{
          height: 80rpx;
          border-bottom: 1rpx solid #EFEFF4;
          display: flex;
          align-items: center;
          justify-content: space-between;
          display: flex;
          &:last-child{
            border: 0;
          }
          h2{
            font-size: 30rpx;
            color: #080040;
          }
          label{
            background: #2CC2DC;
            width:144rpx;
            height:34rpx;
            border-radius: 20rpx;
            line-height: 34rpx;
            text-align: center;
            color: #FFFFFF;
            font-size: 22rpx;
          }
          span{
            color: #B8BBC6;
            font-size: 26rpx;
          }
        }
      }
    }
  }
}
</style>
