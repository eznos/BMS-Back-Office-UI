<template>
  <v-app id="app">
    <!-- title and button -->
    <div class="pa-3 content background-main">
      <v-row justify="space-between" class="px-3">
        <!-- title -->
        <div class="mb-4">
          <v-row style="align-items: center">
            <div class="ml-3 mt-2">
              <h2>ตารางค่าน้ำประปา</h2>
            </div>
          </v-row>
        </div>
        <!-- button -->
        <div>
          <!-- water diff_price_cal ยังไม่เสร็จจร้าาาา -->
          <v-dialog
            v-model="differencePriceCalculate"
            persistent
            max-width="70%"
          >
            <template v-slot:activator="{ on: attrs }">
              <v-btn
                class="button-filter rounded-lg"
                color="agree"
                dark
                v-on="{ ...attrs }"
              >
                <v-icon> mdi-calculator </v-icon>
                คำนวนค่าน้ำส่วนต่าง
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <v-icon> mdi-calculator </v-icon> &nbsp;
                คำนวนค่าน้ำส่วนต่าง</v-card-title
              >
              <v-card-text>
                <v-row>
                  <v-col cols="4">
                    <v-autocomplete
                      v-model="zonesCalculate"
                      label="โซนพื้นที่ของอาคารบ้านพัก"
                      :items="zones"
                      prepend-icon="mdi-map-legend"
                      clearable
                      autofocus
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="4">
                    <v-select
                      v-model="buildingsCalculate"
                      label="อาคารบ้านพัก"
                      :items="buildings"
                      prepend-icon="mdi-map-legend"
                      clearable
                    >
                    </v-select>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                      v-model.number="editedItem.meterZone"
                      label="ค่าน้ำจากมิเตอร์ใหญ่"
                      prepend-icon="mdi-car-speed-limiter"
                      clearable
                      @keypress="isNumber($event)"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                      v-model.number="editedItem.meterSum"
                      label="ค่าน้ำที่จดได้"
                      prepend-icon="mdi-gauge"
                      clearable
                      @keypress="isNumber($event)"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-output-text label="" v-model="editedItem.total">
                      ค่าน้ำส่วนต่าง {{ total }} บาท
                    </v-output-text>
                  </v-col>
                </v-row>
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
                  text
                  @click="differencePriceCalculate = false"
                  >ยืนยันข้อมูล</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
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
                เพิ่มผู้ใช้น้ำ
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
                          v-model="editedItem.rank"
                          label="ยศ"
                          autofocus
                          required
                          :rules="rules.buildingRoom"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.name"
                          label="ชื่อ-นามสกุล"
                          required
                          :rules="rules.name"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          label="พื้นที่เขต"
                          v-model="editedItem.zone"
                          :items="zones"
                          :rules="rules.buildingRoom"
                        >
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          label="อาคาร"
                          v-model="editedItem.building"
                          :items="buildings"
                          :rules="rules.buildingRoom"
                        >
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          label="เลขห้องพัก"
                          v-model="editedItem.room"
                          :items="rooms"
                          :rules="rules.buildingRoom"
                          @keypress="isNumber($event)"
                        >
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.water_no"
                          label="เลขผู้ใช้น้ำ"
                          @keypress="isNumber($event)"
                          required
                          :rules="rules.waterNumber"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.water_meter_no"
                          label="เลขมิเตอร์น้ำ"
                          @keypress="isNumber($event)"
                          required
                          :rules="rules.waterMeterNumber"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.price"
                          label="ค่าน้ำ"
                          @keypress="isNumber($event)"
                          required
                          :rules="rules.buildingRoom"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.total"
                          label="ค่าน้ำส่วนต่าง"
                          disabled
                          value="this.place"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          v-model="editedItem.status"
                          :items="state"
                          label="สถานะ"
                          required
                          :rules="rules.buildingRoom"
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
                              v-model="editedItem.date_pay"
                              label="รอบบิล"
                              prepend-icon="mdi-calendar"
                              readonly
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
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-btn color="warning" text @click="close"> ยกเลิก </v-btn>
                  <v-btn color="agree" :disabled="!valid" text @click="save">
                    ยืนยัน
                  </v-btn></v-form
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- delete water user -->
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >ต้องการลบผู้ใช้น้ำคนนี้หรือไม่?</v-card-title
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
          <!-- delate filter -->
          <v-btn
            dark
            class="filter"
            color="#561F55"
            v-bind="attrs"
            v-on="on"
            @click="clear"
          >
            <v-icon>mdi-delete</v-icon>
            ลบการค้นหา
          </v-btn>
          <!-- import excel -->
          <v-dialog v-model="importExcel" max-width="500px">
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
          <v-dialog v-model="exportExcelwater" max-width="500px">
            <template v-slot:activator="{ on: attrs }">
              <v-btn color="#1572A1" class="filter" dark v-on="{ ...attrs }">
                <v-icon> mdi-file-export-outline </v-icon>
                Export ข้อมูล Excel
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                ส่งออกข้อมูล Excel ของค่าน้ำประปาไปยังอีเมลที่ต้องการ
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-select
                      label="เลือกข้อมูลที่ต้องการส่งออก"
                      :items="exportData"
                      prepend-icon="mdi-file-excel"
                    >
                    </v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      label="อีเมลผู้รับ"
                      :rules="[rules.email.regex]"
                      v-model="emailtarget"
                      prepend-icon="mdi-at"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-btn color="agree" @click="exportExcelwater = false">
                  ok
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-row>
      <!-- filter -->
      <v-row justify="space-between" class="px-3">
        <!-- Filter for  name-->
        <v-text-field
          v-model="NamefilterValue"
          prepend-icon="mdi-magnify"
          type="text"
          label="กรองด้วยชื่อ"
          class="filter"
          clearable
        ></v-text-field>
        <!-- Filter for  roomnumber-->
        <v-text-field
          v-model="roomFilterValue"
          prepend-icon="mdi-room-service"
          type="text"
          label="กรองด้วยเลขห้อง"
          class="filter"
          clearable
        ></v-text-field>
        <!-- filter by date -->
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
          <v-date-picker v-model="dateFilterValue" type="month" locale="th-TH">
            <v-spacer></v-spacer>
            <v-btn text color="warning" @click="modal = false"> ยกเลิก </v-btn>
            <v-btn
              text
              color="agree"
              @click="$refs.dialog.save(dateFilterValue)"
            >
              ยืนยัน
            </v-btn>
          </v-date-picker>
        </v-dialog>
        <!-- Filter for  status-->
        <v-select
          v-model="stateFilterValue"
          :items="state"
          prepend-icon="mdi-list-status"
          label="กรองด้วยสถานะ"
          class="filter"
          clearable
        ></v-select>
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
    meterSum: "",
    meterZone: "",
    modal: false,
    zonesCalculate: "",
    buildingsCalculate: "",
    dialog: false,
    emailtarget: "",
    differencePriceCalculate: false,
    importExcel: false,
    exportExcelwater: false,
    menu: false,
    zonesBuildings: {
      เขตส่วนกลาง: ["2/11", "2/12"],
      เขตสุระ: ["21/120"],
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
        "301",
        "302",
        "303",
      ],
      "21/99": ["1100", "1012", "1413"],
      "21/120": ["101", "120", "130"],
      "21/123": ["110", "102", "103"],
    },
    search: "",
    direction: "bottom",
    dialogDelete: false,
    // Filter models.
    NamefilterValue: "",
    roomFilterValue: "",
    dateFilterValue: "",
    date: "",
    exportData: ["1", "2", "3", "4", "5"],
    stateFilterValue: "",
    state: ["Approve", "Non Approve"],
    electric: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      room: "",
      water_no: "",
      water_meter_no: "",
      status: "Non Approve",
    },
    defaultItem: {
      name: "",
      room: "",
      water_no: "",
      water_meter_no: "",
      status: "Non Approve",
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
          text: "ชื่อ-นามสกุล",
          value: "name",
          filter: this.nameFilter,
        },
        {
          text: "อาคาร",
          value: "building",
        },
        {
          text: "เลขห้องพัก",
          value: "room",
          filter: this.roomFilter,
        },
        {
          text: "เลขผู้ใช้น้ำ",
          value: "water_no",
        },
        {
          text: "เลขมิเตอร์น้ำ",
          value: "water_meter_no",
        },
        {
          text: "รอบบิล",
          value: "date_pay",
          filter: this.dateFilter,
        },
        {
          text: "ค่าน้ำ",
          value: "price",
        },
        {
          text: "ค่าน้ำส่วนต่าง",
          value:
            parseInt(this.editedItem.meterSum) -
            parseInt(this.editedItem.meterZone),
        },
        {
          text: "ค่าน้ำรวม",
          value: "sum_price",
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
    total: function () {
      return (
        parseInt(this.editedItem.meterSum) - parseInt(this.editedItem.meterZone)
      );
    },
    // autocomplete
    zones() {
      return Object.keys(this.zonesBuildings);
    },
    buildings() {
      // zonesCalculate
      // autocomplete in filter
      if (this.zonesCalculate) {
        return this.zonesBuildings[this.zonesCalculate];
      }
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
}
.filter {
  padding: 10px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
