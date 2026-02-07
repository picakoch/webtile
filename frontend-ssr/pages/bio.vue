<template>
  <div class="uk-light uk-margin uk-margin-left uk-margin-right">
    <h2 class="title-font">{{ appStore.label_bio }}</h2>
    <p>Static biography content.</p>
  </div>
</template>

<script setup>
import {useAppStore} from "../stores/app.js";

const appStore = useAppStore()

useHead({
  title: computed(() => appStore.label_bio || 'Biography')
})
</script>

<style scoped>
.title-font {
  font-family: Augustus, "Times New Roman", Times, sans-serif;
}
</style>