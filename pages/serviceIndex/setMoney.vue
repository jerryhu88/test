<template>
  <div class="setMoney">
    <div class="card" @click="show = true">
      <span>{{types[type].text}}银行卡</span>
      <div>
        <h1>{{card}}</h1>
        <span>两小时内到账</span>
      </div>
      <i class="iconfont icon-you"></i>
    </div>
    <div class="form">
      <span>{{types[type].title}}金额</span>
      <div>
        <span class="￥">￥</span>
        <input v-model="money" type="digit" maxlength="10" auto-focus>
        <span v-if="type === 'reduceMoney'" class="all" @click="money = total">全部</span>
      </div>
      <p v-if="type === 'reduceMoney'" class="prompt">可提现金额¥{{total}}.00，额外扣除¥{{(money * percent * 0.01) || total * percent * 0.01}}服务费(费率{{percent + '%'}})</p>
      <m-button v-if="type === 'reduceMoney'" radius='radius' :disabled="money > total || !money" @click="submit">提现</m-button>
      <m-button v-else radius='radius' :disabled="money <= 0" @click="submit">充值</m-button>
    </div>
    <mp-picker ref="mpPicker" :pickerValueDefault="card" @onConfirm="confirm" :pickerValueArray="cards"/>
    <!-- 输入密码 -->
    <m-popup v-model='show' position='center' :maskBlur='false'>
      <div class="popup-content">
        <i @click="show = false" class="iconfont icon-guanbi"></i>
        <h1>输入支付密码</h1>
        <span>{{types[type].title}}金额</span>
        <p class="money">￥ {{money}}</p>
        <div class="selectCard">
          <span>{{types[type].text}}银行卡</span>
          <div>
            <!-- <img src="/static/银行卡.png" alt=""> -->
            <span>{{card}}</span>
          </div>
        </div>
        <div class="pay-input">
          <i v-for="i in 6" :key="i" class="box">{{payPwd[i] ? '•' : ''}}</i>
          <input v-if="inputFlag" cursor-spacing="150" auto-focus v-model="payPwd" maxlength="6" type="number">
        </div>
      </div>
    </m-popup>
  </div>
</template>

<script>
import mButton from '../../components/form/mButton'
// import mpPicker from 'mpvue-weui/src/picker'
import mPopup from '../../components/view/mPopup'
import { toast } from '../../constant/popup'
export default {
  data () {
    return {
      show: false,
      inputFlag: false,
      payPwd: '',
      total: 5000,
      money: '',
      percent: 0.1,
      card: '光大银行(0001)',
      cards: [
        {
          label: '光大银行(0001)',
          value: 1
        },
        {
          label: '工商银行(0002)',
          value: 2
        },
        {
          label: '建设银行(0003)',
          value: 3
        }
      ],
      types: {
        addMoney: {
          title: '充值',
          text: '充值'
        },
        reduceMoney: {
          title: '提现',
          text: '到账'
        }
      },
      type: ''
    }
  },
  components: {
    mButton, mPopup
  },
  watch: {
    payPwd () {
      if (this.payPwd.length === 6) {
        toast('none', `${this.types[this.type].title}成功`, () => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      }
    }
  },
  methods: {
    confirm (item) {
      this.card = item.label
    },
    closePopup () {
      this.inputFlag = false
    },
    submit () {
      this.payPwd = ''
      this.inputFlag = true
      this.show = true
    }
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    this.type = options.type
    wx.setNavigationBarTitle({
      title: this.types[this.type].title
    })
  },
  mounted () {
    // this.$nextTick(() => {
    //   this.$refs.popup.close()
    // })
  }
}
</script>

<style scoped lang='less'>
@import '../../../src/assets/style/base.less';
  .setMoney{
    font-size:@30px;
    /deep/.mpvue-picker-view{
      max-height: 360rpx;
    }
    /deep/.mpvue-picker__hd {
      padding:@22px @30px;
      font-size:@26px;
      .mpvue-picker__action:last-child{
        color: @red;
      }
    }
    background:#fbfbfb;
    min-height: 100vh;
    .card{
      padding: @48px;
      display: flex;
      font-size:@28px;
      color:#000000;
      >div{
        margin-left: @36px;
        flex: 1;
        h1{
          font-weight: 600;
        }
        span{
          font-size:@24px;
          color:#aaaaaa;
          margin-top: @18px;
        }
      }
      .iconfont{
        color: #929292;
        font-size: @24px;
        position: relative;
        top: @8px;
      }
    }
    .form{
      background: #fff;
      padding: @48px;
      >span{
        font-size:@28px;
        color:#000000;
        margin-bottom: @48px;
      }
      >div{
        .flex-center;
        font-size:@66px;
        color:#000000;
        border-bottom:@1px solid #e1e1e1;
        margin-bottom: @48px;
        padding-bottom: @20px;
        span{
          position: relative;
          left: -@10px;
          &.all{
            font-size: @32px;
            margin-left: @24px;
            position: relative;
            top: @12px;
            color: @red;
          }
        }
        input{
          height: @66px;
          flex: 1;
        }
      }
      .prompt{
        font-size:@24px;
        color:#aaaaaa;
        margin-bottom: @48px;
      }
    }
    .popup-content{
      .xy-center;
      width: 100%;
      padding: @32px @40px @40px;
      position: relative;
      .icon-guanbi{
        position: absolute;
        right: @40px;
        top: @32px;
        color: #666;
        font-size: @30px;
      }
      h1{
        margin-bottom: @24px;
        font-size: @32px;
      }
      h1+span{
        margin-bottom: @6px;
        font-size: @34px;
      }
      .money{
        font-size: @46px;
        color: #222;
        font-weight: 600;
        margin-bottom: @24px;
      }
      .selectCard{
        padding-top: @24px;
        border-top: @1px solid #e1e1e1;
        .center-between;
        width: 100%;
        img{
          width: @36px;
          height: @28px;
          margin-right: @12px;
          vertical-align: middle;
        }
      }
      .pay-input{
        margin-top: @48px;
        .center-between;
        position: relative;
        border: @2px solid #d1d1d1;
        border-radius: @6px;
        width: 100%;
        .box{
          flex: 1;
          height: @88px;
          line-height: @88px;
          text-align: center;
          font-size: @60px;
          border-right: @2px solid #d1d1d1;
          &:last-of-type{
            border: 0;
          }
        }
        input{
          position: absolute;
          left: -50%;
          right: -@60px;
          top: 0;
          height: @88px;
          background: transparent;
          color: transparent;
        }
      }
    }
  }
</style>
