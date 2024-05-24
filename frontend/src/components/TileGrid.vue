<template>
  <masonry-wall :items="all_items" :column-width="col_width" :gap="20">
    <template #default="{ item }">
      <TilePreview :tile="item.attributes.tile"
                   :width="col_width"
                   v-if="item.hasOwnProperty('__typename')"
                   :type="item.__typename"
                   @click="tileClicked(item.__typename, item.id)"
      ></TilePreview>
      <div
          class="tile-preview uk-light uk-text-center"
          :width="col_width"
          :style="{ height: `${title_height}px`, border: `solid 8px #ccc`}"
          v-else
      ><h2 class="uk-position-center uk-position-relative">{{ item.title }}</h2></div>
    </template>
  </masonry-wall>

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

<style scoped>
.tile-preview {
  color: #CCC;
}
</style>