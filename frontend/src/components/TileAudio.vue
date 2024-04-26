<template>
  <div>
  </div>
</template>

<script>
import {AUDIO_Q} from '@/lib/queries'
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
      query: AUDIO_Q,
      variables() {
        return {
          id: this.id,
        }
      },
      result: function (res) {
        const tracks = res?.data?.tileImage?.data?.attributes?.tracks?.data.map((e) => {
          return {
            source: this.backend_url + e.attributes.url,
            caption: 'aaa'
          }
        }) || []
        uk.lightboxPanel({items: tracks}).show();
      }
    }
  }
}
</script>


<style scoped>
</style>