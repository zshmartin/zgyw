<template>
  <div id="control">
    <MyBreadcrumb level1="数据管理" level2="开关控制" />
    <div class="content-main">
      <div class="float-div">
        <div class="header">
          <el-radio-group v-model="selectType" @change="typeSelectChange" size="small" style>
            <el-radio-button label="0">模拟量</el-radio-button>
            <el-radio-button label="1">状态量</el-radio-button>
          </el-radio-group>
        </div>
        <el-table :data="variateData" class="variable-table" v-loading="loading" style size="mini">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="name" label="变量名"></el-table-column>
          <el-table-column prop="equipmentName" label="所属设备"></el-table-column>
          <el-table-column prop="areaName" label="数据地址"></el-table-column>
          <el-table-column prop="type" label="数据类型" v-if="selectType=='0'"></el-table-column>
          <el-table-column prop="value" label="当前值">
            <template slot-scope="scope">
              <span>{{scope.row.value ? Math.round(scope.row.value * 1000) / 1000 : scope.row.value}}&nbsp;&nbsp;&nbsp;({{scope.row.unit}})</span>
            </template>
          </el-table-column>
          <el-table-column prop="corn" label="存盘周期" v-if="selectType=='0'"></el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                offset="-20"
                content="编辑"
                placement="top-start"
              >
                <el-button
                  icon="el-icon-edit"
                  size="mini"
                  class="confirm"
                  @click="searchVariate(scope.row)"
                ></el-button>
              </el-tooltip>
              <!-- <el-tooltip
                class="item"
                effect="dark"
                offset="-20"
                content="删除"
                placement="top-start"
              >
                <el-button
                  icon="el-icon-delete"
                  size="mini"
                  class="del"
                  @click="tryDelVariate(scope.row)"
                ></el-button>
              </el-tooltip>-->
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50]"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalVariate"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 编辑模拟量当前值弹窗 -->
    <el-dialog
      :visible.sync="editValueVisible"
      title="编辑当前值"
      :close-on-click-modal="false"
      width="400px"
    >
      <el-form
        :model="editValueForm"
        :rules="editValueRules"
        ref="editValueRef"
        label-width="80px"
        class="variate-form"
        size="small"
      >
        <el-form-item label="当前值" prop="value" class="inline-input-width" v-if="selectType == '0'">
          <el-input v-model.trim="editValueForm.value"></el-input>
        </el-form-item>
        <el-select v-model="editValueForm.value" placeholder="请选择" no-data-text="无数据" v-else>
          <el-option v-for="item in options" :key="item.val" :label="item.label" :value="item.val"></el-option>
        </el-select>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="editValueVisible = false">取 消</el-button>
        <el-button class="confirm" @click="submitValue">确 定</el-button>
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
      selectType: "0",
      variateData: [],
      loading: false,
      currentPage: 1,
      size: 10,
      totalVariate: 0,
      editValueVisible: false,
      editValueForm: {},
      editValueRules: {
        value: [
          { required: true, message: "请输入不为空的值", trigger: "blur" }
        ]
      },
      options: [
        {
          label: "1",
          val: 1
        },
        {
          label: "0",
          val: 0
        }
      ]
    };
  },
  created() {
    this.searchAll();
  },
  methods: {
    typeSelectChange() {
      this.searchAll();
    },
    // 请求所有变量数据
    searchAll() {
      // 当前站点存在才请求数据
      if (this.$store.state.site.siteId) {
        // this.selectDataType(true);

        var paramsObj = {
          name: this.ncInput,
          page: this.currentPage - 1,
          size: this.size,
          variableType: parseInt(this.selectType)
        };
        paramsObj.siteId = this.$store.state.site.siteId;
        if (this.equip) {
          paramsObj.equipmentId = this.equip;
        }
        this.loading = true;
        let timeout = setTimeout(() => {
          this.loading = false;
        }, 15000);
        this.$http
          .get("equipment/variable/findAll", {
            params: paramsObj
          })
          .then(res => {
            if (res.data.code == 0) {
              this.loading = false;
              this.variateData = res.data.data.variables;
              this.totalVariate = res.data.data.total;
              this.codeString = "";
              this.idString = "";
              this.variateData.forEach(item => {
                this.codeString = this.codeString + item.code + ","; //获取变脸编码集
                this.idString = this.idString + item.equipmentId + ","; //获取编号编码集
                item.areaName = item.areaName + "[" + item.area + "]";
                switch (item.corn) {
                  case 0:
                    item.corn = "不保存";
                    break;
                  case 5:
                    item.corn = "五分钟";
                    break;
                  case 60:
                    item.corn = "一小时";
                    break;
                }
              });
              // 定时刷新当前值
              if (this.codeString) {
                this.getValue(); //获取当前值
                // 定时获取当前值
                if (this.interval_variate) {
                  clearInterval(this.interval_variate);
                }
                this.interval_variate = setInterval(() => {
                  if (!this.codeString) {
                    clearInterval(this.interval_variate);
                    return;
                  }
                  this.getValue();
                }, 10000);
              }

              this.loading = false;
            }
            var option = this.dataTypeOptions;
            var arrayObj = this.variateData;
            for (var i = 0; i < arrayObj.length; i++) {
              for (var j = 0; j < option.length; j++) {
                if (option[j].id == arrayObj[i].type) {
                  arrayObj[i].type = option[j].name;
                }
              }
            }
          })
          .catch(res => {
            this.loading = false;
          });
      }
    },
    // 分页大小改变
    handleSizeChange(val) {
      this.size = val;
      this.currentPage = 1;
      this.searchAll();
    },
    // 分页改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.searchAll();
    },
    // 提交修改
    submitValue() {
      
      this.$refs.editValueRef.validate(valid => {
        if (valid) {
          this.$http
            .post("equipment/variable/writeVariable", this.editValueForm)
            .then(res => {
              if (res.data.code === 0) {
                this.$notify({
                  message: '提交成功',
                  type: 'success'
                })
              }else {
                this.$notify({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            });
        }
      });
    },
    // 弹窗赋值
    searchVariate(row) { 
      // 清空表单验证
      this.$refs.editValueRef && this.$refs.editValueRef.resetFields();
      this.editValueForm = {
        code: row.code,
        value: this.selectType === "0" ? row.value : row.value ? row.value : 0
      };
      this.editValueVisible = true;
    },
    // 获取当前值
    getValue() {
      this.$http
        .get("equipment/variable/getValue", {
          params: {
            variableList: this.codeString.slice(0, this.codeString.length - 1),
            equipmentIds: this.idString.slice(0, this.idString.length - 1)
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            // 数组赋值
            for (var i = 0; i < this.variateData.length; i++) {
              for (var j = 0; j < res.data.data.length; j++) {
                for (var k in res.data.data[j]) {
                  if (this.variateData[i].code == k) {
                    this.variateData[i].value = res.data.data[j][k];
                  }
                }
              }
            }
          }
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/index.less";
#control {
  height: 100%;
  .content-main {
    background-color: rgba(67, 92, 112);
    overflow-y: auto;
    height: calc(100% - 62px);
    .float-div {
      margin: 5px 10px 5px 10px;
      box-shadow: -2px 0 3px -1px #999, 0 2px 3px -1px #aaa, 2px 0 3px -1px #999;
      .header {
        padding: 6px;
      }
      .variable-table {
      }
      // 分页
      .block {
        width: 100%;
        height: 40px;
        padding-bottom: 15px;
        margin-top: 15px;
        /deep/ .el-pagination {
          float: right;
          text-align: right;
        }
      }
    }
  }
}
</style>