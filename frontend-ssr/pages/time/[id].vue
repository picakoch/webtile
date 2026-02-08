<template>
  <div>
    <TileDetails :id="tileId"></TileDetails>
  </div>
</template>

<script setup>
import TileDetails from "../../components/TileDetails.vue";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const tileId = computed(() => `time_${props.id}`);
</script>
