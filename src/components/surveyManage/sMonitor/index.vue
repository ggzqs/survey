<!-- 课调监控页面 -->
<template>
  <div class="sMonitor">
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
        <el-table-column prop="code" label="课调编号" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status=='未开启'" type="success" circle @click="handleBegin(scope.$index, scope.row)">开启</el-button>
            <el-button v-if="scope.row.status=='开启'" type="info" circle @click="handleLook(scope.$index, scope.row)">查看</el-button>
            <el-button v-if="scope.row.status=='开启'" type="danger" circle @click="handleStop(scope.$index, scope.row)">结束</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <div id="MonitorContainer" style="min-width:400px;height:400px"></div>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
import $ from 'jquery';
import Highcharts from 'Highcharts';
export default {
  data(){
    return {
      choice:{
        type:'',
        search:''
      },
      // 仅供前端页面使用，不与后台交互
      typeArr:[{
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
      dialogTitle:'查看课调进程',
      dialogFormVisible:false,
      progressData:[
        ['已完成',30],
        ['未完成',10]
      ]
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
    handleBegin(index,row){
      this.beginSurvey({id:row.id}).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '开启成功',
            type: 'success'
          });
          this.findAllSurvey();
        }else{
          this.$notify.error({
            title: '错误',
            message: '开启失败1'
          });
        }
      }).catch((error)=>{
          this.$notify.error({
            title: '错误',
            message: '开启失败2'
          });
      });
    },
    handleStop(index,row){
      this.stopSurvey({id:row.id}).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '结束成功',
            type: 'success'
          });
          this.findAllSurvey();
        }else{
          this.$notify.error({
            title: '错误',
            message: '结束失败1'
          });
        }
      }).catch((error)=>{
          this.$notify.error({
            title: '错误',
            message: '结束失败2'
          });
      });
    },
    handleLook(index,row){
      this.dialogFormVisible=true;
      setTimeout(()=>{
        this.toDraw();
      },200);     
    },
    typeChange(){
      // 当用户选择其他下拉列表,清空input框
      this.choice.search='';
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 绘制图表
    toDraw(){
      var chart = Highcharts.chart('MonitorContainer', {
        colors:['#5CB85C','red'],
        credits:{
          enabled:false
        },
        chart: {
          spacing : [60, 0 , 60, 0]
        },
        title: {
          floating:true,
          text: '课调进度'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> {point.y}份'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              style: {
                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
              }
            },
            point: {
              events: {
                mouseOver: function(e) {  // 鼠标滑过时动态更新标题
                  // 标题更新函数，API 地址：https://api.hcharts.cn/highcharts#Chart.setTitle
                  chart.setTitle({
                    text: e.target.name+ '\t'+ e.target.y + ' 份'
                  });
                }
                //, 
                // click: function(e) { // 同样的可以在点击事件里处理
                //     chart.setTitle({
                //         text: e.point.name+ '\t'+ e.point.y + ' %'
                //     });
                // }
              }
            },
          }
        },
        series: [{
          type: 'pie',
          innerSize: '70%',
          name: '进度',
          data:this.progressData
        }]
      }, 
      function(c) { // 图表初始化完毕后的回调函数
        // 环形图圆心
        var centerY = c.series[0].center[1],
          titleHeight = parseInt(c.title.styles.fontSize);
        // 动态设置标题位置
        c.setTitle({
          y:centerY + titleHeight/2
        });
      });
    },
    ...mapActions(['findAllSurvey','beginSurvey','stopSurvey'])
  }
}
</script>
<style scoped>
    .optionDiv .el-input{
        width: 200px;
    }
    .tableDiv .el-button.is-circle{
      padding: 6px;
      font-size: 10px;
    }
</style>

<style scoped lang="scss">
  .sMonitor{

  }
</style>