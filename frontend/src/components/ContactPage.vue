<template>
  <h2 class="uk-light uk-margin-left main-title" id="tile_group_Newsletter">
    {{ $store.getters.label_newsletter }}
  </h2>
  <newsletter-subscription></newsletter-subscription>

  <hr class="uk-divider" />

  <h2 class="uk-light uk-margin-left main-title" id="tile_group_Contacts">
    {{ $store.getters.label_contacts }}
  </h2>
  <div
    v-if="$store.getters.config?.contacts"
    class="uk-light uk-margin uk-margin-left uk-margin-right"
  >
    <StrapiBlocks :content="$store.getters.config?.contacts"></StrapiBlocks>
  </div>

  <template v-if="$store.getters.support_enabled">
    <hr class="uk-divider" />

    <h2 class="uk-light uk-margin-left main-title" id="tile_group_Soutenir">
      {{ $store.getters.label_support }}
    </h2>
    <support-project></support-project>
  </template>
</template>

<script>
import { StrapiBlocks } from "vue-strapi-blocks-renderer";
import NewsletterSubscription from "@/components/NewsletterSubscription.vue";
import SupportProject from "@/components/SupportProject.vue";

export default {
  name: "ContactPage",
  components: {
    SupportProject,
    NewsletterSubscription,
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
