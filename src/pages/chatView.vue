<template>
  <div class="chatView_">
    <div>
      <p class="chatView_title">{{unesValue.nickname}}</p>
    </div>
    <div id="scrolldIV"  class="informationView">
      <!-- 聊天消息展示 -->
      <div class="informationView_k"  v-if="switch_view">
        <span v-if="unesValue.id!='' && msgVal.lingth < 8" @click="pushMsgValFun">查看更多消息</span>
        <div v-for="(val,i) in msgVal" :key="i">
          <!-- 发送的文本信息组件 -->
          <sendAessage 
            :id="i"
            :boolobj="val.fromAccount===Iticket"
            :msgVal="val.content"
            :type="val.type"
            :time="val.conversationTime"
            :headImgUrl="[unesValue.headImgUrl,'./static/img/Logo.png']"
          />
        </div>
      </div>

      <!-- 用于计算加载消息高度 -->
      <div class="informationView_k informationView_k2_" v-show="false">  
        <div v-for="(val,i) in newMsgVal" :key="i">  
          <sendAessage   :boolobj="val.fromAccount===Iticket"  :type="val.type" :headImgUrl="[unesValue.headImgUrl,'./static/img/Logo.png']"  :msgVal="val.content" :time="val.conversationTime" />  
        </div>
      </div>
    
    </div>
  </div>
</template>

<script>
import sendAessage from '@/components/sendAessage' 
export default {
  props:['unesValue','Iticket'],
  data() {
    return {
      msgVal:[],
      newMsgVal:[],
      switch:true,
      switch_view:true,
      heightNum:0,
    }
  },
  components: {  sendAessage  },
  watch:{
    msgVal:{//深度监听数组的变化
      handler(newVal, oldVal){
        // 当数据更新时执行显示滚动条最下方信息
        var this_=this;
        // 点击图片放大
        this_.clickimgFun();

        if(this_.switch){
          // 聊天记录保持展示最下方的
          this_.showNew();
        };

        // 计算高度
        setTimeout(function(){
          this_.heightNum = $(".informationView_k").height();
        });

      },
      deep:true
    },
    unesValue:{//深度监听对象的变化
      handler(newVal, oldVal){
        // 读取本地保存数据
        this.readValFun(newVal);
      },
      deep:true
    }
  },
  mounted() {
    this.showNew();
    // this.overflowFun();
    // this.listeningRolling();
  },
  updated(){
    if(this.switch){
      // 聊天记录保持展示最下方的
      this.showNew();
    };
  },
  methods:{
    // 聊天记录保持展示最下方的
    showNew:function(){
      setTimeout(function(){
        var div = document.getElementById('scrolldIV');
        div.scrollTop = div.scrollHeight;
      },50);
    },
    // 滚动条随鼠标移入移出切换
    overflowFun:function(){
      var this_ = this;
      
      $('.informationView').mousemove(function(){
        if(this_.unesValue.id != undefined){
          // 鼠标移入显示滚动条
          $(this).css({overflow:'auto'});
        }
      }).mouseout(function(){
        // 鼠标移出隐藏滚动条
        $(this).css({overflow:'hidden'});
      });
      
    },
    // 监听滚动聊天记录
    listeningRolling:function(){
      var this_ = this;
      //绑定滚动事件
      $(".informationView").scroll(function(){
        if($(".informationView").scrollTop() === 0   &&  this_.switch){
          // 获取旧高度
          var oldHelght = this_.heightNum;

          // 关闭开关
          this_.switch = false;

          // 新加载数据(模拟后台请求数据)
          this_.newMsgVal = [
            {"wxno":"Lyh_HoiRab","fromAccount":"9d1b86f5fdaf459b9dc773d8ef4663f1","toAccount":"9d1b86f5fdaf459b9dc773d8ef4663f1","content":"11111111","conversationTime":1531913599000,"type":"1","id":"00055b446afb4e659e710ff0845d77db"},
            {"wxno":"Lyh_HoiRab","fromAccount":"9d1b86f5fdaf459b9dc773d8ef4663f1","toAccount":"9d1b86f5fdaf459b9dc773d8ef4663f1","content":"22222222","conversationTime":1531913599000,"type":"1","id":"00055b446afb4e659e710ff0845d77db"},
            {"wxno":"Lyh_HoiRab","fromAccount":"9d1b86f5fdaf459b9dc773d8ef4663f1","toAccount":"9d1b86f5fdaf459b9dc773d8ef4663f1","content":"33333333","conversationTime":1531913599000,"type":"1","id":"00055b446afb4e659e710ff0845d77db"},
            {"wxno":"Lyh_HoiRab","fromAccount":"9d1b86f5fdaf459b9dc773d8ef4663f1","toAccount":"9d1b86f5fdaf459b9dc773d8ef4663f1","content":"44444444","conversationTime":1531913599000,"type":"1","id":"00055b446afb4e659e710ff0845d77db"},
            {"wxno":"Lyh_HoiRab","fromAccount":"9d1b86f5fdaf459b9dc773d8ef4663f1","toAccount":"9d1b86f5fdaf459b9dc773d8ef4663f1","content":"55555555","conversationTime":1531913599000,"type":"1","id":"00055b446afb4e659e710ff0845d77db"}
          ];

          // 追加数据
          this_.msgVal = this_.newMsgVal.concat(this_.msgVal);

          setTimeout(function(){  

            // 指定滚动条高度
            $(".informationView").scrollTop(this_.heightNum - oldHelght);

            // 定时器打开开关
            setTimeout(function(){  this_.switch = true   },120);

          },10);
        };
      });
    },
    // 读取本地保存数据
    readValFun:function(newVal){
      if(newVal.id == undefined){ 
        this.msgVal = [];
        return; 
      };

      var this_=this;
      var msgVal_n = [];
      indexedDBopt.getData('userValList',newVal.id,function(data){
        if(data && data!=undefined){
          // 赋值本地数据
          msgVal_n = data.val;
        }else{
          // 清空数据
          msgVal_n = [];
        };

        indexedDBopt.getData('unreadMessages',newVal.id,function(data){
          if(data && data!=undefined){
            var length_ = data.val.length;
            var newVal_ = [];
            // 赋值本地数据
            this_.msgVal = msgVal_n = msgVal_n.concat(data.val);
            if(msgVal_n.length>50){
              var jishu = msgVal_n.length-50;
              for(var i=0;i<50;i++){
                newVal_.push(
                  msgVal_n[jishu+i]
                );
              };
              // 重新赋值
              indexedDBopt.putData('userValList',[{id:newVal.id,val:newVal_}]);
            }else{
              indexedDBopt.putData('userValList',[{id:newVal.id,val:msgVal_n}]);
            }

            // 删除此数据
            indexedDBopt.deleteDataByKey('unreadMessages',newVal.id);

            // 更改未读消息数量
            indexedDBopt.getData('userList',newVal.id,function(data){
              // 未读消息赋值为0
              data.val.wdVal = 0;
              // 
              indexedDBopt.putData('userList',[{id:newVal.id,val:data.val}]);
              // 所属微信号
              var wxNum = data.val.belongs;
              
              indexedDBopt.getData('userData','unesArr',function(data){
                for(var i=0; i<data.val.length; i++){
                  if(data.val[i].wxno == wxNum){
                    data.val[i].unreadNum -= length_;
                    break;
                  }
                };
                indexedDBopt.putData('userData',[{type:'unesArr',val:data.val}]);

              });
            });
          }else{
            this_.msgVal = msgVal_n;
          };

        });

      });

    },
    // 追加新消息数据渲染
    newValDrawing:function(newVal){
      this.msgVal.push(newVal);
    },
    // 聊天记录请求
    pushMsgValFun:function(){

    },
    // 点击图片/视频放大
    clickimgFun:function(){
      var this_=this;
      setTimeout(function(){
        // 点击图片
        $('.imgMsg').bind('click',function(){
          var src=$(this).attr('src');
          setTimeout(function(){
            $('.maskPop_a').html('<img src="'+src+'" style="width:auto;height:auto;max-width:600px;max-height:600px;"/>');
          });
          $('body *').one("click",function(){  $('.maskPop_a').html('');  });
        });
        // 点击视频
        $('.videoDiv').bind('click',function(){
          var src=$(this).attr('data-src');
          setTimeout(function(){
            $('.maskPop_a').html(`
              <video width="auto" height="auto" controls="controls" style="max-width:600px;max-height:600px;">
                <source src="${src}" type="video/ogg">
                <source src="${src}" type="video/mp4">
              </video>
            `);
          });
          $('body *').one("click",function(){  $('.maskPop_a').html('');  });
        });

      },200);
    },

  }
}
</script>

<style>
.chatView_{
  width: 100%;
  height: 100%;
}
.chatView_title{
  width: 96%;
  height: 50px;
  box-sizing: border-box;
  line-height: 50px;
  font-size: 14px;
  font-weight: 400;
  margin: 0 20px;
  border-bottom: 1px solid #d6d6d6;
}
.informationView{
  width:100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 20px;
  padding-left: 20px; 
  padding-right: 20px;
  border-bottom: 1px solid #d6d6d6;
  overflow:auto;
}
.informationView_k{
  width: 100%;
  height: auto;
}
</style>
