<template>
  <v-app>
   
      <v-card class="justify-center" :style="{ padding: 10 }">
        <v-card-title>
          <p class="title">Chart.jS Vue</p>
        </v-card-title>
        <v-card-text  :style="{ margin: 10 }">
             <canvas id="graph" width="400" height="400"></canvas>
        
        </v-card-text>
         
      </v-card>
    
  </v-app>
</template>

<script>
import Chart from "chart.js";
export default {
  components: {},
  mounted: function () {
    var ctx = document.getElementById("graph").getContext("2d");
    var bar = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["1", "2", "3"],
        datasets: [
          {
            label: "# of Vote",
            data: [12, 45, 67],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(255, 159, 64, 0.2)",
              "rgba(54, 162, 235, 0.2)",
            ],
            borderColor: [
              "rgb(255, 99, 132)",
              "rgb(255, 159, 64)",
              "rgb(255, 205, 86)",
            ],
            borderWidth: 1,
          },
        ],
      },
    });
    console.log(bar);
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
html {
  height: 100%;
}

#app {
 

  max-width: 400px;

  text-align: center;
}

#app a {
  color: #42b983;
  text-decoration: none;
}
.logo {
  width: 100px;
  height: 100px;
}
.title {
  color: #72;
  font-size: 50px;
}

</style>
