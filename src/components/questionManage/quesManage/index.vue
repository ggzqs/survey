<!-- 题库管理页面 -->
<template>
  <div class="quesManage">
  <!-- {{questions}} -->
  <!-- {{quesList}} -->
  <!-- {{selected}} -->
  <!-- {{selected}} -->
  	<div class="optionDiv">
      <el-select clearable v-model="choice.type" placeholder="请选择题目类型" size="mini">
        <el-option v-for="(item,index) in types" :key="index" :label="item" :value="item"></el-option>
      </el-select>
      <el-input clearable v-model='choice.search' placeholder="请输入内容" size="mini"></el-input>

      <el-button @click="batchDelete" type="danger" size="mini">批量删除</el-button>
      <el-button @click="addQues" type="success" size="mini">新增</el-button>
    </div>
    <div class="contentDiv">
  		<div class="sectionDiv" v-for="(item,index) in quesList" :key="index">
  			<ul>
  				<li>
  					<input type="checkbox" v-model="selected" :value="item.id"></input>
  					序号 {{index+1}}：{{item.name}}
  				</li>
  				<li v-for="option in item.options" style="padding-left:30px">{{option.label}}. {{option.name}}</li>
  			</ul>
  			<div class="btnDiv">
  				<el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(item)"></el-button>
  				<el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(item)"></el-button>
  			</div>
  		</div>		
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <!-- {{form}} -->
    	<el-form :model="form">
		    <el-form-item label="题目名称" :label-width="formLabelWidth">
		      <el-input v-model="form.name" autocomplete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="题目类型" :label-width="formLabelWidth">
		      <el-select @change="selectChange" clearable v-model="form.questionType" placeholder="请选择题目类型">
            <el-option v-for="(item,index) in types" :key="index" :label="item" :value="item"></el-option>
          </el-select>
		    </el-form-item>
        <el-form-item label="题目选项" :label-width="formLabelWidth" v-if="showTable">
          <el-table @row-click="showSpan=false" :data="form.options" style="width: 100%" height="200px">
            <el-table-column type="index" label="序号" width="55" line-height="20px"></el-table-column>
            <el-table-column label="label" prop="label" align="center">
              <template slot-scope="scope">
                <span v-if="showSpan">{{scope.row.label}}</span>
                <el-input v-else size="mini" v-model="scope.row.label"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="选项" prop="name" align="center">
              <template slot-scope="scope">
                <span v-if="showSpan">{{scope.row.name}}</span>
                <el-input v-else size="mini" v-model="scope.row.name"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="分值" prop="score" align="center">
              <template slot-scope="scope">
                <span v-if="showSpan">{{scope.row.score}}</span>
                <el-input v-else size="mini" v-model="scope.row.score"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <!-- <i class="fa fa-trash-o" aria-hidden="true"></i> -->
                <el-button type="danger" size="mini" @click="handleDeleteOption(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 添加选项的按钮 -->
          <div class="addIcon">
            <i class="fa fa-plus" title="添加选项" @click="addOption"></i>
          </div>
        </el-form-item>
		  </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
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
      showSpan:true,
      showTable:true,
    	choice:{
	        type:'',
	        search:''
	    },
	    types:['单选题','多选题','简答题'],
	    selected:[],
	    multipleSelection:[],
	    dialogTitle:'',
	    dialogFormVisible:false,
	    formLabelWidth:'80px',
	    form:{
        name:'',
        questionType:'',
        options:[]
      }
    }
  },
  computed:{
  	quesList(){
  		let vm = this;
      	return this.questions.filter((item)=>{
        	if(item.name){
        		if(item.questionType&&vm.choice.type){
        			return (item.name.indexOf(vm.choice.search)!=-1)&&(item.questionType==vm.choice.type);
        		}
          		return item.name.indexOf(vm.choice.search)!=-1;
        	}else{
         	 return true;
        	}
	    });
  	},
  	...mapGetters(['questions'])
  },
  mounted(){
  	$('.contentDiv').height($(window).height()-200);
  },
  created(){
    this.findAllQuestion();
  },
  methods:{
    // 添加选项
    addOption(){
      // 给表格中添加一行
      this.form.options.push({
        name:'',
        label:'',
        score:''
      });
    },
    // 删除选项
    handleDeleteOption(index,row){
      // this.form.options
      // 通过index来删除数组中对应位置的对象
      this.form.options.splice(index,1);
    },
    // 模态框下拉列表发生更改
    selectChange(val){
      // val最新的值 单选- 多选- 简答
      if(val=='简答题'){
        this.showTable=false;
      }else{
        this.showTable=true;
      }
    },
    save(){
      this.saveOneQuestion(this.form).then((data)=>{
        // console.log(data);
        // 提示
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success'
          });
          this.findAllQuestion();
          this.dialogFormVisible=false;
        }else{
          this.$notify.error({
            title: '错误',
            message: '保存失败1'
          });
          this.dialogFormVisible=false;
        }
      }).catch((error)=>{
        this.dialogFormVisible=false;
          this.$notify.error({
            title: '错误',
            message: '保存失败2'
          });
      });
    },
    // 批量删除
  	batchDelete(){
      // 获取用户选中的复选框对应对象的id
      let ids=this.selected
      // console.log(ids);
      //数组转换成字符串 ids.join(',')或者ids.toString()
      this.batchDeleteQuestion({ids:ids.join(',')}).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '批量删除成功',
            type: 'success'
          });
          this.findAllQuestion();
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
  	addQues(){
      this.form={
        name:'',
        questionType:'单选题',
        options:[]
      };
      this.showTable=true;
  		this.dialogTitle='新增';
  		this.dialogFormVisible=true;
  	},
  	// item=ques  每个题目对象
  	handleEdit(ques){
  		// alert(ques.options);
      this.dialogTitle='编辑';
      this.dialogFormVisible=true;
      this.form={
        id:ques.id,
        name:ques.name,
        questionType:ques.questionType,
        // 当前给的是引用地址，上面的是值传递
        // options:ques.options
        // 原对象--》JSON字符串--》数组，产生新内存空间
        options:JSON.parse(JSON.stringify(ques.options))
      }
      // 判断题目类型，显示表格
      if(ques.questionType=='简答题'){
        this.showTable=false;
      }else{
        this.showTable=true;
      }
  	},
  	handleDelete(ques){
  		// alert(ques.id);
      this.deleteQuestionById({id:ques.id}).then((data)=>{
        console.log(data);
        // 提示
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllQuestion();
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
    	...mapActions(['findAllQuestion','batchDeleteQuestion','saveOneQuestion','deleteQuestionById'])
    }
}
</script>
<style scoped lang="scss">
  .quesManage{
  	.optionDiv{
  		.el-button{
  			float: right;
  			margin-right: 20px;
  		}
  		.el-input{
  			width: 200px;
  		}
  	}
  	.contentDiv{
  		/*height: 440px;*/
  		overflow: auto;
  		.sectionDiv{
  			width: 95%;
  			border: 1px solid #ccc;
  			margin-left: 20px;
  			margin-top: 20px;
  			ul{
  				padding-left: 20px;
  				margin-bottom: 0;
  			}
  			.btnDiv{
  				text-align: right;
  				margin: 0 16px 10px;
  			}
  		}
  	}
    .el-form-item:last-child{
      padding-bottom: 0; 
      margin-bottom: 0;
      .addIcon{
        font-size: 20px;
        text-align: right;
        i{
          cursor: pointer;
        }
      }
    }
    
  }
</style>