<template>
<!-- 多变量数据监控 -->
  <div class="more-data">
    <div style="position: fixed; z-index: 100; width: 100%;">
      <div
        style="position: relative; width: 100%; color: #fff; background-color: #54657D; border-bottom: 1px solid #ccc;"
      >
        <div style="display: inline-block; padding: 5px; font-weight:bold;">
          <i class="icon iconfont icondata2" style="color: #0eceec"></i>
          {{JSON.parse(item.param).title}}
        </div>
        <div class="config" v-show="ifEdit">
          <el-button size="mini" @click="editBoard" type="text">配置</el-button>
          <el-button size="mini" @click="delBoard" type="text">删除</el-button>
        </div>
      </div>
    </div>

    <el-table
      :data="item.datas.data"
      style="width: 100%; margin-top: 30px; background-color: rgba(78, 101, 122)"
    >
      <el-table-column label="变量" prop="name">
        <template slot-scope="scope">{{scope.row.name ? scope.row.name : scope.row.simplifiedCode}}</template>
      </el-table-column>
      <el-table-column label="值" prop="value">
        <template slot-scope="scope">
          <span>{{(scope.row.value === 0 || scope.row.value ? scope.row.value + scope.row.unit : '')}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-table :data="item.datas.data"  style="width: 100%; margin-top: 30px; background-color: rgba(78, 101, 122)" :show-header="false">
      <el-table-column prop="name" label="日期" width="180"></el-table-column>
      <el-table-column prop="value" label="姓名" width="180"></el-table-column>
    </el-table>-->
  </div>
</template>

<script>
export default {
  props: ["i", "item", "ifEdit"],
  data() {
    return {
      title: "",
      timeInterVal1: null,
      equipmentIds: "",
      code: "",
      valueArr: ""
      // valueSting: '',
      // valueSting: '',
    };
  },
  computed: {
    watchItem() {
      return this.item;
    }
  },
  watch: {
    watchItem: {
      handler(newValue) {
        var arr = [];
        var arr1 = [];
        if (this.item.datas.data) {
          for (var j = 0; j < this.item.datas.data.length; j++) {
            arr.push(newValue.datas.data[j].data);
            arr1.push(newValue.datas.data[j].equipmentId);

            // arr2.push(newValue.datas.data[j].name ? newValue.datas.data[j].name ? newValue.datas.data[j].code)
          }
          this.code = arr.join(",");
          this.equipmentIds = arr1.join(",");
        }
      },
      deep: true
    },
    code() {
      // alert(100)
      if (this.timeInterVal1) {
        clearInterval(this.timeInterVal1);
      }
      if (this.code === "") {
        return;
      }
      this.getValue();
      this.timeInterVal1 = setInterval(() => {
        this.getValue();
      }, 10000);
    }
  },
  created() {
    this.$root.Bus.$on("clearInterval", value => {});
  },
  beforeDestroy() {
    // 监听中央事件清除
    this.offBusListener();
    if (this.timeInterVal1) {
      clearInterval(this.timeInterVal1);
    }
  },
  methods: {
    editBoard() {
      this.$emit("editBoard", this.i, this.item);
    },
    delBoard() {
      this.$emit("delBoard", this.i, this.item);
    },
    getValue() {
      // return
      this.$http
        .get("equipment/variable/getValue", {
          params: {
            variableList: this.code,
            equipmentIds: this.equipmentIds
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.valueArr = res.data.data;
            let arr = res.data.data;
            let value = [];

            for (var i = 0; i < this.valueArr.length; i++) {
              for (var key in this.valueArr[i]) {
                // this.item.datas.data[i].value = this.valueArr[i][key];
                this.$set(
                  this.item.datas.data[i],
                  "value",
                  this.valueArr[i][key]
                );
                // this.item.datas.data[i].value = [1,3,0,0,6,8]
              }
            }
            console.log(this.item.datas);
            this.$forceUpdate();
          }
        });
    },
    // 中央事件取消
    offBusListener() {
      this.$root.Bus.$off("changeLogo");
      // 事件告警页面通知布局页面进行当前告警数量更新
      this.$root.Bus.$off("freshTotalWarn");
      this.$root.Bus.$off("changeCompanyName");
    }
  }
};
</script>

<style scoped>
.more-data {
  overflow: auto;
  width: 100%;
  height: 100%;
  background-color: #4e657a;
  /* position: relative; */
}
.top {
  position: fixed;
  z-index: 100;
  height: 30px;
  width: 100%;
  background-color: #54657d;
  border-bottom: 1px solid #ccc;
}
.config {
  /* float: right; */
  position: absolute;
  right: 0;
  top: 0;
}
.el-table {
  color: #fff;
}
.el-table::before {
  height: 0;
}
.more-data >>> .el-table__empty-block {
  background-color: rgba(78, 101, 122);
}
.more-data >>> .el-table__row {
  background-color: rgba(78, 101, 122);
}
/* .more-data >>> .el-table_1_column_2 .cell {
  text-align: right;
} */

.more-data >>> .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: rgba(67, 92, 112);
}

/* 下边框 */
.more-data >>> .el-table td,
.el-table th.is-leaf {
  border-bottom: 1px solid #777777;
}

.more-data >>> .el-table thead {
  color: #fff;
}
/* 表头背景色 */
.more-data >>> .el-table th,
.el-table tr {
  background-color: rgba(78, 101, 122);
}
</style>