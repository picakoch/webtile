<template>
  <div class="uk-margin-top" style="min-height: 80vh">
    <div v-if="pending" class="uk-position-center">
      <div class="spinner" uk-spinner="ratio: 3"></div>
    </div>
    <template v-else-if="appStore.category_break">
      <div v-for="group in sorted_items" :key="group" class="tile-group">
        <TileGrid :items="group[1]" :title="group[0]" :key="group"></TileGrid>
      </div>
    </template>
    <template v-else>
      <TileGrid
        :items="all_items"
        :key="name + '_' + q.replace(' ', '') + '_' + tag + '_' + media"
      ></TileGrid>
    </template>
    <NuxtPage />
  </div>
</template>

<script setup>
import {
  IMAGES_Q,
  VIDEOS_Q,
  AUDIOS_Q,
  TEXTS_Q,
  SEARCH_Q,
} from "~/queries/queries";
import { slugify } from "~/utils/utils";
import uk from "uikit";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    default: "",
  },
  media: {
    type: String,
    default: "",
  },
  q: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["nav"]);

const appStore = useAppStore();
const route = useRoute();
const router = useRouter();

const items = ref({}); // This one stays a ref because it's used in computed

// Change these to regular variables
let tileImages = { data: [] };
let tileVideos = { data: [] };
let tileTexts = { data: [] };
let tileAudios = { data: [] };
let search = {
  tileAudios: { data: [] },
  tileImages: { data: [] },
  tileVideos: { data: [] },
  tileTexts: { data: [] },
};

const groupBy = (array, keyFn) => {
  return array.reduce((result, item) => {
    const key = keyFn(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
    return result;
  }, {});
};

const sortTime = (a, b) => {
  return (
    new Date(b?.attributes?.tile?.date) - new Date(a?.attributes?.tile?.date)
  );
};

const compute_items = () => {
  if (props.name === "tag" && !props.tag) {
    const tags = appStore.tags;
    if (tags.length > 0) {
      router.push("/t/" + slugify(appStore.tags[0]?.attributes?.name));
      items.value = {};
      return;
    }
  }

  if (props.name === "media" && !props.media) {
    router.push("/m/" + slugify(appStore.label_music));
    items.value = {};
    return;
  }

  if (props.name === "tag") {
    items.value = {};
    return;
  }

  // Now access directly without .value
  let image = tileImages?.data || [];
  let audio = tileAudios?.data || [];
  let video = tileVideos?.data || [];
  let text = tileTexts?.data || [];

  if (props.q.length > 2) {
    image = search?.tileImages?.data || [];
    audio = search?.tileAudios?.data || [];
    video = search?.tileVideos?.data || [];
    text = search?.tileTexts?.data || [];
  }

  let ret_items = {};
  if (props.name === "type") {
    ret_items[appStore.label_music] = audio;
    ret_items[appStore.label_images] = image;
    ret_items[appStore.label_video] = video;
    ret_items[appStore.label_text] = text;
  } else {
    let allTiles = [...image, ...text, ...audio, ...video];
    allTiles.sort(sortTime);

    if (
      appStore.config?.headline &&
      appStore.headlineAsTile === true &&
      appStore.headline_enabled
    ) {
      allTiles.unshift({
        is_title: true,
        title: appStore.config?.headline,
      });
    }

    if (props.name === "time") {
      ret_items = groupBy(allTiles, (e) =>
        e?.attributes?.tile?.date
          ? new Date(e.attributes.tile.date).getFullYear()
          : new Date().getFullYear()
      );
    } else if (props.name === "theme") {
      appStore.tags.forEach((tag) => {
        let tag_name = tag?.attributes?.name;
        let fTiles = allTiles.filter((e) =>
          e?.attributes?.tile?.tags?.data
            .map((ee) => ee.attributes.name)
            .includes(tag_name),
        );
        if (fTiles.length > 0) {
          ret_items[tag_name] = fTiles;
        }
      });
    } else if (props.tag && props.tag.length > 1) {
      appStore.tags.forEach((tag) => {
        let tag_name = tag?.attributes?.name;
        let fTiles = allTiles.filter((e) =>
          e?.attributes?.tile?.tags?.data
            .map((ee) => ee.attributes.name)
            .includes(tag_name),
        );
        if (fTiles.length > 0 && slugify(tag_name) === props.tag) {
          ret_items[tag_name] = fTiles;
        }
      });
    } else if (props.media && props.media.length > 1) {
      if (props.media === slugify(appStore.label_music)) {
        ret_items[appStore.label_music] = audio;
      } else if (props.media === slugify(appStore.label_images)) {
        ret_items[appStore.label_images] = image;
      } else if (props.media === slugify(appStore.label_video)) {
        ret_items[appStore.label_video] = video;
      } else if (props.media === slugify(appStore.label_text)) {
        ret_items[appStore.label_text] = text;
      }
    }
  }

  Object.keys(ret_items).forEach((k) => {
    ret_items[k] = ret_items[k].map((e, i) => {
      return { tile: e, id: i === 0 ? `tile_group_${k}` : `tile_${e.id}` };
    });
  });
  items.value = ret_items;
};

const { pending } = await useAsyncData(
  `main-data-${props.name}-${props.tag}-${props.media}-${props.q}`,
  async () => {
    const [images, videos, audios, texts, searchResults] = await Promise.all([
      useAsyncQuery(IMAGES_Q),
      useAsyncQuery(VIDEOS_Q),
      useAsyncQuery(AUDIOS_Q),
      useAsyncQuery(TEXTS_Q),
      props.q.length > 2 ? useAsyncQuery(SEARCH_Q, { query: props.q }) : null,
    ]);

    // Assign directly without .value
    tileImages = images.data.value?.tileImages || { data: [] };
    tileVideos = videos.data.value?.tileVideos || { data: [] };
    tileAudios = audios.data.value?.tileAudios || { data: [] };
    tileTexts = texts.data.value?.tileTexts || { data: [] };

    if (searchResults) {
      search = searchResults.data.value || search;
    }

    compute_items();
    return true;
  },
);


const updatePath = (e) => {
  if (route.matched.length >= 2) {
    let path = route.matched[route.matched.length - 2].path;
    let realPath = path.replace(
      /:\w+/g,
      (param) => route.params[param.substr(1)],
    );
    router.push(realPath);
  }
};

const stopAllTracks = () => {
  const els = [...document.getElementsByTagName("audio")];
  els.forEach((e) => {
    e.pause();
    e.currentTime = 0;
  });
};




const sorted_items = computed(() => {
  if (props.name === "time") {
    return Object.entries(items.value).sort((a, b) => -(a[0] - b[0]));
  } else {
    return Object.entries(items.value).sort((a, b) => a[0] - b[0]);
  }
});

const all_items = computed(() => {
  let ret = [];
  sorted_items.value.forEach((e) => {
    let title = {
      is_title: true,
      title: e[0],
      large: false,
      id: `tile_group_${e[0]}`,
    };
    ret = [...ret, title, ...e[1]];
  });
  return ret;
});

onMounted(() => {
  uk.util.on(document, "hidden", ".uk-lightbox", updatePath);
  uk.util.on(document, "hidden", ".uk-modal", (e) => {
    updatePath(e);
    stopAllTracks();
  });
});

</script>

<style>
.tile-group {
  margin-top: 10px;
}
</style>
