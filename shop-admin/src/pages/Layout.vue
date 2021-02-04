<template>
  <div class="layout">
    <el-container class="container">
      <el-aside width="300px">
        <side-bar></side-bar>
      </el-aside>
      <el-container>
        <el-header class="header">

          <el-dropdown @command="command">
            <span class="el-dropdown-link">
              {{username}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>登出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-main class="main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import SideBar from "@/components/SideBar";
export default {
  data() {
    return {
    //   username: "",
    };
  },
  components: {
    SideBar,
  },
  computed: {
    username(){
        return this.$store.state.userinfo.username;
    }
  },
  methods:{
      async command(){
          let confirm=await this.$confirm("确定退出吗, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            });
            if(confirm=="confirm"){
                localStorage.clear();
                this.$router.replace("/login");
            }
         
      }
  }
};
</script>
<style lang="">
.layout {
  height: 100%;
}
.container {
  height: 100%;
}
.header {
  background-color: #b3c0d1;
  text-align: right;
  line-height: 60px;
}
.main {
  background-color: #e5e5e5;
}
</style>