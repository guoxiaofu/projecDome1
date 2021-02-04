<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{tip}}管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>
    <el-table
      :data="userTableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <el-table-column prop="uid" label="用户编号" width="180">
      </el-table-column>

      <el-table-column prop="rolename" label="角色" width="180">
      </el-table-column>

      <el-table-column prop="username" label="用户名" width="180">
      </el-table-column>

      <el-table-column prop="status" label="状态" width="180">
         <template slot-scope="scope">
         <el-tag v-if="scope.row.status==1" type="success" effect="dark">启用</el-tag>
         <el-tag v-else type='danger' effect="dark">禁用</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="editFn(scope.row.uid)">编辑</el-button>
          <el-button type="danger" @click="deleteFn(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 翻页器 -->
    <div class="pagination">
        <el-pagination
        @current-change="currentChangeFn"
        background
        :current-page = "page"
        :page-size = "size"
        layout="prev, pager, next"
        :total="total">
        </el-pagination>
    </div>

    <!-- 对话框和表格 -->
    <el-dialog :title="tip+(isAdd?'添加':'修改')" 
        :visible.sync="dialogFormVisible"
        @opened="openedFn"
        @close="closeFn"
        >
        <el-form :model="ruleForm" label-width="150px" :rules="rules" ref="ruleForm">
            <el-form-item label="角色名称">
                <el-select v-model="ruleForm.roleid">
                    <el-option v-for="item in roleData" :key="item.id" :label="item.rolename" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="用户名" prop="username">
                <el-input v-model="ruleForm.username" ></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input type="password" v-model="ruleForm.password" ></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-switch v-model="ruleForm.status" ></el-switch>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="resetFn">取 消</el-button>
            <el-button type="primary" @click="submitFn">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { httpAuth } from "@/utils/http";
import axios from 'axios';
let defaultForm={
    roleid:"",
    username:"",
    password:"",
    status:true
}
export default {
  data() {
    return {
      userTableData: [],
      dialogFormVisible:false,
      isAdd:true,
      tip:"管理员",
      ruleForm:{
          ...defaultForm
      },
      rules:{
          username:[
              {
                  required:true,
                  meseage:"请输入管理员名称",
                  trigger:"blur"
              }
          ]
      },
      //角色列表的数据
      roleData:[],
      page:1,
      size:2,
      total:10
    };
  },
  created() {
    this.getAll();
  },
  methods: {
      //切换页码触发函数 page:切换后的页面
      currentChangeFn(page){
          this.page=page;
          this.getAll();
      },
      resetFn(){
          this.dialogFormVisible=false;
      },
      //对话框打开完毕事件
      openedFn(){
          this.getRoleData();
      },
      //关闭对话框是触发 清空操作
      closeFn(){
          this.$refs.ruleForm.clearValidate();
          this.ruleForm={
              ...defaultForm
          };
          this.isAdd=true;
      },
      submitFn(){
          this.$refs.ruleForm.validate(valid=>{
              if(valid){
                  let url=this.isAdd?"/useradd":"/useredit";
                  //提交前切换status
                  this.ruleForm.status=this.ruleForm.status?1:2;
                  httpAuth.post(url,this.ruleForm).then(res=>{
                      if(res.code==200){
                          this.dialogFormVisible=false;
                          this.getAll();
                          this.$message.success("提交成功");
                      }
                  })
              }
          });
      },
      addFn(){
          this.dialogFormVisible=true;
      },

      //获取表格数据
     getUserData() {
      return  httpAuth.get("/userlist", {
        params: {
          size: this.size,
          page: this.page,
        },
      });
    },
    //获取总条数
    getTotal(){
       return httpAuth.get("/usercount")
    },
    getAll(){
        axios.all([this.getUserData(),this.getTotal()]).then(axios.spread((res1, res2)=>{
            if(res1.code==200){
                this.userTableData=res1.list?res1.list:[]
            }
            if(res2.code==200){
                this.total=res2.list?res2.list[0].total:0
            }
        }));
    },
    //获取角色列表
    async getRoleData(){
        let res=await httpAuth.get("/rolelist");
        if(res.code==200){
            this.roleData=res.list?res.list:[];
        }
    },
     //删除操作
     async deleteFn(row){
         try {
             let confirm=await this.$confirm(
                 `此操作将永久删除该${this.tip},是否继续?`,
                 "提示",
                 {
                     confirmButtonText:"确定",
                     cancelButtonText:"取消",
                     type:"warning"
                 }
             );
             if(confirm=="confirm"){
                 let res=await httpAuth.post("/userdelete",{
                     id:row.id
                 });
                 if(res.code==200){
                    //  console.log(res.list);
                    //  this.page=1;
                    let max=res.list.every(item=>row.id>item.id);
                    //回退到前一页
                    if(res.list.length%this.size==0&&this.page>1&&max){
                        this.page--;
                        this.total=res.list.length;
                        this.userTableData=res.list.slice(-this.size);
                    }else{
                        this.total=res.list.length;
                        this.userTableData=res.list.slice(this.size*(this.page-1),this.size*this.page)
                    }
                 }
             }
         } catch (error) {
             
         }
     },
     async editFn(uid){
         console.log(uid);
         this.dialogFormVisible=true;
         this.isAdd=false;
         let res=await httpAuth.get("/userinfo",{
             params:{
                 uid
             }
         });
         console.log(res);
         if(res.code==200){
             let status=res.list.status==1?true:false;
             this.ruleForm={
                 ...res.list,
                 status,
                 password:"",
                 uid //修改 是需要添加额外的参数id
             };
            
         }
     }
  },
};
</script>

<style lang="">
    .pagination{
        text-align: center;
    }
</style>