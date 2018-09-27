<template>
  <div class="grouping_">
    <div v-for="(value,index) in unesList" :key="index">
      <!-- 分组名 -->
      <div class="group_whole" @click="groupSwitchFun(index)">
        {{value.groupsName}}{{"("+value.friends.length+")"}}
        <span class="tishixinhaoyou" v-if="value.newFriends>0">{{'+'+value.newFriends}}</span>
      </div>
      <!-- 组员列 -->
      <div v-if="groupShow == index">
        <!-- 单个好友 -->
        <div 
          class="members_whole agrouping"
          v-for="(val,i) in value.friends" 
          :key="i" 
          :class="unesId == val.id ? 'selected_' : ''"
          :data-val="JSON.stringify(val)"
          @click="groupingC_Fun((()=>{val.groupsId=value.groupsId;return val;})())">
          <img :src="val.headImgUrl" alt="">
          <p>
            {{val.nickname}}
            <span class="tishihongdian" v-if="!val.isRead"></span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:['unesList','unesId'],
  data() {
    return {
      groupShow:-1,
    }
  },
  mounted() {
    var this_ = this;
    setTimeout(function(){
      this_.mobileFriends();
    },500);

    // console.log(this.unesList);
  },
  updated() {
    var this_ = this;
    setTimeout(function(){
      this_.mobileFriends();
    },500);
  },
  methods:{
    // 打开和收起分组
    groupSwitchFun:function(e){
      if(this.groupShow != e){
        this.groupShow = e;
      }else{
        this.groupShow = -1;
      }
    },
    // 切换客户id(传递给父级)
    groupingC_Fun:function(data){
      this.$emit('unesIdSwitch2',data);
    }, 
    // 移动好友分组函数
    mobileFriends:function(){
      var this_ = this;
      $('.agrouping').unbind();
      $('.agrouping').bind("contextmenu", function(){return false;});
      $(".agrouping").mousedown(function(e){
        //右键为3
        if (e.which == 3) {
          var data_val = JSON.parse($(this).attr('data-val'));
          this_.$emit('rightClick',data_val);
        }
      });
    },




  }
}
</script>

<style>
.grouping_{
  width: 100%;
  height: auto;
}
.group_whole{
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  overflow: hidden;
  padding: 10px 18px 9px;
  border-bottom: 1px solid #192c33;
  cursor: pointer;
  position: relative;
  text-align: left;
  line-height: 30px;
  color: #fff;
  font-size: 14px;
}
.tishixinhaoyou{
  display: block;
  padding:0 5px;
  width: auto;
  height: 15px;
  line-height: 15px;
  color: #fff;
  background: #edc30a;
  position: absolute;
  top:5px;
  right:5px;
  z-index: 99;
  border-radius: 10px;
}
.members_whole{
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  overflow: hidden;
  padding: 10px 18px 9px;
  text-align: left;
  line-height: 30px;
  color: #fff;
  font-size: 14px;
  background: #26292e;
}
.members_whole:hover{
  background:#3b4047;
}
.selected_{
  background: #3b4047;
}
.members_whole>img{
  float: left;
  height: 30px;
  width: auto;
}
.members_whole>p{
  margin-left: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 30px;
  position: relative;
}
.tishihongdian{
  width: 10px;
  height:10px;
  display: block;
  position: absolute;
  z-index: 99;
  border-radius: 50%;
  background: #edc30a;
  right:0px;
  top:0px;
}
</style>
