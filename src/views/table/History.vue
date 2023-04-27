<template>
  <v-app id="app">
    <!-- filer and title-->
    <div class="content background-main">
      <v-row justify="space-between" class="px-3">
        <!-- title -->
        <div class="mb-4">
          <v-row style="align-items: center">
            <div class="ml-3 mt-9">
              <h2>
                <v-icon size="40" color="#795548">
                  mdi-clipboard-text-clock
                </v-icon>
                ประวัติ
              </h2>
            </div>
          </v-row>
        </div>
      </v-row>
      <!-- search history -->
      <v-card class="card-filter px-6 py-6">
        <v-card-title>
          <v-icon size="35px" class="icon"
            >mdi-format-list-bulleted-triangle</v-icon
          >
          &nbsp;&nbsp;
          <h3>เครื่องมือค้นหา</h3>
          <!-- button -->
          <v-spacer></v-spacer>
        </v-card-title>
        <!-- search history -->
        <v-form lazy-validation ref="history">
          <v-row justify="space-between" class="px-3">
            <!-- rank -->
            <v-col cols="12" xs="12" sm="12" md="4" lg="4">
              <v-autocomplete
                v-model="rank"
                prepend-icon="mdi-map-legend"
                label="ยศ"
                class="filter"
                :items="ranks"
                clearable
                item-text="name"
                item-value="value"
                :rules="rules.autocomplete"
                name="rank"
                autofocus
              >
              </v-autocomplete>
            </v-col>
            <!--frist name-->
            <v-col cols="12" xs="12" sm="12" md="4" lg="4">
              <v-text-field
                v-model="firstName"
                label="ชื่อ"
                class="filter"
                clearable
                :rules="rules.name"
                name="firstName"
                v-on:keyup="checkEnterPressedToSubmit"
              ></v-text-field>
            </v-col>
            <!-- last name -->
            <v-col cols="12" xs="12" sm="12" md="4" lg="4">
              <v-text-field
                v-model="lastName"
                label="นามสกุล"
                class="filter"
                clearable
                name="lastName"
                :rules="rules.name"
                v-on:keyup="checkEnterPressedToSubmit"
              ></v-text-field>
            </v-col>
            <v-row> </v-row>
            <!-- btn search -->
            <v-col cols="12" justify="space-between" class="px-3">
              <v-btn
                outlined
                color="agree"
                width="140"
                class="button-filter pt-6 pb-6"
                @click="submit()"
              >
                <v-icon>mdi-magnify</v-icon>
                &nbsp; ค้นหา
              </v-btn>
              <v-btn
                outlined
                color="error"
                width="140"
                class="button-filter pt-6 pb-6"
                @click="resetTable()"
              >
                <v-icon>mdi-delete-sweep</v-icon>
                &nbsp; ล้างข้อมูล
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </div>
    <div></div>
    <!-- data table and button -->
    <v-card class="card-filter px-6 py-6">
      <v-card-title>
        <!-- title -->
        <v-icon size="35px" class="icon">mdi-table-large</v-icon>
        &nbsp;&nbsp;
        <h3>ตารางประวัติการใช้น้ำประปา</h3>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialogExport" persistent max-width="75%">
          <template v-slot:activator="{ on, attrs }">
            <v-btn :disabled="!submit" color="#f8ce01" v-bind="attrs" v-on="on">
              Export ข้อมูล
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              ต้องการ Export ข้อมูลเป็นไฟล์ Excel หรือไม่
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" text @click="dialogExport = false">
                ยกเลิก
              </v-btn>
              <v-btn color="agree" text @click="exportHistory"> ยืนยัน </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-title>
      <v-card-text>
        <v-row>
          <!-- water -->
          <v-col cols="12">
            <v-data-table
              v-model="selected"
              :headers="headersWater"
              :items="waterHistoryTable"
              item-key="first_name"
              :items-per-page="itemsPerPage"
              class="elevation-1 pa-6"
              :loading="loadTable"
              loading-text="กำลังโหลด... โปรดรอสักครู่"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              @input="enterSelect($event)"
            >
              <template v-slot:top>
                <h3>ตารางประวัติค่าน้ำประปา</h3>
              </template>
              <template v-slot:item.created_at="{ item }">
                <span>{{
                  new Date(item.created_at).toISOString().substr(0, 7)
                }}</span>
              </template>
              <!-- color of price on datatable  -->
              <template v-slot:[`item.price`]="{ item }">
                <v-chip :color="getColor(item.price)">
                  {{ item.price }}
                </v-chip>
              </template>
              <template v-slot:[`item.unit`]="{ item }">
                <v-chip :color="getColor(item.unit)">
                  {{ item.unit }}
                </v-chip>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
      <v-snackbar v-model="snackbar" :timeout="timeout" :color="colorSnackbar">
        <div class="text-center">
          {{ statusAction }}
        </div>
      </v-snackbar>
    </v-card>
  </v-app>
</template>
<script>
import statuses from "../../json/statuses.json";
import ranks from "../../json/rank.json";
import axios from "axios";
import { apiUrl } from "../../utils/url";
import FileDownload from "js-file-download";
export default {
  data: () => ({
    datenow: new Date().toISOString().substr(0, 4),
    firstName: "",
    lastName: "",
    el: "#app",
    snackbar: false,
    statusAction: "",
    colorSnackbar: "",
    timeout: 2000,
    valid: true,
    loadTable: true,
    sortBy: "first_name",
    sortDesc: false,
    modalAddDate: false,
    modalfilter: false,
    dialogExport: false,
    dialog3: false,
    attrs: {},
    on: {},
    selected: [],
    itemsPerPage: 5,
    selectItems: false,
    emailtarget: "",
    importExcel: false,
    exportExcelElectric: false,
    rank: "",
    ranks: ranks,
    statuses: statuses,
    electricHistoryTable: [],
    waterHistoryTable: [],
    historyElectric: "",
    historyWater: "",
    rules: {
      name: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length >= 2) || "กรอกชื่อให้มากกว่า 2 ตัวอักษร",
      ],
      autocomplete: [(v) => !!v || "กรุณากรอกข้อมูล"],
    },
  }),
  computed: {
    // headersElectric() {
    //   return [
    //     {
    //       text: "เดือน",
    //       align: "left",
    //       value: "created_at",
    //     },
    //     {
    //       text: "จำนวนหน่วย",
    //       value: "unit",
    //     },
    //     {
    //       text: "ค่าใช้จ่าย",
    //       value: "total_pay",
    //     },
    //   ];
    // },
    headersWater() {
      return [
        {
          text: "เดือน",
          align: "left",
          value: "created_at",
        },
        {
          text: "หน่วย",
          value: "unit",
          align: "left",
        },
        {
          text: "ค่าน้ำ",
          value: "price",
          align: "left",
        },
        {
          text: "ค่าน้ำส่วนต่าง",
          value: "price_diff",
          align: "left",
        },
        {
          text: "ค่าใช้จ่ายรวม",
          value: "total_pay",
          align: "left",
        },
      ];
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async checkEnterPressedToSubmit(e) {
      if (e.keyCode === 13) this.submit();
    },
    submit() {
      if (this.$refs.history.validate()) {
        this.getUserHistory();
      }
    },
    // get electric
    async getUserHistory() {
      try {
        let config = {
          headers: {
            "x-api-key": process.env.apiKey,
          },
        };
        return axios
          .get(
            `${apiUrl}/v1/billings/history?&firstName=${this.firstName}&lastName=${this.lastName}&rank=${this.rank}`,
            config
          )
          .then((response) => {
            let data = response.data;
            if (data.status == "success") {
              // this.electricHistoryTable =
              //   data.result.electric.accommodations[0].billings;
              this.waterHistoryTable =
                data.result.water.accommodations[0].billings;
              this.loadTable = false;
              this.snackbar = true;
              this.statusAction = "ค้นหาเรียบร้อย";
              this.colorSnackbar = "agree";
            }
            if (data.status == "success no data") {
              this.loadTable = false;
              this.snackbar = true;
              this.statusAction = "ไม่พบผู้อยู่อาศัย กรุณาค้นหาใหม่";
              this.colorSnackbar = "warning";
            }
          })
          .catch((error) => {
            this.loadTable = false;
            this.snackbar = true;
            this.statusAction = "ค้นหาไม่สำเร็จ กรุณาติดต่อผู้จัดทำ";
            this.colorSnackbar = "warning";
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    },
    // get selected id
    getbillingsID() {
      if (this.selectItems == true) {
        let billingsIDs = [];
        for (var i = 0; i < this.selected.length; i++) {
          billingsIDs.push(this.selected[i].id);
        }
        this.exportElectric(billingsIDs);
      }
    },
    // export with api
    exportHistory() {
      var config = {
        headers: {
          "x-api-key": process.env.apiKey,
        },
      };
      return axios
        .post(apiUrl + "/v1/billings/history/export", config)
        .then((response) => {
          FileDownload(response.data, "ข้อมูลผู้อยู่อาศัย.xlsx");

          this.exportExcelElectric = false;
          this.statusAction = "Export สำเร็จ";
          this.colorSnackbar = "agree";
          this.snackbar = true;
        })
        .catch((error) => {
          console.log(error);
          if (
            error.response.data.error_message ===
            "some record does not have calculated status"
          ) {
            this.statusAction = "Export ไม่สำเร็จ กรุณาเลือกข้อมูลใหม่";
            this.colorSnackbar = "warning";
            this.snackbar = true;
            this.exportExcelElectric = false;
          } else {
            this.statusAction = "Export ไม่สำเร็จ กรุณาติดต่อผู้จัดทำ";
            this.colorSnackbar = "red";
            this.snackbar = true;
            this.exportExcelElectric = false;
          }
        });
    },
    resetTable() {
      this.electricHistoryTable = [];
      this.waterHistoryTable = [];
      this.$refs.history.reset();
      this.loadTable = true;
    },
    // color of price
    getColor(price) {
      if (price == 0) return "#FF606090";
      else return "#FFFFFF00";
    },
    // status color
    getColorForStatus(status) {
      if (status == "draft") return "yellow";
      if (status == "in_progess") return "red";
      if (status == "calculated") return "gray";
      else return "green";
    },
    // show delete as selected button
    enterSelect() {
      if (this.selected.length >= 1) {
        return (this.selectItems = true);
      } else {
        return (this.selectItems = false);
      }
    },
    // select all
    toggleAll() {
      if (this.selected.length) this.selected = [];
      else this.selected = this.getDesserts.slice();
    },
    // sort by name
    toggleOrder() {
      this.sortDesc = !this.sortDesc;
    },
  },
};
</script>

<style scoped>
.filter {
  padding: 5px;
}
.button-filter {
  margin: 10px;
  padding: 20px;
}
.card-filter {
  margin-bottom: 20px;
  margin-top: 20px;
}
.sort {
  margin-right: 20px;
}
.chart-responsive {
  width: 100%;
  margin: 20px auto;
  margin-top: -20px;
}
</style>
