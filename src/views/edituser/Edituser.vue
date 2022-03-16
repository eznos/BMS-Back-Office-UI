<template>
  <v-app id="app">
    <v-card class="mx-auto" elevation="10" width="100%">
      <v-card-title>
        <div class="ml-3 mt-2 title">
          <h3>
            <v-icon size="40px" color="">mdi-account-edit</v-icon>
            แก้ไขข้อมูลส่วนตัว
          </h3>
        </div>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" @submit.prevent="submit" class="form">
          <v-row>
            <v-col col="12">
              <v-container>
                <v-row>
                  <!-- rank -->
                  <v-col cols="12" sm="4" md="6" lg="2">
                    <v-select
                      v-model="rank"
                      :items="Rank"
                      label="ยศ"
                      required
                      autofocus
                      clearable
                      prepend-icon="mdi-chevron-triple-up"
                    ></v-select>
                  </v-col>
                  <!-- affi -->
                  <v-col cols="12" sm="4" md="6" lg="2">
                    <v-select
                      v-model="affiliation"
                      :items="Affiliation"
                      label="สังกัด"
                      required
                      clearable
                      prepend-icon="mdi-format-list-group"
                    ></v-select>
                  </v-col>
                  <!-- name -->
                  <v-col cols="12" sm="4" md="6" lg="4">
                    <v-text-field
                      v-model="firstname"
                      :rules="nameRules"
                      label="ชื่อ"
                      prepend-icon="mdi-form-textbox"
                      required
                      clearable
                    ></v-text-field>
                  </v-col>
                  <!-- last name -->
                  <v-col cols="12" sm="4" md="6" lg="4">
                    <v-text-field
                      v-model="lastname"
                      :rules="nameRules"
                      label="นามสกุล"
                      prepend-icon="mdi-rename-box"
                      required
                      clearable
                    ></v-text-field>
                  </v-col>
                  <!-- email -->
                  <v-col cols="12" sm="4" md="6" lg="4">
                    <v-text-field
                      v-model="email"
                      :rules="emailRules"
                      :error-messages="errors"
                      label="อีเมล"
                      prepend-icon="mdi-email"
                      clearable
                      required
                    ></v-text-field>
                  </v-col>
                  <!-- tel. -->
                  <v-col cols="12" sm="4" md="6" lg="4">
                    <validation-provider
                      v-slot="{ errors }"
                      name="phoneNumber"
                      :rules="{
                        required: true,
                        digits: 10,
                        regex: '^(08[0-9]{8})|(06[0-9]{8})|(09[0-9]{8})',
                      }"
                    >
                      <v-text-field
                        :rules="rules.phoneNumber"
                        v-model="phoneNumber"
                        :counter="10"
                        :error-messages="errors"
                        label="เบอร์โทร"
                        required
                        clearable
                        prepend-icon="mdi-card-account-phone"
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                  <!-- sex -->
                  <v-col cols="12" sm="4" md="6" lg="4">
                    <v-select
                      prepend-icon="mdi-gender-male-female"
                      item-color="red"
                      :items="sex"
                      label="เพศ"
                    >
                    </v-select>
                  </v-col>
                  <!-- zone -->
                  <v-col cols="12" sm="4" md="6" lg="4">
                    <v-autocomplete
                      v-model="zone"
                      label="พื้นที่"
                      :items="zones"
                      prepend-icon="mdi-google-maps"
                      required
                      clearable
                    >
                    </v-autocomplete>
                  </v-col>
                  <!-- building -->
                  <v-col cols="12" sm="4" md="6" lg="4">
                    <v-autocomplete
                      v-model="building"
                      :items="buildings"
                      label="อาคาร"
                      required
                      clearable
                      prepend-icon="mdi-office-building-marker-outline"
                    >
                    </v-autocomplete>
                  </v-col>
                  <!-- roomnumber -->
                  <v-col cols="12" sm="4" md="6" lg="4">
                    <v-autocomplete
                      v-model="room"
                      :items="rooms"
                      label="เลขห้องพัก"
                      required
                      clearable
                      prepend-icon="mdi-numeric"
                    >
                    </v-autocomplete>
                  </v-col>
                  <!-- avatar upload and preview -->
                  <v-col></v-col>
                  <v-col cols="12" sm="4" md="6" lg="2">
                    <v-hover v-slot="{ hover }">
                      <div>
                        <v-card
                          color="#F3F3F3"
                          height="150"
                          max-width="200"
                          tile
                          class="px-3 mb-2"
                        >
                          <v-row
                            style="height: 100%"
                            justify="center"
                            align="center"
                          >
                            <v-img
                              v-if="profileImage !== ''"
                              :src="profileImage"
                              width="150"
                              height="150"
                            >
                            </v-img>
                            <v-icon v-else size="65" color="#AEAEAE"
                              >mdi-file-image-outline</v-icon
                            >
                            <v-expand-transition>
                              <div
                                v-if="hover"
                                class="d-flex v-card--reveal"
                                style="height: 100%"
                              >
                                <div>
                                  <v-btn
                                    fab
                                    color="#F5F5F5"
                                    class="mr-2"
                                    @click="handleImageButtonClick"
                                  >
                                    <v-icon size="30"
                                      >mdi-file-image-outline</v-icon
                                    >
                                  </v-btn>
                                  <input
                                    type="file"
                                    ref="image"
                                    @change="onImageSelected"
                                    style="display: none"
                                    accept="image/png, image/jpeg"
                                  />
                                </div>
                              </div>
                            </v-expand-transition>
                          </v-row>
                        </v-card>
                      </div>
                    </v-hover>
                  </v-col>
                  <v-col></v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <div class="mx-auto">
          <v-form ref="form" @submit.prevent="submit">
            <v-btn
              class="mr-4"
              color="#71D861"
              width="200px"
              large
              v-bind="attrs"
              v-on="on"
              @click="submit"
              to="/login"
            >
              ยืนยันการลงทะเบียน
            </v-btn>
            <v-btn
              class="mr-4"
              @click="clear"
              to="/login"
              dark
              width="200px"
              large
              color="error"
            >
              ยกเลิกการลงทะเบียน
            </v-btn>
          </v-form>
        </div>
      </v-card-actions>
    </v-card>
  </v-app>
</template>
<script>
import { required, digits, email, max, regex } from "vee-validate/dist/rules";
import { extend, ValidationProvider, setInteractionMode } from "vee-validate";

setInteractionMode("eager");
extend("digits", {
  ...digits,
  message: "{_field_} needs to be {length} digits. ({_value_})",
});
extend("required", {
  ...required,
  message: "{_field_} จำเป็รต้องกรอก",
});
extend("max", {
  ...max,
  message: "{_field_} may not be greater than {length} characters",
});
extend("regex", {
  ...regex,
  message: "เบอร์โทรศัพท์ไม่ตรงกับรูปแบบที่กำหนด",
});
extend("email", {
  ...email,
  message: "Email ไม่สามารถว่างได้",
});
export default {
  components: {
    ValidationProvider,
  },
  data: () => ({
    loading: false,
    dialog: false,
    valid: false,
    clicked: false,
    profileImage: "",
    loader: null,
    avatar: null,
    firstname: null,
    lastname: "",
    sex: ["ชาย", "หญิง"],
    tel: "",
    zone: null,
    building: null,
    room: null,
    Rank: ["พล.ต.อ. ", "พล.ต.ท.", "พล.ต.ต.", "พ.ต.อ"],
    Affiliation: ["สยศ.ตร.", "สกบ.", "สกพ.", "สงป"],
    // zone and building
    zonesBuildings: {
      เขตส่วนกลาง: [
        "2/11",
        "2/12",
        "2/13",
        "2/14",
        "2/15",
        "2/16",
        "2/17",
        "2/18",
      ],
      เขตสุระ: [
        "2/20",
        "2/21",
        "2/22",
        "2/23",
        "2/24",
        "2/25",
        "2/26",
        "2/27",
        "2/28",
        "2/29",
        "2/31",
        "2/32",
        "2/33",
        "2/34",
        "2/35",
        "2/36",
        "2/37",
        "2/38",
        "2/39",
        "2/40",
        "2/41",
      ],
      เขตอังฏดาง: ["2/19"],
    },
    // building and room
    buildingsRooms: {
      "2/11": [
        "97",
        "99",
        "101",
        "103",
        "105",
        "107",
        "109",
        "111",
        "113",
        "115",
        "117",
        "119",
      ],
      "2/12": [
        "73",
        "75",
        "77",
        "79",
        "81",
        "83",
        "85",
        "87",
        "89",
        "91",
        "93",
        "95",
      ],
      "2/13": [
        "108",
        "110",
        "112",
        "114",
        "116",
        "118",
        "120",
        "122",
        "124",
        "126",
        "128",
        "130",
      ],
      "2/14": [
        "101",
        "102",
        "103",
        "104",
        "105",
        "106",
        "201",
        "202",
        "203",
        "204",
        "205",
        "206",
        "301",
        "302",
        "303",
        "304",
        "305",
        "306",
        "401",
        "402",
        "403",
        "404",
        "405",
        "406",
        "501",
        "502",
        "503",
        "504",
        "505",
        "506",
      ],
      "2/15": [
        "121",
        "123",
        "125",
        "127",
        "129",
        "131",
        "133",
        "135",
        "137",
        "139",
        "141",
        "143",
        "145",
        "147",
        "149",
        "151",
        "153",
        "155",
        "157",
        "159",
        "161",
        "163",
        "165",
        "167",
        "169",
        "171",
        "173",
        "175",
      ],
      "2/16": [
        "177",
        "179",
        "181",
        "183",
        "185",
        "187",
        "189",
        "191",
        "193",
        "195",
        "197",
        "199",
        "201",
        "203",
        "205",
        "207",
        "209",
        "211",
        "213",
        "215",
        "217",
        "219",
        "221",
        "223",
        "225",
      ],
      "2/17": [
        "132",
        "134",
        "136",
        "138",
        "140",
        "142",
        "144",
        "146",
        "148",
        "150",
        "152",
        "154",
        "156",
        "158",
        "160",
        "162",
        "164",
        "166",
        "168",
        "170",
        "172",
        "174",
        "176",
        "178",
        "180",
        "182",
        "184",
        "186",
      ],
      "2/18": [
        "50",
        "52",
        "54",
        "56",
        "58",
        "60",
        "62",
        "64",
        "66",
        "68",
        "70",
        "72",
        "74",
        "76",
        "78",
        "80",
        "82",
        "84",
        "86",
        "88",
        "90",
        "92",
        "94",
        "96",
        "98",
        "100",
        "102",
        "104",
      ],
      "2/19": [
        "101",
        "102",
        "103",
        "104",
        "105",
        "106",
        "107",
        "108",
        "109",
        "110",
        "201",
        "202",
        "203",
        "204",
        "205",
        "206",
        "207",
        "208",
        "209",
        "210",
        "211",
        "212",
        "213",
        "214",
        "215",
        "301",
        "302",
        "303",
        "304",
        "305",
        "306",
        "307",
        "308",
        "309",
        "310",
        "311",
        "312",
        "313",
        "314",
        "315",
        "401",
        "402",
        "403",
        "404",
        "405",
        "406",
        "407",
        "408",
        "409",
        "410",
        "411",
        "412",
        "413",
        "414",
        "415",
        "501",
        "502",
        "503",
        "504",
        "505",
        "506",
        "507",
        "508",
        "509",
        "510",
        "511",
        "512",
        "513",
        "514",
        "515",
      ],
      "2/20": ["1", "2"],
      "2/21": ["3", "4"],
      "2/22": ["5", "6"],
      "2/23": ["7", "8"],
      "2/24": ["9", "10"],
      "2/25": ["11", "12"],
      "2/26": ["13", "14"],
      "2/27": ["15", "16"],
      "2/28": ["17", "18"],
      "2/29": ["19", "20"],
      "2/31": ["79", "80", "81", "82", "83", "84", "85", "86", "87", "88"],
      "2/32": ["89", "90", "91", "92", "93", "94", "95", "96", "97", "98"],
      "2/33": [
        "99",
        "100",
        "101",
        "102",
        "103",
        "104",
        "105",
        "106",
        "107",
        "108",
      ],
      "2/34": [
        "109",
        "110",
        "111",
        "112",
        "113",
        "114",
        "115",
        "116",
        "117",
        "118",
      ],
      "2/35": [
        "119",
        "120",
        "121",
        "122",
        "123",
        "124",
        "125",
        "126",
        "127",
        "128",
      ],
      "2/36": [
        "129",
        "130",
        "131",
        "132",
        "133",
        "134",
        "135",
        "136",
        "137",
        "138",
      ],
      "2/37": [
        "139",
        "140",
        "141",
        "142",
        "143",
        "144",
        "145",
        "146",
        "147",
        "148",
      ],
      "2/38": [
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37",
        "38",
        "39",
        "40",
        "41",
        "42",
        "43",
        "44",
        "45",
        "46",
        "47",
        "48",
        "49",
        "50",
      ],
      "2/39": [
        "149",
        "150",
        "151",
        "152",
        "153",
        "154",
        "155",
        "156",
        "157",
        "158",
        "159",
        "160",
        "161",
        "162",
        "163",
        "164",
        "165",
        "166",
        "167",
        "168",
        "169",
        "170",
        "171",
        "172",
        "173",
        "174",
        "175",
        "176",
        "177",
        "178",
      ],
      "2/40": [
        "179",
        "180",
        "181",
        "182",
        "183",
        "184",
        "185",
        "186",
        "187",
        "188",
        "189",
        "190",
        "191",
        "192",
        "193",
        "194",
        "195",
        "196",
        "197",
        "198",
        "199",
        "200",
        "201",
        "202",
        "203",
        "204",
        "205",
        "206",
        "207",
        "208",
      ],
      "2/41": [
        "212",
        "213",
        "214",
        "215",
        "216",
        "217",
        "218",
        "219",
        "220",
        "221",
        "222",
        "223",
        "224",
        "225",
        "226",
        "227",
        "228",
        "229",
        "230",
        "231",
        "232",
        "233",
        "234",
        "235",
        "236",
        "237",
        "238",
        "239",
        "240",
      ],
    },
    rules: {
      username: [
        (val) => (val || "").length >= 6 || "รหัสผ่านต้องมีมากกว่า 6 ตัวอักษร",
      ],
      password: [
        (val) => (val || "").length > 8 || "รหัสผ่านต้องมีมากกว่า 8 ตัวอักษร",
      ],
      Avatar: [
        (value) =>
          !value || value.size < 2000000 || "รูปภาพต้องมีขนาดเล็กกว่า 2 MB!",
      ],
      phoneNumber: [(val) => (val || "").length == 10],
    },
    nameRules: [
      (v) => !!v || "กรุณากรอกชื่อ",
      (v) =>
        v.length >= 2 || "ชื่อต้องมีจำนวนตัวอักษรมากกว่าหรือเท่ากับ 2 ตัวอักษร",
    ],
    emailRules: [
      (v) => !!v || "กรุณากรอกอีเมล",
      (v) => /[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,4}/.test(v) || "อีเมลไม่ผิดรูปแบบ",
    ],
  }),
  setup() {},
  watch: {},
  computed: {
    zones() {
      return Object.keys(this.zonesBuildings);
    },
    buildings() {
      // autocomplete in form
      if (!this.zone) {
        return ["ไม่มีข้อมูล"];
      } else {
        return this.zonesBuildings[this.zone];
      }
    },
    rooms() {
      if (!this.building) {
        return ["ไม่มีข้อมูล"];
      } else {
        return this.buildingsRooms[this.building];
      }
    },
  },
  methods: {
    submit() {
      this.$refs.observer.validate();
    },
    handleImageButtonClick() {
      this.$refs.image.click();
    },
    onImageSelected(event) {
      var file = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        this.profileImage = e.target.result;
        this.isUploadProfileImage = true;
      };
    },
  },
};
</script>
<style scoped>
.form {
  padding: 25px;
  margin-top: -20px;
}
.title {
  margin-top: 20px;
}
.icon {
  margin-right: 20px;
}

.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
