<template>
  <li class="ticket-panel" :class="{disabled}" :id="'card' + item.type" @click="$emit('click')">
    <div class="ticketInfo">
      <div class="priceType" :class="{disabled}">
        <p>{{boon.name}}<span>{{boon.span}}</span></p>
        <span class="type">{{types[item.type]}}</span>
      </div>
      <i class="line"></i>
      <div class="nameTime" :class="{disabled}">
        <h1>{{item.boonName}}</h1>
        <p>抢购期：{{start}} - {{end}}</p>
      </div>
      <!-- 操作 -->
      <i class="iconfont icon-you"></i>
      <!-- 方形提示 -->
      <span class="squareTips" v-if="squareTips[item.putaway]">{{squareTips[item.putaway]}}</span>
    </div>
    <ul class="static" v-if="item.putaway !== 7" :class="{disabled}">
      <li><span>点击量：</span><span>{{item.clickNum || 0}}</span></li>
      <li><span>已售出：</span><span>{{item.total - item.surplus}}/{{item.total}}</span></li>
      <li><span>已核销：</span><span>{{item.verificationNum || 0}}</span></li>
    </ul>
    <p class="static" v-else>编辑时间：{{createTime}}</p>
  </li>
</template>

<script>
  import {dateFilter} from '../../../constant/filters'
  export default {
    props: {
      item: Object
    },
    data () {
      return {
        squareTips: {
          2: '已下架',
          5: '已售罄',
          6: '已过期',
          7: '审批中',
          8: '未通过'
        },
        disabled: false,
        isUsed: false,
        types: {
          1: '兑换券',
          2: '折扣券',
          3: '代金券',
          4: '满减券'
        }
      }
    },
    methods: {
      dateFilter
    },
    computed: {
      boon () {
        let name, span
        if (this.item.type === 1) {
          name = '福利'
        } else {
          let data = JSON.parse(this.item.boonUseDetails)[0]
          if (this.item.type === 2) { // 折扣
            name = data.rebate
            span = '折'
          } else if (this.item.type === 3) { // 代金
            name = data.reachSum
            span = '元'
          } else if (this.item.type === 4) { // 满减
            name = '满减'
          }
        }
        return {name, span}
      },
      start () {
        return this.dateFilter(this.item.sellStartTime, 'simpleTime')
      },
      end () {
        return this.dateFilter(this.item.sellEndTime, 'simpleTime')
      },
      createTime () {
        return this.dateFilter(this.item.createTime, 'dateTime')
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../../../src/assets/style/base.less';
  .ticket-panel{
    position: relative;
    &:not(:last-child){
      margin-bottom: @20px;
    }
    .ticketInfo{
      border-top-left-radius: @12px;
      border-top-right-radius: @12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: @30px;
      padding-right: @16px;
      position: relative;
      background: @red;
      color: #fff;
      height: @200px;
      box-sizing: border-box;
      .prompt{
        position: absolute;
        left: -@3px;
        top: @21px;
        transform: rotate(-45deg);
        font-size: @21px;
        color:#fff;
        line-height:@18px;
      }
      .priceType{
        text-align: center;
        margin-top: -@14px;
        p{
          font-size:@40px;
          line-height: @40px;
          font-weight: 600;
          position: relative;
          top: @12px;
          margin-bottom: @20px;
          span{
            font-size: @26px;
            position: relative;
            top: -@2px;
            left: @4px;
          }
        }
        .type{
          display: inline-block;
          font-size: @26px;
          line-height: @42px;
          height: @40px;
          width: @120px;
          border-radius: @100px;
          background: #fff;
          color: @red;
        }
      }
      .line{
        margin: 0 @30px;
        width: @1px;
        height: @110px;
        opacity: 0.2;
        background: #fff;
      }
      .nameTime{
        h1{
          font-size:@30px;
          line-height:@42px;
          margin-bottom: @10px;
          .line(2);
          font-weight: bold;
        }
        p{
          font-size:@26px;
          opacity: 0.9;
        }
      }
      .iconfont{
        font-size: @32px;
        margin-left: @18px;
      }
      .squareTips{
        width: @88px;
        height: @38px;
        line-height: @38px;
        text-align: center;
        transform: rotate(-30deg);
        border-radius: @4px;
        border: @3px solid #555;
        font-size: @24px;
        color: #555;
        position: absolute;
        z-index: 2;
        right: @28px;
        bottom: @24px;
      }
    }
    // 折扣券
    &#card2 .ticketInfo{
      background: #f44979;
      .type{
        color: #f44979;
      }
    }
    // 代金券
    &#card3 .ticketInfo{
      background: #dfa76a;
      .type{
        color: #dfa76a;
      }
    }
    // 满减券
    &#card4 .ticketInfo{
      background: #f87b50;
      .type{
        color: #f87b50;
      }
    }
    // 不可以用券
    &.disabled .ticketInfo{
      background: #ccc;
      .type{
        color: #ccc;
      }
    }
    .static{
      // box-shadow: 0px 1px 4px rgba(0,0,0,0.2);
      border-bottom-left-radius: @12px;
      border-bottom-right-radius: @12px;
      background:#fff;
      padding: @20px @28px;
      font-size:@24px;
      color:#999;
      line-height:@22px;
      position: relative;
      span:last-child{
        color: #333;
      }
      .center-between;
      // &:after, &:before{
      //   position: absolute;
      //   display: inline-block;
      //   content: '';
      //   width: @28px;
      //   height: @28px;
      //   background: #f8f8f8;
      //   border-radius: 50%;
      //   top: -@14px;
      // }
      // &:after{
      //   right: -@14px;
      //   // box-shadow: 1px 0px 1px rgba(0,0,0,0.16) inset;
      // }
      // &::before{
      //   left: -@14px;
      //   // box-shadow: -1px 0px 1px rgba(0,0,0,0.16) inset;
      // }
    }
  }
</style>
