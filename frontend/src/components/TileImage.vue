<template>
  <div :id="'image_' + id" uk-lightbox></div>
</template>

<script>
import { IMAGE_Q } from "@/lib/queries";
import uk from "uikit";

export default {
  name: "TileImage",
  props: {
    id: {
      type: String,
    },
  },
  data() {
    return {
      empty_gallery: false,
    };
  },
  computed: {},
  methods: {},
  apollo: {
    tileImage: {
      query: IMAGE_Q,
      result: function (res) {
        const description = res?.data?.tileImage?.data?.attributes?.description;
        const images =
          res?.data?.tileImage?.data?.attributes?.images?.data.map((e) => {
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
              source: this.$store.getters.backend_url + url,
              caption: caption || description,
            };
          }) || [];
        if (images.length === 0) {
          this.empty_gallery = true;
        } else {
          uk.lightboxPanel({ items: images }).show();
        }
      },
      variables() {
        return {
          id: this.id,
        };
      },
    },
  },
};
</script>

<style scoped></style>
