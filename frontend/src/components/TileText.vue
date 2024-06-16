<template>
  <div uk-modal :id="'text_modal_' + id" class="uk-modal-full">
    <div
        class="uk-modal-dialog uk-modal-body uk-light uk-background-secondary"
        style="min-height: 100vh"
    >
      <button class="uk-modal-close-default" type="button" uk-close></button>
      <h2 class="uk-modal-title">
        {{ tileText?.data?.attributes?.tile.title }}
      </h2>
      <div class="" uk-grid>
        <div class="uk-width-1-1 uk-margin-top uk-text-center">
           <div v-for="page in pages" :key="page" class="uk-margin-bottom">
          <VuePDF v-if="pdf" :pdf="pdf" intent="display" fit-parent :page="page">
            <div>
              Chargement du contenu...
            </div>
          </VuePDF>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {TEXT_Q} from "@/lib/queries";
import uk from "uikit";
import {VuePDF, usePDF} from '@tato30/vue-pdf'

export default {
  name: "TileText",
  props: {
    id: {
      type: String,
    },
  },
  components: {VuePDF},
  data() {
    return {
      tileText: {},
      pdf: null,
      pages: []
    };
  },
  beforeMount() {
    document.getElementById("text_modal_" + this.id)?.remove();
  },
  mounted() {
    console.log("AAA")
    console.log(this.tileText)

    uk.modal("#text_modal_" + this.id).show();
  },
  computed: {},
  methods: {},
  apollo: {
    tileText: {
      query: TEXT_Q,
      variables() {
        return {
          id: this.id,
        };
      },
      result: function () {
        const {pdf, pages} = usePDF(this.$store.getters.backend_url + this.tileText.data.attributes.media.data.attributes.url)
        this.pdf = pdf
        this.pages = pages
      },
    },
  },
};
</script>

<style scoped></style>
