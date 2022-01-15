<template>
  <v-app id="app">
    <!-- title and bottom -->
    <div class="pa-3 content background-main">
      <v-row justify="space-between" class="px-3">
        <div class="mb-4">
          <v-row style="align-items: center">
            <div class="ml-3 mt-2">
              <h2>ตารางสถานะห้องพัก</h2>
            </div>
          </v-row>
        </div>
        <div>
          <!-- add user -->
          <v-dialog v-model="dialog" persistent max-width="500px">
            <template v-slot:activator="{ on: attrs }">
              <v-btn color="#9B3499" dark v-on="{ ...attrs }" class="">
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
                      <v-select
                        v-model="editedItem.buildings"
                        :items="buildings"
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
                <v-btn color="blue darken-1" text @click="save"> ยืนยัน </v-btn>
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
          <v-btn dark color="#561F55" v-bind="attrs" v-on="on" @click="clear">
            <v-icon>mdi-delete</v-icon>
            ลบการค้นหา
          </v-btn>
        </div>
      </v-row>
      <!-- filter -->
      <v-row justify="space-between" class="px-3">
        <!-- Filter for  name-->
        <v-text-field
          v-model="search"
          prepend-icon="mdi-magnify"
          type="text"
          label="ค้นหา"
          clearable
          class="filter"
        ></v-text-field>

        <!-- Filter for  zone-->
        <v-text-field
          v-model="zoneFilterValue"
          prepend-icon="mdi-map-marker-radius"
          type="text"
          label="กรองด้วยพื้นที่"
          clearable
          class="filter"
        ></v-text-field>

        <!-- search by building -->
        <v-text-field
          v-model="zoneFilterValue"
          prepend-icon="mdi-office-building-marker"
          type="text"
          label="กรองด้วยอาคาร"
          clearable
          class="filter"
        ></v-text-field>
        <!-- search by status -->
        <v-select
          v-model="statusFilter"
          prepend-icon="mdi-list-status"
          label="กรองด้วยสถานะ"
          :items="status"
          clearable
          class="filter"
        >
        </v-select>
      </v-row>
    </div>
    <v-container>
      <v-row classs="px-3">
        <v-col cols="12">
          <!-- start data-table -->
          <v-data-table
            :headers="headers"
            :items="building"
            item-key="name"
            :items-per-page="5"
            class="table header-blue"
            :search="search"
            loading
            loading-text="กำลังโหลด... โปรดรอสักครู่"
            show-select
            :hide-default-footer="true"
          >
            <template v-slot:top>
              <!-- v-container, v-col and v-row are just for decoration purposes. -->
            </template>
            <!-- data -->
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
            </template>
          </v-data-table>
          <!-- end data-table -->
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              <div class="mx-auto">
                <v-icon size="35px" color="#5F2324">mdi-numeric</v-icon>
                จำนวนผู้อยู่อาศัยของแต่ล่ะพื้นที่
              </div>
            </v-card-title>
            <v-card-actions>
              <div class="chart-responsive" :style="{ padding: 10 }">
                <canvas id="water" width="1500" height="350"></canvas>
              </div>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
import Chart from "chart.js";
export default {
  mounted: function () {
    var chart = new Chart(water, {
      type: "bar",
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: 15,
        },
        legend: {
          locale: "th-TH",
          position: "top", // place legend on the right side of chart
          plugins: {
            labels: {
              font: {
                size: 20,
                family: "Sarabun",
              },
            },
          },
        },
        scales: {
          xAxes: [
            {
              stacked: true, // this should be set to make the bars stacked
            },
          ],
          yAxes: [
            {
              stacked: true, // this also..
            },
          ],
        },
      },
      data: {
        labels: [
          "มกราคม",
          "กุมภาพันธ์",
          "มีนาคม",
          "เมษายน",
          "พฤษภาคม ",
          "มิถุนายน ",
          "กรกฎาคม",
          "สิงหาคม",
          "กันยายน",
          "ตุลาคม",
          "พฤศจิกายน",
          "ธันวาคม",
        ], // responsible for how many bars are gonna show on the chart
        // create 12 datasets, since we have 12 items
        // data[0] = labels[0] (data for first bar - 'Standing costs') | data[1] = labels[1] (data for second bar - 'Running costs')
        // put 0, if there is no data for the particular bar
        datasets: [
          {
            label: "ส่วนกลาง",
            data: [
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
            ],
            backgroundColor: "#8CFFD5",
            borderWidth: 1,
          },
          {
            label: "มหาชัย",
            data: [
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
            ],
            backgroundColor: "#F86D6D",
          },
          {
            label: "อัษฎางค์",
            data: [
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
            ],
            backgroundColor: "#2E36F0",
          },
        ],
      },
    });
  },
  data: () => ({
    el: "#app",
    valid: false,
    modal: false,
    dialog: false,
    menu: false,
    zone: ["1", "2", "3", "4", "5"],
    buildings: ["อาคาร1", "อาคาร2", "อาคาร3", "อาคาร4", "อาคาร5", "อาคาร6"],
    status: ["ว่าง", "ไม่ว่าง"],
    search: "",
    direction: "bottom",
    dialogDelete: false,
    // Filter models.
    NamefilterValue: "",
    zoneFilterValue: "",
    building: [],
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
          text: "เลขห้องพัก",
          value: "room_no",
        },
        {
          text: "ชื่อผู้อยู่อาศัย",
          value: "name",
          align: "left",
          // filter: this.nameFilter,
        },

        {
          text: "พื้นที่",
          value: "zone",
          filter: this.roomFilter,
        },
        {
          text: "อาคาร",
          value: "buildings",
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
      this.editedIndex = this.building.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.building.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.building.splice(this.editedIndex, 1);
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
        Object.assign(this.building[this.editedIndex], this.editedItem);
      } else {
        this.building.push(this.editedItem);
      }
      this.close();
    },
    savea() {
      if (this.editedIndex > -1) {
        Object.assign(this.building[this.editedIndex], this.editedItem);
      } else {
        this.building.push(this.editedItem);
      }
      this.close();
    },
    clear() {
      (this.NamefilterValue = ""),
        (this.zoneFilterValue = ""),
        (this.dateFilterValue = "");
      this.date = "";
      this.search = "";
      this.statusFilter = null;
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
  },
};
</script>

<style scoped>
.title-table {
  font-size: 25px;
  padding: 20px;
  font-family: Sarabun;
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
  padding: 10px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
