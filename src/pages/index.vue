<template>
  <div class="index_">
    <div class="index_container">
      <span class="index_title">新营家客服系统</span>
      <div class="index_form">
        <div class="index_form_container">
          <span class="index_denglu">登陆</span>
          <div class="index_biaodan">
            <p class="index_shuru">
              <img src="../assets/img/账号.png" alt="">
              <input type="text" placeholder="请输入登录账号" v-model="account_" @keydown.13="loginFun"/>
            </p>
            <p class="index_shuru">
              <img src="../assets/img/密码.png" alt="">
              <input type="password" placeholder="请输入登录密码" v-model="password_" @keydown.13="loginFun"/>
            </p>
            <p class="btn_login" @click="loginFun()">登陆</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      password_:'',
      account_:'',
    }
  },
  mounted() {
    if(this.$cookie.getCookie('userKey')){
      var ticket = this.$cookie.getCookie('userKey');
      this.getIinforma(ticket);
    }
  },
  methods:{
    // 登入账号
    loginFun:function(){
      var this_ = this;

      if(this_.password_==''){alert('密码不能为空!');return};
      if(this_.account_==''){alert('账号不能为空!');return};


      // 获取公钥
      $.ajax({
        type:"get",
        url:"http://"+api+"/api/1.0/pem/publicKey",
        contentType: 'application/x-www-form-urlencoded',
        success:function (res) {

          // RSA加密(公钥)
          var pubkey=res.result;
          var encrypt = new JSEncrypt();
              encrypt.setPublicKey(pubkey);

          // 密码加密
          this_.password = encrypt.encrypt(this_.password_);

          // 通过账号密码获取ticket
          this_.getTicketFun(this_.account_ , this_.password);
         
        },
        error:function (response) {
          alert('获取公钥失败');
        }
      });
    },
    // 获取ticket
    getTicketFun:function(account_,password){
      var this_ = this;

      // ajax获取ticket;
      $.ajax({
        type:"post",
        url:"http://"+api+"/api/1.0/account/login",
        data:{
            username:account_,
            password:password
        },
        contentType: 'application/x-www-form-urlencoded',
        success:function (res) {
          var ticket = res.result;

          this_.$cookie.setCookie('userKey',ticket,1);

          // 获取个人信息以及好友列表信息
          this_.getIinforma(ticket);

        },
        error:function (response) {
          alert('获取ticket失败');
        }
      });
    },
    // 获取个人信息以及好友列表信息
    getIinforma:function(Iticket){
      var this_ = this;
      this.$axios.all([
        // 获取个人信息
        this.$axios.get(
          "http://"+api+"/api/1.0/im/ticket",
          {headers:{
              'content-type': 'application/x-www-form-urlencoded',
              'ticket':Iticket
          }}
        ),
        // 获取当前用户好友列表
        this.$axios.get(
          "http://"+api+"/api/1.0/groups/wechatFriend/find/ticket",
          {headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'ticket':Iticket
          }}
        )
      ]).then(this.$axios.spread((res1,res2)=>{

        // 判断个人信息获取失败
        if(!res1.data.success){alert(res1.data.msg);return};
        
        // 判断好友信息获取失败
        if(!res2.data.success){alert(res2.data.msg);return};

        // 个人信息
        var webimVal_ = res1.data.result,

        // 好友列表信息
        unesArr = res2.data.result;

        // 创建indexedDB本地存储数据表
        window.indexedDBopt = indexedDBoptFun
        (webimVal_.relationId,1,[
          {name:'userData',keyPath:'type'},						//用户信息
          {name:'userList',keyPath:'id'},							//好友列表
          {name:'userValList',keyPath:'id'},					//已读消息数据
          {name:'unreadMessages',keyPath:'id'},				//未读消息数据
          {name:'recentSession',keyPath:'id'}					//微信最近会话排序
        ]);

        // 好友本地保存
        this.friendsSaveFun(webimVal_,unesArr,Iticket);

      })).catch((err)=>{
        alert('获取用户信息失败');
      });
    },
    // 好友本地保存并且登入
    friendsSaveFun:function(webimVal_,unesArr,Iticket){
      var this_ = this;
      // 最后一个好友id
      var lastFriend;
        
      // 微信信息增加计数变量
      for(var i=0; i<unesArr.length; i++){
        unesArr[i].unreadNum = 0;
      };

      // 获取微信信息
      indexedDBopt.getData('userData','unesArr',function(data){
        if(data && data != undefined  && unesArr.length > 0){
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

      // 本地保存个人信息
      indexedDBopt.addData('userData',[{type:'webimVal',val:webimVal_}]);

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
      var webimValBool  = false ,
          unesArrBool   = false ,
          userListBool  = false ,
          timeVid = setInterval(function(){
        indexedDBopt.getData('userData','webimVal',function(data){
          if(data && data!=undefined){  webimValBool = true;  }
        });
        if(unesArr.length > 0){
          indexedDBopt.getData('userData','unesArr',function(data){
            if(data && data!=undefined){  unesArrBool = true;  }
          });
          indexedDBopt.getData('userList',lastFriend,function(data){
            if(data && data!=undefined){  webimValBool = true;  }
          });
        }else{  
          unesArrBool = true; webimValBool = true;
        };
        
        if(webimValBool && unesArrBool && webimValBool){
          clearInterval(timeVid);
          // 路由跳转聊天页并且传递ticket
          this_.$router.push({
            path:'/impage',
            query:{
              Iticket:Iticket,
              relationId:webimVal_.relationId,
              bool_:false
            }
          });
        };
      },200);
    },

  }
}
</script>
<style>
.index_{
  position: fixed;
  width: 100%;
  height: 100%;
  min-width: 1200px;
  min-height: 750px;
  background-image: url('../../static/img/loginbg.jpg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  z-index: 10;
}
.index_container{
  width: 100%;
  height: 100%;
  position: relative;
}
.index_title{
  font-size:28px;
  font-family:PingFangSC-Medium;
  color:rgba(51,51,51,1);
  text-align: center;
  z-index: 20;
  position: absolute;
  left: 50%;
  top:15%;
  transform: translate(-50%, 0);
}
.index_form{
  width:460px;
  height:380px;
  background:rgba(255,255,255,1);
  box-shadow:0px 18px 46px 22px rgba(0,0,0,0.07);
  border-radius:20px;
  z-index: 20;
  position: absolute;
  left: 50%;
  top:26%;
  transform: translate(-50%, 0);
}
.index_form_container{
  width: 100%;
  height: 100%;
  position: relative;
}
.index_denglu{
  font-size:20px;
  font-family:PingFangSC-Medium;
  color:rgba(51,51,51,1);
  font-weight: bold;
  position: absolute;
  left: 50%;
  top:5%;
  transform: translate(-50%, 0);
}
.index_biaodan{
  width: 75%;
  height: auto;
  position: absolute;
  left: 50%;
  top:25%;
  transform: translate(-50%, 0);
}
.index_shuru{
  width: 100%;
  height:50px;
  box-sizing: border-box;
  border-radius:35px;
  border:1px solid rgba(153,153,153,1);
  position: relative;
  margin-bottom: 35px;
}
.index_shuru>img{
  height: 28px;
  width: auto;
  position: absolute;
  left: 5%;
  top:50%;
  transform: translate(0, -50%);
}
.index_shuru>input{
  height: 90%;
  width: 70%;
  font-size: 18px;
  outline: none;
  border:none;
  text-align: center;
  position: absolute;
  left: 50%;
  top:50%;
  transform: translate(-50%, -50%);
}
.btn_login{
  width: 100%;
  height:50px;
  font-size: 24px;
  font-family:PingFangSC-Medium;
  color:rgba(255,255,255,1);
  line-height: 50px;
  box-sizing: border-box;
  border-radius:35px;
  background:#0aa1ed;
}
</style>
