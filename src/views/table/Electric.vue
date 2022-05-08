<template>
  <v-app id="app">
    <!-- filer and title-->
    <div class="content background-main">
      <v-row justify="space-between" class="px-3">
        <!-- title -->
        <div class="mb-4">
          <v-row style="align-items: center">
            <div class="ml-3 mt-9">
              <h2>
                <v-icon size="40" color="yellow"> mdi-lightning-bolt </v-icon>
                จัดการไฟฟ้า
              </h2>
            </div>
          </v-row>
        </div>
      </v-row>
      <!-- filter -->
      <v-card class="card-filter px-6 py-6">
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
          <!-- Filter for  zone-->
          <v-col cols="12" xs="12" sm="12" md="4" lg="4">
            <v-autocomplete
              v-model="zoneFilterValue"
              prepend-icon="mdi-map-legend"
              label="ค้นหาด้วยพื้นที่"
              class="filter"
              :items="zones"
              clearable
            >
            </v-autocomplete>
          </v-col>
          <!-- Filter for  building-->
          <v-col cols="12" xs="12" sm="12" md="4" lg="4">
            <v-autocomplete
              v-model="buildingFilterValue"
              prepend-icon="mdi-office-building-outline"
              label="ค้นหาด้วยอาคาร"
              class="filter"
              :items="buildings"
              clearable
            >
            </v-autocomplete>
          </v-col>
          <!-- filter by date -->
          <v-col cols="12" xs="12" sm="12" md="4" lg="4">
            <v-menu
              v-model="modalfilter"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="dateFilterValue"
                  label="ค้นหาด้วยเดือน"
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
                @input="modalfilter = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <!-- Filter for  status-->
          <v-col cols="12" xs="12" sm="12" md="4" lg="4">
            <v-select
              v-model="statusFilterValue"
              :items="statuses"
              prepend-icon="mdi-list-status"
              label="ค้นหาด้วยสถานะ"
              class="filter"
              item-text="statusText"
              item-value="statusValue"
              clearable
            ></v-select>
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
      </v-card>
    </div>
    <div></div>
    <!-- data table and button -->
    <v-card class="card-filter px-6 py-6">
      <v-card-title>
        <!-- title -->
        <v-icon size="35px" class="icon">mdi-table-large</v-icon>
        &nbsp;&nbsp;
        <h3>ตารางค่าไฟฟ้า</h3>
        <!-- delete as selected -->
        <v-btn
          color="error"
          width="140"
          v-bind="attrs"
          v-on="on"
          class="button-filter pt-5 pb-5"
          :disabled="!selectItems"
          @click="deleteItemSelected(selected)"
        >
          <v-icon>mdi-delete-sweep</v-icon>
          &nbsp; ลบข้อมูลที่เลือก
        </v-btn>
        <v-spacer></v-spacer>
        <div>
          <!-- edit user -->
          <v-dialog v-model="dialog" persistent max-width="75%">
            <v-card>
              <v-card-title>
                <!-- title add user -->
                <span>{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <!-- edit user -->
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                      <!-- rank -->
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          v-model="editedItem.rank"
                          label="ยศ"
                          required
                          autofocus
                          :rules="rules.name"
                          :items="ranks"
                          disabled
                        >
                        </v-autocomplete>
                      </v-col>
                      <!-- name -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.first_name"
                          label="ชื่อ"
                          required
                          :rules="rules.name"
                          disabled
                        ></v-text-field>
                      </v-col>
                      <!-- lastname -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.last_name"
                          label="นามสกุล"
                          required
                          :rules="rules.name"
                          disabled
                        ></v-text-field>
                      </v-col>
                      <!-- zone -->
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          label="พื้นที่"
                          :items="zones"
                          required
                          :rules="rules.buildingRoom"
                          v-model="editedItem.zone"
                          disabled
                        >
                        </v-autocomplete>
                      </v-col>
                      <!-- building -->
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          label="อาคาร"
                          :items="buildings"
                          required
                          :rules="rules.buildingRoom"
                          v-model="editedItem.building"
                          disabled
                        >
                        </v-autocomplete>
                      </v-col>
                      <!-- room_no  -->
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          label="เลขห้องพัก"
                          v-model="editedItem.room_no"
                          :items="rooms"
                          required
                          :rules="rules.buildingRoom"
                          disabled
                        >
                        </v-autocomplete>
                      </v-col>
                      <!-- electricNumber -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.electricity_no"
                          label="เลขผู้ใช้ไฟฟ้า"
                          required
                          counter="12"
                          :rules="rules.electricNumber"
                          disabled
                          @keypress="isNumber($event)"
                        ></v-text-field>
                      </v-col>
                      <!-- electricMeterNumber -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.electricity_meter_no"
                          label="เลขมิเตอร์ไฟฟ้า"
                          required
                          counter="11"
                          :rules="rules.electricMeterNumber"
                          @keypress="isNumber($event)"
                          disabled
                        ></v-text-field>
                      </v-col>
                      <!-- unit-->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.unit"
                          label="หน่วยไฟฟ้า"
                          required
                          :rules="rules.buildingRoom"
                          @keypress="isNumber($event)"
                          clearable
                        ></v-text-field>
                      </v-col>
                      <!-- price -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.price"
                          label="ค่าไฟฟ้า"
                          required
                          :rules="rules.buildingRoom"
                          @keypress="isNumber($event)"
                          clearable
                        ></v-text-field>
                      </v-col>
                      <!-- status -->
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          v-model="editedItem.status"
                          :items="statuses"
                          label="สถานะ"
                          required
                          :rules="rules.buildingRoom"
                          item-text="statusText"
                          item-value="statusValue"
                          clearable
                        >
                        </v-select>
                      </v-col>
                      <!-- date pay -->
                      <v-col cols="12" sm="6" md="4">
                        <v-dialog
                          ref="dialogAdduser"
                          v-model="modalAddDate"
                          persistent
                          width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="editedItem.date_pay"
                              label="เดือน"
                              prepend-icon="mdi-calendar"
                              readonly
                              required
                              :rules="rules.buildingRoom"
                              v-bind="attrs"
                              v-on="on"
                              clearable
                              disabled
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="editedItem.date_pay"
                            type="month"
                            locale="th-TH"
                          >
                            <v-spacer></v-spacer>
                            <v-btn
                              text
                              color="warning"
                              @click="modalAddDate = false"
                            >
                              ยกเลิก
                            </v-btn>
                            <v-btn
                              text
                              color="agree"
                              @click="
                                $refs.dialogAdduser.save(editedItem.date_pay)
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
              <!-- save and cancel buttons-->
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="warning" text @click="close"> ยกเลิก </v-btn>
                <v-btn color="agree" :disabled="!valid" text @click="save">
                  ยืนยัน
                </v-btn>
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
          <v-dialog v-model="exportExcelElectric" persistent max-width="75%">
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
                  @click="exportExcelElectric = false"
                >
                  ยกเลิก
                </v-btn>
                <v-btn color="agree" text @click="exportExcelElectric = false">
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
          :items="electricTable"
          item-key="first_name"
          :items-per-page="itemsPerPage"
          class="elevation-1 pa-6"
          :search="search"
          loading
          loading-text="กำลังโหลด... โปรดรอสักครู่"
          show-select
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          @input="enterSelect($event)"
        >
          <!-- color of price on datatable  -->
          <template v-slot:[`item.price`]="{ item }">
            <v-chip :color="getColor(item.price)">
              {{ item.price }}
            </v-chip>
          </template>
          <!-- status text and status color -->
          <template v-slot:[`item.status`]="{ item }">
            <v-chip :color="getColorForStatus(item.status)">
              <td v-if="item.status == 'draft'">{{ "ร่าง" }}</td>
              <td v-if="item.status == 'in_progess'">{{ "กำลังดำเนินการ" }}</td>
              <td v-if="item.status == 'calculated'">{{ "คำนวนแล้ว" }}</td>
              <td v-if="item.status == 'exported'">{{ "Export แล้ว" }}</td>
            </v-chip>
          </template>
          <!-- editor data -->
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon @click="editItem(item)"> mdi-pencil </v-icon>
            <!-- <v-icon @click="deleteItem(item)"> mdi-delete </v-icon> -->
          </template>
        </v-data-table>
        <!-- end data-table -->
      </v-card-text>
    </v-card>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    el: "#app",
    valid: true,
    sortBy: "first_name",
    sortDesc: false,
    modalAddDate: false,
    modalfilter: false,
    dialog: false,
    dialog3: false,
    attrs: {},
    on: {},
    selected: [],
    itemsPerPage: 5,
    selectItems: false,
    emailtarget: "",
    importExcel: false,
    exportExcelElectric: false,
    dateExport: new Date().toISOString().substr(0, 7),
    menuExportExcel: false,
    search: "",
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
    building: null,
    room_no: null,
    dialogDelete: false,
    // Filter models.
    zoneFilterValue: "",
    buildingFilterValue: "",
    roomFilterValue: "",
    dateFilterValue: "",
    statusFilterValue: "",
    date: new Date().toISOString().substr(0, 7),
    statuses: [
      {
        statusText: "ร่าง",
        statusValue: "draft",
      },
      {
        statusText: "กำลังดำเนินการ",
        statusValue: "in_progess",
      },
      // {
      //   statusText: "คำนวนแล้ว",
      //   statusValue: "calculated",
      // },
      {
        statusText: "Export แล้ว",
        statusValue: "exported",
      },
    ],
    electricTable: [],
    editedIndex: -1,
    editedItem: {
      first_name: "",
      zone: "",
      room_no: "",
      electricity_no: "",
      electricity_meter_no: "",
      status: "draft",
      date_pay: new Date().toISOString().substr(0, 7),
    },
    defaultItem: {
      first_name: "",
      zone: "เขตส่วนกลาง",
      room_no: "",
      electricity_no: "",
      electricity_meter_no: "",
      status: "draft",
      date_pay: new Date().toISOString().substr(0, 7),
    },
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
    rules: {
      format: [
        (value) => !value || value.size < 20000000 || "ขนาดไฟล์ไม่เกิน 20 MB",
      ],
      name: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length >= 2) || "กรอกชื่อให้มากกว่า 2 ตัวอักษร",
      ],
      electricNumber: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length == 12) || "กรอกเลขผู้ใช้ไฟฟ้าไม่ครบ 12 ตัว",
      ],
      electricMeterNumber: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length == 11) || "กรอกเลขมิเตอร์ไฟฟ้าไม่ครบ 11 ตัว",
      ],
      buildingRoom: [(v) => !!v || "กรุณากรอกข้อมูล"],
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
      return this.editedIndex === -1 ? "เพิ่มผู้ใช้ไฟฟ้า" : "แก้ไขผู้ใช้ไฟฟ้า";
    },
    headers() {
      return [
        {
          text: "ยศ",
          align: "left",
          value: "rank",
          filter: this.rankFilter,
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
          text: "เลขผู้ใช้ไฟ",
          value: "electricity_no",
        },
        {
          text: "เลขมิเตอร์ไฟ",
          value: "electricity_meter_no",
        },
        {
          text: "เดือน",
          value: "date_pay",
          filter: this.dateFilter,
        },
        {
          text: "หน่วย",
          value: "unit",
          filterable: false,
        },
        {
          text: "ค่าไฟฟ้า",
          value: "price",
          filterable: false,
        },
        {
          text: "สถานะ",
          value: "status",
          filter: this.stateFilter,
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
    // autocomplete
    buildings() {
      if (this.zoneFilterValue) {
        return this.zonesBuildings[this.zoneFilterValue];
      }
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
    // sumprice not finnnn
    sumPrice() {
      return this.editedItem.price * 2 + this.editedItem.price * 0.07;
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
  // mock data
  created() {
    this.initialize();
  },
  methods: {
    // mock data in table
    initialize() {
      this.electricTable = [
        {
          rank: "ด.ต.หญิง",
          first_name: "อธิวัฒน์ ",
          last_name: "เจิมสูงเนิน",
          zone: "เขตสุรนารายณ์",
          building: "2/36",
          room_no: "132",
          meter_group: "9040",
          electricity_no: "200190919501",
          electricity_meter_no: "20019091950",
          date_pay: "2021-06",
          price: 323.6,
          unit: "91",
          status: "draft",
        },
        {
          rank: "จ.ส.ต.",
          first_name: "ยุพาพร ",
          last_name: "พวงมะเทศ",
          zone: "เขตสุรนารายณ์",
          building: "2/36",
          room_no: "133",
          meter_group: "9040",
          electricity_no: "200190955212",
          electricity_meter_no: "20019095521",
          date_pay: "2021-06",
          price: 742.29,
          unit: "21",
          status: "draft",
        },
        {
          rank: "ด.ต.",
          first_name: "เทวราช ",
          last_name: "ดวงทอง",
          zone: "เขตสุรนารายณ์",
          building: "2/36",
          room_no: "138",
          meter_group: "9040",
          electricity_no: "200190955393",
          electricity_meter_no: "20019095539",
          date_pay: "2021-06",
          price: "0.00",
          unit: "91",
          status: "in_progess",
        },
        {
          rank: "ด.ต.",
          first_name: "สุรพงษ์ ",
          last_name: "ทั่งทอง",
          zone: "เขตสุรนารายณ์",
          building: "2/37",
          room_no: "140",
          meter_group: "9040",
          electricity_no: "200187439364",
          electricity_meter_no: "20018743936",
          date_pay: "2021-06",
          price: 33.34,
          unit: "38",
          status: "in_progess",
        },
        {
          rank: "ด.ต.",
          first_name: "จิรสิทธ์ ",
          last_name: "ภูอ่าง",
          zone: "เขตสุรนารายณ์",
          building: "2/37",
          room_no: "142",
          meter_group: "9040",
          electricity_no: "200130597255",
          electricity_meter_no: "20013059725",
          date_pay: "2021-06",
          price: 1068.8,
          unit: "74",
          status: "in_progess",
        },
        {
          rank: "ร.ต.ท.",
          first_name: "วุฒิชัย ",
          last_name: "บุญใบ",
          zone: "เขตสุรนารายณ์",
          building: "2/37",
          room_no: "148",
          meter_group: "9040",
          electricity_no: "200130599746",
          electricity_meter_no: "20013059974",
          date_pay: "2021-06",
          price: 220.21,
          unit: "98",
          status: "in_progess",
        },
        {
          rank: "พ.ต.อ.",
          first_name: "ธรรมศธรรม ",
          last_name: "นาคมณี",
          zone: "เขตสุรนารายณ์",
          building: "2/38",
          room_no: "22",
          meter_group: "9040",
          electricity_no: "200130694277",
          electricity_meter_no: "20013069427",
          date_pay: "2021-06",
          price: 153.5,
          unit: "91",
          status: "in_progess",
        },
        {
          rank: "พ.ต.อ.",
          first_name: "สุพล ",
          last_name: "สุราวุฒิ",
          zone: "เขตสุรนารายณ์",
          building: "2/38",
          room_no: "23",
          meter_group: "9040",
          electricity_no: "200130694548",
          electricity_meter_no: "20013069454",
          date_pay: "2021-06",
          price: 40.9,
          unit: "61",
          status: "in_progess",
        },
        {
          rank: "ด.ต.",
          first_name: "พีรันธร ",
          last_name: "ก้านขุนทด",
          zone: "เขตสุรนารายณ์",
          building: "2/38",
          room_no: "24",
          meter_group: "9040",
          electricity_no: "200130695249",
          electricity_meter_no: "20013069524",
          date_pay: "2021-06",
          price: 829.37,
          unit: "31",
          status: "in_progess",
        },
        {
          rank: "ด.ต.",
          first_name: "อักษร ",
          last_name: "ทองวิจิตร",
          zone: "เขตสุรนารายณ์",
          building: "2/38",
          room_no: "26",
          meter_group: "9040",
          electricity_no: "200130696190",
          electricity_meter_no: "20013069619",
          date_pay: "2021-06",
          price: "0.00",
          unit: "91",
          status: "in_progess",
        },
      ];
    },
    nameFilter(value) {
      // If this filter has no value we just skip the entire filter.
      if (!this.NamefilterValue) {
        return true;
      }
      // Check if the current loop value (The name)
      // partially contains the searched word.
      return value.toLowerCase().includes(this.NamefilterValue.toLowerCase());
    },
    zoneFilter(value) {
      if (!this.zoneFilterValue) {
        return true;
      }
      return value === this.zoneFilterValue;
    },
    buildingFilter(value) {
      if (!this.buildingFilterValue) {
        return true;
      }
      return value === this.buildingFilterValue;
    },
    stateFilter(value) {
      if (!this.statusFilterValue) {
        return true;
      }
      return value === this.statusFilterValue;
    },
    dateFilter(value) {
      if (!this.dateFilterValue) {
        return true;
      }
      return value == this.dateFilterValue;
    },
    editItem(item) {
      this.editedIndex = this.electricTable.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.electricTable.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.electricTable.splice(this.editedIndex, 1);
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
        Object.assign(this.electricTable[this.editedIndex], this.editedItem);
      } else {
        this.electricTable.push(this.editedItem);
      }
      this.close();
    },
    savea() {
      if (this.editedIndex > -1) {
        Object.assign(this.electricTable[this.editedIndex], this.editedItem);
      } else {
        this.electricTable.push(this.editedItem);
      }
      this.close();
    },
    // clear form
    clearForm() {
      this.$refs.form.reset();
    },
    // clear filter
    clearFilter() {
      (this.buildingFilterValue = ""),
        (this.zoneFilterValue = ""),
        (this.dateFilterValue = "");
      this.statusFilterValue = "";
      this.search = "";
    },
    // search in data table
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
    // color of price
    getColor(price) {
      if (price == 0) return "#FF606090";
      else return "#FFFFFF00";
    },
    // status color
    getColorForStatus(status) {
      if (status == "draft") return "yellow";
      if (status == "in_progess") return "red";
      if (status == "calculated") return "gray";
      else return "green";
    },
    // show delete as selected button
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
          const index = this.electricTable.indexOf(this.selected[i]);
          this.electricTable.splice(index, 1);
          this.selected.length == 0;
        }
        this.dialog = false;
      }
    },
    // select all
    toggleAll() {
      if (this.selected.length) this.selected = [];
      else this.selected = this.getDesserts.slice();
    },
    // sort by name
    toggleOrder() {
      this.sortDesc = !this.sortDesc;
    },
  },
};
</script>

<style scoped>
.filter {
  padding: 5px;
}
.button-filter {
  margin: 10px;
  padding: 20px;
}
.card-filter {
  margin-bottom: 20px;
  margin-top: 20px;
}
.sort {
  margin-right: 20px;
}
</style>
