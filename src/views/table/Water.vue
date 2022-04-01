<template>
  <v-app id="app">
    <!-- title and filter card -->
    <div class="content background-main">
      <v-row justify="space-between" class="px-3">
        <!-- title -->
        <div class="mb-4">
          <v-row style="align-items: center">
            <div class="ml-3 mt-9">
              <h2>ตารางค่าน้ำประปา</h2>
            </div>
            <!-- <span> {{ this.$date().format("YYYY/MM") }} </span>
            <h2>{{ ((new Date().getMonth() + 1) % 12) - 1 }}</h2> -->
          </v-row>
        </div>
      </v-row>
      <!-- filter -->
      <v-card class="card-filter px-6 py-6">
        <!-- title -->
        <v-card-title>
          <v-icon size="35px" class="icon"
            >mdi-format-list-bulleted-triangle</v-icon
          >
          &nbsp;&nbsp;
          <h3>ตัวกรอง</h3>
          <!-- button -->
          <v-spacer></v-spacer>
        </v-card-title>
        <!-- filter -->
        <v-row justify="space-between" class="px-3">
          <!-- Filter for  name-->
          <v-col cols="12" xs="12" sm="12" md="3" lg="4">
            <v-text-field
              v-model="NamefilterValue"
              prepend-icon="mdi-magnify"
              type="text"
              label="กรองด้วยชื่อ"
              class="filter"
              clearable
            ></v-text-field>
          </v-col>
          <!-- Filter for waterGroup-->
          <v-col cols="12" xs="12" sm="12" md="3" lg="4">
            <v-autocomplete
              v-model="waterGroupfilterValue"
              label="กรองด้วยสายมิเตอร์"
              prepend-icon="mdi-home-group"
              :items="meterGroups"
              class="filter"
              clearable
            >
            </v-autocomplete>
          </v-col>
          <!-- Filter for  building-->
          <v-col cols="12" xs="12" sm="12" md="3" lg="4">
            <v-autocomplete
              v-model="buildingFilterValue"
              prepend-icon="mdi-office-building"
              label="ค้นหาด้วยอาคาร"
              class="filter"
              :items="buildings"
              clearable
            >
            </v-autocomplete>
          </v-col>
          <!-- Filter for  roomnumber-->
          <v-col cols="12" xs="12" sm="12" md="3" lg="4">
            <v-autocomplete
              v-model="roomFilterValue"
              prepend-icon="mdi-room-service"
              label="ค้นหาด้วยห้อง"
              class="filter"
              :items="rooms"
              clearable
            >
            </v-autocomplete>
          </v-col>
          <!-- filter by date -->
          <v-col cols="12" xs="12" sm="12" md="3" lg="4">
            <v-dialog
              ref="dialog_filter"
              v-model="modal"
              :return-value.sync="date"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  label="กรองด้วยเดือน"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  class="filter"
                  clearable
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="dateFilterValue"
                type="month"
                locale="th-TH"
              >
                <v-spacer></v-spacer>
                <v-btn text color="warning" @click="modal = false">
                  ยกเลิก
                </v-btn>
                <v-btn
                  text
                  color="agree"
                  @click="$refs.dialog_filter.save(dateFilterValue)"
                >
                  ยืนยัน
                </v-btn>
              </v-date-picker>
            </v-dialog>
          </v-col>
          <!-- Filter for  status-->
          <v-col cols="12" xs="12" sm="12" md="3" lg="4">
            <v-select
              v-model="stateFilterValue"
              :items="state"
              prepend-icon="mdi-list-status"
              label="กรองด้วยสถานะ"
              class="filter"
              clearable
            ></v-select>
          </v-col>
          <!-- btn filter -->
          <v-col justify="space-between" class="px-3">
            <!-- enter filter -->
            <!-- <v-btn
              outlined
              color="agree"
              class="button-filter pt-6 pb-6"
              width="140"
            >
              <v-icon>mdi-magnify</v-icon>
              ค้นหา
            </v-btn> -->
            <!-- reset filter -->
            <v-btn
              outlined
              color="error"
              width="140"
              @click="clear"
              class="button-filter pt-6 pb-6"
            >
              <v-icon>mdi-delete-sweep</v-icon>
              Reset filter
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </div>
    <!-- button and data table -->
    <v-card class="card-filter px-6 py-6">
      <!-- title and button -->
      <v-card-title>
        <!-- title -->
        <v-icon size="35px" class="icon"
          >mdi-format-list-bulleted-triangle</v-icon
        >
        &nbsp;&nbsp;
        <h3>LIST</h3>
        <!-- delete as selected -->
        <v-btn
          dark
          color="error"
          width="140"
          v-bind="attrs"
          v-on="on"
          @click="clear"
          class="button-filter pt-5 pb-5"
        >
          <v-icon>mdi-delete-sweep</v-icon>
          ลบข้อมูลที่เลือก
        </v-btn>
        <!-- button -->
        <v-spacer></v-spacer>
        <div>
          <!-- water diff_price_cal -->
          <v-dialog
            v-model="differencePriceCalculate"
            persistent
            max-width="70%"
          >
            <template v-slot:activator="{ on: attrs }">
              <v-btn
                class="button-filter pt-5 pb-5"
                color="#E91854"
                dark
                v-on="{ ...attrs }"
              >
                <v-icon> mdi-calculator </v-icon>
                คำนวนค่าน้ำส่วนต่าง
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <v-icon> mdi-calculator </v-icon> &nbsp;
                คำนวนค่าน้ำส่วนต่าง</v-card-title
              >
              <v-card-text>
                <!-- new changed  version ╰(▔∀▔)╯  ╰(▔∀▔)╯ -->
                <v-form ref="formDiffPrice" v-model="valid" lazy-validation>
                  <v-row>
                    <!-- meter group -->
                    <v-col cols="4">
                      <v-select
                        v-model="meter_group"
                        label="สายของมิเตอร์น้ำ"
                        prepend-icon="mdi-home-group"
                        required
                        clearable
                        :rules="rules.buildingRoom"
                        autofocus
                        :items="meterGroups"
                        ref="input"
                      >
                      </v-select>
                    </v-col>
                    <!-- room -->
                    <v-col cols="4">
                      <v-text-field
                        v-model.number="numberOfroom"
                        label="จำนวนห้องที่มีผู้อยู่อาศัย"
                        prepend-icon="mdi-numeric"
                        clearable
                        required
                        :rules="rules.buildingRoom"
                        @keypress="isNumber($event)"
                        ref="input"
                      ></v-text-field>
                    </v-col>
                    <!-- meter zone -->
                    <v-col cols="4">
                      <v-text-field
                        v-model.number="meterZone"
                        label="ค่าน้ำจากมิเตอร์ใหญ่"
                        prepend-icon="mdi-car-speed-limiter"
                        clearable
                        required
                        :rules="rules.buildingRoom"
                        @keypress="isNumber($event)"
                        ref="input"
                      >
                      </v-text-field>
                    </v-col>
                    <!-- sum of meter -->
                    <v-col cols="4">
                      <v-text-field
                        v-model.number="meterSum"
                        label="ค่าน้ำที่จดได้"
                        prepend-icon="mdi-gauge"
                        clearable
                        required
                        :rules="rules.buildingRoom"
                        @keypress="isNumber($event)"
                        ref="input"
                      >
                      </v-text-field>
                    </v-col>
                    <!-- difference price -->
                    <v-col cols="12">
                      <div v-if="difference >= 0">
                        <h3>
                          ค่าน้ำส่วนต่าง {{ difference }} บาท ในสายของ
                          {{ this.meter_group }}
                        </h3>
                      </div>
                      <div v-else>
                        <h3 class="negative-value">
                          ค่าน้ำส่วนต่าง {{ difference }} บาท ในสายของ
                          {{ this.meter_group }}
                        </h3>
                      </div>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-form ref="form" v-model="valid" lazy-validation></v-form>
                <v-btn color="error" text @click="clearDifferences"
                  >ล้างข้อมูลที่กรอก</v-btn
                >
                <v-spacer></v-spacer>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-btn
                    color="warning"
                    text
                    @click="differencePriceCalculate = false"
                    >ยกเลิก</v-btn
                  >
                  <v-btn
                    color="agree"
                    text
                    :disabled="!valid"
                    @click="validateDiffprice"
                    >ยืนยันข้อมูล</v-btn
                  >
                </v-form>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- add user -->
          <v-dialog v-model="dialog" persistent max-width="75%">
            <template v-slot:activator="{ on: attrs }">
              <v-btn
                class="button-filter pt-5 pb-5"
                color="agree"
                dark
                v-on="{ ...attrs }"
              >
                <v-icon> mdi-account-plus </v-icon>
                เพิ่มผู้ใช้น้ำ
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span>{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-form ref="formAddwater" v-model="valid" lazy-validation>
                    <v-row>
                      <!-- rank -->
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          v-model="editedItem.rank"
                          :items="ranks"
                          label="ยศ"
                          autofocus
                          required
                          :rules="rules.buildingRoom"
                        >
                        </v-autocomplete>
                      </v-col>
                      <!-- name -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.name"
                          label="ชื่อ-นามสกุล"
                          required
                          :rules="rules.name"
                        ></v-text-field>
                      </v-col>
                      <!-- meter group -->
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          v-model="editedItem.meter_group"
                          :items="meterGroups"
                          label="สายของมิเตอร์น้ำ"
                          required
                          clearable
                          :rules="rules.buildingRoom"
                        >
                        </v-autocomplete>
                      </v-col>
                      <!-- zone -->
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          label="พื้นที่เขต"
                          v-model="editedItem.zone"
                          :items="zones"
                          :rules="rules.buildingRoom"
                        >
                        </v-autocomplete>
                      </v-col>
                      <!-- building -->
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          label="อาคาร"
                          v-model="editedItem.building"
                          :items="buildings"
                          :rules="rules.buildingRoom"
                        >
                        </v-autocomplete>
                      </v-col>
                      <!-- room number -->
                      <v-col cols="12" sm="6" md="4">
                        <v-autocomplete
                          label="เลขห้องพัก"
                          v-model="editedItem.room"
                          :items="rooms"
                          :rules="rules.buildingRoom"
                          @keypress="isNumber($event)"
                        >
                        </v-autocomplete>
                      </v-col>
                      <!-- water No -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.water_no"
                          label="เลขผู้ใช้น้ำ"
                          @keypress="isNumber($event)"
                          required
                          counter="4"
                          :rules="rules.waterNumber"
                        ></v-text-field>
                      </v-col>
                      <!-- water meter -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.water_meter_no"
                          label="เลขมิเตอร์น้ำ"
                          @keypress="isNumber($event)"
                          required
                          counter="4"
                          :rules="rules.waterMeterNumber"
                        ></v-text-field>
                      </v-col>
                      <!-- old unit -->
                      <!-- <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-mol="oldUnit"
                          label="หน่วยค่าน้ำเดือนก่อน"
                          @keypress="isNumber($event)"
                          required
                          suffix="หน่วย"
                          :rules="rules.buildingRoom"
                        >
                          >
                          <template v-slot:label>
                            หน่วยที่จดได้ของรอบบิลเดือนก่อน
                          </template>
                        </v-text-field>
                      </v-col> -->
                      <!-- current unit -->
                      <!-- <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="currentUnit"
                          @keypress="isNumber($event)"
                          required
                          :rules="rules.buildingRoom"
                          suffix="หน่วย"
                        >
                          <template v-slot:label>
                            หน่วยที่จดได้ของรอบบิล
                            {{ new Date().toISOString().substr(0, 7) }}
                          </template></v-text-field
                        >
                      </v-col> -->
                      <!-- water price -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.price"
                          label="ค่าน้ำ"
                          @keypress="isNumber($event)"
                          required
                          :rules="rules.buildingRoom"
                          :value="difference"
                        ></v-text-field>
                      </v-col>
                      <!-- water price Diff -->
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.difference" disabled>
                          <template v-slot:label>
                            ค่าน้ำส่วนนต่างเป็น {{ difference }}
                          </template>
                        </v-text-field>
                      </v-col>
                      <!-- status -->
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          v-model="editedItem.status"
                          :items="state"
                          label="สถานะ"
                          required
                          :rules="rules.buildingRoom"
                        >
                        </v-select>
                      </v-col>
                      <!-- bill pay -->
                      <v-col cols="12" sm="6" md="4">
                        <v-dialog
                          ref="dialog"
                          v-model="modal"
                          persistent
                          width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="editedItem.date_pay"
                              label="รอบบิล"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="editedItem.date_pay"
                            type="month"
                            locale="th-TH"
                          >
                            <v-spacer></v-spacer>
                            <v-btn text color="warning" @click="modal = false">
                              ยกเลิก
                            </v-btn>
                            <v-btn
                              text
                              color="agree"
                              @click="$refs.dialog.save(editedItem.date_pay)"
                            >
                              ยืนยัน
                            </v-btn>
                          </v-date-picker>
                        </v-dialog>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>
              <!-- button -->
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-form ref="formButton" v-model="valid" lazy-validation>
                  <v-btn color="red" text @click="clearForm"
                    >ล้างข้อมูลที่กรอก</v-btn
                  >
                  <v-btn color="warning" text @click="close"> ยกเลิก </v-btn>
                  <v-btn color="agree" :disabled="!valid" text @click="save">
                    ยืนยัน
                  </v-btn></v-form
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- delete water user -->
          <v-dialog v-model="dialogDelete" max-width="75%" persistent>
            <v-card>
              <v-card-title class="text-h5"
                >ต้องการลบผู้ใช้น้ำคนนี้หรือไม่?</v-card-title
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
          <!-- import excel -->
          <v-dialog v-model="importExcel" max-width="75%" persistent>
            <template v-slot:activator="{ on: attrs }">
              <v-btn
                class="button-filter pt-5 pb-5"
                color="#3E14DF"
                dark
                v-on="{ ...attrs }"
              >
                <v-icon> mdi-account-plus </v-icon>
                import ข้อมูล Excel
              </v-btn>
            </template>
            <v-card>
              <v-card-title> นำเข้าข้อมูล Excel </v-card-title>
              <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-file-input
                    label="เลือกไฟล์ Excel ที่ต้องการ"
                    counter
                    show-size
                    :rules="rules.fotmat"
                    type="file"
                    required
                    autofocus
                    accept=".xlsx, .xlsm, .xlsb, .xltx, .xltm,  .xls,  .xla,"
                  ></v-file-input>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-btn color="warning" text @click="importExcel = false">
                    ยกเลิก
                  </v-btn>
                  <v-btn
                    color="agree"
                    text
                    :disabled="!valid"
                    @click="importExcel = false"
                  >
                    ยืนยัน
                  </v-btn>
                </v-form>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- export excel to email -->
          <v-dialog v-model="exportExcelwater" max-width="75%" persistent>
            <template v-slot:activator="{ on: attrs }">
              <v-btn
                color="#1572A1"
                class="button-filter pt-5 pb-5"
                dark
                v-on="{ ...attrs }"
              >
                <v-icon> mdi-file-export-outline </v-icon>
                Export ข้อมูล Excel
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                ส่งออกข้อมูล Excel ของค่าน้ำประปาไปยังอีเมลที่ต้องการ
              </v-card-title>
              <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-row>
                    <!-- date -->
                    <v-col cols="12">
                      <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="70%"
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="dateExport"
                            label="เลือกเดือนที่ต้องการ Export"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="dateExport"
                          type="month"
                          no-title
                          scrollable
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
                    <!-- email target -->
                    <v-col cols="12">
                      <v-text-field
                        label="อีเมลผู้รับ"
                        :rules="[rules.email.regex]"
                        v-model="emailtarget"
                        prepend-icon="mdi-at"
                        autofocus
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-btn color="warning" text @click="exportExcelwater = false">
                    ยกเลิก
                  </v-btn>
                  <v-btn
                    color="agree"
                    :disabled="!valid"
                    text
                    @click="exportExcelwater = false"
                  >
                    ยืนยัน
                  </v-btn>
                </v-form>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-card-title>
      <v-card-text>
        <!-- start data-table -->
        <v-data-table
          :headers="headers"
          :items="waterTable"
          item-key="name"
          :items-per-page="5"
          class="elevation-1 pa-6 th-1"
          :search="search"
          loading
          loading-text="กำลังโหลด... โปรดรอสักครู่"
          show-select
        >
          <!-- <template v-slot:[`item&item.actions`]="{ item }">
            <tr>
              <td>{{ item.rank }}</td>
              <td>{{ item.neme }}</td>
            </tr>
          </template> -->
              <!-- color status on datatable  -->
            <template v-slot:[`item.price`]="{ item }">
              <v-chip :color="getColor(item.price)">
                {{ item.price }}
              </v-chip>
            </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
        <!-- end data-table -->
      </v-card-text>
    </v-card>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    el: "#app",
    oldUnit: null,
    currentUnit: null,
    attrs: {},
    on: {},
    selectedRows: [],
    valid: true,
    meterSum: null,
    meterZone: null,
    numberOfroom: "",
    rankFilterValue: "",
    rank: null,
    ranks: [
      "พล.ต.อ.",
      "พล.ต.ท.",
      "พล.ต.ต.",
      "พ.ต.อ.",
      "พ.ต.ท.",
      "พ.ต.ต.",
      "ร.ต.อ.",
      "ร.ต.ท.",
      "ร.ต.ต.",
      "ด.ต.",
      "จ.ส.ต.",
      "ส.ต.อ.",
      "ส.ต.ท.",
      "ส.ต.ต.",
    ],
    modal: false,
    meter_group: null,
    meterGroups: ["ป.1", "ป.83", "ป.84", "ป.212", "ป.391"],
    dialog: false,
    emailtarget: "",
    dateExport: new Date().toISOString().substr(0, 7),
    differencePriceCalculate: false,
    importExcel: false,
    exportExcelwater: false,
    menu: false,
    zonesBuildings: {
      เขตส่วนกลาง: [
        "2/11",
        "2/12",
        "2/13",
        "2/14",
        "2/15",
        "2/16",
        "2/17",
        "2/18",
      ],
      เขตสุระ: [
        "2/20",
        "2/21",
        "2/22",
        "2/23",
        "2/24",
        "2/25",
        "2/26",
        "2/27",
        "2/28",
        "2/29",
        "2/31",
        "2/32",
        "2/33",
        "2/34",
        "2/35",
        "2/36",
        "2/37",
        "2/38",
        "2/39",
        "2/40",
        "2/41",
      ],
      เขตอังฏดาง: ["2/19"],
    },
    buildingsRooms: {
      "2/11": [
        "97",
        "99",
        "101",
        "103",
        "105",
        "107",
        "109",
        "111",
        "113",
        "115",
        "117",
        "119",
      ],
      "2/12": [
        "73",
        "75",
        "77",
        "79",
        "81",
        "83",
        "85",
        "87",
        "89",
        "91",
        "93",
        "95",
      ],
      "2/13": [
        "108",
        "110",
        "112",
        "114",
        "116",
        "118",
        "120",
        "122",
        "124",
        "126",
        "128",
        "130",
      ],
      "2/14": [
        "101",
        "102",
        "103",
        "104",
        "105",
        "106",
        "201",
        "202",
        "203",
        "204",
        "205",
        "206",
        "301",
        "302",
        "303",
        "304",
        "305",
        "306",
        "401",
        "402",
        "403",
        "404",
        "405",
        "406",
        "501",
        "502",
        "503",
        "504",
        "505",
        "506",
      ],
      "2/15": [
        "121",
        "123",
        "125",
        "127",
        "129",
        "131",
        "133",
        "135",
        "137",
        "139",
        "141",
        "143",
        "145",
        "147",
        "149",
        "151",
        "153",
        "155",
        "157",
        "159",
        "161",
        "163",
        "165",
        "167",
        "169",
        "171",
        "173",
        "175",
      ],
      "2/16": [
        "177",
        "179",
        "181",
        "183",
        "185",
        "187",
        "189",
        "191",
        "193",
        "195",
        "197",
        "199",
        "201",
        "203",
        "205",
        "207",
        "209",
        "211",
        "213",
        "215",
        "217",
        "219",
        "221",
        "223",
        "225",
      ],
      "2/17": [
        "132",
        "134",
        "136",
        "138",
        "140",
        "142",
        "144",
        "146",
        "148",
        "150",
        "152",
        "154",
        "156",
        "158",
        "160",
        "162",
        "164",
        "166",
        "168",
        "170",
        "172",
        "174",
        "176",
        "178",
        "180",
        "182",
        "184",
        "186",
      ],
      "2/18": [
        "50",
        "52",
        "54",
        "56",
        "58",
        "60",
        "62",
        "64",
        "66",
        "68",
        "70",
        "72",
        "74",
        "76",
        "78",
        "80",
        "82",
        "84",
        "86",
        "88",
        "90",
        "92",
        "94",
        "96",
        "98",
        "100",
        "102",
        "104",
      ],
      "2/19": [
        "101",
        "102",
        "103",
        "104",
        "105",
        "106",
        "107",
        "108",
        "109",
        "110",
        "201",
        "202",
        "203",
        "204",
        "205",
        "206",
        "207",
        "208",
        "209",
        "210",
        "211",
        "212",
        "213",
        "214",
        "215",
        "301",
        "302",
        "303",
        "304",
        "305",
        "306",
        "307",
        "308",
        "309",
        "310",
        "311",
        "312",
        "313",
        "314",
        "315",
        "401",
        "402",
        "403",
        "404",
        "405",
        "406",
        "407",
        "408",
        "409",
        "410",
        "411",
        "412",
        "413",
        "414",
        "415",
        "501",
        "502",
        "503",
        "504",
        "505",
        "506",
        "507",
        "508",
        "509",
        "510",
        "511",
        "512",
        "513",
        "514",
        "515",
      ],
      "2/20": ["1", "2"],
      "2/21": ["3", "4"],
      "2/22": ["5", "6"],
      "2/23": ["7", "8"],
      "2/24": ["9", "10"],
      "2/25": ["11", "12"],
      "2/26": ["13", "14"],
      "2/27": ["15", "16"],
      "2/28": ["17", "18"],
      "2/29": ["19", "20"],
      "2/31": ["79", "80", "81", "82", "83", "84", "85", "86", "87", "88"],
      "2/32": ["89", "90", "91", "92", "93", "94", "95", "96", "97", "98"],
      "2/33": [
        "99",
        "100",
        "101",
        "102",
        "103",
        "104",
        "105",
        "106",
        "107",
        "108",
      ],
      "2/34": [
        "109",
        "110",
        "111",
        "112",
        "113",
        "114",
        "115",
        "116",
        "117",
        "118",
      ],
      "2/35": [
        "119",
        "120",
        "121",
        "122",
        "123",
        "124",
        "125",
        "126",
        "127",
        "128",
      ],
      "2/36": [
        "129",
        "130",
        "131",
        "132",
        "133",
        "134",
        "135",
        "136",
        "137",
        "138",
      ],
      "2/37": [
        "139",
        "140",
        "141",
        "142",
        "143",
        "144",
        "145",
        "146",
        "147",
        "148",
      ],
      "2/38": [
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37",
        "38",
        "39",
        "40",
        "41",
        "42",
        "43",
        "44",
        "45",
        "46",
        "47",
        "48",
        "49",
        "50",
      ],
      "2/39": [
        "149",
        "150",
        "151",
        "152",
        "153",
        "154",
        "155",
        "156",
        "157",
        "158",
        "159",
        "160",
        "161",
        "162",
        "163",
        "164",
        "165",
        "166",
        "167",
        "168",
        "169",
        "170",
        "171",
        "172",
        "173",
        "174",
        "175",
        "176",
        "177",
        "178",
      ],
      "2/40": [
        "179",
        "180",
        "181",
        "182",
        "183",
        "184",
        "185",
        "186",
        "187",
        "188",
        "189",
        "190",
        "191",
        "192",
        "193",
        "194",
        "195",
        "196",
        "197",
        "198",
        "199",
        "200",
        "201",
        "202",
        "203",
        "204",
        "205",
        "206",
        "207",
        "208",
      ],
      "2/41": [
        "212",
        "213",
        "214",
        "215",
        "216",
        "217",
        "218",
        "219",
        "220",
        "221",
        "222",
        "223",
        "224",
        "225",
        "226",
        "227",
        "228",
        "229",
        "230",
        "231",
        "232",
        "233",
        "234",
        "235",
        "236",
        "237",
        "238",
        "239",
        "240",
      ],
    },
    search: "",
    dialogDelete: false,
    // Filter models
    NamefilterValue: "",
    waterGroupfilterValue: "",
    buildingFilterValue: "",
    roomFilterValue: "",
    dateFilterValue: "",
    date: "",
    stateFilterValue: "",
    state: ["Approve", "Non Approve"],
    waterTable: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      room: "",
      water_no: "",
      water_meter_no: "",
      difference_price: "",
      date_pay: new Date().toISOString().substr(0, 7),
      status: "Non Approve",
    },
    defaultItem: {
      name: "",
      room: "",
      water_no: "",
      water_meter_no: "",
      difference_price: "",
      sum_price: "",
      date_pay: new Date().toISOString().substr(0, 7),
      status: "Non Approve",
    },
    rules: {
      format: [
        (value) => !value || value.size < 20000000 || "ขนาดไฟล์ไม่เกิน 20 MB",
      ],
      email: {
        required: (v) => !!v || "กรุณาใส่อีเมลของผู้รับ",
        regex: (v) =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "อีเมลไม่ถูกต้อง",
      },
      name: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length >= 2) || "กรอกชื่อให้มากกว่า 2 ตัวอักษร",
      ],
      waterNumber: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length == 4) || "กรอกเลขผู้ใช้น้ำประปาไม่ครบ 4 ตัว",
      ],
      waterMeterNumber: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length == 4) || "กรอกเลขมิเตอร์น้ำประปาไม่ครบ 4 ตัว",
      ],
      buildingRoom: [(v) => !!v || "กรุณากรอกข้อมูล"],
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "เพิ่มผู้ใช้น้ำ" : "แก้ไขผู้ใช้น้ำ";
    },
    // header table
    headers() {
      return [
        {
          text: "ยศ",
          align: "left",
          value: "rank",
          filter: this.rankFilter,
        },
        {
          text: "ชื่อ-นามสกุล",
          value: "name",
          filter: this.nameFilter,
        },
        {
          text: "สายของมิเตอร์",
          value: "meter_group",
          filter: this.groupFilter,
        },
        {
          text: "อาคาร",
          value: "building",
          filter: this.buildingFilter,
        },
        {
          text: "เลขห้องพัก",
          value: "room",
          filter: this.roomFilter,
        },
        {
          text: "เลขผู้ใช้น้ำ",
          value: "water_no",
        },
        {
          text: "เลขมิเตอร์น้ำ",
          value: "water_meter_no",
        },
        {
          text: "รอบบิล",
          value: "date_pay",
          filter: this.dateFilter,
        },
        {
          text: "ค่าน้ำ",
          value: "price",
        },
        {
          text: "ค่าน้ำส่วนต่าง",
          value: "difference_price",
        },
        {
          text: "ค่าน้ำรวม",
          value: "sum_price",
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
    // differencePriceCalculate
    difference: function () {
      const sum = this.meterSum;
      const zone = this.meterZone;
      const room = this.numberOfroom;
      if (sum && zone && room) {
        return ((parseInt(sum) - parseInt(zone)) / parseInt(room)).toFixed(2);
      } else {
        return "0.00";
      }
    },

    // autocomplete  [] {} () <>
    zones() {
      return Object.keys(this.zonesBuildings);
    },
    buildings() {
      // for filter
      if (this.buildingFilterValue) {
        return Object.keys(this.buildingsRooms);
      }
      // autocomplete in calculator difference price
      if (this.zonesCalculate) {
        return this.zonesBuildings[this.zonesCalculate];
      }
      // autocomplete in form
      if (!this.editedItem.zone) {
        return ["ไม่มีข้อมูล"];
      } else {
        return this.zonesBuildings[this.editedItem.zone];
      }
    },
    rooms() {
      if (this.buildingFilterValue) {
        return this.buildingsRooms[this.buildingFilterValue];
      }
      if (!this.editedItem.building) {
        return ["ไม่มีข้อมูล"];
      } else {
        return this.buildingsRooms[this.editedItem.building];
      }
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
  // mock data
  created() {
    this.initialize();
  },
  methods: {
    // mock data in table
    initialize() {
      this.waterTable = [
        {
          rank: "พล.ต.อ.",
          name: "ชัชชาช้า ชัชชาวาน",
          zone: "เขตสุระ",
          building: "2/20",
          room: "2",
          meter_group: "ป.1",
          water_no: "1234",
          water_meter_no: "1234",
          date_pay: "2022-03",
          price: "30",
          difference_price: "50",
          sum_price: "80",
          status: "Approve",
        },
        {
          rank: "ด.ต.หญิง",
          name: "ภัทรพร ศรีโอภาส",
          zone: "อัษฎางค์",
          building: "2/19",
          room: "103",
          meter_group: "ป.1",
          water_no: "4567",
          water_meter_no: "4567",
          date_pay: "2021-06",
          price: "19",
          difference_price: "25.34",
          sum_price: "44.34",
          status: "Approve",
        },
        {
          rank: "ด.ต.",
          name: "อมร ภูมพฤกษ์",
          zone: "อัษฎางค์",
          building: "2/19",
          room: "107",
          meter_group: "ป.1",
          water_no: "7540",
          water_meter_no: "7540",
          date_pay: "2021-06",
          price: "57",
          difference_price: "25.34",
          sum_price: "82.34",
          status: "Approve",
        },
        {
          rank: "ด.ต.",
          name: "อดุล วงศ์ทอง",
          zone: "อัษฎางค์",
          building: "2/19",
          room: "202",
          meter_group: "ป.1",
          water_no: "9856",
          water_meter_no: "9856",
          date_pay: "2021-06",
          price: "95",
          difference_price: "25.34",
          sum_price: "120.34",
          status: "Approve",
        },
        {
          rank: "ร.ต.ท.",
          name: "จรัส สิมฤทธิ์",
          zone: "อัษฎางค์",
          building: "2/19",
          room: "206",
          meter_group: "ป.1",
          water_no: "3214",
          water_meter_no: "3214",
          date_pay: "2021-06",
          price: "95",
          difference_price: "25.34",
          sum_price: "120.34",
          status: "Non Approve",
        },
        {
          rank: "ส.ต.อ.",
          name: "ธิชากร ผินดอน",
          zone: "อัษฎางค์",
          building: "2/19",
          room: "305",
          meter_group: "ป.83",
          water_no: "5467",
          water_meter_no: "5467",
          date_pay: "2021-06",
          price: "76",
          difference_price: "25.34",
          sum_price: "101.34",
          status: "Non Approve",
        },
        {
          rank: "ด.ต.",
          name: "รุ่ง โฉมกิ่ง",
          zone: "อัษฎางค์",
          building: "2/19",
          room: "402",
          meter_group: "ป.1",
          water_no: "8520",
          water_meter_no: "8520",
          date_pay: "2021-06",
          price: "95",
          difference_price: "25.34",
          sum_price: "120.34",
          status: "Non Approve",
        },
        {
          rank: "ด.ต.",
          name: "อนุชา ฝากชัยภูมิ",
          zone: "อัษฎางค์",
          building: "2/19",
          room: "413",
          meter_group: "ป.1",
          water_no: "7845",
          water_meter_no: "7845",
          date_pay: "2021-06",
          price: "152",
          difference_price: "25.34",
          sum_price: "177.34",
          status: "Non Approve",
        },
        {
          rank: "ส.ต.อ.",
          name: "รัฐพนย์ เรื่องเรือ",
          zone: "อัษฎางค์",
          building: "2/19",
          room: "504",
          meter_group: "ป.1",
          water_no: "3568",
          water_meter_no: "3568",
          date_pay: "2021-06",
          price: "95",
          difference_price: "25.34",
          sum_price: "120.34",
          status: "Non Approve",
        },
        {
          rank: "ร.ต.ท.",
          name: "อิทธิพล เพ็ญเติมพันธ์",
          zone: "อัษฎางค์",
          building: "2/19",
          room: "514",
          meter_group: "ป.1",
          water_no: "5568",
          water_meter_no: "5568",
          date_pay: "2021-06",
          price: "95",
          difference_price: "25.34",
          sum_price: "120.34",
          status: "Non Approve",
        },
        {
          rank: "ด.ต.",
          name: "ไพโรจน์ ทนปรางค์",
          zone: "อัษฎางค์",
          building: "2/19",
          room: "515",
          meter_group: "ป.1",
          water_no: "1123",
          water_meter_no: "1123",
          date_pay: "2021-06",
          price: "19",
          difference_price: "25.34",
          sum_price: "44.34",
          status: "Non Approve",
        },
      ];
    },
    rankFilter(value) {
      if (!this.rankFilterValue) {
        return true;
      }
      return value === this.rankFilterValue;
    },
    nameFilter(value) {
      // If this filter has no value we just skip the entire filter.
      if (!this.NamefilterValue) {
        return true;
      }
      // Check if the current loop value (The dessert name)
      // partially contains the searched word.
      return value.toLowerCase().includes(this.NamefilterValue.toLowerCase());
    },
    groupFilter(value) {
      if (!this.waterGroupfilterValue) {
        return true;
      }
      return value === this.waterGroupfilterValue;
    },
    buildingFilter(value) {
      if (!this.buildingFilterValue) {
        return true;
      }
      return value === this.buildingFilterValue;
    },
    roomFilter(value) {
      if (!this.roomFilterValue) {
        return true;
      }
      return value === this.roomFilterValue;
    },
    stateFilter(value) {
      if (!this.stateFilterValue) {
        return true;
      }
      return value === this.stateFilterValue;
    },
    dateFilter(value) {
      if (!this.dateFilterValue) {
        return true;
      }
      return value == this.dateFilterValue;
    },
    editItem(item) {
      this.editedIndex = this.waterTable.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.waterTable.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.waterTable.splice(this.editedIndex, 1);
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
        Object.assign(this.waterTable[this.editedIndex], this.editedItem);
      } else {
        this.waterTable.push(this.editedItem);
      }
      this.close();
    },
    savefilter() {
      if (this.editedIndex > -1) {
        Object.assign(this.waterTable[this.editedIndex], this.editedItem);
      } else {
        this.waterTable.push(this.editedItem);
      }
      this.close();
    },
    clear() {
      (this.NamefilterValue = ""),
        (this.waterGroupfilterValue = ""),
        (this.buildingFilterValue = ""),
        (this.roomFilterValue = ""),
        (this.stateFilterValue = ""),
        (this.dateFilterValue = "");
      this.date = "";
      this.search = "";
    },
    filterOnlyCapsText(value, search) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value.toString().toLocaleUpperCase().indexOf(search) !== -1
      );
    },
    // number only in text field
    isNumber: function (evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    // clear input form
    clearForm() {
      // this.$refs.form.reset();
      this.$refs.formAddwater.reset();
    },
    clearDifferences() {
      this.$refs.formDiffPrice.reset();
    },
    validateDiffprice() {
      if (!this.valid) {
        this.$refs.formDiffPrice.validate();
      } else {
        this.close();
      }
    },
    KeyboardEvent() {
      window.addEventListener("keydown", (event) => {
        if (event.code === "Enter") {
          // do your stuff
          this.exportExcelwater = false;
        }
      });
    },
            // color of price
    getColor(price) {
      if (price == 0) return "red";
      else return "#ffffff";
    },
  },
};
</script>

<style scoped>
.title-table {
  font-size: 25px;
  padding: 10px;
  font-family: Sarabun;
}
.button-filter {
  margin: 10px;
  padding: 20px;
}
.filter {
  padding: 5px;
}
.card-filter {
  margin-bottom: 20px;
  margin-top: 20px;
}
.negative-value {
  color: red;
}

.v-data-table {
  font-size: 20px;
}
</style>
