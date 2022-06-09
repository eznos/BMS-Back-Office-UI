<template>
  <nav>
    <v-app-bar class="background" dark app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase">
        <span class="font-weight-light">ระบบจัดการค่าน้ำ ค่าไฟฟ้า</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <v-list flat>
          <v-list-item
            v-for="link in links"
            :key="link.text"
            router
            :to="link.route"
            active-class="border"
          >
            <v-list-item-title>{{ link.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- แถบเมนู logout -->
      <v-menu bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-logout-variant</v-icon>
          </v-btn>
        </template>
        <!-- <v-list flat>
          <v-list-item
            v-for="link in items"
            :key="link.text"
            router
            :to="link.route"
            :click="link.click"
            active-class="border"
            :dialog="link.dialog"
          >
            <v-list-item-action>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-title>{{ link.text }}</v-list-item-title>
          </v-list-item>
        </v-list> -->
        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-avatar>
                <img v-bind:src="imageSrc" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ first_name }} {{ last_name }}</v-list-item-title
                >
                <v-list-item-subtitle>{{ role }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-list>
            <v-btn class="button-menu" to="/edit" tile block color="green">
              แก้ไขข้อมูลส่วนตัว
            </v-btn>
            <!-- <v-list-item-title>Enable messages</v-list-item-title> -->

            <v-btn tile block @click="logout" color="red"> ออกจากระบบ </v-btn>
            <!-- <v-list-item-title>Enable messages</v-list-item-title> -->
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>
    <!-- จบ -->
    <v-navigation-drawer v-model="drawer" dark app class="background2">
      <!-- avatar  -->
      <v-layout column align-center>
        <v-flex class="mt-5">
          <v-avatar v-if="!profileImage" size="100" color="#DFDDDD">
            <h2>
              {{ first_name != null ? first_name.substring(0, 1) : null }}
              {{ last_name != null ? last_name.substring(0, 1) : null }}
            </h2>
          </v-avatar>
          <v-avatar v-if="profileImage" size="100">
            <img v-bind:src="imageSrc" alt="" />
          </v-avatar>

          <!-- <p class="white--text subheading mt-1 text-center">Username</p> -->
        </v-flex>
        <v-flex class="mt-3">
          <p class="white--text subheading mt-1 text-center">ผู้เข้าใช้งาน</p>
          <p class="white--text subheading mt-1 text-center">
            {{ rank }} {{ first_name }} {{ last_name }}
          </p>
        </v-flex>

        <!-- <v-flex class="mt-4 mb-4">
                <Popup />
            </v-flex> -->
      </v-layout>
      <!-- แถบเมนูด้านข้าง -->
      <v-list flat>
        <v-list-item
          v-for="link in links"
          color="#FF695D"
          :key="link.text"
          router
          :to="link.route"
         
          active-class="border"
          dialog
        >
          <v-list-item-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ link.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
// import { mapState } from "vuex";
// import Popup from "./Popup.vue";

export default {
  name: "Toolbar",
  data: () => ({
    drawer: true,
    dialog: false,
    profileImage: "",
    first_name: "",
    last_name: "",
    rank: "",
    role: "",
    scr: "",
    // แถบเมนู
    links: [
      // { icon: "dashboard", text: "Dashboard", route: "/dashboard" },
      // { icon: "folder", text: "My Project", route: "/projects" },
      // { icon: "person", text: "Team", route: "/team" },
      {
        icon: "mdi-chart-arc",
        text: "ภาพรวม",
        route: "/overview",
      },
      {
        icon: "mdi-water",
        text: "ตารางค่าน้ำประปา",
        route: "/waterbill",
      },
      {
        icon: "mdi-lightning-bolt",
        text: "ตารางค่าไฟฟ้า",
        route: "/electricbill",
      },
      {
        icon: " mdi-home-circle",
        text: "สถานะหอพัก",
        route: "/building",
      },
      {
        icon: "person",
        text: "ผู้อยู่อาศัย",
        route: "/residents",
      },
      {
        icon: "mdi-account-edit",
        text: "แก้ไขผู้ใช้งาน",
        route: "/manageuser",
      },
      {
        icon: " mdi-google-maps",
        text: "แผนที่",
        route: "/map",
      },
    ],
    items: [
      {
        icon: " mdi-logout",
        text: "ออกจากระบบ",
        route: "/login",
        click: "logout",
      },
      {
        icon: " mdi-clipboard-edit",
        text: "แก้ไขข้อมูลผู้ใช้",
        route: "/edit",
      },
    ],
  }),
  computed: {
    imageSrc() {
      return this.profileImage;
    },
  },
  components: {

  },
  created() {
    this.getUserData();
    this.getImageURL();
  },
  methods: {
    logout() {
      localStorage.clear();
      window.location = "/login";
    },
    getUserData() {
      var rank = localStorage.getItem("rank");
      var first_name = localStorage.getItem("first_name");
      var last_name = localStorage.getItem("last_name");
      var role = localStorage.getItem("role");
      this.role = role;
      this.rank = rank;
      this.first_name = first_name;
      this.last_name = last_name;
    },
    getImageURL() {
      var ImageURL = localStorage.getItem("ImageURL");
      this.profileImage = ImageURL;
    },
  },
};
</script>

<style scoped>
.border {
  border-left: 5px solid #a50b20;
}
.background {
  background-image: linear-gradient(45deg, #572021 13%, #833133 66%);
}
.background2 {
  background-image: linear-gradient(180deg, #572021 13%, #833133 66%);
}
.button-menu {
  margin-bottom: 10px;
}
</style>
