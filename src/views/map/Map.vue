<template>
  <v-card>
    <v-card-title>
      <v-row>
        <v-col>
          <h2>
            <v-icon size="30px" color="#1145b7">mdi-google-maps </v-icon> แผนที่
          </h2>
        </v-col>
        <v-col>
          <v-dialog v-model="dialog" width="500">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="#092C7A" dark v-bind="attrs" v-on="on">
                <v-icon> mdi-map-marker-plus </v-icon>
                เพิ่มเขตอาคารในแผนที่
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="text-h5 grey lighten-2">
                เพิ่มเขตอาคารในแผนที่
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col>
                    <v-text-field append-icon="mdi-latitude" label="ละติจูด">
                    </v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      append-icon="mdi-longitude"
                      label="ลองติจูด"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                      <v-text-field append-icon="mdi-map-legend" label="ชื่อเขต">

                      </v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="dialog = false">
                  I accept
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
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
          map-type-id="hybrid"
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
      markers: [],
      place: null,
      dialog: false,
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
  },
};
</script>

<style scoped>
.subtitle {
  font-weight: 300;
  font-size: 3em;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}

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
</style>
