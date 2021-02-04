import axios from "axios"
//非组件使用弹框
import {Message} from 'element-ui';
//非组件中进行导航
import router from "@/router"

let http=axios.create({
    baseURL: "/api",
    timeout:3000
});

let httpAuth=axios.create({
    baseURL:"/api",
    timeout:3000
});

httpAuth.interceptors.request.use(config=>{
    let token=localStorage.getItem("userinfo")?JSON.parse(localStorage.getItem("userinfo")).token:"";
    // console.log(token);
    config.headers={
        ...config.headers,
        "Authorization":token
    }
    return config;
},error=>{
    return Promise.reject(error)
});

httpAuth.interceptors.response.use(response => {
// Do something before response is sent
//token过期判断，进行登出跳转到login
if(response.data.code==403){
    localStorage.clear();
    router.replace("/login");
    Message.error("登录已过期或访问权限受限");
}
return response.data;
},error => {
// Do something with response error
return Promise.reject(error);
});

//上传文件的实例
let uploadAuth=axios.create({
    baseURL: "/api",
    timeout:3000

});
uploadAuth.interceptors.request.use(config=>{
    // console.log(config);
    let data={
        ...config.data
    }
    let formData=new FormData();
    for(var key in data){
        formData.append(key,data[key]);
    }
    config.data=formData;
    let token=localStorage.getItem("userinfo")?JSON.parse(localStorage.getItem("userinfo")).token:"";
    // console.log(token);
    config.headers={
        ...config.headers,
        "Authorization":token,
        "Content-Type":"multipart/form-data"
    }
    return config;
},error=>{
    return Promise.reject(error);
});

uploadAuth.interceptors.response.use(response => {
// Do something before response is sent
if(response.data.code==403){
    localStorage.clear();
    router.replace("/login");
    Message.error("登录已过期或访问权限受限")
}
return response.data;
},error => {
// Do something with response error
return Promise.reject(error);
});

export {
    http,
    httpAuth,
    uploadAuth
}