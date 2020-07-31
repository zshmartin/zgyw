<template>
  <div class="equip-file">
    <MyBreadcrumb level1="设备运维" level2="电子档案" />
    <div class="content">
      <div class="c-left">
        <!-- 左边栏 -->
        <div class="aside scroll">
          <el-tree
            :data="tree"
            :props="defaultProps"
            ref="groupTree"
            node-key="id"
            :default-expand-all="defautTrue"
            :current-node-key="currentGroupId"
            :expand-on-click-node="defautFalse"
            :highlight-current="defautTrue"
            @node-click="handleNodeClick"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>
                <i class="el-icon-folder-opened"></i>
                <span>{{ node.label }}</span>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
      <div class="c-right">
        <div class="header">
          <h4>{{currentGroupName}}</h4>
          <div class="edit-btn">
            <el-button class="confirm" :disabled="!$store.state.site.siteId" @click="addGroup">+ 分组</el-button>
            <el-button class="confirm" icon="el-icon-edit" :disabled="!currentGroupId" @click="editGroupName">重命名</el-button>
            <el-button class="confirm" :disabled="!$store.state.site.siteId" @click="importFile" icon="el-icon-download">导入文件</el-button>
            <el-button
              class="del"
              icon="el-icon-delete"
              :disabled="!currentGroupId"
              @click="delGroup"
            >删除</el-button>
          </div>
        </div>
        <div class="inner-1">
          <div class="inner-2">
            <div class="inner-3">
              <el-table :data="fileOptions" border style="width: 100%">
                <el-table-column prop="name" label="文件名"></el-table-column>
                <el-table-column prop="uploadTime" label="上传时间"></el-table-column>
                <el-table-column prop="uploadUser" label="上传者" width="150"></el-table-column>
                <el-table-column prop="fileSize" label="文件大小" width="120">
                  <template slot-scope="scope">
                    {{scope.row.fileSize}}
                    <span>&nbsp;kb</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="220">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="下载" offset="-20" placement="top-start">
                      <el-button
                        icon="el-icon-download"
                        size="mini"
                        class="confirm"
                        @click="fileDownload(scope.row)"
                      ></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="转移" offset="-20" placement="top-start">
                      <el-button
                        icon="el-icon-top-right"
                        size="mini"
                        class="confirm"
                        @click="moveFile(scope.row)"
                      ></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" offset="-20" placement="top-start">
                      <el-button
                        icon="el-icon-delete"
                        size="mini"
                        class="confirm"
                        @click="delFile(scope.row)"
                      ></el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 编辑新增分组 -->
    <el-dialog
      :title="titleName"
      :visible.sync="editGroupVisible"
      width="420px"
      class="user-dialog"
    >
      <el-form
        :model="editGroupForm"
        :rules="editGroupRule"
        ref="editGroupRef"
        label-width="80px"
        class="user-form"
      >
        <el-form-item label="分组名称" prop="name">
          <el-input v-model="editGroupForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="editGroupVisible = false">取 消</el-button>
        <el-button class="confirm" @click="editGroupSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分组删除 -->
    <el-dialog
      :title="delTitle"
      :visible.sync="delGroupVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <div style="width: 30px;float: left;margin: -7px 8px 5px -8px;">
        <i :class="{icon: true, 'iconfont': true, 'iconjinggao1': true}"></i>
      </div>
      <span>是否确定删除分组 {{delGroupName}} ?</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="delGroupVisible = false">取 消</el-button>
        <el-button class="dang" @click="delGroupSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-------------------------------- 新增文件表单 --------------------->
    <el-dialog
      title="导入文件"
      :visible.sync="importFileVisible"
      :close-on-click-modal="false"
      width="500px"
      @close="fileClose"
    >
      <el-form :model="addFileForm" label-width="100px" class="form">
        <!-- <el-form-item label="选择文件" prop="file" style="position: relative;">
          <input
            @change="selectFile($event)"
            type="file"
            ref="input1"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />
        </el-form-item>-->
        <el-form-item label="自定义文件名" prop="name" style="position: relative;">
          <el-input :disabled="ifUpload" v-model="addFileForm.name"></el-input>
        </el-form-item>
        <!-- <div class="form-footer" style="display: flex; justify-content: center">
          <el-button
            class="cancel"
            @click="importFileVisible = false"
            style="    background-color: green;
          color: #fff;
          border: none;"
          >取 消</el-button>
          <el-button class="confirm" @click.prevent="fileSubmit">确 定</el-button>
        </div>-->
      </el-form>
      <el-upload
        action="#"
        :file-list="fileList"
        :on-change="changeData"
        :http-request="handleRequest"
        :before-upload="beforeUpload"
        style="padding-top: 10px"
        :disabled="ifUpload"
      >
        <el-button :disabled="ifUpload" class="btn upload-btn">上传附件</el-button>
        <div slot="tip" class="el-upload__tip">上传文件大小不超过50M</div>
      </el-upload>
      <el-progress
        v-show="ifUpload"
        style="margin-bottom: 10px;"
        :stroke-width="16"
        :percentage="progressPercent"
      ></el-progress>
    </el-dialog>
    <!-- 文件删除 -->
    <el-dialog
      :title="delTitle"
      :visible.sync="delFileVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <div style="width: 30px;float: left;margin: -7px 8px 5px -8px;">
        <i :class="{icon: true, 'iconfont': true, 'iconjinggao1': true}"></i>
      </div>
      <span>是否确定删除分组{{currentGroupName}}中的{{delFileName}}文件 ?</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="delFileVisible = false">取 消</el-button>
        <el-button class="dang" @click="delFileSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-------------------------------- 分组文件转移 --------------------->
    <el-dialog
      title="文件转移"
      :visible.sync="moveFileVisible"
      :close-on-click-modal="false"
      width="500px"
    >
      <el-form :model="moveFileForm" label-width="100px" class="form">
        <el-form-item label="文件转移位置" prop="name" style="position: relative;">
          <el-cascader
            :options="tree"
            :props="{ checkStrictly: true, label:'name', value:'id' }"
            label="name"
            v-model="groupArrId"
            value="id"
            clearable
          ></el-cascader>
        </el-form-item>
        <div class="form-footer" style="display: flex; justify-content: center">
          <el-button
            class="cancel"
            @click="moveFileVisible = false"
            style="    background-color: green;
          color: #fff;
          border: none;"
          >取 消</el-button>
          <el-button class="confirm" @click.prevent="moveFileSubmit">确 定</el-button>
        </div>
      </el-form>
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
    }
  },
  watch: {
    watchSiteChange() {
      this.getAllGroup();
    }
  },
  data() {
    return {
      tree: [], //属性结构数据
      defautTrue: true,
      defautFalse: false,
      defaultProps: {
        children: "children",
        label: "name"
      },
      fileOptions: [], //表格数据
      currentGroupName: "", //当前站点或分组
      currentGroupId: "", //当前分组id
      editGroupVisible: false, //编辑分组弹窗
      editGroupForm: {
        name: ""
      }, //编辑新增分组表单
      editGroupRule: {
        name: [{ required: true, message: "请输入分组名称", trigger: "blur" }]
      },
      titleName: "", //编辑新增分组弹窗标题名称
      ifAddGroup: false, //新增文件标识
      delGroupVisible: false, //删除分组的弹窗
      delGroupName: null, //删除分组的名称
      delGroupId: null, //删除分组的id
      delTitle: "提示",
      parentId: null, //父级id
      importFileVisible: false, //文件导入弹窗
      addFileForm: {}, //导入文件表单
      importFormName: null, //文件名
      delFileVisible: false,
      delFileName: false,
      delFileId: null,
      moveFileVisible: false,
      moveFileForm: {},
      groupArrId: [], //文件转移选中的分组id集合
      fileList: [], //弹窗文件列表
      ifUpload: false, //文件是否导入状态
      progressPercent: 0 //文件导入百分比
    };
  },
  computed: {
    getSiteChange() {
      return this.$store.state.site.siteId;
    }
  },
  watch: {
    getSiteChange() {
      this.fileOptions = [];
      this.currentGroupName = null;
      this.currentGroupId = 0;
      this.parentId = null;
      this.getAllGroup();
    }
  },
  mounted() {
    this.getAllGroup();
  },
  methods: {
    // 获取分组信息集合
    getAllGroup() {
      if (!this.$store.state.site.siteId) {
        return;
      }
      this.$http
        .get("equipment/fileClassify/getAll", {
          params: {
            siteId: this.$store.state.site.siteId,
            type: 1
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            // this.tree = res.data.data
            var TreeArr = [];
            TreeArr[0] = {
              name: this.$store.state.site.siteName,
              id: 0,
              children: []
            };
            // 过滤ifGroup为false的设备显示
            var arr = res.data.data.filter(item => {
              console.log(item);
              return item.ifGroup === true;
            });
            TreeArr[0].children = arr;
            this.tree = TreeArr;
            console.log(this.currentGroupId, this.currentGroupName);
            this.currentGroupName = this.currentGroupName
              ? this.currentGroupName
              : this.$store.state.site.siteName;
            if (this.currentGroupId) {
              this.$nextTick(() => {
                this.$refs.groupTree.setCurrentKey(this.currentGroupId);
              });
            } else {
              this.currentGroupId = 0;
              this.$nextTick(() => {
                this.$refs.groupTree.setCurrentKey(this.currentGroupId);
              });
              this.getFileByGroup();
            }
          }
        });
    },
    // 新建分组
    addGroup() {
      this.ifAddGroup = true;
      this.editGroupVisible = true;
      this.titleName = "新建分组 (" + this.currentGroupName + ")";
    },
    editFile() {},
    handleNodeClick(data, node, event) {
      console.log(node);
      if (node.level === 1) {
        this.fileOptions = [];
        this.currentGroupName = data.name;
        this.currentGroupId = null;
        this.parentId = null;
        this.getFileByGroup();
      } else {
        this.currentGroupName = data.name;
        this.currentGroupId = data.id;
        if (node.level === 2) {
          this.parentId = null;
        } else {
          this.parentId = node.parent.key;
        }
        this.getFileByGroup();
      }
    },
    // 查询分组下文件集合
    getFileByGroup() {
      this.$http
        .get("equipment/electronicFile/files", {
          params: {
            groupId: this.currentGroupId ? this.currentGroupId : 0, //undefined,null,0,'null'
            siteId: this.$store.state.site.siteId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.fileOptions = res.data.data;
          }
        });
    },
    handleClick(row) {
      console.log(row);
    },
    // 编辑分组
    editGroupName() {
      this.titleName = "编辑分组 (" + this.currentGroupName + ")";
      this.editGroupVisible = true;
      this.$nextTick(item => {
        this.$refs.editGroupRef.resetFields();
        this.editGroupForm.name = this.currentGroupName;
        this.editGroupForm.id = this.currentGroupId;
        this.ifAddGroup = false;
      });
      // this.$refs.editGroupRef.resetFields();
    },
    // 新增编辑分组提交
    editGroupSubmit() {
      this.$refs.editGroupRef.validate(valid => {
        console.log(valid);
        if (valid) {
          if (this.ifAddGroup) {
            this.$http
              .post("equipment/fileClassify/addClassify", {
                name: this.editGroupForm.name,
                type: 1,
                siteId: this.$store.state.site.siteId,
                parentId: this.currentGroupId ? this.currentGroupId : 0
              })
              .then(res => {
                if (res.data.code === 0) {
                  this.$notify({
                    message: "新增成功",
                    type: "success"
                  });
                  this.editGroupVisible = false;
                  this.getAllGroup();
                } else {
                  this.$notify({
                    message: res.data.message,
                    type: "warning"
                  });
                }
              });
          } else {
            this.$http
              .post("equipment/fileClassify/modify", {
                id: this.currentGroupId,
                name: this.editGroupForm.name,
                siteId: this.$store.state.site.siteId,
                type: 1,
                parentId: this.parentId ? this.parentId : 0
              })
              .then(res => {
                if (res.data.code === 0) {
                  this.$notify({
                    message: "编辑成功",
                    type: "success"
                  });
                  this.editGroupVisible = false;
                  this.getAllGroup();
                } else {
                  this.$notify({
                    message: res.data.message,
                    type: "warning"
                  });
                }
              });
          }
        }
      });
      // return
    },
    // 删除分组
    delGroup() {
      this.delGroupVisible = true;
      this.delGroupId = this.currentGroupId;
      this.delGroupName = this.currentGroupName;
    },
    // 删除分组提交
    delGroupSubmit() {
      this.$http
        .get("equipment/fileClassify/del", {
          params: {
            id: this.delGroupId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$notify({
              message: "删除成功",
              type: "success"
            });
            this.delGroupVisible = false;
            this.delGroupName = null;
            this.delGroupId = null;
            this.currentGroupName = null;
            this.currentGroupId = null;
            this.getAllGroup();
          } else {
            this.$notify({
              message: res.data.msg,
              type: "warning"
            });
          }
        });
    },

    // 导入文件
    importFile() {
      // 重置内容
      this.importFileVisible = true;
      // this.$nextTick(() => {
      //   let file = this.$refs.input1;
      //   file.value = "";
      //   this.$delete(this.addFileForm, "file");
      // });
    },
    // 文件提交
    fileSubmit() {
      if (this.addFileForm.file) {
        // return;
        // 计算公司Id
        let index = this.$store.state.site.siteList.findIndex((item, index) => {
          return item.id == this.$store.state.site.siteId;
        });
        let companyId = this.$store.state.site.siteList[index].companyId;
        let formdata = new FormData();
        // 补全文件后缀
        var name = this.addFileForm.name
          ? this.addFileForm.name.includes(".")
            ? this.addFileForm.name
            : this.addFileForm.name + "." + this.importFormName.split(".")[1]
          : this.importFormName;
        formdata.append("name", name);
        formdata.append("uploadUser", this.$store.state.userInfo.name);
        formdata.append(
          "groupId",
          this.currentGroupId ? this.currentGroupId : 0
        );
        formdata.append("file", this.addFileForm.file);
        formdata.append("siteId", this.$store.state.site.siteId);
        let config = {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        };
        console.log(formdata);
        // return
        this.$http
          .post("equipment/electronicFile/uploadFile", formdata, config)
          .then(res => {
            if (res.data.code == 0) {
              this.$notify({
                title: "成功",
                message: "上传成功",
                type: "success"
              });
              this.importFileVisible = false;
              this.getFileByGroup();
            } else {
              this.$notify({
                title: "失败",
                message: res.data.msg,
                type: "warning"
              });
            }
          });
      } else {
        this.$notify({
          message: "请选择文件",
          type: "warning"
        });
      }
    },
    selectFile(event) {
      console.log(event);
      this.addFileForm.file = event.target.files[0];
      this.importFormName = event.target.files[0].name;
    },
    // 删除文件
    delFile(row) {
      this.delFileId = row.id;
      this.delFileName = row.name;
      this.delFileVisible = true;
    },
    // 删除文件提交
    delFileSubmit() {
      this.$http
        .get("equipment/electronicFile/del", {
          params: {
            id: this.delFileId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success"
            });
            this.delFileVisible = false;
            this.getFileByGroup();
          } else {
            this.$notify({
              title: "失败",
              message: res.data.msg,
              type: "warning"
            });
          }
        });
    },
    // 文件下载
    fileDownload(row) {
      this.$http({
        methods: "GET",
        url: "equipment/electronicFile/downLoadFile",
        params: { id: row.id },
        responseType: "arraybuffer"
        // 设置responseType: 'arraybuffer': 解决下载下来的文件乱码问题
      })
        .then(res => {
          console.log(res);
          const link = document.createElement("a");
          const blob = new Blob([res.data], {
            type: "multipart/form-data" //二进制流
          });
          let href = window.URL.createObjectURL(blob);
          link.href = href;
          let _fileName = res.headers["content-disposition"]
            .split(";")[1]
            .split("=")[1];
          // .split(".")[0];

          console.log(_fileName);
          console.log(decodeURIComponent(_fileName));
          // 文件名中有中文 则对文件名进行转码
          link.download = decodeURIComponent(_fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(href);
          this.$notify({
            message: "文件已下载",
            type: "success"
          });
        })
        .catch(err => {});
    },
    // 文件转移
    moveFile(row) {
      this.moveFileVisible = true;
      this.moveFileForm.groupId = null;
      this.groupArrId = [];
      this.moveFileForm.id = row.id;
      this.moveFileForm.name = row.name;
      this.moveFileForm.uploadUser = row.uploadUser;
      this.moveFileForm.fileSize = row.fileSize;
      this.moveFileForm.uploadUrl = row.uploadUrl;
      this.moveFileForm.uploadTime = row.uploadTime;
      this.moveFileForm.siteId = this.$store.state.site.siteId;
    },
    // 文件转移提交
    moveFileSubmit() {
      if (this.groupArrId.length > 0) {
        this.moveFileForm.groupId = this.groupArrId[this.groupArrId.length - 1];
        this.$http
          .post("equipment/electronicFile/modify", this.moveFileForm)
          .then(res => {
            if (res.data.code === 0) {
              this.$notify({
                message: "操作完成",
                type: "success"
              });
              this.moveFileVisible = false;
              this.getFileByGroup();
            } else {
              this.$notify({
                message: res.data.msg,
                type: "warning"
              });
            }
          })
          .catch(res => {});
      }
    },
    // 赋值文字
    copyToClip() {
      var aux = document.createElement("input");
      aux.setAttribute("value", content);
      document.body.addendChild(aux);
      aux.select();
      document.execCommand("copy");
      document.body.removeChild(aux);
      if (message == null) {
        alert("复制成功");
      } else {
        alert(message);
      }
    },
    // 复制url
    copyUrl(row) {
      var hostport = document.location.host; //ip:端口号
      var ip;
      if (process.env.NODE_ENV === "development") {
        ip = "http://192.168.101.8:9000/equipment"; //开发环境地址，默认ip---192.168.101.8
      } else if (process.env.NODE_ENV === "production") {
        ip = "http://" + hostport + "/equipment"; //生产环境地址
      }
      var aux = document.createElement("input");
      aux.setAttribute("value", ip + row.uploadUrl);
      document.body.appendChild(aux);
      aux.select();
      document.execCommand("copy");
      document.body.removeChild(aux);
    },
    //上传前对文件大小进行校验
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 50;
      console.log(isLt2M);
      if (!isLt2M) {
        this.$message.error("上传文件大小大小不能超过 50MB!");
        this.fileList = [];
        this.progressPercent = 0;
        this.ifUpload = false;
        return isLt2M;
      }
    },
    changeData(file, fileList) {
      this.ifUpload = true;
      // 数据小于0.1M的时候按KB显示
      const size =
        file.size / 1024 / 1024 > 0.1
          ? `(${(file.size / 1024 / 1024).toFixed(1)}M)`
          : `(${(file.size / 1024).toFixed(1)}KB)`;
      file.name.indexOf("M") > -1 || file.name.indexOf("KB") > -1
        ? file.name
        : (file.name += size);
    },
    // 上传文件
    handleRequest(data) {
      let index = this.$store.state.site.siteList.findIndex((item, index) => {
        return item.id == this.$store.state.site.siteId;
      });
      let companyId = this.$store.state.site.siteList[index].companyId;
      let formdata = new FormData();
      var name;
      if (this.addFileForm.name) {
        if (this.addFileForm.name.includes(".")) {
          name = this.addFileForm.name;
        } else {
          var arr = data.file.name.split(".");
          name = this.addFileForm.name + "." + arr[arr.length - 1];
        }
      } else {
        name = data.file.name;
      }
      formdata.append("name", name);
      formdata.append("uploadUser", this.$store.state.userInfo.name);
      formdata.append("groupId", this.currentGroupId ? this.currentGroupId : 0);
      formdata.append("file", data.file);
      formdata.append("siteId", this.$store.state.site.siteId);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: progressEvent => {
          // progressEvent.loaded:已上传文件大小
          // progressEvent.total:被上传文件的总大小
          this.progressPercent = Number(
            ((progressEvent.loaded / progressEvent.total) * 100).toFixed(2)
          );
        }
      };
      this.actionURL = "equipment/electronicFile/uploadFile";

      this.$http
        .post(this.actionURL, formdata, config)
        .then(res => {
          if (res.data.code === 0) {
            // alert("成功");

            this.$notify({
              title: "导入成功",
              type: "success"
            });
            // 设置0.3秒延迟关闭弹窗
            setTimeout(() => {
              this.importFileVisible = false;
            }, 300);
            this.getFileByGroup();
          }
        })
        .catch(res => {
          // this.importFileVisible = false;
          this.fileList = [];
          // this.update
          this.ifUpload = false;
          this.progressPercent = 0;
          if (res.data.code) {
            this.$notify({
              message: res.data.msg,
              type: "warning"
            });
          }
        });
    },
    fileClose() {
      this.addFileForm.name = "";
      this.ifUpload = false;
      this.progressPercent = 0;
      this.fileList = [];
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/index.less";
.equip-file {
  height: 100%;
  @dis-flex();
  @flex-c();
  .content {
    @flex-1();
    @dis-flex();
    // 解决flex属性子元素超出滚动处理
    height: 0;
    .c-left {
      width: 260px;
      margin-right: 10px;
      background: @content-bgc;
      padding: 6px;
      box-sizing: border-box;
      overflow: auto;
    }
    .c-right {
      @flex-1();
      width: 0;       //解决element table  bug
      @dis-flex();
      @flex-c();
      background: @content-bgc;
      padding: 10px 10px 0;
      box-sizing: border-box;
      .header {
        margin-bottom: 4px;
        @dis-flex();
        justify-content: space-between;
        align-items: center;
      }
      h4 {
        color: white;
      }
      .inner-1 {
        @flex-1();
        height: 0;
        .inner-2 {
          height: 100%;
          overflow: auto;
          .inner-3 {
          }
        }
      }
    }
  }
}
</style>