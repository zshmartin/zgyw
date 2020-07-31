<template>
  <div class="phase">
    <Mybreadcrumb level1="电能质量" level2="三相不平衡分析" />
    <div class="content">
      <div class="select">
        <div class="equip">
          <span>设备：</span>
          <el-cascader
            v-model="equipId"
            :props="defaultProps"
            :options="group_equip_options"
            @change="equipChange"
            :key="isResouceShow"
          ></el-cascader>
        </div>
        <div class="day">
          <span>日期：</span>
          <el-date-picker
            v-model="daySelect"
            type="date"
            placeholder="选择月"
            :picker-options="pickerOptions_day"
            :clearable="Boolean(false)"
            @change="timeChange"
            :disabled="!Boolean(this.equipId.length)"
          ></el-date-picker>
        </div>
      </div>
      <div class="detail">
        <div class="voltage">
          <div class="inner">
            <div>
              <phase_line type="U" :line_obj="line_obj_voltage"></phase_line>
            </div>
            <div>
              <phase_line1 :line_obj="line_obj_voltage1"></phase_line1>
            </div>
          </div>
        </div>
        <div class="electric">
          <div class="inner">
            <div>
              <phase_line type="I" :line_obj="line_obj_electric"></phase_line>
            </div>
            <div>
              <phase_line1 :line_obj="line_obj_electric1"></phase_line1>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Mybreadcrumb from "../subcomponents/Mybreadcrumb";
import phase_line from "../subcomponents/phase_analysis_line";
import phase_line1 from "../subcomponents/phase_analysis_line1";
import { formatPhaseData } from "../../utils/index";
export default {
  components: {
    Mybreadcrumb,
    phase_line, //上图表
    phase_line1 //下图表
  },
  data() {
    return {
      pickerOptions_day: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() || time.getTime() < new Date(2019, 9, 1)
          );
        }
      }, //时间限制
      isResouceShow: 1, //控制联级是否重新渲染
      equipId: [], //选中设备的联级id集合,取下标1
      daySelect: new Date(),
      defaultProps: {
        children: "children",
        label: "name",
        value: "id"
      },
      group_equip_options: [], //设备选择联级数据
      temp_options: [], //临时存储联级数据
      line_obj_voltage: [], //电压不平衡度数据
      line_obj_voltage1: [], //电压三相不平衡度
      line_obj_electric: [], //电流不平衡度数据
      line_obj_electric1: [] //电流三相不平衡数据
    };
  },
  computed: {
    siteId() {
      return this.$store.state.site.siteId;
    }
  },
  watch: {
    siteId() {
      this.getAllGroup();
    }
  },
  created() {
    this.line_obj = {
      name: ["a", "b", "c"],
      xData: ["1", "2", "3", "4", "5", "6"],
      data: [
        {
          name: "a",
          data: [2, 89, 45, 65, 48, 322],
          type: "line"
        },
        {
          name: "b",
          data: [65, 57, 13, 0],
          type: "line"
        },
        {
          name: "c",
          data: [],
          type: "line"
        }
      ]
    };
    this.getAllGroup();
  },
  methods: {
    // 计算时间格式
    getTime() {
      var year = this.daySelect.getFullYear();
      var month = this.daySelect.getMonth() + 1;
      var day = this.daySelect.getDate();
      return "" + year + (month > 9 ? month : "0" + month) + (day > 9 ? day : '0' + day);
    },
    // 查询站点下所有监控分组
    getAllGroup() {
      this.temp_options = [];
      this.equipId = [];
      if(!this.$store.state.site.siteId) {
        this.getLineVoltage();
              this.getLineElectric();
        return 
      }
      this.$http
        .get("equipment/classify/findAllByRoom", {
          params: {
            roomId: this.$store.state.site.siteId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.temp_options = res.data.data;
            // 分组集合数组
            var str = [];
            if (this.temp_options.length > 0) {
              str = this.temp_options.map(item => {
                return item.id;
              });
              this.getEquipByGroup(str);
            } else {
              this.isResouceShow++;
              this.group_equip_options = [];
              this.getLineVoltage();
              this.getLineElectric();
            }
          }
        });
    },
    // 根据分组集合查设备
    getEquipByGroup(str) {
      this.$http
        .get("equipment/classifyEquipment/findAllByClassify", {
          params: {
            classifyIds: str.join(",")
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            var res1 = res.data.data;
            var index = 0;
            for (var i = 0; i < this.temp_options.length; i++) {
              if (res1[i].ClassifyEquipmentVO.length) {
                for (var j = 0; j < res1[i].ClassifyEquipmentVO.length; j++) {
                  // id替换成设备id，用于最后取值(负值防止联级数据联级id冲突报错)
                  res1[i].ClassifyEquipmentVO[j].id = -res1[i]
                    .ClassifyEquipmentVO[j].equipmentId;
                  index++;
                  // 默认选中有设备的第一个分组的第一个设备
                  if (index === 1) {
                    var arr = [
                      this.temp_options[i].id,
                      res1[i].ClassifyEquipmentVO[j].id
                    ];
                    this.equipId = arr;
                    this.getLineVoltage();
                    this.getLineElectric();
                  }
                }
                this.temp_options[i].children = res1[i].ClassifyEquipmentVO;
              }
            }
            // 临时数据赋值
            this.group_equip_options = this.temp_options;
          }
        });
    },
    // 选中设备修改
    equipChange() {
      this.getLineVoltage();
      this.getLineElectric();
    },
    // 时间修改
    timeChange() {
      this.getLineVoltage();
      this.getLineElectric();
    },
    getLineVoltage() {
      if (this.equipId.length < 2) {
        var arr = formatPhaseData([], "u");
        this.line_obj_voltage = arr[0];
        this.line_obj_voltage1 = arr[1];
        return;
      }
      var time = this.getTime();
      this.$http
        .get("equipment/powerQuality/getPastTriphaseInfo", {
          params: {
            equipmentId: Math.abs(this.equipId[1]),
            date: time,
            type: "U"
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            var arr = formatPhaseData(res.data.data, "u");
            this.line_obj_voltage = arr[0];
            this.line_obj_voltage1 = arr[1];
          }
        });
    },
    getLineElectric() {
      if (this.equipId.length < 2) {
        var arr = formatPhaseData([], "i");
        this.line_obj_electric = arr[0];
        this.line_obj_electric1 = arr[1];
        return;
      }
      var time = this.getTime();
      this.$http
        .get("equipment/powerQuality/getPastTriphaseInfo", {
          params: {
            equipmentId: Math.abs(this.equipId[1]),
            // date: "day_20200406",
            date: time,
            type: "I"
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            var arr = formatPhaseData(res.data.data, "i");
            this.line_obj_electric = arr[0];
            this.line_obj_electric1 = arr[1];
          }
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/index.less";
.phase {
  height: 100%;
  color: #fff;
  @dis-flex();
  @flex-c();
  .content {
    @flex-1();
    overflow-y: auto;
    overflow-x: hidden;
    @dis-flex();
    @flex-c();
    .select {
      @dis-flex();
      justify-content: left;
      margin-bottom: 8px;
      box-sizing: border-box;
      .equip {
        margin-right: 50px;
      }
    }
    .detail {
      @dis-flex();
      @flex-1();
      .voltage {
        background-color: @content-bgc;
        margin-right: 16px;
        padding: 20px;
        box-sizing: border-box;
        // @flex-1();
        width: calc(50% - 8px);
        border: 1px solid gray;
        height: 100%;
        min-height: 600px;
        .inner {
          height: 100%;
          @dis-flex();
          @flex-c();
          div {
            @flex-1();
          }
        }
      }
      .electric {
        background-color: @content-bgc;
        padding: 20px;
        box-sizing: border-box;
        // @flex-1();
        width: calc(50% - 8px);
        border: 1px solid gray;
        height: 100%;
        min-height: 600px;
        .inner {
          height: 100%;
          @dis-flex();
          @flex-c();
          div {
            @flex-1();
          }
        }
      }
    }
  }
}
</style>