<template>
  <div
    v-if="$store.getters.config?.biography"
    class="uk-light uk-margin uk-margin-left uk-margin-right"
  >
    <StrapiBlocks :content="$store.getters.config?.biography"></StrapiBlocks>
  </div>
</template>

<script>
import { StrapiBlocks } from "vue-strapi-blocks-renderer";
import metaManager from "@/mixins/metaManager";

export default {
  name: "BiographyPage",
  mixins: [metaManager],
  components: {
    StrapiBlocks,
  },
  created() {
    this.updateMetaTags(this.$store.getters.label_bio);
  },
  data() {
    return {};
  },
  watch: {
    $route: function () {
      this.updateMetaTags(this.$store.getters.label_bio);
    },
  },
};
</script>
