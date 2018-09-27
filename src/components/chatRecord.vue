<template>
  <div class="chatRecord">
    <div>
      <div class="chatRecord_div">
        <!-- 头部 -->
        <!-- <div class="chatRecord_top">
          <span>聊天记录</span>
        </div> -->
        <!-- 聊天记录搜索区 -->
        <div class="chatRecord_search">
          <!-- 时间筛选 -->
          <!-- <div>
            <div class="time_search">
              <searchModule
                :searchVal="searchModuleVal"
                @timeChooseFun="searchModuleFun"
              />
            </div>
          </div> -->
          <div>
            <div class="input_search">
              <input type="text" placeholder="请输入聊天内容" v-model="inputModel" @keydown.13="clickBtn">
              <!-- 搜索弹窗 -->
              <div class="input_seaChenr" v-if="msgValTis">
                <div  class="msgVal_pipei" 
                      v-for="(v,i) in msgTisVal"
                      :key="i"
                      @click="clickIdFun(v.id)">
                  {{v.msgVal}}
                  <p><span>{{getdate(v.time)}}</span></p>
                </div>
              </div>
            </div>
            <!-- <img src="../assets/img/on_serch_direct.png" alt="" @click="clickBtn"> -->
          </div>
        </div>
        <!-- 聊天记录视图区 -->
        <div class="chatRecord_content">
          <div class="chatRecord_view">
            <sendAessage 
              v-for="(v,i) in msgValList"  
              :key="i"
              :boolobj="v.boolobj"
              :type="v.type"
              :msgVal="v.msgVal"
              :time="v.time"
              :topUrl="topUrl_"
              :name="v.name"  
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 搜索组件
import searchModule from '@/components/searchModule'
// 消息显示组件
import sendAessage from '@/components/sendAessage.1'


export default {
  props:['Iticket','wxObj','topUrl'],
  data() {
    return {
      // 时间筛选组件
      // searchModuleVal:{
      //   timeChoose:{  bool:true,  id:'date1_x'  },
      //   fill:[{  type:'timeChoose',  s_name:'',  }]
      // },
      // 聊天数据
      msgValList:[],
      // 提示聊天信息数据展示
      msgValTis:false,
      // 提示聊天数据
      msgTisVal:[],
      // 搜索判断依据
      judgmentArr:[],
      // 搜索输入框绑定数据
      inputModel:'',
      // 开始时间
      开始时间:'',
      // 结束时间
      结束时间:'',
      // 模糊搜索id
      MHid:'',
      // 消息统计页码数组
      currentNumArr:[],
      // 第几页
      currentNum:'',
      // 上一页下一页
      onOrunderPage:'',
      // 显示个数
      showValNum:20,
      // 上下滚动专用个数
      showValNum_z:'',
      // 总个数
      total:'',
      // 数据下标
      offset_:'',
      // 信息高度
      height_view:'',
      // 数据操作标识类型
      valoption:-1,
      // 获取聊天消息参数
      wechatid_:this.wxObj.wechatId,
      // 获取聊天信息参数
      wxid_:this.wxObj.wxid,
      // 
      topUrl_:this.topUrl,
      // 判断同个消息id不连续请求
      msgIdPd:'',
    }
  },
  components: {  searchModule,sendAessage  },
  watch:{
    // 微信信息监听
    wxObj:{
      handler(newVal, oldVal){
        this.msgValList=[];
        this.currentNumArr=[];
        this.offset_ = '';
        this.height_view = '';

        // 获取聊天消息参数
        this.wechatid_=newVal.wechatId;
        // 获取聊天信息参数
        this.wxid_=newVal.wxid;
        this.clickBtn();
      },
      deep:true
    },
    topUrl:{
      handler(newVal, oldVal){
       this.topUrl_ = newVal;
      },
      deep:true
    },
  },
  mounted() {
    // this.judgmentValFun();
    this.rollingFUN();
    this.clickBtn();
  },
  methods:{
    // 输入框搜索函数
    searchFun:function(){
      var text = this.inputModel,
          judgmentVal = this.judgmentArr,
          indexArr = [];

      if(text!=''){
        for(var i=0;i<judgmentVal.length;i++){
          if(judgmentVal[i].indexOf(text) > -1){
            indexArr.push(i);
          };
        };
      };

      if(indexArr.length!=0){
        // 当前滚动高度
        var height_ = $('.chatRecord_view').position().top,
            view_height = $('.chatRecord_view').height(),
            bool_ = false,
            height_c;

        height_ = height_>=0?height_:height_*-1; 

        for(var i=0;i<indexArr.length;i++){
          height_c = $('.judgment').eq(indexArr[i]).position().top;
          if((view_height-height_)==520){
            bool_ = true; break;
          };
          if((height_c-height_)>20){
            $('.chatRecord_content').animate({scrollTop:height_c},500);
            return;
          };
        };
        if(bool_){
          $('.chatRecord_content').animate({scrollTop:$('.judgment').eq(indexArr[0]).position().top},500);
        };
      };
    },
    // 获取判断依据数据
    judgmentValFun:function(){
      var valArr = [];
      for(var i=0;i<this.msgValList.length;i++){
        valArr.push(this.msgValList[i].msgVal);
      };
      this.judgmentArr = valArr;
    },
    // 时间区间筛选回调函数
    // searchModuleFun:function(data){
    //   console.log(data);
    //   // 开始时间
    //   this.开始时间 = data.startDate;
    //   // 结束时间
    //   this.结束时间 = data.endDate;
    // },
    // 点击搜索按钮
    clickBtn:function(){
      if(this.inputModel==''){  //当输入框为空按时间请求聊天数据
        this.valoption=0;
      }else{  //当输入框不为空时请求模糊搜索提示
        this.valoption=1;
      };
      this.conditionFuzzy();
    },
    // 上下滚动操作函数
    rollingFUN:function(){
      var this_ = this;
      $('.chatRecord_content').scroll(function() {
        // 滚动高度
        var scrHeight = $('.chatRecord_view').position().top;
        // 聊天信息高度(并且数据不能为空)
        if(scrHeight == 0 && this_.msgValList.length>0){
          var maxNum = Math.max.apply(null, this_.currentNumArr);
          if(this_.total > maxNum + 20){

            this_.onOrunderPage=maxNum;  
            this_.showValNum_z=20;

            if(this_.msgIdPd !== this_.onOrunderPage){
              // 上滚
              this_.valoption=2;
              this_.conditionRolling();
            };

          }else if(this_.total < maxNum + 20){

            this_.onOrunderPage=maxNum;  
            this_.showValNum_z=this_.total - maxNum;

            if(this_.msgIdPd !== this_.onOrunderPage){
              // 上滚
              this_.valoption=2;
              this_.conditionRolling();
            };

          }else{
            // alert('无更多消息');
          }
        };

        if(scrHeight == Math.round(500-this_.height_view) && this_.msgValList.length>0){
          var minNum = Math.min.apply(null, this_.currentNumArr);
          // 下一页
          if(minNum > 0){
            
            if(minNum>=20){
              this_.onOrunderPage=minNum-20;
              this_.showValNum_z=20;
            }else{
              this_.onOrunderPage=0;
              this_.showValNum_z=minNum;
            };

            if(this_.msgIdPd !== this_.onOrunderPage){
              // 下滚
              this_.valoption=3;
              this_.conditionRolling();
            };

          }else{
            // alert('无更多消息');
          }
        };
      });
    },
    // 点击指定文本id
    clickIdFun:function(id){
      this.valoption=4;
      this.MHid = id;
      this.conditionRequest();
    },
    // 上下滚动获取数据
    conditionRolling:function(){
      
      this.msgIdPd = this.onOrunderPage;

      this.chatRecordValFun({
        offset:this.onOrunderPage,
        pageSize:this.showValNum_z,
        wxid:this.wxid_,
        wechatid:this.wechatid_,
        minConversationTime:'', 
        maxConversationTime:'',
        id:'',
        content:'',
      });
    },
    // 条件请求数据
    conditionFuzzy:function(){
      this.chatRecordValFun({
        offset:'',
        pageSize:'',
        wxid:this.wxid_,
        wechatid:this.wechatid_,
        minConversationTime:this.开始时间, 
        maxConversationTime:this.结束时间,
        id:'',
        content:this.inputModel,
      });
    },
    // id请求数据
    conditionRequest:function(){
      this.chatRecordValFun({
        offset:'',
        pageSize:this.showValNum,
        wxid:this.wxid_,
        wechatid:this.wechatid_,
        minConversationTime:'', 
        maxConversationTime:'',
        id:this.MHid,
        content:'',
      });
    },
    // 获取微信聊天数据
    chatRecordValFun:function(obj={
      offset:'',
      pageSize:'',
      wxid:'',
      wechatid:'',
      minConversationTime:'', 
      maxConversationTime:'',
      id:'',
      content:''
    }){
      var this_ = this;
        this_.$axios.get(
          "http://"+api+"/api/1.0/wechatMessage/page"+'?offset='+obj.offset+'&pageSize='+obj.pageSize+'&wxid='+obj.wxid+'&wechatId='+obj.wechatid+'&id='+obj.id+'&minConversationTime='+obj.minConversationTime+'&maxConversationTime='+obj.maxConversationTime+'&content='+obj.content,
          {headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':this_.Iticket
          }}
        )
        .then((response)=>{
          if(response.data.success){
            if(response.data.result.content.length>0){
              this_.returnValoptFun(response.data.result);
            }else{
              // alert('无记录');
            };
          }else{
            alert(response.data.msg);
          };          
        })
        .catch((error)=>{
          console.log(error);  
        });
    },
    // 聊天数据返回处理
    returnValoptFun:function(data){

      console.log(data);

      var this_ = this;
      var objVal = [];

      // 遍历消息格式
      for(var i=0; i<data.content.length; i++){
        objVal.push({
          id:data.content[i].id,
          time:data.content[i].conversationTime,
          boolobj:data.content[i].status=='3' ? false:true,
          type:data.content[i].type,
          msgVal:data.content[i].extract,
          name: data.content[i].status=='3' ? 
                data.content[i].friend.nickname :
                data.content[i].seller ? 
                data.content[i].seller.nickname :
                '',
        });
      };
      
      // 数组反转
      objVal=objVal.reverse();

      // 对返回数据的操作
      if(this_.valoption==0){//时间区域聊天记录
        // 聊天信息赋值
        this_.msgValList=objVal;
        this_.msgTisVal=[];
        this_.currentNumArr=[];
        this_.msgValTis = false;
        // 聊天信息定位
        setTimeout(function(){  $('.chatRecord_content').animate({scrollTop:20},0);  });
      }else if(this_.valoption==1){//模糊搜索匹配
        this_.msgValTis = true;
        this_.msgTisVal=objVal;
      }else if(this_.valoption==2){//向上滚动数据
        // 聊天信息头部追加reverse()
        this_.msgValList=objVal.concat(this_.msgValList);
        // 聊天信息定位
        setTimeout(function(){  $('.chatRecord_content').animate({scrollTop:$('.judgment').eq(objVal.length).position().top},0);  });
      }else if(this_.valoption==3){//向下滚动数据
        // 聊天信息尾部追加
        this_.msgValList=this_.msgValList.concat(objVal);
        // 聊天信息定位
        setTimeout(function(){  $('.chatRecord_content').animate({scrollTop:this_.height_view},0);  });
      }else if(this_.valoption==4){
        this_.msgValTis = false;
        this_.msgValList=objVal;
        this_.currentNumArr=[];
        // 聊天信息定位
        // setTimeout(function(){  $('.chatRecord_content').animate({scrollTop:20},0);  });
        setTimeout(function(){  $('.chatRecord_content').animate({scrollTop:10000000},0);  });
      };


      // 数据下标参数
      // this_.offset_ = data.pageRequest.offset;

      // 数据下标参数数组
      if(this_.currentNumArr.indexOf(data.pageRequest.offset) < 0){
        this_.currentNumArr.push(data.pageRequest.offset);
      };
      
      if(this_.currentNumArr.indexOf(data.pageRequest.limit) < 0){
        this_.currentNumArr.push(data.pageRequest.limit);
      };

      // 总个数
      this_.total = data.total;

      // 获取聊天框高度
      setTimeout(function(){
        this_.height_view = $('.chatRecord_view').height();
      },500);

      // 还原请求类型
      this_.valoption=-1;
    },
    getdate:function(num){
      var now = new Date(num),
          y = now.getFullYear(),
          m = now.getMonth() + 1,
          d = now.getDate();
      return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
    },


  }
}
</script>

<style>
.chatRecord_div{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-bottom: 20px;
  background: #fff;
  /* // border-radius: 5px; */
  float: right;
}
.chatRecord_top{
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  border-bottom:1px solid rgba(221,221,221,1);
  position: relative;
}
.chatRecord_top>span{
  position: absolute;
  left: 20px;
  top:50%;
  transform: translate(0, -50%);
  font-size:16px;
  font-family:PingFangSC-Medium;
  color:rgba(51,51,51,1);
  line-height:50px;
}
.chatRecord_top>img{
  width: 10px;
  height: auto;
  position: absolute;
  right: 20px;
  top:50%;
  transform: translate(0, -50%);
}
.chatRecord_search{
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  padding: 7.5px 10px;
  display: flex;
  flex-direction:column;
}
.time_search{
  width: 100%;
  height: 45px;
}
.input_search{
  width: 100%;
  height: 35px;
  position: relative;
  box-sizing: border-box;
  border-radius: 3px;
  border: 1px solid rgba(236,236,248,1);
  background-color: #fff;
  float: left;
}
.input_search>input{
  width: 100%;
  height: 30px;
  float: left;
  text-indent:10px;
  background:none;  
	outline:none;  
	border:0px;
}
.chatRecord_content{
  width: 100%;
  height: 540px;
  position: relative;
  box-sizing: border-box;
  padding:0 10px;
  overflow: auto;
}
.chatRecord_view{
  width: 100%;
  height: auto;
  position: relative;
  min-height: 540px;
  box-sizing: border-box;
  padding:30px 10px 10px 10px;
  background:rgba(236,237,238,1);
}
.input_seaChenr{
  width: 320px;
  height: 400px;
  overflow: auto;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid rgba(236,236,248,1);
  position: absolute;
  top:40px;
  right:0px;
  z-index: 999;
  background: #fff;
  padding: 10px;
}
.msgVal_pipei{
  width: 300px;
  height: auto;
  margin-bottom: 15px;
  border-radius: 5px;
  position: relative;
  box-sizing: border-box;
  padding:5px 5px 30px 5px; 
  word-wrap: break-word;
  word-break: break-all;
  text-align: left;
  box-shadow:0px 0px 5px #ccc;
}
.msgVal_pipei>p{
  width: 280px;
  height: 30px;
  line-height: 30px;
  position: absolute;
  bottom: 0;
  text-align: right;
}
.layout_left_{
  width: 250px;
  height: 650px;
  background: #fff;
  float: left;
}
</style>
