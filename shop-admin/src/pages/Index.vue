<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="9" :offset="3">
        <div class="col-item">
          <el-row>
            <el-col>
              <h2>商品总览</h2>
            </el-col>
          </el-row>
          <el-row type="flex" class="item-content">
            <el-col>
              <p>100</p>
              <p>已下架</p>
            </el-col>
            <el-col>
              <p>100</p>
              <p>已下架</p>
            </el-col>
            <el-col>
              <p>100</p>
              <p>已下架</p>
            </el-col>
            <el-col>
              <p>100</p>
              <p>已下架</p>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="9">
        <div class="col-item">
          <el-row>
            <el-col>
              <h2>用户总览</h2>
            </el-col>
          </el-row>
          <el-row type="flex" class="item-content">
            <el-col>
              <p>100</p>
              <p>已下架</p>
            </el-col>
            <el-col>
              <p>100</p>
              <p>已下架</p>
            </el-col>
            <el-col>
              <p>100</p>
              <p>已下架</p>
            </el-col>
            <el-col>
              <p>100</p>
              <p>已下架</p>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <div id="main"></div>
  </div>
</template>
<script>
import * as echarts from "echarts"
export default {
    mounted(){
        var myChart=echarts.init(document.getElementById("main"));
         // 指定图表的配置项和数据
        var option = {
            title: {
                text: '商品订单情况'
            },

            tooltip: {},
            color:["red"],
            legend: {
                data:['近一周订单数量']
            },
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                show:true,
                type: 'value'
            },
            series: [{
                name: '近一周订单数量',
                data: [346, 578, 901, 1676, 1290, 375, 654],
                type: 'line'
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }
}
</script>
<style lang="">
.col-item {
  border: 1px solid gray;
}
.col-item h2 {
  background-color: #fff;
}
.item-content {
  text-align: center;
}
#main{
    width: 800px;
    height: 600px;
    margin-left: 120px;
}
</style>