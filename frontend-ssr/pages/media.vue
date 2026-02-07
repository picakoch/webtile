<template>
  <MainPage name="media" :q="q" @nav="onNav" />
</template>

<script setup>
const props = defineProps({
  q: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['nav'])

const onNav = (keys) => {
  emit('nav', keys)
}
</script>