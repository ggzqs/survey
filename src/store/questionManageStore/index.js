// 问卷管理仓库
import axios from '../axios';
import qs from 'qs';
export default {
	state:{
		// 题库管理
		questions:[],
		// 问卷管理
		naires:[],
		quesNoOption:[],
		quesNaire:[]

	},
	getters:{
		// 题库管理
		questions:state=>state.questions,
		// 问卷管理
		naires:state=>state.naires,
		quesNoOption:state=>state.quesNoOption,
		quesNaire:state=>state.quesNaire
	},
	mutations:{		
		// 题库管理
		changeQuestions(state,data){
			state.questions=data;
		},
		// 问卷管理
		changeNaires(state,data){
			state.naires=data;
		},
		changeQuesNoOption(state,data){
			state.quesNoOption=data;
		},
		changeOneQuesNaire(state,data){
			state.quesNaire=data;
		}
	},
	actions:{
		// 问卷管理
		// 批量删除
		batchDeleteNaire(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/questionnaire/batchDeleteQuestion',qs.stringify(obj)).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 保存或更新
		saveOneNaire(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/questionnaire/saveOrUpdateQuestionnaire',qs.stringify(obj)).then(({data})=>{
					console.log(data);
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 按id删除
		deleteNaireById(context,obj){
			return new Promise(function(resolve,reject){
				axios.get('/questionnaire/deleteQuestionnaireById',{params:obj}).then(({data})=>{
					console.log(data);
					// data是后台返回所有数据
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 返回题目id name questionType
		findAllQuesNoOption(context){
			return new Promise(function(resolve,reject){
				axios.get('/question/findAllQuestion').then(({data})=>{
					console.log(data.data);
					// data是后台返回所有数据
					context.commit('changeQuesNoOption',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 查询所有数据
		findAllNaire(context){
			return new Promise(function(resolve,reject){
				axios.get('/questionnaire/findAllQuestionnaire').then(({data})=>{
					console.log(data.data);
					// data是后台返回所有数据
					context.commit('changeNaires',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		findNaireById(context,obj){
			return new Promise(function(resolve,reject){
				axios.get('/questionnaire/findQuestionnaireVMById',{params:obj}).then(({data})=>{
					console.log(data.data);
					// data是后台返回所有数据
					context.commit('changeOneQuesNaire',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 问卷管理结束

		// 题库管理
		findAllQuestion(context){
			return new Promise(function(resolve,reject){
				axios.get('/question/findAllQuestionVM').then(({data})=>{
					context.commit("changeQuestions",data.data);
					// console.log(data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 批量删除
		batchDeleteQuestion(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/question/batchDeleteQuestion',qs.stringify(obj,{allowDots:true})).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 保存或更新
		saveOneQuestion(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/question/saveOrUpdateQuestion',qs.stringify(obj,{allowDots:true})).then(({data})=>{
					console.log(data);
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 按id删除
		deleteQuestionById(context,obj){
			return new Promise(function(resolve,reject){
				axios.get('/question/deleteQuestionById',{params:obj}).then(({data})=>{
					console.log(data);
					// data是后台返回所有数据
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		}
		// 题库管理结束
	}
}