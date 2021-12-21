<template>
  <v-app id="app">
    <v-container fill-height fill-width>
      <v-layout align-center justify-center>
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
                <v-form>
                  <v-text-field
                    id="username"
                    prepend-icon="mdi-face-man"
                    name="login"
                    label="ชื่อผู้ใช้งาน"
                    type="text"
                    autofocus
                  ></v-text-field>
                  <v-text-field
                    id="password"
                    prepend-icon="mdi-lock"
                    name="password"
                    label="รหัสผ่าน"
                    type="password"
                    :rules="rules.Password_Format"
                  ></v-text-field>

                  <v-btn text dark color="rgb(131,49,51)" to="/forgetpass"
                    >ลืมรหัสผ่าน</v-btn
                  >
                  <v-btn text dark color="rgb(131,49,51)" to="/register"
                    >ลงทะเบียน</v-btn
                  >
                </v-form>
              </v-card-text>
              <v-card-actions class="row-btn">
                <v-row>
                  <v-col>
                    <v-btn block color="primary" to="/overview">
                      <v-icon>mdi-login</v-icon>เข้าสู่ระบบ
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </div>
          </v-card>
        </div>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "Login",
  props: {
    source: String,
  },
  data: () => ({
    rules: {
      Password_Format: [
        (val) =>
          (val || "").length >= 6 ||
          "กรุณาใส่รหัสผ่านอย่างน้อย 6 ตัวหรือมากกว่า",
      ],
    },
  }),
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
</style>
