<template>
  <div class="crumbsModule_">
    <!-- 面包屑类型为subscript -->
    <div v-if="crumbsType == 'subscript'" class="subscript_div">
      <div class="crumbs_title" v-for="(val,i) in crumbsVal" :key="i" :parameter="val.parameter">
        <span>{{val.title}}</span>
        <p :class="val.parameter==corres?'crumbs_title_p':''"></p>
      </div>
      <!-- 清楚浮动 -->
      <div style="clear: both;"></div>
    </div>

    <!-- 面包屑类型为btnswitch -->
    <div v-if="crumbsType == 'btnswitch'" class="btnswitch_d">
      <div :class="['btnswitch_title',corres==val.parameter&&'btnswitch_title_true']" v-for="(val,i) in crumbsVal" :key="i" :parameter="val.parameter">
        <span>{{val.title}}</span>
      </div>
      <!-- 清楚浮动 -->
      <div style="clear: both;"></div>
    </div>

    <!-- 面包屑类型为imgswitch -->
    <div v-if="crumbsType == 'imgswitch'">
      <div class="imgswitch_title" v-for="(val,i) in crumbsVal" :key="i" :parameter="val.parameter">
        <img :src="corres==val.parameter?val.selected:val.shdown">
      </div>
      <!-- 清楚浮动 -->
      <div style="clear: both;"></div>
    </div>

  </div>
</template>

<script>
export default {
  props:["crumbsCorres" , "crumbsVal" ,"crumbsType"],
  data() {
    return {
      corres:this.crumbsCorres
    }
  },
  watch:{
    crumbsCorres(newVal, oldVal){
      this.corres = newVal;
    }
  },
  mounted() {
    this.crumbsTypeFun();
  },
  methods:{
    // 判断面包屑组件类型
    crumbsTypeFun:function(){
      var this_ = this;
      if(this_.crumbsType == 'subscript'){
        this.swbreadFun();
      }else if(this_.crumbsType == 'btnswitch'){
        this.btnswitchFun();
      }else if(this_.crumbsType == 'imgswitch'){
        this.imgswitchFun();
      }
    },
    // subscript切换面包屑导航
    swbreadFun:function(){
      var this_=this;
      $('.crumbs_title').bind('click',function(){
        this_.corres=$(this).attr('parameter');
        // 执行父组件函数
        this_.$emit('crumbsFun',this_.corres);
      });
    },
    // btnswitch切换面包屑导航
    btnswitchFun:function(){
      var this_=this;
      $('.btnswitch_title').bind('click',function(){
        this_.corres=$(this).attr('parameter');
        // 执行父组件函数
        this_.$emit('crumbsFun',this_.corres);
      });
    },
    // btnswitch切换面包屑导航
    imgswitchFun:function(){
      var this_=this;
      $('.imgswitch_title').bind('click',function(){
        this_.corres=$(this).attr('parameter');
        // 执行父组件函数
        this_.$emit('crumbsFun',this_.corres);
      });
    },

  }
}
</script>

<style>
.crumbsModule_{
  width: 100%;
  height: auto;
  padding-bottom: 10px;
}
.subscript_div{
  display: flex;
  flex-direction:row;
  flex-wrap:nowrap;
  justify-content:space-around;
}
.crumbs_title{
  width: auto;
  height: auto;
  position: relative;
}
.crumbs_title_p{
  width: 15px;
  height: 3px;
  border-radius: 5px;
  background: rgba(0,119,255,1);
  position: absolute;
  left:50%;
  bottom:-10px;
  transform: translate(-50%, 0);
}
.btnswitch_d{
  width: 100%;
  height: 32px;
  background:rgba(238,238,238,1);
  border-radius:4px;
}
.btnswitch_title{
  width: auto;
  height: 32px;
  line-height: 32px;
  padding: 0 18px;
  font-size:14px;
  font-family:PingFangSC-Regular;
  float: left;
}
.btnswitch_title_true{
  background:rgba(0,119,255,1);
  color:rgba(255,255,255,1);
  border-radius:4px;
}
.imgswitch_title{
  width: auto;
  height: auto;
  float: left;
  font-size: 0;
  margin-right: 10px;
}
</style>
