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
                <v-btn color="#A42523" text @click="clearForm">
                  ล้างข้อมูลที่กรอก
                </v-btn>
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
        <v-text-field
          v-model="NamefilterValue"
          prepend-icon="mdi-magnify"
          type="text"
          label="กรองด้วยชื่อ"
          class="filter"
          clearable
        ></v-text-field>
        <!-- Filter for  building-->
        <v-select
          v-model="buildingFilterValue"
          prepend-icon="mdi-room-service"
          label="ค้นหาด้วยอาคาร"
          class="filter"
          :items="buildings"
          clearable
        >
        </v-select>
        <!-- Filter for  roomnumber-->
        <v-select
          v-model="roomFilterValue"
          prepend-icon="mdi-room-service"
          label="ค้นหาด้วยห้อง"
          class="filter"
          :items="rooms"
          clearable
        >
        </v-select>

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
              @click="$refs.dialog.savea(dateFilterValue)"
            >
              ยืนยัน
            </v-btn>
          </v-date-picker>
        </v-dialog>
        <!-- Filter for  status-->
        <v-select
          v-model="stateFilterValue"
          :items="statuses"
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
    modal: false,
    dialog: false,
    emailtarget: "",
    importExcel: false,
    exportExcelElectric: false,
    dateExport: new Date().toISOString().substr(0, 7),
    exportDataelectric: ["1", "2", "3", "4", "5"],
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
    // sumprice not finnnn
    sumPrice() {
      return this.editedItem.price * 2 + this.editedItem.price * 0.07;
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
.button-filter {
  margin: 10px;
}
</style>
