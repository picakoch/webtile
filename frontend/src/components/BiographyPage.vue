<template>
  <h2 class="uk-light uk-margin-left  main-title">Biographie</h2>

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
</style>