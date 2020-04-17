<template>
  <div class="billOrder">
    <!-- 扫码未开发 -->
    <!-- <tab :tabs='tabs' v-model='type' @select="select"/> -->
    <ul class="lists" v-if="type === 1">
      <m-cell title="已售出福利券账单" @click="$router.push('./ticketData?type=售出')"/>
      <m-cell title="已核销福利券账单" @click="$router.push('./ticketData?type=核销')"/>
      <!-- 未开发 -->
      <!-- <m-cell title="收款账单" @click="toUrl(item.url)"/> -->
    </ul>
      <!-- <picker range-key='label' @change="onConfirm" :value="index" :range="orderTypes">
        <span class="selectTime">{{orderType}}</span>
      </picker> -->
    <div class="picker" v-if="type === 2">
      <picker mode='date' @change="selectStart" :value="startTime" :end='endTime'>
        <span class="selectTime">{{start}}</span>
      </picker>
      <i class="to">至</i>
      <picker mode='date' @change="selectEnd" :value="endTime">
        <span class="selectTime">{{end}}</span>
      </picker>
    </div>
    <!-- 账单 -->
    <!-- <div class="order" v-if="type === 1">
      <ul>
        <ticket-detail type='账单'/>
      </ul>
      <m-button>导出</m-button>
    </div> -->
    <!-- 统计 -->
    <div class="stat" v-if="type === 2">
      <div class="total vux-1px-b">
        <h2>当月总收入(30笔)</h2>
        <span>￥{{total}}.00</span>
      </div>
      <!-- 饼状图 -->
      <div class="pies">
        <div class="bigCircle" :style="{'background': scanData > buyTicketData ? '#f8688f' : '#f4d400'}"></div>
        <div class="smallCircle">
          <div class="pie" :style="{'transform':'rotate(' + deg + 'deg)', 'background': scanData <= buyTicketData ? '#f8688f' : '#f4d400'}"></div>
        </div>
      </div>
      <!-- 饼状图指示 -->
      <ul class="staticTips">
        <li><i class="scan"></i>扫码收款<span>￥{{scanData}}.00</span><span class="percent">({{percent}}%)</span></li>
        <li><i class="buyTicket"></i>购买福利券<span>￥{{buyTicketData}}.00</span><span class="percent">({{100 - percent}}%)</span></li>
      </ul>
    </div>
  </div>
</template>

<script>
import TicketDetail from './components/TicketDetail'
import Tab from '../../components/view/tab'
import mButton from '../../components/form/mButton'
import mCell from '../../components/form/mCell'
const year = new Date().getFullYear()
let month = new Date().getMonth() + 1
month = month < 10 ? ('0' + month) : month
let lastDay = new Date(year, month, 0).getDate()
lastDay = lastDay < 10 ? ('0' + lastDay) : lastDay
export default {
  data () {
    return {
      start: '2019年3月',
      end: '',
      startTime: '',
      endTime: '2019-08',
      total: 4500,
      scanData: 3000,
      buyTicketData: 1500,
      orderType: '全部交易类型',
      orderTypes: [
        {
          label: '全部交易类型',
          value: 1
        },
        {
          label: '线上交易',
          value: 2
        },
        {
          label: '线下交易',
          value: 3
        }
      ],
      time: '2019年3月',
      tabs: [{ text: '账单', type: 1 }, { text: '统计', type: 2 }],
      type: 1
    }
  },
  components: {
    TicketDetail,
    Tab,
    mButton,
    mCell
  },
  onLoad () {
    this.initDate()
  },
  computed: {
    deg () {
      if (this.buyTicketData < this.scanData) {
        return this.buyTicketData / this.total * 360
      } else {
        return this.scanData / this.total * 360
      }
    },
    percent () {
      let num = this.scanData / this.total * 100
      return num.toFixed(1)
    }
  },
  methods: {
    initDate () {
      this.start = `${year}年${month}月01日`
      this.startTime = `${year}-${month}-01`
      this.end = `${year}年${month}月${lastDay}日`
      this.endTime = `${year}-${month}-${lastDay}`
    },
    select (type) {
      this.type = type
    },
    onConfirm (e) {
      this.orderType = this.orderTypes[e.target.value].label
    },
    selectDate (e) {
      this.time = e.target.value.replace(/-/, '年') + '日'
    }
  }
}
</script>

<style lang='less' scoped>
@import '../../../src/assets/style/base.less';
.billOrder {
  box-sizing: border-box;
  // padding-top: @78px;
  min-height: 100vh;
  background: #f8f8f8;
  /deep/.tabs {
    position: fixed;
    width: 100%;
    top: 0;
    background: #fff;
    z-index: 2;
  }
  .lists{
    background: #fff;
  }
  .picker{
    position: fixed;
    top: @78px;
    width: 100%;
    padding: @24px @28px;
    .x-center;
    .to{
      font-size: @26px;
      color: #666;
      margin-right: @18px;
    }
    .selectTime{
      font-size:@26px;
      color:#929292;
      position: relative;
      margin-right: @48px;
      &::after{
        position: absolute;
        display: inline-block;
        content: '';
        border: @8px solid transparent;
        border-top-color: #929292;
        top: @16px;
        right: -@24px;
      }
    }
  }
  .order {
    padding-bottom: @88px;
    /deep/button {
      position: fixed;
      bottom: 0;
      width: 100%;
      background: @red;
      border-radius: 0;
      color: #fff;
      font-size: @30px;
      height: @88px;
      line-height: @88px;
    }
  }
  .stat {
    padding-top: @80px;
    background: #fff;
    height: calc(~"100vh - " @158px);
    .total {
      border-top: @20px solid #f8f8f8;
      padding: @28px;
      .center-between;
      h2 {
        font-size: @30px;
        color: #222222;
      }
      span {
        font-size: @26px;
        color: #aaaaaa;
      }
    }
    .pies {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      margin-top: @62px;
      // 实现圆环
      &::after{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: inline-block;
        content: '';
        width: @220px;
        height: @220px;
        background: #fff;
        border-radius: 50%;
      }
      .bigCircle {
        border-radius: 50%;
        width: 300rpx;
        height: 300rpx;
      }
      .smallCircle {
        position: absolute;
        width: 300rpx;
        height: 300rpx;
        clip: rect(0rpx, 300rpx, 300rpx, 150rpx);
        top: 0;
        .pie {
          position: absolute;
          width: 300rpx;
          height: 300rpx;
          clip: rect(0rpx, 150rpx, 300rpx, 0rpx);
          border-radius: 50%;
          left: 0;
          top: 0;
          transition: all linear 0.3s;
        }
      }
    }
    .staticTips {
      font-size: @28px;
      margin: @420px 0;
      .xy-center;
      color: #333;
      li {
        margin: 0 @24px @12px;
        display: flex;
        align-items: center;
        span {
          margin: 0 @6px;
          &.percent{
            color: #aaa;
          }
        }
        i {
          width: @14px;
          height: @14px;
          margin-right: 10rpx;
          display: inline-block;
          border-radius: @2px;
          &.scan {
            background: #f8688f;
          }
          &.buyTicket {
            background: #f4d400;
          }
        }
      }
    }
  }
}
</style>
