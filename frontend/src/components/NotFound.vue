<template>
  <div>
    <div uk-alert style="border: 10px red solid">
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