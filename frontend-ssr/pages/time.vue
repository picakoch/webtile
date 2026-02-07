<template>
  <div class="uk-margin-top uk-light uk-margin uk-margin-left uk-margin-right" style="min-height: 80vh">
    <h2 class="title-font">{{ appStore.label_date }}</h2>
    <p>Static content for time page.</p>
    <p v-if="props.q">Search: {{ props.q }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  name: {
    type: String,
    default: 'time'
  },
  tag: {
    type: String,
    default: ''
  },
  media: {
    type: String,
    default: ''
  },
  q: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['nav'])
const appStore = useAppStore()

useHead({
  title: computed(() => appStore.label_date || 'Time')
})
</script>

<style scoped>
.title-font {
  font-family: Augustus, "Times New Roman", Times, sans-serif;
}
</style>