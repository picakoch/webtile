<template>
  <div>
    <NavBar />
    
    <div class="uk-light uk-margin uk-margin-left uk-margin-right">
      <h2 class="title-font">{{ pageTitle }}</h2>
      <p>Static content for {{ props.name }} page.</p>
      <p v-if="props.tag">Tag: {{ props.tag }}</p>
      <p v-if="props.media">Media: {{ props.media }}</p>
      <p v-if="props.q">Search: {{ props.q }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true
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

const pageTitle = computed(() => {
  switch(props.name) {
    case 'media': return appStore.label_media
    case 'tag': return props.tag || appStore.label_theme
    default: return props.name
  }
})
</script>

<style scoped>
.title-font {
  font-family: Augustus, "Times New Roman", Times, sans-serif;
}
</style>