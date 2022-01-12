<template>
  <v-card>
    <v-card-title>
      <h1>แผนที่ของหอพัก</h1>
    </v-card-title>
    <!-- <label>
      AutoComplete
      <GmapAutocomplete @place_changed="setPlace"> </GmapAutocomplete>
      <button @click="usePlace">Add</button>
    </label> -->
    <!-- <br /> -->
    <v-responsive>
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
    </v-responsive>
  </v-card>
</template>

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
            lat: this.place.geometry.location.lat('14.979900'),
            lng: this.place.geometry.location.lng('102.097771'),
          },
        });
        this.place = null;
      }
    },
  },
};
</script>

<style scoped>
.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 400;
  font-size: 100px;
  color: #526488;
  letter-spacing: 1px;
  font-size: 6em;
}

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
