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
                color="agree"
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
                          v-model="editedItem.first_name"
                          label="ชื่อ"
                          required
                          :rules="rules.nameRules"
                          clearable
                        ></v-text-field>
                      </v-col>
                      <!-- lastname -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.last_name"
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
                          :items="meterGroups"
                          label="สายของมิเตอร์น้ำ"
                          :rules="rules.zonesBuildingsRoom"
                          clearable
                          item-text="name"
                          item-value="value"
                        >
                        </v-autocomplete>
                      </v-col>
                      <!-- zone -->
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          v-model="editedItem.zone"
                          label="พื้นที่"
                          required
                          :items="zones"
                          :rules="rules.zonesBuildingsRoom"
                          clearable
                        >
                        </v-autocomplete>
                      </v-col>
                      <!-- building -->
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          v-model="editedItem.building"
                          label="อาคาร"
                          required
                          :items="buildings"
                          :rules="rules.zonesBuildingsRoom"
                          clearable
                        >
                        </v-autocomplete>
                      </v-col>
                      <!-- room_no -->
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          v-model="editedItem.room_no"
                          label="เลขห้องพัก"
                          required
                          @keypress="isNumber($event)"
                          :items="rooms"
                          :rules="rules.zonesBuildingsRoom"
                          clearable
                        >
                        </v-autocomplete>
                      </v-col>
                      <!-- electric_no -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.electricity_no"
                          label="เลขผู้ใช้ไฟฟ้า"
                          @keypress="isNumber($event)"
                          clearable
                          required
                          counter="12"
                          maxlength="12"
                          disabled
                        ></v-text-field>
                      </v-col>
                      <!-- electric_meter_no -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.electricity_meter_no"
                          label="เลขมิเตอร์ไฟฟ้า"
                          @keypress="isNumber($event)"
                          clearable
                          required
                          counter="11"
                          disabled
                        ></v-text-field>
                      </v-col>
                      <!-- water_no -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.water_no"
                          label="เลขผู้ใช้น้ำประปา"
                          @keypress="isNumber($event)"
                          clearable
                          required
                          counter="4"
                          disabled
                        ></v-text-field>
                      </v-col>
                      <!-- water_meter_no -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.water_meter_no"
                          label="เลขมิเตอร์น้ำประปา"
                          @keypress="isNumber($event)"
                          clearable
                          required
                          counter="4"
                          disabled
                        ></v-text-field>
                      </v-col>
                      <!-- room_type -->
                      <v-col cols="12" sm="6" md="4">
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
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-btn color="warning" text @click="close"> ยกเลิก </v-btn>
                  <v-btn
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
                color="#1572A1"
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
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="residentTable"
        item-key="first_name"
        :items-per-page="itemsPerPage"
        class="elevation-1 pa-6"
        :search="search"
        :loading="loadTable"
        loading-text="กำลังโหลด... โปรดรอสักครู่"
        show-select
        @input="enterSelect($event)"
      >
        <!-- room_type -->
        <template v-slot:[`item.room_type`]="{ item }">
          <td v-if="item.room_type == 'single'">{{ "ห้องโสด" }}</td>
          <td v-if="item.room_type == 'family_1'">{{ "ห้องครอบครัว 1" }}</td>
          <td v-if="item.room_type == 'family_2'">{{ "ห้องครอบครัว 2" }}</td>
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
export default {
  components: { NotFound },
  data: () => ({
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
      first_name: "",
      room_no: "",
      electric_no: "",
      water_meter_no: "",
      room_type: "",
    },
    defaultItem: {
      first_name: "",
      room_no: "",
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
          text: "อาคาร",
          value: "building",
          filter: this.buildingFilter,
        },
        {
          text: "เลขห้องพัก",
          value: "room_no",
        },
        {
          text: "สายมิเตอร์น้ำ",
          value: "water_zone",
        },
        {
          text: "เลขผู้ใช้น้ำ",
          value: "water_no",
        },
        {
          text: "เลขมิเตอร์น้ำประปา",
          value: "water_meter_no",
        },
        {
          text: "เลขผู้ใช้ไฟฟ้า",
          value: "electricity_no",
        },
        {
          text: "เลขมิเตอร์ไฟฟ้า",
          value: "electricity_meter_no",
        },
        {
          text: "ประเภทห้อง",
          value: "room_type",
        },
        {
          text: "การจัดการ",
          value: "actions",
          sortable: false,
        },
      ];
    },
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
  },
  mounted() {
    this.getResidentData();
  },
  methods: {
    getRole() {
      var role = localStorage.getItem("role");
      this.role = role;
    },
    // get data from mockup api
    getResidentData() {
      var config = {
        headers: {
          "x-api-key": "xxx-api-key",
          "x-refresh-token": "xxx-refresh-token",
        },
      };
      // var date = "?date=" + this.dateNow;
      var date = "?date=2022-07-29";
      return axios
        .get(apiUrl + "/v1/resident" + date, config)
        .then((response) => {
          let data = response.data;
          if (data.status == "success") {
            this.residentTable = data.result.resident;
            this.loadTable = false;
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
          this.exportResident(residentsIDs);
        }
        if (this.exportExcelResident == false) {
          this.deleteItemSelected(residentsIDs);
        }
      }
    },
    // export with api
    exportResident(residentsIDs) {
      var config = {
        headers: {
          "x-api-key": "xxx-api-key",
          "x-refresh-token": "xxx-refresh-token",
        },
      };
      const residents_id = { residents_id: residentsIDs };
      return axios
        .post(apiUrl + "/v1/resident/exports", residents_id, config)
        .then((response) => {
          let data = response.data;
          if (data.status == "success") {
            this.exportExcelResident = false;
            this.statusAction = "Export สำเร็จ";
            this.colorSnackbar = "agree";
            this.snackbar = true;
            this.selectItems = false;
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
          "x-api-key": "xxx-api-key",
          "x-refresh-token": "xxx-refresh-token",
        },
      };
      const resident_id = { residents_id: residentsIDs };
      const residents_id = "?resident_id=" + JSON.stringify(resident_id);
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
    // validate before save
    async validateForm() {
      if (this.$refs.formAdduser.validate()) {
        this.save();
      }
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.residentTable[this.editedIndex], this.editedItem);
        this.snackbar = true;
        this.statusAction = "แก้ไขข้อมูลสำเร็จ";
        this.colorSnackbar = "agree";
      } else {
        this.residentTable.push(this.editedItem);
      }
      this.close();
    },
    savea() {
      if (this.editedIndex > -1) {
        Object.assign(this.residentTable[this.editedIndex], this.editedItem);
      } else {
        this.residentTable.push(this.editedItem);
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
        this.residentTable.indexOf(this.selected[0]);
        this.selectItems = false;
        this.deleteResident(residentsIDs)
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
