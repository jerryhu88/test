<template>
  <div class="orderDetail">
    <div class="detail">
      <div class="restaurantName">
        <h1>饭中餐厅</h1>
        <p>Kleine Hammerstr. 53</p>
      </div>
      <ul>
        <li v-for="i in 3" :key="i">
          <div class="name">
            <h2>海鲜大餐</h2>
            <span>炖菜</span>
          </div>
          <div class="num">
            <div class="btns">
              <button><span>-</span></button>
              <span>1</span>
              <button><span>+</span></button>
            </div>
            <p>€ 17.20</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="steps">
      <img src="../../assets/images/logo.jpg" alt="">
      <h3>饭中餐厅</h3>
      <ul>
        <li>订单发送给商家</li>
        <li>商家确定订单</li>
        <li>订单准备中</li>
        <li>运送中</li>
        <li class="current">订单配送完成</li>
      </ul>
    </div>
  </div>
</template>

<script>
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
.orderDetail{
  padding-top: 20rpx;
  padding-bottom: 558rpx;
  .detail{
    margin: 0 32rpx;
    width: calc(~'100% - '64rpx);
    box-shadow:0px 30rpx 50rpx 0px rgba(210,211,215,0.6);
    border-radius:16rpx;
    overflow: hidden;
    .restaurantName{
      padding: 30rpx 32rpx;
      background: #f6f6f8;
      h1{
        font-size: 40rpx;
        color: #080040;
        font-weight: bold;
        margin-bottom: 14rpx;
      }
      p{
        font-size: 30rpx;
        color: #B8BBC6;
      }
    }
    ul{
      padding: 0 32rpx;
      background: #fff;
      li{
        padding: 20rpx 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1rpx solid @border;
        &:last-child{
          border: 0;
        }
        .name{
          h2{
            font-weight: bold;
            font-size: 30rpx;
            color: #333A4D;
            margin-bottom: 2rpx;
          }
          span{
            font-size: 26rpx;
            color: #B8BBC6;
          }
        }
        .num{
          .btns{
            display: flex;
            align-items: center;
            button{
              padding: 0;
              background: #fff;
              border-radius: 50%;
              width: 32rpx;
              height: 32rpx;
              border: 2px solid #080040;
              color: #080040;
              font-size: 28rpx;
              font-weight: bold;
              line-height: 28rpx;
              span{
                position: relative;
                top: -3.5rpx;
              }
            }
            span{
              margin: 0 24rpx;
              font-size: 34rpx;
              font-weight: bold;
              color: #080040;
            }
          }
          p{
            margin-top: 8rpx;
            font-size: 26rpx;
            color: #080040;
            text-align: right;
          }
        }
      }
    }
  }
  .steps{
    height: 558rpx;
    position: fixed; 
    bottom: 0;
    width: 100%;
    box-shadow:0px 10rpx 40rpx 0px rgba(0,0,0,0.14);
    border-radius:60rpx 60rpx 0px 0px;
    background: #FBAF02;
    img{
      text-align: center;
      width:288rpx;
      height:288rpx;
      border-radius: 50%;
      margin: 0 auto;
      display: inherit;
      margin-top: -144rpx;
    }
    h3{
      text-align: center;
      margin-top: 30rpx;
      color: #080040;
      font-size: 34rpx;
      font-weight: bold;
    }
    ul{
      overflow: auto;
      height: 264rpx;
      padding: 32rpx 92rpx 24rpx;
      li{
        font-weight: bold;
        font-size: 28rpx;
        color: #080040;
        margin-bottom: 16rpx;
        &:last-child{
          margin-bottom: 0;
        }
        &.current{
          color: #FFD67B;
        }
      }
    }
  }
}
</style>
