<template>
  <div class="bread">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/layout' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{level1}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
import { selectCompany } from "../../utils/index";
export default {
  // props中接受的值，可以使任何类型
  props: {
    level1: String,
    level2: String,
    callback: Function
  },
  data() {
    return {
    };
  },
  methods: {
  },
  created() {
  }
};
</script>

<style scoped>

.bread {
  margin-bottom: 6px;
  height: 56px;
}
.el-breadcrumb {
  background-color: rgba(67, 92, 112);
  height: 50px;
  line-height: 50px;
  padding-left: 10px;
  /* margin-bottom: 6px; */
}

.bread >>> .el-breadcrumb__inner {
  color: #fff;
}
/* .bread {
  position: relative;
} */

/* .bread > .site {
  position: absolute;
  right: 100px;
  bottom: 10px;
}

input.el-input__inner {
  height: 36px !important;
}
input.el-input__suffix {
  height: 36px;
} */
</style>