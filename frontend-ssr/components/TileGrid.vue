<template>
  <div class="tile-grid uk-width-1-1 uk-margin-left uk-margin-right">
    <template v-for="item in all_items" :key="item.id">
      <NuxtLink
        v-if="item.hasOwnProperty('tile')"
        :to="getTileLink(item)"
        :target="isExternalLink(item) ? '_blank' : undefined"
        class="tile-link grid-item"
      >
        <TilePreview
          :tile="item.tile.attributes.tile"
          :type="item.tile.__typename"
          :title_id="item.id"
        ></TilePreview>
      </NuxtLink>
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

const col_width = ref(300);
const title_height = ref(200);
const all_items = ref([]);

const appStore = useAppStore();
const headers_as_tile = computed(() => appStore.headers_as_tile);
const route = useRoute();

const getTileLink = (item) => {
  const tileName = TILE_NAMES[item.tile.__typename];

  // For external URLs, return the full URL
  if (tileName === "text_url") {
    return appStore.backend_url + item.tile.attributes.tile.media?.data?.attributes?.url;
  }

  // For internal tiles, return the route
  const tileType = TILE_NAMES[item.tile.__typename];
  return `${route.path}/${tileType}_${item.tile.id}`;
};

const isExternalLink = (item) => {
  const tileName = TILE_NAMES[item.tile.__typename];
  return tileName === "text_url";
};

// Move to setup instead of onMounted for SSR
all_items.value = props.items.slice();

if (headers_as_tile.value && props.title && props.title !== "") {
  all_items.value.unshift({
    is_title: true,
    title: props.title,
    large: false,
    id: `tile_group_${props.title}`,
  });
}
</script>

<style scoped>
.title-font {
  font-family: Augustus, "Times New Roman", Times, sans-serif;
}

.tile-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.tile-link:hover {
  text-decoration: none;
}

/* CSS Grid masonry replacement */
.tile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
}

@media (min-width: 640px) {
  .tile-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (min-width: 960px) {
  .tile-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (min-width: 1200px) {
  .tile-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

/* Wide items span 2 columns */
.grid-item--width2 {
  grid-column: span 2;
}

.grid-item--width1 {
  grid-column: span 1;
}

.grid-item {
  min-width: 0;
  min-height: 0;
}

.tile-preview {
  display: flex;
  align-items: center;
  justify-content: center;
}

.tile_border {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>