<template>
  <v-app id="app">
    <VueTrix v-model="editorContent" placeholder="Enter content" localStorage />
  </v-app>
</template>

<script>
import VueTrix from "vue-trix";
export default {
  components: {
    VueTrix,
  },
};
</script>
