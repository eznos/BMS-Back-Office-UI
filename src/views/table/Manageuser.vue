<template>
  <v-app id="app">
    <!-- title and bottom -->
    <div class="pa-3 content background-main">
      <v-row justify="space-between" class="px-3">
        <div class="mb-4">
          <v-row style="align-items: center">
            <div class="ml-3 mt-2">
              <h2>ตารางจัดการผู้ใช้งาน</h2>
            </div>
          </v-row>
        </div>
        <div>
          <!-- add user -->
          <v-dialog v-model="dialog" persistent max-width="500px">
            <template v-slot:activator="{ on: attrs }">
              <v-btn color="#9B3499" dark v-on="{ ...attrs }">
                <v-icon> mdi-account-plus </v-icon>
                เพื่มผู้ใช้งาน
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <div class="myFont">
                  <span>{{ formTitle }}</span>
                </div>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.name"
                        label="ชื่อ-นามสกุล"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.permission"
                        label="ตำแหน่ง"
                      ></v-text-field>
                    </v-col>

                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  ยกเลิก
                </v-btn>
                <v-btn color="blue darken-1" text @click="save"> ยืนยัน </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- delete water user -->
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >ต้องการลบผู้อยู่อาศัยคนนี้หรือไม่?</v-card-title
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
          <!-- delete as selected -->
          <v-btn
            dark
            color="#742872"
            width="140"
            v-bind="attrs"
            v-on="on"
            @click="clear"
            class="ml-2 filter"
          >
            <v-icon>mdi-delete-sweep</v-icon>
            ลบข้อมูลที่เลือก
          </v-btn>
          <v-btn dark color="#561F55" v-bind="attrs" v-on="on" @click="clear">
            <v-icon>mdi-delete</v-icon>
            ลบการค้นหา
          </v-btn>
        </div>
      </v-row>
      <!-- filter -->
      <v-row justify="space-between" class="px-3">
        <!-- Filter for  name-->
        <v-text-field
          v-model="search"
          prepend-icon="mdi-magnify"
          type="text"
          label="ค้นหา"
          clearable
          class="filter"
        ></v-text-field>

        <!-- search by permission -->
        <v-select
          v-model="statusFilter"
          prepend-icon=""
          label="กรองตำแหน่ง"
          :items="permission"
          clearable
          class="filter"
        >
        </v-select>
                <!-- Filter for  status-->
        <v-text-field
          v-model="statusFilterValue"
          prepend-icon="mdi-magnify"
          type="text"
          label="ค้นหาด้วยสถานะ"
          clearable
          class="filter"
        ></v-text-field>

      </v-row>
    </div>
    <v-container>
      <v-row classs="px-3">
        <v-col cols="12">
          <!-- start data-table -->
          <v-data-table
            :headers="headers"
            :items="building"
            item-key="name"
            :items-per-page="5"
            class="table header-blue"
            :search="search"
            loading
            loading-text="กำลังโหลด... โปรดรอสักครู่"
            show-select
            :hide-default-footer="true"
          >
            <template v-slot:top>
              <!-- v-container, v-col and v-row are just for decoration purposes. -->
            </template>
            <!-- data -->
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
            </template>
          </v-data-table>
          <!-- end data-table -->
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    el: "#app",
    valid: false,
    modal: false,
    dialog: false,
    menu: false,
    permission: ["ว่าง", "ไม่ว่าง"],
    search: "",
    dialogDelete: false,
    // Filter models.
    NamefilterValue: "",
    statusFilterValue: "",
    building: [],
    editedIndex: -1,
    editedItem: {
      name: "",

      permission: "",
    },
    defaultItem: {
      name: "",

      permission: "",
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "เพิ่มผู้ใช้งาน" : "แก้ไขผู้ใช้งาน";
    },
    headers() {
      return [
        {
          text: "ชื่อผู้ใช้งาน",
          value: "name",
          align: "left",
          // filter: this.nameFilter,
        },
        {
          text: "ตำแหน่ง",
          value: "permission",
          filter: this.stateFilter,
        },
        {
          text: "สถานะ",
          value: "status",
          search: "",
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
  methods: {
    /**
     * Filter for dessert names column.
     * @param value Value to be tested.
     * @returns {boolean}
     */
    nameFilter(value) {
      // If this filter has no value we just skip the entire filter.
      if (!this.NamefilterValue) {
        return true;
      }
      // Check if the current loop value (The dessert name)
      // partially contains the searched word.
      return value.toLowerCase().includes(this.NamefilterValue.toLowerCase());
    },
    statusFilter(value) {
      if (!this.statusFilterValue) {
        return true;
      }
      return value === this.statusFilterValue;
    },
    /**
     * Filter for เลขห้องพัก column.
     * @param value Value to be tested.
     * @returns {boolean}
     */
    editItem(item) {
      this.editedIndex = this.building.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.building.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.building.splice(this.editedIndex, 1);
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
        Object.assign(this.building[this.editedIndex], this.editedItem);
      } else {
        this.building.push(this.editedItem);
      }
      this.close();
    },
    savea() {
      if (this.editedIndex > -1) {
        Object.assign(this.building[this.editedIndex], this.editedItem);
      } else {
        this.building.push(this.editedItem);
      }
      this.close();
    },
    clear() {
      (this.NamefilterValue = ""),
        (this.statusFilterValue = ""),
        (this.dateFilterValue = "");
      this.statusFilter = "";
    },
    filterOnlyCapsText(value, search) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value.toString().toLocaleUpperCase().indexOf(search) !== -1
      );
    },
  },
};
</script>

<style scoped>
.title-table {
  font-size: 25px;
  padding: 20px;
  font-family: Sarabun;
}
.title {
  font-size: 25px;
  font-family: Sarabun;
}
.form-table {
  margin-top: -20px;
  padding: -20px;
}
.header-table {
  padding: 15px;
  margin-top: 15px;
}


.mx-auto {
  font-size: 30px;
}
.header-blue .v-data-table-header {
  background-color: #466bb2 !important;
}
.filter {
  padding: 10px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
