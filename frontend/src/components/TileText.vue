<template>
  <div uk-modal :id="'text_modal_' + slug" class="uk-modal-full">
    <div
      class="uk-modal-dialog uk-modal-body uk-light uk-background-secondary"
      style="min-height: 100vh"
    >
      <button class="uk-modal-close-default" type="button" uk-close></button>
      <h2 class="uk-modal-title">
        {{ tileText?.tile?.title }}
      </h2>
      <div class="" uk-grid v-if="pdfUrl">
        <PdfViewer :url="pdfUrl"></PdfViewer>
      </div>
      <StrapiBlocks
        v-else-if="tileText?.description"
        :content="tileText?.description"
      ></StrapiBlocks>
    </div>
  </div>
</template>

<script>
import { TEXT_Q } from "@/lib/queries";
import metaManager from "@/mixins/metaManager";
import uk from "uikit";
import { defineAsyncComponent } from "vue";
import { StrapiBlocks } from "vue-strapi-blocks-renderer";

// Downloaded only when a text has a PDF attached
const PdfViewer = defineAsyncComponent(
  () => import("@/components/PdfViewer.vue"),
);

export default {
  name: "TileText",
  mixins: [metaManager],
  props: {
    slug: {
      type: String,
    },
  },
  components: { StrapiBlocks, PdfViewer },
  data() {
    return {
      tileText: {},
    };
  },
  beforeMount() {
    document.getElementById("text_modal_" + this.slug)?.remove();
  },
  mounted() {
    uk.modal("#text_modal_" + this.slug).show();
  },
  beforeUnmount() {
    // UIkit moved the modal to <body>, so Vue won't remove it: do it here
    uk.modal(this.$el).$destroy(true);
  },
  computed: {
    pdfUrl() {
      const url = this.tileText?.media?.url;
      return url ? this.$store.getters.backend_url + url : null;
    },
  },
  methods: {},
  apollo: {
    tileText: {
      query: TEXT_Q,
      variables() {
        return {
          slug: this.slug,
        };
      },
      update: (data) => data.tileTexts[0] || null,
      result: function () {
        this.updateTileMetaTags(
          "text",
          this.tileText,
          this.tileText?.description,
        );
      },
    },
  },
};
</script>

<style scoped></style>
