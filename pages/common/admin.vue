<template>
  <div class="adminList">
    <ul class="lists">
      <li @click="readAdmin(item, index)" class="list vux-1px-b" v-for="(item, index) in lists" :key='index'>
        <div class="head">
          <img mode="aspectFill" :src="item.avatar" alt="">
        </div>
        <div class="info">
          <div class="name">
            <h1>{{item.uname}}</h1>
            <span class="sex">({{item.sex === 1 ? '男' : '女'}})</span>
          </div>
          <!-- 兴趣机构和婚恋机构 -->
          <span v-if="type === 'interest' || type === 'love'" class="position">{{item.roleType === 1 ? '创建者' : '管理员'}}</span>
          <!-- 法律机构 -->
          <div v-if="type === 'law'">
            <p v-if="item.labels.length">擅长：<span v-for="(label, i) in item.labels" :key="i">{{label.labelName}}、</span></p>
            <p v-else>擅长：暂未完善</p>
            <p>服务范围：{{item.disposeScope || '暂未完善'}}</p>
          </div>
        </div>
        <span v-if="!item.roleType">{{item.audit === 1 ? '确认中' : ''}}</span>
        <i class="iconfont icon-you"></i>
      </li>
    </ul>
    <div class="btns">
      <button @click="showAdmin = true">添加{{personName}}</button>
    </div>
    <!-- 小组弹窗 -->
    <m-popup v-model="showAdmin" showClose :title="'添加' + personName">
      <div class="addAdmin">
        <label class="label">{{personName}}手机号</label>
        <m-input type='number' v-model="phone" placeholder="请输入11位手机号" :max='11'/>
        <button @click='addAdmin'>添加</button>
      </div>
    </m-popup>
  </div>
</template>

<script>
import {getAdminListApi, cancelAdminApi, addAdminApi, delAdminApi} from '../../api/common'
import mInput from '@/components/form/mInput'
import mPopup from '../../components/view/mPopup'
import store from '../../store/index'
import {confirm, toast, alert} from '../../constant/popup'
import {delToDoListApi} from '../../api/serviceIndex/index'
import bus from '../../constant/bus'
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      types: {
        love: {
          name: '婚恋机构',
          list: '/love/org/managerList',
          add: '/love/org/managerAdd',
          del: '/love/org/managerDelete',
          cancel: '/love/org/managerDeleteAdd',
          page: `/pages/common/acceptAdmin?type=love`
        },
        interest: {
          name: '兴趣机构',
          list: `/interest/group/managerList/${store.getters.groupType}`,
          add: `/interest/group/managerAdd/${store.getters.groupType}`,
          del: `/interest/group/managerDelete`,
          cancel: `/interest/group/managerDeleteAdd`,
          page: `/pages/common/acceptAdmin?groupType=${store.getters.groupType}&type=interest`
        },
        law: {
          name: '法律机构',
          list: `/law/lawer/list`,
          add: `/law/lawer/add`,
          del: `/law/lawer/delete`,
          cancel: `/law/lawer/deleteAdd`,
          page: `/pages/common/acceptAdmin?type=law`
        }
      },
      showAdmin: false,
      pages: {
        page: 1,
        pageSize: 10
      },
      type: '',
      phone: '',
      hasNextPage: false,
      lists: [],
      serviceID: '',
      personName: '管理员' // 婚恋机构、兴趣联盟：管理员，法律机构：律师
    }
  },
  components: {
    mPopup, mInput
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    this.serviceID = options.serviceID
    this.type = options.type
    if (this.type === 'law') {
      this.personName = '律师'
      wx.setNavigationBarTitle({ title: '签约律师' })
    }
    wx.startPullDownRefresh()
    bus.$on('firstPage', data => {
      this.firstPage()
    })
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  onPullDownRefresh () {
    this.firstPage()
  },
  // 上拉加载，拉到底部触发
  onReachBottom () {
    if (!this.hasNextPage) return
    // 到这底部在这里需要做什么事情
    this.pages.page++
    this.getList()
  },
  onShareAppMessage () {
    let title = `${this.userInfo.uname}邀请你成为Ta的${this.types[this.type].name}${this.personName}`
    return {
      title, // 转发后 所显示的title
      path: '/pages/common/acceptAdmin', // 相对的路径
      imageUrl: ''
    }
  },
  methods: {
    select (type) {
      this.firstPage()
    },
    readAdmin (item, i) {
      // 第一个是创建者
      if (!i) {
        this.$router.push('../serviceIndex/setting?type=safety')
        return
      }
      // 法律机构跳转到律师详情
      if (this.type === 'law' && item.audit === 2) {
        this.$router.push(`../law/lawer/detail?serviceID=${item.serviceID}`)
        return
      }
      // 兴趣机构、婚恋机构管理员
      let that = this
      let itemList = ['拨号', '删除']
      if (item.audit === 1) {
        itemList = ['拨号', '撤销']
      }
      wx.showActionSheet({
        itemList,
        success (data) {
          let menu = itemList[data.tapIndex]
          switch (menu) {
            case '拨号':
              wx.makePhoneCall({
                phoneNumber: item.phone
              })
              return
            case '撤销':
              confirm(
                '提示',
                `确认撤销添加该${that.personName}吗？`,
                '确定',
                () => {
                  cancelAdminApi(that.types[that.type].cancel, item.serviceID).then(data => {
                    that.firstPage()
                    delToDoListApi(that.types[that.type].name, item.serviceID)
                    toast('success', '已撤销')
                  })
                }
              )
              return
            case '删除':
              confirm(
                '提示',
                `确认删除该${that.personName}吗？`,
                '确定',
                () => {
                  delAdminApi(that.types[that.type].del, item.serviceID).then(data => {
                    that.firstPage()
                    toast('none', '已删除')
                  })
                }
              )
          }
        }
      })
    },
    addAdmin () {
      if (this.phone.length !== 11) {
        return toast('none', '请输入11位手机号')
      }
      addAdminApi(this.types[this.type].add, {phone: this.phone, page: this.types[this.type].page}).then(data => {
        let tips = {
          2: '该用户尚未在本小程序注册',
          3: `该用户已被添加为${this.personName}`,
          4: '该用户被邀请中，请耐心等待'
        }
        if (data === 1) {
          this.showAdmin = false
          this.phone = ''
          alert(
            '提示',
            '已向对方发起邀请，点击右上角分享告诉Ta',
            '我知道啦'
          )
          this.firstPage()
        } else {
          alert(
            '提示',
            tips[data],
            '我知道了'
          )
        }
      })
    },
    firstPage () {
      this.pages.page = 1
      this.getList()
    },
    toUrl (item) {
      let url = `./detail?serviceID=${item.serviceID}`
      if (item.roleType) {
        url = '../../serviceIndex/setting?type=safety'
      }
      wx.navigateTo({url})
    },
    getList () {
      if (this.pages.page === 1) {
        this.lists = []
      }
      getAdminListApi(this.types[this.type].list, this.pages).then(data => {
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
@import "../../assets/style/base.less";
  .adminList{
    background: #f8f8f8;
    box-sizing: border-box;
    height: 100vh;
    /deep/.tabs{
      position: sticky;
      width: 100%;
      top: 0;
      background: #fff;
      z-index: 2;
    }
    .lists{
      .list{
        background: #fff;
        padding: @20px @28px;
        font-size:@26px;
        color:#929292;
        &:active{
          background: #f8f8f8;
        }
        display: flex;
        .head{
          .flex-center;
          height: @80px;
          img{
            width: @80px;
            height: @80px;
            border-radius: @6px;
            margin-right: @20px;
          }
        }
        .info{
          flex: 1;
          .name{
            display: flex;
            align-items: center;
            margin-bottom: @8px;
            .sex{
              flex: 1;
            }
            h1{
              color: #000;
              font-size: @28px;
              margin-right: @10px;
            }
          }
          p{
            margin-top: @10px;
            .line(1);
          }
        }
        >span{
          font-size: @26px;
          color: #ff6633;
          align-self: center;
        }
        .iconfont{
          font-size: @24px;
          color: #999;
          margin-left: @6px;
          align-self: center;
        }
      }
    }
    .btns{
      position: fixed;
      bottom:0;
      left:0;
      width:100%;
      background-color: #fff;
      text-align: center;
      padding: @20px @30px;
      box-sizing: border-box;
    }
    .addAdmin{
      width: 100%;
      height: 40vh;
      padding: @12px 0;
      display: flex;
      flex-direction: column;
      .tips{
        font-size:@24px;
        color:@red;
        line-height:@34px;
        margin: @24px @28px 0 @28px;
      }
      /deep/.input-wrap{
        flex: none;
      }
      button{
        margin: auto auto @60px;
        width: 92%;
      }
    }
  }
</style>
