<template>
  <div>
    <TileDetails :id="tileId"></TileDetails>
  </div>
</template>

<script setup>
const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const tileId = computed(() => `time_${props.id}`)
</script>