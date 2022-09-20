<template>
  <div id="app">
    <div class="pa-3 content background-main">
      <!-- title and export button -->
      <v-row justify="space-between" class="px-3">
        <div class="mb-4">
          <v-row style="align-items: center">
            <!-- <div class="ml-3 mt-2">
              <h2>ภาพรวม</h2>
            </div> -->
          </v-row>
        </div>
        <!-- export data -->
        <div v-if="role === 'admin'">
          <v-dialog
            transition="dialog-bottom-transition"
            v-model="dialog"
            persistent
            max-width="70%"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="agree" v-bind="attrs" v-on="on">
                <v-icon> mdi-application-export </v-icon>
                &nbsp; Export ข้อมูลภาพรวม
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <v-icon size="30px" color="red">
                  mdi-application-export
                </v-icon>
                &nbsp; Export ข้อมูลภาพรวมเป็นไฟล์ Excel หรือไม่ ?
              </v-card-title>
              <v-card-text>
                <v-form ref="formExport" lazy-validation>
                  <v-row>
                    <v-col cols="12">
                      <v-select
                        prepend-icon="mdi-clipboard-list-outline"
                        v-model="infoCardSelect"
                        :items="infoCardSelects"
                        item-text="name"
                        item-value="value"
                        label="ข้อมูลสถิติ"
                        multiple
                        autofocus
                        :rules="rules.dataRules"
                      >
                      </v-select>
                    </v-col>
                    <v-col cols="12">
                      <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        :return-value.sync="date"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="date"
                            label="ข้อมูลค่าน้ำ-ค่าไฟฟ้า ของเดือนที่เลือกไว้"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            :rules="rules.dataRules"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="date"
                          type="month"
                          no-title
                          scrollable
                          multiple
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
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text color="warning" @click="dialog = false">
                  ยกเลิก
                </v-btn>
                <v-btn text color="agree" @click="submit()"> ตกลง </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-row>
      <!-- info card -->
      <div class="space">
        <v-row>
          <!-- resident number -->
          <v-col cols="12" xs="12" sm="6" md="6" lg="3">
            <v-card elevation="6" class="rounded-lg">
              <v-list-item>
                <v-list-item-avatar>
                  <v-sheet>
                    <v-icon color="#3EDBF0" large>mdi-face-man-shimmer</v-icon>
                  </v-sheet>
                </v-list-item-avatar>
                <v-list-item-content>
                  <div class="text-right mb-3">จำนวนผู้อยู่อาศัยรวม</div>
                  <v-list-item-title class="headline mb-3 text-right">
                    <div class="font">{{ this.total }} คน</div>
                  </v-list-item-title>
                  <div>
                    <v-divider></v-divider>
                  </div>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>
          <!-- empty room -->
          <v-col cols="12" xs="12" sm="6" md="6" lg="3">
            <v-card elevation="6" class="rounded-lg">
              <v-list-item>
                <v-list-item-avatar>
                  <v-sheet>
                    <v-icon color="#04009A" large>mdi-room-service</v-icon>
                  </v-sheet>
                </v-list-item-avatar>
                <v-list-item-content>
                  <div class="text-right mb-3">จำนวนห้องว่าง</div>
                  <v-list-item-title class="headline mb-3 text-right">
                    <div class="font">{{ this.empty }} ห้อง</div>
                  </v-list-item-title>
                  <div>
                    <v-divider></v-divider>
                  </div>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>
          <!-- resodent enter in month -->
          <v-col cols="12" xs="12" sm="6" md="6" lg="3">
            <v-card elevation="6" class="rounded-lg">
              <v-list-item>
                <v-list-item-avatar>
                  <v-sheet>
                    <v-icon color="green" large>mdi-location-enter</v-icon>
                  </v-sheet>
                </v-list-item-avatar>
                <v-list-item-content>
                  <div class="text-right mb-3">
                    จำนวนผู้เข้าพักอาศัยเดือนนี้
                  </div>
                  <v-list-item-title class="headline mb-3 text-right">
                    <div class="font">{{ move_in }} คน</div>
                  </v-list-item-title>
                  <div>
                    <v-divider></v-divider>
                  </div>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>
          <!-- resident exit -->
          <v-col cols="12" xs="12" sm="6" md="6" lg="3">
            <v-card elevation="6" class="rounded-lg">
              <v-list-item>
                <v-list-item-avatar>
                  <v-sheet>
                    <v-icon color="red" large>mdi mdi-exit-run</v-icon>
                  </v-sheet>
                </v-list-item-avatar>
                <v-list-item-content>
                  <div class="text-right mb-3">จำนวนผู้ย้ายออกในเดือนนี้</div>
                  <v-list-item-title class="headline mb-3 text-right">
                    <div class="font">{{ move_out }} คน</div>
                  </v-list-item-title>
                  <div>
                    <v-divider></v-divider>
                  </div>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>
    <!-- chart -->
    <div class="pa-3 content background-main">
      <v-row>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6">
          <div>
            <!-- water -->
            <v-card elevation="6" class="card-chart rounded-lg">
              <v-card-title>
                <div class="mx-auto">
                  <v-icon size="35px" color="#29DEFF">mdi-water-circle</v-icon>
                  ค่าน้ำประปา
                </div>
              </v-card-title>
              <v-card-actions>
                <div class="chart-responsive" :style="{ padding: -20 }">
                  <canvas id="water" width="600" height="350"></canvas>
                </div>
              </v-card-actions>
            </v-card>
          </div>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="6" lg="6">
          <div>
            <!-- electric -->
            <v-card elevation="6" class="card-chart rounded-lg">
              <v-card-title>
                <div class="mx-auto">
                  <v-icon size="35px" color="#FDFC15"
                    >mdi-lightning-bolt-circle</v-icon
                  >
                  ค่าไฟฟ้า
                </div>
              </v-card-title>
              <v-card-actions>
                <div class="chart-responsive" :style="{ padding: 10 }">
                  <canvas id="electric" width="900" height="350"></canvas>
                </div>
              </v-card-actions>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </div>
    <v-snackbar v-model="snackbar" :timeout="timeout" :color="colorSnackbar">
      <div class="text-center">
        {{ statusAction }}
      </div>
    </v-snackbar>
  </div>
</template>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
import Chart from "chart.js";
import { apiUrl } from "../../utils/url";
import axios from "axios";
import infoCardSelects from "../../json/infoCardSelects.json";
export default {
  mounted() {
    this.chartElectric();
    this.chartWater();
    this.getInfoDataCard();
  },
  data() {
    return {
      snackbar: false,
      statusAction: "",
      colorSnackbar: "",
      timeout: 2000,
      role: "",
      infoCardSelect: [],
      infoCardSelects: infoCardSelects,
      menu: false,
      date: [],
      dialog: false,
      total: "",
      empty: "",
      move_in: "",
      move_out: "",
      rules: {
        dataRules: [(value) => !!value || "กรุณากรอก ชื่อผู้ใช้"],
      },
    };
  },
  created() {
    this.getRole();
  },
  methods: {
    getInfoDataCard() {
      var config = {
        headers: {
          "x-api-key": "xxx-api-key",
          "x-refresh-token": "xxx-refresh-token",
        },
      };
      axios
        .get(apiUrl + "/v1/overviews", config)
        .then((response) => {
          let data = response.data;
          if (data.status === "success") {
            this.total = data.result.summary.residents.total;
            this.empty = data.result.summary.rooms.empty;
            this.move_in = data.result.summary.residents.move_in_last_month;
            this.move_out = data.result.summary.residents.move_out_last_month;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    chartWater() {
      var config = {
        headers: {
          "x-api-key": "xxx-api-key",
          "x-refresh-token": "xxx-refresh-token",
        },
      };
      axios
        .get(apiUrl + "/v1/overviews", config)
        .then((response) => {
          let data = response.data;
          if (data.status == "success") {
            return new Chart(water, {
              type: "bar",
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
                ],
                datasets: [
                  {
                    label: "ส่วนกลาง",
                    data: [
                      data.result.summary.billings.water.zones.center.jan,
                      data.result.summary.billings.water.zones.center.feb,
                      data.result.summary.billings.water.zones.center.mar,
                      data.result.summary.billings.water.zones.center.apr,
                      data.result.summary.billings.water.zones.center.may,
                      data.result.summary.billings.water.zones.center.jun,
                      data.result.summary.billings.water.zones.center.jul,
                      data.result.summary.billings.water.zones.center.aug,
                      data.result.summary.billings.water.zones.center.sep,
                      data.result.summary.billings.water.zones.center.oct,
                      data.result.summary.billings.water.zones.center.nov,
                      data.result.summary.billings.water.zones.center.dec,
                    ],
                    backgroundColor: "#8CFFD5",
                    borderWidth: 1,
                  },
                  {
                    label: "มหาชัย",
                    data: [
                      data.result.summary.billings.water.zones.suranarai.jan,
                      data.result.summary.billings.water.zones.suranarai.feb,
                      data.result.summary.billings.water.zones.suranarai.mar,
                      data.result.summary.billings.water.zones.suranarai.apr,
                      data.result.summary.billings.water.zones.suranarai.may,
                      data.result.summary.billings.water.zones.suranarai.jun,
                      data.result.summary.billings.water.zones.suranarai.jul,
                      data.result.summary.billings.water.zones.suranarai.aug,
                      data.result.summary.billings.water.zones.suranarai.sep,
                      data.result.summary.billings.water.zones.suranarai.oct,
                      data.result.summary.billings.water.zones.suranarai.nov,
                      data.result.summary.billings.water.zones.suranarai.dec,
                    ],
                    backgroundColor: "#F86D6D",
                  },
                  {
                    label: "อัษฎางค์",
                    data: [
                      data.result.summary.billings.water.zones.angtadang.jan,
                      data.result.summary.billings.water.zones.angtadang.feb,
                      data.result.summary.billings.water.zones.angtadang.mar,
                      data.result.summary.billings.water.zones.angtadang.apr,
                      data.result.summary.billings.water.zones.angtadang.may,
                      data.result.summary.billings.water.zones.angtadang.jun,
                      data.result.summary.billings.water.zones.angtadang.jul,
                      data.result.summary.billings.water.zones.angtadang.aug,
                      data.result.summary.billings.water.zones.angtadang.sep,
                      data.result.summary.billings.water.zones.angtadang.oct,
                      data.result.summary.billings.water.zones.angtadang.nov,
                      data.result.summary.billings.water.zones.angtadang.dec,
                    ],
                    backgroundColor: "#2E36F0",
                  },
                ],
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                locale: "th-TH",
                layout: {
                  padding: 15,
                },
                legend: {
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
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    chartElectric() {
      var config = {
        headers: {
          "x-api-key": "xxx-api-key",
          "x-refresh-token": "xxx-refresh-token",
        },
      };
      axios
        .get(apiUrl + "/v1/overviews", config)
        .then((response) => {
          let data = response.data;
          if (data.status == "success") {
            var electric = document.getElementById("electric");
            return new Chart(electric, {
              type: "bar",
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
                ],
                datasets: [
                  {
                    label: "ส่วนกลาง",
                    data: [
                      data.result.summary.billings.electricity.zones.center.jan,
                      data.result.summary.billings.electricity.zones.center.feb,
                      data.result.summary.billings.electricity.zones.center.mar,
                      data.result.summary.billings.electricity.zones.center.apr,
                      data.result.summary.billings.electricity.zones.center.may,
                      data.result.summary.billings.electricity.zones.center.jun,
                      data.result.summary.billings.electricity.zones.center.jul,
                      data.result.summary.billings.electricity.zones.center.aug,
                      data.result.summary.billings.electricity.zones.center.sep,
                      data.result.summary.billings.electricity.zones.center.oct,
                      data.result.summary.billings.electricity.zones.center.nov,
                      data.result.summary.billings.electricity.zones.center.dec,
                    ],
                    backgroundColor: "#8CFFD5",
                    borderWidth: 1,
                  },
                  {
                    label: "มหาชัย",
                    data: [
                      data.result.summary.billings.electricity.zones.suranarai
                        .jan,
                      data.result.summary.billings.electricity.zones.suranarai
                        .feb,
                      data.result.summary.billings.electricity.zones.suranarai
                        .mar,
                      data.result.summary.billings.electricity.zones.suranarai
                        .apr,
                      data.result.summary.billings.electricity.zones.suranarai
                        .may,
                      data.result.summary.billings.electricity.zones.suranarai
                        .jun,
                      data.result.summary.billings.electricity.zones.suranarai
                        .jul,
                      data.result.summary.billings.electricity.zones.suranarai
                        .aug,
                      data.result.summary.billings.electricity.zones.suranarai
                        .sep,
                      data.result.summary.billings.electricity.zones.suranarai
                        .oct,
                      data.result.summary.billings.electricity.zones.suranarai
                        .nov,
                      data.result.summary.billings.electricity.zones.suranarai
                        .dec,
                    ],
                    backgroundColor: "#F86D6D",
                  },
                  {
                    label: "อัษฎางค์",
                    data: [
                      data.result.summary.billings.electricity.zones.angtadang
                        .jan,
                      data.result.summary.billings.electricity.zones.angtadang
                        .feb,
                      data.result.summary.billings.electricity.zones.angtadang
                        .mar,
                      data.result.summary.billings.electricity.zones.angtadang
                        .apr,
                      data.result.summary.billings.electricity.zones.angtadang
                        .may,
                      data.result.summary.billings.electricity.zones.angtadang
                        .jun,
                      data.result.summary.billings.electricity.zones.angtadang
                        .jul,
                      data.result.summary.billings.electricity.zones.angtadang
                        .aug,
                      data.result.summary.billings.electricity.zones.angtadang
                        .sep,
                      data.result.summary.billings.electricity.zones.angtadang
                        .oct,
                      data.result.summary.billings.electricity.zones.angtadang
                        .nov,
                      data.result.summary.billings.electricity.zones.angtadang
                        .dec,
                    ],
                    backgroundColor: "#2E36F0",
                  },
                ],
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                locale: "th-TH",
                layout: {
                  padding: 15,
                },
                legend: {
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
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    submit() {
      if (this.$refs.formExport.validate()) {
        this.exportOverview(this.date, this.infoCardSelect);
      }
    },
    // export with api
    exportOverview(date, infoCardSelect) {
      let payload = {
        date_selected: date,
        info_selected: infoCardSelect,
      };
      var config = {
        headers: {
          "x-api-key": "xxx-api-key",
          "x-refresh-token": "xxx-refresh-token",
        },
      };
      return axios
        .post(apiUrl + "/v1/overviews/exports", payload, config)
        .then((response) => {
          let data = response.data;
          if (data.status == "success") {
            this.dialog = false;
            this.statusAction = "Export สำเร็จ";
            this.colorSnackbar = "agree";
            this.snackbar = true;
            this.date = new Date().toISOString().substr(0, 7);
            this.infoCardSelect = [];
          }
        })
        .catch((error) => {
          console.log(error);
          if (
            error.response.data.error_message ===
            "some record does not have calculated status"
          ) {
            this.statusAction = "บางบันทึกไม่มีสถานะการคำนวณ";
            this.colorSnackbar = "warning";
            this.snackbar = true;
            this.dialog = false;
            this.date = new Date().toISOString().substr(0, 7);
            this.infoCardSelect = [];
          } else {
            this.statusAction = "Export ไม่สำเร็จ กรุณาติดต่อผู้จัดทำ";
            this.colorSnackbar = "red";
            this.snackbar = true;
            this.dialog = false;
            this.date = new Date().toISOString().substr(0, 7);
            this.infoCardSelect = [];
          }
        });
    },
    getRole() {
      var role = localStorage.getItem("role");
      this.role = role;
    },
  },
};
</script>

<style scoped>
.chart-responsive {
  width: 100%;
  margin: 0px auto;
}
.font {
  font-family: Sarabun;
}
.mx-auto {
  font-size: 30px;
}
.space {
  padding: 10px;
  margin-top: 30px;
  margin-bottom: 10px;
}
</style>
