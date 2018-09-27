<template>
  <div class="chatEditor_">
    <!-- 功能按钮 -->
    <div class="functionalAreas">
      <!-- 表情 -->
      <i class="web_wechat_face" @click="expressionSwitchFun"></i>
      <!-- 表情包 -->
      <div v-if="bqb_bool" class="bqb_">
        <expression
          @addExpres="addExpression"
        />
      </div>
      <!-- 剪切 -->
      <!-- <i class="web_wechat_screencut"></i> -->
      <!-- 文件 -->
      <i class="web_wechat_pic" @click="fileClick"></i>
    </div>
    <!-- 模拟文本输入区 -->
    <!-- <div 
      contenteditable="true" 
      class="text_input" 
      id="text_input_" 
      @keydown="btnSendFun_key($event)"
    ></div> -->
    <!-- 多行文本框输入 -->
    <textarea 
      class="text_input" 
      id="text_input_" 
      @keydown="btnSendFun_key($event)"
    ></textarea>
    <!-- 发送按钮 -->
    <div class="action">
      <!-- <button id="changan">长按录音</button> -->
      <span class="tishitext">按下 Enter 发送</span>
      <a id="send_c" class="btn_send" href="javascript:;" @click="btnSendFun">发送</a>
    </div>
    <input type="file" id="upload_file" multiple style="display: none"/>
  </div>
</template>

<script>
import expression from '@/components/expression'

export default {
  props:['unesValue','Iticket'],
  data() {
    return {
      bqb_bool:false,
      imgList:[],
      REstr_0:'',
      REstr_1:'',
    }
  },
  components: {
    expression
  },
  watch:{
    unesValue:{//深度监听对象的变化
      handler(newVal, oldVal){
        if(newVal.id !== oldVal.id){
          var this_ = this;
          // 读取本地保存数据
          $('#text_input_').val('');
          // 获取当前微信正则
          indexedDBopt.getData('userData','unesArr',function(data){
            if(data && data != undefined){
              for(var i=0;i<data.val.length;i++){
                if(data.val[i].wxno == newVal.belongs){
                  this_.REstr_0 = data.val[i].wordsNotice;
                  this_.REstr_1 = data.val[i].wordsIntercept;
                };
              };
            };
          });
        };
      }
    }
  },
  mounted(){
    this.fileChange();
  },
  methods:{
    // 返送消息必要条件
    mustCondition:function(){
      // 判断登入状态
      if(this.$cookie.getCookie('userKey') == null){  
        alert('当前账号已退出，请重新登入！');
        this.$router.push({path:'/'});  
        return false;
      };

      // 判断当前微信是否连接状态
      if(this.unesValue.imstatus == '1'){ 
        alert('当前微信未连线！不可发送'); 
        return false;
      };

      // 判断是否已选聊天会话对象
      if(this.unesValue.id === undefined){  
        alert('您还没有选择聊天对象');  
        return false;
      };

      return true;
    },
    // im消息发送并且发送父级
    sendMessage:function(contentobj){

      // 客户id
      var id =            this.unesValue.id,
      // 客户微信号
      wxno =              this.unesValue.wxno,
      // 客户微信id
      wxid =              this.unesValue.wxid,
      // 接收者id
      toAccount =         this.unesValue.wechatId,
      // 发送者id
      fromAccount =       this.Iticket,
      // 消息类型
      type =              contentobj.type,
      // 消息正文
      content =           contentobj.newMsg_,
      // 消息时间
      conversationTime =  Date.parse(new Date());
      // 消息结构
      var senVal={  id:id,  wxno:wxno,  wxid:wxid,  toAccount:toAccount,  fromAccount:fromAccount,  type:type,  content:content,  conversationTime:conversationTime  };
      console.log(senVal);

      // Im发送消息
      ISendMsg({
        // 用户ticket
        iTicket:        fromAccount,
        // 对方客户ticket
        acrossTicket:   toAccount,
        // 发送的消息内容
        value:          senVal
      });

      // 触发父级函数当前会话窗渲染
      this.$emit('newValDealWith',{id:id,val:senVal});
    },
    // 点击enter发送消息
    btnSendFun_key:function(event){
      if(!event.ctrlKey && event.keyCode == 13){
        // 发送消息
        event.preventDefault();
        document.getElementById("send_c").click();
      }else if(event.ctrlKey && event.keyCode == 13){
        // 回车
        event.preventDefault();
        $('#text_input_').val(  $('#text_input_').val()+'\n'  );
      };
    },
    // 点击文件图标
    fileClick:function(){
      // 判断是否能发送消息
      if(!this.mustCondition()){  return  };
      document.getElementById('upload_file').click();
    },
    // 发送图片消息
    fileChange:function(){
      var this_=this;
      $.getScript('./static/js/spark-md5.js',function(){
        $(document).ready(function () {
          $("#upload_file").change(function () {
            var date=(new Date()).toUTCString();
            var file=$(this).get(0).files[0];
            var bucket_name="cloned";              //服务名称
            var opename="xinyingjia";                      //操作员账号
            var opepass="xinyingjia123456";                      //操作员密码
            var acc_point="http://v0.api.upyun.com/";
            var md5 = SparkMD5.hash("PUT&/"+encodeURI(bucket_name)+"&"+date+"&"+file.size+"&"+SparkMD5.hash(opepass));
            var save_as="/chat_media/"+md5+'_'+file.name;
            // 图片拼接字符
            if(file.type.indexOf('image') > -1){  save_as = save_as + '!width100'  };

            var sign=SparkMD5.hash("PUT&/"+encodeURI(bucket_name+save_as)+"&"+date+"&"+file.size+"&"+SparkMD5.hash(opepass));

            if(file.size>50000000){
              alert('文件不允许大于50')
              return;
            }else if(file.type.indexOf('image') > -1 && file.size>100000){
              alert('图片不允许大于100K')
              return;
            }

            var xhr = new XMLHttpRequest();
            xhr.upload.onprogress = function (event) {
              if (event.lengthComputable) {  console.log(event)  };
            };
            xhr.onload=function(event){
              if(xhr.status==200){

                //保存路径
                var media_url = 'http://cloned.test.upcdn.net'+save_as;

                // 发送图片、视频消息
                this_.sendMessage({
                  // 类型
                  type:typeFun(file.type),
                  // 消息正文
                  newMsg_:media_url,
                });

              }else{  alert("上传失败,代码:"+JSON.parse(xhr.responseText).code)  };
            };
            xhr.open('PUT', acc_point+encodeURI(bucket_name+save_as), true);
            xhr.setRequestHeader("Authorization","UpYun "+opename+":"+sign);
            xhr.setRequestHeader("X-Date",date);
            xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            xhr.send(file);
          });
        });
      });

      // 判断图片与视频类型函数
      function typeFun(fileType){
        if(fileType.indexOf('image')>-1){   //图片类型
          return 3;
        }else if(
          fileType.indexOf('audio')>-1 ||
          fileType.indexOf('video')>-1 
        ){                                  //文件类型
          return 43;
        }else{                              //文件类型
          return 49;
        };
      };


    },
    // 发送聊天消息
    btnSendFun:function(){
      var contentobj = this.getDataType();

      // 判断是否能发送消息
      if(!this.mustCondition()){  return  };

      // 消息变量获取消息以及类型
      var contentobj = this.getDataType();

      // 判断消息不能为空
      if(contentobj.length == 0){  alert('发送的消息不能为空');  return;  };


      var this_ = this;
      var patt = new RegExp(this_.REstr_0,'g');
      var patt_1 = new RegExp(this_.REstr_1,'g');

      // 循环消息数组
      for(var i=0; i<contentobj.length; i++){
        if(
          contentobj[i].newMsg_.match(patt)!=null && 
          this_.REstr_0 != undefined &&
          this_.REstr_0 != ''
        ){  
          alert('您的消息内容有敏感词')  
        }else if(
          contentobj[i].newMsg_.match(patt_1)!=null && 
          this_.REstr_1 != undefined &&
          this_.REstr_1 != ''
        ){
          alert('您的消息内容有敏感词!不得发送')
          return;
        }
        this.sendMessage(contentobj[i]);
      };

      $('#text_input_').val('');
    },
    // 获取编辑消息并且类型判断
    getDataType:function(){
      var val  =  $('#text_input_').val();
      var type =  '1';
      var valArr = [];

      // 判断消息为空
      if(val == ''){  return [];  };

      return [{
        // 发送的消息
        newMsg_:  val,
        // 消息类型
        type:     type
      }];
    },
    // 打开与关闭表情包
    expressionSwitchFun:function(){
      if(this.bqb_bool){
        this.bqb_bool=false;
      }else{
        this.bqb_bool=true;
      }
    },
    // 文本输入区域添加表情
    addExpression:function(data){
      $('#text_input_').val(
        $('#text_input_').val()+data
      );
      this.bqb_bool=false;
    },
    


  }
}
</script>

<style>
.chatEditor_{
  width: 100%;
  height: 100%;
}
.functionalAreas{
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  padding: 5px 17px;
  text-align: left;
  position: relative;
}
.bqb_{
  width: auto;
  height: auto;
  position: absolute;
  bottom: 38px;
  left: 17px;
  z-index: 999;
}
.text_input{
  width: 100%;
  height: 110px;
  box-sizing: border-box;
  padding:0 20px;
  text-align: left;
  background:none;  
  /*  */
  font-size: 14px;
  font-family:PingFangSC-Regular;
  font-weight:450;
  letter-spacing:1px;
  /*  */
	outline:none;  
	border:0px;
  overflow:auto;
  resize:none;
}
.action{
  width: 100%;
  height: 30px;
  box-sizing: border-box;
  padding:0 20px;
  margin-top: 5px;
  text-align: right;
}
.btn_send{
  width: 90px;
  height: 30px;
  border-radius: 5px;
  display: inline-block;
  box-sizing: border-box;
  text-align: center;
  line-height: 30px;
  font-size: 14px;
  background-color: #fff;
  color: #222;
  border: 1px solid #c1c1c1;
}
.tishitext{
  font-size: 14px;
}
.imgtype{
  height: 80px;
  width: auto;
}
</style>
