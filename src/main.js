import Vue from "vue";
// import Vuex from "vuex";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import Vuelidate from "vuelidate";
import * as VueGoogleMaps from "vue2-google-maps";
import { initializeApp } from "firebase/app";

Vue.config.productionTip = false;
Vue.use(Vuelidate);

// Vue.use(Vuex);
Vue.use(VueGoogleMaps, {
  installComponents: true,
  load: {
    key: "AIzaSyBzlLYISGjL_ovJwAehh6ydhB56fCCpPQw",
    libraries: "places",
    region: "TH",
    language: "th",
  },
});
new Vue({
  vuetify,
  router,
  render: (h) => h(App),

  created() {
    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyB1fbHA9_uHE-YCUGyvxAniD2ouZ2-UvFU",
      authDomain: "bsm-project-test.firebaseapp.com",
      projectId: "bsm-project-test",
      storageBucket: "bsm-project-test.appspot.com",
      messagingSenderId: "761641531950",
      appId: "1:761641531950:web:56a62b6c9dc9f57df13dbf",
    };

    // Initialize Firebase
    initializeApp(firebaseConfig);
  },
}).$mount("#app");
