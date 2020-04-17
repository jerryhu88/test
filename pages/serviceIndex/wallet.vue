<template>
  <div class="wallet">
    <div class="info">
      <div class="money">
        <!-- <img src="../../../static/金币.png" alt=""> -->
        <div>
          <p>5000.00<span> 元</span></p>
          <span>账户余额</span>
        </div>
      </div>
      <div class="set">
        <navigator url="./welfareCenter/billCenter">明细</navigator>
        <i class="line"></i>
        <navigator url="./setMoney?type=reduceMoney">提现</navigator>
        <i class="line"></i>
        <navigator url="./setMoney?type=addMoney">充值</navigator>
      </div>
    </div>
    <ul class="lists">
      <m-cell v-for="(item, i) in lists"
      :title='item.title'
      @click="readCard"
      :icon="item.icon"
      :key="i"/>
    </ul>
    <m-popup v-model='show' showNav :title='popupText[current].title' :confirmText='popupText[current].confirmText' @onConfirm="onConfirm(current)" :radius='false'>
      <swiper class="wallet-popup" :current='current' :duration='200' @change="change">
        <swiper-item>
          <ul class="cards">
            <li v-for="(item, i) in cardLists" :key="i" class="card">
              <div class="title">
                <h1>{{item.name}}</h1>
                <i class="iconfont icon-guanbi"></i>
              </div>
              <span class="type">{{item.type}}</span>
              <p class="number">{{item.number}}</p>
            </li>
          </ul>
        </swiper-item>
        <swiper-item class="addCard">
          <h1>绑定银行卡<span>(请绑定持卡人本人银行卡)</span></h1>
          <div class='input'>
            <label>持卡人</label>
            <input cursor-spacing='180' @input='inputCode' placeholder="请输入持卡人姓名" v-model="card.name" type="text" maxlength="6">
          </div>
          <div class='input'>
            <label>卡号</label>
            <input cursor-spacing='150' @confirm='send' @input="input" placeholder="请输入银行卡号" v-model="card.cardNum" type="number" maxlength="18">
          </div>
          <m-button :loading='loading' radius='radius' :disabled='disabled' @click="send">绑定</m-button>
        </swiper-item>
      </swiper>
    </m-popup>
  </div>
</template>

<script>
import mCell from '../../components/form/mCell'
import mPopup from '../../components/view/mPopup'
import {confirm} from '../../constant/popup'
import mButton from '../../components/form/mButton'
export default {
  data () {
    return {
      show: false,
      current: 0,
      popupText: {
        0: {
          title: '已绑定银行卡',
          confirmText: '添加银行卡'
        },
        1: {
          title: '添加银行卡',
          confirmText: '已绑定银行卡'
        }
      },
      card: {
        cardNum: '',
        name: ''
      },
      lists: [
        {
          title: '银行卡',
          // icon: '../../../../static/银行卡.png',
          url: '../wallet'
        }
      ],
      cardLists: [
        {
          name: '光大银行(0001)',
          type: '储蓄卡',
          number: '**** **** **** 0001'
        },
        {
          name: '建设银行(0002)',
          type: '信用卡',
          number: '**** **** **** 0002'
        },
        {
          name: '工商银行(0003)',
          type: '储蓄卡',
          number: '**** **** **** 0003'
        },
        {
          name: '邮储银行(0004)',
          type: '储蓄卡',
          number: '**** **** **** 0004'
        }
      ]
    }
  },
  components: {
    mCell, mPopup, mButton
  },

  methods: {
    change (e) {
      this.current = e.mp.detail.current
    },
    toUrl (url) {
      wx.navigateTo({url})
    },
    onConfirm (current) {
      this.current = current ? 0 : 1
    },
    readCard () {
      if (this.cardLists.length) {
        this.show = true
        this.current = 0
      } else {
        confirm(
          '提示',
          '您暂无已绑定的银行卡',
          '去添加',
          () => {
            this.toUrl({url: '../addCard'})
          }
        )
      }
    }
  },

  created () {
  }
}
</script>

<style scoped lang='less'>
@import '../../../src/assets/style/base.less';
.wallet{
  background: #f8f8f8;
  min-height: 100vh;
  .info{
    background: #fff;
    padding: @38px;
    margin-bottom: @28px;
    .money{
      .flex-center;
      margin-bottom: @38px;
      img{
        width: @70px;
        height: @70px;
        margin-right: @24px;
      }
      >div{
        color:#222222;
        font-size: 0;
        height: @70px;
        .column-between;
        p{
          font-size:@40px;
          font-weight: 600;
          line-height: @36px;
          span{
            font-size:@24px;
          }
        }
        >span{
          font-size:@22px;
          color:#929292;
        }
      }
    }
    .set{
      font-size:@28px;
      color:#222222;
      .flex-center;
      .line{
        background: #d8d8d8;
        margin: 0 @26px;
        width: @2px;
        height: @28px;
      }
    }
  }
  .lists{
    background: #fff;
    /deep/li:last-child{
      .text-wrap{
        border: 0;
      }
    }
  }
  /deep/.wallet-popup{
    width: 100%;
    display: flex;
    height: 55vh !important;
    overflow: auto;
    // 已绑定银行卡
    .cards{
      box-sizing:border-box;
      padding: @32px;
      padding-bottom: 0;
      width: 100%;
      height: 55vh !important;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      .card{
        padding: @26px @32px;
        border-radius:@4px;
        height:@190px;
        width: 100%;
        color: #fff;
        box-sizing: border-box;
        margin-bottom: @32px;
        .column-between;
        background:#a46bee;
        .title{
          .center-between;
          font-family:PingFangSC-Medium;
          font-size:@34px;
          .icon-guanbi{
            font-size: @30px;
          }
        }
        .type{
          margin-top: @16px;
          opacity:0.6;
          font-size:@24px;
          flex: 1;
        }
        .number{
          font-size:@28px;
        }
        &:nth-child(2), &:nth-child(6){
          background:#1b95f3;
        }
        &:nth-child(3), &:nth-child(7){
          background:#ed5342;
        }
        &:nth-child(4), &:nth-child(8){
          background:#54b9ff;
        }
      }
    }
    // 添加银行卡
    .addCard{
      box-sizing: border-box;
      padding: @36px @32px;
      h1{
        font-size:@38px;
        color:#000000;
        margin-bottom: @64px;
        span{
          font-size:@26px;
          color:#666666;
          margin-left: @10px;
        }
      }
      .input{
        .flex-center;
        margin-bottom: @42px;
        font-size:@34px;
        color:#222222;
        border-bottom:@2px solid #dfdfdf;
        padding-bottom: @22px;
        &:last-of-type{
          margin-bottom: @96px;
        }
        label{
          width: @128px;
        }
      }
    }
  }
}
</style>
