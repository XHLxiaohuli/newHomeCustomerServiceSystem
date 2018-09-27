<template>
  <div class="impage_">
    <!-- 聊天区域 -->
    <div class="layout_">
      <!-- 好友列表 -->
      <div class="layout_left">
        <!-- 左列表模块 -->
        <clientList
          :wxIndex="wxI"
          :unesArr="unesArr"
          :unesValue="unesValue"
          :recentSes="recentSes"
          :webimVal="webimVal_"
          @unesIdSwitch="unesIdSwitch"
          @wxIdSwitch="wxIdSwitchFun"
          @rightClick_="rightClickFun"
        />
      </div>
      <!-- 即时聊天 -->
      <div class="layout_right">
        <div class="layout_right_buju">
        <!-- 聊天信息视图区 -->
        <div class="imView">
          <!-- 聊天视图模块 -->
          <chatView
            ref="chatView_M"
            :unesValue="unesValue"
            :Iticket="Iticket"
            @sessionOrder="sessionOrder"
          />
        </div>
        <!-- 消息编辑区域 -->
        <div class="textEditor">
          <!-- 聊天编辑模块 -->
          <chatEditor
            :Iticket="Iticket"
            :unesValue="unesValue"
            @newValDealWith="newValDealWith"
          />
        </div>
        </div>
      </div>
      <!-- 右侧详情 -->
      <div class="layout_right_right" v-if="unesValue.wechatId">
        <userDetails
          :Iticket="Iticket"
          :unesValue="unesValue"
          :webimVal="webimVal_"
          @callValueFun="callValueFun"
        />
      </div>
    </div>

    <!-- 消息提示 -->
    <popupWin  ref="popupWin_"  />

    <!-- 拨打电话界面组件 -->
    <callInterface  ref="callInter"/>

    <!-- 图片与视频弹窗 -->
    <div class="maskPop_a" style="width:auto;height:auto;"></div>

    <!-- 单个分组 -->
    <popOperation
      v-if="popOperaShow==0"
      :title="'修改分组'"
      :popOperaVal="popOperaVal_plfz"
      @determine="determine_plfz_"
      @cancel="popOperaHideFun"
    />

  </div>
</template>

<script>
import clientList from '@/pages/clientList'
import chatView from '@/pages/chatView'
import chatEditor from '@/pages/chatEditor'
import userDetails from '@/pages/userDetails'


// 拨打电话接通界面
import callInterface from '@/components/callInterface'
// 遮罩组件
import maskPopModule from '@/components/maskPopModule' 
// 遮罩表单组件
import popOperation from '@/components/popOperation'
// 消息提示组件
import popupWin from '@/components/popupWin'



export default {
  data() {
    return {
      // Iticket
      Iticket:'',
      // 当前用户个人信息
      webimVal_:{},
      // 好友列表
      unesArr:[],
      // 当前会话聊天对象
      unesValue:{},
      // 最近会话列表数组
      recentSes:[],
      // 当前微信组下标（用于切换对应微信号客户）
      wxI:0,
      // 当前微信组名
      wxNumber:'',
      // 分组弹窗展示数据
      popOperaVal_plfz:[{
          title:'选择微信分组',
          type:'select',
          prompt:'请选择微信分组',
          selectValArr:[]
      }],
      // 弹窗显示参数
      popOperaShow:-1,
      // 好友分组操作对象
      aSinglGroupval:'',
    }
  },
  components: {
    clientList,
    chatView,
    chatEditor,
    userDetails,
    maskPopModule,
    popOperation,
    popupWin,
    callInterface
  },
  beforeCreate() {
    this.Iticket = this.$cookie.getCookie('userKey');
    // 判断登入状态
    if(this.Iticket == null){
      alert('请先登入账号')
      this.$router.push({path:'/'});
    };

    var this_ = this;

    if(this_.$route.query.bool_){
      // 创建indexedDB本地存储数据表
      window.indexedDBopt = indexedDBoptFun
      (this_.$route.query.relationId, 1, [
        {name:'userData',keyPath:'type'},						//用户信息
        {name:'userList',keyPath:'id'},							//好友列表

        {name:'userValList',keyPath:'id'},					//已读消息数据
        {name:'unreadMessages',keyPath:'id'},				//未读消息数据
        {name:'recentSession',keyPath:'id'}					//微信最近会话排序
      ]);
    }else{
      // 强制刷新
      location.reload(true);
      // 改变地址栏参数值
      window.location.href=changeURLArg(window.location.href,'bool_',true);
      function changeURLArg(url,arg,arg_val){
        var pattern=arg+'=([^&]*)';
        var replaceText=arg+'='+arg_val; 
        if(url.match(pattern)){ 
          var tmp='/('+ arg+'=)([^&]*)/gi'; 
          tmp=url.replace(eval(tmp),replaceText); 
          return tmp; 
        }else{ 
          if(url.match('[\?]')){ 
            return url+'&'+replaceText; 
          }else{ 
            return url+'?'+replaceText; 
          } 
        } 
        return url+'\n'+arg+'\n'+arg_val; 
      };
    }

  },
  mounted() {
    this.initialize();
  },
  methods:{
    // 初始化执行函数
    initialize:function(){
      var this_=this;
      // 获取本地个人信息
      indexedDBopt.getData('userData','webimVal',function(data){
        if(data && data != undefined){
          // im登入
          this_.imLoginFun(data.val);
          // ticket赋值
          this_.Iticket=data.val.relationId;
          // 当前用户信息赋值
          this_.webimVal_=data.val;

        console.log(this_.webimVal_);

        }else{
          // 路由跳转登入页面
          this_.$router.push({  path:'/'  });
        }
      });
      // 获取微信信息
      indexedDBopt.getData('userData','unesArr',function(data){
        if(data && data != undefined){
          // 微信信息赋值
          this_.unesArr=data.val;
        }else{  this_.unesArr=[]  }
      });
    },
    // 登入 im 账号
    imLoginFun:function(webimVal){
      var this_ = this;
      // 登入im
      webimObj({
        //帐号模式，0-表示独立模式，1-表示托管模式，开发者根据自己的模式，改成相应的值。
        accountType:'0',
        //用户帐号
        identifier:webimVal.relationId,
        //业务id
        sdkAppID:webimVal.sdkAppId,
        //鉴权 Token
        userSig:webimVal.sig,
        //建立通讯链接成功回调
        connectionYes:function(){
          // alert('建立通讯链接成功');
          console.log(webim.CONNECTION_STATUS);
        },
        // 多实例登入，强制下线
        onKickedEventCall:function(){
          // 删除
          this_.$cookie.delCookie('userKey');
          webim.logout(function(){
            this_.$router.push({
              path:'/',
              query:{  }
            });
            console.log('退出');
            console.log(webim.CONNECTION_STATUS)
          });


        },
        //监听新消息回调函数
        newMsgValFun:function(valueList){
          // 获取新监听消息
          // var valueList = this.newMsgList;
          // 执行接收新消息操作函数
          this_.receiveNewVal(valueList);
        }
      });
    },
    // 接收新消息操作
    receiveNewVal:function(valueList){

      var newValArrObj = [];

      // 循环会话消息对象
      for(var i=0; i<valueList.length; i++){
        // 获取会话对象fromAccount
        // var fromAccount = valueList[i].fromAccount;
        // 获取当前会话对象消息列
        var unesValList = valueList[i].elems;

        // 循环当前会话对象消息列
        for(var n=0; n<unesValList.length; n++){

              // 单个消息
              var aSingleVal = unesValList[n];
              // aSingleVal.type //消息类型
              var aStext = aSingleVal.content.text //消息内容
                  // 正则转换引号
                  aStext=aStext.replace(/&quot;/g,'"');
              // 字符串转换对象
              var newValObj = JSON.parse(aStext);


              if(newValObj.type == '100' || newValObj.type == '101' || newValObj.type == '205' || newValObj.type == '202'){

                this.determineMsgType(newValObj);

              }else{

                var bool_new = true;

                for(var m=0;m<newValArrObj.length;m++){
                  if(newValArrObj[m].id == newValObj.id){
                    newValArrObj[m].contentArr.push(newValObj);
                    bool_new = false;
                    break;
                  };
                };

                if(bool_new){
                  newValArrObj.push({
                    id:newValObj.id,
                    contentArr:[newValObj],
                  });
                };

              };
          
        };
      };

      if(newValArrObj.length>0){

        for(var i=0;i<newValArrObj.length;i++){
          // 判断当前消息是否为当前聊天对象消息
          if(newValArrObj[i].id == this.unesValue.id){
            this.additionalVal_2(newValArrObj[i]);
            for(var n=0;n<newValArrObj[i].contentArr.length;n++){
              // 当前会话追加新数据渲染视图
              this.sendFun(newValArrObj[i].contentArr[n]);
            };
          }else{  //未读消息
            this.unreadMessages_2(newValArrObj[i]);
          }
        };

      };

    },
    // 已读数据本地存储
    additionalVal_2:function(newValArrObj){

      var this_= this;
      // 先获取数据表中对应数据
      indexedDBopt.getData('userValList',newValArrObj.id,function(data){
        var oldVal=[];
        // 判断数据是否存在
        if(data && data!=undefined){
          oldVal = data.val;
          // 判断旧消息记录是否超过50条
          if(oldVal.length>=50){
            // 超过50条则删除最旧的消息记录
            oldVal.splice(0, newValArrObj.contentArr.length);
          };
        };
        // 新旧消息合并
        var newVal_ = oldVal.concat(newValArrObj.contentArr);
        // 更新数据表数据
        indexedDBopt.putData('userValList',[{id:newValArrObj.id,val:newVal_}]);
        
        // 更新最后会话内容与时间
        this_.updateFinal({id:newValArrObj.id,val:newValArrObj.contentArr});
        // 最近会话列表排序更新
        this_.sessionOrder({type:'id',str:newValArrObj.id});
      });


    },
    // 未读数据本地存储
    unreadMessages_2:function(newValArrObj){

      var this_= this;
      // 先获取数据表中对应数据
      indexedDBopt.getData('unreadMessages',newValArrObj.id,function(data){
        var oldVal=[];
        // 判断数据是否存在
        if(data && data!=undefined){
          oldVal = data.val;
          // 判断旧消息记录是否超过50条
          if(oldVal.length>50){
            // 超过50条则删除最旧的消息记录
            oldVal.splice(0, newValArrObj.contentArr.length);
          };
        };
        // 新旧消息合并
        var newVal_ = oldVal.concat(newValArrObj.contentArr);
        // 更新数据表数据
        indexedDBopt.putData('unreadMessages',[{id:newValArrObj.id,val:newVal_}]);

        // 更新最后会话内容与时间
        this_.updateFinal({id:newValArrObj.id,val:newValArrObj.contentArr});
        // 最近会话列表排序更新
        this_.sessionOrder({type:'id',str:newValArrObj.id});
      });

    },
    // 新消息处理(判断新消息是当前会话对象消息、或是列表好友中未读消息)
    newValDealWith:function(obj={
      id:'',      //新消息的对象ticket
      val:{}      //新消息对象
    }){
      // 判断是否为当前会话id
      if(obj.id===this.unesValue.id){
        // 保存本地数据表(已读)
        this.additionalVal(obj);
        // 当前会话追加新数据渲染视图
        this.sendFun(obj.val);
      }else{
        // 保存本地数据表(未读)
        this.unreadMessages(obj);
      };
    },
    // 本地数据库表更新聊天信息数据
    additionalVal:function(obj={
      id:'',    //会话对象的ticket
      val:{}        //聊天消息内容        
    }){
      var this_= this;
      // 先获取数据表中对应数据
      indexedDBopt.getData('userValList',obj.id,function(data){
        var oldVal=[];
        // 判断数据是否存在
        if(data && data!=undefined){
          oldVal = data.val;
          // 判断旧消息记录是否超过50条
          if(oldVal.length>50){
            // 超过50条则删除最旧的消息记录
            oldVal.splice(0, 1);
          };
        };
        // 新旧消息合并
        oldVal.push(obj.val);
        var newVal_ = oldVal;
        // 更新数据表数据
        indexedDBopt.putData('userValList',[{id:obj.id,val:newVal_}]);
        
        // 更新最后会话内容与时间
        this_.updateFinal({id:obj.id,val:[obj.val]});
        // 最近会话列表排序更新
        this_.sessionOrder({type:'id',str:obj.id});
      });
    },
    // 更新好友最后消息内容与时间与未读消息追加
    updateFinal:function(obj={
      id:'',        //会话对象的ticket
      val:[]        //聊天消息内容    
    }){
      var this_ = this;
      var length_ = obj.val.length;

      // 先获取数据表中对应数据
      indexedDBopt.getData('userList',obj.id,function(data){

        // 判断数据是否存在
        if(data && data!=undefined){
          var newVal_;
          var wxnoID = data.val.belongs;

          // 赋值新消息内容
          data.val.finalNews={
            val:obj.val[length_-1].content,
            time:obj.val[length_-1].conversationTime,
            type:obj.val[length_-1].type
          };

          // 判断新消息是否为当前会话对象
          if(this_.unesValue.id !== obj.id){
            // 未读消息追加
            data.val.wdVal+=length_;
            // 更新微信号总未读消息数据
            updateWxNum(wxnoID , length_);
          }else{
            data.val.wdVal = 0;
          };

          newVal_ = data.val;
          indexedDBopt.putData('userList',[{id:obj.id,val:newVal_}]);

        };
      });


      // 更新微信号总未读消息数据
      function updateWxNum(wxnoID , length_){
        // 获取微信信息
        indexedDBopt.getData('userData','unesArr',function(data){
          var newVal_2;
          
          // 未读消息数量追加
          for(var i=0;i<data.val.length;i++){
            if(data.val[i].wxno === wxnoID){
              data.val[i].unreadNum += length_;
              break;
            };
          };

          newVal_2 = data.val;
          // 重新赋值微信数据
          this_.unesArr = data.val;
          indexedDBopt.putData('userData',[{type:'unesArr',val:newVal_2}]);
        });
      };

    },
    // 本地数据库表更新最近会话列表排序
    sessionOrder:function(obj){
      var this_ = this;

      // 判断类型(wxno:如果是微信号类型，则获取对应微信号的会话列表数组)(id:如果是id类型，则查找id所属微信，再更新微信的会话列表)
      if(obj.type=='wxno'){
        // 先获取数据表中对应数据
        indexedDBopt.getData('recentSession',obj.str,function(data){
          // 判断数据是否存在
          if(data && data!=undefined){
            // 最新会话列表赋值
            this_.recentSes = data.val;
          }else{
            indexedDBopt.putData('recentSession',[{id:obj.str,val:[]}]);
            // 最新会话列表赋值
            this_.recentSes = [];
          };
        });
      }else if(obj.type=='id'){
        indexedDBopt.getData('userList',obj.str,function(data){
          if(data && data!=undefined){

            // 获取所属微信号
            var wxNumber = data.val.belongs;

            // 先获取数据表中对应数据
            indexedDBopt.getData('recentSession',wxNumber,function(data){
              var oldVal=[];
              // 判断数据是否存在
              if(data && data!=undefined){
                oldVal = data.val;
                // 判断数组数据是否包含id
                var i = oldVal.indexOf(obj.str);
                if(i > -1){
                  // 先删除数组中对应元素
                  oldVal.splice(i , 1);
                }
                // 前面追加当前元素
                oldVal.unshift(obj.str);
                // 更新数据表数据
                indexedDBopt.putData('recentSession',[{id:wxNumber,val:oldVal}]);
              }else{
                // 前面追加当前元素
                oldVal.unshift(obj.str);
                // 更新数据表数据
                indexedDBopt.putData('recentSession',[{id:wxNumber,val:oldVal}]);
              };

              // 最新会话列表赋值
              if(wxNumber == this_.wxNumber){
                this_.recentSes = oldVal;
              };

            });

          };

        });
      };
    },
    // 点击切换客户时更新未读消息
    clickUpdateFinal:function(id){
      var this_ = this;

      // 获取个人信息判断是否有未读消息
      indexedDBopt.getData('userList',id,function(data){
        if(data.val.wdVal > 0){
          // 重新赋值
          data.val.wdVal = 0;
          // 更新数据表数据
          indexedDBopt.putData('recentSession',[{id:data.id,val:data.val}]);

          // 更新微信号总未读消息数据
          setTimeout(function(){
            updateWxNum(data.val.belongs , data.val.wdVal);
          },100);
        };
      });

      // 更新微信号总未读消息数据
      function updateWxNum(wxnoID,num){
        // 获取微信信息
        indexedDBopt.getData('userData','unesArr',function(data){
          var newVal_2;
          
          // 未读消息数量追加
          for(var i=0;i<data.val.length;i++){
            if(data.val[i].wxno === wxnoID){
              data.val[i].unreadNum -= num;
              break;
            };
          };

          newVal_2 = data.val;
          // 重新赋值微信数据
          this_.unesArr = data.val;
          indexedDBopt.putData('userData',[{type:'unesArr',val:newVal_2}]);
        });
        // 获取数据表中对应数据
        indexedDBopt.getData('recentSession',wxnoID,function(data){
          // 最新会话列表赋值
          this_.recentSes = data.val;
        });
      };
    },
    // 切换微信组下标
    wxIdSwitchFun:function(data){
      var canzhao = this.wxI;
      // 切换对应微信号下标
      this.wxI=data.index;
      // 切换对应微信号
      this.wxNumber=data.wxno;
      // 获取最近会话数组
      this.sessionOrder({type:'wxno',str:data.wxno});
      // 重新赋值当前会话对象
      if(canzhao != data.index){
        this.unesValue = {};
      }
    },
    // 切换客户(子级触发)
    unesIdSwitch:function(data){
      var this_ = this;

      // data为当前会话客户的信息
      data.imstatus = this_.unesArr[this_.wxI].status;

      this.unesValue=data;

      // 点击切换客户时更新未读消息
      this.clickUpdateFinal(data.id);

      // 设置好友已读状态
      if(!data.isRead){
        var objData = data;
        indexedDBopt.getData('userData','unesArr',function(data){
          if(data && data != undefined){
            for(var i=0;i<data.val.length;i++){
              if(data.val[i].wxno == objData.belongs){
                data.val[i].newFriends--;
                for(var n=0;n<data.val[i].groups.length;n++){
                  if(data.val[i].groups[n].groupsId==objData.groupsId){
                    data.val[i].groups[n].newFriends--;
                    for(var m=0;m<data.val[i].groups[n].friends.length;m++){
                      if(data.val[i].groups[n].friends[m].id==objData.id){
                        data.val[i].groups[n].friends[m].isRead=true;
                        // 微信信息赋值
                        this_.unesArr=data.val;
                        break;
                      }
                    };
                  };
                }
              };
            };
            // 本地保存微信信息
            indexedDBopt.putData('userData',[{type:'unesArr',val:data.val}]);
          }else{  this_.unesArr=[]  }
        });

        // 
        indexedDBopt.getData('userList',objData.id,function(data){
          if(data && data != undefined){
            data.val.isRead = true;
            // 用户数据保存本地
            indexedDBopt.putData('userList',[{id:objData.id,val:data.val}]);
          };
        });

        // 更改数据库好友已读状态
        this_.$axios({
          method:'post',
          url:"http://"+api+"/api/1.0/wechatFriend/read",
          headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':this_.$route.query.Iticket
          },
          params:{
            id:objData.id
          },
        }).then((res)=>{
          console.log(res);
          // if(res.data.success){ 
          // }else{  }
        }).catch((err)=>{
          console.log(err);
        });
      };

    },
    // 当前会话追加新数据渲染视图
    sendFun:function(data){
      // 执行当前会话窗新消息渲染函数
      this.$refs.chatView_M.newValDrawing(data);
    },
    // 判断系统消息和聊天消息
    determineMsgType:function(newValObj){
      console.log(newValObj);
      if(newValObj.type == '202'){  //微信状态

        var newWxVal = JSON.parse(newValObj.content);

        this.wxStateFun(newWxVal);

        if(newWxVal.wxno == this.unesValue.belongs){
          var newwxnoObj = this.unesValue;
          newwxnoObj.imstatus = newWxVal.status;
          this.unesValue = newwxnoObj;
        };

      }else if(newValObj.type == '100' || newValObj.type == '101' || newValObj.type == '205'){  //添加好友 //删除好友  
        var newWxVal = JSON.parse(newValObj.content);
        this.adduserFun(newWxVal);

        // 判断当前删除好友是否为会话好友
        if(newValObj.type == '101'){
          for(var i=0;i<newWxVal.length;i++){
            if(newWxVal[i].id == this.unesValue.id){
              this.unesValue = {};
              break;
            };
          };
        }
      
      }

    },
    // 微信状态改变
    wxStateFun:function(objData){

      var this_ = this;
      indexedDBopt.getData('userData','unesArr',function(data){
        if(data && data != undefined){
          for(var i=0;i<data.val.length;i++){
            if(data.val[i].wxno == objData.wxno){
              data.val[i].status = objData.status;
              // 微信信息赋值
              this_.unesArr=data.val;
              break;
            };
          };

          // 本地保存微信信息
          indexedDBopt.putData('userData',[{type:'unesArr',val:data.val}]);
          
          // 提示消息
          if(objData.status == '1'){
            this_.$refs.popupWin_.showFun('微信号：'+objData.nickname+' 已离线');
          }else if(objData.status == '0'){
            // this_.$refs.popupWin_.showFun('微信号：'+objData.nickname+' 已连线');
          };
        }else{  this_.unesArr=[]  }
      });
    },
    // 添加好友函数
    adduserFun:function(obj){
      var this_ = this;
      setTimeout(function(){
        this_.popOperaShow = -1;
        this_.getIinforma(this_.$route.query.Iticket);
      },2000);
    },
    // 获取个人信息以及好友列表信息
    getIinforma:function(Iticket){
      var this_ = this;
      this.$axios.all([
        // 获取当前用户好友列表
        this.$axios.get(
          "http://"+api+"/api/1.0/groups/wechatFriend/find/ticket",
          {headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':Iticket
          }}
        )
      ]).then(this.$axios.spread((res)=>{

        // 好友本地保存
        this.friendsSaveFun(res.data.result);

      })).catch((err)=>{
        console.log('获取用户信息失败');
      });
    },
    // 好友本地保存并且登入
    friendsSaveFun:function(unesArr){
      var this_ = this;
      // 最后一个好友id
      var lastFriend;
      
      // 判断是否要设置当前微信
      var bool_wxno = true;

      // 微信信息增加计数变量
      for(var i=0; i<unesArr.length; i++){
        unesArr[i].unreadNum = 0;
        // 判断当前微信内还有没有这个微信
        if(this_.wxNumber == unesArr[i].wxno){  bool_wxno = false  };
      };

      // 获取微信信息
      indexedDBopt.getData('userData','unesArr',function(data){
        if(data && data != undefined && unesArr.length > 0){
          // 微信信息增加计数变量
          var unesArr_2 = unesArr;
          for(var i=0;i<data.length;i++){
            for(var n=0;n<unesArr_2.length;n++){
              if(data[i].wxno == unesArr_2[n].wxno){
                unesArr_2[n].unreadNum=data[i].unreadNum;
              };
            }
          };
          // 本地保存微信信息
          indexedDBopt.putData('userData',[{type:'unesArr',val:unesArr_2}]);
        }else{
          // 本地保存微信信息
          indexedDBopt.putData('userData',[{type:'unesArr',val:unesArr}]);
        }
      });

      // 循环微信号
      for(var i=0;i < unesArr.length;i++){
        // 微信号分组
        var groups=unesArr[i].groups;
        // 循环分组
        for(var n=0;n < groups.length;n++){
          var friends=groups[n].friends;
          // 循环分组用户
          for(var m=0;m < friends.length;m++){
            // 赋值所属微信号
            friends[m].belongs = unesArr[i].wxno;
            // 赋值未读消息数量
            friends[m].wdVal = 0;
            // 赋值最后一消息
            friends[m].finalNews = {
              val:'',   //消息内容
              type:'',  //消息类型
              time:'',  //时间
            };
            // 记录最后一个好友id 
            lastFriend = friends[m].id;
            // 用户数据保存本地
            indexedDBopt.addData('userList',[{id:friends[m].id,val:friends[m]}]);
          }
        }
      };

      // 定时器判断好友是否全部保存本地
      var unesArrBool   = false ,
          userListBool  = false ,
      // 设置定时器
      timeVid = setInterval(function(){

        if(unesArr.length > 0){
          indexedDBopt.getData('userData','unesArr',function(data){
            if(data && data!=undefined){  unesArrBool = true;  }
          });
          indexedDBopt.getData('userList',lastFriend,function(data){
            if(data && data!=undefined){  userListBool = true;  }
          });
        }else{  
          unesArrBool = true; userListBool = true;
        };

        if(unesArrBool && userListBool){
          clearInterval(timeVid);
          // 获取微信信息
          indexedDBopt.getData('userData','unesArr',function(data){
            if(data && data != undefined){
              // 微信信息赋值
              this_.unesArr=data.val;

              // 设置当前微信展示
              if(bool_wxno && this_.unesArr.length>0){  
                this_.wxIdSwitchFun({index:0,wxno:this_.unesArr[0].wxno}) 
              }else if(this_.unesArr.length==0){
                this_.recentSes=[];
              };

            }else{  this_.unesArr=[]  }
          });
          this_.$refs.popupWin_.showFun('当前数据有更新请查阅');
        };
      },500);
    },
    // 获取操作对象
    rightClickFun:function(data){
      console.log(data);
      this.aSinglGroupval = data;
      var this_ = this;
      // 请求搜索栏数据
      this_.$axios.get(
        "http://"+api+"/api/1.0/groups/find/ticket?type=0",
        {headers:{
          'content-type': 'application/x-www-form-urlencoded',
          'ticket':this_.$route.query.Iticket
        }
      }).then((response)=>{
        if(response.data.success){
          var obj = [{
              title:'选择微信分组',
              type:'select',
              prompt:'请选择微信分组',
              selectValArr:[]
          }],arrVal = response.data.result;
          for(var i=0;i<arrVal.length;i++){
            obj[0].selectValArr.push({
              text:arrVal[i].name,
              val:arrVal[i].id
            });
          }
          this_.popOperaVal_plfz=obj;
          this_.popOperaShow=0;
        }else{
          alert(response.data.msg);
        }
      }).catch((error)=>{
        console.log(error);
      });
    },
    // 确定分组
    determine_plfz_:function(data){
      var this_ = this;
      this_.$axios({
        method: 'post',
        url: "http://"+api+"/api/1.0/groups/wechatFriend/"+data[0].val,
        headers:{
          'content-type': 'application/json',
          'ticket':this_.$route.query.Iticket
        },
        data: [this_.aSinglGroupval.id]
      }).then((response)=>{
        if(response.data.success){
          this_.adduserFun();
        }else{
          alert(response.data.msg);
        }
      }).catch((error)=>{
        console.log(error);
      });
    },
    //关闭弹窗 
    popOperaHideFun:function(){
      this.popOperaShow=-1;
    },
    // 获取拨打电话对象数据
    callValueFun:function(data){
      this.$refs.callInter.pareCallFun(data);
    },



  }
}
</script>

<style>
.impage_{
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 1250px;
  min-height: 650px;
}
.layout_{
  width: 99.9%;
  height: 99.9%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 3px;
  display: flex;
  flex-direction:row;
}
.layout_left{
  width: 360px;
  height: 100%;
}
.layout_right{
  width: 100%;
  height: 100%;
  background: #eee;
}
.layout_right_right{
  width:360px;
  height:100%;
  box-sizing: border-box;
  border-left: 1px solid #d6d6d6;
  background: #eee;
}
.layout_right_buju{
  width: 100%;
  height: 100%;
  position: relative;
}
.imView{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-bottom: 250px;
}
.textEditor{
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 0);
  width: 100%;
  height: 200px;
}
.maskPop_a{
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
