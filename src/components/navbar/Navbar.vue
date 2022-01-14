<template>
  <nav>
    <v-app-bar color="rgb(131,49,51)" dark app>
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
        <v-list flat>
          <v-list-item
            v-for="link in items"
            :key="link.text"
            router
            :to="link.route"
            active-class="border"
            :dialog="link.dialog"
          >
            <v-list-item-action>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-title>{{ link.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <!-- จบ -->
    <v-navigation-drawer v-model="drawer" dark app color="#572021">
      <!--old color  class="red darken-4" -->
      <v-layout column align-center>
        <v-flex class="mt-5">
          <v-avatar size="100" tile>
            <img src="/police3.png" alt="" />
          </v-avatar>
          <!-- <p class="white--text subheading mt-1 text-center">Username</p> -->
        </v-flex>
        <v-flex class="mt-3">
          <p class="white--text subheading mt-1 text-center">ผู้เข้าใช้งาน</p>
          <p class="white--text subheading mt-1 text-center">
            {{ rank }} {{ Name }} {{ lname }}
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

    Name: "พิชญ์พิสิฐฏ์เสฏ ",
    lname: "สกธินชารินทร์พธา",
    rank: "พล.ต.อ.",
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
        icon: "person",
        text: "ผู้อยู่อาศัย",
        route: "/residents",
      },
      {
        icon: " mdi-home-circle",
        text: "สถานะหอพัก",
        route: "/building",
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
            {
        icon: " mdi-file-pdf-box",
        text: "รายงาน",
        route: "/report",
      },
      // {
      //   icon: " mdi-heart-broken",
      //   text: "Lab หน้าผู้ใช้",
      //   route: "/lab",
      // },
      // {
      //   icon: " mdi-heart-broken",
      //   text: "ดูสถานะหอพัก",
      //   route: "/lab2",
      // },
      // {
      //   icon: " mdi-heart-broken",
      //   text: "lab3",
      //   route: "/testtable",
      // },
    ],
    items: [
      {
        icon: " mdi-logout",
        text: "ออกจากระบบ",
        route: "/login",
      },
      {
        icon: " mdi-clipboard-edit",
        text: "แก้ไขข้อมูลผู้ใช้",
        route: "/edit",
      },
    ],
  }),
  components: {
    // Popup,
    // ...mapState({
    //   themes: state => state.themes.themes
    // }),
    // theme: {
    //   get() {
    //     return this.$store.state.themes.theme;
    //   },
    //   set(newTheme) {
    //     this.$store.commit("setTheme", newTheme);
    //   }
    // }
  },
  methods: {
    // switchTheme() {
    //   if (this.theme === this.themes[0]) {
    //     this.theme = this.themes[1];
    //   } else if (this.theme === this.themes[1]) {
    //     this.theme = this.themes[0];
    //   }
    //   localStorage.setItem("theme", this.theme);
    // }
  },
};
</script>

<style scoped>
.border {
  border-left: 5px solid #a50b20;
}
</style>
