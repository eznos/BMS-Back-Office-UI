<template>
  <v-app id="app">
    <div class="content background-main">
      <v-row justify="space-between" class="px-3">
        <!-- title -->
        <div class="mb-4">
          <v-row style="align-items: center">
            <div class="ml-3 mt-9">
              <h2>
                <v-icon size="40" color="#D1473A"> mdi-map-marker-star </v-icon>
                จัดการแผนที่
              </h2>
            </div>
          </v-row>
        </div>
      </v-row>
    </div>
    <v-card class="card-filter px-6 py-6">
      <v-card-title>
        <v-icon size="35px" class="icon">mdi-map-legend</v-icon>
        &nbsp;&nbsp;
        <h3>จัดการแผนที่</h3>
        &nbsp;&nbsp;
        <v-spacer></v-spacer>
        <!-- add marker buttons -->
        <v-dialog v-model="dialog" width="75%" persistent>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="agree" dark v-bind="attrs" v-on="on">
              <v-icon> mdi-map-marker-plus </v-icon>
              เพิ่มเขตอาคารในแผนที่
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="text-h5 grey lighten-2">
              เพิ่มเขตอาคารในแผนที่
            </v-card-title>
            <v-card-text>
              <v-form ref="formAddmap" v-model="valid">
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="latitude"
                      append-icon="mdi-latitude"
                      label="ละติจูด"
                      required
                      :rules="[rules.latitudeRules.regex]"
                      clearable
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="longitude"
                      append-icon="mdi-longitude"
                      label="ลองติจูด"
                      required
                      :rules="[rules.longitudeRules.regex]"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      required
                      append-icon="mdi-map-legend"
                      label="ชื่อเขต"
                      :rules="rules.name"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" outlined @click="clearform">
                ล้างข้อมูลที่กรอก
              </v-btn>
              <v-btn color="warning" text @click="dialog = false">
                ยกเลิกการเพิ่มพื้นที่
              </v-btn>
              <v-btn
                color="agree"
                :disabled="!valid"
                text
                @click="dialog = false"
              >
                ยืนยันการเพิ่มพื้นที่เขต
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-title>

      <!-- <label>
      AutoComplete
      <GmapAutocomplete @place_changed="setPlace"> </GmapAutocomplete>
      <button @click="usePlace">Add</button>
    </label>
    <br /> -->
      <v-card-text>
        <div>
          <GmapMap
            class="map-responsive"
            :zoom="15"
            map-type-id="roadmap"
            settilt:45.
            :center="{ lat: 14.9799, lng: 102.097771 }"
          >
            <GmapMarker
              v-for="(marker, index) in markers"
              :key="index"
              :position="marker.position"
            />
            <GmapMarker
              v-if="this.place"
              label="★"
              :position="{
                lat: this.place.geometry.location.lat('14.979900'),
                lng: this.place.geometry.location.lng('102.097771'),
              }"
            />
          </GmapMap>
        </div>
      </v-card-text>
    </v-card>
  </v-app>
</template>
<script src="vue-google-maps.js"></script>
<script>
import { gmapApi } from "vue2-google-maps";
export default {
  computed: {
    google: gmapApi,
  },
  data() {
    return {
      valid: true,
      markers: [],
      place: null,
      latitude: "",
      longitude: "",
      dialog: false,
      rules: {
        latitudeRules: {
          required: (v) => !!v || "กรุณาใส่ข้อมูล",
          regex: (v) =>
            /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/.test(
              v
            ) || "ละติจูดไม่ถูกต้อง",
        },
        longitudeRules: {
          required: (v) => !!v || "กรุณาใส่ข้อมูล.",
          regex: (v) =>
            /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/.test(
              v
            ) || "ลองจิจูดไม่ถูกต้อง",
        },
        name: [
          (v) => !!v || "กรุณากรอกข้อมูล",
          (v) =>
            (v && v.length >= 2) || "กรอกชื่อหรือนามสกุลให้มากกว่า 2 ตัวอักษร",
        ],
      },
    };
  },
  description: "Autocomplete Example (#164)",
  methods: {
    setDescription(description) {
      this.description = description;
    },
    setPlace(place) {
      this.place = place;
    },
    usePlace(place) {
      this.place = place;
      if (this.place) {
        this.markers.push({
          position: {
            lat: this.place.geometry.location.lat("14.979900"),
            lng: this.place.geometry.location.lng("102.097771"),
          },
        });
        this.place = null;
      }
    },
    clearform() {
      this.$refs.formAddmap.reset();
    },
  },
  computed: {},
};
</script>

<style scoped>
.map-responsive {
  overflow: hidden;
  padding-bottom: 45.25%;
  position: relative;
  height: 0;
}
.map-responsive iframe {
  left: 0;
  top: 0;
  height: 60%;
  width: 60%;
  position: absolute;
}

.card-filter {
  margin-bottom: 20px;
  margin-top: 20px;
}
.title {
  font-size: 25px;
  font-family: Sarabun;
}
</style>
