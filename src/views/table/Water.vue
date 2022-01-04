<template>
  <v-app id="app">
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
      <template v-slot:top>
        <!-- v-container, v-col and v-row are just for decoration purposes. -->
        <v-toolbar flat>
          <v-toolbar-title>
            <div class="title-table">ตารางค่าน้ำ</div>
          </v-toolbar-title>
          <v-form v-model="valid">
            <v-row>
              <v-col cols="2">
                <v-row class="pa-6">
                  <!-- Filter for  name-->
                  <v-text-field
                    v-model="NamefilterValue"
                    prepend-icon="mdi-magnify"
                    type="text"
                    label="กรองด้วยชื่อ"
                  ></v-text-field>
                </v-row>
              </v-col>
              <v-col cols="2">
                <v-row class="pa-6">
                  <!-- Filter for  roomnumber-->
                  <v-text-field
                    v-model="roomFilterValue"
                    prepend-icon="mdi-room-service"
                    type="text"
                    label="กรองด้วยเลขห้อง"
                  ></v-text-field>
                </v-row>
              </v-col>
              <v-col cols="2">
                <v-row class="pa-6">
                  <!-- Filter for  status-->
                  <v-select
                    v-model="stateFilterValue"
                    :items="state"
                    prepend-icon="mdi-list-status"
                    label="กรองด้วยสถานะ"
                  ></v-select>
                </v-row>
              </v-col>
              <!-- Filter for  date-->
              <v-col cols="2">
                <v-row class="pa-6">
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
                        @click="$refs.dialog.save(dateFilterValue)"
                      >
                        ยืนยัน
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-row>
              </v-col>
             
              <!-- add new user -->
              <v-col cols="1">
                <v-row class="pa-6">
                  <v-dialog v-model="dialog" persistent max-width="500px">
                    <template v-slot:activator="{ on: attrs }">
                      <v-tooltip top color="agree">
                        <template v-slot:activator="{ on: tooltip }">
                          <v-btn
                            color="agree"
                            dark
                            v-on="{ ...tooltip, ...attrs }"
                          >
                            <v-icon> mdi-account-plus </v-icon>
                          </v-btn>
                        </template>
                        <span>เพิ่มข้อมูลผู้ใช้น้ำ</span>
                      </v-tooltip>
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
                                v-model="editedItem.water_no"
                                label="เลขผู้ใช้น้ำ"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="editedItem.water_meter_no"
                                label="เลขมิเตอร์น้ำ"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="editedItem.price"
                                label="ค่าน้ำ"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="editedItem.diff_price"
                                label="ค่าน้ำส่วนต่าง"
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
                                  <v-btn
                                    text
                                    color="warning"
                                    @click="modal = false"
                                  >
                                    ยกเลิก
                                  </v-btn>
                                  <v-btn
                                    text
                                    color="agree"
                                    @click="
                                      $refs.dialog.save(editedItem.date_pay)
                                    "
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
                        <v-btn color="blue darken-1" text @click="save">
                          ยืนยัน
                        </v-btn>
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
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="deleteItemConfirm"
                          >ยืนยัน</v-btn
                        >
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-row>
              </v-col>
               <!-- delete as selected -->
              <v-col cols="1">
                <v-row class="pa-6">
                  <v-tooltip top color="red">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        dark
                        color="red"
                        v-bind="attrs"
                        v-on="on"
                        @click="clear"
                      >
                        <v-icon>mdi-delete-sweep</v-icon>
                      </v-btn>
                    </template>
                    <span>ลบข้อมูลตามที่เลือก</span>
                  </v-tooltip>
                </v-row>
              </v-col>
              <!-- delete data filter -->
              <v-col cols="1">
                <v-row class="pa-6">
                  <v-tooltip top color="warning">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        dark
                        color="warning"
                        v-bind="attrs"
                        v-on="on"
                        @click="clear"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                    <span>ลบการกรองข้อมูล</span>
                  </v-tooltip>
                </v-row>
              </v-col>
            </v-row>
          </v-form>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    el: "#app",
    valid: false,
    modal: false,
    dialog: false,
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
      water_no: "",
      water_meter_no: "",
      status: "Non Approve",
    },
    defaultItem: {
      name: "",
      room_no: "",
      water_no: "",
      water_meter_no: "",
      status: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "เพิ่มผู้ใช้น้ำ" : "แก้ไขผู้ใช้น้ำ";
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
          text: "เลขห้องพัก",
          value: "room_no",
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
          value: "diff_price",
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
</style>
