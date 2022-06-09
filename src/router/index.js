import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/login/login.vue";
import Register from "../views/register/Register.vue";
import Forgetpassword from "../views/forgetpassword/Forgetpass.vue";
import Forgetpassword_recoverycode from "../views/forgetpassword/Forgetpass_recovery.vue";
// import Forgetpassword_newpassword from "../views/forgetpassword/Forgerpass_newpassword.vue";
import Overviews from "../views/overview/Overviews.vue";
import Resident from "../views/table/Resident.vue";
import Electric from "../views/table/Electric.vue";
import Water from "../views/table/Water.vue";
import Edit_user from "../views/edituser/Edituser.vue";
import Building from "../views/table/Building.vue";
import Manage_user from "../views/table/Manageuser.vue";
import Maps from "../views/map/Map.vue";

Vue.use(VueRouter);

const routes = [
  
  {
    path: "/",
    redirect: '/login'
  },

  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/forgetpass",
    name: "Forgetpassword",
    component: Forgetpassword,
  },
  {
    path: "/recovery",
    name: "ForgetpasswordRecoverycode",
    component: Forgetpassword_recoverycode,
  },
  // {
  //   path: "/newpassword",
  //   name: "Forgetpassword_newpassword",
  //   component: Forgetpassword_newpassword,
  // },
  {
    path: "/overview",
    name: "overview",
    component: Overviews,
  },
  {
    path: "/residents",
    name: "resident",
    component: Resident,
  },
  {
    path: "/electricbill",
    name: "Electrics",
    component: Electric,
  },
  {
    path: "/waterbill",
    name: "Water",
    component: Water,
  },
  {
    path: "/edit",
    name: "Edituser",
    component: Edit_user,
  },
  {
    path: "/building",
    name: "Builing",
    component: Building,
  },
  {
    path: "/map",
    name: "Map",
    component: Maps,
  },
  {
    path: "/manageuser",
    name: "Manage_user",
    component: Manage_user,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  
});

// for what ????
// router.beforeEach(async (to, next) => {
//   let currentUser = JSON.parse(window.localStorage.getItem("current_user"));
//   let requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
//   let requiresAuthAdmin = to.matched.some(
//     (record) => record.meta.requiresAuthAdmin
//   );
//   if ((requiresAuth || requiresAuthAdmin) && !currentUser) {
//     next("/");
//   } else if (requiresAuth || requiresAuthAdmin) {
//     if (currentUser) {
//       if (currentUser.role === "admin") {
//         if (requiresAuth) {
//           next();
//         } else {
//           next("/");
//         }
//       }
//     }
//   }
//    else {
//     if (
//       currentUser &&
//       (to.name === "SignIn" ||
//         to.name === "ForgetPassword" ||
//         to.name === "ChangePassword")
//     ) {
//       if (currentUser.role === "User") {
//         next({ path: "/user/report/" + currentUser.user_id });
//       } else {
//         next("/user-list");
//       }
//     } else {
//       next();
//     }
//   }
// });
// set หน้าแรกที่เข้า
// router.replace("/login");

export default router;
