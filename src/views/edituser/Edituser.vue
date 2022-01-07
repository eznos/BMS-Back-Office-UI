<template>
  <v-app id="app">
    <!-- <h1>&ensp; &ensp; ลงทะเบียน</h1> -->
    <v-card class="mx-auto" elevation="10" width="100%">
      <v-card-title>
        <v-icon class="icon">mdi-account-edit</v-icon>
        แก้ไขข้อมูลส่วนตัว
      </v-card-title>
      <v-card-text>
        <v-form ref="form" @submit.prevent="submit">
          <v-row>
            <v-col col="12" class="form">
              <v-container>
                <v-row>
                  <!-- rank -->
                  <v-col cols="12" sm="6" md="4" lg="2">
                    <v-select
                      v-model="rank"
                      :items="Rank"
                      label="ยศ"
                      required
                      autofocus
                      clearable
                      prepend-icon="mdi-chevron-triple-up"
                    ></v-select>
                  </v-col>
                  <!-- affi -->
                  <v-col cols="12" sm="6" md="4" lg="2">
                    <v-select
                      v-model="affiliation"
                      :items="Affiliation"
                      label="สังกัด"
                      required
                      clearable
                      prepend-icon="mdi-format-list-group"
                    ></v-select>
                  </v-col>
                  <!-- name -->
                  <v-col cols="12" sm="4" md="4" lg="2">
                    <v-text-field
                      v-model="firstname"
                      :rules="nameRules"
                      label="ชื่อ"
                      prepend-icon="mdi-form-textbox"
                      required
                      clearable
                    ></v-text-field>
                  </v-col>
                  <!-- last name -->
                  <v-col cols="12" sm="4" md="4" lg="2">
                    <v-text-field
                      v-model="lastname"
                      :rules="nameRules"
                      label="นามสกุล"
                      prepend-icon="mdi-rename-box"
                      required
                      clearable
                    ></v-text-field>
                  </v-col>
                  <!-- email -->
                  <v-col cols="12" sm="4" md="4" lg="2">
                    <v-text-field
                      v-model="email"
                      :rules="emailRules"
                      :error-messages="errors"
                      label="อีเมล"
                      prepend-icon="mdi-email"
                      clearable
                      required
                    ></v-text-field>
                  </v-col>
                  <!-- tel. -->
                  <v-col cols="12" sm="4" md="4" lg="2">
                    <validation-provider
                      v-slot="{ errors }"
                      name="phoneNumber"
                      :rules="{
                        required: true,
                        digits: 10,
                        regex: '^(08[0-9]{8})|(06[0-9]{8})|(09[0-9]{8})',
                      }"
                    >
                      <v-text-field
                        :rules="rules.phoneNumber"
                        v-model="phoneNumber"
                        :counter="10"
                        :error-messages="errors"
                        label="เบอร์โทร"
                        required
                        clearable
                        prepend-icon="mdi-card-account-phone"
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
               
                  <!-- sex -->
                  <v-col cols="12" sm="4" md="4" lg="2">
                    <v-select
                      prepend-icon="mdi-gender-male-female"
                      item-color="red"
                      :items="sex"
                      label="เพศ"
                    >
                    </v-select>
                  </v-col>
                  <!-- zone -->
                  <v-col cols="12" sm="4" md="4" lg="2">
                    <v-text-field
                      v-model="zone"
                      label="พื้นที่"
                      required
                      clearable
                      prepend-icon="mdi-google-maps"
                    ></v-text-field>
                  </v-col>
                  <!-- building -->
                  <v-col cols="12" sm="4" md="4" lg="2">
                    <v-text-field
                      v-model="building"
                      label="อาคาร"
                      required
                      clearable
                      prepend-icon="mdi-office-building-marker-outline"
                    ></v-text-field>
                  </v-col>
                  <!-- roomnumber -->
                  <v-col cols="12" sm="4" md="4" lg="2">
                    <v-text-field
                      v-model="room_no"
                      label="เลขห้องพัก"
                      required
                      clearable
                      prepend-icon="mdi-numeric"
                    ></v-text-field>
                  </v-col>
                  <!-- avatar -->
                  <v-col cols="12" sm="4" md="4" lg="2">
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
          <v-btn
            class="mr-4"
            color="#71D861"
            width="200px"
            large
            v-bind="attrs"
            v-on="on"
            to="/login"
          >
            ยืนยันการลงทะเบียน
          </v-btn>
          <v-btn
            class="mr-4"
            @click="clear"
            to="/login"
            dark
            width="200px"
            large
            color="error"
          >
            ยกเลิกการลงทะเบียน
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-app>
</template>
<script>
import { required, digits, email, max, regex } from "vee-validate/dist/rules";
import { extend, ValidationProvider, setInteractionMode } from "vee-validate";

setInteractionMode("eager");

extend("digits", {
  ...digits,
  message: "{_field_} needs to be {length} digits. ({_value_})",
});

extend("required", {
  ...required,
  message: "{_field_} จำเป็รต้องกรอก",
});

extend("max", {
  ...max,
  message: "{_field_} may not be greater than {length} characters",
});

extend("regex", {
  ...regex,
  message: "เบอร์โทรศัพท์ไม่ตรงกับรูปแบบที่กำหนด",
});

extend("email", {
  ...email,
  message: "Email ไม่สามารถว่างได้",
});
export default {
  components: {
    ValidationProvider,
  },
  data: () => ({
    clicked: false,
    showpassword: false,
    loader: null,
    firstname: null,
    lastname: "",
    zone: "",
    sex: ["ชาย", "หญิง"],
    building: "",
    loading: false,
    dialog: false,
    valid: false,
    tel: "",
    Rank: ["พล.ต.อ. ", "พล.ต.ท.", "พล.ต.ต.", "พ.ต.อ"],
    Affiliation: ["สยศ.ตร.", "สกบ.", "สกพ.", "สงป"],

    rules: {
      username: [
        (val) => (val || "").length >= 6 || "รหัสผ่านต้องมีมากกว่า 6 ตัวอักษร",
      ],
      password: [
        (val) => (val || "").length > 8 || "รหัสผ่านต้องมีมากกว่า 8 ตัวอักษร",
      ],
      Avatar: [
        (value) =>
          !value || value.size < 2000000 || "รูปภาพต้องมีขนาดเล็กกว่า 2 MB!",
      ],
      phoneNumber: [(val) => (val || "").length == 10],
    },
    nameRules: [
      (v) => !!v || "กรุณากรอกชื่อ",
      (v) =>
        v.length >= 2 || "ชื่อต้องมีจำนวนตัวอักษรมากกว่าหรือเท่ากับ 2 ตัวอักษร",
    ],

    emailRules: [
      (v) => !!v || "กรุณากรอกอีเมล",
      (v) => /[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,4}/.test(v) || "อีเมลไม่ผิดรูปแบบ",
    ],
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

  computed: {
    formIsValid() {
      return this.lastname;
    },
  },
  methods: {
    submit() {
      this.$refs.observer.validate();
    },
  },
};
</script>
<style scoped>
.form {
  padding: 25px;
  margin-top: -15px;
}
.icon {
  margin-right: 20px;
  margin-right: 20px;
}
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
