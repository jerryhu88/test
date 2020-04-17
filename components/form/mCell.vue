<template>
  <li v-if="show" class="cell" @click="$emit('click')" :class="className">
    <!-- 图标 -->
    <i v-if="icon" class="iconfont icon" :class="icon" :style="{color}"></i>
    <image mode="aspectFill" class="imgIcon" v-if="img" :src="img" alt=""/>
    <div class="text-wrap" :class="{noIcon:!icon && !img}">
      <!-- 主文字 -->
      <h1>{{title}}</h1>
      <star v-if="star !== undefined" :star='star'/>
      <p class="right">
        <span>{{prompt}}</span>
        <i v-if="!readonly" class="iconfont icon-you"></i>
        <img v-if="avatar" :class="{hasAvatar:avatar !== '暂无'}" :src="avatar === '暂无' ? '' : avatar" alt="">
      </p>
    </div>
  </li>
</template>

<script>
import star from './star'

export default {
  data () {
    return {
    }
  },
  props: {
    show: {
      type: Boolean,
      default: true
    },
    avatar: String,
    readonly: Boolean,
    color: String,
    star: Number,
    img: String,
    icon: String,
    title: String,
    text: String,
    prompt: String
  },
  onLoad (options) {
  },
  methods: {
  },
  components: {
    star
  }
}
</script>

<style lang='less' scoped>
@import '../../../src/assets/style/base.less';
  li{
    /deep/.star .icon-full{
      color: #ffd161;
    }
    .flex-center;
    &:active{
      background: #f8f8f8!important;
    }
    .icon{
      margin: 0 @28px 0 @34px;
      font-size: @48px;
    }
    .imgIcon{
      width: @46px;
      height: @46px;
      margin: 0 @28px 0 @34px;
    }
    .text-wrap{
      border-bottom: @1px solid @border;
      display: flex;
      align-items: center;
      width: 100%;
      padding: @34px @30px;
      padding-left: 0;
      position: relative;
      &.noIcon{
        padding-left: @34px;
      }
      h1{
        flex: 1;
        font-size:@32px;
        color:#222222;
        line-height:@30px;
      }
      .right{
        display: flex;
        align-items: center;
        span{
          font-size:@28px;
          color:#aaaaaa;
          line-height:@26px;
          margin-right: @6px;
          text-align: right;
        }
        i{
          color: #d1d1d1;
          font-size: @26px;
          position: relative;
          top: @2px;
          font-weight: bold;
        }
        img{
          width: @62px;
          height: @62px;
          border-radius: 50%;
          position: absolute;
          right: @34px;
          top: 50%;
          transform: translateY(-50%);
          border-radius: 50%;
          border: @1px solid @border;
          background: #f8f8f8;
          &::after{
            width: @62px;
            text-align: center;
            position: absolute;
            display: inline-block;
            content: '暂无';
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: @20px;
            color: #666;
          }
          &.hasAvatar:after{
            content: '';
          }
        }
      }
    }
  }
</style>
