<!-- 问卷管理页面 -->
<template>
  <div class="naireManage">
  <!-- {{quesIds}} -->
  <!-- {{questions}} -->
  <!-- {{questionList}} -->
  <!-- {{quesNaire}} -->
    <div class="optionDiv">
      <el-input v-model='search' placeholder="请输入内容" size="mini"></el-input>

      <el-button @click="batchNaire" type="danger" size="mini">批量删除</el-button>
      <el-button @click="addNaire" type="success" size="mini">新增</el-button>
    </div>
    <div class="tableDiv">
      <el-table :height="tableHeight" ref="multipleTable" :data="naireList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column label="编号" type="selection" width="55"> </el-table-column>
        <el-table-column prop="name" label="问卷名称" align="center"></el-table-column>
        <el-table-column prop="description" label="问卷简介" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEyes(scope.$index, scope.row)">预览</el-button>
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="问卷名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="问卷描述" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="题目列表" :label-width="formLabelWidth">
          <el-button @click="showTrans">点击选择</el-button>
        </el-form-item>
      </el-form>
      <!-- 题目展示区 -->
      <div class="showDiv">
        <ul v-for="(item,index) in questionList">
          <li>{{index+1}}: {{item.name}}</li>
          <li v-for="opts in item.options">{{opts.label}}: {{opts.name}}</li>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 二级模态框  穿梭框 -->
    <el-dialog :title="transTitle" :visible.sync="dialogTransVisible">   
      <el-transfer v-model="quesIds" :data="quesList"></el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogTransVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 问卷预览 -->
    <el-dialog :title="quesNaire.name" :visible.sync="dialogEyeVisible">
    <!-- {{quesNaire.questionVMs}} -->
      <span>{{quesNaire.description}}</span>
      <div class="showDiv">
        <ul v-for="(item,index) in quesNaire.questionVMs">
          <li>{{index+1}}: {{item.name}}</li>
          <li v-for="opts in item.options">{{opts.label}}: {{opts.name}}</li>
        </ul>
      </div>
    </el-dialog>  
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
import $ from 'jquery';
export default {
  data(){
    return {
      tableHeight:'442px',
      search:'',
      multipleSelection:[],
      dialogTitle:'',
      dialogFormVisible:false,
      formLabelWidth:'80px',
      form:{
        name:'',
        description:''
      },
      dialogTransVisible:false,
      transTitle:'选择题目',
      quesIds:[],
      ids:[],
      // eyeTitle:'预览',
      dialogEyeVisible:false

    }
  },
  computed:{
    // 查找所有的题目，过滤符合条件的数据
    questionList(){
      return this.questions.filter((item,index)=>{
        return this.quesIds.indexOf(item.id)!=-1;
      });
    },
    // 将quesNoOption转换成穿梭框识别的数据
    quesList(){
      let arr=[];
      this.quesNoOption.forEach((item)=>{
        let obj={
          key:item.id,
          label:item.name
        }
        arr.push(obj);
      });
      return arr;
    },
    naireList(){
      // naires进行搜索条件的过滤
      let vm = this;
      return this.naires.filter((item)=>{
        if(item.name){
          return item.name.indexOf(vm.search)!=-1;
        }else{
          return false;
        }
      });
    },
    ...mapGetters(['naires','quesNoOption','questions','quesNaire'])
  },
  created(){
    this.findAllNaire();
    this.findAllQuesNoOption();
    this.tableHeight=($(window).height()-200)+'px';
    this.findAllQuestion();
    // vue实例和属性方法创建完毕
  },
  mounted(){
    // vue实例与DOM绑定并且渲染完毕
    // 设置元素高度时在这里设置，选中元素
  },
  methods:{
    showTrans(){
      this.dialogTransVisible=true;
    },
    // 模态框保存
    save(){
      this.form.questionIds=this.quesIds.join(',');
      this.saveOneNaire(this.form).then((data)=>{
        console.log(data);
        // 提示
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success'
          });
          this.dialogFormVisible=false;
          this.findAllNaire();
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
    addNaire(){
      this.form={
        name:'',
        description:'',
      }
      this.quesIds=[];
      this.dialogTitle='新增';
      this.dialogFormVisible=true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 预览
    handleEyes(index,row){
      this.findNaireById({id:row.id}).then((data)=>{
        // data===this.quesNaire
        this.dialogEyeVisible=true;
      });
    },
    // 编辑
    handleEdit(index,row){
      // row.id为问卷的id，去查找问卷的详细信息，包含题目信息(问卷中的题目修改：名字，描述，内部的题目)
      this.findNaireById({id:row.id}).then((data)=>{
        // data===this.quesNaire
        this.form={
          id:data.id,
          name:data.name,
          description:data.description       
        }
        // 使用map()方法将数组中对象的id映射出来
        this.quesIds=data.questionVMs.map((item)=>{
          return item.id;
        });
        this.dialogTitle='编辑';
        this.dialogFormVisible=true;
      });
    },
    // 删除
    handleDelete(index,row){
      this.deleteNaireById({id:row.id}).then((data)=>{
        console.log(data);
        // 提示
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllNaire();
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
    batchNaire(){
      // 获取用户选中的复选框对应对象的id
      let ids=this.multipleSelection.map((item)=>{
        return item.id;
      });
      console.log(ids);
      //数组转换成字符串 ids.join(',')或者ids.toString()
      this.batchDeleteNaire({ids:ids.join(',')}).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '批量删除成功',
            type: 'success'
          });
          this.findAllNaire();
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
    ...mapActions(['findAllNaire','deleteNaireById','saveOneNaire','batchDeleteNaire','findAllQuesNoOption','findAllQuestion','findNaireById'])
  }
}
</script>
<style scoped>
    .optionDiv .el-input{
        width: 200px;
    }
</style>

<style scoped lang="scss">
  .naireManage{
    .optionDiv{
      button{
        float:right;
        margin-right: 20px;
      }
      .searchBtn{
        float: none;
      }
    }
    .showDiv{
      ul{
        width: 94%;
        padding: 0;
        border: 1px solid #ccc;
        padding-left: 20px;
      }
    }
  }
</style>