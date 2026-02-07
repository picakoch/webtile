<template>
  <div>
    <TileImage v-if="item_cat === 'image'" :id="item_id"></TileImage>
    <TileVideo v-else-if="item_cat === 'video'" :id="item_id"></TileVideo>
    <TileAudio v-else-if="item_cat === 'audio'" :id="item_id"></TileAudio>
    <TileText v-else-if="item_cat === 'text'" :id="item_id"></TileText>
    <div v-else>Internal error {{ item_cat }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const item_id = computed(() => {
  return props.id.split("_")[1]
})

const item_cat = computed(() => {
  return props.id.split("_")[0]
})
</script>

<style scoped></style>