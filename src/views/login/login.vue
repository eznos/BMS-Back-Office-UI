<template>
  <v-app id="app">
    <v-container fill-height fill-width>
      <div class="mx-auto">
        <v-card
          color="#F4ffff"
          elevation="10"
          width="550px"
          max-height="550px"
          class="pa-4 text-center rounded-xl"
        >
          <div class="style-card">
            <!-- <v-spacer></v-spacer> -->
            <v-card-title class="justify-center" dark>
              <v-img
                src="../../assets/police3.png"
                max-width="200px"
                max-height="200px"
              ></v-img>
            </v-card-title>
            <v-card-text :style="{ padding: 0 }">
              <v-form ref="formLogin" lazy-validation>
                <v-alert
                  v-if="!isLogin"
                  outlined
                  type="error"
                  class="alert-login"
                >
                  {{ loginFail }}
                </v-alert>
                <v-text-field
                  class="text_fields"
                  v-model="username"
                  prepend-icon="mdi-face-man"
                  name="login"
                  label="ชื่อผู้ใช้งาน"
                  type="text"
                  autofocus
                  :rules="rules.usernameRules"
                  v-on:keyup="checkEnterPressedToSubmit"
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  prepend-icon="mdi-lock"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"
                  :type="showPassword ? 'text' : 'password'"
                  name="password"
                  label="รหัสผ่าน"
                  :rules="rules.Password_Format"
                  v-on:keyup="checkEnterPressedToSubmit"
                ></v-text-field>
              </v-form>
              <div class="btn-register-forget">
                <v-btn text dark color="rgb(131,49,51)" to="/forgetpass"
                  >ลืมรหัสผ่าน</v-btn
                >
                <v-btn text dark color="rgb(131,49,51)" to="/register"
                  >ลงทะเบียน</v-btn
                >
              </div>
            </v-card-text>
            <v-card-actions class="row-btn">
              <v-row>
                <!-- <v-col>
                  <v-btn block color="primary" @click="submit">
                    <v-icon>mdi-login</v-icon>เข้าสู่ระบบ
                  </v-btn>
                </v-col> -->
                <v-col>
                  <v-btn block color="primary" @click="submit">
                    <v-icon>mdi-login</v-icon>เข้าสู่ระบบ..
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
          </div>
        </v-card>
      </div>
    </v-container>
  </v-app>
</template>

<script>
import { apiUrl } from "../../utils/url";
import axios from "axios";

export default {
  name: "Login",
  data: () => ({
    showPassword: false,
    username: "",
    password: "",
    loginFail: "",
    apiKey: "",
    isLogin: true,
    rules: {
      usernameRules: [(value) => !!value || "กรุณากรอก ชื่อผู้ใช้"],
      Password_Format: [
        (val) =>
          (val || "").length >= 6 ||
          "กรุณาใส่รหัสผ่านอย่างน้อย 6 ตัวหรือมากกว่า",
      ],
    },
  }),
  created() {},
  methods: {
    async checkEnterPressedToSubmit(e) {
      if (e.keyCode === 13) this.submit();
    },
    async submit() {
      if (this.$refs.formLogin.validate()) {
        this.loginWithAPI(this.username, this.password);
      }
    },
    // async test() {
    //   var data = {
    //     username: this.username,
    //     password: this.password,
    //   };
    //   var headerAPI = {
    //     method: "post",
    //     url: "http://localhost:3000/v1/auth/login",
    //     headers: {
    //       "x-api-key": "xxx-api-key",
    //       "Content-Type": "application/json",
    //     },
    //     data: data,
    //   };

    //   axios(headerAPI)
    //     .then(function (response) {
    //       let data = response.data;
    //       if (data.status === "success") {
    //         // await this.$store.commit("SET_USERS_DATA", data.result);
    //         // await this.$store.dispatch("storeUsersToLocalStorage", data.result);
    //         if (data.result.role === "admin") {
    //           // window.location = "overview";
    //           console.log(data.result);
    //         }
    //       }
    //       console.log(response.data.result.role);
    //     })
    //     .catch(function (error) {
    //       if (
    //         error.data.status_code === "401"
    //       ) {
    //         this.loginFail = "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง";
    //         this.isLogin = false;
    //         console.log(error.response.data.error_message);
    //       } else {
    //         this.loginFail = "มีบางอย่างผิดพลาด กรุณาติดต่อ ผู้จัดทำ";
    //         this.isLogin = false;
    //         console.log(error.response.data.error_message);
    //         console.log(error.response.header);
    //       }
    //     });
    // },
    async loginWithAPI(username, password) {
      let payload = {
        username: username.trim(),
        password: password.trim(),
      };
      let headerAPI = {
        // method: "post",
        // url: "http://localhost:3000/v1/auth/login",
        headers: {
          "x-api-key": "xxx-api-key",
          "Content-Type": "application/json",
        },
        payload: payload,
      };
      axios
        .post(apiUrl + "/v1/auth/login", payload, headerAPI)
        .then(async (response) => {
          let data = response.data;
          if (data.status === "success") {
            // await this.$store.commit("SET_USERS_DATA", response.data.result);
            // await this.$store.dispatch("storeUsersToLocalStorage", data.result);
            this.userData = data.result;
            this.rank = data.result.rank;
            this.fristName = data.result.first_name;
            this.lastName = data.result.last_name;
            this.image = data.result.profile_image_url;
            localStorage.setItem("user_data", this.userData);
            localStorage.setItem("rank", this.rank);
            localStorage.setItem("first_name", this.fristName);
            localStorage.setItem("last_name", this.lastName);
            localStorage.setItem("ImageURL", this.image);
            if (data.result.role === "admin") {
              this.$router.push({
                name: "overview",
                params: { userId: data.result.user_id },
              });
              console.log(data.result);
            }
            console.log(this.userData);
          }
        })

        .catch((error) => {
          if (
            error.response.data.error_message === "invalid username or password"
          ) {
            this.loginFail = "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง";
            this.isLogin = false;
            // console.log(error.response.data.error_message);
          } else {
            this.loginFail = "มีบางอย่างผิดพลาด กรุณาติดต่อ ผู้จัดทำ";
            this.isLogin = false;
            // console.log(error.response.data.error_message);
            // console.log(error.response.header);
          }
        });
    },
  },
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
.btn-register-forget {
  padding: 0;
  margin-top: 30px;
  margin-bottom: 15px;
}
.alert-login {
  padding: 0;
}
.text_fields {
  margin-bottom: 30px;
}
</style>
