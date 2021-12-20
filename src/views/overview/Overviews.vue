<template>
  <div id="app">
    <v-container>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>
              <div class="mx-auto">
                <v-icon size="35px" color="#29DEFF">mdi-water-circle</v-icon>
                ค่าน้ำประปา
              </div>
            </v-card-title>
            <v-card-actions>
              <div class="chart-responsive" :style="{ padding: 10 }">
                <canvas id="water" width="1500" height="350"></canvas>
              </div>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col>
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
                <canvas id="electric" width="1500" height="350"></canvas>
              </div>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
import Chart from "chart.js";
export default {
  components: {},
  mounted: function () {
    var chart = new Chart(water, {
      responsive: true,
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
      responsive: true,
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
    return {};
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
</style>
