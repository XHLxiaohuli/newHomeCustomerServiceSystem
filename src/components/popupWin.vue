<template>
  <div class="popupWin">
    <span>{{str}}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      str:'',
    }
  },
  components: {
  },
  mounted() {
  },
  methods:{
    showFun:function(str,func){
      this.str = str;
      $('.popupWin').css({display:'block'}).animate({opacity:'1'},800).animate({opacity:'1'},500).animate({opacity:'0'},800);
      setTimeout(function(){
        $('.popupWin').css({display:'none'});
        if(func!==undefined){
          func();
        };
      },2100);
    },
  }
}
</script>

<style>
.popupWin{
  width: auto;
  height: 40px;
  color: aliceblue;
  line-height: 40px;
  box-sizing: border-box;
  padding: 0 30px;
  border-radius: 10px;
  background: rgba(0,119,255,.8);
  position: absolute;
  left: 50%;
  top:20px;
  transform: translate(-50%, 0);
  display: none;
  opacity:0;
}
</style>
