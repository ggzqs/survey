<!-- 班级管理页面 -->
<template>
  <div class="clazzManage">
  	<!-- {{clazzList}} -->
	<!-- {{clazzs}} -->
	<!-- {{grades}} -->
	<!-- {{teachers}} -->
    <div class="optionDiv">
      <el-select clearable v-model="choice.gradeId" placeholder="请选择所属班级" size="mini">
        <el-option v-for="(item,index) in grades" :key="index" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-input v-model='choice.search' placeholder="请输入内容" size="mini"></el-input>

      <el-button @click="batchClazz" type="danger" size="mini">批量删除</el-button>
      <el-button @click="addClazz" type="success" size="mini">新增</el-button>
    </div>
    <div class="tableDiv">
      <el-table height="442px" ref="multipleTable" :data="clazzList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column label="编号" type="selection" width="55"> </el-table-column>
        <el-table-column prop="name" label="班级名称" align="center"></el-table-column>
        <el-table-column prop="description" label="班级简介" align="center"></el-table-column>
        <el-table-column prop="grade.name" label="所属年级" align="center"></el-table-column>
        <el-table-column prop="charge.name" label="班主任" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- <i class="fa fa-pencil-square-o" aria-hidden="true" @click="handleEdit(scope.$index, scope.row)"></i>
            <i class="fa fa-trash-o" aria-hidden="true" @click="handleDelete(scope.$index, scope.row)"></i> -->
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form">
      	<el-form-item label="所属年级" :label-width="formLabelWidth">
          <el-select v-model="form.gradeId" placeholder="请选择所属年级">
          	<el-option v-for="(item,index) in grades" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="班主任" :label-width="formLabelWidth">
          <el-select v-model="form.chargeId" placeholder="请选择班主任">
          	<el-option v-for="(item,index) in teachers" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级介绍" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveClazz">保 存</el-button>
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
        gradeId:'',
        search:''
      },
      multipleSelection:[],
      dialogTitle:'',
      dialogFormVisible:false,
      formLabelWidth:'80px',
      form:{},
    }
  },
  computed:{
    clazzList(){
      // grades进行搜索条件的过滤
      let vm = this;
      return this.clazzs.filter((item)=>{
        if(item.name){
          if(item.grade&&vm.choice.gradeId){
            return (item.name.indexOf(vm.choice.search)!=-1)&&(item.grade.id==vm.choice.gradeId);
          }
          return item.name.indexOf(vm.choice.search)!=-1;
        }else{
          return true;
        }
      });
    },
  	...mapGetters(['clazzs','grades','teachers'])
  },
  created(){
    this.findAllClazz();
    this.findAllGrade();
    this.findAllTeacher();
  },
  methods:{
    // 模态框保存
    saveClazz(){
      // 先向后台发送数据，成功之后提示用户，关闭模态框，刷新数据
      // 不写axios的代码，只负责调用
      this.saveOneClazz(this.form).then((data)=>{
        console.log(data);
        // 提示
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success'
          });
          this.dialogFormVisible=false;
          this.findAllClazz();
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
    addClazz(){
      this.form={};
      this.dialogTitle='新增';
      this.dialogFormVisible=true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 编辑
    handleEdit(index,row){
      this.form={
      	gradeId:row.grade?row.grade.id:'',
      	chargeId:row.charge?row.charge.id:'',
        name:row.name,
        description:row.description,
        id:row.id
      }
      this.dialogTitle='编辑';
      this.dialogFormVisible=true;
    },
    // 删除
    handleDelete(index,row){
      this.deleteClazzById({id:row.id}).then((data)=>{
        console.log(data);
        // 提示
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllClazz();
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
    batchClazz(){
      // 获取用户选中的复选框对应对象的id
      let ids=this.multipleSelection.map((item)=>{
        return item.id;
      });
      console.log(ids);
      //数组转换成字符串 ids.join(',')或者ids.toString()
      this.batchDeleteClazz({ids:ids.join(',')}).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '批量删除成功',
            type: 'success'
          });
          this.findAllClazz();
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
    ...mapActions(['findAllClazz','deleteClazzById','saveOneClazz','batchDeleteClazz','findAllGrade','findAllTeacher'])
  }
}
</script>
<style scoped>
    .optionDiv .el-input{
        width: 200px;
    }
</style>

<style scoped lang="scss">
  .clazzManage{
    .optionDiv{
      button{
        float:right;
        margin-right: 20px;
      }
      .choice.searchBtn{
        float: none;
      }
    }
  }
</style>