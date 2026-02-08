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
      <img
        :src="imageSrc"
        :alt="tile.title"
        :class="{ img_border: imageBorder }"
        :width="`${tile_width}px`"
        loading="lazy"
      />
      <div
        class="uk-transition-slide-bottom uk-position-bottom uk-overlay uk-overlay-primary main-overlay"
      >
        <p class="uk-h5 uk-margin-remove">
          <span class="">
            <unicon
              :name="TILE_ICONS[type]"
              fill="white"
              width="30"
              height="30"
              v-if="type"
            ></unicon>
          </span>
          <span class="uk-margin-left" v-if="tile?.title">{{
            tile.title
          }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { TILE_ICONS } from "~/utils/constants";

const props = defineProps({
  tile: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  title_id: {
    type: String,
    default: "",
  },
});

const { $config } = useNuxtApp();
const appStore = useAppStore();

const tile_width = ref(0);
const border_size = ref(8);

const thumb = computed(() => {
  return props.tile.image.data.attributes.formats.thumbnail;
});

const orig = computed(() => {
  return props.tile.image.data.attributes;
});

const small = computed(() => {
  return props.tile?.image?.data?.attributes?.formats?.small || orig.value;
});

const medium = computed(() => {
  return props.tile?.image?.data?.attributes?.formats?.medium || small.value;
});

const large = computed(() => {
  return props.tile?.image?.data?.attributes?.formats?.large || medium.value;
});

const imageSrc = computed(() => {
  return `${appStore.backend_url}${medium.value.url}`;
});

const imageBorder = computed(() => {
  return appStore.image_border;
});

const tile_height = computed(() => {
  if (!tile_width.value || !thumb.value) return 0;
  return (thumb.value.height * tile_width.value) / thumb.value.width;
});

const tile_id = computed(() => {
  if (props.title_id) {
    return props.title_id;
  }
  return "tile_" + props.tile.id;
});

const onResize = () => {
  const gridSizer = document.getElementsByClassName("grid-sizer")[0];
  const gridSizer2 = document.getElementsByClassName("grid-sizer2")[0];

  let base_width = gridSizer ? gridSizer.offsetWidth : 300;
  if (props.tile.large && gridSizer2) {
    base_width = gridSizer2.offsetWidth;
  }
  tile_width.value = base_width;
};

onMounted(() => {
  nextTick(() => {
    window.addEventListener("resize", onResize);
  });
  onResize();
});

onUnmounted(() => {
  window.removeEventListener("resize", onResize);
});
</script>

<style scoped>
.tile-preview:hover {
  cursor: pointer;
}
.uk-overlay.main-overlay {
  padding: 20px 20px;
}
</style>
