<template>
  <div>
    <TileImage v-if="name==='image'" :image_id="id"></TileImage>
    <div v-else>
      Internal error
    </div>
  </div>
</template>

<script>

import TileImage from "@/components/TileImage.vue";

export default {
  name: "TileDetails",
  components: {TileImage},
  props: {
    name: {
      type: String,
    },
    id: {
      type: String
    },
  },
  data() {
    return {
    }
  },
  computed: {
  },
}
</script>


<style scoped>

</style>