<template>
  <div class="side">
    <el-menu
      default-active="2"
      class="el-menu-vertical"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
    >
       <el-menu-item index="/index">
        <i class="el-icon-s-home"></i>
        <!-- title插槽内容 -->
        <span slot="title">首页</span>
      </el-menu-item>
        <!-- 定义子菜单 -->
       <el-submenu index="1">
            <template slot="title">
            <i class="el-icon-setting"></i>
            <span>系统设置</span>
            </template>
            <el-menu-item index="/menu">
            <span slot="title">菜单管理</span>
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
    }
}
</script>
<style lang="" scoped>
    /* .side{

    } */
    .side h2{
        color:#fff;
        text-align: center;
        font-size: 25px;
        margin: 20px 0;
    }
</style>