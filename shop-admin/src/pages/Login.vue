<template>
  <div class="bg">
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      :rules="rules"
      label-width="0"
      class="ruleForm"
    >
      <h2>登录</h2>
      <el-form-item label="" prop="username">
        <el-input v-model="ruleForm.username"></el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input v-model.number="ruleForm.password" type="password"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button class="login-btn" type="primary" @click="loginFn"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// import axios from "axios"
import { http } from "./../utils/http";
export default {
  created() {
    let _self = this;
    document.onkeydown = function (e) {
      let key = window.event.keyCode;
      if (key == 13 || key == 100) {
        console.log(_self);
        _self.loginFn();
      }
    };
  },
  data() {
    //自定义验证规则函数
    // value：被验证的数据
    // callback ：输出验证结果的回调函数

    var checkPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("密码不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          callback();
        }
      }, 100);
    };

    return {
      ruleForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          //message:错误提示 trigger触发 (默认失去焦点进行验证)
          { required: true, message: "请输入管理员账号", trigger: "blur" }, //验证是否为空
          { min: 3, max: 8, message: "长度在3到8个字符", trigger: "blur" },
          {
            pattern: /^[a-zA-Z]{3,8}$/,
            message: "长度在3 到 8个英文字母构成",
            trigger: "blur",
          },
        ],
        password: [{ validator: checkPassword, trigger: "blur" }],
      },
    };
  },
  methods: {
    loginFn() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.login();
        } else {
          return false;
        }
      });
    },
    login() {
      // http.post("/userlogin", this.ruleForm).then((res) => {
      //   if (res.data.code == 200) {
      //     localStorage.setItem("userinfo", JSON.stringify(res.data.list));
      //     this.$router.replace("/index");
      //   } else {
      //     this.$message.error(res.data.msg);
      //   }
      // });
      
      this.$store.dispatch("login", this.ruleForm);
    },
  },
};
</script>
 
<style lang="" scoped>
/* 给style标签添加scoped属性，内部的样式为组件私有 */
.bg {
  height: 100%;
  background: -webkit-linear-gradient(left, #563443, #413a53, #2f3d60);
}
.ruleForm {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  /* background-color: #fff; */
}
.login-btn {
  width: 100%;
}
</style>