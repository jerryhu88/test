<template>
  <li class="list">
    <p v-if="showTime" class="top">{{item.time}}</p>
    <!-- 售出福利券列表、账单列表 -->
    <div class="bottom" v-if="type === '售出' || type === '账单'">
      <!-- <div class="title">
        <h1>+{{item.payAmount}}</h1>
        <span>{{item.dateTime}}</span>
      </div> -->
      <div class="title verify">
        <h1>{{item.boonName}}</h1>
      </div>
      <p class="text">福利券名称：{{item.boonName}}</p>
      <p class="text">原价：{{item.oldPrice}}元</p>
      <!-- <p class="text">抢购价：{{item.normalUserScore}}积分+{{item.normalUserPrice}}元</p> -->
      <p class="text">使用积分：{{item.normalUserScore}}积分</p>
      <!-- <p class="text">应收金额：{{item.normalUserPrice}}元</p> -->
      <!-- <p class="text">会员优惠：{{item.memberDiscountNum}}元</p> -->
      <!-- <p class="text">实收金额：{{item.normalUserPrice - item.memberDiscountNum}}元</p> -->
      <!-- <p class="text">支付方式： 线上支付-微信支付</p> -->
      <p class="text">抢购用户：{{item.nickname}}</p>
    </div>
    <!-- 已核销福利券列表 -->
    <div class="bottom" v-else>
      <div class="title verify">
        <h1>{{item.boonName}}</h1>
      </div>
      <p class="text">核销日期：{{time}}</p>
      <p class="text">核销方式：扫码核销</p>
      <p class="text">支付用户：{{item.nickname}}</p>
      <p class="text">核销管理员：{{item.uname}}</p>
    </div>
  </li>
</template>

<script>
import {dateFilter} from '../../../constant/filters'
export default {
  props: {
    showTime: Boolean,
    type: String,
    item: Object
  },
  data () {
    return {
      isSaled: false
    }
  },
  computed: {
    time () {
      return dateFilter(this.item.verificationTime, 'dateTime')
    }
  },
  methods: {
  }
}
</script>

<style lang='less' scoped>
@import "../../../../src/assets/style/base.less";
.list{
  background: #fff;
  margin-bottom: @20px;
  .top{
    padding: @18px @28px;
    background: #f8f8f8;
    font-size:@26px;
    color:#929292;
  }
  .bottom{
    padding: @24px @28px;
    .title{
      border-bottom: @1px solid @border;
      padding-bottom: @24px;
      .center-between;
      margin-bottom: @24px;
      h1{
        font-size:@30px;
        color:#222222;
      }
      span{
        font-size:@24px;
        color:#aaaaaa;
      }
      &.verify{
        padding-bottom: @24px!important;
      }
    }
    .text{
      font-size:@26px;
      color:#666666;
      &:not(:last-of-type){
        margin-bottom: @14px;
      }
    }
  }
}
</style>
