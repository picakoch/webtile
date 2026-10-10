<template>
  <div class="uk-width-1-1 uk-margin-top uk-text-center pdf-container">
    <div v-for="page in pages" :key="page" class="uk-margin-bottom">
      <VuePDF v-if="pdf" :pdf="pdf" intent="display" fit-parent :page="page">
        <div>Chargement du contenu...</div>
      </VuePDF>
    </div>
  </div>
</template>

<script>
// The PDF viewer (pdf.js) is most of the app's JavaScript: TileText loads
// this component only for texts that have a PDF attached.
import { VuePDF, usePDF } from "@tato30/vue-pdf";

export default {
  name: "PdfViewer",
  components: { VuePDF },
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { pdf, pages } = usePDF(props.url);
    return { pdf, pages };
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
