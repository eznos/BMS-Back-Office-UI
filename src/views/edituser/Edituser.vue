<template>
  <v-app>
    <v-card elevation="6" width="100%" max-height="100%" class="mx-auto">
      <v-card-title>
        <h1>
          แก้ไขข้อมูลส่วนตัว
        </h1>
      </v-card-title>
      <v-card-text>
        <v-snackbar v-model="snackbar" absolute top color="success">
          <span>ทำการแก้ไขข้อมูลเรียบร้อย</span>
          <v-icon dark>
            mdi-checkbox-marked-circle
          </v-icon>
        </v-snackbar>
        <v-form ref="form" @submit.prevent="submit">
          <v-container fluid>
            <v-row>
              <v-col cols="12" sm="2">
                <v-select
                  :items="affiliation"
                  :rules="rules.name"
                  label="สังกัด"
                  required
                >
                </v-select>
              </v-col>
              <v-col cols="12" sm="2">
                <v-select
                  v-model="form.first"
                  :items="rank"
                  :rules="rules.name"
                  label="ยศ"
                  required
                >
                </v-select>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  v-model="form.first"
                  :rules="rules.name"
                  color="purple darken-2"
                  label="ชื่อ"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  v-model="form.last"
                  :rules="rules.name"
                  color="blue darken-2"
                  label="นามสกุล"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="2">
                <v-text-field
                  type="number"
                  color="blue darken-2"
                  label="เบอร์โทรศัพท์"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="2">
                <v-select
                  v-model="form.favoriteAnimal"
                  label="พื้นที่"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" sm="2">
                <v-select
                  v-model="form.favoriteAnimal"
                  label="อาคาร"
                  required
                ></v-select>
              </v-col>

              <v-col cols="12" sm="2">
                <v-select
                  v-model="form.favoriteAnimal"
                  label="เลขห้องพัก"
                  required
                ></v-select>
              </v-col>

              <v-col cols="12">
                <v-checkbox v-model="form.terms" color="green">
                  <template v-slot:label>
                    <div @click.stop="">
                      ยืนยันการแก้ไขข้อมูล
                    </div>
                  </template>
                </v-checkbox>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <v-btn large color="red" @click="resetForm">
              ล้างข้อมูล
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn large :disabled="!formIsValid" color="success" type="submit">
              แก้ไขข้อมูล
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-app>
</template>
<script>
export default {
  setup() {},
  data() {
    const defaultForm = Object.freeze({
      first: "",
      last: "",

      terms: false,
    });
    return {
      first: "John",
      last: "Doe",
      form: Object.assign({}, defaultForm),
      rules: {
        name: [(val) => (val || "").length > 3 || "This field is required"],
      },
      affiliation: [],
      rank: [],
      conditions: false,
      snackbar: false,
      terms: false,
      defaultForm,
    };
  },
  computed: {
    formIsValid() {
      return this.form.first && this.form.last && this.form.terms;
    },
  },
  methods: {
    resetForm() {
      this.form = Object.assign({}, this.defaultForm);
      this.$refs.form.reset();
    },
    submit() {
      this.snackbar = true;
      this.resetForm();
    },
  },
};
</script>
