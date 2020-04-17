<template>
  <div class="lawerInfo">
    <div class="avatar">
      <div>
        <img :src="detail.avatar" alt="">
      </div>
      <div class="name">
        <h1>{{detail.uname}}</h1>
        <span>{{detail.sex === 1 ? '男' : '女'}}</span>
      </div>
      <button @click="phone(detail.phone)">
        <i class="iconfont icon-boda"></i>
        <span>{{detail.phone}}</span>
      </button>
    </div>
    <div class="info">
      <h2 class="labelTitle">擅长类型</h2>
      <div v-if="detail.labels.length" class="labels">
        <label v-for="(item, i) in detail.labels" :key="i">{{item.labelName}}</label>
      </div>
      <div v-else class="labels">
        <label>暂未完善</label>
      </div>
      <h2>服务范围</h2>
      <article>{{detail.disposeScope || '暂未完善'}}</article>
      <h2>受理案件情况</h2>
      <div class="stat" v-if="detail.statisticsCase">
        <nav class="title">案件总数 <span>{{detail.statisticsCase.total}}</span>件</nav>
        <div>
          <p>
            <span>待受理</span>
            <span>受理中</span>
            <span>已结案</span>
          </p>
          <p>
            <span>{{detail.statisticsCase.toBeCount}}</span>
            <span>{{detail.statisticsCase.doingCount}}</span>
            <span>{{detail.statisticsCase.overCount}}</span>
          </p>
        </div>
      </div>
      <h2>律师简介</h2>
      <article>{{detail.intro || '暂未完善'}}</article>
    </div>
    <div class="btn">
      <button @click="loginout">注销</button>
    </div>
  </div>
</template>

<script>
  import {confirm, toast} from '../../../constant/popup'
  import {getLawerInfoApi, logOutLawerInfoApi} from '../../../api/law/index'

  export default {
    data () {
      return {
        detail: {
          labels: []
        },
        serviceID: ''
      }
    },
    onLoad (options) {
      Object.assign(this.$data, this.$options.data())
      this.serviceID = options.serviceID
      this.getInfo()
    },
    methods: {
      getInfo () {
        getLawerInfoApi(this.serviceID).then(data => {
          this.detail = data
        })
      },
      phone (phoneNumber) {
        wx.makePhoneCall({
          phoneNumber
        })
      },
      loginout () {
        confirm(
          '提示',
          '确认注销该律师吗？',
          '确定',
          () => {
            logOutLawerInfoApi(this.serviceID).then(data => {
              toast('success', '已注销')
              this.$router.back()
            })
          }
        )
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../../../assets/style/base.less';
  .lawerInfo {
    background-color: #f8f8f8;
    min-height: 100vh;
    .avatar{
      background: #fff;
      display: flex;
      align-items: center;
      padding: @50px;
      font-size: 0;
      img{
        width: @80px;
        height: @80px;
        margin-right: @20px;
        border-radius: 50%;
      }
      .name{
        flex: 1;
        h1{
          font-size: @34px;
          color: #000;
          font-weight: bold;
          margin-bottom: @10px;
        }
        span{
          font-size: @26px;
          color: #999;
        }
      }
      button{
        width: @218px;
        height: @62px;
        line-height: @62px;
        font-size: @24px;
        opacity: 0.9;
        span{
          color: #fff;
        }
        .iconfont{
          font-size: @24px;
          margin-right: @6px;
        }
      }
    }
    .info{
      margin-top: @20px;
      background: #fff;
      padding: @30px;
      h2{
        font-size: @30px;
        color: #333;
        font-weight: bold;
        margin-bottom: @20px;
        margin-top: @40px;
        &.labelTitle{
          margin-top: 0;
        }
      }
      .labels{
        display: flex;
        label{
          border-radius: @6px;
          line-height: @50px;
          height: @50px;
          color: #666;
          font-size: @26px;
          padding: 0 @20px;
          margin-right: @20px;
          border: @1px solid #ccc;
        }
      }
      article{
        font-size: @26px;
        color: #666;
      }
      .stat{
        border: @1px solid #eee;
        div,nav{
          padding: @40px;
        }
        nav{
          font-size: @26px;
          color: #333;
          border-bottom: @1px solid #eee;
          span{
            font-size: @40px;
            font-weight: bold;
            color: #000;
            margin-left: @10px;
          }
        }
        div{
          p{
            display: flex;
            justify-content: space-between;
            &:first-child{
              margin-bottom: @20px;
              span{
                font-size: @24px;
                color: #999;
                display: flex;
                align-items: center;
                &::before{
                  display: inline-block;
                  content: '';
                  width: @10px;
                  height: @10px;
                  border-radius: 50%;
                  margin-right: @8px;
                }
                &:first-child:before{
                  background:#03baad; 
                }
                &:nth-child(2):before{
                  background:#ff972e; 
                }
                &:nth-child(3):before{
                  background:#fe5d55; 
                }
              }
            }
            &:last-child{
              font-size: @40px;
              font-weight: bold;
              color: #000;
              span{
                width: @100px;
                text-align: center;
                display: inline-block;
              }
            }
          }
        }
      }
    }
    .btn{
      border-top: @1px solid @border;
      background: #fff;
      position: fixed;
      bottom: 0;
      width: 100%;
      padding: @30px;
      button{
        background: #fff;
        color: #ff6633;
        border: @1px solid;
        width: calc(~'100% - '@60px);
        margin: 0;
      }
    }
  }
</style>
