<!-- 年级管理页面 -->
<template>
  <div class="gradeManage">
    <!-- {{gradeList}} -->
	  <div class="optionDiv">
      <el-input v-model='search' placeholder="请输入内容" size="mini"></el-input>

      <el-button @click="batchGrade" type="danger" size="mini">批量删除</el-button>
      <el-button @click="addGrade" type="success" size="mini">新增</el-button>
    </div>
    <div class="tableDiv">
      <el-table height="442px" ref="multipleTable" :data="gradeList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column label="编号" type="selection" width="55"> </el-table-column>
        <el-table-column prop="name" label="名称" align="center"></el-table-column>
        <el-table-column prop="comment" label="简介" align="center"></el-table-column>
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
        <el-form-item label="年级名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="年级介绍" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.descriptioin" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveGrade">保 存</el-button>
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
      dialogTitle:'',
      dialogFormVisible:false,
      formLabelWidth:'80px',
      form:{
        schoolId:3
      }
    }
  },
  computed:{
    gradeList(){
      // grades进行搜索条件的过滤
      let vm = this;
      return this.grades.filter((item)=>{
        if(item.name){
          return item.name.indexOf(vm.search)!=-1;
        }else{
          return false;
        }
      });
    },
  	...mapGetters(['grades'])
  },
  created(){
    this.findAllGrade();
  },
  methods:{
    // 模态框保存
    saveGrade(){
      // 先向后台发送数据，成功之后提示用户，关闭模态框，刷新数据
      // 不写axios的代码，只负责调用
      this.saveOneGrade(this.form).then((data)=>{
        console.log(data);
        // 提示
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success'
          });
          this.dialogFormVisible=false;
          this.findAllGrade().then((data)=>{
            this.gradeList=data;
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
    },
    // 新增按钮
    addGrade(){
      this.form={
        schoolId:3
      }
      this.dialogTitle='新增';
      this.dialogFormVisible=true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 编辑
    handleEdit(index,row){
      this.form={
        schoolId:3,
        name:row.name,
        descriptioin:row.descriptioin,
        id:row.id
      }
      this.dialogTitle='编辑';
      this.dialogFormVisible=true;
    },
    // 删除
    handleDelete(index,row){
      this.deleteGradeById({id:row.id}).then((data)=>{
        console.log(data);
        // 提示
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllGrade().then((data)=>{
            this.gradeList=data;
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
    batchGrade(){
      // 获取用户选中的复选框对应对象的id
      let ids=this.multipleSelection.map((item)=>{
        return item.id;
      });
      console.log(ids);
      //数组转换成字符串 ids.join(',')或者ids.toString()
      this.batchDeleteGrade({ids:ids.join(',')}).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '批量删除成功',
            type: 'success'
          });
          this.findAllGrade().then((data)=>{
            this.gradeList=data;
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
    ...mapActions(['findAllGrade','deleteGradeById','saveOneGrade','batchDeleteGrade'])
  }
}
</script>
<style scoped>
    .optionDiv .el-input{
        width: 200px;
    }
</style>

<style scoped lang="scss">
  .gradeManage{
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