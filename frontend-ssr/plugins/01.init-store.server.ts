import { CONFIG_Q, TAGS_Q } from "../queries/queries.js";
import { useAppStore } from "../stores/app.js";

export default defineNuxtPlugin(async (nuxtApp) => {
  const appStore = useAppStore(nuxtApp.$pinia);
  const { $apollo } = nuxtApp;

  // Only run on server/during generation
  if (process.server) {
    try {
      // Load configa<a
      const configResult = await $apollo.defaultClient.query({
        query: CONFIG_Q,
        fetchPolicy: "network-only",
      });

      if (configResult.data?.config?.data?.attributes) {
        appStore.setConfig(configResult.data.config.data.attributes);
      }

      // Load tags
      const tagsResult = await $apollo.defaultClient.query({
        query: TAGS_Q,
        fetchPolicy: "network-only",
      });

      if (tagsResult.data?.tags?.data) {
        appStore.setTags(tagsResult.data.tags.data);
      }
    } catch (error) {
      console.error("Error initializing store:", error);
    }
  }
});
