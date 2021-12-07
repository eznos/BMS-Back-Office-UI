<template>
  <!-- <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div> -->
  <v-app id="app">
    <template v-if="$route.path.includes('login')">
      <v-content class="ma-4">
        <router-view></router-view>
      </v-content>
    </template>
    <template v-else-if="$route.path.includes('forgetpass')">
      <v-content class="ma-4">
        <router-view></router-view>
      </v-content>
    </template>
    <template v-else-if="$route.path.includes('recovery')">
      <v-content class="ma-4">
        <router-view></router-view>
      </v-content>
    </template>
    <template v-else-if="$route.path.includes('newpassword')">
      <v-content class="ma-4">
        <router-view></router-view>
      </v-content>
    </template>
    <template v-else-if="$route.path.includes('register')">
      <v-content class="ma-4">
        <router-view></router-view>
      </v-content>
    </template>

    <template v-else>
      <Navbar />
      <v-content class="ma-4">
        <router-view></router-view>
      </v-content>
      <Footer />
    </template>
  </v-app>
</template>

<script>
import Navbar from "../src/components/navbar/Navbar.vue"
import Footer from "../src/components/footer/Footer.vue"
export default {
  name: "Login",
  props: {
    source: String,
  },
    components: {
        Navbar,
        Footer,
    },

};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
<style scoped>
.rounded-card {
  border-radius: 15px;
  border-color: black;
}
</style>
