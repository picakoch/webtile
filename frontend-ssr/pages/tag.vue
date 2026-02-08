<template>
  <div></div>
</template>

<script setup>
import { slugify } from "~/utils/utils";
import { useAppStore } from "../stores/app.js";

const appStore = useAppStore();
if (appStore.tags.length > 0){
navigateTo("/t/" + slugify(appStore.tags[0]?.attributes?.name), { replace: true });
} else {
navigateTo("/time", { replace: true });
}
</script>
