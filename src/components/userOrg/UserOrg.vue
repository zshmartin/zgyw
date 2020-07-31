<template>
  <div class="user">
    <div class="header">
      <MyBreadcrumb level1="管理中心" level2="用户公司设置" />
    </div>
    <div class="content">
      <!-- 边栏 -->
      <div class="aside" style>
        <img :src="imgSrc" class="logo" alt style />
      </div>
      <!-- 内容 -->
      <div class="inner scroll">
        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="first">
            <el-form
              :model="companyForm"
              :rules="companyRules"
              ref="companyRef"
              label-width="100px"
              class="form"
            >
              <el-form-item label="组织名称" prop="name">
                <el-input v-model="companyForm.name"></el-input>
              </el-form-item>

              <el-form-item class="input-logo" label="公司logo" prop="file" style>
                <input
                  @change="selectFile($event)"
                  class="input-file"
                  type="file"
                  accept="image/*"
                  style
                />
                <div style v-show="!imgSrc" class="logo">
                  <i class="el-icon-plus" style="heigth: 14px; display: block;"></i>
                </div>
                <img
                  id="imgId"
                  :src="imgSrc"
                  alt
                  v-show="imgSrc"
                  style="width: 120px; height: 120px; background-color: #ccc;"
                />
                <div style="position: absolute; left: 140px; bottom: -10px;">
                  <span style="color: #ccc;">(建议宽高尺寸1:1)</span>
                </div>
              </el-form-item>
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
                  <el-input v-model.trim="companyForm.admin" disabled></el-input>
                </el-form-item>
              </div>
              <el-form-item label="管理员电话" prop="adminPhone">
                <el-input v-model.trim="companyForm.adminPhone"></el-input>
              </el-form-item>
              <div class="form-footer" style="display: flex; justify-content: center">
                <el-button
                  style="background-color: green; color: #fff; border: none;"
                  @click="flashForm"
                  :disabled="Boolean(ifFormChange<3)"
                >取 消</el-button>
                <el-button
                  style="background-color: rgba(245, 166, 35); color: #fff; border: none;"
                  @click.prevent="addOrgSubmit"
                  :disabled="Boolean(ifFormChange<3)"
                >确 定</el-button>
              </div>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="用户管理" name="second">
            <el-button class="confirm" size="mini" @click="addUser">+ 新增用户</el-button>
            <div class="inner-table">
              <el-table :data="userData" border style="width: 100%">
                <el-table-column prop="userName" label="账号"></el-table-column>
                <el-table-column prop="mobile" label="手机"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="userStatus" label="状态">
                  <template slot-scope="scope">
                    <span v-if="scope.row.userStatus" class="red">禁用中</span>
                    <span v-else class="green">启用中</span>
                  </template>
                </el-table-column>
                <el-table-column prop="siteDTOS" label="拥有站点" width="250">
                  <template slot-scope="scope">
                    <div class="tag-single" v-for="item in scope.row.siteDTOS" :key="item.id">
                      <el-tag>{{ item.name ? item.name : '' }}</el-tag>
                    </div>
                    {{scope.siteDTOS}}
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" offset="-20" content="编辑" placement="top-start">
                      <el-button
                        icon="el-icon-edit"
                        class="confirm"
                        size="mini"
                        @click="editUser(scope.row)"
                      ></el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalUser"
              :page-sizes="[10,20,50]"
              @size-change="userSizeChange"
              @current-change="userCurrentChange"
              :page-size="userPageSize"
              :current-page="userCurrentPage"
              style="float: right; margin-top: 8px"
            ></el-pagination>
          </el-tab-pane>
          <el-tab-pane label="站点管理" name="third">
            <el-button class="confirm" size="mini" @click="addSite">+ 新增站点</el-button>
            <div class="inner-table">
              <el-table :data="siteData" border style="width: 100%" :row-style="{height:'25'}">
                <el-table-column prop="companyName" label="所属公司"></el-table-column>
                <el-table-column prop="id" label="编号"></el-table-column>
                <el-table-column prop="name" label="站点名称"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                      <el-button
                        icon="el-icon-edit"
                        class="confirm"
                        size="mini"
                        @click="editSite(scope.row)"
                      ></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                      <el-button
                        icon="el-icon-delete"
                        class="del"
                        size="mini"
                        @click="delSite(scope.row)"
                      ></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="告警开关" placement="top-start">
                      <el-switch
                        v-model="scope.row.alarmSwitch"
                        active-color="#13ce66"
                        @change="switch_change(scope.row)"
                        inactive-color="#ff4949"
                        active-value="1"
                        inactive-value="0"
                        style="margin-left: 10px;"
                      ></el-switch>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-pagination
              class="block"
              background
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalSite"
              :page-sizes="[10,20,50]"
              @size-change="siteSizeChange"
              @current-change="siteCurrentChange"
              :page-size="sitePageSize"
              :current-page="siteCurrentPage"
              style="float: right; margin-top: 8px"
            ></el-pagination>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 编辑用户 -->
    <el-dialog
      :title="userForm.userId ? '编辑用户' : '新增用户'"
      :visible.sync="editUserVisible"
      width="500px"
      class="user-dialog"
      @close="clearUserInfo"
    >
      <el-form
        :model="userForm"
        :rules="userRule"
        ref="userRef"
        label-width="110px"
        class="user-form"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input v-model.trim="userForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model.trim="userForm.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model.trim="userForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" v-if="userForm.roleId == 3">
          <el-input v-model.trim="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="siteIds" v-if="userForm.roleId == 3">
          <el-select
            v-model="userForm.siteIds"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择站点"
          >
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="告警短信" prop="phone">
          <el-checkbox v-model="userForm.checked">接收</el-checkbox>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="editUserVisible = false">取 消</el-button>
        <el-button class="confirm" @click="editUserSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- ------------------------------编辑、添加站点弹窗----------------- -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="editSiteVisible"
      width="640px"
      modal
      modal-append-to-body
      :close-on-click-modal="false"
      @close="before_close"
    >
      <el-form
        :model="siteForm"
        :rules="siteRules"
        ref="siteRef"
        label-width="80px"
        class="demo-ruleForm"
      >
        <div style="display: flex; justify-content: space-between;">
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
        <div style="display: flex; justify-content: space-between;">
          <el-form-item label="经度" prop="longitude">
            <el-input v-model.trim="siteForm.longitude" style="width: 180px;"></el-input>
          </el-form-item>
          <el-form-item label="纬度" prop="latitude">
            <el-input v-model.trim="siteForm.latitude" style="width: 180px;"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div class="baidumap" id="allmap" style="height: 300px; width: 100%;"></div>
      <div id="r-result" style="margin-top: 10px;">
        <!-- 地方: -->
        <input
          id="cityName"
          placeholder="请输入搜索地址"
          type="text"
          style="color: #fff; background-color: #3c576b; border: none; padding: 0 15px; width:180px; height: 40px; margin-right:10px; border-radius: 6px;"
        />
        <el-button
          class="cancel"
          @click="theLocation"
          style="background-color: green; color: #fff; border: none;"
        >查询</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="editSiteVisible = false">取 消</el-button>
        <el-button class="confirm" @click="roomSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除站点 -->
    <el-dialog
      title="提示"
      :visible.sync="delSiteVisible"
      width="30%"
      modal
      :close-on-click-modal="false"
      :show-close="true"
    >
      <div style="width: 30px;float: left;margin: -7px 8px 5px -8px;">
        <i :class="{icon: true, 'iconfont': true, 'iconjinggao1': true}"></i>
      </div>
      <span>是否确认删除站点 {{ delName }} ?</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="delSiteVisible = false">取 消</el-button>
        <el-button class="confirm" @click="delSiteSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MyBreadcrumb from "../subcomponents/Mybreadcrumb";
import BMap from "BMap";
import BMapSymbolSHAPEPOINT from "BMap_Symbol_SHAPE_POINT";
import GLOBAL from '../../utils/global_variable'
import {
  checkPhone,
  checkEmail,
  findArrIndex,
} from "../../utils";
export default {
  inject: ["reload"], //注入依赖
  components: {
    MyBreadcrumb
  },
  data() {
    // 验证邮箱
    var checkAccountEmail = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入非空邮箱"));
      } else if (!checkEmail(value)) {
        callback(new Error("请输入正确的邮箱!"));
      } else {
        callback();
      }
    };
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
    return {
      activeName: "second",
      // 标签1
      companyForm: {},
      companyRules: {
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        file: [{ required: true, message: "请选择图片文件", trigger: "blur" }],
        area: [{ required: true, message: "请输入组织地址", trigger: "blur" }],
        responsibleName: [
          { required: true, message: "请输入负责人姓名", trigger: "blur" },
          { max: 16, message: "长度在 16个字符以下", trigger: "blur" }
        ],
        responsiblePhone: [
          { required: true, validator: checkPhoneNum, trigger: "blur" }
        ],
        adminName: [
          { required: true, message: "请输入管理员姓名", trigger: "blur" }
        ],
        admin: [
          { required: true, message: "请输入管理员账号", trigger: "blur" },
          { max: 16, message: "长度在 16个字符以下", trigger: "blur" }
        ],
        adminPhone: [
          { required: true, validator: checkPhoneNum, trigger: "blur" }
        ]
      },
      imgSrc: "",
      ruleForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      rules: {},
      userData: [],
      editUserVisible: false,
      userForm: {
        // checked: true,
        siteIds: [],
        roleId: 3,
        passWord: 888888,
        userName: "",
        name: "",
        mobile: "",
        email: ""
      },
      userRule: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { max: 16, message: "长度在 16个字符以下", trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { max: 16, message: "长度在 16个字符以下", trigger: "blur" }
        ],
        mobile: [{ required: true, validator: checkPhoneNum, trigger: "blur" }]
        // email: [
        //   { required: true, validator: checkAccountEmail, trigger: "blur" }
        // ]
        // siteIds: [
        //   { required: true, message: "请选择用户权限", trigger: "blur" }
        // ]
      },
      options: [],
      totalUser: 0,
      userPageSize: 10,
      userCurrentPage: 1,
      siteData: [],
      totalSite: 0,
      sitePageSize: 10,
      siteCurrentPage: 1,
      dialogTitle: "",
      delId: "", //存储需要删除的id
      delName: "", //存储需要删除的站点名称
      editSiteVisible: false,
      siteRules: {
        name: [{ required: true, message: "请输入站点描述", trigger: "blur" }],
        local: [{ required: true, message: "请填写经纬度", trigger: "blur" }]
      },
      companyList: [],
      siteForm: {
        name: "",
        latitude: "",
        longitude: ""
      },
      delSiteVisible: false,
      siteId: "",
      companyId: "", //当前登录用户的公司id
      searchCompanyId: "", //当前选项公司的id
      ifFormChange: 0, //监听表单是否改两次(数据初始化)
      baseInfo: {}, //基本信息存储，用于比较是否修改
      map: null //地图对象
    };
  },
  computed: {
    getSiteChange() {
      return this.$store.state.site.siteId;
    },
    // 告警返回值
    switch_warn(row) {
      return row.alarmSwitch === "1";
    }
  },
  watch: {
    getSiteChange() {
      // this.$nextTick(() => {
      if (this.$store.state.site.siteId) {
        this.siteCurrentPage = 1;
        this.getSite();
      }
      this.getUser();
      this.getLogo();
      this.getOrgDetail();
      // });
    },
    // 监听表单改变
    companyForm: {
      immediate: true,
      handler(val, oldVal) {
        this.ifFormChange++;
        console.log("change");
      },
      deep: true
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
    handleClick(tab, event) {},
    // 选中文件
    selectFile(event) {
      // 限制图片不大于200kb
      if (event.target.files[0].size / 1024 > 200) {
        this.$message({
          type: "info",
          message: "请选择小于200kb的图片！"
        });
        return;
      }
      this.companyForm.file = event.target.files[0];
      this.imgSrc = this.getObjectURL(event.target.files[0]);
      this.ifFormChange = 3; //可更新表单按钮状态
      // this.src = windowURL.createObjectURL(event.target.files[0]);
    },
    // 文件转地址
    getObjectURL(file) {
      var url = null;
      if (window.createObjectURL != undefined) {
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    // 新增编辑平台提交
    addOrgSubmit(event) {
      this.companyRules.file = null;
      this.$refs.companyRef.validate(valid => {
        // 编辑带图片
        if (valid && this.companyForm.file) {
          let formdata = new FormData();
          formdata.append("name", this.companyForm.name);
          formdata.append("file", this.companyForm.file);
          formdata.append("area", this.companyForm.area);
          formdata.append("responsibleName", this.companyForm.responsibleName);
          formdata.append(
            "responsiblePhone",
            this.companyForm.responsiblePhone
          );
          formdata.append("adminName", this.companyForm.adminName);
          formdata.append("admin", this.companyForm.admin);
          formdata.append("adminPhone", this.companyForm.adminPhone);
          formdata.append("id", this.companyForm.id);
          formdata.append("logo", this.companyForm.logo);

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
                this.ifFormChange = 1; //表单是否修改清零
                this.$root.Bus.$emit("changeCompanyName");
                // this.reload()
                // 当前用户信息刷新
                this.searchInfo();
                location.reload();
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
          // this.$delete(this.companyForm, "logo");
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
                this.ifFormChange = 1; //表单是否修改清零
                this.$root.Bus.$emit("changeLogo", 123);
                // this.reload()
                this.getUser();
                this.getSite();
                this.getLogo();
                this.getOrgDetail();
                // 当前用户信息刷新
                this.searchInfo();
                this.$root.Bus.$emit("changeCompanyName");
              } else {
                this.$notify.error({
                  title: "错误",
                  message: res.data.msg
                });
              }
            });
        }
      });
      // }
    },
    // 获取图标
    getLogo() {
      //  若无当前站点所属公司，则选择登录用户的公司id
      let id = this.$store.state.site.searchCompanyId
        ? this.$store.state.site.searchCompanyId
        : this.$store.state.site.companyId;
      // return
      this.$http
        .get("sysmanage/getLogo", {
          params: {
            companyId: id
          }
        })
        .then(res => {
          this.imgSrc = res.request.responseURL;
          let url = this.imgSrc;
        })
        .catch(res => {});
    },
    // 平台详情
    getOrgDetail() {
      // 根据当前站点所属公司或登录用户公司
      let id = this.$store.state.site.siteId
        ? this.$store.state.site.searchCompanyId
        : this.$store.state.site.companyId;
      this.$http
        .get("sysmanage/company/detail", {
          params: {
            id: id
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.companyForm = res.data.data;
          }
        })
        .catch(res => {});
    },
    // 用户编辑
    editUser(row) {
      this.editUserVisible = true;
      this.$http
        .get("sysmanage/sys/findOne", {
          params: {
            userId: row.userId
          }
        })
        .then(res => {
          this.userForm.userName = res.data.data.userDTO.userName;
          this.userForm.name = res.data.data.userDTO.name;
          this.userForm.passWord = res.data.data.userDTO.passWord;
          this.userForm.mobile = res.data.data.userDTO.mobile;
          this.userForm.email = res.data.data.userDTO.email;
          this.userForm.companyId = res.data.data.userDTO.companyId;
          this.userForm.roleId = res.data.data.userDTO.roleId;
          this.userForm.userId = res.data.data.userDTO.userId;
          this.userForm.siteIds = [];
          res.data.data.sites.forEach(item => {
            if (item.id) {
              this.userForm.siteIds.push(item.id);
            }
          });
        })
        .catch(res => {});
    },
    // 用户添加
    addUser() {
      this.editUserVisible = true;
    },
    // 用户表单提交
    editUserSubmit() {
      this.$refs.userRef.validate(valid => {
        if (valid) {
          // 用户新增提交
          if (this.userForm.siteIds.length > 0) {
            this.userForm.siteIds = this.userForm.siteIds.join(",");
          } else {
            // this.$delete(this.userForm,'siteIds')
            this.userForm.siteIds = "";
          }
          this.userForm.companyId = this.$store.state.site.searchCompanyId;

          if (!this.userForm.userId) {
            this.$http
              .post("sysmanage/sys/userCreate", this.userForm)
              .then(res => {
                if (res.data.code == 0) {
                  this.$notify({
                    title: "成功",
                    message: "新增成功",
                    type: "success"
                  });
                  this.editUserVisible = false;

                  this.getUser();
                } else {
                  // 还原权限值
                  this.userForm.siteIds = this.userForm.siteIds
                    ? this.userForm.siteIds
                        .split(",")
                        .map(item => parseInt(item))
                    : [];
                  this.$notify.warning({
                    message: res.data.msg
                  });
                }
              })
              .catch(res => {
                this.userForm.siteIds = this.userForm.siteIds
                  ? this.userForm.siteIds.split(",").map(item => parseInt(item))
                  : [];
              });
          } else {
            // 编辑提交
            this.$http
              .post("sysmanage/sys/userModify", this.userForm)
              .then(res => {
                if (res.data.code == 0) {
                  this.$notify({
                    title: "成功",
                    message: "修改成功",
                    type: "success"
                  });
                  this.editUserVisible = false;
                  // 通过中央事件刷新用户信息及右上角的用户名
                  this.$root.Bus.$emit("freshUserName");
                  this.getUser();
                  if (
                    this.userForm.userId == this.$store.state.userInfo.userId
                  ) {
                    this.searchInfo();
                  }
                } else {
                  // 还原权限值
                  this.userForm.siteIds = this.userForm.siteIds
                    ? this.userForm.siteIds
                        .split(",")
                        .map(item => parseInt(item))
                    : [];
                  this.$notify.warning({
                    message: res.data.msg
                  });
                }
              })
              .catch(res => {
                this.userForm.siteIds = this.userForm.siteIds
                  ? this.userForm.siteIds.split(",").map(item => parseInt(item))
                  : [];
              });
          }
        }
        // 用户编辑提交
      });
    },
    // 获取所有用户
    getUser() {
      this.$http
        .get("sysmanage/sys/userList", {
          params: {
            page: this.userCurrentPage - 1,
            size: this.userPageSize,
            companyId: this.$store.state.site.searchCompanyId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.userData = res.data.data.userList;
            this.totalUser = res.data.data.total;
          }
        });
    },
    userSizeChange(val) {
      this.userPageSize = val;
      this.getUser();
    },
    userCurrentChange(val) {
      this.userCurrentPage = val;
      this.getUser();
    },
    // 格式化用户表单
    clearUserInfo() {
      this.userForm = {
        siteIds: [],
        roleId: 3,
        passWord: 888888,
        email: "",
        mobile: "",
        userName: "",
        name: ""
      };
      this.$refs.userRef.resetFields();
    },
    // -------------------------------------------------------------------------
    addSite() {
      this.editSiteVisible = true;

      this.dialogTitle = "新增站点";
      if (
        this.$store.state.userInfo.companyId === 0 &&
        this.$store.state.userInfo.roleId === 1
      ) {
        this.companyList = JSON.parse(sessionStorage.getItem("companyList"));
        // this.siteForm.companyId = userInfo.companyId;
        let index = findArrIndex(
          this.$store.state.site.siteList,
          "id",
          this.$store.state.site.siteId
        );
        this.siteForm.companyId = this.$store.state.site.searchCompanyId;
      } else {
        this.companyList = [
          {
            id: this.$store.state.userInfo.companyId,
            name: this.$store.state.userInfo.companyName
          }
        ];
        this.siteForm.companyId = this.$store.state.userInfo.companyId;
      }
      // 异步获取地图，否则报错
      setTimeout(() => {
        this.$forceUpdate();
        this.drawMap();
      }, 100);
    },
    editSite(row) {
      if (row) {
        this.dialogTitle = "编辑站点";
        this.siteForm = {
          companyId: "",
          name: "",
          latitude: "",
          longitude: "",
          id: ""
        };
        this.$http
          .get("equipment/siteDetail", {
            params: {
              siteId: row.id
            }
          })
          .then(res => {
            this.companyList = [
              {
                id: res.data.data.companyId,
                name: res.data.data.companyName
              }
            ];
            this.siteForm.companyId = res.data.data.companyId;
            this.siteForm.name = res.data.data.name;
            this.siteForm.latitude = res.data.data.latitude;
            this.siteForm.longitude = res.data.data.longitude;
            this.siteForm.id = row.id;
            this.editSiteVisible = true;
          });
      } else {
        var index = this.$store.stata.site.siteList.findIndex(item => {
          return (this.$store.state.site.siteId = item.id);
        });
        var name = this.$store.state.site.siteList[index].name;
        var id = this.$store.state.site.siteList[index].companyId;
        this.companyList = [
          {
            id: id,
            name: name
          }
        ];
        this.siteForm = {
          name: "",
          companyId: id
        };
        this.editSiteVisible = true;
      }
      setTimeout(() => {
        this.$nextTick();
        this.drawMap();
      }, 100);
    },
    siteSizeChange(val) {
      this.sitePageSize = val;
      this.siteCurrentPage = 1;
      this.getSite();
    },
    siteCurrentChange(val) {
      this.siteCurrentPage = val;
      this.getSite();
    },
    delSite(row) {
      this.delId = row.id;
      this.delName = row.name;
      this.delSiteVisible = true;
    },
    // 查询该公司能看到的所有站点
    getSite() {
      var paramsObj = {
        size: this.sitePageSize,
        page: this.siteCurrentPage - 1,
        companyId: this.$store.state.site.searchCompanyId
      };
      this.$http
        .get("equipment/roomList", {
          params: paramsObj
        })
        .then(res => {
          this.tableLoading = false;
          if (res.data.code == 0) {
            this.siteData = res.data.data.roomList;
            this.options = this.siteData;
            let sites = this.siteData;
            this.totalSite = res.data.data.total;

            for (var i = 0; i < this.siteData.length; i++) {
              if (
                this.$store.state.site.companyId == 0 &&
                this.$store.state.userInfo.roleId === 1
              ) {
                var _companyList = JSON.parse(
                  sessionStorage.getItem("companyList")
                );
                for (var j = 0; j < _companyList.length; j++) {
                  if (this.siteData[i].companyId == _companyList[j].id) {
                    this.$set(
                      this.siteData[i],
                      "companyName",
                      _companyList[j].name
                    );
                    break;
                  }
                }
              } else {
                this.siteData[
                  i
                ].companyName = this.$store.state.userInfo.companyName;
              }
            }
          }
        })
        .catch(res => {});
    },
    before_close() {
      this.siteForm = {};
      this.$refs.siteRef.resetFields();
    },
    roomSubmit() {
      this.$refs.siteRef.validate(valid => {
        if (valid) {
          if (this.dialogTitle == "编辑站点") {
            this.$http.post("equipment/roomUpdate", this.siteForm).then(res => {
              if (res.data.code == 0) {
                this.$notify({
                  title: "成功",
                  message: "修改成功",
                  type: "success"
                });
                this.editSiteVisible = false;
                // 获取当前可选公司
                this.getSite();
                // 获取当前用户所用获取的所有站点
                this.getAllSites();
                // 更新用户列表
                this.getUser();
              } else {
                this.$message(res.data.msg);
              }
            });
          } else {
            this.$http.post("equipment/roomAdd", this.siteForm).then(res => {
              if (res.data.code == 0) {
                this.$notify({
                  title: "成功",
                  message: "新增成功",
                  type: "success"
                });
                this.editSiteVisible = false;
                this.currentPage = 1; //编辑数据后刷新至第一页
                // return
                this.getSite();
                // 获取当前用户所用获取的所有站点
                this.getAllSites();
              } else {
                this.$message(res.data.msg);
              }
            });
          }
        }
      });
    },
    delSiteSubmit() {
      this.$http
        .get("equipment/roomRemove", {
          params: {
            id: this.delId
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success"
            });
            this.currentPage = 1;
            this.getSite();
            // 获取当前用户所用获取的所有站点
            this.getAllSites();
            this.getUser();
          } else {
            this.$notify.error({
              title: "错误",
              message: res.data.msg
            });
          }
          this.delSiteVisible = false;
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
        .catch(res => {});
    },
    // 取消表单修改
    flashForm() {
      this.ifFormChange = 1;
      this.getOrgDetail();
      this.getLogo();
    },
    // 用户刷新用户信息
    searchInfo() {
      this.$http
        .get("sysmanage/sys/findOne", {
          params: {
            userId: this.$store.state.userInfo.userId
          }
        })
        .then(res => {
          this.userInfo = res.data.data.userDTO;
          // 更新用户vuex存储的用户信息
          this.$store.commit("saveUserInfo", this.userInfo);
        });
    },
    // 告警开关
    switch_change(row) {
      // console.log(row)
      this.$http
        .get("equipment/site/controAlarm", {
          params: {
            siteId: row.id
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.getAllSites();
          }
        });
    }
  },
  created() {
    this.$nextTick(() => {
      if (this.$store.state.site.siteId) {
        this.getSite();
        this.getAllSites();
      }
      this.getUser();
      this.getLogo();
      this.getOrgDetail();
    });
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
@import "../../assets/css/index.less";
.user {
  height: 100%;
  .header {
  }
  .content {
    height: calc(100% - 58px);
    display: -webkit-flex;
    justify-content: space-between;
    .aside {
      height: 150px;
      background-color: #fff;
      display: inline-block;
      width: 150px;
      box-sizing: border-box;
      overflow: hidden;
      .logo {
        border-bottom: 1px solid #7d7474;
        box-sizing: border-box;
        background-color: rgb(84, 92, 100);
        background-size: contain;
        display: block;
        width: 200px;
        width: 100%;
        height: 100%;
      }
    }
    .inner {
      height: 100%;
      // overflow: auto;
      width: calc(100% - 155px);
      background-color: @table-bgc;
      padding: 5px 5px 5px 10px;
      box-sizing: border-box;
      /* 换成卡片化标签页Tabs的样式 */
      & /deep/ .el-tabs--border-card {
        background-color: rgba(67, 92, 112);
        background: none;
        border: none;
        box-shadow: 0 0 4px #aaa;
        margin-right: 4px;
        height: 100%;
        @dis-flex();
        @flex-c();
        & > .el-tabs__header {
          background-color: rgba(67, 92, 112);
          border: none;
          .el-tabs__item {
            border-right-color: #435c70;
            border-left-color: #435c70;
            background: #54657d;
            margin-right: 3px;
            &.is-active {
              border-right-color: #435c70;
              border-left-color: #435c70;
              background: none;
            }
          }
        }
        & > .el-tabs__content {
          height: 0;
          @flex-1();
          overflow: auto;
        }
      }

      // 表单
      .form {
        width: 450px;
        & /deep/ .el-form-item {
          margin-bottom: 14px;
          .el-input__inner {
            height: 30px;
          }
        }
        .input-logo {
          position: relative;
          .input-file {
            position: absolute;
            width: 120px;
            height: 120px;
            opacity: 0;
            cursor: pointer;
          }
          .logo {
            width: 120px;
            height: 120px;
            background-color: #ccc;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
      // 用户管理
      .inner-table {
        margin-top: 8px;
        & /deep/ td {
          padding: 6px 0;
        }
        .tag-single {
          display: inline-block;
          height: 28px;
          margin-right: 5px;
          & /deep/ .el-tag {
            padding: none;
            background-color: rgba(64, 158, 255);
            border-color: rgba(64, 158, 255);
            color: #fff;
            line-height: 28px;
            height: 28px;
          }
        }
        .red {
          color: red;
        }
        .green {
          color: rgb(39, 182, 205);
        }
      }
    }
  }
  // 弹窗
  // 用户编辑
  .user-dialog {
    & /deep/ .el-dialog__body {
      padding-right: 50px;
      .el-input__inner {
        height: 34px;
      }
    }
  }
}
</style>