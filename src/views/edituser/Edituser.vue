<template>
  <v-app id="app">
    <!-- <h1>&ensp; &ensp; ลงทะเบียน</h1> -->
    <v-card class="mx-auto" elevation="10" width="100%">
      <v-card-title>
        <v-icon>mdi-account-edit</v-icon>
        แก้ไขข้อมูลส่วนตัว
      </v-card-title>
      <v-card-text>
        <v-form ref="form" @submit.prevent="submit">
          <v-row>
            <v-col col="12">
              <v-container>
                <v-row>
                  <!-- rank -->
                  <v-col cols="2">
                    <v-select
                      v-model="rank"
                      :items="Rank"
                      label="ยศ"
                      required
                      clearable
                      prepend-icon="mdi-chevron-triple-up"
                    ></v-select>
                  </v-col>
                  <!-- affi -->
                  <v-col cols="2">
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
                  <v-col cols="2">
                    <v-text-field
                      v-model="firstname"
                      :rules="nameRules"
                      label="ชื่อ"
                      prepend-icon="mdi-form-textbox"
                      required
                      clearable
                      autofocus
                    ></v-text-field>
                  </v-col>
                  <!-- last name -->
                  <v-col cols="2">
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
                  <v-col cols="2">
                    <v-text-field
                      v-model="email"
                      :rules="emailRules"
                      label="อีเมล"
                      prepend-icon="mdi-email"
                      clearable
                      required
                    ></v-text-field>
                  </v-col>
                  <!-- tel. -->
                  <v-col cols="2">
                    <validation-provider
                      v-slot="{ errors }"
                      name="phoneNumber"
                      :rules="{
                        required: true,
                        digits: 10,
                        regex: '^(08[0-9]{8})|(06[0-9]{8})|(09[0-9]{8})',
                      }"
                    >
                      <!-- ^0[6,8,9][0-9]{8}$ -->
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
                </v-row>
                <v-row>
                  <!-- sex -->
                  <v-col cols="3">
                    <v-container class="px-0" fluid>
                      <v-radio-group v-model="sex" row>
                        <template v-slot:label>
                          <h3>
                            <v-icon size="30px">mdi-gender-male-female </v-icon>
                            เพศ
                          </h3>
                        </template>
                        <v-radio
                          color="blue darken-1"
                          label="ชาย"
                          value="male"
                        ></v-radio>
                        <v-radio
                          color="pink darken-1"
                          label="หญิง"
                          value="female"
                        ></v-radio>
                        <v-radio
                          color="purple darken-2"
                          label="เพศทางเลือก"
                          value="lgbt"
                        ></v-radio>
                      </v-radio-group>
                    </v-container>
                  </v-col>
                  <!-- avatar -->
                  <v-col cols="2">
                    <v-file-input
                      :rules="rules.Avatar"
                      accept="image/png, image/jpeg, image/bmp"
                      placeholder="เลือกรูปประจำตัว"
                      label="รูปประจำตัว"
                      show-size
                      counter
                    ></v-file-input>
                  </v-col>
                  <!-- zone -->
                  <v-col cols="2">
                    <v-text-field
                      v-model="zone"
                      label="พื้นที่"
                      required
                      clearable
                      prepend-icon="mdi-google-maps"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      v-model="zone"
                      label="อาคาร"
                      required
                      clearable
                      prepend-icon="mdi-office-building-marker-outline"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      v-model="zone"
                      label="เลขห้องพัก"
                      required
                      clearable
                      prepend-icon="mdi-numeric"
                    ></v-text-field>
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
  message: "{_field_} can not be empty",
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
  message: "Email must be valid",
});
export default {
  components: {
    ValidationProvider,
  },
  data: () => ({
    clicked: false,
    showpassword: false,
    loader: null,
    firstname: "",
    lastname: "",
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
          !value ||
          value.size < 2000000 ||
          "Avatar size should be less than 2 MB!",
      ],
      phoneNumber: [(val) => (val || "").length == 10],
    },
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => v.length <= 10 || "Name must be less than 10 characters",
    ],

    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+/.test(v) || "E-mail must be valid",
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
.h1c {
  font-size: 30px;
}
.form {
  padding: 30px;
  margin-top: -30px;
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
