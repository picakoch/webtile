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
      <div class="" uk-grid v-if="pdf">
        <div class="uk-width-1-1 uk-margin-top uk-text-center pdf-container">
          <div v-for="page in pages" :key="page" class="uk-margin-bottom">
            <VuePDF
              v-if="pdf"
              :pdf="pdf"
              intent="display"
              fit-parent
              :page="page"
            >
              <div>Chargement du contenu...</div>
            </VuePDF>
          </div>
        </div>
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
import uk from "uikit";
import { VuePDF, usePDF } from "@tato30/vue-pdf";
import { StrapiBlocks } from "vue-strapi-blocks-renderer";

export default {
  name: "TileText",
  props: {
    slug: {
      type: String,
    },
  },
  components: { StrapiBlocks, VuePDF },
  data() {
    return {
      tileText: {},
      pdf: null,
      pages: [],
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
  computed: {},
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
        if (this.tileText?.media?.url) {
          const { pdf, pages } = usePDF(
            this.$store.getters.backend_url + this.tileText.media.url,
          );
          this.pdf = pdf;
          this.pages = pages;
        }
      },
    },
  },
};
</script>

<style scoped>
.pdf-container {
  margin-left: auto;
  margin-right: auto;
  max-width: 1000px;
}
</style>
