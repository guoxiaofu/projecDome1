<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>

    <el-table 
    :data="menuTableData" 
    style="width: 100%;margin-bottom:20px"
    row-key="id"
    border
    :tree-props="{children:'children',hasChildren:'hasChildren'}"
    >
        <el-table-column 
            prop="title"
            label="名称" 
            width="180"
        >
        </el-table-column>

        <el-table-column 
            prop="icon"
            label="图标" 
            width="180"
        >
        </el-table-column>

        <el-table-column 
            label="类型"
            width="180"
            >
            <template slot-scope="scope">
                <el-tag v-if="scope.row.type==1">目录</el-tag>
                <el-tag v-else type="success">菜单</el-tag>
            </template>
        </el-table-column>
        <el-table-column 
            prop="url"
            label="菜单URL" 
            width="180"
        >
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button @click="editFn(scope.row.id)">编辑</el-button>
                <el-button type="danger" @click="deleteFn(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>


    <!-- 添加对话框 -->
    <el-dialog 
        :title="tip+(isAdd?'添加':'修改')" 
        :visible.sync="dialogFormVisible"
        @opened="openedFn"
        @close="closeFn"
    >
    <el-form :model="ruleForm" label-width="150px" :rules="rules" ref="ruleForm">
        <el-form-item label="上级菜单">
             <el-select v-model="ruleForm.pid" placeholder @change="changeMenu">
                <el-option label="顶级菜单" :value="0"></el-option>
                <el-option v-for="item in pMenu" :key="item.id" :label="item.title" :value="item.id"></el-option>
             </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="title">
            <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="图标" v-show="ruleForm.type==1">
            <el-input v-model="ruleForm.icon"></el-input>
        </el-form-item>
        <el-form-item label="菜单URL" v-show="ruleForm.type==2">
            <el-input v-model="ruleForm.url"></el-input>
        </el-form-item>
        <el-form-item label="类型">
            <el-radio :disabled="ruleForm.type==2">目录</el-radio>
            <el-radio :disabled="ruleForm.type==1">图标</el-radio>
        </el-form-item>
        <el-form-item label="状态">
            <el-switch v-model="ruleForm.status"></el-switch>
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
import {httpAuth} from "@/utils/http";
let defaultForm={
    pid:0,
    status:true,
    type:1,
    url:"",
    icon:"",
    title:""
}
export default {
    data() {
        return {
            menuTableData:[],
            dialogFormVisible:false,
            isAdd:true,
            tip:"菜单",
            ruleForm:{
                ...defaultForm
            },
            rules:{
                title:[
                    {
                        required:true,
                        message:"请输入菜单名称",
                        trigger:"blur"
                    }
                ]
            },
            pMenu:[]
        };
    },
    created(){
        this.getTableData()
    },
    methods: {
        openedFn(){
            this.getTopMenu();
        },
        resetFn(){
            this.dialogFormVisible=false;
        },
        closeFn(){
            this.$refs.ruleForm.clearValidate();
            this.ruleForm={
                ...defaultForm
            };
            this.isAdd=true;
        },
        //获取表格数据
        async getTableData(){
            let res=await httpAuth.get("/menulist",{
                params:{
                    istree:true
                }
            });
            if(res.code==200){
                // console.log(res.list);
                this.menuTableData=res.list?res.list:[];
            }else{

            }
        },
        //提交 （新增/修改）
        submitFn(){
            this.$refs.ruleForm.validate(valid=>{
                if(valid){
                    // console.log(this.ruleForm);
                    let url=this.isAdd?"menuadd":"/menuedit";

                    this.ruleForm.status=this.ruleForm.status?1:2;
                    httpAuth.post(url,this.ruleForm).then(res=>{
                        if(res.code==200){
                            this.dialogFormVisible=false;
                            this.getTableData();
                            this.$message.success("提交成功");
                        }
                    });

                }
            });
        },
        changeMenu(id){
            // console.log(id);
            this.ruleForm.type=id!=0?2:1;
        },
        addFn(){
           
            this.dialogFormVisible=true;
        },
        //获取顶级菜单数据
        async getTopMenu(){
            let res=await httpAuth.get("/menulist",{
                params:{
                    pid:0
                }
            });
            if(res.code==200){
                this.pMenu=res.list?res.list:[];
            }
        },
        //删除操作
        async deleteFn(row){
            try {
                let confirm=await this.$confirm(
                    "此操作将永久删除该菜单，是否继续?",
                    "提示",
                    {
                        confirmButtonText:"确定",
                        cancelButtonText:"取消",
                        type:"warning"
                    }
                );
                if(confirm=="confirm"){
                    let res=await httpAuth.post("/menudelete",{
                        id:row.id
                    });
                    if(res.code==200){
                        // console.log(res.list);
                        this.menuTableData=res.list?res.list:[];
                    }
                }
            } catch (error) {
                
            }
        },
        //编辑按钮事件
        async editFn(id){
            // console.log(id);
            this.dialogFormVisible=true;
            this.isAdd=false;
            let res=await httpAuth.get("/menuinfo",{
                params:{
                    id
                }
            });
            if(res.code==200){
                let status=res.list.status==1?true:false;
                this.ruleForm={
                    ...res.list,
                    status,
                    id
                };
            }
        }
    },
}
</script>