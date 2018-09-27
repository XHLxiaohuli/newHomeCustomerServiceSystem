<template>
  <div class="listC_">
    <div 
      v-for="(val,i) in recentSesVal" 
      :key="i"
      :class="unesId == val.id ? 'no1_list selected_' : 'no1_list'"
      @click="listC_Fun(val)"
    >
      <!-- 头像 -->
      <img :src="[val.headImgUrl][0]" alt="">
      <!-- 简信 -->
      <div class="janeLetter">
        <p>{{val.nickname}}</p>
        <p>{{jymsgFun(val.finalNews)}}</p>
      </div>
      <!-- 时间 -->
      <div class="janeTime">
        <p>{{timestampToTime(val.finalNews.time)}}</p>
      </div>
      <div class="wdVal_" v-if="val.wdVal > 0">{{val.wdVal}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props:['recentSesVal','unesId'],
  data() {
    return {  }
  },
  watch:{
    recentSesVal:{
      handler(newVal, oldVal){
        // console.log(newVal);
      },
      deep:true
    },
  },
  methods:{
    // 切换客户id(传递给父级)
    listC_Fun:function(e){
      this.$emit('unesIdSwitch2',e);
    },
    // 时间戳转换时间
    timestampToTime:function(timestamp) {
      var date = new Date(parseInt(timestamp));
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      var D = date.getDate() + ' ';
      var h = date.getHours() + ':';
      var m = date.getMinutes();
      var s = date.getSeconds();

      var date2 = new Date();
      var Y2 = date2.getFullYear() + '-';
      var M2 = (date2.getMonth()+1 < 10 ? '0'+(date2.getMonth()+1) : date2.getMonth()+1) + '-';
      var D2 = date2.getDate() + ' ';
      
      if(Y+M+D === Y2+M2+D2){
        return h+m;
      }else{
        return M+D;
      };
    },
    //简易消息展示
    jymsgFun:function(data){
      if(data.type == '3'){
        return '图片';
      }else if(data.type == '50'){
        return '视频';
      }else{
        return data.val;
      }
    },

  }
}
</script>

<style>
.listC_{
  width: 100%;
  height: auto;
}
.no1_list{
  width: 100%;
  height: 64px;
  box-sizing: border-box;
  padding: 12px;
  border-bottom: 1px solid #292c33;
  cursor: pointer;
  position: relative;
  text-align: left;
}
.no1_list:hover{
  background: #3b4047;
}
.selected_{
  background: #3b4047;
}
.no1_list>img{
  position: absolute;
  height: 40px;
  width: 40px;
  left: 12px;
  top: 50%;
  transform: translate(0, -50%);
}
.janeLetter{
  position: absolute;
  height: 40px;
  width: 100px;
  left: 60px;
  top: 50%;
  transform: translate(0, -50%);
}
.janeLetter>p:nth-child(1){
  width: 140px;
  font-size: 13px;
  color: #fff;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.janeLetter>p:nth-child(2){
  color: #989898;
  width: 140px;
  font-size: 13px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.janeTime{
  position: absolute;
  height: 40px;
  width: 45px;
  right: 12px;
  top: 50%;
  transform: translate(0, -50%);
}
.janeTime>p:nth-child(1){
  text-align: right;
  font-size: 13px;
  color: #989898;
  line-height: 20px;
}
.wdVal_{
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgb(238, 40, 40);
  position: absolute;
  left:0;
  top: 0;
  font-size: 8px;
  line-height: 20px;
  text-align: center;
  color: #fff;
}
</style>
