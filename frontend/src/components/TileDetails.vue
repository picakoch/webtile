<template>
  <div>
    <TileImage v-if="item_cat === 'image'" :id="item_id"></TileImage>
    <TileVideo v-else-if="item_cat === 'video'" :id="item_id"></TileVideo>
    <TileAudio v-else-if="item_cat === 'audio'" :id="item_id"></TileAudio>
    <div v-else>Internal error {{ item_cat }}</div>
  </div>
</template>

<script>
import TileImage from "@/components/TileImage.vue";
import TileVideo from "@/components/TileVideo.vue";
import TileAudio from "@/components/TileAudio.vue";

export default {
  name: "TileDetails",
  components: {  TileVideo, TileImage, TileAudio },
  props: {
    id: {
      type: String,
    },
  },
  data() {
    return {};
  },
  computed: {
    item_id() {
      return this.id.split("_")[1];
    },
    item_cat() {
      return this.id.split("_")[0];
    },
  },
};
</script>

<style scoped></style>
