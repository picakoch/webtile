<template>
  <div>
    <TileDetails :id="tileId"></TileDetails>
  </div>
</template>

<script setup>
const props = defineProps({
  tag: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});

const tileId = computed(() => `tag_${props.id}`);
</script>
