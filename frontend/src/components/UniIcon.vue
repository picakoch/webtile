<template>
  <!-- Same markup as vue-unicons' <unicon>, which this replaces -->
  <div class="unicon">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :width="width"
      :height="height"
      viewBox="0 0 24 24"
      :fill="fill"
      v-html="icon"
    ></svg>
  </div>
</template>

<script>
import { ICONS } from "@/lib/icons";

export default {
  name: "UniIcon",
  props: {
    name: { type: String, default: "" },
    width: { type: [String, Number], default: 24 },
    height: { type: [String, Number], default: 24 },
    fill: { type: String, default: "inherit" },
  },
  computed: {
    icon() {
      return ICONS[this.name] || "";
    },
  },
};
</script>

<style>
.unicon {
  display: inline-block;
}
.unicon svg {
  transition: 0.2s all;
}
</style>
