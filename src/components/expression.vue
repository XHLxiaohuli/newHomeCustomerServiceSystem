<template>
  <div class="expression_">
    <!-- 切换 -->
    <div class="expressionSwitch">
      <a :class="bqSwitch ? 'qq_bq bqqh' : 'qq_bq'" @click="qq_bqFun">QQ表情</a>
      <!-- <a :class="bqSwitch ? 'fh_bq' : 'fh_bq bqqh'" @click="fh_bqFun">符号表情</a> -->
    </div>
    <!-- 表情展示 -->
    <div class="bqShow">
      <div class="bqShow_k">
        <div v-if="bqSwitch" v-for="(v,i) in 105" :key="i" class="qq_bqsize" @click="clickQQExpres(i)">
          <i :class="'qqemoji qqemoji'+i"></i>
        </div>
        <div v-if="!bqSwitch" v-for="(v,i) in 177" :key="i" class="emoji_face fh_bqsize"  @click="clickFHExpres(i)">
          <i :class="'emoji'+i"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bqSwitch:true
    }
  },
  methods:{
    // 切换QQ表情
    qq_bqFun:function(){
      this.bqSwitch=true;
    },
    // 切换符号表情
    fh_bqFun:function(){
      this.bqSwitch=false;
    },
    // 点击QQ表情
    clickQQExpres:function(i){
      var QQExpresArr=[
        '[微笑]','[撇嘴]','[色]','[发呆]','[得意]','[流泪]','[害羞]','[闭嘴]','[睡]','[大哭]','[尴尬]','[发怒]','[调皮]','[呲牙]','[惊讶]',
        '[难过]','[酷]','[冷汗]','[抓狂]','[吐]','[偷笑]','[愉快]','[白眼]','[傲慢]','[饥饿]','[困]','[惊恐]','[流汗]','[憨笑]','[悠闲]',
        '[奋斗]','[咒骂]','[疑问]','[嘘]','[晕]','[疯了]','[衰]','[骷髅]','[敲打]','[再见]','[擦汗]','[抠鼻]','[鼓掌]','[糗大了]','[坏笑]',
        '[左哼哼]','[右哼哼]','[哈欠]','[鄙视]','[委屈]','[快哭了]','[阴险]','[亲亲]','[吓]','[可怜]','[菜刀]','[西瓜]','[啤酒]','[篮球]','[乒乓]',
        '[咖啡]','[饭]','[猪头]','[玫瑰]','[凋谢]','[嘴唇]','[爱心]','[心碎]','[蛋糕]','[闪电]','[炸弹]','[刀]','[足球]','[瓢虫]','[便便]',
        '[月亮]','[太阳]','[礼物]','[拥抱]','[强]','[弱]','[握手]','[胜利]','[抱拳]','[勾引]','[拳头]','[差劲]','[爱你]','[NO]','[OK]',
        '[爱情]','[飞吻]','[跳跳]','[发抖]','[怄火]','[转圈]','[磕头]','[回头]','[跳绳]','[投降]','[激动]','[乱舞]','[献吻]','[左太极]','[右太极]'
      ];
      this.$emit('addExpres',QQExpresArr[i]);
    },
    // 点击符号表情
    clickFHExpres:function(i){
      this.$emit('addExpres','符号表情'+i);
    },

    
  }
}
</script>

<style>
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
