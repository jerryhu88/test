<template>
  <div class="search">
    <input type="text" placeholder="Search">
  </div>
</template>

<script>
export default {
  data () {
    return {
      showDept: false,
      depts: []
    }
  },
  computed: {
  },
  onLoad () {
  },
  methods: {
  }
}
</script>

<style lang='less' scoped>
@import "../../assets/style/base.less";
div.search{
  // height: 140rpx;
  background: #fff;
  padding: 30rpx;
  position: fixed;
  top: 0;
  width: calc(~'100% - '60rpx);
  input{
    height: 80rpx;
    display: flex;
    align-items: center;
    border: 1px solid #FBAF02;
    border-radius: 100rpx;
    padding: 0 30rpx;
  }
  .input-placeholder{
    color: #CDCDCD;
  }
}
</style>
