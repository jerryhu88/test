<template>
  <form class="addAdmin">
    <!-- 添加管理员 -->
    <div class="form">
      <label class="label">管理员手机号</label>
      <m-input type='number' v-model="mess.phone" placeholder="请输入手机号(必填)" :max='11'/>
      <p v-show="phoneFlag === 2" class="tips">注：该用户尚未在本小程序注册，请注册后再试！</p>
      <p v-show="phoneFlag === 3" class="tips">注：该用户已是管理员或待确认中！</p>
      <label class="label">所属门店</label>
      <m-select type="radio" :options="stores" v-model="mess.storeServiceID"/>
    </div>
    <div class="btns">
      <p class="tips">管理员权限不包括：编辑新增门店、查看编辑机构认证信息、管理员管理、机构转让、机构注销</p>
      <button open-type='share' :disabled='disabled'>添加管理员</button>
    </div>
  </form>
</template>

<script>
import bus from '../../../constant/bus'
import mInput from '@/components/form/mInput'
import mSelect from '../../../components/form/mSelect'
import {mapGetters} from 'vuex'
import {addAdminApi, verifyAdminApi} from '../../../api/welfareCenter/admin'
export default {
  data () {
    return {
      serviceID: '',
      mess: {
        storeServiceID: '',
        phone: '',
        mallMenus: [],
        page: '/pages/welfareCenter/admin/accept'
      },
      stores: [],
      phoneFlag: '',
      shareFlag: false
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    disabled () {
      if (this.mess.storeServiceID && this.mess.phone && this.phoneFlag === 1) {
        return false
      } else {
        return true
      }
    }
  },
  components: {
    mInput, mSelect
  },
  watch: {
    'mess.phone' () {
      this.phoneFlag = ''
      if (this.mess.phone.length === 11) {
        verifyAdminApi(this.mess.phone).then(data => {
          this.phoneFlag = data
        })
      }
    }
  },
  onLoad (options) {
    Object.assign(this.$data, this.$options.data())
    this.type = options.type
    this.serviceID = options.serviceID
    this.getSubbranch() // 获取门店
  },
  onShow () {
    if (this.shareFlag) {
      this.$router.back()
    }
  },
  onShareAppMessage () {
    let storeName = ''
    this.stores.map(item => {
      if (item.serviceID === this.mess.storeServiceID) {
        storeName = `${item.orgSimpleName} (${item.simpleName})`
      }
    })
    let title = `${this.userInfo.uname}邀请你成为${storeName}管理员`
    addAdminApi(this.mess).then(data => {
      bus.$emit('firstPage')
      this.shareFlag = true
      return {
        title, // 转发后 所显示的title
        path: '/pages/welfareCenter/admin/accept', // 相对的路径
        imageUrl: ''
      }
    })
  },
  methods: {
    // 获取门店
    getSubbranch () {
      this.$store.dispatch('getSubbranch').then(data => {
        this.stores = data.map(item => {
          return {name: item.simpleName, value: item.serviceID, checked: false}
        })
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import "../../../assets/style/base.less";
  .addAdmin{
    display: inline-block;
    width: 100%;
    background: #f8f8f8;
    box-sizing: border-box;
    min-height: 100vh;
    padding-bottom: @140px;
    /deep/.input-wrap{
      background: #fff;
      &:first-child{
        border: 0;
      }
    }
    .tips{
      font-size:@24px;
      color:@red;
      line-height:@34px;
      margin: @12px @28px @24px;
    }
    .form{
      background: #fff;
      overflow: hidden;
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
      .tips{
        margin-top: 0;
        text-align: center;
      }
      button{
        &[disabled] {
          opacity: 0.7;
          color: #fff;
          background: @red;
        }
      }
    }
  }
</style>
