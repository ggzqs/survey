<!-- 教师管理页面 -->
<template>
  <div class="teacherManage">
  	<!-- {{teacherList}} -->
    <div class="optionDiv">
    	<!-- <el-select v-model="value" placeholder="请选择" size="mini">
		    <el-option v-for="(item,index) in teacherList" :key="index" :label="item.name" :value="item.id"></el-option>
		  </el-select> -->
      <el-input v-model='search' placeholder="请输入内容" size="mini"></el-input>
      <el-button class="searchBtn" @click="toSearch" type="success" size="mini">搜索</el-button>

      <el-button @click="batchTeacher" type="danger" size="mini">批量删除</el-button>
      <el-button @click="addTeacher" type="success" size="mini">新增</el-button>
    </div>
    <div class="tableDiv">
      <el-table height="442px" ref="multipleTable" :data="teacherList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column label="编号" type="selection" width="55"> </el-table-column>
        <el-table-column prop="name" label="教师姓名" align="center"></el-table-column>
        <el-table-column prop="gender" label="性别" align="center"></el-table-column>
        <el-table-column prop="birth" label="出生日期" align="center"></el-table-column>
        <el-table-column prop="hiredate" label="入职时间" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="教师姓名" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="教师性别" :label-width="formLabelWidth">
       	 	<el-radio v-model="form.gender" label="男">男</el-radio>
			 		<el-radio v-model="form.gender" label="女">女</el-radio>
        </el-form-item>
      	<el-form-item label="出生日期" :label-width="formLabelWidth">
          <el-date-picker v-model="form.birth" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="入职时间" :label-width="formLabelWidth">
          <el-date-picker v-model="form.hiredate" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveTeacher">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
export default {
  data(){
    return {
    	// value:'',
	 		search:'',
	  	multipleSelection:[],
	  	teacherList:[],
	  	dialogTitle:'',
	  	dialogFormVisible:false,
	  	formLabelWidth:'80px',
	  	form:{
	  		type:0
	  	}
    }
  },
  computed:{
  	...mapGetters(['teachers'])
  },
  created(){
    let vm=this;
    this.findAllTeacher().then(function(data){
      vm.teacherList=data;
    }).catch();
  },
  methods:{
    // 模态框保存
    saveTeacher(){
      // 先向后台发送数据，成功之后提示用户，关闭模态框，刷新数据
      // 不写axios的代码，只负责调用
      this.saveOneTeacher(this.form).then((data)=>{
        console.log(data);
        // 提示
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success'
          });
          this.dialogFormVisible=false;
          this.findAllTeacher().then((data)=>{
            this.teacherList=data;
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
    addTeacher(){
      this.form={
      	type:0
      };
      this.dialogTitle='新增';
      this.dialogFormVisible=true;
    },
    // 搜索
    toSearch(){
      // 给teacherList赋值
      let vm=this;
      console.log(this);
      this.teacherList=this.teachers.filter(function(item){
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
        gender:row.gender,
        birth:row.birth,
        hiredate:row.hiredate,
        id:row.id
      }
      this.dialogTitle='编辑';
      this.dialogFormVisible=true;
    },
    // 删除
    handleDelete(index,row){
      this.deleteTeacherById({id:row.id}).then((data)=>{
        console.log(data);
        // 提示
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllTeacher().then((data)=>{
            this.teacherList=data;
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
    batchTeacher(){
      // 获取用户选中的复选框对应对象的id
      let ids=this.multipleSelection.map((item)=>{
        return item.id;
      });
      console.log(ids);
      //数组转换成字符串 ids.join(',')或者ids.toString()
      this.batchDeleteTeacher({ids:ids.join(',')}).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '批量删除成功',
            type: 'success'
          });
          this.findAllTeacher().then((data)=>{
            this.teacherList=data;
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
    ...mapActions(['findAllTeacher','deleteTeacherById','saveOneTeacher','batchDeleteTeacher'])
  }
}
</script>
<style scoped>
    .optionDiv .el-input{
        width: 200px;
    }
</style>
<style scoped lang="scss">
	.teacherManage{
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