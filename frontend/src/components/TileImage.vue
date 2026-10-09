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
  beforeUnmount() {
    // The panel lives in <body>, outside Vue's tree: close it when leaving the route
    if (this.panel && document.body.contains(this.panel.$el)) {
      this.panel.$destroy(true);
    }
  },
  methods: {
    openPanel(options) {
      // Apollo may deliver the result more than once: only open one panel
      if (this.panel) {
        return;
      }
      this.panel = uk.lightboxPanel(options);
      this.panel.show();
    },
  },
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
          this.openPanel({ items: images });
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
