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
          <v-dialog v-model="dialog" persistent max-width="75%">
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
          <v-dialog v-model="dialogDelete" max-width="75%">
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
          <!-- clear search -->
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
        <!-- chart center -->
        <v-col cols="12" xs="12" sm="12" md="12" lg="4" class="">
          <v-card>
            <h2>เขตส่วนกลาง</h2>
            <v-card-actions>
              <div class="chart-responsive" :style="{ padding: 10 }">
                <canvas id="center" width="1500" height="350"></canvas>
              </div>
            </v-card-actions>
          </v-card>
        </v-col>
        <!-- chart suranarai -->
        <v-col cols="12" xs="12" sm="12" md="12" lg="4">
          <v-card>
            <h2>เขตถนนสุรนารายณ์</h2>
            <v-card-actions>
              <div class="chart-responsive" :style="{ padding: 10 }">
                <canvas id="suranarai" width="1500" height="350"></canvas>
              </div>
            </v-card-actions>
          </v-card>
        </v-col>
        <!-- chart ashtang -->
        <v-col cols="12" xs="12" sm="12" md="12" lg="4">
          <v-card>
            <h2>อัษฎางค์</h2>
            <v-card-actions>
              <div class="chart-responsive" :style="{ padding: 10 }">
                <canvas id="ashtang" width="1500" height="350"></canvas>
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
    var chart = new Chart(center, {
      type: "doughnut",
      data: {
        labels: [
          "อาคาร2/11",
          "อาคาร2/12",
          "อาคาร2/13",
          "อาคาร2/14",
          "อาคาร2/15",
          "อาคาร2/16",
          "อาคาร2/17",
          "อาคาร2/18",
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
            ],
            backgroundColor: [
              "#22EACA",
              "#B31E6F",
              "#EE5A5A",
              "#FF9E74",
              "#22EACA",
              "#B31E6F",
              "#EE5A5A",
              "#FF9E74",
            ],
            borderWidth: 1,
          },
        ],
      },
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
      },
    });
    var chart = new Chart(suranarai, {
      type: "doughnut",
      data: {
        labels: [
          "เรือนแถว2/31 ถึง 2/37",
          "อาคาร 2/38",
          "อาคาร 2/39",
          "อาคาร 2/40",
          "อาคารบ้านแผด2/20 ถึง 2/29",
          "อาคารสร้างใหม่",
        ], // responsible for how many bars are gonna show on the chart
        // create 12 datasets, since we have 12 items
        // data[0] = labels[0] (data for first bar - 'Standing costs') | data[1] = labels[1] (data for second bar - 'Running costs')
        // put 0, if there is no data for the particular bar
        datasets: [
          {
            data: [
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
            ],
            backgroundColor: [
              "#1A1A40",
              "#270082",
              "#7A0BC0",
              "#7897AB",
              "#655D8A",
              "#FA58B6",
            ],
            borderWidth: 1,
          },
        ],
      },
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
      },
    });
    var chart = new Chart(ashtang, {
      type: "doughnut",
      data: {
        labels: [
          "อาคาร2/19 ชั้น1",
          "อาคาร2/19 ชั้น2",
          "อาคาร2/19 ชั้น3",
          "อาคาร2/19 ชั้น4",
          "อาคาร2/19 ชั้น5",
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
            ],
            backgroundColor: [
              "#655D8A",
              "#7897AB",
              "#D885A3",
              "#FDCEB9",
              "#FFBBBB",
            ],
            borderWidth: 1,
          },
        ],
      },
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
          text: "ประเภทห้องพัก",
          value: "room_type",
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

.backgroundchart {
  background-image: linear-gradient(135deg, #ed6ea0 20%, #ec8c69 90%);
}
</style>
