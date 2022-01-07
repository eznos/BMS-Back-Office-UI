<template>
  <v-app id="app">
    <!-- start data-table -->
    <v-data-table
      :headers="headers"
      :items="residents"
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
            <div class="title-table">ตารางผู้อยู่อาศัย</div>
          </v-toolbar-title>
          <v-form v-model="valid">
            <v-row>
              <v-col cols="3">
                <v-row class="pa-6">
                  <!-- Filter for  name-->
                  <v-text-field
                    v-model="search"
                    prepend-icon="mdi-magnify"
                    type="text"
                    label="ค้นหา"
                  ></v-text-field>
                </v-row>
              </v-col>
              <!-- Filter for  zone-->
              <v-col cols="3">
                <v-row class="pa-6">
                  <v-text-field
                    v-model="zoneFilterValue"
                    prepend-icon="mdi-map-marker-radius"
                    type="text"
                    label="กรองด้วยพื้นที่"
                  ></v-text-field>
                </v-row>
              </v-col>
              <!-- Filter for  zone-->
              <v-col cols="3">
                <v-row class="pa-6">
                  <v-text-field
                    v-model="zoneFilterValue"
                    prepend-icon="mdi-office-building-marker"
                    type="text"
                    label="กรองด้วยอาคาร"
                  ></v-text-field>
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
                        <span>เพิ่มข้อมูลผู้อยู่อาศัย</span>
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
                              <v-select
                                v-model="editedItem.building"
                                :items="building"
                                label="อาคาร"
                              >
                              </v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-select
                                v-model="editedItem.zone"
                                :items="zone"
                                label="พื้นที่"
                              >
                              </v-select>
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
                                v-model="editedItem.electric_no"
                                label="เลขผู้ใช้ไฟฟ้า"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="editedItem.electric_meter_no"
                                label="เลขมิเตอร์ไฟฟา้"
                              ></v-text-field>
                            </v-col>
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
                        >ต้องการลบผู้อยู่อาศัยคนนี้หรือไม่?</v-card-title
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
    menu: false,
    zone: ["1", "2", "3", "4", "5"],
    building: ["อาคาร1", "อาคาร2", "อาคาร3", "อาคาร4", "อาคาร5", "อาคาร6"],
    search: "",
    direction: "bottom",
    dialogDelete: false,
    // Filter models.
    NamefilterValue: "",
    zoneFilterValue: "",
    residents: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      room_no: "",
      water_no: "",
      water_meter_no: "",
      status: "ว่าง",
    },
    defaultItem: {
      name: "",
      room_no: "",
      water_no: "",
      water_meter_no: "",
      status: "ว่าง",
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
      if (!this.zoneFilterValue) {
        return true;
      }
      return value === this.zoneFilterValue;
    },

    /**
     * Filter for เลขห้องพัก column.
     * @param value Value to be tested.
     * @returns {boolean}
     */

    editItem(item) {
      this.editedIndex = this.residents.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.residents.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.residents.splice(this.editedIndex, 1);
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
        Object.assign(this.residents[this.editedIndex], this.editedItem);
      } else {
        this.residents.push(this.editedItem);
      }
      this.close();
    },
    savea() {
      if (this.editedIndex > -1) {
        Object.assign(this.residents[this.editedIndex], this.editedItem);
      } else {
        this.residents.push(this.editedItem);
      }
      this.close();
    },
    clear() {
      (this.NamefilterValue = ""),
        (this.zoneFilterValue = ""),
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
  padding: 20px;
  font-family: Sarabun;
}
</style>
