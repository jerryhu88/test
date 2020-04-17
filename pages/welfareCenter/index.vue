<template>
  <div class="home-page">
    <div v-if="audit === 2 || audit === 4" class="organIndex">
      <div class="head">
        <img mode="aspectFill" :src="organInfo.fileHostName + organInfo.logo" alt="">
        <div>
          <div class="title">
            <h1>{{organInfo.simpleName}}</h1>
            <i class="iconfont icon-v"></i>
            <span class="percent">好评度{{organInfo.goodRatio || 0}}%</span>
          </div>
          <p class="info">{{organInfo.fullName}}</p>
          <p>入驻平台：{{organInfo.serviceName}}</p>
        </div>
      </div>
      <div class="code-wrap">
        <div class="scan" @click="scanCode">
          <i class="iconfont icon-saoma"></i>
          <span>扫码核销</span>
        </div>
        <!-- 未开发 -->
        <!-- <p class="organCode" @click="showPopup = true"><i class="iconfont icon-code"></i>本店收款二维码</p> -->
        <div class="ticketNum">
          <p>本机构已核销福利券(张)</p>
          <span>{{organInfo.verificationNum || 0}}</span>
        </div>
      </div>
      <ul class="menus" v-if="menus.length">
        <li v-for="(item, i) in menus" :key="i" @click="toUrl(item.url)">
          <m-badge :number='item.badge' v-if="item.badge"/>
          <i class="iconfont" :class="item.icon"></i>
          <h1>{{item.text}}</h1>
        </li>
      </ul>
      <ul class="lists" :class="audit === 4 ? 'adminList' : 'createrList'">
        <m-cell v-for="(item, i) in lists"
        :title='item.title'
        :show='audit === 2 || item.admin === audit'
        @click="toUrl(item.url)"
        :icon="item.icon"
        :color='item.color'
        :star='item.star'
        :prompt='item.prompt'
        :key="i"/>
      </ul>
    </div>
    <!-- 审批中机构 -->
    <div v-if="audit === 1" class="audit">
      <img class="bg" src="../../assets/images/audit.png">
      <p>机构审批中，请您耐心等待…</p>
    </div>
    <!-- 没有机构 -->
    <mNoData v-if="audit === 0" msg='你尚未入驻商家机构' btnText='申请入驻' @click="createOrgan"></mNoData>
    <!-- 二维码弹窗 -->
    <!-- 未开发 -->
    <!-- <m-popup v-model="showPopup" position='center'>
      <div class="popup-content">
        <div class="image">
          <div class="head">
            <img :src="organInfo.logo" alt="">
            <h1 class="title">小龙坎火锅</h1>
            <i class="iconfont icon-v"></i>
          </div>
          <p>南充市总工会指定普惠服务商家</p>
          <img class="code" :src="organInfo.logo" alt="">
          <p class="desc"> 机构福利核销/支付二维码 </p>
        </div>
        <m-button @click="downloadCode" :loading='loading'>{{loading ? '保存中…' : '保存到手机'}}</m-button>
        <p>建议：下载并打印此二维码贴于各门店收银台</p>
      </div>
    </m-popup> -->
    <!-- 画布 -->
    <!-- 未开发 -->
    <!-- <canvas canvas-id="codeCanvas" id='codeCanvas'></canvas> -->
  </div>
</template>

<script>
import mNoData from '../../components/prompt/mNoData'
import mButton from '../../components/form/mButton'
import mCell from '../../components/form/mCell'
import mBadge from '../../components/prompt/mBadge'
import { confirm } from '../../constant/popup'
import mPopup from '../../components/view/mPopup'
import {getOrganIndexInfoApi, logOutOrganApi, getTicketInfoApi} from '../../api/welfareCenter/index'

export default {
  data () {
    return {
      showPopup: false,
      storeState: false, // 是否需要完善总店
      loading: false,
      savedImgUrl: '',
      audit: 0,
      code: '',
      organInfo: {},
      menus: [
        {
          text: '账单',
          url: './billCenter?type=账单',
          icon: 'icon-zhangdan',
          // 未开发
          badge: ''
        },
        {
          text: '福利',
          icon: 'icon-fuli',
          url: './welfareManage'
        },
        {
          text: '门店',
          icon: 'icon-fendian',
          url: './subbranch/list',
          badge: ''
        }
      ],
      lists: [
        {
          title: '用户管理',
          icon: 'icon-yonghu',
          color: '#fd7359',
          url: './nameList?type=total',
          admin: 4
        },
        {
          title: '机构信誉',
          icon: 'icon-xinyu',
          color: '#5bcba7',
          url: 'organGrade',
          star: '',
          admin: 4
        },
        {
          title: '管理员',
          icon: 'icon-guanliyuan',
          color: '#dcac6e',
          url: 'admin',
          admin: 2
        },
        {
          title: '机构认证信息',
          icon: 'icon-jigou',
          color: '#ffb62f',
          url: './creatOrgan?edit=true',
          admin: 2
        },
        // {
        //   title: '机构注销',
        //   icon: 'icon-zhuxiao',
        //   color: '#b08eee',
        //   url: 'writeOff',
        //   admin: 2
        // },
        // 未开发
        //   {
        //     title: '机构转让',
        //     icon: 'icon-zhuanrang',
        //     color: '#44caea',
        //     url: './turnOrgan',
        //     prompt: '转让中'
        //   },
        {
          title: '使用手册',
          icon: 'icon-icon_manual',
          color: '#45cab6',
          url: '../common/help?module=商家机构-使用手册',
          admin: 4
        }
      ]
    }
  },
  components: {
    mNoData,
    mButton,
    mCell,
    mBadge,
    mPopup
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    this.audit = Number(options.audit)
    if (this.audit === 4) {
      this.menus = this.menus.splice(0, 2)
    }
  },
  onShow () {
    if (this.audit === 2 || this.audit === 4) {
      this.getOrganInfo()
    }
  },
  methods: {
    createOrgan () {
      this.$router.replace('./creatOrgan')
    },
    getOrganInfo () {
      getOrganIndexInfoApi().then(data => {
        this.organInfo = data
        if (this.audit === 4) {
          wx.setNavigationBarTitle({ title: `商家机构-${data.loginUsersStoreName}管理员` })
        }
        // 机构信誉星星
        this.lists[1].star = data.staring
        if (data.storeState) {
          this.menus[2].badge = '待完善'
          this.storeState = data.storeState
        } else {
          this.menus[2].badge = ''
          this.storeState = 0
        }
      })
    },
    scanCode () {
      let that = this
      wx.scanCode({
        success: (res) => {
          getTicketInfoApi(res.result).then(data => {
            if (data) {
              that.$router.push(`./scanTicket?firstCode=${res.result}`)
            }
          })
        }
      })
    },
    toUrl (url) {
      // 未完善并且不是进入门店管理且使用手册
      const urls = ['./subbranch/list', './../common/help', './creatOrgan?edit=true', 'writeOff']
      if (this.storeState && !urls.includes(url)) {
        confirm('提示', '请先完善总店信息', '去完善', () => {
          wx.navigateTo({ url: './subbranch/list' })
        })
        return
      }
      switch (url) {
        case 'turn':
          wx.showShareMenu({
            withShareTicket: true
          })
          return
        case 'organGrade':
          wx.navigateTo({ url: `./organGrade?serviceID=${this.organInfo.serviceID}` })
          return
        case 'admin':
          wx.navigateTo({ url: `../welfareCenter/admin/list?type=admin&serviceID=${this.organInfo.serviceID}` })
          return
        case 'writeOff':
          confirm('提示', '注销机构后无法撤销，确认注销吗？', '确定', () => {
            logOutOrganApi().then(data => {
              wx.reLaunch({ url: '../serviceIndex/index' })
            })
          })
          return
        default:
          wx.navigateTo({ url })
      }
    }
    // canvas画图
    // 未开发
    // downloadCode () {
    //   this.loading = true
    //   let that = this
    //   wx
    //     .createSelectorQuery()
    //     .select('#codeCanvas')
    //     .boundingClientRect(function (rect) {
    //       let canvasW = rect.width
    //       // 通过使用wx.getImageInfo这个API来下载一个网络图片到本地（并可获取该图片的尺寸等其他信息），然后调用ctx.drawImage方法将图片绘制到画布上，填满画布
    //       wx.getImageInfo({
    //         src: that.organInfo.logo,
    //         success: res => {
    //           // 常量
    //           const desc = '南充市总工会指定普惠服务商家'
    //           const info = '— 机构福利核销/支付二维码 —'
    //           const vIcon = that.organInfo.logo
    //           // 可变信息
    //           let codeImg = that.organInfo.logo
    //           let headImge = that.organInfo.logo
    //           let name = that.organInfo.simpleName
    //           // 制作画布
    //           const ctx = wx.createCanvasContext('codeCanvas')
    //           ctx.setFillStyle('#fff') // 白色背景
    //           ctx.fillRect(0, 0, 650, 825) // 画布框高 x y w h
    //           // 画头像
    //           const headWH = 50 // 头像的框高
    //           ctx.fillRect(0, 0, headWH, headWH) // 画一个头像的框
    //           let nameX = (canvasW - ctx.measureText(name).width) * 0.5 // 绘制的头像在画布上的X轴位置
    //           let headX = nameX - 60
    //           let headY = 35 // 绘制的头像在画布上的Y轴位置
    //           ctx.beginPath()
    //           ctx.setStrokeStyle('#fff')
    //           ctx.stroke() // 画空心圆
    //           ctx.closePath()
    //           ctx.save()
    //           ctx.arc(
    //             headWH / 2 + headX,
    //             headWH / 2 + headY,
    //             headWH / 2,
    //             0,
    //             Math.PI * 2,
    //             false
    //           )
    //           ctx.clip() // 裁剪上面的圆形
    //           ctx.drawImage(headImge, headX, headY, headWH, headWH)
    //           ctx.restore() // 恢复之前保存的绘图上下文 恢复之前保存的绘图上下午即状态 还可以继续绘制

    //           // 画商家名字
    //           ctx.setFillStyle('#222')
    //           ctx.setFontSize(18) // 字体大小
    //           ctx.fillText(name, nameX, 68) // 用户昵称
    //           // 画V
    //           ctx.drawImage(
    //             vIcon,
    //             nameX + ctx.measureText(name).width + 8,
    //             52,
    //             20,
    //             20
    //           )
    //           // 画'龙泉驿区总工会指定普惠服务商家'
    //           ctx.setFillStyle('#666')
    //           ctx.setFontSize(16) // 字体大小
    //           ctx.fillText(
    //             desc,
    //             (canvasW - ctx.measureText(desc).width) * 0.5,
    //             118
    //           ) // 用户昵称

    //           // 画二维码
    //           let w = 190
    //           let h = 190
    //           let y = 148
    //           let x = (canvasW - 190) * 0.5
    //           let r = 6
    //           ctx.save()
    //           ctx.beginPath()
    //           ctx.setStrokeStyle('#e6e6e6')
    //           ctx.setFillStyle('#e6e6e6')
    //           ctx.setLineWidth(1)
    //           ctx.moveTo(x + r, y)
    //           ctx.arcTo(x + w, y, x + w, y + h, r)
    //           ctx.arcTo(x + w, y + h, x, y + h, r)
    //           ctx.arcTo(x, y + h, x, y, r)
    //           ctx.arcTo(x, y, x + w, y, r)
    //           ctx.stroke()
    //           ctx.closePath()
    //           ctx.drawImage(codeImg, (canvasW - 190) * 0.5, 148, 190, 190)

    //           // 画'机构福利核销/支付二维码'
    //           ctx.setFillStyle('#666')
    //           ctx.setFontSize(14) // 字体大小
    //           ctx.fillText(
    //             info,
    //             (canvasW - ctx.measureText(info).width) * 0.5,
    //             380
    //           ) // 用户昵称

    //           // 保存
    //           ctx.stroke()
    //           ctx.draw()
    //           setTimeout(() => {
    //             // wx.canvasToTempFilePath和wx.saveImageToPhotosAlbum这两个API保存到手机，要的流程就是先通过wx.canvasToTempFilePath将上绘制的图像生成临时文件的形式，然后再通过wx.saveImageToPhotosAlbum进行保存到系统相册的操作。
    //             wx.canvasToTempFilePath({
    //               x: 0,
    //               y: 0,
    //               width: 650,
    //               height: 825,
    //               destWidth: 650,
    //               destHeight: 825,
    //               canvasId: 'codeCanvas',
    //               success: function (res) {
    //                 that.loading = false
    //                 // 保存到手机相册
    //                 wx.saveImageToPhotosAlbum({
    //                   filePath: res.tempFilePath,
    //                   success: res => {
    //                     wx.showToast({
    //                       title: '已保存',
    //                       icon: 'none'
    //                     })
    //                   }
    //                 })
    //               }
    //             })
    //           }, 1000)
    //         }
    //       })
    //     })
    //     .exec()
    // }
    // onShareAppMessage: function (res) {
    //   return {
    //     title: '哈根达斯冰激凌5折特惠',
    //     path: '/pages/index/index?goods_id=' + wx.getStorageSync('goods_id'),
    //     imageUrl: 'http://static.e-mallchina.com/pic/product/brand/detail/hgds.jpg'// 自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4。
    //   }
    // }
  }
}
</script>

<style lang='less' scoped>
@import '../../../src/assets/style/base.less';
canvas {
  // position: absolute;
  // z-index: -1;
  width: @650px;
  height: @825px;
}
.home-page {
  background: #f8f8f8;
  min-height: 100vh;
  // 二维码
  .code {
    background: #ffffff;
    border: @2px solid #e6e6e6;
    border-radius: @8px;
    width: @340px;
    height: @340px;
    margin-bottom: @30px;
  }
  .audit {
    background: #f8f8f8;
    box-sizing: border-box;
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    img {
      margin-top: -@200px;
      width: @272px;
      height: @272px;
    }
    p {
      margin-top: @52px;
      font-size: @30px;
      color: #666666;
      line-height: @30px;
    }
  }
  .organIndex {
    background: #f8f8f8;
    overflow: hidden;
    min-height: 100vh;
    .head {
      background: #fff;
      display: flex;
      padding: @25px @30px;
      padding-bottom: 0;
      img {
        width: @100px;
        height: @100px;
        border-radius: 100%;
        margin-right: @20px;
      }
      > div {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        .title {
          font-size: @32px;
          color: #222222;
          .flex-center;
          h1{
            font-weight: bold;
          }
          .iconfont {
            font-size: @36px;
            color: #ffd161;
            margin-left: @8px;
            position: relative;
            top: @2px;
            flex: 1;
          }
          .percent {
            border-radius: @100px;
            border: 1px solid;
            font-size: @22px;
            color: @red;
            padding: @4px @12px @2px;
          }
        }
        p {
          margin-top: @2px;
          font-size: @24px;
          color: #666;
          .one-line;
          width: @420px;
          &.info{
            font-size: @26px;
            color: #444;
          }
        }
      }
    }
    .code-wrap{
      background: #fff;
      padding:@60px 0 @30px;
      margin-bottom: @20px;
      .scan{
        position: relative;
        margin: 0 auto @40px;
        width: @280px;
        height: @280px;
        background: @red;
        .xy-center;
        border: @12px solid #ffefee;
        border-radius: 50%;
        color: #fff;
        .icon-saoma{
          font-size: @180px;
          margin-top: -@20px;
        }
        span{
          font-size: @28px;
          margin-top: -@20px;
        }
        &:after{
          background: rgba(0, 0, 0, 0.15);
          position: absolute;
          display: none;
          content: '';
          left: -@12px;
          top: -@12px;
          right: -@12px;
          bottom: -@12px;
          border-radius: 50%;
        }
        &:active:after{
          display: inline-block;
        }
      }
      .organCode{
        margin: 0 auto;
        .x-center;
        color: @red;
        border-radius: @4px;
        border: @2px solid @red;
        padding: @12px @18px;
        width: fit-content;
        font-size: @30px;
        .icon-code{
          font-size: @32px;
          margin-right: @8px;
        }
        &:active{
          background: @red;
          color: #fff;
        }
      }
      .ticketNum{
        text-align: center;
        margin-top: @40px;
        p{
          font-size: @26px;
          color: #666;
          margin-bottom: @4px;
        }
        span{
          font-size: @50px;
          color: @red;
          font-weight: bold;
        }
      }
    }
    .menus {
      background: #fff;
      margin-bottom: @20px;
      padding: 0 @32px;
      display: flex;
      align-items: center;
      > li {
        padding: @32px 0;
        flex: 1;
        text-align: center;
        position: relative;
        /deep/.point {
          position: absolute;
          left: calc(~'50% + ' @18px);
          top: 16%;
        }
        .iconfont {
          font-size: @86px;
          line-height: @86px;
          margin-bottom: @10px;
          &.icon-zhangdan {
            color: #ffb26f;
          }
          &.icon-fuli {
            color: #fd7359;
          }
          &.icon-fendian {
            color: #369fff;
          }
        }
        h1 {
          font-size: @26px;
          color: #666666;
          line-height: @26px;
        }
      }
    }
    .lists {
      background: #f8f8f8;
      &.createrList{
        /deep/.cell {
          background: #fff;
          &:nth-child(4), &:last-child{
            margin-bottom: @20px;
            .text-wrap{
              border-bottom: 0;
            }
          }
        }
      }
      &.adminList{
        /deep/.cell {
          background: #fff;
          &:nth-child(2), &:last-child{
            margin-bottom: @20px;
            .text-wrap{
              border-bottom: 0;
            }
          }
        }
      }
    }
  }
  // 二维码弹窗
  /deep/.closeNav {
    background: #f8f8f8;
  }
  .popup-content {
    background: #f8f8f8;
    .column-center;
    width: 100%;
    .image {
      border-radius: @6px;
      .column-center;
      background: #fff;
      width: 88%;
      padding: @48px 0;
      margin: @38px 0;
      .head {
        margin-bottom: @30px;
        .flex-center;
        img {
          width: @80px;
          height: @80px;
          border-radius: 100%;
        }
        h1 {
          font-size: @34px;
          color: #222222;
          font-weight: bold;
          margin: 0 @8px 0 @10px;
        }
        i {
          font-size: @36px;
          color: #ffd161;
          margin-left: @8px;
          position: relative;
          top: @2px;
        }
      }
      .head + p {
        font-size: @28px;
        color: #666666;
        margin-bottom: @30px;
      }
      .desc {
        margin-bottom: 0;
      }
    }
    /deep/button {
      background: @red;
      border-radius: @100px;
      width: 80%;
      height: @80px;
      font-size: @32px;
      color: #fff;
      line-height: @80px;
    }
    /deep/button + p {
      font-size: @26px;
      color: #aaaaaa;
      margin: @32px 0 @36px;
    }
  }
  // 画布
  #codeCanvas {
    position: absolute;
    top: -9999rpx;
    width: @650px;
    height: @825px;
  }
}
</style>
