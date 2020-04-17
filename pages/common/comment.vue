<template>
  <div class="comment-wrap">
    <h1 v-if="lists.length" class='vux-1px-b'>活动：{{title}}</h1>
    <ul v-if="lists.length" class="comment-lists">
      <li class="comment-list" v-for="(item, i) in lists" :key="i">
        <div class="headImg">
          <img :src="item.avatar"/>
        </div>
        <div class="comment-content">
          <div class="top">
            <h3>{{item.nickname}}</h3>
            <div class="time">
              <span>{{item.createTime}}</span>
              <p v-if="item.replyStatus == 1">已回复</p>
              <p v-else class="answer" @click="showTextarea(item)">
                <i class="iconfont icon-comment"></i>
                <span>回复Ta</span>
              </p>
            </div>
          </div>
          <p class='content' v-html="item.content"></p>
          <!-- 作者回复 -->
          <div class='writer' v-if="item.replyContent">
            <div class="name">
              <h3>机构回复：</h3>
              <span>{{item.replyTime}}</span>
            </div>
            <p class='content' v-html="item.replyContent"></p>
          </div>
        </div>
      </li>
    </ul>
    <m-noData v-else-if="showNoData" msg='暂无评论'/>
    <m-popup v-model="show" :bottom='bottom' showNav :title="'回复@' + name" confirmText='发送' :radius='false' @onConfirm='onConfirm' :autoClose='false'>
      <div class="answer-wrap">
        <textarea @focus='focus' @blur='blur' fixed :cursor-spacing='500' :adjust-position='false' v-if="show" auto-focus placeholder="请输入回复内容" v-model="replyContent" :show-confirm-bar='false'/>
      </div>
    </m-popup>
  </div>
</template>

<script>
import mPopup from '@/components/view/mPopup'
import {getCommentListApi, sendCommentApi} from '../../api/common/index'
import {dateFilter} from '../../constant/filters'
import mNoData from '../../components/prompt/mNoData'
import { toast } from '../../constant/popup'

export default {
  data () {
    return {
      showNoData: false,
      bottom: 0,
      name: '',
      title: '',
      replyContent: '',
      show: false,
      pages: {
        page: 1,
        pageSize: 10
      },
      lists: [],
      hasNextPage: false,
      serviceID: '',
      types: {
        // 婚恋
        love: {
          list: '/love/listActivityNote',
          send: '/love/addActivityNoteReply'
        },
        // 兴趣
        interest: {
          list: '/interest/activity/noteList',
          send: '/interest/activity/noteReplyt'
        }
      },
      faceId: ''
    }
  },
  components: {
    mNoData, mPopup
  },
  onPullDownRefresh () {
    this.timer = setTimeout(() => {
      this.firstPage()
      clearTimeout(this.timer)
    }, 500)
  },
  // 上拉加载，拉到底部触发
  onReachBottom () {
    if (!this.hasNextPage) return
    // 到这底部在这里需要做什么事情
    this.pages.page++
    this.getList()
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    this.type = options.type // 评论模块
    this.title = options.title
    this.serviceID = options.serviceID
    this.getList()
  },
  methods: {
    dateFilter,
    focus (e) {
      this.bottom = e.target.height + 'px'
    },
    blur () {
      this.bottom = 0
    },
    showTextarea (item) {
      this.name = item.nickname
      this.faceId = item.serviceID
      this.replyContent = ''
      this.show = true
    },
    onConfirm () {
      if (!this.replyContent) {
        return toast('none', '请输入回复内容')
      }
      sendCommentApi(this.types[this.type].send, {replyContent: this.replyContent, serviceID: this.faceId}).then(data => {
        this.firstPage()
        toast('success', '回复成功')
        this.show = false
      })
    },
    firstPage () {
      this.pages.page = 1
      this.getList()
    },
    getList () {
      this.pages.kv = {
        activityServiceID: this.serviceID
      }
      if (this.pages.page === 1) {
        this.lists = []
      }
      getCommentListApi(this.types[this.type].list, this.pages).then(data => {
        data.list.map(item => {
          item.createTime = this.dateFilter(item.createTime, 'simpleTime')
          item.replyTime = this.dateFilter(item.replyTime, 'simpleTime')
          item.content = item.content.replace(/(\r\n|\n|\r)/gm, '<br />')
          item.replyContent = item.replyContent.replace(/(\r\n|\n|\r)/gm, '<br />')
        })
        this.lists = [...this.lists, ...data.list]
        this.hasNextPage = data.hasNextPage
        // 停止下拉刷新
        wx.stopPullDownRefresh()
        this.showNoData = !data.total
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import "../../assets/style/base.less";
.comment-wrap{
  min-height: 100vh;
  background: #f8f8f8;
  h1{
    font-size:@30px;
    color:#333;
    font-weight:bold;
    padding:@24px;
    background: #fff;
  }
  .comment-lists{
    .comment-list {
      background: #fff;
      padding: @20px @28px 0;
      color: #b1b1b2;
      width: 100%;
      display: flex;
      box-sizing: border-box;
      .headImg{
        margin-right: @20px;
        >img {
          width: @74px;
          height: @74px;
          border-radius:50%;
        }
      }
      .comment-content{
        width: 100%;
        padding-bottom: @20px;
        border-bottom: 1px solid @border;
        .top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          h3{
            font-size:@28px;
            color:#333;
            font-weight: bold;
          }
          .time{
            display: flex;
            align-items: center;
            font-size:@26px;
            color:#aaaaaa;
            line-height:@26px;
            img{
              width: @28px;
              height: @28px;
              margin-right: @7px;
            }
            .del{
              img{
                width: @24px;
                height: @24px;
              }
              margin-left: @14px;
              padding-left: @14px;
              border-left: 1px solid #eee;
            }
            >span{
              padding-right: @14px;
              border-right: 1px solid #eee;
            }
            span+p{
              margin-left: @14px;
              display: flex;
              align-items: center;
              color: #999;
              .iconfont{
                font-size: @34px;
                margin-right: @6px;
                position: relative;
                top: @2px;
              }
              &.answer:active{
                background: #f8f8f8;
              }
            }
          }
        }
        .content {
          margin-top: @12px;
          font-size:@26px;
          color:#333;
          line-height:@42px;
          word-break: break-all;
        }
        .writer{
          background: #f8f8f8;
          padding: @10px @18px;
          border-radius: @4px;
          margin-top: @12px;
          .name{
            display: flex;
            align-items: center;
            margin-bottom: @8px;
            h3{
              font-size:@28px;
              color:#ff8f6a;
              font-weight: bold;
              margin-top: @6px;
              flex: 1;
            }
            span{
              font-size: @26px;
            }
          }
          .content{
            padding: 0;
            margin: 0;
          }
        }
      }
    }
    .comment-list:last-of-type{
      padding-bottom: 0;
      .comment-content{
        border-bottom: 0;
      }
    }
  }
  .answer-wrap{
    width: 100%;
    textarea{
      margin-top: @28px;
      border: 1px solid #e1e1e1;
    }
  }
}
</style>
