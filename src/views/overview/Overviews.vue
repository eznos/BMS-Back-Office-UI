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
      <!-- {{ this.getecjan() }} -->
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
  mounted: function () {
    var chart = new Chart(water, {
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
              this.wcjan,
              this.wcfeb,
              this.wcmar,
              this.wcapr,
              this.wcmay,
              this.wcjun,
              this.wcjul,
              this.wcaug,
              this.wcsep,
              this.wcoct,
              this.wcnov,
              this.wcdec,
            ],
            backgroundColor: "#8CFFD5",
            borderWidth: 1,
          },
          {
            label: "มหาชัย",
            data: [
              this.wsjan,
              this.wsfeb,
              this.wsmar,
              this.wsapr,
              this.wsmay,
              this.wsjun,
              this.wsjul,
              this.wsaug,
              this.wssep,
              this.wsoct,
              this.wsnov,
              this.wsdec,
            ],
            backgroundColor: "#F86D6D",
          },
          {
            label: "อัษฎางค์",
            data: [
              this.wajan,
              this.wafeb,
              this.wamar,
              this.waapr,
              this.wamay,
              this.wajun,
              this.wajul,
              this.waaug,
              this.wasep,
              this.waoct,
              this.wanov,
              this.wadec,
            ],
            backgroundColor: "#2E36F0",
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
    var chart = new Chart(electric, {
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
        ], // header chart
        // data[0] = labels[0] (data for first bar - 'Standing costs') | data[1] = labels[1] (data for second bar - 'Running costs')
        // put 0, if there is no data for the particular bar
        datasets: [
          {
            label: "ส่วนกลาง",
            data: [
              this.ecjan,
              this.ecfeb,
              this.ecmar,
              this.ecapr,
              this.ecmay,
              this.ecjun,
              this.ecjul,
              this.ecaug,
              this.ecsep,
              this.ecoct,
              this.ecnov,
              this.ecdec,
            ],
            backgroundColor: "#8CFFD5",
            borderWidth: 1,
          },
          {
            label: "มหาชัย",
            data: [
              this.esjan,
              this.esfeb,
              this.esmar,
              this.esapr,
              this.esmay,
              this.esjun,
              this.esjul,
              this.esaug,
              this.essep,
              this.esoct,
              this.esnov,
              this.esdec,
            ],
            backgroundColor: "#F86D6D",
          },
          {
            label: "อัษฎางค์",
            data: [
              this.eajan,
              this.eafeb,
              this.eamar,
              this.eaapr,
              this.eamay,
              this.eajun,
              this.eajul,
              this.eaaug,
              this.easep,
              this.eaoct,
              this.eanov,
              this.eadec,
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
  },
  data() {
    return {
      dialog: false,
      dataexport: ["1", "2", "3", "4", "5"],
      total: "",
      empty: "",
      move_in: "",
      move_out: "",
    };
  },
  created() {
    this.getWaterDataChart();
    this.getElectricDataChart();
    this.getInfoDataCard();
    // water
    this.DataChartWaterCenter();
    this.DataChartWaterAngtadang();
    this.DataChartWaterSuranarai();
    // Electric
    this.DataChartElectricCenter();
    this.DataChartElectricAngtadang();
    this.DataChartElectricSuranarai();
  },
  methods: {
    DataChartWaterCenter() {
      var wcjan = localStorage.getItem("wcjan");
      var wcfeb = localStorage.getItem("wcfeb");
      var wcmar = localStorage.getItem("wcmar");
      var wcapr = localStorage.getItem("wcapr");
      var wcmay = localStorage.getItem("wcmay");
      var wcjun = localStorage.getItem("wcjun");
      var wcjul = localStorage.getItem("wcjul");
      var wcaug = localStorage.getItem("wcaug");
      var wcsep = localStorage.getItem("wcsep");
      var wcoct = localStorage.getItem("wcoct");
      var wcnov = localStorage.getItem("wcnov");
      var wcdec = localStorage.getItem("wcdec");
      this.wcjan = wcjan;
      this.wcfeb = wcfeb;
      this.wcmar = wcmar;
      this.wcapr = wcapr;
      this.wcmay = wcmay;
      this.wcjun = wcjun;
      this.wcjul = wcjul;
      this.wcaug = wcaug;
      this.wcsep = wcsep;
      this.wcoct = wcoct;
      this.wcnov = wcnov;
      this.wcdec = wcdec;
    },
    DataChartWaterAngtadang() {
      var wajan = localStorage.getItem("wajan");
      var wafeb = localStorage.getItem("wafeb");
      var wamar = localStorage.getItem("wamar");
      var waapr = localStorage.getItem("waapr");
      var wamay = localStorage.getItem("wamay");
      var wajun = localStorage.getItem("wajun");
      var wajul = localStorage.getItem("wajul");
      var waaug = localStorage.getItem("waaug");
      var wasep = localStorage.getItem("wasep");
      var waoct = localStorage.getItem("waoct");
      var wanov = localStorage.getItem("wanov");
      var wadec = localStorage.getItem("wadec");
      this.wajan = wajan;
      this.wafeb = wafeb;
      this.wamar = wamar;
      this.waapr = waapr;
      this.wamay = wamay;
      this.wajun = wajun;
      this.wajul = wajul;
      this.waaug = waaug;
      this.wasep = wasep;
      this.waoct = waoct;
      this.wanov = wanov;
      this.wadec = wadec;
    },
    DataChartWaterSuranarai() {
      var wsjan = localStorage.getItem("wsjan");
      var wsfeb = localStorage.getItem("wsfeb");
      var wsmar = localStorage.getItem("wsmar");
      var wsapr = localStorage.getItem("wsapr");
      var wsmay = localStorage.getItem("wsmay");
      var wsjun = localStorage.getItem("wsjun");
      var wsjul = localStorage.getItem("wsjul");
      var wsaug = localStorage.getItem("wsaug");
      var wssep = localStorage.getItem("wssep");
      var wsoct = localStorage.getItem("wsoct");
      var wsnov = localStorage.getItem("wsnov");
      var wsdec = localStorage.getItem("wsdec");
      this.wsjan = wsjan;
      this.wsfeb = wsfeb;
      this.wsmar = wsmar;
      this.wsapr = wsapr;
      this.wsmay = wsmay;
      this.wsjun = wsjun;
      this.wsjul = wsjul;
      this.wsaug = wsaug;
      this.wssep = wssep;
      this.wsoct = wsoct;
      this.wsnov = wsnov;
      this.wsdec = wsdec;
    },
    DataChartElectricCenter() {
      var ecjan = localStorage.getItem("ecjan");
      var ecfeb = localStorage.getItem("ecfeb");
      var ecmar = localStorage.getItem("ecmar");
      var ecapr = localStorage.getItem("ecapr");
      var ecmay = localStorage.getItem("ecmay");
      var ecjun = localStorage.getItem("ecjun");
      var ecjul = localStorage.getItem("ecjul");
      var ecaug = localStorage.getItem("ecaug");
      var ecsep = localStorage.getItem("ecsep");
      var ecoct = localStorage.getItem("ecoct");
      var ecnov = localStorage.getItem("ecnov");
      var ecdec = localStorage.getItem("ecdec");
      this.ecjan = ecjan;
      this.ecfeb = ecfeb;
      this.ecmar = ecmar;
      this.ecapr = ecapr;
      this.ecmay = ecmay;
      this.ecjun = ecjun;
      this.ecjul = ecjul;
      this.ecaug = ecaug;
      this.ecsep = ecsep;
      this.ecoct = ecoct;
      this.ecnov = ecnov;
      this.ecdec = ecdec;
    },
    DataChartElectricAngtadang() {
      var eajan = localStorage.getItem("eajan");
      var eafeb = localStorage.getItem("eafeb");
      var eamar = localStorage.getItem("eamar");
      var eaapr = localStorage.getItem("eaapr");
      var eamay = localStorage.getItem("eamay");
      var eajun = localStorage.getItem("eajun");
      var eajul = localStorage.getItem("eajul");
      var eaaug = localStorage.getItem("eaaug");
      var easep = localStorage.getItem("easep");
      var eaoct = localStorage.getItem("eaoct");
      var eanov = localStorage.getItem("eanov");
      var eadec = localStorage.getItem("eadec");
      this.eajan = eajan;
      this.eafeb = eafeb;
      this.eamar = eamar;
      this.eaapr = eaapr;
      this.eamay = eamay;
      this.eajun = eajun;
      this.eajul = eajul;
      this.eaaug = eaaug;
      this.easep = easep;
      this.eaoct = eaoct;
      this.eanov = eanov;
      this.eadec = eadec;
    },
    DataChartElectricSuranarai() {
      var esjan = localStorage.getItem("esjan");
      var esfeb = localStorage.getItem("esfeb");
      var esmar = localStorage.getItem("esmar");
      var esapr = localStorage.getItem("esapr");
      var esmay = localStorage.getItem("esmay");
      var esjun = localStorage.getItem("esjun");
      var esjul = localStorage.getItem("esjul");
      var esaug = localStorage.getItem("esaug");
      var essep = localStorage.getItem("essep");
      var esoct = localStorage.getItem("esoct");
      var esnov = localStorage.getItem("esnov");
      var esdec = localStorage.getItem("esdec");
      this.esjan = esjan;
      this.esfeb = esfeb;
      this.esmar = esmar;
      this.esapr = esapr;
      this.esmay = esmay;
      this.esjun = esjun;
      this.esjul = esjul;
      this.esaug = esaug;
      this.essep = essep;
      this.esoct = esoct;
      this.esnov = esnov;
      this.esdec = esdec;
    },
    getWaterDataChart() {
      axios
        .get(apiUrl + "/v1/dashboard/water")
        .then((response) => {
          let data = response.data;
          if (data.type === "water") {
            // center
            this.wcjan = data.center.jan;
            this.wcfeb = data.center.feb;
            this.wcmar = data.center.mar;
            this.wcapr = data.center.apr;
            this.wcmay = data.center.may;
            this.wcjun = data.center.jun;
            this.wcjul = data.center.jul;
            this.wcaug = data.center.aug;
            this.wcsep = data.center.sep;
            this.wcoct = data.center.oct;
            this.wcnov = data.center.nov;
            this.wcdec = data.center.dec;
            localStorage.setItem("wcjan", this.wcjan);
            localStorage.setItem("wcfeb", this.wcfeb);
            localStorage.setItem("wcmar", this.wcmar);
            localStorage.setItem("wcapr", this.wcapr);
            localStorage.setItem("wcmay", this.wcmay);
            localStorage.setItem("wcjun", this.wcjun);
            localStorage.setItem("wcjul", this.wcjul);
            localStorage.setItem("wcaug", this.wcaug);
            localStorage.setItem("wcsep", this.wcsep);
            localStorage.setItem("wcoct", this.wcoct);
            localStorage.setItem("wcnov", this.wcnov);
            localStorage.setItem("wcdec", this.wcdec);
            // angtadang
            this.wajan = data.angtadang.jan;
            this.wafeb = data.angtadang.feb;
            this.wamar = data.angtadang.mar;
            this.waapr = data.angtadang.apr;
            this.wamay = data.angtadang.may;
            this.wajun = data.angtadang.jun;
            this.wajul = data.angtadang.jul;
            this.waaug = data.angtadang.aug;
            this.wasep = data.angtadang.sep;
            this.waoct = data.angtadang.oct;
            this.wanov = data.angtadang.nov;
            this.wadec = data.angtadang.dec;
            localStorage.setItem("wajan", this.wajan);
            localStorage.setItem("wafeb", this.wafeb);
            localStorage.setItem("wamar", this.wamar);
            localStorage.setItem("waapr", this.waapr);
            localStorage.setItem("wamay", this.wamay);
            localStorage.setItem("wajun", this.wajun);
            localStorage.setItem("wajul", this.wajul);
            localStorage.setItem("waaug", this.waaug);
            localStorage.setItem("wasep", this.wasep);
            localStorage.setItem("waoct", this.waoct);
            localStorage.setItem("wanov", this.wanov);
            localStorage.setItem("wadec", this.wadec);
            // suranarai
            this.wsjan = data.suranarai.jan;
            this.wsfeb = data.suranarai.feb;
            this.wsmar = data.suranarai.mar;
            this.wsapr = data.suranarai.apr;
            this.wsmay = data.suranarai.may;
            this.wsjun = data.suranarai.jun;
            this.wsjul = data.suranarai.jul;
            this.wsaug = data.suranarai.aug;
            this.wssep = data.suranarai.sep;
            this.wsoct = data.suranarai.oct;
            this.wsnov = data.suranarai.nov;
            this.wsdec = data.suranarai.dec;
            localStorage.setItem("wsjan", this.wsjan);
            localStorage.setItem("wsfeb", this.wsfeb);
            localStorage.setItem("wsmar", this.wsmar);
            localStorage.setItem("wsapr", this.wsapr);
            localStorage.setItem("wsmay", this.wsmay);
            localStorage.setItem("wsjun", this.wsjun);
            localStorage.setItem("wsjul", this.wsjul);
            localStorage.setItem("wsaug", this.wsaug);
            localStorage.setItem("wssep", this.wssep);
            localStorage.setItem("wsoct", this.wsoct);
            localStorage.setItem("wsnov", this.wsnov);
            localStorage.setItem("wsdec", this.wsdec);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getElectricDataChart() {
      axios
        .get(apiUrl + "/v1/dashboard/electric")
        .then((response) => {
          let data = response.data;
          if (data.type === "electricity") {
            // center
            this.ecjan = data.center.jan;
            this.ecfeb = data.center.feb;
            this.ecmar = data.center.mar;
            this.ecapr = data.center.apr;
            this.ecmay = data.center.may;
            this.ecjun = data.center.jun;
            this.ecjul = data.center.jul;
            this.ecaug = data.center.aug;
            this.ecsep = data.center.sep;
            this.ecoct = data.center.oct;
            this.ecnov = data.center.nov;
            this.ecdec = data.center.dec;
            localStorage.setItem("ecjan", this.ecjan);
            localStorage.setItem("ecfeb", this.ecfeb);
            localStorage.setItem("ecmar", this.ecmar);
            localStorage.setItem("ecapr", this.ecapr);
            localStorage.setItem("ecmay", this.ecmay);
            localStorage.setItem("ecjun", this.ecjun);
            localStorage.setItem("ecjul", this.ecjul);
            localStorage.setItem("ecaug", this.ecaug);
            localStorage.setItem("ecsep", this.ecsep);
            localStorage.setItem("ecoct", this.ecoct);
            localStorage.setItem("ecnov", this.ecnov);
            localStorage.setItem("ecdec", this.ecdec);
            // angtadang
            this.eajan = data.angtadang.jan;
            this.eafeb = data.angtadang.feb;
            this.eamar = data.angtadang.mar;
            this.eaapr = data.angtadang.apr;
            this.eamay = data.angtadang.may;
            this.eajun = data.angtadang.jun;
            this.eajul = data.angtadang.jul;
            this.eaaug = data.angtadang.aug;
            this.easep = data.angtadang.sep;
            this.eaoct = data.angtadang.oct;
            this.eanov = data.angtadang.nov;
            this.eadec = data.angtadang.dec;
            localStorage.setItem("eajan", this.eajan);
            localStorage.setItem("eafeb", this.eafeb);
            localStorage.setItem("eamar", this.eamar);
            localStorage.setItem("eaapr", this.eaapr);
            localStorage.setItem("eamay", this.eamay);
            localStorage.setItem("eajun", this.eajun);
            localStorage.setItem("eajul", this.eajul);
            localStorage.setItem("eaaug", this.eaaug);
            localStorage.setItem("easep", this.easep);
            localStorage.setItem("eaoct", this.eaoct);
            localStorage.setItem("eanov", this.eanov);
            localStorage.setItem("eadec", this.eadec);
            // suranarai
            this.esjan = data.suranarai.jan;
            this.esfeb = data.suranarai.feb;
            this.esmar = data.suranarai.mar;
            this.esapr = data.suranarai.apr;
            this.esmay = data.suranarai.may;
            this.esjun = data.suranarai.jun;
            this.esjul = data.suranarai.jul;
            this.esaug = data.suranarai.aug;
            this.essep = data.suranarai.sep;
            this.esoct = data.suranarai.oct;
            this.esnov = data.suranarai.nov;
            this.esdec = data.suranarai.dec;
            localStorage.setItem("esjan", this.esjan);
            localStorage.setItem("esfeb", this.esfeb);
            localStorage.setItem("esmar", this.esmar);
            localStorage.setItem("esapr", this.esapr);
            localStorage.setItem("esmay", this.esmay);
            localStorage.setItem("esjun", this.esjun);
            localStorage.setItem("esjul", this.esjul);
            localStorage.setItem("esaug", this.esaug);
            localStorage.setItem("essep", this.essep);
            localStorage.setItem("esoct", this.esoct);
            localStorage.setItem("esnov", this.esnov);
            localStorage.setItem("esdec", this.esdec);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
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
