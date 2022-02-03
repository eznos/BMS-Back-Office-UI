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
          <v-dialog v-model="dialog" persistent width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" v-bind="attrs" v-on="on">
                <v-icon> mdi-application-export </v-icon>
                Export ข้อมูลภาพรวม
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <v-icon size="30px" color="red">
                  mdi-application-export
                </v-icon>
                &nbsp; Export ข้อมูลภาพรวมเป็นไฟล์ Excel
              </v-card-title>
              <v-card-text>
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
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="agree" @click="dialog = false"> ตกลง </v-btn>
                <v-btn color="warning" @click="dialog = false"> ยกเลิก </v-btn>
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
            <v-card elevation="6" class="rounded-xl">
              <v-list-item>
                <v-list-item-avatar>
                  <v-sheet>
                    <v-icon large>mdi-face-man-shimmer</v-icon>
                  </v-sheet>
                </v-list-item-avatar>
                <v-list-item-content>
                  <div class="text-right mb-3">จำนวนผู้อยู่อาศัยรวม</div>
                  <v-list-item-title class="headline mb-3 text-right">
                    <div class="font">{{ percennumber() }} คน</div>
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
            <v-card elevation="6" class="rounded-xl">
              <v-list-item>
                <v-list-item-avatar>
                  <v-sheet>
                    <v-icon large>mdi-room-service</v-icon>
                  </v-sheet>
                </v-list-item-avatar>
                <v-list-item-content>
                  <div class="text-right mb-3">จำนวนห้องว่าง</div>
                  <v-list-item-title class="headline mb-3 text-right">
                    <div class="font">{{ percennumber() }} ห้อง</div>
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
            <v-card elevation="6" class="rounded-xl">
              <v-list-item>
                <v-list-item-avatar>
                  <v-sheet>
                    <v-icon large>mdi-location-enter</v-icon>
                  </v-sheet>
                </v-list-item-avatar>
                <v-list-item-content>
                  <div class="text-right mb-3">
                    จำนวนผู้เข้าพักอาศัยเดือนนี้
                  </div>
                  <v-list-item-title class="headline mb-3 text-right">
                    <div class="font">{{ percennumber() }} คน</div>
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
            <v-card elevation="6" class="rounded-xl">
              <v-list-item>
                <v-list-item-avatar>
                  <v-sheet>
                    <v-icon large>mdi mdi-exit-run</v-icon>
                  </v-sheet>
                </v-list-item-avatar>
                <v-list-item-content>
                  <div class="text-right mb-3">จำนวนผู้ย้ายออกในเดือนนี้</div>
                  <v-list-item-title class="headline mb-3 text-right">
                    <div class="font">{{ percennumber() }} คน</div>
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
            <v-card class="card-chart rounded-lg" >
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
            <v-card  class="card-chart rounded-lg" >
              <v-card-title>
                <div class="mx-auto ">
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

export default {
  mounted: function () {
    var chart = new Chart(water, {
      type: "bar",
      data: {
        labels: [
          "มกราคม",
          "กุมภาพันธ์",
          "มีนาคม",
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
      number_people: "60",
      dataexport: ["1", "2", "3", "4", "5"],
    };
  },
  methods: {
    //ramdom number in dataset
    getRandomInt() {
      return Math.floor(Math.random() * (5000 - 5 + 1)) + 5;
    },
    percennumber() {
      return Math.floor(Math.random() * (100 - 5 + 1)) + 5;
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
/* canvas{
  background:#D1D1D1;
}
.card-chart{
   background:#D1D1D1;
} */
</style>
