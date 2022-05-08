<template>
  <v-app id="app">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex class="text-xs-center" xs12 sm12 md4>
            <v-card
              color="#F4ffff"
              elevation="6"
              class="rounded-card"
              max-width="700px"
              max-height="700px"
            >
              <v-spacer></v-spacer>
              <v-card-title class="justify-center" dark>
                <h2>ลืมรหัสผ่าน</h2>
              </v-card-title>
              <v-card-subtitle> กรอกรหัสผ่านใหม่ </v-card-subtitle>
              <v-card-text :style="{ padding: 0 }">
                <v-form>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="12">
                        <div
                          class="form-group"
                          :class="{
                            'form-group--error': $v.password.$error,
                          }"
                        >
                          <v-text-field
                            v-model="password"
                            :append-icon="
                              showpassword ? 'mdi-eye' : 'mdi-eye-off'
                            "
                            :type="showpassword ? 'text' : 'password'"
                            required
                            name="input-10-1"
                            prepend-icon="lock"
                            label="รหัสผ่านใหม่"
                            class="form__input"
                            v-model.trim="$v.password.$model"
                            @click:append="showpassword = !showpassword"
                            autofocus
                          ></v-text-field>
                        </div>
                        <!-- <v-alert
                          dense
                          type="warning"
                          class="error"
                          v-if="!$v.password.required"
                          border="top"
                          dark
                        >
                          กรุณากรอกรหัสผ่าน
                        </v-alert> -->
                        <v-alert
                          dense
                          text
                          type="error"
                          v-if="!$v.password.required"
                        >
                          <strong>กรุณากรอกรหัสผ่าน</strong>
                        </v-alert>
                        <v-alert
                          dense
                          text
                          type="error"
                          v-if="!$v.password.minLength"
                          dark
                        >
                          กรุณากรอกรหัสผ่านใหม่ให้มีมากกว่า
                          {{ $v.password.$params.minLength.min }} ตัวอักษร
                        </v-alert>
                      </v-col>
                      <v-col cols="12" sm="6" md="12">
                        <div
                          class="form-group"
                          :class="{
                            'form-group--error': $v.repeatPassword.$error,
                          }"
                        >
                          <v-text-field
                            v-model="repeatpassword"
                            :append-icon="
                              showpassword2 ? 'mdi-eye' : 'mdi-eye-off'
                            "
                            :type="showpassword2 ? 'text' : 'password'"
                            required
                            name="input-10-2"
                            prepend-icon="lock"
                            label="รหัสผ่านใหม่อีกรอบ"
                            class="form__input"
                            v-model.trim="$v.repeatPassword.$model"
                            @click:append="showpassword2 = !showpassword2"
                          ></v-text-field>
                        </div>
                        <v-alert
                          dense
                          text
                          type="error"
                          v-if="!$v.repeatPassword.sameAsPassword"
                          dark
                        >
                          รหัสผ่านไม่ตรงกัน
                        </v-alert>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-card-text>
              <v-card-actions class="justify-center">
                <v-row>
                  <v-col cols="12" md="6" lg="6">
                    <v-btn
                      width="100%"
                      dark
                      color="rgba(22, 222, 105, 0.91)"
                      to="/login"
                      elevation="3"
                    >
                      <v-icon>mdi-page-next</v-icon>ถัดไป
                    </v-btn>
                  </v-col>
                  <v-col cols="12" md="6" lg="6">
                    <v-btn
                      width="100%"
                      dark
                      color="rgba(245, 173, 15, 0.9)"
                      to="/recovery"
                      elevation="3"
                    >
                      <v-icon>mdi-backspace</v-icon>ยกเลิก
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { required, sameAs, minLength } from "vuelidate/lib/validators";
export default {
  props: {
    source: String,
  },
  data() {
    return {
      showpassword: false,
      showpassword2: false,
      repeatpassword: "",
      timerCount: 20,
      password: "",
      repeatPassword: "",
    };
  },
  validations: {
    password: {
      required,
      minLength: minLength(6),
    },
    repeatPassword: {
      sameAsPassword: sameAs("password"),
    },
  },
  watch: {},
  methods: {},
  computed: {},
};
</script>

<style scoped>
.rounded-card {
  border-radius: 15px;
  border-color: black;
}
.style-card {
  padding: 30px;
}

.row-btn {
  padding: 0;
  margin-top: 10px;
}
.row {
  margin: 0px;
  padding: 10px;
}
.style-card-title {
  padding: 30px;
}
.container {
  margin-bottom: -10px;
}
</style>
