<!-- 课程管理页面 -->
<template>
  <div class="courseManage">
    <div class="optionDiv">
      <el-input v-model='search' placeholder="请输入内容" size="mini"></el-input>
      <el-button class="searchBtn" @click="toSearch" type="success" size="mini">搜索</el-button>

      <el-button @click="batchCourse" type="danger" size="mini">批量删除</el-button>
      <el-button @click="addCourse" type="success" size="mini">新增</el-button>
    </div>
    <div class="tableDiv">
      <el-table height="442px" ref="multipleTable" :data="courseList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column label="编号" type="selection" width="55"> </el-table-column>
        <el-table-column prop="name" label="课程名称" align="center"></el-table-column>
        <el-table-column prop="period" label="课程周期" align="center"></el-table-column>
        <el-table-column prop="description" label="课程简介" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="课程名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="课程周期" :label-width="formLabelWidth" prop="period">
          <el-input v-model.number="form.period" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="课程介绍" :label-width="formLabelWidth" prop="description">
          <el-input type="textarea" v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveCourse('form')">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
export default {
  data(){
    return {
	 	  search:'',
	  	multipleSelection:[],
	  	courseList:[],
	  	dialogTitle:'',
	  	dialogFormVisible:false,
	  	formLabelWidth:'80px',
	  	form:{},
      rules:{
        name:[
          { required: true, message: '请输入课程名称', trigger: 'blur' },
        ],
        description:[
          { required: true, message: '请输入课程介绍', trigger: 'blur' },
        ],
        period:[
          { required: true, message: '请输入课程周期', trigger: 'blur' },
          { type: 'number', message: '课程周期必须为数字值', trigger: 'blur' }
        ],       
      }
    }
  },
  computed:{
  	...mapGetters(['courses'])
  },
  created(){
    let vm=this;
    this.findAllCourse().then(function(data){
      vm.courseList=data;
    }).catch();
  },
  methods:{
    // 模态框保存
    saveCourse(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveOneCourse(this.form).then((data)=>{
            console.log(data);
            // 提示
            if(data.stauts==200){
              this.$notify({
                title: '成功',
                message: '保存成功',
                type: 'success'
              });
              this.dialogFormVisible=false;
              this.findAllCourse().then((data)=>{
                this.courseList=data;
              });
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
        } else {
          return false;
        }
      });
      // 先向后台发送数据，成功之后提示用户，关闭模态框，刷新数据
      // 不写axios的代码，只负责调用
    },
    // 新增按钮
    addCourse(){
      this.form={};
      this.dialogTitle='新增';
      this.dialogFormVisible=true;
    },
    // 搜索
    toSearch(){
      // 给courseList赋值
      let vm=this;
      console.log(this);
      this.courseList=this.courses.filter(function(item){
        if(item.name){
          return item.name.indexOf(vm.search)!=-1;
        }else{
          return true;
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 编辑
    handleEdit(index,row){
      this.form={
        name:row.name,
        period:row.period,
        description:row.description,
        id:row.id
      }
      this.dialogTitle='编辑';
      this.dialogFormVisible=true;
    },
    // 删除
    handleDelete(index,row){
      this.deleteCourseById({id:row.id}).then((data)=>{
        console.log(data);
        // 提示
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllCourse().then((data)=>{
            this.courseList=data;
          });
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
    batchCourse(){
      // 获取用户选中的复选框对应对象的id
      let ids=this.multipleSelection.map((item)=>{
        return item.id;
      });
      console.log(ids);
      //数组转换成字符串 ids.join(',')或者ids.toString()
      this.batchDeleteCourse({ids:ids.join(',')}).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '批量删除成功',
            type: 'success'
          });
          this.findAllCourse().then((data)=>{
            this.courseList=data;
          });
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
    ...mapActions(['findAllCourse','deleteCourseById','saveOneCourse','batchDeleteCourse'])
  }
}
</script>
<style scoped>
    .optionDiv .el-input{
        width: 200px;
    }
</style>
<style scoped lang="scss">
	.courseManage{
    .optionDiv{
      button{
        float:right;
        margin-right: 20px;
      }
      .searchBtn{
        float: none;
      }
    }
  }
</style>