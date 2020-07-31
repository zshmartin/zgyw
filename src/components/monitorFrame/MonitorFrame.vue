<template>
  <div class="frame">
    <div class="label">
      <div>
        <el-tag
          :key="index"
          v-for="(item,index) in tagsArr"
          closable
          :disable-transitions="false"
          @close="handleClose(item)"
          @click="tagClick(item.id)"
          :class="{light: tagId === item.id,}"
        >{{item.name}}</el-tag>
      </div>
      <div>
        <el-button size="mini" class="confirm" :disabled="!getSiteChange" @click="addMonitorFrame">+ 添加监控画面</el-button>
        <el-button size="mini" class="confirm" :disabled="!tagId" @click="frashFrame">刷新</el-button>
      </div>
    </div>

    <div class="show">
      <iframe
        :src="url"
        style="height: 100%;width: 100%; frameborder=no"
        frameborder="no"
        border="0"
        marginwidth="0"
        marginheight="0"
      ></iframe>
      <div class="edit">
        <el-button v-show="tagId" @click="editMonitorFrame" icon="el-icon-edit"></el-button>
      </div>
    </div>
    <!--------------------------------- 删除分组弹窗 -->
    <el-dialog
      title="删除监控画面"
      :visible.sync="monitorDeleteVisible"
      width="540px"
      modal
      modal-append-to-body
      :close-on-click-modal="false"
      @close="before_del_monitor_close"
    >
      <div style="width: 30px;float: left;margin: -7px 8px 5px -8px;">
        <i :class="{icon: true, 'iconfont': true, 'iconjinggao1': true}"></i>
      </div>
      <span>{{'是否确定删除' + delMonitorName + '？'}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="monitorDeleteVisible = false">取 消</el-button>
        <el-button class="dang" @click="deleteMonitorSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: "", //内嵌页面url
      tagsArr: [], //标签集合
      tagId: null,
      monitorDeleteVisible: false,
      delMonitorName: ""
    };
  },
  computed: {
    getSiteChange() {
      return this.$store.state.site.siteId;
    }
  },
  watch: {
    getSiteChange() {
      this.getFrameTitle();
    }
  },
  mounted() {
    // return
    this.getFrameTitle();
  },
  methods: {
    getFrameTitle() {
      if(!this.$store.state.site.siteId) {
        this.tagsArr = [];
        this.tagId = null;
        this.url = ''
        return 
      } 
      this.$http
        .get("equipment/monitor/findAllBySite", {
          params: {
            site: this.$store.state.site.siteId
            // site: 1,
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.tagsArr = res.data.data;
            if (this.tagsArr.length > 0) {
              this.tagId = this.tagsArr[0].id;
              this.frashFrame();
            } else {
              this.url = "";
            }
          }
        });
    },
    handleClose(tag) {
      this.delMonitorName = tag.name;
      this.delTagId = tag.id;
      this.monitorDeleteVisible = true;
    },
    tagClick(tag) {
      this.tagId = tag;
      this.url = "http://112.74.16.135:9008/screen/" + this.tagId;
    },
    frashFrame() {
      if(this.tagId) {
        this.url = ''
        setTimeout(() => {
          this.url = "http://112.74.16.135:9008/screen/" + this.tagId;
        }, 500);
      }
    },
    deleteMonitorSubmit() {
      this.$http
        .get("equipment/monitor/deleteScreen", {
          params: {
            id: this.delTagId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$notify({
              message: res.data.msg,
              type: "success"
            });
            this.monitorDeleteVisible = false;
            this.delTagId = null;
            this.getFrameTitle();
          } else {
            this.$notify.error({
              message: res.data.msg
            });
          }
        });
    },
    before_del_monitor_close() {},
    addMonitorFrame() {
      if(!this.$store.state.site.siteId) {
        url = ''
        window.open(url);
        return 
      }
      var url =
        "http://112.74.16.135:9008/workspace?site=" +
        this.$store.state.site.siteId;
      window.open(url);
    },
    editMonitorFrame() {
      // var url = 'http://112.74.16.135:9008/workspace?site=279&id=56'
      if(!this.$store.state.site.siteId) {
        url = ''
        window.open(url);
        return 
      }
      var url =
        "http://112.74.16.135:9008/workspace?site=" +
        this.$store.state.site.siteId +
        "&id=" +
        this.tagId;
      window.open(url);
    },
    flushFrame() {

    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/index.less";
.frame {
  width: 100%;
  height: 100%;
  @dis-flex();
  @flex-c();
  .label {
    margin-bottom: 6px;
    @dis-flex();
    justify-content: space-between;
    // 高亮颜色
    .light {
      color: @font-select-color;
    }
    .el-tag {
      padding: 0 10px;
      cursor: pointer;
    }
    // + 代表兄弟元素
    .el-tag + .el-tag {
      margin-left: 10px;
    }
    & /deep/ .button-new-tag {
      margin-left: 10px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .input-new-tag {
      width: 90px;
      margin-left: 10px;
      vertical-align: bottom;
    }
    & /deep/ .el-button--small {
      padding: 0 15px !important;
    }
  }
  .show {
    @flex-1();
    background: white;
    position: relative;
    .edit {
      position: absolute;
      top: 10px;
      left: 10px;
    }
  }
}
</style>