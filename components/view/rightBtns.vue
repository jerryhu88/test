<template>
  <div class="rightBtns">
    <div class="btns">
      <button v-if="showCollectBtn">藏</button>
      <button v-if="showTicketBtn" @click="onShowTicket(true)">券</button>
      <button v-if="showMenuBtn" @click="showMenu = !showMenu">单</button>
    </div>
    <!-- 点菜单 -->
    <order-panel v-if="showMenu"/>
    <!-- 优惠券 -->
    <div class="ticket" v-show="showTicket">
      <div class="content">
        <tab :tabs='tabs' v-model='status' @select="firstPage" spaceBetween/>
        <ticket-panel :getBtn='status == 1' :disabled='status == 3'/>
        <div class="back" @click="onShowTicket(false)">
          <button>返回</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import orderPanel from '../panel/orderPanel'
  import ticketPanel from '../panel/ticketPanel'
  import tab from '../view/tab'
  export default{
    props: {
      showCollectBtn: Boolean,
      showTicketBtn: Boolean,
      showMenuBtn: Boolean,
      value: Number
    },
    data () {
      return {
        showTicket: false,
        showMenu: false,
        tabs: [
          {text: '领取优惠券', type: '1'},
          {text: '未使用优惠券', type: '2'},
          {text: '已使用优惠券', type: '3'}
        ],
        status: '1'
      }
    },
    components: {
      orderPanel, tab, ticketPanel
    },
    created () {
    },
    methods: {
      onShowTicket (flag) {
        if (flag) {
          wx.hideTabBar()
        } else {
          wx.showTabBar()
        }
        this.showTicket = flag
      },
      firstPage () {}
    }
  }
</script>
<style lang="less" scoped>
  @import '../../../src/assets/style/base.less';
  .rightBtns{
    .btns{
      position: fixed;
      right: 30rpx;
      bottom: 72rpx;
      z-index: 5;
      button{
        background: #FBAF02;
        width:80rpx;
        height:80rpx;
        border-radius: 50%;
        box-shadow:0px 14rpx 18rpx 0px rgba(0,0,0,0.2);
        margin-top: 36rpx;
      }
    }
    // 优惠券
    .ticket{
      position: fixed;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      z-index: 6;
      background: rgba(0, 0, 0, 0.5);
      .content{
        border-radius:60rpx 60rpx 0px 0px;
        background: #fff;
        position: relative;
        position: fixed;
        overflow: hidden;
        top: 300rpx;
        width: 100%;
        bottom: 0;
        overflow: auto;
        padding-bottom: 150rpx;
        .back{
          padding: 30rpx 56rpx;
          background: #fff;
          position: fixed;
          bottom: 0;
          width: calc(~'100% - '112rpx);
          button{
            height:90rpx;
            background:rgba(251,175,2,1);
            border-radius: 100rpx;
            font-size: 30rpx;
            color: #080040;
            font-weight: bold;
          }
        }
      }
    }
    /deep/.orderPanel{
      width: auto;
      margin: 0;
      position: fixed;
      right: 32rpx;
      left: 32rpx;
      bottom: 188rpx;
      z-index: 6;
    }
  }
</style>
