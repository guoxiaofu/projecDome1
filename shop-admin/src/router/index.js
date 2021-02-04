import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Layout from '@/pages/Layout'
import Login from "@/pages/Login"
import Index from "@/pages/Index"
import Menu from "@/pages/Menu"
// import Role from "@/pages/Role"
// import User from "@/pages/User"
// import Cate from "@/pages/Cate"
// import Specs from "@/pages/Specs"
import Goods from "@/pages/Goods"
import Member from "@/pages/Member"
import Banner from "@/pages/Banner"
import Seckill from "@/pages/Seckill"

// let Layout=()=>import("@/pages/Layout")
// let Login=()=>import("@/pages/Login")
// let Index=()=>import("@/pages/Index")
Vue.use(Router)
let Role = () => import("@/pages/Role")
let User = () => import("@/pages/User")
let Cate = () => import("@/pages/Cate")
let Specs = () => import("@/pages/Specs/Specs")

let router = new Router({
  routes: [
    //防止重定向导致无法前往login，需要将login路由前置匹配
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: Layout,
      children: [{
        path: 'index',
        component: Index
      }, {
        path: "menu",
        component: Menu
      }, {
        path: "role",
        component: Role
      }, {
        path: "user",
        component: User
      }, {
        path: "category",
        component: Cate
      }, {
        path: "specs",
        component: Specs
      }, {
        path: "goods",
        component: Goods
      }, {
        path: "member",
        component: Member
      }, {
        path: "banner",
        component: Banner
      }, {
        path: "seckill",
        component: Seckill
      }, {
        path: "*",
        redirect: "/index"
      }]
    }
  ]
})
//定义访问权限
router.beforeEach((to, from, next) => {

  //通过获取本地存储中userinfo判断是否已登录
  let userinfo = localStorage.getItem("userinfo") ? JSON.parse(localStorage.getItem("userinfo")) : false;
  //已登录
  if (userinfo) {
    //后台允许访问的地址
    let menus_url = userinfo.menus_url.concat(["/index", "/"]);
    // console.log(menus_url);
    //判断目的路由是否是后台允许访问的路由
    let auth = menus_url.indexOf(to.path) > -1 ? true : false;
    //登录页不可以访问
    if (to.path == "/login") {
      next(false)
    } else {
      //其他页面正常访问
      //next();
      //有权限
      if (auth) {
        next();
      } else {
        next(false);
      }
    }
  } else {
    if (to.path == "/login") {
      next();
    } else {
      next("/login");
    }
    //next("/login")不可以，会在登录页死循环
  }
})

export default router
