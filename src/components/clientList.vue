<template>
  <div class="clientList_" :style="type=='wechatId' && 'padding-left: 0px;'">
    <!-- 微信切换 -->
    <div class="wxnoSwitch"  v-show="type != 'wechatId'">
      <div  v-for="(v,i) in unesList" 
            :key="i" 
            :class="wxXiabiao == i ? 'wxnoSwitch_btn wxnoSwitch_btn_yes':'wxnoSwitch_btn wxnoSwitch_btn_no'" 
            @click="wxnoSwitchFun((()=>{unesList[i].index = i;return unesList[i];})())">
        <img  :src="[v.headImgUrl][0]" 
              style="width:30px;heigth:30px;border-radius: 50%;">
        <p>{{v.nickname}}</p>
        <div class="bianbian"></div>
      </div>
    </div>

    <!-- 好友显示区域 -->
    <div class="valList_">
      <!-- 搜索栏 -->
      <div class="shousuhaoyou" :style="type !== 'wechatId' && 'width:190px'">
        <input class="inputStr_class" type="text" v-model="inputStr_" placeholder="搜索指定好友">
      </div>
      <!-- 分组组件 -->
      <Grouping 
        :unesId="unesId"
        :groupNameShow="groupNameShow"
        :unesList="unesList.length>0 ? unesList[wxXiabiao].groups : []"
        :zhengze="inputStr_"
        @unesIdSwitch2="unesIdSwitch2"
      />
    </div>
  </div>
</template>

<script>
import Grouping from '@/components/grouping'
export default {
  props:[
    'unesArr',      // 微信好友数据
    'wxIndex',      // 当前对应微信数据下标
    'unesValue',
    'type',
    'groupNameShow'
  ],
  data() {
    return {
      // 所有好友
      unesList:[],
      // 当前微信id
      wxXiabiao:0,
      // 
      unesId:'',
      // 好友搜索
      inputStr_:'',
    }
  },
  components: {
    Grouping
  },
  watch:{
    // 微信信息监听
    unesArr:{
      handler(newVal, oldVal){
        this.unesList = newVal;
        this.$emit('switchWatchId',this.unesList[0]);
      },
      deep:true
    },
  },
  mounted() {
  },
  methods:{
    // 微信切换
    wxnoSwitchFun:function(data){
      this.wxXiabiao = data.index;
      this.$emit('switchWatchId',data);
    },
    // 切换客户id(子级触发再传送给父级)
    unesIdSwitch2:function(data){
      this.unesId = data.id;
      this.$emit('switchId',data);
    },

  }
}
</script>

<style>
.wxnoSwitch_btn_yes>.bianbian{
  position: absolute;
  width: 4px;
  height: 40px;
  background: #0aa1ed;
  top: 10px;
  left:0px;
}
.wxnoSwitch_btn_no>.bianbian{
  display: none;
}
.clientList_{
  width: 100%;
  height: 100%;
  /* background:  rgb(177, 182, 185); */
  background: #fff;
  padding-left: 60px;
  box-sizing: border-box;
  position: relative;
}
.wxnoSwitch{
  width: 60px;
  height: 100%;
  box-sizing: border-box;
  padding-right: 2px;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(94, 103, 110, 0.2);
}
.wxnoSwitch_btn_yes{
  background: rgba(236,237,238,1);
}
.wxnoSwitch_btn_no{
  background: #fff;
}
.wxnoSwitch_btn_no>.bianbian{
  display: none;
}
.wxnoSwitch_btn{
  position: relative;
  width: 58px;
  height: 60px;
  box-sizing: border-box;
  padding: 5px 0;
  margin-bottom: 3px;
  text-align: center;
}
.wxnoSwitch_btn>p{
  width: 100%;
  height:20px;
  color: #666;
  line-height: 20px;
  font-size: 8px;
  margin-bottom: 5px;
}
.clientList_information{
  width: 100%;
  height: auto;
  border-bottom: 1px solid #24272c;
}
.clientList_top{
  width: 100%;
  height: 60px;
  box-sizing: border-box;
  padding: 20px 0 0 20px;
  margin-bottom: 20px;
}
.clientList_top>img{
  height: 40px;
  width: auto;
  float: left;
}
.clientList_top>p{
  float: left;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  margin-left: 10px;
  line-height: 40px;
  position: relative;
}
.search_k{
  width: 100%;
  height: 30px;
  text-align: left;
  position: relative;
  background: #26292e;
}
.search_input{
  background:none;  
	outline:none;  
  border:0px;
  position: absolute;
  top: 0;
  left: 0;
  width: 80%;
  height: 100%;
  padding-left:40px; 
  color: #fff;
}
.switch_n{
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction:row;
  justify-content:space-around;
  align-items:center;
}
.friends_,
.chat_{
  width: 45%;
  height: 35px;
}
.valList_{
  width: 100%;
  height: 100%;
  padding-top:50px;
  box-sizing: border-box;
  overflow: auto;
}
.shousuhaoyou{
  width: 100%;
  height: 50px;
  background: #fff;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  right: 0;
  padding: 5px;
}
.inputStr_class{
  width: 90%;
  height: 30px;
  box-sizing: border-box;
  background:none;  
	outline:none;  
	border:1px #ddd solid;
  border-radius: 3px;
  float: left;
  margin: 5px 0;
  text-indent:10px;
}
.sousuoimg_class{
  float: right;
  margin: 6px 3px;
}
.yesclass{
position: absolute;
width:16px;
height:16px;
font-size:8px;
border-radius: 50%;
background:red;
color:#fff;
line-height: 20px;
text-align: center;
right: 4px;
top:4px;
}
.noclass{
position: absolute;
width:16px;
height:16px;
border-radius: 50%;
right: 4px;
top:4px;
background:#ddd;
}
</style>
