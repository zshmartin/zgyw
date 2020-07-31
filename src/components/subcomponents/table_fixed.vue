<template>
  <!-- 用于能源报表中的固定首列表头 -->
  <div class="table-height">
    <el-table
      class="table"
      :data="tableObj.series"
      border
      :height="currentHeight"
      style="width: 100%;"
    >
      <el-table-column fixed prop="name" label="名称" width="220"></el-table-column>
      <el-table-column
        v-for="(item,index) in tableObj.tableHead"
        :label="item + (timeSelect=='day' ? '时' : timeSelect == 'month' ? '日' : '月')"
        :key="index"
      >
        <template
          slot-scope="scope"
        >{{parseFloat(scope.row.data[index]) === scope.row.data[index]? scope.row.data[index] : '-'}}</template>
      </el-table-column>
      <el-table-column label="合计">
        <template slot-scope="scope">{{getAll(scope.row.data).toFixed(2)}}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: ["tableObj", "timeSelect", "tableHeight"],
  data() {
    return {
      currentHeight: null
    };
  },
  watch: {
    tableHeight(newValue) {
      console.log("tableHeight");
      this.computedHeight();
    }
  },
  mounted() {
    this.index = 0;
  },
  methods: {
    computedHeight() {
      // 获取头部高度有bug
      // var headHeight = document.getElementsByClassName("el-table__header")[0]
      //   .offsetHeight;
      // 父组件调用子组件时，高度未准备好，不渲染
      if (!this.tableHeight) {
        return;
      }
      console.log(this.tableHeight);
      this.$nextTick(() => {
        if (document.getElementsByClassName("el-table__empty-block")[0]) {
          console.log(
            document.getElementsByClassName("el-table__empty-block")[0]
              .offsetHeight
          );
        }
        var emptyHeight;
        var tableHeight;
        console.log(document.getElementsByClassName("el-table__empty-block"));
        if (document.getElementsByClassName("el-table__empty-block")[0]) {
          emptyHeight = document.getElementsByClassName(
            "el-table__empty-block"
          )[0].offsetHeight;
        }
        if (document.getElementsByClassName("el-table__body")[0]) {
          tableHeight = document.getElementsByClassName("el-table__body")[0]
            .offsetHeight;
        }
        console.log(emptyHeight, tableHeight);
        // 表格内容高度
        var bodyHeight = emptyHeight ? emptyHeight : tableHeight;
        // 头部高度定为48px，高度超出需要设置高度使用el-table固定高度
        console.log(bodyHeight);
        var height = 48 + bodyHeight + 1;
        console.log(this.tableHeight, height);
        this.currentHeight =
          this.tableHeight > height ? height : this.tableHeight;
        console.log(this.currentHeight);
        // window.onresize();
        this.$forceUpdate();
      });
    },
    getAll(data) {
      return data.reduce((first, second) => {
        return first + second;
      }, 0);
    }
  }
};
</script>

<style scoped>
.table-height {
  height: 100%;
}

/* 解决内部el-table_body-wrapper高度变小的bug */
.table >>> .el-table__header-wrapper {
  height: 48px;
}
.table >>> .el-table__body-wrapper {
  height: calc(100% - 48px) !important;
}
</style>
              