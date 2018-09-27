<template>
  <div class="popOperation">
    <maskPopModule>
      <div class="popOperation_c">
        <p class="popOperation_t">{{title}}</p>
        <div style="width:100%;height:auto;">


          <div class="formFillOut" :style="labelCard && labelCard==true ? 'width: 800px;' : 'width: 660px;'">
            <div class="formFillOut_c" v-for="(v,i) in formFillOutVal" :key="i" :data-type="v.type">
              <!-- title -->
              <p class="p_title">{{v.title}}</p>
              <!-- 输入框 -->
              <div class="formFillOut_d" v-if="v.type=='input'">
                <input type="text" :placeholder="v.prompt">
              </div>
              <!-- 下拉提示输入框 -->
              <div class="formFillOut_d" v-if="v.type=='datalist'">
                <input type="text" :placeholder="v.prompt" :list="v.id"/>
                <div v-html="dataList_I(v.id,v.dataArr)"></div>
              </div>
              <!-- 多行文本框 -->
              <div class="formFillOut_d" v-if="v.type=='textarea'">
                <textarea :maxlength="v.max" :placeholder="v.prompt"></textarea>
              </div>
              <!-- 下拉选项框 -->
              <div class="formFillOut_d" v-if="v.type=='select'">
                <select class="selectClick" :data-val="''">
                  <option value="">{{v.prompt}}</option>
                  <option v-for="(val,index) in v.selectValArr" :key="index" :value="val.val">{{val.text}}</option>
                </select>
              </div>
              <!-- 单选框 -->
              <div class="formFillOut_d" style="width:320px;height:45px;display: inline-block;" v-if="v.type=='radio'">
                <div class="female" style="float:left;margin-top:12.5px;margin-right:30px;" v-for="(val,index) in v.radioVal" :key="index">
                    <input type="radio" :checked="val.val==v.defaultData" :id="val.id" :name="v.radioId" :value="val.val"/>
                    <label :for="val.id">{{val.text}}</label>
                </div>
              </div>

            </div>
          </div>


        </div>
        <div class="popOperation_b">
          <button class="exit_btn" 
          style="width:80px;height:40px;margin-right:50px;background:rgba(199,199,199,1);" @click="cancel_p">取消</button>
          <button class="exit_btn" 
          style="width:80px;height:40px;" @click="determine_p">确定</button>
        </div>
      </div>
    </maskPopModule>
  </div>
</template>

<script>
// 遮罩组件
import maskPopModule from '@/components/maskPopModule'
export default {
  props:['title','popOperaVal','labelCard'],
  data() {
    return {
      // 数据结构
      formFillOutVal:this.popOperaVal,
    }
  },
  components: {  maskPopModule  },
  mounted() {
    this.selectOption();
    if(  $('.formFillOut').height() == 500   ){  $('.formFillOut').css({overflow: 'auto'})  }
  },
  updated(){
    this.selectOption();
    if(  $('.formFillOut').height() == 500   ){  $('.formFillOut').css({overflow: 'auto'})  }
  },
  methods:{
    // 确定按钮
    determine_p:function(){
      // 触发父级函数
      this.$emit('determine',this.obtainValFun());
    },
    // 取消按钮
    cancel_p:function(){
      // 触发父级函数
      this.$emit('cancel');
    },
    // 输入提示代码
    dataList_I:function(id,arr){
      var arrStr='';
      for(var i=0;i<arr.length;i++){
        arrStr+=`<option class="${id}" value="${arr[i].text}" data-val="${arr[i].val}"></option>`;
      };
      var str=`
        <datalist class="dataliststyle" id="${id}">${arrStr}</datalist>
      `;
      return str;
    },
    // 获取表单数据
    obtainValFun:function(){
      var arrVal= [];
      $('.formFillOut_c').each(function(){
        var p_text= $(this).children('p').text();
        var type= $(this).attr('data-type');
        var obj={};  obj['mark']=p_text;

        if(type=='input'){                    //获取输入框数据
          var inputVal=$(this).find('input').val();
          obj['val']=inputVal;
        }else if(type=='datalist'){
          var inputVal=$(this).find('input').val();
          var opClass=$(this).find('datalist').attr('id');
          $('#'+opClass+'>.'+opClass).each(function(){
            var str = $(this).attr('value');
            if(str == inputVal){
              obj['val']=$(this).attr('data-val');
            };
          });
        }else if(type=='textarea'){           //获取多行文本框数据
          var textareaVal=$(this).find('textarea').val();
          obj['val']=textareaVal;
        }else if(type=='select'){             //获取下拉选项框数据
          var selectVal=$(this).find('select').val();
          obj['val']=selectVal;
        }else if(type=='specialSelect'){      //获取特殊下拉选项框数据
          var arr_ = $(this).find('.multiSelect').attr('data-val');
          obj['val']=arr_===''?[]:arr_.split('`/`');
        }else if(type=='radio'){              //获取单选框数据
          obj['val']=$(this).find('input:radio:checked').val();
        };
        arrVal.push(obj);
      });
      return arrVal;
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
            said:$('.p_title').html(),
            val:val
          };
          
          // 传递数据父级
          this_.$emit('selectFun',obj);
        };
      });
    },

  },

}
</script>

<style>
.popOperation_c{
  height:auto;
  box-sizing:border-box;
  padding: 30px; 
  background:rgba(255,255,255,1);
  border-radius:8px;
}
.popOperation_t{
  font-size:20px;
  font-family:PingFangSC-Medium;
  color:rgba(51,51,51,1);
  line-height:30px;
  margin-bottom: 30px;
}
.popOperation_b{
  width: 100%;
  height: auto;
  margin-top: 80px;
}
.formFillOut{
  width: 100%;
  height: auto;
  max-height: 500px;
}
.formFillOut_c{
  margin-bottom: 25px;
}
.formFillOut_c>p{
  width: 150px;
  height: 45px;
  line-height: 45px;
  float: left;
  text-align: right;
  font-size:16px;
  font-family:PingFangSC-Regular;
  color:rgba(51,51,51,1);
}
.formFillOut_d>input,
.formFillOut_d>select{
  width:320px;
  height:45px;
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
.formFillOut_d>textarea{
  width:320px;
  height:100px;
  box-sizing: border-box;
  padding: 10px;
  border-radius:4px;
  border:1px solid rgba(236,236,248,1);
  resize: none;
  outline: none;
  font-size:12px;
  font-family:PingFangSC-Regular;
  color:#666666;
}
.formFillOut_d>select>option{
  height: 50px;
  
}
.exit_btn{
  width: auto;
  height:32px;
  white-space : nowrap;
  border-radius:5px;
  background:rgba(0,119,255,1);
  font-size: 10px;
  font-family:PingFangSC-Regular;
  color:#fff;
  margin-right: 20px;
  cursor:pointer;
  margin: 0;
  padding: 0;
  border: 0;
  outline: none; 
  box-sizing: border-box;
  padding: 0 10px;
}
input[type="radio"] + label::before {
    content: "\a0"; /*不换行空格*/
    display: inline-block;
    vertical-align: middle;
    font-size: 21px;
    width: 1em;
    height: 1em;
    margin-right: .4em;
    border-radius: 50%;
    border: 1px solid rgba(0,119,255,1);
    text-indent: .15em;
    line-height: 1; 
    box-sizing: border-box;
}
input[type="radio"]:checked + label::before {
    background-color: rgba(0,119,255,1);
    background-clip: content-box;
    padding: .2em;
    box-sizing: border-box;
}
input[type="radio"] {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}
.formFillOut_d label{
  font-size: 16px;
}
.labelCard_s{
  width: 100%;
  height: auto;
  display: flex;
  flex-direction:row;
  flex-wrap:wrap;
  justify-content:flex-start;
}
.labelCard_d{
  box-sizing: border-box;
  padding: 3px 20px;
  border: 1px solid #ddd;
  position: relative;
  margin: 20px 10px 0 10px;
}
.del_img2{
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(50%, -50%);
  z-index: 100;
}
.labelCard_div{
  width: 30%;
  height: auto;
  position: relative;
  margin: 20px 10px 0 10px;
  box-sizing: border-box;
  padding: 8px;
}
.labelCard_obj{
  width: 100%;
  height: auto;
  display: flex;
  flex-direction:row;
  flex-wrap:wrap;
  justify-content:flex-start;
}
.labelCard_img{
  width: 40px;
  height: 40px;
  border-radius: 5px;
  margin-right: 10px;
}
.labelCard_val>p{
  width: 156px;
  text-align: left;
  font-size:12px;
  font-family:PingFangSC-Regular;
  color:rgba(71,78,95,1);
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
</style>
