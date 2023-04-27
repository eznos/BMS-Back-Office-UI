<template>
  <div id="app">
    <div class="pa-3 content background-main">
      <!-- title and export button -->
      <v-row justify="space-between" class="px-3">
        <div class="mb-4">
          <!-- <v-row style="align-items: center">
            <div class="ml-3 mt-2">
              <h2>ภาพรวม</h2>
            </div>
          </v-row> -->
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
              <v-btn color="#f8ce01" v-bind="attrs" v-on="on">
                <v-icon> mdi-application-export </v-icon>
                &nbsp; Export ข้อมูล
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <v-icon size="30px" color="red">
                  mdi-application-export
                </v-icon>
                &nbsp; Export ข้อมูลภาพรวมเป็นไฟล์ Excel หรือไม่ ?
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text color="warning" @click="dialog = false">
                  ยกเลิก
                </v-btn>
                <v-btn text color="agree" @click="exportOverview"> ตกลง </v-btn>
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
                  <div class="text-right mb-3">จำนวนผู้ย้ายออกเดือนนี้</div>
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
        <v-col cols="12" xs="12" sm="12" md="12" lg="12">
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
        <!-- <v-col cols="12" xs="12" sm="12" md="6" lg="6">
          <div> -->
        <!-- electric -->
        <!-- <v-card elevation="6" class="card-chart rounded-lg">
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
            </v-card> -->
        <!-- </div>
        </v-col> -->
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
import FileDownload from "js-file-download";
export default {
  mounted() {
    // this.chartElectric();
    this.chartWater();
    this.getInfoDataCard();
  },
  data() {
    return {
      // myApiKey:process.env.API_KEY,
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
          "x-api-key": process.env.apiKey,
        },
      };
      axios
        .get(apiUrl + "/v1/overviews/overviews", config)
        .then((response) => {
          let data = response.data;
          if (data.status === "success") {
            this.total = data.result.billings.info.numberOfResident;
            this.empty = data.result.billings.info.numberOfRoom;
            this.move_out = data.result.billings.info.numberOfExitInMount;
            this.move_in = data.result.billings.info.numberOfComeInMonth;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    chartWater() {
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
        },
      };
      axios
        .get(apiUrl + "/v1/overviews/overviews", config)
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
                      data.result.billings.zone.Center.jan,
                      data.result.billings.zone.Center.feb,
                      data.result.billings.zone.Center.mar,
                      data.result.billings.zone.Center.apr,
                      data.result.billings.zone.Center.may,
                      data.result.billings.zone.Center.jun,
                      data.result.billings.zone.Center.jul,
                      data.result.billings.zone.Center.aug,
                      data.result.billings.zone.Center.sep,
                      data.result.billings.zone.Center.oct,
                      data.result.billings.zone.Center.nov,
                      data.result.billings.zone.Center.dec,
                    ],
                    backgroundColor: "#8CFFD5",
                    borderWidth: 1,
                  },
                  {
                    label: "สุรนารายณ์",
                    data: [
                      data.result.billings.zone.Suranarai.jan,
                      data.result.billings.zone.Suranarai.feb,
                      data.result.billings.zone.Suranarai.mar,
                      data.result.billings.zone.Suranarai.apr,
                      data.result.billings.zone.Suranarai.may,
                      data.result.billings.zone.Suranarai.jun,
                      data.result.billings.zone.Suranarai.jul,
                      data.result.billings.zone.Suranarai.aug,
                      data.result.billings.zone.Suranarai.sep,
                      data.result.billings.zone.Suranarai.oct,
                      data.result.billings.zone.Suranarai.nov,
                      data.result.billings.zone.Suranarai.dec,
                    ],
                    backgroundColor: "#F86D6D",
                  },
                  {
                    label: "อัษฎางค์",
                    data: [
                      data.result.billings.zone.Asadang.jan,
                      data.result.billings.zone.Asadang.feb,
                      data.result.billings.zone.Asadang.mar,
                      data.result.billings.zone.Asadang.apr,
                      data.result.billings.zone.Asadang.may,
                      data.result.billings.zone.Asadang.jun,
                      data.result.billings.zone.Asadang.jul,
                      data.result.billings.zone.Asadang.aug,
                      data.result.billings.zone.Asadang.sep,
                      data.result.billings.zone.Asadang.oct,
                      data.result.billings.zone.Asadang.nov,
                      data.result.billings.zone.Asadang.dec,
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
    // chartElectric() {
    //   var config = {
    //     headers: {
    //       "x-api-key": "xxx-api-key",
    //       "x-refresh-token": "xxx-refresh-token",
    //     },
    //   };
    //   axios
    //     .get(apiUrl + "/v1/overviews", config)
    //     .then((response) => {
    //       let data = response.data;
    //       if (data.status == "success") {
    //         var electric = document.getElementById("electric");
    //         return new Chart(electric, {
    //           type: "bar",
    //           data: {
    //             labels: [
    //               "มกราคม",
    //               "กุมภาพันธ์",
    //               "มีนาคม",
    //               "เมษายน",
    //               "พฤษภาคม ",
    //               "มิถุนายน ",
    //               "กรกฎาคม",
    //               "สิงหาคม",
    //               "กันยายน",
    //               "ตุลาคม",
    //               "พฤศจิกายน",
    //               "ธันวาคม",
    //             ],
    //             datasets: [
    //               {
    //                 label: "ส่วนกลาง",
    //                 data: [
    //                   data.result.summary.billings.electricity.zones.center.jan,
    //                   data.result.summary.billings.electricity.zones.center.feb,
    //                   data.result.summary.billings.electricity.zones.center.mar,
    //                   data.result.summary.billings.electricity.zones.center.apr,
    //                   data.result.summary.billings.electricity.zones.center.may,
    //                   data.result.summary.billings.electricity.zones.center.jun,
    //                   data.result.summary.billings.electricity.zones.center.jul,
    //                   data.result.summary.billings.electricity.zones.center.aug,
    //                   data.result.summary.billings.electricity.zones.center.sep,
    //                   data.result.summary.billings.electricity.zones.center.oct,
    //                   data.result.summary.billings.electricity.zones.center.nov,
    //                   data.result.summary.billings.electricity.zones.center.dec,
    //                 ],
    //                 backgroundColor: "#8CFFD5",
    //                 borderWidth: 1,
    //               },
    //               {
    //                 label: "มหาชัย",
    //                 data: [
    //                   data.result.summary.billings.electricity.zones.suranarai
    //                     .jan,
    //                   data.result.summary.billings.electricity.zones.suranarai
    //                     .feb,
    //                   data.result.summary.billings.electricity.zones.suranarai
    //                     .mar,
    //                   data.result.summary.billings.electricity.zones.suranarai
    //                     .apr,
    //                   data.result.summary.billings.electricity.zones.suranarai
    //                     .may,
    //                   data.result.summary.billings.electricity.zones.suranarai
    //                     .jun,
    //                   data.result.summary.billings.electricity.zones.suranarai
    //                     .jul,
    //                   data.result.summary.billings.electricity.zones.suranarai
    //                     .aug,
    //                   data.result.summary.billings.electricity.zones.suranarai
    //                     .sep,
    //                   data.result.summary.billings.electricity.zones.suranarai
    //                     .oct,
    //                   data.result.summary.billings.electricity.zones.suranarai
    //                     .nov,
    //                   data.result.summary.billings.electricity.zones.suranarai
    //                     .dec,
    //                 ],
    //                 backgroundColor: "#F86D6D",
    //               },
    //               {
    //                 label: "อัษฎางค์",
    //                 data: [
    //                   data.result.summary.billings.electricity.zones.angtadang
    //                     .jan,
    //                   data.result.summary.billings.electricity.zones.angtadang
    //                     .feb,
    //                   data.result.summary.billings.electricity.zones.angtadang
    //                     .mar,
    //                   data.result.summary.billings.electricity.zones.angtadang
    //                     .apr,
    //                   data.result.summary.billings.electricity.zones.angtadang
    //                     .may,
    //                   data.result.summary.billings.electricity.zones.angtadang
    //                     .jun,
    //                   data.result.summary.billings.electricity.zones.angtadang
    //                     .jul,
    //                   data.result.summary.billings.electricity.zones.angtadang
    //                     .aug,
    //                   data.result.summary.billings.electricity.zones.angtadang
    //                     .sep,
    //                   data.result.summary.billings.electricity.zones.angtadang
    //                     .oct,
    //                   data.result.summary.billings.electricity.zones.angtadang
    //                     .nov,
    //                   data.result.summary.billings.electricity.zones.angtadang
    //                     .dec,
    //                 ],
    //                 backgroundColor: "#2E36F0",
    //               },
    //             ],
    //           },
    //           options: {
    //             responsive: true,
    //             maintainAspectRatio: false,
    //             locale: "th-TH",
    //             layout: {
    //               padding: 15,
    //             },
    //             legend: {
    //               position: "top", // place legend on the right side of chart
    //               plugins: {
    //                 labels: {
    //                   font: {
    //                     size: 20,
    //                     family: "Sarabun",
    //                   },
    //                 },
    //               },
    //             },
    //             scales: {
    //               xAxes: [
    //                 {
    //                   stacked: true, // this should be set to make the bars stacked
    //                 },
    //               ],
    //               yAxes: [
    //                 {
    //                   stacked: true, // this also..
    //                 },
    //               ],
    //             },
    //           },
    //         });
    //       }
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // },

    // export with api
    exportOverview() {
      var config = {
        method: "post",
        url: apiUrl + "/v1/overviews/export",
        headers: {
          "x-api-key": process.env.apiKey,
        },
        responseType: "blob",
      };
      axios(config)
        .then((response) => {
          FileDownload(response.data, "ข้อมูลภาพรวม.xlsx");
          this.dialog = false;
          this.snackbar = true;
          this.statusAction = "Export สำเร็จ";
          this.colorSnackbar = "agree";
        })
        .catch(function (error) {
          console.log(error);
          this.dialog = false;
          this.snackbar = true;
          this.statusAction = "Export ไม่สำเร็จกรุณาติดต่อผู้จัดทำ";
          this.colorSnackbar = "red";
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
