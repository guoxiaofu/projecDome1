<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品规格</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button type="primary">添加</el-button>
        <el-table :data="specsTableData"
                  style="width: 100%;margin-bottom:20px"
                  row-key="id"
                  border>
          <el-table-column prop="specsname"
                           label="属性名称"
                           width="200">
          </el-table-column>

          <el-table-column prop="attrs"
                           label="属性值"
                           width="200">
                           <template slot-scope="scope">
                               <el-tag v-for="(item,index) in scope.row.attrs" :key="index">{{item}}</el-tag>
                           </template>
          </el-table-column>

          <el-table-column prop="status"
                           label="状态"
                           width="200">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.status==1" type="success" effect="dark">启用</el-tag>
                                <el-tag v-else type='danger' effect="dark">禁用</el-tag>
                            </template>
          </el-table-column>

          <el-table-column label="操作">
                <template>
                    <el-button>编辑</el-button>
                    <el-button type="danger">删除</el-button>
                </template>
          </el-table-column>
        </el-table>
    </div>
</template>

<script>
import {httpAuth} from "@/utils/http"
export default {
    data(){
        return {
            specsTableData:[]
        }
    },
    created(){
        this.getSpecsData();
    },
    methods: {
        async getSpecsData(){
            let res=await httpAuth.get("/specslist");
            if(res.code==200){
                this.specsTableData=res.list?res.list:[];
            }
        }
    },
}
</script>