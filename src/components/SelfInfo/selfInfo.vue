<template>
  <div class="userInfo">
    <!-- 面包屑 -->
    <MyBreadcrumb level1="管理中心" level2="个人中心" />
    <!-- 个人中心 -->
    <div class="info-top">
      <img src="../../../static/img/charHead.png" alt />
    </div>
    <div class="info-main">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="信息概览" name="first">
          <div class="user-info">
            <div class="base-info">
              <p class="info-title">&nbsp;&nbsp;&nbsp;基本信息</p>
              <div class="block">
                <div class="row">
                  <span>用户名：</span>
                  <span>{{userInfo.userName}}</span>
                </div>
                <div class="row">
                  <span>真实姓名：</span>
                  <span>{{userInfo.name}}</span>
                </div>
              </div>
            </div>
            <div class="contact-info">
              <p class="info-title">&nbsp;&nbsp;&nbsp;联系方式</p>
              <div class="block">
                <div class="row">
                  <span>邮箱：</span>
                  <span>{{userInfo.email}}</span>
                </div>
                <div class="row">
                  <span>电话：</span>
                  <span>{{userInfo.mobile}}</span>
                </div>
              </div>
            </div>
            <div class="position-info">
              <p class="info-title">&nbsp;&nbsp;&nbsp;任职信息</p>
              <div class="block">
                <div class="row">
                  <span>平台：</span>
                  <span>{{userInfo.companyName}}</span>
                </div>
                <div class="row">
                  <span>岗位：</span>
                  <span>{{role}}</span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="信息修改" name="second">
          <div class="info-edit">
            <p style>&nbsp;&nbsp;&nbsp;信息修改</p>
            <el-form
              ref="infoRef"
              :rules="infoRule"
              :model="form"
              class="info-form"
              label-width="80px"
            >
              <el-form-item label="登录账号">
                <el-input v-model.trim="form.account" disabled style="width: 200px;"></el-input>
              </el-form-item>
              <el-form-item label="真实姓名" prop="name">
                <el-input v-model.trim="form.name" style="width: 200px;"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model.trim="form.email" style="width: 200px;"></el-input>
              </el-form-item>
              <el-form-item label="号码" prop="mobile">
                <el-input v-model.trim="form.mobile" style="width: 200px;"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmitInfo">确认修改</el-button>
                <el-button @click="cancelInfo">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="密码修改" name="third">
          <div class="password-edit">
            <p style>&nbsp;&nbsp;&nbsp;密码修改</p>
            <el-form
              :model="form2"
              status-icon
              :rules="rules2"
              ref="passRef"
              label-width="80px"
              class="password-form"
            >
              <el-form-item label="旧密码" prop="oldPass">
                <el-input
                  type="password"
                  style="width: 200px"
                  v-model.trim="form2.oldPass"
                  auto-complete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="pass">
                <el-input
                  type="password"
                  style="width: 200px"
                  v-model.trim="form2.pass"
                  auto-complete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPass">
                <el-input
                  type="password"
                  style="width: 200px;"
                  v-model.trim="form2.checkPass"
                  auto-complete="off"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitPass()">提交</el-button>
                <el-button @click="cancelPassword">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import MyBreadcrumb from "../subcomponents/Mybreadcrumb";
import {
  selectCompany,
  checkPhone,
  checkEmail,
} from "../../utils";
export default {
  // 局部注册
  components: {
    MyBreadcrumb
  },
  computed: {
    // userInfo.companyId
    role: function() {
      if (this.userInfo.roleId == 1) {
        return "系统研发运维";
      } else if (this.userInfo.roleId == 2) {
        return "系统管理员";
      } else {
        return "客户区域运维";
      }
    }
  },
  data() {
    // 新密码
    var validateOldPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入旧密码"));
      } else {
        if (value.length < 6) {
          callback(new Error("旧密码长度不少于六位!"));
        }
        callback();
      }
    };
    // 新密码
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (value.length < 6) {
          callback(new Error("密码长度不少于六位!"));
        }
        callback();
      }
    };
    // 确认新密码
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入确认密码"));
      } else if (value !== this.form2.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    // 验证邮箱
    var checkAccountEmail = (rule, value, callback) => {
      if (value === "") {
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
      userInfo: {},
      activeName: "first",
      form: {
        account: "",
        name: "",
        email: "",
        mobile: "",
        userId: ""
      },
      infoRule: {
        // email: [
        //   { required: true, validator: checkAccountEmail, trigger: "blur" }
        // ],
        name: [
          {
            required: true,
            message: "请输入非空真实姓名",
            trigger: "blur"
          }
        ],
        mobile: [
          {
            required: true,
            validator: checkPhoneNum,
            trigger: "blur"
          }
        ]
      },
      form2: {
        oldPass: "",
        pass: "",
        checkPass: ""
      },
      rules2: {
        oldPass: [
          {
            validator: validateOldPass,
            required: true,
            trigger: "blur"
          }
        ],
        pass: [
          {
            validator: validatePass,
            required: true,
            trigger: "blur"
          }
        ],
        checkPass: [
          {
            validator: validatePass2,
            required: true,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    handleClick(tab, event) {},
    submitPass() {
      this.$refs.passRef.validate(valid => {
        if (valid) {
          this.$http
            .post("/sysmanage/sys/changePassword", {
              oldPassword: this.form2.oldPass,
              passWord: this.form2.pass,
              userId: this.userInfo.userId
            })
            .then(res => {
              if (res.data.code == 0) {
                this.$notify({
                  message: res.data.msg,
                  type: "success"
                });
                this.form2.pass = "";
                this.form2.checkPass = "";
                this.activeName = "first";
              } else {
                this.$notify({
                  title: "错误",
                  message: res.data.msg,
                  type: "warning"
                });
              }
            });
        }
      });
    },
    resetForm(ruleRef) {
      this.$refs.ruleRef.resetFields();
    },
    onSubmitInfo() {
      this.$refs.infoRef.validate(valid => {
        if (valid) {
          this.$http
            .post("/sysmanage/sys/userModify", {
              userId: this.form.userId,
              name: this.form.name,
              mobile: this.form.mobile,
              email: this.form.email
            })
            .then(res => {
              if (res.data.code == 0) {
                this.userInfo.email = this.form.email;
                this.userInfo.mobile = this.form.mobile;
                this.$notify({
                  message: res.data.msg,
                  type: "success"
                });
                this.activeName = "first";
                this.searchInfo();
                // 更新用户信息
                this.$root.Bus.$emit("freshUserName");
              } else {
                this.$notify({
                  title: "错误",
                  message: res.data.msg,
                  type: "warning"
                });
              }
            })
            .catch(error => {});
        }
      });
    },
    cancelInfo() {
      this.$refs.infoRef.resetFields();
      this.form.name = this.userInfo.name;
      this.form.email = this.userInfo.email;
      this.form.mobile = this.userInfo.mobile;
    },
    cancelPassword() {
      this.form2.pass = "";
      this.form2.checkPass = "";
      this.$refs.passRef.resetFields();
    },
    searchInfo() {
      this.$http
        .get("sysmanage/sys/findOne", {
          params: {
            userId: this.$store.state.userInfo.userId
          }
        })
        .then(res => {
          // return
          if (res.data.code === 0) {
            this.userInfo = res.data.data.userDTO;
            this.form.account = this.userInfo.userName;
            this.form.name = this.userInfo.name;
            this.form.email = this.userInfo.email;
            this.form.mobile = this.userInfo.mobile;
            this.form.userId = this.userInfo.userId;
            // 通过中央事件刷新用户信息及右上角的用户名
            this.$root.Bus.$emit("freshUserName");
          }
        });
    }
  },
  created() {
    this.searchInfo();
    // 信息修改赋值
    this.form.name = this.userInfo.userName;
    this.form.email = this.userInfo.email;
    this.form.mobile = this.userInfo.mobile;
    this.form.userId = this.userInfo.userId;
  }
};
</script>
<style lang="less" scoped>
@import "../../assets/css/index.less";

.userInfo {
  height: 100%;
  @dis-flex();
  @flex-c();
  .info-top {
    width: 100%;
    height: 110px;
    background-color: @table-bgc;
    padding: 10px 12px;
    box-sizing: border-box;
    img {
      width: 90px;
      height: 90px;
      margin-right: 50px;
    }
  }
  //   信息概览
  .info-main {
    @flex-1();
    height: 0;
    // overflow: auto;
    margin-top: 15px;
    background-color: @table-bgc;
    padding: 25px;
    // height: calc(100% - 100px - 140px);
    // min-height: 510px;
    /deep/ .el-tabs {
      height: 100%;
      @dis-flex();
      @flex-c();
      .el-tabs__content {
        @flex-1();
        height: 0;
        overflow: auto;
      }
    }
    .user-info {
      width: 400px;
      overflow: hidden;
      .info-title {
        border-left: 2px solid skyblue;
        color: white;
        font-size: 18px;
      }
      .block {
        margin-left: 15px;
        .row {
          color: #aaa;
          margin: 15px 0;
          background-color: rgb(78, 101, 122);
          height: 30px;
          span {
            height: 30px;
            line-height: 30px;
            color: #cccccc;
          }
        }
      }
      .base-info {
      }
      .user-info .contact-info {
        margin: 30px 0;
      }
    }
  }
  //   信息修改
  .info-edit {
    p {
      border-left: 2px solid skyblue;
      margin-bottom: 15px;
      color: white;
      font-size: 18px;
    }
    .info-form {
      & {
        .el-button--primary {
          color: white;
          background-color: @primary-btn;
          border-color: @primary-btn;
        }
        .el-button--default {
          color: white;
          border-color: #1f9962;
          background-color: #1f9962;
        }
        .el-form-item {
          margin-bottom: 22px;
          .el-form-item__label {
            color: #cccccc;
          }
          .el-form-item__content {
            .is-disabled .el-input__inner {
              background-color: rgb(78, 101, 122);
              /* border-color: #E4E7ED; */
              border: none;
              color: #c0c4cc;
              cursor: not-allowed;
            }
            .el-input__inner {
              background-color: rgb(78, 101, 122);
              border-color: #e4e7ed;
              color: #c0c4cc;
            }
          }
        }
      }
    }
  }
  //   密码修改
  .password-edit {
    p {
      border-left: 2px solid skyblue;
      margin-bottom: 15px;
      color: white;
      font-size: 18px;
    }
    .password-form {
      & {
        .el-button--primary {
          color: white;
          background-color: @primary-btn;
          border-color: @primary-btn;
        }

        .el-button--default {
          color: white;
          border-color: #1f9962;
          background-color: #1f9962;
        }
        .el-form-item {
          margin-bottom: 22px;
          .el-form-item__label {
            color: #cccccc;
          }
          .el-form-item__content {
            .is-disabled .el-input__inner {
              background-color: rgb(78, 101, 122);
              border: none;
              color: #c0c4cc;
              cursor: not-allowed;
            }
            .el-input__inner {
              background-color: rgb(78, 101, 122);
              border-color: #e4e7ed;
              color: #c0c4cc;
            }
          }
        }
      }
    }
  }
}
</style>