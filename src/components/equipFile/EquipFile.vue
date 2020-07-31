<template>
  <div class="equip-file">
    <MyBreadcrumb level1="设备运维" level2="设备档案" />
    <div class="content">
      <div class="c-left">
        <div class="aside">
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
                <i :class="{'el-icon-folder-opened': data.ifGroup}"></i>
                <span>{{ node.label }}</span>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
      <div class="c-right">
        <!-- 当前设备不存则不显示操作 -->
        <div class="header" v-if="tree.length">
          <h4>{{ifMeterShow ? '设备信息' : ifEquipShow ? '类型信息' : ''}}</h4>
          <div class="edit-btn" v-show="!ifMeterShow">
            <el-button class="confirm" :disabled="ifEquipShow" @click="addGroup">+ 分组</el-button>
            <el-button
              class="confirm"
              :disabled="currentGroupId === 0"
              icon="el-icon-edit"
              @click="editGroupOrEquip"
            >重命名</el-button>
            <el-button class="confirm" :disabled="ifEquipShow" @click="addEquip">+ 添加设备</el-button>
            <el-button
              class="del"
              icon="el-icon-delete"
              :disabled="currentGroupId === 0"
              @click="delGroupOrEquip"
            >删除</el-button>
          </div>
        </div>
        <div class="inner" v-show="ifEquipShow || ifMeterShow">
          <!-- 设备 -->
          <div class="equip-info" v-show="ifEquipShow">
            <div class="edit">
              <el-form
                class="form"
                ref="editEquipInfoRef"
                :rules="editEquipRules"
                :model="editEquipInfoForm"
              >
                <div class="single">
                  <div class="input-logo">
                    <input
                      :key="equipUploadImgKey"
                      @change="selectFile($event)"
                      class="input-file"
                      type="file"
                      accept="image/*"
                      style
                    />
                    <div style v-show="!equipImgSrc" class="logo">
                      <i class="el-icon-plus" style="heigth: 14px; display: block;"></i>
                    </div>
                    <img
                      id="imgId"
                      :src="equipImgSrc"
                      alt
                      v-show="equipImgSrc"
                      style="width: 100%; height: 100%; background-color: #ccc;"
                    />
                    <div style="position: absolute; left: 100px; bottom: -20px;">
                      <span style="color: #ccc;">(点击修改图片，建议宽高尺寸1:1)</span>
                    </div>
                    <div class="code">
                      <img :src="codeSrc" alt />
                    </div>
                  </div>
                  <div class="block-right">
                    <div class="sin-right">
                      <div class="attr">设备名称</div>
                      <el-input v-model.trim="editEquipInfoForm.name"></el-input>
                    </div>
                    <div class="sin-right">
                      <div class="attr">巡检周期</div>
                      <el-input-number
                        size="mini"
                        :min="default_zero"
                        v-model.trim="editEquipInfoForm.polling"
                      ></el-input-number>
                      <div class="day">天</div>
                    </div>
                    <div class="sin-right">
                      <div class="attr">保养周期</div>
                      <el-input-number
                        size="mini"
                        :min="default_one"
                        v-model.trim="editEquipInfoForm.maintain"
                      ></el-input-number>
                      <div class="day">天</div>
                    </div>
                    <div class="sin-right">
                    </div>
                  </div>
                </div>
                <div class="single"></div>
                <div class="single">
                  <div class="attr">厂家/类型/产品</div>
                  <el-cascader
                    v-model="productClassfication"
                    :options="options"
                    :props="props"
                    @change="equipInfoChange"
                  ></el-cascader>
                  <div class="attr">设备类型</div>
                  <el-select v-model.trim="editEquipInfoForm.deviceType" placeholder="请选择设备类型">
                    <el-option
                      v-for="(item,index) in allProductType"
                      :key="index"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
                <div class="single">
                  <div class="attr">设备型号</div>
                  <el-input v-model.trim="editEquipInfoForm.productModel"></el-input>
                  <div class="attr">生产厂家</div>
                  <el-input v-model.trim="editEquipInfoForm.factory"></el-input>
                </div>
                <div class="single">
                  <div class="attr">厂家联系人</div>
                  <el-input v-model.trim="editEquipInfoForm.factoryName"></el-input>
                  <div class="attr">厂家联系电话</div>
                  <el-input v-model.trim="editEquipInfoForm.factoryPhone"></el-input>
                </div>
              </el-form>
              <div class="extra">
                <div class="ex-single" v-for="(item,index) in exArr" :key="index">
                  <el-input placeholder="额定电流：" v-model.trim="item.name"></el-input>
                  <el-input placeholder="请输入值" v-model.trim="item.value"></el-input>
                  <i @click="decreaseEx(index)" class="el-icon-remove-outline" style="color: red;"></i>
                  <i @click="addEx" class="el-icon-circle-plus-outline" style="color: blue;"></i>
                </div>
              </div>
              <div class="deal">
                <el-button
                  class="confirm"
                  @click="editEquipInfoSubmit"
                  :disabled="!ifEditEquipInfo || ifEquipDetailLoading"
                >保存</el-button>
                <el-button
                  class="confirm"
                  :disabled="!ifEditEquipInfo || ifEquipDetailLoading || !Boolean(editEquipInfoForm.id)"
                  @click="cancelEditEquipInfo"
                >取消</el-button>
              </div>
            </div>
            <div class="float-right"></div>
          </div>
          <!-- 设备下的电表 -->
          <div class="meter" v-show="ifMeterShow">
            <div class="edit">
              <el-form class="form" ref="editMeterInfoRef" :model="editMeterInfoForm">
                <div class="single">
                  <div class="input-logo">
                    <input
                      @change="meterSelectFile($event)"
                      :key="meterUploadImgKey + 1"
                      class="input-file"
                      type="file"
                      accept="image/*"
                      style
                    />
                    <div style v-show="!meterImgSrc" class="logo">
                      <i class="el-icon-plus" style="heigth: 14px; display: block;"></i>
                    </div>
                    <img
                      id="imgId"
                      :src="meterImgSrc"
                      :key="meterUploadImgKey"
                      alt
                      v-show="meterImgSrc"
                      style="width: 100%; height: 100%; background-color: #ccc;"
                    />
                    <div style="position: absolute; left: 100px; bottom: -20px;">
                      <span style="color: #ccc;">(点击修改图片，建议宽高尺寸1:1)</span>
                    </div>
                    <div class="code">
                      <img :src="meterCodeSrc" alt />
                    </div>
                  </div>
                  <div class="block-right">
                    <div class="sin-right">
                      <div class="attr">设备名称</div>
                      <el-input readonly v-model.trim="editMeterInfoForm.name"></el-input>
                    </div>
                    <div class="sin-right">
                      <div class="attr">设备编号</div>
                      <el-input readonly v-model.trim="editMeterInfoForm.equipmentId"></el-input>
                    </div>

                    <div class="sin-right">
                      <div class="attr">设备变量</div>
                      <!-- <el-cascader
                            :key="MeterKey"
                            v-model="groupLinkMeter"
                            :options="groupLinkMeterOptions"
                            :props="{ expandTrigger: 'hover', value: 'MetermentId', label: 'name' }"
                            @change="linkChange"
                      ></el-cascader>-->
                      <el-select
                        v-model.trim="editMeterInfoForm.code"
                        placeholder="请选择变量"
                        @visible-change="getVariateByEquip"
                      >
                        <el-option
                          v-for="(item,index) in variateList"
                          :key="index"
                          :label="item.simplifiedCode"
                          :value="item.code"
                        ></el-option>
                      </el-select>
                    </div>
                    <div class="sin-right">
                      <div class="attr">运行时间</div>
                      <!-- <el-input-number readonly size="mini" v-model.trim="editMeterInfoForm.maintain"></el-input-number> -->
                      <el-input
                        readonly
                        class="scale-input"
                        v-model.trim="editMeterInfoForm.runningTime"
                      ></el-input>
                      <div class="day">天</div>
                    </div>
                    <div class="sin-right">
                      <div class="attr">安装位置</div>
                      <el-input v-model.trim="editMeterInfoForm.installLocation"></el-input>
                    </div>
                    <div class="sin-right">
                      <div class="attr">安装日期</div>
                      <el-date-picker
                        v-model.trim="editMeterInfoForm.installTime"
                        type="date"
                        placeholder="选择日期"
                      ></el-date-picker>
                    </div>
                    <div class="sin-right">
                      <div class="attr">投运日期</div>
                      <el-date-picker
                        v-model.trim="editMeterInfoForm.operationTime"
                        type="date"
                        placeholder="选择日期"
                      ></el-date-picker>
                    </div>
                  </div>
                </div>
              </el-form>
              <!-- 备件 -->
              <div class="component">
                <el-table :data="comDataArr">
                  <el-table-column prop="partsName" label="备件名称"></el-table-column>
                  <el-table-column prop="partsFactory" label="厂家名称"></el-table-column>
                  <el-table-column prop="phone" label="厂家联系电话"></el-table-column>
                  <el-table-column prop="operationTime" label="投运日期">
                    <template slot-scope="scope">{{scope.row.operationTime}}</template>
                  </el-table-column>
                  <el-table-column width="200">
                    <template slot="header">
                      <!-- <el-button type="text" @click="addCom">添加+</el-button> -->
                      <i
                        class="el-icon-circle-plus-outline"
                        @click="addCom"
                        style="cursor: pointer"
                      ></i>
                      <!-- <el-button type="primary" icon="el-icon-circle-plus-outline"></el-button> -->
                      <!-- <el-button
                        icon="el-icon-circle-plus-outline"
                        size="mini"
                        class="confirm"
                      ></el-button>-->
                    </template>
                    <template slot-scope="scope">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="编辑"
                        offset="-20"
                        placement="top-start"
                      >
                        <el-button
                          icon="el-icon-edit"
                          size="mini"
                          class="confirm"
                          @click="editCom(scope.row, scope.$index)"
                        ></el-button>
                      </el-tooltip>
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="删除"
                        offset="-20"
                        placement="top-start"
                      >
                        <el-button
                          icon="el-icon-delete"
                          size="mini"
                          class="confirm"
                          @click="delCom(scope.$index)"
                        ></el-button>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="deal">
                <el-button
                  class="confirm"
                  @click="editMeterInfoSubmit"
                  :disabled="!ifEditMeterInfo"
                >保存</el-button>
                <el-button
                  class="confirm"
                  :disabled="!ifEditMeterInfo"
                  @click="cancelEditMeterInfo"
                >取消</el-button>
              </div>
            </div>
            <div class="float-right"></div>
          </div>
          <div class="equip-empty" v-show="!ifEquipShow && !ifMeterShow">
            <span>请选中设备</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 编辑新增分组 -->
    <el-dialog
      :title="groupTitleName"
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
          <el-input v-model.trim="editGroupForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="editGroupVisible = false">取 消</el-button>
        <el-button class="confirm" @click="editGroupSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增编辑自定义设备 -->
    <el-dialog
      :title="equipTitleName"
      :visible.sync="editEquipVisible"
      width="420px"
      class="user-dialog"
    >
      <el-form
        :model="editEquipForm"
        :rules="editEquipRule"
        ref="editEquipRef"
        label-width="80px"
        class="user-form"
      >
        <el-form-item label="设备名称" prop="name">
          <el-input v-model.trim="editEquipForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="editEquipVisible = false">取 消</el-button>
        <el-button class="confirm" @click="editEquipSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分组删除 -->
    <el-dialog
      title="分组删除"
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

    <!-- 设备删除 -->
    <el-dialog
      title="设备删除"
      :visible.sync="delEquipVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <div style="width: 30px;float: left;margin: -7px 8px 5px -8px;">
        <i :class="{icon: true, 'iconfont': true, 'iconjinggao1': true}"></i>
      </div>
      <span>是否确定删除设备 {{delEquipName}} ?</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="delEquipVisible = false">取 消</el-button>
        <el-button class="dang" @click="delEquipSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 备件新增编辑 -->
    <el-dialog
      :title="componentTitleName"
      :visible.sync="editComponentVisible"
      width="520px"
      class="com-dialog"
      modal
      :close-on-click-modal="false"
      :show-close="true"
      @close="beforeComClose"
    >
      <el-form
        :model="editComponentForm"
        :rules="editComponentRule"
        ref="editComponentRef"
        label-width="110px"
        class="com-form"
      >
        <el-form-item label="备件" prop="id">
          <el-cascader
            :key="comKey"
            v-model="editComponentForm.id"
            @change="comChange"
            :options="comOptions"
            :props="comProps"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="厂家名称" prop="partsFactory">
          <el-input :disabled="Boolean(true)" v-model.trim="editComponentForm.partsFactory"></el-input>
        </el-form-item>
        <el-form-item label="厂家联系电话" prop="phone">
          <el-input :disabled="Boolean(true)" v-model.trim="editComponentForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="投运日期" prop="operationTime">
          <!-- <el-input v-model.trim="editComponentForm.name"></el-input> -->
          <el-date-picker v-model="editComponentForm.operationTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="editComponentVisible = false">取 消</el-button>
        <el-button class="confirm" @click="editComponentSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import MyBreadcrumb from "../subcomponents/Mybreadcrumb";
import GLOBAL from "../../utils/global_variable";
import {
  formatMonitorPoint,
  formatMonitorData,
  formatEquipMonitorrData,
  getTimeArr
} from "../../utils/index";
export default {
  components: {
    MyBreadcrumb,
  },
  data() {
    return {
      defaultFalse: false,
      tree: [
        // {
        //   name: "测试站点1",
        //   id: 1
        // }
      ],
      defautTrue: true, //树形默认展开
      defautFalse: false, //默认关闭
      defaultProps: {
        children: "children",
        label: "name"
      },
      currentGroupId: null, //当前分组编号
      currentGroupName: null, //分组名
      activeName: "equipInfo", //标签默认
      groupTitleName: null, //编辑新增分组头部
      editGroupVisible: false, //编辑分组弹窗
      editGroupForm: {
        //分组表单
        name: null
      },
      ifAddGroup: false, //编辑新增分组状态标记
      editGroupRule: {
        name: [{ required: true, message: "请填写活动形式", trigger: "blur" }]
      },
      ifEquipShow: false, //是否选中设备
      currentEquipName: "", //当前选中的设备名称
      currentEquipId: "", //当前选中的设备id
      editEquipVisible: false, //编辑新增设备弹窗
      equipTitleName: null, //编辑设备头部
      editEquipForm: {
        name: null //编辑新增设备表单
      },
      editEquipRule: {
        name: [{ required: true, message: "请填写活动形式", trigger: "blur" }]
      },
      delGroupVisible: false, //删除分组弹窗
      delGroupName: null, //即将删除的分组名
      delEquipVisible: false, //删除设备弹窗
      delEquipName: null, //即将删除的设备名
      delEquipId: null, //设备编号
      equipBelongGroupId: null, //所删除的设备所属分组
      searchEquipId: null, //监控设备，此id用于查询实时数据、时间记录、历史趋势、数据报表
      // ----------------------------------------------设备信息
      equipKey: 1,
      // 设备编辑表单数据
      editEquipInfoForm: {
        name: null,
        classifyId: "",
        equipmentId: null,
        polling: null,
        runningTime: null,
        deviceType: null,
        productModel: null,
        factory: null,
        factoryName: null,
        factoryPhone: null,
        properties: null
      },
      editEquipRules: {
        name: [
          {
            required: true,
            message: "请输入设备名称",
            trigger: "blur"
          }
        ]
      },
      groupLinkEquip: [], //监控设备
      default_zero: 0, //默认0
      default_one: 1, //默认1
      tempGroupLinkEquipOptions: [], //临时数据
      // 监控设备联级数据
      groupLinkEquipOptions: [],
      // 额外输入数组数据
      exArr: [
        {
          attr: "",
          val: ""
        }
      ],
      // 分组数据
      props: {
        children: "childrenList",
        label: "name",
        value: "viewId"
      },
      options: [], //厂家、类型、产品联级数据
      // 所有产品
      allProduct: [], //所有产品
      allProductType: [], //所有产品类型
      allFactory: [], //所有厂家
      productClassfication: "", //选中厂家类型型号关系数组
      equipImgSrc: "", //设备图片
      codeSrc: "", //二维码图片
      tabIndex: 0,
      // 备件数组数据
      comDataArr: [
        {
          // arrId: this.comOptions,
          // id: []
        }
      ],
      // 备件联级数据属性设置
      comProps: {
        expandTrigger: "hover",
        children: "childrenList",
        label: "name",
        value: "id"
      },
      // 备件联级数组
      comOptions: [],
      // 备件列表数据
      componentTable: [],
      componentTitleName: "编辑备件",
      editComponentVisible: false, //备件编辑或新增弹窗
      editComponentForm: {
        phone: 18812341234,
        idArr: [],
        partsFactory: ""
      },
      editComponentRule: {
        id: [{ required: true, message: "请选中备件类型", trigger: "blur" }],
        phone: [{ required: true, message: "请填写厂家号码", trigger: "blur" }],
        partsFactory: [
          { required: true, message: "请填写厂家名称", trigger: "blur" }
        ],
        operationTime: [
          { required: true, message: "请填写时间", trigger: "blur" }
        ]
      },
      // ---------------设备下的电表信息
      editMeterInfoForm: {
        equipmentId: null,
        name: "",
        equipFileId: null,
        code: null,
        installTime: null,
        runningTime: null,
        operationTime: null,
        equipmentPhoto: null,
        sparePartsList: []
      },
      meterImgSrc: "", //电表图片地址
      ifEditMeterInfo: false, //电表页面是否修改过
      meterId: "", //当前的电表所属设备id
      variateList: [], //设备下的变量列表
      meterFile: "", //电表图片文件
      meterUploadImgKey: 1, //电表图片key值,用于刷新input标签和img标签
      meterImgSrc: "", //电表图片地址
      meterCodeSrc: "", //电表图表二维码地址
      ifMeterDetailLoading: false, //电表是否加载中
      MeterKey: 0, //电表下设备监控联级组件key值
      groupLinkMeterOptions: [], //电表联级数据选项
      groupLinkMeter: null, //电表下设备监控值
      ifMeterShow: false, //设备下的电表是否显示
      // 备件配置
      comProps: {
        children: "childrenList",
        label: "name",
        value: "id"
      },
      comKey: 0, //联机备件选项组件key值
      ifComEdit: false, //备件是否编辑中
      comIndex: 0, //当前编辑的备件下标
      ifEditEquipInfo: false, //设备详情是否编辑中
      ifEquipDetailLoading: false, //设备详情是否正在加载中
      equipFile: "", //选中设备图片文件
      equipUploadImgKey: 0 //设备图片选中文件
    };
  },
  computed: {
    getSiteChange() {
      return this.$store.state.site.siteId;
    }
  },
  watch: {
    getSiteChange() {
      // 切换站点，数据重新渲染
      this.tree = [];
      this.meterUploadImgKey++;
      this.ifEquipShow = false;
      this.ifMeterShow = false;
      this.currentEquipName = null;
      this.currentEquipId = null;
      // 获取树状层级数据
      this.getAllGroup();
    },
    // ------------------监听设备表单变化
    editEquipInfoForm: {
      immediate: true,
      handler(val, oldVal) {
        this.ifEditEquipInfo = true;
      },
      deep: true
    },
    // 监听是以请求结束后的值变化作为表单是否修改
    // 监听设备表单中的数组数据
    exArr: {
      immediate: true,
      handler(val, oldVal) {
        this.ifEditEquipInfo = true;
      },
      deep: true
    },
    // 监听设备编辑表单中的图片地址是否变化
    equipImgSrc() {
      this.ifEditEquipInfo = true;
    },
    // ----------
    // -----------监听设备表单详情是否修改
    comDataArr: {
      immediate: true,
      handler(val, oldVal) {
        this.ifEditMeterInfo = true;
      },
      deep: true
    },
    editMeterInfoForm: {
      immediate: true,
      handler(val, oldVal) {
        this.ifEditMeterInfo = true;
      },
      deep: true
    }
  },
  created() {
    this.getAllGroup();
  },
  beforeDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  },
  methods: {
    // 获取分组信息集合
    getAllGroup(currentId) {
      // 新增设备时传值并赋值当前设备
      if (!this.$store.state.site.siteId) {
        return;
      }
      // 赋值基础树形操作
      this.tree = [
        {
          name: this.$store.state.site.siteName,
          id: 1
        }
      ];
      this.$http
        .get("equipment/fileClassify/getAll", {
          params: {
            siteId: this.$store.state.site.siteId,
            type: 0
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            var arr = [];
            arr[0] = {
              name: this.$store.state.site.siteName,
              id: 0,
              children: [],
              ifGroup: true
            };
            // 处理返回的设备id跟分组id冲突
            var arr1 = res.data.data;
            var this_ = this;
            dealAttr(arr1);
            // 递归遍历数组，修改设备id为负，否则与分组id冲突报错
            function dealAttr(arr1) {
              for (let i = 0; i < arr1.length; i++) {
                if (arr1[i].children) {
                  dealAttr(arr1[i].children);
                } else {
                  if (!arr1[i].ifGroup) {
                    this_.$set(arr1[i], "id", -arr1[i].id);
                  }
                }
              }
            }
            arr[0].children = arr1;
            this.tree = arr;
            this.currentGroupName = this.currentGroupName
              ? this.currentGroupName
              : this.$store.state.site.siteName;
            if (this.currentGroupId || this.currentEquipId) {
              this.$nextTick(() => {
                this.$refs.groupTree.setCurrentKey(
                  currentId
                    ? currentId
                    : this.currentGroupId
                    ? this.currentGroupId
                    : this.currentEquipId
                );
              });
            } else {
              this.currentGroupId = 0;
              this.$nextTick(() => {
                this.$refs.groupTree.setCurrentKey(this.currentGroupId);
              });
              // this.getFileByGroup();
            }
          }
        });
    },
    // 点击树状结构
    handleNodeClick(data, node, event) {
      // 先判断是否是分组或站点
      if (data.ifGroup) {
        this.ifEquipShow = false;
        this.ifMeterShow = false;
        this.equipBelongGroupId = data.parentId;
        this.currentGroupName = data.name;
        this.currentGroupId = data.id;
        this.currentEquipName = null;
        this.currentEquipId = null;
      } else {
        // 选中设备
        // 对页面造成影响的数据清空
        this.currentGroupName = null;
        this.currentGroupId = null;
        this.currentEquipName = data.name;
        this.currentEquipId = data.id;

        this.equipBelongGroupId = data.parentId;
        this.activeName = "equipInfo"; //切换设备回到设备信息页面
        this.searchEquipId = null; //重新获取设备监控id是否存在

        // 判断是否有ifGroup属性，是则是设备
        if (data.hasOwnProperty("ifGroup")) {
          // 清理联级数据缓存
          this.groupLinkEquip = [];
          this.ifEquipShow = true;
          this.ifMeterShow = false;
          this.equipKey++;
          this.getequipDetailInfo();
        } else {
          // 没有ifGroup属性则是设备下的电表

          this.meterId = data.equipmentId;
          this.ifEquipShow = false;
          this.ifMeterShow = true;
          this.editMeterInfoForm = {
            equipmentId: null,
            name: "",
            equipFileId: null,
            code: null,
            installTime: null,
            runningTime: null,
            operationTime: null,
            equipmentPhoto: null,
            sparePartsList: []
          };
          this.getMeterDetail();
        }
      }
    },
    // 新增分组
    addGroup() {
      this.ifAddGroup = true;
      this.editGroupVisible = true;
      this.groupTitleName = "新建分组 (" + this.currentGroupName + ")";
      this.$nextTick(() => {
        this.$refs.editGroupRef.resetFields();
      });
    },
    // 新增编辑分组提交
    editGroupSubmit() {
      this.$refs.editGroupRef.validate(valid => {
        if (valid) {
          if (this.ifAddGroup) {
            this.$http
              .post("equipment/fileClassify/addClassify", {
                name: this.editGroupForm.name,
                type: 0,
                siteId: this.$store.state.site.siteId,
                parentId: this.currentGroupId ? this.currentGroupId : 0
              })
              .then(res => {
                if (res.data.code === 0) {
                  this.$notify({
                    message: "新增成功",
                    type: "success"
                  });
                  this.currentGroupName = this.editGroupForm.name;
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
                type: 0,
                parentId: this.equipBelongGroupId ? this.equipBelongGroupId : 0
              })
              .then(res => {
                if (res.data.code === 0) {
                  this.$notify({
                    message: "编辑成功",
                    type: "success"
                  });
                  this.currentGroupName = this.editGroupForm.name;
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
    },
    // 编辑分组或设备
    editGroupOrEquip() {
      // 设备
      if (this.currentEquipId) {
        this.editEquipVisible = true;
        this.equipTitleName = "编辑设备（" + this.currentEquipName + "）";
        this.$nextTick(item => {
          // this.$refs.editEquipRef.resetFields();
          this.editEquipForm.id = this.currentEquipId;
          // this.ifAddEquip = false;
        });
      } else {
        // 分组
        this.groupTitleName = "编辑分组（" + this.currentGroupName + "）";
        this.editGroupVisible = true;
        this.$nextTick(item => {
          this.$refs.editGroupRef.resetFields();
          this.editGroupForm.id = this.currentGroupId;
          this.ifAddGroup = false;
        });
      }
    },
    // 新增设备
    addEquip() {
      // this.editEquipVisible = true;
      this.editEquipForm.id = null;
      this.ifEquipShow = true;
      this.ifMeterShow = false;
      this.editEquipInfoForm = {
        name: null,
        classifyId: "",
        equipmentId: null,
        polling: null,
        runningTime: null,
        deviceType: null,
        productModel: null,
        factory: null,
        factoryName: null,
        factoryPhone: null,
        properties: null
      };
      this.exArr = [{value: null, name: null}];
      // this.equipTitleName = "新增设备";
      this.$nextTick(() => {
        if (this.$refs.editEquipRef) {
          this.$refs.editEquipRef.resetFields();
        }
      });
    },
    // 新增设备分组提交
    editEquipSubmit() {
      this.$refs.editEquipRef.validate(valid => {
        if (valid) {
          if (this.editEquipForm.id) {
            // 编辑设备
            this.$http
              .post("equipment/equipmentFile/update", {
                id: Math.abs(this.editEquipForm.id), //修改设备id负值为正
                name: this.editEquipForm.name
              })
              .then(res => {
                if (res.data.code === 0) {
                  this.$notify({
                    message: "编辑成功",
                    type: "success"
                  });
                  this.editEquipVisible = false;
                  this.currentEquipName = res.data.data.name;
                  this.getAllGroup();
                  this.editEquipInfoForm.name = this.currentEquipName;
                  this.$nextTick(() => {
                    this.$refs.groupTree.setCurrentKey(this.currentEquipId);
                  });
                } else {
                  this.$notify({
                    message: res.data.msg,
                    type: "warning"
                  });
                }
              });
          } else {
            // 新增设备
            this.$http
              .post("equipment/equipmentFile/addEquipment", {
                name: this.editEquipForm.name,
                groupId: this.currentGroupId,
                siteId: this.$store.state.site.siteId,
                properties:
                  '[{"name":"额定电流","unit":"A"},{"name":"额定电压","unit":"V"},{"name":"生产日期"},{"name":"数量"}]'
              })
              .then(res => {
                if (res.data.code === 0) {
                  this.$notify({
                    message: "新增成功",
                    type: "success"
                  });
                  this.editEquipVisible = false;
                  this.getAllGroup();
                }
              });
          }
        }
      });
    },
    // 分组/设备删除
    delGroupOrEquip() {
      if (this.currentEquipId) {
        this.delEquipVisible = true;
        this.delEquipId = this.currentEquipId;
        this.delEquipName = this.currentEquipName;
      } else {
        this.delGroupVisible = true;
        this.delGroupId = this.currentGroupId;
        this.delGroupName = this.currentGroupName;
      }
    },
    // 分组删除提交
    delGroupSubmit() {
      this.$http
        .get("equipment/fileClassify/del", {
          params: {
            id: Math.abs(this.delGroupId)
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
    // 设备删除提交
    delEquipSubmit() {
      this.$http
        .get("equipment/fileClassify/del", {
          params: {
            id: Math.abs(this.delEquipId),
            groupId: this.equipBelongGroupId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$notify({
              message: "删除成功",
              type: "success"
            });
            this.delEquipVisible = false;
            this.delEquipName = null;
            this.delEquipId = null;
            this.currentEquipName = null;
            this.currentEquipId = null;
            this.equipBelongGroupId = null;
            this.delEquipVisible = false;
            this.ifEquipShow = false;
            this.getAllGroup();
          } else {
            this.$notify({
              message: res.data.msg,
              type: "warning"
            });
          }
        });
    },
    // tab点击
    handleTabClick() {
      switch (this.activeName) {
        //设备信息
        case "equipInfo":
          this.getequipDetailInfo();
          break;
      }
    },
    // ------------------------------设备信息
    // 获取设备所有信息及赋值
    getequipDetailInfo() {
      this.equipFile = "";
      this.equipUploadImgKey++;
      this.ifEquipDetailLoading = true;
      // this.getComponentGroup();
      this.$http
        .get("equipment/equipmentFile/detail", {
          params: {
            id: Math.abs(this.currentEquipId)
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            // 数据临时存储设备信息
            let formObj = res.data.data;
            // - --------------------------------手动赋值 (默认)
            if (!formObj.properties) {
              var arr = [
                {
                  name: "额定电流",
                  value: "1"
                },
                {
                  name: "额定电压",
                  value: "1"
                },
                {
                  name: "生产日期",
                  value: "2020-2-1"
                },
                {
                  name: "数量",
                  value: "56"
                }
              ];
              formObj.properties = JSON.stringify(arr);
            }

            // 图片地址清空
            this.equipImgSrc = "";
            this.editEquipInfoForm = JSON.parse(JSON.stringify(formObj));
            // 赋值数组对象
            this.exArr = JSON.parse(formObj.properties);
            this.comDataArr = [];
            this.editableTabs = [];
            // 备件表格赋值
            if (this.editEquipInfoForm.sparePartsList.length > 0) {
              for (
                var i = 0;
                i < this.editEquipInfoForm.sparePartsList.length;
                i++
              ) {
                var id = [];
                id.push(this.editEquipInfoForm.sparePartsList[i].classifyId);
                id.push(this.editEquipInfoForm.sparePartsList[i].typeId);
                id.push(this.editEquipInfoForm.sparePartsList[i].factoryId);
                id.push(this.editEquipInfoForm.sparePartsList[i].id.toString());
                this.$set(this.comDataArr, i, {
                  id: id,
                  operationTime: this.editEquipInfoForm.sparePartsList[i]
                    .operationTime,
                  partsFactory: this.editEquipInfoForm.sparePartsList[i]
                    .partsFactory,
                  partsName: this.editEquipInfoForm.sparePartsList[i].partsName,
                  phone: "18812341234"
                });
              }
              this.$delete(this.editEquipInfoForm, "sparePartsList"); //删除后端不需要的属性
            }
            this.productClassfication = "";

            var p1 = this.getEquipPhoto();
            var p2 = this.getProductClassfication();
            var p3 = this.getAllFactory();
            var p4 = this.getAllProduct();
            var p5 = this.getEquipCode();
            var p6 = this.getAllEquipType();
            var p7 = this.getEquipGroup();
            Promise.all([p1, p2, p3, p4, p5, p6, p7]).then(result => {
              this.ifEditEquipInfo = false; //不在编辑状态
              this.ifEquipDetailLoading = false; //详情加载完毕
            });
          }
        });
    },
    // 获取设备监控分组
    getEquipGroup() {
      return new Promise((resolve, reject) => {
        this.$http
          .get("equipment/classify/findAllByRoom", {
            params: {
              roomId: this.$store.state.site.siteId
            }
          })
          .then(res => {
            var data = res.data.data;
            data.map(item => {
              return (item.equipmentId = item.id);
            });
            var arr = [];
            data.forEach(item => {
              arr.push(item.id);
            });
            this.tempGroupLinkEquipOptions = data;
            this.getEquipByClassifyId(arr);
            resolve();
          });
      });
    },
    // 获取监控分组下监控设备
    getEquipByClassifyId(data) {
      if (data.length === 0) {
        this.groupLinkEquipOptions = [];
        // 空字符串后端报错
        return;
      }
      this.$http
        .get("equipment/classifyEquipment/findAllByClassify", {
          params: {
            classifyIds: data.join(",")
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            var arr = res.data.data;
            var tempData = this.tempGroupLinkEquipOptions;
            for (var i = 0; i < data.length; i++) {
              for (var j = 0; j < arr.length; j++) {
                if (data[i] == arr[j].classifyId) {
                  tempData[i].children = arr[j].ClassifyEquipmentVO;
                  arr.splice(j, 1); //删除已经匹配过得数组
                  break;
                }
              }
            }
            this.groupLinkEquipOptions = tempData;
            // 设备监控赋值
            if (this.editEquipInfoForm.equipmentId) {
              this.groupLinkEquip = [
                this.editEquipInfoForm.classifyId,
                this.editEquipInfoForm.equipmentId
              ];
              //
              for (var i = 0; i < this.groupLinkEquipOptions.length; i++) {
                var ifFind = false;
                for (
                  var j = 0;
                  j < this.groupLinkEquipOptions[i].children.length;
                  j++
                ) {
                  if (
                    this.groupLinkEquipOptions[i].children[j].classify ==
                      this.editEquipInfoForm.classifyId &&
                    this.groupLinkEquipOptions[i].children[j].equipmentId ==
                      this.editEquipInfoForm.equipmentId
                  ) {
                    ifFind = true;
                    this.editEquipInfoForm.equipName = this.groupLinkEquipOptions[
                      i
                    ].children[j].name;
                    this.searchEquipId = this.groupLinkEquipOptions[i].children[
                      j
                    ].equipmentId;
                    break;
                  }
                }
                if (ifFind) {
                  break;
                }
              }
            } else {
              this.groupLinkEquip = [];
            }
            this.$forceUpdate();
          }
        });
    },
    // 设备监控值改变
    linkChange() {
      this.editEquipInfoForm.equipmentId = this.groupLinkEquip[1];
      this.editEquipInfoForm.classifyId = this.groupLinkEquip[0];
    },
    // 获取设备图片
    getEquipPhoto() {
      return new Promise((resolve, reject) => {
        if (!this.editEquipInfoForm.devicePhoto) {
          resolve();
          return;
        }
        this.$http
          .get("equipment/equipmentFile/getPhoto", {
            params: {
              id: this.editEquipInfoForm.id
            }
          })
          .then(res => {
            this.$nextTick(() => {
              this.equipImgSrc = res.request.responseURL;
              resolve();
            });
          })
          .catch(res => {
            resolve();
          });
      });
    },
    // 查厂家类型型号关系数组数据
    getProductClassfication() {
      return new Promise((resolve, reject) => {
        this.$http
          .get("equipment/product/classification", {
            params: {
              companyId: this.$store.state.site.searchCompanyId
            }
          })
          .then(res => {
            if (res.data.code === 0) {
              this.options = res.data.data;
              resolve();
            }
          });
      });
    },
    // 选中厂家/类型/型号信息自动补全信息
    equipInfoChange() {
      this.editEquipInfoForm.deviceType = +this.productClassfication[1].substr(
        1
      );
      // 厂家名称赋值
      var index = this.allFactory.findIndex(item => {
        return item.id.toString() === this.productClassfication[0].substr(1);
      });
      this.editEquipInfoForm.factory = this.allFactory[index].name;
      this.editEquipInfoForm.factoryName = this.allFactory[index].contactPerson;
      this.editEquipInfoForm.factoryPhone = this.allFactory[index].contactPhone;
      // 设备类型赋值
      var index1 = this.allProduct.findIndex(item => {
        return item.id.toString() === this.productClassfication[2].substr(1);
      });
      this.editEquipInfoForm.productModel = this.allProduct[index1].model;
    },
    // 获取所有厂家
    getAllFactory() {
      return new Promise((resolve, reject) => {
        this.$http
          .get("equipment/provider/findAll", {
            params: {
              name: "",
              page: 0,
              // size: 1000,
              size: GLOBAL.max_page_size,
              companyId: this.$store.state.site.searchCompanyId
            }
          })
          .then(res => {
            if (res.data.code === 0) {
              this.allFactory = res.data.data.data;
              resolve();
            }
          });
      });
    },
    // 获取所有产品类型
    getAllEquipType() {
      return new Promise((resolve, reject) => {
        this.$http
          .get("equipment/productType/findAll", {
            params: {
              name: "",
              page: 0,
              size: GLOBAL.max_page_size,
              companyId: this.$store.state.site.searchCompanyId
            }
          })
          .then(res => {
            this.allProductType = res.data.data.data;
            if (this.editEquipInfoForm.deviceType) {
              var index = this.allProductType.findIndex(item => {
                return item.id === this.editEquipInfoForm.deviceType;
              });
              this.editEquipInfoForm.productTypeName = this.allProductType[
                index
              ].name;
            }
            resolve();
          });
      });
    },
    // 获取所有产品型号
    getAllProduct() {
      return new Promise((resolve, reject) => {
        this.$http
          .get("equipment/product/findAll", {
            params: {
              name: "",
              page: 0,
              size: GLOBAL.max_page_size,
              companyId: this.$store.state.site.searchCompanyId
            }
          })
          .then(res => {
            if (res.data.code === 0) {
              this.allProduct = res.data.data.data;
              resolve();
            }
          });
      });
    },

    // 新增项
    addEx() {
      var obj = {
        name: "",
        value: ""
      };
      this.exArr.push(obj);
    },
    // 删除项
    decreaseEx(index) {
      if (this.exArr.length === 1) {
        return;
      }
      this.exArr.splice(index, 1);
    },
    // 选中文件后赋值
    selectFile(event) {
      // 限制图片不大于200kb
      if (event.target.files[0].size / 1024 > 200) {
        this.$message({
          type: "info",
          message: "请选择小于200kb的图片！"
        });
        return;
      }
      this.equipFile = event.target.files[0];
      this.equipImgSrc = this.getObjectURL(event.target.files[0]);
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
    // 编辑设备提交
    editEquipInfoSubmit() {
      if (!this.editEquipInfoForm.name) {
        return this.$message("请输入不为空的设备名称！");
      }
      this.editEquipInfoForm.groupId = this.editEquipInfoForm.id
        ? this.equipBelongGroupId
        : this.currentGroupId;
      this.editEquipInfoForm.siteId = this.$store.state.site.siteId;
      if (this.editEquipInfoForm.id) {
        // id存在则为编辑状态
        this.editEquipInfoForm.id = Math.abs(this.currentEquipId); //负值改改正值
      }
      // properies 属性赋值
      this.editEquipInfoForm.properties = JSON.stringify(this.exArr);
      var idArr = [];
      // }
      if (idArr.length) {
        this.editEquipInfoForm.partsList = JSON.stringify(idArr);
      }
      if (this.equipFile) {
        //带图片文件
        let formdata = new FormData();
        for (var key in this.editEquipInfoForm) {
          if (this.editEquipInfoForm[key] === null) {
            // classifyId为空时报错，特殊处理
            this.editEquipInfoForm[key] = "";
          }
        }
        // return
        formdata.append("file", this.equipFile);
        formdata.append("id", this.editEquipInfoForm.id);
        formdata.append("name", this.editEquipInfoForm.name);
        formdata.append("equipmentId", this.editEquipInfoForm.equipmentId);
        formdata.append("polling", this.editEquipInfoForm.polling);
        formdata.append("runningTime", this.editEquipInfoForm.runningTime);
        formdata.append("deviceType", this.editEquipInfoForm.deviceType);
        formdata.append("groupId", this.editEquipInfoForm.groupId);
        formdata.append("siteId", this.editEquipInfoForm.siteId);
        formdata.append("productModel", this.editEquipInfoForm.productModel);
        formdata.append("devicePhoto", this.editEquipInfoForm.devicePhoto);
        formdata.append("maintain", this.editEquipInfoForm.maintain);
        formdata.append("factory", this.editEquipInfoForm.factory);
        formdata.append("factoryName", this.editEquipInfoForm.factoryName);
        formdata.append("factoryPhone", this.editEquipInfoForm.factoryPhone);
        formdata.append("properties", this.editEquipInfoForm.properties);
        formdata.append("classifyId", this.editEquipInfoForm.classifyId);
        if (this.editEquipInfoForm.partsList) {
          formdata.append("partsList", this.editEquipInfoForm.partsList);
        }
        let config = {
          headers: {
            "Content-Type": "multipart/form-data" //之前说的以表单传数据的格式来传递fromdata
          }
        };
        this.$http
          .post("equipment/equipmentFile/modify", formdata, config)
          .then(res => {
            if (res.data.code === 0) {
              this.$notify({
                message: "编辑成功",
                type: "success"
              });
              // 新增情况下需要考虑父级id重新赋值
              this.currentGroupName = null;
              this.equipBelongGroupId = this.currentGroupId || this.equipBelongGroupId;
              this.currentGroupId = null;
              this.currentEquipName = res.data.data.name;
              this.currentEquipId = res.data.data.id;
              this.activeName = "equipInfo"; //切换设备回到设备信息页面
              this.searchEquipId = null; //重新获取设备监控id是否存在
              this.ifEditEquipInfo = false;
              this.getequipDetailInfo();
              this.getAllGroup(this.currentEquipId);
            }
          });
      } else {
        // 不带图片文件
        this.$http
          .post("equipment/equipmentFile/modify", this.editEquipInfoForm)
          .then(res => {
            if (res.data.code === 0) {
              this.$notify({
                message: "编辑成功",
                type: "success"
              });
              // 新增情况下需要考虑父级id重新赋值
              this.currentGroupName = null;
              this.equipBelongGroupId = this.currentGroupId  || this.equipBelongGroupId;
              this.currentGroupId = null;
              this.currentEquipName = res.data.data.name;
              this.currentEquipId = res.data.data.id;

              this.activeName = "equipInfo"; //切换设备回到设备信息页面
              this.searchEquipId = null; //重新获取设备监控id是否存在

              this.ifEditEquipInfo = false;
              this.getequipDetailInfo();
              this.getAllGroup(this.currentEquipId);
            }
          });
      }
    },
    // 获取设备二维码
    getEquipCode() {
      return new Promise((resolve, reject) => {
        this.$http
          .get("equipment/equipmentFile/qrcode", {
            params: {
              id: this.editEquipInfoForm.id
            }
          })
          .then(res => {
            this.codeSrc = res.request.responseURL;
            resolve();
          });
      });
    },
    // 取消编辑设备
    cancelEditEquipInfo() {
      this.getequipDetailInfo();
    },
    // --------------------------设备下的电表事件
    // 查看电表详情
    getMeterDetail() {
      this.meterFile = "";
      this.$http
        .get("equipment/equipConfig/findEquipConfig", {
          params: {
            equipmentId: this.meterId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.editMeterInfoForm = res.data.data;
            this.comDataArr = [];
            // 备件表格赋值
            if (this.editMeterInfoForm.sparePartsList.length > 0) {
              for (
                var i = 0;
                i < this.editMeterInfoForm.sparePartsList.length;
                i++
              ) {
                var id = [];
                id.push(this.editMeterInfoForm.sparePartsList[i].classifyId);
                id.push(this.editMeterInfoForm.sparePartsList[i].typeId);
                id.push(this.editMeterInfoForm.sparePartsList[i].factoryId);
                id.push(this.editMeterInfoForm.sparePartsList[i].id.toString());
                this.$set(this.comDataArr, i, {
                  id: id,
                  operationTime: this.editMeterInfoForm.sparePartsList[i]
                    .operationTime,
                  partsFactory: this.editMeterInfoForm.sparePartsList[i]
                    .partsFactory,
                  partsName: this.editMeterInfoForm.sparePartsList[i].partsName,
                  phone: "18812341234"
                });
              }
              this.$delete(this.editMeterInfoForm, "sparePartsList"); //删除后端不需要的属性
            }
            this.productClassfication = "";

            var p1 = this.getMeterCode(); //获取二维码
            var p2 = this.getMeterPhoto(); //获取电表图片‘
            Promise.all([p1, p2]).then(result => {
              this.ifEditMeterInfo = false; //设备不在编辑状态
            });
            this.getVariateByEquip(true);
            this.getComponentGroup();
          }
        });
    },
    // 获取电表图片
    getMeterPhoto() {
      this.meterUploadImgKey++;
      return new Promise((resolve, reject) => {
        if (!this.editMeterInfoForm.equipmentPhoto) {
          this.meterImgSrc = "";
          resolve();
          return;
        }
        this.$http
          .get("equipment/equipConfig/getPhoto", {
            params: {
              equipmentId: this.editMeterInfoForm.equipmentId
            }
          })
          .then(res => {
            this.$nextTick(() => {
              this.meterImgSrc = res.request.responseURL;
              resolve();
            });
          })
          .catch(res => {
            resolve();
          });
      });
    },
    // 获取电表二维码
    getMeterCode() {
      return new Promise((resolve, reject) => {
        this.$http
          .get("equipment/equipConfig/qrcode", {
            params: {
              equipmentId: this.meterId
            }
          })
          .then(res => {
            this.meterCodeSrc = res.request.responseURL;
            resolve();
          });
      });
    },
    // 电表图片改变
    meterSelectFile(e) {
      // 限制图片不大于200kb
      if (event.target.files[0].size / 1024 > 200) {
        this.$message({
          type: "info",
          message: "请选择小于200kb的图片！"
        });
        return;
      }
      this.meterFile = event.target.files[0];
      this.meterImgSrc = this.getObjectURL(event.target.files[0]);
      this.ifEditMeterInfo = true;
    },
    // 电表修改提交
    editMeterInfoSubmit() {
      // 将数据修改为字符串形式或null
      var installTime = this.editMeterInfoForm.installTime;
      var str = installTime
        ? typeof installTime === "string"
          ? installTime
          : installTime.getFullYear() +
            "-" +
            (installTime.getMonth() + 1) +
            "-" +
            installTime.getDate()
        : null;
      // 将数据修改为字符串形式或null
      this.editMeterInfoForm.installTime = str;
      var operationTime = this.editMeterInfoForm.operationTime;
      var str = operationTime
        ? typeof operationTime === "string"
          ? operationTime
          : operationTime.getFullYear() +
            "-" +
            (operationTime.getMonth() + 1) +
            "-" +
            operationTime.getDate()
        : null;
      this.editMeterInfoForm.operationTime = str;
      var idArr = [];
      // 格式话数据提交格式
      for (var i = 0; i < this.comDataArr.length; i++) {
        var obj = {};
        obj.id = this.comDataArr[i].id[3];
        obj.operationTime = this.comDataArr[i].operationTime;
        idArr.push(obj);
      }
      if (idArr.length) {
        this.editMeterInfoForm.partsList = JSON.stringify(idArr);
      }
      // partsList属性值只能为数组或者不传值
      if (this.editMeterInfoForm.hasOwnProperty("partsList")) {
        if (!this.editMeterInfoForm.partsList) {
          this.$delete(this.editMeterInfoForm, "partsList");
        }
      }
      if (this.meterFile) {
        //带图片文件
        let formdata = new FormData();
        for (var key in this.editMeterInfoForm) {
          if (this.editMeterInfoForm[key] === null) {
            // classifyId为空时报错，特殊处理
            this.editMeterInfoForm[key] = "";
          }
        }
        // return
        formdata.append("file", this.meterFile);
        formdata.append("equipmentId", this.meterId);
        formdata.append("id", this.editMeterInfoForm.id);
        formdata.append("name", this.editMeterInfoForm.name);
        formdata.append("equipfileId", this.editMeterInfoForm.equipfileId);
        formdata.append("code", this.editMeterInfoForm.code);
        formdata.append("installTime", this.editMeterInfoForm.installTime);
        formdata.append("runningTime", this.editMeterInfoForm.runningTime);
        formdata.append("operationTime", this.editMeterInfoForm.operationTime);
        formdata.append(
          "equipmentPhoto",
          this.editMeterInfoForm.equipmentPhoto
        );
        formdata.append(
          "installLocation",
          this.editMeterInfoForm.installLocation
        );
        // partsList不能数组之外的值
        if (this.editMeterInfoForm.partsList) {
          formdata.append("partsList", this.editMeterInfoForm.partsList);
        }

        let config = {
          headers: {
            "Content-Type": "multipart/form-data" //之前说的以表单传数据的格式来传递fromdata
          }
        };
        this.$http
          .post("equipment/equipConfig/saveConfig", formdata, config)
          .then(res => {
            if (res.data.code === 0) {
              this.$notify({
                message: "编辑成功",
                type: "success"
              });
              this.ifEditMeterInfo = false;
              this.getMeterDetail();
            }
          });
      } else {
        // 不带图片文件
        this.$http
          .post("equipment/equipConfig/saveConfig", this.editMeterInfoForm)
          .then(res => {
            if (res.data.code === 0) {
              this.$notify({
                message: "编辑成功",
                type: "success"
              });
              this.ifEditMeterInfo = false;
              this.getMeterDetail();
            }
          });
      }
    },
    // 取消电表修改
    cancelEditMeterInfo() {
      this.getMeterDetail();
    },
    // 下拉获取变量
    getVariateByEquip(flag) {
      if (flag) {
        this.$http
          .get("equipment/variable/findAllByEquipment", {
            params: {
              equipmentId: this.meterId
            }
          })
          .then(res => {
            if (res.data.code === 0) {
              this.variateList = res.data.data;
            }
          });
      }
    },
    // 查询备件分组
    getComponentGroup() {
      this.$http
        .get("equipment/spareParts/findClassify", {
          params: {
            companyId: this.$store.state.site.searchCompanyId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.comOptions = res.data.data;
          }
        });
    },
    // 添加备件
    addCom() {
      this.editComponentVisible = true;
    },
    // 删除备件
    delCom(index) {
      this.comDataArr.splice(index, 1);
    },
    // 弹窗选中备件
    comChange() {
      // 厂家名称、备件名称赋值
      var partsFactory;
      var partsName;
      for (var i = 0; i < this.comOptions.length; i++) {
        for (var j = 0; j < this.comOptions[i].childrenList.length; j++) {
          for (
            var k = 0;
            k < this.comOptions[i].childrenList[j].childrenList.length;
            k++
          ) {
            if (
              this.comOptions[i].childrenList[j].childrenList[k].id ==
              this.editComponentForm.id[2]
            ) {
              partsFactory = this.comOptions[i].childrenList[j].childrenList[k]
                .name;
            }
            for (
              var l = 0;
              l <
              this.comOptions[i].childrenList[j].childrenList[k].childrenList
                .length;
              l++
            ) {
              if (
                this.comOptions[i].childrenList[j].childrenList[k].childrenList[
                  l
                ].id == this.editComponentForm.id[3]
              ) {
                partsName = this.comOptions[i].childrenList[j].childrenList[k]
                  .childrenList[l].name;
              }
            }
          }
        }
      }
      this.editComponentForm.partsFactory = partsFactory;
      this.editComponentForm.partsName = partsName;
    },
    // 保存设置备件
    editComponentSubmit() {
      this.$refs.editComponentRef.validate(valid => {
        if (valid) {
          var obj = {
            id: this.editComponentForm.id,
            partsFactory: this.editComponentForm.partsFactory,
            partsName: this.editComponentForm.partsName,
            phone: this.editComponentForm.phone,
            // element时间对象用toJSON方法会减少一天
            operationTime:
              this.editComponentForm.operationTime instanceof Date
                ? new Date(
                    this.editComponentForm.operationTime.getTime() +
                      1000 * 60 * 60 * 24
                  )
                    .toJSON()
                    .split("T")[0]
                    .split("/")
                    .join("-")
                : this.editComponentForm.operationTime
          };
          // this.comDataArr.push(obj);
          if (this.ifComEdit) {
            this.$set(this.comDataArr, this.comIndex, obj);
          } else {
            this.comDataArr.push(obj);
          }
          this.editComponentVisible = false;
        }
      });
    },
    // 编辑备件弹窗关闭前
    beforeComClose() {
      this.$refs.editComponentRef.resetFields();
      this.comKey++; //重新渲染
      this.editComponentForm = {
        phone: "18812341234",
        id: [],
        operationTime: ""
      };
      this.ifComEdit = false;
    },
    // 弹窗赋值
    editCom(obj, index) {
      this.editComponentVisible = true;
      this.editComponentForm = {
        id: obj.id,
        partsName: obj.partsName,
        name: obj.name,
        phone: "18812341234",
        operationTime: obj.operationTime
      };
      this.comChange();
      this.ifComEdit = true;
      this.comIndex = index;
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
      @dis-flex();
      @flex-c();
      background: @content-bgc;
      padding: 10px 10px 0;
      box-sizing: border-box;
      width: 0;
      .header {
        margin-bottom: 4px;
        @dis-flex();
        justify-content: space-between;
        align-items: center;
        height: 34px;
      }
      h4 {
        color: white;
      }
      .inner {
        box-shadow: rgb(202, 198, 198) 0px 0px 4px;
        padding: 8px;
        @flex-1();
        overflow: auto;
        // width: 0;
        color: white;
        height: 0;
        background-color: rgba(67, 92, 112);
        @dis-flex();
        @flex-c();
        .equip-empty {
          @flex-1();
          @dis-flex();
          justify-content: center;
          align-items: center;
        }

        // --------------------设备信息
        .equip-info {
          width: 100%;
          .edit {
            width: 1000px;
            .form {
              margin-top: 10px;
              .single {
                margin-bottom: 16px;
                .attr {
                  display: inline-block;
                  width: 15%;
                  text-align: center;
                  padding: 0 4px;
                  box-sizing: border-box;
                  vertical-align: top;
                }
                & > .el-input {
                  width: 32%;
                }
                & /deep/ .el-cascader {
                  width: 32%;
                }
                & /deep/ .el-select {
                  width: 32%;
                }
                /deep/ .el-input-number--mini {
                  line-height: 34px;
                  width: calc(32% - 24px);
                  color: #fff;
                  .el-input-number__decrease,
                  .el-input-number__increase {
                    background: #7085a5;
                  }
                }
                .day {
                  width: 20px;
                  display: inline-block;
                }
                // 设备图片
                .input-logo {
                  position: relative;
                  display: inline-block;
                  // width: 120px;
                  // width: 50%;
                  width: 475px;
                  height: 345px;
                  .input-file {
                    position: absolute;
                    // width: 345px;
                    width: 100%;
                    height: 345px;
                    opacity: 0;
                    cursor: pointer;
                  }
                  .logo {
                    // width: 345px;
                    width: 100%;
                    height: 345px;
                    background-color: #ccc;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  }
                  .code {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    width: 60px;
                    height: 60px;
                    img {
                      width: 60px;
                      height: 60px;
                    }
                  }
                }
              }
              .block-right {
                vertical-align: top;
                display: inline-block;
                height: 360px;
                width: 50%;
                .sin-right {
                  width: 100%;
                  margin-bottom: 16px;
                  .attr {
                    width: 30%;
                    display: inline-block;
                  }
                  & > .el-input {
                    width: 64%;
                  }
                  & /deep/ .el-cascader {
                    width: 64%;
                  }
                  /deep/ .el-input-number--mini {
                    line-height: 34px;
                    width: calc(64% - 24px);
                    color: #fff;
                    .el-input-number__decrease,
                    .el-input-number__increase {
                      background: #7085a5;
                    }
                  }
                  & /deep/ .el-select {
                    width: 64%;
                  }
                }
              }
            }
            .extra {
              margin: 40px 0 10px;
              .ex-single {
                width: 100%;
                margin-top: 10px;
                .el-input:first-child {
                  width: 120px;
                  margin: 0 15px;
                }
                .el-input:nth-child(2) {
                  width: 150px;
                  margin-right: 20px;
                }
                i {
                  width: 28px;
                  height: 28px;
                }
              }
            }
            // 操作按钮
            .deal {
              margin-top: 50px;
              padding-left: 40px;
              box-sizing: border-box;
            }
          }
          .float-right {
          }
        }
        // ---------------------电表信息
        .meter {
          width: 100%;
          .edit {
            width: 1000px;
            .form {
              margin-top: 10px;
              .single {
                margin-bottom: 16px;
                .attr {
                  display: inline-block;
                  width: 15%;
                  text-align: center;
                  padding: 0 4px;
                  box-sizing: border-box;
                  vertical-align: top;
                }
                & > .el-input {
                  width: 32%;
                }
                & /deep/ .el-cascader {
                  width: 32%;
                }
                & /deep/ .el-select {
                  width: 32%;
                }
                /deep/ .el-input-number--mini {
                  line-height: 34px;
                  width: calc(32% - 24px);
                  color: #fff;
                  .el-input-number__decrease,
                  .el-input-number__increase {
                    background: #7085a5;
                  }
                }
                .day {
                  width: 20px;
                  display: inline-block;
                }
                // 设备图片
                .input-logo {
                  position: relative;
                  display: inline-block;
                  // width: 120px;
                  // width: 50%;
                  width: 475px;
                  height: 345px;
                  .input-file {
                    position: absolute;
                    // width: 345px;
                    width: 100%;
                    height: 345px;
                    opacity: 0;
                    cursor: pointer;
                  }
                  .logo {
                    // width: 345px;
                    width: 100%;
                    height: 345px;
                    background-color: #ccc;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  }
                  .code {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    width: 60px;
                    height: 60px;
                    img {
                      width: 60px;
                      height: 60px;
                    }
                  }
                }
              }
              .block-right {
                vertical-align: top;
                display: inline-block;
                height: 360px;
                width: 50%;
                .sin-right {
                  width: 100%;
                  margin-bottom: 16px;
                  .attr {
                    width: 30%;
                    display: inline-block;
                  }
                  & > .el-input {
                    width: 64%;
                  }
                  & > .el-input.scale-input {
                    width: calc(64% - 20px);
                  }
                  & /deep/ .el-cascader {
                    width: 64%;
                  }
                  /deep/ .el-input-number--mini {
                    line-height: 34px;
                    width: calc(64% - 24px);
                    color: #fff;
                    .el-input-number__decrease,
                    .el-input-number__increase {
                      background: #7085a5;
                    }
                  }
                  & /deep/ .el-select {
                    width: 64%;
                  }
                }
              }
            }
            .component {
              /deep/ .el-tab-pane {
                overflow: hidden;
              }
              .el-cascader {
                width: 300px;
              }
            }
            // 操作按钮
            .deal {
              margin-top: 50px;
              padding-left: 40px;
              box-sizing: border-box;
            }
          }
          .float-right {
          }
        }
      }
    }
  }
  .com-dialog {
    /deep/ .el-cascader {
      width: 100%;
    }
  }
}
</style>