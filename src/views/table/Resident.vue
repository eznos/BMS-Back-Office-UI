<template>
  <v-app id="app">
    <!-- title and button -->
    <div class="pa-3 content background-main">
      <v-row justify="space-between" class="px-3">
        <!-- title -->
        <div class="mb-4">
          <v-row style="align-items: center">
            <div class="ml-3 mt-2">
              <h2>ตารางผู้อยู่อาศัย</h2>
            </div>
          </v-row>
        </div>
        <!-- button -->
        <div>
          <!-- add user -->
          <v-dialog v-model="dialog" persistent max-width="75%">
            <template v-slot:activator="{ on: attrs }">
              <v-btn color="agree" class="filter" dark v-on="{ ...attrs }">
                <v-icon> mdi-account-plus </v-icon>
                เพิ่มผู้อยู่อาศัย
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span>{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.fristName"
                          label="ชื่อ"
                          autofocus
                          required
                          :rules="rules.nameRules"
                          clearable
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.lastName"
                          label="นามสกุล"
                          required
                          :rules="rules.nameRules"
                          clearable
                        ></v-text-field>
                      </v-col>
                     
                      <!-- zone -->
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          v-model="editedItem.zone"
                          label="พื้นที่"
                          required
                          :items="zones"
                          :rules="rules.buildingRoom"
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
                          :rules="rules.buildingRoom"
                          clearable
                        >
                        </v-autocomplete>
                      </v-col>
                      <!-- room -->
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          v-model="editedItem.roomNumber"
                          label="เลขห้องพัก"
                          required
                          @keypress="isNumber($event)"
                          :items="rooms"
                          :rules="rules.buildingRoom"
                          clearable
                        >
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.electric_no"
                          label="เลขผู้ใช้ไฟฟ้า"
                          @keypress="isNumber($event)"
                          clearable
                          required
                          counter="12"
                          :rules="rules.electricNumber"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.electric_meter_no"
                          label="เลขมิเตอร์ไฟฟ้า"
                          @keypress="isNumber($event)"
                          clearable
                          required
                          counter="11"
                          :rules="rules.electricMeterNumber"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.water_no"
                          label="เลขผู้ใช้น้ำประปา"
                          @keypress="isNumber($event)"
                          clearable
                          required
                          counter="4"
                          :rules="rules.waterNumber"
                        ></v-text-field>
                      </v-col>
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
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-btn large color="error" text @click="clearForm">
                  ล้างข้อมูลที่กรอก
                </v-btn>
                <v-spacer></v-spacer>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-btn color="blue darken-1" text @click="close">
                    ยกเลิก
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    :disabled="!valid"
                    text
                    @click="save"
                  >
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
            class="filter"
          >
            <v-icon>mdi-delete-sweep</v-icon>
            ลบข้อมูลที่เลือก
          </v-btn>
          <!-- import excel -->
          <v-dialog v-model="importExcel" max-width="75%">
            <template v-slot:activator="{ on: attrs }">
              <v-btn color="agree" class="filter" dark v-on="{ ...attrs }">
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
                <v-spacer></v-spacer>
                <v-btn color="agree" @click="importExcel = false">
                  ยืนยัน
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-row>
      <!-- filter -->
      <v-row justify="space-between" class="px-3">
        <!-- Filter for  name-->
        <v-col cols="12" xs="12" sm="12" md="3" lg="3">
          <v-text-field
            v-model="search"
            prepend-icon="mdi-magnify"
            type="text"
            label="ค้นหาด้วยชื่อ"
            class="filter"
            clearable
          ></v-text-field>
        </v-col>
        <!-- filter for zone -->
        <v-col cols="12" xs="12" sm="12" md="3" lg="3">
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
        <v-col cols="12" xs="12" sm="12" md="3" lg="3">
          <v-autocomplete
            class="filter"
            prepend-icon="mdi-office-building"
            v-model="buildingFilterValue"
            :items="buildings"
            label="ค้นหาด้วยอาคาร"
            clearable
          >
          </v-autocomplete>
        </v-col>
        <!-- Filter for  roomnumber-->
        <v-col cols="12" xs="12" sm="12" md="3" lg="3">
          <v-autocomplete
            class="filter"
            prepend-icon="mdi-room-service"
            v-model="roomFilterValue"
            :items="rooms"
            label="ค้นหาด้วยเลขห้อง"
            clearable
          >
          </v-autocomplete>
        </v-col>
      </v-row>
    </div>
    <!-- start data-table -->
    <v-data-table
      :headers="headers"
      :items="resident"
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
        <v-icon class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon @click="deleteItem(item)"> mdi-delete </v-icon>
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
    importExcel: false,
    menu: false,
    search: "",
    direction: "bottom",
    dialogDelete: false,
    // Filter models.
    NamefilterValue: "",

    dateFilterValue: "",
    zoneFilterValue: "",
    buildingFilterValue: "",
    roomFilterValue: "",
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
    date: "",
    resident: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      room_no: "",
      electric_no: "",
      water_meter_no: "",
      status: "Non Approve",
    },
    defaultItem: {
      name: "",
      room_no: "",
      electric_no: "",
      water_meter_no: "",
      status: "",
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
          text: "ID",
          align: "left",
          value: "user_id",
        },
        {
          text: "ชื่อ",
          value: "fristName",
        },
        {
          text: "นามสกุล",
          value: "lastName",
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
          value: "roomNumber",
          filter: this.roomFilter,
        },
        {
          text: "เลขผู้ใช้ไฟฟ้า",
          value: "electric_no",
          filter: this.filterOnlyCapsText,
        },
        {
          text: "เลขผู้ใช้น้ำ",
          value: "water_no",
        },
        {
          text: "เลขมิเตอร์ไฟฟ้า",
          value: "electric_meter_no",
        },
        {
          text: "เลขมิเตอร์น้ำประปา",
          value: "water_meter_no",
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
        return "ไม่มีข้อมูล";
      } else {
        return this.zonesBuildings[this.editedItem.zone];
      }
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
      if (!this.NamefilterValue) {
        return true;
      }
      return value.toLowerCase().includes(this.NamefilterValue.toLowerCase());
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
    // roomFilter
    roomFilter(value) {
      if (!this.roomFilterValue) {
        return true;
      }
      return value === this.roomFilterValue;
    },
    editItem(item) {
      this.editedIndex = this.resident.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.resident.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.resident.splice(this.editedIndex, 1);
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
        Object.assign(this.resident[this.editedIndex], this.editedItem);
      } else {
        this.resident.push(this.editedItem);
      }
      this.close();
    },
    savea() {
      if (this.editedIndex > -1) {
        Object.assign(this.resident[this.editedIndex], this.editedItem);
      } else {
        this.resident.push(this.editedItem);
      }
      this.close();
    },
    clear() {
      (this.NamefilterValue = ""),
        (this.roomFilterValue = ""),
        (this.stateFilterValue = ""),
        (this.dateFilterValue = "");
      this.date = "";
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
    // clear form add user
    clearForm() {
      // this.$refs.form.reset();
      (this.editedItem.fristName = null),
        (this.editedItem.lastName = null),
        (this.editedItem.electric_no = null),
        (this.editedItem.water_no = null),
        (this.editedItem.zone = ""),
        (this.editedItem.building = ""),
        (this.editedItem.room = ""),
        (this.editedItem.electric_meter_no = null),
        (this.editedItem.water_meter_no = null);
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
.filter {
  padding: 10px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
