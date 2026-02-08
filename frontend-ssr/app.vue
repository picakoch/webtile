<template>
  <div>
    <NuxtRouteAnnouncer />
    <NavBar :sub_categories="sub_categories" @search_tile="onSearch" />
    <div
      uk-alert
      style="border: 8px #ccc solid"
      class="uk-margin-top uk-margin-left uk-margin-right headline uk-background-secondary"
      v-if="config?.headline && !headline_as_tile && headline_enabled"
    >
      <a href class="uk-alert-close" uk-close></a>
      <StrapiBlocks :content="config.headline"></StrapiBlocks>
    </div>
    <NuxtPage @nav="onNav" :q="q" />
    <hr class="uk-divider-icon" />

    <div class="uk-width-1-1 uk-margin-top footer uk-text-center" id="contact">
      <div v-if="config?.contacts">
        {{ config.contact_footer }}
      </div>
      <div class="uk-text-muted">
        design/dev <a target="_blank" href="https://www.n21.fr">N21</a> |
        <a target="_blank" href="https://github.com/picakoch/webtile"
          >webtile</a
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { StrapiBlocks } from "vue-strapi-blocks-renderer";
import { useAppStore } from "./stores/app.js";
import NavBar from "../components/NavBar.vue";

const appStore = useAppStore();

const sub_categories = ref([]);
const q = ref("");

const config = computed(() => appStore.config);
const headline_as_tile = computed(() => appStore.headlineAsTile);
const headline_enabled = computed(() => appStore.headline_enabled);

const onNav = (keys) => {
  sub_categories.value = keys;
};

const onSearch = (searchQuery) => {
  q.value = searchQuery;
};

useHead({
  title: computed(() => config.value?.title || "Webtile"),
});
</script>
