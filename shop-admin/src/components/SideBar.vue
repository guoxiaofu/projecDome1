<template>
    <div class="side">
        <el-menu
          :default-active="$route.path"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
          unique-opened
        >
        <h2>后台管理系统</h2>
          <el-menu-item index="/index">
            <i class="el-icon-menu"></i>
            <span slot="title">首页</span>
          </el-menu-item>
            <el-submenu v-for="(submenu,index) in menus" :index="index.toString()" :key="index">
              <template slot="title">
                <i :class="submenu.icon"></i>
                <span>{{submenu.title}}</span>
              </template>
              <el-menu-item v-for="(item,index) in submenu.children" :index="item.url" :key="index">
                <span slot="title">{{item.title}}</span>
              </el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>
<script>
export default {
  data(){
    return{
      menus:[]
    }
  },
  created(){
    let userInfo=JSON.parse(localStorage.getItem("userinfo"));
    // console.log(userInfo);
    this.menus=userInfo.menus
  }
}
</script>
<style lang="">
  .side{
    height: 100%;
    background-color: rgb(84,92,100);
  }
  .side h2{
    color: #fff;
    text-align: center;
    font-size: 25px;
    margin: 20px 0;
  }
</style>