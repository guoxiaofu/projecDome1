<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ tip }}管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>
    <el-table
      :data="roleTableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <el-table-column prop="rolename" label="名称" width="280">
      </el-table-column>
      <el-table-column prop="status" label="状态" width="180">
        <template slot-scope="scope">
         <el-tag v-if="scope.row.status==1" type="success" effect="dark">启用</el-tag>
         <el-tag v-else type='danger' effect="dark">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="editFn(scope.row.id)">编辑</el-button>
          <el-button type="danger" @click="deleteFn(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加和修改对话框 -->
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
        <el-form-item label="角色名称" prop="rolename">
          <el-input v-model="ruleForm.rolename"></el-input>
        </el-form-item>
        <el-form-item label="角色权限">
          <!-- 树形控件 -->
          <el-tree
            :data="treeData"
            :props="{
              children: 'children',
              label: 'title',
            }"
            node-key="id"
            ref="tree"
            show-checkbox
            :check-strictly="true"
          >
          </el-tree>
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
import { httpAuth } from "@/utils/http";
let defaultForm = {
  rolename: "",
  menus: "",
  status: true,
};
export default {
  data() {
    return {
      roleTableData: [],
      dialogFormVisible: false,
      isAdd: true,
      tip: "角色",
      ruleForm: {
        ...defaultForm,
      },
      //验证规则
      rules: {
        rolename: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur"
          }
        ]
      },
      treeData: [],
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      let res = await httpAuth.get("/rolelist");
      console.log(res);
      if (res.code == 200) {
        this.roleTableData = res.list ? res.list : [];
      }
    },
    resetFn() {
      this.dialogFormVisible = false;
    },
    openedFn() {
      this.getMenus();
    },
    closeFn() {
      this.$refs.tree.setCheckedKeys([]);
      //清除验证结果
      this.$refs.ruleForm.clearValidate();
      this.ruleForm = {
        ...defaultForm,
      };
      this.isAdd = true;
    },
    submitFn() {
      this.ruleForm.menus = this.$refs.tree.getCheckedKeys().join(',');
      console.log(this.ruleForm.menus);
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let url = this.isAdd ? "/roleadd" : "/roleedit";
          this.ruleForm.status = this.ruleForm.status ? 1 : 2;
          httpAuth.post(url, this.ruleForm).then((res) => {
            if (res.code == 200) {
              this.dialogFormVisible = false;
              this.getData();
              this.$message.success("提交成功");
            }
          });
        }
      });
    },
    addFn() {
      this.dialogFormVisible = true;
    },
    async getMenus() {
      let res = await httpAuth.get("/menulist", {
        params: {
          istree: true,
        },
      });
      if (res.code == 200) {
        console.log(res.list);
        this.treeData = res.list ? res.list : [];
      }
    },
    async deleteFn(row) {
      try {
        let confirm = await this.$confirm(
          "此操作将永久删除该角色,是否继续",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );
        if (confirm == "confirm") {
          let res = await httpAuth.post("/roledelete", {
            id: row.id,
          });
          if (res.code == 200) {
            this.roleTableData = res.list ? res.list : [];
          }
        }
      } catch (error) {}
    },
    async editFn(id) {
      this.dialogFormVisible = true;
      this.isAdd = false;
      let res = await httpAuth.get("/roleinfo", {
        params: {
          id,
        },
      });
      console.log(res);
      if (res.code == 200) {
        let status = res.list.status == 1 ? true : false;
        this.ruleForm = {
          ...res.list,
          status,
          id, //修改 是需要添加额外的参数id
        };
        let menus = this.ruleForm.menus.split(",");
        console.log(menus);
        this.$refs.tree.setCheckedKeys(menus);
      }
    },
  },
};
</script>