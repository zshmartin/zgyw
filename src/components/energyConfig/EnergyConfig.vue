<template>
  <div class="energy-config">
    <MyBreadcrumb level1="能源管理" level2="能源参数设置"></MyBreadcrumb>
    <div class="energy-all scroll">
      <div class="energy-content">
        <!-- 左边筛选栏 -->
        <div class="select">
          <div class="filter">
            <div style="height: 20px;"></div>
            <div class="label" style>
              <span>类别：</span>
              <el-radio-group v-model="energyType" size="medium">
                <el-radio-button
                  v-for="(item,index) in energyTypeOptions"
                  :key="index"
                  :label="item.id"
                >{{item.properties}}</el-radio-button>
              </el-radio-group>
            </div>
            <div class="label" style="margin-top: 8px;">
              <span>标签：</span>
              <el-radio-group v-model="type" size="medium" @change="typeChange">
                <el-radio-button label="branch">支路</el-radio-button>
                <el-radio-button label="department">部门</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="select-list">
            <div
              v-for="(item,index) in selectArr"
              :key="index"
              :class="{hover: index === mouseHover, 'selected': index === mouseClick}"
              @click="selectClick(index)"
              @mouseleave="selectLeave"
              @mouseover="selectOn(index)"
            >
              <span style></span>
              <i class="el-icon-location"></i>
              <span>{{item}}</span>
            </div>
          </div>
        </div>
        <!-- 右边展示栏 -->
        <div class="list">
          <div class="handle">
            <el-button type="primary" size="small" @click="addMonitorVariable">+ 添加检测变量</el-button>
          </div>
          <div class="list-show scroll">
            <el-table :data="tableData" border style="width: 100%" :row-style="rowStyle">
              <el-table-column type="index" width="50"></el-table-column>
              <el-table-column prop="simplifiedCode" label="编码"></el-table-column>
              <el-table-column prop="branch" label="支路"></el-table-column>
              <el-table-column prop="statistics" label="计量级别">
                <template slot-scope="scope">{{scope.row.statistics === 1 ? '对外核算' : '其他'}}</template>
              </el-table-column>
              <el-table-column prop="department" label="部门"></el-table-column>
              <el-table-column prop="energyType" label="类别">
                {{listPorperties}}
              </el-table-column>
              <el-table-column label="操作" width="160">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" offset="-20" content="编辑" placement="top-start">
                    <el-button
                      icon="el-icon-edit"
                      class="confirm"
                      size="mini"
                      @click="energyBranchDetail(scope.row)"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" offset="-20" content="删除" placement="top-start">
                    <el-button
                      icon="el-icon-delete"
                      class="del"
                      size="mini"
                      @click="delMonitor(scope.row)"
                    ></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <!-- 删除支路下编码 -->
    <el-dialog
      title="提示"
      :close-on-click-modal="false"
      :visible.sync="delConfigVisible"
      width="30%"
      class="del-config"
    >
      <div style="width: 30px;float: left;margin: -7px 8px 5px -8px;">
        <i :class="{icon: true, 'iconfont': true, 'iconjinggao1': true}"></i>
      </div>
      <span>此操作将永久删除编码为{{monitorValue}}的检测变量, 是否继续?</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="delConfigVisible = false">取 消</el-button>
        <el-button class="dang" @click="delMonitorValue()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增分支 -->
    <el-dialog
      :title="editEnergyForm.id ? '编辑能耗监控项' : '新增能耗监控项'"
      :visible.sync="configVisible"
      :close-on-click-modal="false"
      class="config-window"
      width="900px"
      @close="clearEnergyForm"
    >
      <el-form
        :model="editEnergyForm"
        label-width="90px"
        :rules="editEnergyRule"
        ref="editEnergyRef"
      >
        <el-form-item label="能源类别" prop="energyType">
          <el-select v-model="editEnergyForm.energyType" placeholder>
            <el-option
              v-for="item in energyOptions"
              :key="item.id"
              :label="item.properties"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <div style="display: flex; justify-content: space-around;" class="groupTwo">
          <el-form-item label="监控分组" prop="classifyId">
            <el-select v-model="editEnergyForm.classifyId" placeholder @change="classifyChange">
              <el-option
                v-for="item in classifyOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <div class="groupFour">
            <el-form-item label="监控设备" prop="equipmentId">
              <el-select
                v-model="editEnergyForm.equipmentId"
                placeholder
                @visible-change="freshEquip"
                @change="equipChange"
                filterable
              >
                <el-option
                  v-for="item in equipOptions"
                  :key="item.equipmentId"
                  :label="item.name"
                  :value="item.equipmentId"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>

          <div class="groupTwo-Three">
            <el-form-item label="变量" prop="code">
              <el-select
                v-model="editEnergyForm.code"
                placeholder
                @visible-change="getVariable"
                @change="variableChange"
                filterable
              >
                <el-option
                  v-for="(item,index) in variableOptions"
                  :key="index"
                  :label="item.simplifiedCode"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <!-- <div style="padding-left: 100px; color: red;" v-show="properties && (editEnergyForm.statistics == 1 && properties != 3)">无数据</div> -->
        <el-form-item label="计量级别" prop="statistics">
          <el-radio v-model="editEnergyForm.statistics" label="1">
            对外核算
            <!-- <span style="color: #606266;">&nbsp;(仅当能源类别为电度时，选择对外核算有效)</span> -->
          </el-radio>
          <el-radio v-model="editEnergyForm.statistics" label="0">其他</el-radio>
        </el-form-item>
        <div class="groupThree">
          <el-form-item label="支路" prop="branch">
            <el-input v-model="editEnergyForm.branch"></el-input>
          </el-form-item>
          <el-form-item label="所属部门" prop="department">
            <el-input v-model="editEnergyForm.department"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="configVisible = false">取 消</el-button>
        <el-button type="primary" @click="editEnergySubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MyBreadcrumb from "../subcomponents/Mybreadcrumb";
export default {
  components: {
    MyBreadcrumb
  },
  data() {
    return {
      type: "branch",
      selectArr: [],
      mouseHover: null,
      mouseClick: null,

      tableData: [], //右侧所有展示的支路
      // 新增分支的弹窗
      configVisible: false,
      // 删除的弹窗
      delConfigVisible: false,
      // 要删除的编码值
      monitorValue: "",
      // 要删除的编码Id
      monitorId: "",
      //
      energyType: "",
      energyTypeOptions: [], //站点下存在的能源类型
      editEnergyForm: {
        statistics: "1",
        branch: "",
        department: "",
        energyType: 1
      },
      editEnergyRule: {
        energyType: [
          { required: true, message: "请选择能源类型", trigger: "change" }
        ],
        classifyId: [
          { required: true, message: "请选择监控设备", trigger: "change" }
        ],
        equipmentId: [
          { required: true, message: "请选择监控设备", trigger: "change" }
        ],
        code: [{ required: true, message: "请选择变量", trigger: "change" }],
        statistics: [
          { required: true, message: "请选择级别", trigger: "change" }
        ],
        branch: [{ required: true, message: "请填写支路", trigger: "blur" }],
        department: [{ required: true, message: "请填写部门", trigger: "blur" }]
      },
      showEnergyOptions: [], //页面存在的能源类型，用于筛选
      energyOptions: [], //所有能源类型
      classifyOptions: [], //所有分组
      equipOptions: [], //分组下的设备
      variableOptions: [], //设备下的变量
      properties: "", //选中变量的属性
    };
  },
  computed: {
    listPorperties() {
      if (this.energyType && this.energyTypeOptions.length) {
        var index = this.energyTypeOptions.findIndex(item => {
          return this.energyType === item.id;
        });
        console.log(index,this.energyType,this.energyTypeOptions)
        return this.energyTypeOptions[index].properties;
      }
    },
    watchSiteChange() {
      return this.$store.state.site.siteId;
    }
  },
  watch: {
    energyType: {
      handler(newValue) {
        // 类别发生变化，刷新数据
        this.selectArr = [];
        this.getEnergyBranch();
        this.getSelectList();
      }
    },
    type: {
      handler(newValue) {
        this.mouseClick = 0;
      }
    },
    watchSiteChange(newVal, oldVal) {
      this.tableData = [];
      this.getEnergyOptions();
      this.getAllClassify();
      this.getEnergyOptions_inSite();
    }
  },
  mounted() {
    this.getEnergyOptions();
    this.getAllClassify();
    this.getEnergyOptions_inSite();
  },
  methods: {
    rowStyle({ row, rowIndex }) {
      var arr = [];
      var str = this.selectArr[this.mouseClick];
      if (row[this.type] == str) {
        return { "background-color": "#3F5363" };
      }
      // if (this.type === "department") {
      //   // this.selectArr[this.mouseClick]
      //   if (this.selectArr[this.mouseClick] === "department") {
      //     return "color: green";
      //   }
      // } else {
      //   if (this.selectArr[this.mouseClick] === "branch") {
      //     return "color: orange";
      //   }
      // }
    },
    // 鼠标移入
    selectOn(index) {
      this.mouseHover = index;
    },
    // 鼠标移出
    selectLeave() {
      this.mouseHover = null;
    },
    // 鼠标点击
    selectClick(index) {
      this.mouseClick = index;
      // this.rowStyle()
    },
    // 删除支路
    delMonitor(row) {
      this.delConfigVisible = true;
      this.monitorValue = row.code;
      this.monitorId = row.id;
    },
    delMonitorValue() {
      this.$http
        .get("equipment/energyBranch/remove", {
          params: {
            id: parseInt(this.monitorId)
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.getEnergyBranch();
            this.$notify({
              message: "删除成功",
              type: "success"
            });
            // 刷新类别
            this.getEnergyOptions_inSite();
            // 刷新标签
            this.getSelectList();
            // 退出弹窗
            this.delConfigVisible = false;
          } else {
            this.$notify({
              message: res.data.message,
              type: "warning"
            });
          }
        });
    },
    // 新增监测变量
    addMonitorVariable() {
      this.configVisible = true;
    },
    // 获取所有可选能源类别
    getEnergyOptions() {
      // return 
      this.$http
        .get("equipment/energyProperties/findAll", {
          params: {}
        })
        .then(res => {
          if (res.data.code === 0) {
            this.energyOptions = res.data.data;
            this.getSelectList()
          }
        });
    },
    // 获取所有监控分组
    getAllClassify() {
      if(!this.$store.state.site.siteId) {
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
            this.classifyOptions = res.data.data;
          }
        });
    },
    // 分组值改变
    classifyChange() {
      this.$delete(this.editEnergyForm, "equipmentId");
      this.$delete(this.editEnergyForm, "code");
    },
    // 获取分组下的监控设备
    freshEquip(flag) {
      if(!flag) {
        return
      }
      if (!this.editEnergyForm.classifyId) {
        this.$message("请先选择监控分组");
        return;
      }
      this.$http
        .get("equipment/classifyEquipment/findAllByClassify", {
          params: {
            classifyIds: this.editEnergyForm.classifyId
          }
        })
        .then(res => {
          this.equipOptions = res.data.data[0].ClassifyEquipmentVO;
        });
    },
    // 设备值改变
    equipChange() {
      // this.editEnergyForm.code = null;
      this.$delete(this.editEnergyForm, "code");
    },
    // 获取设备下所有变量
    getVariable(flag) {
      if (!flag && !this.editEnergyForm.id) {
        return;
      }
      if (!this.editEnergyForm.equipmentId && !this.editEnergyForm.id) {
        this.$message("请先选中设备！");
        return;
      }
      this.$http
        .get("equipment/variable/findAllByEquipment", {
          params: {
            equipmentId: this.editEnergyForm.equipmentId,
            energyType: this.editEnergyForm.energyType,
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.variableOptions = res.data.data;
            // 编辑情况下获取变量的properties属性
            if (this.editEnergyForm.id) {
              var index = this.variableOptions.findIndex(item => {
                return item.code == this.editEnergyForm.code;
              });
              this.properties = this.variableOptions[index].properties;
            }
          }
        });
    },
    // 变量改变
    variableChange() {
      this.$forceUpdate();
      if (!this.editEnergyForm.code) {
        return;
      }
      var code = this.editEnergyForm.code;
      var index = this.variableOptions.findIndex(item => {
        return item.code === code;
      });
      this.properties = this.variableOptions[index].properties;
    },
    // 新增编辑提交
    editEnergySubmit() {
      this.$refs.editEnergyRef.validate(valid => {
        if (valid) {
          // var per1 = (this.properties && (this.properties != 3 && this.editEnergyForm.statistics == 1))
          // var per1 = this.properties && this.properties == 3;
          // 新增
          if (!this.editEnergyForm.id) {
            var obj = JSON.parse(JSON.stringify(this.editEnergyForm));
            // obj.statistics =
            //   this.properties == 3 ? this.editEnergyForm.statistics : 0;
            // 计量级别暂时全部传1
            // obj.statistics = 1;
            obj.siteId = this.$store.state.site.siteId;
            this.$http.post("equipment/energyBranch/add", obj).then(res => {
              if (res.data.code === 0) {
                this.$notify({
                  title: "成功",
                  message: "新增成功！",
                  type: "success"
                });
                this.configVisible = false;
                this.getEnergyBranch();
                // 刷新类别
                this.getEnergyOptions_inSite();
                // 刷新标签
                this.getSelectList();
              } else {
                this.$notify({
                  title: "注意",
                  message: this.data.message,
                  type: "warning"
                });
              }
            });
          } else {
            // this.editEnergyForm.properties = per1
            //   ? 0
            //   : this.editEnergyForm.properties;
            // this.editEnergyForm.statistics = 1;
            this.$http
              .post("equipment/energyBranch/update", this.editEnergyForm)
              .then(res => {
                if (res.data.code === 0) {
                  this.$notify({
                    title: "成功",
                    message: "编辑成功！",
                    type: "success"
                  });
                  this.configVisible = false;
                  this.getEnergyBranch();
                  // 刷新类别
                  this.getEnergyOptions_inSite();
                  // 刷新标签
                  this.getSelectList();
                } else {
                  this.$notify({
                    title: "注意",
                    message: this.data.message,
                    type: "warning"
                  });
                }
              });
          }
        } else {
        }
      });
    },
    // 清空表单数据
    clearEnergyForm() {
      this.equipOptions = []
      this.variableOptions = []
      this.editEnergyForm = {
        statistics: "1",
        branch: "",
        department: "",
        energyType: 1
      };
      this.$refs.editEnergyRef.resetFields();
      this.$delete(this.editEnergyForm, "id");
      this.properties = null;
      // this.editEnergyForm.energyType = 3;
    },
    // 获取所有的能源分支
    getEnergyBranch() {
      this.tableData = [];
      if (!this.energyType) {
        return;
      }
      this.$http
        .get("equipment/energyBranch/findBySite", {
          params: {
            siteId: this.$store.state.site.siteId,
            energyType: this.energyType
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            // alert(1);
            this.tableData = res.data.data;
          }
        });
    },
    // 获取站点的所有能源类型
    getEnergyOptions_inSite() {
      if(!this.$store.state.site.siteId) {
        return
      }
      this.$http
        .get("equipment/energyBranch/getAllType", {
          params: {
            siteId: this.$store.state.site.siteId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.energyTypeOptions = res.data.data;
            if (this.energyTypeOptions.length > 0) {
              // 默认选中电度
              this.energyType = this.energyTypeOptions[0].id;
            } else {
              this.energyType = null;
            }
            this.getSelectList()
            this.getEnergyBranch()
          }
        });
    },
    // 获取站点下的所有能源部门或能源分支
    getSelectList() {
      if (!this.energyType) {
        return;
      }
      if (this.type === "department") {
        this.$http
          .get("equipment/energyBranch/getAllDepartment", {
            params: {
              siteId: this.$store.state.site.siteId,
              energyType: this.energyType
            }
          })
          .then(res => {
            if (res.data.code === 0) {
              this.selectArr = res.data.data;
              if (this.selectArr.length > 0) {
                this.mouseClick = 0;
              }
            }
          });
      } else {
        this.$http
          .get("equipment/energyBranch/getAllBranch", {
            params: {
              siteId: this.$store.state.site.siteId,
              energyType: this.energyType
            }
          })
          .then(res => {
            if (res.data.code === 0) {
              this.selectArr = res.data.data;
              if (this.selectArr.length > 0) {
                this.mouseClick = 0;
              }
            }
          });
      }
    },
    // 分支或部门切换
    typeChange() {
      this.getSelectList();
    },
    // 分支详情
    energyBranchDetail(row) {
      this.$http
        .get("equipment/energyBranch/detail", {
          params: {
            id: row.id
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            // alert(1)
            this.editEnergyForm = res.data.data;
            this.editEnergyForm.statistics = this.editEnergyForm.statistics.toString();
            this.configVisible = true;
            // 获取选项值
            this.freshEquip(true);
            this.getVariable();
          }
        });
    }
  }
};
</script>

<style lang='less' scoped>
@import "../../assets/css/index.less";

.energy-config {
  height: 100%;
  .energy-all {
    height: calc(100% - 62px);
    overflow: auto;
    .energy-content {
      width: 100%;
      min-height: 460px;
      height: 100%;
      display: -webkit-flex;
      background-color: f6f6f6;
      /* 左边样式 */
      .select {
        width: 300px;
        overflow: hidden;
        margin: 1px;
        margin-right: 11px;
        border-radius: 6px;
        padding: 6px;
        box-sizing: border-box;
        background-color: @table-bgc;
        box-shadow: 0 0 4px #cac6c6;
        .filter {
          height: 100px;
          border-bottom: 1px solid #ccc;
          .label {
            color: #ccc;
            & /deep/ .el-radio-button__inner {
              padding: 5px 8px;
            }
          }
        }
        .select-list {
          height: calc(100% - 100px);
          padding-top: 6px;
          overflow: auto;
          .selected {
            background-color: #3f5363;
          }
          & > div {
            cursor: pointer;
            color: #fff;
            margin: 0 0 5px 0;
            &:hover {
              background-color: @table-hover;
            }
            span {
              padding-left: 6px;
            }
          }
        }
      }
      /* 右边区域样式 */
      .list {
        flex: 1;
        height: calc(100% - 2px);
        margin: 1px;
        background-color: @table-bgc;
        box-shadow: 0 0 4px #cac6c6;
        border-radius: 6px;
        padding: 4px;
        box-sizing: border-box;
        overflow: hidden;
        .handle {
          height: 60px;
          display: -webkit-flex;
          justify-content: left;
          align-items: center;
          padding-left: 6px;
          /* 按钮的颜色 */
          /deep/ .el-button--primary {
            background-color: @primary-btn;
            border-color: @primary-btn;
          }
        }
        .list-show {
          height: calc(100% - 60px);
          overflow: auto;
        }
      }
    }
  }
  .del-config {
  }
  .config-window {
    & /deep/ .el-form-item {
      margin-bottom: 14px;
      .el-input__inner {
        height: 32px;
      }
    }
    /* 弹窗里的按钮颜色 */
    & /deep/ .el-button--default {
      background-color: green;
      color: #fff;
      border: none;
    }
    & /deep/ .el-button--primary {
      background-color: @primary-btn;
      color: #fff;
      border: none;
    }
  }
}

// .config-window /deep/ .el-form-item {

// }

// .config-window /deep/

/* 新增能耗监控项 */
.el-select /deep/ .el-input--suffix {
  width: 180px;
}

.groupTwo /deep/ .el-form-item {
  width: 180px;
  margin-left: -45px;
}

.groupThree /deep/ .el-form-item {
  width: 514px;
}

.groupTwo-Three /deep/ .el-form-item {
  margin-left: -25px;
}

.groupTwo-Three {
  width: 185px;
  margin-left: 20px;
}

.groupFour /deep/ .el-form-item {
  margin-left: 22px;
}
</style>