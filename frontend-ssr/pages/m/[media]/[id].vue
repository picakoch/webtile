<template>
  <div>
    <TileDetails :id="tileId"></TileDetails>
  </div>
</template>

<script setup>
import TileDetails from "../../../components/TileDetails.vue";

const props = defineProps({
  media: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});

const tileId = computed(() => `${props.media}_${props.id}`);
</script>
