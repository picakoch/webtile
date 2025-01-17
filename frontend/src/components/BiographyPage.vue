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

export default {
  name: "BiographyPage",
  components: {
    StrapiBlocks,
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
.main-title {
  color: #fff;
}

h1,
h2,
h3 {
  font-family: Augustus, "Times New Roman", Times, sans-serif;
}
</style>
