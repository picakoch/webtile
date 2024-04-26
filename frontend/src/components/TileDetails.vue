<template>
  <div>
    <TileImage v-if="name==='image'" :id="id"></TileImage>
    <TileVideo v-if="name==='video'" :id="id"></TileVideo>
    <TileAudio v-if="name==='audio'" :id="id"></TileAudio>
    <div v-else>
      Internal error
    </div>
  </div>
</template>

<script>

import TileImage from "@/components/TileImage.vue";
import TileVideo from "@/components/TileVideo.vue";

export default {
  name: "TileDetails",
  components: {TileVideo, TileImage},
  props: {
    name: {
      type: String,
    },
    id: {
      type: String
    },
  },
  data() {
    return {}
  },
  computed: {},
}
</script>


<style scoped>

</style>