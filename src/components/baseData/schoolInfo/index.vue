<!-- 学校信息页面 -->
<template>
  <div class="schoolInfo">
    <!-- {{schools}} -->
    <div class="tableDiv">
      <table :data="schools">
        <tr @click="show=false" v-for="(item,index) in tableArr">
          <td>{{item.name}}</td>
          <td>
            <span v-if="show">{{schools[item.prop]}}</span>
            <el-input v-else v-model="form[item.prop]" placeholder="请输入内容"></el-input>
          </td>
        </tr>
      </table>
      <div class="btnDiv">
        <el-button type="primary" @click="saveSchoolInfo">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
export default {
  data(){
    return {
      form:{},
      show:true,
      tableArr:[{
        name:"校园名称",
        prop:'name'
      },{
        name:"校园介绍",
        prop:'description'
      },{
        name:"校园地址",
        prop:'address'
      },{
        name:"校园电话",
        prop:'telephone'
      },{
        name:"版权信息",
        prop:'copyright'
      }]
    }
  },
  computed:{
    ...mapGetters(['schools'])
  },
  created(){
    this.findSchool().then((data)=>{
      this.form={
        name:data.name,
        id:data.id,
        description:data.description,
        address:data.address,
        telephone:data.telephone,
        copyright:data.copyright
      }
    }).catch();
  },
  methods:{
    saveSchoolInfo(){
      this.saveSchool(this.form).then((data)=>{
        console.log(data);
        // 提示
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success'
          });
          this.findSchool();
          this.show=true;
        }else{
          this.$notify.error({
            title: '错误',
            message: '保存失败1'
          });
        }
      }).catch((error)=>{
          this.$notify.error({
            title: '错误',
            message: '保存失败2'
          });
      });
    },
    ...mapActions(['findSchool','saveSchool'])
  }
}
</script>
<style scoped lang="scss">
  .schoolInfo{
    .tableDiv{
      margin-left: 30px;
      table{
        border-collapse: collapse;
        tr{
          text-align: center;
          td{
            border: 1px solid #ccc;
            span{
              padding-left: 20px;
            }    
          }
        }
        tr td:first-child{
          width: 200px;
          height: 40px;
        }
        tr td:last-child{
          width: 900px;
          height: 40px;
          text-align: left;
        }
      }
    }
    .btnDiv{
      width: 1100px;
      margin-top: 20px;
      height: 16px;
      .el-button{
        width: 100px;
        line-height: 16px;
        float: right;
      }
    }
  }
</style>