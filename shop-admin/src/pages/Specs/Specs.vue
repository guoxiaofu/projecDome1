<template>
    <div>
         <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品规格</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button type="primary" @click="addFn">添加</el-button>
        <specs-table></specs-table>
        <specs-dialog></specs-dialog>
    </div>
</template>
<script>
import {createNamespacedHelpers} from "vuex"
let {mapState,mapMutations,mapActions}=createNamespacedHelpers("specs")
import SpecsTable from "./SpecsTable"
import SpecsDialog from "./SpecsDialog"
export default {
    components:{
        SpecsTable,
        SpecsDialog
    },
    created(){
        this.getTableData();
    },
     methods:{
        ...mapMutations(["setDialogFormVisible"]),
        ...mapActions(["getTableData"]), //specs 模块的actions中  getTableData
        addFn(){
            this.setDialogFormVisible(true)
        }
    }
}
</script>