<template>
  <MainPage name="media" :media="media" :q="q" @nav="onNav" />
</template>

<script setup>
import MainPage from "../../components/MainPage.vue";

const props = defineProps({
  media: {
    type: String,
    required: true,
  },
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
