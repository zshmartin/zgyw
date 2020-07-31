<template>
  <div class="login">
    <el-form
      :model="userObj"
      :rules="loginRules"
      ref="userRef"
      label-width="30px"
      class="logo-ruleForm"
    >
      <h3 class="title">智工运管平台</h3>
      <el-form-item class="user col" label prop="name">
        <div class="font">
          <i class="icon iconfont iconme"></i>
        </div>
        <el-input v-model.trim="userObj.name" placeholder="用户名" @keyup.enter.native="submitForm" v-focus></el-input>
      </el-form-item>
      <el-form-item class="psw col" label prop="password">
        <div class="font">
          <i class="icon iconfont iconpassword"></i>
        </div>
        <el-input
          type="password"
          placeholder="密码"
          v-model.trim="userObj.password"
          @keyup.enter.native="submitForm"
        ></el-input>
      </el-form-item>
      <el-form-item class="user col" label prop="code">
        <div class="font">
          <i class="icon iconfont iconSecuritycheck"></i>
        </div>
        <el-input
          v-model.trim="userObj.code"
          placeholder="验证码"
          style="width: 130px;"
          @keyup.enter.native="submitForm"
        ></el-input>
        <img @click="changeSrc" :src="imgSrc" alt />
      </el-form-item>

      <el-form-item class="handle">
        <el-button type="primary" @click="submitForm">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getUUID } from "../../utils/index";
// 导入vuex里面mutation
import {mapMutations} from 'vuex';
export default {
  data() {
    return {
      // 登录按钮加载中
      // loginLoad: false,
      userObj: {
        name: "",
        password: "",
        code: "",
        uuid: ""
      },
      imgSrc: "",
      loginRules: {
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "长度在6个字符以上", trigger: "blur" }
        ],
        code: [{ required: true, message: "请输入图片验证码", trigger: "blur" }]
      },
      remenber: true
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getUserInfoBySession()
    })
  },
  created() {
    // 重置仓库
    this.clearState()
    this.changeSrc();
    // this.getScreenSize()
  },
  methods: {
    // 映射mutations里面的方法
    ...mapMutations(['clearState', 'saveScreenSize']),
    // 获取用户信息
    getUserInfoBySession() {
      this.$http
        .get("/sysmanage/sys/userInfo", {
          params: {}
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$router.push('layout')
          } else {
          }
        });
    },
    getScreenSize() {
      var windowWidth = window.screen.width;      //屏幕宽
      var windowHeight = window.screen.height;      //屏幕高
      var screenSize = {
        width: windowWidth,
        height: windowHeight,
      }
      this.saveScreenSize(screenSize)
    },
    submitForm() {
      this.$refs.userRef.validate(valid => {
        if (valid) {
          this.loginLoad = true;
          this.$http
            // .post("/api/login", {
            .post("/sysmanage/sys/login", {
              userName: this.userObj.name,
              pwd: this.userObj.password,
              uuid: this.userObj.uuid,
              code: this.userObj.code
            })
            .then(res => {
              console.log(res.data.code)
              if (res.data.code == 0) {
                let userInfo = res.data.data;
                this.$router.push("/Layout"),
                  this.$notify({
                    message: res.data.msg,
                    type: "success"
                  });
              } else {
                this.$notify({
                  title: "错误",
                  message: res.data.msg,
                  type: "warning"
                });
                this.changeSrc();
                this.userObj.code = "";
              }
            })
            .catch(res => {
            });
        }
      });
    },
    getUrl() {
      this.$nextTick(() => {
        this.$http
          .get("/sysmanage/captcha.jpg", {
            params: {
              uuid: this.userObj.uuid
            }
          })
          .then(res => {
            this.imgSrc = res.request.responseURL;
          });
      });
    },
    // 更换验证码
    changeSrc() {
      this.userObj.uuid = getUUID();
      this.getUrl();
    },
    forget_pwd() {
      alert("请联系管理员！");
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/index.less";
.login {
  background: url("../../../static/img/background.jpg") no-repeat;
  background-size: cover;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .logo-ruleForm {
    width: 360px;
    border: 1px solid #cac6c6;
    border-radius: 10px;
    padding: 20px 15px;
    box-sizing: border-box;
    box-shadow: 0 0 25px #cac6c6;
    background-color: rgba(20, 3, 3, 0.2);
    margin: 0 auto;
    margin-left: 15%;
    margin-top: 12%;
    .title {
      text-align: center;
      color: white;
      margin-bottom: 10px;
    }

    .psw {
      width: 100%;
      margin-left: -15px;
    }
    .user {
      width: 100%;
      margin-left: -15px;
      img {
        width: 160px;
        height: 40px;
        border-radius: 5px;
      }
    }
    .handle {
      margin: 20px auto;
      display: -webkit-flex;
      justify-content: center;
      & /deep/ .el-form-item__content {
        margin-left: 0;
        margin-right: 30px;
        width: 250px;
        .el-button {
          width: 100%;
        }
      }
    }
    .el-form-item {
      margin-bottom: 22px;
      .el-form-item__content {
        .font {
          position: absolute;
          z-index: 999;
          right: 14px;
          color: skyblue;
        }
        .el-input {
          .el-input__inner {
            margin-left: 15px;
          }
        }
      }
    }
    .col /deep/ .el-form-item__babel {
      color: white;
    }
  }
}
</style>