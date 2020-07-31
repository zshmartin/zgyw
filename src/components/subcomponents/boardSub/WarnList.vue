<template>
<!-- 告警列表 -->
  <div class="warnList">
    <div style="width: 100%; position: fixed; z-index: 100; background-color: #4E657A;;">
      <div style="position: relative; width: 100%; color: #fff; background-color: #54657D; border-bottom: 1px solid #ccc;">
        <div class="title" >
          <i class="icon iconfont iconwarn" style="color: #0eceec"></i>
          事件告警列表
        </div>
        <div class="config" v-show="ifEdit">
          <el-button size="mini" @click="editBoard" type="text">配置</el-button>
          <el-button size="mini" @click="delBoard" type="text">删除</el-button>
        </div>
      </div>
      
    </div>
    
    
    <el-table :data="warnOptions" style="width: 100%; margin-top: 4px; margin-top: 30px;" size="small">
      <el-table-column prop="time" label="时间" width="164">
        <template slot-scope="scope">{{scope.row.time | formatTime}}</template>
      </el-table-column>
      <el-table-column prop="name" label="事件"></el-table-column>
      <el-table-column prop="level" label="等级" width="100px">
        <template slot-scope="scope">
          <button class="one-type warn-btn" style="border-radius: 4px" v-if="scope.row.level == 1">一级</button>
          <button class="two-type warn-btn" style="border-radius: 4px" v-else-if="scope.row.level == 2">二级</button>
          <button class="three-type warn-btn" style="border-radius: 4px" v-else-if="scope.row.level == 3">三级</button>
          <button class="four-type warn-btn" style="border-radius: 4px" v-else-if="scope.row.level == 4">四级</button>
          <button class="five-type warn-btn" style="border-radius: 4px" v-else-if="scope.row.level == 5">五级</button>
          <button class="six-type warn-btn" style="border-radius: 4px" v-else-if="scope.row.level == 6">六级</button>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="所属设备"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: ['i','item', 'ifEdit'],
  data() {
    return {
      warnOptions: []
    };
  },
  computed: {
    watchItem() {
      return this.item
    }
  },
  watch: {
    watchItem: {
      handler(newValue) {
        this.warnOptions = this.item.datas.data
      },
      deep: true
    }
  },
  methods: {
    editBoard() {
      this.$emit('editBoard',this.i,this.item)
    },
    delBoard() {
      this.$emit('delBoard',this.i,this.item)
    },
  }
};
</script>

<style scoped>
.config {
  position: absolute;
  right: 0;
  /* top: 10px; */
  display: inline-block;
}
.warnList {
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;
  background-color: rgba(78, 101, 122);
}

.title {
  display: inline-block; 
  padding: 5px; 
  /* padding-top: 10px;  */
  font-weight:bold;
  color: #fff;
}

.el-table {
  color: #fff;
}

.warnList >>> .el-table thead {
  color: #fff;
}
.el-table::before {
  height: 0;
}
.warnList >>> .el-table__empty-block {
  background-color: rgba(78, 101, 122);
}
.warnList >>> .el-table__row {
  background-color: rgba(78, 101, 122);
}
.warnList >>> .el-table_1_column_2 .cell {
  text-align: right;
}

.warnList >>> .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: rgba(67, 92, 112);
}

/* 下边框 */
.warnList >>> .el-table td, .el-table th.is-leaf {
    border-bottom: 1px solid #777777;
}
/* 表头背景色 */
.warnList >>> .el-table th, .el-table tr {
  background-color: rgba(78, 101, 122)
}


</style>