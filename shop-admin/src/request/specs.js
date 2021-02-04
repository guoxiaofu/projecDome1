import {httpAuth} from "@/utils/http"
import {specsdelete} from "@/api"

export function deleteSpecs(id){
    return httpAuth.post(specsdelete,{id});
}

export function getSpecsInfo(id){
    return httpAuth({
        url:'/specsinfo',
        params:{
            id
        }
    })
}