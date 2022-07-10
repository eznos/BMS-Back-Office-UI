<template>
  <v-app id="app">
    <!-- <h1>&ensp; &ensp; ลงทะเบียน</h1> -->
    <v-container fill-height fill-width>
      <v-layout align-center justify-center>
        <v-card class="mx-auto" color="#F4ffff" elevation="10" width="90%">
          <v-card-title>
            <!-- <h1 class="h1c">ลงทะเบียน</h1> -->
            <div class="content background-main">
              <v-row justify="space-between" class="px-3">
                <!-- title -->
                <div class="mb-4">
                  <v-row style="align-items: center">
                    <div class="ml-3 mt-9">
                      <h2>
                        <v-icon size="40" color="green"
                          >mdi-account-plus</v-icon
                        >
                        ลงทะเบียน
                      </h2>
                    </div>
                  </v-row>
                </div>
              </v-row>
            </div>
          </v-card-title>
          <v-card-text>
            <v-form ref="formRegister" v-model="valid" lazy-validation>
              <v-row>
                <v-col col="12">
                  <v-container>
                    <v-row>
                      <!-- rank -->
                      <v-col cols="12" md="6" lg="6">
                        <v-select
                          v-model="rank"
                          :items="ranks"
                          :rules="rules.zonesBuildingsRoom"
                          label="ยศ"
                          required
                        ></v-select>
                      </v-col>
                      <!-- affiliation -->
                      <v-col cols="12" md="6" lg="6">
                        <v-select
                          v-model="affiliation"
                          :items="affiliations"
                          :rules="rules.zonesBuildingsRoom"
                          label="สังกัด"
                          required
                        ></v-select>
                      </v-col>
                      <!-- fname -->
                      <v-col cols="12" md="6" lg="6">
                        <v-text-field
                          v-model="fristName"
                          label="ชื่อ"
                          required
                          :rules="rules.zonesBuildingsRoom"
                        ></v-text-field
                      ></v-col>
                      <!-- lastname -->
                      <v-col cols="12" md="6" lg="6">
                        <v-text-field
                          v-model="lastName"
                          label="นามสกุล"
                          required
                          :rules="rules.zonesBuildingsRoom"
                        ></v-text-field
                      ></v-col>
                      <!-- email -->
                      <v-col cols="12" md="6" lg="6">
                        <v-text-field
                          label="อีเมล"
                          :rules="[rules.email.regex]"
                          v-model="email"
                          required
                        ></v-text-field>
                      </v-col>
                      <!-- phoneNumber -->
                      <v-col cols="12" md="6" lg="6">
                        <v-text-field
                          :rules="[rules.phoneNumber.regex]"
                          v-model="phoneNumber"
                          :counter="10"
                          label="เบอร์โทร"
                          required
                        ></v-text-field
                      ></v-col>
                      <!-- gender -->
                      <v-col cols="12" md="6" lg="6">
                        <v-select
                          label="เพศ"
                          :items="genders"
                          v-model="gender"
                          required
                          :rules="rules.zonesBuildingsRoom"
                        >
                        </v-select>
                      </v-col>
                      <!-- user -->
                      <v-col cols="12" md="6" lg="6">
                        <v-text-field
                          :rules="rules.username"
                          v-model="username"
                          label="ชื่อผู้ใช้งาน"
                          required
                        ></v-text-field>
                      </v-col>
                      <!-- password -->
                      <v-col cols="12" md="6" lg="6">
                        <v-text-field
                          v-model="password"
                          :append-icon="
                            showpassword ? 'mdi-eye' : 'mdi-eye-off'
                          "
                          :type="showpassword ? 'text' : 'password'"
                          required
                          name="input-10-1"
                          :rules="rules.password"
                          label="รหัสผ่านใหม่"
                          @click:append="showpassword = !showpassword"
                        ></v-text-field>
                      </v-col>
                      <!-- avatar -->
                      <v-col cols="12" md="6" lg="6">
                        <!-- <v-file-input
                          :rules="rules.Avatar"
                          accept="image/png, image/jpeg, image/bmp"
                          placeholder="เลือกรูปประจำตัว"
                          label="รูปประจำตัว"
                          show-size
                          counter
                          @change="getImageURL"
                          v-model="image"
                        ></v-file-input> -->
                        <div>
                          <div>
                            <v-btn @click="click1">choose photo</v-btn>
                            <input
                              type="file"
                              ref="input1"
                              style="display: none"
                              @change="previewImage"
                              accept="image/*"
                            />
                          </div>
                          <div v-if="imageData != null">
                            <img
                              class="preview"
                              height="268"
                              width="356"
                              :src="img1"
                            />
                            <br />
                          </div>
                        </div>
                        <v-btn color="pink" @click="create">upload</v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <div class="mx-auto">
              <v-form v-model="valid" lazy-validation></v-form>
              <v-btn
                class="mr-4"
                color="agree"
                width="200px"
                outlined
                large
                :disabled="!valid"
                @click="submitRegister"
              >
                ยืนยันการลงทะเบียน
              </v-btn>
              <v-btn
                class="mr-4"
                to="/login"
                width="200px"
                large
                outlined
                color="error"
              >
                ยกเลิกการลงทะเบียน
              </v-btn>
              <v-btn
                class="mr-4"
                large
                outlined
                @click="clearForm"
                color="warning"
              >
                ล้างข้อมูล</v-btn
              >
            </div>
          </v-card-actions>
        </v-card>
        <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="2500">
          {{ text }}
        </v-snackbar>
      </v-layout>
    </v-container>
  </v-app>
</template>
<script>
import { storage } from "../../utils/firebase";
import { apiUrl } from "../../utils/url";
import axios from "axios";

const STORAGE_REF = storage.ref();

export default {
  components: {},
  data: () => ({
    caption: "",
    img1: "",
    imageData: null,
    valid: false,
    imageURL: null,
    image: null,
    showpassword: false,
    on: {},
    attrs: {},
    fristName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    rank: "",
    affiliation: "",
    username: "",
    password: "",
    text: "",
    snackbar: false,
    snackbarColor: "",
    ranks: [
      "พล.ต.อ.",
      "พล.ต.ท.",
      "พล.ต.ต.",
      "พ.ต.อ.",
      "พ.ต.ท.",
      "พ.ต.ต.",
      "ร.ต.อ.",
      "ร.ต.ท.",
      "ร.ต.ต.",
      "ด.ต.",
      "จ.ส.ต.",
      "ส.ต.อ.",
      "ส.ต.ท.",
      "ส.ต.ต.",
    ],
    affiliations: [
      "ผบช.ภ.3",
      "สนง.ผบช.ภ.3",
      "สนง.รอง ผบช.ภ.3",
      "ภ.3(ส่วนกลาง)",
      "บก.สส.ภ.3",
      "ภ.จว.นม.",
      "สภ.เมืองนครราชสีมา",
      "บก.อก.ภ.3",
      "ศพฐ.3",
      "ปฏิบัติราชการ",
      "ประจำ",
      "สำรอง",
      "ภ.3",
      "ศฝร.ภ.3",
    ],
    genders: ["ชาย", "หญิง", "ไม่ระบบุ"],
    rules: {
      email: {
        required: (v) => !!v || "กรุณาใส่อีเมล",
        regex: (v) =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "อีเมลไม่ถูกต้อง",
      },
      phoneNumber: {
        required: (v) => !!v || "กรุณาใส่เบอร์โทรศัพท์",
        regex: (v) =>
          /^(08[0-9]{8})|(06[0-9]{8})|(09[0-9]{8})$/.test(v) ||
          "เบอร์โทรศัพท์ม่ถูกต้อง",
      },
      username: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length >= 4) || "ชื่อผู้ใช้ต้องมีมากกว่า 6 ตัวอักษร",
      ],
      password: [
        (v) => !!v || "กรุณากรอกข้อมูล",
        (v) => (v && v.length >= 6) || "รหัสผ่านต้องมีมากกว่า 8 ตัวอักษร",
      ],
      Avatar: [
        (value) =>
          !value || value.size < 2000000 || "รูปประจำตัวขนาดไม่เกิน 2 MB",
      ],

      zonesBuildingsRoom: [(v) => !!v || "กรุณากรอกข้อมูล"],
    },
  }),
  methods: {
    create() {
      // const post = {
      //   photo: this.img1,
      //   caption: this.caption,
      // };
      // firebase
      //   .database()
      //   .ref("PhotoGallery")
      //   .push(post)
      //   .then((response) => {
      //     console.log(response);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    },
    click1() {
      this.$refs.input1.click();
    },
    previewImage(event) {
      this.uploadValue = 0;
      this.img1 = null;
      this.imageData = event.target.files[0];
      this.onUpload();
    },
    async uploadProfileImageToStorage(profileImage) {
      let self = this;
      return new Promise(function (resolve, reject) {
        var storagePath = "users/profile-image";
        var imageName = self.$uuid.v4() + ".jpg";

        let imageRef = STORAGE_REF.child(storagePath).child(imageName);
        let uploadTask = imageRef.putString(profileImage, "data_url", {
          contentType: "image/jpeg",
        });

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(progress)
          },
          function error(err) {
            reject(err);
          },
          function complete() {
            uploadTask.snapshot.ref
              .getDownloadURL()
              .then(function (downloadURL) {
                resolve(downloadURL);
              });
          }
        );
      });
    },
    async submitRegister() {
      if (this.$refs.formRegister.validate()) {
        this.confirmRegister(
          this.gender,
          this.rank,
          this.phoneNumber,
          this.email,
          this.affiliation,
          this.fristName,
          this.lastName,
          this.username,
          this.password,
          this.imageURL
        );
      }
    },
    async confirmRegister() {
      let payload = {
        rank: this.rank,
        profile_url: this.imageURL,
        phone_number: this.phoneNumber,
        gender: this.gender,
        first_name: this.fristName,
        last_name: this.lastName,
        affiliation: this.affiliation,
        username: this.username,
        password: this.password,
        email: this.email,
      };
      let headerAPI = {
        headers: {
          "x-api-key": "xxx-api-key",
          "Content-Type": "application/json",
        },
        payload: payload,
      };
      axios
        // this api ?
        .post(apiUrl + "/v1/auth/register", payload, headerAPI)
        .then((response) => {
          console.log(response.data);
          // window.location = "/login";
        })
        .catch((error) => {
          if (error.response.data.status == "unprocessable_entity") {
            this.snackbar = true;
            this.snackbarColor = "warning";
            this.text = "เลข recovery code ไม่ถูกต้อง";
          } else {
            this.snackbar = true;
            this.snackbarColor = "red";
            this.text = "มีบางอย่างผิดพลาด กรุณาติดต่อ ผู้จัดทำ";
          }
        });
    },
    clearForm() {
      this.$refs.formRegister.resetValidation();
      this.$refs.formRegister.reset();
      this.showpassword = false;
    },
    getImageURL() {
      if (!this.image) return;
      this.imageURL = URL.createObjectURL(this.image);
    },
  },
};
</script>
<style scoped>
.h1c {
  font-size: 30px;
}
</style>
