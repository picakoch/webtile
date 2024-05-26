<template>
  <div>
    <div uk-alert style="border: 85px #ba0021 solid" class="uk-margin-top">
      La page demandée n'existe pas: {{ $route.path }}
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFound",
  data() {
    return {};
  },
};
</script>
