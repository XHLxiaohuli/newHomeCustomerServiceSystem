<template>
  <div class="customerData">
    <!-- 基本资料 -->
    <div class="customerData_information">
      <p class="customerData_title">基本资料</p>
      <div class="contentBasic">
        <div><img :src="unesValue.headImgUrl" class="contentBasic_img" alt=""></div>
        <div class="aSingleInformation">
          <p>姓名:</p><p>{{unesValue.customer && unesValue.customer.name}}</p>
        </div>
        <div class="aSingleInformation">
          <p>备注:</p>
          <p>
            <input type="text" class="aSingleInformation_input" v-model="note" :readonly="!noteBool">
            <span @click="noteFun">{{noteBool?'完成':'编辑'}}</span>
          </p>
        </div>
        <div class="aSingleInformation">
          <p>电话:</p>
          <p>
            <input type="text" class="aSingleInformation_input" v-model="phone" :readonly="!phoneBool">
            <span @click="phoneFun">{{phoneBool?'完成':'编辑'}}</span>
          </p>
        </div>
        <div class="aSingleInformation">
          <p>来源:</p><p>{{unesValue.customer && unesValue.customer.channel && unesValue.customer.channel}}</p>
        </div>
      </div>
    </div>

    <!-- 拨打电话 -->
    <div class="customerData_call">
      <button class="btnCall" @click="btnCallFun">拨打电话</button>
    </div>

  </div>
</template>

<script>
export default {
  props:['unesValue','webimVal'],
  data() {
    return {
      // 客户备注绑定数据
      note: this.unesValue.customer && this.unesValue.customer.comment?
            this.unesValue.customer.comment:'',
      // 客户备注修改权限
      noteBool:false,
      // 客户电话绑定数据
      phone:this.unesValue.customer && this.unesValue.customer.phone,
      // 客户电话修改权限
      phoneBool:false,
      // 当前好友对象,
      unesValueObj:this.unesValue,
    }
  },
  watch:{
    // 微信信息监听
    unesValue:{
      handler(newVal, oldVal){
        this.unesValueObj = newVal;
        // 客户备注绑定数据
        this.note = newVal.customer && newVal.customer.comment;
        // 客户备注修改权限
        this.noteBool=false;
        // 客户电话绑定数据
        this.phone=newVal.customer && newVal.customer.phone;
        // 客户电话修改权限
        this.phoneBool=false;
      },
      deep:true
    },
  },
  methods:{
    // 修改备注函数
    noteFun:function(){
      if(this.noteBool){
        this.noteBool = false;
      }else{
        this.noteBool = true;
      };
    },
    // 修改手机号码函数
    phoneFun:function(){
      if(this.phoneBool){
        this.phoneBool = false;
      }else{
        this.phoneBool = true;
      };
    },
    // 拨打电话
    btnCallFun:function(){

      if(
        !(this.unesValueObj.customer &&
        this.unesValueObj.customer.phone &&
        this.unesValueObj.customer.id &&
        this.unesValueObj.customer.name)
      ){
        alert('拨打电话条件不充分');
        return;
      };
      
        var this_ = this;

        // 向父级传递数据
        this_.$emit('callValueFun_',{
          // 当前拨打对象
          unesValue:this_.unesValueObj,
          // 拨打电话数据对象 
          callValObj:{
            // 客户手机
            caller:this_.unesValueObj.customer.phone,
            // 客户id
            callerId:this_.unesValueObj.customer.id,
            // 客户名字
            callerName:this_.unesValueObj.customer.name,
            // 销售电话号码
            called:this_.webimVal.sellerPhone,
            // 销售id
            calledId:this_.webimVal.relationId,
            // 销售名称
            calledName:this_.webimVal.name,
            // 公司id
            companyId:this_.unesValueObj.customer.companyId,
          },
        });

    },

  }
}
</script>

<style>

.customerData{
  width:100%;
  height:100%;
}
.customerData_information{
  width: 100%;
  height: auto;
  box-sizing: border-box;
  padding: 2px;
  background: #fff;
  border-radius: 5px;
  margin-bottom: 20px;
}
.customerData_title{
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  padding: 10px;
  text-align: left;
  font-size: 14px;
  line-height: 20px;
  border-bottom: 1px solid #eee;
}
.contentBasic{
  width:100%;
  height:auto;
  box-sizing: border-box;
  padding: 15px;
  text-align: center;
}
.contentBasic_img{
  width: 80px;
  height:80px;
  border-radius: 50px;
}
.aSingleInformation{
  width: 100%;
  height:30px;
  margin: 5px 0;
  display: flex;
  flex-direction:row;
}
.aSingleInformation>p:nth-child(1){
  width:45%;
  line-height: 30px;
  text-align: right;
  font-size: 14px;
}
.aSingleInformation>p:nth-child(2){
  width:55%;
  height:30px;
  box-sizing: border-box;
  padding-left: 5px;
  line-height: 30px;
  text-align: left;
  font-size: 14px;
}
.aSingleInformation_input{
  width:100px;
  height:20px;
  box-sizing: border-box;
  background:#eee;  
	outline:none;  
	border:0px;
}
.aSingleInformation>p>span{
  color:rgba(0,119,255,1);
  cursor:pointer;
}
.customerData_call{
  width: 100%;
  height: auto;
  box-sizing: border-box;
  padding: 15px;
  background: #fff;
  border-radius: 5px;
  margin-bottom: 20px;
}
.btnCall{
  width: auto;
  height:32px;
  white-space : nowrap;
  border-radius:5px;
  background:rgba(0,119,255,1);
  font-size: 10px;
  font-family:PingFangSC-Regular;
  color:#fff;
  cursor:pointer;
  margin: 0;
  padding: 0;
  border: 0;
  outline: none;
  box-sizing: border-box;
  padding: 0 30px;
}
</style>
