<!-- 课调审核页面 -->
<template>
  <div class="sCheck">
  <!-- {{quesList}} -->
    <div class="optionDiv">
      <el-select @change='typeChange' clearable v-model="choice.type" placeholder="请选择内容" size="mini">
        <el-option v-for="(item,index) in typeArr" :key="index" :label="item.name" :value="item.value"></el-option>
      </el-select>
      <!-- choice.type?false:true -->
      <el-input :disabled='Boolean(choice.type?0:1)' v-model='choice.search' placeholder="请输入内容" size="mini"></el-input>
    </div>
    <div class="tableDiv">
      <el-table height="442px" ref="multipleTable" :data="surveyList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column label="编号" type="selection" width="55"> </el-table-column>
        <el-table-column prop="clazzVM.grade.name" label="年级" align="center"></el-table-column>
        <el-table-column prop="clazzVM.name" label="班级" align="center"></el-table-column>
        <el-table-column prop="course.name" label="课程" align="center"></el-table-column>
        <el-table-column prop="qnVM.name" label="问卷" align="center"></el-table-column>
        <el-table-column prop="user.name" label="讲师" align="center"></el-table-column>
        <el-table-column prop="surveydate" label="课调时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.surveydate?scope.row.surveydate.split(' ')[0]:'---'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="250px">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status=='未审核'" size="mini" type="primary" @click="handleCheck(scope.$index, scope.row,1)">审核通过</el-button>
            <el-button v-if="scope.row.status=='未审核'" size="mini" @click="handleCheck(scope.$index, scope.row,0)">审核不通过</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
import $ from 'jquery';
import Highcharts from 'highcharts';
export default {
  data(){
    return {
      choice:{
        type:'',
        search:''
      },
      // 仅供前端页面使用，不与后台交互
      typeArr:[{
        name:'年级',
        value:'grade'
      },{
        name:'班级',
        value:'clazz'
      },{
        name:'课程',
        value:'course'
      },{
        name:'讲师',
        value:'user'
      },{
        name:'问卷',
        value:'qn'
      }],
      multipleSelection:[],
    }
  },
  computed:{
    surveyList(){
      // 过滤条件是this.choice,type和this.choice.search
      let vm=this;
      return this.surveies.filter((item)=>{
        if(vm.choice.type){
          if(vm.choice.type=='grade'&&item.clazzVM&&item.clazzVM.grade){
            return item.clazzVM.grade.name.indexOf(vm.choice.search)!=-1;
          }else if(vm.choice.type=='clazz'&&item.clazzVM){
            return item.clazzVM.name.indexOf(vm.choice.search)!=-1;
          }else if(vm.choice.type=='course'&&item.course){
            return item.course.name.indexOf(vm.choice.search)!=-1;
          }else if(vm.choice.type=='user'&&item.user){
            return item.user.name.indexOf(vm.choice.search)!=-1; 
          }else if(vm.choice.type=='qn'&&item.qnVM){
            return item.qnVM.name.indexOf(vm.choice.search)!=-1; 
          }else{
            return false;
          }
        }else{
          return true;
        }
      });
    },
    ...mapGetters(['surveies'])
  },
  created(){
    this.findAllSurvey();
  },
  methods:{
    // 两个按钮绑定同一个方法，实现两个操作
    handleCheck(index,row,value){
      let obj={
        id:row.id,
        status:value
      }
      this.checkSurvey(obj).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success'
          });
          this.findAllSurvey();
        }else{
          this.$notify.error({
            title: '错误',
            message: '操作失败1'
          });
        }
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: '操作失败2'
        });
      });
    },
    // 审核通过
    // handleCheckYes(index,row){
    //   alert("审核通过");
    // },
    // 审核不通过
    // handleCheckNo(index,row){
    //   alert("审核不通过");
    // },
    typeChange(){
      // 当用户选择其他下拉列表,清空input框
      this.choice.search='';
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    ...mapActions(['findAllSurvey','checkSurvey'])
  }
}
</script>
<style scoped>
    .optionDiv .el-input{
        width: 200px;
    }
    .tableDiv .el-button.is-circle{
      padding: 6px;
    }
</style>

<style scoped lang="scss">
  .sCheck{
    
  }
</style>