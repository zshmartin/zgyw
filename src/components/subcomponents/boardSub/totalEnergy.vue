<template>
<!-- 总能耗 -->
  <div class="wrapper">
    <div class="config" v-show="ifEdit">
      <el-button size="mini" @click="editBoard" type="text">配置</el-button>
      <el-button size="mini" @click="delBoard" type="text">删除</el-button>
    </div>
    <div
      style="height: 20px; background-color: #54657D; padding: 5px; color: #fff; font-weight: bold; border-bottom: 1px solid #ccc;"
    >
      <span>{{JSON.parse(item.param).title}}</span>
    </div>
    <div class="content">
      <el-table
        :data="energyDataObj.classifiedEnergy"
        style="width: 100%; background-color: rgba(78, 101, 122)"
      >
        <el-table-column label="能源类型" prop="name">
          <template
            slot-scope="scope"
          >{{scope.row.energyProperty.properties}}</template>
        </el-table-column>
        <el-table-column label="值" prop="value">
          <template slot-scope="scope">
            <span
              style="text-align: right"
            >{{scope.row.value + scope.row.energyProperty.unit}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  props: ["i", "item", "ifEdit"],
  data() {
    return {
      energyDataObj: {

      },
      timeSelect: '',
    };
  },
  watch: {
    item: {
      handler(newValue) {
        this.timeSelect = JSON.parse(this.item.param).timeType;
      },
      deep: true
    },
    // timeSelect() {
    //   this.getEnergytData()
    // }
  },
  created() {
    // this.item.datas.data = [
    //   {},{}
    // ]
    this.getEnergytData();
  },
  methods: {
    editBoard() {
      this.$emit("editBoard", this.i, this.item);
    },
    delBoard() {
      this.$emit("delBoard", this.i, this.item);
    },
    // 获取总能耗数据
    getEnergytData() {
      let tb = "";
      let year = new Date().getFullYear();
      let month =
        new Date().getMonth() > 8
          ? new Date().getMonth() + 1
          : '0' + (new Date().getMonth() + 1);
      let day =
        new Date().getDate() > 9
          ? new Date().getDate()
          : '0' + new Date().getDate();
      // return;
      if (JSON.parse(this.item.param).timeType === "day") {
        tb = "day_" + year + month + day;
      } else if (JSON.parse(this.item.param).timeType === "month") {
        tb = "month_" + year + month;
      } else {
        tb = "year_" + year;
      }
      this.$http
        .get("equipment/energyBranch/totalEnergy", {
          params: {
            siteId: this.$store.state.site.siteId,
            type: JSON.parse(this.item.param).timeType,
            tb: tb
          }
        })
        .then(res => {
          if(res.data.code === 0) {
            this.energyDataObj = res.data.data
          }
        });
    }
  }
};
</script>

<style lang="less" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  background-color: #4e657a;
  .config {
    float: right;
    cursor: pointer;
  }
  .content {
    height: calc(100% - 30px);
    width: 100%;
    overflow-y: auto;
    .sin-type {
      width: 100%;
      box-sizing: border-box;
      display: flex;
      border: 1px solid #ccc;
    }
    .sin-type div:first-child {
      width: 30px;
      text-align: center;
      border-right: 1px solid #ccc;
    }
    .sin-type div:nth-child(2) {
      flex: 1;
    }
  }
}
</style>
