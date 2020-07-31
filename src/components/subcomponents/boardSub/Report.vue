<template>
<!-- 报表 -->
  <div class="report">
    <div
      style="width: 100%; height: 30px; position: fixed; z-index: 100; background-color: #54657D;"
    >
      <div style="width: 100%; positon: relative; ">
        <div class="title">
          <span>
            <i class="icon iconfont iconbaobiao1" style="color: #0eceec"></i>
            <span>{{JSON.parse(item.param).title}}</span>
          </span>
        </div>
        <div class="config" v-show="ifEdit">
          <el-button size="mini" @click="editBoard" type="text">配置</el-button>
          <el-button size="mini" @click="delBoard" type="text">删除</el-button>
        </div>
      </div>
    </div>
    <table class="table">
      <tr>
        <th style="width: 100px;">时间</th>
        <template v-if="tableData.length > 0">
          <!-- <th v-for="(item1,index) in tableData" :key="item1.id">{{item1.code === '' ? '-' : item1.code}}</th> -->
          <th v-for="(item1,index) in tableData" :key="index">{{item.datas.data[index].name ? item.datas.data[index].name : item.datas.data[index].simplifiedCode}}</th>
        </template>
        <template v-else>
          <th>-</th>
        </template>
      </tr>

      <tr
        v-for="(item,index) in arr"
        :key="item.id"
        :class="{'sin': (index % 2 == 0), 'double': (index % 2 != 0)}"
      >
        <td>{{item}} {{timeSelect == 'day' ? '时' : (timeSelect == 'month' ? '日' : '月')}}</td>
        <!-- <td>{{item.value}}</td> -->
        <!-- 值不存在时用-代替 -->
        <template v-if="tableData.length > 0">
          <td v-for="item1 in tableData" :key="item1.id">
            <!-- {{(item1.data[item.index])+1?item1.data[item.index]:'-'}} -->
            <!-- {{(item1.data[item.index])}} -->
            {{item1.data[index] || item1.data[index] === 0 ? item1.data[index] : '-'}}
            <!-- {{(item1.data)[index]}} -->
          </td>
        </template>
        <template v-else>
          <td></td>
        </template>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: ["i", "item", "ifEdit"],
  data() {
    return {
      arr: [],
      code: "",       //请求用的code集合
      codeShow: '',         //用于展示的code集合
      tableData: [],
      timeSelect: "",
      timeInterval: "",
      timeTimeout: "",
      currentTime: ""
    };
  },
  watch: {
    item: {
      handler(newValue, oldValue) {
        // alert('report')
        console.log(newValue, oldValue);
        this.timeSelect = JSON.parse(this.item.param).timeType;
        this.code = "";
        var arr = [];
        var arr1 = [];
        if (!newValue.datas.data) {
          return;
        }
        for (var j = 0; j < newValue.datas.data.length; j++) {
          arr.push(newValue.datas.data[j].data);
          arr1.push(newValue.datas.data[j].simplifiedCode);
        }
        this.code = arr.join(",");
        this.codeShow = arr1.join(",");
      },
      deep: true
    },
    // 视图更新
    timeSelect: {
      handler() {
        this.frashPage();
      }
    },
    code: {
      handler() {
        this.frashPage();
      }
    }
  },
  beforeDestroy() {
    if(this.timeInterval) {
      clearInterval(this.timeInterval)
    }
    if(this.timeTimeout) {
      clearTimeout(this.timeTimeout)
    }
  },
  methods: {
    // 视图更新
    frashPage() {
      if (JSON.parse(this.item.param).timeType === "day") {
        // 获取的时间加8小时再使用toJSON就是北京时间
        this.currentTime =
          JSON.parse(this.item.param).timeType +
          "_" +
          new Date(Date.parse(new Date()) + 1000 * 60 * 8)
            .toJSON()
            .split("-")
            .join("")
            .slice(0, 8);
        console.log(this.currentTime);
      } else if (JSON.parse(this.item.param).timeType === "month") {
        this.currentTime =
          JSON.parse(this.item.param).timeType +
          "_" +
          new Date(Date.parse(new Date()) + 1000 * 60 * 8)
            .toJSON()
            .split("-")
            .join("")
            .slice(0, 6);
        console.log(this.currentTime);
      } else {
        this.currentTime =
          JSON.parse(this.item.param).timeType +
          "_" +
          new Date(Date.parse(new Date()) + 1000 * 60 * 8)
            .toJSON()
            .split("-")
            .join("")
            .slice(0, 4);
        console.log(this.currentTime);
      }
      console.log(this.currentTime);

      var time = new Date();
      var currentTime = "";

      if (this.code) {
        if (this.timeInterval) {
          clearInterval(this.timeInterval);
        }
        if (this.timeTimeout) {
          clearTimeout(this.timeTimeout);
        }
        this.getReport(this.currentTime);
        if (JSON.parse(this.item.param).timeType != "day") {
          return;
        }
        // 日报表设置另个定时器，非日报表不做定时器
        var nextClock = new Date();
        var now = new Date();
        nextClock.setHours(now.getHours() + 1);
        nextClock.setMinutes(5);
        nextClock.setSeconds(0);
        // 下一个整点零五分关闭一个定时器，开启另外一个定时器
        this.timeTimeout = setTimeout(() => {
          this.getReport(this.currentTime);
          this.timeInterval = setInterval(() => {
            this.getReport(this.currentTime);
          }, 1000 * 60 * 60);
        }, nextClock - now);
      } else {
        this.timeSelect = JSON.parse(this.item.param).timeType || "day";
        var data = this.getTable(this.timeSelect, []);
        this.arr = data.arr;
        this.tableData = data.list;
        // this.tableData = [
        //   {
        //     code: "",
        //     data: []
        //   }
        // ];
      }
    },
    getTable(type, data) {
      var arr = [];
      if (type === "month") {
        for (var i = 1; i <= 31; i++) {
          arr.push(i);
        }
      } else if (type === "day") {
        for (var i = 0; i <= 23; i++) {
          // 修改匹配规则
          var i1;
          if (i < 10) {
            // i1 = "0" + i + ":00";
            i1 = "0" + i;
          } else {
            // i1 = i + ":00";
            i1 = i;
          }
          arr.push(i1);
        }
      } else if (type === "year") {
        for (var i = 1; i <= 12; i++) {
          arr.push(i);
        }
      }
      console.log(arr);
      var list = [];
      console.log(data)
      for (var j = 0; j < data.length; j++) {
        list[j] = {
          code: data[j].simplifiedCode,
          data: []
        };
        for (var k = 0; k < arr.length; k++) {
          var ifTrue = false;
          for (var l = 0; l < data[j].data.length; l++) {
            for (var key in data[j].data[l]) {
              if (data[j].data[l][key].substr(0, 2) == arr[k]) {
                list[j].data.push(+key);
                ifTrue = true;
                break;
              }
            }
          }
          if (!ifTrue) {
            list[j].data.push(null);
          }
        }
      }
      console.log(list);
      console.log(arr);
      var obj = {
        list: list,
        arr: arr
      };
      return obj;
    },
    editBoard() {
      this.$emit("editBoard", this.i, this.item);
    },
    delBoard() {
      this.$emit("delBoard", this.i, this.item);
    },
    getReport(data) {
      this.$http
        .get("equipment/variable/getValueByCode", {
          params: {
            code: this.code,
            type: JSON.parse(this.item.param).timeType,
            tb: data
            // tb: "month_201910"
          }
        })
        .then(res => {
          // alert(2)
          if (res.data.code === 0) {
            // console.log(res);
            var data = this.getTable(
              JSON.parse(this.item.param).timeType,
              res.data.data
            );
            console.log(data);
            this.tableData = data.list;
            // console.log(this.tableData)
            this.arr = data.arr;
          }
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import '../../../assets/css/index.less';
.report {
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(78, 101, 122);
  color: #fff;
}

.config {
  position: absolute;
  right: 0;
  /* top: 10px; */
  display: inline-block;
}

.title {
  display: inline-block;
  padding: 5px;
  font-weight: bold;
  /* background-color: rgba(78, 101, 122); */
}

/* 表格样式 */
.table {
  /* font-family: verdana,arial,sans-serif; */
  font-size: 16px;
  color: #fff;
  border-width: 1px;
  /* border-color: #999999; */
  border-color: #777777;
  border-collapse: collapse;
  text-align: center;
  margin-top: 30px;
}
.table {
  width: 100%;
}

.table th {
  background: @table-th-bgc;
  border-width: 1px;
  padding: 4px;
  border-style: solid;
  /* border-color: #ccc; */
  border-color: #777777;
}

.table td {
  /* background: #eee; */
  border-width: 1px;
  padding: 4px;
  border-style: solid;
  /* border-color: #ccc; */
  border-color: #777777;
}

/* 表格隔行变色 */
.table .sin {
  background-color: @table-stripe;
}
.table .double {
  background-color:@table-bgc;
}
/* 移入变色 */
.table tr:hover {
  background-color: @table-hover;
}
</style>