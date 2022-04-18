<template>
  <v-app id="app">
    <!-- title and bottom -->
    <div class="content background-main">
      <v-row justify="space-between" class="px-3">
        <!-- title -->
        <div class="mb-4">
          <v-row style="align-items: center">
            <div class="ml-3 mt-9">
              <h2>
                <v-icon size="40" color="#F3953F">mdi-account-edit</v-icon>
                จัดการผู้ใช้งาน
              </h2>
            </div>
          </v-row>
        </div>
      </v-row>
    </div>
    <!-- table and buttons -->
    <v-card class="card-filter px-6 py-6">
      <v-card-title>
        <!-- title -->
        <v-icon size="35px" class="icon"
          >mdi-format-list-bulleted-triangle</v-icon
        >
        &nbsp;&nbsp;
        <h3>ตารางค่าน้ำประปา</h3>
        &nbsp;&nbsp;
        <!-- delete as selected -->
        <v-btn
          color="error"
          width="140"
          v-bind="attrs"
          v-on="on"
          class="button-filter pt-5 pb-5"
          :disabled="!selectItems"
          @click="deleteItemSelected(selected)"
        >
          <v-icon>mdi-delete-sweep</v-icon>
          &nbsp; ลบข้อมูลที่เลือก
        </v-btn>
        <v-spacer></v-spacer>
        <!-- add user -->
        <v-dialog v-model="dialog" persistent max-width="75%">
          <!-- <template v-slot:activator="{ on: attrs }">
            <v-btn
              color="agree"
              class="button-filter pt-5 pb-5"
              dark
              v-on="{ ...attrs }"
            >
              <v-icon> mdi-account-plus </v-icon>
              &nbsp; เพื่มผู้ใช้งาน
            </v-btn>
          </template> -->
          <v-card>
            <v-card-title>
              <div>
                <span>{{ formTitle }}</span>
              </div>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-form ref="formAdduser" v-model="valid" lazy-validation>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-autocomplete
                        label="ยศ"
                        :items="ranks"
                        v-model="editedItem.rank"
                        required
                        :rules="rules.name"
                        disabled
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-autocomplete
                        v-model="editedItem.affiliation"
                        :items="affiliations"
                        required
                        :rules="rules.name"
                        disabled
                        label="สังกัด"
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.first_name"
                        label="ชื่อ"
                        required
                        :rules="rules.name"
                        disabled
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.last_name"
                        label="นามสกุล"
                        required
                        :rules="rules.name"
                        disabled
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.gender"
                        label="เพศ"
                        required
                        :rules="rules.name"
                        disabled
                      >
                      </v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.phone_number"
                        label="เบอร์โทรศัพท์"
                        required
                        :rules="[rules.phoneNumber.regex]"
                        disabled
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.email"
                        label="อีเมล"
                        required
                        :rules="[rules.email.regex]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedItem.permission"
                        label="ตำแหน่ง"
                        :items="permission"
                        required
                        :rules="rules.name"
                        disabled
                      >
                      </v-select>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-form>
                <v-btn color="warning" text @click="close"> ยกเลิก </v-btn>
                <v-btn color="agree" text :disabled="!valid" @click="save">
                  ยืนยัน
                </v-btn>
              </v-form>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- delete water user -->
        <v-dialog v-model="dialogDelete" persistent max-width="75%">
          <v-card>
            <v-card-title class="text-h5"
              >ต้องการลบผู้อยู่อาศัยคนนี้หรือไม่?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="warning" text @click="closeDelete">ยกเลิก</v-btn>
              <v-btn color="agree" text @click="deleteItemConfirm"
                >ยืนยัน</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-title>
      <!-- data table -->
      <v-card-text>
        <!-- filter -->
        <v-row justify="space-between" class="px-3">
          <v-col cols="6">
            <!-- Filter for  name-->
            <v-text-field
              v-model="search"
              prepend-icon="mdi-magnify"
              type="text"
              label="ค้นหา"
              clearable
              class="filter"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <!-- search by permission -->
            <v-select
              v-model="statusFilterValue"
              prepend-icon=""
              label="ตำแหน่ง"
              :items="permission"
              clearable
              class="filter"
            >
            </v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <!-- start data-table -->
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="userTable"
        item-key="first_name"
        :items-per-page="itemsPerPage"
        class="elevation-1 pa-6"
        :search="search"
        loading
        loading-text="กำลังโหลด... โปรดรอสักครู่"
        show-select
        @input="enterSelect($event)"
      >
        <!-- color of permission on datatable  -->
        <template v-slot:[`item.permission`]="{ item }">
          <v-chip :color="getColor(item.permission)" dark>
            {{ item.permission }}
          </v-chip>
        </template>
        <!-- data -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon @click="editItem(item)"> mdi-pencil </v-icon>
          <!-- <v-icon @click="deleteItem(item)"> mdi-delete </v-icon> -->
        </template>
      </v-data-table>
      <!-- end data-table -->
    </v-card>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    el: "#app",
    valid: false,
    on: {},
    attrs: {},
    modal: false,
    selectItems: false,
    dialog: false,
    menu: false,
    permission: ["admin", "user"],
    search: "",
    dialogDelete: false,
    // Filter models.
    NamefilterValue: "",
    statusFilterValue: "",
    affiliations: [
      "ผบช.ภ.3",
      "สนง.ผบช.ภ.3",
      "สนง.รอง ผบช.ภ.3",
      "ภ.3(ส่วนกลาง)",
      "บก.สส.ภ.3",
      "ภ.จว.นม.",
      "สภ.เมืองนครราชสีมา",
      "บก.อก.ภ.3",
      "ศพฐ.3",
      "ปฏิบัติราชการ",
      "ประจำ",
      "สำรอง",
      "ภ.3",
      "ศฝร.ภ.3",
    ],
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
    selected: [],
    itemsPerPage: 5,
    userTable: [],
    editedIndex: -1,
    editedItem: {
      first_name: "",
      permission: "",
    },
    defaultItem: {
      first_name: "",
      permission: "",
    },
    rules: {
      name: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) =>
          (v && v.length >= 2) || "กรอกชื่อหรือนามสกุลให้มากกว่า 2 ตัวอักษร",
      ],
      email: {
        required: (v) => !!v || "กรุณาใส่อีเมลของผู้รับ",
        regex: (v) =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "อีเมลไม่ถูกต้อง",
      },
      phoneNumber: {
        required: (v) => !!v || "กรุณาใส่เบอร์โทรศัพท์",
        regex: (v) =>
          /^(08[0-9]{8})|(06[0-9]{8})|(09[0-9]{8})$/.test(v) ||
          "เบอร์โทรศัพท์ม่ถูกต้อง",
      },
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "เพิ่มผู้ใช้งาน" : "แก้ไขผู้ใช้งาน";
    },
    headers() {
      return [
        {
          text: "ยศ",
          value: "rank",
        },
        {
          text: "สังกัด",
          value: "affiliation",
        },
        {
          text: "ชื่อ",
          value: "first_name",
        },
        {
          text: "นามสกุล",
          value: "last_name",
        },
        {
          text: "เพศ",
          value: "gender",
        },
        {
          text: "อีเมล",
          value: "email",
        },
        {
          text: "เบอร์โทรศัพท์",
          value: "phone_number",
        },
        {
          text: "ตำแหน่ง",
          value: "permission",
          filter: this.statusFilter,
        },
        {
          text: "การจัดการ",
          value: "actions",
          sortable: false,
        },
      ];
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
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.userTable = [
        {
          rank: "พล.ต.อ.",
          affiliation: "สภ.เมืองนครราชสีมา",
          first_name: "ชัชชาช้า",
          last_name: "ชัชชาวาน",
          gender: "ชาย",
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
          permission: "user",
          email: "user@123.com",
          phone_number: "0896585452",
        },
        {
          rank: "ด.ต.หญิง",
          affiliation: "ศพฐ.3",
          first_name: "ภัทรพร",
          last_name: "ศรีโอภาส",
          gender: "หญิง",
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
          permission: "admin",
          email: "smorston0@nytimes.com",
          phone_number: "0896545652",
        },
        {
          rank: "ด.ต.",
          affiliation: "ศพฐ.3",
          first_name: "อมร ",
          last_name: "ภูมพฤกษ์",
          gender: "ชาย",
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
          permission: "user",
          email: "mtinkler1@google.ca",
          phone_number: "0896582458",
        },
        {
          rank: "ด.ต.",
          affiliation: "ศพฐ.3",
          first_name: "อดุล ",
          last_name: "วงศ์ทอง",
          gender: "ชาย",
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
          permission: "user",
          email: "ssmewings2@umn.edu",
          phone_number: "0896548572",
        },
        {
          rank: "ร.ต.ท.",
          affiliation: "ศพฐ.3",
          first_name: "จรัส ",
          last_name: "สิมฤทธิ์",
          gender: "ชาย",
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
          permission: "user",
          email: "asnartt3@intel.com",
          phone_number: "0995585452",
        },
        {
          rank: "ส.ต.อ.",
          affiliation: "ศพฐ.3",
          first_name: "ธิชากร ",
          last_name: "ผินดอน",
          gender: "ชาย",
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
          permission: "user",
          email: "ibirkbeck4@github.com",
          phone_number: "0685585452",
        },
        {
          rank: "ด.ต.",
          affiliation: "ภ.3(ส่วนกลาง)",
          first_name: "รุ่ง ",
          last_name: "โฉมกิ่ง",
          gender: "ชาย",
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
          permission: "user",
          email: "gmcgrah5@ucoz.ru",
          phone_number: "0689585452",
        },
        {
          rank: "ด.ต.",
          affiliation: "ภ.3(ส่วนกลาง)",
          first_name: "อนุชา ",
          last_name: "ฝากชัยภูมิ",
          gender: "ชาย",
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
          permission: "user",
          email: "jkirkby6@answers.com",
          phone_number: "0894587452",
        },
        {
          rank: "ส.ต.อ.",
          affiliation: "สนง.ผบช.ภ.3",
          first_name: "รัฐพนย์ ",
          last_name: "เรื่องเรือ",
          gender: "ชาย",
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
          permission: "user",
          email: "fillyes7@hubpages.com",
          phone_number: "0891254452",
        },
        {
          rank: "ร.ต.ท.",
          affiliation: "สนง.ผบช.ภ.3",
          first_name: "อิทธิพล",
          last_name: "เพ็ญเติมพันธ์",
          gender: "ชาย",
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
          permission: "user",
          email: "mlarmet8@mail.ru",
          phone_number: "0890256452",
        },
        {
          rank: "ด.ต.",
          affiliation: "ผบช.ภ.3",
          first_name: "ไพโรจน์",
          last_name: "ทนปรางค์",
          gender: "ชาย",
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
          permission: "user",
          email: "tgainseford9@sun.com",
          phone_number: "0805785452",
        },
      ];
    },
    statusFilter(value) {
      if (!this.statusFilterValue) {
        return true;
      }
      return value === this.statusFilterValue;
    },
    editItem(item) {
      this.editedIndex = this.userTable.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.userTable.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.userTable.splice(this.editedIndex, 1);
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
        Object.assign(this.userTable[this.editedIndex], this.editedItem);
      } else {
        this.userTable.push(this.editedItem);
      }
      this.close();
    },
    savea() {
      if (this.editedIndex > -1) {
        Object.assign(this.userTable[this.editedIndex], this.editedItem);
      } else {
        this.userTable.push(this.editedItem);
      }
      this.close();
    },
    clear() {
      (this.statusFilterValue = ""), (this.search = "");
    },
    filterOnlyCapsText(value, search) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value.toString().toLocaleUpperCase().indexOf(search) !== -1
      );
    },
    // show delete as selected button
    enterSelect(values) {
      if (values.length >= 1) {
        return (this.selectItems = true);
        // alert("selected all");
      } else {
        return (this.selectItems = false);
      }
    },

    // delete as selected
    deleteItemSelected() {
      if (confirm("ต้องการลบข้อมูลที่เลือกหรือไม่ ?")) {
        for (var i = 0; i < this.selected.length; i++) {
          const index = this.userTable.indexOf(this.selected[i]);
          this.userTable.splice(index, 1);
          this.selected.length == 0;
        }
        this.dialog = false;
      }
    },
    // select all
    toggleAll() {
      if (this.selected.length) this.selected = [];
      else this.selected = this.getDesserts.slice();
    },
    clearform() {
      this.$refs.formAdduser.reset();
    },
    // color of price
    getColor(permission) {
      if (permission == "admin") return "error";
      else return "agree";
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
