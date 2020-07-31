<template>
<!-- 网关在线状态 -->
  <div class="gatewayStatus">
    <div class="header" style>
      <div style class="title">
        <div class="text" style>
          <i class="icon iconfont iconwangguanzhuangtai" style="color: #0eceec"></i>
          {{JSON.parse(item.param).title}}
        </div>
        <div class="config" v-show="ifEdit">
          <el-button size="mini" @click="editBoard" type="text">配置</el-button>
          <el-button size="mini" @click="delBoard" type="text">删除</el-button>
        </div>
      </div>
    </div>
    <el-table :data="item.datas.data" :show-header="false" :row-style="inlineStyle" class="table">
      <el-table-column prop="name"></el-table-column>
      <el-table-column prop="param" width="120">
        <template slot-scope="scope">
          <div
            v-if="scope.row.param == 0"
            style="display: flex; justify-content: center; align-items: center;"
          >
            <i class="icon iconfont iconnav_lixianjieshou" style="color: rgb(246, 54, 54)"></i>
          </div>
          <div
            v-else
            style="display: flex; justify-content: center; align-items: center; color: #fff!important"
          >
            <i class="icon iconfont iconnav_zaixianjieshou" style="color: rgba(74, 225, 91)"></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
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
    };
  },
  created() {
    if (this.item.datas.data.length > 0) {
    }
  },
  methods: {
    editBoard() {
      this.$emit("editBoard", this.i, this.item);
    },
    delBoard() {
      this.$emit("delBoard", this.i, this.item);
    },
    inlineStyle(row, colum, rowIndex, columIndex) {
      //   if(colum.)
      // alert(colum)
      // console.log(row)
      // console.log(row.row.param)
      if (row.row.param == 1) {
        return "color: #0eceec;";
      }
    }
  }
};
</script>


<style lang="less" scoped>
@import "../../../assets/css/index.less";
.gatewayStatus {
  overflow: auto;
  width: 100%;
  height: 100%;
  background-color: #4e657a;
  position: relative;
  .header {
    position: fixed;
    z-index: 100;
    width: 100%;
    .title {
      position: relative;
      width: 100%;
      color: #fff;
      background-color: #54657d;
      border-bottom: 1px solid #ccc;
      .text {
        display: inline-block;
        padding: 5px;
        font-weight: bold;
      }
      .config {
        position: absolute;
        right: 0;
        display: inline-block;
      }
    }
  }
  .el-table {
    color: #fff;
    width: 100%;
    margin-top: 30px;
    &::before {
      height: 0;
    }
  }
  .table {
    & /deep/ .el-table__empty-block {
      background-color: @board-bgc;
    }
    & /deep/ .el-table__row {
      background-color: @board-bgc;
    }
    & /deep/ .el-table_1_column_2 .cell {
      text-align: right;
    }

    & /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
      background-color: rgba(67, 92, 112);
    }

    & /deep/ .el-table td,
    .el-table th.is-leaf {
      border-bottom: 1px solid #777777;
    }
    /* 表头背景色 */
    & /deep/ .el-table th,
    .el-table tr {
      background-color: @board-bgc;
    }
  }
}

</style>