<template>
    <div>
         <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{tip}}列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button type="primary" @click="addFn">添加</el-button>
         <el-table 
            :data="seckillTableData" 
            style="width: 100%;margin-bottom:20px"
            row-key="id"
            border
        >
            <el-table-column 
                prop="title"
                label="活动名称" 
                width="280"
            >
            </el-table-column>

            <el-table-column 
                prop="status"
                label="状态" 
                width="180"
            >
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status==1" type="success" effect="dark">启用</el-tag>
                    <el-tag v-else type='danger' effect="dark">禁用</el-tag>
                </template>
            </el-table-column>

            <el-table-column 
                label="操作" 
            >
               <template slot-scope="scope">
                   <el-button @click="editFn(scope.row.id)">编辑</el-button>
                   <el-button type="danger">删除</el-button>
               </template>
            </el-table-column>
        </el-table>

        <el-dialog
        :title="tip + (isAdd ? '添加' : '修改')"
        :visible.sync="dialogFormVisible"
        @opened="openedFn"
        @close="closeFn"
        >
            <el-form
                :model="ruleForm"
                label-width="150px"
                :rules="rules"
                ref="ruleForm"
            >
                <el-form-item label="活动名称" prop="title">
                    <el-input v-model="ruleForm.title"></el-input>
                </el-form-item>
               <!-- <el-form-item>
                   <p>{{value1}}</p>
               </el-form-item> -->
                <el-form-item label="活动期限">
                    <div class="block">
                        <el-date-picker
                        v-model="value1"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        format="yyyy-MM-dd"
                        value-format="timestamp">
                        >
                        </el-date-picker>
                    </div>
                </el-form-item>

                <el-form-item label="一级分类">
                    <el-select v-model="ruleForm.first_cateid" @change="changeFirstFn">
                        <el-option
                        v-for="item in firstCate"
                        :key="item.id"
                        :label="item.catename"
                        :value="item.id"
                        ></el-option>
                     </el-select>
                </el-form-item>

                <el-form-item label="二级分类">
                    <el-select v-model="ruleForm.second_cateid" @change="changeSecondFn">
                        <el-option
                        v-for="item in secondCate"
                        :key="item.id"
                        :label="item.catename"
                        :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="商品名称">
                    <el-select v-model="ruleForm.goodsid">
                        <el-option
                        v-for="item in goodsCate"
                        :key="item.id"
                        :label="item.goodname"
                        :value="item.id"
                        ></el-option>
                    </el-select>
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
import {httpAuth} from "@/utils/http";
let defaultForm={
    title:"",
    begintime:"",
    endtime:"",
    first_cateid:"",
    second_cateid:"",
    goodsid:"",
    status:true,
    
}
export default {
    data(){
        return{
            seckillTableData:[],
            dialogFormVisible:false,
            isAdd:true,
            tip:"限时秒杀",
            ruleForm:{
                ...defaultForm,
            },
            rules:{

            },
            firstCate:[],//一级分类列表的数据
            secondCate: [], //二级分类列表数据
            goodsCate:[],
            value1:[],
            isDefault:true
        }
    },
    created(){
        this.getSeckillData()
    },
    methods: {
        async getSeckillData(){
            let res=await httpAuth.get("/secklist");
            console.log(res);
            if(res.code==200){
                this.seckillTableData=res.list?res.list:[]
            }
        },
        //获取一级分类列表
        async getFirstCate() {
        let res = await httpAuth.get("/catelist", { params: { pid: 0 } });
        if (res.code == 200) {
            this.firstCate = res.list ? res.list : [];
        }
        },
        addFn(){
            this.dialogFormVisible=true
        },
        submitFn(){
            this.$refs.ruleForm.validate(valid=>{
                if(valid){
                    let url=this.isAdd?"/seckadd":"/seckedit";
                    this.ruleForm.status=this.ruleForm.status?1:2;
                    console.log(url);
                    console.log(this.ruleForm);
                    console.log(this.value1);
                    this.ruleForm.begintime=this.value1[0];
                    this.ruleForm.endtime=this.value1[1]
                    // httpAuth.post(url,this.ruleForm).then(res=>{
                    //     if(res.code==200){
                    //         this.dialogFormVisible=false;
                    //         this.getSeckillData();
                    //         this.$message.success("提交成功");
                    //     }else{
                    //         this.$message.error(res.msg);
                    //     }
                    // });
                }
            })
        },
        openedFn(){
            this.getFirstCate();
        },
        //关闭对话框是触发 清空操作
        closeFn(){
            this.$refs.ruleForm.clearValidate();
            this.ruleForm={
                ...defaultForm
            };
            this.isAdd=true;
        },
        //获取二级分类的列表数据
        //将一级分类项的id作为二级分类数据的pid
        async changeFirstFn(pid) {
        if (this.isDefault) {
            this.ruleForm.second_cateid = "";
            
        }
        let res = await httpAuth.get("/catelist", { params: { pid } });
        if (res.code == 200) {
            console.log(res);
            this.secondCate = res.list ? res.list : [];
            // this.goodsCate=res.list
        }
        this.isDefault = true;
        },
        //二级分类的分类id获取商品id
        async changeSecondFn(pid){
            if(this.isDefault){
                this.ruleForm.goodsid="";
            }
            let res=await httpAuth.get("/catelist",{params:{pid}});
            console.log(res);
            if(res.code==200){

            }
        },
        //重置函数
        resetFn() {
        this.dialogFormVisible = false;
        },
        async editFn(id){
            this.dialogFormVisible=true;
            this.isAdd=false;
            console.log(this.value1);
            let res=await httpAuth.get("/seckinfo",{
                params:{
                    id,
                },
            });
            if(res.code==200){
                let status=res.list.status==1?true:false;
                console.log(res.list.begintime);
                console.log(res.list.endtime);
                console.log(res);
                this.value1[0]=res.list.begintime;
                this.value1[1]=res.list.endtime;
                this.ruleForm={
                    ...res.list,
                    status,
                    id,
                    // begintime,
                    // endtime
                };
                
                this.changeFirstFn(this.ruleForm.first_cateid);
            }
        }
    }
}
</script>