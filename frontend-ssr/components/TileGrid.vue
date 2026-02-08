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
          'grid-item--width2': item.large && headers_as_tile,
          'grid-item--width1': !item.large && headers_as_tile,
        }"
        :style="{ height: `${title_height}px` }"
        :id="item.id"
        v-else-if="headers_as_tile"
      >
        <div class="tile_border uk-width-1-1 uk-height-1-1">
          <h2 class="uk-position-center uk-position-relative title-font">
            {{ item.title }}
          </h2>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { TILE_NAMES } from "~/utils/constants";

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["tile-clicked"]);

const col_width = ref(300);
const title_height = ref(200);
const all_items = ref([]);

const appStore = useAppStore();
const headers_as_tile = computed(() => appStore.headers_as_tile);
const route = useRoute();

const tileClicked = (item) => {
  const tileName = TILE_NAMES[item.tile.__typename];

  if (tileName === "text_url") {
    window.open(
      appStore.backend_url + item.attributes.media.data.attributes.url,
      "_blank",
    );
  } else {
    const tileType = TILE_NAMES[item.tile.__typename];
    navigateTo(`${route.path}/${tileType}_${item.tile.id}`);
  }
};

onMounted(() => {
  all_items.value = props.items.slice();

  if (headers_as_tile.value && props.title && props.title !== "") {
    all_items.value.unshift({
      is_title: true,
      title: props.title,
      large: false,
      id: `tile_group_${props.title}`,
    });
  }
});
</script>

<style scoped>
.title-font {
  font-family: Augustus, "Times New Roman", Times, sans-serif;
}
</style>
