<template>
  <div class="all">
    <!-- 展示页面 -->
    <div class="layout" v-show="!ifHandle">
      <!-- <div class="loading-show"></div>-->
      <div class="foot">
        <el-button
          size="mini"
          class="confirm"
          icon="el-icon-edit"
          @click="edit"
          style="margin-left: 10px;"
          v-show="!ifEdit"
        >编辑</el-button>
        <el-button type="primary" class="confirm" size="mini" v-show="ifEdit" @click="addBoard">增加内容</el-button>
        <el-button type="primary" class="confirm" size="mini" v-show="ifEdit" @click="editSubmit">保存</el-button>
      </div>

      <div class="show" :key="layoutKey" :loading="loading">
        <grid-layout
          :layout.sync="layout"
          :row-height="60"
          :is-draggable="ifDrag"
          :is-resizable="ifResize"
          :is-mirrored="false"
          :autoSize="true"
          :vertical-compact="true"
          :margin="layoutMargin"
          :use-css-transforms="true"
          :responsive="true"
          :breakpoints="breakpoints"
          :cols="cols"
        >
          <grid-item
            v-for="item in layout"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            :key="item.i"
            @resize="resizeEvent"
            @move="moveEvent"
            @resized="resizedEvent"
            @moved="movedEvent"
            @container-resized="containerResizedEvent"
          >
            <!-- 单变量监控 -->
            <singleMonitor
              v-if="item.t == 'singleMonitor'"
              :i="item.i"
              :item="item"
              :ifEdit="ifEdit"
              @editBoard="editBoard"
              @delBoard="delBoard"
            ></singleMonitor>
            <!-- 告警列表 -->
            <warnList
              v-if="item.t == 'warnList'"
              :i="item.i"
              :item="item"
              :ifEdit="ifEdit"
              @editBoard="editBoard"
              @delBoard="delBoard"
            ></warnList>
            <!-- 变量曲线 -->
            <lineChart
              v-if="item.t == 'line'"
              :i="item.i"
              :item="item"
              :ifEdit="ifEdit"
              @editBoard="editBoard"
              @delBoard="delBoard"
              ref="lineRefrash"
            ></lineChart>
            <!-- 多变量监控 -->
            <moreData
              v-if="item.t == 'moreData'"
              :i="item.i"
              :item="item"
              :ifEdit="ifEdit"
              @editBoard="editBoard"
              @delBoard="delBoard"
            ></moreData>
            <!-- 变量报表 -->
            <report
              v-if="item.t == 'report'"
              :i="item.i"
              :item="item"
              :ifEdit="ifEdit"
              @editBoard="editBoard"
              @delBoard="delBoard"
            ></report>
            <!-- 地图 -->
            <location
              v-if="item.t == 'location'"
              :i="item.i"
              :item="item"
              :ifEdit="ifEdit"
              @editBoard="editBoard"
              @delBoard="delBoard"
            ></location>
            <!-- 网关在线状态列表 -->
            <gatewayStatus
              v-if="item.t == 'gatewayStatus'"
              :i="item.i"
              :item="item"
              :ifEdit="ifEdit"
              @editBoard="editBoard"
              @delBoard="delBoard"
            ></gatewayStatus>
            <!-- 总能耗 -->
            <totalEnergy
              v-if="item.t == 'totalEnergy'"
              :i="item.i"
              :item="item"
              :ifEdit="ifEdit"
              @editBoard="editBoard"
              @delBoard="delBoard"
            ></totalEnergy>
            <!-- 能耗曲线 -->
            <energyLine
              v-if="item.t == 'energyLine'"
              :i="item.i"
              :item="item"
              :ifEdit="ifEdit"
              @editBoard="editBoard"
              @delBoard="delBoard"
              ref="lineRefrash"
            ></energyLine>
            <!-- 用能统计 -->
            <powerConsumption
              v-if="item.t == 'powerConsumption'"
              :i="item.i"
              :item="item"
              :ifEdit="ifEdit"
              @editBoard="editBoard"
              @delBoard="delBoard"
            ></powerConsumption>
            <!-- 今日曲线 -->
            <powerCurve
              v-if="item.t == 'powerCurve'"
              :i="item.i"
              :item="item"
              :ifEdit="ifEdit"
              @editBoard="editBoard"
              @delBoard="delBoard"
              ref="lineRefrash"
            ></powerCurve>
            <!-- 用能占比 -->
            <powerProportion
              v-if="item.t == 'powerProportion'"
              :i="item.i"
              :item="item"
              :ifEdit="ifEdit"
              @editBoard="editBoard"
              @delBoard="delBoard"
            ></powerProportion>
          </grid-item>
        </grid-layout>
      </div>
    </div>
    <!-- 配置页面 -->
    <div class="edit" v-show="ifHandle">
      <div class="back">
        <el-button type="primary" @click="trunBack" size="small">返回</el-button>
        <el-button type="primary" @click="cancelSave" size="small">取消</el-button>
      </div>
      <!------------------------------------ warnList -->
      <div class="warnList" v-show="handleBoard=='warnList'">
        <el-form ref="form" :model="eventForm" label-width="80px" class="eventForm"></el-form>
      </div>
      <!-------------------------- singleMonitor -->
      <div class="singleMonitor" v-show="handleBoard=='singleMonitor'">
        <!-- <singleEdit :item1="renderObj"></singleEdit> -->
        <!-- 背景图显示界面 -->
        <div class="singleMonitor-show" :style="{'background': this.singleMonitorBackground}">
          <div
            class="left-top"
            :style="{'font-size': variateForm.param.nameSize + 'px', 'color': variateForm.param.titleColor}"
          >{{(variateForm.datas.data)[0].name}}</div>
          <div
            class="bottom"
            :style="{'font-size': variateForm.param.valueSize + 'px', 'color': variateForm.param.valueColor}"
          >{{(singleMonitorValue ? singleMonitorValue + variateForm.datas.data[0].unit : '')}}</div>
        </div>
        <el-form ref="form" :model="variateForm" label-width="130px" class="variateForm">
          <div>
            <el-form-item label="数据名称" class="input-block">
              <el-input v-model.trim="(variateForm.datas.data)[0].name"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="选择网关" class="input-block">
              <el-select
                v-model="(variateForm.datas.data)[0].gatewayId"
                @change="sinGatewayChange"
                placeholder
              >
                <el-option
                  v-for="(item, index) in gatewayOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.gatewayId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择设备" class="input-block">
              <el-select
                v-model="(variateForm.datas.data)[0].equipmentId"
                @visible-change="getSinEquip"
                @change="sinEquipChange"
                placeholder
                filterable
              >
                <el-option
                  v-for="(item, index) in sinEquipOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.equipmentId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择变量" class="input-block">
              <el-select
                v-model="(variateForm.datas.data)[0].data"
                @visible-change="getSinVariable"
                @change="sinvariableChange"
                placeholder
                filterable
              >
                <el-option
                  v-for="(item, index) in sinVariableOptions"
                  :key="index"
                  :label="item.simplifiedCode"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div style="margin-bottom: -16px;">
            <el-form-item label="背景颜色-左上" class="input-block">
              <el-color-picker v-model="variateForm.param.ltColor" class="color"></el-color-picker>
            </el-form-item>
            <el-form-item label="背景颜色-右下" class="input-block">
              <el-color-picker v-model="variateForm.param.rbColor" class="color"></el-color-picker>
            </el-form-item>
            <!-- <div style="display: inline-block;"> -->
            <el-form-item label="数据名称颜色" class="input-block">
              <el-color-picker v-model="variateForm.param.titleColor" class="color"></el-color-picker>
            </el-form-item>
            <el-form-item label="数据值颜色" class="input-block">
              <el-color-picker v-model="variateForm.param.valueColor" class="color"></el-color-picker>
            </el-form-item>
            <!-- </div> -->
          </div>
          <div>
            <el-form-item label="数据名称字体大小" class="input-block">
              <el-input-number
                v-model="variateForm.param.nameSize"
                size="mini"
                :step="1"
                :min="12"
                :max="36"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="数据值字体大小" class="input-block">
              <el-input-number
                v-model="variateForm.param.valueSize"
                size="mini"
                :step="1"
                :min="12"
                :max="36"
              ></el-input-number>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <!---------------------------------- lineChart -->
      <div class="line" v-show="handleBoard=='line'" style=" height: 300px;">
        <div style="margin-top: 20px; border-top: 1px dashed #aaa"></div>
        <el-form ref="form" :model="lineChartForm" label-width="80px" class="lineChartForm">
          <div class="item-single">
            <el-form-item label="标题" class="input-block">
              <el-input v-model.trim="lineChartForm.param.title"></el-input>
            </el-form-item>
            <el-form-item label="日期类型" class="input-block">
              <el-select v-model="lineChartForm.param.timeType" placeholder>
                <el-option
                  v-for="(item, index) in timeTypeOption"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <div v-for="(item,index) in lineChartForm.datas.data" :key="index">
              <div style="display: inline-block;">
                <el-form-item label="选择网关" class="input-block">
                  <el-select
                    v-model="item.gatewayId"
                    @change="lineGatewayArrchange(index)"
                    placeholder
                  >
                    <el-option
                      v-for="(item1, index) in gatewayOptions"
                      :key="index"
                      :label="item1.name"
                      :value="item1.gatewayId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="选择设备" class="input-block">
                  <el-select
                    v-model="item.equipmentId"
                    @change="lineEquipArrchange(index, $event)"
                    @visible-change="getLineEquip($event,index)"
                    placeholder
                    filterable
                  >
                    <el-option
                      v-for="(item1, index) in item.equipOption"
                      :key="index"
                      :label="item1.name"
                      :value="item1.equipmentId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="选择变量" class="input-block">
                  <el-select
                    v-model="item.data"
                    @change="lineVariableChange(index,$event)"
                    @visible-change="lineGetVariable($event,index)"
                    placeholder
                    filterable
                  >
                    <el-option
                      v-for="(item2, index) in item.variableOption"
                      :key="index"
                      :label="item2.simplifiedCode"
                      :value="item2.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div style="display: inline-block; position: relative; width: 360px;">
                <el-form-item label="名称" class="input-block">
                  <el-input v-model.trim="item.name"></el-input>
                </el-form-item>
                <el-form-item class="color-block">
                  <el-color-picker v-model="item.color" @change="lineColorChange()" class="color"></el-color-picker>
                </el-form-item>
              </div>

              <el-button
                style="color: red;"
                type="text"
                icon="el-icon-remove-outline"
                @click="lineDelLineVariate(index)"
                :disabled="lineChartForm.datas.data.length == 1"
              ></el-button>
            </div>
          </div>
        </el-form>
        <el-button
          size="small"
          class="confirm"
          @click="addLineVariate"
          :disabled="lineChartForm.datas.data.length == 6"
        >+ &nbsp;添加变量</el-button>
      </div>
      <!--  ------------------------------------------report -->
      <div class="report" v-show="handleBoard=='report'" style=" height: 300px;">
        <div style="margin-top: 20px; border-top: 1px dashed #aaa"></div>
        <el-form ref="form" :model=" reportForm" label-width="80px" class="reportForm">
          <div class="item-single">
            <el-form-item label="标题" class="input-block">
              <el-input v-model.trim=" reportForm.param.title"></el-input>
            </el-form-item>
            <el-form-item label="日期类型" class="input-block">
              <el-select v-model=" reportForm.param.timeType" placeholder>
                <el-option
                  v-for="(item, index) in timeTypeOption"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <div v-for="(item,index) in  reportForm.datas.data" :key="index">
              <div style="display: inline-block;">
                <el-form-item label="选择网关" class="input-block">
                  <el-select
                    v-model="item.gatewayId"
                    @change="reportGatewayArrchange(index)"
                    placeholder
                  >
                    <el-option
                      v-for="(item1, index) in gatewayOptions"
                      :key="index"
                      :label="item1.name"
                      :value="item1.gatewayId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="选择设备" class="input-block">
                  <el-select
                    v-model="item.equipmentId"
                    @change="reportEquipArrchange(index, $event)"
                    @visible-change="getReportEquip($event,index)"
                    placeholder
                    filterable
                  >
                    <el-option
                      v-for="(item1, index) in item.equipOption"
                      :key="index"
                      :label="item1.name"
                      :value="item1.equipmentId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="选择变量" class="input-block">
                  <el-select
                    v-model="item.data"
                    @change="reportVariableChange(index,$event)"
                    @visible-change="reportGetVariable($event,index)"
                    placeholder
                    filterable
                  >
                    <el-option
                      v-for="(item2, index) in item.variableOption"
                      :key="index"
                      :label="item2.simplifiedCode"
                      :value="item2.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div style="display: inline-block; position: relative; width: 250px;">
                <el-form-item label="名称" class="input-block">
                  <el-input v-model.trim="item.name"></el-input>
                </el-form-item>
              </div>

              <el-button
                style="color: red; margin-left: 22px;"
                type="text"
                icon="el-icon-remove-outline"
                @click="reportDelVariate(index)"
                :disabled=" reportForm.datas.data.length == 1"
              ></el-button>
            </div>
          </div>
        </el-form>
        <el-button
          size="small"
          @click="addReportVariate"
          :disabled=" reportForm.datas.data.length == 6"
          class="confirm"
        >+ &nbsp;添加变量</el-button>
      </div>
      <!--------------------------------------------------- moreData -->
      <div class="moreData" v-show="handleBoard=='moreData'">
        <el-form ref="form" :model="moreDataForm" label-width="80px" class="moreDataForm">
          <div>
            <el-form-item label="标题" class="input-block">
              <el-input v-model="moreDataForm.param.title"></el-input>
            </el-form-item>
          </div>
          <div v-for="(item,index) in moreDataForm.datas.data" :key="index">
            <div>
              <el-form-item label="选择网关" class="input-block">
                <el-select
                  v-model="item.gatewayId"
                  @change="moreDataGatewayArrchange(index)"
                  placeholder
                >
                  <el-option
                    v-for="(item1, index) in gatewayOptions"
                    :key="index"
                    :label="item1.name"
                    :value="item1.gatewayId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="选择设备" class="input-block">
                <el-select
                  v-model="item.equipmentId"
                  @change="equipArrChange(index, $event)"
                  @visible-change="getMoreDataEquip($event,index)"
                  filterable
                  placeholder
                >
                  <el-option
                    v-for="(item1, index) in item.equipOption"
                    :key="index"
                    :label="item1.name"
                    :value="item1.equipmentId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="选择变量" class="input-block">
                <el-select
                  v-model="item.data"
                  @visible-change="getVariable($event,index)"
                  @change="moreVariableChange(index, $event)"
                  placeholder
                  filterable
                >
                  <el-option
                    v-for="(item2, index) in item.variableOption"
                    :key="index"
                    :label="item2.simplifiedCode"
                    :value="item2.code"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="数据名称" class="input-block">
                <el-input v-model.trim="item.name"></el-input>
              </el-form-item>
              <el-button
                type="text"
                icon="el-icon-remove-outline"
                :disabled="moreDataForm.datas.data.length === 1"
                @click="delDataItem(index)"
              ></el-button>
            </div>
          </div>

          <div>
            <el-button
              size="small"
              class="confirm"
              @click="addDataItem"
              :disabled="moreDataForm.datas.data.length == 6"
            >+ 增加数据项</el-button>
          </div>
        </el-form>
      </div>
      <!------------------------------------ location -->
      <div class="location" v-show="handleBoard=='location'">
        <el-form ref="form" :model="locationForm" label-width="80px" class="locationForm"></el-form>
      </div>
      <!------------------------------------ gatewayStatus -->
      <div class="gatewayStatus" v-show="handleBoard=='gatewayStatus'">
        <el-form ref="form" :model="gatewayForm" label-width="80px" class="gatewayForm"></el-form>
      </div>
      <!---------------------------------------- totalEnergy -->
      <div class="totalEnergy" v-show="handleBoard=='totalEnergy'">
        <el-form ref="form" :model="totalEnergyForm" label-width="80px" class="totalEnergyForm">
          <div>
            <el-form-item label="标题" class="input-block">
              <el-input v-model.trim=" totalEnergyForm.param.title"></el-input>
            </el-form-item>
            <el-form-item label="日期类型" class="input-block">
              <el-select v-model=" totalEnergyForm.param.timeType" placeholder>
                <el-option
                  v-for="(item, index) in timeTypeOption1"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <!---------------------------------------- energyLine -->
      <div class="energyLine" v-show="handleBoard=='energyLine'">
        <el-form ref="form" :model="energyLineForm" label-width="80px" class="energyLineForm">
          <div>
            <el-form-item label="标题" class="input-block">
              <el-input v-model.trim=" energyLineForm.param.title"></el-input>
            </el-form-item>
            <el-form-item label="日期类型" class="input-block">
              <el-select v-model=" energyLineForm.param.timeType" placeholder>
                <el-option
                  v-for="(item, index) in timeTypeOption1"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <!-- ----------------------------------------powerConsumption -->
      <!-- 用能统计 -->
      <div class="powerConsumption" v-show="handleBoard=='powerConsumption'">
        <div style="margin-top: 20px; border-top: 1px dashed #aaa"></div>
        <el-form
          ref="form"
          :model=" powerConsumptionForm"
          label-width="80px"
          class="powerConsumptionForm"
        >
          <div class="item-single">
            <el-form-item label="标题" class="input-block">
              <el-input v-model.trim=" powerConsumptionForm.param.title"></el-input>
            </el-form-item>
            <el-form-item label="日期类型" class="input-block">
              <el-select v-model=" powerConsumptionForm.param.timeType" placeholder>
                <el-option
                  v-for="(item, index) in powerConsumptionOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="能耗类型" class="input-block">
              <el-select v-model=" powerConsumptionForm.param.powerType" placeholder>
                <el-option
                  v-for="(item, index) in powerTypeOptions"
                  :key="index"
                  :label="item.properties"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <div v-for="(item,index) in  powerConsumptionForm.datas.data" :key="index">
              <div style="display: inline-block;">
                <el-form-item label="选择网关" class="input-block">
                  <el-select
                    v-model="item.gatewayId"
                    @change="powerConsumptionGatewayArrchange(index)"
                    placeholder
                  >
                    <el-option
                      v-for="(item1, index) in gatewayOptions"
                      :key="index"
                      :label="item1.name"
                      :value="item1.gatewayId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="选择设备" class="input-block">
                  <el-select
                    v-model="item.equipmentId"
                    @change="powerConsumptionEquipArrchange(index, $event)"
                    @visible-change="getPowerConsumptionEquip($event,index)"
                    placeholder
                    filterable
                  >
                    <el-option
                      v-for="(item1, index) in item.equipOption"
                      :key="index"
                      :label="item1.name"
                      :value="item1.equipmentId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="选择变量" class="input-block">
                  <el-select
                    v-model="item.data"
                    @change="powerConsumptionVariableChange(index,$event)"
                    @visible-change="powerConsumptionGetVariable($event,index)"
                    placeholder
                    filterable
                  >
                    <el-option
                      v-for="(item2, index) in item.variableOption"
                      :key="index"
                      :label="item2.simplifiedCode"
                      :value="item2.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <!-- <div style="display: inline-block; position: relative; width: 250px;">
                <el-form-item label="名称" class="input-block">
                  <el-input v-model.trim="item.name"></el-input>
                </el-form-item>
              </div>-->

              <el-button
                style="color: red; margin-left: 22px;"
                type="text"
                icon="el-icon-remove-outline"
                @click="powerConsumptionDelVariate(index)"
                :disabled=" powerConsumptionForm.datas.data.length == 1"
              ></el-button>
            </div>
          </div>
        </el-form>
        <el-button
          size="small"
          @click="addPowerConsumptionVariate"
          :disabled="powerConsumptionForm.datas.data.length == 6"
          class="confirm"
        >+ &nbsp;添加变量</el-button>
      </div>
      <!---------------------------------- powerCurve -->
      <!-- 今日曲线 -->
      <div class="powerCurve" v-show="handleBoard=='powerCurve'" style=" height: 300px;">
        <div style="margin-top: 20px; border-top: 1px dashed #aaa"></div>
        <el-form ref="form" :model="powerCurveForm" label-width="80px" class="powerCurveForm">
          <div class="item-single">
            <el-form-item label="标题" class="input-block">
              <el-input v-model.trim="powerCurveForm.param.title"></el-input>
            </el-form-item>
            <el-form-item label="能耗类型" class="input-block">
              <el-select v-model=" powerCurveForm.param.powerType" placeholder>
                <el-option
                  v-for="(item, index) in powerTypeOptions"
                  :key="index"
                  :label="item.properties"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <div v-for="(item,index) in powerCurveForm.datas.data" :key="index">
              <div style="display: inline-block;">
                <el-form-item label="选择网关" class="input-block">
                  <el-select
                    v-model="item.gatewayId"
                    @change="powerCurveGatewayArrchange(index)"
                    placeholder
                  >
                    <el-option
                      v-for="(item1, index) in gatewayOptions"
                      :key="index"
                      :label="item1.name"
                      :value="item1.gatewayId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="选择设备" class="input-block">
                  <el-select
                    v-model="item.equipmentId"
                    @change="powerCurveEquipArrchange(index, $event)"
                    @visible-change="getPowerCurveEquip($event,index)"
                    placeholder
                    filterable
                  >
                    <el-option
                      v-for="(item1, index) in item.equipOption"
                      :key="index"
                      :label="item1.name"
                      :value="item1.equipmentId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="选择变量" class="input-block">
                  <el-select
                    v-model="item.data"
                    @change="powerCurveVariableChange(index,$event)"
                    @visible-change="powerCurveGetVariable($event,index)"
                    placeholder
                    filterable
                  >
                    <el-option
                      v-for="(item2, index) in item.variableOption"
                      :key="index"
                      :label="item2.simplifiedCode"
                      :value="item2.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div style="display: inline-block; position: relative; width: 360px;">
                <el-form-item label="名称" class="input-block">
                  <el-input v-model.trim="item.name"></el-input>
                </el-form-item>
              </div>

              <el-button
                style="color: red;"
                type="text"
                icon="el-icon-remove-outline"
                @click="powerCurveDelLineVariate(index)"
                :disabled="powerCurveForm.datas.data.length == 1"
              ></el-button>
            </div>
          </div>
        </el-form>
        <el-button
          size="small"
          class="confirm"
          @click="addpowerCurveVariate"
          :disabled="powerCurveForm.datas.data.length == 100"
        >+ &nbsp;添加变量</el-button>
      </div>
      <!------------------------------------------- powerProportion -->
      <!-- 用电占比 -->
      <div class="powerProportion" v-show="handleBoard=='powerProportion'">
        <div style="margin-top: 20px; border-top: 1px dashed #aaa"></div>
        <el-form
          ref="form"
          :model=" powerProportionForm"
          label-width="80px"
          class="powerProportionForm"
        >
          <div class="item-single">
            <el-form-item label="标题" class="input-block">
              <el-input v-model.trim=" powerProportionForm.param.title"></el-input>
            </el-form-item>
            <el-form-item label="日期类型" class="input-block">
              <el-select v-model=" powerProportionForm.param.timeType" placeholder>
                <el-option
                  v-for="(item, index) in timeTypeOption1"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="能耗类型" class="input-block">
              <el-select v-model=" powerProportionForm.param.powerType" placeholder>
                <el-option
                  v-for="(item, index) in powerTypeOptions"
                  :key="index"
                  :label="item.properties"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <div v-for="(item,index) in  powerProportionForm.datas.data" :key="index">
              <div style="display: inline-block;">
                <el-form-item label="选择网关" class="input-block">
                  <el-select
                    v-model="item.gatewayId"
                    @change="powerProportionGatewayArrchange(index)"
                    placeholder
                  >
                    <el-option
                      v-for="(item1, index) in gatewayOptions"
                      :key="index"
                      :label="item1.name"
                      :value="item1.gatewayId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="选择设备" class="input-block">
                  <el-select
                    v-model="item.equipmentId"
                    @change="powerProportionEquipArrchange(index, $event)"
                    @visible-change="getpowerProportionEquip($event,index)"
                    placeholder
                    filterable
                  >
                    <el-option
                      v-for="(item1, index) in item.equipOption"
                      :key="index"
                      :label="item1.name"
                      :value="item1.equipmentId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="选择变量" class="input-block">
                  <el-select
                    v-model="item.data"
                    @change="powerProportionVariableChange(index,$event)"
                    @visible-change="powerProportionGetVariable($event,index)"
                    placeholder
                    filterable
                  >
                    <el-option
                      v-for="(item2, index) in item.variableOption"
                      :key="index"
                      :label="item2.simplifiedCode"
                      :value="item2.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div style="display: inline-block; position: relative; width: 250px;">
                <el-form-item label="名称" class="input-block">
                  <el-input v-model.trim="item.name"></el-input>
                </el-form-item>
              </div>

              <el-button
                style="color: red; margin-left: 22px;"
                type="text"
                icon="el-icon-remove-outline"
                @click="powerProportionDelVariate(index)"
                :disabled=" powerProportionForm.datas.data.length == 1"
              ></el-button>
            </div>
          </div>
        </el-form>
        <el-button
          size="small"
          @click="addpowerProportionVariate"
          :disabled="powerProportionForm.datas.data.length == 6"
          class="confirm"
        >+ &nbsp;添加变量</el-button>
      </div>
    </div>

    <!-- 新增看板弹窗 -->
    <el-drawer
      title="新增看板"
      class="draw"
      :visible.sync="drawerVisible"
      :direction="direction"
      size="50%"
      :show-close="false"
    >
      <div class="block" v-for="(item, index) in arr" :key="index">
        <div class="d-title">
          <h3>
            <i
              :class="{icon:true, 'iconfont':true, 'iconzhexiantu':item.classify=='历史数据','iconwangguanzhuangtai': item.classify=='站点状态','icondata': item.classify=='关键数据','iconwarn': item.classify=='事件告警'}"
            ></i>
            &nbsp;{{item.classify}}
          </h3>
        </div>
        <div class="d-main">
          <div
            :class="{'pic-text': true, 'selected': item1.type == selectType}"
            v-for="(item1, index1) in item.plugins"
            :key="index1"
            @click="selectOne(item1)"
          >
            <!-- <img :src="item1.image" alt /> -->
            <img :src="getUrl(item1.image)" alt />
            <!-- <img src="../../assets/img/board/location.jpg" alt /> -->
            <!-- <img src="../../assets/img/board/gatewayStatus.jpg" alt=""> -->
            <div class="sin-title">
              <h4>{{item1.name}}</h4>
              <span class="say">{{item1.description}}</span>
            </div>
          </div>
        </div>
      </div>
      <footer class="board-footer">
        <el-button
          style="background-color: green;color: #fff;border: none;"
          @click="drawerVisible = false"
        >取消</el-button>
        <el-button
          style="background-color: rgba(245, 166, 35);color: #fff;border: none;"
          @click="addBoardSubmit"
          :disabled="!Boolean(selectType)"
        >提交</el-button>
      </footer>
    </el-drawer>
  </div>
</template>

 <script>
import { filterSame } from "../../utils/index";
import VueGridLayout from "vue-grid-layout";
import singleMonitor from "../subcomponents/boardSub/SingleMonitor ";
import warnList from "../subcomponents/boardSub/WarnList";
// import pie from "../subcomponents/boardSub/pie";
import line from "../subcomponents/boardSub/line";
import moreData from "../subcomponents/boardSub/moreData";
import report from "../subcomponents/boardSub/Report";
import location from "../subcomponents/boardSub/Location";
import gatewayStatus from "../subcomponents/boardSub/gatewayStatus";
import totalEnergy from "../subcomponents/boardSub/totalEnergy";
import energyLine from "../subcomponents/boardSub/energyLine";
import powerConsumption from "../subcomponents/boardSub/powerConsumption";
import powerCurve from "../subcomponents/boardSub/powerCurve";
import powerProportion from "../subcomponents/boardSub/powerProportion";
import { getUUIDInt, color16, deepClone } from "../../utils/index";
import GLOBAL from "../../utils/global_variable"; //引入全局变量常量
export default {
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    singleMonitor: singleMonitor,
    warnList: warnList,
    // pie: pie,
    lineChart: line,
    moreData: moreData,
    report: report,
    location: location,
    gatewayStatus: gatewayStatus,
    totalEnergy: totalEnergy,
    energyLine: energyLine,
    powerConsumption: powerConsumption,
    powerCurve: powerCurve,
    powerProportion: powerProportion
  },
  data() {
    return {
      layoutKey: 1, //看板key
      layout: [
        // { x: 0, y: 0, w: 8, h: 2, i: 1, t: "warnList" },
        // { x: 0, y: 2, w: 3, h: 1, i: 2, t: "singleMonitor" },
        // { x: 14, y: 0, w: 8, h: 2, i: 5, t: "line" },
        // { x: 14, y: 0, w: 8, h: 2, i: 7, t: "moreData" },
        // { x: 0, y: 4, w: 8, h: 2, i: 8, t: "report" }
      ],
      layoutMargin: [14, 14],
      ifLayoutChange: false, //页面是否修改过
      loading: "false",
      breakpoints: {
        // lg: 1200,
        // md: 996,
        sm: 768,
        xs: 400
        // singleMonitor: 480,
        // xsingleMonitor: 0
      },
      // cols: { lg: 24, md: 20, sm: 15, xs: 8 },
      cols: { sm: 24, xs: 12 },
      ifDrag: false,
      ifResize: false,
      ifEdit: false,
      drawerVisible: false,
      direction: "rtl",
      drawerVisible: false,
      selectBoardId: null,
      handleBoard: "moreData",
      arr: [],
      selectType: null, //新增的类型
      ifHandle: false,
      // ifHandle: true,
      // 事件列表
      eventForm: {
        title: "11", //标题
        period: "1", //周期
        variateArr: [
          {
            variable: "", //变量
            period: "", //周期
            float: "" //保留小数
          },
          {},
          {}
        ] //变量数组
      },
      // 关键数据(单)
      singleMonitorValue: "", //用于子传父的实时值显示
      variateForm: {
        param: {
          ltColor: "", //左上颜色
          rbColor: "", //右下颜色
          titleColor: "", //名称颜色
          valueColor: "", //值颜色
          nameSize: 12, //名称字体大小
          valueSize: 12 //值字体大小
        },
        datas: {
          data: [
            {
              gatewayId: null, //网关编号
              name: "", //数据名称
              data: "", //变量
              equipmentId: "" //设备编号
            }
          ]
        }
      },

      sinEquipOptions: [], //设备选项
      sinVariableOptions: [], //变量选项
      //关键数据（多）
      moreDataForm: {
        param: {
          title: ""
        },
        datas: {
          data: [
            {
              gatewayId: null, //网关编号
              name: "", //数据名称
              data: "", //变量
              equipmentId: "", //设备编号
              equipOption: [], //设备选项
              variableOption: [], //变量集合
              value: ""
            }
          ]
        }
      },
      //报表时间类型选项
      timeTypeOption: [
        {
          label: "日报表",
          value: "day"
        },
        {
          label: "月报表",
          value: "month"
        },
        {
          label: "年报表",
          value: "year"
        }
      ],
      timeTypeOption1: [
        {
          label: "日",
          value: "day"
        },
        {
          label: "月",
          value: "month"
        },
        {
          label: "年",
          value: "year"
        }
      ],
      lineChartForm: {
        // title: "",
        param: {
          title: "",
          timeType: ""
        },
        datas: {
          data: [
            {
              gatewayId: null, //网关编号
              data: "", //变量
              value: "",
              equipOption: [], //设备选项
              variableOption: [], //变量集合
              equipmentId: "",
              color: ""
            }
          ]
        }
      },
      //报表编辑表单
      reportForm: {
        param: {
          title: "",
          timeType: ""
        },
        datas: {
          data: [
            {
              gatewayId: null, //网关编号
              data: "", //变量
              value: "",
              equipOption: [], //设备选项
              variableOption: [], //变量集合
              equipmentId: ""
            }
          ]
        }
      },
      locationForm: {},
      gatewayForm: {},
      // 总能耗表单
      totalEnergyForm: {
        param: {
          title: "",
          timeType: ""
        },
        datas: {
          data: [
            {
              gatewayId: null, //网关编号
              data: "", //变量
              value: "",
              equipOption: [], //设备选项
              variableOption: [], //变量集合
              equipmentId: ""
            }
          ]
        }
      },
      // 总能耗表单
      energyLineForm: {
        param: {
          title: "",
          timeType: ""
        },
        datas: {
          data: [
            {
              gatewayId: null, //网关编号
              data: "", //变量
              value: "",
              equipOption: [], //设备选项
              variableOption: [], //变量集合
              equipmentId: ""
            }
          ]
        }
      },
      //用能统计编辑表单
      powerConsumptionForm: {
        param: {
          title: "",
          timeType: ""
        },
        datas: {
          data: [
            {
              gatewayId: null, //网关编号
              data: "", //变量
              value: "",
              equipOption: [], //设备选项
              variableOption: [], //变量集合
              equipmentId: ""
            }
          ]
        }
      },
      // 能耗类型
      powerTypeOptions: [],
      // 当日用能曲线表单
      powerCurveForm: {
        param: {
          title: "",
          timeType: ""
        },
        datas: {
          data: [
            {
              gatewayId: null, //网关编号
              data: "", //变量
              value: "",
              equipOption: [], //设备选项
              variableOption: [], //变量集合
              equipmentId: ""
            }
          ]
        }
      },
      //用电占比
      powerProportionForm: {
        param: {
          title: "",
          timeType: ""
        },
        datas: {
          data: [
            {
              gatewayId: null, //网关编号
              data: "", //变量
              value: "",
              equipOption: [], //设备选项
              variableOption: [], //变量集合
              equipmentId: ""
            }
          ]
        }
      },
      backId: "", //返回页面之前操作的id
      backForm: "", //返回页面之前操作的表单数据
      renderObj: {}, //编辑页面的渲染传值
      gatewayOptions: [], //网关选项
      allEquipOption: [], //站点下所有设备选项
      allVariableOption: [], //站点下的所有变量
      deleteIdArr: [], //删除掉的已有板块id集合
      idArr: [], //本地新建的id集合，用于删除看板时做id筛选
      powerConsumptionOptions: [
        {
          label: "日",
          value: "day"
        },
        {
          label: "月",
          value: "month"
        }
      ]
    };
  },
  computed: {
    watchSiteChange() {
      return this.$store.state.site.siteId;
    },
    // 单监控变量数据监控
    singleMonitor() {
      return this.variateForm;
    },
    singleMonitorBackground() {
      // this.singleMonitor
      var background =
        "linear-gradient(to right bottom, " +
        (this.singleMonitor.param.ltColor || "pink") +
        "," +
        (this.singleMonitor.param.rbColor || "skyblue") +
        ")";
      return background;
    },
    // 监听单监控页面code存在
    watchCode() {
      return this.variateForm.datas.data[0].data;
    }
  },
  watch: {
    watchSiteChange() {
      this.ifHandle = false;
      this.getplugs();
      this.getBoard();
      //获取站点所有网关
      this.getAllGateway();
      // 获取站点下所以设备
      this.getAllEquip();
      // 查询公司下所有变量
      this.getAllVariable();
    },
    // 监听单监控页面code存在
    watchCode(newValue) {
      if (newValue) {
        this.$http
          .get("equipment/variable/getValueById", {
            params: {
              id: newValue
            }
          })
          .then(res => {
            if (res.data.code === 0) {
              this.singleMonitorValue = res.data.data[newValue];
            }
          });
      }
    }
  },
  created() {
    this.getplugs();
    this.getBoard();
    //获取站点下所有网关
    this.getAllGateway();
    // 获取站点下所以设备
    this.getAllEquip();
    // 查询公司下所有变量
    this.getAllVariable();
    this.$root.Bus.$on("pageResize", value => {
      this.pageResize1();
    });
  },
  beforeDestroy() {
    // if (true) {
    //   // 使用element的提示框
    //   this.$confirm("您还未保存简介，确定需要提出吗?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(() => {
    //       // 选择确定，正常跳转
    //     })
    //     .catch(() => {
    //       // 选择取消
    //       // this.changeIntroduceState(true);
    //     });
    // }
    // alert(1)
    this.$root.Bus.$off("pageResize");
    // 清除定时器
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  },
  // 页面离开前
  beforeRouteLeave(to, from, next) {
    if (this.ifLayoutChange == true) {
      // if (confirm("当前操作页面设置将不做保存，是否离开?") == true) {
      //   next(); //跳转到另一个路由
      // } else {
      //   this.$root.Bus.$emit('freshMenuSelect');
      //   next(false); //不跳转
      // }
      this.$confirm("当前操作页面设置将不做保存，是否离开?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        showClose: false,
        type: "warning"
      })
        .then(() => {
          next();
        })
        .catch(() => {
          next(false);
          // alert(1)
          this.$root.Bus.$emit("freshMenuSelect");
        });
    } else {
      next();
    }
  },
  methods: {
    containerResizedEvent(i, newH, newW, newHPx, newWPx) {
      // console.log(i);
    },
    pageResize1() {
      this.$forceUpdate();
      this.containerResizedEvent();
    },
    // 看板弹窗图片地址的引用
    getUrl(url) {
      return require("../../assets/img/board/" + url + ".jpg");
    },
    // 编辑所有看板
    edit() {
      this.ifEdit = true;
      this.ifResize = this.ifDrag = this.ifEdit;
    },
    // 看板详情编辑
    editBoard(i, item) {
      this.ifLayoutChange = true;
      this.handleBoard = item.t;
      this.ifHandle = true;
      this.backId = i; //存储id用于更新页面本地数据
      switch (this.handleBoard) {
        case "warnList":
          this.backForm = "warnListForm";
          break;
        case "line":
          this.backForm = "lineChartForm";
          this.lineChartForm = {
            // title: "",
            param: {
              title: "",
              timeType: "",
              color: []
            },
            datas: {
              data: [
                {
                  gatewayId: null, //网关编号
                  data: "", //变量
                  equipOption: [], //设备选项
                  variableOption: [], //变量集合
                  equipmentId: "",
                  color: "",
                  name: ""
                }
              ]
            }
          };
          this.lineChartForm.param = JSON.parse(item.param);
          if (item.datas.data.length !== 0) {
            this.lineChartForm.datas = JSON.parse(JSON.stringify(item.datas));
            for (var i = 0; i < this.lineChartForm.datas.data.length; i++) {
              this.lineChartForm.datas.data[i].equipOption = [
                {
                  name: item.datas.data[i].equipmentName,
                  equipmentId: item.datas.data[i].equipmentId
                }
              ];
              this.lineChartForm.datas.data[i].variableOption = [
                {
                  code: item.datas.data[i].code,
                  simplifiedCode: item.datas.data[i].simplifiedCode
                }
              ];
              this.lineChartForm.datas.data[i].color = JSON.parse(
                item.param
              ).color[i];
            }
          } else {
            this.lineChartForm = {
              param: {
                timeType: "day"
              },
              datas: {
                data: [
                  {
                    gatewayId: null, //网关编号
                    data: "", //变量
                    name: "",
                    equipOption: this.allEquipOption, //设备选项
                    variableOption: [], //变量集合
                    equipmentId: "",
                    color: color16()
                  }
                ]
              }
            };
          }
          break;
        //监控变量（单）
        case "singleMonitor":
          // return
          this.backForm = "variateForm";
          this.renderObj = item; //原始值传回至编辑操作页面
          // 清空缓存
          this.variateForm = {
            param: {
              ltColor: "", //左上颜色
              rbColor: "", //右下颜色
              titleColor: "", //名称颜色
              valueColor: "", //值颜色
              nameSize: "", //名称字体大小
              valueSize: "" //值字体大小
            },
            datas: {
              data: [
                {
                  gatewayId: null, //网关编号
                  name: "", //数据名称
                  data: "", //变量
                  equipmentId: "" //设备编号
                  // equipOption: this.allEquipOption,
                }
              ]
            }
          };
          this.variateForm.param = JSON.parse(item.param);
          // return
          // return
          console.log(item.datas.data.length);
          if (item.datas.data.length !== 0) {
            this.variateForm.datas = item.datas;
            console.log(this.variateForm.datas);
            // this.variateForm.datas.data.equipOption = this.allEquipOption;
            // this.variateForm.datas.data.variableOption = this.allVariableOption;
            // this.sinEquipOptions = this.allEquipOption;
            this.sinEquipOptions = [
              {
                name: item.datas.data[0].equipmentName,
                equipmentId: item.datas.data[0].equipmentId
              }
            ];
            this.sinVariableOptions = [
              {
                code: item.datas.data[0].code,
                simplifiedCode: item.datas.data[0].simplifiedCode
              }
            ];
          } else {
            this.variateForm.datas.data[0].equipOption = this.allEquipOption;
          }
          // return
          break;
        //监控变量（多）
        case "moreData":
          this.backForm = "moreDataForm";
          // 清空数据
          this.moreDataForm = {
            param: {
              title: ""
            },
            datas: {
              data: [
                {
                  gatewayId: null, //网关编号
                  name: "", //数据名称
                  data: "", //变量
                  equipmentId: "", //设备编号
                  equipOption: this.allEquipOption, //设备选项
                  variableOption: [] //变量集合
                }
              ]
            }
          };
          this.moreDataForm.param = JSON.parse(item.param);
          if (item.datas.data.length !== 0) {
            // 防止影响layout数据
            this.moreDataForm.datas = JSON.parse(JSON.stringify(item.datas));
            for (var i = 0; i < this.moreDataForm.datas.data.length; i++) {
              // this.moreDataForm.datas.data[i].equipOption = this.allEquipOption;
              // this.moreDataForm.datas.data[
              //   i
              // ].variableOption = this.allVariableOption;
              this.moreDataForm.datas.data[i].equipOption = [
                {
                  name: item.datas.data[i].equipmentName,
                  equipmentId: item.datas.data[i].equipmentId
                }
              ];
              this.moreDataForm.datas.data[i].variableOption = [
                {
                  code: item.datas.data[i].code,
                  simplifiedCode: item.datas.data[i].simplifiedCode
                }
              ];
            }
          }
          this.$forceUpdate();
          break;
        case "report":
          this.backForm = "reportForm";
          this.reportForm = {
            param: {
              title: "",
              timeType: ""
            },
            datas: {
              data: [
                {
                  gatewayId: null, //网关编号
                  data: "", //变量
                  equipOption: [], //设备选项
                  variableOption: [], //变量集合
                  equipmentId: "",
                  name: ""
                }
              ]
            }
          };
          this.reportForm.param = JSON.parse(item.param);
          if (item.datas.data.length !== 0) {
            this.reportForm.datas = item.datas;
            for (var i = 0; i < this.reportForm.datas.data.length; i++) {
              this.reportForm.datas.data[i].equipOption = [
                {
                  name: item.datas.data[i].equipmentName,
                  equipmentId: item.datas.data[i].equipmentId
                }
              ];
              this.reportForm.datas.data[i].variableOption = [
                {
                  code: item.datas.data[i].code,
                  simplifiedCode: item.datas.data[i].simplifiedCode
                }
              ];
            }
          } else {
            this.reportForm = {
              param: {
                timeType: "day"
              },
              datas: {
                data: [
                  {
                    gatewayId: null, //网关编号
                    data: "", //变量
                    equipOption: this.allEquipOption, //设备选项
                    variableOption: [], //变量集合
                    equipmentId: "",
                    name: ""
                  }
                ]
              }
            };
          }
          break;
        case "gatewayStatus":
          this.backForm = "gatewayForm";
          break;
        case "location":
          this.backForm = "locationForm";
          break;
        case "totalEnergy":
          this.backForm = "totalEnergyForm";
          this.totalEnergyForm.param = JSON.parse(item.param);
          break;
        case "energyLine":
          this.backForm = "energyLineForm";
          this.energyLineForm.param = JSON.parse(item.param);
          break;
        case "powerConsumption":
          this.backForm = "powerConsumptionForm";
          this.powerConsumptionForm = {
            param: {
              title: "",
              timeType: ""
            },
            datas: {
              data: [
                {
                  gatewayId: null, //网关编号
                  data: "", //变量
                  equipOption: [], //设备选项
                  variableOption: [], //变量集合
                  equipmentId: "",
                  name: ""
                }
              ]
            }
          };
          this.powerConsumptionForm.param = JSON.parse(item.param);
          if (item.datas.data.length !== 0) {
            this.powerConsumptionForm.datas = item.datas;
            for (
              var i = 0;
              i < this.powerConsumptionForm.datas.data.length;
              i++
            ) {
              this.powerConsumptionForm.datas.data[i].equipOption = [
                {
                  name: item.datas.data[i].equipmentName,
                  equipmentId: item.datas.data[i].equipmentId
                }
              ];
              this.powerConsumptionForm.datas.data[i].variableOption = [
                {
                  code: item.datas.data[i].code,
                  simplifiedCode: item.datas.data[i].simplifiedCode
                }
              ];
            }
          } else {
            this.powerConsumptionForm = {
              param: {
                timeType: "day"
              },
              datas: {
                data: [
                  {
                    gatewayId: null, //网关编号
                    data: "", //变量
                    equipOption: this.allEquipOption, //设备选项
                    variableOption: [], //变量集合
                    equipmentId: "",
                    name: ""
                  }
                ]
              }
            };
          }
          this.getAllPowerType("powerConsumptionForm");
          break;
        case "powerCurve":
          this.backForm = "powerCurveForm";
          this.powerCurveForm = {
            // title: "",
            param: {
              title: "",
              timeType: "",
              color: []
            },
            datas: {
              data: [
                {
                  gatewayId: null, //网关编号
                  data: "", //变量
                  equipOption: [], //设备选项
                  variableOption: [], //变量集合
                  equipmentId: "",
                  color: "",
                  name: ""
                }
              ]
            }
          };
          this.powerCurveForm.param = JSON.parse(item.param);
          if (item.datas.data.length !== 0) {
            this.powerCurveForm.datas = JSON.parse(JSON.stringify(item.datas));
            for (var i = 0; i < this.powerCurveForm.datas.data.length; i++) {
              this.powerCurveForm.datas.data[i].equipOption = [
                {
                  name: item.datas.data[i].equipmentName,
                  equipmentId: item.datas.data[i].equipmentId
                }
              ];
              this.powerCurveForm.datas.data[i].variableOption = [
                {
                  code: item.datas.data[i].code,
                  simplifiedCode: item.datas.data[i].simplifiedCode
                }
              ];
              console.log(JSON.parse(item.param).color[i]);
              this.powerCurveForm.datas.data[i].color = JSON.parse(
                item.param
              ).color[i];
            }
          } else {
            this.powerCurveForm = {
              param: {
                timeType: "day"
              },
              datas: {
                data: [
                  {
                    gatewayId: null, //网关编号
                    data: "", //变量
                    name: "",
                    equipOption: this.allEquipOption, //设备选项
                    variableOption: [], //变量集合
                    equipmentId: "",
                    color: color16()
                  }
                ]
              }
            };
          }
          this.getAllPowerType("powerCurveForm");
          break;
        case "powerProportion":
          this.backForm = "powerProportionForm";
          this.powerProportionForm = {
            param: {
              title: "",
              timeType: ""
            },
            datas: {
              data: [
                {
                  gatewayId: null, //网关编号
                  data: "", //变量
                  equipOption: [], //设备选项
                  variableOption: [], //变量集合
                  equipmentId: "",
                  name: ""
                }
              ]
            }
          };
          this.powerProportionForm.param = JSON.parse(item.param);
          if (item.datas.data.length !== 0) {
            this.powerProportionForm.datas = item.datas;
            for (
              var i = 0;
              i < this.powerProportionForm.datas.data.length;
              i++
            ) {
              this.powerProportionForm.datas.data[i].equipOption = [
                {
                  name: item.datas.data[i].equipmentName,
                  equipmentId: item.datas.data[i].equipmentId
                }
              ];
              this.powerProportionForm.datas.data[i].variableOption = [
                {
                  code: item.datas.data[i].code,
                  simplifiedCode: item.datas.data[i].simplifiedCode
                }
              ];
            }
          } else {
            this.powerProportionForm = {
              param: {
                timeType: "day"
              },
              datas: {
                data: [
                  {
                    gatewayId: null, //网关编号
                    data: "", //变量
                    equipOption: this.allEquipOption, //设备选项
                    variableOption: [], //变量集合
                    equipmentId: "",
                    name: ""
                  }
                ]
              }
            };
          }
          this.getAllPowerType("powerProportionForm");
          break;
        default:
          break;
      }
      this[this.backForm] = deepClone(this[this.backForm]);
      this.$forceUpdate();
    },
    // 删除看板
    delBoard(i) {
      for (var j = 0; j < this.layout.length; j++) {
        if (this.layout[j].i === i) {
          this.layout.splice(j, 1);
          break;
        }
      }
      //i的值不在新建数组中时才添加到选项中
      if (!this.idArr.includes(i)) {
        this.deleteIdArr.push(i);
      }
      this.ifLayoutChange = true;
    },
    // 拉伸看板
    resizedEvent: function(i, newH, newW, newHPx, newWPx) {
      var lineArr = this.layout.filter(item => {
        // 曲线或能耗曲线
        return (
          item.plugins === "line" ||
          item.plugins === "energyLine" ||
          item.plugins === "powerCurve"
        );
      });
      // 存在曲线看板
      if (lineArr.length > 0) {
        var index = lineArr.findIndex(item => {
          return item.i === i;
        });
        // 当前拖拽为曲线
        if (index > -1) {
          // alert('have')
          // 调用子组件方法
          this.$refs.lineRefrash[index].drawChart();
        }
      }
      this.ifLayoutChange = true;
    },
    movedEvent: function(i, newX, newY) {
      this.ifLayoutChange = true;
    },
    resizeEvent: function(i, newH, newW, newHPx, newWPx) {},
    moveEvent: function(i, newX, newY) {},
    // 弹出新增看板界面
    addBoard() {
      this.selectType = null;
      this.drawerVisible = true;
    },
    // 新添加看板
    addBoardSubmit() {
      var arr = this.layout.filter(item => {
        var plugins = item.plugins;
        return (
          plugins == "warnList" ||
          plugins == "location" ||
          plugins == "gatewayStatus"
        );
      });
      var index = arr.findIndex(item => {
        return item.plugins === this.selectType;
      });
      if (index > -1) {
        this.$notify({
          message: "当前看板已存在！",
          type: "warning"
        });
        this.drawerVisible = false;
        return;
      }
      // return
      var type = "";
      var local = {};
      let i = getUUIDInt();
      this.idArr.push(i);

      var obj = {
        i: i,
        // coordinate: JSON.stringify(local),
        moved: true,
        param: JSON.stringify({}),
        // t: type,
        id: i,
        title: "",
        site: this.$store.state.site.siteId,
        // plugins: type,
        datas: {
          data: []
        }
      };
      // return
      switch (this.selectType) {
        case "warnList":
          type = "warnList";
          local = { x: 0, y: 1000, w: 12, h: 4 };
          break;
        case "line":
          local = {
            x: 0,
            y: 1000,
            w: 8,
            h: 4
          };
          type = "line";
          obj.param = JSON.stringify({
            timeType: "day"
          });
          break;
        case "singleMonitor":
          type = "singleMonitor";
          local = { x: 0, y: 1000, w: 6, h: 2 };
          obj.param = JSON.stringify({
            ltColor: "#3D87E1",
            rbColor: "#11585E",
            valueSize: "20",
            nameSize: "20",
            titleColor: "#fff",
            valueColor: "#fff"
          });
          break;
        case "moreData":
          type = "moreData";
          local = {
            x: 0,
            y: 1000,
            w: 6,
            h: 6
          };
          break;
        case "report":
          type = "report";
          local = {
            x: 0,
            y: 1000,
            w: 12,
            h: 4
          };
          obj.param = JSON.stringify({
            timeType: "month"
          });
          break;
        case "gatewayStatus":
          type = "gatewayStatus";
          local = {
            x: 0,
            y: 1000,
            w: 8,
            h: 4
          };
          obj.param = JSON.stringify({
            title: "网关在线状态"
          });
          break;
        case "location":
          type = "location";
          local = {
            x: 0,
            y: 1000,
            y: 0,
            w: 12,
            h: 4
          };
          break;
        case "totalEnergy":
          type = "totalEnergy";
          local = {
            x: 0,
            y: 1000,
            w: 8,
            h: 4
          };
          obj.param = JSON.stringify({
            title: "",
            timeType: "day"
          });
          break;
        case "energyLine":
          type = "energyLine";
          local = {
            x: 0,
            y: 1000,
            w: 8,
            h: 4
          };
          obj.param = JSON.stringify({
            title: "能耗曲线",
            timeType: "day"
          });
          break;
        case "powerConsumption":
          type = "powerConsumption";
          local = {
            x: 0,
            y: 1000,
            w: 6,
            h: 3
          };
          obj.param = JSON.stringify({
            title: "今日用电",
            timeType: "day"
          });
          break;
        case "powerCurve":
          local = {
            x: 0,
            y: 1000,
            w: 8,
            h: 4
          };
          type = "powerCurve";
          obj.param = JSON.stringify({
            title: "今日用能曲线",
            timeType: "day"
          });
          break;
        case "powerProportion":
          local = {
            x: 0,
            y: 1000,
            w: 6,
            h: 4
          };
          type = "powerProportion";
          obj.param = JSON.stringify({
            title: "用能占比",
            timeType: "day"
          });
          break;
        default:
          break;
      }
      obj.x = local.x;
      obj.y = local.y;
      obj.h = local.h;
      obj.w = local.w;
      obj.coordinate = JSON.stringify(local);
      obj.t = type;
      obj.plugins = type;
      this.drawerVisible = false;
      // return;
      this.layout.push(obj);
    },
    // 点击选中新增看板
    selectOne(event) {
      this.selectType = event.type;
    },
    // 配置看板返回且不保存当前操作
    cancelSave() {
      this.ifHandle = false;
      this.ifEdit = true;
    },
    // 配置看板返回
    trunBack() {
      this.ifEdit = true;
      var form;

      if (
        // 无表单编辑
        this.backForm == "locationForm" ||
        this.backForm == "gatewayForm" ||
        this.backForm == "warnListForm"
      ) {
        this.ifHandle = false;
        return;
      } else if (this.backForm == "totalEnergyForm") {
        form = this[this.backForm];
        // 总能耗
        // this.ifHandle = false;
        // return;
      } else if (this.backForm == "energyLineForm") {
        // 能耗曲线
        form = this[this.backForm];
      } else if (this.backForm == "variateForm") {
        form = this[this.backForm];
        if (!form.datas.data[0].gatewayId) {
          form = {
            datas: {
              data: []
            },
            param: form.param
          };
        }
      } else {
        form = this[this.backForm];
        console.log(form);
        if (form.datas.data.length > 0) {
          for (var i = 0; i < form.datas.data.length; i++) {
            if (
              !form.datas.data[i].data ||
              !form.datas.data[i].gatewayId ||
              !form.datas.data[i].equipmentId
            ) {
              this.$message("请输入网关、设备、变量不为空的数据");
              return;
            }
          }
          // 过滤变量、名称，从而返回不重复名称
          console.log(form.datas.data);
          form.datas.data = filterSame(form.datas.data);
          console.log(form.datas.data);
        } else {
          if (!form.datas.data[0].equipmentId) {
            form.datas.data = [];
          }
        }
      }
      let index = this.layout.findIndex((item, index) => {
        return item.i === this.backId;
      });
      // return
      this.ifHandle = false;
      this.layout[index].datas.data = JSON.parse(
        JSON.stringify(form.datas.data)
      );
      // }
      // return
      this.layout[index].param = form.param;
      var param = form.param;

      // 如果为----曲线------，则存储颜色至param,删除color属性
      if (this.backForm === "lineChartForm") {
        // // 设备重复去重
        var arr = [];
        for (var j = 0; j < this[this.backForm].datas.data.length; j++) {
          arr.push(
            this[this.backForm].datas.data[j].color &&
              this[this.backForm].datas.data[j].color.length === 7
              ? this[this.backForm].datas.data[j].color
              : color16()
          );
          this.$delete(this.layout[index].datas.data[j], "color");
        }
        param.color = arr;
      }
      // param保存至字符串
      this.layout[index].param = JSON.stringify(param);
      // 数据转JSON
      // 看遍标题刷新
      if (form.title) {
        this.layout[index].title = form.param.title;
      }
      // }

      this.$root.Bus.$emit("clearInterval");
      this.$forceUpdate();
    },
    // 删除变量
    delVariate(index) {
      this.eventForm.variateArr.splice(index, 1);
    },
    // 添加变量
    addVariate() {
      this.eventForm.variateArr.push({});
    },

    // 折线图配置
    // 添加变量
    addLineVariate() {
      this.lineChartForm.data.push({});
    },
    // 删除变量
    delLineVariate(index) {
      this.lineChartForm.data.splice(index, 1);
    },
    // 获取所有可选组件
    getplugs() {
      if (this.$store.state.site.siteId) {
        this.$http
          .get("equipment/plugins/getAll", {
            params: {}
          })
          .then(res => {
            if (res.data.code == 0) {
              this.arr = res.data.data;
            }
          });
      }
      this.$http
        .get("equipment/plugins/getAll", {
          params: {}
        })
        .then(res => {
          if (res.data.code == 0) {
            this.arr = res.data.data;
          }
        });
    },
    // 获取站点下的所有看板
    getBoard() {
      // return
      if (!this.$store.state.site.siteId) {
        return;
      }
      this.loading = true;
      this.$http
        .get("equipment/board/getAll", {
          params: {
            siteId: this.$store.state.site.siteId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            // this.layout = res.data.data
            this.layoutKey++;
            let layout = [];
            for (var j = 0; j < res.data.data.length; j++) {
              let single = {};
              var data = res.data.data[j];
              console.log(res.data.data[j]);
              if (
                res.data.data[j].datas &&
                res.data.data[j].datas.data.length > 0
              ) {
                // 修改code属性为data用于发送数据请求参数
                for (var k = 0; k < res.data.data[j].datas.data.length; k++) {
                  this.$set(
                    res.data.data[j].datas.data[k],
                    "data",
                    res.data.data[j].datas.data[k].code
                  );
                  if (res.data.data[j].datas.data[k].unit) {
                    res.data.data[j].datas.data[k],
                      "unit",
                      res.data.data[j].datas.data[k].unit;
                  }
                  // this.$delete(res.data.data[j].datas.data[k], "code");
                }
              } else {
                single.datas = {};
                single.datas.data = [];
              }
              // return
              single = Object.assign({}, JSON.parse(data.coordinate));
              single.t = data.plugins;
              single.i = data.id;
              single.coordinate = data.coordinate;
              single.datas = data.datas;
              single.param = data.param;
              single.plugins = data.plugins;
              single.site = data.site;
              single.title = data.title;
              single.id = data.id;
              layout.push(single);
            }
            this.layout = layout;
            this.ifLayoutChange = false;
            this.loading = true;
            this.$forceUpdate();
          }
        });
    },
    // 查询站点的所有网关
    getAllGateway() {
      if (!this.$store.state.site.siteId) {
        return;
      }
      this.$http
        .get("equipment/gatewayList", {
          params: {
            page: 0,
            size: GLOBAL.max_page_size,
            roomId: this.$store.state.site.siteId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.gatewayOptions = res.data.data.gateways;
          }
        });
    },
    // 查询站点下的所有设备
    getAllEquip() {
      return;
      if (!this.$store.state.site.siteId) {
        return;
      }
      this.$http
        .get("equipment/getEqByRoom", {
          params: {
            page: 0,
            size: GLOBAL.max_page_size,
            roomId: this.$store.state.site.siteId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            // this.sinEquipOptions = res.data.data;
            this.allEquipOption = res.data.data;
          }
        });
    },
    // 查询所属公司下的所有变量
    getAllVariable() {
      return;
      if (!this.$store.state.site.siteId) {
        return;
      }
      this.$http
        .get("equipment/variable/allVariable", {
          params: {
            companyId: this.$store.state.site.searchCompanyId
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.allVariableOption = res.data.data;
          }
        });
    },
    // 单监控网关值改变
    sinGatewayChange() {
      this.variateForm.datas.data[0].equipmentId = null;
      this.variateForm.datas.data[0].data = null;
    },
    // 单监控设备值修改
    sinEquipChange() {
      this.variateForm.datas.data[0].data = null;
    },
    // 获取单个网关中的所有设备
    getSinEquip(flag) {
      if (!flag) {
        return;
      }
      if (!this.variateForm.datas.data[0].gatewayId) {
        this.$message({
          type: "info",
          message: "请先选中网关"
        });
        return;
      }
      this.$http
        .get("equipment/equipmentList", {
          params: {
            page: 0,
            size: GLOBAL.max_page_size,
            gatewayId: this.variateForm.datas.data[0].gatewayId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.sinEquipOptions = res.data.data.equipments;
          }
        });
    },
    //获取单个设备中的所有变量
    getSinVariable(flag) {
      if (!flag) {
        return;
      }
      if (
        !this.variateForm.datas.data[0].equipmentId &&
        this.variateForm.datas.data[0].equipmentId !== 0
      ) {
        this.$message({
          type: "info",
          message: "请先选中设备"
        });
        return;
      }
      this.$http
        .get("equipment/variable/findAllByEquipment", {
          params: {
            equipmentId: this.variateForm.datas.data[0].equipmentId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.sinVariableOptions = res.data.data;
          }
        });
    },
    sinvariableChange() {
      // var data
      // (variateForm.datas.data)[0].data
      var index = this.sinVariableOptions.findIndex(item => {
        return item.code === this.variateForm.datas.data[0].data;
      });
      // alert(index)
      this.variateForm.datas.data[0].unit = this.sinVariableOptions[index].unit;
    },
    // 保存所有设置------------------
    editSubmit() {
      let param = [];
      for (var j = 0; j < this.layout.length; j++) {
        let obj = {
          x: this.layout[j].x,
          y: this.layout[j].y,
          w: this.layout[j].w,
          h: this.layout[j].h
        };
        console.log(this.layout[j]);
        if (this.layout[j].datas && this.layout[j].datas.data.length > 0) {
          for (var k = 0; k < this.layout[j].datas.data.length; k++) {
            if (this.layout[j].datas.data[k].equipmentId) {
              this.$delete(this.layout[j].datas.data[k], "equipmentId");
            }
            if (this.layout[j].datas.data[k].equipOption) {
              this.$delete(this.layout[j].datas.data[k], "equipOption");
            }
            if (this.layout[j].datas.data[k].variableOption) {
              this.$delete(this.layout[j].datas.data[k], "variableOption");
            }
            this.$delete(this.layout[j].datas.data[k], "value");
            // }
            if (
              this.layout[j].plugins == "gatewayStatus" ||
              this.layout[j].plugins == "warnList" ||
              this.layout[j].plugins == "location" ||
              this.layout[j].plugins == "totalEnergy"
            ) {
              this.layout[j].datas.data = [];
            }
          }
        } else {
          this.layout[j].datas = {};
          this.layout[j].datas.data = null;
        }
        // return
        param[j] = {};
        param[j].coordinate = JSON.stringify(obj);
        param[j].data = Boolean(this.layout[j].datas.data)
          ? JSON.stringify(this.layout[j].datas.data)
          : null;

        param[j].site = this.layout[j].site;
        param[j].plugins = this.layout[j].plugins;
        param[j].param = this.layout[j].param;
        param[j].title = this.layout[j].title;
        param[j].id = this.layout[j].id;
      }
      let board = JSON.stringify(param);
      // return
      this.$http
        .post("equipment/board/update", {
          rmIds: this.deleteIdArr.join(","),
          boards: board
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$notify({
              title: "成功",
              message: "提交成功",
              type: "success"
            });
          }
          this.ifEdit = false;
          this.layout = [];
          this.getplugs();
          this.getBoard();
          this.ifResize = this.ifDrag = this.ifEdit;
          // 清空数组
          this.newCreatIds = [];
          this.deleteIdArr = [];
          // this.$forceUpdate();
        });
    },
    // ----------------------------多变量监控
    // 网关改变，设备变量清除
    moreDataGatewayArrchange(index) {
      this.moreDataForm.datas.data[index].equipmentId = null;
      this.moreDataForm.datas.data[index].data = null;
    },
    // 设备改变，变量清除
    equipArrChange(index, e) {
      // this.moreDataForm.datas.data[index].data = "";

      this.moreDataForm.datas.data[index].data = null;
      let obj = {};
      obj = this.moreDataForm.datas.data[index].equipOption.find(item => {
        return item.equipmentId === e; //筛选出匹配数据
      });
      console.log(obj);
      this.moreDataForm.datas.data[index].equipmentName = obj.name;
    },
    // 获取设备选项
    getMoreDataEquip($event, index) {
      if (!$event) {
        return;
      }
      if (!this.moreDataForm.datas.data[index].gatewayId) {
        this.$message("请先选中网关再选设备！");
        return;
      }
      this.$http
        .get("equipment/equipmentList", {
          params: {
            page: 0,
            size: GLOBAL.max_page_size,
            gatewayId: this.moreDataForm.datas.data[index].gatewayId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.moreDataForm.datas.data[index].equipOption =
              res.data.data.equipments;
            this.$forceUpdate();
          }
        });
    },
    // 根据设备查变量
    getVariable($event, index) {
      if (!$event) {
        return;
      }
      if (!this.moreDataForm.datas.data[index].equipmentId) {
        this.$message("请先选中设备再选变量！");
        return;
      }
      this.$http
        .get("equipment/variable/findAllByEquipment", {
          params: {
            equipmentId: this.moreDataForm.datas.data[index].equipmentId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.moreDataForm.datas.data[index].variableOption = res.data.data;
            this.$forceUpdate();
          }
        });
    },
    // 变量修改，单位修改
    moreVariableChange(index, e) {
      let obj = {};
      obj = this.moreDataForm.datas.data[index].variableOption.find(item => {
        return item.code === e; //筛选出匹配数据
      });
      console.log(obj);
      // console.log(obj.name); //我这边的name就是对应label的
      this.moreDataForm.datas.data[index].simplifiedCode = obj.simplifiedCode;
      this.moreDataForm.datas.data[index].variableName = obj.name;
      this.moreDataForm.datas.data[index].code = e;
    },
    // 添加数据项
    addDataItem() {
      this.moreDataForm.datas.data.push({
        data: "",
        equipOption: this.allEquipOption,
        equipmentId: "",
        name: "",
        variableOption: this.allVariableOption
      });
    },
    // 删除数据项
    delDataItem(index) {
      this.moreDataForm.datas.data.splice(index, 1);
    },
    //------------------------------------曲线
    // 设备改变，变量清除
    lineGatewayArrchange(index) {
      this.lineChartForm.datas.data[index].equipmentId = null;
      this.lineChartForm.datas.data[index].data = null;
    },
    lineEquipArrchange(index, e) {
      // this.lineChartForm.datas.data[index].data = null;

      this.lineChartForm.datas.data[index].data = null;
      let obj = {};
      obj = this.lineChartForm.datas.data[index].equipOption.find(item => {
        return item.equipmentId === e; //筛选出匹配数据
      });
      this.lineChartForm.datas.data[index].equipmentName = obj.name;
    },
    // 获取设备选项
    getLineEquip($event, index) {
      if (!$event) {
        return;
      }
      if (!this.lineChartForm.datas.data[index].gatewayId) {
        this.$message("请先选中网关再选设备！");
        return;
      }
      this.$http
        .get("equipment/equipmentList", {
          params: {
            page: 0,
            size: GLOBAL.max_page_size,
            gatewayId: this.lineChartForm.datas.data[index].gatewayId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.lineChartForm.datas.data[index].equipOption =
              res.data.data.equipments;
            this.$forceUpdate();
          }
        });
    },
    // 获取变量选项
    lineGetVariable($event, index) {
      if (!$event) {
        return;
      }
      if (!this.lineChartForm.datas.data[index].equipmentId) {
        this.$message("请先选中设备再选变量！");
        return;
      }
      this.$http
        .get("equipment/variable/findAllByEquipment", {
          params: {
            equipmentId: this.lineChartForm.datas.data[index].equipmentId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.lineChartForm.datas.data[index].variableOption = res.data.data;
            this.$forceUpdate();
          }
        });
    },
    // 变量选中后
    lineVariableChange(index, e) {
      console.log(index, e);
      let obj = {};
      obj = this.lineChartForm.datas.data[index].variableOption.find(item => {
        return item.code === e; //筛选出匹配数据
      });
      this.lineChartForm.datas.data[index].simplifiedCode = obj.simplifiedCode;
      this.lineChartForm.datas.data[index].variableName = obj.name;
      this.lineChartForm.datas.data[index].code = e;
    },
    // 颜色选中值修改
    lineColorChange() {
      // 强制更新界面，修改bug
      this.$forceUpdate();
    },
    // 删除数据项
    lineDelLineVariate(index) {
      this.lineChartForm.datas.data.splice(index, 1);
    },
    // 新增数据项
    addLineVariate() {
      this.lineChartForm.datas.data.push({
        data: "",
        equipOption: this.allEquipOption,
        equipmentId: "",
        name: "",
        variableOption: [],
        color: color16()
      });
    },
    // -----------------------------报表
    // 删除项
    reportDelVariate(index) {
      this.reportForm.datas.data.splice(index, 1);
    },
    // 清除设备变量
    reportGatewayArrchange(index) {
      this.reportForm.datas.data[index].equipmentId = null;
      this.reportForm.datas.data[index].data = null;
    },
    // 清空变量
    reportEquipArrchange(index, e) {
      this.reportForm.datas.data[index].data = null;
      let obj = {};
      obj = this.reportForm.datas.data[index].equipOption.find(item => {
        return item.equipmentId === e; //筛选出匹配数据
      });
      this.reportForm.datas.data[index].equipmentName = obj.name;
    },
    // 下拉获取设备
    getReportEquip($event, index) {
      if (!$event) {
        return;
      }
      if (!this.reportForm.datas.data[index].gatewayId) {
        this.$message("请先选中网关再选设备！");
        return;
      }
      this.$http
        .get("equipment/equipmentList", {
          params: {
            page: 0,
            size: GLOBAL.max_page_size,
            gatewayId: this.reportForm.datas.data[index].gatewayId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.reportForm.datas.data[index].equipOption =
              res.data.data.equipments;
            this.$forceUpdate();
          }
        });
    },
    // 下拉获取变量选项
    reportGetVariable($event, index) {
      if (!$event) {
        return;
      }
      if (!this.reportForm.datas.data[index].equipmentId) {
        this.$message("请先选中设备再选变量！");
        return;
      }
      this.$http
        .get("equipment/variable/findAllByEquipment", {
          params: {
            equipmentId: this.reportForm.datas.data[index].equipmentId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.reportForm.datas.data[index].variableOption = res.data.data;
            this.$forceUpdate();
          }
        });
    },
    // 变量选中后
    reportVariableChange(index, e) {
      let obj = {};
      obj = this.reportForm.datas.data[index].variableOption.find(item => {
        return item.code === e; //筛选出匹配数据
      });
      // console.log(obj.name); //我这边的name就是对应label的
      this.reportForm.datas.data[index].chName = obj.name;
      this.reportForm.datas.data[index].simplifiedCode = obj.simplifiedCode;
      this.reportForm.datas.data[index].code = e;
    },
    // reportEquipArrchange($event, index) {},
    addReportVariate() {
      this.reportForm.datas.data.push({
        data: "",
        equipOption: this.allEquipOption,
        equipmentId: "",
        name: "",
        variableOption: []
      });
    },
    // ----------------------------用能统计
    // 删除项
    powerConsumptionDelVariate(index) {
      this.powerConsumptionForm.datas.data.splice(index, 1);
    },
    // 清除设备及变量
    powerConsumptionGatewayArrchange(index) {
      this.powerConsumptionForm.datas.data[index].equipmentId = null;
      this.powerConsumptionForm.datas.data[index].data = null;
    },
    // 清空变量
    powerConsumptionEquipArrchange(index, e) {
      this.powerConsumptionForm.datas.data[index].data = null;
      let obj = {};
      obj = this.powerConsumptionForm.datas.data[index].equipOption.find(
        item => {
          return item.equipmentId === e; //筛选出匹配数据
        }
      );
      console.log(obj);
      this.powerConsumptionForm.datas.data[index].equipmentName = obj.name;
    },
    // 下拉获取设备
    getPowerConsumptionEquip($event, index) {
      if (!$event) {
        return;
      }
      if (!this.powerConsumptionForm.datas.data[index].gatewayId) {
        this.$message("请先选中网关再选设备！");
        return;
      }
      this.$http
        .get("equipment/equipmentList", {
          params: {
            page: 0,
            size: GLOBAL.max_page_size,
            gatewayId: this.powerConsumptionForm.datas.data[index].gatewayId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.powerConsumptionForm.datas.data[index].equipOption =
              res.data.data.equipments;
            this.$forceUpdate();
          }
        });
    },

    // 下拉获取变量选项
    powerConsumptionGetVariable($event, index) {
      if (!$event) {
        return;
      }
      if (!this.powerConsumptionForm.datas.data[index].equipmentId) {
        this.$message("请先选中设备再选变量！");
        return;
      }
      if (!this.powerConsumptionForm.param.powerType) {
        this.$message("请先选中能源类型再选变量！");
        return;
      }
      this.$http
        .get("equipment/variable/findAllByEquipment", {
          params: {
            equipmentId: this.powerConsumptionForm.datas.data[index]
              .equipmentId,
            energyType: this.powerConsumptionForm.param.powerType
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.powerConsumptionForm.datas.data[index].variableOption =
              res.data.data;
            this.$forceUpdate();
          }
        });
    },
    // 变量选中后
    powerConsumptionVariableChange(index, e) {
      console.log(index, e);
      // return
      let obj = {};
      obj = this.powerConsumptionForm.datas.data[index].variableOption.find(
        item => {
          return item.code === e; //筛选出匹配数据
        }
      );
      // console.log(obj.name); //我这边的name就是对应label的
      this.powerConsumptionForm.datas.data[index].simplifiedCode =
        obj.simplifiedCode;
      this.powerConsumptionForm.datas.data[index].code = e;
    },
    // reportEquipArrchange($event, index) {},
    addPowerConsumptionVariate() {
      this.powerConsumptionForm.datas.data.push({
        data: "",
        equipOption: this.allEquipOption,
        equipmentId: "",
        name: "",
        variableOption: []
      });
    },
    // // 获取所有能耗类型
    // getAllPowerType() {
    //   this.$http
    //     .get("equipment/energyProperties/findAll", {
    //       params: {}
    //     })
    //     .then(res => {
    //       if (res.data.code === 0) {
    //         this.powerTypeOptions = res.data.data;
    //       }
    //     });
    // },
    // powerCurve
    //------------------------------------曲线
    // 网关改变，设备变量清除
    powerCurveGatewayArrchange(index) {
      this.powerCurveForm.datas.data[index].equipmentId = null;
      this.powerCurveForm.datas.data[index].data = null;
    },
    powerCurveEquipArrchange(index, e) {
      this.powerCurveForm.datas.data[index].data = null;
      let obj = {};
      obj = this.powerCurveForm.datas.data[index].equipOption.find(item => {
        return item.equipmentId === e; //筛选出匹配数据
      });
      console.log(obj);
      this.powerCurveForm.datas.data[index].equipmentName = obj.name;
    },
    // 获取设备选项
    getPowerCurveEquip($event, index) {
      if (!$event) {
        return;
      }
      if (!this.powerCurveForm.datas.data[index].gatewayId) {
        this.$message("请先选中网关再选设备！");
        return;
      }
      this.$http
        .get("equipment/equipmentList", {
          params: {
            page: 0,
            size: GLOBAL.max_page_size,
            gatewayId: this.powerCurveForm.datas.data[index].gatewayId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.powerCurveForm.datas.data[index].equipOption =
              res.data.data.equipments;
            this.$forceUpdate();
          }
        });
    },
    // 获取变量选项
    powerCurveGetVariable($event, index) {
      if (!$event) {
        return;
      }
      if (!this.powerCurveForm.datas.data[index].equipmentId) {
        this.$message("请先选中设备再选变量！");
        return;
      }
      if (!this.powerCurveForm.param.powerType) {
        this.$message("请先选中能源类型再选变量！");
        return;
      }
      this.$http
        .get("equipment/variable/findAllByEquipment", {
          params: {
            equipmentId: this.powerCurveForm.datas.data[index].equipmentId,
            energyType: this.powerCurveForm.param.powerType
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.powerCurveForm.datas.data[index].variableOption =
              res.data.data;
            this.$forceUpdate();
          }
        });
    },
    powerCurveVariableChange(index, e) {
      console.log(index, e);
      // return
      let obj = {};
      obj = this.powerCurveForm.datas.data[index].variableOption.find(item => {
        return item.code === e; //筛选出匹配数据
      });
      console.log(obj);
      // console.log(obj.name); //我这边的name就是对应label的
      this.powerCurveForm.datas.data[index].simplifiedCode = obj.simplifiedCode;
      this.powerCurveForm.datas.data[index].variableName = obj.name;
      this.powerCurveForm.datas.data[index].code = e;
    },
    // 删除数据项
    powerCurveDelLineVariate(index) {
      this.powerCurveForm.datas.data.splice(index, 1);
    },
    // 新增数据项
    addpowerCurveVariate() {
      this.powerCurveForm.datas.data.push({
        data: "",
        equipOption: this.allEquipOption,
        equipmentId: "",
        name: "",
        variableOption: [],
        color: color16()
      });
    },
    // ----------------------------用能占比
    // 删除项
    powerProportionDelVariate(index) {
      this.powerProportionForm.datas.data.splice(index, 1);
    },
    // 清除设备及变量
    powerProportionGatewayArrchange(index) {
      this.powerProportionForm.datas.data[index].equipmentId = null;
      this.powerProportionForm.datas.data[index].data = null;
    },
    // 清空变量
    powerProportionEquipArrchange(index, e) {
      this.powerProportionForm.datas.data[index].data = null;
      let obj = {};
      obj = this.powerProportionForm.datas.data[index].equipOption.find(
        item => {
          return item.equipmentId === e; //筛选出匹配数据
        }
      );
      console.log(obj);
      this.powerProportionForm.datas.data[index].equipmentName = obj.name;
    },
    // 下拉获取设备
    getpowerProportionEquip($event, index) {
      if (!$event) {
        return;
      }
      if (!this.powerProportionForm.datas.data[index].gatewayId) {
        this.$message("请先选中网关再选设备！");
        return;
      }
      this.$http
        .get("equipment/equipmentList", {
          params: {
            page: 0,
            size: GLOBAL.max_page_size,
            gatewayId: this.powerProportionForm.datas.data[index].gatewayId
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.powerProportionForm.datas.data[index].equipOption =
              res.data.data.equipments;
            this.$forceUpdate();
          }
        });
    },
    // 下拉获取变量选项
    powerProportionGetVariable($event, index) {
      if (!$event) {
        return;
      }
      if (!this.powerProportionForm.datas.data[index].equipmentId) {
        this.$message("请先选中设备再选变量！");
        return;
      }
      if (!this.powerProportionForm.param.powerType) {
        this.$message("请先选中能源类型再选变量！");
        return;
      }
      this.$http
        .get("equipment/variable/findAllByEquipment", {
          params: {
            equipmentId: this.powerProportionForm.datas.data[index].equipmentId,
            energyType: this.powerProportionForm.param.powerType
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            this.powerProportionForm.datas.data[index].variableOption =
              res.data.data;
            this.$forceUpdate();
          }
        });
    },
    powerProportionVariableChange(index, e) {
      console.log(index, e);
      // return
      let obj = {};
      obj = this.powerProportionForm.datas.data[index].variableOption.find(
        item => {
          return item.code === e; //筛选出匹配数据
        }
      );
      console.log(obj);
      // console.log(obj.name); //我这边的name就是对应label的
      this.powerProportionForm.datas.data[index].simplifiedCode =
        obj.simplifiedCode;
      this.powerProportionForm.datas.data[index].variableName = obj.name;
    },
    // reportEquipArrchange($event, index) {},
    addpowerProportionVariate() {
      this.powerProportionForm.datas.data.push({
        data: "",
        equipOption: this.allEquipOption,
        equipmentId: "",
        name: "",
        variableOption: []
      });
    },
    // 获取所有能耗类型
    getAllPowerType(form) {
      this.$http
        .get("equipment/energyProperties/findAll", {
          params: {}
        })
        .then(res => {
          if (res.data.code === 0) {
            this.powerTypeOptions = res.data.data;
            if (!this[form].param.powerType) {
              this[form].param.powerType = res.data.data[0].id;
            }
          }
        });
    }
  }
};
</script>


<style>
/* 设置全局样式-------------------------------------------- */
:focus {
  outline: 0;
}
</style>

 <style lang="less" scoped>
@import "../../assets/css/index.less";
.all {
  height: 100%;
  background-color: #435c70;
  // min-height: 100%;
  overflow-y: auto;
  .layout {
    min-height: 100%;
    // overflow-y: auto;
    .show {
      min-height: calc(100% - 40px;);
    }
    .foot {
      padding-top: 6px;
    }
  }
  // 配置界面
  .edit {
    color: #fff;
    height: 100%;
    min-height: 400px;
    padding: 8px;
    box-sizing: border-box;
    // 配置页面所有表单设置字体颜色
    & /deep/ .el-form-item__label {
      color: #ccc;
    }
    .back {
      margin-bottom: 8px;
      .el-button {
        background-color: rgb(245, 166, 35);
        border: none;
      }
    }
    // 时间列表
    .warnList {
      .eventForm {
        margin-top: 25px;
        padding-top: 20px;
        border-top: 1px dashed #aaa;
        height: calc(100% - 32px);
      }
    }

    // 单变量监控
    .singleMonitor {
      .singleMonitor-show {
        position: relative;
        overflow: auto;
        height: 130px;
        margin: 0 8px;
        .left-top {
          position: absolute;
          left: 5px;
          top: 5px;
        }
        .bottom {
          position: absolute;
          left: 5px;
          bottom: 5px;
        }
      }
      // 表单区域
      .variateForm {
        margin-top: 25px;
        padding-top: 30px;
        border-top: 1px dashed #aaa;
        .input-block {
          width: 310px;
          display: inline-block;
        }
        & /deep/ .el-form-item {
          margin-bottom: 4px;
          & /deep/ .el-input__inner {
            height: 27px;
          }
          & .el-form-item__content {
            & .el-input-number--mini {
              line-height: 34px;
              color: #fff;
              .el-input-number__decrease,
              .el-input-number__increase {
                background: #7085a5;
              }
            }
          }
        }
      }
    }

    // 折线
    .line {
      .lineChartForm {
        margin-top: 30px;
        .item-single {
          margin-bottom: 4px;
          .input-block {
            width: 260px;
            display: inline-block;
          }
          & /deep/ .el-form-item {
            margin-bottom: 4px;
            .el-input__inner {
              height: 27px;
            }
          }
        }
        .color-block {
          display: inline-block;
          position: absolute;
          top: 0px;
          left: 210px;
        }
      }
    }
    // 报表
    .report {
      .reportForm {
        margin-top: 30px;
        .input-block {
          width: 260px;
          display: inline-block;
        }
        & /deep/ .el-form-item {
          margin-bottom: 4px;
          .el-input__inner {
            height: 27px;
          }
        }
      }
    }
    // 多变量监控
    .moreData {
      .moreDataForm {
        padding-top: 30px;
        border-top: 1px dashed #aaa;
        & /deep/ .el-form-item {
          margin-bottom: 4px;
        }
        .input-block {
          display: inline-block;
          width: 260px;
          & /deep/ .el-input__inner {
            height: 27px;
          }
        }
        & /deep/ .el-button--text {
          padding: 0;
          color: red;
          margin-left: 10px;
        }
      }
    }
    // 站点定位
    .location {
    }
    // 网管在线状态
    .gatewayStatus {
    }

    // 总能耗
    .totalEnergy {
      .totalEnergyForm {
        padding-top: 30px;
        border-top: 1px dashed #aaa;
        & /deep/ .el-form-item {
          margin-bottom: 4px;
        }
        .input-block {
          display: inline-block;
          width: 260px;
          & /deep/ .el-input__inner {
            height: 27px;
          }
        }
        & /deep/ .el-button--text {
          padding: 0;
          color: red;
          margin-left: 10px;
        }
      }
    }
    // 能耗曲线
    .energyLine {
      .energyLineForm {
        padding-top: 30px;
        border-top: 1px dashed #aaa;
        & /deep/ .el-form-item {
          margin-bottom: 4px;
        }
        .input-block {
          display: inline-block;
          width: 260px;
          & /deep/ .el-input__inner {
            height: 27px;
          }
        }
        & /deep/ .el-button--text {
          padding: 0;
          color: red;
          margin-left: 10px;
        }
      }
    }
    //用能统计
    .powerConsumptionForm {
      margin-top: 30px;
      .input-block {
        width: 260px;
        display: inline-block;
      }
      & /deep/ .el-form-item {
        margin-bottom: 4px;
        .el-input__inner {
          height: 27px;
        }
      }
    }
    // 当天能耗曲线
    // 折线
    .powerCurve {
      .powerCurveForm {
        margin-top: 30px;
        .item-single {
          margin-bottom: 4px;
          .input-block {
            width: 260px;
            display: inline-block;
          }
          & /deep/ .el-form-item {
            margin-bottom: 4px;
            .el-input__inner {
              height: 27px;
            }
          }
        }
        .color-block {
          display: inline-block;
          position: absolute;
          top: 0px;
          left: 210px;
        }
      }
    }
    //用能占比
    .powerProportionForm {
      margin-top: 30px;
      .input-block {
        width: 260px;
        display: inline-block;
      }
      & /deep/ .el-form-item {
        margin-bottom: 4px;
        .el-input__inner {
          height: 27px;
        }
      }
    }
  }
  .draw {
    & /deep/ .el-drawer.rtl {
      background-color: rgba(67, 92, 112);
      .el-drawer__header {
        margin-bottom: 10px;
        span {
          font-size: 22px;
          border: 0;
        }
      }
      .el-drawer__body {
        height: 100%;
        overflow: scroll;
      }
    }
    // 弹窗内容
    .block {
      // padding-left: 6px;
      padding: 12px 6px;
      border-bottom: 1px solid #aaa;
      .d-title {
        margin-bottom: 4px;
        color: #fff;
      }
      .d-main {
        display: flex;
        align-items: flex-start;
        .pic-text {
          border: 1px solid rgba(0, 0, 0, 0); //设置透明边框
          box-sizing: border-box;
          display: inline-block;
          width: 170px;
          margin-right: 10px;
          &:hover {
            cursor: pointer;
          }
          .sin-title {
            h4 {
              color: #fff;
            }
            .say {
              font-size: 12px;
              color: #bbb;
            }
          }
        }
        // 选中
        .selected {
          border: 1px solid #0db2ae;
          box-sizing: border-box;
        }
      }
    }
    .board-footer {
      // border-top: 1px solid #fff;
      padding-top: 10px;
      // margin-top: 30px;
    }
  }
}
</style>