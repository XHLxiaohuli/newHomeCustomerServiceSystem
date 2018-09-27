<template>
  <div class="userDetails">
    <div class="userDetails_top">
      <crumbsModule
        :crumbsCorres=showViewId
        :crumbsVal='navVal' 
        :crumbsType="'subscript'"
        @crumbsFun='crumbsFun'
      />
    </div>
    <div class="userDetails_rongqi">
      <!-- 客户资料 -->
      <customerData
        v-if="showViewId == '0'"
        :unesValue="unesValue"
        :webimVal="webimVal"
        @callValueFun_="callValueFun_0"
      />
      <!-- 聊天记录 -->
      <chatRecord
        v-if="showViewId == '1'"
        :Iticket="Iticket"
        :wxObj="unesValue"
        :topUrl="[unesValue.headImgUrl,'./static/img/Logo.png']"
      />
      <!-- 通话记录 -->
      <callRecords
        :unesValue="unesValue"
        :Iticket="Iticket"
        v-if="showViewId == '2'"
      />
    </div>
  </div>
</template>

<script>
import crumbsModule from '@/components/crumbsModule'
import customerData from '@/components/customerData'
import chatRecord from '@/components/chatRecord'
import callRecords from '@/components/callRecords'
export default {
  props:['Iticket','unesValue','webimVal'],
  data() {
    return {
      // 头部导航切换组件
      navVal:[
        {title:'客户资料',parameter:'0'},
        {title:'聊天记录',parameter:'1'},
        {title:'通话记录',parameter:'2'},
      ],
      // 当前显示组件id
      showViewId:0,
    }
  },
  components: {
    crumbsModule,
    callRecords,
    chatRecord,
    customerData
  },
  watch:{
    // 微信信息监听
    unesValue:{
      handler(newVal, oldVal){
        console.log(newVal);
        this.showViewId = 0;
      },
      deep:true
    },
  },
  methods:{
    crumbsFun:function(data){
      this.showViewId = data;
    },
    // 中转拨打电话对象数据
    callValueFun_0:function(data){
      this.$emit('callValueFun',data);
    },


  }
}
</script>

<style>
.userDetails{
  width:360px;
  height:100%;
  position: relative;
}
.userDetails_top{
  position: absolute;
  right:0;
  top: 0;
  width:100%;
  height:50px;
  box-sizing: border-box;
  border-bottom:1px solid #d6d6d6;
  padding-top:15px;
  z-index: 999;
}
.userDetails_rongqi{
  position: absolute;
  right:0;
  bottom: 0;
  width:100%;
  height:100%;
  box-sizing: border-box;
  padding:60px 10px 10px 10px;
  z-index: 99;
}
</style>
