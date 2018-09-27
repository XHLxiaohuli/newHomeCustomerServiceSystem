<template>
  <div>
    <p  v-if="type!=='10000' && type!=='2000' && type!=='55535'"  
        :style="boolobj?'text-align: right; box-sizing: border-box;padding:0 50px;':'text-align: left; box-sizing: border-box;padding:0 50px;'">
        <span style="font-size:8px;color:#aaa;">{{getdate(time)}}</span>
    </p>
    <div v-if="type!=='10000' && type!=='2000' && type!=='55535'" :class="boolobj ? 'sendAessage_' : 'closedAessage_'">
      <img class="top_url_" :src="boolobj?headImgUrl[1]:headImgUrl[0]" alt=""/>
      <div  :class="boolobj ? 'sendText' : 'sendText_c'" 
            v-html="showMsg"
      ></div>
    </div>
    <p  style="text-align:center" 
        v-if="type == '10000' ||type=='2000'||type=='55535'"
        v-html="showMsg"
    ></p>

  </div>
</template>

<script>
export default {
  props:['boolobj','type','msgVal','time','headImgUrl'],
  data() {
    return {
      showMsg:''
    }
  },
  watch:{
    // 监听消息变化
    msgVal(newVal, oldVal){
      this.strConversion();
    }
  },
  mounted() {
    this.strConversion();
  },
  methods:{
    strConversion:function(){
      // 文本类型数据
      if(this.type=='1' || this.type=='436207665' || this.type=='419430449'){
        
        // 转换换行符
        var str = this.msgVal.replace(/↵/g,"<br>");
        var str = this.msgVal.replace(/\n/g,"<br>");
        var QQExpresArr=[
          '微笑','撇嘴','色','发呆','得意','流泪','害羞','闭嘴','睡','大哭','尴尬','发怒','调皮','呲牙','惊讶',
          '难过','酷','冷汗','抓狂','吐','偷笑','愉快','白眼','傲慢','饥饿','困','惊恐','流汗','憨笑','悠闲',
          '奋斗','咒骂','疑问','嘘','晕','疯了','衰','骷髅','敲打','再见','擦汗','抠鼻','鼓掌','糗大了','坏笑',
          '左哼哼','右哼哼','哈欠','鄙视','委屈','快哭了','阴险','亲亲','吓','可怜','菜刀','西瓜','啤酒','篮球','乒乓',
          '咖啡','饭','猪头','玫瑰','凋谢','嘴唇','爱心','心碎','蛋糕','闪电','炸弹','刀','足球','瓢虫','便便',
          '月亮','太阳','礼物','拥抱','强','弱','握手','胜利','抱拳','勾引','拳头','差劲','爱你','NO','OK',
          '爱情','飞吻','跳跳','发抖','怄火','转圈','磕头','回头','跳绳','投降','激动','乱舞','献吻','左太极','右太极'
        ];

        // 正则匹配表情
        for(var i=0;i<QQExpresArr.length;i++){
          if(str.indexOf("["+QQExpresArr[i]+"]") > -1){
            var subStr=new RegExp("\\["+QQExpresArr[i]+"\\]","ig");//创建正则表达式对象,不区分大小写,全局查找
            var tihuan = "<i class='qqemoji qqemoji"+i+"'></i>";
            str=str.replace(subStr,tihuan);//把'is'替换为空字符串
          };
        };

        this.showMsg=str;

      }else if(this.type=='3' || this.type=='47'){   //图片类型

        this.showMsg="<img src='"+this.msgVal+"' class='imgMsg' style='width:150px;height:auto;'/>";

      }else if(this.type=='43'){    //视频类型

        var this_ = this;
        this.showMsg=`
          <div style="width:200px;height:auto;position: relative;">
            <video width="200" height="auto" controls="controls">
              <source src="${this_.msgVal}" type="video/ogg">
              <source src="${this_.msgVal}" type="video/mp4">
            </video>
            <div class="videoDiv" style="width:100%;height:100%;position: absolute;left:0;top:0;" data-src="${this_.msgVal}"></div>
          </div>
        `;

      }else if(this.type=='34'){    //语音类型

        var this_ = this;
        this.showMsg=`
          <audio controls="controls">
            <source src="${this_.msgVal}" type="audio/ogg">
            <source src="${this_.msgVal}" type="audio/mpeg">
          </audio>
        `;
        
      }else if(this.type=='10000' || this.type=='2000' || this.type=='55535'){   //系统消息

        this.showMsg=this.msgVal;

      }else if(this.type == '49'){    //其他文件类型

        var this_ = this;
        this.showMsg=`
          <div style="width:auto;height:32px;">
            <img src="${require('../assets/img/下载.png')}" onclick="(function(){location.href='${this_.msgVal}';})()">
            <img src="${require('../assets/img/文件.png')}">
            <i style="display: inline-block;line-height: 32px;"></i>
          </div>
        `;

      };

    },
    getdate:function(num){
      var now = new Date(num),
          y = now.getFullYear(),
          m = now.getMonth() + 1,
          d = now.getDate();
      return (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 5);
    },

  }
}
</script>

<style>
.sendAessage_{
  width: 100%;
  height: auto;
  box-sizing: border-box;
  padding-right: 50px;
  position: relative;
  margin-bottom: 20px;
  text-align: right;
}
.sendAessage_>img{
  position: absolute;
  width: 40px;
  height: auto;
  right: 0;
  top: 0;
  border-radius: 5px;
}
.sendText{
  display: inline-block;
  width: auto;
  height: auto;
  min-height:40px; 
  max-width: 500px;
  border-radius: 5px;
  background: #b2e281;
  padding: 8px;
  box-sizing: border-box;
  font-size: 15px;
  line-height: 24px;
  word-wrap: break-word;
  word-break: break-all;
  text-align: left;
}
.sendText>img{
  padding: 0;
  margin: 0;
}
.closedAessage_{
  width: 100%;
  height: auto;
  box-sizing: border-box;
  padding-left: 50px;
  position: relative;
  margin-bottom: 20px;
  text-align: left;
}
.closedAessage_>img{
  position: absolute;
  width: 40px;
  height: auto;
  left: 0;
  top: 0;
  border-radius: 5px;
}
.sendText_c{
  display: inline-block;
  width: auto;
  height: auto;
  min-height:40px; 
  max-width: 500px;
  border-radius: 5px;
  background: #fff;
  padding: 8px;
  box-sizing: border-box;
  font-size: 15px;
  line-height: 24px;
  word-wrap: break-word;
  word-break: break-all;
  text-align: left;
}
.sendText_c>img{
  padding: 0;
  margin: 0;
}
.expression_{
  width: 480px;
  height: 280px;
  background: #fff;
  box-sizing: border-box;
  border: 1px solid #dedede;
}
.expressionSwitch{
  width: 100%;
  height: 45px;
  box-sizing: border-box;
  padding: 10px 20px 0;
  background: #dedede;  
  text-align: left;
}
.qq_bq,
.fh_bq{
  display: inline-block;
  width: 90px;
  height: 35px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  text-align: center;
  line-height: 35px;
  font-size: 14px;
}
.bqqh{
  background: #fff;
}
.bqShow{
  width: 100%;
  height: 235px;
  box-sizing: border-box;
  padding: 11px;
}
.bqShow_k{
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction:row;
  flex-wrap:wrap;
  justify-content:flex-start;
}
.qq_bqsize{
  width: 30px;
  height: 30px;
  display: inline-block;
  box-sizing: border-box;
  padding: 5px;
}
.fh_bqsize{
  width: 30px;
  height: 30px;
  display: inline-block;
  box-sizing: border-box;
  padding: 1px;
}
</style>
