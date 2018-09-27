<template>
  <div class="searchModule_">

    <p  class="title_box">{{searchVal.title}}</p>
    <div class="inputBox">
      <!-- 循环筛选框 -->
      <div :id="searchId" v-for="(val,i) in searchVal.fill" :key="i" class="screening">
        <p class="s_name">{{val.s_name}}</p>

        <!-- 输入框 -->
        <input class="obtain" type="text" :placeholder="val.prompt" v-if="val.type==='input'">

        <!-- 下拉筛选框 -->
        <select class="obtain selectClick"  v-if="val.type==='select'" :data-val="''">
          <option v-for="(value_,index_) in val.value" :key="index_" :value="value_.val">{{value_.prompt}}</option>
        </select>

        <!-- 日期区间选择 -->
        <div class="ta_date" id="div_date1" v-if="val.type==='timeChoose'">
          <span class="date_title" :id="searchVal.timeChoose.id"></span>
          <a class="opt_sel" id="input_trigger1" href="#">
              <i class="i_orderd"></i>
          </a>
        </div>
      </div>

      <!-- 搜索按钮 -->
      <div class="exit_Box" @click="searchFun" v-if="searchVal.search">
        <div class="exit_container">
          <img class="exit_img" src="../assets/img/搜索.png" alt="">
          <span class="exit_span">搜索</span>
        </div>
      </div>

      <!-- 重置按钮 -->
      <div class="exit_Box" @click="resetFun" v-if="searchVal.reset">
        <div class="exit_container">
          <img class="exit_img" src="../assets/img/重置.png" alt="">
          <span class="exit_span">重置</span>
        </div>
      </div>

      <!-- 清楚浮动 -->
      <div style="clear: both;"></div>
    </div>
  </div>
</template>

<script>
export default {
  props:[ "searchVal","searchId" ],
  data() {
    return {
      timeChoose:{
        startDate:this.formatDate(),
        endDate:this.formatDate(),
      }
    }
  },
  mounted() {
    this.theInitialFun();
  },
  updated(){
    this.theInitialFun();
  },
  methods:{
    // 搜索函数
    searchFun:function(){
      var this_ = this;
      var obj={};

      for(var i=0;i<$('#'+this_.searchId+'>.obtain').length;i++){
        var key = $('#'+this_.searchId+'>.obtain').eq(i).siblings('p').html();
        var val = $('#'+this_.searchId+'>.obtain').eq(i).val();
        obj[key]=val;
      };

      if($('#'+this_.searchVal.timeChoose.id).length > 0){
        obj.timeChoose=this_.timeChoose;
      };

      // 传递数据父级
      this_.$emit('searchFun',obj);
    },
    // 重置函数
    resetFun:function(){
      for(var i=0;i<$('.obtain').length;i++){
        $('.obtain').eq(i).val('');
      };

      var timeChooseVal = this.searchVal.timeChoose;
      if(timeChooseVal != undefined && timeChooseVal.bool){
        this.timeChooseFun(timeChooseVal.id);
      };

    },
    // 日期区间筛选
    timeChooseFun:function(id){
      var this_ = this;
      // 引入插件
      $.getScript('./static/js/dateRange.js',function(){
        window.$ = $;
        var dateRange1 = new pickerDateRange(id, {
          isTodayValid:true ,
          startDate: this_.formatDate(),
          endDate: this_.formatDate(),
          startToday: false,
          stopToday: true,
          needCompare: false,
          defaultText: ' 至 ',
          autoSubmit: true,
          inputTrigger: 'input_trigger1',
          theme: 'ta',
          success: function (obj) {
            this_.timeChoose = obj;
            this_.$emit('timeChooseFun',obj);
          }
        });
      });
    },
    // 获取当前年月日
    formatDate:function() {
      var d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      return [year, month, day].join('-');
    },
    // 下拉选项框点击事件
    selectOption:function(){
      var this_ = this;
      
      $('.selectClick').bind('click',function(){
        var dataVal = $(this).attr('data-val');
        var val = $(this).val();
        if(dataVal != val){
          $(this).attr('data-val' , val);

          var obj={
            said:$(this).siblings('p').html(),
            val:val
          };
          
          // 传递数据父级
          this_.$emit('selectFun',obj);
        };
      });
    },
    // 设置按钮距离头部高度
    setTop:function(){
      var this_ = this;
      $('.exit_Box').css({marginTop:$('#'+this_.searchId).height()-$('.exit_Box').height()+'px'});
    },
    // 初始执行
    theInitialFun:function(){
      var timeChooseVal = this.searchVal.timeChoose;
      if(timeChooseVal != undefined && timeChooseVal.bool){
        this.timeChooseFun(timeChooseVal.id);
      };

      this.selectOption();

      if(this.searchVal.s_nameShow==false){
        $('.s_name').hide();
      };
      if(this.searchVal.search==true || this.searchVal.reset==true){
        this.setTop();
      };
    },

  }
}
</script>

<style>
.searchModule_{
  width: 100%;
  height: auto;
  text-align: left;
}
.inputBox{
  width:auto;
  height: auto;
}
.screening{
  float: left;
  margin-right: 20px;
}
.title_box{
  font-size:16px;
  font-weight: bold;
  font-family:PingFangSC-Medium;
  color:rgba(51,51,51,1);
  line-height:30px;
}
.screening>p{
  font-size:12px;
  font-family:PingFangSC-Regular;
  color:rgba(71,78,95,1);
  line-height:24px;
}
.screening>input,
.screening>select{
  width:200px;
  height:35px;
  box-sizing: border-box;
  background:rgba(255,255,255,1);
  border-radius:3px;
  border:1px solid rgba(236,236,248,1);
  font-size:12px;
  font-family:PingFangSC-Regular;
  color:#666666;
  text-indent:10px;
  outline:none;
  background: #fff;
}
.screening_min>input,
.screening_min>select{
  width:120px;
  height:35px;
  box-sizing: border-box;
  background:rgba(255,255,255,1);
  border-radius:3px;
  border:1px solid rgba(236,236,248,1);
  font-size:12px;
  font-family:PingFangSC-Regular;
  color:#666666;
  text-indent:10px;
  outline:none;
  background: #fff;
}
.exit_Box{
  width:60px;
  height:32px;
  border-radius:5px;
  background:rgba(0,119,255,1);
  float: left;
  margin-right: 20px;
  /* margin-top: 25px; */
  cursor:pointer;
}
.exit_Box>.exit_container{
  width: 100%;
  height: 100%;
  position: relative;
}
.exit_Box .exit_img{
  height: 70%;
  width: auto;
  position: absolute;
  left: 5%;
  top:50%;
  transform: translate(0, -50%);
}
.exit_Box .exit_span{
  font-size: 10px;
  font-family:PingFangSC-Regular;
  color:#fff;
  position: absolute;
  right: 10%;
  top:50%;
  transform: translate(0, -50%);
}
</style>
