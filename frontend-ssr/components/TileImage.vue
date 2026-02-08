<template>
  <div>
    <SimpleLightbox
      ref="lightbox"
      :images="images"
    />
  </div>
</template>

<script setup>
import { IMAGE_Q } from "~/queries/queries";
import SimpleLightbox from "./SimpleLightbox.vue";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const { $apollo } = useNuxtApp();
const appStore = useAppStore();
const lightbox = ref(null);
const images = ref([]);

onMounted(async () => {
  try {
    const { data } = await $apollo.defaultClient.query({
      query: IMAGE_Q,
      variables: {
        id: props.id,
      },
    });

    const description = data?.tileImage?.data?.attributes?.description;
    images.value =
      data?.tileImage?.data?.attributes?.images?.data.map((e) => {
        let url = e.attributes.formats.thumbnail.url;
        let caption = e.attributes.caption;
        if (e.attributes.formats?.small) {
          url = e.attributes.formats.small.url;
        }
        if (e.attributes.formats?.medium) {
          url = e.attributes.formats.medium.url;
        }
        if (e.attributes.formats?.large) {
          url = e.attributes.formats.large.url;
        }
        return {
          source: appStore.backend_url + url,
          caption: caption || description,
        };
      }) || [];

    // Show lightbox immediately if images exist
    if (images.value.length > 0) {
      nextTick(() => {
        lightbox.value?.show(0);
      });
    }
  } catch (error) {
    console.error("Error fetching tile image:", error);
  }
});
</script>