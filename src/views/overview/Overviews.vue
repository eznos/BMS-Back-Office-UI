<template>
  <div id="app">
    <div class="pa-3 content background-main">
      <!-- title and export button -->
      <v-row justify="space-between" class="px-3">
        <div class="mb-4">
          <v-row style="align-items: center">
            <div class="ml-3 mt-2">
              <h2>ตารางสถานะห้องพัก</h2>
            </div>
          </v-row>
        </div>
        <!-- export data -->
        <div>
          <v-dialog v-model="dialog" persistent width="50%">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" v-bind="attrs" v-on="on">
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
              <!-- <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-select
                      label="เลือกข้อมูลที่ต้องการส่งออก"
                      :items="dataexport"
                      prepend-icon="mdi-file-excel"
                      clearable
                    >
                    </v-select>
                  </v-col>
                </v-row>
              </v-card-text> -->
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text color="warning" @click="dialog = false">
                  ยกเลิก
                </v-btn>
                <v-btn text color="agree" @click="dialog = false"> ตกลง </v-btn>
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
      {{ this.ecjan }}
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
                <div class="chart-responsive" :style="{ padding: 10 }">
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
  </div>
</template>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
import Chart from "chart.js";
import { apiUrl } from "../../utils/url";
import axios from "axios";
export default {
  mounted() {
    this.chartElectric();
     this.chartWater();
    // var chart = new Chart(water, {
    //   type: "bar",
    //   data: {
    //     labels: [
    //       "มกราคม",
    //       "กุมภาพันธ์",
    //       "มีนาคม",
    //       "เมษายน",
    //       "พฤษภาคม ",
    //       "มิถุนายน ",
    //       "กรกฎาคม",
    //       "สิงหาคม",
    //       "กันยายน",
    //       "ตุลาคม",
    //       "พฤศจิกายน",
    //       "ธันวาคม",
    //     ],
    //     datasets: [
    //       {
    //         label: "ส่วนกลาง",
    //         data: [
    //           this.wcjan,
    //           this.wcfeb,
    //           this.wcmar,
    //           this.wcapr,
    //           this.wcmay,
    //           this.wcjun,
    //           this.wcjul,
    //           this.wcaug,
    //           this.wcsep,
    //           this.wcoct,
    //           this.wcnov,
    //           this.wcdec,
    //         ],
    //         backgroundColor: "#8CFFD5",
    //         borderWidth: 1,
    //       },
    //       {
    //         label: "มหาชัย",
    //         data: [
    //           this.wsjan,
    //           this.wsfeb,
    //           this.wsmar,
    //           this.wsapr,
    //           this.wsmay,
    //           this.wsjun,
    //           this.wsjul,
    //           this.wsaug,
    //           this.wssep,
    //           this.wsoct,
    //           this.wsnov,
    //           this.wsdec,
    //         ],
    //         backgroundColor: "#F86D6D",
    //       },
    //       {
    //         label: "อัษฎางค์",
    //         data: [
    //           this.wajan,
    //           this.wafeb,
    //           this.wamar,
    //           this.waapr,
    //           this.wamay,
    //           this.wajun,
    //           this.wajul,
    //           this.waaug,
    //           this.wasep,
    //           this.waoct,
    //           this.wanov,
    //           this.wadec,
    //         ],
    //         backgroundColor: "#2E36F0",
    //       },
    //     ],
    //   },
    //   options: {
    //     responsive: true,
    //     maintainAspectRatio: false,
    //     layout: {
    //       padding: 15,
    //     },
    //     legend: {
    //       locale: "th-TH",
    //       position: "top", // place legend on the right side of chart
    //       plugins: {
    //         labels: {
    //           font: {
    //             size: 20,
    //             family: "Sarabun",
    //           },
    //         },
    //       },
    //     },
    //     scales: {
    //       xAxes: [
    //         {
    //           stacked: true, // this should be set to make the bars stacked
    //         },
    //       ],
    //       yAxes: [
    //         {
    //           stacked: true, // this also..
    //         },
    //       ],
    //     },
    //   },
    // });
  },
  data() {
    return {
      dialog: false,
      dataexport: ["1", "2", "3", "4", "5"],
      total: "",
      empty: "",
      move_in: "",
      move_out: "",
      ecjan: "",
    };
  },
  created() {
    this.getInfoDataCard();
  },
  methods: {




    getInfoDataCard() {
      axios
        .get(apiUrl + "/v1/dashboard/info-card")
        .then((response) => {
          let data = response.data;
          if (data.status === "success") {
            this.total = data.result.total;
            this.empty = data.result.empty;
            this.move_in = data.result.move_in;
            this.move_out = data.result.move_out;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    chartElectric() {
      axios
        .get(apiUrl + "/v1/dashboard/electric")
        .then((response) => {
          let data = response.data;
          // console.log(data);
          // this.ecjan = data.center.jan;
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
              // header chart
              // data[0] = labels[0] (data for first bar - 'Standing costs') | data[1] = labels[1] (data for second bar - 'Running costs')
              // put 0, if there is no data for the particular bar
              datasets: [
                {
                  label: "ส่วนกลาง",
                  data: [
                    data.center.jan,
                    data.center.feb,
                    data.center.mar,
                    data.center.apr,
                    data.center.may,
                    data.center.jun,
                    data.center.jul,
                    data.center.aug,
                    data.center.sep,
                    data.center.oct,
                    data.center.nov,
                    data.center.dec,
                  ],
                  backgroundColor: "#8CFFD5",
                  borderWidth: 1,
                },
                {
                  label: "มหาชัย",
                  data: [
                    data.suranarai.jan,
                    data.suranarai.feb,
                    data.suranarai.mar,
                    data.suranarai.apr,
                    data.suranarai.may,
                    data.suranarai.jun,
                    data.suranarai.jul,
                    data.suranarai.aug,
                    data.suranarai.sep,
                    data.suranarai.oct,
                    data.suranarai.nov,
                    data.suranarai.dec,
                  ],
                  backgroundColor: "#F86D6D",
                },
                {
                  label: "อัษฎางค์",
                  data: [
                    data.angtadang.jan,
                    data.angtadang.feb,
                    data.angtadang.mar,
                    data.angtadang.apr,
                    data.angtadang.may,
                    data.angtadang.jun,
                    data.angtadang.jul,
                    data.angtadang.aug,
                    data.angtadang.sep,
                    data.angtadang.oct,
                    data.angtadang.nov,
                    data.angtadang.dec,
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
        })
        .catch((error) => {
          console.log(error);
        });
    },
     chartWater() {
      axios
        .get(apiUrl + "/v1/dashboard/water")
        .then((response) => {
          let data = response.data;
          // console.log(data);
          // this.ecjan = data.center.jan;
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
                    data.center.jan,
                    data.center.feb,
                    data.center.mar,
                    data.center.apr,
                    data.center.may,
                    data.center.jun,
                    data.center.jul,
                    data.center.aug,
                    data.center.sep,
                    data.center.oct,
                    data.center.nov,
                    data.center.dec,
                  ],
                  backgroundColor: "#8CFFD5",
                  borderWidth: 1,
                },
                {
                  label: "มหาชัย",
                  data: [
                    data.suranarai.jan,
                    data.suranarai.feb,
                    data.suranarai.mar,
                    data.suranarai.apr,
                    data.suranarai.may,
                    data.suranarai.jun,
                    data.suranarai.jul,
                    data.suranarai.aug,
                    data.suranarai.sep,
                    data.suranarai.oct,
                    data.suranarai.nov,
                    data.suranarai.dec,
                  ],
                  backgroundColor: "#F86D6D",
                },
                {
                  label: "อัษฎางค์",
                  data: [
                    data.angtadang.jan,
                    data.angtadang.feb,
                    data.angtadang.mar,
                    data.angtadang.apr,
                    data.angtadang.may,
                    data.angtadang.jun,
                    data.angtadang.jul,
                    data.angtadang.aug,
                    data.angtadang.sep,
                    data.angtadang.oct,
                    data.angtadang.nov,
                    data.angtadang.dec,
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
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.chart-responsive {
  width: 100%;
  margin: 20px auto;
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
