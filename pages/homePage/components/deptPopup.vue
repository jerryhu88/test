<template>
  <m-popup ref='popup' position='center' v-model="value">
    <div class="popup-content">
      <p>你尚未开启工会数字普惠卡</p>
      <p>请先关注以下任一公众号，并开启工会数字普惠卡后再操作</p>
      <ul>
        <li v-for="(item, i) in depts" :key="i" @click="copy(item)">
          <span>{{item}}</span>
          <button>复制</button>
        </li>
      </ul>
    </div>
  </m-popup>
</template>

<script>
import mPopup from '../../../components/view/mPopup'
// import {mapGetters} from 'vuex'

export default {
  data () {
    return {
    }
  },
  components: {
    mPopup
  },
  props: ['depts', 'value'],
  methods: {
    copy (name) {
      wx.setClipboardData({
        data: name,
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              wx.showToast({
                title: '复制成功'
              })
            }
          })
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import "../../../../src/assets/style/base.less";
/deep/.popup{
  border-radius: @20px;
}
.popup-content{
  padding: @60px;
  p{
    text-align: center;
    color: #999;
    line-height: @36px;
    font-size: @26px;
    &:first-of-type{
      font-weight: bold;
      font-size: @28px;
      color: @red;
      margin-bottom: @16px;
      font-size: @26px;
    }
  }
  ul{
    padding: 0 @60px;
    max-height: @320px;
    overflow-y: auto;
    li{
      margin-top: @20px;
      display: flex;
      align-items: center;
      span{
        font-size: @28px;
        color: #333;
        flex: 1;
      }
      button{
        width: @78px;
        height: @40px;
        font-size: @22px;
        background: #fff;
        color: #ff6633;
        border: @1px solid;
        padding: 0;
      }
    }
  }
}
</style>
