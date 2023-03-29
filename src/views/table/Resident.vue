<template>
  <v-app id="app">
    <!-- title and filter -->
    <div class="content background-main" v-if="role == 'admin'">
      <v-row justify="space-between" class="px-3">
        <!-- title -->
        <div class="mb-4">
          <v-row style="align-items: center">
            <div class="ml-3 mt-9">
              <h2>
                <v-icon size="40" color="green"> mdi-account </v-icon>
                จัดการผู้อยู่อาศัย
              </h2>
            </div>
          </v-row>
        </div>
      </v-row>
    </div>
    <!-- data-table and button -->
    <v-card class="card-filter px-6 py-6" v-if="role == 'admin'">
      <v-card-title>
        <v-icon size="35px" class="icon">mdi-table-large</v-icon>
        &nbsp;&nbsp;
        <h3>ตารางผู้อยู่อาศัย</h3>
        &nbsp;&nbsp;
        <!-- delete as selected -->
        <v-btn
          color="error"
          width="140"
          v-bind="attrs"
          v-on="on"
          class="button-filter pt-5 pb-5"
          :disabled="!selectItems"
          @click="getResidentsID()"
        >
          <v-icon>mdi-delete-sweep</v-icon>
          &nbsp; ลบข้อมูลที่เลือก
        </v-btn>
        <!-- button -->
        <v-spacer></v-spacer>
        <div>
          <!-- add user -->
          <v-dialog v-model="dialog" persistent max-width="75%">
            <template v-slot:activator="{ on: attrs }">
              <v-btn
                color="#046FE5"
                class="button-filter pt-5 pb-5"
                dark
                v-on="{ ...attrs }"
              >
                <v-icon> mdi-account-plus </v-icon>
                &nbsp; เพิ่มผู้อยู่อาศัย
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span>{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-form ref="formAdduser" v-model="valid" lazy-validation>
                    <v-row>
                      <!-- rank -->
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          v-model="editedItem.rank"
                          label="ยศ"
                          autofocus
                          required
                          :rules="rules.nameRules"
                          clearable
                          :items="ranks"
                          item-text="name"
                          item-value="value"
                        >
                        </v-autocomplete>
                      </v-col>
                      <!-- firstname -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.firstName"
                          label="ชื่อ"
                          required
                          :rules="rules.nameRules"
                          clearable
                        ></v-text-field>
                      </v-col>
                      <!-- lastname -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.lastName"
                          label="นามสกุล"
                          required
                          :rules="rules.nameRules"
                          clearable
                        ></v-text-field>
                      </v-col>
                      <!-- watergroup -->
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          v-model="editedItem.water_zone"
                          required
                          :items="waterZonesData"
                          label="สายของมิเตอร์น้ำ"
                          :rules="rules.zonesBuildingsRoom"
                          clearable
                          item-text="name"
                          item-value="id"
                        >
                        </v-autocomplete>
                      </v-col>
                      <!-- zone -->
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          v-model="editedItem.zone"
                          label="พื้นที่"
                          required
                          :items="zonesData"
                          :rules="rules.zonesBuildingsRoom"
                          clearable
                          item-value="id"
                          item-text="name"
                        >
                        </v-autocomplete>
                      </v-col>
                      <!-- building -->
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          v-model="editedItem.building"
                          label="อาคาร"
                          required
                          :items="buildinsData"
                          item-text="name"
                          item-value="id"
                          :rules="rules.zonesBuildingsRoom"
                          clearable
                        >
                        </v-autocomplete>
                      </v-col>
                      <!-- roomNo -->
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          v-model="editedItem.roomNo"
                          label="เลขห้องพัก"
                          required
                          @keypress="isNumber($event)"
                          :items="roomsData"
                          :rules="rules.zonesBuildingsRoom"
                          item-text="roomNo"
                          item-value="roomNo"
                          clearable
                        >
                        </v-autocomplete>
                      </v-col>
                      <!-- electric_no -->
                      <!-- <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.electricity_no"
                          label="เลขผู้ใช้ไฟฟ้า"
                          @keypress="isNumber($event)"
                          clearable
                          required
                          counter="12"
                          maxlength="12"
                        ></v-text-field>
                      </v-col> -->
                      <!-- electric_meter_no -->
                      <!-- <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.electricity_meter_no"
                          label="เลขมิเตอร์ไฟฟ้า"
                          @keypress="isNumber($event)"
                          clearable
                          required
                          counter="11"
                          maxlength="11"
                        ></v-text-field>
                      </v-col> -->
                      <!-- water_no -->
                      <!-- <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.water_no"
                          label="เลขผู้ใช้น้ำประปา"
                          @keypress="isNumber($event)"
                          clearable
                          required
                          counter="4"
                          maxlength="4"
                        ></v-text-field>
                      </v-col> -->
                      <!-- water_meter_no -->
                      <!-- <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.water_meter_no"
                          label="เลขมิเตอร์น้ำประปา"
                          @keypress="isNumber($event)"
                          clearable
                          required
                          counter="4"
                          maxlength="4"
                        ></v-text-field>
                      </v-col> -->
                      <!-- room_type -->
                      <!-- <v-col cols="12" sm="6" md="4">
                        <v-select
                          v-model="editedItem.room_type"
                          :items="room_types"
                          label="ประเภทห้อง"
                          clearable
                          required
                          :rules="rules.zonesBuildingsRoom"
                          item-text="name"
                          item-value="value"
                        >
                        </v-select>
                      </v-col> -->
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-btn color="warning" text @click="close"> ยกเลิก </v-btn>
                  <v-btn color="agree" :disabled="!valid" text @click="save()">
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
                >ต้องการลบผู้ใช้ไฟฟ้าคนนี้หรือไม่?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="warning" text @click="closeDelete">ยกเลิก</v-btn>
                <v-btn color="agree" text @click="deleteItemConfirm"
                  >ยืนยัน</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- export excel to email -->
          <v-dialog v-model="exportExcelResident" persistent max-width="75%">
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
                  @click="exportExcelResident = false"
                >
                  ยกเลิก
                </v-btn>
                <v-btn color="agree" text @click="getResidentsID()">
                  ยืนยันข้อมูล
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-card-title>
      <v-card-text>
        <!-- filter -->
        <v-row justify="space-between" class="px-3">
          <!-- Filter for  name-->
          <v-col cols="12" xs="12" sm="12" md="4" lg="4">
            <v-text-field
              v-model="search"
              prepend-icon="mdi-magnify"
              type="text"
              label="ค้นหาด้วย"
              class="filter"
              clearable
            ></v-text-field>
          </v-col>
          <!-- filter for zone -->
          <v-col cols="12" xs="12" sm="12" md="4" lg="4">
            <v-autocomplete
              class="filter"
              prepend-icon="mdi-map-marker"
              v-model="zoneFilterValue"
              :items="zones"
              label="ค้นหาด้วยพื้นที่"
              clearable
            >
            </v-autocomplete>
          </v-col>
          <!-- filter for building -->
          <v-col cols="12" xs="12" sm="12" md="4" lg="4">
            <v-autocomplete
              :disabled="!zoneFilterValue"
              class="filter"
              prepend-icon="mdi-office-building"
              v-model="buildingFilterValue"
              :items="buildings"
              label="ค้นหาด้วยอาคาร"
              clearable
            >
            </v-autocomplete>
          </v-col>
        </v-row>
      </v-card-text>
      <!-- table -->
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="residentTable"
        item-key="firstName"
        :items-per-page="itemsPerPage"
        class="elevation-1 pa-6"
        :search="search"
        :loading="loadTable"
        loading-text="กำลังโหลด... โปรดรอสักครู่"
        show-select
        @input="enterSelect($event)"
      >
        <!-- room_type -->
        <template v-slot:[`item.accommodations[0].room.roomType`]="{ item }">
          <td v-if="item.accommodations[0].room.roomType == 'single'">
            {{ "ห้องโสด" }}
          </td>
          <td v-if="item.accommodations[0].room.roomType == 'family_1'">
            {{ "ห้องครอบครัว 1" }}
          </td>
          <td v-if="item.accommodations[0].room.roomType == 'family_2'">
            {{ "ห้องครอบครัว 2" }}
          </td>
        </template>
        <!-- edit -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon @click="editItem(item)"> mdi-pencil </v-icon>
          <!-- <v-icon @click="deleteItem(item)"> mdi-delete </v-icon> -->
        </template>
      </v-data-table>
      <!-- end data-table -->
      <v-snackbar v-model="snackbar" :timeout="timeout" :color="colorSnackbar">
        <div class="text-center">
          {{ statusAction }}
        </div>
      </v-snackbar>
    </v-card>
    <v-container v-if="role == 'user'">
      <NotFound />
    </v-container>
  </v-app>
</template>

<script>
import { apiUrl } from "../../utils/url";
import axios from "axios";
import ranks from "../../json/rank.json";
import water_groups from "../../json/waterGroups.json";
import room_types from "../../json/roomTypes.json";
import zonesBuildingsRoom from "../../json/zonesBuildings.json";

import NotFound from "../../components/notFound/Notfound.vue";
import FileDownload from "js-file-download";
export default {
  components: { NotFound },
  data: () => ({
    zonesDatas: "",
    waterZonesDatas: "",
    buildingDatas: "",
    roomDatas: "",
    zonesData: [],
    waterZonesData: [],
    buildinsData: [],
    roomsData: [],
    token: "",
    role: "",
    zonesBuildingsRoom: zonesBuildingsRoom,
    el: "#app",
    loadTable: true,
    snackbar: false,
    statusAction: "",
    colorSnackbar: "",
    timeout: 2000,
    valid: true,
    modal: false,
    dialog: false,
    importExcel: false,
    attrs: {},
    on: {},
    selected: [],
    itemsPerPage: 5,
    selectItems: false,
    menu: false,
    room_type: "",
    search: "",
    dialogDelete: false,
    exportExcelResident: false,
    meterGroup: "",
    resident_id: "",
    meterGroups: water_groups,
    room_types: room_types,
    // Filter models.
    NamefilterValue: "",
    zoneFilterValue: "",
    buildingFilterValue: "",
    roomFilterValue: "",
    rank: "",
    ranks: ranks,
    date: "",
    residentTable: [],
    editedIndex: -1,
    editedItem: {
      firstName: "",
      roomNo: "",
      electric_no: "",
      water_meter_no: "",
      room_type: "",
    },
    defaultItem: {
      firstName: "",
      roomNo: "",
      electric_no: "",
      water_meter_no: "",
      room_type: "",
    },
    rules: {
      format: [
        (value) => !value || value.size < 20000000 || "ขนาดไฟล์ไม่เกิน 20 MB",
      ],
      nameRules: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length >= 2) || "กรอกชื่อให้มากกว่า 2 ตัวอักษร",
      ],
      zonesBuildingsRoom: [(v) => !!v || "กรุณากรอกข้อมูล"],
      waterNumber: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length == 4) || "กรอกข้อมูลให้ครบ 4 ตัวอักษร",
      ],
      electricNumber: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length == 12) || "กรอกเลขผู้ใช้ไฟฟ้าไม่ครบ 12 ตัว",
      ],
      electricMeterNumber: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length == 11) || "กรอกเลขมิเตอร์ไฟฟ้าไม่ครบ 11 ตัว",
      ],
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "เพิ่มผู้อยู่อาศัย"
        : "แก้ไขผู้อยู่อาศัย";
    },
    headers() {
      return [
        {
          text: "ยศ",
          align: "left",
          value: "rank",
          filterable: false,
        },
        {
          text: "ชื่อ",
          value: "firstName",
        },
        {
          text: "นามสกุล",
          value: "lastName",
        },
        {
          text: "พื้นที่",
          value: "accommodations[0].room.zone.name",
          filter: this.zoneFilter,
        },
        {
          text: "อาคาร",
          value: "accommodations[0].room.building.name",
          filter: this.buildingFilter,
        },
        {
          text: "เลขห้องพัก",
          value: "accommodations[0].room.roomNo",
        },
        {
          text: "สายมิเตอร์น้ำ",
          value: "accommodations[0].room.waterZone.name",
        },
        {
          text: "เลขผู้ใช้น้ำ",
          value: "accommodations[0].room.waterNo",
        },
        {
          text: "เลขมิเตอร์น้ำประปา",
          value: "accommodations[0].room.waterMeterNo",
        },
        // {
        //   text: "เลขผู้ใช้ไฟฟ้า",
        //   value: "accommodations[0].room.electricityNo",
        // },
        // {
        //   text: "เลขมิเตอร์ไฟฟ้า",
        //   value: "accommodations[0].room.electricityMeterNo",
        // },
        {
          text: "ประเภทห้อง",
          value: "accommodations[0].room.roomType",
        },
        {
          text: "การจัดการ",
          value: "actions",
          sortable: false,
        },
      ];
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
    this.getResidentData();
    this.getZonesdata();
    this.getWaterZonesdata();
    this.getBuildingsdatas();
    this.getRoomsdatas();
  },
  methods: {
    // data for select
    // get zone data for select
    getZonesdata() {
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
        },
      };
      return axios
        .get(apiUrl + "/v1/building/data/zones", config)
        .then((response) => {
          let data = response.data;
          const dataZones = data.result;
          this.zonesData = dataZones;
          return this.zonesData;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // water zone data for select
    getWaterZonesdata() {
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
        },
      };
      return axios
        .get(apiUrl + "/v1/building/data/waterzone", config)
        .then((response) => {
          let data = response.data;
          const dataWaterZones = data.result;
          this.waterZonesData = dataWaterZones;
          return this.waterZonesData;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // buildings data for select
    getBuildingsdatas() {
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
        },
      };
      return axios
        .get(apiUrl + "/v1/building/data/building", config)
        .then((response) => {
          let data = response.data;
          const dataBuilding = data.result;
          this.buildinsData = dataBuilding;
          return this.buildinsData;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // rooms data for select
    getRoomsdatas() {
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
        },
      };
      return axios
        .get(apiUrl + "/v1/building/data/room", config)
        .then((response) => {
          let data = response.data;
          const dataRoom = data.result;
          this.roomsData = dataRoom;
          return this.roomsData;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // end of data for select
    gettoken() {
      var token = sessionStorage.getItem("refreshToken");
      this.token = token;
    },
    getRole() {
      var role = localStorage.getItem("role");
      this.role = role;
    },
    // get data from mockup api
    getResidentData() {
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
        },
      };
      return axios
        .get(apiUrl + "/v1/resident/residentslist", config)
        .then((response) => {
          let data = response.data;
          if (data.status == "success") {
            this.residentTable = data.result;
            this.loadTable = false;
            console.log(data.result);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // get resident id
    getResidentsID() {
      if (this.selectItems == true) {
        let residentsIDs = [];
        for (var i = 0; i < this.selected.length; i++) {
          residentsIDs.push(this.selected[i].id);
        }
        if (this.exportExcelResident == true) {
          console.log(residentsIDs);
          this.exportResident(residentsIDs);
        }
        if (this.exportExcelResident == false) {
          this.deleteItemSelected(residentsIDs);
        }
      }
    },
    // add residet
    addResident(rank, firstName, lastName, water_zone, zone, building, roomNo) {
      let payload = {
        rank: rank,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        waterZoneId: water_zone,
        zoneId: zone,
        buildingId: building,
        roomNo: roomNo,
      };
      let headerAPI = {
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
        },
        payload: payload,
      };
      axios
        .post(apiUrl + "/v1/resident/add", payload, headerAPI)
        .then(async () => {
          this.getResidentData();
          this.statusAction = "เพิ่มข้อมูลผู้อยู่อาศัยสำเร็จ";
          this.colorSnackbar = "agree";
          this.snackbar = true;
        })
        .catch((error) => {
          console.log(error);
          if (
            error.response.data.error_message === "invalid username or password"
          ) {
            this.loginFail = "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง";
            this.isLogin = false;
            console.log(error.response.data.error_message);
          } else {
            this.loginFail = "มีบางอย่างผิดพลาด กรุณาติดต่อ ผู้จัดทำ";
            this.isLogin = false;
            console.log(error.response.data.error_message);
          }
        });
    },
    // edit resident
    editResidentData(
      rank,
      firstName,
      lastName,
      water_zone,
      zone,
      building,
      roomNo
    ) {
      let resident_id = "?id=" + this.resident_id;
      const payload = {
        rank: rank,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        waterZoneId: water_zone,
        zoneId: zone,
        buildingId: building,
        roomNo: roomNo,
      };
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
        },
      };
      return axios
        .patch(apiUrl + "/v1/resident/edit" + resident_id, payload, config)
        .then(async () => {
          this.getResidentData();
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data.status === "unauthorized") {
            this.getResidentData();
            this.statusAction = "แก้ไขข้อมูล ไม่สำเร็จ กรุณาติดต่อผู้จัดทำ";
            this.colorSnackbar = "warning";
            this.snackbar = true;
            this.differencePriceCalculate = false;
          } else {
            this.statusAction = "แก้ไขข้อมูล ไม่สำเร็จ กรุณาติดต่อผู้จัดทำ";
            this.colorSnackbar = "red";
            this.snackbar = true;
            this.differencePriceCalculate = false;
          }
        });
    },
    // export with api
    exportResident(residentsIDs) {
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
        },
        responseType: "blob",
      };
      const id = { id: residentsIDs };
      return axios
        .post(apiUrl + "/v1/resident/export", id, config)
        .then((response) => {
          FileDownload(response.data, "ข้อมูลผู้อยู่อาศัย.xlsx");
          this.exportExcelResident = false;
          this.statusAction =
            "Export ข้อมูลผู้อยู่อาศัยจำนวน " +
            this.selected.length +
            "คน สำเร็จ";
          this.colorSnackbar = "agree";
          this.snackbar = true;
          this.selected = [];
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
            this.exportExcelResident = false;
          } else {
            this.statusAction = "Export ไม่สำเร็จ กรุณาติดต่อผู้จัดทำ";
            this.colorSnackbar = "red";
            this.snackbar = true;
            this.exportExcelResident = false;
          }
        });
    },
    // delete with api
    deleteResident(residentsIDs) {
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
          "x-refresh-token": this.token,
        },
      };
      const resident_id = { residents_id: residentsIDs };
      const residents_id = "?id=" + resident_id;
      return axios
        .delete(apiUrl + "/v1/delete/resident/" + residents_id, config)
        .then((response) => {
          let data = response.data;
          if (data.status == "success") {
            this.exportExcelResident = false;
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
            this.exportExcelResident = false;
          }
        });
    },
    //  zone filter
    zoneFilter(value) {
      if (!this.zoneFilterValue) {
        return true;
      }
      return value === this.zoneFilterValue;
    },
    // buildingFilter
    buildingFilter(value) {
      if (!this.buildingFilterValue) {
        return true;
      }
      return value === this.buildingFilterValue;
    },
    editItem(item) {
      this.editedIndex = this.residentTable.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      this.resident_id = item.id;
      console.log(this.resident_id);
    },
    deleteItem(item) {
      this.editedIndex = this.residentTable.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.residentTable.splice(this.editedIndex, 1);
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
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.residentTable[this.editedIndex], this.editedItem);
        // edit
        this.getResidentData();
        this.editResidentData(
          this.editedItem.rank,
          this.editedItem.firstName,
          this.editedItem.lastName,
          this.editedItem.water_zone,
          this.editedItem.zone,
          this.editedItem.building,
          this.editedItem.roomNo,
          this.editedItem.electricity_no,
          this.editedItem.electricity_meter_no,
          this.editedItem.water_no,
          this.editedItem.water_meter_no,
          this.editedItem.room_type
        );
        this.snackbar = true;
        this.statusAction = "แก้ไขข้อมูลสำเร็จ";
        this.colorSnackbar = "agree";
      } else {
        this.residentTable.push(this.editedItem);
        // add
        this.getResidentData();
        this.addResident(
          this.editedItem.rank,
          this.editedItem.firstName,
          this.editedItem.lastName,
          this.editedItem.water_zone,
          this.editedItem.zone,
          this.editedItem.building,
          this.editedItem.roomNo,
          this.editedItem.electricity_no,
          this.editedItem.electricity_meter_no,
          this.editedItem.water_no,
          this.editedItem.water_meter_no,
          this.editedItem.room_type
        );
        this.snackbar = true;
        this.statusAction = "เพิ่มข้อมูลสำเร็จ";
        this.colorSnackbar = "agree";
      }
      this.close();
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
    enterSelect() {
      if (this.selected.length >= 1) {
        return (this.selectItems = true);
      } else {
        return (this.selectItems = false);
      }
    },
    // delete as selected
    deleteItemSelected(residentsIDs) {
      if (confirm("ต้องการลบข้อมูลที่เลือกหรือไม่ ?")) {
        for (var i = 0; i < this.selected.length; i++) {
          const index = this.residentTable.indexOf(this.selected[i]);
          this.residentTable.splice(index, 1);
        }
        this.selectItems = false;
        this.deleteResident(residentsIDs);
      }
    },
  },
};
</script>

<style scoped>
.filter {
  margin-bottom: 25px;
  padding: 10px;
}
.button-filter {
  margin: 10px;
  padding: 20px;
}
.card-filter {
  margin-bottom: 20px;
  margin-top: 20px;
}
.v-data-table {
  font-size: 20px;
}
</style>
