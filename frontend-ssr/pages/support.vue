<template>
  <div class="uk-light uk-margin uk-margin-left uk-margin-right">
    <h2 class="title-font">{{ appStore.label_support }}</h2>
    <p>Static support content.</p>
    <div class="uk-margin">
      <a class="uk-dark uk-button uk-button-default" href="#" target="_blank">
        Support this project
      </a>
    </div>
  </div>
</template>

<script setup>
const appStore = useAppStore()

useHead({
  title: computed(() => appStore.label_support || 'Support')
})
</script>

<style scoped>
.title-font {
  font-family: Augustus, "Times New Roman", Times, sans-serif;
}
</style>