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
          <v-dialog v-model="dialog" persistent max-width="500px">
            <template v-slot:activator="{ on: attrs }">
              <v-btn color="agree" dark v-on="{ ...attrs }">
                <v-icon> mdi-account-plus </v-icon>
                เพิ่มผู้อยู่อาศัย
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <div class="myFont">
                  <span>{{ formTitle }}</span>
                </div>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.name"
                        label="ชื่อ-นามสกุล"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.room_no"
                        label="เลขห้องพัก"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.electric_no"
                        label="เลขผู้ใช้ไฟฟ้า"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.water_meter_no"
                        label="เลขมิเตอร์ไฟฟ้า"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.price"
                        label="ค่าไฟฟ้า"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.status"
                        :items="state"
                        label="สถานะ"
                      >
                      </v-select>
                    </v-col>
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
                      </v-dialog></v-col
                    >
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  ยกเลิก
                </v-btn>
                <v-btn color="blue darken-1" text @click="save"> ยืนยัน </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- delete water user -->
          <v-dialog v-model="dialogDelete" max-width="500px">
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
            class="ml-2"
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
            <v-icon>mdi-tune-variant</v-icon>
            ลบการค้นหา
          </v-btn>
          <!-- import excel -->
          <v-dialog v-model="importExcel" max-width="500px">
            <template v-slot:activator="{ on: attrs }">
              <v-btn color="agree" dark v-on="{ ...attrs }">
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
    valid: false,
    modal: false,
    dialog: false,
    importExcel: false,
    menu: false,
    search: "",
    direction: "bottom",
    dialogDelete: false,
    // Filter models.
    NamefilterValue: "",
    roomFilterValue: "",
    dateFilterValue: "",
    date: "",
    stateFilterValue: "",
    state: ["Approve", "Non Approve"],
    electric: [],
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
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "เพิ่มผู้อยู่อาศัย" : "แก้ไขผู้อยู่อาศัย";
    },
    headers() {
      return [
        {
          text: "ID",
          align: "left",
          value: "user_id",
        },
        {
          text: "ชื่อ-นามสกุล",
          value: "name",
          // filter: this.nameFilter,
        },
        {
          text: "เลขห้องพัก",
          value: "room_no",
        },
        {
          text: "พื้นที่",
          value: "zone",
          filter: this.roomFilter,
        },
        {
          text: "อาคาร",
          value: "building",
          // filter: this.roomFilter,
        },
        {
          text: "เลขผู้ใช้ไฟฟ้า",
          value: "electric_no",
          // filter: this.roomFilter,
        },
        {
          text: "เลขผู้ใช้น้ำ",
          value: "water_no",
          // filter: this.roomFilter,
        },
        {
          text: "เลขมิเตอร์ไฟฟ้า",
          value: "electric_meter_no",
          // filter: this.roomFilter,
        },
        {
          text: "เลขมิเตอร์น้ำประปา",
          value: "water_meter_no",
          // filter: this.roomFilter,
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

  methods: {
    /**
     * Filter for dessert names column.
     * @param value Value to be tested.
     * @returns {boolean}
     */
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
    /**
     * Filter for เลขห้องพัก column.
     * @param value Value to be tested.
     * @returns {boolean}
     */
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
