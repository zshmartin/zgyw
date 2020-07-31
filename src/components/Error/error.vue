<template>
  <div>
    <div class="power">
      <div class="inner">
        <el-button type="primary" @click="routerBack">返回页面</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    routerBack() {
      this.$router.push('/layout');
    }
  }
};
</script>

<style scoped>
.power {
  width: 100%;
  height: 100%;
}

.inner {
  background: url('../../assets/img/error.png') no-repeat center center;
  width: 911px;
  height: 405px;
  display: block;
  position: relative;
  margin: 0 auto;
  padding: 40px 0 60px;
}

.el-button {
  position: absolute;
  top: 350px;
  left: 491px;
}
</style>
