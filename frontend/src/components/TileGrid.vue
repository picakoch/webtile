<template>
  <div
    v-masonry="'tiles'"
    transition-duration="0.3s"
    item-selector=".grid-item"
    column-width=".grid-sizer"
    gutter=".gutter-sizer"
    class="uk-width-1-1 uk-margin-left uk-margin-right"
  >
    <div class="grid-sizer"></div>
    <div class="grid-sizer2"></div>
    <div class="gutter-sizer"></div>
    <template v-for="item in all_items" :key="item.id">
      <TilePreview
        :tile="item.tile.tile"
        :type="item.tile.__typename"
        :title_id="item.id"
        :href="tileUrl(item)"
        @open="tileClicked(item)"
        v-if="item.hasOwnProperty('tile')"
      ></TilePreview>
      <div
        class="tile-preview uk-light uk-text-center grid-item"
        :class="{
          'grid-item--width2': item.large && $store.getters.headers_as_tile,
          'grid-item--width1': !item.large && $store.getters.headers_as_tile,
        }"
        :style="{ height: `${title_height}px` }"
        :id="item.id"
        v-else-if="$store.getters.headers_as_tile"
      >
        <div class="tile_border uk-width-1-1 uk-height-1-1">
          <h2 class="uk-position-center uk-position-relative title-font">
            {{ item.title }}
          </h2>
        </div>
      </div>
      <!-- block item markup -->
    </template>
  </div>
</template>

<script>
import TilePreview from "@/components/TilePreview.vue";
import { TILE_NAMES } from "@/lib/constants";

export default {
  name: "TileGrid",
  components: { TilePreview },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
    },
    // Page the tiles open from: /time, /t/<tag> or /m/<media>
    basePath: {
      type: String,
      default: "/time",
    },
  },
  methods: {
    // /time/audio/retour-a-la-mer, /t/concerts/audio/retour-a-la-mer
    tileUrl: function (item) {
      return `${this.basePath}/${TILE_NAMES[item.tile.__typename]}/${
        item.tile.slug
      }`;
    },
    tileClicked: function (item) {
      this.$router.push({ path: this.tileUrl(item) });
    },
  },
  mounted() {
    this.all_items = this.items.slice();
    if (
      this.$store.getters.headers_as_tile &&
      this.title &&
      this.title !== ""
    ) {
      this.all_items.unshift({
        is_title: true,
        title: this.title,
        large: false,
        id: `tile_group_${this.title}`,
      });
    }
  },
  computed: {},
  data() {
    return {
      col_width: 300,
      title_height: 200,
      all_items: [],
    };
  },
};
</script>

<style scoped>
.title-font {
  font-family: "Crimson Text", Times, sans-serif;
}
</style>
