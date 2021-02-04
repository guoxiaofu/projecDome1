import Vue from "vue"
import Vuex from "vuex"
import specs from "./modules/spcs"
import {http} from "@/utils/http"
import router from "@/router"
import {Message} from "element-ui"
import qs from "qs"
Vue.use(Vuex);

let store=new Vuex.Store({
    strict:true,
    state:{
        userinfo:localStorage.getItem("userinfo")?JSON.parse(localStorage.getItem("userinfo")):{}
    },
    mutations:{
        setUserInfo(state,payload){
            state.userinfo=payload
        }
    },
    actions:{
        login({commit},ruleForm){
            let formData=qs.stringify(ruleForm)
            // console.log(formData);
            // console.log(qs.parse(formData));
            http.post("/userlogin",formData).then(res=>{
                if(res.data.code==200){
                    commit("setUserInfo",res.data.list)
                    localStorage.setItem("userinfo",JSON.stringify(res.data.list));
                    router.replace("/index")
                }else{
                    Message.error(res.data.msg);
                }
            });
        }
    },
    modules:{
        specs
    }
});
export default store