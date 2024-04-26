<template>
  <div>
    <TileImage v-if="name==='image'" :id="id"></TileImage>
    <TileVideo v-else-if="name==='video'" :id="id"></TileVideo>
    <TileAudio v-else-if="name==='audio'" :id="id"></TileAudio>
    <div v-else>
      Internal error {{name}}
    </div>
  </div>
</template>

<script>

import TileImage from "@/components/TileImage.vue";
import TileVideo from "@/components/TileVideo.vue";
import TileAudio from "@/components/TileAudio.vue";

export default {
  name: "TileDetails",
  components: {TileVideo, TileImage, TileAudio},
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