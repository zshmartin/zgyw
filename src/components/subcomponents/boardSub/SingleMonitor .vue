<template>
<!-- 单变量监控 -->
  <div class="singleMonitor" :style="{'background': color}">
    <div class="left-top" :style="{'font-size': nameSize, 'color': titleColor}">
      <div class="config" v-if="ifEdit">
        <div class="abs">
          <el-button size="mini" @click="editBoard" type="text">配置</el-button>
          <el-button size="mini" @click="delBoard" type="text">删除</el-button>
        </div>
      </div>
      {{name}}
    </div>
    <div class="bottom" :style="{'font-size': valueSize, 'color': valueColor}">{{value}}</div>
  </div>
</template>

<script>
export default {
  props: ["i", "item", "ifEdit"],
  computed: {
    backgroundColor() {
      return this.item;
    },
    ltColor() {
      return JSON.stringify(item.param).ltColor;
    },
    rbColor() {
      return JSON.stringify(item.param).rbColor;
    }
  },
  watch: {
    backgroundColor: {
      handler(newValue) {
        // return
        // console.log(newValue.datas.data.length)
        if (newValue.datas.data && newValue.datas.data.length) {
          // return
          this.unit = newValue.datas.data[0].unit;
        }

        // console.log(newValue);
        let obj = JSON.parse(newValue.param);
        // console.log(obj);
        this.color =
          "linear-gradient(to right bottom, " +
          (obj.ltColor || "pink") +
          "," +
          (obj.rbColor || "skyblue") +
          ")";
        //设置默认颜色大小等
        this.valueSize = obj.valueSize ? obj.valueSize + "px" : "20px";
        this.nameSize = obj.nameSize ? obj.nameSize + "px" : "20px";
        this.titleColor = obj.titleColor || "white";
        this.valueColor = obj.valueColor || "white";
        // console.log(this.valueSize);
        // return
        // return
        if (newValue.datas.data && newValue.datas.data.length > 0) {
          // this.name = null;
          // this.code = null;
          // console.log(newValue.datas.data,this.item)
          // return
          this.name = newValue.datas.data[0].name || "";
          this.code = newValue.datas.data[0].data || "";
          // } else {
          // this.name = newValue.datas.data[0].name || "";
          // this.code = newValue.datas.data[0].data || '';
        }

        // this.getValue()
        // this.code = obj.data[0].code
      },
      deep: true
    },
    code() {
      if (this.timeInterval) {
        clearInterval(this.timeInterval);
      }
      if (!this.code) {
        return;
      }
      this.getValue();
      this.timeInterval = setInterval(() => {
        this.getValue();
      }, 10000);
    }
  },
  data() {
    return {
      color: "",
      name: "", //标题
      code: "", //变量名
      value: "", //实时值
      valueSize: "12", //值字体大小
      nameSize: "12",
      timeInterval: null,
      titleColor: null,
      valueColor: null,
      unit: ""
    };
  },
  created() {
    this.$root.Bus.$on("clearInterval", value => {
      if (this.clearInterval) {
        clearInterval(this.timeInterval);
      }
    });
  },
  beforeDestroy() {
    // 监听中央事件清除
    this.offBusListener();
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  },
  methods: {
    editBoard() {
      this.$emit("editBoard", this.i, this.item);
    },
    delBoard() {
      this.$emit("delBoard", this.i, this.item);
    },
    // 定时获取当前值
    getValue() {
      console.log(this.code);
      if (this.code) {
        this.$http
          .get("equipment/variable/getValueById", {
            params: {
              id: this.code
            }
          })
          .then(res => {
            if (res.data.code === 0) {
              console.log(res.data.data);
              this.value =
                res.data.data.status === "不在线"
                  ? "不在线"
                  : res.data.data.value
                  ? res.data.data.value + this.unit
                  : "";
              // this.value = res.data.data[this.code];
              // this.$emit('listChildValue',this.value)
            }
          });
      }
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

<style lang="less" scoped>
@import "../../../assets/css/index.less";
.config {
  // float: right;
  // position: absolute;
  // top: 0;
  // right: 0;
  height: 20px;
  position: relative;
}
.abs {
  position: absolute;
  top: 0;
  right: 0;
}
.singleMonitor {
  /* position: relative; */
  width: 100%;
  height: 100%;
  @dis-flex();
  @flex-c();
}
.left-top {
  position: relative;
  left: 5px;
  top: 5px;
}

.bottom {
  position: absolute;
  left: 5px;
  bottom: 5px;
}
</style>