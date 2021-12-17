<template>
  <v-app id="app">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex class="text-xs-center" xs12 sm12 md4>
            <div>
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
                  กรอกอีเมลเพื่อรับ Recovery Code ที่ใช้ในการยืนยันการลืมรหัส
                </v-card-subtitle>
                <v-card-text :style="{ padding: 0 }">
                  <v-form>
                    <v-container>
                      <v-row>
                        <v-col cols="12" xl="12">
                          <v-text-field
                            prepend-icon="email"
                            v-model="email"
                            :rules="[rules.required, rules.email]"
                            label="E-mail"
                            autofocus
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-row>
                    <v-col cols="12" md="6" lg="6">
                      <v-btn
                        width="100%"
                        dark
                        color="rgba(22, 222, 105, 0.51)"
                        to="/recovery"
                        elevation="3"
                      >
                        <v-icon>mdi-page-next</v-icon>ถัดไป
                      </v-btn>
                    </v-col>
                    <v-col cols="12" md="6" lg="6">
                      <v-btn
                        width="100%"
                        dark
                        color="rgba(245, 173, 15, 0.7)"
                        to="/login"
                        elevation="3"
                      >
                        <v-icon>mdi-backspace</v-icon>ยกเลิก
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-card>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      rules: {
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "รูปแบบอีเมลไม่ถูกต้อง";
        },
      },
    };
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
.row {
  margin: 0px;
  padding: 10px;
}
.style-card-title {
  padding: 30px;
}
</style>
