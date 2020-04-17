<template>
  <div class="merchant">
    <div class="merchantInfo">
      <div class="storeImg">
        <img mode="aspectFill" :src="organInfo.fileHostName + organInfo.logo" alt="">
      </div>
      <div class="storeInfo">
        <h1>{{organInfo.simpleName}}</h1>
        <p class="from">{{organInfo.fullName}}</p>
        <div class="score">
          <star :star='organInfo.staring'/>
          <span>好评度{{organInfo.goodRatio}}%</span>
        </div>
      </div>
    </div>
    <p class="tips">提示：星级由商家所属工会后台设置，好评度由福利业务产生评价后系统自动触发好评机制！</p>
    <div class="comment">
      <h1 class="title">用户评价</h1>
      <div class="total">
        <button @click="select('')" :class="{selected: queryType === ''}">全部({{organInfo.total}})</button>
        <button @click="select(1)" :class="{selected: queryType === 1}">好评({{organInfo.good}})</button>
        <button @click="select(2)" :class="{selected: queryType === 2}">中评({{organInfo.center}})</button>
        <button @click="select(3)" :class="{selected: queryType === 3}">差评({{organInfo.poor}})</button>
      </div>
      <ul v-if="lists.length" class="comment-detail">
        <li v-for="(item,index) in lists" :key="index">
          <div class="person-info">
            <div class="head">
              <img mode="aspectFill" :src="item.avatar" alt="">
            </div>
            <div class="info">
              <div class="name">
                <h3>{{item.nickname}}</h3>
                <p>{{item.time}}</p>
              </div>
              <p class="starDel">
                <star :star='item.staring'/>
                <span class="del" @click="del(item.serviceID)">删除</span>
              </p>
            </div>
          </div>
          <div class="comment-text vux-1px-b">
            <article v-if="item.contents" class="text">{{item.contents}}</article>
            <div v-if="item.pictures.length" class="images">
              <img mode="aspectFill" v-for="(pic, i) in item.pictures" :key="i" @click="preview(i, item.pictures)" :src="pic.fileHostName + pic.url" alt="">
            </div>
            <label>{{item.boonName}}</label>
          </div>
        </li>
      </ul>
      <m-noData v-else-if="showNoData" msg='暂无评价'/>
    </div>
  </div>
</template>

<script>
  import star from '../../components/form/star'
  import {getOrganGradeApi, getCommentApi, delCommentApi} from '../../api/welfareCenter/index'
  import mNoData from '../../components/prompt/mNoData'
  import {dateFilter} from '../../constant/filters'
  import {confirm, toast} from '../../constant/popup'
  export default {
    components: {
      star, mNoData
    },
    data () {
      return {
        showNoData: false,
        lists: [],
        hasNextPage: false,
        pages: {
          page: 1,
          pageSize: 10
        },
        organInfo: {},
        allLists: [],
        list: [],
        serviceID: '',
        queryType: ''
      }
    },
    onPullDownRefresh () {
      this.firstPage()
    },
    // 上拉加载，拉到底部触发
    onReachBottom () {
      if (!this.hasNextPage) return
      // 到这底部在这里需要做什么事情
      this.pages.page++
      this.getComment()
    },
    onLoad (options) {
      Object.assign(this.$data, this.$options.data())
      wx.startPullDownRefresh()
    },
    methods: {
      dateFilter,
      select (queryType) {
        this.queryType = queryType
        this.firstPage()
      },
      firstPage () {
        this.pages.page = 1
        this.getOrganGrade()
        this.getComment()
      },
      preview (i, pics) {
        let urls = pics.map(pic => {
          return pic.fileHostName + pic.url
        })
        wx.previewImage({
          current: urls[i],
          urls
        })
      },
      // 信誉
      getOrganGrade () {
        getOrganGradeApi(this.serviceID).then(data => {
          this.organInfo = data
        })
      },
      // 评价
      getComment () {
        this.pages.kv = {
          queryType: this.queryType
        }
        if (this.pages.page === 1) {
          this.lists = []
        }
        getCommentApi(this.pages).then(data => {
          data.list.map(item => {
            item.time = this.dateFilter(item.createTime, 'simpleTime')
          })
          this.lists = [...this.lists, ...data.list]
          this.hasNextPage = data.hasNextPage
          // 停止下拉刷新
          wx.stopPullDownRefresh()
          this.showNoData = !data.total
        })
      },
      del (serviceID) {
        confirm(
          '提示',
          '确认删除该条评价吗？(一个月内只能删除三条评价)',
          '确定',
          () => {
            delCommentApi(serviceID).then(data => {
              toast('none', '删除成功')
              this.firstPage()
            })
          }
        )
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../../src/assets/style/base.less';
  .merchant{
    background: #f8f8f8;
    overflow: hidden;
    min-height: 100vh;
    .merchantInfo {
      background: #fff;
      padding: @24px;
      padding-bottom: 0;
      display: flex;
      .storeImg {
        height: @130px;
        margin-right: @24px;
        position: relative;
        img {
          border-radius: @4px;
          width: @130px;
          height: @130px;
        }
      }
      .storeInfo {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: @130px;
        padding-top: @4px;
        /deep/.star .icon-full{
          color: #ffd161;
        }
        span{
          font-size:@24px;
          color:#aaaaaa;
          margin-right: @2px;
        }
        h1 {
          font-size: @30px;
          color: #222222;
          line-height: @30px;
          margin-right: @10px;
        }
        .from{
          font-size:@26px;
          color:#666666;
          position: relative;
          top: @4px;
        }
        .score{
          display: flex;
          align-items: center;
          span{
            margin-left: @18px;
          }
        }
      }
    }
    .tips{
      padding: @20px @24px @24px;
      margin-bottom: @10px;
      background: #fff;
      font-size:@26px;
      color:#666666;
    }
    // 评论
    .comment{
      background: #fff;
      padding-bottom: 0;
      .title{
        padding: @28px @24px;
        font-size:@34px;
        color:#222222;
        line-height:@34px;
        flex: 1;
        font-weight: 600;
      }
      // 评论
      .total{
        padding: 0 @24px @30px;
        display: flex;
        align-items: center;
        button{
          flex: 1;
          background:#f6f6f6;
          border-radius:@100px;
          width:@166px;
          height:@60px;
          font-size:@26px;
          color:#666666;
          line-height:@60px;
          text-align:center;
          &.selected{
            background:#ffefea;
            color:#ff6952;
          }
          &:not(:last-child){
            margin-right: @10px;
          }
        }
      }
      .comment-detail{
        padding: 0 @24px;
        >li{
          padding-top: @24px;
          .person-info{
            display: flex;
            align-items: center;
            margin-bottom: @14px;
            .head{
              height:@80px;
              img{
                width:@80px;
                height:@80px;
                border-radius:100%;
              }
            }
            .info{
              flex: 1;
              margin-left: @16px;
              height:@80px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              .name{
                display: flex;
                align-items: center;
                margin-bottom: @16px;
                h3{
                  font-size:@26px;
                  color:#496c8c;
                  line-height:@26px;
                  flex: 1;
                }
                h3+p{
                  font-size:@24px;
                  color:#aaaaaa;
                  line-height:@24px;
                }
              }
              .starDel{
                display: flex;
                align-items: center;
                justify-content: space-between;
                span{
                  font-size:@26px;
                  color:@red;
                  &:active{
                    background: #f8f8f8;
                  }
                }
              }
            }
          }
          .comment-text{
            margin-left: @96px;
            padding-bottom: @24px;
            .text{
              font-size:@28px;
              color:#222222;
              line-height:@38px;
              margin-bottom: @16px;
            }
            .images{
              display: flex;
              flex-wrap: wrap;
              margin-bottom: @4px;
              img{
                margin-bottom: @12px;
                border: @1px solid #e1e1e1;
                border-radius: @4px;
                width: @190px;
                height: @190px;
                &:not(:nth-child(3n)){
                  margin-right: @12px;
                }
              }
            }
            label{
              display: inline-block;
              background:#ffefea;
              color:#ff6952;
              font-size: @20px;
              padding: @4px @10px;
              border-radius: @4px;
            }
          }
          &:last-child .vux-1px-b{
            border: 0;
          }
        }
      }
    }
    /deep/.noData{
      min-height: auto;
      image{
        margin-top: @200px;
      }
    }
  }
</style>
