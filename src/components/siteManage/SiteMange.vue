<template>
  <!-- 站点管理 -->
  <div id="site">
    <MyBreadcrumb level1="站点监控" level2="接入站点设置" />
    <div class="article">
      <!-- 边栏 -->
      <div class="beside">
        <div class="list">
          <el-tree
            :data="siteTree"
            :props="defaultProps"
            node-key="id"
            ref="groupTree"
            highlight-current
            default-expand-all
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>
                <i :class="data.icon"></i>
                <!-- <i class="el-icon-edit"></i> -->
                <span>{{ node.label }}</span>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
      <!-- 内容 -->
      <div class="content">
        <!-- <el-tabs v-model="activeName" @tab-click="handleClick"> -->
        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="first">
            <div style="margin: 10px 0 0 10px;" v-show="currentSiteId">
              <span>所属平台:&nbsp;</span>
              <span>{{ companyName }}</span>
            </div>
          </el-tab-pane>
          <el-tab-pane label="监控设备" name="second" v-if="currentSiteId">
            <span>{{' 【' + currentName + '】 '}}</span>
            <span>站点的所有监控设备</span>
            <div style="height: 30px;width: 92px;float: right;margin-top: -5px;">
              <el-button class="confirm" type="button" size="mini" @click="addGroup">+ 添加分组</el-button>
            </div>
            <div class="table">
              <el-table
                :data="tableData"
                style="width: 100%"
                row-key="id"
                v-loading="loading"
                @toggleRowExpansion="toggleExpand"
                :row-style="rowStyle"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
              >
                <el-table-column width="48"></el-table-column>
                <el-table-column prop="name" min-width="220">
                  <template slot="header">
                    <span>名称</span>
                  </template>
                  <template slot-scope="scope">
                    <div style="float: left;width: 18px;height: 19px;" v-show="scope.row.classify"></div>
                    <i class="el-icon-folder-opened" v-show="!scope.row.classify"></i>
                    {{scope.row.name}}
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="id" label="编号"></el-table-column> -->
                <el-table-column prop="address" label="额定电压(V)" min-width="220"></el-table-column>
                <el-table-column label="操作" width="210">
                  <template slot-scope="scope">
                    <div v-if="!scope.row.classify">
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
                          @click="editGroup(scope.row)"
                        ></el-button>
                      </el-tooltip>
                      <el-tooltip
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
                          @click="deleteGroup(scope.row)"
                        ></el-button>
                      </el-tooltip>
                      <el-tooltip
                        class="item"
                        effect="dark"
                        offset="-20"
                        content="添加子设备"
                        placement="top-start"
                      >
                        <el-button
                          icon="el-icon-document-add"
                          size="mini"
                          class="confirm"
                          @click="addEquip(scope.row)"
                        ></el-button>
                      </el-tooltip>
                      <el-tooltip
                        class="item"
                        effect="dark"
                        offset="-20"
                        content="批量删除设备"
                        placement="top-start"
                      >
                        <el-button
                          icon="el-icon-document-delete"
                          size="mini"
                          class="del"
                          @click="delMulAmmeter(scope.row)"
                        ></el-button>
                      </el-tooltip>
                    </div>
                    <div v-else>
                      <el-tooltip
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
                          @click="deleteEquip(scope.row)"
                        ></el-button>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <!------------------------------------------ 所有设备 -->
          <el-tab-pane label="所有设备" name="third" v-if="currentSiteId">
            <div>
              <div style="float: left;">
                <span>{{' 【' + currentName + '】 '}}</span>
                <span>站点的所有设备</span>
              </div>
              <div class="equip-edit" style="float: right; margin: 0px 0px 0px 50px;">
                <div style="float: right">
                  <el-button size="mini" class="confirm" @click="addGateway">+ 添加网关</el-button>
                  <el-button
                    size="mini"
                    class="confirm"
                    icon="el-icon-upload2"
                    :disabled="exportModelLoading"
                    v-loading="exportModelLoading"
                    @click="exportModel"
                  >导出模板</el-button>
                  <el-button
                    size="mini"
                    class="confirm"
                    icon="el-icon-download"
                    @click="importFile"
                  >批量导入</el-button>
                  <el-button
                    size="mini"
                    class="confirm"
                    icon="el-icon-upload2"
                    :disabled="exportLoading"
                    v-loading="exportLoading"
                    element-loading-background="rgba(67, 92, 112, 0.5)"
                    @click="importEquip"
                  >导出设备</el-button>
                </div>
              </div>
              <el-table
                :data="gatewayObj"
                v-loading="gatewayLoading"
                style="width: 100%"
                @expand-change="expandChange"
                :expand-row-keys="expands"
                :row-key="getRowkeys"
                class="all-table"
              >
                <el-table-column type="expand">
                  <el-table
                    :data="ammeterTable"
                    border
                    v-loading="equipLoading"
                    style="width: 100%;"
                  >
                    <el-table-column type="index"></el-table-column>
                    <el-table-column prop="name" label="设备描述"></el-table-column>
                    <el-table-column prop="number" label="设备编号"></el-table-column>
                    <el-table-column prop="gatewayId" label="所属网关"></el-table-column>
                    <el-table-column prop="param" label="在线状态">
                      <template slot-scope="scope">
                        <p v-if="scope.row.param == '1'" class="text-green">
                          <i
                            :class="{icon: true, 'iconfont': true, 'iconnav_zaixianjieshou': true}"
                          ></i>
                        </p>
                        <p v-else class="text-gray">
                          <i :class="{icon: true, 'iconfont': true, 'iconnav_lixianjieshou': true}"></i>
                        </p>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <!-- <el-button type="text" size="small">查看</el-button> -->
                        <el-tooltip
                          class="item"
                          effect="dark"
                          offset="-20"
                          content="编辑"
                          placement="top-start"
                        >
                          <el-button
                            icon="el-icon-edit"
                            class="confirm"
                            size="mini"
                            @click="editAmmeter(scope.row)"
                          ></el-button>
                        </el-tooltip>
                        <el-tooltip
                          class="item"
                          effect="dark"
                          offset="-20"
                          content="删除"
                          placement="top-start"
                        >
                          <el-button
                            icon="el-icon-delete"
                            class="del"
                            size="mini"
                            @click="tryDelAmmeter(scope.row)"
                          ></el-button>
                        </el-tooltip>
                        <!-- <el-button @click="editAmmeter(scope.row)" type="text" size="small">编辑</el-button>
                        <el-button @click="tryDelAmmeter(scope.row)" type="text" size="small">删除</el-button>-->
                      </template>
                    </el-table-column>
                  </el-table>
                  <!-- 分页 -->
                  <div class="block">
                    <el-pagination
                      @size-change="equipSizeChange"
                      @current-change="equipCurrentChange"
                      :current-page="equipCurrentPage"
                      :page-sizes="[10,20,50]"
                      :page-size="equipSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="totalEquipment"
                    ></el-pagination>
                  </div>
                  <!-- </template> -->
                </el-table-column>
                <el-table-column prop="name" label="网关名称" width="210"></el-table-column>
                <el-table-column label="ID" prop="equipmentId"></el-table-column>
                <el-table-column label="连接电表数" prop="linker"></el-table-column>
                <el-table-column label="在线状态" prop="param">
                  <template slot-scope="scope">
                    <p v-if="scope.row.param == '1'" class="text-green">
                      <i :class="{icon: true, 'iconfont': true, 'iconnav_zaixianjieshou': true}"></i>
                    </p>
                    <p v-else class="text-gray">
                      <i :class="{icon: true, 'iconfont': true, 'iconnav_lixianjieshou': true}"></i>
                    </p>
                  </template>
                </el-table-column>
                <el-table-column width="210" label="操作">
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
                        class="confirm"
                        size="mini"
                        @click="editGateway(scope.row)"
                      ></el-button>
                    </el-tooltip>
                    <el-tooltip
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
                        @click="tryDelGateway(scope.row)"
                      ></el-button>
                    </el-tooltip>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      offset="-20"
                      content="新增设备"
                      placement="top-start"
                    >
                      <el-button
                        icon="el-icon-document-add"
                        size="mini"
                        class="confirm"
                        @click="addAmmeter(scope.row)"
                      ></el-button>
                    </el-tooltip>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      offset="-20"
                      content="批量删除设备"
                      placement="top-start"
                    >
                      <el-button
                        icon="el-icon-document-delete"
                        size="mini"
                        class="del"
                        @click="delMulAmmeter1(scope.row)"
                      ></el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 分页 -->
            <div class="block white-bgc">
              <el-pagination
                @size-change="gateSizeChange"
                @current-change="gateCurrentChange"
                :current-page="gatePage"
                :page-sizes="[10,20,50]"
                :page-size="gatePageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalGate"
              ></el-pagination>
            </div>
          </el-tab-pane>
          <!--------------------------- 电价 -->
          <el-tab-pane label="用电电价" name="forth" v-if="currentSiteId">
            <div class="count">
              <span>月结算日:</span>
              <el-select v-model="countTime" style="width: 120px;">
                <el-option
                  v-for="(item,index) in countTimeOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <el-tabs v-model="activeEle" @tab-click="electricityClick" class="select">
              <el-tab-pane label="电度电价" name="electricity">
                <!-- 电价 -->
                <div class="electoric">
                  <div class="ele-title">
                    <h4>电价列表</h4>
                    <el-button class="confirm" @click="addElectricityRule">+ 新增</el-button>
                  </div>
                  <!-- <el-form
                v-for="(item, index) in priceDetailArr"
                :key="index"
                :model="item"
                :rules="priceRules"
                ref="priceRef"
                class="demo-ruleForm"
                  >-->
                  <el-form
                    v-for="(item, index) in priceDetailArr"
                    :key="index"
                    :model="item"
                    :rules="priceRules"
                    ref="priceRef"
                    class="demo-ruleForm"
                  >
                    <div class="form-left">
                      <el-form-item label="策略名称" prop="stagePrice.name">
                        <el-input v-model.trim="item.stagePrice.name" style="width: 180px;"></el-input>
                      </el-form-item>
                    </div>
                    <div class="form-right">
                      <!-- 需求之后补充 -->
                      <!-- <el-form-item label="设置单价" prop="resource">
                    <el-radio-group v-model="item.stagePrice.resource">
                      <el-radio label="分时电价"></el-radio>
                      <el-radio label="不分时"></el-radio>
                    </el-radio-group>
                      </el-form-item>-->
                      <el-form-item label="平单价(元)" prop="stagePrice.ping" class="number">
                        <!-- <el-input-number
                          v-model="item.stagePrice.ping"
                          controls-position="right"
                          :min="0"
                          :max="10"
                          :step="0.1"
                          :precision="1"
                        ></el-input-number>-->
                        <el-input v-model="item.stagePrice.ping"></el-input>
                      </el-form-item>
                      <el-form-item label="峰单价(元)" prop="stagePrice.feng" class="number">
                        <!-- <el-input-number
                          v-model="item.stagePrice.feng"
                          controls-position="right"
                          :min="0"
                          :max="10"
                          :step="0.1"
                          :precision="1"
                        ></el-input-number>-->
                        <el-input v-model="item.stagePrice.feng"></el-input>
                      </el-form-item>
                      <el-form-item label="谷单价(元)" prop="stagePrice.gu" class="number">
                        <!-- <el-input-number
                          v-model="item.stagePrice.gu"
                          controls-position="right"
                          :min="0"
                          :max="10"
                          :step="0.1"
                          :precision="1"
                        ></el-input-number>-->
                        <el-input v-model="item.stagePrice.gu"></el-input>
                      </el-form-item>
                      <div class="price-tab">
                        <el-table :data="item.stageSections">
                          <el-table-column prop="beginTime" label="开始时间" width="120">
                            <template slot-scope="scope">
                              <el-select
                                v-model="scope.row.begin"
                                :disabled="defalutBooleanTrue"
                                placeholder="请选择"
                              >
                                <el-option
                                  v-for="item in timeOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                                ></el-option>
                              </el-select>
                            </template>
                          </el-table-column>
                          <el-table-column prop="beginTime" label="结束时间" width="120">
                            <template slot-scope="scope">
                              <el-select
                                v-model="scope.row.end"
                                @change="endTimeChange(index, scope.$index)"
                                placeholder="请选择"
                                :disabled="item.stageSections.length-1 > scope.$index"
                              >
                                <el-option
                                  v-for="item in timeOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                                ></el-option>
                              </el-select>
                            </template>
                          </el-table-column>
                          <el-table-column prop="type" label="峰谷属性" width="120">
                            <template slot-scope="scope">
                              <el-select
                                v-model="scope.row.type"
                                :disabled="item.stageSections.length-1 > scope.$index"
                                placeholder="请选择"
                              >
                                <el-option
                                  v-for="item in priceOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                                ></el-option>
                              </el-select>
                            </template>
                          </el-table-column>
                          <el-table-column prop="beginTime" label="峰谷属性" width="120">
                            <template slot="header">
                              <el-button @click="addPrice(index)" type="text">+添加</el-button>
                            </template>
                            <template slot-scope="scope">
                              <el-button
                                class="confirm"
                                :disabled="scope.$index !== item.stageSections.length - 1"
                                @click="delPrice(index,scope.$index)"
                              >删除</el-button>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                      <el-button
                        class="confirm"
                        @click="editElectricitySubmit(index)"
                        style="float: right;"
                      >保存</el-button>
                      <el-popconfirm @onConfirm="delElectricity(item)" title="是否确定删除？">
                        <el-button
                          slot="reference"
                          class="del"
                          style="float: right; margin-right: 20px;"
                        >删除</el-button>
                      </el-popconfirm>
                    </div>
                  </el-form>
                </div>
              </el-tab-pane>
              <el-tab-pane label="电表设备" name="equipment">
                <div class="ele-equip">
                  <div class="equip-title">
                    <h4>配置列表</h4>
                  </div>
                  <div class="conf-title">
                    <span>名称</span>
                    <span>监控设备</span>
                    <span>电度电价名称</span>
                    <el-button type="text" @click="addConf">+ 添加</el-button>
                  </div>
                  <div class="config" v-for="(item, index) in equip_conf_arr" :key="index">
                    <div class="conf-single">
                      <div class="input">
                        <el-input v-model="item.confName"></el-input>
                      </div>
                      <div @click="selectEquip(index)" class="dis-input">
                        <el-input v-model="item.equipmentName" readonly></el-input>
                      </div>
                      <div class="select">
                        <el-select v-model="item.name" placeholder="请选择" no-data-text="无数据">
                          <el-option
                            v-for="item in ruleNameArr"
                            :key="item.name"
                            :label="item.name"
                            :value="item.name"
                          ></el-option>
                        </el-select>
                      </div>
                      <el-button type="text" @click="delConf(index)">- 删除</el-button>
                    </div>
                  </div>
                  <div class="deal">
                    <el-button class="confirm" @click="editEleConfSubmit">保存</el-button>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
          <el-tab-pane label="能源配置" name="fifth" v-if="currentSiteId">
            <div class="energy-config">
              <div class="equip-title">
                <h4>配置列表</h4>
              </div>
              <div class="conf-title">
                <span>设备</span>
                <span>能源类型</span>
                <el-button type="text" @click="addEnergyConf">+ 添加</el-button>
              </div>
              <div class="config" v-for="(item, index) in energyConfigList" :key="index">
                <div class="conf-single">
                  <div @click="selectEnergyEquip(index)" class="dis-input">
                    <el-input v-model="item.equipmentName" readonly></el-input>
                  </div>
                  <div class="select">
                    <el-select v-model="item.type" placeholder="请选择" no-data-text="无数据">
                      <el-option
                        v-for="item in energyTypeList"
                        :key="item.id"
                        :label="item.properties"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </div>
                  <el-button type="text" @click="delEnergyConf(index)">- 删除</el-button>
                </div>
              </div>
              <div class="deal">
                <el-button class="confirm" @click="editEnergyConfSubmit">保存</el-button>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-------------------------- 编辑分组弹窗 -->
    <el-dialog
      title="编辑分组信息"
      :visible.sync="groupVisible"
      width="440px"
      modal
      :close-on-click-modal="false"
      @close="before_group_close"
    >
      <el-form
        :model="groupForm"
        :rules="groupRules"
        ref="groupRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="所属站点" prop="group">
          <el-select
            v-model="groupForm.group"
            placeholder="请选择所属站点"
            @visible-change="getSite"
            disabled
            style="width: 247px;"
          >
            <el-option
              v-for="item in siteOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分组名称" prop="name">
          <el-input v-model.trim="groupForm.name" style="width: 247px;"></el-input>
        </el-form-item>
        <!-- <el-form-item label="监控画面" prop="moudle">
          <el-input v-model="groupForm.moudle" placeholder="监控画面的访问地址"></el-input>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="groupVisible = false">取 消</el-button>
        <el-button class="confirm" @click="groupSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!--------------------------------- 删除分组弹窗 -->
    <el-dialog
      title="删除分组"
      :visible.sync="groupDeleteVisible"
      width="540px"
      modal
      modal-append-to-body
      :close-on-click-modal="false"
      @close="before_del_group_close"
    >
      <div style="width: 30px;float: left;margin: -7px 8px 5px -8px;">
        <i :class="{icon: true, 'iconfont': true, 'iconjinggao1': true}"></i>
      </div>
      <span>{{'是否确定删除' + delGroupName + '？'}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="groupDeleteVisible = false">取 消</el-button>
        <el-button class="dang" @click="deleteGroupSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-------------------------- 删除分组下的监控设备弹窗 -->
    <el-dialog
      title="删除设备"
      :visible.sync="equipDeleteVisible"
      width="540px"
      modal
      modal-append-to-body
      :close-on-click-modal="false"
      @close="before_del_equip_close"
    >
      <div style="width: 30px;float: left;margin: -7px 8px 5px -8px;">
        <i :class="{icon: true, 'iconfont': true, 'iconjinggao1': true}"></i>
      </div>
      <span>{{'是否确定删除' + delEquipName + '？'}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="equipDeleteVisible = false">取 消</el-button>
        <el-button class="dang" @click="deleteEquipSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!--------------------------------- 新增网关弹窗 -->
    <el-dialog
      title="新增网关"
      :visible.sync="addGatewayVisible"
      width="420px"
      modal
      modal-append-to-body
      :close-on-click-modal="false"
      @close="clearGatewayForm"
    >
      <el-form ref="gatewayRef" :model="gatewayForm" :rules="gatewayRule" label-width="100px">
        <el-form-item label="网关名称" prop="name">
          <el-input v-model.trim="gatewayForm.name" placeholder="请输入网关名称"></el-input>
        </el-form-item>
        <el-form-item label="网关编号" prop="id">
          <el-input v-model.number="gatewayForm.id" placeholder="请输入网关编号"></el-input>
        </el-form-item>
        <el-form-item label="连接数" prop="linker">
          <el-input v-model.trim="gatewayForm.linker" placeholder="请输入连接数量"></el-input>
        </el-form-item>
        <el-form-item label="所属站点" prop="room">
          <el-select v-model="gatewayForm.room" placeholder="请选择所属站点" disabled>
            <el-option v-for="item in roomList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上报周期" prop="period">
          <el-select v-model="gatewayForm.period" placeholder="请选择周期">
            <el-option label="不上报" value="0"></el-option>
            <el-option label="五分钟" value="5"></el-option>
            <el-option label="一小时" value="60"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="addGatewayVisible = false">取 消</el-button>
        <el-button class="confirm" @click="gatewaySubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-------------------------------- 分组批量新增监控变量弹窗 -->
    <el-dialog
      title="新增子设备"
      :visible.sync="add_group_variable_Visible"
      :close-on-click-modal="false"
      class="config-window"
      width="500px"
      @close="gruop_add_variate_close"
    >
      <div style="margin-bottom: 10px;">
        <span>分组：</span>
        <span>{{group_add_variate_name}}</span>
      </div>

      <el-select
        v-model="value"
        multiple
        filterable
        default-first-option
        placeholder="请选择子设备"
        class="select-variate"
        style="width: 300px"
      >
        <el-option
          v-for="item in options"
          :key="item.equipmentId"
          :label="item.name"
          :value="item.equipmentId"
        ></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="add_group_variable_Visible = false">取 消</el-button>
        <el-button class="confirm" @click="modify">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹出编辑网关页面 -->
    <el-dialog
      title="编辑网关"
      :visible.sync="gatewayVisible"
      width="420px"
      modal
      :close-on-click-modal="false"
      :show-close="true"
      @close="clearEditGatewayForm"
    >
      <el-form
        :label-position="labelPosition"
        label-width="100px"
        ref="editGatewayRef"
        :rules="editGatewayRule"
        style="width: 100%;"
        :model="editGatewayForm"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="editGatewayForm.name" class="eidt-input-width"></el-input>
        </el-form-item>
        <el-form-item label="ID" prop="id" v-show="false">
          <el-input v-model.number="editGatewayForm.id" disabled class="eidt-input-width"></el-input>
        </el-form-item>
        <el-form-item label="在线状态" prop="param">
          <el-input v-model.trim="editGatewayForm.param" disabled class="eidt-input-width"></el-input>
        </el-form-item>

        <el-form-item label="连接电表数" prop="linker">
          <el-input v-model.trim="editGatewayForm.linker" class="eidt-input-width"></el-input>
        </el-form-item>
        <el-form-item label="网关编号" prop="equipmentId">
          <el-input v-model.trim="editGatewayForm.equipmentId" disabled class="eidt-input-width"></el-input>
        </el-form-item>
        <el-form-item label="所属站点">
          <el-input v-model="currentName" disabled class="eidt-input-width"></el-input>
        </el-form-item>
        <el-form-item label="上报周期" prop="cron">
          <el-select
            v-model.trim="editGatewayForm.cron"
            placeholder="请选择周期"
            class="eidt-input-width"
          >
            <el-option
              v-for="item in cronOptions"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="gatewayVisible = false">取 消</el-button>
        <el-button class="confirm" @click="submitGatewayChange">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除网关 -->
    <el-dialog title="提示" :visible.sync="delGatewayVisible" width="30%">
      <div style="width: 30px;float: left;margin: -7px 8px 5px -8px;">
        <i :class="{icon: true, 'iconfont': true, 'iconjinggao1': true}"></i>
      </div>
      <span>是否确定删除网关{{ delName }}？</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="delGatewayVisible = false">取 消</el-button>
        <el-button class="dang" @click="delGateway">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑电表弹窗 -->
    <el-dialog
      :visible.sync="ammeterVisible"
      width="650px"
      title="编辑电表"
      modal
      :close-on-click-modal="false"
      :show-close="true"
      @close="before_ammeter_close"
      class="variate-dialog"
    >
      <el-form
        :label-position="labelPosition"
        :rules="ammeterRule"
        ref="ammeterRef"
        label-width="80px"
        :model="editammeterForm"
        class="variate-form"
      >
        <div v-if="!ifAddEquip" class="edit-input">
          <el-form-item label="设备名称" prop="name">
            <el-input v-model.trim="editammeterForm.name" class="input-width-s"></el-input>
          </el-form-item>
          <el-form-item label="所属网关" prop="gatewayName">
            <el-input v-model="editammeterForm.gatewayName" class="input-width-s" disabled></el-input>
          </el-form-item>
          <el-form-item label="额定电压" prop="ratedVoltage">
            <el-input
              v-model.number="editammeterForm.ratedVoltage"
              class="input-width-s"
              placeholder="请输入额定电压"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属站点" prop="siteName">
            <el-input v-model="editammeterForm.siteName" class="input-width-s" disabled></el-input>
          </el-form-item>
          <el-form-item label="设备编号" prop="number">
            <el-input v-model="editammeterForm.number" class="input-width-s" disabled></el-input>
          </el-form-item>
          <el-form-item label="设备类型" prop="equipfileId">
            <el-select
              v-model.trim="editammeterForm.equipfileId"
              class="input-width-s"
              placeholder="请选择设备类型"
              @visible-change="getAllFileEquip"
              clearable
            >
              <el-option
                v-for="item in fileEquipOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="上报周期" prop="cron">
            <el-select
              v-model.trim="editammeterForm.cron"
              placeholder="请选择周期"
              class="input-width-s"
              disabled
            >
              <el-option
                v-for="item in cronOptions"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="在线状态" prop="param">
            <el-input v-model="editammeterForm.param" class="input-width-s" disabled></el-input>
          </el-form-item>-->
        </div>
        <div v-else class="edit-input">
          <el-form-item label="设备名称" prop="name">
            <el-input
              v-model.trim="editammeterForm.name"
              class="input-width-s"
              placeholder="请输入设备名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="设备编号" prop="id">
            <el-input
              v-model.number="editammeterForm.id"
              class="input-width-s"
              placeholder="请输入电表ID"
            ></el-input>
          </el-form-item>
          <el-form-item label="额定电压" prop="ratedVoltage">
            <el-input
              v-model.number="editammeterForm.ratedVoltage"
              class="input-width-s"
              placeholder="请输入额定电压"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属站点" prop="room">
            <el-select
              v-model.trim="editammeterForm.room"
              class="input-width-s"
              placeholder="请选择所属站点"
              disabled
            >
              <el-option
                v-for="item in roomList2"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属网关" prop="gateway">
            <el-select
              v-model="editammeterForm.gateway"
              class="input-width-s"
              placeholder="请选择网关"
              disabled
            >
              <el-option
                v-for="item in gatewayList2"
                :key="item.equipmentId"
                :label="item.name"
                :value="item.equipmentId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备类型" prop="equipfileId">
            <el-select
              v-model.trim="editammeterForm.equipfileId"
              class="input-width-s"
              placeholder="请选择设备类型"
              @visible-change="getAllFileEquip"
              clearable
            >
              <el-option
                v-for="item in fileEquipOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <p class="data-text">编辑数据区</p>
      <div class="data-area">
        <el-button @click="addArea" size="small" type="success" plain>+ 添加数据区</el-button>
        <span>*起始地址为寄存器编号（十进制），长度为数据区所占用的寄存器个数</span>
        <div class="tb-data">
          <table>
            <thead>
              <tr class="table-head">
                <th>名称</th>
                <th>起始地址</th>
                <th>长度</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr class="table-body" v-for="(item, index) in editData" :key="index">
                <td>
                  <input type="text" v-model.trim="item.areaName" />
                </td>
                <td>
                  <input type="text" v-model.trim="item.begin" />
                </td>
                <td>
                  <input type="text" v-model.trim="item.length" />
                </td>
                <td>
                  <!-- <a class="primary-text" @click.stop="save(item.id)">保存</a> -->
                  <el-button type="text" class="danger-text" @click="del(index)">删除</el-button>
                </td>
              </tr>
            </tbody>
          </table>
          <p class="saying" v-if="editData.length == 0">当前数据区为空</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="ammeterVisible = false">取 消</el-button>
        <el-button class="confirm" @click="submitEquipmentChange">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除电表 -->
    <el-dialog
      title="提示"
      :visible.sync="delAmmeterVisible"
      width="30%"
      modal
      :close-on-click-modal="false"
      :show-close="true"
    >
      <div style="width: 30px;float: left;margin: -7px 8px 5px -8px;">
        <i :class="{icon: true, 'iconfont': true, 'iconjinggao1': true}"></i>
      </div>
      <span>是否确认删除设备 {{ delName }}?</span>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="delAmmeterVisible = false">取 消</el-button>
        <el-button class="dang" @click="delAmmeter">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增文件表单 --------------------->
    <el-dialog
      title="导入文件"
      :visible.sync="importFileVisible"
      :close-on-click-modal="false"
      width="500px"
      @close="beforeFileClose"
      class="file-dialog"
    >
      <!-- <el-form :model="addFileForm" label-width="100px" class="form">
        <el-form-item label="选择文件" prop="file" style="position: relative;">
          <input
            @change="selectFile($event)"
            type="file"
            ref="input1"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="importFileVisible = false">取 消</el-button>
        <el-button class="confirm" @click.prevent="fileSubmit">确 定</el-button>
      </span>-->
      <el-upload
        action="#"
        :file-list="fileList"
        :on-change="changeData"
        :http-request="handleRequest"
        :before-upload="beforeUpload"
        style="padding-top: 10px"
        :disabled="ifUpload"
      >
        <el-button class="btn upload-btn" :disabled="ifUpload">上传附件</el-button>
        <div slot="tip" class="el-upload__tip">上传文件大小不超过50M</div>
      </el-upload>
      <div class="pro" v-show="ifUpload" style="display: flex;">
        <span>上传进度</span>
        <el-progress
          style="margin-bottom: 10px; flex: 1; margin-left: 16px;"
          :stroke-width="6"
          :percentage="progressPercent"
        ></el-progress>
      </div>
      <div
        style="width: 100%; height: 30px;"
        v-loading="parseLoading"
        element-loading-text="服务器正在解析..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(40, 57, 70)"
      ></div>
    </el-dialog>

    <!-- 批量删除 -->
    <el-dialog
      title="批量删除监控设备"
      :visible.sync="deleteMonitorMulVisible"
      width="500px"
      class="user-dialog"
      @close="clearMonitorInfo"
    >
      <el-form
        :model="delMonitorMulForm"
        :rules="delMonitorMulRule"
        ref="delMonitorMulRef"
        label-width="110px"
        class="user-form"
      >
        <el-form-item label="删除多选项" prop="id">
          <el-select
            v-model="delMonitorMulForm.id"
            multiple
            filterable
            default-first-option
            placeholder="请选择设备"
          >
            <el-option
              v-for="item in monitorMulOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="deleteMonitorMulVisible = false">取 消</el-button>
        <el-button class="dang" @click="delMulSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 电表配置修改设备弹窗 -->
    <el-dialog
      title="选择监控配置"
      :visible.sync="selectMonitorVisible"
      width="500px"
      class="conf-dialog"
      :close-on-click-modal="false"
      :show-close="true"
    >
      <el-cascader
        :key="casKey"
        :show-all-levels="false"
        v-model="monitorEquipId"
        :props="defaultConfProps"
        :options="group_equip_options"
        @change="monitorEquipSelect"
        ref="myCascader"
      ></el-cascader>
    </el-dialog>
  </div>
</template>

<script>
import MyBreadcrumb from "../subcomponents/Mybreadcrumb";
import GLOBAL from "../../utils/global_variable";
// 引入深拷贝
import { deepClone } from "../../utils/index";
import { findArrIndex, isPositiveInteger } from "../../utils/index";
export default {
  components: {
    MyBreadcrumb
  },
  data() {
    // 新增网关、新增设备表单中的编号验证
    var checkId = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("编号不能为空"));
      }
      if (!Number.isInteger(value) || value < 1) {
        callback(new Error("请输入正整数值"));
      } else {
        callback();
      }
    };
    // 新增网关、编辑网关表单中的连接数验证
    var checkLinker = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("连接数不能为空"));
      }
      if (!Number.isInteger(parseInt(value)) || value < 1) {
        callback(new Error("请输入正整数值"));
      } else {
        callback();
      }
    };
    return {
      parseLoading: false,
      siteTree: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      activeName: "first",
      tableData: [],
      companyName: null,
      // 添加设备
      ammeterVisible: false,
      ammeterForm: {},
      ammeterRule: {
        group: [{ required: true, message: "请选择分组", trigger: "blur" }],
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        id: [{ required: true, message: "请输入合理编号", trigger: "blur" }]
      },
      roomList2: [],
      gatewayList2: [],
      dataArea: [],
      dataIndex: 0, //用于记录数据区的行数索引

      // 新增分组
      siteOptions: [],
      groupForm: {
        name: ""
      },
      groupRules: {
        group: [{ required: true, message: "请选择分组", trigger: "blur" }],
        name: [{ required: true, message: "请输入名称", trigger: "blur" }]
      },
      groupVisible: false,
      groupDeleteVisible: false,
      // ------------------------------------所有设备
      exportModelLoading: false, //导出模板加载状态
      exportLoading: false, //导出设备加载状态
      fileList: [], //导入文件列表
      ifUpload: false, //是否上传文件中
      progressPercent: 0, //文件导入百分比
      addGatewayVisible: false, //新增网关弹窗
      gatewayForm: {}, //新增网关表单
      // 新增网关表单验证
      gatewayRule: {
        name: [
          {
            required: true,
            message: "请输入网关名称",
            trigger: "blur"
          }
        ],
        id: [
          {
            validator: checkId,
            required: true,
            // message: "请输入id",
            trigger: "blur"
          }
        ],
        linker: [
          {
            validator: checkLinker,
            required: true,
            // message: "请输入连接数",
            trigger: "blur"
          }
        ],
        room: [
          {
            required: true,
            message: "请选择站点",
            trigger: "blur"
          }
        ],
        period: [
          {
            required: true,
            message: "请选择周期",
            trigger: "blur"
          }
        ]
      },
      // 编辑网关表单验证
      editGatewayRule: {
        name: [
          {
            required: true,
            message: "请输入网关名称",
            trigger: "blur"
          }
        ],
        id: [
          {
            required: true,
            message: "请输入网关编号",
            trigger: "blur"
          }
        ],
        linker: [
          {
            validator: checkLinker,
            required: true,
            // message: "请输入连接数",
            trigger: "blur"
          }
        ],
        room: [
          {
            required: true,
            message: "请选择站点",
            trigger: "blur"
          }
        ],
        period: [
          {
            required: true,
            message: "请选择周期",
            trigger: "blur"
          }
        ]
      },

      roomList: [],
      linker: "",
      currentSiteId: "", //当前展示的站点
      currentName: "",
      delGroupName: "", //要删除的分组名称
      delGroupId: "", //要删除的分组id
      editGroupId: "", //编辑中的分组id
      add_group_variable_Visible: false, //分组添加变量弹窗
      watchArr: [
        {
          equip_options: [],
          index: 0,
          code: ""
        }
      ],
      modifyId: "",
      options: [], //所有设备可选项
      value: [], //设备选中项
      variateStr: "", //设备编号集
      group_add_variate_name: "", //分组名
      group_add_variate_Id: "", //分组id
      equipDeleteVisible: false, //删除设备
      equipDeleteId: null, //要删除的设备Id
      delEquipName: null, //要删除的设备名称
      loading: false,
      deleteMonitorMulVisible: false, //批量删除监控变量
      delMonitorMulForm: {}, //批量删除变量表单
      delMonitorMulRule: {
        id: [
          {
            required: true,
            message: "请选择设备",
            trigger: "blur"
          }
        ]
      },
      monitorMulOptions: [], //所有能删除的变量
      // 所有设备
      getRowkeys(row) {
        return row.id;
      },
      gatewayObj: [],
      gatewayLoading: false,
      ammeterTable: [],
      equipLoading: false,
      totalEquipment: 0,
      equipCurrentPage: 1,
      gatePageSize: 10,
      totalGate: 0,
      ammeterVisible: false,
      ammeterForm: {},
      expands: [],
      // gateCurrentPage: 1,
      gatewayId: null, //标记正在操作的网关id
      // equipPage: 1,
      equipSize: 10,
      gatePage: 1, //网关当前页
      delGatewayVisible: false,
      delName: null,
      gatewayVisible: false,
      editGatewayForm: {
        name: "",
        id: "",
        linker: "",
        belong: "",
        cron: "",
        equipmentId: "",
        gatewayId: ""
      },
      labelPosition: "right",
      cronOptions: [
        { label: "不上报", value: 0 },
        { label: "5分钟", value: 5 },
        { label: "60分钟", value: 60 }
      ],
      editammeterForm: {
        name: "",
        computerRoom: "",
        ratedVoltage: "", //额定电压
        gatewayId: "",
        // cron: "",
        id: "",
        equipmentId: "",
        siteName: "",
        gatewayName: "",
        equipfileId: null
      },
      existDataIdArr: [], //编辑设备时已经存在的id
      delDataIdArr: [], //编辑设备时删除已存在的id
      ammeterRule: {
        name: [
          {
            required: true,
            message: "请输入设备名称",
            trigger: "blur"
          }
        ],
        ratedVoltage: [
          {
            required: true,
            message: "请输入额定电压",
            trigger: "blur"
          }
        ],
        id: [
          {
            validator: checkId,
            required: true,
            // message: "请输入id",
            trigger: "blur"
          }
        ],
        room: [
          {
            required: true,
            message: "请选择站点",
            trigger: "blur"
          }
        ],
        gatewayId: [
          {
            required: true,
            message: "请选择网关",
            trigger: "blur"
          }
        ],
        computerRoom: [
          {
            required: true,
            message: "请选择机房",
            trigger: "blur"
          }
        ]
        // cron: [
        //   {
        //     required: true,
        //     message: "请选择网关",
        //     trigger: "blur"
        //   }
        // ],
      },
      ifAddEquip: false,
      // 弹窗的编辑数据区数据
      editData: [],
      delAmmeterVisible: false,
      linker: null,
      importFileVisible: false, //批量导入设备弹窗
      addFileForm: {}, //批量导入设备文件表单
      ifMonitor: false, //是否批量删除监控设备
      fileEquipOptions: [], //编辑电表中的档案设备选项
      // ----------------------------------------------电价
      countTime: "", //月结算日
      countTimeOptions: [],
      defalutBooleanTrue: true,
      priceDetailArr: [
        // {
        //   stagePrice: {
        //     name: "",
        //     ping: "",
        //     feng: "",
        //     gu: "",
        //     site: ""
        //   },
        //   stageSections: [
        //     {
        //       begin: "",
        //       name: "",
        //       end: "",
        //       type: "",
        //       site: "",
        //       user: ""
        //     }
        //   ]
        // }
      ],
      priceForm: {},
      priceRules: {
        "stagePrice.name": [
          { required: true, message: "请输入名称", trigger: "blur" }
        ],
        "stagePrice.ping": [
          { required: true, message: "请输入大于0的价格", trigger: "blur" }
        ],
        "stagePrice.feng": [
          { required: true, message: "请输入大于0的价格", trigger: "blur" }
        ],
        "stagePrice.gu": [
          { required: true, message: "请输入大于0的价格", trigger: "blur" }
        ]
      },
      priceData: [
        {
          beginTime: "",
          endTime: "",
          attr: ""
        },
        {
          beginTime: "",
          endTime: "",
          attr: ""
        }
      ],
      timeOptions: [],
      priceOptions: [
        {
          label: "平",
          value: 1
        },
        {
          label: "峰",
          value: 2
        },
        {
          label: "谷",
          value: 3
        }
      ],
      activeEle: "", //用电电价的选中标签
      // 电价电表配置默认
      defaultConfProps: {
        children: "children",
        label: "name",
        value: "id"
      },
      group_equip_options: [], //电价电表联级数据
      temp_options: [], //临时联级数据
      // 电表电费配置数据
      equip_conf_arr: [
        {
          confName: "1",
          equipmentId: "",
          name: 1,
          site: ""
        }
      ], //电表配置数组数据
      equipId: [],
      ruleNameArr: [], //规则名称集合
      selectMonitorVisible: false, //电表配置弹窗
      monitorEquipId: [], //弹窗选中的设备id集合
      casKey: 1, //联级key，用于刷新组件
      equipConfIndex: 0, //编辑电表配置的下标
      // --------------------------------能源配置
      energyConfigList: [], //能源配置
      energyTypeList: [] //能源类型
    };
  },
  watch: {
    countTime() {
      this.$http
        .post("equipment/site/electricityCycle", {
          siteId: this.$store.state.site.siteId,
          electricityCycle: this.countTime
        })
        .then(res => {
          if (res.data.code === 0) {
          }
        });
    },
    progressPercent(newValue) {
      if (newValue == 100) {
        this.parseLoading = true;
      }
    }
  },
  methods: {
    // 新增网关
    addGateway() {
      this.gatewayForm.room = this.currentSiteId;
      this.roomList = this.$store.state.site.siteList;
      this.addGatewayVisible = true;
    },
    // 提交新增网关
    gatewaySubmit() {
      this.$refs.gatewayRef.validate(valid => {
        if (valid) {
          // 连接数不能超过255且为整数
          if (
            this.gatewayForm.linker - 0 > 254 ||
            this.gatewayForm.linker % 1 != 0 ||
            this.gatewayForm.linker < 1
          ) {
            this.$message({
              message: "网关连接数应为1-254",
              type: "warning"
            });
            return;
          }
          if (this.gatewayForm.id % 256 != 0 || this.gatewayForm.id < 0) {
            this.$message({
              message: "当前网关编号错误",
              type: "warning"
            });
            return;
          }
          var _this = this.gatewayForm;
          // return
          this.$http
            .post("/equipment/equipment/gatewayadd", {
              equipmentId: _this.id,
              name: _this.name,
              gatewayId: _this.id,
              linker: _this.linker,
              computerRoom: _this.room,
              cron: parseInt(_this.period)
            })
            .then(res => {
              if (res.data.code == 0) {
                // this.$message({
                //   message: "添加成功",
                //   type: "success"
                // });
                this.$notify({
                  title: "成功",
                  message: "添加成功",
                  type: "success"
                });
                this.getGateway(this.cuurrentId);
              } else if (res.data.code == 600) {
                this.$notify.error({
                  title: "错误",
                  message: "网关编号已存在"
                });
              }
            })
            .catch(res => {});
        } else {
          return;
        }
      });
    },
    handleNodeClick(data) {
      this.loading = true;
      if (data.name == "所有站点" && !data.id) {
        this.activeName = "first";
        this.currentSiteId = null;
        this.currentName = null;
      } else {
        this.siteDetail(data.id);
        this.activeName = "first";
        this.currentName = data.name;
        this.currentSiteId = data.id;
        // this.getGroup(data.id);
        // this.getGateway(data.id);
      }
    },
    // 标签页切换
    handleClick(tab, event) {
      switch (tab.name) {
        case "first":
          break;
        case "second":
          this.getGroup(this.currentSiteId);
          break;
        case "third":
          this.getGateway(this.currentSiteId);
          break;
        case "forth":
          // this.getElectricityRule();
          // 结算日赋值
          let arr = this.$store.state.site.siteList;
          let siteId = this.$store.state.site.siteId;
          let obj;
          obj = arr.find(item => {
            return item.id === siteId;
          });
          if (obj) {
            this.countTime = obj.electricityCycle;
          }
          this.priceDetailArr = [];
          // 默认选中电价
          this.activeEle = "electricity";
          this.getAllRuleDetail(this.currentSiteId);
          break;
        case "fifth":
          this.getAllGroup();
          this.searchEnergyConfig();
          this.getAllEnergyType();
          break;
        default:
          brak;
      }
    },
    toggleExpand(row, expanded) {},
    // 添加监控设备
    addEquip(row) {
      this.group_add_variate_Id = null;
      this.add_group_variable_Visible = true;
      this.group_add_variate_name = row.name;
      this.group_add_variate_Id = row.id;
      this.$http
        .get("equipment/getEqByRoom", {
          params: {
            roomId: this.currentSiteId
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.options = res.data.data;
          }
        })
        .catch(res => {});
    },
    addData() {
      var obj = {
        id: this.dataIndex++
      };
      this.dataArea.push(obj);
    },
    // 数据区单行删除
    del(index) {
      if (this.editData[index].id) {
        this.delDataIdArr.push(this.editData[index].id);
      }
      this.editData.splice(index, 1);
    },
    // 获取所有站点
    getSite() {
      this.siteOptions = this.$store.state.site.siteList;
    },
    // 添加分组
    addGroup() {
      this.groupVisible = true;
      this.groupForm.group = this.currentSiteId;
      this.siteOptions = this.$store.state.site.siteList;
    },

    // 添加编辑设备关闭前
    before_ammeter_close() {
      // 重置表单验证、清空表单
      this.$refs.ammeterRef.resetFields();
      // this.editammeterForm = {};
      this.editData = [];
      this.delDataIdArr = [];
      this.existDataIdArr = [];
    },
    // 编辑分组弹窗关闭前
    before_group_close() {
      this.editGroupId = null;
      this.groupForm = {
        name: "",
        group: ""
      };
      this.$refs.groupRef.resetFields();
    },

    // 分组编辑
    editGroup(row) {
      this.siteOptions = this.$store.state.site.siteList;
      this.groupForm.group = this.currentSiteId;
      this.groupForm.name = row.name;
      // this.groupForm.name = '111111';
      // this.groupForm.id = row.id;
      this.editGroupId = row.id;
      this.groupVisible = true;
    },
    // 分组编辑提交
    groupSubmit() {
      this.$refs.groupRef.validate(valid => {
        if (valid) {
          if (this.editGroupId) {
            this.$http
              .post("equipment/classify/modify", {
                id: this.editGroupId,
                name: this.groupForm.name,
                computerRoom: this.groupForm.group
              })
              .then(res => {
                if (res.data.code == 0) {
                  this.$notify({
                    title: "成功",
                    message: "修改成功",
                    type: "success"
                  });
                  this.groupVisible = false;
                  this.getGroup(this.currentSiteId);
                }
              })
              .then(res => {});
          } else {
            this.$http
              .post("equipment/classify/add", {
                name: this.groupForm.name,
                computerRoom: this.groupForm.group
              })
              .then(res => {
                if (res.data.code == 0) {
                  this.$notify({
                    title: "成功",
                    message: "提交成功",
                    type: "success"
                  });
                  this.getGroup(this.currentSiteId);
                  this.groupVisible = false;
                }
              });
          }
        } else {
          return false;
        }
      });
    },
    // 分组删除
    deleteGroup(row) {
      this.delGroupName = row.name;
      this.delGroupId = row.id;
      this.groupDeleteVisible = true;
    },
    // 分组删除提交
    deleteGroupSubmit() {
      this.$http
        .get("equipment/classify/remove", {
          params: {
            classifyId: this.delGroupId
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success"
            });
            this.groupDeleteVisible = false;
            this.getGroup(this.currentSiteId);
          }
        })
        .catch(res => {});
    },
    // 添加子分组
    addSubGroup() {
      this.groupVisible = true;
    },
    // 查看站点下的分类
    getGroup(id) {
      this.loading = true;
      this.$http
        .get("equipment/classify/findAllByRoom", {
          params: {
            roomId: id
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            var groupArr = res.data.data;
            var str = "";
            groupArr.forEach(item => {
              str = str + item.id + ",";
            });
            if (str.length == 0) {
              this.tableData = [];
              this.loading = false;
              return;
            }
            this.$http
              .get("equipment/classifyEquipment/findAllByClassify", {
                params: {
                  classifyIds: str.slice(0, str.length - 1)
                }
              })
              .then(res => {
                if (res.data.code == 0) {
                  var res1 = res.data.data;
                  for (var i = 0; i < groupArr.length; i++) {
                    if (res1[i].ClassifyEquipmentVO.length) {
                      for (
                        var j = 0;
                        j < res1[i].ClassifyEquipmentVO.length;
                        j++
                      ) {
                        res1[i].ClassifyEquipmentVO[j].id = -res1[i]
                          .ClassifyEquipmentVO[j].id;
                      }
                      groupArr[i].children = res1[i].ClassifyEquipmentVO;
                    }
                  }
                  this.tableData = groupArr;
                  this.loading = false;
                  this.$forceUpdate(); //强制更新页面
                }
              })
              .catch(res => {
                this.loading = false;
              });
          }
        })
        .catch(res => {});
    },
    before_del_group_close() {
      this.delGroupName = "";
      this.delGroupId = "";
    },
    // 分组新增监控设备提交
    modify() {
      var code = "";
      if (this.value.length > 0) {
        code = this.value.join(",");
      } else {
        this.$message("请务必选择至少一个设备后提交");
        return;
      }
      this.$http
        .post("equipment/classifyEquipment/add", {
          classifyId: this.group_add_variate_Id,
          equipmentIds: code
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$notify({
              title: "成功",
              message: "新增成功",
              type: "success"
            });
            this.getGroup(this.currentSiteId);
            this.add_group_variable_Visible = false;
          }
        })
        .catch(res => {});
    },
    before_del_equip_close() {
      this.equipDeleteId = null;
      this.equipDeleteName = null;
    },
    // 点击删除监控设备
    deleteEquip(row) {
      this.equipDeleteVisible = true;
      this.delEquipName = row.name;
      this.equipDeleteId = Math.abs(row.id); //id返回原来正值
    },
    // 提交监控设备删除
    deleteEquipSubmit() {
      this.$http
        .get("equipment/classifyEquipment/removeById", {
          params: {
            id: this.equipDeleteId
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success"
            });
            this.equipDeleteVisible = false;
            this.getGroup(this.currentSiteId);
          }
        })
        .catch(res => {});
    },
    gruop_add_variate_close() {
      this.value = [];
    },
    // 表格展开
    expandChange(row, expandedRows) {
      //只展开一行
      if (expandedRows.length) {
        //说明展开了
        this.ammeterTable = [];
        if (row) {
          this.expands.push(row.id); //只展开当前行id
        }
        this.gatewayId = row.equipmentId;
        this.equipCurrentPage = 1;
        this.getEquipment();
      } else {
        //说明收起了
        this.equipLoading = false;
      }
    },
    equipCurrentChange(val) {
      this.equipCurrentPage = val;
      this.getEquipment();
    },
    equipSizeChange(val) {
      this.equipSize = val;
      this.equipCurrentPage = 1;
      this.getEquipment();
    },
    // 网关每页数据大小改变
    gateSizeChange(val) {
      this.gatePageSize = val;
      this.gatePage = 1;
      this.getGateway();
    },
    // 网关页码改变
    gateCurrentChange(val) {
      this.gatePage = val;
      this.getGateway();
    },
    // 根据站点获取网关
    getGateway() {
      this.expands = [];
      this.gatewayLoading = true;
      let timeout = setTimeout(() => {
        this.gatewayLoading = false;
      }, 15000);
      this.$http
        .get("/equipment/gatewayList", {
          params: {
            roomId: this.currentSiteId,
            // roomId: val,
            size: this.gatePageSize,
            page: this.gatePage - 1
          }
        })
        .then(res => {
          this.gatewayLoading = false;
          clearTimeout(timeout);
          if (res.data.code == 0) {
            this.gatewayObj = res.data.data.gateways;
            // return
            this.totalGate = res.data.data.total;
            this.gatewayLoading = false;
          }
        })
        .catch(res => {
          clearTimeout(timeout);
          this.gatewayLoading = false;
        });
    },
    // 获取设备电表
    getEquipment() {
      this.equipLoading = true;
      // this.equipLoading = true

      let timeout = setTimeout(() => {
        this.equipLoading = false;
      }, 15000);

      this.$http
        .get("/equipment/equipmentList", {
          params: {
            gatewayId: this.gatewayId,
            size: this.equipSize,
            page: this.equipCurrentPage - 1
          }
        })
        .then(res => {
          this.equipLoading = false;
          if (res.data.code == 0) {
            this.expands.splice(0, this.expands.length - 1);
            this.totalEquipment = res.data.data.total;
            var a = res.data.data;
            this.ammeterTable = a.equipments;
            this.equipLoading = false;
          }
        })
        .catch(res => {
          this.equipLoading = false;
        });
    },
    // 删除网关弹窗
    tryDelGateway(row) {
      this.delName = row.name;
      this.delId = row.id;
      this.delGatewayVisible = true;
    },
    // 确认删除网关
    delGateway() {
      this.$http
        .get("equipment/equipmentRemove", {
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
            this.delGatewayVisible = false;
            this.gatePage = 1;
            this.getGateway();
          } else {
            this.$notify.error({
              title: "错误",
              message: res.data.msg
            });
          }
        })
        .catch(res => {});
    },
    // 编辑网关获取数据
    editGateway(row) {
      this.gatewayVisible = true;
      this.$http
        .get("/equipment/equipmentDetail", {
          params: {
            id: row.id
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            var gate = this.editGatewayForm;
            var equip = res.data.data.equipment;
            gate.name = equip.name || "null";
            gate.id = equip.id;
            gate.linker = equip.linker;
            gate.param = equip.param;
            gate.belong = equip.computerRoom;
            gate.equipmentId = equip.equipmentId;
            gate.gatewayId = equip.gatewayId;
            gate.param = equip.param == 0 ? "不在线" : "在线"; //过滤
            var sign =
              equip.cron && equip.cron > 0 ? equip.cron + "分钟" : "不上报";
            var select;
            this.cronOptions.map(function(value, index) {
              if (value.label == sign) {
                select = value.value;
              }
            });
            this.editGatewayForm.cron = select;
          }
        })
        .catch(res => {});
    },
    // 提交网关修改
    submitGatewayChange() {
      if (
        this.$refs.editGatewayRef.validate(valid => {
          if (valid) {
            // 连接数不能超过255且为整数
            if (
              this.editGatewayForm.linker - 0 > 254 ||
              this.editGatewayForm.linker % 1 != 0 ||
              this.editGatewayForm.linker < 1
            ) {
              this.$message({
                message: "网关连接数应为1-254",
                type: "warning"
              });
              return;
            }
            this.$http
              .post("/equipment/equipment/gatewayUpdate", {
                id: this.editGatewayForm.id,
                // 设备id应该是跟网关id同步
                equipmentId: this.editGatewayForm.equipmentId,
                name: this.editGatewayForm.name,
                gatewayId: this.editGatewayForm.equipmentId,
                linker: this.editGatewayForm.linker,
                cron: parseInt(this.editGatewayForm.cron),
                computerRoom: this.editGatewayForm.belong,
                param: this.editGatewayForm.param == "不在线" ? 0 : 1
              })
              .then(res => {
                if (res.data.code == 0) {
                  this.$notify({
                    title: "成功",
                    message: "修改成功",
                    type: "success"
                  });
                  this.gatewayVisible = false;
                  this.gatePage = 1;
                  this.getGateway();
                }
              })
              .catch(res => {});
          }
        })
      )
        this.gatewayVisible = false;
    },
    // 新增设备提交
    ammeterSubmit() {
      this.$refs.ammeterRef.validate(valid => {
        if (valid) {
          // return
          var index = this.gatewayList2.findIndex((item, index) => {
            return item.gatewayId == this.editammeterForm.gateway;
          });

          this.linker = this.gatewayList2[index].linker;
          var _this = this.editammeterForm;
          // 验证编号范围
          if (_this.id > this.linker + 1 || _this.id < 1) {
            this.$message({
              message: "设备编号范围为" + "1---" + (this.linker + 1),
              type: "warning"
            });
            return;
          }
          for (var i = 0; i < this.editData.length; i++) {
            // 遍历对象属性是否为空
            if (
              !(
                this.editData[i].begin &&
                this.editData[i].areaName &&
                this.editData[i].length
              )
            ) {
              this.$message("请输入正确的变量格式");
              return;
            }
            delete this.editData[i].id;
          }
          this.$http
            .post("/equipment/equipment/equipmentadd", {
              number: _this.id,
              name: _this.name,
              ratedVoltage: _this.ratedVoltage,
              // cron: _this.cron,
              gatewayId: _this.gateway,
              computerRoom: _this.room,
              equipfileId: _this.equipfileId,
              dataAreaForms: JSON.stringify(this.editData)
            })
            .then(res => {
              if (res.data.code == 0) {
                // this.ammeterVisible = false;
                this.$notify({
                  title: "成功",
                  message: "提交成功",
                  type: "success"
                });
                this.getEquipment();
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "warning"
                });
              }
            })
            .catch(res => {});
        }
      });
    },
    // 编辑电表获取数据
    editAmmeter(row) {
      this.getAllFileEquip(true);
      this.ammeterVisible = true;
      this.ifAddEquip = false;
      this.$http
        .get("/equipment/equipmentDetail", {
          params: {
            id: row.id
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            var ammeter = this.editammeterForm;
            ammeter.computerRoom = res.data.data.equipment.computerRoom;
            ammeter.gatewayId = res.data.data.equipment.gatewayId;
            ammeter.name = res.data.data.equipment.name;
            ammeter.cron = res.data.data.equipment.cron;
            // res.data.data.equipment.cron && res.data.data.equipment.cron > 0
            //   ? res.data.data.equipment.cron + "分钟"
            //   : "不上报";
            ammeter.equipmentId = res.data.data.equipment.equipmentId;
            ammeter.ratedVoltage = res.data.data.equipment.ratedVoltage;
            ammeter.number = res.data.data.equipment.number;
            ammeter.siteName = res.data.data.siteName;
            ammeter.gatewayName = res.data.data.gatewayName;
            ammeter.id = row.id;
            ammeter.param = res.data.data.equipment.param;
            ammeter.monitorStatus = res.data.data.equipment.monitorStatus;
            ammeter.equipfileId = res.data.data.equipfileId;
            // ammeter.param = res.data.data.equipment.param == 1 ? '在线' : '不在线'
            this.editData = []; //清除掉之前操作的数据
            // 清空已存在数据区id
            this.existDataIdArr = [];
            // 对数组对象赋值及数据处理
            for (var i = 0; i < res.data.data.dataAreas.length; i++) {
              this.editData.push({
                length: res.data.data.dataAreas[i].length,
                eqId: res.data.data.dataAreas[i].equipmentId,
                areaName: res.data.data.dataAreas[i].name,
                begin: res.data.data.dataAreas[i].begin,
                id: res.data.data.dataAreas[i].id,
                index: this.dataIndex++ //用来标记需要删除的行数据
              });
              // 存储已存在的数据地址
              this.existDataIdArr.push(res.data.data.dataAreas[i].id);
            }
          }
        })
        .catch(res => {});
    },
    // 获取所有的档案设备
    getAllFileEquip(flag) {
      if (flag) {
        this.$http
          .get("equipment/equipmentFile/findAll", {
            params: {
              siteId: this.currentSiteId
            }
          })
          .then(res => {
            if (res.data.code === 0) {
              this.fileEquipOptions = res.data.data;
            }
          });
      }
    },
    // 弹窗的添加数据区按钮
    addArea() {
      this.editData.push({
        index: this.dataIndex++
      });
    },
    // 设备编辑或新增提交
    submitEquipmentChange() {
      var ifGo = true; //用于验证表单是否有空值
      this.$refs.ammeterRef.validate(valid => {
        ifGo = valid;
      });
      if (!ifGo) {
        return;
      }
      for (var i = 0; i < this.editData.length; i++) {
        if (
          !(
            (this.editData[i].begin || this.editData[i].begin === "0") &&
            (this.editData[i].areaName || this.editData[i].areaName === "0") &&
            (this.editData[i].length || this.editData[i].length === "0")
          )
        ) {
          this.$message("请输入正确的非空数据格式");
          return;
        }
        // 起始地址应该为正整数
        if (
          !(
            parseInt(this.editData[i].begin) === +this.editData[i].begin &&
            +this.editData[i].begin >= 0
          )
        ) {
          this.$message("数据区起始地址范围应为不小于0的整数！");
          return;
        }
        // 长度应该为正整数
        if (
          !(
            parseInt(this.editData[i].length) === +this.editData[i].length &&
            +this.editData[i].length > 0
          )
        ) {
          this.$message("长度应为正整数！");
          return;
        }
        // 删除掉多余的对象属性
        this.$delete(this.editData[i], "index");
      }
      if (this.ifAddEquip) {
        // 新增
        this.ammeterSubmit();
        return;
      }

      //--------------------------------------
      for (var i = 0; i < this.editData.length; i++) {
        this.editData[i].eqId = this.editammeterForm.equipmentId;
      }

      // return

      this.$http
        .post("/equipment/equipment/equipmentUpdate", {
          id: this.editammeterForm.id,
          number: this.editammeterForm.number,
          name: this.editammeterForm.name,
          gatewayId: this.editammeterForm.gatewayId,
          computerRoom: this.editammeterForm.computerRoom,
          dataAreaForms: JSON.stringify(this.editData),
          param: this.editammeterForm.param,
          rmDa: this.delDataIdArr.join(","),
          monitorStatus: this.editammeterForm.monitorStatus,
          ratedVoltage: this.editammeterForm.ratedVoltage,
          equipfileId: this.editammeterForm.equipfileId
          // id:
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$notify({
              title: "成功",
              message: "修改成功",
              type: "success"
            });
          }
          this.ammeterVisible = false;
          this.getEquipment();
          this.getGroup(this.currentSiteId);
        })
        .catch(res => {});
    },
    // 删除电表弹窗
    tryDelAmmeter(row) {
      this.delAmmeterVisible = true;
      this.delName = row.name;
      this.delId = row.id;
    },
    // 电表删除
    delAmmeter() {
      this.$http
        .get("/equipment/equipmentRemove", {
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
            this.getEquipment();
          } else {
            this.$notify.error({
              title: "错误",
              message: res.data.msg
            });
          }
          this.getGroup(this.currentSiteId);
          this.delAmmeterVisible = false;
        })
        .catch(res => {});
    },
    // 网关新增设备
    addAmmeter(row) {
      this.editammeterForm = {
        name: "",
        computerRoom: "",
        ratedVoltage: "", //额定电压
        gatewayId: "",
        // cron: "",
        id: "",
        equipmentId: "",
        siteName: "",
        gatewayName: ""
      };
      this.gatewayId = row.gatewayId;
      this.ifAddEquip = true;
      this.roomList2 = this.$store.state.site.siteList;
      this.editammeterForm.room = this.currentSiteId;
      this.gatewayList2 = this.gatewayObj;
      this.editammeterForm.gateway = row.gatewayId;
      this.ammeterVisible = true;
    },
    // 新增网关窗口关闭前
    clearGatewayForm() {
      this.gatewayForm = {};
      // 清除表单验证
      this.$refs.gatewayRef.resetFields();
    },
    // 编辑网关窗口关闭前
    clearEditGatewayForm() {
      // 清除表单验证
      this.$refs.editGatewayRef.resetFields();
      this.gatewayForm = {};
    },
    // 导出模板
    exportModel() {
      this.exportModelLoading = true;
      this.$notify({
        message: "开始导出"
      });
      this.$http({
        methods: "GET",
        url: "equipment/equipment/uploadModel",
        responseType: "arraybuffer"
      })
        .then(res => {
          const link = document.createElement("a");
          const blob = new Blob([res.data], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          });
          let href = window.URL.createObjectURL(blob);
          link.href = href;

          let _fileName = res.headers["content-disposition"]
            .split(";")[1]
            .split("=")[1]
            .split(".")[0];
          // 文件名中有中文 则对文件名进行转码
          link.download = decodeURIComponent(_fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(href);
          setTimeout(() => {
            this.$notify({
              message: "模板已下载",
              type: "success"
            });
            this.exportModelLoading = false;
          }, 1000);
        })
        .catch(err => {
          this.exportModelLoading = false;
        });
    },
    // 导入文件
    importFile() {
      // 重置内容

      // this.$delete(this.addFileForm, "file");
      this.importFileVisible = true;
      // this.$nextTick(() => {
      //   let file = this.$refs.input1;
      //   file.value = "";
      //   this.$delete(this.addFileForm, "file");
      //   // file.value = null
      //   // file.outerHTML = file.outerHTML;
      // });
    },
    selectFile(event) {
      this.addFileForm.file = event.target.files[0];
    },
    fileSubmit() {
      if (this.addFileForm.file) {
        let formdata = new FormData();
        formdata.append("file", this.addFileForm.file);
        formdata.append("siteId", this.$store.state.site.siteId);
        formdata.append("companyId", this.$store.state.site.searchCompanyId);
        let config = {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        };
        this.$http
          .post("equipment/equipment/importExcel", formdata, config)
          .then(res => {
            if (res.data.code == 0) {
              this.$notify({
                title: "成功",
                message: "上传成功",
                type: "success"
              });
              this.importFileVisible = false;
            } else {
              this.$notify({
                title: "失败",
                message: res.data.msg,
                type: "warning"
              });
            }
          });
      } else {
        // 无文件提交提醒
        this.$notify({
          message: "请选择文件",
          type: "warning"
        });
      }
    },
    // 导出设备
    importEquip() {
      this.$notify({
        message: "开始导出"
      });
      this.exportLoading = true;
      this.$http({
        methods: "GET",
        url: "equipment/equipment/exportExcel",
        params: {
          siteId: this.currentSiteId
        },
        responseType: "arraybuffer"
      })
        .then(res => {
          const link = document.createElement("a");
          const blob = new Blob([res.data], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          });
          let href = window.URL.createObjectURL(blob);
          link.href = href;

          let _fileName = res.headers["content-disposition"]
            .split(";")[1]
            .split("=")[1]
            .split(".")[0];
          // 文件名中有中文 则对文件名进行转码
          link.download = decodeURIComponent(_fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(href);
          setTimeout(() => {
            this.$notify({
              message: "设备已导出",
              type: "success"
            });
            this.exportLoading = false;
          }, 1000);
        })
        .catch(err => {
          this.exportLoading = false;
        });
    },
    // --------------------------------
    //上传前对文件大小进行校验
    beforeUpload(file) {
      // console.log(file)
      // console.log(file.type)
      var arr = file.name.split(".");
      if (!(arr[arr.length - 1] === "xlsx" || arr[arr.length - 1] === "xls")) {
        this.$message.error("请选择表格文件");
        return false;
      }
      // return
      const isLt2M = file.size / 1024 / 1024 < 50;
      console.log(isLt2M);
      if (!isLt2M) {
        this.$message.error("上传文件大小大小不能超过 50MB!");
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
      let formdata = new FormData();
      formdata.append("file", data.file);
      formdata.append("siteId", this.currentSiteId);
      formdata.append("companyId", this.$store.state.site.searchCompanyId);
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
      this.actionURL = "equipment/equipment/importExcel";

      this.$http
        .post(this.actionURL, formdata, config)
        .then(res => {
          if (res.data.code === 0) {
            // alert("成功");
            this.parseLoading = false;
            this.$notify({
              title: "导入成功",
              type: "success"
            });
            // 设置0.3秒延迟关闭弹窗
            setTimeout(() => {
              this.importFileVisible = false;
            }, 300);
            this.getGateway();
          } else {
            this.parseLoading = false;
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
          }
        })
        .catch(res => {
          this.parseLoading = false;
          this.fileList = [];
          // this.update
          this.ifUpload = false;
          this.progressPercent = 0;
        });
    },
    beforeFileClose() {
      this.gatePage = 1;
      this.ifUpload = false;
      this.progressPercent = 0;
      this.fileList = [];
    },
    // 站点详情
    siteDetail(id) {
      this.$http
        .get("equipment/siteDetail", {
          params: {
            siteId: id
          }
        })
        .then(res => {
          this.companyName = res.data.data.companyName;
        });
    },
    // 批量删除分组设备
    delMulAmmeter(row) {
      this.deleteMonitorMulVisible = true;
      this.ifMonitor = true;
      this.getDelMonitorVariable(row.id);
    },
    // 批量删除设备
    delMulAmmeter1(row) {
      this.deleteMonitorMulVisible = true;
      this.ifMonitor = false;
      this.getDelVariable(row.gatewayId);
    },
    // 提交删除批量设备或分组设备
    delMulSubmit(row) {
      this.$refs.delMonitorMulRef.validate(valid => {
        if (!valid) {
          return;
        }
        let id = this.delMonitorMulForm.id.join(",");
        if (!this.ifMonitor) {
          this.$http
            .get("equipment/equipmentRemove", {
              params: {
                id: id
              }
            })
            .then(res => {
              if (res.data.code == 0) {
                this.$notify({
                  message: "删除成功",
                  type: "success"
                });
                this.deleteMonitorMulVisible = false;
                this.getGateway(this.currentSiteId);
              } else {
                this.$notify({
                  message: res.data.msg,
                  type: "warning"
                });
              }
            });
        } else {
          this.$http
            .get("equipment/classifyEquipment/removeById", {
              params: {
                id: id
              }
            })
            .then(res => {
              if (res.data.code === 0) {
                this.$notify({
                  message: "删除成功",
                  type: "success"
                });
                this.deleteMonitorMulVisible = false;
                this.getGroup(this.currentSiteId);
              } else {
                this.$notify({
                  message: res.data.msg,
                  type: "warning"
                });
              }
            });
        }
      });
    },
    // 获取能删除的网关下的设备
    getDelVariable(id) {
      this.$http
        .get("/equipment/equipmentList", {
          params: {
            gatewayId: id,
            size: GLOBAL.max_page_size,
            page: 0
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.monitorMulOptions = res.data.data.equipments;
          }
        });
    },
    // 获取能删除的分组下的设备
    getDelMonitorVariable(id) {
      this.$http
        .get("equipment/classifyEquipment/findAllByClassify", {
          params: {
            classifyIds: id
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.monitorMulOptions = res.data.data[0].ClassifyEquipmentVO;
          }
        });
    },
    clearMonitorInfo() {
      this.delMonitorMulForm.id = [];
      this.$refs.delMonitorMulRef.resetFields();
    },
    rowStyle(row, rowIndex) {},
    // 获取当前登录用户所能获取的所有站点
    getAllSites() {
      var paramsObj = {
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

    // ----------------------------------用电电价
    electricityClick(tab) {
      if (this.activeEle === "equipment") {
        // 电表配置
        this.getAllGroup();
        this.getElectricityRule();
        this.getAllEleConf();
      } else {
        // 电度
        this.getAllRuleDetail(this.currentSiteId);
      }
    },

    // 新增电费分段规则
    addElectricityRuleSubmit(obj) {
      this.$http
        .post("equipment/stagesection/newStagesection", {
          id: obj.stagePrice.id,
          name: obj.stagePrice.name,
          ping: obj.stagePrice.ping,
          feng: obj.stagePrice.feng,
          gu: obj.stagePrice.gu,
          site: obj.stagePrice.site,
          stageSection: obj.stageSections
        })
        .then(res => {
          if (res.data.code === 0) {
            // console.log(res.data.data);
            this.$notify({
              message: "新增成功,已刷新",
              type: "success"
            });
            this.getAllRuleDetail(this.currentSiteId);
          } else {
            this.$notify({
              message: res.data.msg,
              type: "warning"
            });
          }
        });
    },
    // 修改电费分段规则提交
    editElectricityRuleSubmit(obj) {
      this.$http
        .post("equipment/stagesection/modifyStagesection", {
          id: obj.stagePrice.id,
          name: obj.stagePrice.name,
          ping: obj.stagePrice.ping,
          feng: obj.stagePrice.feng,
          gu: obj.stagePrice.gu,
          site: obj.stagePrice.site,
          stageSection: obj.stageSections
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$notify({
              type: "success",
              message: "提交成功,已刷新！"
            });
            this.getAllRuleDetail(this.currentSiteId);
          } else {
            this.$notify({
              message: res.data.msg,
              type: "warning"
            });
          }
        });
    },
    // 查询站点所有分段规则明细
    getAllRuleDetail(id) {
      this.$http
        .get("equipment/stagesection/findBySite", {
          params: {
            site: id
            // site: 1
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            console.log(res.data.data);
            this.priceDetailArr = res.data.data;
          }
        });
    },
    // 获取时间数组
    getTimeOptions() {
      // 获取00:00到24:00（每隔三十分钟）
      var arr = [];
      for (var i = 0; i < 25; i++) {
        var hour = i;
        for (var j = 0; j < 60; j = j + 30) {
          var min = j < 10 ? "0" + j : j;
          if (hour === 24 && j == "30") {
            break;
          }
          arr.push({
            label: "" + (hour > 9 ? hour : "0" + hour) + ":" + min,
            value: parseFloat(hour + "." + min / 6)
          });
        }
      }
      this.timeOptions = arr;
    },
    // 添加时间区间
    addPrice(index) {
      var lastObj = this.priceDetailArr[index].stageSections[
        this.priceDetailArr[index].stageSections.length - 1
      ];
      // 判断结束时间和类型是否填写
      if (!(lastObj.end && lastObj.end !== 24 && lastObj.type)) {
        return;
      }
      let begin = this.priceDetailArr[index].stageSections[
        this.priceDetailArr[index].stageSections.length - 1
      ].end;
      var obj = {
        begin: begin,
        name: "",
        end: 24,
        type: 1,
        site: this.$store.state.site.siteId,
        user: this.$store.state.userInfo.userId
      };
      this.priceDetailArr[index].stageSections.push(obj);
    },
    // ------------------删除时间区间
    delPrice(index, index1) {
      // 两个下标分别代表第几个详情跟第几个时间段
      if (index1 === 0) {
        // 不允许删除第一个
        return;
      }
      this.priceDetailArr[index].stageSections.splice(index1, 1);
      this.priceData.splice(index, 1);
      // 最后一个赋值24小时
      this.priceDetailArr[index].stageSections[index1 - 1].end = 24;
    },
    // ---------------结束时间改变
    endTimeChange(index, index1) {
      // 分别表示详情下标跟表格下标
      if (this.priceDetailArr[index].stageSections.length - 1 > index1) {
        // 下面存在的话也应该修改起始值
        this.priceDetailArr[index].stageSections[
          index1 + 1
        ].begin = this.priceDetailArr[index].stageSections[index1].end;
      }
    },
    // --------------点击保存单个电价详情
    editElectricitySubmit(index) {
      // 多个表单独立验证是否为空
      this.$refs.priceRef[index].validate(valid => {
        if (!valid) {
          return;
        } else {
          let arr = this.priceDetailArr[index].stageSections;
          // 判断结束时间跟开始时间是否冲突
          let ifWrong = false;
          for (var i = 0; i < arr.length; i++) {
            if (!(arr[i].end > arr[i].begin)) {
              ifWrong = true;
              this.$notify({
                message: "请选择合理的时间格式及填满24小时",
                type: "warning"
              });
              break;
            }
          }
          if (ifWrong) {
            return;
          }
          // 判断最后一个时间是否为24时
          if (
            this.priceDetailArr[index].stageSections[
              this.priceDetailArr[index].stageSections.length - 1
            ].end !== 24
          ) {
            this.$notify({
              message: "请选择合理的时间格式及填满24小时",
              type: "warning"
            });
            return;
          }
          // 遍历重新赋值name属性
          this.priceDetailArr[index].stageSections.map(item => {
            return (item.name = this.priceDetailArr[index].stagePrice.name);
          });
          // 详情深拷贝
          let obj = deepClone(this.priceDetailArr[index]);
          console.log(obj);
          if (obj.stagePrice.id) {
            // 编辑
            obj.stageSections = JSON.stringify(obj.stageSections);
            // this.$http.get('equipment/')
            this.editElectricityRuleSubmit(obj);
          } else {
            // 新增
            obj.stageSections = JSON.stringify(obj.stageSections);
            this.addElectricityRuleSubmit(obj);
          }
        }
      });
    },
    // 新增规则
    addElectricityRule() {
      let obj = {
        stagePrice: {
          name: "",
          ping: "",
          feng: "",
          gu: "",
          site: this.currentSiteId
        },
        stageSections: [
          {
            begin: 0,
            name: "",
            end: 24,
            type: 1,
            site: this.currentSiteId,
            user: this.$store.state.userInfo.userId
          }
        ]
      };
      this.priceDetailArr.push(obj);
    },
    // 点击铲除规则按钮
    delElectricity(item) {
      // console.log(item)
      // return
      this.$http
        .post("equipment/stagesection/removeStagesection", {
          site: item.stagePrice.site,
          name: item.stagePrice.name
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$notify({
              type: "success",
              message: "删除成功,已刷新"
            });
            this.getAllRuleDetail(this.currentSiteId);
          } else {
            this.$notify({
              type: "warning",
              message: res.data.msg
            });
          }
        })
        .catch(res => {});
    },
    // -------------------电费配置
    // 新增站点电费配置
    addEleConfSubmit() {
      this.$http
        .post("equipment/electricity/newConf", {
          name: "",
          confName: "",
          equipment: "",
          site: ""
        })
        .then(res => {});
    },
    // 删除站点电费配置
    delEleConfSubmit() {
      this.$http
        .get("equipment/electricity/removeConf", {
          id: ""
        })
        .then(res => {});
    },
    // 修改站点电费配置提交
    editEleConfSubmit() {
      var ifNull;
      for (var i = 0; i < this.equip_conf_arr.length; i++) {
        if (
          !(
            this.equip_conf_arr[i].confName &&
            this.equip_conf_arr[i].equipmentName &&
            this.equip_conf_arr[i].name
          )
        ) {
          ifNull = true;
        }
      }
      if (ifNull) {
        this.$notify({
          message: "请勿输入或选择空数据",
          type: "warning"
        });
        return;
      }
      this.$http
        .post("equipment/electricity/modifyConf", {
          electricityConf: JSON.stringify(this.equip_conf_arr),
          siteId: this.currentSiteId
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$notify({
              message: "保存成功",
              type: "success"
            });
            this.getAllEleConf();
          } else {
            this.$notify({
              message: res.data.msg,
              type: "warning"
            });
          }
        });
    },
    // 查询所有电费配置
    getAllEleConf() {
      this.$http
        .get("equipment/electricity/confBySite", {
          params: {
            site: this.currentSiteId
          }
        })
        .then(res => {
          this.equip_conf_arr = res.data.data;
        });
    },
    // 查询站点下所有监控分组
    getAllGroup() {
      this.temp_options = [];
      // this.equipId = [];
      this.$http
        .get("equipment/classify/findAllByRoom", {
          params: {
            roomId: this.currentSiteId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.temp_options = res.data.data;
            // 分组集合数组
            var str = [];
            if (this.temp_options.length > 0) {
              str = this.temp_options.map(item => {
                return item.id;
              });
              this.getEquipByGroup(str);
            } else {
              // this.isResouceShow++; //改变元素key值，重新渲染
              // this.equipId = [];
              this.group_equip_options = [];
            }
          }
        });
    },
    // 根据分组集合查设备
    getEquipByGroup(str) {
      this.$http
        .get("equipment/classifyEquipment/findAllByClassify", {
          params: {
            classifyIds: str.join(",")
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            var res1 = res.data.data;
            var index = 0;
            for (var i = 0; i < this.temp_options.length; i++) {
              if (res1[i].ClassifyEquipmentVO.length) {
                for (var j = 0; j < res1[i].ClassifyEquipmentVO.length; j++) {
                  // id替换成设备id，用于最后取值(负值防止联级数据联级id冲突报错)
                  res1[i].ClassifyEquipmentVO[j].id = -res1[i]
                    .ClassifyEquipmentVO[j].equipmentId;
                  index++;
                  // 默认选中有设备的第一个分组的第一个设备
                  if (index === 1) {
                    var arr = [
                      this.temp_options[i].id,
                      res1[i].ClassifyEquipmentVO[j].id
                    ];
                  }
                }
                this.temp_options[i].children = res1[i].ClassifyEquipmentVO;
              }
            }
            // 临时数据赋值
            this.group_equip_options = this.temp_options;
          }
        });
    },
    // 获取站点下所有电费分段规则名称
    getElectricityRule() {
      this.$http
        .get("equipment/stagesection/getAllName", {
          params: {
            site: this.currentSiteId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            // console.log(res.data.data);
            this.ruleNameArr = res.data.data.names;
            for (var i = 0; i < this.ruleNameArr.length; i++) {
              var obj = { name: this.ruleNameArr[i] };
              this.$set(this.ruleNameArr, i, obj);
            }
          }
        });
    },
    // 新增电表配置
    addConf() {
      var obj = {
        confName: "",
        equipmentId: "",
        equipmentName: "",
        name: "",
        site: this.currentSiteId
      };
      this.equip_conf_arr.push(obj);
    },
    // 删除电表配置
    delConf(index) {
      this.equip_conf_arr.splice(index, 1);
    },
    // 编辑监控单个设备
    selectEquip(index) {
      this.casKey++;
      this.monitorEquipId[1] = [];
      this.selectMonitorVisible = true;
      this.equipConfIndex = index;
    },
    // 联级数据选中
    monitorEquipSelect() {
      // 强制异步赋值
      setTimeout(() => {
        this.$nextTick(() => {
          let equipmentId = Math.abs(this.monitorEquipId[1]); //设备id
          let equipmentName = this.$refs["myCascader"].inputValue;
          if (this.activeName === "forth") {
            this.$set(
              this.equip_conf_arr[this.equipConfIndex],
              "equipmentName",
              equipmentName
            );
            this.$set(
              this.equip_conf_arr[this.equipConfIndex],
              "equipmentId",
              equipmentId
            );
          } else if (this.activeName === "fifth") {
            this.$set(
              this.energyConfigList[this.equipConfIndex],
              "equipmentName",
              equipmentName
            );
            this.$set(
              this.energyConfigList[this.equipConfIndex],
              "equipmentId",
              equipmentId
            );
          }

          this.selectMonitorVisible = false;
        });
      }, 10);
    },
    getMonthTime() {
      let arr = [];
      for (var i = 1; i < 32; i++) {
        let obj = {
          label: i + "日",
          value: i
        };
        arr.push(obj);
      }
      this.countTimeOptions = arr;
    },
    //----------------------------------获取能源配置列表
    searchEnergyConfig() {
      this.$http
        .get("equipment/energyBranch/getTotalEnergyByEq", {
          params: {
            siteId: this.$store.state.site.siteId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            console.log(res);
            var arr = res.data.data;
            var arrData = [];
            arr.forEach((item, index) => {
              console.log(item, index);
              arrData[index] = {};
              arrData[index].equipmentId = item.equipment.equipmentId;
              arrData[index].equipmentName = item.equipment.name;
              arrData[index].type = item.type;
            });
            this.energyConfigList = arrData;
          }
        });
    },
    // 新增能源配置项
    addEnergyConf() {
      this.energyConfigList.push({});
    },
    // 编辑监控单个设备
    selectEnergyEquip(index) {
      this.casKey++;
      this.monitorEquipId[1] = [];
      this.selectMonitorVisible = true;
      this.equipConfIndex = index;
    },
    // 删除电表配置
    delEnergyConf(index) {
      this.energyConfigList.splice(index, 1);
    },
    // 获取所有能源类型
    getAllEnergyType() {
      this.$http
        .get("equipment/energyProperties/findAll", {
          params: {}
        })
        .then(res => {
          if (res.data.code === 0) {
            this.energyTypeList = res.data.data;
          }
        });
    },
    editEnergyConfSubmit() {
      var arr = JSON.parse(JSON.stringify(this.energyConfigList));
      arr.map(item => {
        (item.siteId = this.$store.state.site.siteId),
          this.$delete(item, "equipmentName");
      });
      console.log(arr);
      // return
      this.$http
        .post("equipment/energyBranch/setTotalEnergyByEq", {
          siteId: this.$store.state.site.siteId,
          totalEq: JSON.stringify(arr)
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$notify({
              title: "成功",
              message: "提交成功",
              type: "success"
            });
            this.selectMonitorVisible = false;
          } else {
            this.$notify({
              message: res.data.msg,
              type: "warning"
            });
          }
        });
    }
  },
  created() {
    // 先刷新vuex里面的所有站点
    this.getAllSites();
    this.siteTree = [
      {
        name: "所有站点",
        children: this.$store.state.site.siteList,
        icon: "el-icon-place",
        id: 0
      }
    ];
    this.$nextTick(() => {
      this.$refs.groupTree.setCurrentKey(0);
    });
    this.getTimeOptions();
    // 获取月结算所有日期
    this.getMonthTime();
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/index.less";
#site {
  height: 100%;
  margin: none;
  padding: none;
  .article {
    height: calc(100% - 58px);
    display: flex;
    /* 边栏 */
    .beside {
      padding: 10px 5px;
      height: 100%;
      width: 260px;
      margin-right: 10px;
      display: inline-block;
      background-color: rgba(67, 92, 112);
      box-sizing: border-box;
      .list {
        margin-top: 5px;
        padding-left: 5px;
        height: 100%;
        overflow: auto;
        background-color: rgba(67, 92, 112);
      }
    }
    /* 内容 */
    .content {
      width: calc(100% - 270px);
      height: 100%;
      display: inline-block;
      background-color: rgba(67, 92, 112);
      box-sizing: border-box;
      flex: 1;
      padding: 5px 0 0 15px;
      overflow: auto;
      color: #ccc;
      margin-left: 10px;
      // 监控设备表格
      .table {
        margin-top: 12px;
        & /deep/ .el-table {
          .el-table__row {
            background-color: @board-bgc;

            /* 设置文件夹符号颜色 */
            .el-table .el-icon-folder-opened {
              color: #ddd;
            }
          }
          .el-table__empty-block {
            background-color: @board-bgc;
          }
          .el-icon-arrow-right {
            color: skyblue;
            background-color: none;
          }
          th {
            padding: 6px 0;
          }
          td {
            padding: 6px 0;
          }
        }
      }
      // 表格下拉表格背景色
      .all-table {
        & /deep/ .el-table__row {
          background-color: @board-bgc;
          .el-icon-arrow-right {
            color: #fff;
          }
        }
        // 设备表格
        & /deep/ .el-table__expanded-cell {
          background-color: @board-bgc;
          // background-color: none;
          .el-table--enable-row-hover .el-table__body {
            tr {
              &:hover > td {
                background-color: rgba(67, 92, 112);
              }
            }
            .el-table_1_column_2 .cell {
              text-align: right;
            }
          }
        }
        & /deep/ .el-table__empty-block {
          background-color: @board-bgc;
        }
        // 网关设备的状态颜色
        & /deep/ .iconnav_lixianjieshou {
          color: rgb(246, 54, 54);
        }

        & /deep/ .iconnav_zaixianjieshou {
          color: rgba(74, 225, 91);
        }
        /* 所有设备表格样式 */

        & /deep/ .el-table--border,
        .el-table--group {
          border: 1px solid #606a81;
        }
        /* 表头背景色 */
        & /deep/ .el-table th {
          background-color: @board-bgc!important;
          color: #fff;
        }

        // 鼠标移入颜色
        & /deep/ .el-table__body tr.hover-row.current-row > td,
        &
          /deep/
          .el-table__body
          tr.hover-row.el-table__row--striped.current-row
          > td,
        & /deep/ .el-table__body tr.hover-row.el-table__row--striped > td,
        & /deep/ .el-table__body tr.hover-row > td {
          background-color: #64657d;
        }

        & /deep/ .el-table__expanded-cell[class*="cell"] {
          padding: 10px 10px;
        }
      }
      /* 分页 */
      .block {
        float: right;
      }
      // 用电电价
      .count {
      }
      .electoric {
        overflow: auto;
        .ele-title {
          @dis-flex();
          .el-button {
            margin-left: 500px;
          }
        }
        /deep/ .el-form {
          padding-bottom: 10px;
          border-bottom: 1px dashed #ccc;
          @dis-flex();
          // 左边
          .form-left {
            width: 200px;
            /deep/ .el-input {
              width: 180px;
            }
          }
          // 右边
          .form-right {
            // @flex-1();
            margin-left: 40px;
            width: 502px;
            // @dis-flex();
            /deep/ .el-input {
              width: 144px;
            }
            .number {
              // @flex-1();
              display: inline-block;
              padding: 0 10px;
              // /deep/ .el-form-item__error {
              //   top: 84%;
              // }
            }
            /deep/ .el-radio {
              color: #ccc;
            }
            // 表格
            .price-tab {
              margin: 6px 0;
              padding: 10px;
              border: 1px solid #ccc;
              border-radius: 6px;

              /deep/ .el-select {
                .el-input.is-disabled .el-input__inner {
                  background-color: #4e657a;
                }
              }
              /deep/ .el-table__row .cell {
                height: 36px !important;
                padding-right: 0;
              }
              /deep/ .el-table {
                th {
                  padding: 4px 0;
                  background-color: none !important;
                }
                .el-input {
                  width: 100px;
                }
              }
            }
          }
        }
      }
      // 电表配置
      .ele-equip {
        overflow: auto;
        .equip-title {
          @dis-flex();
          margin-bottom: 16px;
          .el-button {
            margin-left: 500px;
          }
        }
        .conf-title {
          width: 600px;
          @dis-flex();
          span {
            display: block;
          }
          span:first-child {
            width: 25%;
          }
          span:nth-child(2) {
            width: 30%;
          }
          span:nth-child(3) {
            width: 30%;
          }
          .el-button {
            width: 15%;
          }
        }
        .config {
          width: 600px;
          .conf-single {
            @dis-flex();
            margin-bottom: 8px;
            align-items: center;
            .input,
            .casc,
            .dis-input {
              width: 25%;
              padding-right: 10px;
              box-sizing: border-box;
            }
            .dis-input {
              width: 30%;
              &:hover {
                cursor: pointer;
              }
              @dis-flex();
              /deep/ .el-input {
                // width: 80%;
              }
              // .el-icon-edit {
              //   margin-left: 4px;
              //   &:hover {
              //     cursor: pointer;
              //   }
              // }
              /deep/ .el-input.is-disabled .el-input__inner {
                background-color: #4e657a;
              }
            }
            .select {
              width: 30%;
            }
            .el-button {
              width: 15%;
            }
          }
        }
      }
      // 能源配置
      .energy-config {
        overflow: auto;
        .equip-title {
          @dis-flex();
          margin-bottom: 16px;
          .el-button {
            margin-left: 500px;
          }
        }
        .conf-title {
          width: 600px;
          @dis-flex();
          span {
            display: block;
          }
          span:first-child {
            width: 25%;
          }
          span:nth-child(2) {
            width: 30%;
          }
          span:nth-child(3) {
            width: 30%;
          }
          .el-button {
            width: 15%;
          }
        }
        .config {
          width: 600px;
          .conf-single {
            @dis-flex();
            margin-bottom: 8px;
            align-items: center;
            .input,
            .casc,
            .dis-input {
              width: 25%;
              padding-right: 10px;
              box-sizing: border-box;
            }
            .dis-input {
              width: 30%;
              &:hover {
                cursor: pointer;
              }
              @dis-flex();
              /deep/ .el-input {
                // width: 80%;
              }
              // .el-icon-edit {
              //   margin-left: 4px;
              //   &:hover {
              //     cursor: pointer;
              //   }
              // }
              /deep/ .el-input.is-disabled .el-input__inner {
                background-color: #4e657a;
              }
            }
            .select {
              width: 30%;
            }
            .el-button {
              width: 15%;
            }
          }
        }
      }
    }
  }
  // 弹窗
  /* 网关窗口大小 */
  .eidt-input-width {
    width: 240px;
  }
  /* 编辑电表弹窗 */
  /* 输入框宽度 */
  .variate-dialog {
    .variate-form {
      .edit-input {
        .el-form-item {
          width: 260px;
          display: inline-block;
          .input-width-s {
            width: 160px;
          }
        }
      }
    }
    /* 添加数据区按钮 */
    .data-area /deep/ .el-button--success.is-plain {
      color: #fff;
      background: @primary-btn;
      border-color: @primary-btn;
    }
    .data-text {
      color: skyblue;
      border-bottom: 1px solid #ccc;
      margin-bottom: 10px;
    }
    // 数据区
    .tb-data {
      border: 1px solid #ccc;
      border-radius: 10px;
      margin-top: 10px;
      table {
        th {
          width: 110px;
        }
        tbody > tr > td {
          text-align: center;
          padding: 4px;
          box-sizing: border-box;
          input {
            width: 95px;
            height: 20px;
            border-radius: 4px;
          }
        }
      }
      .saying {
        font-size: 18px;
        padding: 10px;
        text-align: center;
        border-top: 1px solid #ccc;
      }
    }
  }
}

/* 四个标签样式 */
.content /deep/ .el-tabs--border-card {
  background: none;
  border: none;
  box-shadow: 0 0 4px #aaa;
  margin-right: 15px;
}

.content /deep/ .el-tabs--border-card > .el-tabs__header {
  background: none;
  border: none;
}

.content
  /deep/
  .el-tabs--border-card
  > .el-tabs__header
  .el-tabs__item.is-active {
  color: @radio-bgc;
  border-right-color: rgba(67, 92, 112);
  border-left-color: rgba(67, 92, 112);
  background: none;
}
.content /deep/ .el-tabs--border-card > .el-tabs__header .el-tabs__item {
  color: @radio-bgc;
  border-right-color: rgba(67, 92, 112);
  border-left-color: rgba(67, 92, 112);
  background: rgba(84, 101, 125);
}

.content .el-button {
  margin-left: 0;
  margin-bottom: 5px;
}

.content /deep/ .el-tabs__item {
  color: #ccc;
}

.content /deep/ .el-tabs__item.is-active {
  color: #409eff;
}

.block /deep/ .el-icon-arrow-right {
  color: #c0c4cc;
}
</style>
