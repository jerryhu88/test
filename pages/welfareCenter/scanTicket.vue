<template>
  <div class="scanTicket">
    <ul class="lists">
      <li class="list vux-1px-b" v-for="(item, index) in ticketLists" :key="index">
        <div>
          <h2>{{item.boonName}}</h2>
          <span class="useNum" v-if="item.overlapUse">可叠加{{item.overlapNum}}张</span>
          <span v-else class="useNum">不可叠加</span>
          <p @click="del(i)">
            <span>1张</span>
            <i class="iconfont icon-filldel" :class="{disabled:ticketLists.length === 1}"></i>
          </p>
        </div>
        <div>
          <span class="code">券码：{{item.qrcode}}</span>
          <span @click="display(index)" class="useInfo">查看使用条件<i class="iconfont icon-icon_more" :class="{display:item.display}"></i></span>
        </div>
        <ul v-show="item.display" class="ticketInfo">
          <li>
            <h2>券类型</h2>
            <span>{{types[item.type]}}</span>
          </li>
          <li v-if="item.type !== 1 && item.type !== 3">
            <h2>使用条件</h2>
            <span v-if="item.type === 2">满{{item.boonUseDetails[0].reachSum}}可使用</span>
            <span v-if="item.type === 4">
              <i v-for="(term, i) in item.boonUseDetails" :key="i">满{{term.reachSum}}减{{term.reduceNum}}元<i>、</i></i>
            </span>
          </li>
          <li>
            <h2>有效期</h2>
            <span>{{item.startTime}} 至 {{item.endTime}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <button v-if="ticketLists.length && ticketLists[0].overlapUse && ticketLists[0].overlapNum > ticketLists.length" class="add" @click="scan">添加券</button>
    <div class="btns vux-1px-t">
      <button @click="$router.back()">取消核销</button>
      <button @click="verifyTicket">确认核销</button>
    </div>
  </div>
</template>

<script>
import mButton from '../../components/form/mButton'
// import { confirm } from '../../constant/popup'
import {dateFilter} from '../../constant/filters'
import mPopup from '../../components/view/mPopup'
import {getTicketInfoApi, verifyTicketApi} from '../../api/welfareCenter/index'
import { toast, confirm } from '../../constant/popup'

export default {
  data () {
    return {
      types: {
        1: '兑换券',
        2: '折扣券',
        3: '代金券',
        4: '满减券'
      },
      ticketLists: [],
      codes: []
    }
  },
  computed: {
  },
  components: {
    mButton,
    mPopup
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    this.getTicketInfo(options.firstCode)
  },
  methods: {
    dateFilter,
    del (i) {
      if (this.ticketLists.length === 1) {
        return toast('none', '至少保留一张券')
      }
      confirm(
        '提示',
        '确认删除该券？',
        '确认',
        () => {
          this.codes.splice(i, 1)
          this.ticketLists.splice(i, 1)
        }
      )
    },
    display (i) {
      this.ticketLists[i].display = !this.ticketLists[i].display
    },
    getTicketInfo (code) {
      getTicketInfoApi(code).then(data => {
        if (this.codes.includes(data.verificationCode)) {
          toast('none', '该券已添加')
        } else {
          this.codes.push(data.verificationCode)
          this.ticketLists.push({
            ...data,
            qrcode: data.verificationCode.toUpperCase(),
            boonUseDetails: JSON.parse(data.boonUseDetails),
            display: false,
            startTime: this.dateFilter(data.indateStartTime, 'dateTime'),
            endTime: this.dateFilter(data.indateEndTime, 'dateTime')
          })
        }
      })
    },
    verifyTicket () {
      wx.showLoading({
        title: '核销中…',
        mask: true
      })
      verifyTicketApi(this.ticketLists).then(data => {
        toast('success', '核销成功', () => {
          this.$router.back()
        })
      })
    },
    scan () {
      let that = this
      wx.scanCode({
        success: (res) => {
          that.getTicketInfo(res.result)
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import '../../../src/assets/style/base.less';
  .scanTicket{
    overflow: hidden;
    background: #f8f8f8;
    min-height: 100vh;
    padding-bottom: @148px;
    box-sizing: border-box;
    .lists{
      background: #fff;
      .list{
        padding: @30px;
        >div{
          display: flex;
          align-items: center;
          &:first-child{
            margin-bottom: @18px;
          }
          h2{
            font-size: @32px;
            font-weight: bold;
            color: #333;
            margin-right: @12px;
            max-width: @340px;
            .one-line;
          }
          span{
            font-size: @28px;
            color: #999;
            display: flex;
            &.useNum,&.code{
              flex:1;
            }
          }
          p{
            .flex-center;
          }
          .icon-filldel{
            font-size: @36px;
            color: #ff6633;
            margin-left: @6px;
            &.disabled{
              color: #aaa;
            }
          }
          .useInfo{
            color: #666;
            &:active{
              background: #f8f8f8;
            }
            .flex-center;
            .icon-icon_more{
              font-size: @24px;
              margin-left: @6px;
              transition: all linear 0.2s;
              position: relative;
              top: @1px;
              &.display{
                transform: rotate(90deg);
              }
            }
          }
        }
      }
    }
    .add{
      background: #fff;
      color: @red;
      border: 1px solid;
      width: 80%;
      margin-top: @24px;
    }
    .btns{
      background: #fff;
      position: fixed;
      bottom: 0;
      width: calc(~'100% - '@60px);
      .flex-center;
      padding: @30px;
      button{
        height: @88px;
        line-height: @88px;
        &:first-child{
          margin-right: @30px;
          background: #fff;
          color: #999;
          border: 1px solid #e1e1e1;
        }
      }
    }
    .ticketInfo{
      margin-top: @24px;
      background: #f8f8f8;
      padding: @24px;
      box-sizing: border-box;
      border-radius: @8px;
      li{
        display: flex;
        &:not(:last-child){
          margin-bottom: @12px;
        }
        h2{
          font-size: @28px;
          color: #333;
          width: @150px;
        }
        span{
          font-size: @26px;
          color: #999;
          i{
            display: flex;
            margin-bottom: @4px;
            &:last-child i{
              display: none;
            }
          }
        }
      }
    }
  }
</style>
