<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ tip }}管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>
    <el-table
      :data="bannerTableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <el-table-column prop="title" label="轮播图名称" width="280">
      </el-table-column>

      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1" type="success" effect="dark"
            >启用</el-tag
          >
          <el-tag v-else type="danger" effect="dark">禁用</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="editFn(scope.row.id)">编辑</el-button>
          <el-button type="danger" @click="deleteFn(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="tip + (isAdd ? '添加' : '修改')"
      :visible.sync="dialogFormVisible"
      @close="closeFn"
    >
      <el-form
        :model="ruleForm"
        label-width="150px"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="轮播图标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="轮播图图片">
          <el-upload
            action="#"
            :auto-upload="false"
            list-type="picture-card"
            :on-preview="pictureCardPreview"
            :on-change="pictureChange"
            ref="upload"
            :file-list="fileList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>

          <el-dialog :visible.sync="dialogImgVisible" append-to-body>
            <img width="100%" :src="dialogImgUrl" alt />
          </el-dialog>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="ruleForm.status"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="cancelFn">取 消</el-button>
          <el-button type="primary" @click="submitFn">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { httpAuth, uploadAuth } from "@/utils/http";
//默认初始表单数据
let defaultForm = {
//   id: "",
  title: "",
  img: "", //轮播图片文件
  status: true,
};
export default {
  data() {
    return {
      bannerTableData: [],
      dialogFormVisible: false,
      isAdd: true,
      tip: "轮播图",
      ruleForm: {
        ...defaultForm,
      },
      rules: {
        title:[
              {
                  required:true,
                  meseage:"请输入轮播图名称",
                  trigger:"blur"
              }
          ]
      },
      dialogImgVisible: false,
      dialogImgUrl: "",
      fileList: [],
    };
  },
  created() {
    this.getBannerData();
  },
  methods: {
    async getBannerData() {
      let res = await httpAuth.get("/bannerlist");
    //   console.log(res);
      if (res.code == 200) {
        this.bannerTableData = res.list ? res.list : [];
      }
    },
    //获取图片
    pictureChange(file, fileList) {
      this.ruleForm.img = file.raw;
    },
    //处理预览的回调
    pictureCardPreview(file) {
      this.dialogImgUrl = file.url;
      this.dialogImgVisible = true;
    },
    //关闭对话框时触发清空操作
    closeFn() {
      this.$refs.ruleForm.clearValidate();
      this.ruleForm = {
        ...defaultForm,
      };
      this.fileList = [];
      this.isAdd = true;
    },
    addFn() {
      this.dialogFormVisible = true;
    },
    cancelFn() {
      this.dialogFormVisible = false;
    },
    //提交 （添加或修改）
    submitFn() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.ruleForm.status=this.ruleForm.status?1:2;
          let url = this.isAdd ? "/banneradd":"/banneredit";
          let ruleForm = {
            ...this.ruleForm,
          };
          console.log(url);
          console.log(ruleForm);
          uploadAuth.post(url, ruleForm).then((res) => {
            if (res.code == 200) {
              this.dialogFormVisible = false;
              console.log(res);
              this.getBannerData();
              this.$message.success("提交成功");
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    async editFn(id) {
      this.dialogFormVisible = true;
      this.isAdd = false;
      let res = await httpAuth.get("/bannerinfo", {
        params: {
          id,
        },
      });
      if (res.code == 200) {
          let status=res.list.status==1?true:false;
        this.ruleForm = {
          ...res.list,
          status,
          id,
        };
        if (this.ruleForm.img) {
          this.fileList = [
            { name: "", url: "http://localhost:3000" + this.ruleForm.img },
          ];
        }
      }
    },
    //删除操作
    async deleteFn(row) {
      try {
        let confirm = await this.$confirm(
          `此操作将永久删除该${this.tip},是否继续?`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );
        if (confirm == "confirm") {
          let res = await httpAuth.post("/bannerdelete", {
            id: row.id,
          });
          if (res.code == 200) {
            console.log(res);
            this.getBannerData();
          } else {
              
          }
        }
      } catch (error) {}
    },
  },
};
</script>