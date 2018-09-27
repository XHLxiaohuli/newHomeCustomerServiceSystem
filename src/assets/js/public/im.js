window.webimObj=function(obj={
    //帐号模式，0-表示独立模式，1-表示托管模式，开发者根据自己的模式，改成相应的值。
    accountType:'',
    //用户帐号
    identifier:'',
    //业务id
    sdkAppID:'',
    //鉴权 Token
    userSig:'',
    //链接建立成功函数
    connectionYes:function(){},
    //链接建立失败函数
    connectionNo:function(){},
    // 多实例登入，强制下线
    onKickedEventCall:function(){},
    //监听新消息处理函数
    newMsgValFun:function(){}
}){
    //当前用户身份
    var loginInfo = {
        "accountType"   : obj.accountType,		    //帐号模式
        "sdkAppID"      : obj.sdkAppID, 			//用户标识接入 SDK 的应用 ID，必填
        "appIDAt3rd"    : obj.sdkAppID, 		    //App 用户使用 OAuth 授权体系分配的 Appid，必填
        "identifier"    : obj.identifier, 		    //用户帐号，必填
        "userSig"       : obj.userSig,		 		//鉴权 Token，identifier 不为空时，必填
    };

    //----------------------------------------------------------------------------------------------------------------------------------------------------------------------

    //监听事件
    var listeners = {
        "onConnNotify"  : onConnNotify,				 //监听连接状态回调变化事件,必填
        "jsonpCallback" : jsonpCallback,			 //IE9(含)以下浏览器用到的 jsonp 回调函数，
        "onMsgNotify"   : onMsgNotify,				 //监听新消息(私聊，普通群(非直播聊天室)消息，全员推送消息)事件，必填
        "onKickedEventCall" : onKickedEventCall,     //多实例登入下线
    };

    //----------------------------------------------------------------------------------------------------------------------------------------------------------------------

    // 其他对象
    var options={
        isAccessFormalEnv:true,
        isLogOn:true
    };

    //----------------------------------------------------------------------------------------------------------------------------------------------------------------------

    //监听连接状态回调变化事件
    function onConnNotify(resp) {
        switch (resp.ErrorCode) {
            case webim.CONNECTION_STATUS.ON:
                // 执行建立连接成功函数
                if(obj.connectionYes){
                    obj.connectionYes();
                };
                console.log('建立连接成功:'+ resp.ErrorInfo);
                break;
            case webim.CONNECTION_STATUS.OFF:
                // 执行建立连接失败函数
                if(obj.connectionNo){
                    obj.connectionNo();
                };
                alert('连接已断开，无法收到新消息，请检查下您的网络是否正常:'+ resp.ErrorInfo);
                break;
            case webim.CONNECTION_STATUS.RECONNECT:
                // 执行建立连接失败函数
                if(obj.connectionNo){
                    obj.connectionNo();
                };
                alert('连接状态恢复正常:'+ resp.ErrorInfo);
                break;
            default:
                // 执行建立连接失败函数
                if(obj.connectionNo){
                    obj.connectionNo();
                };
                alert('未知连接状态:'+ resp.ErrorInfo);
                break;
        };
    };

    //IE9(含)以下浏览器用到的 jsonp 回调函数
    function jsonpCallback(rspData) {
        //设置 jsonp 返回的
        webim.setJsonpLastRspData(rspData);
    }

    //监听新消息事件
    //newMsgList 为新消息数组，结构为[Msg]
    function onMsgNotify(newMsgList) {
        obj.newMsgValFun(newMsgList);
    }

    // 多实例登入下线
    function onKickedEventCall(){
        obj.onKickedEventCall();
    }

    //SDK 登录
    function webimLogin() {
        webim.login(
            loginInfo, listeners, options,
            function (resp) {
                console.log('登入成功');
                // webim.syncMsgs(onMsgNotify); 
            },
            function (err) {
                console.log('登入失败');
            }
        );
    };

    // 执行登入
    webimLogin();
}


//发送消息(文本或者表情)
window.ISendMsg = function(obj={
    iTicket:'',
    acrossTicket:'',
    value:{}
}) {
    // 会话对象Session
    var  selSess = new webim.Session(webim.SESSION_TYPE.C2C , obj.acrossTicket);
    //是否为自己发送
    var isSend = true;
    //消息序列，-1表示 SDK 自动生成，用于去重
    var seq = -1;
    //消息随机数，用于去重
    var random = Math.round(Math.random() * 4294967296);
    //消息时间戳，unix timestamp格式
    var msgTime = Math.round(new Date().getTime() / 1000);
    // 消息发送者帐号
    var fromAccount = obj.iTicket;
    // 消息发送者昵称，用户没有设置昵称时，则为发送者帐号
    var fromAccountNick = obj.iTicket;
    //消息子类型
    var subType = webim.C2C_MSG_SUB_TYPE.COMMON;
    // if (selType == webim.SESSION_TYPE.C2C) {
    //     subType = webim.C2C_MSG_SUB_TYPE.COMMON;
    // } else {
    //     subType = webim.GROUP_MSG_SUB_TYPE.COMMON;
    //     //webim.GROUP_MSG_SUB_TYPE.COMMON-普通消息,
    //     //webim.GROUP_MSG_SUB_TYPE.LOVEMSG-点赞消息，优先级最低
    //     //webim.GROUP_MSG_SUB_TYPE.TIP-提示消息(不支持发送，用于区分群消息子类型)，
    //     //webim.GROUP_MSG_SUB_TYPE.REDPACKET-红包消息，优先级最高
    // };

    // 消息对象Msg
    var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, fromAccount, subType, fromAccountNick); 
    // 创建消息对象
    var text_obj = new webim.Msg.Elem.Text(JSON.stringify(obj.value));
    // 向elems中添加一个Text元素
    msg.addText(text_obj);

    // 发送消息
    webim.sendMsg(msg, 
        function (resp) {
            console.log('发送成功');
        }, 
        function (err) {
            console.log('发送失败');
        }
    );
}


// var str='{&quot;val&quot;:&quot;123&quot;}';
// str=str.replace(/&quot;/g,'"');
