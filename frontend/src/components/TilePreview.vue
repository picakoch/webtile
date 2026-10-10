<template>
  <!-- A real link so crawlers can follow it; opens in place (no reload) -->
  <a
    :href="href"
    @click="onClick"
    :id="tile_id"
    class="tile-preview grid-item"
    :class="{
      'grid-item--width2': tile?.large,
      'grid-item--width1': !tile?.large,
    }"
    :style="{ height: `${tile_height}px` }"
  >
    <div class="uk-inline-clip uk-transition-toggle" tabindex="0">
      <!-- One download per tile, sized for the screen; tiles below the
           screen load when scrolled to, the first ones right away -->
      <img
        :src="src"
        :srcset="srcset"
        :sizes="sizes"
        :width="thumb.width"
        :height="thumb.height"
        :loading="priority ? 'eager' : 'lazy'"
        :fetchpriority="priority ? 'high' : 'auto'"
        decoding="async"
        :alt="tile.title"
        class="tile-image"
        :class="{ img_border: $store.getters.image_border }"
        :style="{ width: `${tile_width}px`, height: 'auto' }"
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
  </a>
</template>

<script>
import { TILE_ICONS } from "../lib/constants";
import { imageSrc, imageSrcset } from "@/lib/images";

// Rendered width of a tile, per breakpoint (same as .grid-item--width1/2 in
// App.vue): lets the browser pick the right image size before layout
const SIZES = {
  normal:
    "(min-width: 1600px) 19vw, (min-width: 1200px) 24vw, (min-width: 950px) 31vw, (min-width: 700px) 46vw, 93vw",
  large:
    "(min-width: 1600px) 39vw, (min-width: 1200px) 48vw, (min-width: 950px) 64vw, (min-width: 700px) 95vw, 93vw",
};

export default {
  name: "TilePreview",
  emits: ["open"],
  props: {
    href: {
      type: String,
    },
    tile: {
      type: Object,
    },
    type: {
      type: String,
    },
    title_id: {
      type: String,
    },
    // First tiles of the page: loaded immediately, with high priority
    priority: {
      type: Boolean,
      default: false,
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
    // Plain click: open in place. Modified/middle click: let the browser
    // handle the link (new tab, new window...)
    onClick(event) {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      event.preventDefault();
      this.$emit("open");
    },
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
      return this.tile.image.formats?.thumbnail || this.orig;
    },
    orig: function () {
      return this.tile.image;
    },
    src: function () {
      return imageSrc(this.tile.image, this.$store.getters.backend_url, {
        wide: this.tile?.large,
      });
    },
    srcset: function () {
      return imageSrcset(this.tile.image, this.$store.getters.backend_url, {
        wide: this.tile?.large,
      });
    },
    sizes: function () {
      return this.tile?.large ? SIZES.large : SIZES.normal;
    },
    tile_height: function () {
      return (this.thumb.height * this.tile_width) / this.thumb.width;
    },
    tile_id: function () {
      if (this.title_id) {
        return this.title_id;
      }
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
.tile-preview {
  display: block;
  /* Shown until the image arrives */
  background-color: #1a1a1a;
  color: inherit;
  text-decoration: none;
}
.tile-preview:hover {
  cursor: pointer;
}
.uk-overlay.main-overlay {
  padding: 20px 20px;
}
</style>
