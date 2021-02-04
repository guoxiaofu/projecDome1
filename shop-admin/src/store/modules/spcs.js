import { httpAuth } from "@/utils/http"
import { Message } from "element-ui"
import { deleteSpecs, getSpecsInfo } from "@/request/specs"
let specs = {
    namespaced: true,
    state() {
        return {
            specsTableData: [],
            dialogFormVisible: false,
            isAdd: true,
            temp: {
                specsname: "",
                attrs: "",
                status: true
            }
        }
    },
    mutations: {
        setTableData(state, payload) {
            state.specsTableData = payload;
        },
        setDialogFormVisible(state, payload) {
            state.dialogFormVisible = payload;
        },
        setIsAdd(state, payload) {
            state.isAdd = payload;
        },
        setTemp(state, payload) {
            // console.log(payload);
            state.temp = payload;
        }
    },
    actions: {
        async getTableData(context) {
            let res = await httpAuth.get("/specslist");
            // console.log(res);
            if (res.code == 200) {
                context.commit("setTableData", res.list);
            }
        },
        async submit(context, payload) {
            // console.log(payload);
            let url=context.state.isAdd?"/specsadd":"/specsedit"

            let res = await httpAuth.post(url, payload);
            // console.log(res);
            if (res.code == 200) {
                Message.success("提交成功");
                context.commit('setDialogFormVisible', false);
                context.dispatch("getTableData");
            } else {
                Message.error(res.msg);
            }
        },
        async deleteSpecs(context, id) {
            let res = await httpAuth.post("specsdelete", { id });
            if (res.code == 200) {
                Message.success("删除成功");
                context.dispatch("getTableData");
            } else {
                Message.error(res.msg);
            }
        },
        async getEditInfo(context, id) {
            // console.log(id);
            let res = await getSpecsInfo(id);
            if (res.code == 200) {
                // console.log(res);
                context.commit('setTemp', {
                    id,
                    ...res.list[0]
                })
            }
        }
    }
}

export default specs