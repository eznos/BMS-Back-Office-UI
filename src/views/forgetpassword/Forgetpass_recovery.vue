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
              max-height="900px"
            >
              <v-spacer></v-spacer>
              <v-card-title class="style-card-title" dark>
                <h2 class="mx-auto">ลืมรหัสผ่าน</h2>
              </v-card-title>
              <v-card-subtitle>
                กรอกรหัส Recovery Code เพื่อใช้ในการยืนยันตัวตน
              </v-card-subtitle>
              <v-card-text :style="{ padding: 0 }">
                <v-form>
                  <v-container>
                    <v-row>
                      <v-col cols="12" xl="12">
                        <v-otp-input
                          v-model="otp"
                          :disabled="loading"
                          @finish="onFinish"
                        ></v-otp-input>
                        <v-overlay absolute :value="loading">
                          <v-progress-circular
                            indeterminate
                            color="primary"
                          ></v-progress-circular>
                        </v-overlay>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-card-text>
              <v-card-actions class="justify-center">
                <v-row>
                  <v-col cols="12" md="12" lg="12">
                    <div v-if="timerCount == 0">
                      <v-btn block color="agree" @click="reloadPage">
                        <v-icon>mdi-power-cycle</v-icon>
                        ส่ง Recovery Code อีกรอบ
                      </v-btn>
                    </div>
                    <div v-else>
                      <v-btn disabled block color="agree">
                        รอ {{ timerCount }} วินาที เพื่อส่ง Recovery Code อีกรอบ
                      </v-btn>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6" lg="6">
                    <v-btn
                      width="100%"
                      dark
                      color="rgba(22, 222, 105, 0.91)"
                      to="/newpassword"
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
                      to="/forgetpass"
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
      <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="2500">
        {{ text }}
      </v-snackbar>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      timerCount: 20,
      loading: false,
      snackbar: false,
      snackbarColor: "default",
      otp: "",
      text: "",
      expectedOtp: "123456",
    };
  },
  watch: {
    timerCount: {
      handler(value) {
        if (value > 0) {
          setTimeout(() => {
            this.timerCount--;
          }, 1000);
        }
      },
      immediate: true, // This ensures the watcher is triggered upon creation
    },
  },
  methods: {
    reloadPage() {
      this.otp = "";
      this.timerCount = 20;
    },
    onFinish(rsp) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.snackbarColor = rsp === this.expectedOtp ? "success" : "warning";
        this.text = `Processed OTP with "${rsp}"(${this.snackbarColor})`;
        this.snackbar = true;
      }, 3500);
    },
  },
};
</script>

<style scoped>
.position-relative {
  position: relative;
}
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
</style>
