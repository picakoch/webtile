<template>
  <div>
  </div>
</template>

<script>
import {IMAGE_Q} from '@/lib/queries'
import uk from "uikit"

export default {
  name: "TileImage",
  props: {
    id: {
      type: String
    }
  },
  data() {
    return {
      backend_url: process.env.VUE_APP_STRAPI_API_URL,
    }
  },
  computed: {},
  methods: {},
  apollo: {
    tileImage: {
      query: IMAGE_Q,
      variables() {
        return {
          id: this.id,
        }
      },
      result: function (res) {
        const images = res?.data?.tileImage?.data?.attributes?.images?.data.map((e) => {
          return {
            source: this.backend_url + e.attributes.formats.large.url,
            caption: 'aaa'
          }
        }) || []
        uk.lightboxPanel({items: images}).show();
      }
    }
  }
}
</script>


<style scoped>
</style>