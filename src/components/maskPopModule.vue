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

<style>

.maskPopModule_{
  position: fixed;
  width: 100%;
  height: 100%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
  background:rgba(0,0,0,.2);
  /* display: none; */
}
.maskPopAccording{
  position: fixed;
  width: auto;
  height: auto;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
}
</style>
