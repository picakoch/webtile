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
        :tile="item.tile.attributes.tile"
        :type="item.tile.__typename"
        :title_id="item.id"
        @click="tileClicked(item)"
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
  },
  methods: {
    tileClicked: function (item) {
      if (TILE_NAMES[item.__typename] === "text_url") {
        window.open(
          this.$store.getters.backend_url +
            item.attributes.media.data.attributes.url,
          "_blank"
        );
      } else {
        this.$router.push({
          path: `${this.$route.path}/${TILE_NAMES[item.tile.__typename]}_${
            item.tile.id
          }`,
        });
      }
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
  font-family: "Mrs Saint Delafield", Times, sans-serif;
}
</style>
