<template>
    <h2 class="uk-light uk-margin-left">Newsletter</h2>
  <newsletter-subscription></newsletter-subscription>

  <hr class="uk-divider" />

  <h2 class="uk-light uk-margin-left">Contacts</h2>
  <div
    v-if="$store.getters.config?.contacts"
    class="uk-light uk-margin uk-margin-left uk-margin-right"
  >
    <StrapiBlocks :content="$store.getters.config?.contacts"></StrapiBlocks>
  </div>

  <hr class="uk-divider" />

  <h2 class="uk-light uk-margin-left">Soutenir</h2>
  <support-project></support-project>
</template>

<script>
import { StrapiBlocks } from "vue-strapi-blocks-renderer";
import NewsletterSubscription from "@/components/NewsletterSubscription.vue";
import SupportProject from "@/components/SupportProject.vue";
import VLazyImage from "v-lazy-image";

export default {
  name: "ContactPage",
  components: {
    VLazyImage,
    SupportProject,
    NewsletterSubscription,
    StrapiBlocks,
  },
  data() {
    return {};
  },
};
</script>
