// 基础数据仓库
import axios from '../axios';
import qs from 'qs';
export default {
	state:{
		// 校园信息
		schools:{},
		// 年级管理
		grades:[],
		// 课程管理
		courses:[],
		// 教师管理
		teachers:[],
		// 班级管理
		clazzs:[]
	},
	getters:{
		// 校园信息
		schools:state=>state.schools,
		// 年级管理
		grades:state=>{
			return state.grades.filter((item)=>{
				return item.schoolId==3;
			});
		},
		// 课程管理
		courses:state=>state.courses,
		// 教师管理
		teachers:state=>state.teachers,
		// 班级管理
		clazzs:state=>{
			return state.clazzs.filter((item)=>{
				if(item.grade){
					return item.grade.schoolId==3
				}else{
					return false;
				}
			});
		}
	},
	mutations:{
		// data是载荷
		// 校园信息
		changeSchools(state,data){
			state.schools=data;
		},
		// 年级管理
		changeGrades(state,data){
			state.grades=data;
		},
		// 课程管理
		changeCourses(state,data){
			state.courses=data;
		},
		// 教师管理
		changeTeachers(state,data){
			state.teachers=data;
		},
		// 班级管理
		changeClazzs(state,data){
			state.clazzs=data;
		}
	},
	actions:{
		// 校园信息
		findSchool(context,obj){
			return new Promise(function(resolve,reject){
				axios.get('/school/findById',{params:{id:3}}).then(({data})=>{
					context.commit("changeSchools",data.data);
					// console.log(data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 保存
		saveSchool(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/school/saveOrUpdate',qs.stringify(obj)).then(({data})=>{
					console.log(data);
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 校园信息结束

		// 班级管理
		// 批量删除
		batchDeleteClazz(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/clazz/batchDeleteClazz',qs.stringify(obj)).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 保存或更新
		saveOneClazz(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/clazz/saveOrUpdateClazz',qs.stringify(obj)).then(({data})=>{
					console.log(data);
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 按id删除
		deleteClazzById(context,obj){
			return new Promise(function(resolve,reject){
				axios.get('/clazz/deleteClazzById',{params:obj}).then(({data})=>{
					console.log(data);
					// data是后台返回所有数据
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 查询所有数据
		findAllClazz(context){
			return new Promise(function(resolve,reject){
				axios.get('/clazz/findAllVM').then(({data})=>{
					console.log(data.data);
					// data是后台返回所有数据
					context.commit('changeClazzs',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			});
			/*return new Promise(function(resolve,reject){
				axios.get('/clazz/findAll').then(({data})=>{
					console.log(data.data);
					// data是后台返回所有数据
					context.commit('changeClazzs',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			});*/
		},
		// 班级管理结束

		// 教师管理
		// 批量删除
		batchDeleteTeacher(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/user/batchDelete',qs.stringify(obj)).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 保存或更新
		saveOneTeacher(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/user/saveOrUpdate',qs.stringify(obj)).then(({data})=>{
					console.log(data);
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 按id删除
		deleteTeacherById(context,obj){
			return new Promise(function(resolve,reject){
				axios.get('/user/deleteById',{params:obj}).then(({data})=>{
					console.log(data);
					// data是后台返回所有数据
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 查询所有数据
		findAllTeacher(context){
			return new Promise(function(resolve,reject){
				axios.get('/user/findAll').then(({data})=>{
					console.log(data.data);
					// data是后台返回所有数据
					context.commit('changeTeachers',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 教师管理结束

		// 课程管理
		// 批量删除
		batchDeleteCourse(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/course/batchDelete',qs.stringify(obj)).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 保存或更新
		saveOneCourse(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/course/saveOrUpdate',qs.stringify(obj)).then(({data})=>{
					console.log(data);
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 按id删除
		deleteCourseById(context,obj){
			return new Promise(function(resolve,reject){
				axios.get('/course/deleteById',{params:obj}).then(({data})=>{
					console.log(data);
					// data是后台返回所有数据
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 查询所有数据
		findAllCourse(context){
			return new Promise(function(resolve,reject){
				axios.get('/course/findAllCourse').then(({data})=>{
					console.log(data.data);
					// data是后台返回所有数据
					context.commit('changeCourses',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 课程管理结束

	  	// 年级管理
		// 批量删除
		batchDeleteGrade(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/grade/batchDelete',{params:obj}).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 保存或更新
		saveOneGrade(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/grade/saveOrUpdate',qs.stringify(obj)).then(({data})=>{
					console.log(data);
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 按id删除
		deleteGradeById(context,obj){
			return new Promise(function(resolve,reject){
				axios.get('/grade/deleteById',{params:obj}).then(({data})=>{
					console.log(data);
					// data是后台返回所有数据
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			});
		},
		// 查询所有数据
		findAllGrade(context){
			return new Promise(function(resolve,reject){
				axios.get('/grade/findAll').then(({data})=>{
					console.log(data.data);
					// data是后台返回所有数据
					context.commit('changeGrades',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			});
		}
		// 年级管理结束
	}
}