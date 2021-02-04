<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{tip}}管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>
    <el-table
      :data="goodsTableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <el-table-column prop="firstcatename" label="一级分类" width="180">
      </el-table-column>

      <el-table-column prop="secondcatename" label="二级分类" width="180">
      </el-table-column>

      <el-table-column prop="goodsname" label="商品名称" width="180">
      </el-table-column>

      <el-table-column prop="price" label="销售价" width="180">
      </el-table-column>

      <el-table-column prop="market_price" label="市场价" width="180">
      </el-table-column>

      <el-table-column prop="status" label="状态" width="130">
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

    <!-- 翻页器 -->
    <div class="pagination">
      <el-pagination
        @current-change="currentChangeFn"
        background
        :current-page="page"
        :page-size="size"
        layout="prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </div>

    <!-- 添加和修改对话框 -->
    <el-dialog
      :title="tip + (isAdd ? '添加' : '修改')"
      :visible.sync="dialogFormVisible"
      @opened="openedFn"
      @close="closeFn"
    >
      <!-- 对话框和表格 -->
      <el-form :model="ruleForm" label-width="150px" ref="ruleForm">
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
          <el-select v-model="ruleForm.second_cateid">
            <el-option
              v-for="item in secondCate"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品名称">
          <el-input v-model="ruleForm.goodsname"></el-input>
        </el-form-item>
        <el-form-item label="商品图片">
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
            <img width="100%" :src="dialogImgUrl" alt="" />
          </el-dialog>
        </el-form-item>

        <el-form-item label="商品规格">
          <el-select v-model="ruleForm.specsid" @change="changeSpecsFn">
            <el-option
              v-for="item in specsList"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品规格值">
          <el-select v-model="ruleForm.specsattr" multiple>
            <el-option
              v-for="item in attrsList"
              :key="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售价">
          <el-input v-model="ruleForm.price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="市场价">
          <el-input v-model="ruleForm.market_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="是否热卖">
          <el-radio :label="1" v-model="ruleForm.ishot">是</el-radio>
          <el-radio :label="2" v-model="ruleForm.ishot">否</el-radio>
        </el-form-item>
        <el-form-item label="是否新品">
          <el-radio :label="1" v-model="ruleForm.isnew">是</el-radio>
          <el-radio :label="2" v-model="ruleForm.isnew">否</el-radio>
        </el-form-item>
        <el-form-item label="上架状态">
          <el-radio :label="1" v-model="ruleForm.status">是</el-radio>
          <el-radio :label="2" v-model="ruleForm.status">否</el-radio>
        </el-form-item>
        <el-form-item label="商品描述">
          <div id="container"></div>
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
import E from "wangeditor";
import axios from "axios";
import { httpAuth, uploadAuth } from "@/utils/http";
let defaultForm = {
  first_cateid: "", //一级分类编号
  second_cateid: "", //二级分类编号
  goodsname: "", //商品名称
  price: "", //商品价格
  market_price: "", //市场价格
  img: "", //商品图片（文件）
  description: "", //商品描述
  specsid: "", //商品规格编号
  specsattr: [], //商品规格属性
  isnew: 1, //是否新品 1-是 2-否
  ishot: 1, //是否热卖推荐 1-是 2-否
  status: 1, //状态1正常2禁用
};
export default {
  data() {
    return {
      //表格数据
      goodsTableData: [],
      dialogFormVisible: false,
      isAdd: true,
      tip: "商品",
      ruleForm: {
        ...defaultForm,
      },
      //验证

      firstCate: [], //一级分类列表的数据
      secondCate: [], //二级分类列表数据
      specsList: [],
      attrsList: [],
      page: 1,
      size: 8,
      total: 10,
      dialogImgVisible: false,
      dialogImgUrl: "",
      fileList: [],
      isDefault: true,
    };
  },
  created() {
    this.getAll();
  },
  beforeDestroy() {
    //销毁编辑器
    if(this.editor){
      this.editor.destroy();
       this.editor = null;
    }
  },
  methods: {
    //处理选中图片的回调
    pictureChange(file, fileList) {
      this.ruleForm.img = file.raw;
    },
    //处理预览的回调
    pictureCardPreview(file) {
      this.dialogImgUrl = file.url;
      this.dialogImgVisible = true;
    },
    //切换页码数触发函数 page:切换后的页面
    currentChangeFn(page) {
      this.page = page;
      this.getAll();
    },
    //重置函数
    resetFn() {
      this.dialogFormVisible = false;
    },
    //对话框打开完毕事件(可以获取内部DOM)
    openedFn() {
      this.editor = new E("#container");
      this.editor.create();
      this.editor.txt.html(this.ruleForm.description);
      this.getFirstCate();
      this.getSpecsList();
    },
    //关闭时触发清空操作
    closeFn() {
      this.$refs.ruleForm.clearValidate();
      this.secondCate = [];
      this.attrsList = [];
      this.fileList = [];
      this.editor.txt.clear();
      this.editor.destroy();
      this.editor = null;
      this.ruleForm = {
        ...defaultForm,
      };
      this.isAdd = true;
    },
    //提交 （新增/修改）
    submitFn() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let url = this.isAdd ? "/goodsadd" : "/goodsedit";
          let ruleForm = {
            ...this.ruleForm,
          };
          //规格值
          ruleForm.specsattr = ruleForm.specsattr.join(",");
          //商品描述（从富文本编辑器中）
          ruleForm.description = this.editor.txt.html();
          uploadAuth.post(url, ruleForm).then((res) => {
            if (res.code == 200) {
              this.dialogFormVisible = false;
              this.getAll();
              this.$message.success("提交成功");
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    //添加按钮点击事件
    addFn() {
      this.dialogFormVisible = true;
    },
    //获取表格数据
    getTableData() {
      return httpAuth.get("/goodslist", {
        params: {
          page: this.page,
          size: this.size,
        },
      });
    },
    //获取总条数
    getTotal() {
      return httpAuth.get("/goodscount");
    },
    //获取表格数据和条数数据
    getAll() {
      axios.all([this.getTableData(), this.getTotal()]).then(
        axios.spread((res1, res2) => {
          if (res1.code == 200) {
            this.goodsTableData = res1.list ? res1.list : [];
          }
          if (res2.code == 200) {
            this.total = res2.list ? res2.list[0].total : 0;
          }
        })
      );
    },
    //获取一级分类列表
    async getFirstCate() {
      let res = await httpAuth.get("/catelist", { params: { pid: 0 } });
      if (res.code == 200) {
        this.firstCate = res.list ? res.list : [];
      }
    },
    //获取二级分类的列表数据
    //将一级分类项的id作为二级分类数据的pid
    async changeFirstFn(pid) {
      if (this.isDefault) {
        this.ruleForm.second_cateid = "";
      }
      let res = await httpAuth.get("/catelist", { params: { pid } });
      if (res.code == 200) {
        this.secondCate = res.list ? res.list : [];
      }
      this.isDefault = true;
    },
    //获取属性列表
    async getSpecsList() {
      let res = await httpAuth.get("/specslist");
      if (res.code == 200) {
        this.specsList = res.list;
      }
    },
    changeSpecsFn(id) {
      this.ruleForm.specsattr = [];
      this.specsList.map((item) => {
        if (item.id == id) {
          this.attrsList = item.attrs;
        }
      });
    },
    //删除操作
    async deleteFn(row) {
      console.log(row);
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
          let res = await httpAuth.post("/goodsdelete", {
            id: row.id,
          });
          console.log(res);
          if (res.code == 200) {
            // let max = res.list.every(item => row.id > item.id);
             this.page=1
            this.getAll();
           
            // if (res.list.length % this.size == 0 && this.page > 1 && max) {
            //   // this.page--;
            //   // this.total = res.list.length;
            //   // this.goodsTableData = res.list.slice(-this.size);
            // } else {
            //   this.total = res.list.length;
            //   this.goodsTableData = res.list.slice(
            //     this.size * (this.page - 1),
            //     this.size * this.page
            //   );
            // }
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    //编辑按钮事件
    async editFn(id) {
      this.dialogFormVisible = true;
      this.isAdd = false;
      let res = await httpAuth.get("/goodsinfo", {
        params: {
          id,
        },
      });
      if (res.code == 200) {
        let specsattr = res.list.specsattr.split(",");
        this.ruleForm = {
          ...res.list,
          specsattr,
          id,
        };
        if (this.editor) {
          this.editor.txt.html(this.ruleForm.description);
        }
        this.isDefault = false;
        this.changeFirstFn(this.ruleForm.first_cateid);
        if (this.ruleForm.img) {
          this.fileList = [
            { name: "", url: "http://localhost:3000" + this.ruleForm.img },
          ];
        }
      }
    },
  },
};
</script>
<style lang="">
.pagination {
  text-align: center;
}
</style>