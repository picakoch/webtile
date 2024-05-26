<template>

  <div v-masonry="'tiles'"
       transition-duration="0.3s"
       item-selector=".grid-item"
       column-width=".grid-sizer"
       gutter=".gutter-sizer"
       class="uk-width-1-1">
    <div class="grid-sizer"></div>
    <div class="grid-sizer2"></div>
    <div class="gutter-sizer"></div>
    <template v-masonry-tile v-for="item in items">
      <TilePreview :tile="item.attributes.tile"
                   :type="item.__typename"
                   @click="tileClicked(item.__typename, item.id)"
                   v-if="item.hasOwnProperty('__typename')"
      ></TilePreview>
      <div
          class="tile-preview uk-light uk-text-center grid-item"
          :class="{'grid-item--width2': item.large,
                   'grid-item--width1': !item.large
                  }"
          :style="{ height: `${title_height}px`,
                    border: `solid 8px #eee`,
                  }"
          v-else
      ><h2 class="uk-position-center uk-position-relative">{{ item.title }}</h2></div>
      <!-- block item markup -->
    </template>
  </div>

  <div uk-alert v-if="items.length === 0" style="border: 5px red solid">
    Aucun résultat
  </div>
</template>

<script>
import TilePreview from "@/components/TilePreview.vue";
import {TILE_NAMES} from "@/lib/constants";

export default {
  name: "TileGrid",
  components: {TilePreview},
  props: {
    items: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
    },
  },
  methods: {
    tileClicked: function (type, id) {
      this.$router.push({path: `${this.$route.path}/${TILE_NAMES[type]}_${id}`})
    }
  },
  mounted() {
    this.all_items = this.items.slice()
    if (this.$store.getters.headers_as_tile) {
      this.all_items.unshift({is_title: true, title: this.title})
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

<style>
</style>