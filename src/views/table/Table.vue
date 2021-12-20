<template>
  <v-data-table
    :headers="headers"
    :items="desserts"
    item-key="name"
    :items-per-page="5"
    class="elevation-1 pa-6"
    :search="search"
  >
    <template v-slot:top>
      <!-- v-container, v-col and v-row are just for decoration purposes. -->
      <v-toolbar flat>
        <v-toolbar-title>
          <div class="title-table">ตารางค่าน้ำค่าไฟ</div>
        </v-toolbar-title>
        <from>
          <v-row>
            <v-col cols="2">
              <v-row class="pa-6">
                <!-- Filter for dessert name-->
                <!-- <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  type="text"
                  label="ค้นหา"
                ></v-text-field> -->
              </v-row>
            </v-col>
            <v-col cols="2">
              <v-row class="pa-6">
                <!-- Filter for dessert name-->
                <v-text-field
                  v-model="dessertFilterValue"
                  type="text"
                  label="กรองด้วยชื่อ"
                ></v-text-field>
              </v-row>
            </v-col>

            <v-col cols="2">
              <v-row class="pa-6">
                <!-- Filter for dessert name-->
                <v-text-field
                  v-model="roomFilterValue"
                  type="text"
                  label="กรองด้วยเลขห้อง"
                ></v-text-field>
              </v-row>
            </v-col>

            <v-col cols="2">
              <v-row class="pa-6">
                <v-dialog
                  ref="dialog"
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
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dateFilterValue"
                    type="month"
                    locale="th-TH"
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="modal = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.dialog.save(dateFilterValue)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-row>
            </v-col>
            <v-col cols="2">
              <v-row class="pa-6">
                <div class="mx-auto">
                  <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="primary"
                        dark
                        v-bind="attrs"
                        v-on="on"
                        block
                      >
                        New Item
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="text-h5">{{ formTitle }}</span>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="editedItem.name"
                                label="Dessert name"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="editedItem.calories"
                                label="Calories"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="editedItem.fat"
                                label="Fat (g)"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="editedItem.carbs"
                                label="Carbs (g)"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="editedItem.protein"
                                label="Protein (g)"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="close">
                          Cancel
                        </v-btn>
                        <v-btn color="blue darken-1" text @click="save">
                          Save
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                      <v-card-title class="text-h5"
                        >Are you sure you want to delete this
                        item?</v-card-title
                      >
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="closeDelete"
                          >Cancel</v-btn
                        >
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="deleteItemConfirm"
                          >OK</v-btn
                        >
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </div>
              </v-row>
            </v-col>
            <v-col cols="2">
              <v-row class="pa-6">
                <v-btn dark block color="petrol" @click="clear"> clear </v-btn>
              </v-row>
            </v-col>
          </v-row>
        </from>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <!-- <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">
        Reset
      </v-btn>
    </template> -->
  </v-data-table>
</template>

<script>
export default {
  data: () => ({
    modal: false,
    dialog: false,
    menu: false,
    search: "",
    dialogDelete: false,

    // Filter models.
    dessertFilterValue: "",
    roomFilterValue: "",
    dateFilterValue: "",

    desserts: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
    defaultItem: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    headers() {
      return [
        {
          text: "Dessert (100g serving)",
          align: "left",

          value: "name",
          filter: this.nameFilter,
        },
        {
          text: "Calories",
          value: "calories",
          filter: this.caloriesFilter,
        },
        {
          text: "Fat (g)",
          value: "fat",
          align: "left",
          filter: this.roomFilter,
        },
        {
          text: "Carbs (g)",
          value: "carbs",
          filter: this.dateFilter,
        },
        {
          text: "Protein (g)",
          value: "protein",
        },
        {
          text: "Iron (%)",
          value: "iron",
        },
        {
          text: "Actions",
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
      if (!this.dessertFilterValue) {
        return true;
      }
      // Check if the current loop value (The dessert name)
      // partially contains the searched word.
      return value
        .toLowerCase()
        .includes(this.dessertFilterValue.toLowerCase());
    },

    roomFilter(value) {
      if (!this.roomFilterValue) {
        return true;
      }
      return value == this.roomFilterValue;
    },
    dateFilter(value) {
      if (!this.dateFilterValue) {
        return true;
      }
      return value == this.dateFilterValue;
    },

    /**
     * Filter for calories column.
     * @param value Value to be tested.
     * @returns {boolean}
     */

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
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
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    },
    clear() {
      (this.dessertFilterValue = ""),
        (this.roomFilterValue = ""),
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
  },
};
</script>

<style scoped>
.title-table {
  font-size: 30px;
  font-family: Sarabun;
}
</style>
