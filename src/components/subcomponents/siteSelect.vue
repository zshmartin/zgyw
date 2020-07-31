<template>
  <!-- 当前站点组件 -->
  <div class="site">
    <span style="font-size: 14px; margin-right: 6px; color: #fff;">当前站点</span>
    <el-select
      v-model="site"
      placeholder="请选择"
      @change="siteChange"
      @visible-change="frashSite"
      size="mini"
      :disabled="!Boolean(site)"
    >
      <el-option v-for="(item,index) in options" :key="index" :label="item.name" :value="item.id"></el-option>
    </el-select>
  </div>
  <!-- </div> -->
</template>

<script>
import { selectCompany } from "../../utils/index";
export default {
  // props中接受的值，可以使任何类型
  props: {},
  data() {
    return {
      options: [
        {
          id: "",
          name: ""
        }
      ],
      value: "",
      site: ""
    };
  },
  computed: {
    getSites() {
      return this.$store.state.site.siteList;
    },
  },
  watch: {
    // 监听所有站点是否改变
    getSites: {
      handler(newVal, oldVal) {
        // alert(1)
        console.log(newVal);
        this.options = this.$store.state.site.siteList;
        this.site = this.$store.state.site.siteId;
      },
      deep: true
    },
  },
  methods: {
    valChange(value) {
      // this.$store.commit("valChange", value);
      var company = selectCompany(
        value,
        JSON.parse(sessionStorage.getItem("companyList"))
      );
      this.$store.commit("selectChange", company);
    },
    siteChange(val) {
      let index = this.$store.state.site.siteList.findIndex((item, index) => {
        return item.id == val;
      });
      let siteObj = {
        name: this.$store.state.site.siteList[index].name,
        id: val,
        searchCompanyId: this.$store.state.site.siteList[index].companyId
      };

      this.$store.commit("siteChange", siteObj);
    },
    search_site() {
      console.log(this.$store.state.site.siteList.length);
      console.log(this.$store.state.site);
      if (this.$store.state.site.siteList.length > 0) {
        this.site = this.$store.state.site.siteId;
        this.options = this.$store.state.site.siteList;
      } else {
        console.log("new");
        this.$http
          .get("equipment/roomList", {
            params: {
              page: 0,
              size: 1000,
              companyId: JSON.parse(sessionStorage.getItem("userInfo"))
                .companyId
            }
          })
          .then(res => {
            console.log(res);
            if (res.data.code == 0) {
              console.log(res.data.data);
              this.options = res.data.data.roomList;
              this.$nextTick(() => {
                this.site = this.options[0].id;
              });
              // this.send(this.site);
              this.$store.commit("site_change", this.options);
            }
          });
      }
    },
    // 下拉当前站点刷新站点
    frashSite(flag) {
      if(!flag) {
        return
      }
      var paramsObj = {
        size: 1000,
        page: 0,
        companyId: this.$store.state.site.companyId
      };
      this.$http
        .get("equipment/roomList", {
          params: paramsObj
        })
        .then(res => {
          console.log(res);
          let list = res.data.data.roomList;
          let param = {
            sites: list,
            companyId: this.$store.state.site.companyId
          };
          this.$store.commit("siteUpdate", param);
        })
        .catch(res => {
          console.log(res);
        });
    }
    // send(val) {
    //   this.$emit("roomChange", val);
    // },
  },
  created() {
    this.options = this.$store.state.site.siteList;
    this.site = this.$store.state.site.siteId;
  }
};
</script>

<style lang="less" scoped>
@import '../../assets/css/index.less';
/* .bread {
  position: relative;
  display: block;
  height: 100%;
  width: auto;
}

.bread > .site {
  position: absolute;
  right: 170px;
  bottom: 5px;
} */
.site {
  width: 266px;
  display: inline-block;
}

.site /deep/ input.el-input__inner {
  height: 36px !important;
  border: none;
}
input.el-input__inner:focus {
  /* border: none; */
}
input.el-input__suffix {
  height: 36px;
}
</style>