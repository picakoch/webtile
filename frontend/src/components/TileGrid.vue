<template>
  <div>
    GRID {{ $route }}
  </div>
</template>

<script>
import gql from "graphql-tag";

export default {
  name: "TileGrid",
  data() {
    return {
      config: null,
    };
  },
  apollo: {
    config: gql`
      query {
          config {
            data {
              attributes {
                title
              }
            }
          }
      }
    `,
  },
};
</script>