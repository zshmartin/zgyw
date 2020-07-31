<template>
  <div class="operation">
    <MyBreadcrumb style="margin-bottom: 0;" level1="管理中心" level2="用户公司管理" />
    <div class="content-main scroll">
      <div class="table-Content">
        <header>
          <!-- <el-button type="primary" @click="addOrg" size="small">+新建运维组织</el-button> -->
          <div class="organization">
            <span>组织名称:&nbsp;&nbsp;&nbsp;</span>
            <el-input
              v-model="inputOrganization"
              placeholder="输入组织名称将自动搜索"
              style="width: 220px;"
              v-throttle="search"
              suffix-icon="el-icon-search"
            ></el-input>
          </div>
          <el-button @click="addOrg" size="mini" class="confirm">+ &nbsp; 新建运维组织</el-button>
        </header>
        <section>
          <el-table
            :data="tableData"
            border
            style="width: 99%;margin-left: 8px;margin-bottom: 15px;"
            v-loading="loading"
          >
            <el-table-column prop="name" label="组织名称"></el-table-column>
            <el-table-column prop="area" label="组织地址"></el-table-column>
            <el-table-column prop="responsibleName" label="负责人姓名"></el-table-column>
            <el-table-column prop="responsiblePhone" label="负责人电话"></el-table-column>
            <el-table-column prop="adminName" label="管理员姓名"></el-table-column>
            <el-table-column prop="adminPhone" label="管理员电话"></el-table-column>
            <el-table-column label="操作" width="200px">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" offset="-20" content="编辑" placement="top-start">
                  <el-button
                    icon="el-icon-edit"
                    class="confirm"
                    size="mini"
                    :disabled="scope.row.status !== '0'"
                    @click="getOrgDetail(scope.row)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" offset="-20" content="新增站点" placement="top-start">
                  <el-button
                    icon="el-icon-document-add"
                    size="mini"
                    class="confirm"
                    :disabled="scope.row.status !== '0'"
                    @click="addSite(scope.row)"
                  ></el-button>
                </el-tooltip>

                <!-- icontabledisable-copy-copy 禁用图标 -->
                <template v-if="scope.row.status === '0'">
                  <el-tooltip class="item" effect="dark" offset="-20" content="禁用组织" placement="top-start">
                    <el-button size="mini" class="del" @click="forbiddenOperation(scope.row)">
                      <i class="icon iconfont iconjinyong1 mini"></i>
                    </el-button>
                  </el-tooltip>
                </template>
                <template v-else>
                  <el-tooltip class="item" effect="dark" content="已禁用" placement="top-start">
                    <el-button size="mini" type="info">
                      <i class="icon iconfont icontabledisable-copy mini"></i>
                    </el-button>
                  </el-tooltip>
                </template>
              </template>
            </el-table-column>
          </el-table>

          <div class="block" style="text-align: right;padding-bottom: 15px;">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 50]"
              :page-size="size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalCom"
            ></el-pagination>
          </div>
        </section>
      </div>
    </div>
    <footer></footer>
    <!-- 新增运维弹窗 -->
    <el-dialog
      title="新建运维组织"
      :visible.sync="add_organization_Visible"
      modal
      modal-append-to-body
      :close-on-click-modal="false"
      width="550px"
      @close="handleClose"
    >
      <el-form
        :model="companyForm"
        :rules="companyRules"
        ref="companyRef"
        label-width="100px"
        class="company-form"
      >
        <el-form-item label="组织名称" prop="name">
          <el-input v-model="companyForm.name"></el-input>
        </el-form-item>

        <el-form-item label="公司logo" prop="file" class="logo">
          <input @change="selectFile($event)" type="file" accept="image/*" />
          <div class="place-hold" v-show="!imgSrc">
            <i class="el-icon-plus"></i>
          </div>
          <img id="imgId" :src="imgSrc" alt v-show="imgSrc" />
          <div class="remark">
            <span>(建议宽高尺寸1:1)</span>
          </div>
        </el-form-item>
        <!-- <el-form-item label="公司logo" prop="file">
          <input @change="selectFile($event)" type="file" accept="image/*" />
          <img id="imgId" :src="imgSrc" alt style="width: 200px; height: 60px;" />
        </el-form-item>-->
        <el-form-item label="组织地址" prop="area">
          <el-input v-model.trim="companyForm.area"></el-input>
        </el-form-item>
        <div class="input-layout">
          <el-form-item label="负责人姓名" prop="responsibleName" class="inp">
            <el-input v-model.trim="companyForm.responsibleName"></el-input>
          </el-form-item>
          <el-form-item label="负责人电话" prop="responsiblePhone" class="inp">
            <el-input v-model.trim="companyForm.responsiblePhone"></el-input>
          </el-form-item>
        </div>
        <div class="input-layout">
          <el-form-item label="管理员姓名" prop="adminName" class="inp">
            <el-input v-model.trim="companyForm.adminName"></el-input>
          </el-form-item>
          <el-form-item label="管理员账号" prop="admin" class="inp">
            <el-input
              v-model.trim="companyForm.admin"
              :disabled="Boolean(companyForm.id || companyForm.id === 0)"
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="管理员电话" prop="adminPhone">
          <el-input v-model.trim="companyForm.adminPhone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="add_organization_Visible = false">取 消</el-button>
        <el-button class="confirm" @click="addOrgSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增站点弹窗 -->
    <el-dialog
      title="新增站点"
      :visible="siteVisible"
      width="730px"
      modal
      modal-append-to-body
      :close-on-click-modal="false"
      @close="before_close"
    >
      <el-form
        :model="siteForm"
        :rules="siteRule"
        ref="siteRef"
        label-width="80px"
        class="siteForm"
      >
        <!-- <el-form-item label="站点描述" prop="name">
          <el-input v-model.trim="siteForm.name"></el-input>
        </el-form-item>
        <el-form-item label="所属公司" prop="companyId">
          <el-select v-model="siteForm.companyId" placeholder="所属公司" disabled>
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model.trim="siteForm.longitude"></el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model.trim="siteForm.latitude"></el-input>
        </el-form-item>-->
        <div class="layout" style>
          <el-form-item label="站点描述" prop="name">
            <el-input v-model.trim="siteForm.name" style="width: 180px;"></el-input>
          </el-form-item>
          <el-form-item label="所属公司" prop="companyId">
            <el-select
              v-model="siteForm.companyId"
              placeholder="所属公司"
              disabled
              style="width: 180px;"
            >
              <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="location-input" style>
          <el-form-item label="经度" prop="longitude">
            <el-input v-model.trim="siteForm.longitude" style="width: 180px;"></el-input>
          </el-form-item>
          <el-form-item label="纬度" prop="latitude">
            <el-input v-model.trim="siteForm.latitude" style="width: 180px;"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div class="baidumap" id="allmap" style></div>
      <div id="r-result" style>
        <!-- 地方: -->
        <input id="cityName" placeholder="请输入搜索地址" type="text" style />
        <el-button class="cancel" @click="theLocation" style>查询</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="siteVisible = false">取 消</el-button>
        <el-button class="confirm" @click="siteSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 禁用平台 -->
    <el-dialog
      title="提示"
      :visible.sync="forbidOperationVisible"
      width="30%"
      modal
      :close-on-click-modal="false"
      :show-close="true"
    >
      <div style="width: 30px;float: left;margin: -7px 8px 5px -8px;">
        <i :class="{icon: true, 'iconfont': true, 'iconjinggao1': true}"></i>
      </div>
      <span>是否确认禁用 {{ forbidName }} ?</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="forbidOperationVisible = false">取 消</el-button>
        <el-button class="dang" @click="forbidOperationSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { checkPhone } from "../../utils";
import GLOBAL from '../../utils/global_variable'
import MyBreadcrumb from "../subcomponents/Mybreadcrumb";
export default {
  components: {
    MyBreadcrumb
  },
  data() {
    // 验证手机号码
    var checkPhoneNum = (rule, value, callback) => {
      if (value === "" || value === undefined) {
        callback(new Error("请输入非空手机号码"));
      } else if (!checkPhone(value)) {
        callback(new Error("请输入正确的手机号码"));
      } else {
        callback();
      }
    };
    // 文件是否为空验证
    var validateFileUrl = (rule,value,callback) => {
      console.log(this.companyForm.file)
      if(this.companyForm.file) {
        callback()
      }else {
        callback(new Error("请选择图片"))
      }
    }
    return {
      inputOrganization: "",
      tableData: [],
      companyForm: {},
      add_organization_Visible: false,
      companyRules: {
        name: [{ required: true, message: "请输入组织名称", trigger: "blur" }],
        file: [{ required: true, validator: validateFileUrl, trigger: ["change"] }],
        area: [{ required: true, message: "请输入组织地址", trigger: "blur" }],
        responsibleName: [
          { required: true, message: "请输入负责人姓名", trigger: "blur" },
          { max: 16, message: "长度在 16个字符以下", trigger: "blur" }
        ],
        responsiblePhone: [
          { required: true, validator: checkPhoneNum, trigger: "blur" }
        ],
        adminName: [
          { required: true, message: "请输入管理员姓名", trigger: "blur" },
          { max: 16, message: "长度在 16个字符以下", trigger: "blur" }
        ],
        admin: [
          { required: true, message: "请输入管理员账号", trigger: "blur" },
          { max: 16, message: "长度在 16个字符以下", trigger: "blur" }
        ],
        adminPhone: [
          { required: true, validator: checkPhoneNum, trigger: "blur" }
        ]
      },
      size: 10,
      totalCom: 0,
      currentPage: 1,
      siteVisible: false,
      siteForm: {},
      siteRule: {
        name: [
          { required: true, message: "请输入非空站点名称", trigger: "blur" }
        ]
      },
      companyList: [],
      imgSrc: "",
      imageUrl: "",
      picUrl: "",
      dialogImageUrl: "",
      formData: new FormData(),
      doUpload: false,
      loading: false,
      siteId: "",
      forbidOperationVisible: false,
      forbidName: "",
      forbidId: ""
    };
  },
  computed: {
    getSiteChange() {
      return this.$store.state.site.siteId;
    }
  },
  watch: {
    getSiteChange() {
      // this.getSiteId();
      this.getOrg();
    }
  },
  methods: {
    // 地图展示
    drawMap() {
      // 创建信息窗口对象,禁止默认景点弹窗
      var map = new BMap.Map("allmap", { enableMapClick: false });
      this.map = map;
      // 创建地图实例
      var x = this.siteForm.longitude ? this.siteForm.longitude : 116.404;
      var y = this.siteForm.latitude ? this.siteForm.latitude : 39.915;
      var point = new BMap.Point(x, y);
      // 创建点坐标
      map.centerAndZoom(point, 9);

      map.addControl(
        new BMap.MapTypeControl({
          mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]
        })
      );
      map.setCurrentCity("北京"); // 设置地图显示的城市 此项是必须设置的
      map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

      // 新增跳动标记
      var point = () => {
        if (this.siteForm.longitude && this.siteForm.latitude) {
          map.clearOverlays(); //删除所有点
          var point1 = new BMap.Point(
            parseFloat(this.siteForm.longitude),
            parseFloat(this.siteForm.latitude)
          );
          var marker = new BMap.Marker(point1); // 创建标注
          map.addOverlay(marker); // 将标注添加到地图中
          marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
        }
      };
      point();

      //单击获取点击的经纬度
      map.addEventListener("click", e => {
        this.siteForm.latitude = e.point.lat;
        this.siteForm.longitude = e.point.lng;
        this.$forceUpdate();
        point();
      });
    },
    theLocation() {
      // 根据城市名搜索
      var city = document.getElementById("cityName").value;
      if (city != "") {
        this.map.centerAndZoom(city, 11); // 用城市名设置地图中心点
      }
    },
    search() {
      this.getOrg();
    },
    // 平台详情
    getOrgDetail(row) {
      this.getLogo(row);
      this.add_organization_Visible = true;
      this.$http
        .get("sysmanage/company/detail", {
          params: {
            id: row.id
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.companyForm = res.data.data;
          }
        })
        .catch(res => {
        });
    },
    // 获取log
    getLogo(row) {
      this.$http
        .get("sysmanage/getLogo", {
          params: {
            companyId: row.id
          }
          // responseType: "blob"
        })
        .then(res => {
          this.imgSrc = res.request.responseURL;
          let url = this.imgSrc;
          // this.companyForm.file = this.dataURLtoFile(url, "a.jpg");
        })
        .catch(res => {
        });
    },
    // 将图片url转成文件
    // dataURLtoFile(dataurl, filename) {
    //   //将base64转换为文件
    //   var arr = dataurl.split(","),
    //     mime = arr[0].match(/:(.*?);/)[1],
    //     bstr = atob(arr[1]),
    //     n = bstr.length,
    //     u8arr = new Uint8Array(n);
    //   while (n--) {
    //     u8arr[n] = bstr.charCodeAt(n);
    //   }
    //   return new File([u8arr], filename, { type: mime });
    // },
    // 新增编辑平台关闭区前
    handleClose() {
      this.companyForm = {};
      this.imgSrc = null;
      this.$refs.companyRef.resetFields();
      this.add_organization_Visible = false;
    },
    // 新增编辑平台提交
    addOrgSubmit() {
      event.preventDefault(); //取消默认行为
      if (!this.companyForm.id && this.companyForm.id !== 0) {
        this.$refs.companyRef.validate(valid => {
          if (valid) {
            // 新增平台
            let formdata = new FormData();
            formdata.append("name", this.companyForm.name);
            formdata.append("file", this.companyForm.file);
            formdata.append("area", this.companyForm.area);
            formdata.append(
              "responsibleName",
              this.companyForm.responsibleName
            );
            formdata.append(
              "responsiblePhone",
              this.companyForm.responsiblePhone
            );
            formdata.append("adminName", this.companyForm.adminName);
            formdata.append("admin", this.companyForm.admin);
            formdata.append("adminPhone", this.companyForm.adminPhone);
            // return

            let config = {
              headers: {
                "Content-Type": "multipart/form-data" //之前说的以表单传数据的格式来传递fromdata
              }
            };
            this.$http
              .post("sysmanage/company/add", formdata, config)
              .then(res => {
                if (res.data.code == 0) {
                  this.$notify({
                    title: "成功",
                    message: "添加成功",
                    type: "success"
                  });
                  this.currentPage = 1;
                  this.getOrg();
                  this.updateAllCompany();
                  this.add_organization_Visible = false;
                } else {
                  this.$message(res.data.msg);
                }
              });
          }
          // 编辑平台
        });
      } else {
        this.companyRules.file = null;
        this.$refs.companyRef.validate(valid => {
          // 编辑带图片
          if (valid && this.companyForm.file) {
            let formdata = new FormData();
            formdata.append("name", this.companyForm.name);
            formdata.append("file", this.companyForm.file);
            formdata.append("area", this.companyForm.area);
            formdata.append(
              "responsibleName",
              this.companyForm.responsibleName
            );
            formdata.append(
              "responsiblePhone",
              this.companyForm.responsiblePhone
            );
            formdata.append("adminName", this.companyForm.adminName);
            formdata.append("admin", this.companyForm.admin);
            formdata.append("adminPhone", this.companyForm.adminPhone);
            formdata.append("id", this.companyForm.id);
            formdata.append("logo", this.companyForm.logo);
            // return

            let config = {
              headers: {
                "Content-Type": "multipart/form-data" //之前说的以表单传数据的格式来传递fromdata
              }
            };
            this.$http
              .post("sysmanage/company/modify", formdata, config)
              .then(res => {
                if (res.data.code == 0) {
                  this.$notify({
                    title: "成功",
                    message: "修改成功",
                    type: "success"
                  });
                  // this.currentPage = 1;
                  this.updateAllCompany();
                  this.getOrg();
                  this.$root.Bus.$emit('freshUserName')
                  this.$root.Bus.$emit('changeLogo')
                  this.add_organization_Visible = false;
                
                } else {
                  this.$notify.error({
                    title: "错误",
                    message: res.data.msg
                  });
                }
              });
          }
          // 编辑提交不带图片
          else if (valid && !this.companyForm.file) {
            // this.$delete(this.companyForm,'logo')
            this.$delete(this.companyForm, "createTime");
            // return
            this.$http
              .post("sysmanage/company/modify", this.companyForm)
              .then(res => {
                if (res.data.code == 0) {
                  this.$notify({
                    title: "成功",
                    message: "修改成功",
                    type: "success"
                  });
                  // this.currentPage = 1;
                  this.updateAllCompany();
                  this.getOrg();
                  this.$root.Bus.$emit('freshUserName')
                  this.add_organization_Visible = false;
                } else {
                  this.$notify.error({
                    title: "错误",
                    message: res.data.msg
                  });
                }
              });
          }
        });
      }
    },
    // 新增平台
    addOrg() {
      this.add_organization_Visible = true;
    },
    // 获取所有平台
    getOrg() {
      this.loading = true;
      this.$http
        .get("sysmanage/company/findAll", {
          params: {
            name: this.inputOrganization,
            page: this.currentPage - 1,
            size: this.size
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.loading = false;
            this.tableData = res.data.data.companys;
            this.totalCom = res.data.data.total;
          }
        })
        .catch(res => {
          this.loading = false;
        });
    },
    // 分页改变
    handleSizeChange(val) {
      this.size = val;
      this.currentPage = 1;
      this.getOrg();
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getOrg();
    },
    // 查看详情
    getComDetail() {},
    addSite(row) {
      this.siteVisible = true;
      this.companyList = this.tableData;
      this.siteForm.companyId = row.id;
      // 异步获取地图，否则报错
      setTimeout(() => {
        this.$forceUpdate();
        this.drawMap();
      }, 100);
    },
    // 新增站点提交
    siteSubmit() {
      this.$refs.siteRef.validate(valid => {
        if (valid) {
          this.$http.post("equipment/roomAdd", this.siteForm).then(res => {
            if (res.data.code == 0) {
              this.$notify({
                title: "成功",
                message: "新增成功",
                type: "success"
              });
              this.siteVisible = false;
              this.getAllSites();
            } else {
              this.$message(res.data.msg);
            }
          });
        }
      });
    },
    before_close() {
      this.$refs.siteRef.resetFields();
      this.siteForm = {};
      this.siteVisible = false;
    },
    // 选中文件
    selectFile(event) {
      // 限制图片不大于200kb
      if (event.target.files[0].size / 1024 > 200) {
        alert(1)
        this.$message({
          type: "info",
          message: "请选择小于200kb的图片！"
        });
        return;
      }
      this.companyForm.file = event.target.files[0];
      this.imgSrc = this.getObjectURL(event.target.files[0]);
      this.$refs.companyRef.validateField('file')
    },
    getObjectURL(file) {
      var url = null;
      if (window.createObjectURL != undefined) {
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    forbiddenOperation(row) {
      this.forbidName = row.name;
      this.forbidId = row.id;
      this.forbidOperationVisible = true;
    },
    forbidOperationSubmit() {
      this.$http
        .get("equipment/equipment/disable", {
          params: {
            companyId: this.forbidId
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$notify({
              title: "成功",
              message: "禁用成功",
              type: "success"
            });
            this.forbidOperationVisible = false;
            this.getOrg();
          } else {
            this.$notify({
              title: "失败",
              message: "禁用失败",
              type: "warning"
            });
          }
        });
    },
    // 获取当前登录用户所能获取的所有站点
    getAllSites() {
      var paramsObj = {
        // size: 1000,
        size: GLOBAL.max_page_size,
        page: 0,
        companyId: this.$store.state.site.companyId
      };
      this.$http
        .get("equipment/roomList", {
          params: paramsObj
        })
        .then(res => {
          let list = res.data.data.roomList;
          let param = {
            sites: list,
            companyId: this.$store.state.site.companyId
          };
          this.$store.commit("siteUpdate", param);
        })
        .catch(res => {
        });
    },
    updateAllCompany() {
      // 更新layout页面数据及sessionStorage
      this.$root.Bus.$emit("changeCompanyName");
    }
  },
  created() {
    // this.getSiteId();
    this.getOrg();
  }
};
</script>
 
<style lang="less" scoped>
@import "../../assets/css/index.less";
.operation {
  height: 100%;
  .content-main {
    background-color: rgba(67, 92, 112);
    height: calc(100% - 60px);
    overflow: auto;
    .table-Content {
      margin: 5px 10px 5px 10px;
      box-shadow: -2px 0 3px -1px #999, 0 2px 3px -1px #aaa, 2px 0 3px -1px #999;
      header {
        display: -webkit-flex;
        height: 50px;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        color: #fff;
        .organization {
          & /deep/ .el-input__inner {
            height: 32px;
          }
        }
      }
    }
  }
  .el-dialog__wrapper {
    // 编辑公司表单
    .company-form {
      .logo {
        position: relative;
        input {
          position: absolute;
          width: 120px;
          height: 120px;
          opacity: 0;
        }
        // 占位
        .place-hold {
          width: 120px;
          height: 120px;
          background-color: rgba(60, 87, 107);
          display: flex;
          justify-content: center;
          align-items: center;
          i {
            height: 14px;
            display: block;
          }
        }
      }
      .input-layout {
        display: -webkit-flex;
        justify-content: space-between;
        .inp {
          width: 240px;
          display: inline-block;
        }
      }
      img {
        width: 120px;
        height: 120px;
        background-color: #ccc;
      }
      .remark {
        position: absolute;
        left: 140px;
        bottom: -10px;
        span {
          color: #ccc;
        }
      }
    }
    // 编辑站点
    .siteForm {
      .layout {
        display: flex;
        justify-content: space-between;
      }
      .location-input {
        display: flex;
        justify-content: space-between;
      }
    }
    // 地图显示
    #allmap {
      height: 300px;
      width: 100%;
    }
    #r-result {
      margin-top: 10px;
      #cityName {
        color: #fff;
        background-color: #3c576b;
        border: none;
        padding: 0 15px;
        width: 180px;
        height: 40px;
        margin-right: 10px;
        border-radius: 6px;
      }
      .cancel {
        background-color: green;
        color: #fff;
        border: none;
      }
    }
  }
}
</style>