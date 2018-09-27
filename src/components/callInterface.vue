<template>
  <div>
    <!-- 拨打电话界面 -->
    <!-- v-if="callBool&&callswitchBool" -->
    <div id="callTuBiao_" class="callTuBiao_" v-if="callBool&&callswitchBool">
      <div style="width:100%;height:100%;position: relative;">
        <img :src="unesValue.headImgUrl" class="callTuBiaoBJ">
        <img src="../assets/img/收缩.png" class="callTuBiao_sousuo" alt=""  @click="callswitchBoolFun(false)">
        <img :src="unesValue.headImgUrl" class="callTuBiao_top contentBasic_img" alt="">
        <span class="callname_text">123456</span>
        <img src="../assets/img/挂断.png" class="callGuanDuan" alt="" @click="hangUp">
        <span class="callBtnPl_text" @click="initiateScore">发起评分</span>
      </div>
    </div>

    <!-- 拨打电话小图标 -->
    <!-- v-if="callBool&&!callswitchBool" -->
    <img id="callTuBiao_top_min" v-if="callBool&&!callswitchBool" :src="unesValue.headImgUrl" class="callTuBiao_top_min contentBasic_img" @click="callswitchBoolFun(true)">
  </div>
</template>

<script>
export default {
  props:['callValue'],
  data() {
    return {
      // 拨打电话状态
      callBool:false,
      // 拨打电话界面切换展示
      callswitchBool:true,
      // 当前拨打电话的id
      callId:'',
      // 
      unesValue:{},
    }
  },
  components: {  },
  methods:{
    // 拨打画面切换函数
    callswitchBoolFun:function(bool_){
      this.callswitchBool = bool_;
    },
    // 拨打界面切换动画
    showCallPage:function(){
      console.log(this.callswitchBool);
      if(this.callswitchBool){
        console.log($('#callTuBiao_'));
        $('#callTuBiao_').animate({display:'block',opacity:'0'}).animate({opacity:'1'},1000);
        $('#callTuBiao_top_min').animate({opacity:'0'},1000).animate({display:'none'});
      }else{
        $('#callTuBiao_top_min').animate({display:'block',opacity:'0'}).animate({opacity:'1'},1000);
        $('#callTuBiao_').animate({opacity:'0'},1000).animate({display:'none'});
      };
    },
    pareCallFun:function(newVal){
      console.log(this.callBool);
      if(!this.callBool){
        this.unesValue = newVal.unesValue;
        this.callBool = true;
        this.callFun(newVal.callValObj);
        console.log(newVal);
      }
    },
    // 拨打电话函数
    callFun:function(data){
      var this_ = this;
      this_.$axios({
        method: 'post',
        url: "http://call.ellxy.com/api/1.0/call/call",
        headers:{
          'content-type': 'application/x-www-form-urlencoded'
        },
        params:data
      }).then((response)=>{
        if(response.data.success){
          this_.callId = response.data.msg;
          console.log(this_.callId);
        }else{
          alert(response.data.msg);
        }
      }).catch((error)=>{
        console.log(error);
      });
    },
    // 挂电话函数
    hangUp:function(){
      this.callBool = false;
      var this_ = this;
      if(this_.callId!=''){
        this_.$axios({
          method: 'post',
          url: "http://call.ellxy.com/api/1.0/call/disConnect",
          headers:{
            'content-type': 'application/x-www-form-urlencoded',
          },
          params:{
            callId:this_.callId,
          }
        }).then((response)=>{
          this_.callId = '';
        }).catch((error)=>{
          console.log(error);
        });
      };
    },
    // 发起评分函数
    initiateScore:function(){
      var this_ = this;
      if(this_.callId!=''){
        this_.$axios({
          method: 'post',
          url: "http://call.ellxy.com/api/1.0/call/play",
          headers:{
            'content-type': 'application/x-www-form-urlencoded',
          },
          params:{
            callId:this_.callId,
            voiceStr:'',
          }
        }).then((response)=>{
          
        }).catch((error)=>{
          console.log(error);
        });
      };
    },

    

  }
}
</script>

<style>
.callname_text{
  color:#fff;
  position: absolute;
  left:50%;
  top:35%;
  transform: translate(-50%, -50%);
}
.callGuanDuan{
  width: 40px;
  height:40px;
  position: absolute;
  left:50%;
  top:75%;
  transform: translate(-50%, -50%);
}
.callBtnPl_text{
  color:#fff;
  position: absolute;
  left:50%;
  top:85%;
  transform: translate(-50%, -50%);
}
.contentBasic_img{
  width: 80px;
  height:80px;
  border-radius: 50px;
}
.callTuBiao_{
  width:320px;
  height:420px;
  box-shadow:0px 2px 5px #ddd;
  background: #aaa;
  position: fixed;
  left:50%;
  top:50%;
  transform: translate(-50%, -50%);
}
.callTuBiaoBJ{
  width:100%;
  height:100%;
  position: absolute;
  left:50%;
  top:50%;
  transform: translate(-50%, -50%);
  filter: blur(20px);
}
.callTuBiao_top_min{
  position: fixed;
  right:6%;
  bottom:8%;
  transform: translate(50%, 50%);
}
.callTuBiao_sousuo{
  width: 20px;
  height:auto;
  position: absolute;
  right:5%;
  top:5%;
  transform: translate(50%, -50%);
}
.callTuBiao_top{
  position: absolute;
  left:50%;
  top:20%;
  transform: translate(-50%, -50%);
}
</style>
