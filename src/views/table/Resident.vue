<template>
  <v-app id="app">
    <!-- title and filter -->
    <div class="content background-main">
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
    <v-card class="card-filter px-6 py-6">
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
          :disabled="!selectItem"
          @click="deleteItemSelected"
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
                          :rules="rules.electricNumber"
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
                          :rules="rules.electricMeterNumber"
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
                          :rules="rules.waterNumber"
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
                          :rules="rules.waterNumber"
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
                  <v-btn color="agree" :disabled="!valid" text @click="save">
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
                :disabled="!selectItem"
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
                <v-btn color="agree" text @click="exportExcelResident = false">
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
          <v-col cols="12" xs="12" sm="12" md="3" lg="4">
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
          <v-col cols="12" xs="12" sm="12" md="3" lg="4">
            <v-autocomplete
              class="filter"
              prepend-icon="mdi-map-marker"
              v-model="zoneFilterValue"
              :items="zones"
              label="กรองด้วยพื้นที่"
              clearable
            >
            </v-autocomplete>
          </v-col>
          <!-- filter for building -->
          <v-col cols="12" xs="12" sm="12" md="3" lg="4">
            <v-autocomplete
              class="filter"
              prepend-icon="mdi-office-building"
              v-model="buildingFilterValue"
              :items="buildings"
              label="กรองด้วยอาคาร"
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
        loading
        loading-text="กำลังโหลด... โปรดรอสักครู่"
        show-select
        @input="enterSelect($event)"
      >
        <!-- data -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon @click="editItem(item)"> mdi-pencil </v-icon>
          <!-- <v-icon @click="deleteItem(item)"> mdi-delete </v-icon> -->
        </template>
      </v-data-table>
      <!-- end data-table -->
    </v-card>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    el: "#app",
    valid: true,
    modal: false,
    dialog: false,
    importExcel: false,
    attrs: {},
    on: {},
    selected: [],
    itemsPerPage: 5,
    selectItem: false,
    menu: false,
    room_type: "",
    search: "",
    dialogDelete: false,
    exportExcelResident: false,
    meterGroup: "",
    meterGroups: ["ป.1", "ป.83", "ป.84", "ป.212", "ป.391"],
    room_types: ["ห้องโสด", "ห้องครอบครัว 1", "ห้องครอบครัว 2"],
    // Filter models.
    NamefilterValue: "",
    zoneFilterValue: "",
    buildingFilterValue: "",
    roomFilterValue: "",
    rank: "",
    ranks: [
      "พล.ต.อ.",
      "พล.ต.ท.",
      "พล.ต.ต.",
      "พ.ต.อ.",
      "พ.ต.ท.",
      "พ.ต.ต.",
      "ร.ต.อ.",
      "ร.ต.ท.",
      "ร.ต.ต.",
      "ด.ต.",
      "จ.ส.ต.",
      "ส.ต.อ.",
      "ส.ต.ท.",
      "ส.ต.ต.",
    ],
    zonesBuildings: {
      เขตส่วนกลาง: [
        "2/11",
        "2/12",
        "2/13",
        "2/14",
        "2/15",
        "2/16",
        "2/17",
        "2/18",
      ],
      เขตสุรนารายณ์: [
        "2/20",
        "2/21",
        "2/22",
        "2/23",
        "2/24",
        "2/25",
        "2/26",
        "2/27",
        "2/28",
        "2/29",
        "2/31",
        "2/32",
        "2/33",
        "2/34",
        "2/35",
        "2/36",
        "2/37",
        "2/38",
        "2/39",
        "2/40",
        "2/41",
      ],
      เขตอังฏดาง: ["2/19"],
    },
    buildingsRooms: {
      "2/11": [
        "97",
        "99",
        "101",
        "103",
        "105",
        "107",
        "109",
        "111",
        "113",
        "115",
        "117",
        "119",
      ],
      "2/12": [
        "73",
        "75",
        "77",
        "79",
        "81",
        "83",
        "85",
        "87",
        "89",
        "91",
        "93",
        "95",
      ],
      "2/13": [
        "108",
        "110",
        "112",
        "114",
        "116",
        "118",
        "120",
        "122",
        "124",
        "126",
        "128",
        "130",
      ],
      "2/14": [
        "101",
        "102",
        "103",
        "104",
        "105",
        "106",
        "201",
        "202",
        "203",
        "204",
        "205",
        "206",
        "301",
        "302",
        "303",
        "304",
        "305",
        "306",
        "401",
        "402",
        "403",
        "404",
        "405",
        "406",
        "501",
        "502",
        "503",
        "504",
        "505",
        "506",
      ],
      "2/15": [
        "121",
        "123",
        "125",
        "127",
        "129",
        "131",
        "133",
        "135",
        "137",
        "139",
        "141",
        "143",
        "145",
        "147",
        "149",
        "151",
        "153",
        "155",
        "157",
        "159",
        "161",
        "163",
        "165",
        "167",
        "169",
        "171",
        "173",
        "175",
      ],
      "2/16": [
        "177",
        "179",
        "181",
        "183",
        "185",
        "187",
        "189",
        "191",
        "193",
        "195",
        "197",
        "199",
        "201",
        "203",
        "205",
        "207",
        "209",
        "211",
        "213",
        "215",
        "217",
        "219",
        "221",
        "223",
        "225",
      ],
      "2/17": [
        "132",
        "134",
        "136",
        "138",
        "140",
        "142",
        "144",
        "146",
        "148",
        "150",
        "152",
        "154",
        "156",
        "158",
        "160",
        "162",
        "164",
        "166",
        "168",
        "170",
        "172",
        "174",
        "176",
        "178",
        "180",
        "182",
        "184",
        "186",
      ],
      "2/18": [
        "50",
        "52",
        "54",
        "56",
        "58",
        "60",
        "62",
        "64",
        "66",
        "68",
        "70",
        "72",
        "74",
        "76",
        "78",
        "80",
        "82",
        "84",
        "86",
        "88",
        "90",
        "92",
        "94",
        "96",
        "98",
        "100",
        "102",
        "104",
      ],
      "2/19": [
        "101",
        "102",
        "103",
        "104",
        "105",
        "106",
        "107",
        "108",
        "109",
        "110",
        "201",
        "202",
        "203",
        "204",
        "205",
        "206",
        "207",
        "208",
        "209",
        "210",
        "211",
        "212",
        "213",
        "214",
        "215",
        "301",
        "302",
        "303",
        "304",
        "305",
        "306",
        "307",
        "308",
        "309",
        "310",
        "311",
        "312",
        "313",
        "314",
        "315",
        "401",
        "402",
        "403",
        "404",
        "405",
        "406",
        "407",
        "408",
        "409",
        "410",
        "411",
        "412",
        "413",
        "414",
        "415",
        "501",
        "502",
        "503",
        "504",
        "505",
        "506",
        "507",
        "508",
        "509",
        "510",
        "511",
        "512",
        "513",
        "514",
        "515",
      ],
      "2/20": ["1", "2"],
      "2/21": ["3", "4"],
      "2/22": ["5", "6"],
      "2/23": ["7", "8"],
      "2/24": ["9", "10"],
      "2/25": ["11", "12"],
      "2/26": ["13", "14"],
      "2/27": ["15", "16"],
      "2/28": ["17", "18"],
      "2/29": ["19", "20"],
      "2/31": ["79", "80", "81", "82", "83", "84", "85", "86", "87", "88"],
      "2/32": ["89", "90", "91", "92", "93", "94", "95", "96", "97", "98"],
      "2/33": [
        "99",
        "100",
        "101",
        "102",
        "103",
        "104",
        "105",
        "106",
        "107",
        "108",
      ],
      "2/34": [
        "109",
        "110",
        "111",
        "112",
        "113",
        "114",
        "115",
        "116",
        "117",
        "118",
      ],
      "2/35": [
        "119",
        "120",
        "121",
        "122",
        "123",
        "124",
        "125",
        "126",
        "127",
        "128",
      ],
      "2/36": [
        "129",
        "130",
        "131",
        "132",
        "133",
        "134",
        "135",
        "136",
        "137",
        "138",
      ],
      "2/37": [
        "139",
        "140",
        "141",
        "142",
        "143",
        "144",
        "145",
        "146",
        "147",
        "148",
      ],
      "2/38": [
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37",
        "38",
        "39",
        "40",
        "41",
        "42",
        "43",
        "44",
        "45",
        "46",
        "47",
        "48",
        "49",
        "50",
      ],
      "2/39": [
        "149",
        "150",
        "151",
        "152",
        "153",
        "154",
        "155",
        "156",
        "157",
        "158",
        "159",
        "160",
        "161",
        "162",
        "163",
        "164",
        "165",
        "166",
        "167",
        "168",
        "169",
        "170",
        "171",
        "172",
        "173",
        "174",
        "175",
        "176",
        "177",
        "178",
      ],
      "2/40": [
        "179",
        "180",
        "181",
        "182",
        "183",
        "184",
        "185",
        "186",
        "187",
        "188",
        "189",
        "190",
        "191",
        "192",
        "193",
        "194",
        "195",
        "196",
        "197",
        "198",
        "199",
        "200",
        "201",
        "202",
        "203",
        "204",
        "205",
        "206",
        "207",
        "208",
      ],
      "2/41": [
        "212",
        "213",
        "214",
        "215",
        "216",
        "217",
        "218",
        "219",
        "220",
        "221",
        "222",
        "223",
        "224",
        "225",
        "226",
        "227",
        "228",
        "229",
        "230",
        "231",
        "232",
        "233",
        "234",
        "235",
        "236",
        "237",
        "238",
        "239",
        "240",
      ],
    },
    date: "",
    residentTable: [],
    editedIndex: -1,
    editedItem: {
      first_name: "",
      room_no: "",
      electric_no: "",
      water_meter_no: "",
      room_type: "ห้องครอบครัว 1",
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
          text: "สถานะ",
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
      return Object.keys(this.zonesBuildings);
    },
    buildings() {
      // autocomplete in filter
      if (this.zoneFilterValue) {
        return this.zonesBuildings[this.zoneFilterValue];
      }
      // autocomplete in form
      if (!this.editedItem.zone) {
        return ["ไม่มีข้อมูล"];
      } else {
        return this.zonesBuildings[this.editedItem.zone];
      }
    },
    rooms() {
      if (this.buildingFilterValue) {
        return this.buildingsRooms[this.buildingFilterValue];
      }
      if (!this.editedItem.building) {
        return ["ไม่มีข้อมูล"];
      } else {
        return this.buildingsRooms[this.editedItem.building];
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
    this.initialize();
  },
  methods: {
    // mock data in table
    initialize() {
      this.residentTable = [
        {
          rank: "ด.ต.หญิง",
          first_name: "อธิวัฒน์",
          last_name: " เจิมสูงเนิน",
          zone: "เขตสุรนารายณ์",
          building: "2/36",
          room_no: "132",
          water_zone: "ป.1",
          electricity_no: "200190919501",
          electricity_meter_no: "20019091950",
          water_no: "4567",
          water_meter_no: "4567",
          date_pay: "2021-06",
          price: 323.6,
          room_type: "ห้องโสด",
        },
        {
          rank: "จ.ส.ต.",
          first_name: "ยุพาพร ",
          last_name: "พวงมะเทศ",
          zone: "เขตสุรนารายณ์",
          building: "2/36",
          room_no: "133",
          water_zone: "ป.1",
          electricity_no: "200190955212",
          electricity_meter_no: "20019095521",
          water_no: "7540",
          water_meter_no: "7540",
          date_pay: "2021-06",
          price: 742.29,
          room_type: "ห้องครอบครัว 2",
        },
        {
          rank: "ด.ต.",
          first_name: "เทวราช",
          last_name: " ดวงทอง",
          zone: "เขตสุรนารายณ์",
          building: "2/36",
          room_no: "138",
          water_zone: "ป.1",
          electricity_no: "200190955393",
          electricity_meter_no: "20019095539",
          water_no: "9856",
          water_meter_no: "9856",
          date_pay: "2021-06",
          price: 0.0,
          room_type: "ห้องครอบครัว 2",
        },
        {
          rank: "ด.ต.",
          first_name: "สุรพงษ์ ",
          last_name: "ทั่งทอง",
          zone: "เขตสุรนารายณ์",
          building: "2/37",
          room_no: "140",
          water_zone: "ป.1",
          electricity_no: "200187439364",
          electricity_meter_no: "20018743936",
          water_no: "3214",
          water_meter_no: "3214",
          date_pay: "2021-06",
          price: 33.34,
          room_type: "ห้องครอบครัว 2",
        },
        {
          rank: "ด.ต.",
          first_name: "จิรสิทธ์",
          last_name: " ภูอ่าง",
          zone: "เขตสุรนารายณ์",
          building: "2/37",
          room_no: "142",
          water_zone: "ป.83",
          electricity_no: "200130597255",
          electricity_meter_no: "20013059725",
          water_no: "5467",
          water_meter_no: "5467",
          date_pay: "2021-06",
          price: 1068.8,
          room_type: "ห้องโสด",
        },
        {
          rank: "ร.ต.ท.",
          first_name: "วุฒิชัย",
          last_name: " บุญใบ",
          zone: "เขตสุรนารายณ์",
          building: "2/37",
          room_no: "148",
          water_zone: "ป.83",
          electricity_no: "200130599746",
          electricity_meter_no: "20013059974",
          water_no: "8520",
          water_meter_no: "8520",
          date_pay: "2021-06",
          price: 220.21,
          room_type: "ห้องโสด",
        },
        {
          rank: "พ.ต.อ.",
          first_name: "ธรรมศธรรม",
          last_name: " นาคมณี",
          zone: "เขตสุรนารายณ์",
          building: "2/38",
          room_no: "22",
          water_zone: "ป.83",
          electricity_no: "200130694277",
          electricity_meter_no: "20013069427",
          water_no: "7845",
          water_meter_no: "7845",
          date_pay: "2021-06",
          price: 153.5,
          room_type: "ห้องโสด",
        },
        {
          rank: "พ.ต.อ.",
          first_name: "สุพล ",
          last_name: "สุราวุฒิ",
          zone: "เขตสุรนารายณ์",
          building: "2/38",
          room_no: "23",
          water_zone: "ป.83",
          electricity_no: "200130694548",
          electricity_meter_no: "20013069454",
          water_no: "3568",
          water_meter_no: "3568",
          date_pay: "2021-06",
          price: 40.9,
          room_type: "ห้องโสด",
        },
        {
          rank: "ด.ต.",
          first_name: "พีรันธร",
          last_name: " ก้านขุนทด",
          zone: "เขตสุรนารายณ์",
          building: "2/38",
          room_no: "24",
          water_zone: "ป.83",
          electricity_no: "200130695249",
          electricity_meter_no: "20013069524",
          water_no: "5568",
          water_meter_no: "5568",
          date_pay: "2021-06",
          price: 829.37,
          room_type: "ห้องครอบครัว 1",
        },
        {
          rank: "ด.ต.",
          first_name: "อักษร ",
          last_name: "ทองวิจิตร",
          zone: "เขตสุรนารายณ์",
          building: "2/38",
          room_no: "26",
          water_zone: "ป.212",
          electricity_no: "200130696190",
          electricity_meter_no: "20013069619",
          water_no: "1123",
          water_meter_no: "1123",
          date_pay: "2021-06",
          price: 0.0,
          room_type: "ห้องครอบครัว 1",
        },
      ];
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
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.residentTable[this.editedIndex], this.editedItem);
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
        return (this.selectItem = true);
      } else {
        return (this.selectItem = false);
      }
    },
    // delete as selected
    deleteItemSelected() {
      if (confirm("ต้องการลบข้อมูลที่เลือกหรือไม่ ?")) {
        for (var i = 0; i < this.selected.length; i++) {
          const index = this.residentTable.indexOf(this.selected[i]);
          this.residentTable.splice(index, 1);
          this.selected.length == 0;
        }
        this.dialog = false;
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
