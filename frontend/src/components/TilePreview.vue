<template>
  <div ref="el"
       :id="tile_id"
       :style="{ height: `${tile_height}px`, border: `solid ${border_size}px ${border_color}` }"
  >
    <v-lazy-image :src="backend_url + small.url" :src-placeholder="backend_url + thumb.url" :alt="tile.title"
                  width="100%"/>
  </div>
</template>

<script>
import {TILE_COLORS} from "@/lib/constants";
import VLazyImage from "v-lazy-image";

export default {
  name: "TilePreview",
  components: {VLazyImage},
  props: {
    tile: {
      type: Object,
    },
    width: {
      type: Number
    },
    type: {
      type: String
    }
  },
  data() {
    return {
      backend_url: process.env.VUE_APP_STRAPI_API_URL,
      el_width: this.width,
      border_size: 10
    }
  },
  computed: {
    thumb: function () {
      return this.tile.image.data.attributes.formats.thumbnail
    },
    small: function () {
      return this.tile?.image?.data?.attributes?.formats?.small || this.thumb
    },
    tile_height: function () {
      return this.thumb.height * this.el_width / this.thumb.width
    },
    border_color: function () {
      return TILE_COLORS[this.type]
    },
    tile_id: function () {
      return 'tile_' + this.tile.id
    },
  },
  mounted() {
    this.el_width = document.getElementById(this.tile_id).offsetWidth - 2 * this.border_size
  }
}
</script>


<style scoped>

</style>