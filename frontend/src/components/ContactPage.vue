<template>
  <div class="uk-light uk-margin uk-margin-left uk-margin-right">
    <StrapiBlocks :content="$store.getters.config?.contacts"></StrapiBlocks>
  </div>
</template>

<script>
import { StrapiBlocks } from "vue-strapi-blocks-renderer";

export default {
  name: "ContactPage",
  components: {
    StrapiBlocks,
  },
  data() {
    return {};
  },
};
</script>
