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
              <v-spacer></v-spacer>
              <v-card-title class="justify-center" dark>
                <v-img
                  src="../../assets/police3.png"
                  max-width="200px"
                  max-height="200px"
                ></v-img>
              </v-card-title>
              <v-card-text>
                <v-form>
                  <v-text-field
                    id="username"
                    prepend-icon="person"
                    name="login"
                    label="Login"
                    type="text"
                    autofocus
                  ></v-text-field>
                  <v-text-field
                    id="password"
                    prepend-icon="lock"
                    name="password"
                    label="Password"
                    type="password"
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
              <v-card-actions justify-center>
                <v-row no-gutters>
                  <v-col cols="12" xl="12">
                    <v-btn
                      block
                      dark
                      color="rgba(22, 222, 105, 0.51)"
                      to="/overview"
                    >
                      <v-icon>mdi-login</v-icon>Login
                    </v-btn>
                  </v-col>
                  <v-col cols="12" sm="5" md="5" lg="5"> </v-col>
                  <br /><br />
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
export default {
  name: "Login",
  props: {
    source: String,
  },
};
</script>

<style scoped>
.rounded-card {
  border-radius: 15px;
  border-color: black;
}
</style>
