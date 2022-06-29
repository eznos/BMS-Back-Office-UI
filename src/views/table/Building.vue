<template>
  <v-app id="app">
    <!-- title  -->
    <div class="content background-main">
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
    <v-card class="card-filter px-6 py-6">
      <v-card-title>
        <v-icon size="35px" class="icon"
          >mdi-format-list-bulleted-triangle</v-icon
        >
        &nbsp;&nbsp;
        <h3>เครื่องมือค้นหา</h3>
        <v-spacer></v-spacer>
      </v-card-title>
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
            >
            </v-autocomplete>
          </v-col>
          <!-- search by type -->
          <v-col cols="12" xs="12" sm="12" md="4" lg="4">
            <v-select
              v-model="typeFilterValue"
              prepend-icon="mdi-shape-outline"
              label="ค้นหาด้วยประเภทห้อง"
              :items="room_types"
              clearable
              class="filter"
            >
            </v-select>
          </v-col>
          <!-- search by room_status -->
          <v-col cols="12" xs="12" sm="12" md="4" lg="4">
            <v-select
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
    </v-card>
    <!-- table and buttons -->
    <v-row>
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
              @click="deleteItemSelected"
            >
              <v-icon>mdi-delete-sweep</v-icon>
              &nbsp; ลบข้อมูลที่เลือก
            </v-btn>
            <v-spacer></v-spacer>
            <div>
              <!-- add room -->
              <v-dialog v-model="dialog" persistent max-width="75%">
                <template v-slot:activator="{ on: attrs }">
                  <v-btn
                    color="agree"
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
                              v-model="editedItem.water_group"
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
                              label="อาคาร"
                              clearable
                              required
                              :rules="rules.zonesBuildingsRoom"
                            >
                            </v-autocomplete>
                          </v-col>
                          <!-- room -->
                          <v-col cols="12" sm="6" md="4">
                            <v-autocomplete
                              v-model="editedItem.room"
                              label="เลขห้องพัก"
                              :items="rooms"
                              clearable
                              required
                              :rules="rules.zonesBuildingsRoom"
                            >
                            </v-autocomplete>
                          </v-col>
                          <!-- electricity_no -->
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="editedItem.electricity_no"
                              label="เลขผู้ใช้ไฟฟ้า"
                              @keypress="isNumber($event)"
                              clearable
                              required
                              counter="12"
                              :rules="rules.electricNumber"
                            ></v-text-field>
                          </v-col>
                          <!-- water_no -->
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="editedItem.water_no"
                              label="เลขผู้ใช้น้ำ"
                              @keypress="isNumber($event)"
                              clearable
                              required
                              counter="4"
                              :rules="rules.waterNumber"
                            ></v-text-field>
                          </v-col>
                          <!-- electricity_meter_no -->
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field
                              v-model="editedItem.electricity_meter_no"
                              label="เลขมิเตอร์น้ำไฟฟ้า"
                              @keypress="isNumber($event)"
                              clearable
                              required
                              counter="11"
                              :rules="rules.electricMeterNumber"
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
                              :rules="rules.waterNumber"
                            ></v-text-field>
                          </v-col>
                          <!-- type -->
                          <v-col cols="12" sm="6" md="4">
                            <v-select
                              v-model="editedItem.room_type"
                              :items="room_types"
                              label="ประเภทห้องพัก"
                              clearable
                              required
                              :rules="rules.zonesBuildingsRoom"
                              item-text="text"
                              item-value="value"
                            >
                            </v-select>
                          </v-col>
                          <!-- room_status -->
                          <v-col cols="12" sm="6" md="4">
                            <v-select
                              v-model="editedItem.room_status"
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
                v-model="exportExcelResident"
                persistent
                max-width="75%"
              >
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
                    <v-btn
                      color="agree"
                      text
                      @click="exportExcelResident = false"
                    >
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
              item-key="room"
              :items-per-page="itemsPerPage"
              class="table header-blue"
              :search="search"
              loading
              loading-text="กำลังโหลด... โปรดรอสักครู่"
              show-select
              @input="enterSelect($event)"
            >
              <!-- color room_status on datatable  -->
              <template v-slot:[`item.room_status`]="{ item }">
                <v-chip :color="getColor(item.room_status)" dark>
                  <td v-if="item.room_status == 'empty'">{{ "ว่าง" }}</td>
                  <td v-if="item.room_status == 'not_empty'">
                    {{ "ไม่ว่าง" }}
                  </td>
                </v-chip>
              </template>
              <template v-slot:[`item.room_type`]="{ item }">
                <td v-if="item.room_type == 'single'">{{ "ห้องโสด" }}</td>
                <td v-if="item.room_type == 'family_1'">
                  {{ "ห้องครอบครัว 1" }}
                </td>
                <td v-if="item.room_type == 'family_2'">
                  {{ "ห้องครอบครัว 2" }}
                </td>
              </template>
              <!-- data edit and delete-->
              <template v-slot:[`item.actions`]="{ item }">
                <v-icon @click="editItem(item)"> mdi-pencil </v-icon>
                <!-- <v-icon @click="deleteItem(item)"> mdi-delete </v-icon> -->
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    el: "#app",
    valid: true,
    modal: false,
    dialog: false,
    menu: false,
    selected: [],
    itemsPerPage: 5,
    selectItems: false,
    first_name: "",
    on: {},
    attrs: {},
    zone: null,
    building: null,
    room: null,
    emailtarget: "",
    exportExcelResident: false,
    dateExport: new Date().toISOString().substr(0, 7),
    menuExportExcel: false,
    electricity_no: "",
    water_no: "",
    electricity_meter_no: "",
    water_meter_no: "",
    room_type: "",
    room_status: "",
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
    water_groups: ["ป.1", "ป.83", "ป.84", "ป.212", "ป.391"],
    room_types: [
      {
        text: "ห้องโสด",
        value: "single",
      },
      {
        text: "ห้องครอบครัว 1",
        value: "family_1",
      },
      {
        text: "ห้องครอบครัว 2",
        value: "family_2",
      },
    ],
    room_statuses: [
      {
        text: "ว่าง",
        value: "empty",
      },
      {
        text: "ไม่ว่าง",
        value: "not_empty",
      },
    ],
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
      first_name: "",
      room: "",
      water_no: "",
      water_meter_no: "",
      room_status: "",
    },
    defaultItem: {
      first_name: "",
      room: "",
      water_no: "",
      water_meter_no: "",
      room_status: "",
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
          value: "water_group",
          filter: this.waterGroupFilter,
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
          value: "room",
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
          text: "ประเภทห้องพัก",
          value: "room_type",
          filter: this.typeFilter,
        },
        {
          text: "สถานะ",
          value: "room_status",
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
      if (this.buildFilterValue) {
        return this.buildingsRooms[this.buildFilterValue];
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
    initialize() {
      this.buildingTable = [
        {
          rank: "พล.ต.อ.",
          first_name: "ชัชชาช้า",
          last_name: "ชัชชาวาน",
          zone: "เขตสุรนารายณ์",
          building: "2/20",
          room: "2",
          water_group: "ป.1",
          water_no: "1234",
          water_meter_no: "1234",
          electricity_no: "200190919501",
          electricity_meter_no: "20019091950",
          date_pay: "2022-03",
          price: "30",
          difference_price: "50",
          sum_price: "80",
          room_status: "not_empty",
          permission: "user",
          email: "user@123.com",
          room_type: "family_1",
        },
        {
          rank: "ด.ต.หญิง",
          first_name: "ภัทรพร",
          last_name: "ศรีโอภาส",
          zone: "เขตอังฏดาง",
          building: "2/19",
          room: "103",
          water_group: "ป.1",
          water_no: "4567",
          water_meter_no: "4567",
          electricity_no: "200190955212",
          electricity_meter_no: "20019095521",
          date_pay: "2021-06",
          price: "19",
          difference_price: "25.34",
          sum_price: "44.34",
          room_status: "not_empty",
          permission: "admin",
          email: "smorston0@nytimes.com",
          room_type: "family_2",
        },
        {
          rank: "ด.ต.",
          first_name: "อมร ",
          last_name: "ภูมพฤกษ์",
          zone: "เขตอังฏดาง",
          building: "2/19",
          room: "107",
          water_group: "ป.1",
          water_no: "7540",
          water_meter_no: "7540",
          electricity_no: "200190955393",
          electricity_meter_no: "20019095539",
          date_pay: "2021-06",
          price: "57",
          difference_price: "25.34",
          sum_price: "82.34",
          room_status: "not_empty",
          permission: "user",
          email: "mtinkler1@google.ca",
          room_type: "family_2",
        },
        {
          rank: "ด.ต.",
          first_name: "อดุล ",
          last_name: "วงศ์ทอง",
          zone: "เขตอังฏดาง",
          building: "2/19",
          room: "202",
          water_group: "ป.1",
          water_no: "9856",
          water_meter_no: "9856",
          electricity_no: "200187439364",
          electricity_meter_no: "20018743936",
          date_pay: "2021-06",
          price: "95",
          difference_price: "25.34",
          sum_price: "120.34",
          room_status: "not_empty",
          permission: "user",
          email: "ssmewings2@umn.edu",
          room_type: "single",
        },
        {
          rank: "ร.ต.ท.",
          first_name: "จรัส ",
          last_name: "สิมฤทธิ์",
          zone: "เขตอังฏดาง",
          building: "2/19",
          room: "206",
          water_group: "ป.1",
          water_no: "3214",
          water_meter_no: "3214",
          electricity_no: "200130597255",
          electricity_meter_no: "20013059725",
          date_pay: "2021-06",
          price: "95",
          difference_price: "25.34",
          sum_price: "120.34",
          room_status: "empty",
          permission: "user",
          email: "asnartt3@intel.com",
          room_type: "family_2",
        },
        {
          rank: "ส.ต.อ.",
          first_name: "ธิชากร ",
          last_name: "ผินดอน",
          zone: "เขตอังฏดาง",
          building: "2/19",
          room: "305",
          water_group: "ป.83",
          water_no: "5467",
          water_meter_no: "5467",
          electricity_no: "200130599746",
          electricity_meter_no: "20013059974",
          date_pay: "2021-06",
          price: "76",
          difference_price: "25.34",
          sum_price: "101.34",
          room_status: "empty",
          permission: "user",
          email: "ibirkbeck4@github.com",
          room_type: "single",
        },
        {
          rank: "ด.ต.",
          first_name: "รุ่ง ",
          last_name: "โฉมกิ่ง",
          zone: "เขตอังฏดาง",
          building: "2/19",
          room: "402",
          water_group: "ป.1",
          water_no: "8520",
          water_meter_no: "8520",
          electricity_no: "200130694277",
          electricity_meter_no: "20013069427",
          date_pay: "2021-06",
          price: "95",
          difference_price: "25.34",
          sum_price: "120.34",
          room_status: "empty",
          permission: "user",
          email: "gmcgrah5@ucoz.ru",
          room_type: "family_1",
        },
        {
          rank: "ด.ต.",
          first_name: "อนุชา ",
          last_name: "ฝากชัยภูมิ",
          zone: "เขตอังฏดาง",
          building: "2/19",
          room: "413",
          water_group: "ป.1",
          water_no: "7845",
          water_meter_no: "7845",
          electricity_no: "200130694548",
          electricity_meter_no: "20013069454",
          date_pay: "2021-06",
          price: "152",
          difference_price: "25.34",
          sum_price: "177.34",
          room_status: "empty",
          permission: "user",
          email: "jkirkby6@answers.com",
          room_type: "family_2",
        },
        {
          rank: "ส.ต.อ.",
          first_name: "รัฐพนย์ ",
          last_name: "เรื่องเรือ",
          zone: "เขตอังฏดาง",
          building: "2/19",
          room: "504",
          water_group: "ป.1",
          water_no: "3568",
          water_meter_no: "3568",
          electricity_no: "200130695249",
          electricity_meter_no: "20013069524",
          date_pay: "2021-06",
          price: "95",
          difference_price: "25.34",
          sum_price: "120.34",
          room_status: "empty",
          permission: "user",
          email: "fillyes7@hubpages.com",
          room_type: "family_1",
        },
        {
          rank: "ร.ต.ท.",
          first_name: "อิทธิพล",
          last_name: "เพ็ญเติมพันธ์",
          zone: "เขตอังฏดาง",
          building: "2/19",
          room: "514",
          water_group: "ป.1",
          water_no: "5568",
          water_meter_no: "5568",
          electricity_no: "200130696190",
          electricity_meter_no: "20013069619",
          date_pay: "2021-06",
          price: "95",
          difference_price: "25.34",
          sum_price: "120.34",
          room_status: "empty",
          permission: "user",
          email: "mlarmet8@mail.ru",
          room_type: "single",
        },
        {
          rank: "ด.ต.",
          first_name: "ไพโรจน์",
          last_name: "ทนปรางค์",
          zone: "เขตอังฏดาง",
          building: "2/19",
          room: "515",
          water_group: "ป.1",
          water_no: "1123",
          water_meter_no: "1123",
          electricity_no: "200130696190",
          electricity_meter_no: "20013069619",
          date_pay: "2021-06",
          price: "19",
          difference_price: "25.34",
          sum_price: "44.34",
          room_status: "empty",
          permission: "user",
          email: "tgainseford9@sun.com",
          room_type: "family_1",
        },
      ];
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
    // add user
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.buildingTable[this.editedIndex], this.editedItem);
      } else {
        this.buildingTable.push(this.editedItem);
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
    getRandomInt() {
      return Math.floor(Math.random() * (5000 - 5 + 1)) + 5;
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
    // color of room_status
    getColor(room_status) {
      if (room_status == "not_empty") return "red";
      if (room_status == "empty") return "agree";
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
    deleteItemSelected() {
      if (confirm("ต้องการลบข้อมูลที่เลือกหรือไม่ ?")) {
        for (var i = 0; i < this.selected.length; i++) {
          const index = this.buildingTable.indexOf(this.selected[i]);
          this.buildingTable.splice(index, 1);
          this.selected.length == 0;
        }
        this.dialog = false;
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
