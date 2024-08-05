<template>
  <div
    :id="tile_id"
    class="tile-preview grid-item"
    :class="{
      'grid-item--width2': tile?.large,
      'grid-item--width1': !tile?.large,
    }"
    :style="{ height: `${tile_height}px` }"
  >
    <div class="uk-inline-clip uk-transition-toggle" tabindex="0">
      <v-lazy-image
        :src="$store.getters.backend_url + medium.url"
        :src-placeholder="$store.getters.backend_url + thumb.url"
        :alt="tile.title"
        :class="{ img_border: $store.getters.image_border }"
        :width="`${tile_width}px`"
      />
      <div
        class="uk-transition-slide-bottom uk-position-bottom uk-overlay uk-overlay-primary main-overlay"
      >
        <p class="uk-h5 uk-margin-remove">
          <span class=""
            ><unicon
              :name="TILE_ICONS[type]"
              fill="white"
              width="30"
              height="30"
              v-if="type"
            ></unicon
          ></span>
          <span class="uk-margin-left" v-if="tile?.title">{{
            tile.title
          }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import VLazyImage from "v-lazy-image";
import { TILE_ICONS } from "../lib/constants";

export default {
  name: "TilePreview",
  components: { VLazyImage },
  props: {
    tile: {
      type: Object,
    },
    type: {
      type: String,
    },
  },
  data() {
    return {
      tile_width: 0,
      border_size: 8,
      TILE_ICONS: TILE_ICONS,
    };
  },
  methods: {
    onResize: function () {
      let base_width =
        document.getElementsByClassName("grid-sizer")[0].offsetWidth;
      if (this.tile.large) {
        base_width =
          document.getElementsByClassName("grid-sizer2")[0].offsetWidth;
      }
      this.tile_width = base_width;
    },
  },
  computed: {
    thumb: function () {
      return this.tile.image.data.attributes.formats.thumbnail;
    },
    orig: function () {
      return this.tile.image.data.attributes;
    },
    small: function () {
      return this.tile?.image?.data?.attributes?.formats?.small || this.orig;
    },
    medium: function () {
      return this.tile?.image?.data?.attributes?.formats?.medium || this.small;
    },
    large: function () {
      return this.tile?.image?.data?.attributes?.formats?.large || this.medium;
    },
    tile_height: function () {
      return (this.thumb.height * this.tile_width) / this.thumb.width;
    },
    tile_id: function () {
      return "tile_" + this.tile.id;
    },
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });
    this.onResize();
  },
};
</script>

<style scoped>
.tile-preview:hover {
  cursor: pointer;
}
.uk-overlay.main-overlay {
  padding: 20px 20px;
}
</style>
