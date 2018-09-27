// 音频操作函数
function audioOperaFun(id){
  // 音频Dom
  var audioObj = document.getElementById(id);

  // 重新加载
  function loadFun(){
    audioObj.load()
  };

  // 播放
  function playFun(){
    audioObj.play()
  };

  // 暂停
  function pauseFun(){
    audioObj.pause()
  };

  // 获取长度
  function durationFun(){
    return audioObj.duration
  };

  // 获取当前播放时间
  function currentTimeFun(){
    return audioObj.currentTime
  };

  // 音频监听播放完毕回调函数
  function endedCbok(cbok){
    // 音频监听播放完毕
    audioObj.removeEventListener('ended', cbok);
    audioObj.addEventListener('ended', cbok, false);
  };

  return{
    loadFun,
    playFun,
    pauseFun,
    durationFun,
    currentTimeFun,
    endedCbok,
  };
};

// 进度条动画函数
function myCanvasFun(str){
  // 获取dom
  var c=document.getElementById(str);
  // 创建画笔
  var cxt=c.getContext("2d");
  // 默认位置
  var default_ = 10;
  // 定时器
  var theTimer ;

  // 画布初始
  function initial(){
    default_ = 10;
    drawingPicture(default_);
    clearInterval(theTimer);
  };

  // 进度条自动移动
  function progress(num,cbok){
    var number_ = 30/num;
    theTimer = setInterval(function(){
      drawingPicture(default_);
      default_+=number_;
      if(default_>310){  
        clearInterval(theTimer)
        setTimeout(function(){  initial(); cbok(); },800)
      };
    },100);
  };

  // 进度条暂停
  function suspended(){
    clearInterval(theTimer);
  };

  // 进度条指定移动
  function specifiedProgress(num,sec){
    var number_ = 300/num;
    default_ = sec*number_+10;
    drawingPicture(default_);
  };

  // 画图函数
  function drawingPicture(i){
    cxt.clearRect(0,0,c.width,c.height); 
    // 设定圆角和宽度
    cxt.lineCap="round";
    cxt.lineWidth=4;
    // 灰色线
    cxt.beginPath(); 
    cxt.moveTo(10,8);
    cxt.lineTo(310,8);
    cxt.strokeStyle="#eee";
    cxt.stroke();
    // 蓝色圆
    cxt.beginPath(); 
    cxt.moveTo(10,8);
    cxt.lineTo(i,8);
    cxt.strokeStyle="rgba(0,119,255,1)";
    cxt.stroke();
    // 蓝色空心圆
    cxt.beginPath();
    cxt.arc(i,8,4,0,360,false);
    cxt.fillStyle="#fff";
    cxt.fill();
    cxt.strokeStyle="rgba(0,119,255,1)";
    cxt.stroke();
    cxt.closePath();
  };

  return{
    initial,
    progress,
    suspended,
    specifiedProgress
  };
};

// 时间函数递增函数
function timingFun(){
  var hours_ = 0;
  var minutes_ = 0;
  var seconds_ = 0;
  // 定时器
  var theTimer ;

  // 初始时间数据
  function initial(){
    clearInterval(theTimer);
    hours_ = 0;
    minutes_ = 0;
    seconds_ = 0;
    console.log(joiningStr());
  };

  // 时间计时
  function progress(){
    theTimer = setInterval(function(){
      timing();
      console.log(joiningStr());
    },1000);
  };

  // 暂停计时
  function suspended(){
    clearInterval(theTimer);
  };
  
  // 获取时间字符
  function joiningStr(){
    return fix(hours_,2)+':'+fix(minutes_,2)+':'+fix(seconds_,2);
  };

  // 计时递增
  function timing(){
    if(seconds_<59){
      seconds_++;
    }else if(seconds_==59){
      if(minutes_==59){
        hours_=hours_+1;
        minutes_=0;
      }else{
        minutes_=minutes_+1;
      }
      seconds_=0;
    };
  };

  return{
    initial,
    progress,
    suspended
  }
};

// 数字转换时分秒
function conversionHMS(num){
  var h = parseInt(num/(60*60));
  var m = parseInt((num-(h*60*60))/60);
  var s = num%60;

  return fix(h,2)+':'+fix(m,2)+':'+fix(s,2);
};

// 强转两位整数
function fix(num, length) {
  return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
};

// 
function getdateTime(num){
  var now = new Date(num),
      y = now.getFullYear(),
      m = now.getMonth() + 1,
      d = now.getDate();

      m = (m < 10 ? "0" + m : m);
      d = (d < 10 ? "0" + d : d);
  
  return y + "-" + m + "-" + d + " " + now.toTimeString().substr(0, 8);
};

export default {
  audioOperaFun,
  myCanvasFun,
  timingFun,
  getdateTime,
  conversionHMS,
  fix,
};