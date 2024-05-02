<template>
  <div uk-modal :id="'text_modal_' + id" class="uk-modal-full">

    <div class="uk-modal-dialog uk-modal-body uk-light uk-background-secondary" style="min-height: 80vh">
      <button class="uk-modal-close-default" type="button" uk-close></button>
      <h2 class="uk-modal-title">{{ tileText?.data?.attributes?.tile.title }}</h2>
      <div class="" uk-grid>
        <div class="uk-width-1-3">
          <div v-if="tileText?.data?.attributes?.description">
            <StrapiBlocks :content="tileText?.data?.attributes?.description"></StrapiBlocks>
          </div>
        </div>
        <div class="uk-width-2-3">
          <div class="uk-text-center">
            <span uk-icon="icon: lock; ratio: 3" class="uk-icon-link"></span>
          </div>
          <div class="uk-text-center">
            Ce document est protégé.
            Pour y accéder, vous devez payer l'accès en suivnat ce lien:
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script>
import {TEXT_Q} from '@/lib/queries'
import uk from "uikit"
import {StrapiBlocks} from 'vue-strapi-blocks-renderer';

export default {
  name: "TileText",
  props: {
    id: {
      type: String
    }
  },
  components: {StrapiBlocks},
  data() {
    return {}
  },
  beforeMount() {
    document.getElementById("text_modal_" + this.id)?.remove();
  },
  mounted() {
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
        }
      },
      result: function () {

      }
    }
  }
}
</script>


<style scoped>
</style>