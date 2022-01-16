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
        <div>
          <v-dialog v-model="dialog" max-width="600px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" v-on="on">
                <v-icon> mdi-application-export </v-icon>
                Export ข้อมูลภาพรวม
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <v-icon size="30px" color="red">
                  mdi-application-export
                </v-icon>
                &nbsp; Export ข้อมูลภาพรวม
              </v-card-title>
              <v-card-text></v-card-text>
              <v-card-actions> </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-row>
      <div class="space">
        <!-- info card -->
        <v-row>
          <v-col>
            <v-card>
              <v-list-item>
                <v-list-item-avatar rounded class="mt-n7">
                  <v-sheet color="green" width="80" height="80" elevation="10">
                    <v-icon dark large>store</v-icon>
                  </v-sheet>
                </v-list-item-avatar>
                <v-list-item-content>
                  <div class="overline text-right">Article</div>
                  <v-list-item-title class="headline mb-1 text-right"
                    >523614</v-list-item-title
                  >
                  <div>
                    <v-divider></v-divider>
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-card-actions>
                <v-icon text class="ma-2">person</v-icon>
                <div class="overline">Iyad</div>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col>
            <v-card>
              <v-list-item>
                <v-list-item-avatar rounded class="mt-n7">
                  <v-sheet color="green" width="80" height="80" elevation="10">
                    <v-icon dark large>store</v-icon>
                  </v-sheet>
                </v-list-item-avatar>
                <v-list-item-content>
                  <div class="overline text-right">Article</div>
                  <v-list-item-title class="headline mb-1 text-right"
                    >523614</v-list-item-title
                  >
                  <div>
                    <v-divider></v-divider>
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-card-actions>
                <v-icon text class="ma-2">person</v-icon>
                <div class="overline">Iyad</div>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col>
            <v-card>
              <v-list-item>
                <v-list-item-avatar rounded class="mt-n7">
                  <v-sheet color="green" width="80" height="80" elevation="10">
                    <v-icon dark large>store</v-icon>
                  </v-sheet>
                </v-list-item-avatar>
                <v-list-item-content>
                  <div class="overline text-right">Article</div>
                  <v-list-item-title class="headline mb-1 text-right"
                    >523614</v-list-item-title
                  >
                  <div>
                    <v-divider></v-divider>
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-card-actions>
                <v-icon text class="ma-2">person</v-icon>
                <div class="overline">Iyad</div>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col>
            <v-card>
              <v-list-item>
                <v-list-item-avatar rounded class="mt-n7">
                  <v-sheet color="green" width="80" height="80" elevation="10">
                    <v-icon dark large>store</v-icon>
                  </v-sheet>
                </v-list-item-avatar>
                <v-list-item-content>
                  <div class="overline text-right">Article</div>
                  <v-list-item-title class="headline mb-1 text-right"
                    >523614</v-list-item-title
                  >
                  <div>
                    <v-divider></v-divider>
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-card-actions>
                <v-icon text class="ma-2">person</v-icon>
                <div class="overline">Iyad</div>
              </v-card-actions>
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
            <v-card>
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
            <v-card>
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
export default {
  components: {},
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
    };
  },
  methods: {
    //ramdom number in dataset
    getRandomInt() {
      return Math.floor(Math.random() * (5000 - 5 + 1)) + 5;
    },
  },
};
</script>

<style scoped>
.chart-responsive {
  width: 100%;
  margin: 20px auto;
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
