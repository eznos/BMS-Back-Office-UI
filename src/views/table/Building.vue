<template>
  <v-app id="app">
    <!-- title  -->
    <div class="content background-main" v-if="role === 'admin'">
      <v-row justify="space-between" class="px-3">
        <!-- title -->
        <div class="mb-4">
          <v-row style="align-items: center">
            <div class="ml-3 mt-9">
              <h2>
                <v-icon size="40" color="gray"> mdi-home-circle </v-icon>
                จัดการหอพัก
              </h2>
            </div>
          </v-row>
        </div>
      </v-row>
    </div>
    <!-- filter -->
    <v-card class="card-filter px-6 py-6" v-if="role === 'admin'">
      <v-card-title>
        <v-icon size="35px" class="icon"
          >mdi-format-list-bulleted-triangle</v-icon
        >
        &nbsp;&nbsp;
        <h3>เครื่องมือค้นหา</h3>
        <v-chip color="agree" class="ma-2" @click="statusFilterValue = scales">
          ห้องว่าง
        </v-chip>
        <v-chip color="red" class="ma-2"> ห้องไม่ว่าง </v-chip>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header> แสดงเพิ่มเติม </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-form ref="formFilter">
              <!-- filter -->
              <v-row class="px-3">
                <!-- search -->
                <v-col cols="12" xs="12" sm="12" md="4" lg="4">
                  <v-text-field
                    v-model="search"
                    prepend-icon="mdi-magnify"
                    type="text"
                    label="ค้นหา"
                    clearable
                    class="filter"
                  ></v-text-field>
                </v-col>
                <!-- search -->
                <v-col cols="12" xs="12" sm="12" md="4" lg="4">
                  <v-autocomplete
                    item-text="name"
                    item-value="value"
                    v-model="waterGroupFilterValue"
                    prepend-icon="mdi-water-circle"
                    type="text"
                    label="ค้นหาด้วยสายมิเตอร์น้ำประปา"
                    clearable
                    class="filter"
                    :items="water_groups"
                  >
                  </v-autocomplete>
                </v-col>
                <!-- Filter for  zone-->
                <v-col cols="12" xs="12" sm="12" md="4" lg="4">
                  <v-autocomplete
                    v-model="zoneFilterValue"
                    prepend-icon="mdi-map-marker-radius"
                    type="text"
                    label="ค้นหาด้วยพื้นที่"
                    clearable
                    class="filter"
                    :items="zones"
                    item-text="zone"
                  >
                  </v-autocomplete>
                </v-col>
                <!-- search by building -->
                <v-col cols="12" xs="12" sm="12" md="4" lg="4">
                  <v-autocomplete
                    v-model="buildFilterValue"
                    prepend-icon="mdi-office-building-marker"
                    type="text"
                    label="ค้นหาด้วยอาคาร"
                    clearable
                    class="filter"
                    :disabled="!zoneFilterValue"
                    :items="buildings"
                    item-text="building"
                  >
                  </v-autocomplete>
                </v-col>
                <!-- search by type -->
                <v-col cols="12" xs="12" sm="12" md="4" lg="4">
                  <v-select
                    item-text="name"
                    item-value="value"
                    v-model="typeFilterValue"
                    prepend-icon="mdi-shape-outline"
                    label="ค้นหาด้วยประเภทห้อง"
                    :items="room_types"
                    clearable
                    class="filter"
                  >
                  </v-select>
                </v-col>
                <!-- search by status -->
                <v-col cols="12" xs="12" sm="12" md="4" lg="4">
                  <v-select
                    item-text="name"
                    item-value="value"
                    v-model="statusFilterValue"
                    prepend-icon="mdi-list-status"
                    label="ค้นหาด้วยสถานะ"
                    :items="room_statuses"
                    clearable
                    class="filter"
                  >
                  </v-select>
                </v-col>
                <v-row> </v-row>
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
            </v-form>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
    <!-- table and buttons -->
    <v-row v-if="role === 'admin'">
      <v-col cols="12">
        <v-card class="card-filter px-6 py-6">
          <v-card-title>
            <v-icon size="35px" class="icon">mdi-table-large</v-icon>
            &nbsp;&nbsp;
            <h3>ตารางสถานะห้องพัก</h3>
            &nbsp;&nbsp;
            <!-- delete as selected -->
            <v-btn
              color="error"
              class="button-filter pt-5 pb-5"
              :disabled="!selectItems"
              @click="getRoomsID()"
            >
              <v-icon>mdi-delete-sweep</v-icon>
              &nbsp; ลบข้อมูลที่เลือก
            </v-btn>
            <v-spacer></v-spacer>
            <div>
              <!-- add roomNo -->
              <v-dialog v-model="dialog" persistent max-width="75%">
                <template v-slot:activator="{ on: attrs }">
                  <v-btn
                    color="#046FE5"
                    dark
                    v-on="{ ...attrs }"
                    class="button-filter pt-5 pb-5"
                  >
                    <v-icon> mdi-account-plus </v-icon>
                    &nbsp; เพิ่มห้องพัก
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span>{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-form ref="formNewdata" v-model="valid" lazy-validation>
                        <v-row>
                          <!-- water group -->
                          <v-col cols="12" sm="6" md="4">
                            <v-select
                              item-text="name"
                              item-value="id"
                              v-model="editedItem.waterZone"
                              :items="water_groups"
                              label="สายของมิเตอร์น้ำ"
                              autofocus
                              clearable
                              required
                              :rules="rules.zonesBuildingsRoom"
                            >
                            </v-select>
                          </v-col>
                          <!-- zone -->
                          <v-col cols="12" sm="6" md="4">
                            <v-autocomplete
                              v-model="editedItem.zone"
                              :items="zones"
                              item-value="id"
                              item-text="zone"
                              label="พื้นที่"
                              clearable
                              required
                              :rules="rules.zonesBuildingsRoom"
                            >
                            </v-autocomplete>
                          </v-col>
                          <!-- building -->
                          <v-col cols="12" sm="6" md="4">
                            <v-autocomplete
                              v-model="editedItem.building"
                              :items="buildings"
                              item-text="building"
                              item-value="id"
                              label="อาคาร"
                              clearable
                              required
                              :rules="rules.zonesBuildingsRoom"
                            >
                            </v-autocomplete>
                          </v-col>
                          <!-- roomNo -->
                          <v-col cols="12" sm="6" md="4">
                            <v-autocomplete
                              v-model="editedItem.roomNo"
                              label="เลขห้องพัก"
                              :items="rooms"
                              item-text="room"
                              item-value="room"
                              clearable
                              required
                              :rules="rules.zonesBuildingsRoom"
                            >
                            </v-autocomplete>
                          </v-col>
                          <!-- electricityNo -->
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="editedItem.electricityNo"
                              label="เลขผู้ใช้ไฟฟ้า"
                              @keypress="isNumber($event)"
                              clearable
                              required
                              counter="12"
                              maxlength="12"
                              :rules="rules.electricNumber"
                            ></v-text-field>
                          </v-col>
                          <!-- waterNo -->
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="editedItem.waterNo"
                              label="เลขผู้ใช้น้ำ"
                              @keypress="isNumber($event)"
                              clearable
                              required
                              counter="4"
                              maxlength="4"
                              :rules="rules.waterNumber"
                            ></v-text-field>
                          </v-col>
                          <!-- electricityMeterNo -->
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="editedItem.electricityMeterNo"
                              label="เลขมิเตอร์น้ำไฟฟ้า"
                              @keypress="isNumber($event)"
                              clearable
                              required
                              counter="11"
                              maxlength="11"
                              :rules="rules.electricMeterNumber"
                            ></v-text-field>
                          </v-col>
                          <!-- water_meter_no -->
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="editedItem.waterMeterNo"
                              label="เลขมิเตอร์น้ำประปา"
                              @keypress="isNumber($event)"
                              clearable
                              required
                              counter="4"
                              maxlength="4"
                              :rules="rules.waterNumber"
                            ></v-text-field>
                          </v-col>
                          <!-- type -->
                          <v-col cols="12" sm="6" md="4">
                            <v-select
                              v-model="editedItem.roomType"
                              :items="room_types"
                              label="ประเภทห้องพัก"
                              clearable
                              required
                              :rules="rules.zonesBuildingsRoom"
                              item-text="name"
                              item-value="value"
                            >
                            </v-select>
                          </v-col>
                          <!-- status -->
                          <v-col cols="12" sm="6" md="4">
                            <v-select
                              item-text="name"
                              item-value="value"
                              v-model="editedItem.status"
                              :items="room_statuses"
                              label="สถานะห้องพัก"
                              clearable
                              required
                              :rules="rules.zonesBuildingsRoom"
                            >
                            </v-select>
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-form ref="form" v-model="valid" lazy-validation>
                      <v-btn large color="warning" text @click="close">
                        ยกเลิก
                      </v-btn>
                      <v-btn
                        large
                        color="agree"
                        :disabled="!valid"
                        text
                        @click="validateForm"
                      >
                        ยืนยัน
                      </v-btn>
                    </v-form>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <!-- delete water user -->
              <v-dialog v-model="dialogDelete" persistent max-width="75%">
                <v-card>
                  <v-card-title class="text-h5"
                    >ต้องการลบผู้อยู่อาศัยคนนี้หรือไม่?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="warning" text @click="closeDelete"
                      >ยกเลิก</v-btn
                    >
                    <v-btn color="agree" text @click="deleteItemConfirm"
                      >ยืนยัน</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <!-- export excel to email -->
              <v-dialog
                v-model="exportExcelBuliding"
                persistent
                max-width="75%"
              >
                <template v-slot:activator="{ on: attrs }">
                  <v-btn
                    color="agree"
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
                    <v-btn
                      color="warning"
                      text
                      @click="exportExcelBuliding = false"
                    >
                      ยกเลิก
                    </v-btn>
                    <v-btn color="agree" text @click="getRoomsID()">
                      ยืนยันข้อมูล
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
              :items="buildingTable"
              item-key="id"
              :items-per-page="itemsPerPage"
              class="table header-blue"
              :search="search"
              :loading="loadTable"
              loading-text="กำลังโหลด... โปรดรอสักครู่"
              show-select
              @input="enterSelect($event)"
            >
              <!-- color status on datatable  -->
              <template v-slot:[`item.status`]="{ item }">
                <v-chip :color="getColor(item.status)" dark>
                  <td v-if="item.status == 'empty'">{{ "ว่าง" }}</td>
                  <td v-if="item.status == 'not_empty'">
                    {{ "ไม่ว่าง" }}
                  </td>
                </v-chip>
              </template>
              <template v-slot:[`item.roomType`]="{ item }">
                <td v-if="item.roomType == 'single'">{{ "ห้องโสด" }}</td>
                <td v-if="item.roomType == 'family_1'">
                  {{ "ห้องครอบครัว 1" }}
                </td>
                <td v-if="item.roomType == 'family_2'">
                  {{ "ห้องครอบครัว 2" }}
                </td>
              </template>
              <!-- data edit and delete-->
              <template v-slot:[`item.actions`]="{ item }">
                <v-icon @click="editItem(item)"> mdi-pencil </v-icon>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
        <v-snackbar
          v-model="snackbar"
          :timeout="timeout"
          :color="colorSnackbar"
        >
          <div class="text-center">
            {{ statusAction }}
          </div>
        </v-snackbar>
      </v-col>
    </v-row>
    <v-container v-if="role == 'user'">
      <NotFound />
    </v-container>
  </v-app>
</template>

<script>
import room_statuses from "../../json/roomStatuses.json";
import water_groups from "../../json/waterGroups.json";
import room_types from "../../json/roomTypes.json";
import axios from "axios";
import { apiUrl } from "../../utils/url";
import NotFound from "../../components/notFound/Notfound.vue";
import zones from "../../json/zones.json";
import buildings from "../../json/buildings.json";
import rooms from "../../json/rooms.json";
export default {
  components: { NotFound },
  data: () => ({
    token: "",
    buildingID: "",
    roomID: "",
    role: "",
    el: "#app",
    zone: zones,
    building: buildings,
    roomNo: rooms,
    valid: true,
    modal: false,
    snackbar: false,
    statusAction: "",
    colorSnackbar: "",
    timeout: 2000,
    loadTable: true,
    dialog: false,
    menu: false,
    selected: [],
    itemsPerPage: 5,
    selectItems: false,
    first_name: "",
    on: {},
    attrs: {},
    zonevalues: "",
    emailtarget: "",
    exportExcelBuliding: false,
    dateExport: new Date().toISOString().substr(0, 7),
    menuExportExcel: false,
    electricityNo: "",
    waterNo: "",
    electricityMeterNo: "",
    water_meter_no: "",
    roomType: "",
    status: "",
    water_groups: water_groups,
    room_types: room_types,
    room_statuses: room_statuses,
    search: "",
    dialogDelete: false,
    // Filter models.
    waterGroupFilterValue: "",
    zoneFilterValue: "",
    statusFilterValue: "",
    typeFilterValue: "",
    buildFilterValue: null,
    roomFilterValue: null,
    buildingTable: [],
    editedIndex: -1,
    editedItem: {
      waterZone: "",
      zone: "",
      building: "",
      roomNo: "",
      electricityNo: "",
      electricityMeterNo: "",
      waterNo: "",
      waterMeterNo: "",
      roomType: "",
      status: "",
    },
    defaultItem: {
      waterZone: "",
      zone: "",
      building: "",
      roomNo: "",
      electricityNo: "",
      electricityMeterNo: "",
      waterNo: "",
      waterMeterNo: "",
      roomType: "",
      status: "",
    },
    rules: {
      nameRules: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length >= 2) || "กรอกชื่อให้มากกว่า 2 ตัวอักษร",
      ],
      zonesBuildingsRoom: [(v) => !!v || "กรุณากรอกข้อมูล"],
      waterNumber: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length == 4) || "กรอกชื่อให้มากกว่า 4 ตัวอักษร",
      ],
      electricNumber: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length == 12) || "กรอกเลขผู้ใช้ไฟฟ้าไม่ครบ 12 ตัว",
      ],
      electricMeterNumber: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length == 11) || "กรอกเลขมิเตอร์ไฟฟ้าไม่ครบ 11 ตัว",
      ],
      email: {
        required: (v) => !!v || "กรุณาใส่อีเมลของผู้รับ",
        regex: (v) =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "อีเมลไม่ถูกต้อง",
      },
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "เพิ่มห้องพัก" : "แก้ไขห้องพัก";
    },
    headers() {
      return [
        {
          text: "สายมิเตอร์น้ำ",
          value: "waterZone.name",
          filter: this.waterGroupFilter,
        },
        {
          text: "พื้นที่",
          value: "zone.name",
          filter: this.zoneFilter,
        },
        {
          text: "อาคาร",
          value: "building.name",
          filter: this.buildingFilter,
        },
        {
          text: "เลขห้องพัก",
          value: "roomNo",
        },
        {
          text: "เลขผู้ใช้น้ำ",
          value: "waterNo",
        },
        {
          text: "เลขมิเตอร์น้ำประปา",
          value: "waterMeterNo",
        },
        {
          text: "เลขผู้ใช้ไฟฟ้า",
          value: "electricityNo",
        },
        {
          text: "เลขมิเตอร์ไฟฟ้า",
          value: "electricityMeterNo",
        },
        {
          text: "ประเภทห้องพัก",
          value: "roomType",
          filter: this.typeFilter,
        },
        {
          text: "สถานะ",
          value: "status",
          filter: this.statusFilter,
        },
        {
          text: "การจัดการ",
          value: "actions",
          align: "center",
          sortable: false,
        },
      ];
    },
    zones() {
      const zone = zones;
      return zone;
    },
    buildings() {
      const building = buildings;
      return building;
    },
    rooms() {
      const room = rooms;
      return room;
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  created() {
    this.getRole();
    this.gettoken();
  },
  mounted() {
    this.getBuildingData();
  },
  methods: {
    // get refreshToken
    gettoken() {
      var token = sessionStorage.getItem("refreshToken");
      this.token = token;
    },
    // get role user
    getRole() {
      var role = localStorage.getItem("role");
      this.role = role;
    },
    // get building
    getBuildingData() {
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
        },
      };
      return axios
        .get(apiUrl + "/v1/building/buildings", config)
        .then((response) => {
          let data = response.data;
          console.log(data);
          if (data.status == "success") {
            this.buildingTable = data.result;
            this.loadTable = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getRoomsID() {
      if (this.selectItems == true) {
        let roomsIDs = [];
        for (var i = 0; i < this.selected.length; i++) {
          roomsIDs.push(this.selected[i].id);
        }
        if (this.exportExcelBuliding == true) {
          this.exportBuliding(roomsIDs);
        }
        if (this.exportExcelBuliding == false) {
          this.deleteItemSelected(roomsIDs);
        }
      }
    },
    // export with api
    exportBuliding(roomsIDs) {
      var config = {
        headers: {
          "x-api-key": "xxx-api-key",
          "x-refresh-token": "xxx-refresh-token",
        },
      };
      const rooms_id = { rooms_id: roomsIDs };
      return axios
        .post(apiUrl + "/v1/billings/electric/exports", rooms_id, config)
        .then((response) => {
          let data = response.data;
          console.log(this.selected)
          if (data.status == "success") {
            this.exportExcelBuliding = false;
            this.statusAction =
              "Export ข้อมูลห้องพักจำนวน " +
              this.selected.length +
              " ห้อง สำเร็จ";
            this.colorSnackbar = "agree";
            this.snackbar = true;
            this.selected = [];
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
            this.exportExcelBuliding = false;
          } else {
            this.statusAction = "Export ไม่สำเร็จ กรุณาติดต่อผู้จัดทำ";
            this.colorSnackbar = "red";
            this.snackbar = true;
            this.exportExcelBuliding = false;
          }
        });
    },
    // delete buildibg
    deleteRoom(roomsIDs) {
      var data = {
        id: roomsIDs,
      };
      var config = {
        method: "delete",
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
          "Content-Type": "application/json",
        },
        data: data,
      };
      return axios
        .delete(apiUrl + "/v1/building/buildings/delete", config)
        .then(() => {
          if (confirm) {
            console.log(this.selected)
            this.statusAction =
              "ลบข้อมูลผู้อยู่อาศัยจำนวน " + this.selected.length + "คน สำเร็จ";
            this.colorSnackbar = "agree";
            this.snackbar = true;
            this.selected = [];
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data.error_message === "bad_request") {
            this.statusAction = "ลบข้อมูลไม่สำเร็จ กรุณาเลือกข้อมูลใหม่";
            this.colorSnackbar = "warning";
            this.snackbar = true;
          } else {
            this.statusAction = "ลบข้อมูลไม่สำเร็จ กรุณาติดต่อผู้จัดทำ";
            this.colorSnackbar = "red";
            this.snackbar = true;
          }
        });
    },
    // create building room
    createBuilding(
      waterZone,
      zone,
      building,
      roomNo,
      electricityNo,
      electricityMeterNo,
      waterNo,
      waterMeterNo,
      roomType,
      status
    ) {
      let payload = {
        waterZoneId: waterZone,
        zoneId: zone,
        buildingId: building,
        roomNo: roomNo,
        electricityNo: electricityNo,
        electricityMeterNo: electricityMeterNo,
        waterNo: waterNo,
        waterMeterNo: waterMeterNo,
        roomType: roomType,
        status: status,
      };
      let headerAPI = {
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
        },
        payload: payload,
      };
      axios
        .post(apiUrl + "/v1/building/buildings/add", payload, headerAPI)
        .then(() => {})
        .catch((error) => {
          console.log(error);
          if (error.response.data.error_message === "invalid API Key") {
            this.snackbar = true;
            this.statusAction = "เพิ่มข้อมูลผิดพลาด กรูณาติดต่อผู้จัดทำ";
            this.colorSnackbar = "wanning";
          } else {
            this.snackbar = true;
            this.statusAction = "เพิ่มข้อมูลผิดพลาด กรูณาติดต่อผู้จัดทำ";
            this.colorSnackbar = "red";
          }
        });
    },
    editBuilding() {
      let building_ID = this.buildingID;
      let payload = {
        waterZoneId: this.editedItem.waterZone.id,
        zoneId: this.editedItem.zone.id,
        buildingId: this.editedItem.building.id,
        roomNo: this.editedItem.roomNo,
        electricityNo: this.editedItem.electricityNo,
        electricityMeterNo: this.editedItem.electricityMeterNo,
        waterNo: this.editedItem.waterNo,
        waterMeterNo: this.editedItem.waterMeterNo,
        roomType: this.editedItem.roomType,
        status: this.editedItem.status,
      };
      let config = {
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
        },
        payload: payload,
      };
      return axios
        .patch(
          apiUrl + "/v1/building/buildings/edit/" + building_ID,
          payload,
          config
        )
        .then(async () => {})
        .catch((error) => {
          console.log(error);
          if (error.response.data.status === "unauthorized") {
            this.statusAction = "แก้ไขข้อมูล ไม่สำเร็จ กรุณาติดต่อผู้จัดทำ";
            this.colorSnackbar = "warning";
            this.snackbar = true;
            this.differencePriceCalculate = false;
            console.log(payload);
          } else {
            this.statusAction = "แก้ไขข้อมูล ไม่สำเร็จ กรุณาติดต่อผู้จัดทำ";
            this.colorSnackbar = "red";
            this.snackbar = true;
            this.differencePriceCalculate = false;
            console.log(payload);
          }
        });
    },
    nameFilter(value) {
      // If this filter has no value we just skip the entire filter.
      if (!this.NamefilterValue) {
        return true;
      }
      // Check if the current loop value (The dessert first_name)
      // partially contains the searched word.
      return value.toLowerCase().includes(this.NamefilterValue.toLowerCase());
    },
    waterGroupFilter(value) {
      if (!this.waterGroupFilterValue) {
        return true;
      }
      return value === this.waterGroupFilterValue;
    },
    zoneFilter(value) {
      if (!this.zoneFilterValue) {
        return true;
      }
      return value === this.zoneFilterValue;
    },
    buildingFilter(value) {
      if (!this.buildFilterValue) {
        return true;
      }
      return value === this.buildFilterValue;
    },
    roomFilter(value) {
      if (!this.roomFilterValue) {
        return true;
      }
      return value === this.roomFilterValue;
    },
    statusFilter(value) {
      if (!this.statusFilterValue) {
        return true;
      }
      return value === this.statusFilterValue;
    },
    typeFilter(value) {
      if (!this.typeFilterValue) {
        return true;
      }
      return value === this.typeFilterValue;
    },
    editItem(item) {
      this.editedIndex = this.buildingTable.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      this.buildingID = item.id;
    },
    deleteItem(item) {
      this.editedIndex = this.buildingTable.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.buildingTable.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    async validateForm() {
      if (this.$refs.formNewdata.validate()) {
        this.save();
      }
    },
    // create room or update room
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.buildingTable[this.editedIndex], this.editedItem);
        this.editBuilding(
          this.editedItem.waterZone.id,
          this.editedItem.zone.id,
          this.editedItem.building.id,
          this.editedItem.roomNo,
          this.editedItem.electricityNo,
          this.editedItem.electricityMeterNo,
          this.editedItem.waterNo,
          this.editedItem.waterMeterNo,
          this.editedItem.roomType,
          this.editedItem.status
        );
        this.snackbar = true;
        this.statusAction = "แก้ไขข้อมูลสำเร็จ";
        this.colorSnackbar = "agree";
      } else {
        this.buildingTable.push(this.editedItem);
        this.createBuilding(
          this.editedItem.waterZone,
          this.editedItem.zone,
          this.editedItem.building,
          this.editedItem.roomNo,
          this.editedItem.electricityNo,
          this.editedItem.electricityMeterNo,
          this.editedItem.waterNo,
          this.editedItem.waterMeterNo,
          this.editedItem.roomType,
          this.editedItem.status
        );
        this.snackbar = true;
        this.statusAction = "เพิ่มข้อมูลสำเร็จ";
        this.colorSnackbar = "agree";
      }

      this.close();
    },
    // clear input filter
    clear() {
      (this.NamefilterValue = null),
        (this.zoneFilterValue = null),
        (this.statusFilterValue = null),
        (this.buildFilterValue = null),
        (this.search = null);
    },
    filterOnlyCapsText(value, search) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value.toString().toLocaleUpperCase().indexOf(search) !== -1
      );
    },
    // clearFilter
    clearFilter() {
      this.$refs.formFilter.reset();
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
    // clear form add user
    clearForm() {
      this.$refs.formNewdata.reset();
    },
    // color of status
    getColor(status) {
      if (status == "not_empty") return "red";
      if (status == "empty") return "agree";
      else return "#ffffff";
    },
    // Check selectItems column
    enterSelect() {
      if (this.selected.length >= 1) {
        return (this.selectItems = true);
      } else {
        return (this.selectItems = false);
      }
    },
    // delete as selected
    deleteItemSelected(roomsIDs) {
      if (confirm("ต้องการลบข้อมูลที่เลือกหรือไม่ ?")) {
        for (var i = 0; i < this.selected.length; i++) {
          const index = this.buildingTable.indexOf(this.selected[i]);
          this.buildingTable.splice(index, 1);
        }
        this.buildingTable.indexOf(this.selected[0]);
        this.selectItems = false;
        this.roomID = this.selected.id;
        this.deleteRoom(roomsIDs);
      }
    },
  },
};
</script>

<style scoped>
.title-table {
  font-size: 25px;
  padding: 20px;
  font-family: Sarabun;
}
.button-filter {
  margin: 10px;
  padding: 20px;
}
.card-filter {
  margin-bottom: 20px;
  margin-top: 20px;
}
.title {
  font-size: 25px;
  font-family: Sarabun;
}

.form-table {
  margin-top: -20px;
  padding: -20px;
}

.header-table {
  padding: 15px;
  margin-top: 15px;
}

.chart-responsive {
  width: 100%;
  margin: 20px auto;
}
.mx-auto {
  font-size: 30px;
}
.header-blue .v-data-table-header {
  background-color: #466bb2 !important;
}
.filter {
  padding: 5px;
}
</style>
