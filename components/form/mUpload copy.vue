<template>
  <div class="uploader" :class="{border}">
    <label v-if="label" class="label">{{label}}</label>
    <!-- 小图 -->
    <ul v-if="type === 'small'" class="smallImg">
      <li v-for="(item, index) in value" :key="index" @click="chooseImage(index)">
        <image :src="item" mode="aspectFill" />
        <i class="iconfont icon-del" @click.stop="deleteImg(index)"></i>
      </li>
      <li v-if="value.length < max" :key="index" @click="chooseImage('new')">
        <i class="iconfont icon-add"></i>
      </li>
    </ul>
    <div v-if="type === 'big'" class="bigImg" @click="chooseImage()">
      <image v-if="!value" :src="defaultImg"/>
      <image class="img" v-else :src="value" mode="aspectFill" />
      <div v-if="!value" class="add">
        <i class="iconfont icon-add"></i>
      </div>
    </div>
    <p v-if="tips" class="tips">{{tips}}</p>
  </div>
</template>

<script>
import {defData, UPLOAD_MODULE} from '../../constant'
export default {
  data () {
    return {
      files: [''],
      defData,
      firstInit: true
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
    border: Boolean,
    className: String,
    value: {
      type: String,
      default () {
        return ''
      }
    },
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
      default: 10
    },
    width: {
      type: Number,
      default () {
        return -1
      }
    },
    height: {
      type: Number,
      default () {
        return -1
      }
    }
  },
  onLoad () {
    Object.assign(this.$data, this.$options.data())
  },
  methods: {
    chooseImage (index) {
      let that = this
      that.files = JSON.parse(JSON.stringify(this.value))
      wx.chooseImage({
        count: that.count, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          // 限制大小
          let size = res.tempFiles[0].size
          if (size > that.maxSize * 1024 * 1024) {
            wx.showToast({
              title: `只支持${that.maxSize}M以内大小的文件`,
              icon: 'none',
              mask: true
            })
            return
          }
          wx.showLoading({
            title: '上传中…',
            mask: true
          })
          wx.uploadFile({
            url: defData.uploadUrl(UPLOAD_MODULE[that.module], that.width, that.height), // 仅为示例，非真实的接口地址
            filePath: res.tempFilePaths[0],
            name: 'file',
            formData: {
              'user': 'test'
            },
            success (res) {
              if (that.type === 'small') {
                if (index === 'new') { // 上传新图
                  that.files.push(JSON.parse(res.data).data.url)
                } else { // 替换图片
                  that.files.splice(index, 1, JSON.parse(res.data).data.url)
                }
                that.$emit('input', that.files)
              } else {
                that.$emit('input', JSON.parse(res.data).data.url)
              }
              wx.hideLoading()
            }
          })
        },
        fail: function (res) {
          that.$emit('upLoadFail', res)
          // 修改提交记录
        },
        complete: function (res) {
          that.$emit('upLoadComplete', res)
        }
      })
    },
    deleteImg (index) { // 删除图片
      this.files.splice(index, 1)
      this.$emit('input', this.files)
    }
  }
}
</script>

<style lang='less' scoped>
@import '../../../src/assets/style/base.less';
.uploader{
  &.border{
    border-top: @1px solid #e1e1e1;
  }
  padding: @28px;
  .tips{
    font-size:@24px;
    color:@red;
    line-height:@32px;
  }
  .label{
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
    width:100%;
    height:@348px;
    padding: 0 @24px;
    box-sizing: border-box;
    position: relative;
    border-radius: @8px;
    image{
      width: 100%;
      height: 100%;
      border-radius: @8px;
      &.img{
        &::after{
          display: none;
          content: '';
          position: absolute;
          left: @24px;
          right: @24px;
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
      top: calc(50% - 50rpx);
      left: calc(50% - 50rpx);
      background: #ff6633;
      box-shadow:0 5rpx 11rpx 0 rgba(249,86,68,0.42);
      width:@100px;
      height:@100px;
      border-radius:100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .icon-add{
        font-size: @68px;
        font-weight: 600;
        color: #fff;
        line-height: @100px;
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