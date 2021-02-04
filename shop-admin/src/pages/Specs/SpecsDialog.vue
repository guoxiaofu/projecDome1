<template>
  <el-dialog
    :title="tip + (isAdd ? '添加' : '修改')"
    :visible.sync="dialogFormVisible"
    @close="closeFn"
  >
    <!-- 对话框和表格 -->
    <el-form
      :model="ruleForm"
      label-width="150px"
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item label="属性名称" prop="specsname">
        <el-input v-model="ruleForm.specsname"></el-input>
      </el-form-item>
      <el-form-item label="属性值">
        <div v-for="(item,index) in attrs" :key="index">
          <el-input style="width: 60%" v-model="item.value"></el-input>
          <el-button v-if="index == 0" type="success" @click="addSpecs">添加属性</el-button>
          <el-button v-if="index > 0" type="danger" @click="deleteSpecs(index)">删除属性</el-button>
        </div>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="ruleForm.status"></el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="resetFn">取 消</el-button>
      <el-button type="primary" @click="submitFn">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
//  辅助函数 从vuex中 specs 模块 中获取数据和方法
let { mapState, mapMutations, mapActions } = createNamespacedHelpers("specs");
let defaultRuleForm = {
  specsname: "",
  attrs: "",
  status: true,
};
export default {
  data() {
    return {
      tip: "规格",
      ruleForm: {
        ...defaultRuleForm,
      },
      attrs: [
        {
          value: "",
        },
      ],
      rules: {
        specsname: [
          {
            required: true,
            message: "请输入属性名",
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch:{
    temp(){
      // console.log(this.temp);
      this.attrs=this.temp.attrs.map(item=>{
        return {
          value:item
        };
      });
      // console.log(this.attrs);
      this.ruleForm={
        ...this.temp,
        status:this.temp.status==1?true:false
      }
    }
  },
  computed: {
    dialogFormVisible: {
      get() {
        return this.$store.state.specs.dialogFormVisible;
      },
      set(val) {
        this.setDialogFormVisible(val);
      },
    },
    ...mapState(["isAdd","temp"]),
  },
  methods: {
    ...mapMutations(["setDialogFormVisible"]),
    ...mapActions(["submit"]),
    closeFn() {
      this.$refs.ruleForm.clearValidate();
      this.attrs=[
        {
          value:""
        }
      ]
      this.ruleForm = {
        ...defaultRuleForm,
      };
    },
    submitFn() {
      // console.log(this.ruleForm);

      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // console.log(this.ruleForm)

          // 获取属性值构成的数据（原数组的value属性构成的数组）
          let attrsList = this.attrs.map((item) => item.value);
          // console.log(attrsList)
          // 数组切换为字符串
          let attrs = attrsList.join(",");

          //   准备提交的数据
          let ruleForm = {
            ...this.ruleForm,
            status: this.ruleForm.status ? 1 : 2,
            attrs,
          };
          this.submit(ruleForm);
        }
      });
    },
    resetFn() {
      this.setDialogFormVisible(false);
    },
    addSpecs() {
      this.attrs.push({
        value: "",
      });
    },
    deleteSpecs(index) {
      this.attrs.splice(index, 1);
    },
  },
};
</script>