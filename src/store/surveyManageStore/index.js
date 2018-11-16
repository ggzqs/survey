// 课调管理仓库
import axios from '../axios';
import qs from 'qs';
export default {
	state:{
		// 课调管理
		surveies:[],
		// 课调监控
		// 课调审核
	},
	getters:{
		// 课调管理
		surveies:state=>state.surveies,
		// 课调监控
		// 课调审核
		// 获取所有审核通过的数据
		passSurvey:state=>{
			return state.surveies.filter((item)=>{
				return item.status=='审核通过'
			});
		}
	},
	mutations:{
		// 课调管理
		changeSurvey(state,data){
			state.surveies=data;
		}
		// 课调监控
		// 课调审核
	},
	actions:{
		// 课调管理
		// 批量删除
		batchDeleteSurvey(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/survey/batchDeleteSurveyById',qs.stringify(obj)).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 保存或更新
		saveOneSurvey(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/survey/saveOrUpdateSurvey',qs.stringify(obj)).then(({data})=>{
					// console.log(data);
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 按id删除
		deleteSurveyById(context,obj){
			return new Promise(function(resolve,reject){
				axios.get('/survey/deleteSurveyById',{params:obj}).then(({data})=>{
					// console.log(data);
					// data是后台返回所有数据
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		findSurveyById(context,obj){
			return new Promise(function(resolve,reject){
				axios.get('/questionnaire/findQuestionnaireVMById',{params:obj}).then(({data})=>{
					// console.log(data);
					// data是后台返回所有数据
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 查询所有数据
		findAllSurvey(context){
			return new Promise(function(resolve,reject){
				axios.get('/survey/findAllSurveyVM').then(({data})=>{
					// console.log(data.data);
					// data是后台返回所有数据
					context.commit('changeSurvey',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 课调管理结束
		// 课调监控
		// 开启课调
		beginSurvey(context,obj){
			return new Promise(function(resolve,reject){
				axios.get('/survey/beginSurvey',{params:obj}).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 结束课调
		stopSurvey(context,obj){
			return new Promise(function(resolve,reject){
				axios.get('/survey/stopSurvey',{params:obj}).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 课调监控结束
		
		// 课调审核
		checkSurvey(context,obj){
			return new Promise(function(resolve,reject){
				axios.get('/survey/checkSurvey',{params:obj}).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 课调审核结束
	}
}