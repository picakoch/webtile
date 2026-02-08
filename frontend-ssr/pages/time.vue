<template>
  <MainPage name="time" :q="q" @nav="onNav" />
</template>

<script setup>
import MainPage from "../components/MainPage.vue";

const props = defineProps({
  q: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["nav"]);

const onNav = (keys) => {
  emit("nav", keys);
};
</script>
