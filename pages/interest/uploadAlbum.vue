<template>
  <div class="uploadAlbum">
    <ul v-if="lists.length" class="lists">
      <li class="vux-1px-b" v-for="(item, index) in lists" :key="index">
        <p>
          <span>{{item.time}}</span>
          <span @click="delGroupAlbum(item)">删除</span>
        </p>
        <h1>{{item.content}}</h1>
        <div class="pics">
          <img @click="preview(pic, index)" mode="aspectFill" v-for="(pic, i) in item.pics" :key="i" :src="pic" alt="">
        </div>
      </li>
    </ul>
    <mNoData v-else msg='暂无相册'/>
    <button class='createAlbum' @click="openPic">发布相册</button>
    <!-- 小组弹窗 -->
    <m-popup v-model="showPic" showClose title='上传小组相册'>
      <div class='popup'>
        <m-upload label='配图' v-model="mess.pictures" :max='6' tips='提示：请上传JPG/PNG/JPEG格式的图片，最多上传6张，用于在兴趣部落列表中展示' module='兴趣机构'/>
        <label class="label">相册标题</label>
        <textarea fixed placeholder="请输入60字以内(必填)" v-model="mess.content" maxlength="60" style="height:76px" :show-confirm-bar='false'/>
        <button @click='uploadPic'>提交</button>
      </div>
    </m-popup>
  </div>
</template>

<script>
import mNoData from '../../components/prompt/mNoData'
import { toast, confirm } from '../../constant/popup'
import mPopup from '../../components/view/mPopup'
import mUpload from '@/components/form/mUpload'
import {getAlbumListApi, subGroupAlbumApi, delGroupAlbumApi} from '../../api/interest/index'
import {dateFilter} from '../../constant/filters'

export default {
  data () {
    return {
      lists: [],
      pictures: [],
      pics: [],
      showPic: false,
      mess: {
        content: '',
        pictures: []
      },
      pages: {
        page: 1,
        pageSize: 10
      },
      hasNextPage: false,
      timer: null
    }
  },
  components: {
    mNoData,
    mPopup,
    mUpload
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
    this.getAlbumList()
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    this.firstPage()
  },
  methods: {
    delGroupAlbum (item) {
      confirm(
        '提示',
        '确认删除该相册吗?',
        '确认',
        () => {
          delGroupAlbumApi(item.serviceID).then(data => {
            toast('none', '删除成功')
            this.firstPage()
          })
        }
      )
    },
    openPic () {
      this.mess = {
        content: '',
        pictures: []
      }
      this.showPic = true
    },
    preview (url, i) {
      wx.previewImage({
        current: url,
        urls: this.lists[i].pics
      })
    },
    firstPage () {
      this.pages.page = 1
      this.getAlbumList()
    },
    // 上传配图
    uploadPic () {
      if (!this.mess.content) {
        return toast('none', '请填写相册标题')
      }
      if (!this.mess.pictures.length) {
        return toast('none', '请上传图片')
      }
      subGroupAlbumApi(this.mess).then(data => {
        toast('success', '上传成功')
        this.getAlbumList()
        this.showPic = false
      })
    },
    getAlbumList () {
      if (this.pages.page === 1) {
        this.lists = []
      }
      getAlbumListApi(this.pages).then(data => {
        data.list.map(item => {
          item.time = dateFilter(item.createTime, 'dateTime')
          item.pics = item.pictures.map(pic => {
            return pic.fileHostName + pic.url
          })
        })
        this.lists = [...this.lists, ...data.list]
        this.hasNextPage = data.hasNextPage
        // 停止下拉刷新
        wx.stopPullDownRefresh()
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import '../../../src/assets/style/base.less';
.uploadAlbum {
  background: #f9f9f9;
  min-height: calc(~'100vh - '@80px);
  padding-bottom: @80px;
  ul{
    background: #fff;
    li{
      padding: @24px;
      &:last-child{
        border-bottom: 0;
      }
      p{
        display: flex;
        justify-content: space-between;
        color: #bbb;
        font-size: @28px;
        margin-bottom: @10px;
        span:last-child{
          color: #ff6633;
          &:active{
            background: #f9f9f9;
          }
        }
      }
      h1{
        font-size: @32px;
        color: #333;
        line-height: 1.3;
      }
      .pics{
        display: flex;
        flex-wrap: wrap;
        img{
          margin-top: @16px;
          width: 31.4%;
          height: @150px;
          margin-right: @20px;
          border-radius: @6px;
          &:nth-child(3n){
            margin-right: 0;
          }
        }
      }
    }
  }
  .createAlbum{
    position: fixed;
    bottom: 0;
    border-radius: 0;
    width: 100%;
  }
  textarea{
    margin-bottom: -@6px;
  }
  .popup{
    padding-top:@12px;
    button{
      margin: @30px auto;
      width: 92%;
    }
  }
}
</style>
