<template>
  <div class="real-time">
    <Mybreadcrumb level1="电能质量" level2="实时监测" />
    <div class="content">
      <div class="equip">
        <span>设备：</span>
        <el-cascader
          v-model="equipId"
          :props="defaultProps"
          :options="group_equip_options"
          @change="equipChange"
          :key="isResouceShow"
          :disabled="volLoading || eleLoading"
        ></el-cascader>
      </div>
      <div class="top">
        <div class="t-left">
          <div class="title">
            <b>三相不平衡</b>
          </div>
          <div class="t-l-voltage">
            <div class="v-left">
              <div class="circle1 circle"></div>
              <div class="circle2 circle"></div>
              <div class="circle3 circle"></div>
              <div class="line-area">
                <div class="line-a">
                  <div class="line"></div>
                </div>
                <div
                  class="line-b"
                  :style="{transform: 'rotate(' + three_phase_v_obj.aphaseAngle + 'deg)'}"
                >
                  <div class="line"></div>
                </div>
                <div
                  class="line-c"
                  :style="{transform: 'rotate(' +( parseInt(three_phase_v_obj.aphaseAngle) + parseInt(three_phase_v_obj.bphaseAngle) ) + 'deg)'}"
                >
                  <div class="line"></div>
                </div>
              </div>
            </div>
            <div class="v-right">
              <div class="blue-box">
                <span>电压三相不平衡度{{three_phase_v_obj.unbalancedness}}%</span>
              </div>
              <div class="title">
                <span class="s-left"></span>
                <p>幅值</p>
                <p>相角</p>
              </div>
              <div class="single">
                <span class="s-left a">A</span>
                <p>{{three_phase_v_obj.avalue}}V</p>
                <p>{{three_phase_v_obj.aphaseAngle}}</p>
              </div>
              <div class="single">
                <div class="s-left b">
                  B
                </div>
                <p>{{three_phase_v_obj.bvalue}}V</p>
                <p>{{three_phase_v_obj.bphaseAngle}}</p>
              </div>
              <div class="single">
                <div class="s-left c">
                  C
                </div>
                <p>{{three_phase_v_obj.cvalue}}V</p>
                <p>{{three_phase_v_obj.cphaseAngle}}</p>
              </div>
            </div>
          </div>
          <div class="t-l-electric">
            <div class="v-left">
              <div class="circle1 circle"></div>
              <div class="circle2 circle"></div>
              <div class="circle3 circle"></div>
              <div class="line-area">
                <div class="line-a">
                  <div class="line"></div>
                </div>
                <div
                  class="line-b"
                  :style="{transform: 'rotate(' + three_phase_e_obj.aphaseAngle + 'deg)'}"
                >
                  <div class="line"></div>
                </div>
                <div
                  class="line-c"
                  :style="{transform: 'rotate(' +( parseInt(three_phase_e_obj.aphaseAngle) + parseInt(three_phase_e_obj.bphaseAngle) ) + 'deg)'}"
                >
                  <div class="line"></div>
                </div>
              </div>
            </div>
            <div class="v-right">
              <div class="blue-box">
                <span>电流三相不平衡度{{three_phase_e_obj.unbalancedness}}%</span>
              </div>
              <div class="title">
                <span class="s-left"></span>
                <p>幅值</p>
                <p>相角</p>
              </div>
              <div class="single">
                <span class="s-left a">A</span>
                <p>{{three_phase_e_obj.avalue}}A</p>
                <p>{{three_phase_e_obj.aphaseAngle}}</p>
              </div>
              <div class="single">
                <span class="s-left b">B</span>
                <p>{{three_phase_e_obj.bvalue}}A</p>
                <p>{{three_phase_e_obj.bphaseAngle}}</p>
              </div>
              <div class="single">
                <span class="s-left c">C</span>
                <p>{{three_phase_e_obj.cvalue}}A</p>
                <p>{{three_phase_e_obj.cphaseAngle}}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="t-right">
          <div class="title">
            <b>谐波</b>
          </div>
          <el-radio-group v-model="dataType" size="mini" style="margin: 4px;">
            <el-radio-button label="value">有效值</el-radio-button>
            <el-radio-button label="percent">含量</el-radio-button>
          </el-radio-group>
          <div class="t-r-voltage" v-loading="volLoading">
            <Gradient_bar :harmonicContentVoltage="harmonicContentVoltage"></Gradient_bar>
          </div>
          <div class="t-r-electric"  v-loading="eleLoading">
            <Gradient_bar :harmonicContentElectric="harmonicContentElectric"></Gradient_bar>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="b-center">
          <div class="title">频率</div>
          <div class="b-c-content">
            <div class="text">
              <div class="frequency">
                <div>当前频率</div>
                <div>{{frequencyObj.frequency}}Hz</div>
              </div>
              <div class="deviation">
                <div>频率偏差</div>
                <div>{{frequencyObj.deviation}}%</div>
              </div>
            </div>
            <div class="pic">
              <div class="base">
                <div class="bac">
                  <div class="half-block"></div>
                  <div class="block"></div>
                  <div class="block"></div>
                  <div class="block"></div>
                  <div class="block"></div>
                  <div class="half-block"></div>
                </div>
                <div class="point-block" :style="{left: deviation_position}">
                  <div class="point-area">
                    <div class="point"></div>
                  </div>
                </div>
              </div>
              <div class="scale">
                <div>48</div>
                <div>49</div>
                <div>50</div>
                <div>51</div>
                <div>52</div>
              </div>
            </div>
          </div>
        </div>
        <div class="b-left">
          <div class="title">电压</div>
          <div class="all-voltage">
            <div class="sin-voltage">
              <div class="attr">Ua</div>
              <div class="line">
                <el-progress
                  :text-inside="true"
                  class="pro"
                  :show-text="false"
                  :stroke-width="6"
                  :color="customColor('a')"
                  :percentage="three_phase_v_obj.avalue ? three_phase_v_obj.avalue / 2.8 : 0"
                ></el-progress>
              </div>
              <div
                class="value"
              >{{three_phase_v_obj.avalue ? three_phase_v_obj.avalue : 0}}&nbsp;(V)</div>
            </div>
            <div class="sin-voltage">
              <div class="attr">Ub</div>
              <div class="line">
                <el-progress
                  :text-inside="true"
                  class="pro"
                  :show-text="false"
                  :stroke-width="6"
                  :color="customColor('b')"
                  :percentage="three_phase_v_obj.bvalue ? three_phase_v_obj.bvalue / 2.8 : 0"
                ></el-progress>
              </div>
              <div
                class="value"
              >{{three_phase_v_obj.bvalue ? three_phase_v_obj.bvalue : 0}}&nbsp;(V)</div>
            </div>
            <div class="sin-voltage">
              <div class="attr">Uc</div>
              <div class="line">
                <el-progress
                  :text-inside="true"
                  class="pro"
                  :show-text="false"
                  :stroke-width="6"
                  :color="customColor('c')"
                  :percentage="three_phase_v_obj.cvalue ? three_phase_v_obj.cvalue / 2.8 : 0"
                ></el-progress>
              </div>
              <div
                class="value"
              >{{three_phase_v_obj.cvalue ? three_phase_v_obj.cvalue : 0}}&nbsp;(V)</div>
            </div>
          </div>
        </div>
        
        <div class="b-right">
          <div class="title">有功功率</div>
          <div class="all-voltage">
            <div class="sin-voltage">
              <div class="attr">A</div>
              <div class="line">
                <el-progress
                  :text-inside="true"
                  class="pro"
                  :show-text="false"
                  :stroke-width="6"
                  :color="customColor('a')"
                  :percentage="powerObj.activepowerA ? powerObj.activepowerA / 2.8 : 0"
                ></el-progress>
              </div>
              <div class="value">{{powerObj.activepowerA}}(kW)</div>
            </div>
            <div class="sin-voltage">
              <div class="attr">B</div>
              <div class="line">
                <el-progress
                  :text-inside="true"
                  class="pro"
                  :show-text="false"
                  :stroke-width="6"
                  :color="customColor('b')"
                  :percentage="powerObj.activepowerB ? powerObj.activepowerB / 2.8 : 0"
                ></el-progress>
              </div>
              <div class="value">{{powerObj.activepowerB}}(kW)</div>
            </div>
            <div class="sin-voltage">
              <div class="attr">C</div>
              <div class="line">
                <el-progress
                  :text-inside="true"
                  class="pro"
                  :show-text="false"
                  :stroke-width="6"
                  :color="customColor('c')"
                  :percentage="powerObj.activepowerC ? powerObj.activepowerC / 2.8 : 0"
                ></el-progress>
              </div>
              <div class="value">{{powerObj.activepowerC}}(kW)</div>
            </div>
            <div class="sin-voltage">
              <div class="attr">合</div>
              <div class="line">
                <el-progress
                  :text-inside="true"
                  class="pro"
                  :show-text="false"
                  :stroke-width="6"
                  :color="customColor('d')"
                  :percentage="powerObj.activepower ? powerObj.activepower / 2.8 : 0"
                ></el-progress>
              </div>
              <div class="value">{{powerObj.activepower}}(kW)</div>
            </div>
          </div>
        </div>
        <div class="b-right-r">
          <div class="title">无功功率</div>
          <div class="all-voltage">
            <div class="sin-voltage">
              <div class="attr">A</div>
              <div class="line">
                <el-progress
                  :text-inside="true"
                  class="pro"
                  :show-text="false"
                  :stroke-width="6"
                  :color="customColor('a')"
                  :percentage="powerObj.reactivepowerA ? powerObj.reactivepowerA / 2.8 : 0"
                ></el-progress>
              </div>
              <div class="value">{{powerObj.reactivepowerA}}(kVar)</div>
            </div>
            <div class="sin-voltage">
              <div class="attr">B</div>
              <div class="line">
                <el-progress
                  :text-inside="true"
                  class="pro"
                  :show-text="false"
                  :stroke-width="6"
                  :color="customColor('b')"
                  :percentage="powerObj.reactivepowerB ? powerObj.reactivepowerB / 2.8 : 0"
                ></el-progress>
              </div>
              <div class="value">{{powerObj.reactivepowerB}}(kVar)</div>
            </div>
            <div class="sin-voltage">
              <div class="attr">C</div>
              <div class="line">
                <el-progress
                  :text-inside="true"
                  class="pro"
                  :show-text="false"
                  :stroke-width="6"
                  :color="customColor('c')"
                  :percentage="powerObj.reactivepowerC ? powerObj.reactivepowerC / 2.8 : 0"
                ></el-progress>
              </div>
              <div class="value">{{powerObj.reactivepowerC}}(kVar)</div>
            </div>
            <div class="sin-voltage">
              <div class="attr">合</div>
              <div class="line">
                <el-progress
                  :text-inside="true"
                  class="pro"
                  :show-text="false"
                  :stroke-width="6"
                  :color="customColor('d')"
                  :percentage="powerObj.reactivepower ? powerObj.reactivepower / 2.8 : 0"
                ></el-progress>
              </div>
              <div class="value">{{powerObj.reactivepower}}(kVar)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Mybreadcrumb from "../subcomponents/Mybreadcrumb";
import Gradient_bar from "../subcomponents/gradient_bar";
export default {
  components: {
    Mybreadcrumb,
    Gradient_bar
  },
  data() {
    return {
      isResouceShow: 1, //联级显示控制,通过++改变key值
      defaultProps: {
        children: "children",
        label: "name",
        value: "id"
      },
      dataType: "value", //谐波类型（有效值、含量）
      group_equip_options: [], //设备选择联级数据
      temp_options: [], //临时存储联级数据
      equipId: "", //选中设备的联级id集合，equipid取下标1
      //三相电压对象值
      three_phase_v_obj: {
        avalue: 0,
        bvalue: 0,
        cvalue: 0,
        unbalancedness: 0
      },
      //三相电流对象值
      three_phase_e_obj: {
        avalue: 0,
        bvalue: 0,
        cvalue: 0,
        unbalancedness: 0
      },
      harmonicContentVoltage: [], //有效值--电压谐波
      harmonicContentElectric: [], //有效值--电流谐波
      // 频率对象
      frequencyObj: {
        deviation: "",
        frequency: ""
      },
      deviation_position: "40%", //频率的偏移百分比
      powerObj: {}, //有功、无功功率
      interval: null, //定时器
      volLoading: false,      //电压谐波加载中
      eleLoading: false,        //电流谐波加载中
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
    this.getAllGroup();
  },
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  methods: {
    // 返回条形颜色
    customColor(data) {
      if (data === "a") {
        return "rgb(211, 212, 104)";
      } else if (data === "b") {
        return "rgb(78, 212, 183)";
      } else if (data === "c") {
        return "rgb(247, 96, 77)";
      } else if (data === "d") {
        return "rgb(64, 158, 255)";
      } else if (data === "e") {
        return "pink";
      } else if (data === "f") {
        return "orange";
      } else if (data === "g") {
        return "gray";
      } else if (data === "h") {
        return "green";
      }
    },
    // 设备选中修改
    equipChange() {
      this.harmonicContentElectric = [];
      this.harmonicContentVoltage = [];
      this.flashData();
    },
    flashData() {
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.interval = setInterval(() => {
        this.getTriphaseInfo("U");
        this.getTriphaseInfo("I");
        this.getHarmonicContentByVoltage();
        this.getHarmonicContentByElectric();
        this.getFrequency();
        this.getPower();
      }, 60000);
      this.getTriphaseInfo("U");
      this.getTriphaseInfo("I");
      this.getHarmonicContentByVoltage();
      this.getHarmonicContentByElectric();
      this.getFrequency();
      this.getPower();
    },
    // 查询站点下所有监控分组
    getAllGroup() {
      if (!this.$store.state.site.siteId) {
        this.getHarmonicContentByVoltage();
        this.getHarmonicContentByElectric();
        return;
      }
      this.temp_options = [];
      // this.group_equip_options = [];
      this.equipId = [];
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
              this.isResouceShow++; //改变元素key值，重新渲染
              this.equipId = [];
              this.group_equip_options = [];
              this.flashData();
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
                    this.flashData();
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
    // 查询指定设备电压三相不平衡
    getTriphaseInfo(type) {
      if (this.equipId.length < 2) {
        this.three_phase_v_obj = {
          avalue: 0,
          bvalue: 0,
          cvalue: 0,
          unbalancedness: 0
        };
        this.three_phase_e_obj = {
          avalue: 0,
          bvalue: 0,
          cvalue: 0,
          unbalancedness: 0
        };
        return;
      }
      this.$http
        .get("equipment/powerQuality/getTriphaseInfo", {
          params: {
            equipmentId: Math.abs(this.equipId[1]),
            type: type
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            if (type === "U") {
              this.three_phase_v_obj = res.data.data;
              // this.three_phase_v_obj = {
              //   unbalancedness: 100,
              //   avalue: 12,
              //   bvalue: 45,
              //   cvalue: 65,
              // }
            } else {
              this.three_phase_e_obj = res.data.data;
            }

            // 模拟数据
            // this.three_phase_v_obj = {
            //   avalue: 1,
            //   bvalue: 299.986,
            //   cvalue: 40
            // };
          }
        });
    },
    // 查看指定设备谐波含量(电压)
    getHarmonicContentByVoltage() {
      this.volLoading = true;
      if (this.equipId.length < 2) {
        var empty = [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ];
        setTimeout(() => {
          this.harmonicContentVoltage = [
            {
              name: "A",
              type: "bar",
              data: empty
            },
            {
              name: "B",
              type: "bar",
              data: empty
            },
            {
              name: "C",
              type: "bar",
              data: empty
            }
          ];
        }, 50);

        return;
      }
      this.$http
        .get("equipment/powerQuality/getHarmonicInfo", {
          params: {
            equipmentId: Math.abs(this.equipId[1]),
            type: "U"
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.harmonicContentVoltage = res.data.data;
            this.volLoading = false;
            // this.harmonicContentVoltage = [
            //   {
            //     name: "A相电压谐波含量",
            //     type: "bar",
            //     data: [320, null, 301, 334, 390]
            //   },
            //   {
            //     name: "B相电压谐波含量",
            //     type: "bar",
            //     data: [220, 182, 191, null, 290]
            //   },
            //   {
            //     name: "C相电压谐波含量",
            //     type: "bar",
            //     data: [150, 232, 201, 154, 190]
            //   }
            // ];
          }
        }).catch( error => {
          this.volLoading = false;
        })
    },
    // 查看指定设备谐波含量(电流)
    getHarmonicContentByElectric() {
      this.eleLoading = true;
      if (this.equipId.length < 2) {
        // this.harmonicContentElectric = [];
        var empty = [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ];
        setTimeout(() => {
          this.harmonicContentElectric = [
            {
              name: "A",
              type: "bar",
              data: empty
            },
            {
              name: "B",
              type: "bar",
              data: empty
            },
            {
              name: "C",
              type: "bar",
              data: empty
            }
          ];
        }, 50);

        // this.$forceUpdate()
        // this.harmonicContentElectric = [
        //       {
        //         name: "A相电压谐波含量",
        //         type: "bar",
        //         data: [320, null, 301, 334, 390]
        //       },
        //       {
        //         name: "B相电压谐波含量",
        //         type: "bar",
        //         data: [220, 182, 191, null, 290]
        //       },
        //       {
        //         name: "C相电压谐波含量",
        //         type: "bar",
        //         data: [150, 232, 201, 154, 190]
        //       }
        //     ];
        return;
      }
      this.$http
        .get("equipment/powerQuality/getHarmonicInfo", {
          params: {
            equipmentId: Math.abs(this.equipId[1]),
            type: "I"
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.harmonicContentElectric = res.data.data;
            this.eleLoading = false;
            // this.harmonicContentElectric = [
            //   {
            //     name: "A相电压谐波含量",
            //     type: "bar",
            //     data: [320, null, 301, 334, 390]
            //   },
            //   {
            //     name: "B相电压谐波含量",
            //     type: "bar",
            //     data: [220, 182, 191, null, 290]
            //   },
            //   {
            //     name: "C相电压谐波含量",
            //     type: "bar",
            //     data: [150, 232, 201, 154, 190]
            //   }
            // ];
          }
        }).catch( error => {
          this.eleLoading = false;
        })
    },
    // 查看频率
    getFrequency() {
      if (this.equipId.length < 2) {
        this.frequencyObj = {
          frequency: 0,
          deviation: 0
        };
        return;
      }
      this.$http
        .get("equipment/powerQuality/getFrequency", {
          params: {
            equipmentId: Math.abs(this.equipId[1]),
            type: "U"
          }
        })
        .then(res => {
          this.frequencyObj = res.data.data;
          // this.frequencyObj = {
          //   frequency: 50.2,
          //   deviation: 0.06,
          // }
          var per = +this.deviation_position.split("%")[0];
          // 计算偏移百分比
          this.deviation_position =
            per + (this.frequencyObj.frequency - 50) * 20 + "%";
        });
    },
    // 查看功率
    getPower() {
      if (this.equipId.length < 2) {
        this.powerObj = {};
        return;
      }
      this.$http
        .get("equipment/powerQuality/getPower", {
          params: {
            equipmentId: Math.abs(this.equipId[1])
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.powerObj = res.data.data;
          }
          this.powerObj = {
            // reactivepowerA: "6.00",
            // reactivepowerC: "0.00",
            // reactivepowerB: "9.00",
            // activepowerC: "0.00",
            // activepower: "45.00",
            // reactivepower: "0.00",
            // activepowerA: "58.00",
            // activepowerB: "0.00"
          };
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/index.less";
.real-time {
  box-sizing: border-box;
  height: 100%;
  // overflow: auto;
  color: #fff;
  @dis-flex();
  @flex-c();
  .content {
    @flex-1();
    @dis-flex();
    @flex-c();
    height: 0;
    overflow: auto;
    .equip {
      background-color: rgba(67, 92, 112);
      margin-bottom: 6px;
      padding: 6px;
      border: 1px solid gray;
    }
    .top {
      @flex-1();
      @dis-flex();
      min-height: 440px;
      // 三相不平衡
      .t-left {
        width: 35%;
        max-width: 440px;
        min-width: 366px;
        height: 100%;
        border: 1px solid gray;
        box-sizing: border-box;
        background-color: rgba(67, 92, 112);
        @dis-flex();
        @flex-c();
        .title {
          border-bottom: 1px solid gray;
          padding: 10px 20px;
          background-color: rgb(84, 101, 125);
        }
        // 三相不平衡电压
        .t-l-voltage {
          @flex-1();
          box-sizing: border-box;
          border-bottom: 1px solid gray;
          @dis-flex();
          align-items: center;
          .v-left {
            width: 45%;
            height: 0;
            padding-bottom: 45%;
            // background-color: pink;
            position: relative;
            .circle {
              border: 1px dashed gray;
              position: absolute;
              margin: auto;
              left: 0;
              right: 0;
              top: 0;
              bottom: 0;
            }
            .circle1 {
              width: 90%;
              height: 90%;
              border-radius: 50%;
            }
            .circle2 {
              width: 70%;
              height: 70%;
              border-radius: 50%;
            }
            .circle3 {
              width: 50%;
              height: 50%;
              border-radius: 50%;
            }
            .line-area {
              width: 100%;
              height: 100%;
              position: absolute;
              .line-a {
                height: 100%;
                width: 100%;
                // transform: rotate(30deg);
                // position: relative;
                position: absolute;
                left: 0;
                top: 0;
                .line {
                  width: 50%;
                  height: 2px;
                  background-color: @a-color;
                  position: absolute;
                  left: 50%;
                  top: calc(50% - 1px);
                }
              }
              .line-b {
                height: 100%;
                width: 100%;
                transform: rotate(120deg);
                position: absolute;
                .line {
                  width: 50%;
                  height: 2px;
                  background-color: @b-color;
                  position: absolute;
                  left: 50%;
                  top: calc(50% - 1px);
                }
              }
              .line-c {
                height: 100%;
                width: 100%;
                transform: rotate(240deg);
                position: absolute;
                .line {
                  width: 50%;
                  height: 2px;
                  background-color: @c-color;
                  position: absolute;
                  left: 50%;
                  top: calc(50% - 1px);
                }
              }
            }
          }
          .v-right {
            @flex-1();
            height: 100%;
            padding: 10px 6px;
            box-sizing: border-box;
            @dis-flex();
            @flex-c();
            justify-content: space-between;
            .blue-box {
              text-align: center;
              border: 1px solid rgb(78, 212, 183);
              padding: 4px 0;
              border-radius: 6px;
              margin-bottom: 8px;
              // @flex-1();
            }
            .title {
              @dis-flex();
              display: flex;
              justify-content: space-between;
              padding: 4px;
              margin-bottom: 6px;
              box-sizing: border-box;
              p {
                @flex-1();
                text-align: center;
              }
              .s-left {
                width: 30px;
              }
            }
            .single {
              // @flex-1();
              @dis-flex();
              display: flex;
              justify-content: space-between;
              background-color: rgb(78, 101, 122);
              padding: 2px 4px;
              margin-bottom: 6px;
              box-sizing: border-box;
              .a {
                color: @a-color;
              }
              .b {
                color: @b-color;
              }
              .c {
                color: @c-color;
              }

              p {
                @flex-1();
                text-align: center;
              }
              .s-left {
                width: 30px;
              }
            }
          }
        }
        // 三相不平衡电流
        .t-l-electric {
          @flex-1();
          box-sizing: border-box;
          border-bottom: 1px solid gray;
          @dis-flex();
          align-items: center;
          .v-left {
            width: 45%;
            height: 0;
            padding-bottom: 45%;
            // background-color: pink;
            position: relative;
            .circle {
              border: 1px dashed gray;
              position: absolute;
              margin: auto;
              left: 0;
              right: 0;
              top: 0;
              bottom: 0;
            }
            .circle1 {
              width: 90%;
              height: 90%;
              border-radius: 50%;
            }
            .circle2 {
              width: 70%;
              height: 70%;
              border-radius: 50%;
            }
            .circle3 {
              width: 50%;
              height: 50%;
              border-radius: 50%;
            }
            .line-area {
              width: 100%;
              height: 100%;
              position: absolute;
              .line-a {
                height: 100%;
                width: 100%;
                // transform: rotate(30deg);
                // position: relative;
                position: absolute;
                left: 0;
                top: 0;
                .line {
                  width: 50%;
                  height: 2px;
                  background-color: @a-color;
                  position: absolute;
                  left: 50%;
                  top: calc(50% - 1px);
                }
              }
              .line-b {
                height: 100%;
                width: 100%;
                transform: rotate(120deg);
                position: absolute;
                .line {
                  width: 50%;
                  height: 2px;
                  background-color: @b-color;
                  position: absolute;
                  left: 50%;
                  top: calc(50% - 1px);
                }
              }
              .line-c {
                height: 100%;
                width: 100%;
                transform: rotate(240deg);
                position: absolute;
                .line {
                  width: 50%;
                  height: 2px;
                  background-color: @c-color;
                  position: absolute;
                  left: 50%;
                  top: calc(50% - 1px);
                }
              }
            }
          }
          .v-right {
            @flex-1();
            height: 100%;
            padding: 10px 6px;
            box-sizing: border-box;
            @dis-flex();
            @flex-c();
            justify-content: space-between;
            .blue-box {
              text-align: center;
              border: 1px solid rgb(78, 212, 183);
              padding: 4px 0;
              border-radius: 6px;
              margin-bottom: 8px;
              // @flex-1();
            }
            .title {
              @dis-flex();
              display: flex;
              justify-content: space-between;
              padding: 4px;
              margin-bottom: 6px;
              box-sizing: border-box;
              p {
                @flex-1();
                text-align: center;
              }
              .s-left {
                width: 30px;
              }
            }
            .single {
              // @flex-1();
              @dis-flex();
              display: flex;
              justify-content: space-between;
              background-color: rgb(78, 101, 122);
              padding: 2px 4px;
              margin-bottom: 6px;
              box-sizing: border-box;
              .a {
                color: @a-color;
              }
              .b {
                color: @b-color;
              }
              .c {
                color: @c-color;
              }

              p {
                @flex-1();
                text-align: center;
              }
              .s-left {
                width: 30px;
              }
            }
            // @flex-1();
            // margin: 0 6px;
            // .blue-box {
            //   background-color: skyblue;
            //   height: 52px;
            //   width: 100%;
            //   text-align: center;
            //   // margin: 0 6px;
            //   // box-sizing: border-box;
            // }
            // .single {
            //   @dis-flex();
            //   justify-content: space-between;
            //   padding: 0 4px;
            //   .a {
            //     color: red;
            //   }
            //   .b {
            //     color: green;
            //   }
            //   .c {
            //     color: yellow;
            //   }
            //   .s-right {
            //     min-width: 120px;
            //   }
            // }
          }
        }
      }
      .t-right {
        @flex-1();
        margin-left: 10px;
        border: 1px solid gray;
        background-color: rgba(67, 92, 112);
        @dis-flex();
        @flex-c();
        .title {
          border-bottom: 1px solid gray;
          padding: 10px 20px;
          background-color: rgb(84, 101, 125);
        }
        .t-r-voltage {
          @flex-1();
          box-sizing: border-box;
          border-bottom: 1px solid gray;
          overflow: hidden;
        }
        .t-r-electric {
          @flex-1();
          overflow: hidden;
        }
      }
    }
    .bottom {
      margin-top: 10px;
      height: 250px;
      @dis-flex();
      .title {
        border-bottom: 1px solid gray;
        padding: 10px 20px;
      }
      .b-left {
        width: 35%;
        max-width: 440px;
        background-color: rgba(67, 92, 112);
        border: 1px solid gray;
        box-sizing: border-box;
        margin-right: 10px;
        @dis-flex();
        @flex-c();
        .title {
          background-color: rgb(84, 101, 125);
        }
        // justify-content: space-around;
        .all-voltage {
          @flex-1();
          @dis-flex();
          @flex-c();
          // @flex-pc();
          justify-content: space-around;
          .sin-voltage {
            text-align: center;
            @dis-flex();
            align-items: center;
            width: 100%;
            .line {
              @flex-1();
            }
            .attr {
              width: 60px;
            }
            .value {
              width: 120px;
            }
          }
        }
      }
      .b-center {
        margin-right: 10px;
        // @flex-1();
        width: 25%;
        @dis-flex();
        @flex-c();
        background-color: rgba(67, 92, 112);
        border: 1px solid gray;
        .title {
          background-color: rgb(84, 101, 125);
        }
        .b-c-content {
          @flex-1();
          @dis-flex();
          @flex-c();
          justify-content: center;
          align-items: center;
          .text {
            width: 100%;
            @dis-flex();
            display: flex;
            justify-content: space-around;
            .frequency {
              margin-bottom: 6px;
              // padding: 0 20px;
              div {
                padding: 0 20px;
                text-align: center;
              }
              div:nth-child(2) {
                background-color: rgb(78, 101, 122);
                border-top: 1px solid @a-color;
                margin-top: 2px;
                color: @a-color;
              }
            }
            .deviation {
              margin-bottom: 6px;
              // padding: 0 20px;
              div {
                padding: 0 20px;
                text-align: center;
              }
              div:nth-child(2) {
                background-color: rgb(78, 101, 122);
                border-top: 1px solid @b-color;
                margin-top: 2px;
                color: @b-color;
              }
            }
          }
          .pic {
            height: 100px;
            width: 80%;
            @dis-flex();
            @flex-c();
            margin-top: 6px;
            .base {
              height: 60px;
              position: relative;
              overflow-x: hidden;
              .bac {
                padding-top: 10px;
                height: 100%;
                box-sizing: border-box;
                @dis-flex();
                .half-block {
                  width: 10%;
                  background-color: gray;
                  box-sizing: border-box;
                  border-right: 1px dashed yellow;
                }
                .half-block:last-child {
                  border: none;
                }
                .block {
                  @flex-1();
                  background-color: gray;
                  box-sizing: border-box;
                  border-right: 1px dashed yellow;
                }
              }
              .point-block {
                position: absolute;
                top: 10px;
                // left: 10px;
                width: 20%;
                height: 50px;
                background-color: rgba(37, 215, 162, 0.3);
                background-image: -webkit-gradient(
                  linear,
                  0 0,
                  100% 100%,
                  color-stop(0.25, hsla(0, 0%, 100%, 0.2)),
                  color-stop(0.25, transparent),
                  color-stop(0.5, transparent),
                  color-stop(0.5, hsla(0, 0%, 100%, 0.2)),
                  color-stop(0.75, hsla(0, 0%, 100%, 0.2)),
                  color-stop(0.75, transparent),
                  to(transparent)
                );
                .point-area {
                  height: 100%;
                  width: 100%;
                  position: relative;
                  .point {
                    height: 60px;
                    width: 2px;
                    background-color: red;
                    position: absolute;
                    bottom: 0;
                    left: calc(50% - 1px);
                  }
                }
              }
            }
            .scale {
              @flex-1();
              height: 0;
              @dis-flex();
              display: flex;
              justify-content: space-around;
              align-items: center;
            }
          }
        }
      }
      .b-right {
        @flex-1();
        background-color: rgba(67, 92, 112);
        border: 1px solid gray;
        box-sizing: border-box;
        @dis-flex();
        @flex-c();
        .title {
          background-color: rgb(84, 101, 125);
        }
        .all-voltage {
          font-size: 14px;
          @flex-1();
          @dis-flex();
          @flex-c();
          justify-content: space-around;
          .sin-voltage {
            text-align: center;
            @dis-flex();
            align-items: center;
            width: 100%;
            .line {
              @flex-1();
            }
            .attr {
              width: 40px;
            }
            .value {
              width: 90px;
            }
          }
        }
      }
      .b-right-r {
        @flex-1();
        background-color: rgba(67, 92, 112);
        border: 1px solid gray;
        border-left: none;
        box-sizing: border-box;
        @dis-flex();
        @flex-c();
        .title {
          background-color: rgb(84, 101, 125);
        }
        .all-voltage {
          font-size: 14px;
          @flex-1();
          @dis-flex();
          @flex-c();
          justify-content: space-around;
          .sin-voltage {
            text-align: center;
            @dis-flex();
            align-items: center;
            width: 100%;
            .line {
              @flex-1();
            }
            .attr {
              width: 40px;
            }
            .value {
              width: 90px;
            }
          }
        }
      }
    }
  }
  .pro /deep/ .el-progress-bar__outer {
    background-color: transparent!important;
  }
}
</style>