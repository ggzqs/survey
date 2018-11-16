<!-- 班级课调统计页面 -->
<template>
  <div class="clazzSurvey">
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
      <!-- choice.type?false:true -->
      <el-input :disabled='Boolean(choice.clazzId?1:0)' v-model='choice.search' placeholder="请输入关键字" size="mini"></el-input>
    </div>
    <div class="sectionDiv">
      <el-row :gutter="20">
        <el-col v-for="(item,index) in clazzScoreList" :key="index" :span="4">
          <div class="showDiv" @click="showDialog">
            <div>
              <i class="fa fa-bolt" style="font-size:50px;color:yellow;"></i>
            </div>
            <div>
              <span>班级：{{item.name}}</span><br>
              <span>平均分：{{item.average}}</span><br>
              <span>最近分：{{item.recent}}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <div id="clazzContainer" style="min-width:400px;height:400px"></div>
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
        search:''
      },
      dialogTitle:'历史课调平均分',
      dialogFormVisible:false,
      clazzScoreList:[{
        name:'1',
        average:4.3,
        recent:3.8
      },{
        name:'1',
        average:4.3,
        recent:3.8
      },{
        name:'1',
        average:4.3,
        recent:3.8
      },{
        name:'1',
        average:4.3,
        recent:3.8
      },{
        name:'1',
        average:4.3,
        recent:3.8
      },{
        name:'1',
        average:4.3,
        recent:3.8
      },{
        name:'1',
        average:4.3,
        recent:3.8
      },{
        name:'1',
        average:4.3,
        recent:3.8
      }]
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
    ...mapGetters(['clazzs','grades'])
  },
  created(){
    this.findAllClazz();
    this.findAllGrade();
  },
  methods:{
    showDialog(){
      this.dialogFormVisible=true;
      setTimeout(()=>{
        this.toDraw();
      },200);
    },
    gradeChange(){
      this.choice.clazzId='';
    },
    // 绘制图表
    toDraw(){
      var chart = Highcharts.chart('clazzContainer', {
        chart: {
          type: 'line'
        },
        // 去除图例
        legend:{
          enabled:false
        },
        // 去除版权
        credits:{
          enabled:false
        },
        title: {
          text: ''
        },
        xAxis: {
          categories: ['张三', '李思', '马云', 'Kimmel']
        },
        yAxis: {
          title: {
            text: '平均分 (分)'
          }
        },
        plotOptions: {
          line: {
            dataLabels: {
              // 开启数据标签
              enabled: true          
            },
          }
        },
        series: [{
          name: '1班',
          data: [3.9, 4.2, 2.7, 4.5]
        }]
      });
    },
    ...mapActions(['findAllClazz','findAllGrade'])
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
</style>

<style scoped lang="scss">
  .clazzSurvey{
    .sectionDiv{
    	.showDiv{
        cursor: pointer;
    		background-color: #4D8C7C;
        border-radius: 8px;
        color: white;
        margin-top: 10px;
        overflow: hidden;
        padding: 20px;
        div:first-child{
          float: left;
        }
        div:last-child{
          float: right;
        }
    	}
    }
  }
</style>