<template>
  <div class="uk-grid-divider uk-child-width-1-2@m" uk-grid>
    <div v-if="appStore?.newsletter_enabled">
      <div
        class="uk-card uk-card-default uk-card-body uk-light uk-background-secondary"
      >
        <h2 class="uk-light uk-margin-left main-title">
          {{ appStore?.label_newsletter }}
        </h2>
        <NewsletterSubscription></NewsletterSubscription>
      </div>
    </div>

    <div>
      <div
        class="uk-card uk-card-default uk-card-body uk-light uk-background-secondary"
      >
        <h2 class="uk-light uk-margin-left main-title" id="tile_group_Contacts">
          {{ appStore.label_contacts }}
        </h2>
        <div
          v-if="appStore?.getConfig?.contacts"
          class="uk-light uk-margin uk-margin-left uk-margin-right"
        >
          <StrapiBlocks :content="appStore?.getConfig?.contacts"></StrapiBlocks>
        </div>

        <template v-if="appStore?.support_enabled && appStore.support_text">
          <h2
            class="uk-light uk-margin-left main-title"
            id="tile_group_Newsletter"
          >
            {{ appStore.label_support }}
          </h2>
          <SupportProject></SupportProject>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { StrapiBlocks } from "vue-strapi-blocks-renderer";
import NewsletterSubscription from "../components/NewsletterSubscription.vue";
import SupportProject from "../components/SupportProject.vue";
import { useAppStore } from "../stores/app.js";

const appStore = useAppStore();
// Meta tags
useHead({
  title: computed(() => appStore.label_contact || "Contact"),
});
</script>
