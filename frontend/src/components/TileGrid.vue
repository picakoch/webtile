<template>
  <masonry-wall :items="items" :column-width="col_width" :gap="32">
    <template #default="{ item }">
      <TilePreview :tile="item.attributes.tile"
                   :width="col_width"
                   :type="item.__typename"
                   @click="tileClicked(item.__typename, item.id)"
      ></TilePreview>
    </template>
  </masonry-wall>
  <router-view></router-view>

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
  },
  methods: {
    tileClicked: function (type, id) {
      this.$router.push({path: `/category/${TILE_NAMES[type]}/${id}`})
    }
  },
  data() {
    return {
      col_width: 300,
    };
  },
};
</script>

<style>
</style>