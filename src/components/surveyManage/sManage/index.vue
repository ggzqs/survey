<!-- 课调管理页面 -->
<template>
  <div class="sManage">
  <!-- {{surveies}} -->
  <!-- {{surveyList}} -->
  <!-- {{choice}} -->
    <div class="optionDiv">
      <el-select @change='typeChange' clearable v-model="choice.type" placeholder="请选择内容" size="mini">
        <el-option v-for="(item,index) in typeArr" :key="index" :label="item.name" :value="item.value"></el-option>
      </el-select>
      <!-- choice.type?false:true -->
      <el-input :disabled='Boolean(choice.type?0:1)' v-model='choice.search' placeholder="请输入内容" size="mini"></el-input>

      <el-button @click="batchSManage" type="danger" size="mini">批量删除</el-button>
      <el-button @click="addSManage" type="success" size="mini">新增</el-button>
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
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-view" circle @click="handleEyes(scope.$index, scope.row)"></el-button>
            <el-button icon="el-icon-edit" circle @click="handleEdit(scope.$index, scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.$index, scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="年级" :label-width="formLabelWidth">
          <el-select @change="gradeChange" clearable v-model="gradeId" placeholder="请选择内容">
            <el-option v-for="(item,index) in grades" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级" :label-width="formLabelWidth">
          <el-select :disabled='Boolean(gradeId?0:1)' clearable v-model="form.clazzId" placeholder="请选择内容">
            <el-option v-for="(item,index) in clazzList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程" :label-width="formLabelWidth">
          <el-select clearable v-model="form.courseId" placeholder="请选择内容">
            <el-option v-for="(item,index) in courses" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="讲师" :label-width="formLabelWidth">
          <el-select clearable v-model="form.userId" placeholder="请选择内容">
            <el-option v-for="(item,index) in teachers" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问卷" :label-width="formLabelWidth">
          <el-select clearable v-model="form.questionnaireId" placeholder="请选择内容">
            <el-option v-for="(item,index) in naires" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">保 存</el-button>
      </div>
    </el-dialog>
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
        <ul v-for="(item,index) in currentSurvey.qnVM.questionVMs">
          <li>{{index+1}}: {{item.name}}</li>
          <li v-for="opts in item.options">{{opts.label}}: {{opts.name}}</li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
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
      dialogTitle:'',
      dialogFormVisible:false,
      formLabelWidth:'80px',
      form:{
        clazzId:'',
        courseId:'',
        userId:'',
        questionnaireId:''
      },
      gradeId:'',
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
      dialogEyeVisible:false
    }
  },
  computed:{
    // 班级和年级级联
    clazzList(){
      let vm=this;
      return this.clazzs.filter((item,index)=>{
        if(item.grade){
          return item.grade.id==vm.gradeId;
        }
      });
    },
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
    ...mapGetters(['surveies','naires','grades','courses','teachers','clazzs'])
  },
  created(){
    this.findAllSurvey();
    this.findAllGrade();
    this.findAllCourse();
    this.findAllTeacher();
    this.findAllClazz();
    this.findAllNaire();
  },
  methods:{
    // 年级input框中值修改,班级中数据清空
    gradeChange(){
      this.form.clazzId='';
    },
    typeChange(){
      // 当用户选择其他下拉列表,清空input框
      this.choice.search='';
    },
    // 模态框保存
    save(){
      // 默认状态未开启
      this.form.status='未开启';
      this.saveOneSurvey(this.form).then((data)=>{
        // console.log(data);
        // 提示
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success'
          });
          this.dialogFormVisible=false;
          this.findAllSurvey();
        }else{
          this.dialogFormVisible=false;
          this.$notify.error({
            title: '错误',
            message: '保存失败1'
          });
        }
      }).catch((error)=>{
        this.dialogFormVisible=false;
          this.$notify.error({
            title: '错误',
            message: '保存失败2'
          });
      });
    },
    // 新增按钮
    addSManage(){
      this.form={
        clazzId:'',
        courseId:'',
        userId:'',
        questionnaireId:''
      };
      this.gradeId='';
      this.dialogTitle='新增';
      this.dialogFormVisible=true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEyes(index,row){
      this.currentSurvey=row;
      this.dialogEyeVisible=true;
    },
    // 编辑
    handleEdit(index,row){
      this.form={
        id:row.id,
        clazzId:row.clazzVM?row.clazzVM.id:'',
        courseId:row.course?row.course.id:'',
        userId:row.user?row.user.id:'',
        questionnaireId:row.qnVM?row.qnVM.id:'',
        surveydate:this.getCurrentDate()
      };
      this.gradeId=(row.clazzVM&&row.clazzVM.grade)?row.clazzVM.grade.id:'';
      this.dialogTitle='编辑';
      this.dialogFormVisible=true;
    },
    // 删除
    handleDelete(index,row){
      this.deleteSurveyById({id:row.id}).then((data)=>{
        // console.log(data);
        // 提示
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllSurvey();
        }else{
          this.$notify.error({
            title: '错误',
            message: '删除失败1'
          });
        }
      }).catch((error)=>{
          this.$notify.error({
            title: '错误',
            message: '删除失败2'
          });
      });
    },
    // 批量删除
    batchSManage(){
      // 获取用户选中的复选框对应对象的id
      let ids=this.multipleSelection.map((item)=>{
        return item.id;
      });
      // console.log(ids);
      //数组转换成字符串 ids.join(',')或者ids.toString()
      this.batchDeleteSurvey({ids:ids.join(',')}).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '批量删除成功',
            type: 'success'
          });
          this.findAllSurvey();
        }else{
          this.$notify.error({
            title: '错误',
            message: '批量删除失败1'
          });
        }
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: '批量删除失败2'
        });
      });
    },
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
    ...mapActions(['findAllSurvey','deleteSurveyById','saveOneSurvey','batchDeleteSurvey','findAllGrade','findAllCourse','findAllTeacher','findAllClazz','findAllNaire'])
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
  .sManage{
    .optionDiv{
      button{
        float:right;
        margin-right: 20px;
      }
      .searchBtn{
        float: none;
      }
    }
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
      ul{
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