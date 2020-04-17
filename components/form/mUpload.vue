<template>
  <div class="uploader" :class="{border}">
    <label v-if="label" class="label" :class='{noMust}'>{{label}}</label>
    <!-- 小图 -->
    <ul v-if="type === 'small' && max > 1" class="smallImg">
      <li v-for="(item, index) in value" :key="index" @click="chooseImage(index)">
        <img v-if="uploadType === 'attachment'" src="../../assets/images/word.png" alt="">
        <image v-else-if="item" :src="Config.uploadUrl + item.url" mode="aspectFill" />
        <i v-if="item.url" class="iconfont icon-del" @click.stop="deleteImg(index)"></i>
      </li>
      <li @click="chooseImage" v-if="value.length < max">
        <i class="iconfont icon-add"></i>
      </li>
    </ul>
    <!-- 小图 -->
    <ul v-else-if="max === 1" class="smallImg">
      <li @click="chooseImage">
        <image v-if="value" :src="Config.uploadUrl + value" mode="aspectFill" />
        <i v-if="!value" class="iconfont icon-add"></i>
      </li>
    </ul>
    <div v-if="type === 'big'" class="bigImg" @click="chooseImage()">
      <image v-if="!value" :src="defaultImg"/>
      <image class="img" v-else :src="Config.uploadUrl + value" mode="aspectFill" />
      <div v-if="!value" class="add">
        <i class="iconfont icon-add"></i>
      </div>
    </div>
    <p v-if="tips" class="tips">{{tips}}</p>
  </div>
</template>

<script>
import {defData, UPLOAD_MODULE} from '../../constant'
import Config from '../../config/index'
import { toast } from '../../constant/popup'

export default {
  data () {
    return {
      tempFiles: [], // 临时文件路径数组
      currentI: 0, // 当前正在上传的文件下标
      Config,
      defData
    }
  },
  props: {
    // 大图还是小图
    type: {
      type: String,
      default () {
        return 'small'
      }
    },
    noMust: Boolean,
    uploadType: String,
    border: Boolean,
    value: String,
    label: String,
    tips: String,
    module: String,
    defaultImg: String,
    max: {
      type: Number,
      default: 10
    },
    maxSize: {
      type: Number,
      default: 3
    },
    width: {
      type: Number,
      default: -1
    },
    height: {
      type: Number,
      default: -1
    }
  },
  onLoad () {
    Object.assign(this.$data, this.$options.data())
  },
  methods: {
    // 选择图片或附件
    chooseImage (index) {
      let that = this
      // 上传附件
      if (this.uploadType === 'attachment') {
        wx.chooseMessageFile({
          count: that.max,
          type: 'file',
          success (res) {
            that.tempFiles = res.tempFiles
            that.uploadIng(that.tempFiles[that.currentI], index)
          }
        })
      // 上传纯图片
      } else {
        wx.chooseImage({
          count: that.max, // 默认9
          sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            that.tempFiles = res.tempFiles
            that.uploadIng(that.tempFiles[that.currentI], index)
          }
        })
      }
    },
    // 上传中…
    uploadIng (tempFile, index) {
      let that = this
      // 限制大小
      if (tempFile.size > that.maxSize * 1024 * 1024) {
        that.tempFiles = []
        that.currentI = 0
        wx.hideNavigationBarLoading()
        toast('none', `只支持${that.maxSize}M以内大小的文件`)
        return
      }
      wx.showLoading({
        title: '上传中…',
        mask: true
      })
      wx.showNavigationBarLoading()
      wx.uploadFile({
        url: defData.uploadUrl(UPLOAD_MODULE[that.module], that.width, that.height), // 仅为示例，非真实的接口地址
        filePath: tempFile.path,
        name: 'file',
        formData: {
          'user': 'test'
        },
        success (res) {
          that.success(index, JSON.parse(res.data).data.relativePath)
        },
        complete () {
          // 若为为多图则自动继续上传
          if (that.currentI < that.tempFiles.length - 1) {
            that.currentI++
            that.uploadIng(that.tempFiles[that.currentI], index)
          } else {
            that.tempFiles = []
            that.currentI = 0
            wx.hideNavigationBarLoading()
            wx.hideLoading()
          }
        }
      })
    },
    success (index, url) {
      if (this.type === 'small' && this.max > 1) {
        let files = this.value
        if (typeof index === 'number') {
          files.splice(index, 1, url ? {url} : '')
        } else {
          files.push({url})
        }
        this.$emit('input', files.filter(item => item))
      } else {
        this.$emit('input', url)
      }
    },
    deleteImg (index) {
      this.success(index, '')
    }
  }
}
</script>

<style lang='less' scoped>
@import '../../../src/assets/style/base.less';
.uploader{
  padding: 0 0 @28px @28px;
  .tips{
    padding-right:@28px;
    font-size:@24px;
    color:@red;
    line-height:@32px;
  }
  .label{
    color: #000;
    padding: 0 0 @28px 0;
  }
  // 小图
  .smallImg{
    display: flex;
    flex-wrap: wrap;
    li{
      background:#f8f8f8;
      border-radius:@6px;
      width:@208px;
      height:@208px;
      position: relative;
      margin-bottom: @24px;
      .icon-add{
        font-size: @120px;
        color: #aaa;
        text-align: center;
        line-height: @208px;
      }
      image{
        width: 100%;
        height: 100%;
        border-radius: @6px;
      }
      .icon-del {
        position:absolute;
        width:@40px;
        height:@40px;
        font-size:@40px;
        color:#ff6633;
        right:-@18px;
        top:-@18px;
        border-radius:@40px;
        z-index:5;
        line-height:@40px;
        &:active{
          color: #d14232;
        }
        &:after{
          z-index: -1;
          content: '';
          position: absolute;
          display: inline-block;
          background: #fff;
          width: @20px;
          height: @20px;
          left: 50%;
          top: 50%;
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }
      }
      &:not(:nth-child(3n)){
        margin-right: @35px;
      }
      &:active{
        background: #e9e9e9;
      }
    }
  }
  .bigImg{
    width:@334px;
    height:@188px;
    box-sizing: border-box;
    position: relative;
    border-radius: @8px;
    background-color: #f8f8f8;
    image{
      width: 100%;
      height: 100%;
      border-radius: @8px;
      &.img{
        &::after{
          display: none;
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          border-radius: @8px;
          z-index: 2;
          background: rgba(0, 0, 0, 0.3);
        }
        &:active::after{
          display: inline-block;
        }
      }
    }
    .add{
      position: absolute;
      top: 0;
      left: 0;
      top: calc(50% - 38rpx);
      left: calc(50% - 38rpx);
      background: #ff6633;
      box-shadow:0 5rpx 11rpx 0 rgba(249,86,68,0.42);
      width:@76px;
      height:@76px;
      border-radius:100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .icon-add{
        font-size: @50px;
        font-weight: 600;
        color: #fff;
        line-height: @100px;
        margin-left: @4px;
        margin-top: @4px;
      }
    }
    &:active{
       .add{
        background: #d14232;
      }
      .icon-add{
        color: #ddd;
      }
    }
  }
}
</style>