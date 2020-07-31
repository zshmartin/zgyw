<template>
  <div>
    <MyBreadcrumb level1="告警管理" level2="告警类型"></MyBreadcrumb>
    <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="所有告警类型" name="first">-->
    <div class="warn-top" v-if="power">
      <!-- 待商榷需不需要补充-------------------------------------------- -->
      <!-- <el-select v-model="equipValue" placeholder="告警类型" size="mini" @visible-change="warnTypeShow">
        <el-option
          v-for="item in equipOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select v-model="warnValue" placeholder="告警级别" size="mini">
        <el-option
          v-for="item in warnTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <el-input
        v-model="searchValue"
        placeholder="请输入内容"
        style="width: 200px; margin-right: 20px;"
        size="mini"
      ></el-input>-->
      <el-button
        @click="tryAddWarn"
        size="small"
        style="margin-bottom: 8px;"
        type="success"
        plain
      >新建告警 +</el-button>
    </div>
    <el-table
      :data="warnOptions"
      v-loading="loading"
      style="width: 100%; margin-top: 4px;"
      stripe
      size="small"
    >
      <el-table-column prop="name" label="告警类型"></el-table-column>
      <el-table-column prop="triggerConditionName" label="触发条件"></el-table-column>
      <el-table-column prop="code" label="变量编码"></el-table-column>
      <el-table-column prop="level" label="告警级别">
        <template slot-scope="scope">
          <span class="one-type warn-btn" v-if="scope.row.level == 1">一级</span>
          <span class="two-type warn-btn" v-else-if="scope.row.level == 2">二级</span>
          <span class="three-type warn-btn" v-else-if="scope.row.level == 3">三级</span>
          <span class="four-type warn-btn" v-else-if="scope.row.level == 4">四级</span>
          <span class="five-type warn-btn" v-else-if="scope.row.level == 5">五级</span>
          <span class="six-type warn-btn" v-else-if="scope.row.level == 6">六级</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" v-if="power">
        <template slot-scope="scope">
          <el-button
            @click="editWarn(scope.row)"
            type="text"
            size="small"
            :disabled="scope.row.id == 1"
          >编辑</el-button>
          <el-button
            @click="tryDelWarn(scope.row)"
            type="text"
            size="small"
            :disabled="scope.row.id == 1"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="page-block"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10,20,50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalWarnType"
    ></el-pagination>
    <!--------------------------- 添加、编辑告警弹窗 --------------->
    <el-dialog
      :visible.sync="editWarnVisible"
      title="告警编辑"
      width="520px"
      :before-close="handleClose"
      modal
      :close-on-click-modal="false"
      :show-close="true"
      @close="before_close"
    >
      <el-form
        :model="warnForm"
        :rules="addWarnRules"
        ref="editWarnRef"
        label-width="110px"
        class="demo-ruleForm"
        style="border-bottom: 6px solid #ccc; width: 480px; border-radius: 20px;"
      >
        <el-form-item label="告警类型" prop="name" v-if="!ifEdit">
          <el-input v-model.trim="warnForm.name" placeholder="请输入告警类型" style="width: 217px;"></el-input>
        </el-form-item>
        <el-form-item label="告警类型" prop="name" v-else>
          <el-input
            v-model.trim="warnForm.name"
            placeholder="请输入告警类型"
            disabled
            style="width: 217px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="code" v-if="!ifEdit">
          <el-input v-model.trim="warnForm.code" placeholder="请输入编码" style="width: 217px;"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="code" v-else>
          <el-input v-model.trim="warnForm.code" placeholder="请输入编码" style="width: 217px;" disabled></el-input>
        </el-form-item>
        <el-form-item label="触发条件" prop="triggerCondition">
          <el-select v-model="warnForm.triggerCondition" placeholder="请选择触发条件">
            <el-option
              v-for="item in warncondictionOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否自动关闭" prop="autoClose">
          <el-radio-group v-model="warnForm.autoClose">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="告警等级" prop="level">
          <el-radio-group v-model="warnForm.level" size="small">
            <el-radio-button label="1">一级</el-radio-button>
            <el-radio-button label="2">二级</el-radio-button>
            <el-radio-button label="3">三级</el-radio-button>
            <el-radio-button label="4">四级</el-radio-button>
            <el-radio-button label="5">五级</el-radio-button>
            <el-radio-button label="6">六级</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="editWarnVisible = false" style="margin-left: 200px;">取 消</el-button>
        <el-button class="confirm" :loading="ifSubmit" @click="editWarnSubmit">提交</el-button>
      </span>
    </el-dialog>
    <!-- 删除告警弹窗 -->
    <el-dialog title="提示" :visible.sync="delWarnVisible" width="30%">
      <span>是否确定删除告警{{ delName }}？</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="delWarnVisible = false">取 消</el-button>
        <el-button class="dang" @click="delWarn">确 定</el-button>
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
  computed: {
    watchSiteChange() {
      return this.$store.state.site.siteId;
    },
    // 计算权限是否是平台公司管理员
    power() {
      return (
        this.$store.state.userInfo.companyId === 0 &&
        this.$store.state.userInfo.roleId === 1
      );
    }
  },
  watch: {
    watchSiteChange(newVal, oldVal) {
      this.getOptions();
    }
  },
  data() {
    return {
      warnTypeOptions: [],
      // 告警类型
      equipOptions: [],
      // 所有变量
      warnOptions: [],
      warncondictionOptions: [],
      warnValue: "",
      equipValue: "",
      searchValue: "",
      activeName: "first",
      warnForm: {},
      addWarnRules: {
        name: [{ required: true, message: "请选择告警类型", trigger: "blur" }],
        code: [{ required: true, message: "请选择变量编码", trigger: "blur" }],
        triggerCondition: [
          { required: true, message: "请选择触发条件", trigger: "blur" }
        ],
        level: [{ required: true, message: "请选择告警等级", trigger: "blur" }],
        autoClose: [
          { required: true, message: "请选择是否自动关闭", trigger: "blur" }
        ]
      },
      editWarnRules: [],
      ifSubmit: false,
      editWarnVisible: false,
      delWarnVisible: false,
      totalWarnType: 0, //总数
      pageSize: 10,
      currentPage: 1,
      delId: "", //记录需要删除的id
      delName: "", //需要删除的告警名称
      ifEdit: false, //是否处于编辑
      loading: false
    };
  },
  created() {
    this.getOptions();
  },
  methods: {
    editWarn(row) {
      this.ifEdit = true;
      this.editWarnVisible = true;
      this.warnForm = {};
      this.getTrigger();
      this.$http
        .get("equipment//alarm/findOne", {
          params: {
            id: row.id
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.warnForm = res.data.data;
          }
        });
    },
    tryDelWarn(row) {
      this.delWarnVisible = true;
      // 记录需要删除的id
      this.delId = row.id;
      this.delName = row.name;
    },
    handleClick(tab, event) {
    },
    handleClose() {
      this.editWarnVisible = false;
    },
    delWarn() {
      this.$http
        .get("equipment/alarm/remove", {
          params: {
            id: this.delId
          }
        })
        .then(res => {

          if (res.data.code == 0) {
            this.delWarnVisible = false;
            this.$notify({
              message: "删除成功",
              type: "success"
            });
            this.getOptions();
          } else if (res.data.code == 607) {
            this.$message(res.data.msg);
          }
        });
    },
    editWarnSubmit() {
      this.$refs.editWarnRef.validate(valid => {
        if (valid) {
          var obj = {
            name: this.warnForm.name,
            code: this.warnForm.code,
            triggerCondition: this.warnForm.triggerCondition,
            level: this.warnForm.level,
            autoClose: this.warnForm.autoClose
          };
          // 编辑
          if (this.warnForm.id) {
            obj.id = this.warnForm.id;
            this.$http
              .post("equipment/alarm/alarmTypeModify", obj)
              .then(res => {
                if (res.data.code == 0) {
                  this.$notify({
                    title: "成功",
                    message: "修改成功",
                    type: "success"
                  });
                }
                this.editWarnVisible = false;
                this.warnForm = {};
                // 刷新数据，回到首页
                this.currentPage = 1;
                this.getOptions();
              });
          } else {
            // 新增
            this.$http.post("equipment/alarm/alarmTypeAdd", obj).then(res => {
              if (res.data.code == 0) {
                this.$notify({
                  title: "成功",
                  message: "添加成功",
                  type: "success"
                });
              }
              this.editWarnVisible = false;
              this.warnForm = {};
              // 刷新数据，回到首页
              this.currentPage = 1;
              this.getOptions();
            });
          }
        }
      });
    },

    // 添加告警弹窗
    tryAddWarn() {
      this.ifEdit = false;
      this.editWarnVisible = true;
      this.warnForm = {};
      this.getTrigger();
    },
    // 获取所有触发条件
    getTrigger() {
      this.$http
        .get("equipment/alarm/allTriggerCondition	", {
          params: {}
        })
        .then(res => {
          if (res.data.code == 0) {
            this.warncondictionOptions = res.data.data;
          }
        });
    },
    //获取所有告警类型
    warnTypeShow(flag) {
      if (flag) {
      }
    },
    // 获取所有的告警类型
    getOptions() {
      this.loading = true;
      let time = setTimeout(() => {
        this.loading = false;
      }, 15000);
      // 此处调接口需要所有当前公司都传入公司id
      this.$http
        .get("equipment/alarm/alarmTypes", {
          params: {
            page: this.currentPage - 1,
            size: this.pageSize
          }
        })
        .then(res => {
          this.warnOptions = res.data.data.alarmTypes;
          this.loading = false;
          this.totalWarnType = res.data.data.total;
        })
        .catch(res => {
          this.loading = false;
        });
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getOptions();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getOptions();
    },
    before_close() {
      this.$refs.editWarnRef.resetFields();
    }
  }
};
</script>

<style scoped>

.page-block {
  float: right;
}
</style>
