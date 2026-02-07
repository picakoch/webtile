<template>
  <MainPage name="tag" :tag="tag" :q="q" @nav="onNav" />
</template>

<script setup>
const props = defineProps({
  tag: {
    type: String,
    required: true
  },
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