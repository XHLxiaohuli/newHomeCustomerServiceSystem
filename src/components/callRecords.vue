<template>
  <div class="callRecords">
    <!-- 数据列表 -->
    <div class="callRecords_list">
      <div class="callRecords_list_li">
        <div 
          class="singleVal" v-for="(v,i) in currentList" :key="i"
          :style="currentObj.id && v.id == currentObj.id && 'background:#f9f9f9;'">
          <p>
            <span style="float:left">{{v.name}}</span>
            <img 
              class="callRecords_list_img"  @click="clickPlay(v)"
              :src="currentObj.id && v.id == currentObj.id && playBool ? require('../assets/img/Group 3.png'):require('../assets/img/Shape 2.png')" >
          </p>
          <p>  <span style="float:left">{{v.dateOf}}</span>  <span style="float:right">{{v.timeLength}}</span>  </p>
        </div>
      </div>
    </div>
    <!-- 当前播放对象 -->
    <div class="callRecords_state">
      <div class="callRecords_state_div">
        <p  v-if="currentObj.id">
          <span style="float:left">{{currentObj.name}}</span>
          <img 
            class="callRecords_list_img"  @click="toggleSwitch"
            :src="playBool ? require('../assets/img/Group 3.png'):require('../assets/img/Shape 2.png')" >
        </p>
        <!-- 进度条动画 -->
        <div>
          <canvas id="myCanvas_" width="320" height="20"></canvas>
        </div>
        <p  v-if="currentObj.id && totalLength!=0">  <span style="float:right">{{alreadyLength}}/{{currentObj.timeLength}}</span>  </p>
        <!-- 音频播放媒体标签 -->
        <audio id="callRecords_audio">
          <source :src="currentObj.src" type="audio/ogg">
          <source :src="currentObj.src" type="audio/mpeg">
        </audio>
      </div>
    </div>
  </div>
</template>

<script>
// js文件
import callRecordsFunObj from '@/assets/js/module/callRecords'
export default {
  props:['unesValue'],
  data() {
    return {
      // 当前好友数据
      unesValueObj:this.unesValue,
      // 播放数据列表
      currentList:[],
      // 当前播放对象
      currentObj:{},
      // 通话记录播放状态
      playBool:false,
      // 播放语音对象
      audioOperaObj : {},
      //  画布函数对象
      myCanvasObj : {},
      // 播放与停止录音函数对象
      PlaybackObj : {},
      // 当前播放总时长
      totalLength : callRecordsFunObj.conversionHMS(0),
      // 当前已播放时长
      alreadyLength : callRecordsFunObj.conversionHMS(0),
    }
  },
  watch:{
    // 微信信息监听
    unesValue:{
      handler(newVal, oldVal){
        this.currentList=[];
        this.audioOperaObj={};
        this.currentObj={};
        // 当前播放总时长
        this.totalLength=callRecordsFunObj.conversionHMS(0),
        // 当前已播放时长
        this.alreadyLength=callRecordsFunObj.conversionHMS(0),



        // 当前好友数据
        this.unesValueObj=newVal;



        if(!this.unesValueObj.customer){console.log('没有数据');return};
        // 
        this.requestValFun();
        // 
        this.setrolling();

      },
      deep:true
    },
  },
  mounted() {
    // 
    this.requestValFun();
    // 
    this.setrolling();
    // 获取音频操作函数对象
    this.audioOperaObj = callRecordsFunObj.audioOperaFun('callRecords_audio');
    // 获取画布操作函数对象
    this.myCanvasObj = callRecordsFunObj.myCanvasFun('myCanvas_');
  },
  methods:{
    // 数据请求函数
    requestValFun:function(){
      if(
        !(this.unesValueObj.customer &&
        this.unesValueObj.customer.id)
      ){return;}

      var this_ = this;
      this_.$axios({
        method: 'get',
        url: "http://"+api+"/api/1.0/call/find/ticket",
        headers:{
          'content-type': 'application/x-www-form-urlencoded',
          'ticket':this_.$route.query.Iticket
        },
        params:{
          callerId:this_.unesValueObj.customer.id,
        }
      }).then((response)=>{
        console.log(response);
        if(response.data.success){
          var data = response.data.result;
          var objVal = [];
          
          for(var i=0; i<data.length; i++){
            if(data[i].recordUrl){
              objVal.push({
                id:data[i].callId,
                name:data[i].callerName,
                dateOf:callRecordsFunObj.getdateTime(data[i].startTime),
                timeLength:callRecordsFunObj.conversionHMS((data[i].endTime-data[i].startTime)/1000),
                src:data[i].recordUrl,
              });
            };
          };

          this.currentList = objVal;

        }else{
          alert(response.data.msg);
        }
      }).catch((error)=>{
        console.log(error);
      });
    },

    // 列表设置移入移出滚动状态
    setrolling:function(){
      $('.callRecords_list_li').hover(function(){
        $(this).css({overflow: 'auto'});
      },function(){
        $(this).css({overflow: 'hidden'});
      });
    },
    //切换数据函数
    clickPlay:function(data){
      // 切换数据
      if((this.currentObj.id && this.currentObj.id!==data.id) || (!this.currentObj.id)){
        this.currentObj = data;
        this.switchObject();
      }else
      // 当前数据暂停
      if(this.playBool && this.currentObj.id==data.id){
        this.suspendCollection();
      }else
      // 当前数据开始
      if(!this.playBool && this.currentObj.id==data.id){
        this.playCollection();
      }
    },
    // 当前数据切换播放状态
    toggleSwitch:function(){
      var this_ = this;
      if(this.playBool){
        this.suspendCollection();
      }else{
        this.playCollection();
      }
    },

    // 切换通话对象函数集合
    switchObject:function(){
      var this_ = this;
      // 如果当前有播放先关闭定时器
      if(this.PlaybackObj.suspend){
        this.PlaybackObj.suspend();
      };
      // 重新加载音频
      this.audioOperaObj.loadFun();
      // 获取控制播放当前音频函数对象
      this.PlaybackObj = this.allLinkage();
      // 播放执行函数集合
      this.playCollection();
      // 画布初始化
      this.myCanvasObj.initial();
      // 
      this.totalLength = callRecordsFunObj.conversionHMS(0);
    },
    // 播放执行函数集合
    playCollection:function(){
      var this_ = this;
      if(this.PlaybackObj.startThe){
        this.PlaybackObj.startThe();
      };
      // 音频播放完毕监听
      this.audioOperaObj.endedCbok(function(){
        this_.suspendCollection();
        // 画布初始化
        this_.myCanvasObj.initial();
        // 
        this_.alreadyLength = callRecordsFunObj.conversionHMS(0);
      });
      // 
      this.playBool = true;
    },
    // 暂停执行函数集合
    suspendCollection:function(){
      if(this.PlaybackObj.suspend){
        this.PlaybackObj.suspend();
      };
      // 
      this.playBool = false;
    },

    // 音频播放进度条与数字联动
    allLinkage:function(){
      var this_ = this;
      // 获取音频总时间
      var length_  = '';
      // 定义定时器
      var timeObj ;
      
      // 获取音频时长
      var time_length = setInterval(function(){
        if(!isNaN(this_.audioOperaObj.durationFun())){
          length_ = this_.audioOperaObj.durationFun();
          this_.totalLength = callRecordsFunObj.conversionHMS(Math.round(length_));
          clearInterval(time_length);
        };
      },200);

      // 播放音频
      function startThe(){
        this_.audioOperaObj.playFun();
        timeObj = setInterval(function(){
          if(length_ !== '' && !isNaN(length_)){
            // 获取当前播放时间
            var i = this_.audioOperaObj.currentTimeFun();
            // 设置进度条移动
            this_.myCanvasObj.specifiedProgress(Math.round(length_) ,Math.round(i) );
            // 
            this_.alreadyLength = callRecordsFunObj.conversionHMS(Math.round(i));
          };
        },1000);
      };

      // 暂停音频
      function suspend(){
        this_.audioOperaObj.pauseFun();
        clearInterval(timeObj);
      };

      return {
        startThe,
        suspend,
      };
    },


  }
}
</script>

<style>
.callRecords{
  width:100%;
  height:100%;
  box-sizing: border-box;
  background: #fff;
  position: relative;
}
.callRecords_list{
  width: 100%;
  height:100%;
  box-sizing: border-box;
  padding: 10px 10px 80px 10px;
  position: absolute;
  left: 50%;
  top:0px;
  transform: translate(-50%, 0);
}
.callRecords_list_li{
  width: 100%;
  height:100%;
  overflow: hidden;
}
.singleVal{
  width: 100%;
  height:65px;
  box-sizing: border-box;
  border-bottom: 1px solid #d6d6d6;
  padding: 10px;
}
.singleVal>p{
  width: 100%;
  height:22px;
  position: relative;
  line-height: 22px;
  font-size:14px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(0,0,0,1);
}
.callRecords_list_img{
  position: absolute;
  top:50%;
  right:5px;
  transform: translate(0,-50%);
}
.callRecords_state{
  width: 100%;
  height:80px;
  box-sizing: border-box;
  padding: 10px;
  position: absolute;
  left: 50%;
  bottom:0px;
  transform: translate(-50%, 0);
  box-shadow:0px -1px 3px #eee;
}
.callRecords_state_div{
  width: 100%;
  height:100%;
}
.callRecords_state_div>p,
.callRecords_state_div>div{
  width: 100%;
  height:20px;
  position: relative;
  line-height: 20px;
  font-size:14px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(0,0,0,1);
}
</style>
