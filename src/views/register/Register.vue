<template>
  <v-app id="app">
    <!-- <h1>&ensp; &ensp; ลงทะเบียน</h1> -->
    <v-container fill-height fill-width>
      <v-layout align-center justify-center>
        <v-card class="mx-auto" color="#F4ffff" elevation="10" width="90%">
          <v-card-title>
            <!-- <h1 class="h1c">ลงทะเบียน</h1> -->
            <div class="content background-main">
              <v-row justify="space-between" class="px-3">
                <!-- title -->
                <div class="mb-4">
                  <v-row style="align-items: center">
                    <div class="ml-3 mt-9">
                      <h2>
                        <v-icon size="40" color="green"
                          >mdi-account-plus</v-icon
                        >
                        ลงทะเบียน
                      </h2>
                    </div>
                  </v-row>
                </div>
              </v-row>
            </div>
          </v-card-title>
          <v-card-text>
            <v-form ref="formRegister" v-model="valid" lazy-validation>
              <v-row>
                <v-col col="12">
                  <v-container>
                    <v-row>
                      <!-- name -->
                      <v-col cols="12" md="6" lg="6">
                        <v-text-field
                          v-model="name"
                          :rules="rules.nameRules"
                          label="ชื่อ"
                          required
                          autofocus
                        ></v-text-field
                      ></v-col>
                      <!-- email -->
                      <v-col cols="12" md="6" lg="6">
                        <v-text-field
                          label="อีเมลผู้รับ"
                          :rules="[rules.email.regex]"
                          v-model="email"
                          required
                        ></v-text-field>
                      </v-col>
                      <!-- phoneNumber -->
                      <v-col cols="12" md="6" lg="6">
                        <v-text-field
                          :rules="[rules.phoneNumber.regex]"
                          v-model="phoneNumber"
                          :counter="10"
                          label="เบอร์โทร"
                          required
                        ></v-text-field
                      ></v-col>
                      <!-- sex -->
                      <v-col cols="12" md="6" lg="6">
                        <v-select
                          label="เพศ"
                          :items="sexs"
                          v-model="sex"
                          required
                          :rules="rules.nameRules"
                        >
                        </v-select>
                      </v-col>
                      <!-- rank -->
                      <v-col cols="12" md="6" lg="6">
                        <v-select
                          v-model="rank"
                          :items="ranks"
                          :rules="rules.nameRules"
                          label="ยศ"
                          required
                        ></v-select>
                      </v-col>
                      <!-- affiliation -->
                      <v-col cols="12" md="6" lg="6">
                        <v-select
                          v-model="affiliation"
                          :items="affiliations"
                          :rules="rules.nameRules"
                          label="สังกัด"
                          required
                        ></v-select>
                      </v-col>
                      <!-- user -->
                      <v-col cols="12" md="6" lg="6">
                        <v-text-field
                          :rules="rules.username"
                          v-model="username"
                          label="ชื่อผู้ใช้งาน"
                          required
                        ></v-text-field>
                      </v-col>
                      <!-- password -->
                      <v-col cols="12" md="6" lg="6">
                        <v-text-field
                          v-model="password"
                          :append-icon="
                            showpassword ? 'mdi-eye' : 'mdi-eye-off'
                          "
                          :type="showpassword ? 'text' : 'password'"
                          required
                          name="input-10-1"
                          :rules="rules.password"
                          label="รหัสผ่านใหม่"
                          @click:append="showpassword = !showpassword"
                        ></v-text-field>
                      </v-col>
                      <!-- avatar -->
                      <v-col cols="12" md="6" lg="6">
                        <v-file-input
                          :rules="rules.Avatar"
                          accept="image/png, image/jpeg, image/bmp"
                          placeholder="เลือกรูปประจำตัว"
                          label="รูปประจำตัว"
                          show-size
                          counter
                        ></v-file-input>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <div class="mx-auto">
              <v-form v-model="valid" lazy-validation></v-form>
              <v-btn
                class="mr-4"
                color="agree"
                width="200px"
                outlined
                large
                :disabled="!valid"
                to="/login"
              >
                ยืนยันการลงทะเบียน
              </v-btn>
              <v-btn
                class="mr-4"
                to="/login"
                width="200px"
                large
                outlined
                color="error"
              >
                ยกเลิกการลงทะเบียน
              </v-btn>
              <v-btn
                class="mr-4"
                large
                outlined
                @click="clearForm"
                color="warning"
              >
                ล้างข้อมูลที่กรอก</v-btn
              >
            </div>
          </v-card-actions>
        </v-card>
      </v-layout>
    </v-container>
  </v-app>
</template>
<script>
export default {
  components: {},
  data: () => ({
    valid: false,
    showpassword: false,
    on: {},
    attrs: {},
    name: "",
    email: "",
    phoneNumber: "",
    sex: "",
    rank: "",
    affiliation: "",
    username: "",
    password: "",
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
    affiliations: ["สยศ.ตร.", "สกบ.", "สกพ.", "สงป"],
    sexs: ["ชาย", "หญิง", "ทางเลือก"],
    rules: {
      email: {
        required: (v) => !!v || "กรุณาใส่อีเมล",
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
      username: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length >= 6) || "ชื่อผู้ใช้ต้องมีมากกว่า 6 ตัวอักษร",
      ],
      password: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length >= 8) || "รหัสผ่านต้องมีมากกว่า 8 ตัวอักษร",
      ],
      Avatar: [
        (value) =>
          !value || value.size < 2000000 || "รูปประจำตัวขนาดไม่เกิน 2 MB",
      ],
      nameRules: [
        (v) => !!v || "กรุณากรอกชื่อ",
        (v) => v.length >= 3 || "ชื่อต้องมีตัวอักษรมากกว่า 3 ตัวอักษร",
      ],
    },
  }),

  setup() {},
  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];
      setTimeout(() => (this[l] = false), 2000);
      this.loader = null;
    },
  },

  computed: {},
  methods: {
    clearForm() {
      this.$refs.formRegister.reset();
    },
  },
};
</script>
<style scoped>
.h1c {
  font-size: 30px;
}
</style>
