<template>
  <masonry-wall :items="items" :column-width="col_width" :gap="16">
    <template #default="{ item }">
      <TilePreview :tile="item.attributes.tile"
                   :width="col_width"
                   :type="item.__typename"></TilePreview>
    </template>
  </masonry-wall>

  <div uk-alert v-if="items.length === 0" style="border: 10px red solid">
      Aucun résultat
  </div>
</template>

<script>
import TilePreview from "@/components/TilePreview.vue";

export default {
  name: "TileGrid",
  components: {TilePreview},
  props: {
    items: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      col_width: 300,
    };
  },
};
</script>

<style>
.masonry-item {
  background-color: #ccc;
}

</style>