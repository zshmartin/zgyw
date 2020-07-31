<template>
  <!-- 当日当月用能统计 -->
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
      <div class="total">
        <span>{{nowTimeValue}}</span>
      </div>
      <div class="compare">
        <span>{{this.type == 'day' ? '昨日同期' : '上月同期'}}</span>
        <span>{{passTimeValue}}</span>
        <span :class="{less: compare < 0, 'more': compare >= 0}">
          {{compare ? compare.toFixed(2) : 0}}%
          <i class="el-icon-caret-top" v-if="compare > 0"></i>
          <i class="el-icon-caret-bottom" v-else></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["i", "item", "ifEdit"],
  data() {
    return {
      type: "", //日期类型
      code: "", //变量字符串
      time: "", //时间 2020-06-24 12:18:35
      powerType: "", //能源类型
      passTimeValue: "",
      nowTimeValue: "",
      compare: "" //增长比例
    };
  },
  watch: {
    item: {
      handler(newValue) {
        var arr = [];
        var arr1 = [];
        this.type = JSON.parse(newValue.param).timeType;
        this.powerType = JSON.parse(newValue.param).powerType;
        if (newValue.datas.data && newValue.datas.data.length) {
          for (var j = 0; j < newValue.datas.data.length; j++) {
            arr.push(newValue.datas.data[j].data);
            // 名称为空，则变量名补上
            arr1.push(
              newValue.datas.data[j].name
                ? newValue.datas.data[j].name
                : newValue.datas.data[j].variableName
            );
          }
          this.code = arr.join(",");
        }
      },
      deep: true
    },
    // 监听日期类型
    type() {
      this.getData()
    },
    // 监听能耗类型
    powerType() {
      this.getData()
    },
    // 监听变量
    code() {
      console.log(this.code)
      this.getData()
    }
  },
  created() {
    this.getPowerCount();
  },
  methods: {
    editBoard() {
      this.$emit("editBoard", this.i, this.item);
    },
    delBoard() {
      this.$emit("delBoard", this.i, this.item);
    },
    // 控制获取数据频率
    getData() {
      if (this.time) {
        clearTimeout(this.time);
      }
      this.time = setTimeout(() => {
        this.getPowerCount();
      }, 1000);
    },
    // 获取当日或当月用能统计
    getPowerCount() {
      var arr = [];
      var arr1 = [];
      // var arr2 = [];
      this.type = JSON.parse(this.item.param).timeType;
      this.powerType = JSON.parse(this.item.param).powerType;
      if (this.item.datas.data && this.item.datas.data.length) {
        for (var j = 0; j < this.item.datas.data.length; j++) {
          arr.push(this.item.datas.data[j].data);
          // arr2.push(this.item.datas.data[j].simplifiedCode);
          // 名称为空，则变量名补上
          arr1.push(
            this.item.datas.data[j].name
              ? this.item.datas.data[j].name
              : this.item.datas.data[j].variableName
            // this.item.datas.data[j].name
            //   ? this.item.datas.data[j].name
            //   : this.item.datas.data[j].simplifiedCode
          );
        }
        this.code = arr.join(",");
      }
      // 获取当前最新时间
      // let time = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toJSON().split('.')[0].split('T').join(' ')
      // console.log(time)
      // return
      if (this.code && this.type && this.powerType) {
        this.$http
          .get("equipment/energyBranch/powerConsumption", {
            params: {
              type: this.type,
              codes: this.code,
            }
          })
          .then(res => {
            if (res.data.code === 0) {
              this.nowTimeValue = res.data.data.nowTimeDate;
              this.passTimeValue = res.data.data.passTimeDate;
              // this.compare = !this.passTimeValue ? 0 :
              //   ((this.nowTimeValue - this.passTimeValue) /
              //     this.passTimeValue) *
              //   100;
              if(!parseFloat(this.passTimeValue)) {
                this.compare = parseFloat(this.nowTimeValue) ? 100 : 0
              }else {
                this.compare = ((this.nowTimeValue - this.passTimeValue) /
                  this.passTimeValue) *
                100;
              }
            }
          });
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../assets/css/index.less";
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
    padding: 0 10px;
    box-sizing: border-box;
    .total {
      height: 75%;
      @dis-flex();
      align-items: center;
      justify-content: flex-start;
      span {
        font-size: 36px;
        color: skyblue;
        font-weight: 50px;
      }
    }
    .compare {
      height: 25%;
      box-sizing: border-box;
      border-top: 1px solid #ccc;
      color: #aaa;
      span:nth-child(2) {
        font-size: 26px;
      }
      span:nth-child(3).more {
        // color: #54c535;
        color: #f36a45;
      }
      span:nth-child(3).less {
        color: #54c535;
        // color: #f36a45;
      }
    }
  }
}
</style>