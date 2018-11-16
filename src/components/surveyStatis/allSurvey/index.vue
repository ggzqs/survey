<!-- 全部课调统计页面 -->
<template>
  <div class="allSurvey">
    <div class="optionDiv">
      <el-select @change="gradeChange" clearable v-model="choice.gradeId" placeholder="请选择" size="mini">
        <!-- 手动添加静态option -->
        <el-option label="全部年级" value=""></el-option>
        <el-option v-for="(item,index) in grades" :key="index" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-select :disabled="Boolean(choice.gradeId?0:1)" clearable v-model="choice.clazzId" placeholder="请选择" size="mini">
        <el-option label="全部班级" value=""></el-option>
        <el-option v-for="(item,index) in clazzList" :key="index" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-select clearable v-model="choice.courseId" placeholder="请选择" size="mini">
        <el-option label="全部课程" value=""></el-option>
        <el-option v-for="(item,index) in courses" :key="index" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-select clearable v-model="choice.naireId" placeholder="请选择" size="mini">
        <el-option label="全部问卷" value=""></el-option>
        <el-option v-for="(item,index) in naires" :key="index" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <!-- choice.type?false:true -->
      <el-input :disabled='Boolean(choice.naireId?1:0)' v-model='choice.search' placeholder="请输入关键字" size="mini"></el-input>
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
        <el-table-column prop="average" label="平均分" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.average?scope.row.average.split(' ')[0]:'---'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" plain icon="el-icon-view" circle @click="handleEyes(scope.$index, scope.row)"></el-button>
            <el-button type="success" plain icon="el-icon-download" circle @click="handleDown(scope.$index, scope.row)"></el-button>
            <el-button type="info" plain icon="el-icon-document" circle @click="handleAn(scope.$index, scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 预览模态框 -->
    <el-dialog :title="currentSurvey.qnVM?currentSurvey.qnVM.name:''" :visible.sync="dialogEyeVisible">
      <table class="eyeTable">
        <tr>
          <td><span>班级:{{currentSurvey.clazzVM.name}}</span></td>
          <td><span>讲师:{{currentSurvey.user.name}}</span></td>
          <td><span>时间:{{currentSurvey.surveydate}}</span></td>
          <td><span>课程:{{currentSurvey.course.name}}</span></td>
        </tr>
      </table>
      <div class="showDiv">
        <el-table height="300px" ref="multipleTable" :data="passSurvey" tooltip-effect="dark" style="width: 100%">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="message" label="内容" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button icon="el-icon-edit" circle></el-button>
              <el-button icon="el-icon-close" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button icon="el-icon-download" size="mini" @click="checkDown">下载</el-button>
        <el-button icon="el-icon-printer" size="mini" @click="checkPrin">打印</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <div id="allContainer" style="min-width:400px;height:400px"></div>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
import $ from 'jquery';
import Highcharts from 'highcharts'
export default {
  data(){
    return {
      choice:{
        gradeId:'',
        clazzId:'',
        courseId:'',
        naireId:'',
        search:''
      },
      multipleSelection:[],
      // 当前要预览的课调信息
      currentSurvey:{
        qnVM:{},
        clazzVM:{},
        user:{},
        course:{},
        qnVM:{
          questionVMs:[]
        }
      },
      dialogEyeVisible:false,
      dialogTitle:'课调分析',
      dialogFormVisible:false,
    }
  },
  computed:{
    // 年级和班级的级联操作，通过年级筛选班级
    clazzList(){
      let vm=this;
      return this.clazzs.filter((item)=>{
        if(vm.choice.gradeId&&item.grade){
          return item.grade.id==vm.choice.gradeId;
        }else{
          return true;
        }
      });
    },
    // 对课调进行筛选，过滤条件是用户选择的内容，choice对象里是过滤条件
    surveyList(){
      // 过滤条件是this.choice,type和this.choice.search
      let vm=this;
      return this.passSurvey.filter((item)=>{
        if(vm.choice.gradeId){
          if(vm.choice.clazzId){
            if(vm.choice.courseId){
              if(vm.choice.naireId){
                return item.clazzVM.grade.id==vm.choice.gradeId&&item.clazzVM.id==vm.choice.clazzId&&item.course.id==vm.choice.courseId&&item.qnVM.id==vm.choice.naireId;
              }else if(vm.choice.search){
                return item.clazzVM.grade.id==vm.choice.gradeId&&item.clazzVM.id==vm.choice.clazzId&&item.course.id==vm.choice.courseId&&(item.qnVM.name.indexOf(vm.choice.search)!=-1);
              }else{
                return item.clazzVM.grade.id==vm.choice.gradeId&&item.clazzVM.id==vm.choice.clazzId&&item.course.id==vm.choice.courseId;
              }
            }
            return item.clazzVM.grade.id==vm.choice.gradeId&&item.clazzVM.id==vm.choice.clazzId;
          }else if(vm.choice.courseId){
            if(vm.choice.naireId){
                return item.clazzVM.grade.id==vm.choice.gradeId&&item.course.id==vm.choice.courseId&&item.qnVM.id==vm.choice.naireId;
              }else if(vm.choice.search){
                return item.clazzVM.grade.id==vm.choice.gradeId&&item.course.id==vm.choice.courseId&&(item.qnVM.name.indexOf(vm.choice.search)!=-1);
              }else{
                return item.clazzVM.grade.id==vm.choice.gradeId&&item.course.id==vm.choice.courseId;
              }
          }else if(vm.choice.naireId){
            return item.clazzVM.grade.id==vm.choice.gradeId&&item.qnVM.id==vm.choice.naireId;
          }else if(vm.choice.search){
            return item.clazzVM.grade.id==vm.choice.gradeId&&(item.qnVM.name.indexOf(vm.choice.search)!=-1);
          }else{
            return item.clazzVM.grade.id==vm.choice.gradeId
          }
          return item.clazzVM.grade.id==vm.choice.gradeId;
        }else if(vm.choice.courseId){
          if(vm.choice.naireId){
            return item.course.id==vm.choice.courseId&&item.qnVM.id==vm.choice.naireId;
          }else if(vm.choice.search){
            return item.course.id==vm.choice.courseId&&(item.qnVM.name.indexOf(vm.choice.search)!=-1);
          }
          return item.course.id==vm.choice.courseId;
        }else if(vm.choice.naireId){
          return item.qnVM.id==vm.choice.naireId;
        }else if(vm.choice.search){
          return item.qnVM.name.indexOf(vm.choice.search)!=-1;
        }else{
          return true;
        }
      });
    },
    ...mapGetters(['passSurvey','naires','grades','courses','clazzs'])
  },
  created(){
    this.findAllSurvey();
    this.findAllGrade();
    this.findAllCourse();
    this.findAllClazz();
    this.findAllNaire();
  },
  methods:{
    gradeChange(){
      this.choice.clazzId='';
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 预览
    handleEyes(index,row){
      this.currentSurvey=row;
      this.dialogEyeVisible=true;
    },
    // 下载
    handleDown(index,row){
      // alert('下载成功');
      // 打开一个新窗口
      window.open('http://120.78.164.247:9999/result/downLoadSurveyResultById?id='+row.id);
    },
    // 问卷分析
    handleAn(index,row){
      // alert('问卷分析');
      this.dialogFormVisible=true;
      setTimeout(()=>{
        this.toDraw();
      },200);
    },
    // 问卷分析图表
    toDraw(){
      var chart = Highcharts.chart('allContainer', {
        chart: {
          type: 'bar'
        },
        credits:{
          enabled:false
        },
        title: {
          text: ''
        },
        xAxis: {
          categories: ['授课质量', '备课情况', '扩展能力', '技术能力', '亲和力'],
          title: {
            text: null
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: '评分情况',
            align: 'high'
          },
          labels: {
            overflow: 'justify'
          }
        },
        tooltip: {
          valueSuffix: ' 次'
        },
        plotOptions: {
          bar: {
            dataLabels: {
              enabled: true,
              allowOverlap: true // 允许数据标签重叠
            }
          }
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'top',
          x: -40,
          y: 100,
          floating: true,
          borderWidth: 1,
          backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
          shadow: true
        },
        series: [{
          name: '优秀',
          data: [107, 31, 35, 203, 2]
        }, {
          name: '良好',
          data: [33, 56, 47, 8, 6]
        }, {
          name: '中等',
          data: [73, 14, 54, 32, 34]
        }]
      });
    },
    // 模态框中下载
    checkDown(){},
    // 模态框中打印
	  checkPrin(){},
    // 获取当前时间,返回字符串
    getCurrentDate(){
      let date=new Date();
      let year=date.getFullYear();
      let month=date.getMonth()+1;
      month=month<10?('0'+month):month;
      let day=date.getDate();
      day=day<10?('0'+day):day;
      let hour=date.getHours();
      hour=hour<10?('0'+hour):hour;
      let minute=date.getMinutes();
      minute=minute<10?('0'+minute):minute;
      let second=date.getSeconds();
      second=second<10?('0'+second):second;
      return year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;
      // 非IE底下
      // new Date('2018-11-07 08:06:03');
      // IE底下
      // new Date('2018/11/07 08:06:03');
      // 获取毫秒时间戳 date.getTime();
    },
    ...mapActions(['findAllSurvey','findAllGrade','findAllCourse','findAllClazz','findAllNaire'])
  }
}
</script>
<style scoped>
    .optionDiv .el-select{
        width: 100px;
    }
    .optionDiv .el-input{
    	width: 200px;
    }
    .tableDiv .el-button.is-circle{
      padding: 6px;
    }
    .showDiv>.el-button:nth-child(2){
      margin-left: 70%;
    }
    .showDiv>.el-button{
      margin-top: 20px;
    }
    .showDiv .el-button.is-circle{
      padding: 8px;
    }
</style>

<style scoped lang="scss">
  .allSurvey{
    .eyeTable{
      width: 100%;
      border-collapse: collapse;
      line-height: 40px;
      text-align: center;
      td{
        border: 1px solid #777777;
      }
    }
    .showDiv{
      .el-table{
        width: 96.6%;
        padding: 0;
        margin: 0;
        border: 1px solid #777777;
        border-top: none;
        padding-left: 20px;
      }
  	}
  }
</style>