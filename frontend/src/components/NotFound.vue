<template>
  <div>
    <div uk-alert style="border: 5px red solid" class="uk-margin-top">
      La page demandée n'existe pas: {{ $route.path }}
    </div>
  </div>
</template>

<script>

export default {
  name: "NotFound",
  data() {
    return {
    };
  },
};
</script>