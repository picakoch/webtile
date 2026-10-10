<template>
  <div :id="'image_' + slug" uk-lightbox></div>
</template>

<script>
import { IMAGE_Q } from "@/lib/queries";
import metaManager from "@/mixins/metaManager";
import uk from "uikit";

export default {
  name: "TileImage",
  mixins: [metaManager],
  props: {
    slug: {
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
      update: (data) => data.tileImages[0] || null,
      result: function (res) {
        const item = res?.data?.tileImages?.[0];
        this.updateTileMetaTags("image", item, item?.description);
        const description = res?.data?.tileImages?.[0]?.description;
        const images =
          res?.data?.tileImages?.[0]?.images?.map((e) => {
            let url = e.formats?.thumbnail?.url || e.url;
            let caption = e.caption;
            if (e.formats?.small) {
              url = e.formats.small.url;
            }
            if (e.formats?.medium) {
              url = e.formats.medium.url;
            }
            if (e.formats?.large) {
              url = e.formats.large.url;
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
          slug: this.slug,
        };
      },
    },
  },
};
</script>

<style scoped></style>
