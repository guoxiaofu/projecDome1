<template>
    <el-table :data="specsTableData"
                  style="width: 100%;margin-bottom:20px"
                  row-key="id"
                  border>
          <el-table-column prop="specsname"
                           label="属性名称"
                           width="200">
          </el-table-column>

          <el-table-column label="属性值"
                           width="180">
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
                <template slot-scope="scope">
                    <el-button @click="editFn(scope.row.id)">编辑</el-button>
                    <el-button type="danger" @click="deleteFn(scope.row.id)">删除</el-button>
                </template>
          </el-table-column>
        </el-table>
</template>
<script>
import {createNamespacedHelpers} from "vuex"
let {mapState,mapMutations,mapActions}=createNamespacedHelpers("specs")
export default {
    computed:{
        ...mapState(["specsTableData"])
    },
    methods:{
        ...mapMutations(["setIsAdd","setDialogFormVisible"]),
        ...mapActions(["deleteSpecs","getEditInfo"]),
        editFn(id){
            // console.log(id);
            this.setIsAdd(false);
            this.setDialogFormVisible(true);
            this.getEditInfo(id);
        },
        async deleteFn(id){
            try {
                let confirm=await this.$confirm(
                    "此操作将永久删除菜单,是否继续?",
                    "提示",
                    {
                        confirmButtonText:"确定",
                        cancelButtonText:"取消",
                        type:"warning"
                    }
                );
                if(confirm=="confirm"){
                    this.deleteSpecs(id)
                }
            } catch (error) {
                
            }
        }
    }
}
</script>