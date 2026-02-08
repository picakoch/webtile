<template>
  <div class="uk-light uk-margin uk-margin-left uk-margin-right">
    <StrapiBlocks
      v-if="appStore.support_text"
      :content="appStore.support_text"
    ></StrapiBlocks>

    <div
      class="uk-light uk-margin uk-margin-left uk-margin-right"
      v-if="appStore.donation_url"
    >
      <a
        class="uk-dark uk-button uk-button-default"
        target="_blank"
        :href="appStore.donation_url"
      >
        Faire un don
      </a>
    </div>
  </div>
</template>

<script setup>
import { StrapiBlocks } from "vue-strapi-blocks-renderer";
import { useAppStore } from "../stores/app.js";

const appStore = useAppStore();
</script>
