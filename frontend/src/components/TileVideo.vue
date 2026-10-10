<template>
  <div></div>
</template>

<script>
import { VIDEO_Q } from "@/lib/queries";
import uk from "uikit";

export default {
  name: "TileVideo",
  props: {
    slug: {
      type: String,
    },
  },
  data() {
    return {};
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
    tileVideo: {
      query: VIDEO_Q,
      variables() {
        return {
          slug: this.slug,
        };
      },
      update: (data) => data.tileVideos[0] || null,
      result: function (res) {
        const video = res?.data?.tileVideos?.[0]?.video?.url;
        const description = res?.data?.tileVideos?.[0]?.description;
        this.openPanel({
          id: "video_" + this.slug,
          items: [
            {
              source: this.$store.getters.backend_url + video,
              caption: description,
            },
          ],
          videoAutoplay: true,
        });
      },
    },
  },
};
</script>

<style scoped></style>
