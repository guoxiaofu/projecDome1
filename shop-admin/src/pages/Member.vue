<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ tip }}管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table
      :data="memberTableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <el-table-column prop="nickname" label="昵称" width="200">
      </el-table-column>

      <el-table-column prop="phone" label="手机号" width="200">
      </el-table-column>

      <el-table-column label="注册日期" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.addtime | formatDate() }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="editFn(scope.row.uid)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="会员修改"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="ruleForm" label-width="150px" :rules="rules" ref="ruleForm">
        <el-form-item label="昵称">
          <el-input v-model="ruleForm.nickname" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="ruleForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="ruleForm.status"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitFn">确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { httpAuth } from "@/utils/http";
let defaultForm = {
  uid: "",
  nickname: "",
  phone: "",
  status: true,
};
export default {
  data() {
    return {
      memberTableData: [],
      tip: "会员",
      dialogFormVisible: false,
      ruleForm: {
        ...defaultForm,
      },
      //验证规则
      rules:{
          nickname:[
              {
                  required:true,
                  message:"请输入管理员名称",
                  trigger:"blur"
              }
          ]
      }
    };
  },
  created() {
    this.getMemberData();
  },
  methods: {
    async getMemberData() {
      let res = await httpAuth.get("memberlist", {
        params: {
          size: 6,
          page: 1,
        },
      });
      console.log(res);
      if (res.code == 200) {
        this.memberTableData = res.list ? res.list : [];
      }
    },
    async editFn(uid) {
      this.dialogFormVisible = true;
      let res=await httpAuth.get("/memberinfo",{
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
            //   password:"",
              uid
          }
      }
    },
    submitFn(){
        this.$refs.ruleForm.validate(valid=>{
            if(valid){
                this.ruleForm.status=this.ruleForm.status?1:2;
                httpAuth.post("/memberedit",this.ruleForm).then(res=>{
                    console.log(res);
                    if(res.code==200){
                        this.dialogFormVisible=false;
                        this.getMemberData();
                        this.$message.success("修改成功")
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            }
        })
    }
  },
  filters: {
    formatDate: function (val) {
      val = Number(val);
      let date = new Date(val);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return `${y}-${MM}-${d} ${h}:${m}:${s}`;
    },
  },
};
</script>