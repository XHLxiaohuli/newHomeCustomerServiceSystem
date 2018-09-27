<template>
  <div class="maskPopModule_">
    <div class="maskPopAccording">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props:[ "bgColor" ],
  data() {
    return {

    }
  },
  mounted() {
    // 获取遮罩背景色
    var color_=this.bgColor;
    if(color_){
      $('.maskPopModule_').css({background:color_});
    };
  },
}
</script>

<style lang='less'>
@import '../assets/less/common.less';
.maskPopModule_{
  width: 100%;
  height: 100%;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background:rgba(0,0,0,.2);
}
.maskPopAccording{
  width: auto;
  height: auto;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
}
</style>
