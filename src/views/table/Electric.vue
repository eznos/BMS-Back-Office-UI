<template>
  <v-app id="app">
    <!-- title and button -->
    <div class="pa-3 content background-main">
      <v-row justify="space-between" class="px-3">
        <!-- title -->
        <div class="mb-4">
          <v-row style="align-items: center">
            <div class="ml-3 mt-2">
              <h2>ตารางค่าไฟฟ้า</h2>
            </div>
          </v-row>
        </div>
        <!-- button -->
        <div>
          <!-- add user -->
          <v-dialog v-model="dialog" persistent max-width="75%">
            <template v-slot:activator="{ on: attrs }">
              <v-btn
                class="button-filter"
                color="agree"
                dark
                v-on="{ ...attrs }"
              >
                <v-icon> mdi-account-plus </v-icon>
                เพิ่มผู้ใช้ไฟฟ้า
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <!-- title add user -->
                <span>{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <!-- form add user -->
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                      <!-- rank -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.rank"
                          label="ยศ"
                          required
                          autofocus
                          :rules="rules.name"
                        ></v-text-field>
                      </v-col>
                      <!-- name -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.name"
                          label="ชื่อ-นามสกุล"
                          required
                          :rules="rules.name"
                        ></v-text-field>
                      </v-col>
                      <!-- building -->
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          label="อาคาร"
                          :items="buildings"
                          required
                          :rules="rules.buildingRoom"
                          v-model="editedItem.building"
                        >
                        </v-autocomplete>
                      </v-col>
                      <!-- room  -->
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          label="เลขห้องพัก"
                          v-model="editedItem.room_no"
                          :items="rooms"
                          required
                          :rules="rules.buildingRoom"
                        >
                        </v-autocomplete>
                      </v-col>
                      <!-- electricNumber -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.electric_no"
                          label="เลขผู้ใช้ไฟฟ้า"
                          required
                          counter="12"
                          :rules="rules.electricNumber"
                          @keypress="isNumber($event)"
                        ></v-text-field>
                      </v-col>
                      <!-- electricMeterNumber -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.electirc_meter_no"
                          label="เลขมิเตอร์ไฟฟ้า"
                          required
                          counter="11"
                          :rules="rules.electricMeterNumber"
                          @keypress="isNumber($event)"
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
                        >
                        </v-select>
                      </v-col>
                      <!-- date pay -->
                      <v-col cols="12" sm="6" md="4">
                        <v-dialog
                          ref="dialog"
                          v-model="modal"
                          persistent
                          width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="editedItem.date_pay"
                              label="กรองด้วยเดือน"
                              prepend-icon="mdi-calendar"
                              readonly
                              required
                              :rules="rules.buildingRoom"
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="editedItem.date_pay"
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
                              @click="$refs.dialog.save(editedItem.date_pay)"
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
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-btn color="#A42523" text @click="clearForm">
                    ล้างข้อมูลที่กรอก
                  </v-btn>
                  <v-btn color="warning" text @click="close"> ยกเลิก </v-btn>
                  <v-btn color="agree" :disabled="!valid" text @click="save">
                    ยืนยัน
                  </v-btn>
                </v-form>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- delete water user -->
          <v-dialog v-model="dialogDelete" max-width="75%">
            <v-card>
              <v-card-title class="text-h5"
                >ต้องการลบผู้ใช้ไฟฟ้าคนนี้หรือไม่?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >ยกเลิก</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >ยืนยัน</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- delete as selected -->
          <v-btn
            dark
            color="#742872"
            width="140"
            v-bind="attrs"
            v-on="on"
            @click="clear"
            class="button-filter"
          >
            <v-icon>mdi-delete-sweep</v-icon>
            ลบข้อมูลที่เลือก
          </v-btn>
          <!-- import excel -->
          <v-dialog v-model="importExcel" max-width="75%">
            <template v-slot:activator="{ on: attrs }">
              <v-btn
                class="button-filter"
                color="agree"
                dark
                v-on="{ ...attrs }"
              >
                <v-icon> mdi-account-plus </v-icon>
                import ข้อมูล Excel
              </v-btn>
            </template>
            <v-card>
              <v-card-title> นำเข้าข้อมูล Excel </v-card-title>
              <v-card-text>
                <v-file-input
                  label="เลือกไฟล์ Excel ที่ต้องการ"
                  counter
                  multiple
                  show-size
                  :rules="rules.fotmat"
                  type="file"
                  accept=".xlsx, .xlsm, .xlsb, .xltx, .xltm,  .xls,  .xla,"
                ></v-file-input>
              </v-card-text>
              <v-card-actions>
                <v-btn color="agree" @click="importExcel = false"> ok </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- export excel to email -->
          <v-dialog v-model="exportExcelElectric" persistent max-width="75%">
            <template v-slot:activator="{ on: attrs }">
              <v-btn color="#1572A1" class="filter" dark v-on="{ ...attrs }">
                <v-icon> mdi-file-export-outline </v-icon>
                Export ข้อมูล Excel
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                ส่งออกข้อมูล Excel ของค่าไฟฟ้าไปยังอีเมลที่ต้องการ
              </v-card-title>
              <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-row>
                    <!-- date -->
                    <v-col cols="12">
                      <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="70%"
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="dateExport"
                            label="เลือกเดือนที่ต้องการ Export"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="dateExport"
                          type="month"
                          no-title
                          scrollable
                        >
                          <v-spacer></v-spacer>
                          <v-btn text color="primary" @click="menu = false">
                            Cancel
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.menu.save(date)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <!-- email -->
                    <v-col cols="12">
                      <v-text-field
                        label="อีเมลผู้รับ"
                        autofocus
                        :rules="[rules.email.regex]"
                        v-model="emailtarget"
                        prepend-icon="mdi-at"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-btn
                    color="warning"
                    text
                    @click="exportExcelElectric = false"
                  >
                    ยกเลิก
                  </v-btn>
                  <v-btn
                    color="agree"
                    :disabled="!valid"
                    text
                    @click="exportExcelElectric = false"
                  >
                    ยืนยันข้อมูล
                  </v-btn>
                </v-form>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-row>
      <!-- filter -->
      <v-row justify="space-between" class="px-3">
        <!-- Filter for  name-->
        <v-col cols="12" xs="12" sm="12" md="3" lg="2">
          <v-text-field
            v-model="NamefilterValue"
            prepend-icon="mdi-magnify"
            type="text"
            label="กรองด้วยชื่อ"
            class="filter"
            clearable
          ></v-text-field>
        </v-col>
        <!-- Filter for  building-->
        <v-col cols="12" xs="12" sm="12" md="3" lg="2">
          <v-select
            v-model="buildingFilterValue"
            prepend-icon="mdi-room-service"
            label="ค้นหาด้วยอาคาร"
            class="filter"
            :items="buildings"
            clearable
          >
          </v-select>
        </v-col>
        <!-- Filter for  roomnumber-->
        <v-col cols="12" xs="12" sm="12" md="3" lg="2">
          <v-select
            v-model="roomFilterValue"
            prepend-icon="mdi-room-service"
            label="ค้นหาด้วยห้อง"
            class="filter"
            :items="rooms"
            clearable
          >
          </v-select>
        </v-col>
        <!-- filter by date -->
        <v-col cols="12" xs="12" sm="12" md="3" lg="2">
          <v-dialog
            ref="dialog"
            v-model="modal"
            :return-value.sync="date"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                label="กรองด้วยเดือน"
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
            >
              <v-spacer></v-spacer>
              <v-btn text color="warning" @click="modal = false">
                ยกเลิก
              </v-btn>
              <v-btn
                text
                color="agree"
                @click="$refs.dialog.savea(dateFilterValue)"
              >
                ยืนยัน
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <!-- Filter for  status-->
        <v-col cols="12" xs="12" sm="12" md="3" lg="2">
          <v-select
            v-model="stateFilterValue"
            :items="statuses"
            prepend-icon="mdi-list-status"
            label="กรองด้วยสถานะ"
            class="filter"
            clearable
          ></v-select>
        </v-col>
        <!-- Filter for  something-->
        <v-col cols="12" xs="12" sm="12" md="3" lg="2">
          <v-select
            v-model="stateFilterValue"
            :items="statuses"
            prepend-icon="mdi-list-status"
            label="กรองด้วยสถานะ"
            class="filter"
            clearable
          ></v-select>
        </v-col>
      </v-row>
    </div>
    <!-- start data-table -->
    <v-data-table
      :headers="headers"
      :items="electric"
      item-key="name"
      :items-per-page="5"
      class="elevation-1 pa-6"
      :search="search"
      loading
      loading-text="กำลังโหลด... โปรดรอสักครู่"
      show-select
    >
      <!-- data -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
    <!-- end data-table -->
  </v-app>
</template>

<script>
export default {
  data: () => ({
    el: "#app",
    valid: true,
    modal: false,
    dialog: false,
    emailtarget: "",
    importExcel: false,
    exportExcelElectric: false,
    dateExport: new Date().toISOString().substr(0, 7),
    menu: false,
    search: "",
    building: null,
    room_no: null,
    dialogDelete: false,
    // Filter models.
    NamefilterValue: "",
    buildingFilterValue: "",
    roomFilterValue: "",
    dateFilterValue: "",
    date: "",
    stateFilterValue: "",
    statuses: ["Approve", "Non Approve"],
    electric: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      room_no: "",
      electric_no: "",
      electirc_meter_no: "",
      status: "Non Approve",
    },
    defaultItem: {
      name: "",
      room_no: "",
      electric_no: "",
      electirc_meter_no: "",
      status: "",
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
      เขตสุระ: [
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
        },
        {
          text: "ชื่อ-นามสกุล",
          value: "name",
          filter: this.nameFilter,
        },
        {
          text: "อาคาร",
          value: "building",
          filter: this.buildingFilter,
        },
        {
          text: "เลขห้องพัก",
          value: "room_no",
          filter: this.roomFilter,
        },
        {
          text: "เลขผู้ใช้ไฟฟ้า",
          value: "electric_no",
        },
        {
          text: "เลขมิเตอร์ไฟฟ้า",
          value: "electirc_meter_no",
        },
        {
          text: "รอบบิล",
          value: "date_pay",
          filter: this.dateFilter,
        },
        {
          text: "ค่าไฟฟ้า",
          value: "price",
        },
        {
          text: "ค่าไฟฟ้ารวม",
          value: this.sumPrice,
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
    // autocomplete
    buildings() {
      return Object.keys(this.buildingsRooms);
    },
    rooms() {
      if (this.buildingFilterValue) {
        return this.buildingsRooms[this.buildingFilterValue];
      }
      if (!this.editedItem.building) {
        return "ไม่มีข้อมูล";
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

  methods: {
    nameFilter(value) {
      // If this filter has no value we just skip the entire filter.
      if (!this.NamefilterValue) {
        return true;
      }
      // Check if the current loop value (The dessert name)
      // partially contains the searched word.
      return value.toLowerCase().includes(this.NamefilterValue.toLowerCase());
    },
    roomFilter(value) {
      if (!this.roomFilterValue) {
        return true;
      }
      return value === this.roomFilterValue;
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
      this.editedIndex = this.electric.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.electric.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.electric.splice(this.editedIndex, 1);
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
        Object.assign(this.electric[this.editedIndex], this.editedItem);
      } else {
        this.electric.push(this.editedItem);
      }
      this.close();
    },
    savea() {
      if (this.editedIndex > -1) {
        Object.assign(this.electric[this.editedIndex], this.editedItem);
      } else {
        this.electric.push(this.editedItem);
      }
      this.close();
    },
    // clear form
    clearForm() {
      // this.$refs.form.reset();
      (this.editedItem.rank = ""),
        (this.editedItem.name = null),
        (this.editedItem.electric_no = null),
        (this.editedItem.zone = ""),
        (this.editedItem.building = ""),
        (this.editedItem.room_no = ""),
        (this.editedItem.electirc_meter_no = null),
        (this.editedItem.price = null),
        (this.editedItem.date_pay = null),
        (this.editedItem.status = null);
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
.filter {
  padding: 5px;
}
.button-filter {
  margin: 10px;
}
</style>
