<template>
  <div class="uk-light uk-margin uk-margin-left uk-margin-right">
    <StrapiBlocks
      v-if="$store.getters.support_text"
      :content="$store.getters.support_text"
    ></StrapiBlocks>

    <div
      class="uk-light uk-margin uk-margin-left uk-margin-right"
      v-if="$store.getters.donation_url"
    >
      <a
        class="uk-dark uk-button uk-button-default"
        target="_blank"
        :href="$store.getters.donation_url"
      >
        Faire un don
      </a>
    </div>
  </div>
</template>

<script>
import { StrapiBlocks } from "vue-strapi-blocks-renderer";

export default {
  name: "SupportProject",
  components: { StrapiBlocks },
  data() {
    return {};
  },
};
</script>
