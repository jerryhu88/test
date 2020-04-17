<template>
  <ul class="lists">
    <li v-for="i in 10" :key="i" @click="$router.push('../../pages/homePage/restaurant')">
      <img src="../../assets/images/logo.jpg" alt="">
      <div>
        <h1>饭中餐厅<span>距离<i>534km</i></span></h1>
        <div class="labels-phone">
          <label>中式快餐</label>
          <label>地道川菜</label>
          <i class="iconfont"></i>
        </div>
        <p>营业时间：11:30-14:30</p>
        <span>Kleine Hammerstr. 53</span>
        <!-- <p>下单时间：2019-11-21 17:00</p> -->
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  data () {
    return {
      showDept: false,
      depts: []
    }
  },
  components: {
  },
  computed: {
  },
  onLoad () {
  },
  methods: {}
}
</script>

<style lang='less' scoped>
@import "../../assets/style/base.less";
.lists{
  padding:60rpx 32rpx;
  li{
    background:rgba(255,255,255,1);
    box-shadow:0px 10rpx 40rpx 0px rgba(0,0,0,0.14);
    border-radius:16rpx;
    padding: 30rpx 30rpx 20rpx;
    display: flex;
    margin-bottom: @90px;
    font-size: 0;
    &:last-child{
      margin-bottom: 0;
    }
    img{
      box-shadow:0px 10rpx 10rpx 0px rgba(0,0,0,0.14);
      width:210rpx;
      height:210rpx;
      border-radius: 50%;
      margin-right: 22rpx;
      margin-top: -80rpx;
    }
    >div{
      flex: 1;
      h1{
        margin-bottom: 12rpx;
        font-size: 30rpx;
        color: #080040;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span{
          font-weight: normal;
          display: flex;
          align-items: center;
          color: #6a6a6a;
          font-size: 22rpx;
          i{
            color: #FBAF02;
          }
        }
      }
      .labels-phone{
        margin-bottom: 8rpx;
        display: flex;
        align-items: center;
        label{
          height: 36rpx;
          line-height: 36rpx;
          border-radius: 20rpx;
          background: #FFD76F;
          padding: 0 10rpx;
          font-size: 22rpx;
          color: #003A58;
          margin-right: @12px;
        }
        i{

        }
      }
      p{
        font-size: 22rpx;
        color: #6A6A6A;
        margin-bottom: 8rpx;
      }
      >span{
        color: #B8BBC6;
        font-size: 22rpx;
      }
    }
  }
}
</style>
