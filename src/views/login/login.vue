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
              max-width="550px"
              max-height="900px"
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
                      prepend-icon="mdi-face-agent"
                      name="login"
                      label="Username"
                      type="text"
                      autofocus
                    ></v-text-field>
                    <v-text-field
                      id="password"
                      prepend-icon="mdi-lock"
                      name="password"
                      label="Password"
                      type="password"
                      :rules="rules.Password_Format"
                    ></v-text-field>
                    <v-spacer></v-spacer>
                    <v-btn text dark color="rgb(131,49,51)" to="/forgetpass"
                      >forget passwords</v-btn
                    >
                    <v-btn text dark color="rgb(131,49,51)" to="/register"
                      >Register</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-form>
                </v-card-text>
                <v-card-actions class="row-btn">
                  <v-row>
                    <v-col>
                        <v-btn block color="rgba(22, 222, 105, 0.51)" to="/overview">
                    <v-icon>mdi-login</v-icon>Login
                  </v-btn>
                    </v-col>
                  </v-row>
                
                </v-card-actions>
              </div>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
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
        (val) => (val || "").length >= 6 || "กรุณาใส่รหัสผ่านอย่างน้อย 6 ตัวหรือมากกว่า",
      ],
    }
  })
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
  margin-top:10px
}
</style>
