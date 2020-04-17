<template>
  <div class="noData">
    <img src="../../assets/images/no.png">
    <p>{{msg}}</p>
    <m-button hover-class="button-hover" @click="$emit('click')" v-if="btnText">{{btnText}}</m-button>
  </div>
</template>

<script>
import mButton from '../../components/form/mButton'
export default {
  data () {
    return {
    }
  },
  props: {
    msg: String,
    btnText: String
  },
  components: {
    mButton
  }
}
</script>

<style lang='less' scoped>
@import '../../../src/assets/style/base.less';
  .noData{
    background: #f8f8f8;
    box-sizing: border-box;
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    img{
      margin-top: -@200px;
      width: @320px;
      height: @320px;
    }
    p{
      margin-top: @32px;
      font-size:@30px;
      color:#888;
      line-height:@30px;
    }
    /deep/button{
      margin-top: @52px;
      width: auto;
      padding: 0 @68px;
      background:@red;
      border-radius:@100px;
      height:@68px;
      font-size:@28px;
      color:#ffffff;
      line-height:@68px;
    }
    .button-hover{
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
  }
</style>
