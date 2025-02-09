<template>
  <div class="uk-grid-divider uk-child-width-1-2@m" uk-grid>
    <div v-if="$store.getters.newsletter_enabled">
      <div
        class="uk-card uk-card-default uk-card-body uk-light uk-background-secondary"
      >
        <h2 class="uk-light uk-margin-left main-title">
          {{ $store.getters.label_newsletter }}
        </h2>
        <newsletter-subscription></newsletter-subscription>
      </div>
    </div>

    <div>
      <div
        class="uk-card uk-card-default uk-card-body uk-light uk-background-secondary"
      >
        <h2 class="uk-light uk-margin-left main-title" id="tile_group_Contacts">
          {{ $store.getters.label_contacts }}
        </h2>
        <div
          v-if="$store.getters.config?.contacts"
          class="uk-light uk-margin uk-margin-left uk-margin-right"
        >
          <StrapiBlocks
            :content="$store.getters.config?.contacts"
          ></StrapiBlocks>
        </div>

        <template
          v-if="$store.getters.support_enabled && $store.getters.support_text"
        >
          <h2
            class="uk-light uk-margin-left main-title"
            id="tile_group_Newsletter"
          >
            {{ $store.getters.label_support }}
          </h2>
          <SupportProject></SupportProject>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { StrapiBlocks } from "vue-strapi-blocks-renderer";
import NewsletterSubscription from "@/components/NewsletterSubscription.vue";
import SupportProject from "@/components/SupportProject.vue";
import metaManager from "@/mixins/metaManager";

export default {
  name: "ContactPage",
  mixins: [metaManager],
  components: {
    SupportProject,
    NewsletterSubscription,
    StrapiBlocks,
  },
  created() {
    this.updateMetaTags(this.$store.getters.label_contact);
  },
  data() {
    return {};
  },
  watch: {
    $route: function () {
      this.updateMetaTags(this.$store.getters.label_contact);
    },
  },
};
</script>
