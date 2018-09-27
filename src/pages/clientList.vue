<template>
  <div class="clientList_">
    <!-- 微信切换 -->
    <div class="wxnoSwitch">
      <div v-for="(v,i) in unesList" :key="i" :class="wxIndex == i ? 'wxnoSwitch_btn wxnoSwitch_btn_yes':'wxnoSwitch_btn wxnoSwitch_btn_no'" @click="wxnoSwitchFun({index:i,wxno:v.wxno})">
        <img :src="[v.headImgUrl][0]" alt="" style="width:35px;heigth:35px;border-radius: 50%;">
        <p>{{v.nickname}}</p>
        <!-- 未读消息提示 -->
        <div v-if="v.unreadNum>0" class="yesclass_0">{{'+'+v.unreadNum}}</div>
        <!-- 新增好友提示 -->
        <div v-if="v.newFriends>0" class="yesclass_1">{{'+'+v.newFriends}}</div>
        <!-- 在线离线状态 -->
        <div :class="v.status == '0' ? 'yesclass_2':'noclass_2'"></div>
        <!-- 侧边蓝条提示当前选中微信 -->
        <div class="bianbian"></div>
      </div>
    </div>

    <div class="exit_" @click="exit">
        退出
    </div>
    <!--  -->






    <div class="liebiaolan">
      <div class="clientList_information">
        <!-- 当前客服 -->
        <div class="clientList_top">
          <img src="../assets/img/Logo.png" alt="">
          <p>{{webimVal.name}}</p>
        </div>
        <!-- 搜索框 -->
        <div class="search_k">
          <i class="web_wechat_search"></i>
          <input class="search_input" type="text" placeholder="搜索">
        </div>
        <!-- 切换 -->
        <div class="switch_n">
          <div class="chat_" @click="navSwitchFun(0)">
            <i :class="navSwitch ? 'web_wechat_tab_chat_hl' : 'web_wechat_tab_chat'"></i>
          </div>
          <i class="tab_item"></i>
          <div class="friends_"  @click="navSwitchFun(1)">
            <i :class="navSwitch ? 'web_wechat_tab_friends' : 'web_wechat_tab_friends_hl'"></i>
          </div>
        </div>
      </div>
      <!-- 好友显示区域 -->
      <div class="valList_">
        <!-- 列表组件 -->
        <List 
          v-if="navSwitch"
          :unesId="unesValue.id"
          :recentSesVal="recentSesVal"
          @unesIdSwitch2="unesIdSwitch2"
        />
        <!-- 分组组件 -->
        <Grouping 
          v-if="!navSwitch"
          :unesId="unesValue.id"
          :unesList="unesList.length>0 ? unesList[wxIndex].groups : []"
          @unesIdSwitch2="unesIdSwitch2"
          @rightClick="rightClickFun"
        />
      </div>
    </div>
  </div>
</template>

<script>
import List from '@/components/list'
import Grouping from '@/components/grouping'

export default {
  props:[
    'unesArr',      // 微信好友数据
    'wxIndex',      // 当前对应微信数据下标
    'recentSes',    // 最近会话列表
    'unesValue',
    'webimVal'      //用户信息
  ],
  data() {
    return {
      // 切换好友列
      navSwitch:true,
      // 所有好友
      unesList:[],
      // 最近会话列表
      recentSesVal:[],
      // 当前微信id
      // wxXiabiao:-1,
    }
  },
  components: {
    List,
    Grouping
  },
  watch:{
    // 微信信息监听
    unesArr:{
      handler(newVal, oldVal){
        this.unesList = newVal;
      },
      deep:true
    },
    //监听最近会话列表变化
    recentSes:{
      handler(newVal, oldVal){
        this.recentSesValFun(newVal);
      },
      deep:true
    },
  },
  mounted() {
    this.initialList();
  },
  methods:{
    // 初始获取好友会话列表
    initialList:function(){
      var this_ = this;
      var timeVid = setInterval(function(){
        if(this_.unesList.length > 0){
          this_.wxnoSwitchFun({index:0,wxno:this_.unesList[0].wxno});
          clearInterval(timeVid);
        }
      },50);  
    },
    // 获取最近会话数据
    recentSesValFun:function(arr){
      var this_ = this;
      var ArrVal=[];
      // 循环最近会话列表数组
      for(var i=0;i<arr.length;i++){
        // 获取最近会话好友数据
        indexedDBopt.getData('userList',arr[i],function(data){
          ArrVal.push(data.val);
        });
      };
      // 定时器判断是否获取完成
      var timeVid = setInterval(function(){
        if(arr.length === 0 || arr[arr.length-1] == ArrVal[ArrVal.length-1].id){
          this_.recentSesVal = ArrVal;
          clearInterval(timeVid);
        }
      },100);
    },
    // 好友显示区域切换
    navSwitchFun:function(e){
      if(e==0){  this.navSwitch = true;  };
      if(e==1){  this.navSwitch = false;  };
    },
    // 微信切换
    wxnoSwitchFun:function(data){
      this.$emit('wxIdSwitch',data);
    },
    // 切换客户id(子级触发再传送给父级)
    unesIdSwitch2:function(data){
      this.$emit('unesIdSwitch',data);
    },
    // 右击操作
    rightClickFun:function(data){
      var this_ = this;
      this_.$emit('rightClick_',data);
    },
    // 
    exit:function(){
      // 删除
      this.$cookie.delCookie('userKey');

      // this.$router.push({
      //   path:'/',
      //   query:{  }
      // });

      var this_ = this;
      
      webim.logout(function(){
        this_.$router.push({
          path:'/',
          query:{  }
        });
        console.log('退出');
        console.log(webim.CONNECTION_STATUS)
      });
      // crossDomain.realTimeSet({
      //   key:'exitKey',
      //   value:'yes',
      // });	
      
      // setTimeout(function(){
      //   crossDomain.delCrossVal({key:'exitKey'});
      // },1000);
    },

  }
}
</script>

<style>
.clientList_{
  width: 100%;
  height: 100%;
  background: #2e3238;
  padding-left: 100px;
  box-sizing: border-box;
  position: relative;
}
.wxnoSwitch{
  width: 100px;
  height: 100%;
  box-sizing: border-box;
  padding-right: 2px;
  padding-bottom: 30px;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(54, 79, 101, 0.2);
}
.exit_{
  width: 100px;
  height: 30px;
  border:1px solid #fff;
  box-sizing: border-box;
  padding-right: 2px;
  position: absolute;
  bottom: 0;
  left: 0;
  cursor:pointer;
  color: #ccc;
  line-height: 30px;
  font-size: 14px;
}
.wxnoSwitch_btn_yes{
  background: #202329;
}
.wxnoSwitch_btn_no{
  background: #2e3238;
}
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
.wxnoSwitch_btn{
  position: relative;
  width: 98px;
  min-height: 70px;
  height: auto;
  box-sizing: border-box;
  padding: 6px 0;
  margin-bottom: 3px;
  text-align: center;
}
.wxnoSwitch_btn>p{
  width: 100%;
  min-height:20px;
  box-sizing: border-box;
  padding: 0 5px;
  height: auto;
  color: #fff;
  line-height: 20px;
  font-size: 8px;
  margin-bottom: 5px;
  word-wrap:break-word;
  word-break:break-all;
  overflow: hidden;

}

.liebiaolan{
  width: 260px;
  display: flex;
  flex-direction:column;
}
.clientList_information{
  width: 260px;
  height: 150px;
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
  width: 260px;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
}
.yesclass_0{
position: absolute;
width:auto;
min-width: 24px;
height:16px;
box-sizing: border-box;
padding: 0 3px;
font-size:8px;
border-radius: 20px;
background:rgb(238, 40, 40);
color:#fff;
line-height: 16px;
text-align: center;
right: 4px;
top:4px;
}
.yesclass_1{
position: absolute;
width:auto;
min-width: 24px;
height:16px;
box-sizing: border-box;
padding: 0 3px;
font-size:8px;
border-radius: 20px;
background:#edc30a;
color:#fff;
line-height: 16px;
text-align: center;
right: 4px;
top:24px;
}
.yesclass_2{
position: absolute;
width:12px;
height:12px;
box-sizing: border-box;
padding: 0 3px;
font-size:8px;
border-radius: 50%;
background:#1ded0a;
color:#fff;
line-height: 16px;
text-align: center;
right: 4px;
bottom: 4px;
}
.noclass_2{
position: absolute;
width:12px;
height:12px;
box-sizing: border-box;
padding: 0 3px;
font-size:8px;
border-radius: 50%;
background:#aaa;
color:#fff;
line-height: 16px;
text-align: center;
right: 4px;
bottom: 4px;
}

</style>
