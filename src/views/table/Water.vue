<template>
  <v-app id="app">
    <!-- title and filter card -->
    <div class="content background-main">
      <v-row justify="space-between" class="px-3">
        <!-- title -->
        <div class="mb-4">
          <v-row style="align-items: center">
            <div class="ml-3 mt-9">
              <h2>
                <v-icon size="40" color="blue">mdi-water</v-icon> จัดการน้ำประปา
              </h2>
            </div>
            <!-- <span> {{ this.$date().format("YYYY/MM") }} </span>
            <h2>{{ ((new Date().getMonth() + 1) % 12) - 1 }}</h2> -->
          </v-row>
        </div>
      </v-row>
      <!-- filter -->
      <v-card class="card-filter px-6 py-6">
        <!-- title -->
        <v-card-title>
          <v-icon size="35px" class="icon"
            >mdi-format-list-bulleted-triangle</v-icon
          >
          &nbsp;&nbsp;
          <h3>เครื่องมือค้นหา</h3>
          <!-- button -->
          <v-spacer></v-spacer>
        </v-card-title>
        <!-- filter -->
        <v-row justify="space-between" class="px-3">
          <!-- Filter for  name-->
          <v-col cols="12" xs="12" sm="12" md="4" lg="4">
            <v-text-field
              v-model="search"
              prepend-icon="mdi-magnify"
              type="text"
              label="ค้นหา"
              class="filter"
              clearable
            ></v-text-field>
          </v-col>
          <!-- Filter for waterGroup-->
          <v-col cols="12" xs="12" sm="12" md="4" lg="4">
            <v-autocomplete
              v-model="waterGroupfilterValue"
              label="ค้นหาด้วยด้วยสายมิเตอร์"
              prepend-icon="mdi-home-group"
              :items="meterGroups"
              class="filter"
              clearable
              item-text="name"
              item-value="name"
            >
            </v-autocomplete>
          </v-col>
          <!-- Filter for  zone-->
          <v-col cols="12" xs="12" sm="12" md="4" lg="4">
            <v-autocomplete
              v-model="zoneFilterValue"
              prepend-icon="mdi-map-legend"
              label="ค้นหาด้วยด้วยเขต"
              class="filter"
              :items="zones"
              item-text="zone"
              item-value="id"
              clearable
            >
            </v-autocomplete>
          </v-col>
          <!-- Filter for  building-->
          <v-col cols="12" xs="12" sm="12" md="4" lg="4">
            <v-autocomplete
              v-model="buildingFilterValue"
              prepend-icon="mdi-office-building"
              label="ค้นหาด้วยด้วยอาคาร"
              class="filter"
              :items="buildings"
              clearable
              :disabled="!zoneFilterValue"
            >
            </v-autocomplete>
          </v-col>
          <!-- filter by date -->
          <v-col cols="12" xs="12" sm="12" md="4" lg="4">
            <v-menu
              v-model="menuDatefilter"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="dateFilterValue"
                  label="ค้นหาด้วยด้วยรอบบิล"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  class="filter"
                  clearable
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="dateFilterValue"
                type="month"
                locale="th-TH"
                scrollable
                @input="menuDatefilter = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <!-- Filter for  status-->
          <v-col cols="12" xs="12" sm="12" md="4" lg="4">
            <v-select
              v-model="stateFilterValue"
              :items="statuses"
              prepend-icon="mdi-list-status"
              label="ค้นหาด้วยด้วยสถานะ"
              class="filter"
              clearable
              item-text="name"
              item-value="value"
              v-if="role === 'admin'"
            ></v-select>
          </v-col>
          <!-- btn filter -->
          <v-col cols="12" justify="space-between" class="px-3">
            <v-btn
              outlined
              color="error"
              width="140"
              @click="clearFilter"
              class="button-filter pt-6 pb-6"
            >
              <v-icon>mdi-delete-sweep</v-icon>
              &nbsp; ล้างการค้นหา
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </div>
    <!-- button and data table -->
    <v-card class="card-filter px-6 py-6">
      <!-- title and button -->
      <v-card-title>
        <!-- title -->
        <v-icon size="35px" class="icon">mdi-table-large</v-icon>
        &nbsp;&nbsp;
        <h3>ตารางค่าน้ำประปา</h3>
        <v-spacer></v-spacer>
        <div>
          <!-- water diff_price_cal -->
          <v-dialog
            v-model="differencePriceCalculate"
            persistent
            max-width="60%"
            v-if="role === 'admin'"
          >
            <template v-slot:activator="{ on: attrs }">
              <v-btn
                class="button-filter pt-5 pb-5"
                color="agree"
                v-on="{ ...attrs }"
              >
                <v-icon> mdi-calculator </v-icon>
                &nbsp; คำนวนค่าน้ำส่วนต่าง
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <v-icon> mdi-calculator </v-icon> &nbsp;
                คำนวนค่าน้ำส่วนต่าง</v-card-title
              >
              <v-card-text>
                <!-- new changed  version ╰(▔∀▔)╯  ╰(▔∀▔)╯ -->
                <v-form ref="formDiffPrice" v-model="valid" lazy-validation>
                  <v-row>
                    <!-- meter group -->
                    <v-col cols="6">
                      <v-select
                        v-model="waterGroupCalculate"
                        label="สายของมิเตอร์น้ำ"
                        prepend-icon="mdi-home-group"
                        required
                        :items="meterGroups"
                        :rules="rules.buildingRoom"
                        item-text="name"
                        item-value="id"
                        ref="input"
                      >
                      </v-select>
                    </v-col>
                    <!-- meter zone -->
                    <v-col cols="6">
                      <v-text-field
                        v-model.number="meterZone"
                        required
                        label="ค่าน้ำจากมิเตอร์ใหญ่"
                        prepend-icon="mdi-car-speed-limiter"
                        @keypress="isNumber($event)"
                        :rules="rules.buildingRoom"
                        v-on:keyup="checkEnterPressedToSubmit"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="warning"
                  text
                  @click="differencePriceCalculate = false"
                  >ยกเลิก</v-btn
                >
                <v-btn
                  color="agree"
                  :disabled="!valid"
                  text
                  @click="validateDiffprice"
                  >ยืนยันข้อมูล</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- edit user -->
          <v-dialog
            v-if="role === 'admin'"
            v-model="dialog"
            persistent
            max-width="75%"
          >
            <v-card>
              <v-card-title>
                <span>{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-form ref="formEditwater" v-model="valid" lazy-validation>
                    <v-row>
                      <!-- rank -->
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          v-model="editedItem.rank"
                          :items="ranks"
                          label="ยศ"
                          autofocus
                          required
                          :rules="rules.buildingRoom"
                          disabled
                          item-text="name"
                          item-value="value"
                        >
                        </v-autocomplete>
                      </v-col>
                      <!-- firstname -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.first_name"
                          label="ชื่อ"
                          required
                          :rules="rules.name"
                          disabled
                        ></v-text-field>
                      </v-col>
                      <!-- lasname -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.last_name"
                          label="นามสกุล"
                          required
                          :rules="rules.name"
                          disabled
                        ></v-text-field>
                      </v-col>
                      <!-- meter group -->
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          v-model="editedItem.water_zone"
                          :items="meterGroups"
                          label="สายของมิเตอร์น้ำ"
                          required
                          clearable
                          :rules="rules.buildingRoom"
                          disabled
                          item-text="name"
                          item-value="value"
                        >
                        </v-autocomplete>
                      </v-col>
                      <!-- zone -->
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          label="พื้นที่เขต"
                          v-model="editedItem.zone"
                          :items="zones"
                          :rules="rules.buildingRoom"
                          disabled
                        >
                        </v-autocomplete>
                      </v-col>
                      <!-- building -->
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          label="อาคาร"
                          v-model="editedItem.building"
                          :items="buildings"
                          :rules="rules.buildingRoom"
                          disabled
                        >
                        </v-autocomplete>
                      </v-col>
                      <!-- room number -->
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          label="เลขห้องพัก"
                          v-model="editedItem.room"
                          :items="rooms"
                          :rules="rules.buildingRoom"
                          @keypress="isNumber($event)"
                          disabled
                        >
                        </v-autocomplete>
                      </v-col>
                      <!-- water No -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.water_no"
                          label="เลขผู้ใช้น้ำ"
                          @keypress="isNumber($event)"
                          required
                          counter="4"
                          :rules="rules.waterNumber"
                          disabled
                        ></v-text-field>
                      </v-col>
                      <!-- water meter -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.meter_no"
                          label="เลขมิเตอร์น้ำ"
                          @keypress="isNumber($event)"
                          required
                          counter="4"
                          disabled
                          :rules="rules.waterMeterNumber"
                        ></v-text-field>
                      </v-col>
                      <!-- water unit -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.unit"
                          label="หน่วยน้ำ"
                          @keypress="isNumber($event)"
                          required
                          suffix="หน่วย"
                          :rules="rules.buildingRoom"
                        ></v-text-field>
                      </v-col>
                      <!-- water price -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.price"
                          label="ค่าน้ำ"
                          @keypress="isNumber($event)"
                          required
                          :rules="rules.buildingRoom"
                          :value="this.priceOfwater"
                        ></v-text-field>
                      </v-col>
                      <!-- water price Diff -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.price_diff" disabled>
                          <template v-slot:label>
                            ค่าน้ำส่วนนต่างเป็น {{ price_diff }}
                          </template>
                        </v-text-field>
                      </v-col>
                      <!-- status -->
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          v-model="editedItem.status"
                          :items="statuses"
                          label="สถานะ"
                          required
                          :rules="rules.buildingRoom"
                          item-text="name"
                          item-value="value"
                        >
                        </v-select>
                      </v-col>
                      <!-- bill pay -->
                      <v-col cols="12" sm="6" md="4">
                        <v-dialog
                          ref="dialog"
                          v-model="modal"
                          persistent
                          width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="editedItem.billing_cycle"
                              label="รอบบิล"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="editedItem.billing_cycle"
                            type="month"
                            locale="th-TH"
                          >
                            <v-spacer></v-spacer>
                            <v-btn text color="warning" @click="modal = false">
                              ยกเลิก
                            </v-btn>
                            <v-btn
                              text
                              color="agree"
                              @click="
                                $refs.dialog.save(editedItem.billing_cycle)
                              "
                            >
                              ยืนยัน
                            </v-btn>
                          </v-date-picker>
                        </v-dialog>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>
              <!-- button -->
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-form ref="formButton" v-model="valid" lazy-validation>
                  <v-btn color="warning" text @click="close"> ยกเลิก </v-btn>
                  <v-btn color="agree" :disabled="!valid" text @click="save">
                    ยืนยัน
                  </v-btn>
                </v-form>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- export excel -->
          <v-dialog
            v-if="role === 'admin'"
            v-model="exportExcelwater"
            max-width="75%"
            persistent
          >
            <template v-slot:activator="{ on: attrs }">
              <v-btn
                color="#06C3FF"
                class="button-filter pt-5 pb-5"
                v-on="{ ...attrs }"
                :disabled="!selectItems"
              >
                <v-icon> mdi-file-export-outline </v-icon>
                &nbsp; Export ข้อมูล Excel
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                ต้องการ export ข้อมูลเป็นรูปแบบ Excel ที่เลือกไว้หรือไม่ ?
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="warning" text @click="exportExcelwater = false">
                  ยกเลิก
                </v-btn>
                <v-btn color="agree" text @click="getbillingsID">
                  ยืนยัน
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-card-title>
      <v-card-text>
        <!-- start data-table -->
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="waterTables"
          item-key="first_name"
          :items-per-page="5"
          class="elevation-1 pa-6 th-1"
          :search="search"
          :loading="loadTable"
          loading-text="กำลังโหลด... โปรดรอสักครู่"
          show-select
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          @input="enterSelect($event)"
        >
          <template v-slot:[`waterTable.price`]="{ waterTable }">
            <v-chip :color="getColor(waterTable.price)">
              {{ waterTable.price }}
            </v-chip>
          </template>
          <template v-if="role === 'admin'" v-slot:[`item.status`]="{ item }">
            <v-chip :color="getColorForStatus(item.status)">
              <td v-if="item.status == 'draft'">{{ "ร่าง" }}</td>
              <td v-if="item.status == 'in_progess'">{{ "กำลังดำเนินการ" }}</td>
              <td v-if="item.status == 'calculated'">{{ "คำนวนแล้ว" }}</td>
              <td v-if="item.status == 'exported'">{{ "Export แล้ว" }}</td>
            </v-chip>
          </template>
          <template v-if="role === 'admin'" v-slot:[`item.actions`]="{ item }">
            <v-icon @click="editItem(item)"> mdi-pencil </v-icon>
          </template>
        </v-data-table>
        <!-- end data-table -->
      </v-card-text>
      <v-snackbar v-model="snackbar" :timeout="timeout" :color="colorSnackbar">
        <div class="text-center">
          {{ statusAction }}
        </div>
      </v-snackbar>
    </v-card>
  </v-app>
</template>

<script>
import statuses from "../../json/statuses.json";
import ranks from "../../json/rank.json";
import axios from "axios";
import { apiUrl } from "../../utils/url";
import zonesBuildingsRoom from "../../json/zonesBuildings.json";
import water_groups from "../../json/waterGroups.json";
export default {
  data: () => ({
    zonesBuildingsRoom: zonesBuildingsRoom,
    role: "",
    loadTable: true,
    snackbar: false,
    statusAction: "",
    colorSnackbar: "",
    timeout: 2000,
    el: "#app",
    sortBy: "first_name",
    menuDatefilter: false,
    sortDesc: false,
    oldUnit: null,
    currentUnit: null,
    selected: [],
    attrs: {},
    on: {},
    selectItems: false,
    valid: true,
    meterSum: null,
    meterZone: null,
    numberOfroom: "",
    rank: null,
    price_diff: null,
    ranks: ranks,
    modal: false,
    meter_group: null,
    meterGroups: water_groups,
    dialog: false,
    emailtarget: "",
    date_now: new Date().toISOString().substr(0, 10),
    differencePriceCalculate: false,
    importExcel: false,
    exportExcelwater: false,
    menu: false,
    search: "",
    // Filter models
    NamefilterValue: "",
    waterGroupfilterValue: "",
    waterGroupCalculate: "",
    buildingFilterValue: "",
    zoneFilterValue: "",
    dateFilterValue: "",
    date: "",
    stateFilterValue: "",
    statuses: statuses,
    billingsIDs: "",
    waterTables: [],
    editedIndex: -1,
    editedItem: {
      first_name: "",
      zone: "",
      building: "",
      room: "",
      water_no: "",
      water_meter_no: "",
      difference_price: "",
      billing_cycle: new Date().toISOString().substr(0, 7),
    },
    defaultItem: {
      first_name: "",
      zone: "",
      building: "",
      room: "",
      water_no: "",
      water_meter_no: "",
      difference_price: "",
      sum_price: "",
      billing_cycle: new Date().toISOString().substr(0, 7),
      status: "draft",
    },
    rules: {
      format: [
        (value) => !value || value.size < 20000000 || "ขนาดไฟล์ไม่เกิน 20 MB",
      ],
      email: {
        required: (v) => !!v || "กรุณาใส่อีเมลของผู้รับ",
        regex: (v) =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "อีเมลไม่ถูกต้อง",
      },
      name: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length >= 2) || "กรอกชื่อให้มากกว่า 2 ตัวอักษร",
      ],
      waterNumber: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length == 4) || "กรอกเลขผู้ใช้น้ำประปาไม่ครบ 4 ตัว",
      ],
      waterMeterNumber: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length == 4) || "กรอกเลขมิเตอร์น้ำประปาไม่ครบ 4 ตัว",
      ],
      buildingRoom: [(v) => !!v || "กรุณากรอกข้อมูล"],
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "เพิ่มผู้ใช้น้ำ" : "แก้ไขผู้ใช้น้ำ";
    },
    // header table
    headers() {
      return [
        {
          text: "ยศ",
          align: "left",
          value: "rank",
        },
        {
          text: "ชื่อ",
          value: "first_name",
        },
        {
          text: "นามสกุล",
          value: "last_name",
        },
        {
          text: "พื้นที่",
          value: "zone",
          filter: this.zoneFilter,
        },
        {
          text: "สายของมิเตอร์",
          value: "water_zone",
          filter: this.groupFilter,
        },
        {
          text: "อาคาร",
          value: "building",
          filter: this.buildingFilter,
        },
        {
          text: "เลขห้องพัก",
          value: "room",
        },
        {
          text: "เลขผู้ใช้น้ำ",
          value: "water_no",
        },
        {
          text: "เลขมิเตอร์น้ำ",
          value: "water_no",
        },
        {
          text: "รอบบิล",
          value: "billing_cycle",
          filter: this.dateFilter,
        },
        {
          text: "จำนวนหน่วย",
          value: "unit",
        },
        {
          text: "ค่าน้ำ",
          value: "price",
        },
        {
          text: "ค่าน้ำส่วนต่าง",
          value: "price_diff",
        },
        {
          text: "ค่าน้ำรวม",
          value: "total_pay",
        },
        {
          text: "สถานะ",
          value: "status",
          filter: this.stateFilter,
        },
        {
          text: "การจัดการ",
          value: "actions",
          sortable: false,
        },
      ];
    },
    // differencePriceCalculate
    difference: function () {
      const sum = this.meterSum;
      const zone = this.meterZone;
      const room = this.numberOfroom;
      if (sum && zone && room) {
        return ((parseInt(sum) - parseInt(zone)) / parseInt(room)).toFixed(2);
      } else {
        return "0.00";
      }
    },
    // autocomplete  [] {} () <>
    zones() {
      const zones = zonesBuildingsRoom;
      const zonedata = zones.map((x) => x.zone);
      return zonedata;
    },
    buildings() {
      if (this.zoneFilterValue == "เขตส่วนกลาง") {
        const buiding = zonesBuildingsRoom;
        const buildingcenters = buiding[0].buildingcenter;
        const buildingCenter = buildingcenters.map((x) => x.buildingName);
        return buildingCenter;
      }
      if (this.zoneFilterValue == "เขตอัษฎางค์") {
        const buiding = zonesBuildingsRoom;
        const buildingAngtadangs = buiding[1].buildingangtadang;
        const buildingAngtadang = buildingAngtadangs.map((x) => x.buildingName);
        return buildingAngtadang;
      }
      if (this.zoneFilterValue == "เขตสุรนารายณ์") {
        const buiding = zonesBuildingsRoom;
        const buildingSuranarais = buiding[2].buildingsuranarai;
        const buildingSuranarai = buildingSuranarais.map((x) => x.buildingName);
        return buildingSuranarai;
      }
      if (this.editedItem.zone == "เขตส่วนกลาง") {
        const buiding = zonesBuildingsRoom;
        const buildingcenters = buiding[0].buildingcenter;
        const buildingCenter = buildingcenters.map((x) => x.buildingName);
        return buildingCenter;
      }
      if (this.editedItem.zone == "เขตอัษฎางค์") {
        const buiding = zonesBuildingsRoom;
        const buildingAngtadangs = buiding[1].buildingangtadang;
        const buildingAngtadang = buildingAngtadangs.map((x) => x.buildingName);
        return buildingAngtadang;
      }
      if (this.editedItem.zone == "เขตสุรนารายณ์") {
        const buiding = zonesBuildingsRoom;
        const buildingSuranarais = buiding[2].buildingsuranarai;
        const buildingSuranarai = buildingSuranarais.map((x) => x.buildingName);
        return buildingSuranarai;
      } else {
        return ["ไม่มีข้อมูล"];
      }
    },
    rooms() {
      if (this.editedItem.building == "2/11") {
        const buildingcenters = zonesBuildingsRoom[0].buildingcenter[0].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/12") {
        const buildingcenters = zonesBuildingsRoom[0].buildingcenter[1].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/13") {
        const buildingcenters = zonesBuildingsRoom[0].buildingcenter[2].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/14") {
        const buildingcenters = zonesBuildingsRoom[0].buildingcenter[3].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/15") {
        const buildingcenters = zonesBuildingsRoom[0].buildingcenter[4].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/16") {
        const buildingcenters = zonesBuildingsRoom[0].buildingcenter[5].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/17") {
        const buildingcenters = zonesBuildingsRoom[0].buildingcenter[6].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/18") {
        const buildingcenters = zonesBuildingsRoom[0].buildingcenter[7].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/19") {
        const buildingcenters =
          zonesBuildingsRoom[1].buildingangtadang[0].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/20") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[0].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/21") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[1].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/22") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[2].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/23") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[3].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/24") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[4].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/25") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[5].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/26") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[6].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/27") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[7].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/28") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[8].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/29") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[9].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/31") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[10].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/32") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[11].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/33") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[12].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/34") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[13].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/35") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[14].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/36") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[15].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/37") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[16].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/38") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[17].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/39") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[18].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/40") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[19].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      }
      if (this.editedItem.building == "2/41") {
        const buildingcenters =
          zonesBuildingsRoom[2].buildingsuranarai[20].rooms;
        const buildingCenter = buildingcenters.map((x) => x.id);
        return buildingCenter;
      } else {
        return ["ไม่มีข้อมูล"];
      }
    },
    priceOfwater: function () {
      const unit = this.editedItem.water_unit;
      if (unit) {
        return (4 * parseInt(unit)).toFixed(2);
      } else {
        return "0.00";
      }
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.getRole();
  },

  mounted() {
    this.getWaterData();
  },

  methods: {
    // get role
    getRole() {
      var role = localStorage.getItem("role");
      this.role = role;
    },
    // get water data from api
    getWaterData() {
      var config = {
        headers: {
          "x-api-key": "xxx-api-key",
          "x-refresh-token": "xxx-refresh-token",
        },
      };
      // var date = "?date=" + this.date_now;
      var date = "?date=2022-07-29";
      return axios
        .get(apiUrl + "/v1/billings/water" + date, config)
        .then((response) => {
          let data = response.data;
          if (data.status == "success") {
            this.waterTables = data.result.billings;
            this.loadTable = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // color of price
    getColor(price) {
      if (price == 0) return "red";
      else return "#ffffff";
    },
    // color for status
    getColorForStatus(status) {
      if (status == "draft") return "yellow";
      if (status == "in_progess") return "red";
      if (status == "calculated") return "gray";
      else return "green";
    },
    // show delete as selected button
    enterSelect(values) {
      if (values.length >= 1) {
        return (this.selectItems = true);
        // alert("selected all");
      } else {
        return (this.selectItems = false);
      }
    },
    // enter diff price
    async checkEnterPressedToSubmit(e) {
      if (e.keyCode === 13) this.validateDiffprice();
    },
    // validate diff price
    validateDiffprice() {
      if (this.$refs.formDiffPrice.validate()) {
        this.calculateWaterPrice(this.meterZone);
      }
    },
    // calculate Price diff with api
    calculateWaterPrice(meterZone) {
      var config = {
        headers: {
          "x-api-key": "xxx-api-key",
          "x-refresh-token": "xxx-refresh-token",
        },
      };
      let price = { price: meterZone };
      const zoneID = this.waterGroupCalculate;
      return axios
        .post(apiUrl + "/v1/calculate/" + zoneID, price, config)
        .then((response) => {
          let data = response.data;
          if (data.status == "success") {
            this.statusAction = "คำนวนค่าน้ำส่วนต่าง" + "สำเร็จ";
            this.waterGroupCalculate = "";
            this.meterZone = "";
            this.differencePriceCalculate = false;
            this.colorSnackbar = "agree";
            this.snackbar = true;
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data.status === "unauthorized") {
            this.statusAction =
              "คำวนวนค่าน้ำส่วนต่าง ไม่สำเร็จ กรุณาติดต่อผู้จัดทำ";
            this.colorSnackbar = "red";
            this.snackbar = true;
          }
          if (error.response.data.status === "unprocessable_entity") {
            this.statusAction =
              "คำวนวนค่าน้ำส่วนต่าง ไม่สำเร็จ กรุณาเลือกสายมิเตอร์ที่ยังไม่คำนวน";
            this.colorSnackbar = "warning";
            this.snackbar = true;
          }
          this.differencePriceCalculate = false;
        });
    },
    // get selected id
    getbillingsID() {
      if (this.selectItems == true) {
        let billingsIDs = [];
        for (var i = 0; i < this.selected.length; i++) {
          billingsIDs.push(this.selected[i].id);
        }
        this.exportWater(billingsIDs);
      }
    },
    // export with api
    exportWater(billingsIDs) {
      var config = {
        headers: {
          "x-api-key": "xxx-api-key",
          "x-refresh-token": "xxx-refresh-token",
        },
      };
      const billings_id = { billings_id: billingsIDs };
      return axios
        .post(apiUrl + "/v1/billings/water/exports", billings_id, config)
        .then((response) => {
          let data = response.data;
          if (data.status == "success") {
            this.exportExcelwater = false;
            this.statusAction = "Export สำเร็จ";
            this.colorSnackbar = "agree";
            this.snackbar = true;
          }
        })
        .catch((error) => {
          console.log(error);
          if (
            error.response.data.error_message ===
            "some record does not have calculated status"
          ) {
            this.statusAction = "Export ไม่สำเร็จ กรุณาเลือกข้อมูลใหม่";
            this.colorSnackbar = "warning";
            this.snackbar = true;
            this.differencePriceCalculate = false;
          } else {
            this.statusAction = "Export ไม่สำเร็จ กรุณาติดต่อผู้จัดทำ";
            this.colorSnackbar = "red";
            this.snackbar = true;
            this.differencePriceCalculate = false;
          }
        });
    },
    nameFilter(value) {
      // If this filter has no value we just skip the entire filter.
      if (!this.NamefilterValue) {
        return true;
      }
      // Check if the current loop value (The dessert name)
      // partially contains the searched word.
      return value.toLowerCase().includes(this.NamefilterValue.toLowerCase());
    },
    zoneFilter(value) {
      if (!this.zoneFilterValue) {
        return true;
      }
      return value === this.zoneFilterValue;
    },
    groupFilter(value) {
      if (!this.waterGroupfilterValue) {
        return true;
      }
      return value === this.waterGroupfilterValue;
    },
    buildingFilter(value) {
      if (!this.buildingFilterValue) {
        return true;
      }
      return value === this.buildingFilterValue;
    },
    stateFilter(value) {
      if (!this.stateFilterValue) {
        return true;
      }
      return value === this.stateFilterValue;
    },
    dateFilter(value) {
      if (!this.dateFilterValue) {
        return true;
      }
      return value == this.dateFilterValue;
    },
    editItem(item) {
      this.editedIndex = this.waterTables.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.waterTables[this.editedIndex], this.editedItem);
        this.snackbar = true;
        this.statusAction = "แก้ไขข้อมูลสำเร็จ";
        this.colorSnackbar = "agree";
      } else {
        this.waterTables.push(this.editedItem);
      }
      this.close();
    },
    clearFilter() {
      (this.NamefilterValue = ""),
        (this.waterGroupfilterValue = ""),
        (this.buildingFilterValue = ""),
        (this.stateFilterValue = ""),
        (this.dateFilterValue = "");
      this.zoneFilterValue = "";
      this.search = "";
    },
    filterOnlyCapsText(value, search) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value.toString().toLocaleUpperCase().indexOf(search) !== -1
      );
    },
    // number only in text field
    isNumber: function (evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
  },
};
</script>

<style scoped>
.title-table {
  font-size: 25px;
  padding: 10px;
  font-family: Sarabun;
}
.button-filter {
  margin: 10px;
  padding: 20px;
}
.filter {
  padding: 5px;
}
.card-filter {
  margin-bottom: 20px;
  margin-top: 20px;
}
.negative-value {
  color: red;
}

.v-data-table {
  font-size: 20px;
}
</style>
