<script>
import '../src/assets/style/iconfont.css'
import {mapActions} from 'vuex'
// import Config from './config/index'
export default {
  data () {
    return {
      globalData: {
        userInfo: null,
        navHeight: 0
      }
    }
  },
  methods: {
    ...mapActions(['getMine'])
  },
  onLaunch (options) {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      if (res.hasUpdate) {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          showCancel: false, // 是否显示取消按钮,
          success: function (res) {
            if (res.confirm) {
              updateManager.onUpdateReady(function () {
                // 清楚缓存
                wx.clearStorageSync()
                updateManager.applyUpdate()
              })
              updateManager.onUpdateFailed(function () {
                wx.showModal({
                  title: '已经有新版本了哟~',
                  content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
                })
              })
            }
          }
        })
      }
    })
    // 进入首页不请求
    if (this.$mp.appOptions.path === 'pages/serviceIndex/index') return
    this.getMine()
  }
}
</script>
<style lang='less'>
@import '../src/assets/style/base.less';
img{
  transition: all linear .3;
}
// 表单label样式
.label{
  font-size:@28px;
  color:#000;
  line-height:@28px;
  display: flex;
  align-items: center;
  padding: @28px;
  padding-top: 0;
  &::before{
    margin-right: @16px;
    display: inline-block;
    content: '*';
    color: @red;
    background:transparent;
    border-radius:@2px;
    width:@8px;
    height:@26px;
  }
  &.noMust::before{
    display: none;
  }
}
// 带右箭头选择框
input.select{
  position: relative;
  box-sizing: border-box;
  height: @72px;
  padding: 0 @54px 0 @20px;
  margin: @28px;
  margin-top: 0;
  border-radius:@6px;
  width:100%;
  background: #f8f8f8;
  font-size:@26px;
  line-height:@26px;
  color:#222222;
  width: calc(~'100% - '@56px);
  &:active{
    background: #eee;
  }
  &:after{
    display: inline-block;
    content: "\e62d";
    position: absolute;
    right: @14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: @28px;
    color: #929292;
  }
  &.disabled{
    background: #eee;
    &::after{
      display: none;
    }
  }
}
button::after{
  border: none;
}
*, div{
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.vux-1px-b{
  border-bottom: 1rpx solid #e1e1e1;
}
.vux-1px-t{
  border-top: 1rpx solid #e1e1e1;
}
button{
  position: relative;
  border: 0;
  background:#ff6633;
  border-radius:@6px;
  width:100%;
  height:@80px;
  font-size:@30px;
  color:#ffffff;
  line-height:@80px;
  outline: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  &#radius{
    border-radius: @100px;
  }
  &:active{
    &::after{
      display: inline-block;
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      border-radius:@6px;
      background: rgba(0, 0, 0, 0.15);
    }
  }
  &[disabled]:active:after{
    display: none;
  }
}
button[disabled]{
  opacity: 0.7;
  background:#ff6633;
  color:#ffffff;
}
button[radius]{
  border-radius: @100px;
}
</style>